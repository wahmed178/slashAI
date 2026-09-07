import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw, Pause, Play } from "lucide-react";

export const Route = createFileRoute("/play/snake")({ component: Snake });

const SIZE = 17;
const SPEED_MS = 130;
type Pt = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const DELTA: Record<Dir, Pt> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const BEST_KEY = "snake-best";

function Snake() {
  const [snake, setSnake] = useState<Pt[]>([{ x: 8, y: 8 }]);
  const [food, setFood] = useState<Pt>({ x: 12, y: 8 });
  const [dir, setDir] = useState<Dir>("right");
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [best, setBest] = useState<number>(() => Number(localStorage.getItem(BEST_KEY)) || 0);
  const dirRef = useRef(dir);
  dirRef.current = dir;
  const snakeRef = useRef(snake);
  snakeRef.current = snake;

  const score = snake.length - 1;

  const spawnFood = useCallback((body: Pt[]): Pt => {
    let p: Pt;
    do {
      p = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
    } while (body.some((s) => s.x === p.x && s.y === p.y));
    return p;
  }, []);

  const reset = useCallback(() => {
    setSnake([{ x: 8, y: 8 }]);
    setFood({ x: 12, y: 8 });
    setDir("right");
    setOver(false);
    setRunning(true);
  }, []);

  // keyboard + swipe controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
      };
      const next = map[e.key];
      if (!next) return;
      e.preventDefault();
      const cur = dirRef.current;
      const opposite: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };
      if (next === opposite[cur]) return;
      setDir(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let touchStart: Pt | null = null;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]!;
      touchStart = { x: t.clientX, y: t.clientY };
    };
    const onEnd = (e: TouchEvent) => {
      if (!touchStart) return;
      const t = e.changedTouches[0]!;
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      const next: Dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      const opposite: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };
      if (next !== opposite[dirRef.current]) setDir(next);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  // game loop
  useEffect(() => {
    if (!running || over) return;
    const id = setInterval(() => {
      const body = snakeRef.current;
      const head = body[0]!;
      const d = DELTA[dirRef.current];
      const next: Pt = { x: head.x + d.x, y: head.y + d.y };
      const hitWall = next.x < 0 || next.x >= SIZE || next.y < 0 || next.y >= SIZE;
      const hitSelf = body.some((s) => s.x === next.x && s.y === next.y);
      if (hitWall || hitSelf) {
        setOver(true);
        setRunning(false);
        setBest((b) => {
          const nb = Math.max(b, body.length - 1);
          localStorage.setItem(BEST_KEY, String(nb));
          return nb;
        });
        return;
      }
      const grew = next.x === food.x && next.y === food.y;
      const nb = [next, ...body];
      if (grew) setFood(spawnFood(nb));
      else nb.pop();
      snakeRef.current = nb;
      setSnake(nb);
    }, SPEED_MS);
    return () => clearInterval(id);
  }, [running, over, food, spawnFood]);

  return (
    <AppShell title="Snake">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🐍 Snake</h1>
        <p className="mt-1 text-sm text-muted-foreground">Arrow keys or swipe to steer. Eat, grow, don't crash.</p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5 text-[13px]">
          <span className="text-muted-foreground">Score <b className="text-[16px] text-foreground">{score}</b></span>
          <span className="text-muted-foreground">Best <b className="text-[16px] text-primary">{Math.max(best, score)}</b></span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setRunning((r) => !r)}
              disabled={over}
              className="rounded-lg border border-border bg-surface-elevated p-2 text-foreground disabled:opacity-40"
              aria-label={running ? "Pause" : "Play"}
            >
              {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            </button>
            <button onClick={reset} className="rounded-lg border border-border bg-surface-elevated p-2 text-foreground" aria-label="Restart">
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[400px] rounded-xl border border-border bg-[#0a0d12] p-1.5">
          <div
            className="grid h-full w-full gap-px"
            style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gridTemplateRows: `repeat(${SIZE}, 1fr)` }}
          >
            {Array.from({ length: SIZE * SIZE }, (_, i) => {
              const x = i % SIZE;
              const y = Math.floor(i / SIZE);
              const isHead = snake[0]!.x === x && snake[0]!.y === y;
              const isBody = !isHead && snake.some((s) => s.x === x && s.y === y);
              const isFood = food.x === x && food.y === y;
              return (
                <div
                  key={i}
                  className={`rounded-[2px] ${
                    isHead
                      ? "bg-primary"
                      : isBody
                        ? "bg-primary/60"
                        : isFood
                          ? "bg-[#f87171] rounded-full"
                          : "bg-transparent"
                  }`}
                />
              );
            })}
          </div>
          {(!running || over) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/60 text-center">
              {over ? (
                <>
                  <p className="text-[20px] font-black text-foreground">Game over</p>
                  <p className="text-[13px] text-muted-foreground">You scored {score}</p>
                  <button onClick={reset} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                    Play again
                  </button>
                </>
              ) : (
                <button onClick={() => setRunning(true)} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                  Start
                </button>
              )}
            </div>
          )}
        </div>

        {/* touch d-pad */}
        <div className="mx-auto grid w-40 grid-cols-3 gap-1 sm:hidden">
          <span />
          <button onClick={() => setDir("up")} className="rounded-lg border border-border bg-surface py-2 text-foreground">▲</button>
          <span />
          <button onClick={() => setDir("left")} className="rounded-lg border border-border bg-surface py-2 text-foreground">◀</button>
          <button onClick={() => setDir("down")} className="rounded-lg border border-border bg-surface py-2 text-foreground">▼</button>
          <button onClick={() => setDir("right")} className="rounded-lg border border-border bg-surface py-2 text-foreground">▶</button>
        </div>
      </div>
    </AppShell>
  );
}
