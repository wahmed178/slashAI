import { useCallback, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Download, RotateCcw } from "lucide-react";

type Format = "image/jpeg" | "image/png" | "image/webp";
const FORMATS: { label: string; mime: Format }[] = [
  { label: "JPG", mime: "image/jpeg" },
  { label: "PNG", mime: "image/png" },
  { label: "WebP", mime: "image/webp" },
];
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export const Route = createFileRoute("/tools/image-convert")({
  head: () => ({ meta: [{ title: "Image Converter \u2014 SlashAI" }] }),
  component: ImageConvert,
});

function ImageConvert() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [format, setFormat] = useState<Format>("image/png");
  const [quality, setQuality] = useState(90);
  const [result, setResult] = useState<string>("");
  const [origSize, setOrigSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = useCallback((f: File, fmt: Format, q: number) => {
    setOrigSize(f.size);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) { setNewSize(blob.size); setResult(URL.createObjectURL(blob)); }
      }, fmt, q / 100);
    };
    const url = URL.createObjectURL(f);
    setPreview(url);
    img.src = url;
  }, []);

  const handleFile = (f: File) => {
    setFile(f);
    convert(f, format, quality);
  };

  const download = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = file.name.replace(/\.[^.]+$/, `.${EXT[format]}`);
    a.click();
  };

  return (
    <AppShell title="Image Converter" back={{ to: "/tools", label: "SlashKit" }}>
      {!file ? (
        <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          className="mt-4 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-8 text-center transition-colors hover:border-primary/50">
          <span className="text-4xl">{"\u{1F504}"}</span>
          <p className="mt-3 text-sm text-foreground">Drag image here or click to upload</p>
          <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP</p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            {FORMATS.map((f) => (
              <button key={f.mime} type="button" onClick={() => { setFormat(f.mime); if (file) convert(file, f.mime, quality); }}
                className="min-h-[40px] flex-1 rounded-lg border px-3 text-sm font-medium transition-colors"
                style={{ background: format === f.mime ? "#58a6ff" : "#21262d", borderColor: format === f.mime ? "transparent" : "#30363d", color: format === f.mime ? "#0d1117" : "#8b949e" }}>
                {f.label}
              </button>
            ))}
          </div>
          {(format === "image/jpeg" || format === "image/webp") && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <label className="flex items-center justify-between text-sm text-foreground"><span>Quality</span><span className="font-mono text-primary">{quality}%</span></label>
              <input type="range" min={10} max={100} value={quality}
                onChange={(e) => { const q = Number(e.target.value); setQuality(q); if (file) convert(file, format, q); }}
                className="mt-2 w-full accent-[#58a6ff]" />
            </div>
          )}
          {result && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-surface p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Original</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{(origSize / 1024).toFixed(0)} KB</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Converted</p>
                  <p className="mt-1 text-sm font-medium text-green">{(newSize / 1024).toFixed(0)} KB</p>
                </div>
              </div>
              <button type="button" onClick={download} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Download className="size-4" /> Download as {(EXT[format] ?? 'img').toUpperCase()}
              </button>
              <button type="button" onClick={() => { setFile(null); setResult(""); }} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm text-foreground hover:text-primary">
                <RotateCcw className="size-4" /> Convert another
              </button>
            </>
          )}
        </div>
      )}
    </AppShell>
  );
}
