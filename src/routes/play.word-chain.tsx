import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

import { getGameBest, saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/word-chain")({ component: WordChain });

/**
 * Word Chain (Shiritori) — your word must begin with the last letter of the
 * previous word, no word twice. Play solo against the AI's lexicon, or
 * pass-and-play. 10 seconds per turn.
 */

/** curated starting set per letter — real English words the AI can chain with */
const LEXICON: Record<string, string[]> = {
  a: ["anchor", "apple", "arrow", "angel", "album"],
  b: ["bridge", "butter", "battle", "bottle", "balloon", "blanket"],
  c: ["candle", "cactus", "castle", "circle", "copper", "carrot"],
  d: ["dragon", "dinner", "donkey", "diamond", "danger"],
  e: ["engine", "eagle", "elephant", "earth", "envelope"],
  f: ["forest", "fabric", "feather", "fountain", "fiddle"],
  g: ["garden", "giraffe", "guitar", "golden", "gadget"],
  h: ["hammer", "harvest", "hollow", "hazard", "hurricane"],
  i: ["island", "ivory", "impact", "insect", "index"],
  j: ["jungle", "jacket", "jigsaw", "jelly", "journey"],
  k: ["kitten", "kettle", "kernel", "kidney", "kingdom"],
  l: ["lemon", "lantern", "little", "lizard", "legend"],
  m: ["mango", "mirror", "marble", "melody", "mystery"],
  n: ["needle", "napkin", "noodle", "nickel", "nature"],
  o: ["orange", "orbit", "onion", "octave", "olive"],
  p: ["pepper", "puzzle", "pillar", "planet", "pocket"],
  q: ["quartz", "quiver", "quaint", "quench"],
  r: ["ribbon", "rocket", "rubber", "raven", "rhythm"],
  s: ["silver", "saddle", "shovel", "signal", "stream"],
  t: ["tiger", "temple", "thunder", "ticket", "tunnel"],
  u: ["umbrella", "unicorn", "unfair", "uphill"],
  v: ["velvet", "violin", "voyage", "vessel", "vulture"],
  w: ["window", "wallet", "wizard", "wonder", "warrior"],
  x: ["xylophone"],
  y: ["yogurt", "yonder", "yearly"],
  z: ["zebra", "zephyr", "zigzag", "zodiac"],
};

const allWords = Object.values(LEXICON).flat();

/** AI picks a real word starting with `letter` that isn't used, prefer long */
function aiWord(letter: string, used: Set<string>): string | null {
  const pool = (LEXICON[letter] ?? []).filter((w) => !used.has(w));
  if (!pool.length) return null;
  pool.sort((a, b) => b.length - a.length);
  // not always the longest — stay beatable
  const idx = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * pool.length);
  return pool[idx] ?? null;
}

