import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { useInDevice } from "@/components/library/device-context";
import { RotateCcw, Pause, Play } from "lucide-react";
import { playTone } from "@/lib/play-sound";
import { saveGameBest, getGameBest } from "@/lib/ux";
import {
  DELTA,
  SIZE,
  advance,
  scoreOf,
  spawnFood,
  startSnake,
  turn,
  type Dir,
  type Pt,
} from "@/lib/games/snake";

export const Route = createFileRoute("/play/snake")({
  head: () => ({
    meta: [
      { title: "Snake - Free Browser Game | SlashAI" },
      {
        name: "description",
        content:
          "A modern Snake: the board wraps so you never die on a wall, only on yourself. Speeds up as you grow. Arrow keys, WASD, swipe or the on-screen pad.",
      },
    ],
  }),
  component: Snake,
});

const BASE_MS = 145;
const MIN_MS = 62;

/** faster as the snake gets longer, but never unwinnable */
const tickMs = (len: number) => Math.max(MIN_MS, Math.round(BASE_MS - (len - 4) * 4.2));

const BEST_KEY = "snake-best";

/**
 * The steering pad, as its own component on purpose.
 *
 * `useInDevice()` only sees the handheld when it is read from a component that
 * renders INSIDE the shell's provider. `Snake` itself renders `AppShell`, which
 * renders the provider, so a hook called in `Snake`'s body sits above it and
 * always reads false. Anything that must know therefore has to be a child.
 */
function SteerPad({
  onSteer,
  onCentre,
  centreLabel,
  centreGlyph,
}: {
  onSteer: (d: Dir) => void;
  onCentre: () => void;
  centreLabel: string;
  centreGlyph: string;
}) {
  const inDevice = useInDevice();
  if (inDevice) return null;
  const arrow = (label: string, dir: Dir, glyph: string) => (
    <button
      onClick={() => onSteer(dir)}
      aria-label={label}
      className="flex h-16 items-center justify-center rounded-2xl border border-border bg-surface-elevated text-2xl text-foreground transition-colors active:bg-primary active:text-primary-foreground"
    >
      {glyph}
    </button>
  );
  return (
    <div className="mx-auto grid max-w-[320px] grid-cols-3 gap-2.5">
      <span />
      {arrow("Up", "up", "▲")}
      <span />
      {arrow("Left", "left", "◀")}
      <button
        onClick={onCentre}
        aria-label={centreLabel}
        className="flex h-16 items-center justify-center rounded-2xl border border-border bg-surface-elevated text-lg font-bold text-foreground transition-colors active:bg-primary active:text-primary-foreground"
      >
        {centreGlyph}
      </button>
      {arrow("Right", "right", "▶")}
      <span />
      {arrow("Down", "down", "▼")}
    </div>
  );
}

/** the same trick: the note adapts to whether the shell is around it */
function ModeNote() {
  const inDevice = useInDevice();
  return (
    <p className="text-center text-xs text-muted-foreground">
      {inDevice
        ? "Use the d-pad below to steer. Walls wrap around."
        : "Walls wrap around. Food every 1 point. It speeds up as you grow."}
    </p>
  );
}

