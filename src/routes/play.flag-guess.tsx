import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/play/flag-guess")({ component: FlagGuess });

interface Country {
  name: string;
  code: string;
}

const ROUNDS = 10;
const BEST_KEY = "flag-guess-best";

/** a compact, stable pool of well-known countries; flags load from FlagsAPI (free, no key) */
const POOL: Country[] = [
  { name: "India", code: "in" }, { name: "United States", code: "us" }, { name: "Brazil", code: "br" },
  { name: "Japan", code: "jp" }, { name: "Germany", code: "de" }, { name: "France", code: "fr" },
  { name: "Italy", code: "it" }, { name: "Spain", code: "es" }, { name: "Canada", code: "ca" },
  { name: "Australia", code: "au" }, { name: "Mexico", code: "mx" }, { name: "Argentina", code: "ar" },
  { name: "United Kingdom", code: "gb" }, { name: "Netherlands", code: "nl" }, { name: "Sweden", code: "se" },
  { name: "Norway", code: "no" }, { name: "Switzerland", code: "ch" }, { name: "Poland", code: "pl" },
  { name: "Portugal", code: "pt" }, { name: "Greece", code: "gr" }, { name: "Turkey", code: "tr" },
  { name: "Egypt", code: "eg" }, { name: "South Africa", code: "za" }, { name: "Nigeria", code: "ng" },
  { name: "Kenya", code: "ke" }, { name: "Saudi Arabia", code: "sa" }, { name: "Pakistan", code: "pk" },
  { name: "Bangladesh", code: "bd" }, { name: "Indonesia", code: "id" }, { name: "South Korea", code: "kr" },
  { name: "China", code: "cn" }, { name: "Russia", code: "ru" }, { name: "Ukraine", code: "ua" },
  { name: "Vietnam", code: "vn" }, { name: "Thailand", code: "th" }, { name: "Malaysia", code: "my" },
  { name: "Singapore", code: "sg" }, { name: "New Zealand", code: "nz" }, { name: "Ireland", code: "ie" },
  { name: "Iceland", code: "is" }, { name: "Finland", code: "fi" }, { name: "Denmark", code: "dk" },
  { name: "Morocco", code: "ma" }, { name: "Ethiopia", code: "et" }, { name: "Ghana", code: "gh" },
  { name: "Chile", code: "cl" }, { name: "Colombia", code: "co" }, { name: "Peru", code: "pe" },
  { name: "Qatar", code: "qa" }, { name: "United Arab Emirates", code: "ae" },
];

interface Question {
  flagUrl: string;
  answer: string;
  options: string[];
}

function pickQuestion(): Question {
  const shuffled = [...POOL].sort(() => Math.random() - 0.5);
  const answer = shuffled[0]!;
  const distractors = shuffled.slice(1, 4).map((c) => c.name);
  const options = [answer.name, ...distractors].sort(() => Math.random() - 0.5);
  return {
    flagUrl: `https://flagsapi.com/${answer.code.toUpperCase()}/flat/64.png`,
    answer: answer.name,
    options,
  };
}

function FlagGuess() {
  const [q, setQ] = useState<Question>(() => pickQuestion());
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState(() => Number(localStorage.getItem(BEST_KEY) ?? 0));
  const [imgFailed, setImgFailed] = useState(false);

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const next = useCallback(() => {
    if (round >= ROUNDS) {
      setDone(true);
      return;
    }
    setRound((r) => r + 1);
    setPicked(null);
    setImgFailed(false);
    setQ(pickQuestion());
  }, [round]);

  useEffect(() => {
    if (!done) return;
    if (score > best) {
      setBest(score);
      localStorage.setItem(BEST_KEY, String(score));
    }
  }, [done, score, best]);

  const restart = () => {
    setRound(1);
    setScore(0);
    setPicked(null);
    setDone(false);
    setImgFailed(false);
    setQ(pickQuestion());
  };

  if (done) {
    return (
      <AppShell title="Flag Guess">
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">🚩 Flag Guess</h1>
        </header>
        <div className="mx-auto max-w-md space-y-4 text-center">
          <div className="rounded-2xl border border-border bg-surface p-8">
            <p className="text-5xl">{score >= 8 ? "🏆" : score >= 5 ? "🌍" : "🗺️"}</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{score}/{ROUNDS}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {score >= 9 ? "Geography prodigy." : score >= 7 ? "Impressive atlas knowledge." : score >= 5 ? "Solid - keep exploring." : "The world is big. Try again!"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Best this device: {best}/{ROUNDS}</p>
            <button
              onClick={restart}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <RotateCcw className="size-3.5" /> Play again
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Flag Guess">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🚩 Flag Guess</h1>
        <p className="mt-1 text-sm text-muted-foreground">Which country does this flag belong to?</p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Round {round} of {ROUNDS}</span>
          <span>Score: <b className="text-foreground">{score}</b></span>
        </div>

        <div className="grid place-items-center rounded-2xl border border-border bg-surface p-8">
          <img
            src={q.flagUrl}
            alt="Mystery flag"
            className="h-24 w-auto drop-shadow-lg"
            onError={() => setImgFailed(true)}
          />
          {imgFailed && (
            <div className="mt-2 text-center">
              <p className="text-sm text-muted-foreground">Flag image unavailable offline.</p>
              <button onClick={next} className="mt-1 text-xs font-semibold text-primary hover:underline">
                Skip round
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {q.options.map((opt) => {
            const isAnswer = opt === q.answer;
            const isPicked = picked === opt;
            return (
              <button
                key={opt}
                onClick={() => choose(opt)}
                disabled={picked !== null}
                className={`rounded-xl border p-3 text-sm font-semibold transition-colors ${
                  picked === null
                    ? "border-border bg-surface text-foreground hover:border-primary/50"
                    : isAnswer
                      ? "border-emerald-500/50 bg-emerald-500/10 text-foreground"
                      : isPicked
                        ? "border-rose-500/50 bg-rose-500/10 text-foreground"
                        : "border-border bg-surface text-muted-foreground opacity-60"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {picked && (
          <button
            onClick={next}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {round >= ROUNDS ? "See results" : "Next flag"}
          </button>
        )}
      </div>
    </AppShell>
  );
}
