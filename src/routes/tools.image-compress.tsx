import { useCallback, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Download, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/tools/image-compress")({
  head: () => ({ meta: [{ title: "Image Compressor — SlashAI" }] }),
  component: ImageCompress,
});

function ImageCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [compressed, setCompressed] = useState<string>("");
  const [origSize, setOrigSize] = useState(0);
  const [compSize, setCompSize] = useState(0);
  const [quality, setQuality] = useState(70);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const compress = useCallback((f: File, q: number) => {
    setLoading(true);
    const img = new Image();
    img.onload = () => {
      setOrigSize(f.size);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setCompSize(blob.size);
          setCompressed(URL.createObjectURL(blob));
        }
        setLoading(false);
      }, "image/jpeg", q / 100);
    };
    const url = URL.createObjectURL(f);
    setPreview(url);
    img.src = url;
  }, []);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) return alert("Max 10MB");
    setFile(f);
    compress(f, quality);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const download = () => {
    if (!compressed || !file) return;
    const a = document.createElement("a");
    a.href = compressed;
    a.download = file.name.replace(/\.[^.]+$/, "-compressed.jpg");
    a.click();
  };

  const reset = () => {
    setFile(null); setPreview(""); setCompressed(""); setOrigSize(0); setCompSize(0);
  };

  const pct = origSize > 0 ? Math.round((1 - compSize / origSize) * 100) : 0;

  return (
    <AppShell title="Image Compressor" back={{ to: "/tools", label: "SlashKit" }}>
      <canvas ref={canvasRef} className="hidden" />
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="mt-4 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-8 text-center transition-colors hover:border-primary/50"
        >
          <span className="text-4xl">{"\u{1F5BC}\u{FE0F}"}</span>
          <p className="mt-3 text-sm text-foreground">Drag image here or click to upload</p>
          <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP, GIF \u2022 Max 10MB</p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Quality slider */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <label className="flex items-center justify-between text-sm text-foreground">
              <span>Quality</span>
              <span className="font-mono text-primary">{quality}%</span>
            </label>
            <input
              type="range" min={10} max={100} value={quality}
              onChange={(e) => {
                const q = Number(e.target.value);
                setQuality(q);
                if (file) compress(file, q);
              }}
              className="mt-2 w-full accent-[#58a6ff]"
            />
          </div>

          {/* Preview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-surface p-3">
              <p className="text-[11px] text-muted-foreground">Original</p>
              <img src={preview} alt="Original" className="mt-2 max-h-48 w-full rounded-lg object-contain" />
              <p className="mt-2 text-center text-xs text-muted-foreground">{(origSize / 1024).toFixed(0)} KB</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-3">
              <p className="text-[11px] text-muted-foreground">Compressed</p>
              <img src={compressed || preview} alt="Compressed" className="mt-2 max-h-48 w-full rounded-lg object-contain" />
              <p className="mt-2 text-center text-xs text-muted-foreground">{(compSize / 1024).toFixed(0)} KB</p>
            </div>
          </div>

          {pct > 0 && (
            <p className="text-center text-sm font-medium text-green">{pct}% smaller</p>
          )}

          <button type="button" onClick={download} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Download className="size-4" /> Download compressed image
          </button>
          <button type="button" onClick={reset} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:text-primary">
            <RotateCcw className="size-4" /> Compress another
          </button>
        </div>
      )}
    </AppShell>
  );
}