function WordChain() {
  const [mode, setMode] = useState<"ai" | "2p" | null>(null);
  const [phase, setPhase] = useState<"menu" | "play" | "over">("menu");
  const [chain, setChain] = useState<string[]>([]);
  const [turn, setTurn] = useState<"p1" | "p2" | "ai">("p1");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [time, setTime] = useState(10);
  const [best, setBest] = useState(() => getGameBest("word-chain") ?? 0);
  const [winner, setWinner] = useState<string>("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastLetter = chain.length ? chain[chain.length - 1]!.slice(-1) : "";

  const stopTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const endGame = useCallback(
    (why: string) => {
      stopTimer();
      setWinner(why);
      setPhase("over");
      const score = chain.length;
      if (score > (getGameBest("word-chain") ?? 0)) {
        saveGameBest("word-chain", score);
        setBest(score);
      }
    },
    [chain.length, stopTimer],
  );

  const beginTurn = useCallback(
    (who: "p1" | "p2" | "ai") => {
      setTurn(who);
      setTime(10);
      stopTimer();
      timer.current = setInterval(() => {
        setTime((t) => {
          if (t <= 1) {
            const loser = who === "ai" ? "You win — AI froze!" : `${who === "p1" ? "Player 2" : "Player 1"} wins on time!`;
            endGame(loser);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      if (who === "ai") {
        setTimeout(() => {
          const w = aiWord(lastLetter, new Set(chain));
          if (!w) {
            endGame("You win — AI has no word!");
          } else {
            setChain((c) => [...c, w]);
            setTurn("p1");
            setTime(10);
          }
        }, 700);
      }
    },
    [chain, endGame, lastLetter, stopTimer],
  );

  const start = (m: "ai" | "2p") => {
    setMode(m);
    const first = allWords[Math.floor(Math.random() * allWords.length)]!;
    setChain([first]);
    setPhase("play");
    setError("");
    setWinner("");
    beginTurn("p1");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => () => stopTimer(), [stopTimer]);

  const submit = () => {
    const w = input.trim().toLowerCase();
    if (!w) return;
    if (w.length < 3) {
      setError("Too short — 3+ letters");
      return;
    }
    if (chain.includes(w)) {
      setError("Already used!");
      return;
    }
    if (lastLetter && !w.startsWith(lastLetter)) {
      setError(`Must start with "${lastLetter.toUpperCase()}"`);
      return;
    }
    setError("");
    setInput("");
    const next = [...chain, w];
    setChain(next);
    if (next.length > (getGameBest("word-chain") ?? 0)) {
      saveGameBest("word-chain", next.length);
      setBest(next.length);
    }
    beginTurn(mode === "ai" ? "ai" : turn === "p1" ? "p2" : "p1");
  };

  if (phase === "menu") {
    return (
      <AppShell title="Word Chain">
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">🔗 Word Chain</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Shiritori: your word must start with the previous word's last letter. 10 seconds. No repeats.
          </p>
        </header>
        <div className="mx-auto max-w-md space-y-3">
          <button onClick={() => start("ai")} className="w-full rounded-2xl border border-border bg-surface p-5 text-left transition-all hover:border-primary/50">
            <p className="font-bold text-foreground">🤖 vs AI</p>
            <p className="text-sm text-muted-foreground">The AI answers from a real lexicon — outlast it</p>
          </button>
          <button onClick={() => start("2p")} className="w-full rounded-2xl border border-border bg-surface p-5 text-left transition-all hover:border-primary/50">
            <p className="font-bold text-foreground">👥 Pass and play</p>
            <p className="text-sm text-muted-foreground">Two players alternate on one device</p>
          </button>
          {best > 0 && <p className="text-center text-xs text-muted-foreground">Longest chain: {best} words</p>}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Word Chain">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔗 Word Chain</h1>
        <p className="mt-1 text-sm text-muted-foreground">Chain {chain.length} long · best {best}</p>
      </header>
      <div className="mx-auto max-w-md space-y-4">
        {/* the chain */}
        <div className="max-h-48 overflow-y-auto rounded-2xl border border-border bg-surface p-4">
          <div className="flex flex-wrap gap-2">
            {chain.map((w, i) => (
              <span
                key={i}
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  i === chain.length - 1 ? "bg-primary text-background" : "bg-muted text-foreground"
                }`}
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* turn + timer */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            {phase === "over"
              ? winner
              : turn === "ai"
                ? "AI is thinking…"
                : `${turn === "p1" ? "Player 1" : "Player 2"}: start with "${lastLetter.toUpperCase()}"`}
          </p>
          {phase === "play" && (
            <span className={`rounded-full px-2.5 py-1 text-sm font-bold ${time <= 3 ? "bg-red-500/15 text-red-500" : "bg-muted text-muted-foreground"}`}>
              {time}s
            </span>
          )}
        </div>

        {phase === "play" && turn !== "ai" && (
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={`a word starting with ${lastLetter.toUpperCase()}…`}
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-primary/60"
              autoFocus
            />
            <button onClick={submit} className="rounded-xl bg-primary px-5 font-semibold text-background active:scale-95">
              Chain
            </button>
          </div>
        )}
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

        {phase === "over" && (
          <button
            onClick={() => setPhase("menu")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-background active:scale-95"
          >
            <RotateCcw className="size-4" /> New game
          </button>
        )}
      </div>
    </AppShell>
  );
}
