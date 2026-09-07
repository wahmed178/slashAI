import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/breakout")({ component: Breakout });

const W = 400;
const H = 560;
const ROWS = 6;
const COLS = 8;
const PAD_W = 72;
const PAD_T = 10;
const PAD_Y = H - 34;
const R = 5;
const BRICK_COLORS = ["#2dd4bf", "#38bdf8", "#a78bfa", "#fbbf24", "#fb923c", "#f87171"];

interface BState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  padX: number;
  bricks: boolean[][];
  score: number;
  lives: number;
  level: number;
  speed: number;
  launched: boolean;
}

function makeBricks() {
  return Array.from({ length: ROWS }, () => Array<boolean>(COLS).fill(true));
}

function freshBall(): Pick<BState, "x" | "y" | "vx" | "vy" | "launched"> {
  return { x: W / 2, y: PAD_Y - 12, vx: 0, vy: 0, launched: false };
}

function freshState(): BState {
  return {
    ...freshBall(),
    padX: W / 2,
    bricks: makeBricks(),
    score: 0,
    lives: 3,
    level: 1,
    speed: 4,
  };
}

function brickRect(row: number, col: number) {
  const pad = 16;
  const gap = 4;
  const bw = (W - pad * 2 - (COLS - 1) * gap) / COLS;
  const bh = 18;
  const top = 64;
  return { x: pad + col * (bw + gap), y: top + row * (bh + gap), w: bw, h: bh };
}

