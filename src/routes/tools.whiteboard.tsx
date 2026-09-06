import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Download, Eraser, Pencil, Trash2, Undo2 } from "lucide-react";

export const Route = createFileRoute("/tools/whiteboard")({ component: Whiteboard });

const COLORS = ["#2dd4bf", "#f87171", "#60a5fa", "#fbbf24", "#a78bfa", "#34d399", "#f472b6", "#e5e7eb"];
const SIZES = [2, 4, 8, 14];

function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState<string>(COLORS[0] ?? "#2dd4bf");
  const [size, setSize] = useState<number>(SIZES[1] ?? 4);
  const [erasing, setErasing] = useState(false);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const snapshot = canvas.toDataURL();
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0);
        else clearCanvas();
      };
      img.onerror = clearCanvas;
      img.src = snapshot;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [clearCanvas]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const stroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = erasing ? "#0a0a0f" : color;
    ctx.lineWidth = erasing ? size * 4 : size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const p = pos(e);
    stroke(last.current, p);
    last.current = p;
  };

  const onPointerUp = () => {
    drawing.current = false;
    last.current = null;
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Simple fade-back: paint over with background. Full undo history is overkill here.
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "whiteboard.png";
    a.click();
  };

  return (
    <AppShell title="Whiteboard">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🖊️ Whiteboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sketch ideas on an infinite-energy canvas. Nothing uploads, stays in your browser.</p>
      </header>

      <div className="mx-auto max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-2.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              onClick={() => { setColor(c); setErasing(false); }}
              className={`size-7 rounded-full border-2 transition-transform ${color === c && !erasing ? "scale-110 border-foreground" : "border-transparent"}`}
              style={{ backgroundColor: c }}
            />
          ))}
          <span className="mx-1 h-6 w-px bg-border" />
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              aria-label={`Brush size ${s}`}
              onClick={() => setSize(s)}
              className={`flex size-7 items-center justify-center rounded-md ${size === s ? "bg-surface-elevated ring-1 ring-primary" : ""}`}
            >
              <span className="rounded-full bg-foreground" style={{ width: s + 2, height: s + 2 }} />
            </button>
          ))}
          <span className="mx-1 h-6 w-px bg-border" />
          <button
            type="button"
            onClick={() => setErasing(!erasing)}
            className={`flex min-h-[34px] items-center gap-1.5 rounded-md border border-border px-2.5 text-[12.5px] font-medium transition-colors ${erasing ? "bg-primary text-background" : "text-foreground hover:text-primary"}`}
          >
            {erasing ? <Pencil className="size-4" /> : <Eraser className="size-4" />}
            {erasing ? "Draw" : "Erase"}
          </button>
          <button type="button" onClick={undo} className="flex min-h-[34px] items-center gap-1.5 rounded-md border border-border px-2.5 text-[12.5px] font-medium text-foreground transition-colors hover:text-primary">
            <Undo2 className="size-4" /> Clear strokes
          </button>
          <button type="button" onClick={clearCanvas} className="flex min-h-[34px] items-center gap-1.5 rounded-md border border-border px-2.5 text-[12.5px] font-medium text-foreground transition-colors hover:text-red">
            <Trash2 className="size-4" /> Reset
          </button>
          <button type="button" onClick={download} className="ml-auto flex min-h-[34px] items-center gap-1.5 rounded-md bg-primary px-3 text-[12.5px] font-semibold text-background transition-colors hover:bg-primary/90">
            <Download className="size-4" /> PNG
          </button>
        </div>

        <canvas
          ref={canvasRef}
          className="h-[60vh] w-full touch-none rounded-xl border border-border bg-[#0a0a0f]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        <p className="text-center text-[11px] text-muted-foreground">Tip: works with touch, mouse and stylus.</p>
      </div>
    </AppShell>
  );
}
