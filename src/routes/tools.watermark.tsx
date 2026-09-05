import { useState, useRef, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/watermark")({
  component: WatermarkTool,
});

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "tile";

function WatermarkTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState(`© ${new Date().getFullYear()} SlashAI`);
  const [position, setPosition] = useState<Position>("bottom-right");
  const [opacity, setOpacity] = useState(50);
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState("#ffffff");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    ctx.globalAlpha = opacity / 100;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textBaseline = "top";

    const metrics = ctx.measureText(text);
    const tw = metrics.width;
    const th = fontSize;

    const pad = 20;

    if (position === "tile") {
      ctx.globalAlpha = opacity / 200;
      for (let y = 0; y < canvas.height; y += th + 60) {
        for (let x = 0; x < canvas.width; x += tw + 80) {
          ctx.save();
          ctx.translate(x + tw / 2, y + th / 2);
          ctx.rotate(-Math.PI / 6);
          ctx.fillText(text, -tw / 2, -th / 2);
          ctx.restore();
        }
      }
    } else {
      const positions: Record<string, [number, number]> = {
        "top-left": [pad, pad],
        "top-right": [canvas.width - tw - pad, pad],
        "bottom-left": [pad, canvas.height - th - pad],
        "bottom-right": [canvas.width - tw - pad, canvas.height - th - pad],
        "center": [(canvas.width - tw) / 2, (canvas.height - th) / 2],
      };
      const pos = positions[position] || positions["bottom-right"];
      if (pos) ctx.fillText(text, pos[0], pos[1]);
    }

    ctx.globalAlpha = 1;
  }, [image, text, position, opacity, fontSize, color]);

  useEffect(() => { draw(); }, [draw]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "watermarked-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <AppShell title="Watermark Tool">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🖼️ Image Watermark Tool</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add text watermarks to images. 100% browser-based — nothing uploaded.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleFile}
              className="w-full rounded-lg border border-border bg-surface p-2 text-sm text-foreground" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Watermark Text</label>
            <input value={text} onChange={e => setText(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary/60 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Position</label>
            <div className="grid grid-cols-3 gap-1">
              {(["top-left", "top-right", "center", "bottom-left", "bottom-right", "tile"] as Position[]).map(p => (
                <button key={p} type="button" onClick={() => setPosition(p)}
                  className={`rounded-lg border px-2 py-1 text-[10px] transition-colors ${position === p ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {p === "tile" ? "Tiled" : p.split("-").map(w => (w[0] ?? "").toUpperCase()).join("")}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Opacity: {opacity}%</label>
            <input type="range" min={10} max={100} value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Font Size: {fontSize}px</label>
            <input type="range" min={8} max={72} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Color</label>
            <div className="flex gap-2">
              {["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00"].map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`size-7 rounded-full border-2 ${color === c ? "border-primary" : "border-border"}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>
          <button type="button" onClick={handleDownload} disabled={!image}
            className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40">
            Download Watermarked Image
          </button>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center rounded-xl border border-border bg-surface p-4 min-h-[300px]">
          {image ? (
            <canvas ref={canvasRef} className="max-h-[500px] w-full object-contain" />
          ) : (
            <div className="text-center">
              <p className="text-4xl">🖼️</p>
              <p className="mt-2 text-sm text-muted-foreground">Upload an image to start</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