function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState<"none" | "lost" | "won">("none");
  const stateRef = useRef<BState>(freshState());
  const keys = useRef(new Set<string>());
  const runningRef = useRef(running);
  runningRef.current = running;
  const overRef = useRef(over);
  overRef.current = over;

  function launch() {
    const s = stateRef.current;
    if (s.launched) return;
    const angle = -Math.PI / 2 + (Math.random() * 0.6 - 0.3);
    s.vx = Math.cos(angle) * s.speed;
    s.vy = Math.sin(angle) * s.speed;
    s.launched = true;
  }

  function start() {
    stateRef.current = freshState();
    setOver("none");
    setRunning(true);
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      if (e.key === " ") {
        const s = stateRef.current;
        if (!s.launched && runningRef.current && overRef.current === "none") launch();
        return;
      }
      keys.current.add(e.key);
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;

    const step = () => {
      const s = stateRef.current;
      const active = runningRef.current && overRef.current === "none";

      if (active) {
        if (keys.current.has("ArrowLeft")) s.padX -= 8;
        if (keys.current.has("ArrowRight")) s.padX += 8;
        s.padX = Math.max(PAD_W / 2, Math.min(W - PAD_W / 2, s.padX));

        if (s.launched) {
          s.x += s.vx;
          s.y += s.vy;

          if (s.x < R) {
            s.x = R;
            s.vx = Math.abs(s.vx);
          }
          if (s.x > W - R) {
            s.x = W - R;
            s.vx = -Math.abs(s.vx);
          }
          if (s.y < R) {
            s.y = R;
            s.vy = Math.abs(s.vy);
          }

          // paddle
          if (
            s.vy > 0 &&
            s.y + R >= PAD_Y &&
            s.y + R <= PAD_Y + PAD_T + 6 &&
            s.x > s.padX - PAD_W / 2 - R &&
            s.x < s.padX + PAD_W / 2 + R
          ) {
            s.y = PAD_Y - R;
            s.vy = -Math.abs(s.vy);
            s.vx += ((s.x - s.padX) / (PAD_W / 2)) * 2.4;
            const maxVx = s.speed * 0.9;
            s.vx = Math.max(-maxVx, Math.min(maxVx, s.vx));
          }

          // bricks
          for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
              if (!s.bricks[row]![col]) continue;
              const b = brickRect(row, col);
              if (s.x + R > b.x && s.x - R < b.x + b.w && s.y + R > b.y && s.y - R < b.y + b.h) {
                s.bricks[row]![col] = false;
                s.score += (ROWS - row) * 10;
                const overlapX = Math.min(s.x + R - b.x, b.x + b.w - (s.x - R));
                const overlapY = Math.min(s.y + R - b.y, b.y + b.h - (s.y - R));
                if (overlapX < overlapY) s.vx = -s.vx;
                else s.vy = -s.vy;
                row = ROWS;
                break;
              }
            }
          }

          // level clear
          let alive = 0;
          for (const rowB of s.bricks) for (const v of rowB) if (v) alive++;
          if (alive === 0) {
            s.level++;
            s.speed += 0.4;
            s.bricks = makeBricks();
            Object.assign(s, freshBall());
            s.padX = W / 2;
          }

          // ball lost
          if (s.y > H + 10) {
            s.lives--;
            if (s.lives <= 0) {
              setOver("lost");
              setRunning(false);
            } else {
              Object.assign(s, freshBall());
              s.padX = W / 2;
            }
          }
        }
      }

      // draw
      ctx.fillStyle = "#0a0d12";
      ctx.fillRect(0, 0, W, H);

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (!s.bricks[row]![col]) continue;
          const b = brickRect(row, col);
          ctx.fillStyle = BRICK_COLORS[row] ?? "#2dd4bf";
          ctx.beginPath();
          ctx.roundRect(b.x, b.y, b.w, b.h, 3);
          ctx.fill();
        }
      }

      ctx.fillStyle = "#2dd4bf";
      ctx.beginPath();
      ctx.roundRect(s.padX - PAD_W / 2, PAD_Y, PAD_W, PAD_T, 5);
      ctx.fill();

      ctx.fillStyle = "#e5e7eb";
      ctx.beginPath();
      ctx.arc(s.x, s.y, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "bold 14px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "left";
      ctx.fillText(`Score ${s.score}`, 12, 24);
      ctx.textAlign = "right";
      ctx.fillText(`Lives ${"❤".repeat(Math.max(0, s.lives))}`, W - 12, 24);
      ctx.fillText(`Lv ${s.level}`, W - 12, 44);

      if (active && !s.launched) {
        ctx.font = "bold 13px system-ui";
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.textAlign = "center";
        ctx.fillText("Tap or press Space to launch", W / 2, H / 2 + 40);
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const s = stateRef.current;

  return (
    <AppShell title="Breakout">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🧱 Breakout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag or use arrow keys to move the paddle. Clear every brick to level up - you get 3 lives.
        </p>
      </header>

      <div className="mx-auto max-w-md">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onPointerDown={(e) => {
              const canvas = canvasRef.current;
              if (!canvas) return;
              canvas.setPointerCapture(e.pointerId);
              const rect = canvas.getBoundingClientRect();
              stateRef.current.padX = Math.max(
                PAD_W / 2,
                Math.min(W - PAD_W / 2, ((e.clientX - rect.left) / rect.width) * W),
              );
              launch();
            }}
            onPointerMove={(e) => {
              const canvas = canvasRef.current;
              if (!canvas || !canvas.hasPointerCapture(e.pointerId)) return;
              const rect = canvas.getBoundingClientRect();
              stateRef.current.padX = Math.max(
                PAD_W / 2,
                Math.min(W - PAD_W / 2, ((e.clientX - rect.left) / rect.width) * W),
              );
            }}
            className="w-full touch-none rounded-xl border border-border"
            style={{ aspectRatio: `${W}/${H}` }}
          />
          {(!running || over !== "none") && (
            <div className="absolute inset-0 flex touch-none flex-col items-center justify-center gap-3 rounded-xl bg-black/65 text-center">
              {over === "lost" ? (
                <>
                  <p className="text-[20px] font-black text-foreground">Game over</p>
                  <p className="text-[13px] text-muted-foreground">Score {s.score} - level {s.level}</p>
                  <button onClick={start} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                    Play again
                  </button>
                </>
              ) : over === "won" ? (
                <p className="text-[18px] font-black text-foreground">You cleared everything! 🏆</p>
              ) : (
                <>
                  <p className="text-[17px] font-bold text-foreground">🧱 Breakout</p>
                  <button onClick={start} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                    Start game
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Top rows are worth more points. Edge hits send the ball flying at sharper angles.
        </p>
      </div>
    </AppShell>
  );
}
