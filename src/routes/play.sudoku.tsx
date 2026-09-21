import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { DIFFICULTY, boxStart, clone, makePuzzle, type Grid, type Level } from "@/lib/games/sudoku";

export const Route = createFileRoute("/play/sudoku")({ component: Sudoku });

/**
 * Sudoku — every puzzle is generated in the browser and guaranteed to have a
 * single solution (a full grid is filled randomly, then clues are removed while
 * a counting solver confirms uniqueness). Nine rows, nine columns, nine boxes,
 * each holding 1-9 exactly once. Mistakes are checked against the solution.
 */

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Sudoku() {
  const [level, setLevel] = useState<Level>("Medium");
  const [puzzle, setPuzzle] = useState<Grid | null>(null);
  const [solution, setSolution] = useState<Grid | null>(null);
  const [grid, setGrid] = useState<Grid>(Array(81).fill(0));
  const [selected, setSelected] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [best, setBest] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem("slashai.sudoku.best") ?? "{}");
    } catch {
      return {};
    }
  });
  const timer = useRef<number | null>(null);

  const newGame = useCallback(
    (lvl: Level) => {
      setThinking(true);
      setRunning(false);
      setWon(false);
      setMistakes(0);
      setSelected(null);
      setSeconds(0);
      // let the "generating" state paint before the CPU-heavy work
      window.setTimeout(() => {
        const { puzzle: p, solution: s } = makePuzzle(lvl);
        setPuzzle(p);
        setSolution(s);
        setGrid(clone(p));
        setThinking(false);
        setRunning(true);
      }, 40);
    },
    [],
  );

  useEffect(() => {
    if (!running || won) return;
    timer.current = window.setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [running, won]);

  const place = useCallback(
    (value: number) => {
      if (selected === null || !solution || won) return;
      if (puzzle && puzzle[selected] !== 0) return;
      const next = clone(grid);
      if (value === 0) {
        next[selected] = 0;
      } else {
        next[selected] = value;
        if (solution[selected] !== value) setMistakes((m) => m + 1);
      }
      setGrid(next);
      if (next.every((v, i) => v === solution[i])) {
        setWon(true);
        setRunning(false);
        setBest((b) => {
          const prev = b[level];
          if (prev && prev <= seconds) return b;
          const nb = { ...b, [level]: seconds };
          localStorage.setItem("slashai.sudoku.best", JSON.stringify(nb));
          return nb;
        });
      }
    },
    [selected, solution, puzzle, grid, won, level, seconds],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "9") {
        place(Number(e.key));
        return;
      }
      if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        place(0);
        return;
      }
      if (selected === null) return;
      const r = Math.floor(selected / 9);
      const c = selected % 9;
      if (e.key === "ArrowUp" && r > 0) setSelected(selected - 9);
      if (e.key === "ArrowDown" && r < 8) setSelected(selected + 9);
      if (e.key === "ArrowLeft" && c > 0) setSelected(selected - 1);
      if (e.key === "ArrowRight" && c < 8) setSelected(selected + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [place, selected]);

  const conflicts = useMemo(() => {
    const bad = new Set<number>();
    for (let i = 0; i < 81; i++) {
      const v = grid[i]!;
      if (v === 0) continue;
      for (let j = 0; j < 81; j++) {
        if (i === j || grid[j] !== v) continue;
        const sameRow = Math.floor(i / 9) === Math.floor(j / 9);
        const sameCol = i % 9 === j % 9;
        const bi = boxStart(i);
        const bj = boxStart(j);
        const sameBox = bi.r === bj.r && bi.c === bj.c;
        if (sameRow || sameCol || sameBox) bad.add(i);
      }
    }
    return bad;
  }, [grid]);

  const filled = grid.filter((v) => v !== 0).length;
  const remaining = grid.filter((v, i) => v === 0 || (solution && v !== solution[i])).length;

  return (
    <AppShell title="Sudoku">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🧩 Sudoku</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fresh puzzles generated in your browser, each with exactly one solution. Tap a cell and type 1-9.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Time</p>
            <p className="text-[16px] font-black text-foreground tabular-nums">{fmt(seconds)}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Mistakes</p>
            <p className="text-[16px] font-black text-red-400">{mistakes}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Left</p>
            <p className="text-[16px] font-black text-foreground">{puzzle ? remaining : "–"}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Best {level}</p>
            <p className="text-[16px] font-black text-primary">{best[level] ? fmt(best[level]!) : "–"}</p>
          </div>
        </div>

        {!puzzle && (
          <div className="rounded-xl border border-border bg-surface p-5 text-center">
            <p className="text-[13px] text-muted-foreground">Pick a difficulty — each one generates a brand-new puzzle.</p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {(Object.keys(DIFFICULTY) as Level[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                    level === l ? "bg-primary text-background" : "border border-border bg-surface-elevated text-muted-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={() => newGame(level)}
              className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-background"
            >
              ▶ New {level} puzzle
            </button>
          </div>
        )}

        {thinking && (
          <p className="py-10 text-center text-[13px] text-muted-foreground">Generating a puzzle with a single solution…</p>
        )}

        {puzzle && !thinking && (
          <>
            <div className="mx-auto grid w-full max-w-[420px] grid-cols-9 overflow-hidden rounded-xl border-2 border-foreground/40 bg-surface">
              {grid.map((v, i) => {
                const given = puzzle[i] !== 0;
                const r = Math.floor(i / 9);
                const c = i % 9;
                const isSel = selected === i;
                const bad = conflicts.has(i);
                const sameUnit =
                  selected !== null &&
                  !isSel &&
                  (Math.floor(selected / 9) === r || selected % 9 === c);
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`relative aspect-square text-[17px] font-bold transition-colors ${
                      bad
                        ? "bg-red-500/25 text-red-200"
                        : isSel
                          ? "bg-primary/30 text-foreground"
                          : sameUnit
                            ? "bg-primary/10 text-foreground"
                            : given
                              ? "text-foreground"
                              : "text-[#2dd4bf]"
                    }`}
                    style={{
                      borderRight: c % 3 === 2 && c !== 8 ? "2px solid rgba(226,232,240,0.35)" : "1px solid rgba(226,232,240,0.12)",
                      borderBottom: r % 3 === 2 && r !== 8 ? "2px solid rgba(226,232,240,0.35)" : "1px solid rgba(226,232,240,0.12)",
                    }}
                  >
                    {v !== 0 ? v : ""}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                <button
                  key={n}
                  onClick={() => place(n)}
                  className="rounded-lg border border-border bg-surface py-2.5 text-[15px] font-bold text-foreground transition-colors hover:bg-primary/10"
                >
                  {n === 0 ? "⌫" : n}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {filled}/81 filled
              </span>
              <div className="flex gap-1.5">
                {(Object.keys(DIFFICULTY) as Level[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLevel(l);
                      newGame(l);
                    }}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${level === l ? "bg-primary text-background" : "border border-border text-muted-foreground"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {won && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                <p className="text-[15px] font-bold text-emerald-400">Solved in {fmt(seconds)}!</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {mistakes === 0 ? "No mistakes — flawless." : `${mistakes} mistake${mistakes === 1 ? "" : "s"}.`}
                </p>
                <button
                  onClick={() => newGame(level)}
                  className="mt-3 rounded-xl bg-primary px-5 py-2 text-[12px] font-bold text-background"
                >
                  ↻ Another {level}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
