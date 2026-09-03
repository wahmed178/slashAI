import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, CameraOff, Download, Plus, RefreshCw, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

import { AppShell } from "@/components/library/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/scanner")({
  head: () => ({
    meta: [
      { title: "Document Scanner — turn photos into clean scans | SlashAI" },
      {
        name: "description",
        content:
          "Scan documents with your camera or an uploaded photo. Enhance, black & white, multi-page, export as JPG or PDF — all in your browser.",
      },
    ],
  }),
  component: ScannerTool,
});

type EnhanceMode = "original" | "enhanced" | "bw" | "grayscale";

const MODES: { id: EnhanceMode; label: string; desc: string }[] = [
  { id: "original", label: "Original", desc: "No processing" },
  { id: "enhanced", label: "Enhanced", desc: "Contrast boost" },
  { id: "bw", label: "Black & white", desc: "Hard threshold" },
  { id: "grayscale", label: "Grayscale", desc: "Softer tones" },
];

const PAGES_KEY = "slashai-scanner-pages";
const MAX_PAGES = 20;
const MAX_EDGE = 1600;

interface Page {
  id: string;
  dataUrl: string;
}

function readPages(): Page[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PAGES_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Page[];
    return Array.isArray(arr)
      ? arr.filter((p): p is Page => Boolean(p && typeof p.id === "string" && typeof p.dataUrl === "string"))
      : [];
  } catch {
    return [];
  }
}

function writePages(pages: Page[]) {
  try {
    localStorage.setItem(PAGES_KEY, JSON.stringify(pages.slice(0, MAX_PAGES)));
  } catch {
    /* storage full — scanning session just won't persist */
  }
}

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image"));
    img.src = src;
  });
}

