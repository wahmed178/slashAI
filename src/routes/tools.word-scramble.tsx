import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, RotateCcw } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { feedback } from "@/lib/play-sound";

export const Route = createFileRoute("/tools/word-scramble")({
  head: () => ({
    meta: [
      { title: "Word Scramble - Free Browser Puzzle | SlashAI" },
      {
        name: "description",
        content:
          "Unscramble common 5-letter words against the clock, with hints and streak scoring. Free word puzzle, no account, works offline.",
      },
    ],
  }),
  component: WordScrambleTool,
});

/** small hand-picked common-words list (all verifiable 5-letter English words) */
const WORDS: { word: string; hint: string }[] = [
  { word: "apple", hint: "Keeps the doctor away" },
  { word: "house", hint: "Where you live" },
  { word: "money", hint: "Makes the world go round" },
  { word: "water", hint: "H2O" },
  { word: "smile", hint: "You do it when happy" },
  { word: "chair", hint: "You sit on it" },
  { word: "cloud", hint: "Floats in the sky" },
  { word: "dance", hint: "Move to music" },
  { word: "eagle", hint: "Soaring bird of prey" },
  { word: "flame", hint: "Fire's visible part" },
  { word: "grape", hint: "Small fruit in bunches" },
  { word: "heart", hint: "Beats in your chest" },
  { word: "lemon", hint: "Sour yellow fruit" },
  { word: "mouse", hint: "Squeaks or clicks" },
  { word: "night", hint: "Opposite of day" },
  { word: "ocean", hint: "Very big sea" },
  { word: "piano", hint: "88 keys" },
  { word: "queen", hint: "Royal ruler" },
  { word: "river", hint: "Flows to the sea" },
  { word: "stone", hint: "Rock solid" },
  { word: "tiger", hint: "Striped big cat" },
  { word: "voice", hint: "What you speak with" },
  { word: "world", hint: "The whole planet" },
  { word: "bread", hint: "Baked staple" },
];

function scramble(word: string): string {
  // ensure the scramble differs from the original
  for (let tries = 0; tries < 10; tries++) {
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    const out = arr.join("");
    if (out !== word) return out;
  }
  return word.split("").reverse().join("");
}

function WordScrambleTool() {
  const [entry, setEntry] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]!);
  const [scrambled, setScrambled] = useState(() => scramble(entry.word));
  const [guess, setGuess] = useState("");
  const [state, setState] = useState<"playing" | "right" | "skip">("playing");
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("slashai-scramble-best") ?? 0));

  const nextWord = () => {
    let w = entry;
    while (w.word === entry.word) w = WORDS[Math.floor(Math.random() * WORDS.length)]!;
    setEntry(w);
    setScrambled(scramble(w.word));
    setGuess("");
    setShowHint(false);
    setState("playing");
  };

  useEffect(() => {
    if (state !== "right") return;
    const t = setTimeout(nextWord, 1100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const check = (value: string) => {
    setGuess(value);
    if (value.trim().toLowerCase() === entry.word) {
      setState("right");
      setScore((s) => s + 10 + (showHint ? 0 : 5));
      setStreak((s) => {
        const next = s + 1;
        if (next > best) {
          setBest(next);
          localStorage.setItem("slashai-scramble-best", String(next));
        }
        return next;
      });
      feedback("success");
    }
  };

  const skip = () => {
    setState("skip");
    setStreak(0);
    setTimeout(nextWord, 900);
  };

  const letters = useMemo(() => scrambled.split(""), [scrambled]);

  return (
    <AppShell title="Word Scramble">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔤 Word Scramble</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Unscramble the word. Solve without a hint for a bonus. Streaks are saved on your device.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { v: score, l: "score" },
            { v: streak, l: "streak" },
            { v: best, l: "best streak" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-surface p-3 text-center">
              <p className="text-lg font-black tabular-nums text-foreground">{s.v}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <div className="flex flex-wrap justify-center gap-1.5">
            {letters.map((ch, i) => (
              <span
                key={i}
                className="grid size-10 place-items-center rounded-lg bg-surface-elevated text-xl font-black uppercase text-foreground"
              >
                {ch}
              </span>
            ))}
          </div>

          {state === "playing" && (
            <>
              <input
                value={guess}
                onChange={(e) => check(e.target.value)}
                placeholder="Type the word…"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                aria-label="Your answer"
                className="mt-5 h-11 w-full rounded-xl border border-border bg-background px-3 text-center text-[15px] font-bold uppercase tracking-widest text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <div className="mt-3 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-[12px] font-bold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Lightbulb className="size-3.5" aria-hidden /> Hint
                </button>
                <button
                  type="button"
                  onClick={skip}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-[12px] font-bold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" aria-hidden /> Skip
                </button>
              </div>
              {showHint && <p className="mt-3 text-[12.5px] italic text-muted-foreground">💡 {entry.hint}</p>}
            </>
          )}

          {state === "right" && (
            <p className="mt-4 text-[15px] font-black text-emerald-500">
              ✅ Correct — it was “{entry.word}”!
            </p>
          )}
          {state === "skip" && (
            <p className="mt-4 text-[13px] text-muted-foreground">
              It was “<b className="text-foreground">{entry.word}</b>” — next one coming…
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
