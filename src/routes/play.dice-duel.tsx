import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/dice-duel")({ component: DiceDuel });

const TARGET = 100;
const FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function DiceDuel() {
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [turnTotal, setTurnTotal] = useState(0);
  const [face, setFace] = useState(6);
  const [rolling, setRolling] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<1 | 2 | null>(null);

  function roll() {
    if (winner || rolling) return;
    setRolling(true);
    setTimeout(() => {
      const d = Math.floor(Math.random() * 6) + 1;
      setFace(d);
      if (d === 1) {
        setTurnTotal(0);
        setTurn((t) => (t === 1 ? 2 : 1));
        setLog((l) => [`Player ${turn} rolled a 1 - turn lost!`, ...l].slice(0, 6));
      } else {
        const nt = turnTotal + d;
        setTurnTotal(nt);
        setLog((l) => [`Player ${turn} rolled ${d} (turn: ${nt})`, ...l].slice(0, 6));
      }
      setRolling(false);
    }, 350);
  }

  function hold() {
    if (winner || rolling || turnTotal === 0) return;
    const idx = turn - 1;
    const newScores: [number, number] = [...scores];
    newScores[idx] = newScores[idx]! + turnTotal;
    setScores(newScores);
    setLog((l) => [`Player ${turn} banked ${turnTotal} (total: ${newScores[idx]})`, ...l].slice(0, 6));
    if (newScores[idx]! >= TARGET) {
      setWinner(turn);
      setTurnTotal(0);
      return;
    }
    setTurnTotal(0);
    setTurn((t) => (t === 1 ? 2 : 1));
  }

  function reset() {
    setScores([0, 0]);
    setTurn(1);
    setTurnTotal(0);
    setFace(6);
    setLog([]);
    setWinner(null);
  }

  return (
    <AppShell title="Dice Duel">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎲 Dice Duel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Roll to build your turn score, but a 1 wipes it. Bank with Hold - first to {TARGET} wins.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        {/* scoreboards */}
        <div className="grid grid-cols-2 gap-2">
          {([1, 2] as const).map((p) => (
            <div
              key={p}
              className={`rounded-xl border p-3 text-center transition-colors ${
                turn === p && !winner ? "border-primary/50 bg-primary/10" : "border-border bg-surface"
              }`}
            >
              <p className={`text-[12px] font-bold ${turn === p ? "text-primary" : "text-muted-foreground"}`}>
                Player {p}
              </p>
              <p className="text-[28px] font-black text-foreground">{scores[p - 1]}</p>
              {turn === p && !winner && (
                <p className="text-[11px] text-primary">turn: {turnTotal}</p>
              )}
            </div>
          ))}
        </div>

        {/* die */}
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface py-6">
          <span className={`text-[64px] leading-none text-foreground ${rolling ? "animate-pulse" : ""}`}>
            {FACES[face - 1]}
          </span>
          {winner ? (
            <p className="text-[18px] font-black text-primary">🏆 Player {winner} wins!</p>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={roll}
                disabled={rolling}
                className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-background transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {rolling ? "Rolling..." : "Roll"}
              </button>
              <button
                onClick={hold}
                disabled={rolling || turnTotal === 0}
                className="rounded-xl border border-border bg-surface-elevated px-6 py-2.5 text-[13px] font-bold text-foreground transition-colors hover:bg-primary/10 disabled:opacity-40"
              >
                Hold ({turnTotal})
              </button>
            </div>
          )}
          <button onClick={reset} className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground">
            <RotateCcw className="size-3" /> New game
          </button>
        </div>

        {/* log */}
        {log.length > 0 && (
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recent</p>
            {log.map((entry, i) => (
              <p key={i} className={`text-[12px] ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>
                {entry}
              </p>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
