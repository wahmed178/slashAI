import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play, RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/mini-golf")({ component: MiniGolf });

/**
 * Mini Golf — 9 hand-designed holes. Drag from the ball to aim and set
 * power. Walls bounce, sand traps kill momentum, water costs a penalty
 * stroke and a reset. Par is real: birdie, bogey and worse all exist.
 */

const W = 420;
const H = 560;

interface Wall {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Hole {
  walls: Wall[];
  ball: { x: number; y: number };
  cup: { x: number; y: number };
  par: number;
  name: string;
  sand?: { x: number; y: number; w: number; h: number };
  water?: { x: number; y: number; w: number; h: number };
}

/** course: walls are the green's borders plus obstacles */
const COURSE: Hole[] = [
  {
    name: "Warm up",
    par: 2,
    ball: { x: 90, y: 470 },
    cup: { x: 330, y: 100 },
    walls: [
      { x: 60, y: 70, w: 10, h: 420 },
      { x: 60, y: 70, w: 300, h: 10 },
      { x: 350, y: 70, w: 10, h: 420 },
      { x: 60, y: 480, w: 300, h: 10 },
    ],
  },
  {
    name: "The corner",
    par: 2,
    ball: { x: 90, y: 470 },
    cup: { x: 320, y: 90 },
    walls: [
      { x: 60, y: 70, w: 10, h: 420 },
      { x: 60, y: 70, w: 300, h: 10 },
      { x: 350, y: 70, w: 10, h: 420 },
      { x: 60, y: 480, w: 300, h: 10 },
      { x: 70, y: 300, w: 230, h: 12 },
    ],
  },
  {
    name: "Sand trap",
    par: 3,
    ball: { x: 90, y: 470 },
    cup: { x: 320, y: 110 },
    walls: [
      { x: 60, y: 70, w: 10, h: 420 },
      { x: 60, y: 70, w: 300, h: 10 },
      { x: 350, y: 70, w: 10, h: 420 },
      { x: 60, y: 480, w: 300, h: 10 },
    ],
    sand: { x: 160, y: 240, w: 120, h: 110 },
  },
  {
    name: "Island green",
    par: 3,
    ball: { x: 90, y: 470 },
    cup: { x: 320, y: 110 },
    walls: [
      { x: 60, y: 70, w: 10, h: 420 },
      { x: 60, y: 70, w: 300, h: 10 },
      { x: 350, y: 70, w: 10, h: 420 },
      { x: 60, y: 480, w: 300, h: 10 },
    ],
    water: { x: 150, y: 220, w: 160, h: 130 },
  },
  {
    name: "Dogleg",
    par: 3,
    ball: { x: 90, y: 470 },
    cup: { x: 320, y: 95 },
    walls: [
      { x: 60, y: 70, w: 10, h: 420 },
      { x: 60, y: 70, w: 300, h: 10 },
      { x: 350, y: 70, w: 10, h: 420 },
      { x: 60, y: 480, w: 300, h: 10 },
      { x: 240, y: 80, w: 12, h: 220 },
    ],
  },
  {
    name: "Twin towers",
    par: 3,
    ball: { x: 90, y: 470 },
    cup: { x: 320, y: 100 },
    walls: [
      { x: 60, y: 70, w: 10, h: 420 },
      { x: 60, y: 70, w: 300, h: 10 },
      { x: 350, y: 70, w: 10, h: 420 },
      { x: 60, y: 480, w: 300, h: 10 },
      { x: 150, y: 180, w: 14, h: 120 },
      { x: 260, y: 320, w: 14, h: 120 },
    ],
  },
  {
    name: "Windmill gap",
    par: 4,
    ball: { x: 90, y: 470 },
    cup: { x: 320, y: 100 },
    walls: [
      { x: 60, y: 70, w: 10, h: 420 },
      { x: 60, y: 70, w: 300, h: 10 },
      { x: 350, y: 70, w: 10, h: 420 },
      { x: 60, y: 480, w: 300, h: 10 },
      { x: 200, y: 150, w: 12, h: 90 },
      { x: 200, y: 290, w: 12, h: 90 },
    ],
  },
  {
    name: "Water carry",
    par: 4,
    ball: { x: 90, y: 470 },
    cup: { x: 320, y: 95 },
    walls: [
      { x: 60, y: 70, w: 10, h: 420 },
      { x: 60, y: 70, w: 300, h: 10 },
      { x: 350, y: 70, w: 10, h: 420 },
      { x: 60, y: 480, w: 300, h: 10 },
    ],
    water: { x: 70, y: 260, w: 220, h: 70 },
  },
  {
    name: "Championship",
    par: 5,
    ball: { x: 90, y: 470 },
    cup: { x: 330, y: 90 },
    walls: [
      { x: 60, y: 70, w: 10, h: 420 },
      { x: 60, y: 70, w: 300, h: 10 },
      { x: 350, y: 70, w: 10, h: 420 },
      { x: 60, y: 480, w: 300, h: 10 },
      { x: 70, y: 360, w: 150, h: 12 },
      { x: 220, y: 200, w: 12, h: 160 },
      { x: 220, y: 80, w: 130, h: 12 },
    ],
    sand: { x: 260, y: 320, w: 80, h: 80 },
  },
];

const friction = (inSand: boolean) => (inSand ? 0.9 : 0.985);

function MiniGolf() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [holeIdx, setHoleIdx] = useState(0);
  const [strokes, setStrokes] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [best, setBest] = useState(() => getGameBest("mini-golf") ?? 0);

