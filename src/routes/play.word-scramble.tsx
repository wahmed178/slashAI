import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/word-scramble")({ component: WordScramble });

/**
 * Word Scramble — real vocabulary, three difficulty tiers, a hint that reveals
 * one letter at a time and a running streak. Words are drawn from fixed,
 * hand-checked lists rather than any generated filler.
 */

const WORDS = {
  Easy: [
    ["MANGO", "A sweet tropical fruit"], ["RIVER", "Water flowing to the sea"], ["CLOUD", "It floats and rains"],
    ["PENCIL", "You write with it"], ["GARDEN", "Where flowers grow"], ["WINTER", "The coldest season"],
    ["PIANO", "88 keys"], ["LADDER", "You climb it"], ["HONEY", "Bees make it"], ["ORANGE", "A fruit and a colour"],
    ["CANDLE", "Wax and a wick"], ["FOREST", "Many trees together"], ["SILVER", "A precious metal"],
    ["MARKET", "Where you shop"], ["ISLAND", "Land surrounded by water"],
  ],
  Medium: [
    ["BICYCLE", "Two wheels and pedals"], ["GRAVITY", "It keeps you on the ground"],
    ["MONSOON", "The seasonal rain"], ["COMPASS", "It always points north"], ["LIBRARY", "Borrow books here"],
    ["VOLCANO", "A mountain that erupts"], ["PENGUIN", "A bird that swims, not flies"],
    ["LANTERN", "A portable light"], ["ORCHARD", "A field of fruit trees"], ["HARBOUR", "A safe place for boats"],
    ["THUNDER", "You hear it after lightning"], ["MAGNET", "It attracts iron"], ["TELESCOPE", "Brings the stars closer"],
    ["PARACHUTE", "Slows your fall"], ["MELODY", "A tune you can hum"],
  ],
  Hard: [
    ["KALEIDOSCOPE", "Turning patterns in a tube"], ["ARCHIPELAGO", "A chain of islands"],
    ["PHOTOSYNTHESIS", "How plants make food"], ["ONOMATOPOEIA", "A word that sounds like its meaning"],
    ["CONSTELLATION", "A pattern of stars"], ["BIBLIOGRAPHY", "A list of sources"],
    ["ENTREPRENEUR", "Someone who starts a business"], ["PARALLELOGRAM", "A four-sided shape"],
    ["QUINTESSENTIAL", "The most perfect example"], ["INCOMPREHENSIBLE", "Impossible to understand"],
    ["THERMODYNAMICS", "Heat and energy physics"], ["EXTRAORDINARY", "Far beyond the ordinary"],
    ["CIRCUMNAVIGATE", "To sail all the way around"], ["SERENDIPITY", "A happy accident"],
    ["METAMORPHOSIS", "A caterpillar's big change"],
  ],
} as const;

type Level = keyof typeof WORDS;

function scramble(word: string): string {
  const letters = [...word];
  let out = word;
  let guard = 0;
  while (out === word && guard < 40) {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = letters[i]!;
      letters[i] = letters[j]!;
      letters[j] = t;
    }
    out = letters.join("");
    guard++;
  }
  return out;
}

const shuffleDeck = (level: Level) => {
  const deck = [...WORDS[level]];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = deck[i]!;
    deck[i] = deck[j]!;
    deck[j] = t;
  }
  return deck;
};

