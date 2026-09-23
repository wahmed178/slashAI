import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play, RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/paper-toss")({ component: PaperToss });

/**
 * Paper Toss — the office classic. Flick paper into the bin while a fan
 * (visible wind flag) pushes it sideways. Drag up to throw: the flick's
 * speed sets the arc, wind sets the drift, and the rim rejects lazy shots.
 */

const W = 400;
const H = 560;
const BIN_Y = 430;
const BIN_W = 74;
const BIN_H = 62;

interface Paper {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  live: boolean;
}

function PaperToss() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [throws_, setThrows] = useState(0);
  const [best, setBest] = useState(() => getGameBest("paper-toss") ?? 0);
  const [wind, setWind] = useState(0);

  const paper = useRef<Paper>({ x: W / 2, y: H - 90, vx: 0, vy: 0, rot: 0, vr: 0, live: false });
  const windRef = useRef(0);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const throwsRef = useRef(0);
  const raf = useRef(0);
  const last = useRef(0);
  const drag = useRef<{ x: number; y: number; t: number } | null>(null);
  const landed = useRef(false);

  const newWind = useCallback(() => {
    const w = (Math.random() * 2 - 1) * (0.8 + Math.min(1.4, scoreRef.current * 0.05));
    windRef.current = w;
    setWind(Number(w.toFixed(1)));
  }, []);

  const start = useCallback(() => {
    scoreRef.current = 0;
    streakRef.current = 0;
    throwsRef.current = 0;
    paper.current = { x: W / 2, y: H - 90, vx: 0, vy: 0, rot: 0, vr: 0, live: false };
    setScore(0);
    setStreak(0);
    setThrows(0);
    setPhase("play");
    newWind();
    last.current = performance.now();
  }, [newWind]);

  const finish = useCallback(() => {
    setPhase("over");
    if (scoreRef.current > (getGameBest("paper-toss") ?? 0)) {
      saveGameBest("paper-toss", scoreRef.current);
      setBest(scoreRef.current);
    }
  }, []);

  /** 10 misses (non-consecutive) ends the round */
  const miss = useCallback(() => {
    streakRef.current = 0;
    setStreak(0);
    throwsRef.current++;
    setThrows(throwsRef.current);
    if (throwsRef.current % 1 === 0 && throwsRef.current - scoreRef.current >= 10) finish();
  }, [finish]);

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
      const p = paper.current;

      // office backdrop
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#1e293b");
      bg.addColorStop(1, "#0f172a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      // floor line
      ctx.fillStyle = "#334155";
      ctx.fillRect(0, H - 46, W, 46);
      ctx.strokeStyle = "rgba(148,163,184,0.25)";
      ctx.beginPath();
      ctx.moveTo(0, H - 46);
      ctx.lineTo(W, H - 46);
      ctx.stroke();

      // bin: back rim, body, front rim
      const bx = W / 2;
      ctx.fillStyle = "#475569";
      ctx.beginPath();
      ctx.ellipse(bx, BIN_Y, BIN_W / 2, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#64748b";
      ctx.beginPath();
      ctx.moveTo(bx - BIN_W / 2 + 6, BIN_Y);
      ctx.lineTo(bx - BIN_W / 2 + 12, BIN_Y + BIN_H);
      ctx.lineTo(bx + BIN_W / 2 - 12, BIN_Y + BIN_H);
      ctx.lineTo(bx + BIN_W / 2 - 6, BIN_Y);
      ctx.fill();
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.ellipse(bx, BIN_Y, BIN_W / 2 - 6, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // wind flag (honest wind indicator)
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, 120);
      ctx.lineTo(40, 170);
      ctx.stroke();
      ctx.fillStyle = windRef.current >= 0 ? "#fbbf24" : "#38bdf8";
      const flap = Math.sin(now * 0.012) * 4;
      ctx.beginPath();
      ctx.moveTo(40, 122);
      ctx.lineTo(40 + Math.abs(windRef.current) * 34 + 12, 130 + flap);
      ctx.lineTo(40, 140);
      ctx.fill();
      ctx.fillStyle = "rgba(226,232,240,0.75)";
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`wind ${windRef.current >= 0 ? "→" : "←"} ${Math.abs(windRef.current).toFixed(1)}`, 74, 162);

      // physics
      if (p.live) {
        p.vy += 0.32 * f;
        p.vx += windRef.current * 0.045 * f;
        p.x += p.vx * f;
        p.y += p.vy * f;
        p.rot += p.vr * f;

        // rim rejection: hit the rim edge, bounce out
        const rimL = bx - BIN_W / 2 + 8;
        const rimR = bx + BIN_W / 2 - 8;
        if (p.y > BIN_Y - 6 && p.y < BIN_Y + 8) {
          if (p.x < rimL - 2 || p.x > rimR + 2) {
            if (p.vy > 0 && p.y < BIN_Y + 2) {
              p.vy *= -0.4;
              p.vx *= 0.7;
            }
          }
        }
        // clean swish
        if (p.y > BIN_Y + 10 && p.y < BIN_Y + BIN_H - 8 && p.x > rimL && p.x < rimR && !landed.current) {
          landed.current = true;
          p.live = false;
          streakRef.current++;
          scoreRef.current += 1 + (streakRef.current >= 3 ? 1 : 0);
          setScore(scoreRef.current);
          setStreak(streakRef.current);
          setTimeout(() => {
            paper.current = { x: W / 2, y: H - 90, vx: 0, vy: 0, rot: 0, vr: 0, live: false };
            landed.current = false;
            newWind();
          }, 350);
        }
        // hit the floor
        if (p.y > H - 52 && !landed.current) {
          landed.current = true;
          p.live = false;
          miss();
          setTimeout(() => {
            paper.current = { x: W / 2, y: H - 90, vx: 0, vy: 0, rot: 0, vr: 0, live: false };
            landed.current = false;
            newWind();
          }, 350);
        }
        if (p.x < -30 || p.x > W + 30) {
          p.live = false;
          if (!landed.current) {
            landed.current = true;
            miss();
          }
          setTimeout(() => {
            paper.current = { x: W / 2, y: H - 90, vx: 0, vy: 0, rot: 0, vr: 0, live: false };
            landed.current = false;
            newWind();
          }, 300);
        }
      }

      // draw the paper (crumpled ball)
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const r = 9 + (i % 2 === 0 ? 2 : -1);
        ctx[i === 0 ? "moveTo" : "lineTo"](Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-4, -2);
      ctx.lineTo(3, 3);
      ctx.moveTo(4, -4);
      ctx.lineTo(-2, 4);
      ctx.stroke();
      ctx.restore();

      // aim line while dragging
      if (drag.current && !p.live) {
        const d = drag.current;
        ctx.strokeStyle = "rgba(250,204,21,0.7)";
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + (p.x - d.x) * 0.8, p.y + (p.y - d.y) * 0.8);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // HUD
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.font = "bold 15px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`Score ${scoreRef.current}`, 12, 26);
      ctx.textAlign = "center";
      if (streakRef.current >= 2) ctx.fillText(`🔥 ${streakRef.current} streak`, W / 2, 26);
      ctx.textAlign = "right";
      ctx.fillText(`Misses left ${Math.max(0, 10 - (throwsRef.current - scoreRef.current))}`, W - 12, 26);

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, newWind, miss]);

  const pointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "play" || paper.current.live) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    drag.current = {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
      t: performance.now(),
    };
  };

  const pointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current || phase !== "play" || paper.current.live) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const d = drag.current;
    drag.current = null;
    const dx = x - d.x;
    const dy = y - d.y;
    if (dy > -30) return; // must flick upward
    const p = paper.current;
    p.vx = dx * 0.14;
    p.vy = dy * 0.14;
    p.vr = dx * 0.2;
    p.live = true;
  };

  return (
    <AppShell title="Paper Toss">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🗑️ Paper Toss</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Flick the paper into the bin — the fan blows it sideways. Watch the flag.
        </p>
      </header>
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full touch-none select-none"
            onPointerDown={pointerDown}
            onPointerUp={pointerUp}
          />
          {phase !== "play" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
              {phase === "over" ? (
                <>
                  <p className="text-4xl font-black text-foreground">{score}</p>
                  <p className="text-sm text-muted-foreground">baskets in {throws_} throws</p>
                  {score >= best && score > 0 && <p className="text-sm font-semibold text-primary">🏆 New best!</p>}
                </>
              ) : (
                <p className="text-5xl">🗑️</p>
              )}
              <button
                onClick={start}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-background transition-all hover:opacity-90 active:scale-95"
              >
                {phase === "over" ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
                {phase === "over" ? "Toss again" : "Start tossing"}
              </button>
              {phase === "idle" && best > 0 && <p className="text-xs text-muted-foreground">Best: {best}</p>}
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">Swipe up to throw. 10 net misses ends the round.</p>
      </div>
    </AppShell>
  );
}