  const ball = useRef({ x: 90, y: 470, vx: 0, vy: 0, moving: false });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const strokeCount = useRef(0);
  const raf = useRef(0);
  const holeRef = useRef(0);
  const settled = useRef(false);

  const loadHole = useCallback((i: number) => {
    const h = COURSE[i]!;
    ball.current = { x: h.ball.x, y: h.ball.y, vx: 0, vy: 0, moving: false };
    strokeCount.current = 0;
    setStrokes(0);
    holeRef.current = i;
    setHoleIdx(i);
    settled.current = false;
  }, []);

  const start = useCallback(() => {
    setScores([]);
    loadHole(0);
    setPhase("play");
  }, [loadHole]);

  const finishRound = useCallback((all: number[]) => {
    setScores(all);
    setPhase("over");
    const total = all.reduce((a, b) => a + b, 0);
    if (total > 0 && (getGameBest("mini-golf") ?? 0) === 0 || total < (getGameBest("mini-golf") ?? Infinity)) {
      saveGameBest("mini-golf", total);
      setBest(total);
    }
  }, []);

  /** ball sunk → advance (or finish) */
  const sunk = useCallback(() => {
    const h = COURSE[holeRef.current]!;
    const all = [...scores];
    all[holeRef.current] = strokeCount.current;
    setScores(all);
    if (holeRef.current + 1 >= COURSE.length) {
      finishRound(all);
    } else {
      loadHole(holeRef.current + 1);
    }
    void h;
  }, [scores, loadHole, finishRound]);

  const inRect = (x: number, y: number, r: { x: number; y: number; w: number; h: number }) =>
    x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h;

