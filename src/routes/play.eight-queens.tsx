import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/eight-queens")({ component: EightQueens });

/**
 * Eight Queens — the classic 1848 puzzle. Place 8 queens so none attacks
 * another. Attacks are highlighted live; 92 solutions exist, any one wins.
 */

const SIZE = 8;

function EightQueens() {
  /** queens as (row → col), one per row for simplicity */
  const [queens, setQueens] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [best, setBest] = useState(() => getGameBest("eight-queens") ?? 0);
  const [hintUsed, setHintUsed] = useState(false);

  const solved = queens.length === SIZE && conflicts(queens).size === 0;

  /** set of queen indices (row) that are attacked by another queen */
  function conflicts(qs: number[]): Set<number> {
    const bad = new Set<number>();
    for (let i = 0; i < qs.length; i++) {
      for (let j = i + 1; j < qs.length; j++) {
        const ri = i;
        const ci = qs[i]!;
        const rj = j;
        const cj = qs[j]!;
        if (ci === cj || Math.abs(ri - rj) === Math.abs(ci - cj)) {
          bad.add(i);
          bad.add(j);
        }
      }
    }
    return bad;
  }

  const attacked = useMemo(() => conflicts(queens), [queens]);

  /** can a queen go at (r,c) without attacking existing queens? */
  const safeAt = useCallback(
    (r: number, c: number) => {
      for (let i = 0; i < queens.length; i++) {
        const qc = queens[i]!;
        if (i === r) continue;
        if (qc === c || Math.abs(i - r) === Math.abs(qc - c)) return false;
      }
      return true;
    },
    [queens],
  );

  const tap = (r: number, c: number) => {
    if (solved) return;
    // tapping the queen in this row removes it
    if (queens[r] !== undefined) {
      setQueens((q) => q.map((v, i) => (i === r ? undefined : v)).filter((v) => v !== undefined) as number[]);
      return;
    }
    if (!safeAt(r, c)) {
      setMistakes((m) => m + 1);
    }
    // rows must be filled in order
    if (r !== queens.length) return;
    setQueens((q) => [...q, c]);
  };

  const hint = () => {
    setHintUsed(true);
    // next safe column for the current row
    const r = queens.length;
    if (r >= SIZE) return;
    for (let c = 0; c < SIZE; c++) {
      if (safeAt(r, c)) {
        setQueens((q) => [...q, c]);
        return;
      }
    }
  };

  useEffect(() => {
    if (!solved) return;
    const score = Math.max(1, 100 - mistakes * 10 - (hintUsed ? 20 : 0));
    if (score > (getGameBest("eight-queens") ?? 0)) {
      saveGameBest("eight-queens", score);
      setBest(score);
    }
  }, [solved, mistakes, hintUsed]);

  return (
    <AppShell title="Eight Queens">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">♛ Eight Queens</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Place 8 queens so no two share a row, column or diagonal. 92 solutions exist — find any one.
        </p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-foreground">{queens.length}/8 placed</span>
          <span className="text-muted-foreground">mistakes: {mistakes}{hintUsed ? " · hint used" : ""}</span>
        </div>

        <div className="mx-auto grid w-fit grid-cols-8 overflow-hidden rounded-xl border-2 border-border shadow-lg">
          {Array.from({ length: SIZE }).map((_, r) =>
            Array.from({ length: SIZE }).map((_, c) => {
              const hasQueen = queens[r] === c;
              const isAttacked = hasQueen && attacked.has(r);
              const dark = (r + c) % 2 === 1;
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => tap(r, c)}
                  className={`flex size-10 items-center justify-center text-2xl transition-colors sm:size-11 ${
                    dark ? "bg-emerald-900/80" : "bg-emerald-100/10"
                  } ${!hasQueen && safeAt(r, c) && r === queens.length ? "hover:bg-emerald-500/30" : ""}`}
                >
                  {hasQueen && <span className={isAttacked ? "drop-shadow-[0_0_6px_red]" : ""}>♛</span>}
                </button>
              );
            }),
          )}
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setQueens((q) => q.slice(0, -1))}
            disabled={!queens.length || solved}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-40"
          >
            ← Undo queen
          </button>
          <button onClick={hint} disabled={solved} className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-40">
            💡 Hint
          </button>
          <button
            onClick={() => {
              setQueens([]);
              setMistakes(0);
              setHintUsed(false);
            }}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground"
          >
            <RotateCcw className="mr-1 inline size-4" /> Reset
          </button>
        </div>

        {solved && (
          <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-center">
            <p className="text-lg font-bold text-foreground">
              Solved! All 8 queens safe {mistakes === 0 && !hintUsed ? "— flawless 👑" : ""}
            </p>
            <button
              onClick={() => {
                setQueens([]);
                setMistakes(0);
                setHintUsed(false);
              }}
              className="mt-2 rounded-xl bg-primary px-6 py-2.5 font-semibold text-background active:scale-95"
            >
              Solve again
            </button>
          </div>
        )}

        {best > 0 && <p className="text-center text-xs text-muted-foreground">Best score: {best}</p>}
      </div>
    </AppShell>
  );
}
