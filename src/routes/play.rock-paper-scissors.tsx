import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/rock-paper-scissors")({ component: RPS });

type Move = "rock" | "paper" | "scissors";
const MOVES: { id: Move; icon: string; label: string }[] = [
  { id: "rock", icon: "🪨", label: "Rock" },
  { id: "paper", icon: "📄", label: "Paper" },
  { id: "scissors", icon: "✂️", label: "Scissors" },
];
const BEATS: Record<Move, Move> = { rock: "scissors", paper: "rock", scissors: "paper" };
const NAMES: Record<Move, string> = { rock: "Rock", paper: "Paper", scissors: "Scissors" };

function RPS() {
  const [mode, setMode] = useState<"ai" | "2p">("ai");
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [p1, setP1] = useState<Move | null>(null);
  const [p2, setP2] = useState<Move | null>(null);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [revealed, setRevealed] = useState(false);
  const lockRef = useRef(false);

  // AI picks after a short pause
  useEffect(() => {
    if (mode !== "ai" || turn !== 2 || revealed) return;
    const t = setTimeout(() => commit(Math.floor(Math.random() * 3) as 0 | 1 | 2), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, turn, revealed]);

  function commit(idx: 0 | 1 | 2) {
    if (lockRef.current) return;
    lockRef.current = true;
    const move = MOVES[idx]!.id;
    if (turn === 1) {
      setP1(move);
      if (mode === "2p") {
        setTurn(2);
        lockRef.current = false;
        return;
      }
      const ai = MOVES[Math.floor(Math.random() * 3)]!.id;
      setP2(ai);
      setRevealed(true);
      settle(move, ai);
    } else {
      setP2(move);
      setRevealed(true);
      settle(p1!, move);
    }
  }

  function settle(a: Move, b: Move) {
    if (a === b) setScores((s) => s);
    else if (BEATS[a] === b) setScores(([x, y]) => [x + 1, y] as [number, number]);
    else setScores(([x, y]) => [x, y + 1] as [number, number]);
  }

  function nextRound() {
    setP1(null);
    setP2(null);
    setRevealed(false);
    setTurn(1);
    lockRef.current = false;
  }

  function reset() {
    nextRound();
    setScores([0, 0]);
  }

  const result = revealed && p1 && p2
    ? p1 === p2
      ? "Draw!"
      : BEATS[p1] === p2
        ? "Player 1 wins the round!"
        : `${mode === "ai" ? "AI" : "Player 2"} wins the round!`
    : mode === "ai"
      ? "Choose your move"
      : `Player ${turn}: pick in secret`;

  return (
    <AppShell title="Rock Paper Scissors">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">✂️ Rock Paper Scissors</h1>
        <p className="mt-1 text-sm text-muted-foreground">Best of luck - first to outsmart the other. Vs AI or pass-and-play.</p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
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

        <div className="grid grid-cols-2 gap-2">
          {([1, 2] as const).map((p) => (
            <div
              key={p}
              className={`rounded-xl border p-4 text-center transition-colors ${
                revealed || p === (mode === "ai" ? 2 : turn) ? "border-border bg-surface" : "border-border bg-surface"
              }`}
            >
              <p className="text-[11px] font-bold text-muted-foreground">{p === 1 ? "Player 1" : mode === "ai" ? "AI" : "Player 2"}</p>
              <p className="mt-1 text-[44px] leading-none">
                {p === 1 ? (revealed ? MOVES.find((m) => m.id === p1)?.icon : p1 ? "🤜" : "❓") : revealed ? MOVES.find((m) => m.id === p2)?.icon : p2 ? "🤛" : "❓"}
              </p>
              <p className="mt-1 text-[16px] font-black text-primary">{scores[p - 1]}</p>
            </div>
          ))}
        </div>

        <p className={`text-center text-[15px] font-bold ${revealed ? "text-primary" : "text-foreground"}`}>{result}</p>

        {mode === "2p" && !revealed && turn === 2 && (
          <p className="text-center text-[12px] text-amber-400">Pass the device - Player 2 picks secretly.</p>
        )}

        {!revealed ? (
          <div className="grid grid-cols-3 gap-2">
            {MOVES.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => commit(idx as 0 | 1 | 2)}
                className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface py-4 transition-all hover:-translate-y-0.5 hover:border-primary/50"
              >
                <span className="text-[34px]">{m.icon}</span>
                <span className="text-[12px] font-semibold text-foreground">{m.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <button onClick={nextRound} className="w-full rounded-xl bg-primary py-2.5 text-[13px] font-bold text-background hover:bg-primary/90">
            Next round
          </button>
        )}

        <button onClick={reset} className="mx-auto flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground">
          <RotateCcw className="size-3" /> Reset scores
        </button>
      </div>
    </AppShell>
  );
}
