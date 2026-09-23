import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Play, RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/volleyball")({ component: Volleyball });

/**
 * Volleyball — side-on beach court, you on the left, AI on the right.
 * Move, jump and smash: return the ball before it bounces twice on your
 * side. Real rally scoring, first to 11, win by 2.
 */

const W = 420;
const H = 520;
const NET_X = W / 2;
const NET_TOP = H - 170;
const GROUND = H - 30;
const G = 0.5;

interface Player {
  x: number;
  y: number;
  vy: number;
  jump: boolean;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

type Phase = "idle" | "serve" | "rally" | "point" | "over";

function Volleyball() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [you, setYou] = useState(0);
  const [ai, setAi] = useState(0);
  const [best, setBest] = useState(() => getGameBest("volleyball") ?? 0);
  const [level, setLevel] = useState<"Easy" | "Medium" | "Hard">("Medium");

  const keys = useRef<Record<string, boolean>>({});
  const me = useRef<Player>({ x: 110, y: GROUND, vy: 0, jump: false });
  const them = useRef<Player & { speed: number }>({ x: 310, y: GROUND, vy: 0, jump: false, speed: 3.4 });
  const ball = useRef<Ball>({ x: 130, y: 200, vx: 0, vy: 0 });
  const scores = useRef({ you: 0, ai: 0 });
  const raf = useRef(0);
  const last = useRef(0);
  const bounces = useRef({ left: 0, right: 0 });
  const phaseRef = useRef<Phase>("idle");
  const levelRef = useRef(level);