  useEffect(() => {
    if (phase !== "play") return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const hole = COURSE[holeRef.current]!;

    const loop = (now: number) => {
      const b = ball.current;
      const inSand = hole.sand ? inRect(b.x, b.y, hole.sand) : false;
      const inWater = hole.water ? inRect(b.x, b.y, hole.water) : false;

      // green
      ctx.fillStyle = "#15803d";
      ctx.fillRect(0, 0, W, H);
      if (hole.sand) {
        ctx.fillStyle = "#fde68a";
        ctx.fillRect(hole.sand.x, hole.sand.y, hole.sand.w, hole.sand.h);
        ctx.fillStyle = "rgba(0,0,0,0.06)";
        for (let i = 0; i < 5; i++) ctx.fillRect(hole.sand.x + 8, hole.sand.y + 10 + i * 18, hole.sand.w - 16, 3);
      }
      if (hole.water) {
        const wg = ctx.createLinearGradient(0, hole.water.y, 0, hole.water.y + hole.water.h);
        wg.addColorStop(0, "#38bdf8");
        wg.addColorStop(1, "#0369a1");
        ctx.fillStyle = wg;
        ctx.fillRect(hole.water.x, hole.water.y, hole.water.w, hole.water.h);
      }
      // walls
      for (const wl of hole.walls) {
        ctx.fillStyle = "#f5f5f4";
        ctx.fillRect(wl.x, wl.y, wl.w, wl.h);
      }
      // cup
      ctx.fillStyle = "#0a0a0a";
      ctx.beginPath();
      ctx.arc(hole.cup.x, hole.cup.y, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 2;
      ctx.stroke();
      // flag
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hole.cup.x, hole.cup.y);
      ctx.lineTo(hole.cup.x, hole.cup.y - 34);
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(hole.cup.x, hole.cup.y - 34);
      ctx.lineTo(hole.cup.x + 20, hole.cup.y - 27);
      ctx.lineTo(hole.cup.x, hole.cup.y - 20);
      ctx.fill();

      // physics
      if (b.moving) {
        b.x += b.vx;
        b.y += b.vy;
        const fr = friction(inSand);
        b.vx *= fr;
        b.vy *= fr;
        // wall collisions (AABB vs ball radius 8)
        const R = 8;
        for (const wl of hole.walls) {
          if (b.x + R > wl.x && b.x - R < wl.x + wl.w && b.y + R > wl.y && b.y - R < wl.y + wl.h) {
            // bounce on the shallower axis
            const overlapX = Math.min(b.x + R - wl.x, wl.x + wl.w - (b.x - R));
            const overlapY = Math.min(b.y + R - wl.y, wl.y + wl.h - (b.y - R));
            if (overlapX < overlapY) {
              b.vx *= -0.75;
              b.x += b.vx > 0 ? overlapX : -overlapX;
            } else {
              b.vy *= -0.75;
              b.y += b.vy > 0 ? overlapY : -overlapY;
            }
          }
        }
        // water penalty
        if (inWater && !settled.current) {
          settled.current = true;
          strokeCount.current += 1; // penalty stroke
          setStrokes(strokeCount.current);
          setTimeout(() => {
            ball.current = { x: hole.ball.x, y: hole.ball.y, vx: 0, vy: 0, moving: false };
            settled.current = false;
          }, 500);
        }
        // cup capture
        const distCup = Math.hypot(b.x - hole.cup.x, b.y - hole.cup.y);
        if (distCup < 12 && Math.hypot(b.vx, b.vy) < 6.2) {
          b.moving = false;
          sunk();
          return;
        }
        if (Math.hypot(b.vx, b.vy) < 0.06) {
          b.vx = 0;
          b.vy = 0;
          b.moving = false;
        }
      }

      // ball
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(b.x, b.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // aim line while dragging
      if (drag.current && !b.moving) {
        const dx = b.x - drag.current.x;
        const dy = b.y - drag.current.y;
        const len = Math.hypot(dx, dy);
        const capped = Math.min(len, 110);
        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.lineWidth = 3;
        ctx.setLineDash([7, 6]);
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x + (dx / (len || 1)) * capped, b.y + (dy / (len || 1)) * capped);
        ctx.stroke();
        ctx.setLineDash([]);
        // power dots
        for (let i = 1; i <= 3; i++) {
          if (capped > i * 28) {
            ctx.fillStyle = i === 3 ? "#ef4444" : i === 2 ? "#f59e0b" : "#4ade80";
            ctx.beginPath();
            ctx.arc(b.x + (dx / (len || 1)) * i * 28, b.y + (dy / (len || 1)) * i * 28, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // HUD
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = "bold 15px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`Hole ${holeIdx + 1} · ${hole.name}`, 12, 26);
      ctx.textAlign = "right";
      ctx.fillText(`Par ${hole.par} · Strokes ${strokeCount.current}`, W - 12, 26);

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, holeIdx, sunk]);

  const pointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cv = canvasRef.current;
    if (!cv || phase !== "play" || ball.current.moving) return;
    const rect = cv.getBoundingClientRect();
    drag.current = {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  };

  const pointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cv = canvasRef.current;
    if (!cv || !drag.current || phase !== "play" || ball.current.moving) return;
    const rect = cv.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const dx = ball.current.x - x;
    const dy = ball.current.y - y;
    const len = Math.hypot(dx, dy);
    drag.current = null;
    if (len < 14) return; // too small to be a putt
    const power = Math.min(len, 110) / 110;
    ball.current.vx = (dx / len) * power * 13;
    ball.current.vy = (dy / len) * power * 13;
    ball.current.moving = true;
    strokeCount.current++;
    setStrokes(strokeCount.current);
  };

  const totalStrokes = scores.length ? scores.reduce((a, b) => a + b, 0) : 0;
  const totalPar = COURSE.reduce((a, h) => a + h.par, 0);

  return (
    <AppShell title="Mini Golf">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⛳ Mini Golf</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          9 hand-built holes. Drag back from the ball to putt — mind the sand, water and walls.
        </p>
      </header>
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full cursor-grab touch-none select-none active:cursor-grabbing"
            onPointerDown={pointerDown}
            onPointerUp={pointerUp}
          />
          {(phase === "idle" || phase === "over") && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 px-6 backdrop-blur-sm">
              {phase === "over" ? (
                <>
                  <p className="text-3xl font-black text-foreground">
                    {totalStrokes} strokes
                  </p>
                  <p className="text-sm text-muted-foreground">
                    course par {totalPar} — {totalStrokes <= totalPar ? `${totalPar - totalStrokes} under! 🏆` : `${totalStrokes - totalPar} over`}
                  </p>
                  <div className="grid max-h-24 grid-cols-9 gap-1 overflow-hidden text-[10px] text-muted-foreground">
                    {scores.map((s, i) => (
                      <div key={i} className="rounded bg-surface px-1.5 py-1 text-center">
                        {s}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-5xl">⛳</p>
              )}
              <button
                onClick={start}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-background transition-all hover:opacity-90 active:scale-95"
              >
                {phase === "over" ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
                {phase === "over" ? "Play the course again" : "Play 9 holes"}
              </button>
              {phase === "idle" && best > 0 && <p className="text-xs text-muted-foreground">Best round: {best}</p>}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
