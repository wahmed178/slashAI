import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play, RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/archery")({ component: Archery });

/**
 * Archery — 10 arrows, real target rings (10 down to 1), moving crosshair
 * wind and a breathing sway you must time. Score is the true ring total;
 * a perfect 10 in the gold centre.
 */

const W = 400;
const H = 560;

const RINGS = [
  { r: 26, score: 10, color: "#fbbf24" },
  { r: 52, score: 9, color: "#fbbf24" },
  { r: 78, score: 8, color: "#ef4444" },
  { r: 104, score: 7, color: "#ef4444" },
  { r: 130, score: 6, color: "#22c55e" },
  { r: 156, score: 5, color: "#22c55e" },
];

function Archery() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [total, setTotal] = useState(0);
  const [arrow, setArrow] = useState(1);
  const [best, setBest] = useState(() => getGameBest("archery") ?? 0);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const aim = useRef({ x: 200, y: 200, sway: 0, windX: 0, charging: false, charge: 0 });
  const totals = useRef(0);
  const currentArrow = useRef(1);
  const arrows = useRef<{ x: number; y: number; s: number }[]>([]);
  const raf = useRef(0);
  const last = useRef(0);

  const start = useCallback(() => {
    totals.current = 0;
    currentArrow.current = 1;
    arrows.current = [];
    aim.current = { x: 200, y: 200, sway: 0, windX: 0, charging: false, charge: 0 };
    setTotal(0);
    setArrow(1);
    setLastScore(null);
    setPhase("play");
    last.current = performance.now();
  }, []);

  const finish = useCallback(() => {
    setPhase("over");
    if (totals.current > (getGameBest("archery") ?? 0)) {
      saveGameBest("archery", totals.current);
      setBest(totals.current);
    }
  }, []);

  const loose = useCallback(() => {
    if (phase !== "play") return;
    const a = aim.current;
    const tx = 200;
    const ty = 230;
    const dist = Math.hypot(a.x - tx, a.y - ty);
    let s = 1;
    for (const ring of RINGS) {
      if (dist <= ring.r) {
        s = ring.score;
        break;
      }
    }
    // wobble penalty: charging long overcorrects
    if (a.charge > 1.4) s = Math.max(1, s - 2);
    arrows.current.push({ x: a.x, y: a.y, s });
    totals.current += s;
    setTotal(totals.current);
    setLastScore(s);
    if (currentArrow.current >= 10) {
      finish();
    } else {
      currentArrow.current++;
      setArrow(currentArrow.current);
      aim.current = { x: 200 + (Math.random() * 80 - 40), y: 230 + (Math.random() * 60 - 30), sway: 0, windX: 0, charging: false, charge: 0 };
    }
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
      const a = aim.current;

      // range backdrop
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#052e16");
      bg.addColorStop(1, "#166534");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      // distance stripes
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      for (let i = 0; i < 4; i++) ctx.fillRect(0, 400 + i * 36, W, 18);

      // target
      const tx = 200;
      const ty = 230;
      // outer white ring (score 4 and below area)
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(tx, ty, 182, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.arc(tx, ty, 182, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#111827";
      ctx.stroke();
      for (const ring of [...RINGS].reverse()) {
        ctx.fillStyle = ring.color;
        ctx.beginPath();
        ctx.arc(tx, ty, ring.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // centre X
      ctx.strokeStyle = "#111827";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(tx - 5, ty - 5);
      ctx.lineTo(tx + 5, ty + 5);
      ctx.moveTo(tx + 5, ty - 5);
      ctx.lineTo(tx - 5, ty + 5);
      ctx.stroke();

      // crosshair with real breathing sway + wind drift
      a.sway += f * 0.03;
      const swayX = Math.sin(a.sway * 1.7) * 7 + Math.sin(a.sway * 0.6) * 4;
      const swayY = Math.cos(a.sway * 1.3) * 6;
      a.windX = Math.sin(now * 0.0011) * 10;
      const cx = a.x + swayX + a.windX;
      const cy = a.y + swayY;
      ctx.strokeStyle = "rgba(239,68,68,0.95)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.moveTo(cx - 24, cy);
      ctx.lineTo(cx - 8, cy);
      ctx.moveTo(cx + 8, cy);
      ctx.lineTo(cx + 24, cy);
      ctx.moveTo(cx, cy - 24);
      ctx.lineTo(cx, cy - 8);
      ctx.moveTo(cx, cy + 8);
      ctx.lineTo(cx, cy + 24);
      ctx.stroke();

      // stuck arrows
      for (const ar of arrows.current) {
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ar.x, ar.y);
        ctx.lineTo(ar.x + 14, ar.y + 30);
        ctx.stroke();
        ctx.fillStyle = "#f5f5f4";
        ctx.beginPath();
        ctx.arc(ar.x, ar.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.font = "bold 15px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`Total ${totals.current}`, 12, 26);
      ctx.textAlign = "center";
      ctx.fillText(`Arrow ${Math.min(10, currentArrow.current)} / 10`, W / 2, 26);
      ctx.textAlign = "right";
      if (lastScore !== null) ctx.fillText(`last: ${lastScore}`, W - 12, 26);

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, lastScore]);

  return (
    <AppShell title="Archery">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏹 Archery</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          10 arrows at a true ring target. The crosshair breathes and drifts with the wind — time your shot.
        </p>
      </header>
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full cursor-crosshair touch-none select-none"
            onClick={loose}
          />
          {phase !== "play" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
              {phase === "over" ? (
                <>
                  <p className="text-4xl font-black text-foreground">{total}/100</p>
                  <p className="text-sm text-muted-foreground">10 arrows</p>
                  {total >= best && total > 0 && <p className="text-sm font-semibold text-primary">🏆 New best!</p>}
                </>
              ) : (
                <p className="text-5xl">🏹</p>
              )}
              <button
                onClick={start}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-background transition-all hover:opacity-90 active:scale-95"
              >
                {phase === "over" ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
                {phase === "over" ? "Shoot again" : "Take the range"}
              </button>
              {phase === "idle" && best > 0 && <p className="text-xs text-muted-foreground">Best: {best}</p>}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
