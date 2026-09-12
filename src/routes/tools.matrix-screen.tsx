import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/matrix-screen")({ component: MatrixRain });

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [full, setFull] = useStateSafe(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let cols = 0;
    let drops: number[] = [];
    const fontSize = 16;
    const chars = "アカサタナハマヤラワ0123456789ABCDEFXYZ$+-*/=".split("");

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      cols = Math.floor(canvas.width / (fontSize * devicePixelRatio));
      drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -100));
    };
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 50) return;
      last = t;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = "rgba(13, 17, 23, 0.12)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize * devicePixelRatio}px monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)]!;
        const x = i * fontSize * devicePixelRatio;
        const y = drops[i]! * fontSize * devicePixelRatio;
        ctx.fillStyle = Math.random() > 0.975 ? "#e6edf3" : "#22c55e";
        ctx.fillText(ch, x, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]!++;
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [full]);

  return (
    <div className={full ? "fixed inset-0 z-[999] bg-[#0d1117]" : ""}>
      <AppShell title="Matrix Rain">
        <header className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">🟩 Matrix Rain</h1>
          <p className="mt-1 text-sm text-muted-foreground">Digital rain screensaver - fullscreen friendly.</p>
        </header>
        <div className="space-y-3">
          <canvas
            ref={canvasRef}
            className="h-[70vh] w-full rounded-xl border border-border bg-[#0d1117]"
          />
          <button
            onClick={() => setFull(true)}
            className="h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
          >
            ⛶ Fullscreen
          </button>
        </div>
      </AppShell>
      {full && (
        <button
          onClick={() => setFull(false)}
          className="absolute right-4 top-4 z-[1000] rounded-lg border border-white/20 bg-black/50 px-4 py-2 text-sm font-semibold text-white"
        >
          ✕ Exit
        </button>
      )}
    </div>
  );
}

/** tiny local helper: state + Escape-to-exit for fullscreen */
function useStateSafe(initial: boolean): [boolean, (v: boolean) => void] {
  const [v, setV] = useState(initial);
  useEffect(() => {
    if (!v) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setV(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [v]);
  return [v, setV];
}