/** Downscale wide images so pages stay small enough to persist + export fast. */
async function toPageDataUrl(source: HTMLCanvasElement | HTMLImageElement | Blob, quality = 0.86): Promise<string> {
  const bmp =
    source instanceof Blob
      ? await createImageBitmap(source)
      : source instanceof HTMLCanvasElement
        ? null
        : null;
  let width: number;
  let height: number;
  let draw: CanvasImageSource;
  if (source instanceof Blob) {
    width = bmp!.width;
    height = bmp!.height;
    draw = bmp!;
  } else {
    width = (source as HTMLImageElement).naturalWidth || (source as HTMLCanvasElement).width;
    height = (source as HTMLImageElement).naturalHeight || (source as HTMLCanvasElement).height;
    draw = source;
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  canvas.getContext("2d")!.drawImage(draw, 0, 0, canvas.width, canvas.height);
  if (bmp) bmp.close();
  return canvas.toDataURL("image/jpeg", quality);
}

/** Pixel-level enhancement applied on export / preview. */
function processPixels(dataUrl: string, mode: Exclude<EnhanceMode, "original">): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i]!;
        const g = d[i + 1]!;
        const b = d[i + 2]!;
        let nr = r;
        let ng = g;
        let nb = b;
        if (mode === "bw") {
          const avg = (r + g + b) / 3;
          const val = avg > 128 ? 255 : 0;
          nr = ng = nb = val;
        } else if (mode === "grayscale") {
          const avg = 0.299 * r + 0.587 * g + 0.114 * b;
          nr = ng = nb = avg;
        } else {
          // enhanced — soft contrast + slight saturation push
          const factor = 1.35;
          nr = Math.min(255, Math.max(0, (r - 128) * factor + 128));
          ng = Math.min(255, Math.max(0, (g - 128) * factor + 128));
          nb = Math.min(255, Math.max(0, (b - 128) * factor + 128));
        }
        d[i] = nr;
        d[i + 1] = ng;
        d[i + 2] = nb;
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function ScannerTool() {
  const isMobile = useMemo(
    () => typeof window !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
    [],
  );
  const [pages, setPages] = useState<Page[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [mode, setMode] = useState<EnhanceMode>("enhanced");
  const [busy, setBusy] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = readPages();
    setPages(stored);
    setActiveId(stored[0]?.id ?? null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writePages(pages);
  }, [pages, hydrated]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera is not available on this device or browser — upload an image instead.");
      return;
    }
    setCameraError("");
    setBusy(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setCameraOn(true);
    } catch {
      setCameraError(
        "Camera permission was denied or no camera was found. You can still use the upload option below.",
      );
    } finally {
      setBusy(false);
    }
  };

  const capture = async () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    const dataUrl = await toPageDataUrl(canvas);
    const page = { id: uid(), dataUrl };
    setPages((prev) => {
      const next = [...prev, page];
      if (next.length > MAX_PAGES) next.shift();
      return next;
    });
    setActiveId(page.id);
  };

  const addFromFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast("Please choose an image file");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await toPageDataUrl(file);
      const page = { id: uid(), dataUrl };
      setPages((prev) => [...prev, page]);
      setActiveId(page.id);
    } catch {
      toast("Could not read that image");
    } finally {
      setBusy(false);
    }
  };

  const activePage = pages.find((p) => p.id === activeId) ?? null;

  // processed preview for the active page + chosen enhancement (async, effect-safe)
  const [previewUrl, setPreviewUrl] = useState<string>("");
  useEffect(() => {
    if (!activePage) {
      setPreviewUrl("");
      return;
    }
    if (mode === "original") {
      setPreviewUrl(activePage.dataUrl);
      return;
    }
    let cancelled = false;
    void processPixels(activePage.dataUrl, mode).then((url) => {
      if (!cancelled) setPreviewUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [activePage, mode]);

  const downloadPage = async (page: Page) => {
    setBusy(true);
    try {
      const finalUrl = mode === "original" ? page.dataUrl : await processPixels(page.dataUrl, mode);
      const a = document.createElement("a");
      a.href = finalUrl;
      a.download = `scan-${page.id}.jpg`;
      a.click();
    } finally {
      setBusy(false);
    }
  };

  const downloadPdf = async () => {
    if (pages.length === 0) return;
    setBusy(true);
    try {
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const w = 210;
      const h = 297;
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]!;
        const url = mode === "original" ? page.dataUrl : await processPixels(page.dataUrl, mode);
        const img = await loadImage(url);
        const ratio = Math.min(w / img.width, h / img.height);
        const dw = img.width * ratio;
        const dh = img.height * ratio;
        if (i > 0) pdf.addPage();
        pdf.addImage(url, "JPEG", (w - dw) / 2, (h - dh) / 2, dw, dh);
      }
      pdf.save("scanned-document.pdf");
      toast("PDF downloaded");
    } catch {
      toast("Could not create the PDF");
    } finally {
      setBusy(false);
    }
  };

  const movePage = (i: number, dir: -1 | 1) => {
    setPages((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
  };

  const deletePage = (id: string) => {
    setPages((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  };

  return (
    <AppShell title="Document Scanner" back={{ to: "/tools", label: "SlashKits" }}>
      <header className="flex items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            📷 Document Scanner
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Capture, enhance and export clean document scans — everything stays on your device.
          </p>
        </div>
      </header>

      {!isMobile && (
        <div className="mt-4 rounded-xl border border-[rgba(251,191,36,0.3)] bg-[rgba(251,191,36,0.08)] p-3 text-[13px] leading-relaxed text-muted-foreground">
          💡 This tool works best on <strong className="text-foreground">mobile</strong>, where you can use
          your camera. On desktop, <strong className="text-foreground">upload an image</strong> below instead.
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* main viewport */}
        <div className="min-w-0">
          <div className="panel relative overflow-hidden rounded-xl">
            {cameraOn ? (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="aspect-[3/4] w-full bg-black object-cover sm:aspect-[4/3]"
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-3 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-[13px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/25"
                  >
                    <CameraOff className="size-4" /> Stop
                  </button>
                  <button
                    type="button"
                    onClick={() => void capture()}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[13px] font-bold text-background transition-opacity hover:opacity-90"
                  >
                    <Camera className="size-4" /> Capture
                  </button>
                </div>
              </>
            ) : activePage ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Scan preview"
                  className="max-h-[520px] w-full object-contain bg-black/40"
                />
                <span className="absolute top-2 left-2 rounded-md bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur">
                  Page {pages.findIndex((p) => p.id === activePage.id) + 1} / {pages.length}
                </span>
              </div>
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center bg-surface-elevated/40 p-6 text-center">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-surface text-3xl">
                  📄
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">No page yet</p>
                <p className="mt-1 max-w-[260px] text-[13px] text-muted-foreground">
                  Open the camera or upload a photo of a document to start scanning.
                </p>
              </div>
            )}

            {cameraError && !cameraOn && (
              <p className="border-t border-border bg-[rgba(248,81,73,0.08)] p-2.5 text-[12px] text-red-300">
                {cameraError}
              </p>
            )}

            {pages.length > 0 && activePage && (
              <div className="flex flex-wrap items-center gap-1.5 border-t border-border bg-surface p-2.5">
                <span className="px-1 text-[11px] font-semibold text-muted-foreground">Enhance</span>
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    title={m.desc}
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors",
                      mode === m.id
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-border bg-surface-elevated text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* actions */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {!cameraOn && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void startCamera()}
                className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/50 disabled:opacity-50"
              >
                <Camera className="size-4 text-primary" /> Open camera
              </button>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/50 disabled:opacity-50"
            >
              <Upload className="size-4 text-primary" /> Upload image
            </button>
            <button
              type="button"
              disabled={busy || !activePage}
              onClick={() => activePage && void downloadPage(activePage)}
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-[13px] font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Download className="size-4" /> Save JPG
            </button>
            <button
              type="button"
              disabled={busy || pages.length === 0}
              onClick={() => void downloadPdf()}
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/50 disabled:opacity-40"
            >
              📕 PDF ({pages.length})
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void addFromFile(f);
                e.currentTarget.value = "";
              }}
            />
          </div>
        </div>

        {/* pages rail */}
        <aside className="min-w-0">
          <div className="panel rounded-xl p-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
                Pages ({pages.length})
              </h2>
              <span className="text-[11px] text-muted-foreground">
                {pages.length >= MAX_PAGES ? "Limit reached" : "drag to reorder"}
              </span>
            </div>

            {pages.length === 0 ? (
              <p className="mt-3 rounded-lg border border-dashed border-border p-4 text-center text-[12px] leading-relaxed text-muted-foreground">
                Captured and uploaded pages appear here as a multi-page document.
              </p>
            ) : (
              <ul className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
                {pages.map((p, i) => (
                  <li
                    key={p.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", String(i));
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const from = Number(e.dataTransfer.getData("text/plain"));
                      if (Number.isNaN(from) || from === i) return;
                      setPages((prev) => {
                        const next = [...prev];
                        const [moved] = next.splice(from, 1);
                        if (!moved) return prev;
                        next.splice(i, 0, moved);
                        return next;
                      });
                    }}
                    className={cn(
                      "group relative shrink-0 cursor-grab rounded-lg border-2 transition-colors active:cursor-grabbing",
                      p.id === activeId ? "border-primary" : "border-border hover:border-primary/40",
                    )}
                  >
                    <img src={p.dataUrl} alt={`Page ${i + 1}`} className="h-16 w-16 rounded object-cover lg:h-14 lg:w-full" />
                    <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1 font-mono text-[9px] text-white">
                      {i + 1}
                    </span>
                    <button
                      type="button"
                      aria-label={`Delete page ${i + 1}`}
                      onClick={() => deletePage(p.id)}
                      className="absolute top-0.5 right-0.5 hidden rounded bg-black/60 p-0.5 text-white group-hover:block"
                    >
                      <X className="size-3" />
                    </button>
                    <div className="absolute top-1/2 right-0.5 hidden -translate-y-1/2 flex-col gap-0.5 lg:group-hover:flex">
                      <button
                        type="button"
                        aria-label="Move up"
                        disabled={i === 0}
                        onClick={() => movePage(i, -1)}
                        className="rounded bg-black/60 p-0.5 text-white disabled:opacity-30"
                      >
                        <RefreshCw className="size-3 rotate-180" />
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        disabled={i === pages.length - 1}
                        onClick={() => movePage(i, 1)}
                        className="rounded bg-black/60 p-0.5 text-white disabled:opacity-30"
                      >
                        <RefreshCw className="size-3" />
                      </button>
                    </div>
                  </li>
                ))}
                {pages.length < MAX_PAGES && (
                  <li>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary lg:h-14 lg:w-full"
                    >
                      <Plus className="size-4" />
                      <span className="text-[9px]">Add page</span>
                    </button>
                  </li>
                )}
              </ul>
            )}

            {pages.length > 1 && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPages([]);
                    setActiveId(null);
                    toast("All pages cleared");
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-red-400/50 hover:text-red-400"
                >
                  <Trash2 className="size-3.5" /> Clear all
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 rounded-xl border border-border bg-surface p-3">
            <h3 className="text-[12px] font-semibold text-foreground">Scanning tips</h3>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[12px] leading-relaxed text-muted-foreground">
              <li>Keep the document flat and well lit.</li>
              <li>Fill the frame — edges of the paper cropped out look best.</li>
              <li>“Black & white” works great for text-heavy pages.</li>
            </ul>
          </div>

          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Pages are saved on this device only.{" "}
            <Link to="/tools" className="text-primary hover:underline">
              More tools →
            </Link>
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
