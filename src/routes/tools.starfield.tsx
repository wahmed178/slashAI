import { useRef, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/starfield")({
  head: () => ({ meta: [{ title: "Starfield — SlashAI" }] }),
  component: Starfield,
});

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    interface Star { x: number; y: number; z: number; }
    const stars: Star[] = Array.from({ length: 300 }, () => ({
      x: (Math.random() - 0.5) * canvas.width * 2,
      y: (Math.random() - 0.5) * canvas.height * 2,
      z: Math.random() * 1000,
    }));

    let speed = 5;
    let animId: number;
    const draw = () => {
      ctx.fillStyle = "rgba(13,17,23,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.z -= speed;
        if (star.z <= 0) { star.x = (Math.random() - 0.5) * canvas.width * 2; star.y = (Math.random() - 0.5) * canvas.height * 2; star.z = 1000; }
        const sx = (star.x / star.z) * 300 + cx;
        const sy = (star.y / star.z) * 300 + cy;
        const size = Math.max(0.5, (1 - star.z / 1000) * 3);
        ctx.globalAlpha = 1 - star.z / 1000;
        ctx.fillStyle = "#e6edf3";
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      });

      speed = Math.min(speed + 0.01, 20);
      animId = requestAnimationFrame(draw);
    };
    draw();

    const clickHandler = () => { speed = 2; };
    canvas.addEventListener("click", clickHandler);
    return () => { cancelAnimationFrame(animId); canvas.removeEventListener("click", clickHandler); };
  }, []);

  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#0d1117" }}>
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <p className="text-6xl sm:text-8xl font-bold font-mono text-foreground">{timeStr}</p>
        <p className="mt-2 text-lg text-muted-foreground">{dateStr}</p>
      </div>
    </div>
  );
}