function WordScramble() {
  const [level, setLevel] = useState<Level>("Easy");
  const [deck, setDeck] = useState(() => shuffleDeck("Easy"));
  const [index, setIndex] = useState(0);
  const [scrambled, setScrambled] = useState(() => scramble(WORDS.Easy[0]![0]));
  const [guess, setGuess] = useState("");
  const [hint, setHint] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("slashai.scramble.best")) || 0);
  const [feedback, setFeedback] = useState<"" | "right" | "wrong" | "revealed">("");
  const [seconds, setSeconds] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const current = deck[index % deck.length]!;
  const [word, clue] = current;

  const startLevel = useCallback((l: Level) => {
    setLevel(l);
    const d = shuffleDeck(l);
    setDeck(d);
    setIndex(0);
    setScrambled(scramble(d[0]![0]));
    setGuess("");
    setHint(0);
    setScore(0);
    setStreak(0);
    setSeconds(0);
    setFeedback("");
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const next = useCallback(
    (advanced: boolean) => {
      const ni = (index + 1) % deck.length;
      setIndex(ni);
      setScrambled(scramble(deck[ni]![0]));
      setGuess("");
      setHint(0);
      if (advanced) setFeedback("");
      window.setTimeout(() => inputRef.current?.focus(), 30);
    },
    [index, deck],
  );

  const submit = () => {
    if (!guess.trim()) return;
    if (guess.trim().toUpperCase() === word) {
      const gained = Math.max(1, 10 - hint * 3);
      setScore((s) => s + gained);
      setStreak((s) => {
        const ns = s + 1;
        setBest((b) => {
          const nb = Math.max(b, ns);
          localStorage.setItem("slashai.scramble.best", String(nb));
          return nb;
        });
        return ns;
      });
      setFeedback("right");
      window.setTimeout(() => next(true), 700);
    } else {
      setStreak(0);
      setFeedback("wrong");
    }
  };

  const revealHint = () => {
    if (hint >= word.length - 1) return;
    setHint((h) => h + 1);
    setFeedback("revealed");
  };

  const revealAll = () => {
    setStreak(0);
    setHint(word.length);
    setFeedback("revealed");
  };

  const masked = useMemo(
    () => word.split("").map((c, i) => (i < hint ? c : "·")).join(" "),
    [word, hint],
  );

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <AppShell title="Word Scramble">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔀 Word Scramble</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Unscramble the word from its clue. Hints cost points, and a wrong guess resets your streak.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</p>
            <p className="text-[16px] font-black text-[#2dd4bf]">{score}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Streak</p>
            <p className="text-[16px] font-black text-amber-400">{streak}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Best streak</p>
            <p className="text-[16px] font-black text-foreground">{best}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Time</p>
            <p className="text-[16px] font-black text-foreground tabular-nums">{fmt(seconds)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Clue</p>
          <p className="mt-1 text-[13.5px] text-muted-foreground">{clue}</p>
          <p className="mt-4 font-mono text-[26px] font-black tracking-[0.18em] text-foreground sm:text-[32px]">{scrambled}</p>
          {hint > 0 && <p className="mt-2 font-mono text-[14px] tracking-[0.3em] text-primary">{masked}</p>}
          <p className="mt-2 text-[11px] text-muted-foreground">
            {word.length} letters · {level}
          </p>
        </div>

        <input
          ref={inputRef}
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value);
            if (feedback === "wrong") setFeedback("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="Type your answer…"
          className={`w-full rounded-xl border bg-surface px-4 py-3 text-center font-mono text-[16px] font-bold uppercase tracking-widest text-foreground outline-none transition-colors ${
            feedback === "wrong" ? "border-red-500/60" : feedback === "right" ? "border-emerald-500/60" : "border-border focus:border-primary/60"
          }`}
        />

        <div className="flex gap-2">
          <button onClick={submit} className="flex-1 rounded-xl bg-primary py-2.5 text-[13px] font-bold text-background">
            Check
          </button>
          <button
            onClick={revealHint}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-[12.5px] font-semibold text-foreground hover:bg-primary/10"
          >
            Hint (−3)
          </button>
          <button
            onClick={revealAll}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground"
          >
            Show
          </button>
        </div>

        {feedback === "right" && <p className="text-center text-[13px] font-bold text-emerald-400">✅ Correct!</p>}
        {feedback === "wrong" && <p className="text-center text-[13px] font-bold text-red-400">❌ Not quite — try again.</p>}
        {feedback === "revealed" && (
          <p className="text-center text-[12.5px] text-muted-foreground">
            The answer is <b className="font-mono text-foreground">{word}</b>
            <button onClick={() => next(true)} className="ml-2 font-semibold text-primary hover:underline">
              next →
            </button>
          </p>
        )}

        <div className="flex justify-center gap-1.5">
          {(Object.keys(WORDS) as Level[]).map((l) => (
            <button
              key={l}
              onClick={() => startLevel(l)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${
                level === l ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
          <button
            onClick={() => next(true)}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
          >
            Skip →
          </button>
        </div>
      </div>
    </AppShell>
  );
}
