import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/signature-maker")({ component: SignatureMaker });

function SignatureMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#e6edf3");
  const [width, setWidth] = useState(3);
  const [hasInk, setHasInk] = useState(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * c.width,
      y: ((e.clientY - r.top) / r.height) * c.height,
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrawing(true);
    last.current = pos(e);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = width * 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current!.x, last.current!.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    setHasInk(true);
  };

  const stop = () => {
    setDrawing(false);
    last.current = null;
  };

  const clear = () => {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setHasInk(false);
  };

  const download = () => {
    const c = canvasRef.current!;
    // render onto a transparent canvas with ink only
    const out = document.createElement("canvas");
    out.width = c.width;
    out.height = c.height;
    const octx = out.getContext("2d")!;
    octx.drawImage(c, 0, 0);
    const a = document.createElement("a");
    a.download = "signature.png";
    a.href = out.toDataURL("image/png");
    a.click();
  };

  return (
    <AppShell title="Signature Maker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">✒️ Signature Maker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Draw your signature, download as transparent PNG.</p>
      </header>
      <div className="mx-auto max-w-xl space-y-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={stop}
            onPointerLeave={stop}
            className="h-[240px] w-full touch-none rounded-xl border-2 border-dashed border-border bg-surface"
          />
          {!hasInk && (
            <p className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
              ✍️ Draw here with mouse, finger or stylus
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5">
            {["#e6edf3", "#0f172a", "#1d4ed8", "#b91c1c"].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`size-8 rounded-full border-2 transition-transform ${color === c ? "scale-110 border-primary" : "border-border"}`}
                style={{ background: c }}
                aria-label={`Colour ${c}`}
              />
            ))}
          </div>
          <div className="flex flex-1 items-center gap-2">
            <span className="text-[11px] text-muted-foreground">Stroke</span>
            <input type="range" min={1} max={8} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="flex-1 accent-primary" />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={download}
            disabled={!hasInk}
            className="h-11 flex-1 rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-40"
          >
            ⬇ Download PNG
          </button>
          <button onClick={clear} className="h-11 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            Clear
          </button>
        </div>
      </div>
    </AppShell>
  );
}
