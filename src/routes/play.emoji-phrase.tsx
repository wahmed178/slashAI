import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/play/emoji-phrase")({ component: EmojiPhrase });

interface Puzzle {
  emoji: string;
  answer: string;
  hint: string;
}

const PUZZLES: Puzzle[] = [
  { emoji: "🎬🕷️👨", answer: "Spider Man", hint: "Marvel hero" },
  { emoji: "🐝🎬", answer: "Bee Movie", hint: "According to all known laws of aviation..." },
  { emoji: "🦁👑", answer: "The Lion King", hint: "Disney classic" },
  { emoji: "❄️⛄-built like", answer: "Frozen", hint: "Let it go" },
  { emoji: "🧊🧊👶", answer: "Ice Age", hint: "Animated mammoth movie" },
  { emoji: "🍚🍽️^(worst case)", answer: "Fried Rice", hint: "Leftover dish" },
  { emoji: "🤫🧑‍🌾", answer: "Quiet Farmer", hint: "Not a phrase you know, but it is now" },
  { emoji: "👀👀👄", answer: "Eye Eye Mouth", hint: "Not a real phrase - trick question style" },
  { emoji: "🌍🚀👨", answer: "Space Mission", hint: "Leaving Earth" },
  { emoji: "🍺🎈🎉", answer: "Party Time", hint: "Celebration" },
  { emoji: "🐟💻", answer: "Phishing", hint: "Cyber scam" },
  { emoji: "🔟🎯🎯🎯🎯", answer: "Perfect Ten", hint: "Flawless score" },
  { emoji: "💣🕐", answer: "Time Bomb", hint: "Ticking danger" },
  { emoji: "🌪️🥣", answer: "Cereal Cyclone", hint: "Breakfast chaos" },
  { emoji: "🧛‍♂️🧄", answer: "Vampire Repellent", hint: "Keep Dracula away" },
  { emoji: "🐴📚", answer: "Horse Book", hint: "Actually: study hard like a stallion" },
  { emoji: "🪑🔄", answer: "Musical Chairs", hint: "Party game with seats" },
  { emoji: "🦇🧑", answer: "Bat Man", hint: "Dark Knight" },
  { emoji: "🍫🏭", answer: "Willy Wonka", hint: "Golden ticket" },
  { emoji: "🧜‍♀️🧜‍♂️💕", answer: "Mermaid Love", hint: "Underwater romance" },
  { emoji: "🌫️🔔", answer: "Fog Horn", hint: "Ship sound" },
  { emoji: "🐝🧤", answer: "Bee Glove", hint: "Beekeeper gear" },
  { emoji: "👑🥊", answer: "Boxing Champion", hint: "Title fight" },
  { emoji: "🧠🌪️", answer: "Brainstorm", hint: "Idea storm" },
  { emoji: "☀️😎🕶️", answer: "Too Cool", hint: "Sun's out" },
  { emoji: "🕷️🕸️🏢", answer: "World Wide Web", hint: "What you're using now" },
  { emoji: "🌱🎤", answer: "Rap Battle", hint: "Actually not - think smaller" },
  { emoji: "🐧🧊🏃", answer: "Slippery Slide", hint: "Antarctic fun" },
  { emoji: "📕🔥", answer: "Hot Read", hint: "Trending book" },
  { emoji: "🍕⏰", answer: "Pizza Time", hint: "Everyone's favourite hour" },
];

const TOTAL = 10;

function pickOrder(): number[] {
  const arr = PUZZLES.map((_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr.slice(0, TOTAL);
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function EmojiPhrase() {
  const [order, setOrder] = useState<number[]>(pickOrder);
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [hintOn, setHintOn] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const puzzle = useMemo(() => PUZZLES[order[idx] ?? 0] ?? PUZZLES[0]!, [order, idx]);

  const correct = normalize(guess) === normalize(puzzle.answer);

  const check = () => {
    if (revealed || !guess.trim()) return;
    if (correct) {
      setScore((s) => s + 1);
      setRevealed(true);
    } else {
      // wrong guess: shake off via brief disabled state handled by reveal-on-enter
      setRevealed(true);
    }
  };

  const next = () => {
    if (idx + 1 >= order.length) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setGuess("");
    setRevealed(false);
    setHintOn(false);
  };

  const restart = () => {
    setOrder(pickOrder());
    setIdx(0);
    setGuess("");
    setRevealed(false);
    setHintOn(false);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <AppShell title="Emoji Phrase">
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">🤡 Emoji Phrase</h1>
        </header>
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-5xl">{score >= 8 ? "🏆" : score >= 5 ? "😆" : "🤷"}</p>
          <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{score}/{TOTAL}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {score >= 8 ? "Emoji telepathy. Suspiciously good." : score >= 5 ? "Nicely decoded." : "Emojis remain a mystery. Again!"}
          </p>
          <button
            onClick={restart}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <RotateCcw className="size-3.5" /> New set
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Emoji Phrase">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🤡 Emoji Phrase</h1>
        <p className="mt-1 text-sm text-muted-foreground">Decode the phrase hidden in the emojis.</p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Puzzle {idx + 1} of {TOTAL}</span>
          <span>Solved: <b className="text-foreground">{score}</b></span>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-6xl tracking-widest" aria-label="Emoji puzzle">{puzzle.emoji}</p>
        </div>

        {!revealed ? (
          <div className="space-y-2.5">
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && check()}
              placeholder="Your guess..."
              autoFocus
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-center text-sm font-semibold text-foreground focus:border-primary/50 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={check}
                disabled={!guess.trim()}
                className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Guess
              </button>
              <button
                onClick={() => setHintOn(true)}
                disabled={hintOn}
                className="flex items-center gap-1.5 rounded-xl border border-border px-4 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-40"
              >
                <Lightbulb className="size-3.5" /> Hint
              </button>
            </div>
            {hintOn && (
              <p className="text-center text-xs text-muted-foreground">💡 {puzzle.hint}</p>
            )}
          </div>
        ) : (
          <div className={`rounded-xl border p-4 text-center ${correct ? "border-emerald-500/40 bg-emerald-500/10" : "border-rose-500/40 bg-rose-500/10"}`}>
            <p className="text-sm font-bold text-foreground">
              {correct ? "🎉 Nailed it!" : `It was: ${puzzle.answer}`}
            </p>
            <button
              onClick={next}
              className="mt-3 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {idx + 1 >= TOTAL ? "See results" : "Next puzzle"}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
