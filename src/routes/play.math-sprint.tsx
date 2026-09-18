import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Timer, Flame, RotateCcw, Zap } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/play/math-sprint")({
  head: () => ({
    meta: [
      { title: "Speed Math Sprint - SlashPlay | SlashAI" },
      {
        name: "description",
        content: "60-second rapid-fire mental math sprint. Answer as many arithmetic problems as you can, build combos and beat your high score.",
      },
    ],
  }),
  component: MathSprintPage,
});

interface Problem {
  q: string;
  answer: number;
  options: number[];
}

function generateProblem(): Problem {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = 0;
  let b = 0;
  let answer = 0;

  if (op === "+") {
    a = Math.floor(Math.random() * 45) + 5;
    b = Math.floor(Math.random() * 45) + 5;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 50) + 15;
    b = Math.floor(Math.random() * (a - 5)) + 3;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 12) + 2;
    b = Math.floor(Math.random() * 12) + 2;
    answer = a * b;
  }

  // Generate 3 unique wrong options
  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const candidate = answer + delta;
    if (candidate >= 0 && candidate !== answer) {
      options.add(candidate);
    }
  }

  const shuffled = Array.from(options).sort(() => Math.random() - 0.5);
  return { q: `${a} ${op} ${b}`, answer, options: shuffled };
}

function loadBest(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.localStorage.getItem("play-math-sprint-best") ?? 0) || 0;
  } catch {
    return 0;
  }
}

function MathSprintPage() {
  const [phase, setPhase] = useState<"idle" | "playing" | "gameover">("idle");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [highScore, setHighScore] = useState(loadBest);
  const [current, setCurrent] = useState<Problem>(generateProblem);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const timerRef = useRef<number>(0);

  const startGame = () => {
    setPhase("playing");
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCurrent(generateProblem());
    setSelectedOption(null);
    setIsCorrect(null);
  };

  useEffect(() => {
    if (phase !== "playing") return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase("gameover");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === "gameover") {
      setHighScore((prev) => {
        if (score > prev) {
          try {
            window.localStorage.setItem("play-math-sprint-best", String(score));
          } catch {
            // ignore
          }
          return score;
        }
        return prev;
      });
    }
  }, [phase, score]);

  const handlePick = (chosen: number) => {
    if (phase !== "playing" || selectedOption !== null) return;
    setSelectedOption(chosen);

    const correct = chosen === current.answer;
    setIsCorrect(correct);

    if (correct) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);

      const multiplier = nextStreak >= 5 ? 2.5 : nextStreak >= 3 ? 1.5 : 1;
      const points = Math.round(100 * multiplier);
      setScore((s) => s + points);
    } else {
      setStreak(0);
    }

    window.setTimeout(() => {
      setCurrent(generateProblem());
      setSelectedOption(null);
      setIsCorrect(null);
    }, 280);
  };

  return (
    <AppShell title="Speed Math Sprint">
      <div className="mx-auto max-w-md pb-12">
        <header className="page-enter pt-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
            <Zap className="size-6" />
          </div>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Speed Math Sprint
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            60 seconds on the clock. Fast mental math with combo streaks.
          </p>
        </header>

        {/* Dashboard */}
        <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl border border-border bg-surface p-3 text-center">
          <div>
            <span className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              <Timer className="size-3" /> Time
            </span>
            <span className={cn("mt-0.5 block text-xl font-mono font-black", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
              {timeLeft}s
            </span>
          </div>

          <div>
            <span className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              <Flame className="size-3 text-amber-400" /> Streak
            </span>
            <span className="mt-0.5 block text-xl font-mono font-black text-amber-400">
              {streak}x
            </span>
          </div>

          <div>
            <span className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              <Trophy className="size-3 text-primary" /> Best
            </span>
            <span className="mt-0.5 block text-xl font-mono font-black text-primary">
              {highScore.toLocaleString()}
            </span>
          </div>
        </div>

        {phase === "idle" && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-surface p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-foreground">Ready to test your speed?</h2>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Answer arithmetic equations as fast as possible. Combos multiply your score.
            </p>
            <Button size="lg" onClick={startGame} className="w-full font-bold">
              Start 60s Sprint
            </Button>
          </div>
        )}

        {phase === "playing" && (
          <div className="mt-6 space-y-4">
            {/* Score header */}
            <div className="text-center">
              <span className="text-3xl font-mono font-black text-foreground tracking-tight">
                {score.toLocaleString()}
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-primary">Points</span>
            </div>

            {/* Question card */}
            <div className="flex h-36 items-center justify-center rounded-2xl border border-primary/40 bg-surface-elevated text-4xl font-mono font-black text-foreground shadow-inner">
              {current.q} = ?
            </div>

            {/* 4 options */}
            <div className="grid grid-cols-2 gap-3">
              {current.options.map((opt) => {
                const isSelected = selectedOption === opt;
                let optStyle = "border-border bg-surface text-foreground hover:border-primary/60 hover:bg-surface-elevated";
                if (isSelected && isCorrect === true) {
                  optStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300";
                } else if (isSelected && isCorrect === false) {
                  optStyle = "border-destructive bg-destructive/20 text-destructive";
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={selectedOption !== null}
                    onClick={() => handlePick(opt)}
                    className={cn(
                      "flex h-20 items-center justify-center rounded-2xl border font-mono text-2xl font-bold transition-all active:scale-95",
                      optStyle
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {phase === "gameover" && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-surface p-8 text-center space-y-4">
            <span className="inline-block text-4xl">🏁</span>
            <h2 className="text-xl font-bold text-foreground">Time's Up!</h2>
            <div className="rounded-xl border border-border bg-surface-elevated p-4">
              <div className="text-3xl font-mono font-black text-primary">
                {score.toLocaleString()}
              </div>
              <span className="text-xs text-muted-foreground">Final Score · Max Streak: {bestStreak}x</span>
            </div>

            {score > highScore ? (
              <p className="text-xs font-semibold text-emerald-400">🎉 New Personal Best!</p>
            ) : (
              <p className="text-xs text-muted-foreground">Personal best: {highScore.toLocaleString()}</p>
            )}

            <Button size="lg" onClick={startGame} className="w-full gap-2 font-bold">
              <RotateCcw className="size-4" /> Play Again
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
