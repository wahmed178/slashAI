import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/perfect-circle")({ component: PerfectCircle });

const BEST_KEY = "perfect-circle-best";

function scoreCircle(points: { x: number; y: number }[]): number {
  // centroid + mean radius
  let cx = 0;
  let cy = 0;
  for (const p of points) {
    cx += p.x;
    cy += p.y;
  }
  cx /= points.length;
  cy /= points.length;
  let meanR = 0;
  const radii: number[] = [];
  for (const p of points) {
    const r = Math.hypot(p.x - cx, p.y - cy);
    radii.push(r);
    meanR += r;
  }
  meanR /= radii.length;
  if (meanR < 20) return 0;
  let variance = 0;
  for (const r of radii) variance += (r - meanR) ** 2;
  variance /= radii.length;
  const sd = Math.sqrt(variance);
  const uniformity = 1 - sd / meanR; // 0..1
  // closing gap between start and end angles
  const first = points[0]!;
  const last = points[points.length - 1]!;
  const a1 = Math.atan2(first.y - cy, first.x - cx);
  const a2 = Math.atan2(last.y - cy, last.x - cx);
  let gap = Math.abs(a1 - a2);
  if (gap > Math.PI) gap = 2 * Math.PI - gap;
  const closure = 1 - gap / (2 * Math.PI);
  const raw = uniformity * 0.8 + closure * 0.2;
  return Math.max(0, Math.min(100, Math.round(raw * 100)));
}

function PerfectCircle() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const points = useRef<{ x: number; y: number }[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [best, setBest] = useState<number>(() => Number(localStorage.getItem(BEST_KEY) ?? 0));

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    points.current = [];
    setScore(null);
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    clear();
    drawing.current = true;
    canvasRef.current!.setPointerCapture(e.pointerId);
    points.current = [pos(e)];
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const p = pos(e);
    points.current.push(p);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    // canvas can't use CSS var() - read the resolved theme color
    const color = getComputedStyle(canvas).getPropertyValue("--primary").trim() || "#2dd4bf";
    const prev = points.current[points.current.length - 2]!;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const pts = points.current;
    if (pts.length < 30) {
      setScore(null);
      return;
    }
    const s = scoreCircle(pts);
    setScore(s);
    if (s > best) {
      setBest(s);
      localStorage.setItem(BEST_KEY, String(s));
    }
    // overlay ideal circle for comparison
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let cx = 0;
    let cy = 0;
    for (const p of pts) {
      cx += p.x;
      cy += p.y;
    }
    cx /= pts.length;
    cy /= pts.length;
    let meanR = 0;
    for (const p of pts) meanR += Math.hypot(p.x - cx, p.y - cy);
    meanR /= pts.length;
    ctx.strokeStyle = "rgba(148,163,184,0.5)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy, meanR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const verdict =
    score === null ? "" : score >= 95 ? "Inhuman. A compass is jealous." : score >= 85 ? "Practically perfect." : score >= 70 ? "Very respectable circle." : score >= 50 ? "A humble potato." : "That is... an egg?";

  return (
    <AppShell title="Perfect Circle">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⭕ Perfect Circle</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Draw a circle around the dot with one stroke. Release to score. Beat {best}%.
        </p>
      </header>

      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Best: <b className="text-primary">{best}%</b></span>
          <button
            onClick={clear}
            className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <RotateCcw className="size-3" /> Clear
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="block w-full touch-none select-none"
            style={{ touchAction: "none", cursor: "crosshair", aspectRatio: "1 / 1" }}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
          />
          {/* centre dot */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
          {score !== null && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-background/80 p-3 text-center backdrop-blur">
              <p className="text-2xl font-bold tabular-nums text-primary">{score}%</p>
              <p className="text-xs text-muted-foreground">{verdict}</p>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Scoring blends radius consistency (80%) with how cleanly you close the loop (20%).
        </p>
      </div>
    </AppShell>
  );
}
