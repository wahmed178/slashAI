import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/sky-dash")({ component: SkyDash });

const W = 400;
const H = 600;
const BIRD_X = 100;
const BIRD_R = 11;
const PIPE_W = 62;
const GROUND = 44;

interface Pipe {
  x: number;
  gapY: number;
  scored: boolean;
}

interface SState {
  y: number;
  vy: number;
  pipes: Pipe[];
  score: number;
}

function loadBest(): number {
  try {
    return Number(localStorage.getItem("play-sky-dash-best") ?? 0) || 0;
  } catch {
    return 0;
  }
}

function freshState(): SState {
  return { y: H / 2, vy: 0, pipes: [], score: 0 };
}

function SkyDash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "run" | "dead">("idle");
  const [best, setBest] = useState(loadBest);
  const stateRef = useRef<SState>(freshState());
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  function flap() {
    if (phaseRef.current === "idle") {
      stateRef.current = freshState();
      stateRef.current.vy = -7.2;
      setPhase("run");
      return;
    }
    if (phaseRef.current === "dead") return;
    stateRef.current.vy = -7.2;
  }

  function restart() {
    stateRef.current = freshState();
    setPhase("run");
    stateRef.current.vy = -7.2;
  }

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        if (phaseRef.current !== "dead") flap();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;
    let tick = 0;

    const step = () => {
      const s = stateRef.current;
      const mode = phaseRef.current;
      const speed = Math.min(4.6, 2.7 + s.score * 0.04);
      const gap = Math.max(122, 160 - s.score);

      if (mode === "run") {
        s.vy += 0.48;
        s.y += s.vy;
        if (s.y < BIRD_R + 2) {
          s.y = BIRD_R + 2;
          s.vy = 0;
        }

        for (const p of s.pipes) p.x -= speed;
        s.pipes = s.pipes.filter((p) => p.x + PIPE_W > -10);

        const last = s.pipes[s.pipes.length - 1];
        if (!last || last.x < W - 210) {
          s.pipes.push({
            x: W + 20,
            gapY: 70 + Math.random() * (H - GROUND - 140 - gap),
            scored: false,
          });
        }

        for (const p of s.pipes) {
          if (!p.scored && p.x + PIPE_W < BIRD_X - BIRD_R) {
            p.scored = true;
            s.score++;
          }
          if (BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W) {
            if (s.y - BIRD_R < p.gapY || s.y + BIRD_R > p.gapY + gap) {
              setPhase("dead");
              setBest((b) => {
                if (s.score > b) {
                  try {
                    localStorage.setItem("play-sky-dash-best", String(s.score));
                  } catch {
                    /* storage unavailable */
                  }
                  return s.score;
                }
                return b;
              });
            }
          }
        }

        if (s.y > H - GROUND - BIRD_R) {
          setPhase("dead");
          setBest((b) => {
            if (s.score > b) {
              try {
                localStorage.setItem("play-sky-dash-best", String(s.score));
              } catch {
                /* storage unavailable */
              }
              return s.score;
            }
            return b;
          });
        }
      }

      // draw
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#0b1220");
      sky.addColorStop(1, "#132030");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < 3; i++) {
        const cx = ((tick * 0.3 + i * 140) % (W + 60)) - 30;
        const cy = 60 + i * 46;
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, Math.PI * 2);
        ctx.arc(cx + 14, cy - 6, 11, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of s.pipes) {
        ctx.fillStyle = "#34d399";
        ctx.beginPath();
        ctx.roundRect(p.x, 0, PIPE_W, p.gapY, 4);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(p.x, p.gapY + gap, PIPE_W, H - GROUND - p.gapY - gap, 4);
        ctx.fill();
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.roundRect(p.x - 4, p.gapY - 14, PIPE_W + 8, 14, 3);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(p.x - 4, p.gapY + gap, PIPE_W + 8, 14, 3);
        ctx.fill();
      }

      ctx.fillStyle = "#1f2937";
      ctx.fillRect(0, H - GROUND, W, GROUND);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      for (let i = 0; i < W; i += 24) ctx.fillRect(i, H - GROUND, 12, 3);

      // bird
      const bob = mode === "run" ? 0 : Math.sin(tick * 0.1) * 5;
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(BIRD_X, s.y + bob, BIRD_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.ellipse(BIRD_X - 3, s.y + bob + 3, 6, 4, Math.sin(tick * 0.3) * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(BIRD_X + 5, s.y + bob - 3, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "bold 34px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.textAlign = "center";
      ctx.fillText(String(s.score), W / 2, 54);

      tick++;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const s = stateRef.current;

  return (
    <AppShell title="Sky Dash">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🐦 Sky Dash</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap the sky or press Space to flap. Thread every pipe gap - one touch and it is over.
        </p>
      </header>

      <div className="mx-auto max-w-md">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onPointerDown={(e) => {
              e.preventDefault();
              if (phaseRef.current !== "dead") flap();
            }}
            className="w-full touch-none rounded-xl border border-border"
            style={{ aspectRatio: `${W}/${H}` }}
          />
          {phase !== "run" && (
            <div className="absolute inset-0 flex touch-none flex-col items-center justify-center gap-3 rounded-xl bg-black/55 text-center">
              {phase === "dead" ? (
                <>
                  <p className="text-[20px] font-black text-foreground">Crashed! 💥</p>
                  <p className="text-[13px] text-muted-foreground">
                    Score {s.score} - best {Math.max(best, s.score)}
                  </p>
                  <button onClick={restart} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                    Fly again
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[17px] font-bold text-foreground">🐦 Sky Dash</p>
                  <p className="text-[12px] text-muted-foreground">Best: {best}</p>
                  <button onClick={flap} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                    Start flying
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          The gaps tighten and the world speeds up with every pipe you pass.
        </p>
      </div>
    </AppShell>
  );
}