  useEffect(() => {
    levelRef.current = level;
    them.current.speed = level === "Easy" ? 2.6 : level === "Hard" ? 4.6 : 3.4;
  }, [level]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const start = useCallback(() => {
    scores.current = { you: 0, ai: 0 };
    setYou(0);
    setAi(0);
    bounces.current = { left: 0, right: 0 };
    ball.current = { x: 130, y: 200, vx: 0, vy: 0 };
    setPhase("serve");
  }, []);

  const serve = (toLeft: boolean) => {
    ball.current = {
      x: toLeft ? 320 : 100,
      y: 130,
      vx: toLeft ? -3.4 : 3.4,
      vy: 2.4,
    };
    bounces.current = { left: 0, right: 0 };
    setPhase("rally");
  };

  const finish = useCallback(() => {
    setPhase("over");
    if (scores.current.you > (getGameBest("volleyball") ?? 0)) {
      saveGameBest("volleyball", scores.current.you);
      setBest(scores.current.you);
    }
  }, []);

  const scorePoint = useCallback(
    (winner: "you" | "ai") => {
      scores.current[winner]++;
      setYou(scores.current.you);
      setAi(scores.current.ai);
      setPhase("point");
      setTimeout(() => {
        if (scores.current.you >= 11 && scores.current.you - scores.current.ai >= 2) {
          finish();
        } else if (scores.current.ai >= 11 && scores.current.ai - scores.current.you >= 2) {
          finish();
        } else {
          serve(winner === "ai");
        }
      }, 900);
    },
    [finish],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    if (phase === "idle" || phase === "over") return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const loop = (now: number) => {
      const dt = Math.min(32, now - (last.current || now));
      last.current = now;
      const f = dt / 16.7;

      // sky + beach
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0ea5e9");
      bg.addColorStop(0.55, "#7dd3fc");
      bg.addColorStop(0.56, "#fbbf24");
      bg.addColorStop(1, "#f59e0b");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      // sun
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.arc(60, 60, 26, 0, Math.PI * 2);
      ctx.fill();
      // net
      ctx.strokeStyle = "rgba(30,41,59,0.85)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(NET_X, GROUND);
      ctx.lineTo(NET_X, NET_TOP);
      ctx.stroke();
      for (let y = NET_TOP; y < GROUND; y += 12) {
        ctx.beginPath();
        ctx.moveTo(NET_X - 14, y);
        ctx.lineTo(NET_X + 14, y);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // movement
      const m = me.current;
      if (keys.current["ArrowLeft"] || keys.current["a"]) m.x -= 5 * f;
      if (keys.current["ArrowRight"] || keys.current["d"]) m.x += 5 * f;
      m.x = Math.max(16, Math.min(NET_X - 24, m.x));
      if ((keys.current[" "] || keys.current["ArrowUp"] || keys.current["w"]) && !m.jump) {
        m.vy = -11;
        m.jump = true;
      }
      if (m.jump) {
        m.vy += G * f;
        m.y += m.vy * f;
        if (m.y >= GROUND) {
          m.y = GROUND;
          m.jump = false;
          m.vy = 0;
        }
      }

      // AI chases predicted landing
      const t = them.current;
      const b = ball.current;
      let targetX = 310;
      if (b.vx > 0 && phaseRef.current === "rally") {
        // crude landing prediction
        let px = b.x;
        let py = b.y;
        let pvy = b.vy;
        let guard = 0;
        while (py < GROUND - 10 && guard++ < 300) {
          px += b.vx;
          pvy += G;
          py += pvy;
        }
        targetX = Math.max(NET_X + 24, Math.min(W - 16, px));
      }
      if (Math.abs(t.x - targetX) > 4) t.x += Math.sign(targetX - t.x) * t.speed * f;
      t.x = Math.max(NET_X + 24, Math.min(W - 16, t.x));
      // AI jumps when ball is close and high
      if (!t.jump && Math.abs(b.x - t.x) < 40 && b.y < GROUND - 90 && Math.random() < 0.06) {
        t.vy = -10;
        t.jump = true;
      }
      if (t.jump) {
        t.vy += G * f;
        t.y += t.vy * f;
        if (t.y >= GROUND) {
          t.y = GROUND;
          t.jump = false;
        }
      }

      // ball physics
      if (phaseRef.current === "rally") {
        b.vy += G * f;
        b.x += b.vx * f;
        b.y += b.vy * f;
        // walls
        if (b.x < 10) {
          b.x = 10;
          b.vx *= -1;
        }
        if (b.x > W - 10) {
          b.x = W - 10;
          b.vx *= -1;
        }
        // net
        if (Math.abs(b.x - NET_X) < 8 && b.y > NET_TOP) {
          b.vx *= -0.7;
          b.x += Math.sign(b.x - NET_X) * 6;
        }
        // player hits: within reach of body + arm
        const hitMe = b.x < NET_X && Math.abs(b.x - m.x) < 34 && Math.abs(b.y - (m.y - 26)) < 36;
        if (hitMe) {
          const dir = 1;
          b.vx = Math.abs(b.vx) * 0.6 + 4.2 * dir;
          b.vy = -Math.abs(b.vy) * 0.4 - 7 - (m.jump ? 2.4 : 0);
          b.y = m.y - 40;
          bounces.current.left = 0;
        }
        const hitThem = b.x > NET_X && Math.abs(b.x - t.x) < 34 && Math.abs(b.y - (t.y - 26)) < 36;
        if (hitThem) {
          b.vx = -(Math.abs(b.vx) * 0.6 + 4.2);
          b.vy = -Math.abs(b.vy) * 0.4 - 6.6;
          b.y = t.y - 40;
          bounces.current.right = 0;
        }
        // ground
        if (b.y > GROUND - 8) {
          const left = b.x < NET_X;
          bounces.current[left ? "left" : "right"]++;
          b.y = GROUND - 8;
          b.vy *= -0.5;
          b.vx *= 0.7;
          if (bounces.current[left ? "left" : "right"] >= 2) {
            scorePoint(left ? "ai" : "you");
          }
        }
      }

      // players
      const draw = (p: Player, color: string, face: number) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y - 58, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(p.x - 11, p.y - 44, 22, 34);
        // arms
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(p.x - 10, p.y - 38);
        ctx.lineTo(p.x + 12 * face, p.y - 58);
        ctx.stroke();
        // legs
        ctx.beginPath();
        ctx.moveTo(p.x - 6, p.y - 10);
        ctx.lineTo(p.x - 10, p.y);
        ctx.moveTo(p.x + 6, p.y - 10);
        ctx.lineTo(p.x + 10, p.y);
        ctx.stroke();
      };
      draw(m, "#2563eb", -1);
      draw(t, "#dc2626", 1);

      // ball
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(b.x, b.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 10, 0.5, 2.4);
      ctx.stroke();

      // score
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = "bold 22px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${scores.current.you} — ${scores.current.ai}`, W / 2, 36);
      ctx.font = "12px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillText("first to 11 · win by 2", W / 2, 54);

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, scorePoint]);

  return (
    <AppShell title="Volleyball">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏐 Volleyball</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Beach rally — don't let it bounce twice on your side. First to 11, win by 2.
        </p>
      </header>
      <div className="mx-auto max-w-md">
        <div className="mb-2 flex justify-center gap-2">
          {(["Easy", "Medium", "Hard"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-lg px-3 py-1 text-xs font-medium ${level === l ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
          <canvas ref={canvasRef} width={W} height={H} className="block w-full touch-none select-none" />
          {phase !== "rally" && phase !== "serve" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
              {phase === "point" && <p className="text-lg font-bold text-foreground">Point!</p>}
              {phase === "over" ? (
                <>
                  <p className="text-3xl font-black text-foreground">{you > ai ? "🏆 You win!" : "AI wins"}</p>
                  <p className="text-sm text-muted-foreground">
                    {you} — {ai}
                  </p>
                </>
              ) : null}
              {(phase === "idle" || phase === "over") && (
                <button
                  onClick={start}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-background transition-all hover:opacity-90 active:scale-95"
                >
                  {phase === "over" ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
                  {phase === "over" ? "Rematch" : "Play match"}
                </button>
              )}
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">← → move · space jump. Bounce twice on your side = point to AI.</p>
      </div>
    </AppShell>
  );
}
