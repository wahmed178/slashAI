import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { feedback } from "@/lib/play-sound";

export const Route = createFileRoute("/play/rock-paper-scissors-lizard-spock")({
  head: () => ({
    meta: [
      { title: "Rock Paper Scissors Lizard Spock - Free Browser Game | SlashAI" },
      {
        name: "description",
        content:
          "The Big Bang Theory's 5-way duel: scissors cuts paper covers rock crushes lizard poisons Spock smashes scissors decapitates lizard eats paper disproves Spock vaporizes rock. Play vs AI.",
      },
    ],
  }),
  component: Rpsls,
});

const MOVES = [
  { key: "rock", emoji: "🪨", label: "Rock" },
  { key: "paper", emoji: "📄", label: "Paper" },
  { key: "scissors", emoji: "✂️", label: "Scissors" },
  { key: "lizard", emoji: "🦎", label: "Lizard" },
  { key: "spock", emoji: "🖖", label: "Spock" },
] as const;

type MoveKey = (typeof MOVES)[number]["key"];

/** what each move beats, with the flavour text */
const BEATS: Record<MoveKey, [MoveKey, string][]> = {
  scissors: [
    ["paper", "Scissors cuts Paper"],
    ["lizard", "Scissors decapitates Lizard"],
  ],
  paper: [
    ["rock", "Paper covers Rock"],
    ["spock", "Paper disproves Spock"],
  ],
  rock: [
    ["lizard", "Rock crushes Lizard"],
    ["scissors", "Rock crushes Scissors"],
  ],
  lizard: [
    ["spock", "Lizard poisons Spock"],
    ["paper", "Lizard eats Paper"],
  ],
  spock: [
    ["scissors", "Spock smashes Scissors"],
    ["rock", "Spock vaporizes Rock"],
  ],
};

const AI_PERSONALITIES = ["random", "copycat", "winner"] as const;

function aiPick(personality: (typeof AI_PERSONALITIES)[number], lastPlayer: MoveKey | null, lastAi: MoveKey | null): MoveKey {
  if (personality === "copycat" && lastPlayer) {
    // beat what the player just played
    return counterOf(lastPlayer);
  }
  if (personality === "winner" && lastAi) {
    // stick with the winner; rotate on loss handled by caller resetting lastAi
    return lastAi;
  }
  return MOVES[Math.floor(Math.random() * MOVES.length)]!.key;
}

function counterOf(m: MoveKey): MoveKey {
  // any move is countered by exactly 2 others; pick one at random
  const counters = MOVES.filter((c) => BEATS[c.key].some(([b]) => b === m));
  return counters[Math.floor(Math.random() * counters.length)]!.key;
}

function Rpsls() {
  const [personality, setPersonality] = useState<(typeof AI_PERSONALITIES)[number]>("random");
  const [lastPlayer, setLastPlayer] = useState<MoveKey | null>(null);
  const [lastAi, setLastAi] = useState<MoveKey | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [result, setResult] = useState<null | { you: string; ai: string; verdict: string }>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => Number(localStorage.getItem("rpsls-best") ?? 0));

  const play = (playerMove: MoveKey) => {
    const aiMove = aiPick(personality, lastPlayer, lastAi);
    setLastPlayer(playerMove);
    setLastAi(aiMove);

    const you = MOVES.find((m) => m.key === playerMove)!;
    const ai = MOVES.find((m) => m.key === aiMove)!;

    if (playerMove === aiMove) {
      setResult({ you: you.emoji, ai: ai.emoji, verdict: "Tie — great minds think alike" });
      feedback("tap");
      return;
    }

    const winLine = BEATS[playerMove].find(([b]) => b === aiMove);
    if (winLine) {
      setPlayerScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        if (next > bestStreak) {
          setBestStreak(next);
          localStorage.setItem("rpsls-best", String(next));
        }
        return next;
      });
      setResult({ you: you.emoji, ai: ai.emoji, verdict: `You win — ${winLine[1]}` });
      feedback("success");
    } else {
      const loseLine = BEATS[aiMove].find(([b]) => b === playerMove);
      setAiScore((s) => s + 1);
      setStreak(0);
      setResult({ you: you.emoji, ai: ai.emoji, verdict: `AI wins — ${loseLine?.[1] ?? "conflict resolved"}` });
      feedback("tap");
    }
  };

  // smart AI rotates its winning pick away so it's beatable
  useEffect(() => {
    if (personality === "winner" && lastAi && lastPlayer) {
      const t = setTimeout(() => setLastAi(null), 1200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [personality, lastAi, lastPlayer]);

  const reset = () => {
    setPlayerScore(0);
    setAiScore(0);
    setStreak(0);
    setResult(null);
    setLastPlayer(null);
    setLastAi(null);
  };

  return (
    <AppShell title="Rock Paper Scissors Lizard Spock">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🖖 RPSLS</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Five-way Rock Paper Scissors — each move beats two and loses to two. Fewer ties, more chaos.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        {/* scoreboard */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
          <span className="text-center">
            <span className="block text-xl font-black tabular-nums text-foreground">{playerScore}</span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">You</span>
          </span>
          <span className="text-[11.5px] font-semibold text-muted-foreground">
            streak {streak} · best {bestStreak}
          </span>
          <span className="text-center">
            <span className="block text-xl font-black tabular-nums text-foreground">{aiScore}</span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI</span>
          </span>
        </div>

        {/* arena */}
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          {result ? (
            <>
              <p className="text-4xl">
                {result.you} <span className="text-muted-foreground">vs</span> {result.ai}
              </p>
              <p className="mt-2 text-[13.5px] font-bold text-foreground">{result.verdict}</p>
            </>
          ) : (
            <p className="text-[13px] text-muted-foreground">Pick your move below</p>
          )}
        </div>

        {/* moves */}
        <div className="grid grid-cols-5 gap-1.5">
          {MOVES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => play(m.key)}
              aria-label={`Play ${m.label}`}
              className="ripple-press flex flex-col items-center gap-1 rounded-xl border border-border bg-surface py-3 transition-all hover:border-primary/40 hover:-translate-y-0.5 active:scale-95"
            >
              <span className="text-2xl" aria-hidden>{m.emoji}</span>
              <span className="text-[9.5px] font-bold text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>

        {/* AI personality */}
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-[12px] font-semibold text-muted-foreground">AI style</p>
          <div className="mt-2 flex gap-1.5">
            {AI_PERSONALITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPersonality(p);
                  reset();
                }}
                className={`h-8 flex-1 rounded-lg text-[11.5px] font-bold capitalize transition-colors ${
                  personality === p ? "bg-primary text-primary-foreground" : "bg-surface-elevated text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {personality === "random"
              ? "Pure chance — 1 in 5 ties, fair odds."
              : personality === "copycat"
                ? "Counters your last move. Punishes repeating yourself."
                : "Repeats its winning move — exploit it fast."}
          </p>
        </div>

        {/* rules */}
        <details className="rounded-2xl border border-border bg-surface p-4">
          <summary className="cursor-pointer text-[13px] font-bold text-foreground">📖 All 10 rules</summary>
          <ul className="mt-2 space-y-1 text-[12px] text-muted-foreground">
            {Object.values(BEATS)
              .flat()
              .map(([winner, line]) => (
                <li key={line}>{line}</li>
              ))}
          </ul>
        </details>

        <button
          type="button"
          onClick={reset}
          className="w-full text-center text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          Reset score
        </button>
      </div>
    </AppShell>
  );
}
