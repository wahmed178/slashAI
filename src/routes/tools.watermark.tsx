import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/watermark")({ component: WatermarkMaker });

function WatermarkMaker() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState("@SlashAI");
  const [opacity, setOpacity] = useState(60);
  const [size, setSize] = useState(4);
  const [pos, setPos] = useState<"br" | "bl" | "tr" | "tl" | "center">("br");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = () => {
    const c = canvasRef.current;
    if (!c || !img) return;
    const maxW = 1000;
    const scale = Math.min(1, maxW / img.width);
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0, c.width, c.height);
    const fontSize = Math.max(14, (c.width * size) / 100);
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    const m = ctx.measureText(text);
    const pad = fontSize * 0.4;
    let x = c.width - m.width - pad * 2;
    let y = c.height - pad * 2.2;
    if (pos === "bl") { x = pad * 1.5; y = c.height - pad * 2.2; }
    if (pos === "tr") { x = c.width - m.width - pad * 2; y = pad * 2; }
    if (pos === "tl") { x = pad * 1.5; y = pad * 2; }
    if (pos === "center") {
      x = (c.width - m.width) / 2;
      y = c.height / 2;
    }
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(x - pad / 2, y - fontSize, m.width + pad, fontSize + pad);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1;
  };

  useEffect(() => {
    render();
  }, [img, text, opacity, size, pos]);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const download = () => {
    const a = document.createElement("a");
    a.download = "watermarked.png";
    a.href = canvasRef.current!.toDataURL("image/png");
    a.click();
  };

  return (
    <AppShell title="Watermark Maker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">💧 Watermark Maker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add text watermarks to images - everything stays in your browser.</p>
      </header>
      <div className="mx-auto max-w-2xl space-y-4">
        <label className="grid h-24 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-primary">
          {img ? "✅ Image loaded - pick another" : "📁 Choose an image (JPG/PNG)"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {img && (
          <>
            <canvas ref={canvasRef} className="w-full rounded-xl border border-border" />
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Watermark text"
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] text-muted-foreground">Size: {size}% of width</label>
                <input type="range" min={2} max={12} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-muted-foreground">Opacity: {opacity}%</label>
                <input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-primary" />
              </div>
            </div>
            <div className="flex gap-2">
              {([
                ["tl", "↖"], ["tr", "↗"], ["center", "⏺"], ["bl", "↙"], ["br", "↘"],
              ] as const).map(([p, icon]) => (
                <button
                  key={p}
                  onClick={() => setPos(p)}
                  className={`h-10 flex-1 rounded-lg text-sm ${pos === p ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-muted-foreground"}`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <button onClick={download} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              ⬇ Download watermarked image
            </button>
          </>
        )}
      </div>
    </AppShell>
  );
}
