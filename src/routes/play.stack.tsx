import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play, RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/stack")({ component: StackGame });

/**
 * Stack — the tower-block classic. Each block slides across; drop it and the
 * overhang is sliced away. Blocks shrink as you err; perfect drops restore a
 * sliver of width and combo bonus points. Small blocks move faster.
 */

const W = 420;
const H = 560;
const BASE_H = 26;
const START_W = 180;
/** perfect placement within this many px */
const PERFECT = 7;

interface Block {
  x: number;
  y: number;
  w: number;
}

const blockColor = (i: number) => {
  const hue = (i * 24) % 360;
  return `hsl(${hue} 72% 55%)`;
};

function StackGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getGameBest("stack") ?? 0);

  const blocks = useRef<Block[]>([]);
  const current = useRef<{ x: number; dir: number; w: number } | null>(null);
  const cameraY = useRef(0);
  const scoreRef = useRef(0);
  const combo = useRef(0);
  const raf = useRef(0);
  const last = useRef(0);

  const start = useCallback(() => {
    blocks.current = [{ x: W / 2 - START_W / 2, y: H - 40, w: START_W }];
    current.current = { x: 20, dir: 1, w: START_W };
    cameraY.current = 0;
    scoreRef.current = 0;
    combo.current = 0;
    setScore(0);
    setPhase("play");
    last.current = performance.now();
  }, []);

  const finish = useCallback(() => {
    setPhase("over");
    if (scoreRef.current > (getGameBest("stack") ?? 0)) {
      saveGameBest("stack", scoreRef.current);
      setBest(scoreRef.current);
    }
  }, []);

  const drop = useCallback(() => {
    const cur = current.current;
    const top = blocks.current[blocks.current.length - 1];
    if (!cur || !top || phase !== "play") return;

    const left = Math.max(cur.x, top.x);
    const right = Math.min(cur.x + cur.w, top.x + top.w);
    const overlap = right - left;
    if (overlap <= 0) {
      // complete miss — the block falls past
      finish();
      return;
    }
    const perfect = Math.abs(cur.x - top.x) < PERFECT;
    if (perfect) {
      combo.current++;
      // perfect drops regrow a sliver (capped at start width)
      const w = Math.min(START_W, top.w + 4);
      const x = top.x + (top.w - w) / 2;
      blocks.current.push({ x, y: top.y - BASE_H, w });
      scoreRef.current += 10 + combo.current * 5;
    } else {
      combo.current = 0;
      blocks.current.push({ x: left, y: top.y - BASE_H, w: overlap });
      scoreRef.current += 10;
    }
    setScore(scoreRef.current);
    const next = blocks.current[blocks.current.length - 1]!;
    current.current = { x: next.x + next.w > W - 40 ? 20 : W - 40 - next.w, dir: next.x + next.w > W - 40 ? 1 : -1, w: next.w };
  }, [phase, finish]);

  useEffect(() => {
    if (phase !== "play") return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const loop = (now: number) => {
      const dt = Math.min(32, now - (last.current || now));
      last.current = now;
      const f = dt / 16.7;

      ctx.fillStyle = "#0b1020";
      ctx.fillRect(0, 0, W, H);

      // keep the top of the tower framed
      const topY = blocks.current[blocks.current.length - 1]?.y ?? H;
      const targetCam = Math.min(0, Math.max(topY - H * 0.45, -(blocks.current.length * BASE_H)));
      cameraY.current += (targetCam - cameraY.current) * 0.08 * f;

      const cur = current.current;
      if (cur) {
        const speed = (1.9 + blocks.current.length * 0.06) * f;
        cur.x += cur.dir * speed;
        if (cur.x < 0) {
          cur.x = 0;
          cur.dir = 1;
        }
        if (cur.x + cur.w > W) {
          cur.x = W - cur.w;
          cur.dir = -1;
        }
      }

      const cam = cameraY.current;
      // draw the tower
      blocks.current.forEach((b, i) => {
        const y = b.y - cam;
        if (y < -BASE_H || y > H) return;
        ctx.fillStyle = blockColor(i);
        ctx.fillRect(b.x, y, b.w, BASE_H - 2);
        // top sheen
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fillRect(b.x, y, b.w, 5);
      });
      // sliding block
      if (cur) {
        const y = (blocks.current[blocks.current.length - 1]?.y ?? H - 40) - BASE_H - cam;
        ctx.fillStyle = blockColor(blocks.current.length);
        ctx.fillRect(cur.x, y, cur.w, BASE_H - 2);
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fillRect(cur.x, y, cur.w, 5);
      }
      // guide line showing alignment
      const top = blocks.current[blocks.current.length - 1];
      if (top && cur) {
        const aligned = Math.abs(cur.x - top.x) < PERFECT;
        ctx.strokeStyle = aligned ? "rgba(74,222,128,0.9)" : "rgba(148,163,184,0.35)";
        ctx.setLineDash([4, 5]);
        ctx.beginPath();
        ctx.moveTo(top.x, top.y - cam);
        ctx.lineTo(top.x, top.y - cam - 90);
        ctx.moveTo(top.x + top.w, top.y - cam);
        ctx.lineTo(top.x + top.w, top.y - cam - 90);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.font = "bold 16px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`Height ${blocks.current.length - 1}`, 12, 28);
      ctx.textAlign = "right";
      ctx.fillText(`${scoreRef.current}`, W - 12, 28);
      if (combo.current > 1) {
        ctx.fillStyle = "#4ade80";
        ctx.textAlign = "center";
        ctx.fillText(`PERFECT ×${combo.current}`, W / 2, 46);
      }

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase]);

  return (
    <AppShell title="Stack">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏗️ Stack</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drop sliding blocks and build the tower. Overhang is sliced away — perfect drops regrow width.
        </p>
      </header>
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full touch-none select-none"
            onClick={drop}
          />
          {phase !== "play" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
              {phase === "over" ? (
                <>
                  <p className="text-4xl font-black text-foreground">{blocks.current.length - 1}</p>
                  <p className="text-sm text-muted-foreground">blocks tall · {score} points</p>
                  {score >= best && score > 0 && <p className="text-sm font-semibold text-primary">🏆 New best!</p>}
                </>
              ) : (
                <p className="text-5xl">🏗️</p>
              )}
              <button
                onClick={start}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-background transition-all hover:opacity-90 active:scale-95"
              >
                {phase === "over" ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
                {phase === "over" ? "Stack again" : "Start stacking"}
              </button>
              {phase === "idle" && best > 0 && <p className="text-xs text-muted-foreground">Best: {best} blocks tall</p>}
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">Tap / click to drop. Miss the tower entirely and it falls.</p>
      </div>
    </AppShell>
  );
}
