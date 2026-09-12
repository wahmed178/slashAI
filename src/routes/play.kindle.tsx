import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/kindle")({ component: Kindle });

interface Star {
  x: number;
  y: number;
  life: number;
  hue: number;
}

/** Everlasting lightbulb - Wardley. Draw, evolve, share. */
function Kindle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const [count, setCount] = useState(0);
  const [kindled, setKindled] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = "rgba(13, 17, 23, 0.08)";
      ctx.fillRect(0, 0, w, h);
      for (const s of stars.current) {
        s.life += 0.02;
        const alpha = Math.max(0, 1 - s.life);
        if (alpha <= 0) continue;
        const size = 3 + s.life * 8;
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, size * 3);
        grad.addColorStop(0, `hsla(${s.hue}, 90%, 70%, ${alpha})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, size * 3, 0, Math.PI * 2);
        ctx.fill();
        s.x += Math.sin(s.life * 4) * 0.4;
        s.y -= 0.5;
      }
      stars.current = stars.current.filter((s) => s.life < 1);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const spark = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const burst = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < burst; i++) {
      stars.current.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        life: 0,
        hue: 30 + Math.random() * 40, // warm flame hues
      });
    }
    if (!kindled) setKindled(true);
    setCount((n) => n + burst);
  };

  return (
    <AppShell title="Kindle">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🕯️ Kindle</h1>
        <p className="mt-1 text-sm text-muted-foreground">Drag anywhere to spark embers. A tiny zen fireplace.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-3">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onPointerDown={spark}
          onPointerMove={(e) => {
            if (e.buttons > 0) spark(e);
          }}
          className="h-[55vh] w-full touch-none rounded-xl border border-border bg-[#0d1117] cursor-crosshair"
        />
        <div className="flex items-center justify-between text-[12px] text-muted-foreground">
          <span>{kindled ? `🔥 ${count} embers kindled` : "The canvas is cold. Start a fire."}</span>
          <button
            onClick={() => {
              stars.current = [];
              setCount(0);
            }}
            className="rounded-lg border border-border px-3 py-1 font-semibold hover:text-foreground"
          >
            Let it die out
          </button>
        </div>
      </div>
    </AppShell>
  );
}
