import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/pong")({ component: Pong });

const W = 640;
const H = 400;
const PADDLE_H = 80;
const PADDLE_W = 12;
const WIN_SCORE = 7;

interface State {
  ball: { x: number; y: number; vx: number; vy: number; speed: number };
  left: number;
  right: number;
  scoreL: number;
  scoreR: number;
  serving: boolean;
  serveTimer: number;
}

function freshBall(speed = 4.5) {
  const angle = (Math.random() * 0.6 - 0.3) + (Math.random() < 0.5 ? 0 : Math.PI);
  return { x: W / 2, y: H / 2, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, speed };
}

function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"ai" | "2p">("ai");
  const [running, setRunning] = useState(false);
  const [winner, setWinner] = useState<0 | 1 | 2>(0);
  const stateRef = useRef<State>({
    ball: freshBall(),
    left: H / 2 - PADDLE_H / 2,
    right: H / 2 - PADDLE_H / 2,
    scoreL: 0,
    scoreR: 0,
    serving: false,
    serveTimer: 0,
  });
  const keys = useRef(new Set<string>());
  const touch = useRef<{ left: number | null; right: number | null }>({ left: null, right: null });
  const runningRef = useRef(running);
  runningRef.current = running;
  const modeRef = useRef(mode);
  modeRef.current = mode;

  function reset() {
    stateRef.current = {
      ball: freshBall(),
      left: H / 2 - PADDLE_H / 2,
      right: H / 2 - PADDLE_H / 2,
      scoreL: 0,
      scoreR: 0,
      serving: false,
      serveTimer: 0,
    };
    setWinner(0);
    setRunning(true);
  }

  // keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
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

  // touch: drag on left/right half controls that paddle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scaleY = (clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return ((clientY - rect.top) / rect.height) * H;
    };
    const apply = () => {
      if (touch.current.left !== null) stateRef.current.left = touch.current.left - PADDLE_H / 2;
      if (touch.current.right !== null) stateRef.current.right = touch.current.right - PADDLE_H / 2;
    };
    const onMove = (e: TouchEvent) => {
      for (const t of Array.from(e.touches)) {
        const rect = canvas.getBoundingClientRect();
        const x = ((t.clientX - rect.left) / rect.width) * W;
        const y = scaleY(t.clientY);
        if (x < W / 2) touch.current.left = y;
        else if (modeRef.current === "2p") touch.current.right = y;
      }
      apply();
    };
    const onEnd = () => {
      touch.current = { left: null, right: null };
    };
    canvas.addEventListener("touchstart", onMove, { passive: true });
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("touchend", onEnd);
    return () => {
      canvas.removeEventListener("touchstart", onMove);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onEnd);
    };
  }, []);

  // game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;

    const step = () => {
      const s = stateRef.current;
      const PADDLE_SPEED = 7;

      if (runningRef.current && winner === 0) {
        // keyboard paddles
        if (keys.current.has("w")) s.left -= PADDLE_SPEED;
        if (keys.current.has("s")) s.left += PADDLE_SPEED;
        const rightIsAI = modeRef.current === "ai";
        if (rightIsAI) {
          const target = s.ball.y - PADDLE_H / 2;
          const diff = target - s.right;
          s.right += Math.max(-5, Math.min(5, diff * 0.18));
        } else {
          if (keys.current.has("ArrowUp")) s.right -= PADDLE_SPEED;
          if (keys.current.has("ArrowDown")) s.right += PADDLE_SPEED;
        }
        s.left = Math.max(0, Math.min(H - PADDLE_H, s.left));
        s.right = Math.max(0, Math.min(H - PADDLE_H, s.right));

        // ball
        if (!s.serving) {
          s.ball.x += s.ball.vx;
          s.ball.y += s.ball.vy;
          if (s.ball.y < 4 || s.ball.y > H - 4) s.ball.vy = -s.ball.vy;

          // paddle collisions
          if (s.ball.x < 24 + PADDLE_W && s.ball.y > s.left && s.ball.y < s.left + PADDLE_H && s.ball.vx < 0) {
            s.ball.vx = Math.abs(s.ball.vx) * 1.04;
            s.ball.vy += ((s.ball.y - (s.left + PADDLE_H / 2)) / (PADDLE_H / 2)) * 2;
          }
          if (s.ball.x > W - 24 - PADDLE_W && s.ball.y > s.right && s.ball.y < s.right + PADDLE_H && s.ball.vx > 0) {
            s.ball.vx = -Math.abs(s.ball.vx) * 1.04;
            s.ball.vy += ((s.ball.y - (s.right + PADDLE_H / 2)) / (PADDLE_H / 2)) * 2;
          }

          // scoring
          if (s.ball.x < 0) {
            s.scoreR++;
            s.ball = freshBall();
            s.serving = true;
            s.serveTimer = 45;
          } else if (s.ball.x > W) {
            s.scoreL++;
            s.ball = freshBall();
            s.serving = true;
            s.serveTimer = 45;
          }
        } else {
          s.serveTimer--;
          if (s.serveTimer <= 0) s.serving = false;
        }

        if (s.scoreL >= WIN_SCORE) {
          setWinner(1);
          setRunning(false);
        } else if (s.scoreR >= WIN_SCORE) {
          setWinner(2);
          setRunning(false);
        }
      }

      // draw
      ctx.fillStyle = "#0a0d12";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#2dd4bf";
      ctx.fillRect(24, s.left, PADDLE_W, PADDLE_H);
      ctx.fillStyle = "#f87171";
      ctx.fillRect(W - 24 - PADDLE_W, s.right, PADDLE_W, PADDLE_H);
      ctx.fillStyle = "#e5e7eb";
      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "bold 42px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.textAlign = "center";
      ctx.fillText(String(s.scoreL), W / 2 - 60, 56);
      ctx.fillText(String(s.scoreR), W / 2 + 60, 56);

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [winner]);

  const s = stateRef.current;

  return (
    <AppShell title="Pong">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏓 Pong</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          W/S for the left paddle{mode === "2p" ? ", arrows for the right" : " - the AI handles the right"}. On touch, drag your half.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {([["ai", "🤖 Vs AI"], ["2p", "👥 2 Players"]] as const).map(([m, label]) => (
              <button
                key={m}
                onClick={() => { setMode(m); reset(); }}
                className={`rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                  mode === m ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button onClick={reset} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-primary/10">
            <RotateCcw className="size-3" /> Restart
          </button>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="w-full rounded-xl border border-border"
            style={{ aspectRatio: `${W}/${H}` }}
          />
          {!running && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/60 text-center">
              {winner ? (
                <>
                  <p className="text-[20px] font-black text-foreground">
                    {winner === 1 ? "Left player wins!" : mode === "ai" ? "AI wins!" : "Right player wins!"}
                  </p>
                  <button onClick={reset} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                    Rematch
                  </button>
                </>
              ) : (
                <button onClick={() => setRunning(true)} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                  Serve {s.scoreL + s.scoreR > 0 ? "again" : "the ball"}
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-muted-foreground">First to {WIN_SCORE} points wins. Rally long enough and the ball speeds up.</p>
      </div>
    </AppShell>
  );
}
