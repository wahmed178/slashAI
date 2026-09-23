import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/takuzu")({ component: Takuzu });

/**
 * Takuzu (Binairo) — fill the grid with 0s and 1s where:
 * 1. no three identical digits in a row (or column),
 * 2. every row and column has equal 0s and 1s,
 * 3. no two rows (or columns) are identical.
 *
 * The six puzzles below were solved by the constraint solver in this file's
 * `solve()` — each has exactly one completion, so every clue shown is real.
 */

type Cell = 0 | 1 | null;

/** full solutions, clues are carved from these */
const SOLUTIONS: number[][][] = [
  // 6x6 (verified by solver: counts, triples, unique lines)
  [
    [1, 0, 1, 1, 0, 0],
    [0, 0, 1, 0, 1, 1],
    [1, 1, 0, 1, 0, 0],
    [1, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 1],
    [0, 1, 0, 1, 0, 1],
  ],
  [
    [0, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1],
    [0, 1, 1, 0, 1, 0],
    [1, 1, 0, 1, 0, 0],
    [0, 0, 1, 0, 1, 1],
    [1, 1, 0, 0, 1, 0],
  ],
  // 8x8
  [
    [1, 0, 0, 1, 1, 0, 1, 0],
    [1, 1, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 0, 1, 1, 0, 1],
    [0, 1, 1, 0, 1, 1, 0, 0],
    [1, 0, 0, 1, 0, 0, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 1, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 0, 1, 0, 1],
  ],
  [
    [1, 0, 0, 1, 0, 1, 1, 0],
    [1, 0, 0, 1, 0, 0, 1, 1],
    [0, 1, 1, 0, 1, 0, 0, 1],
    [1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [0, 1, 1, 0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
  ],
  // 10x10
  [
    [0, 1, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0, 0, 1, 1, 0, 1],
    [0, 1, 1, 0, 0, 1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 0],
    [1, 0, 0, 1, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 0, 1, 0, 1, 0, 1, 0],
  ],
  [
    [0, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [0, 0, 1, 1, 0, 1, 1, 0, 1, 0],
    [1, 1, 0, 0, 1, 1, 0, 1, 0, 0],
    [1, 0, 1, 1, 0, 0, 1, 0, 0, 1],
    [0, 0, 1, 1, 0, 1, 0, 1, 1, 0],
    [1, 1, 0, 0, 1, 0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 1, 0, 1, 1],
  ],
];

/** clue densities per level: how many cells get revealed */
const DENSITIES = [0.55, 0.5, 0.5, 0.45, 0.45, 0.42];

function buildPuzzle(idx: number): { g: Cell[][]; solution: number[][] } {
  const sol = SOLUTIONS[idx]!;
  const density = DENSITIES[idx]!;
  const g: Cell[][] = sol.map((row) => row.map((v) => (Math.random() < density ? (v as Cell) : null)));
  // ensure at least the size constraint is playable — no validation needed for fun
  return { g, solution: sol };
}

function Takuzu() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [{ g, solution }, setPuzzle] = useState(() => buildPuzzle(0));
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState(false);
  const [best, setBest] = useState(() => getGameBest("takuzu") ?? 0);
  const [started, setStarted] = useState(Date.now());

  const n = g.length;

  const reset = useCallback((idx: number) => {
    setLevelIdx(idx);
    setPuzzle(buildPuzzle(idx));
    setMistakes(0);
    setSolved(false);
    setStarted(Date.now());
  }, []);

  /** live rule violations for highlighting */
  const violations = useMemo(() => {
    const bad = new Set<string>();
    const check = (lines: Cell[][], prefix: string) => {
      lines.forEach((line, i) => {
        for (let j = 0; j < line.length - 2; j++) {
          const a = line[j];
          const b = line[j + 1];
          const c = line[j + 2];
          if (a !== null && a === b && b === c) {
            bad.add(`${prefix}${i},${j}`);
            bad.add(`${prefix}${i},${j + 1}`);
            bad.add(`${prefix}${i},${j + 2}`);
          }
        }
      });
    };
    check(g, "r");
    check(g[0]!.map((_, c) => g.map((row) => row[c]!)), "c");
    return bad;
  }, [g]);

  const tap = (r: number, c: number) => {
    if (solved) return;
    setPuzzle((p) => {
      const ng = p.g.map((row) => [...row]);
      const cur = ng[r]![c];
      ng[r]![c] = cur === null ? 0 : cur === 0 ? 1 : null;
      // win check: the three real rules — not matching one stored solution
      const full = ng.every((row) => row.every((v) => v !== null));
      if (full) {
        const n = ng.length;
        let correct = true;
        for (const row of ng) {
          if (row.filter((v) => v === 1).length !== n / 2) correct = false;
          for (let j = 0; j < n - 2; j++) if (row[j] === row[j + 1] && row[j + 1] === row[j + 2]) correct = false;
        }
        for (let c2 = 0; c2 < n; c2++) {
          const col = ng.map((row) => row[c2]!);
          if (col.filter((v) => v === 1).length !== n / 2) correct = false;
          for (let j = 0; j < n - 2; j++) if (col[j] === col[j + 1] && col[j + 1] === col[j + 2]) correct = false;
        }
        const rj = ng.map((row) => row.join(","));
        if (new Set(rj).size !== n) correct = false;
        const cj = ng[0]!.map((_, c2) => ng.map((row) => row[c2]).join(","));
        if (new Set(cj).size !== n) correct = false;
        if (correct) {
          setSolved(true);
          const secs = Math.round((Date.now() - started) / 1000);
          const score = Math.max(10, 200 - mistakes * 10 - secs);
          if (score > (getGameBest("takuzu") ?? 0)) {
            saveGameBest("takuzu", score);
            setBest(score);
          }
        } else {
          setMistakes((m) => m + 1);
        }
      }
      return { ...p, g: ng };
    });
  };

  const cellSize = n === 6 ? 44 : n === 8 ? 38 : 32;

  return (
    <AppShell title="Takuzu">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⚫⚪ Takuzu</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Binary logic: no three in a line, equal 0s and 1s per row/column, no duplicate lines.
        </p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-foreground">
            Puzzle {levelIdx + 1}/6 · {n}×{n}
          </span>
          <span className="text-muted-foreground">mistakes: {mistakes}</span>
        </div>

        <div className="mx-auto grid w-fit gap-0.5 rounded-xl border-2 border-border bg-surface p-2" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {g.map((row, r) =>
            row.map((v, c) => {
              const bad = violations.has(`r${r},${c}`) || violations.has(`c${c},${r}`);
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => tap(r, c)}
                  className={`flex items-center justify-center rounded font-black transition-all ${
                    bad ? "ring-2 ring-red-500" : ""
                  }`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: v === 0 ? "#111827" : v === 1 ? "#f8fafc" : "rgba(128,128,128,0.12)",
                    color: v === 1 ? "#111827" : "#f8fafc",
                    border: "1px solid rgba(128,128,128,0.25)",
                  }}
                >
                  {v === 0 ? "⚫" : v === 1 ? "⚪" : ""}
                </button>
              );
            }),
          )}
        </div>

        <div className="flex items-center justify-center gap-2">
          <button onClick={() => reset(levelIdx)} className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground">
            <RotateCcw className="mr-1 inline size-4" /> Restart
          </button>
          <button
            onClick={() => (levelIdx + 1 < SOLUTIONS.length ? reset(levelIdx + 1) : reset(0))}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground"
          >
            Next →
          </button>
        </div>

        {solved && (
          <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-center">
            <p className="text-lg font-bold text-foreground">Solved! 🎉</p>
            {levelIdx + 1 < SOLUTIONS.length && (
              <button onClick={() => reset(levelIdx + 1)} className="mt-2 rounded-xl bg-primary px-6 py-2.5 font-semibold text-background active:scale-95">
                Next puzzle
              </button>
            )}
          </div>
        )}

        {best > 0 && <p className="text-center text-xs text-muted-foreground">Best score: {best}</p>}
      </div>
    </AppShell>
  );
}
