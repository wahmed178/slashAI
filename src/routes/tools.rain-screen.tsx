import { useRef, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/rain-screen")({
  head: () => ({ meta: [{ title: "Rain Screen — SlashAI" }] }),
  component: RainScreen,
});

function RainScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [now, setNow] = useState(new Date());
  const [speed, setSpeed] = useState(3);
  const [color, setColor] = useState("blue");

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const blue = "rgba(88,166,255,0.6)";
    const white = "rgba(255,255,255,0.4)";
    const green = "rgba(63,185,80,0.5)";

    const drops = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 2 + Math.random() * 4,
      length: 10 + Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.4,
    }));

    let animId: number;
    const draw = () => {
      ctx.fillStyle = "rgba(13,17,23,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const colorVal = color === "white" ? white : color === "green" ? green : blue;
      ctx.strokeStyle = colorVal;
      ctx.lineWidth = 1;
      drops.forEach((d) => {
        ctx.globalAlpha = d.opacity;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.length);
        ctx.stroke();
        d.y += d.speed * speed;
        if (d.y > canvas.height) { d.y = -d.length; d.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [speed, color]);

  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#0d1117" }}>

      {/* Back button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="fixed top-4 left-4 z-50 h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-150 active:scale-95"
        style={{
          borderColor: "rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <p className="text-6xl sm:text-8xl font-bold font-mono text-foreground">{timeStr}</p>
        <p className="mt-2 text-lg text-muted-foreground">{dateStr}</p>
      </div>
      <div className="fixed bottom-4 right-4 z-20 flex gap-2">
        <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
          className="rounded-lg border border-border bg-surface/80 backdrop-blur px-2 py-1.5 text-xs text-muted-foreground">
          <option value={1}>Slow</option><option value={3}>Normal</option><option value={6}>Fast</option>
        </select>
        <select value={color} onChange={(e) => setColor(e.target.value)}
          className="rounded-lg border border-border bg-surface/80 backdrop-blur px-2 py-1.5 text-xs text-muted-foreground">
          <option value="blue">Blue</option><option value="white">White</option><option value="green">Green</option>
        </select>
      </div>
    </div>
  );
}
