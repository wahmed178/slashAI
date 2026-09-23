import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/eight-ball")({ component: EightBall });

/**
 * 8-Ball Pool — real top-down billiards physics. Drag from the cue ball to
 * aim and power up; balls collide elastically and roll with friction.
 * Pocket your group (solids/strips assigned by first legal pot), then the
 * 8-ball to win. Potting the 8 early, or scratching on the black, loses.
 */

const W = 420;
const H = 560;
/** playing area inside the rail */
const T = 30;
const L = 20;
const R = W - 20;
const B = H - 20;
const BR = 9; // ball radius
const FRICTION = 0.9855;
const STOP = 0.045;

interface Ball {
  n: number; // 0 = cue
  x: number;
  y: number;
  vx: number;
  vy: number;
  on: boolean;
}

const POCKETS: { x: number; y: number; r: number }[] = [
  { x: L + 6, y: T + 6, r: 16 },
  { x: W / 2, y: T + 2, r: 15 },
  { x: R - 6, y: T + 6, r: 16 },
  { x: L + 6, y: B - 6, r: 16 },
  { x: W / 2, y: B - 2, r: 15 },
  { x: R - 6, y: B - 6, r: 16 },
];

function rack(): Ball[] {
  const balls: Ball[] = [{ n: 0, x: W / 2, y: H * 0.78, vx: 0, vy: 0, on: true }];
  // triangle at the foot spot; 8 in the middle of the third row
  const order = [1, 9, 2, 10, 8, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15];
  let i = 0;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= row; col++) {
      const x = W / 2 + (col - row / 2) * (BR * 2 + 0.6);
      const y = H * 0.32 + row * (BR * 1.74 + 0.4);
      balls.push({ n: order[i++]!, x, y, vx: 0, vy: 0, on: true });
    }
  }
  return balls;
}

const ballColor = (n: number): string =>
  n === 0
    ? "#f8fafc"
    : n === 8
      ? "#111827"
      : ["#fbbf24", "#1d4ed8", "#dc2626", "#7c3aed", "#ea580c", "#15803d", "#a21caf"][((n - 1) % 7)] ?? "#fbbf24";

