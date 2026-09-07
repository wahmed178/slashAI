import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/checkers")({ component: Checkers });

type Cell = { p: 1 | 2; king: boolean } | null;
type Board = Cell[][];
const SIZE = 8;

interface Move {
  from: [number, number];
  to: [number, number];
  captures: [number, number][];
}

function initialBoard(): Board {
  const b: Board = Array.from({ length: SIZE }, () => Array<Cell>(SIZE).fill(null));
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if ((r + c) % 2 === 1) {
        if (r < 3) b[r]![c] = { p: 2, king: false };
        else if (r > 4) b[r]![c] = { p: 1, king: false };
      }
    }
  }
  return b;
}

function dirsFor(cell: NonNullable<Cell>): number[] {
  if (cell.king) return [-1, 1];
  return cell.p === 1 ? [-1] : [1];
}

function movesForPiece(b: Board, r: number, c: number): Move[] {
  const cell = b[r]?.[c];
  if (!cell) return [];
  const out: Move[] = [];
  for (const dr of dirsFor(cell)) {
    for (const dc of [-1, 1]) {
      const r1 = r + dr;
      const c1 = c + dc;
      const r2 = r + 2 * dr;
      const c2 = c + 2 * dc;
      if (r1 >= 0 && r1 < SIZE && c1 >= 0 && c1 < SIZE && !b[r1]![c1]) {
        out.push({ from: [r, c], to: [r1, c1], captures: [] });
      } else if (r2 >= 0 && r2 < SIZE && c2 >= 0 && c2 < SIZE) {
        const mid = b[r1]?.[c1];
        if (mid && mid.p !== cell.p && !b[r2]![c2]) {
          out.push({ from: [r, c], to: [r2, c2], captures: [[r1, c1]] });
        }
      }
    }
  }
  return out;
}

function allMoves(b: Board, p: 1 | 2): Move[] {
  const out: Move[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = b[r]![c];
      if (cell && cell.p === p) out.push(...movesForPiece(b, r, c));
    }
  }
  const caps = out.filter((m) => m.captures.length > 0);
  return caps.length > 0 ? caps : out;
}

function countPieces(b: Board, p: 1 | 2) {
  let n = 0;
  for (const row of b) for (const cell of row) if (cell && cell.p === p) n++;
  return n;
}

const NAMES: Record<1 | 2, string> = { 1: "Cyan", 2: "Red" };

