import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/social-resize")({ component: SocialResize });

interface Preset {
  key: string;
  label: string;
  w: number;
  h: number;
  platform: string;
}

const PRESETS: Preset[] = [
  { key: "ig-post", label: "Post 1080×1080", w: 1080, h: 1080, platform: "Instagram / Facebook" },
  { key: "ig-portrait", label: "Portrait 1080×1350", w: 1080, h: 1350, platform: "Instagram feed (max reach)" },
  { key: "ig-story", label: "Story 1080×1920", w: 1080, h: 1920, platform: "Stories / Reels cover" },
  { key: "yt-thumb", label: "Thumbnail 1280×720", w: 1280, h: 720, platform: "YouTube thumbnail" },
  { key: "li-banner", label: "Banner 1200×627", w: 1200, h: 627, platform: "LinkedIn / link preview" },
  { key: "x-post", label: "Wide 1600×900", w: 1600, h: 900, platform: "X / Twitter 16:9" },
  { key: "wa-dp", label: "DP 640×640", w: 640, h: 640, platform: "WhatsApp profile" },
];

function SocialResize() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [preset, setPreset] = useState<Preset>(PRESETS[1]!);
  const [mode, setMode] = useState<"cover" | "contain">("cover");
  const [bg, setBg] = useState("#0a0a0a");
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const [quality, setQuality] = useState(0.92);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const load = (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const render = () => {
    if (!img || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    canvas.width = preset.w;
    canvas.height = preset.h;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, preset.w, preset.h);
    const scale =
      mode === "cover"
        ? Math.max(preset.w / img.width, preset.h / img.height)
        : Math.min(preset.w / img.width, preset.h / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, (preset.w - w) / 2, (preset.h - h) / 2, w, h);
    return canvas;
  };

  const download = () => {
    const canvas = render();
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName || "image"}-${preset.w}x${preset.h}.${format === "png" ? "png" : "jpg"}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      format === "png" ? "image/png" : "image/jpeg",
      quality,
    );
  };

  return (
    <AppShell title="Social Media Image Resizer">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📱 Social Media Image Resizer</h1>
        <p className="mt-1 text-sm text-muted-foreground">One image, every platform. Crop to fill or fit with padding — all offline in your browser.</p>
      </header>

      <div className="mx-auto max-w-3xl space-y-4">
        {!img ? (
          <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-border bg-surface p-10 text-center hover:border-primary/50">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { load(e.target.files?.[0]); e.target.value = ""; }} />
            <div className="text-4xl">🖼️</div>
            <div className="mt-2 font-semibold text-foreground">Choose an image</div>
            <div className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP — never uploaded anywhere</div>
          </label>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <canvas ref={canvasRef} className="mx-auto block max-h-[420px] w-auto max-w-full" />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPreset(p)}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    preset.key === p.key ? "border-primary bg-primary/10" : "border-border bg-surface hover:border-primary/40"
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">{p.label}</div>
                  <div className="text-xs text-muted-foreground">{p.platform}</div>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3">
              <div className="flex overflow-hidden rounded-lg border border-border">
                <button onClick={() => setMode("cover")} className={`px-3 py-1.5 text-xs ${mode === "cover" ? "bg-primary text-background" : "text-muted-foreground"}`}>Crop to fill</button>
                <button onClick={() => setMode("contain")} className={`px-3 py-1.5 text-xs ${mode === "contain" ? "bg-primary text-background" : "text-muted-foreground"}`}>Fit + padding</button>
              </div>
              {mode === "contain" && (
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Padding colour
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="size-8 cursor-pointer rounded border border-border" />
                </label>
              )}
              <div className="flex overflow-hidden rounded-lg border border-border">
                <button onClick={() => setFormat("jpeg")} className={`px-3 py-1.5 text-xs ${format === "jpeg" ? "bg-primary text-background" : "text-muted-foreground"}`}>JPG</button>
                <button onClick={() => setFormat("png")} className={`px-3 py-1.5 text-xs ${format === "png" ? "bg-primary text-background" : "text-muted-foreground"}`}>PNG</button>
              </div>
              {format === "jpeg" && (
                <label className="flex flex-1 items-center gap-2 text-xs text-muted-foreground">
                  Quality {Math.round(quality * 100)}%
                  <input type="range" min={50} max={100} value={quality * 100} onChange={(e) => setQuality(Number(e.target.value) / 100)} className="min-w-24 flex-1 accent-primary" />
                </label>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={download} className="h-12 flex-1 rounded-xl bg-primary font-semibold text-background">Download {preset.w}×{preset.h}</button>
              <button onClick={() => setImg(null)} className="h-12 rounded-xl border border-border px-4 text-sm text-muted-foreground">New image</button>
            </div>
          </>
        )}

        <FaqSection />
      </div>
    </AppShell>
  );
}
