import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/silk")({ component: SilkPainter });

const COLORS = ["#f472b6", "#c084fc", "#38bdf8", "#34d399", "#fbbf24", "#f87171"];
const SYMMETRIES = [4, 6, 8, 12] as const;

interface Stroke {
  x: number;
  y: number;
  px: number;
  py: number;
}

function SilkPainter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(COLORS[0]!);
  const [symmetry, setSymmetry] = useState<number>(6);
  const [width, setWidth] = useState(1.4);
  const drawing = useRef(false);
  const last = useRef<Stroke | null>(null);

  // size the canvas to its box once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#05060a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const line = (s: Stroke) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const angleStep = (Math.PI * 2) / symmetry;

    ctx.lineCap = "round";
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.75;

    for (let i = 0; i < symmetry; i++) {
      const rot = (dx: number, dy: number, mirror: boolean): [number, number] => {
        const a = angleStep * i;
        const m = mirror ? -1 : 1;
        const x0 = s.px - cx;
        const y0 = s.py - cy;
        const x1 = s.x - cx;
        const y1 = s.y - cy;
        return [
          cx + (x0 * Math.cos(a) - y0 * Math.sin(a) * m),
          cy + (x0 * Math.sin(a) + y0 * Math.cos(a) * m),
        ].concat() as unknown as [number, number];
      };
      void rot;
      // draw line + mirrored line at each rotation
      for (const mirror of [false, true] as const) {
        const a = angleStep * i;
        const m = mirror ? -1 : 1;
        const x0 = cx + (s.px - cx) * Math.cos(a) - (s.py - cy) * Math.sin(a) * m;
        const y0 = cy + (s.px - cx) * Math.sin(a) + (s.py - cy) * Math.cos(a) * m;
        const x1 = cx + (s.x - cx) * Math.cos(a) - (s.y - cy) * Math.sin(a) * m;
        const y1 = cy + (s.x - cx) * Math.sin(a) + (s.y - cy) * Math.cos(a) * m;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    last.current = { x: s.x, y: s.y, px: s.x, py: s.y };
  };

  const pos = (e: React.PointerEvent<HTMLCanvasElement>): Stroke => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = last.current ?? { x: e.clientX - rect.left, y: e.clientY - rect.top, px: e.clientX - rect.left, py: e.clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top, px: p.x, py: p.y };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#05060a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const a = document.createElement("a");
    a.download = "silk-art.png";
    a.href = url;
    a.click();
  };

  return (
    <AppShell title="Silk Painter" wide>
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎨 Silk Painter</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Draw glowing symmetric threads. Inspired by weavesilk.com — every scribble becomes art.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
              className={`size-7 rounded-full border-2 transition-transform ${color === c ? "scale-110 border-foreground" : "border-transparent"}`}
              style={{ background: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Symmetry</span>
          {SYMMETRIES.map((s) => (
            <button
              key={s}
              onClick={() => setSymmetry(s)}
              className={`rounded-md px-2 py-1 text-xs font-bold transition-colors ${
                symmetry === s ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-muted-foreground"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Size
          <input type="range" min={0.6} max={4} step={0.2} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-24 accent-primary" />
        </label>
        <div className="ml-auto flex gap-2">
          <button onClick={clear} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
            Clear
          </button>
          <button onClick={download} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
            Download PNG
          </button>
        </div>
      </div>

      <div className="relative mt-3 h-[58vh] max-h-[600px] touch-none overflow-hidden rounded-xl border border-border">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full cursor-crosshair"
          onPointerDown={(e) => {
            drawing.current = true;
            const rect = e.currentTarget.getBoundingClientRect();
            last.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, px: e.clientX - rect.left, py: e.clientY - rect.top };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            line(pos(e));
          }}
          onPointerUp={() => {
            drawing.current = false;
            last.current = null;
          }}
          onPointerLeave={() => {
            drawing.current = false;
            last.current = null;
          }}
        />
      </div>
    </AppShell>
  );
}