function Snake() {
  const [body, setBody] = useState<Pt[]>(startSnake);
  const [food, setFood] = useState<Pt | null>(null);
  const [dir, setDir] = useState<Dir>("right");
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState<number>(() => getGameBest("snake") ?? 0);

  const bodyRef = useRef(body);
  bodyRef.current = body;
  const foodRef = useRef(food);
  foodRef.current = food;
  const dirRef = useRef(dir);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const score = scoreOf(body);

  const reset = useCallback(() => {
    setBody(startSnake());
    setFood(null);
    setDir("right");
    dirRef.current = "right";
    setOver(false);
    setWon(false);
    setRunning(true);
  }, []);

  /** paint the board: grid, food, snake, eyes — all canvas so it stays smooth */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const cell = size / SIZE;

    ctx.clearRect(0, 0, size, size);

    // playing field
    const bg = ctx.createLinearGradient(0, 0, size, size);
    bg.addColorStop(0, "#0f1a12");
    bg.addColorStop(1, "#060d09");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    // grid
    ctx.strokeStyle = "rgba(120, 220, 150, 0.07)";
    ctx.lineWidth = 1;
    for (let i = 1; i < SIZE; i++) {
      const p = Math.round(i * cell) + 0.5;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, size);
      ctx.moveTo(0, p);
      ctx.lineTo(size, p);
      ctx.stroke();
    }

    // food — a berry that breathes
    const f = foodRef.current;
    if (f) {
      const pulse = 1 + Math.sin(Date.now() / 190) * 0.12;
      const cx = (f.x + 0.5) * cell;
      const cy = (f.y + 0.5) * cell;
      const r = cell * 0.32 * pulse;
      const glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, r * 2.6);
      glow.addColorStop(0, "rgba(248,113,113,0.55)");
      glow.addColorStop(1, "rgba(248,113,113,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.6, 0, Math.PI * 2);
      ctx.fill();

      const berry = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.15, cx, cy, r);
      berry.addColorStop(0, "#fecaca");
      berry.addColorStop(0.5, "#f87171");
      berry.addColorStop(1, "#b91c1c");
      ctx.fillStyle = berry;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // snake tail -> head so the head sits on top
    const b = bodyRef.current;
    for (let i = b.length - 1; i >= 0; i--) {
      const seg = b[i]!;
      const t = 1 - i / Math.max(6, b.length);
      const pad = cell * (0.08 + t * 0.12);
      const w = cell - pad * 2;
      const x = seg.x * cell + pad;
      const y = seg.y * cell + pad;
      const r = Math.max(3, w * 0.34);

      const isHead = i === 0;
      const grad = ctx.createLinearGradient(x, y, x + w, y + w);
      if (isHead) {
        grad.addColorStop(0, "#a3f7bf");
        grad.addColorStop(1, "#22c55e");
      } else {
        grad.addColorStop(0, `rgba(74, 222, 128, ${0.55 + t * 0.35})`);
        grad.addColorStop(1, `rgba(21, 128, 61, ${0.55 + t * 0.35})`);
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, w, w, r);
      ctx.fill();

      if (isHead) {
        const d = DELTA[dirRef.current];
        // eyes sit on the leading edge, offset either side
        const ex = (seg.x + 0.5) * cell + d.x * cell * 0.2;
        const ey = (seg.y + 0.5) * cell + d.y * cell * 0.2;
        const px = d.y * cell * 0.17;
        const py = d.x * cell * 0.17;
        const er = Math.max(1.4, cell * 0.075);
        ctx.fillStyle = "#05240f";
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.arc(ex + px * s, ey + py * s, er, 0, Math.PI * 2);
          ctx.fill();
        }
        // highlight
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.beginPath();
        ctx.arc(
          (seg.x + 0.5) * cell - cell * 0.14,
          (seg.y + 0.5) * cell - cell * 0.16,
          cell * 0.09,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }
  }, []);

  /* ── keyboard ── */
  useEffect(() => {
    const map: Record<string, Dir> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
      W: "up",
      S: "down",
      A: "left",
      D: "right",
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const next = map[e.key];
      if (next) {
        e.preventDefault();
        const turned = turn(dirRef.current, next);
        dirRef.current = turned;
        setDir(turned);
        if (!over && !running) setRunning(true);
        return;
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (over || won) reset();
        else setRunning((r) => !r);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [over, running, won, reset]);

  /* ── swipe ── */
  useEffect(() => {
    let start: Pt | null = null;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) start = { x: t.clientX, y: t.clientY };
    };
    const onEnd = (e: TouchEvent) => {
      if (!start) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      start = null;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
      const next: Dir =
        Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      const turned = turn(dirRef.current, next);
      dirRef.current = turned;
      setDir(turned);
      if (!over && !running) setRunning(true);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [over, running]);

  /* ── loop ── */
  useEffect(() => {
    if (!running || over || won) return;
    const id = setInterval(() => {
      const result = advance(bodyRef.current, dirRef.current, foodRef.current);
      if (result.dead) {
        setOver(true);
        setRunning(false);
        playTone("fail");
        const final = scoreOf(result.body);
        setBest((b) => {
          const nb = Math.max(b, final);
          saveGameBest("snake", nb);
          return nb;
        });
        return;
      }
      if (result.won) {
        setWon(true);
        setRunning(false);
        playTone("win");
        const final = scoreOf(result.body);
        setBest((b) => {
          const nb = Math.max(b, final);
          saveGameBest("snake", nb);
          return nb;
        });
        return;
      }
      setBody(result.body);
      setFood(result.food);
      if (result.food !== foodRef.current) playTone("tick");
    }, tickMs(bodyRef.current.length));
    return () => clearInterval(id);
  }, [running, over, won]);

  /* ── paint ──
   * The food breathes even when the snake is holding still, so the board is
   * driven by one rAF loop rather than by React state. */
  useEffect(() => {
    let id = 0;
    const loop = () => {
      draw();
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [draw, body, food]);

  // put something on the board to chase the first time round
  useEffect(() => {
    if (food === null && !won) setFood(spawnFood(bodyRef.current));
  }, [food, won]);

  const steer = (d: Dir) => {
    const turned = turn(dirRef.current, d);
    dirRef.current = turned;
    setDir(turned);
    if (!over && !won && !running) setRunning(true);
  };

  return (
    <AppShell title="Snake">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🐍 Snake</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The walls wrap, so only you can end your run. Arrow keys, WASD, swipe or the pad.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-[13px]">
          <span className="text-muted-foreground">
            Score <b className="text-[16px] text-foreground">{score}</b>
          </span>
          <span className="text-muted-foreground">
            Best <b className="text-[16px] text-primary">{Math.max(best, score)}</b>
          </span>
          <span className="text-muted-foreground">
            Len <b className="text-[16px] text-foreground">{body.length}</b>
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setRunning((r) => !r)}
              disabled={over || won}
              className="rounded-lg border border-border bg-surface-elevated p-2.5 text-foreground disabled:opacity-40"
              aria-label={running ? "Pause" : "Play"}
            >
              {running ? <Pause className="size-4" /> : <Play className="size-4" />}
            </button>
            <button
              onClick={reset}
              className="rounded-lg border border-border bg-surface-elevated p-2.5 text-foreground"
              aria-label="Restart"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-2xl border-2 border-emerald-900/60 shadow-[0_0_40px_-12px_rgba(34,197,94,0.5)]">
          <canvas
            ref={canvasRef}
            width={SIZE * 24}
            height={SIZE * 24}
            className="h-full w-full"
            role="img"
            aria-label={`Snake board. Score ${score}.`}
          />
          {(!running || over || won) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 text-center backdrop-blur-[2px]">
              {over ? (
                <>
                  <p className="text-[20px] font-black text-emerald-300">Game over</p>
                  <p className="text-[13px] text-emerald-100/80">You ran into yourself</p>
                  <button
                    onClick={reset}
                    className="rounded-xl bg-emerald-500 px-5 py-2.5 text-[13px] font-bold text-emerald-950 hover:bg-emerald-400"
                  >
                    Play again
                  </button>
                </>
              ) : won ? (
                <>
                  <p className="text-[20px] font-black text-amber-300">Board cleared!</p>
                  <p className="text-[13px] text-emerald-100/80">You filled every square</p>
                  <button
                    onClick={reset}
                    className="rounded-xl bg-amber-400 px-5 py-2.5 text-[13px] font-bold text-amber-950 hover:bg-amber-300"
                  >
                    Play again
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setRunning(true)}
                  className="rounded-xl bg-emerald-500 px-5 py-2.5 text-[13px] font-bold text-emerald-950 hover:bg-emerald-400"
                >
                  Start
                </button>
              )}
            </div>
          )}
        </div>

        <SteerPad
          onSteer={steer}
          onCentre={over || won ? reset : () => setRunning((r) => !r)}
          centreLabel={over || won ? "Play again" : running ? "Pause" : "Play"}
          centreGlyph={over || won ? "↻" : running ? "❚❚" : "▶"}
        />

        <ModeNote />
      </div>
    </AppShell>
  );
}
