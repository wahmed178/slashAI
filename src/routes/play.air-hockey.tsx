import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/air-hockey")({ component: AirHockey });

/**
 * Air Hockey — fast puck physics against an AI mallet. Your mallet follows the
 * pointer inside your half; the puck inherits your mallet's velocity when you
 * strike it, so sweeping through it fires a slapshot. First to 7 goals.
 */

const W = 400;
const H = 640;
const MALLET_R = 30;
const PUCK_R = 15;
const GOAL_W = 130;
const TARGET = 7;
const AI_SPEED = { Easy: 3.4, Medium: 5.2, Hard: 7.4 } as const;
type Level = keyof typeof AI_SPEED;

interface Puck { x: number; y: number; vx: number; vy: number }

function resetPuck(towardsPlayer: boolean): Puck {
  const a = (Math.random() - 0.5) * 1.2;
  const sp = 5.5;
  return {
    x: W / 2 + (Math.random() - 0.5) * 90,
    y: H / 2,
    vx: Math.sin(a) * sp,
    vy: (towardsPlayer ? 1 : -1) * Math.cos(a) * sp,
  };
}

function AirHockey() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [level, setLevel] = useState<Level>("Medium");
  const [you, setYou] = useState(0);
  const [ai, setAi] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [outcome, setOutcome] = useState<"" | "you" | "ai">("");

  const puck = useRef<Puck>(resetPuck(true));
  const player = useRef({ x: W / 2, y: H * 0.78, px: W / 2, py: H * 0.78 });
  const cpu = useRef({ x: W / 2, y: H * 0.22 });
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const score = useRef({ you: 0, ai: 0 });
  const levelRef = useRef<Level>(level);
  levelRef.current = level;
  const playingRef = useRef(false);
  playingRef.current = playing;

  const newGame = useCallback(() => {
    score.current = { you: 0, ai: 0 };
    setYou(0);
    setAi(0);
    setOutcome("");
    puck.current = resetPuck(true);
    player.current = { x: W / 2, y: H * 0.78, px: W / 2, py: H * 0.78 };
    cpu.current = { x: W / 2, y: H * 0.22 };
    setPlaying(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const step = () => {
      const p = puck.current;
      const m = player.current;
      const c = cpu.current;

      if (playingRef.current && !outcome) {
        // ── player mallet follows the pointer inside the lower half ─────
        if (pointer.current) {
          m.px = m.x;
          m.py = m.y;
          m.x = Math.max(MALLET_R, Math.min(W - MALLET_R, pointer.current.x));
          m.y = Math.max(H / 2 + MALLET_R, Math.min(H - MALLET_R, pointer.current.y));
        } else {
          m.px = m.x;
          m.py = m.y;
        }

        // ── AI mallet: intercepts when the puck is coming, else re-centres
        const speed = AI_SPEED[levelRef.current];
        const goX = p.vy < 0 ? p.x : W / 2;
        const goY = p.vy < 0 ? Math.min(p.y - 40, H * 0.34) : H * 0.22;
        const dx = goX - c.x;
        const dy = goY - c.y;
        const dist = Math.hypot(dx, dy) || 1;
        c.x += (dx / dist) * Math.min(speed, dist);
        c.y = Math.max(MALLET_R, Math.min(H / 2 - MALLET_R, c.y + (dy / dist) * Math.min(speed, dist)));

        // ── puck integration with wall bounces and friction ────────────
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.998;
        p.vy *= 0.998;

        if (p.x < PUCK_R) {
          p.x = PUCK_R;
          p.vx = Math.abs(p.vx) * 0.98;
        } else if (p.x > W - PUCK_R) {
          p.x = W - PUCK_R;
          p.vx = -Math.abs(p.vx) * 0.98;
        }

        // side walls keep the puck out of the goal mouths
        const inGoalMouth = Math.abs(p.x - W / 2) < GOAL_W / 2;

        if (p.y < PUCK_R && !inGoalMouth) {
          p.y = PUCK_R;
          p.vy = Math.abs(p.vy) * 0.98;
        } else if (p.y > H - PUCK_R && !inGoalMouth) {
          p.y = H - PUCK_R;
          p.vy = -Math.abs(p.vy) * 0.98;
        }

        const hit = (mx: number, my: number, vx: number, vy: number) => {
          const ddx = p.x - mx;
          const ddy = p.y - my;
          const d = Math.hypot(ddx, ddy);
          if (d < MALLET_R + PUCK_R && d > 0) {
            const nx = ddx / d;
            const ny = ddy / d;
            p.x = mx + nx * (MALLET_R + PUCK_R);
            p.y = my + ny * (MALLET_R + PUCK_R);
            const strike = Math.hypot(vx, vy);
            const push = Math.max(6.5, Math.min(20, strike * 1.5 + 6));
            p.vx = nx * push + vx * 0.35;
            p.vy = ny * push + vy * 0.35;
          }
        };
        hit(c.x, c.y, 0, 0);
        hit(m.x, m.y, (m.x - m.px) * 1.35, (m.y - m.py) * 1.35);

        // cap so it never tunnels
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 26) {
          p.vx = (p.vx / sp) * 26;
          p.vy = (p.vy / sp) * 26;
        }

        // ── goals ──────────────────────────────────────────────────────
        if (p.y < -PUCK_R) {
          score.current.you += 1;
          setYou(score.current.you);
          if (score.current.you >= TARGET) {
            setOutcome("you");
            setPlaying(false);
          } else puck.current = resetPuck(true);
        } else if (p.y > H + PUCK_R) {
          score.current.ai += 1;
          setAi(score.current.ai);
          if (score.current.ai >= TARGET) {
            setOutcome("ai");
            setPlaying(false);
          } else puck.current = resetPuck(false);
        }
      }

      draw(ctx);
      raf = requestAnimationFrame(step);
    };

    const draw = (g: CanvasRenderingContext2D) => {
      const p = puck.current;
      const m = player.current;
      const c = cpu.current;

      g.fillStyle = "#8fa8bd";
      g.fillRect(0, 0, W, H);
      g.fillStyle = "#f8fafc";
      g.fillRect(6, 6, W - 12, H - 12);
      g.fillStyle = "#e2e8f0";
      g.fillRect(6, 6, GOAL_W, 12);
      g.fillRect(W - GOAL_W - 6, 6, GOAL_W, 12);
      g.fillRect(6, H - 18, GOAL_W, 12);
      g.fillRect(W - GOAL_W - 6, H - 18, GOAL_W, 12);

      // centre line + circle
      g.strokeStyle = "#06b6d4";
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(6, H / 2);
      g.lineTo(W - 6, H / 2);
      g.stroke();
      g.beginPath();
      g.arc(W / 2, H / 2, 62, 0, Math.PI * 2);
      g.stroke();
      g.beginPath();
      g.arc(W / 2, H / 2, 8, 0, Math.PI * 2);
      g.fillStyle = "#06b6d4";
      g.fill();

      // goal mouths
      g.fillStyle = "rgba(15,23,42,0.85)";
      g.fillRect(W / 2 - GOAL_W / 2, 2, GOAL_W, 10);
      g.fillRect(W / 2 - GOAL_W / 2, H - 12, GOAL_W, 10);

      const mallet = (x: number, y: number, outer: string, inner: string) => {
        g.fillStyle = "rgba(15,23,42,0.18)";
        g.beginPath();
        g.arc(x + 3, y + 4, MALLET_R, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = outer;
        g.beginPath();
        g.arc(x, y, MALLET_R, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = inner;
        g.beginPath();
        g.arc(x, y, MALLET_R * 0.42, 0, Math.PI * 2);
        g.fill();
      };
      mallet(c.x, c.y, "#db2777", "#fbcfe8");
      mallet(m.x, m.y, "#0f766e", "#99f6e4");

      g.fillStyle = "rgba(15,23,42,0.18)";
      g.beginPath();
      g.arc(p.x + 3, p.y + 4, PUCK_R, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#0f172a";
      g.beginPath();
      g.arc(p.x, p.y, PUCK_R, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#ef4444";
      g.beginPath();
      g.arc(p.x, p.y, PUCK_R * 0.55, 0, Math.PI * 2);
      g.fill();
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [outcome]);

  const point = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    pointer.current = {
      x: ((clientX - rect.left) / rect.width) * W,
      y: ((clientY - rect.top) / rect.height) * H,
    };
  };

  return (
    <AppShell title="Air Hockey">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏒 Air Hockey</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Move your mallet with the pointer. Sweep through the puck to smash it — first to {TARGET} wins.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">You</p>
            <p className="text-[20px] font-black text-[#2dd4bf]">{you}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">First to</p>
            <p className="text-[20px] font-black text-foreground">{TARGET}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">AI</p>
            <p className="text-[20px] font-black text-[#f472b6]">{ai}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full touch-none select-none"
            style={{ aspectRatio: `${W} / ${H}`, maxHeight: "62vh" }}
            onPointerMove={(e) => point(e.clientX, e.clientY)}
            onPointerDown={(e) => point(e.clientX, e.clientY)}
            onPointerLeave={() => (pointer.current = null)}
          />

          {!playing && !outcome && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 px-6 text-center">
              <p className="text-[22px] font-black text-foreground">🏒 Air Hockey</p>
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
                ▶ Drop the puck
              </button>
            </div>
          )}

          {outcome && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 px-6 text-center">
              <p className="text-[26px] font-black text-foreground">{outcome === "you" ? "🏆 You win!" : "😤 AI wins"}</p>
              <p className="text-[15px] text-muted-foreground">
                {you} – {ai}
              </p>
              <button onClick={newGame} className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-background">
                ↻ Rematch
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
