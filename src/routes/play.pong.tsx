import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/pong")({ component: Pong });

// Vertical court: top paddle vs bottom paddle. Player controls the bottom one.
const W = 400;
const H = 640;
const PAD_W = 92;
const PAD_T = 12;
const MARGIN = 22;
const WIN_SCORE = 7;

interface State {
  ball: { x: number; y: number; vx: number; vy: number };
  top: number;
  bottom: number;
  scoreTop: number;
  scoreBottom: number;
  serving: boolean;
  serveTimer: number;
}

function clampPaddle(x: number) {
  return Math.max(0, Math.min(W - PAD_W, x));
}

function freshBall() {
  const down = Math.random() < 0.5;
  const angle = (down ? Math.PI / 2 : -Math.PI / 2) + (Math.random() * 0.7 - 0.35);
  const speed = 4.6;
  return { x: W / 2, y: H / 2, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
}

function freshState(): State {
  return {
    ball: freshBall(),
    top: W / 2 - PAD_W / 2,
    bottom: W / 2 - PAD_W / 2,
    scoreTop: 0,
    scoreBottom: 0,
    serving: true,
    serveTimer: 45,
  };
}

function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"ai" | "2p">("ai");
  const [running, setRunning] = useState(false);
  const [winner, setWinner] = useState<0 | 1 | 2>(0);
  const stateRef = useRef<State>(freshState());
  const keys = useRef(new Set<string>());
  const pointers = useRef(new Map<number, "top" | "bottom">());
  const runningRef = useRef(running);
  runningRef.current = running;
  const modeRef = useRef(mode);
  modeRef.current = mode;

  function reset() {
    stateRef.current = freshState();
    setWinner(0);
    setRunning(true);
  }

  // keyboard: A/D move the bottom paddle, arrow keys the top one (2P mode)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (["a", "d", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
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

  // pointer control. touch-action: none + pointer capture means dragging the
  // paddle never scrolls or moves the page, even on mobile.
  function pointerSide(e: React.PointerEvent<HTMLCanvasElement>): "top" | "bottom" {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const side = modeRef.current === "2p" && y < H / 2 ? "top" : "bottom";
    pointers.current.set(e.pointerId, side);
    if (side === "top") stateRef.current.top = clampPaddle(x - PAD_W / 2);
    else stateRef.current.bottom = clampPaddle(x - PAD_W / 2);
    return side;
  }

  // game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;

    const step = () => {
      const s = stateRef.current;
      const SPEED = 7;

      if (runningRef.current && winner === 0) {
        if (modeRef.current === "ai") {
          if (keys.current.has("a") || keys.current.has("ArrowLeft")) s.bottom -= SPEED;
          if (keys.current.has("d") || keys.current.has("ArrowRight")) s.bottom += SPEED;
        } else {
          if (keys.current.has("a")) s.bottom -= SPEED;
          if (keys.current.has("d")) s.bottom += SPEED;
          if (keys.current.has("ArrowLeft")) s.top -= SPEED;
          if (keys.current.has("ArrowRight")) s.top += SPEED;
        }
        s.bottom = clampPaddle(s.bottom);
        s.top = clampPaddle(s.top);

        if (!s.serving) {
          s.ball.x += s.ball.vx;
          s.ball.y += s.ball.vy;

          // side walls
          if (s.ball.x < 5) {
            s.ball.x = 5;
            s.ball.vx = Math.abs(s.ball.vx);
          }
          if (s.ball.x > W - 5) {
            s.ball.x = W - 5;
            s.ball.vx = -Math.abs(s.ball.vx);
          }

          // top paddle (AI or P2)
          if (
            s.ball.vy < 0 &&
            s.ball.y - 6 <= MARGIN + PAD_T &&
            s.ball.y > MARGIN - 12 &&
            s.ball.x > s.top - 6 &&
            s.ball.x < s.top + PAD_W + 6
          ) {
            s.ball.y = MARGIN + PAD_T + 6;
            s.ball.vy = Math.abs(s.ball.vy) * 1.045;
            s.ball.vx += ((s.ball.x - (s.top + PAD_W / 2)) / (PAD_W / 2)) * 2.2;
          }
          // bottom paddle (player)
          if (
            s.ball.vy > 0 &&
            s.ball.y + 6 >= H - MARGIN - PAD_T &&
            s.ball.y < H - MARGIN + 12 &&
            s.ball.x > s.bottom - 6 &&
            s.ball.x < s.bottom + PAD_W + 6
          ) {
            s.ball.y = H - MARGIN - PAD_T - 6;
            s.ball.vy = -Math.abs(s.ball.vy) * 1.045;
            s.ball.vx += ((s.ball.x - (s.bottom + PAD_W / 2)) / (PAD_W / 2)) * 2.2;
          }

          // goals
          if (s.ball.y < -10) {
            s.scoreBottom++;
            s.ball = freshBall();
            s.serving = true;
            s.serveTimer = 45;
          } else if (s.ball.y > H + 10) {
            s.scoreTop++;
            s.ball = freshBall();
            s.serving = true;
            s.serveTimer = 45;
          }
        } else {
          s.serveTimer--;
          if (s.serveTimer <= 0) s.serving = false;
        }

        if (s.scoreBottom >= WIN_SCORE) {
          setWinner(1);
          setRunning(false);
        } else if (s.scoreTop >= WIN_SCORE) {
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
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#f87171";
      ctx.fillRect(s.top, MARGIN, PAD_W, PAD_T);
      ctx.fillStyle = "#2dd4bf";
      ctx.fillRect(s.bottom, H - MARGIN - PAD_T, PAD_W, PAD_T);
      ctx.fillStyle = "#e5e7eb";
      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "bold 40px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.textAlign = "center";
      ctx.fillText(String(s.scoreTop), W / 2, H / 2 - 26);
      ctx.fillText(String(s.scoreBottom), W / 2, H / 2 + 54);

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
          Vertical court - you defend the bottom. Drag your half to move the paddle (the page stays
          put while you drag){mode === "2p" ? ", or use A/D - the top player uses arrow keys" : ", or use A/D / arrow keys"}.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
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
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              pointerSide(e);
            }}
            onPointerMove={(e) => {
              if (pointers.current.has(e.pointerId)) pointerSide(e);
            }}
            onPointerUp={(e) => pointers.current.delete(e.pointerId)}
            onPointerCancel={(e) => pointers.current.delete(e.pointerId)}
            className="w-full touch-none rounded-xl border border-border"
            style={{ aspectRatio: `${W}/${H}` }}
          />
          {!running && (
            <div className="absolute inset-0 flex touch-none flex-col items-center justify-center gap-3 rounded-xl bg-black/60 text-center">
              {winner ? (
                <>
                  <p className="text-[20px] font-black text-foreground">
                    {winner === 1
                      ? mode === "ai"
                        ? "You win! 🎉"
                        : "Bottom player wins!"
                      : mode === "ai"
                        ? "AI wins this one"
                        : "Top player wins!"}
                  </p>
                  <button onClick={reset} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                    Rematch
                  </button>
                </>
              ) : (
                <button onClick={() => setRunning(true)} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                  Serve {s.scoreTop + s.scoreBottom > 0 ? "again" : "the ball"}
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          First to {WIN_SCORE} points wins. Long rallies speed the ball up - use the paddle edges to cut sharp angles.
        </p>
      </div>
    </AppShell>
  );
}
