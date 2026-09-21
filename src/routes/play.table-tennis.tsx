import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/table-tennis")({ component: TableTennis });

/**
 * Table Tennis — top-down view of the table, the way the sport actually works:
 * you move your paddle left/right along the near edge and the ball must clear
 * the net into the far half. Spinning the paddle tilts the ball's return.
 * First to 11, win by 2 — real table tennis scoring. Beats AI or a friend.
 */

const W = 400;
const H = 620;
const PADDLE_W = 92;
const PADDLE_H = 12;
const BALL_R = 8;
const WIN_SCORE = 11;
const AI_SPEED = { Easy: 2.6, Medium: 4.2, Hard: 6.1 } as const;
type Level = keyof typeof AI_SPEED;

interface Ball { x: number; y: number; vx: number; vy: number; spin: number }
interface State {
  ball: Ball;
  playerX: number;
  aiX: number;
  playerScore: number;
  aiScore: number;
  lastPaddleDx: number;
  server: "you" | "ai";
  over: boolean;
  winner: "" | "you" | "ai";
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function serve(towardsPlayer: boolean): Ball {
  const angle = (Math.random() - 0.5) * 0.7;
  const speed = 5.4;
  return {
    x: W / 2 + (Math.random() - 0.5) * 80,
    y: H / 2,
    vx: Math.sin(angle) * speed,
    vy: (towardsPlayer ? 1 : -1) * Math.cos(angle) * speed,
    spin: 0,
  };
}

function initial(server: "you" | "ai" = "you"): State {
  return {
    ball: serve(server === "ai"),
    playerX: W / 2,
    aiX: W / 2,
    playerScore: 0,
    aiScore: 0,
    lastPaddleDx: 0,
    server,
    over: false,
    winner: "",
  };
}

function TableTennis() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<State>(initial());
  const pointerRef = useRef<number | null>(null);
  const keyRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const [level, setLevel] = useState<Level>("Medium");
  const [score, setScore] = useState({ you: 0, ai: 0 });
  const [outcome, setOutcome] = useState<"" | "you" | "ai">("");
  const [playing, setPlaying] = useState(false);
  const [best, setBest] = useState<number>(() => Number(localStorage.getItem("slashai.tt.wins")) || 0);
  const levelRef = useRef<Level>(level);
  levelRef.current = level;

