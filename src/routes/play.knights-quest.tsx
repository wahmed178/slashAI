import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/knights-quest")({ component: KnightsQuest });

/**
 * Knight's Quest — the Knight's Tour. Visit every square exactly once with
 * legal L-moves. Stuck with no moves left and squares remaining? That's a
 * loss. 5×5 (open tour, start anywhere) and the classic 8×8.
 */

const KNIGHT_MOVES: [number, number][] = [
  [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2],
];

type Board = number[][]; // 0 = unvisited, else move number

function KnightsQuest() {
  const [size, setSize] = useState<5 | 8>(5);
  const [board, setBoard] = useState<Board>(() => Array.from({ length: 5 }, () => Array(5).fill(0)));
  const [pos, setPos] = useState<[number, number] | null>(null);
  const [moves, setMoves] = useState(0);
  const [state, setState] = useState<"play" | "won" | "stuck">("play");
  const [best, setBest] = useState(() => getGameBest("knights-quest") ?? 0);

  const reset = useCallback((n: 5 | 8) => {
    setSize(n);
    setBoard(Array.from({ length: n }, () => Array(n).fill(0)));
    setPos(null);
    setMoves(0);
    setState("play");
  }, []);

  const legalMoves = useCallback(
    (r: number, c: number): [number, number][] => {
      const out: [number, number][] = [];
      for (const [dr, dc] of KNIGHT_MOVES) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= size || nc >= size) continue;
        if (board[nr]![nc] === 0) out.push([nr, nc]);
      }
      return out;
    },
    [board, size],
  );

  const tap = (r: number, c: number) => {
    if (state !== "play") return;
    if (!pos) {
      // first move: anywhere
      const b = board.map((row) => [...row]);
      b[r]![c] = 1;
      setBoard(b);
      setPos([r, c]);
      setMoves(1);
      return;
    }
    const isLegal = legalMoves(pos[0], pos[1]).some(([mr, mc]) => mr === r && mc === c);
    if (!isLegal) return;
    const b = board.map((row) => [...row]);
    b[r]![c] = moves + 1;
    setBoard(b);
    setPos([r, c]);
    const next = moves + 1;
    setMoves(next);

    const total = size * size;
    if (next === total) {
      setState("won");
      const score = size === 8 ? 100 : 50;
      if (score > (getGameBest("knights-quest") ?? 0)) {
        saveGameBest("knights-quest", score);
        setBest(score);
      }
      return;
    }
    if (legalMoves(r, c).length === 0) setState("stuck");
  };

  const isLegalTarget = (r: number, c: number) =>
    state === "play" && (pos === null || legalMoves(pos[0], pos[1]).some(([mr, mc]) => mr === r && mc === c));

  const progress = Math.round((moves / (size * size)) * 100);

  return (
    <AppShell title="Knight's Quest">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">♞ Knight's Quest</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The Knight's Tour: visit every square exactly once with L-shaped moves.
        </p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {([5, 8] as const).map((n) => (
              <button
                key={n}
                onClick={() => reset(n)}
                className={`rounded-lg px-3 py-1 text-xs font-medium ${size === n ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}
              >
                {n}×{n}
              </button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {moves}/{size * size} squares · {progress}%
          </span>
        </div>

        {/* move progress bar */}
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="mx-auto grid w-fit overflow-hidden rounded-xl border-2 border-border shadow-lg" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {board.map((row, r) =>
            row.map((v, c) => {
              const dark = (r + c) % 2 === 1;
              const isPos = pos?.[0] === r && pos?.[1] === c;
              const legal = isLegalTarget(r, c);
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => tap(r, c)}
                  className={`flex items-center justify-center font-bold transition-colors ${
                    size === 5 ? "size-11 text-xs sm:size-12" : "size-9 text-[10px] sm:size-10"
                  } ${dark ? "bg-emerald-900/80" : "bg-emerald-100/10"} ${
                    legal && !isPos ? "hover:bg-sky-500/40" : ""
                  } ${legal && !isPos && v === 0 ? "ring-1 ring-inset ring-sky-400/50" : ""}`}
                >
                  {isPos ? <span className="text-xl">♞</span> : v !== 0 ? <span className="text-sky-300">{v}</span> : null}
                </button>
              );
            }),
          )}
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => {
              if (moves >= 2 && pos) {
                // undo: clear current square, step back
                const b = board.map((row) => [...row]);
                b[pos[0]]![pos[1]] = 0;
                setBoard(b);
                setMoves(moves - 1);
                // find previous position
                let prev: [number, number] | null = null;
                for (let r = 0; r < size && !prev; r++) {
                  for (let c = 0; c < size && !prev; c++) {
                    if (b[r]![c] === moves - 1) prev = [r, c];
                  }
                }
                setPos(prev);
                setState("play");
              }
            }}
            disabled={moves < 2 || state !== "play"}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-40"
          >
            ← Undo
          </button>
          <button onClick={() => reset(size)} className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground">
            <RotateCcw className="mr-1 inline size-4" /> Restart
          </button>
        </div>

        {state === "play" && !pos && <p className="text-center text-xs text-muted-foreground">Tap any square to place your knight.</p>}
        {state === "stuck" && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-center">
            <p className="text-lg font-bold text-foreground">No moves left — {moves}/{size * size} squares 😖</p>
            <button onClick={() => reset(size)} className="mt-2 rounded-xl bg-primary px-6 py-2.5 font-semibold text-background active:scale-95">
              Try again
            </button>
          </div>
        )}
        {state === "won" && (
          <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-center">
            <p className="text-lg font-bold text-foreground">Full tour! Every square visited 🏆</p>
            <button onClick={() => reset(size)} className="mt-2 rounded-xl bg-primary px-6 py-2.5 font-semibold text-background active:scale-95">
              Ride again
            </button>
          </div>
        )}

        {best > 0 && <p className="text-center text-xs text-muted-foreground">Best: {best === 100 ? "8×8 tour" : "5×5 tour"}</p>}
      </div>
    </AppShell>
  );
}
