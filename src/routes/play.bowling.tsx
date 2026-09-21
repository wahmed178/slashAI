import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/bowling")({ component: Bowling });

/**
 * Ten-pin Bowling — a real lane with a real scorecard. Ten frames, two balls
 * each. A strike adds the next two balls and a spare adds the next ball, which
 * is how league bowling scores. Pins hit each other, so dominoes happen.
 */

const W = 380;
const H = 660;
const LANE_L = 46;
const LANE_R = 334;
const CENTRE = (LANE_L + LANE_R) / 2;
const PIN_R = 9;
const BALL_R = 15;
const PIN_SPACING = 34;
const ROW_SPACING = 32;
const HEAD_Y = 104;

interface Pin { x: number; y: number; hx: number; hy: number; vx: number; vy: number; down: boolean }

function makePins(): Pin[] {
  const pins: Pin[] = [];
  for (let row = 0; row < 4; row++) {
    for (let c = 0; c <= row; c++) {
      const x = CENTRE + (c - row / 2) * PIN_SPACING;
      const y = HEAD_Y + row * ROW_SPACING;
      pins.push({ x, y, hx: x, hy: y, vx: 0, vy: 0, down: false });
    }
  }
  return pins;
}

/** standard ten-pin scoring over the ten frames */
function scoreGame(frames: number[][]): number {
  const rolls: number[] = [];
  const starts: number[] = [];
  for (const f of frames) {
    starts.push(rolls.length);
    rolls.push(...f);
  }
  let total = 0;
  for (let i = 0; i < 10; i++) {
    const s = starts[i] ?? rolls.length;
    const r1 = rolls[s] ?? 0;
    const r2 = rolls[s + 1] ?? 0;
    if (r1 === 10) total += 10 + (rolls[s + 1] ?? 0) + (rolls[s + 2] ?? 0);
    else if (r1 + r2 === 10) total += 10 + (rolls[s + 2] ?? 0);
    else total += r1 + r2;
  }
  return total;
}

