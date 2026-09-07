import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/reversi")({ component: Reversi });

type Board = (0 | 1 | 2)[][];
const SIZE = 8;

const DIRS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function initialBoard(): Board {
  const b: Board = Array.from({ length: SIZE }, () => Array<0 | 1 | 2>(SIZE).fill(0));
  b[3]![3] = 2;
  b[3]![4] = 1;
  b[4]![3] = 1;
  b[4]![4] = 2;
  return b;
}

function flipsFor(b: Board, r: number, c: number, p: 1 | 2): [number, number][] {
  if (b[r]![c] !== 0) return [];
  const opp: 1 | 2 = p === 1 ? 2 : 1;
  const out: [number, number][] = [];
  for (const [dr, dc] of DIRS) {
    const line: [number, number][] = [];
    let rr = r + dr;
    let cc = c + dc;
    while (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE) {
      const v = b[rr]![cc];
      if (v === opp) {
        line.push([rr, cc]);
        rr += dr;
        cc += dc;
      } else if (v === p) {
        out.push(...line);
        break;
      } else break;
    }
  }
  return out;
}

function movesFor(b: Board, p: 1 | 2): [number, number][] {
  const out: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (flipsFor(b, r, c, p).length > 0) out.push([r, c]);
    }
  }
  return out;
}

function applyMove(b: Board, r: number, c: number, p: 1 | 2): Board {
  const flips = flipsFor(b, r, c, p);
  const nb = b.map((row) => [...row]) as Board;
  nb[r]![c] = p;
  for (const [fr, fc] of flips) nb[fr]![fc] = p;
  return nb;
}

// positional weights: corners are gold, corners-adjacent are poison
const WEIGHT = [
  [100, -20, 10, 5, 5, 10, -20, 100],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [10, -5, 3, 2, 2, 3, -5, 10],
  [5, -5, 2, 1, 1, 2, -5, 5],
  [5, -5, 2, 1, 1, 2, -5, 5],
  [10, -5, 3, 2, 2, 3, -5, 10],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [100, -20, 10, 5, 5, 10, -20, 100],
];

function counts(b: Board) {
  let one = 0;
  let two = 0;
  for (const row of b) for (const v of row) {
    if (v === 1) one++;
    else if (v === 2) two++;
  }
  return { one, two };
}

function Reversi() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<0 | 1 | 2>(0);
  const [passMsg, setPassMsg] = useState("");
  const [mode, setMode] = useState<"ai" | "2p">("2p");

  const myMoves = useMemo(
    () => (mode === "ai" && turn === 2 ? [] : movesFor(board, turn)),
    [board, turn, mode],
  );

  function reset() {
    setBoard(initialBoard());
    setTurn(1);
    setWinner(0);
    setPassMsg("");
  }

  function place(r: number, c: number) {
    if (winner || (mode === "ai" && turn === 2)) return;
    const flips = flipsFor(board, r, c, turn);
    if (flips.length === 0) return;
    const nb = applyMove(board, r, c, turn);
    setBoard(nb);
    setPassMsg("");
    const next: 1 | 2 = turn === 1 ? 2 : 1;
    const nextMoves = movesFor(nb, next);
    if (nextMoves.length > 0) {
      setTurn(next);
    } else if (movesFor(nb, turn).length > 0) {
      setPassMsg(next === 2 ? "Red has no move - you go again!" : "Cyan has no move - play continues.");
    } else {
      const { one, two } = counts(nb);
      setWinner(one > two ? 1 : two > one ? 2 : 0);
    }
  }

  // AI turn
  useEffect(() => {
    if (winner || mode !== "ai" || turn !== 2) return;
    const t = window.setTimeout(() => {
      const moves = movesFor(board, 2);
      if (moves.length === 0) {
        const mine = movesFor(board, 1);
        if (mine.length === 0) {
          const { one, two } = counts(board);
          setWinner(one > two ? 1 : two > one ? 2 : 0);
        } else {
          setPassMsg("AI has no move - your turn again.");
          setTurn(1);
        }
        return;
      }
      let best = moves[0]!;
      let bestScore = -Infinity;
      for (const [r, c] of moves) {
        const s = WEIGHT[r]![c]! + flipsFor(board, r, c, 2).length * 2 + Math.random();
        if (s > bestScore) {
          bestScore = s;
          best = [r, c];
        }
      }
      place(best[0], best[1]);
    }, 550);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, turn, winner, mode]);

  const { one, two } = counts(board);
  const full = one + two;

  return (
    <AppShell title="Reversi">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔵 Reversi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sandwich enemy discs to flip them. Dots mark your legal moves. Most discs when the board
          fills wins.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {([["2p", "👥 2 Players"], ["ai", "🤖 Vs AI"]] as const).map(([m, label]) => (
              <button
                key={m}
                onClick={() => { setMode(m); reset(); }}
                className={`rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                  mode === m ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button onClick={reset} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-primary/10">
            <RotateCcw className="size-3" /> Restart
          </button>
        </div>

        <div className="flex items-center justify-around rounded-xl border border-border bg-surface py-2.5 text-center">
          <div>
            <p className="text-[18px] font-bold text-[#2dd4bf]">🔵 {one}</p>
            <p className="text-[10px] text-muted-foreground">
              Cyan{turn === 1 && !winner ? " - turn" : ""}
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground">{full}/64 discs</p>
          <div>
            <p className="text-[18px] font-bold text-[#f87171]">{two} 🔴</p>
            <p className="text-[10px] text-muted-foreground">
              Red{turn === 2 && !winner ? " - turn" : ""}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="grid aspect-square grid-cols-8 overflow-hidden rounded-xl border border-border bg-[#0f1a14]">
            {board.map((row, r) =>
              row.map((v, c) => {
                const hint = !winner && myMoves.some(([mr, mc]) => mr === r && mc === c);
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => place(r, c)}
                    className="flex items-center justify-center border border-[#1c2b22] transition-colors hover:bg-[#1a2b20]"
                  >
                    {v !== 0 ? (
                      <span
                        className={`size-[78%] rounded-full shadow-[0_2px_0_rgba(0,0,0,0.4)] ${
                          v === 1
                            ? "bg-gradient-to-br from-[#5eead4] to-[#14b8a6]"
                            : "bg-gradient-to-br from-[#fca5a5] to-[#ef4444]"
                        }`}
                      />
                    ) : hint ? (
                      <span className="size-[26%] rounded-full bg-primary/45" />
                    ) : null}
                  </button>
                );
              }),
            )}
          </div>
          {winner !== 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/70">
              <p className="text-[20px] font-black text-foreground">
                {winner === 1 ? "Cyan wins! 🎉" : winner === 2 ? (mode === "ai" ? "AI wins" : "Red wins! 🎉") : "It's a draw!"}
              </p>
              <p className="text-[13px] text-muted-foreground">Final: {one} - {two}</p>
              <button onClick={reset} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                Play again
              </button>
            </div>
          )}
        </div>

        {passMsg && <p className="text-center text-[12px] font-semibold text-primary">{passMsg}</p>}
      </div>
    </AppShell>
  );
}
