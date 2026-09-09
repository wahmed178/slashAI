import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/lights-out")({ component: LightsOut });

const SIZE = 5;

function toggle(grid: boolean[], idx: number): boolean[] {
  const next = [...grid];
  const r = Math.floor(idx / SIZE);
  const c = idx % SIZE;
  const flip = (rr: number, cc: number) => {
    if (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE) {
      next[rr * SIZE + cc] = !next[rr * SIZE + cc];
    }
  };
  flip(r, c);
  flip(r - 1, c);
  flip(r + 1, c);
  flip(r, c - 1);
  flip(r, c + 1);
  return next;
}

/** build a solvable puzzle by applying N random presses from the off state */
function scramble(presses: number): boolean[] {
  let g: boolean[] = Array(SIZE * SIZE).fill(false);
  for (let i = 0; i < presses; i++) {
    g = toggle(g, Math.floor(Math.random() * SIZE * SIZE));
  }
  return g;
}

const LEVELS = [
  { name: "Easy", presses: 3 },
  { name: "Medium", presses: 6 },
  { name: "Hard", presses: 10 },
];

function LightsOut() {
  const [levelIdx, setLevelIdx] = useState(1);
  const [grid, setGrid] = useState<boolean[]>(() => scramble(LEVELS[1]!.presses));
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  const press = (idx: number) => {
    if (solved) return;
    const next = toggle(grid, idx);
    setGrid(next);
    setMoves((m) => m + 1);
    if (next.every((cell) => !cell)) setSolved(true);
  };

  const restart = useCallback((lvl: number = levelIdx) => {
    setLevelIdx(lvl);
    setGrid(scramble(LEVELS[lvl]!.presses));
    setMoves(0);
    setSolved(false);
  }, [levelIdx]);

  useEffect(() => {
    restart(levelIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lit = grid.filter(Boolean).length;

  return (
    <AppShell title="Lights Out">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">💡 Lights Out</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap a cell to toggle it and its four neighbours. Turn every light off to win.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {LEVELS.map((l, i) => (
              <button
                key={l.name}
                onClick={() => restart(i)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  i === levelIdx ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            Moves: <b className="text-foreground tabular-nums">{moves}</b> · Lit: <b className="text-foreground tabular-nums">{lit}</b>
          </span>
        </div>

        <div className="relative rounded-2xl border border-border bg-surface p-4">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}>
            {grid.map((on, i) => (
              <button
                key={i}
                onClick={() => press(i)}
                disabled={solved}
                aria-label={on ? "Light on" : "Light off"}
                className={`aspect-square rounded-xl transition-all duration-150 ${
                  on
                    ? "bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.5)]"
                    : "bg-muted/70 hover:bg-muted"
                } ${solved ? "opacity-60" : ""}`}
              />
            ))}
          </div>

          {solved && (
            <div className="absolute inset-0 grid place-items-center rounded-2xl bg-background/85 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-4xl">🎉</p>
                <p className="mt-2 text-lg font-bold text-foreground">Lights out in {moves} moves!</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {moves <= LEVELS[levelIdx]!.presses + 2 ? "Near-optimal. Brilliant." : "Solved is solved."}
                </p>
                <button
                  onClick={() => restart()}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <RotateCcw className="size-3.5" /> New puzzle
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => restart()}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <RotateCcw className="size-3" /> Shuffle
          </button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Every puzzle is generated by scrambling from the solved state, so it is always solvable.
        </p>
      </div>
    </AppShell>
  );
}