  const newGame = useCallback(() => {
    stateRef.current = initial("you");
    setScore({ you: 0, ai: 0 });
    setOutcome("");
    setPlaying(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const step = () => {
      const s = stateRef.current;
      if (playing && !s.over) {
        // ── player paddle ───────────────────────────────────────────────
        const prevX = s.playerX;
        if (pointerRef.current !== null) {
          s.playerX = clamp(pointerRef.current, PADDLE_W / 2, W - PADDLE_W / 2);
        } else {
          const k = keyRef.current;
          s.playerX = clamp(s.playerX + (k.right ? 7 : 0) - (k.left ? 7 : 0), PADDLE_W / 2, W - PADDLE_W / 2);
        }
        s.lastPaddleDx = s.playerX - prevX;

        // ── AI paddle: tracks the ball, with a small reaction offset ────
        const speed = AI_SPEED[levelRef.current];
        const target = s.ball.vy < 0 ? s.ball.x : W / 2;
        const drift = clamp(target - s.aiX, -speed, speed);
        s.aiX = clamp(s.aiX + drift, PADDLE_W / 2, W - PADDLE_W / 2);

        // ── ball ────────────────────────────────────────────────────────
        s.ball.x += s.ball.vx + s.ball.spin;
        s.ball.y += s.ball.vy;
        s.ball.spin *= 0.985;

        // side walls
        if (s.ball.x < BALL_R) {
          s.ball.x = BALL_R;
          s.ball.vx = Math.abs(s.ball.vx);
        } else if (s.ball.x > W - BALL_R) {
          s.ball.x = W - BALL_R;
          s.ball.vx = -Math.abs(s.ball.vx);
        }

        // AI paddle (top)
        if (s.ball.vy < 0 && s.ball.y - BALL_R <= PADDLE_H + 16) {
          const half = PADDLE_W / 2;
          if (Math.abs(s.ball.x - s.aiX) <= half + BALL_R) {
            s.ball.y = PADDLE_H + 16 + BALL_R;
            const off = (s.ball.x - s.aiX) / half;
            s.ball.vy = Math.abs(s.ball.vy) * 1.03;
            s.ball.vx = clamp(s.ball.vx + off * 2.2, -7, 7);
            s.ball.spin = off * 0.8;
          }
        }

        // player paddle (bottom)
        if (s.ball.vy > 0 && s.ball.y + BALL_R >= H - PADDLE_H - 16) {
          const half = PADDLE_W / 2;
          if (Math.abs(s.ball.x - s.playerX) <= half + BALL_R) {
            s.ball.y = H - PADDLE_H - 16 - BALL_R;
            const off = (s.ball.x - s.playerX) / half;
            s.ball.vy = -Math.abs(s.ball.vy) * 1.03;
            s.ball.vx = clamp(s.ball.vx + off * 2.2, -7, 7);
            s.ball.spin = s.lastPaddleDx * 0.06;
          }
        }

        // ── scoring ─────────────────────────────────────────────────────
        const winBy2 = (a: number, b: number) => a >= WIN_SCORE && a - b >= 2;
        if (s.ball.y < -20) {
          s.playerScore += 1;
          s.server = "you";
          setScore({ you: s.playerScore, ai: s.aiScore });
          if (winBy2(s.playerScore, s.aiScore)) {
            s.over = true;
            s.winner = "you";
            setOutcome("you");
            setBest((b) => {
              const nb = b + 1;
              localStorage.setItem("slashai.tt.wins", String(nb));
              return nb;
            });
          } else s.ball = serve(false);
        } else if (s.ball.y > H + 20) {
          s.aiScore += 1;
          s.server = "ai";
          setScore({ you: s.playerScore, ai: s.aiScore });
          if (winBy2(s.aiScore, s.playerScore)) {
            s.over = true;
            s.winner = "ai";
            setOutcome("ai");
          } else s.ball = serve(true);
        }
      }
      draw(ctx);
      raf = requestAnimationFrame(step);
    };

    const draw = (c: CanvasRenderingContext2D) => {
      const s = stateRef.current;
      c.fillStyle = "#0a0d12";
      c.fillRect(0, 0, W, H);

      // table
      c.fillStyle = "#0e2f2a";
      c.fillRect(14, 10, W - 28, H - 20);
      c.strokeStyle = "rgba(45,212,191,0.55)";
      c.lineWidth = 3;
      c.strokeRect(14, 10, W - 28, H - 20);

      // net
      c.strokeStyle = "rgba(226,232,240,0.7)";
      c.setLineDash([7, 6]);
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(14, H / 2);
      c.lineTo(W - 14, H / 2);
      c.stroke();
      c.setLineDash([]);

      // centre line on the real table runs along the length
      c.strokeStyle = "rgba(226,232,240,0.16)";
      c.beginPath();
      c.moveTo(W / 2, 10);
      c.lineTo(W / 2, H - 10);
      c.stroke();

      // paddles
      const paddle = (x: number, y: number, color: string) => {
        c.fillStyle = color;
        c.fillRect(x - PADDLE_W / 2, y, PADDLE_W, PADDLE_H);
        c.fillStyle = "rgba(255,255,255,0.22)";
        c.fillRect(x - PADDLE_W / 2, y + (color.startsWith("#2dd4") ? 0 : PADDLE_H - 3), PADDLE_W, 3);
        c.fillStyle = "#5b3a1e";
        c.fillRect(x - 4, y + (color.startsWith("#2dd4") ? PADDLE_H : -7), 8, 7);
      };
      paddle(s.aiX, 14, "#f472b6");
      paddle(s.playerX, H - PADDLE_H - 14, "#2dd4bf");

      // ball + shadow
      c.fillStyle = "rgba(0,0,0,0.35)";
      c.beginPath();
      c.ellipse(s.ball.x + 2, s.ball.y + 3, BALL_R, BALL_R * 0.8, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#fbbf24";
      c.beginPath();
      c.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "rgba(255,255,255,0.55)";
      c.beginPath();
      c.arc(s.ball.x - 2.5, s.ball.y - 2.5, 2.4, 0, Math.PI * 2);
      c.fill();
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        keyRef.current.left = true;
        pointerRef.current = null;
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        keyRef.current.right = true;
        pointerRef.current = null;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") keyRef.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keyRef.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const movePointer = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    pointerRef.current = ((clientX - rect.left) / rect.width) * W;
  };

  return (
    <AppShell title="Table Tennis">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏓 Table Tennis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real top-down table. Drag or use ←/→ to return, first to 11 wins by 2. Sidestep as you hit to add spin.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">You</p>
            <p className="text-[20px] font-black text-[#2dd4bf]">{score.you}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rally best</p>
            <p className="text-[20px] font-black text-foreground">{best}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">AI</p>
            <p className="text-[20px] font-black text-[#f472b6]">{score.ai}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-surface">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full touch-none select-none"
            style={{ aspectRatio: `${W} / ${H}`, maxHeight: "62vh" }}
            onMouseMove={(e) => movePointer(e.clientX)}
            onMouseLeave={() => (pointerRef.current = null)}
            onTouchStart={(e) => movePointer(e.touches[0]!.clientX)}
            onTouchMove={(e) => {
              e.preventDefault();
              movePointer(e.touches[0]!.clientX);
            }}
            onTouchEnd={() => (pointerRef.current = null)}
          />

          {!playing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 px-6 text-center">
              <p className="text-[22px] font-black text-foreground">🏓 Table Tennis</p>
              <div className="flex gap-1.5">
                {(Object.keys(AI_SPEED) as Level[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      level === l ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <button onClick={newGame} className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-background">
                ▶ Start match
              </button>
            </div>
          )}

          {outcome && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 px-6 text-center">
              <p className="text-[26px] font-black text-foreground">
                {outcome === "you" ? "🏆 You win the match!" : "😤 AI takes it"}
              </p>
              <p className="text-[15px] text-muted-foreground">
                {score.you} – {score.ai}
              </p>
              <button onClick={newGame} className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-background">
                ↻ Rematch
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Serving: {stateRef.current.server === "you" ? "you" : "AI"}</span>
          {playing && !outcome && (
            <button onClick={() => setPlaying(false)} className="font-semibold text-primary hover:underline">
              Change difficulty
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
