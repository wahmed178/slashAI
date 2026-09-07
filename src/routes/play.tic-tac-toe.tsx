import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/tic-tac-toe")({ component: TicTacToe });

type Cell = "X" | "O" | null;
type Mode = "2p" | "ai";

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function winnerOf(b: Cell[]): { player: Cell; line: number[] } | null {
  for (const line of LINES) {
    const [a, c, d] = line;
    const val = b[a!];
    if (val && val === b[c!] && val === b[d!]) return { player: val, line };
  }
  return null;
}

/** perfect minimax play - the AI never loses */
function minimax(board: Cell[], ai: "X" | "O", turn: "X" | "O"): number {
  const win = winnerOf(board);
  if (win) return win.player === ai ? 1 : -1;
  if (board.every(Boolean)) return 0;
  const scores = board
    .map((c, i) => (c ? null : i))
    .filter((i): i is number => i !== null)
    .map((i) => {
      const next = [...board];
      next[i] = turn;
      return minimax(next, ai, turn === "X" ? "O" : "X");
    });
  return turn === ai ? Math.max(...scores) : Math.min(...scores);
}

function bestMove(board: Cell[], ai: "X" | "O"): number {
  let best = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const next = [...board];
    next[i] = ai;
    const score = minimax(next, ai, ai === "X" ? "O" : "X");
    if (score > best) {
      best = score;
      move = i;
    }
  }
  return move;
}

function TicTacToe() {
  const [mode, setMode] = useState<Mode>("ai");
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });

  const win = useMemo(() => winnerOf(board), [board]);
  const full = board.every(Boolean);
  const gameOver = Boolean(win) || full;
  const human: "X" | "O" = "X";
  const aiTurn = mode === "ai" && !xIsNext && !gameOver;

  function place(i: number) {
    if (board[i] || gameOver || (mode === "ai" && !xIsNext)) return;
    play(i);
  }

  function play(i: number) {
    const next = [...board];
    next[i] = xIsNext ? "X" : "O";
    setBoard(next);
    const w = winnerOf(next);
    if (w) setScore((s) => ({ ...s, [w.player as "X" | "O"]: s[w.player as "X" | "O"] + 1 }));
    else if (next.every(Boolean)) setScore((s) => ({ ...s, draw: s.draw + 1 }));
    setXIsNext(!xIsNext);
  }

  // AI move (slight delay so it feels deliberate)
  useEffect(() => {
    if (!aiTurn) return;
    const t = setTimeout(() => {
      const m = bestMove(board, "O");
      if (m >= 0) play(m);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiTurn, board]);

  function reset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  const status = win
    ? `${win.player} wins!`
    : full
      ? "Draw!"
      : `${xIsNext ? "X" : "O"}'s turn${mode === "ai" && xIsNext ? " (you)" : mode === "ai" ? " (AI)" : ""}`;

  return (
    <AppShell title="Tic Tac Toe">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">❌ Tic Tac Toe</h1>
        <p className="mt-1 text-sm text-muted-foreground">Play a friend on one device, or challenge the unbeatable AI.</p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        {/* mode */}
        <div className="flex justify-center gap-1.5">
          {([["ai", "🤖 Vs AI"], ["2p", "👥 2 Players"]] as const).map(([m, label]) => (
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

        {/* status */}
        <p className={`text-center text-[15px] font-bold ${win ? "text-primary" : "text-foreground"}`}>{status}</p>

        {/* board */}
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => place(i)}
              disabled={Boolean(cell) || gameOver || aiTurn}
              className={`flex aspect-square items-center justify-center rounded-xl border text-[40px] font-black transition-all ${
                win?.line.includes(i)
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border bg-surface hover:bg-surface-elevated"
              } ${cell === "X" ? "text-primary" : cell === "O" ? "text-amber-400" : "text-muted-foreground"}`}
            >
              {cell ?? ""}
            </button>
          ))}
        </div>

        {/* score + reset */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex gap-4 text-center">
            <span className="text-[12px] text-muted-foreground">X <b className="block text-[16px] text-primary">{score.X}</b></span>
            <span className="text-[12px] text-muted-foreground">Draw <b className="block text-[16px] text-foreground">{score.draw}</b></span>
            <span className="text-[12px] text-muted-foreground">O <b className="block text-[16px] text-amber-400">{score.O}</b></span>
          </div>
          <button onClick={reset} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-[12px] font-medium text-foreground transition-colors hover:bg-primary/10">
            <RotateCcw className="size-3.5" /> {gameOver ? "Next round" : "Reset"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