function EightBall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [msg, setMsg] = useState("");
  const [winner, setWinner] = useState<"p1" | "p2" | null>(null);
  const [groups, setGroups] = useState<{ p1: "solids" | "stripes" | null; p2: "solids" | "stripes" | null }>({ p1: null, p2: null });

  const balls = useRef<Ball[]>([]);
  const turn = useRef<"p1" | "p2">("p1");
  const groupsRef = useRef(groups);
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const moving = useRef(false);
  const firstHit = useRef<number | null>(null);
  const pottedThisShot = useRef<number[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    groupsRef.current = groups;
  }, [groups]);

  const start = useCallback(() => {
    balls.current = rack();
    turn.current = "p1";
    setGroups({ p1: null, p2: null });
    setWinner(null);
    setMsg("Player 1 — break!");
    setPhase("play");
  }, []);

  const endShot = useCallback(() => {
    const gs = groupsRef.current;
    const me = turn.current;
    const opp = me === "p1" ? "p2" : "p1";
    const myGroup = gs[me];
    const potted = pottedThisShot.current;
    let nextTurn: "p1" | "p2" = opp;

    // decide groups on first legal pot
    if (!gs.p1 && !gs.p2) {
      const solid = potted.find((n) => n >= 1 && n <= 7);
      const stripe = potted.find((n) => n >= 9 && n <= 15);
      if (solid !== undefined && !potted.includes(8)) {
        gs[me] = "solids";
        gs[opp] = "stripes";
      } else if (stripe !== undefined && !potted.includes(8)) {
        gs[me] = "stripes";
        gs[opp] = "solids";
      }
      setGroups({ ...gs });
    }

    // 8-ball outcomes
    if (potted.includes(8)) {
      const cleared = myGroup
        ? balls.current.filter((b) => b.on && isMyBall(b.n, myGroup)).length === 0
        : false;
      if (cleared && !scratched()) {
        setWinner(me);
        setMsg(`${me === "p1" ? "Player 1" : "Player 2"} wins! 🏆`);
      } else {
        setWinner(opp);
        setMsg(`8-ball down illegally — ${opp === "p1" ? "Player 1" : "Player 2"} wins`);
      }
      setPhase("over");
      return;
    }
    if (scratched()) {
      nextTurn = opp;
      setMsg("Scratch! Ball in hand for the opponent.");
    } else if (potted.length > 0 && myGroup && potted.some((n) => isMyBall(n, myGroup))) {
      nextTurn = me; // pot your own, keep shooting
      setMsg(`${me === "p1" ? "Player 1" : "Player 2"} stays on`);
    } else {
      setMsg(potted.length ? "Wrong ball — turn passes" : "Turn passes");
    }
    turn.current = nextTurn;
    pottedThisShot.current = [];
    firstHit.current = null;
    moving.current = false;
    setMsg((m) => m);
  }, []);

  /** cue ball off the table */
  const scratched = () => !balls.current[0]!.on;

  const isMyBall = (n: number, g: "solids" | "stripes") => (g === "solids" ? n >= 1 && n <= 7 : n >= 9 && n <= 15);

  useEffect(() => {
    if (phase !== "play") return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const drawBall = (b: Ball) => {
      ctx.fillStyle = ballColor(b.n);
      ctx.beginPath();
      ctx.arc(b.x, b.y, BR, 0, Math.PI * 2);
      ctx.fill();
      if (b.n !== 0) {
        const stripe = b.n >= 9;
        if (stripe) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(b.x, b.y, BR, 0, Math.PI * 2);
          ctx.clip();
          ctx.fillStyle = "#f8fafc";
          ctx.fillRect(b.x - BR, b.y - 4.5, BR * 2, 9);
          ctx.fillStyle = ballColor(b.n);
          ctx.beginPath();
          ctx.arc(b.x, b.y, 3.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = "#f8fafc";
          ctx.beginPath();
          ctx.arc(b.x, b.y, 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#111827";
        ctx.font = "bold 5px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(String(b.n), b.x, b.y + 2);
      }
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(b.x, b.y, BR, 0, Math.PI * 2);
      ctx.stroke();
    };

    const step = () => {
      const bs = balls.current.filter((b) => b.on);
      let anyMoving = false;
      for (const b of bs) {
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= FRICTION;
        b.vy *= FRICTION;
        if (Math.hypot(b.vx, b.vy) < STOP) {
          b.vx = 0;
          b.vy = 0;
        } else {
          anyMoving = true;
        }
        // rails
        if (b.x < L + BR) {
          b.x = L + BR;
          b.vx *= -0.92;
        }
        if (b.x > R - BR) {
          b.x = R - BR;
          b.vx *= -0.92;
        }
        if (b.y < T + BR) {
          b.y = T + BR;
          b.vy *= -0.92;
        }
        if (b.y > B - BR) {
          b.y = B - BR;
          b.vy *= -0.92;
        }
        // pockets
        for (const p of POCKETS) {
          if (Math.hypot(b.x - p.x, b.y - p.y) < p.r + 3) {
            b.on = false;
            if (b.n === 0) {
              /* scratch handled at rest */
            } else {
              pottedThisShot.current.push(b.n);
            }
            break;
          }
        }
      }
      // elastic collisions
      for (let i = 0; i < bs.length; i++) {
        for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i]!;
          const c = bs[j]!;
          const dx = c.x - a.x;
          const dy = c.y - a.y;
          const d = Math.hypot(dx, dy);
          if (d < BR * 2 && d > 0) {
            const nx = dx / d;
            const ny = dy / d;
            const overlap = BR * 2 - d;
            a.x -= nx * overlap * 0.5;
            a.y -= ny * overlap * 0.5;
            c.x += nx * overlap * 0.5;
            c.y += ny * overlap * 0.5;
            const p = (a.vx * nx + a.vy * ny) - (c.vx * nx + c.vy * ny);
            if (p > 0) {
              a.vx -= p * nx;
              a.vy -= p * ny;
              c.vx += p * nx;
              c.vy += p * ny;
              if (a.n === 0) firstHit.current = c.n;
              if (c.n === 0) firstHit.current = a.n;
            }
          }
        }
      }
      return anyMoving;
    };

    const loop = () => {
      // table
      ctx.fillStyle = "#14532d";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#166534";
      ctx.fillRect(L, T, R - L, B - T);
      // pockets
      for (const p of POCKETS) {
        ctx.fillStyle = "#0a0a0a";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // spots
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.arc(W / 2, H * 0.32, 3, 0, Math.PI * 2);
      ctx.fill();

      const wasMoving = moving.current;
      const still = step();
      moving.current = still;
      if (wasMoving && !still) endShot();

      for (const b of balls.current) if (b.on) drawBall(b);

      // aim line + power
      const cue = balls.current[0]!;
      if (dragging.current && !moving.current && cue.on) {
        const d = dragging.current;
        const dx = cue.x - d.x;
        const dy = cue.y - d.y;
        const len = Math.hypot(dx, dy);
        if (len > 4) {
          const power = Math.min(len, 160) / 160;
          ctx.strokeStyle = "rgba(255,255,255,0.8)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 7]);
          ctx.beginPath();
          ctx.moveTo(cue.x, cue.y);
          // ghost-ball projection
          const ex = cue.x + (dx / len) * 300;
          const ey = cue.y + (dy / len) * 300;
          ctx.lineTo(ex, ey);
          ctx.stroke();
          ctx.setLineDash([]);
          // cue stick
          ctx.strokeStyle = "#a16207";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(cue.x - (dx / len) * (30 + power * 40), cue.y - (dy / len) * (30 + power * 40));
          ctx.lineTo(cue.x - (dx / len) * 90, cue.y - (dy / len) * 90);
          ctx.stroke();
        }
      }

      // HUD
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "left";
      const g = groupsRef.current;
      ctx.fillText(`P1 ${g.p1 ?? "—"}  ·  ${balls.current.filter((b) => b.on && isMyBall(b.n, g.p1 ?? "solids") && b.n !== 0 && b.n !== 8).length} left`, 12, 20);
      ctx.textAlign = "right";
      ctx.fillText(`P2 ${g.p2 ?? "—"}  ·  ${balls.current.filter((b) => b.on && isMyBall(b.n, g.p2 ?? "solids") && b.n !== 0 && b.n !== 8).length} left`, W - 12, 20);
      ctx.textAlign = "center";
      ctx.fillStyle = turn.current === "p1" ? "#60a5fa" : "#f87171";
      ctx.fillText(`${msg} (${turn.current === "p1" ? "P1" : "P2"})`, W / 2, H - 6);

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, msg, endShot]);

  const pointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "play" || moving.current) return;
    const cv = canvasRef.current!;
    const rect = cv.getBoundingClientRect();
    dragging.current = {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  };

  const pointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const d = dragging.current;
    dragging.current = null;
    if (!d || phase !== "play" || moving.current) return;
    const cv = canvasRef.current!;
    const rect = cv.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const cue = balls.current[0]!;
    if (!cue.on) {
      // ball in hand after scratch: place it
      cue.on = true;
      cue.x = Math.max(L + BR + 2, Math.min(R - BR - 2, x));
      cue.y = Math.max(T + BR + 2, Math.min(B - BR - 2, y));
      return;
    }
    const dx = cue.x - x;
    const dy = cue.y - y;
    const len = Math.hypot(dx, dy);
    if (len < 10) return;
    const power = (Math.min(len, 160) / 160) * 15.5;
    cue.vx = (dx / len) * power;
    cue.vy = (dy / len) * power;
    moving.current = true;
  };

  const myTurnLabel = turn.current === "p1" ? "Player 1" : "Player 2";

  return (
    <AppShell title="8-Ball Pool">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎱 8-Ball Pool</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real cushions and collisions — 2-player pass-and-play. Pot your set, then the black.
        </p>
      </header>
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full cursor-crosshair touch-none select-none"
            onPointerDown={pointerDown}
            onPointerUp={pointerUp}
          />
          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
              <p className="text-5xl">🎱</p>
              <button onClick={start} className="rounded-xl bg-primary px-6 py-3 font-semibold text-background active:scale-95">
                Break!
              </button>
            </div>
          )}
          {phase === "over" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/85 backdrop-blur-sm">
              <p className="text-3xl font-black text-foreground">{winner === "p1" ? "🏆 Player 1" : "🏆 Player 2"}</p>
              <p className="text-sm text-muted-foreground">{msg}</p>
              <button onClick={start} className="rounded-xl bg-primary px-6 py-3 font-semibold text-background active:scale-95">
                Rack again
              </button>
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {myTurnLabel}: drag from the white ball, release to shoot. Scratch = ball in hand for the opponent.
        </p>
      </div>
    </AppShell>
  );
}
