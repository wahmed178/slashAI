import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { feedback } from "@/lib/play-sound";

export const Route = createFileRoute("/play/peg-jump")({
  head: () => ({
    meta: [
      { title: "Peg Jump (Solo Chinese Checkers) - Free Browser Game | SlashAI" },
      {
        name: "description",
        content:
          "Classic peg solitaire on an English board: jump pegs over neighbours to remove them, leave just one peg. Free browser puzzle, no download.",
      },
    ],
  }),
  component: PegJump,
});

/** English cross board, 33 holes (7x7 minus corners). Index = y*7 + x. */
const CORNERS = new Set([0, 1, 5, 6, 7, 35, 41, 42, 43, 47, 48]);
const HOLES = Array.from({ length: 49 }, (_, i) => !CORNERS.has(i));
const CENTER = 24;

type Board = boolean[]; // true = peg present

function initialBoard(): Board {
  const b: Board = Array.from({ length: 49 }, (_, i) => !CORNERS.has(i));
  b[CENTER] = false; // classic start: empty centre
  return b;
}

function PegJump() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [selected, setSelected] = useState<number | null>(null);
  const [pegsLeft, setPegsLeft] = useState(32);
  const [won, setWon] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [moves, setMoves] = useState(0);

  const validMovesFrom = (b: Board, i: number): number[] => {
    const out: number[] = [];
    const x = i % 7;
    const y = Math.floor(i / 7);
    const dirs = [
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0],
    ];
    for (const [dx, dy] of dirs) {
      const nx = x + dx!;
      const ny = y + dy!;
      const mx = x + dx! / 2;
      const my = y + dy! / 2;
      if (nx < 0 || nx > 6 || ny < 0 || ny > 6) continue;
      const to = ny * 7 + nx;
      const mid = my * 7 + mx;
      if (!HOLES[to] || !HOLES[mid]) continue;
      if (b[mid] && !b[to]) out.push(to);
    }
    return out;
  };

  const hasAnyMove = (b: Board): boolean => {
    for (let i = 0; i < 49; i++) {
      if (b[i] && validMovesFrom(b, i).length > 0) return true;
    }
    return false;
  };

  const countPegs = (b: Board) => b.filter(Boolean).length;

  const tap = (i: number) => {
    if (won || stuck) return;

    // select a peg
    if (selected === null) {
      if (board[i]) {
        setSelected(i);
        feedback("tap");
      }
      return;
    }

    // tapped the same peg → deselect
    if (i === selected) {
      setSelected(null);
      return;
    }

    // tapped another peg → reselect
    if (board[i]) {
      setSelected(i);
      return;
    }

    // tapped an empty hole → try to jump
    if (validMovesFrom(board, selected).includes(i)) {
      const mid = (selected + i) / 2;
      const next = [...board];
      next[selected] = false;
      next[mid] = false;
      next[i] = true;
      setBoard(next);
      setSelected(null);
      setMoves((m) => m + 1);
      feedback("tap");

      const left = countPegs(next);
      setPegsLeft(left);
      if (left === 1) {
        setWon(true);
        feedback("success");
      } else if (!hasAnyMove(next)) {
        setStuck(true);
      }
      return;
    }

    // illegal
    setSelected(null);
  };

  const restart = () => {
    setBoard(initialBoard());
    setSelected(null);
    setPegsLeft(32);
    setWon(false);
    setStuck(false);
    setMoves(0);
  };

  return (
    <AppShell title="Peg Jump">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔺 Peg Jump</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Jump a peg over its neighbour into an empty hole — the jumped peg is removed. Leave
          exactly <b className="text-foreground">one</b> peg.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-2.5">
          <span className="text-[13px] font-bold text-foreground">
            Pegs left <span className="text-primary tabular-nums">{pegsLeft}</span>
          </span>
          <span className="text-[13px] text-muted-foreground">Moves {moves}</span>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1 text-[12px] font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3.5" aria-hidden /> Reset
          </button>
        </div>

        <div
          className="grid gap-1 rounded-2xl border border-border bg-surface p-3"
          style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
          role="grid"
          aria-label="Peg board"
        >
          {board.map((peg, i) => {
            const targets = selected !== null ? validMovesFrom(board, selected) : [];
            const isTarget = targets.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => HOLES[i] && tap(i)}
                disabled={!HOLES[i]}
                aria-label={HOLES[i] ? (peg ? "Peg" : "Empty hole") : "Blocked"}
                className={`grid aspect-square place-items-center rounded-full transition-all active:scale-95 ${
                  HOLES[i] ? "" : "opacity-0"
                }`}
                style={{
                  background: peg
                    ? selected === i
                      ? "var(--primary)"
                      : "color-mix(in oklab, var(--primary) 70%, var(--foreground))"
                    : isTarget
                      ? "color-mix(in oklab, var(--primary) 22%, transparent)"
                      : "var(--muted)",
                  border: isTarget ? "2px solid var(--primary)" : "none",
                  boxShadow: selected === i ? "0 0 0 3px color-mix(in oklab, var(--primary) 35%, transparent)" : undefined,
                }}
              >
                {isTarget && <span className="size-2 rounded-full" style={{ background: "var(--primary)" }} aria-hidden />}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <p className="text-center text-[12px] text-muted-foreground">
            Peg selected — tap a highlighted hole to jump, or tap the peg again to cancel.
          </p>
        )}

        {won && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center">
            <p className="text-[16px] font-black text-emerald-500">🏆 One peg left in {moves} moves!</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Perfect finish. Can you do it again with fewer moves?
            </p>
            <button
              type="button"
              onClick={restart}
              className="ripple-press mt-3 h-10 rounded-xl bg-primary px-6 text-[13px] font-bold text-primary-foreground"
            >
              Play again
            </button>
          </div>
        )}

        {stuck && !won && (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center">
            <p className="text-[15px] font-black text-foreground">No moves left — {pegsLeft} pegs remain</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Try to plan jumps so pegs don't strand each other. Fewer leftovers = better.
            </p>
            <button
              type="button"
              onClick={restart}
              className="ripple-press mt-3 h-10 rounded-xl bg-primary px-6 text-[13px] font-bold text-primary-foreground"
            >
              Try again
            </button>
          </div>
        )}

        <p className="text-center text-[11.5px] leading-relaxed text-muted-foreground">
          Solvable every time — the classic solution ends with a single peg in the centre. Pegs can
          only jump horizontally or vertically, exactly two holes.
        </p>
      </div>
    </AppShell>
  );
}