function Bowling() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<"idle" | "aim" | "power" | "rolling" | "over">("idle");
  const [frames, setFrames] = useState<number[][]>(Array.from({ length: 10 }, () => []));
  const [frameIdx, setFrameIdx] = useState(0);
  const [ballNo, setBallNo] = useState(1);
  const [standing, setStanding] = useState(10);
  const [message, setMessage] = useState("Aim with ← → or drag, tap to arm power, tap again to roll.");
  const [gutter, setGutter] = useState(false);

  const pins = useRef<Pin[]>(makePins());
  const ballRef = useRef({ x: CENTRE, y: H - 60, vx: 0, vy: 0, rolling: false });
  const aimRef = useRef(0);
  const powerRef = useRef(0);
  const dirRef = useRef(1);
  const phaseRef = useRef<typeof phase>("idle");
  phaseRef.current = phase;
  const frameRef = useRef(0);
  const ballNoRef = useRef(1);
  const firstBallRef = useRef(0);
  const startStandingRef = useRef(10);
  const settledRef = useRef(0);

  const placeBall = useCallback((freshPins: boolean) => {
    if (freshPins) pins.current = makePins();
    else pins.current = pins.current.map((p) => ({ ...p, vx: 0, vy: 0 }));
    ballRef.current = { x: CENTRE + aimRef.current, y: H - 60, vx: 0, vy: 0, rolling: false };
    settledRef.current = 0;
  }, []);

  const start = useCallback(() => {
    pins.current = makePins();
    frameRef.current = 0;
    ballNoRef.current = 1;
    firstBallRef.current = 0;
    aimRef.current = 0;
    powerRef.current = 0;
    dirRef.current = 1;
    setFrames(Array.from({ length: 10 }, () => []));
    setFrameIdx(0);
    setBallNo(1);
    setStanding(10);
    setGutter(false);
    setMessage("Aim with ← → or drag, tap to arm power, tap again to roll.");
    setPhase("aim");
    placeBall(true);
  }, [placeBall]);

  /** called once the lane has settled after a ball */
  const finishRoll = useCallback((knocked: number, foul: boolean) => {
    const f = frameRef.current;
    const n = ballNoRef.current;
    const count = foul ? 0 : knocked;

    setFrames((prev) => {
      const next = prev.map((r) => [...r]);
      const frame = next[Math.min(f, 9)]!;
      if (n === 1) next[Math.min(f, 9)] = [count];
      else next[Math.min(f, 9)] = [frame[0] ?? firstBallRef.current, count];
      return next;
    });

    if (n === 1) firstBallRef.current = count;

    const strike = n === 1 && count === 10;
    const spare = n === 2 && firstBallRef.current + count === 10;

    if (foul) setMessage("Gutter ball — no pins.");
    else if (strike) setMessage("STRIKE! 🎳");
    else if (spare) setMessage("Spare! 🎳");
    else setMessage(`${count} pin${count === 1 ? "" : "s"} down.`);

    const frameOver = strike || n === 2;
    if (!frameOver) {
      ballNoRef.current = 2;
      setBallNo(2);
      placeBall(false);
      window.setTimeout(() => setPhase("aim"), 450);
      return;
    }

    const nf = f + 1;
    if (nf >= 10) {
      setPhase("over");
      return;
    }
    frameRef.current = nf;
    ballNoRef.current = 1;
    firstBallRef.current = 0;
    setFrameIdx(nf);
    setBallNo(1);
    setStanding(10);
    placeBall(true);
    window.setTimeout(() => setPhase("aim"), 450);
  }, [placeBall]);

  const roll = useCallback(() => {
    const b = ballRef.current;
    if (b.rolling) return;
    startStandingRef.current = pins.current.filter((p) => !p.down).length;
    b.vx = (aimRef.current / 120) * 1.2;
    b.vy = -(11 + powerRef.current * 11);
    b.rolling = true;
    setGutter(false);
    setPhase("rolling");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const settleAndFinish = () => {
      const b = ballRef.current;
      b.rolling = false;
      const standingNow = pins.current.filter((p) => !p.down).length;
      const knocked = Math.max(0, startStandingRef.current - standingNow);
      setStanding(standingNow);
      finishRoll(knocked, false);
    };

    const step = () => {
      const ph = phaseRef.current;
      const b = ballRef.current;
      const ps = pins.current;

      if (ph === "power") {
        powerRef.current += dirRef.current * 0.02;
        if (powerRef.current >= 1) {
          powerRef.current = 1;
          dirRef.current = -1;
        }
        if (powerRef.current <= 0) {
          powerRef.current = 0;
          dirRef.current = 1;
        }
      }

      if (ph === "rolling" && b.rolling) {
        b.x += b.vx;
        b.y += b.vy;
        b.vy *= 0.997;

        if (b.x < LANE_L - 30 || b.x > LANE_R + 30) {
          b.rolling = false;
          setGutter(true);
          finishRoll(0, true);
          draw(ctx);
          raf = requestAnimationFrame(step);
          return;
        }

        for (const p of ps) {
          if (p.down) continue;
          const dx = p.x - b.x;
          const dy = p.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < BALL_R + PIN_R && d > 0) {
            const nx = dx / d;
            const ny = dy / d;
            const push = Math.max(2.6, Math.hypot(b.vx, b.vy) * 0.55);
            p.vx += nx * push;
            p.vy += ny * push;
            p.x = b.x + nx * (BALL_R + PIN_R);
            p.y = b.y + ny * (BALL_R + PIN_R);
            b.vx *= 0.95;
            b.vy *= 0.97;
          }
        }

        for (let i = 0; i < ps.length; i++) {
          const a = ps[i]!;
          if (a.down) continue;
          for (let j = i + 1; j < ps.length; j++) {
            const c = ps[j]!;
            if (c.down) continue;
            const dx = c.x - a.x;
            const dy = c.y - a.y;
            const d = Math.hypot(dx, dy);
            if (d < PIN_R * 2 && d > 0) {
              const nx = dx / d;
              const ny = dy / d;
              const overlap = PIN_R * 2 - d;
              a.x -= nx * overlap * 0.5;
              a.y -= ny * overlap * 0.5;
              c.x += nx * overlap * 0.5;
              c.y += ny * overlap * 0.5;
              c.vx += nx * 1.7;
              c.vy += ny * 1.7;
              a.vx -= nx * 0.8;
              a.vy -= ny * 0.8;
            }
          }
        }

        for (const p of ps) {
          if (p.down) continue;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.93;
          p.vy *= 0.93;
          if (Math.hypot(p.vx, p.vy) < 0.05) {
            p.vx = 0;
            p.vy = 0;
          }
          if (Math.hypot(p.x - p.hx, p.y - p.hy) > 13 || p.y < HEAD_Y - 24) p.down = true;
        }

        const ballGone = b.y < HEAD_Y - 80;
        const stillMoving = ps.some((p) => !p.down && Math.hypot(p.vx, p.vy) > 0.06);
        if (ballGone && !stillMoving) {
          settledRef.current += 1;
          if (settledRef.current > 8) {
            settleAndFinish();
            draw(ctx);
            raf = requestAnimationFrame(step);
            return;
          }
        }
      }

      draw(ctx);
      raf = requestAnimationFrame(step);
    };

    const draw = (g: CanvasRenderingContext2D) => {
      const ph = phaseRef.current;
      g.fillStyle = "#0a0d12";
      g.fillRect(0, 0, W, H);

      const wood = g.createLinearGradient(LANE_L, 0, LANE_R, 0);
      wood.addColorStop(0, "#3b2a1a");
      wood.addColorStop(0.5, "#6b4a2a");
      wood.addColorStop(1, "#3b2a1a");
      g.fillStyle = wood;
      g.fillRect(LANE_L, 0, LANE_R - LANE_L, H);

      g.fillStyle = "rgba(255,255,255,0.45)";
      for (let i = -2; i <= 2; i++) {
        const x = CENTRE + i * 42;
        g.beginPath();
        g.moveTo(x, H - 300);
        g.lineTo(x - 7, H - 276);
        g.lineTo(x + 7, H - 276);
        g.closePath();
        g.fill();
      }
      g.strokeStyle = "rgba(255,255,255,0.18)";
      g.beginPath();
      g.moveTo(LANE_L, H - 120);
      g.lineTo(LANE_R, H - 120);
      g.stroke();

      for (const p of pins.current) {
        if (p.down) {
          g.fillStyle = "rgba(226,232,240,0.22)";
          g.beginPath();
          g.arc(p.x, p.y, PIN_R * 0.7, 0, Math.PI * 2);
          g.fill();
          continue;
        }
        g.fillStyle = "#f8fafc";
        g.beginPath();
        g.arc(p.x, p.y, PIN_R, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#dc2626";
        g.beginPath();
        g.arc(p.x, p.y - 3, 2.6, 0, Math.PI * 2);
        g.fill();
      }

      const bl = ballRef.current;
      g.fillStyle = "#0ea5e9";
      g.beginPath();
      g.arc(bl.x, bl.y, BALL_R, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "rgba(255,255,255,0.5)";
      g.beginPath();
      g.arc(bl.x - 4, bl.y - 5, 4.5, 0, Math.PI * 2);
      g.fill();

      if (ph === "aim" || ph === "power") {
        const ax = CENTRE + aimRef.current;
        g.strokeStyle = "rgba(45,212,191,0.75)";
        g.setLineDash([6, 6]);
        g.beginPath();
        g.moveTo(ax, H - 70);
        g.lineTo(ax, HEAD_Y + 120);
        g.stroke();
        g.setLineDash([]);
      }

      if (ph === "power") {
        g.fillStyle = "rgba(255,255,255,0.12)";
        g.fillRect(W - 34, H - 250, 18, 190);
        const grad = g.createLinearGradient(0, H - 60, 0, H - 250);
        grad.addColorStop(0, "#22c55e");
        grad.addColorStop(1, "#ef4444");
        g.fillStyle = grad;
        const bh = Math.max(2, powerRef.current * 190);
        g.fillRect(W - 34, H - 60 - bh, 18, bh);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [finishRoll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== "aim") return;
      if (e.key === "ArrowLeft") {
        aimRef.current = Math.max(-120, aimRef.current - 8);
        e.preventDefault();
      }
      if (e.key === "ArrowRight") {
        aimRef.current = Math.min(120, aimRef.current + 8);
        e.preventDefault();
      }
      if (e.key === " ") {
        e.preventDefault();
        setPhase("power");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    if (phaseRef.current === "aim") aimRef.current = Math.max(-120, Math.min(120, x - CENTRE));
  };

  const tap = () => {
    if (phaseRef.current === "aim") setPhase("power");
    else if (phaseRef.current === "power") roll();
  };

  const total = scoreGame(frames);
  const [best, setBest] = useState(() => Number(localStorage.getItem("slashai.bowling.best")) || 0);
  useEffect(() => {
    if (phase === "over" && total > best) {
      localStorage.setItem("slashai.bowling.best", String(total));
      setBest(total);
    }
  }, [phase, total, best]);

  const cellOf = (i: number): string => {
    const f = frames[i]!;
    if (!f.length) return "·";
    if (f[0] === 10) return "X";
    if (f.length === 2) {
      if (f[0]! + f[1]! === 10) return "／";
      return `${f[0]}${f[1] === 0 ? "–" : f[1]}`;
    }
    return `${f[0]}`;
  };

  return (
    <AppShell title="Bowling">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎳 Bowling</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ten frames, two balls each, real strike and spare scoring. Aim with ←/→ or drag, tap once to arm power, tap again to roll.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-[420px] gap-0.5 text-center text-[10px]">
            {frames.map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded border px-0.5 py-1 ${
                  i === frameIdx && phase !== "over" ? "border-primary bg-primary/10" : "border-border bg-surface"
                }`}
              >
                <div className="font-bold text-muted-foreground">{i + 1}</div>
                <div className="mt-0.5 font-black text-foreground">{cellOf(i)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2 text-[12px]">
          <span className="text-muted-foreground">
            Frame {Math.min(frameIdx + 1, 10)} · ball {ballNo} · <b className="text-foreground">{standing}</b> standing
          </span>
          <span className="font-black text-primary">Score {total}</span>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-surface">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full touch-none select-none"
            style={{ aspectRatio: `${W} / ${H}`, maxHeight: "58vh" }}
            onPointerDown={onPointer}
            onPointerMove={(e) => {
              if (e.buttons > 0) onPointer(e);
            }}
            onClick={tap}
          />
          {(phase === "idle" || phase === "over") && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 px-6 text-center">
              <p className="text-[22px] font-black text-foreground">
                {phase === "over" ? `Final score ${total}` : "🎳 Bowling"}
              </p>
              {phase === "over" && <p className="text-[13px] text-muted-foreground">Best {Math.max(best, total)}</p>}
              <button onClick={start} className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-background">
                {phase === "over" ? "↻ New game" : "▶ Start game"}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[12px] font-semibold text-foreground">{message}</p>
        {gutter && phase !== "idle" && <p className="text-center text-[11px] text-red-400">Watch the aim — that one went in the gutter.</p>}
      </div>
    </AppShell>
  );
}