function Checkers() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [chain, setChain] = useState<[number, number] | null>(null);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [winner, setWinner] = useState<0 | 1 | 2>(0);
  const [mode, setMode] = useState<"ai" | "2p">("2p");

  const legal = useMemo(() => {
    if (winner) return [] as Move[];
    if (chain) {
      const c0 = chain[0];
      const c1 = chain[1];
      return movesForPiece(board, c0, c1).filter((m) => m.captures.length > 0);
    }
    return allMoves(board, turn);
  }, [board, turn, chain, winner]);

  const targets = useMemo(
    () => (selected ? legal.filter((m) => m.from[0] === selected[0] && m.from[1] === selected[1]) : []),
    [selected, legal],
  );

  function reset() {
    setBoard(initialBoard());
    setTurn(1);
    setChain(null);
    setSelected(null);
    setWinner(0);
  }

  function apply(move: Move) {
    const nb: Board = board.map((row) => row.map((c) => (c ? { ...c } : null)));
    const src = nb[move.from[0]]![move.from[1]];
    if (!src) return;
    nb[move.from[0]]![move.from[1]] = null;
    let king = src.king;
    if (
      !king &&
      ((src.p === 1 && move.to[0] === 0) || (src.p === 2 && move.to[0] === SIZE - 1))
    ) {
      king = true;
    }
    nb[move.to[0]]![move.to[1]] = { p: src.p, king };
    for (const [mr, mc] of move.captures) nb[mr]![mc] = null;
    setBoard(nb);

    // multi-jump: same piece keeps capturing (unless it just got crowned)
    if (move.captures.length > 0 && !king) {
      const more = movesForPiece(nb, move.to[0], move.to[1]).filter((m) => m.captures.length > 0);
      if (more.length > 0) {
        setChain([move.to[0], move.to[1]]);
        setSelected([move.to[0], move.to[1]]);
        return;
      }
    }
    setChain(null);
    setSelected(null);
    const next: 1 | 2 = src.p === 1 ? 2 : 1;
    if (allMoves(nb, next).length === 0) setWinner(src.p);
    else setTurn(next);
  }

  // AI turn
  useEffect(() => {
    if (winner || mode !== "ai" || turn !== 2) return;
    const t = window.setTimeout(() => {
      const moves = chain
        ? movesForPiece(board, chain[0], chain[1]).filter((m) => m.captures.length > 0)
        : allMoves(board, 2);
      if (moves.length === 0) {
        setWinner(1);
        return;
      }
      const scored = moves.map((m) => ({
        m,
        s: m.captures.length * 10 + m.to[0] * 0.12 + Math.random() * 2,
      }));
      scored.sort((a, b) => b.s - a.s);
      apply(scored[0]!.m);
    }, 550);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, turn, chain, winner, mode]);

  function onSquare(r: number, c: number) {
    if (winner) return;
    if (mode === "ai" && turn === 2) return;
    const cell = board[r]?.[c];
    if (cell && cell.p === turn && (!chain || (chain[0] === r && chain[1] === c))) {
      const selectable = legal.some((m) => m.from[0] === r && m.from[1] === c);
      if (selectable) setSelected([r, c]);
      return;
    }
    if (selected) {
      const move = targets.find((m) => m.to[0] === r && m.to[1] === c);
      if (move) apply(move);
      else if (!chain) setSelected(null);
    }
  }

  const p1 = countPieces(board, 1);
  const p2 = countPieces(board, 2);

  return (
    <AppShell title="Checkers">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⚫ Checkers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Forced captures, crowned kings, multi-jumps. Tap your piece, then a highlighted square.
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

        <div className="flex items-center justify-between text-[12px] font-semibold">
          <span className={turn === 1 && !winner ? "text-[#2dd4bf]" : "text-muted-foreground"}>
            🔵 Cyan {p1} {turn === 1 && !winner ? "- your turn" : ""}
          </span>
          <span className={turn === 2 && !winner ? "text-[#f87171]" : "text-muted-foreground"}>
            {p2} Red 🔴 {turn === 2 && !winner ? (mode === "ai" ? "- AI thinking" : "- your turn") : ""}
          </span>
        </div>

        <div className="relative">
          <div className="grid aspect-square grid-cols-8 overflow-hidden rounded-xl border border-border">
            {board.map((row, r) =>
              row.map((cell, c) => {
                const dark = (r + c) % 2 === 1;
                const isSel = selected?.[0] === r && selected?.[1] === c;
                const isTarget = targets.some((m) => m.to[0] === r && m.to[1] === c);
                const jump = targets.some((m) => m.to[0] === r && m.to[1] === c && m.captures.length > 0);
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => onSquare(r, c)}
                    className={`relative flex items-center justify-center transition-colors ${
                      dark ? "bg-[#141b24]" : "bg-[#1d2733]"
                    } ${isSel ? "ring-2 ring-primary ring-inset" : ""} ${isTarget ? (jump ? "bg-[#f87171]/25" : "bg-primary/25") : ""}`}
                  >
                    {cell && (
                      <span
                        className={`flex size-[80%] items-center justify-center rounded-full text-[13px] font-black ${
                          cell.p === 1
                            ? "bg-[#2dd4bf] text-[#062e2a] shadow-[0_2px_0_rgba(0,0,0,0.4)]"
                            : "bg-[#f87171] text-[#3d0c0c] shadow-[0_2px_0_rgba(0,0,0,0.4)]"
                        } ${cell.king ? "border-[3px] border-foreground/40" : ""}`}
                      >
                        {cell.king ? "♛" : ""}
                      </span>
                    )}
                  </button>
                );
              }),
            )}
          </div>
          {winner !== 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/70">
              <p className="text-[20px] font-black text-foreground">{NAMES[winner]} wins! 🎉</p>
              <p className="text-[12px] text-muted-foreground">
                {winner === 1 ? p1 : p2} pieces left vs {winner === 1 ? p2 : p1}
              </p>
              <button onClick={reset} className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
                Play again
              </button>
            </div>
          )}
        </div>

        {chain && (
          <p className="text-center text-[12px] font-semibold text-primary">
            Multi-jump! Keep capturing with the same piece.
          </p>
        )}
        <p className="text-center text-[11px] text-muted-foreground">
          Captures are mandatory in this version - if a jump exists, you must take it. Reach the far
          side to crown a king that moves both ways.
        </p>
      </div>
    </AppShell>
  );
}
