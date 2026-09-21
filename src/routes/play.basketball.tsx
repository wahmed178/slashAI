import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/basketball")({ component: Basketball });

/**
 * Basketball — sixty seconds of shooting. The power bar sweeps up and down; tap
 * (or hit space) to lock it and release the shot. The hoop moves further out as
 * you score, so the sweet spot keeps changing. Bank shots through the rim only.
 */

const W = 420;
const H = 620;
const GRAVITY = 0.5;
const BALL_R = 15;
const RIM_R = 26;
const ROUND_TIME = 60;

interface Shot { x: number; y: number; vx: number; vy: number; live: boolean }

function Basketball() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [made, setMade] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("slashai.basketball.best")) || 0);

  const ball = useRef<Shot>({ x: 80, y: H - 60, vx: 0, vy: 0, live: false });
  const hoop = useRef({ x: 300, y: 150 });
  const powerRef = useRef(0);
  const dirRef = useRef(1);
  const lockedRef = useRef(false);
  const missedRef = useRef(false);
  const phaseRef = useRef<"idle" | "playing" | "over">("idle");
  phaseRef.current = phase;
  const scoreRef = useRef(0);
  const shotsRef = useRef(0);
  const madeRef = useRef(0);
  const streakRef = useRef(0);

  const resetBall = () => {
    ball.current = { x: 70 + Math.random() * 40, y: H - 60, vx: 0, vy: 0, live: false };
    hoop.current = { x: 250 + Math.random() * 110, y: 130 + Math.random() * 90 };
    lockedRef.current = false;
    missedRef.current = false;
  };

  const start = useCallback(() => {
    scoreRef.current = 0;
    shotsRef.current = 0;
    madeRef.current = 0;
    streakRef.current = 0;
    setScore(0);
    setShots(0);
    setMade(0);
    setStreak(0);
    setTimeLeft(ROUND_TIME);
    setPhase("playing");
    resetBall();
  }, []);

  const shoot = useCallback(() => {
    if (phaseRef.current !== "playing" || lockedRef.current) return;
    const p = powerRef.current;
    const b = ball.current;
    if (b.live) return;
    // aim from the ball toward the hoop so a good power lands it there
    const dx = hoop.current.x - b.x;
    const dy = hoop.current.y - b.y;
    const dist = Math.hypot(dx, dy);
    const speed = 8 + p * 9;
    const flight = Math.min(speed, 17);
    b.vx = (dx / dist) * flight * 0.92;
    b.vy = (dy / dist) * flight * 0.92 - 5.4;
    b.live = true;
    lockedRef.current = true;
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPhase("over");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "over") {
      setBest((b) => {
        const nb = Math.max(b, scoreRef.current);
        localStorage.setItem("slashai.basketball.best", String(nb));
        return nb;
      });
    }
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const step = () => {
      const b = ball.current;
      const h = hoop.current;

      if (phaseRef.current === "playing") {
        // power bar sweeps while the ball is waiting
        if (!b.live && !lockedRef.current) {
          powerRef.current += dirRef.current * 0.022;
          if (powerRef.current >= 1) {
            powerRef.current = 1;
            dirRef.current = -1;
          }
          if (powerRef.current <= 0) {
            powerRef.current = 0;
            dirRef.current = 1;
          }
        }

        if (b.live) {
          b.x += b.vx;
          b.y += b.vy;
          b.vy += GRAVITY;

          // through the rim?
          const atRim = Math.abs(b.y - h.y) < 14 && Math.abs(b.x - h.x) < RIM_R;
          if (!missedRef.current && b.vy > 0 && atRim) {
            missedRef.current = true;
            madeRef.current += 1;
            streakRef.current += 1;
            scoreRef.current += 2 + (streakRef.current >= 3 ? 1 : 0);
            setScore(scoreRef.current);
            setMade(madeRef.current);
            setStreak(streakRef.current);
          }

          if (b.y > H + 60 || b.x > W + 60 || b.x < -60) {
            shotsRef.current += 1;
            setShots(shotsRef.current);
            if (!missedRef.current) {
              streakRef.current = 0;
              setStreak(0);
            }
            resetBall();
          }
        }
      }

      // ── draw ──────────────────────────────────────────────────────────
      ctx.fillStyle = "#0a0d12";
      ctx.fillRect(0, 0, W, H);
      // court floor
      ctx.fillStyle = "#132033";
      ctx.fillRect(0, H - 34, W, 34);
      ctx.strokeStyle = "rgba(45,212,191,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, H - 34);
      ctx.lineTo(W, H - 34);
      ctx.stroke();

      const hp = hoop.current;
      const ballNow = ball.current;

      // backboard + rim
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(hp.x - 4, hp.y - 60, 12, 64);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(hp.x + 8, hp.y - 60, 74, 64);
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(hp.x - RIM_R, hp.y);
      ctx.lineTo(hp.x + RIM_R, hp.y);
      ctx.stroke();
      // net
      ctx.strokeStyle = "rgba(226,232,240,0.45)";
      ctx.lineWidth = 1;
      for (let i = -RIM_R; i <= RIM_R; i += 8) {
        ctx.beginPath();
        ctx.moveTo(hp.x + i, hp.y);
        ctx.lineTo(hp.x + i * 0.45, hp.y + 26);
        ctx.stroke();
      }

      // ball
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(ballNow.x + 3, H - 22, BALL_R, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(ballNow.x, ballNow.y, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#7c2d12";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(ballNow.x, ballNow.y, BALL_R, 0, Math.PI);
      ctx.moveTo(ballNow.x - BALL_R, ballNow.y);
      ctx.lineTo(ballNow.x + BALL_R, ballNow.y);
      ctx.stroke();

      // power meter
      ctx.fillStyle = "rgba(255,255,255,0.10)";
      ctx.fillRect(18, H - 120, 16, 100);
      const grad = ctx.createLinearGradient(0, H - 20, 0, H - 120);
      grad.addColorStop(0, "#22c55e");
      grad.addColorStop(1, "#ef4444");
      ctx.fillStyle = grad;
      const barH = Math.max(2, powerRef.current * 100);
      ctx.fillRect(18, H - 20 - barH, 16, barH);

      // aim guide while charging
      if (phaseRef.current === "playing" && !ballNow.live) {
        ctx.strokeStyle = "rgba(226,232,240,0.25)";
        ctx.setLineDash([5, 6]);
        ctx.beginPath();
        ctx.moveTo(ballNow.x, ballNow.y);
        ctx.lineTo(hp.x, hp.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (phaseRef.current === "playing") shoot();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shoot]);

  const accuracy = shots > 0 ? Math.round((made / shots) * 100) : 0;

  return (
    <AppShell title="Basketball">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏀 Basketball</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sixty seconds of shooting. Tap the court (or hit space) when the power bar hits the sweet spot — the hoop keeps moving.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Points</p>
            <p className="text-[18px] font-black text-[#2dd4bf]">{score}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Shots</p>
            <p className="text-[18px] font-black text-foreground">{shots}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Streak</p>
            <p className="text-[18px] font-black text-amber-400">{streak}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Time</p>
            <p className="text-[18px] font-black text-foreground">{timeLeft}s</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-surface">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full touch-none select-none"
            style={{ aspectRatio: `${W} / ${H}`, maxHeight: "58vh" }}
            onPointerDown={shoot}
          />
          {phase !== "playing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 px-6 text-center">
              <p className="text-[22px] font-black text-foreground">
                {phase === "over" ? `Time! ${score} points` : "🏀 Basketball"}
              </p>
              {phase === "over" && (
                <p className="text-[13px] text-muted-foreground">
                  {shots} shots taken · best {Math.max(best, score)}
                </p>
              )}
              <button onClick={start} className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-background">
                {phase === "over" ? "↻ Play again" : "▶ Tip off"}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Best score {Math.max(best, score)} · three in a row turns twos into threes
          {phase === "over" && accuracy > 0 ? ` · ${accuracy}% from the field` : ""}
        </p>
      </div>
    </AppShell>
  );
}
