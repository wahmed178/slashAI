import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/stroop-test")({ component: StroopTest });

/**
 * Stroop Test - the classic psychology experiment as a game.
 * Name the INK colour of each word. Three modes:
 * - Practice: untimed, feel the effect
 * - Sprint: 30s score attack with per-answer reaction times
 * - Precision: 20 answers, accuracy + average response time graded
 * Congruent (word matches ink) rounds are mixed in as "gotchas" worth more.
 */

const COLORS = [
  { name: "RED", hex: "#f85149" },
  { name: "BLUE", hex: "#58a6ff" },
  { name: "GREEN", hex: "#3fb950" },
  { name: "YELLOW", hex: "#d29922" },
  { name: "PURPLE", hex: "#a371f7" },
];

type Mode = "practice" | "sprint" | "precision";
type Phase = "idle" | "playing" | "over";

interface Round {
  word: number;
  ink: number;
  congruent: boolean;
}

interface Result {
  correct: number;
  wrong: number;
  times: number[]; // ms per correct answer
}

function pickRound(): Round {
  const word = Math.floor(Math.random() * COLORS.length);
  let ink = word;
  const congruent = Math.random() < 0.25; // 25% match (the gotcha)
  if (!congruent) {
    while (ink === word) ink = Math.floor(Math.random() * COLORS.length);
  }
  return { word, ink, congruent };
}

const fmtMs = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`);

function StroopTest() {
  const [mode, setMode] = useState<Mode>("sprint");
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState<Round>(pickRound);
  const [timeLeft, setTimeLeft] = useState(30);
  const [result, setResult] = useState<Result>({ correct: 0, wrong: 0, times: [] });
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);
  const [best, setBest] = useState(() => Number(localStorage.getItem("slashai.stroop.best") ?? 0));
  const askTime = useRef<number>(Date.now());
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "playing" || mode !== "sprint") return;
    timer.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timer.current!);
          setPhase("over");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [phase, mode]);

  const start = () => {
    setResult({ correct: 0, wrong: 0, times: [] });
    setTimeLeft(30);
    setRound(pickRound());
    askTime.current = Date.now();
    setPhase("playing");
  };

  const answer = (colorName: string) => {
    if (phase !== "playing") return;
    const now = Date.now();
    const rt = now - askTime.current;
    const correct = COLORS[round.ink]!.name === colorName;
    const next: Result = {
      correct: result.correct + (correct ? 1 : 0),
      wrong: result.wrong + (correct ? 0 : 1),
      times: correct ? [...result.times, rt] : result.times,
    };
    // sprint scoring: congruent rounds are the trap - they pay double
    if (mode === "sprint") {
      next.correct = result.correct + (correct ? (round.congruent ? 2 : 1) : -1);
      next.correct = Math.max(0, next.correct);
    }
    setResult(next);
    setFlash(correct ? "ok" : "no");
    window.setTimeout(() => setFlash(null), 130);
    setRound(pickRound());
    askTime.current = Date.now();

    if (mode === "precision" && next.correct + next.wrong >= 20) {
      setPhase("over");
    }
  };

  useEffect(() => {
    if (phase === "over" && mode === "sprint") {
      const final = result.correct;
      if (final > best) {
        setBest(final);
        localStorage.setItem("slashai.stroop.best", String(final));
      }
    }
  }, [phase]);

  const avg = result.times.length > 0 ? result.times.reduce((a, b) => a + b, 0) / result.times.length : 0;
  const fastest = result.times.length > 0 ? Math.min(...result.times) : 0;
  const accuracy = result.correct + result.wrong > 0 ? Math.round((result.correct / (result.correct + result.wrong)) * 100) : 0;

  return (
    <AppShell title="Stroop Test">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🌈 Stroop Test</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The 1935 psychology classic. Tap the INK colour the word is printed in - reading is the enemy.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-5">
        {phase === "idle" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["practice", "📚 Practice", "Untimed warm-up"],
                  ["sprint", "⚡ Sprint", "30s score attack"],
                  ["precision", "🎯 Precision", "20 answers, graded"],
                ] as const
              ).map(([m, label, sub]) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-xl border p-3 text-center transition-colors ${
                    mode === m ? "border-primary/60 bg-primary/10" : "border-border bg-surface hover:border-primary/30"
                  }`}
                >
                  <span className="block text-[12.5px] font-bold text-foreground">{label}</span>
                  <span className="mt-0.5 block text-[10.5px] text-muted-foreground">{sub}</span>
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-4xl">🌈</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Words lie: <span className="font-bold" style={{ color: "#3fb950" }}>RED</span> might be printed green.<br />
                Always answer the <b className="text-foreground">colour of the ink</b>.<br />
                Matched words are traps worth double in Sprint.
              </p>
              {best > 0 && mode === "sprint" && (
                <p className="mt-2 text-[13px] font-semibold text-primary">Sprint best: {best}</p>
              )}
            </div>
            <button onClick={start} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              ▶ Start {mode === "practice" ? "practising" : mode === "sprint" ? "the sprint" : "the precision run"}
            </button>
          </div>
        )}

        {phase === "playing" && (
          <>
            <div className="flex items-center justify-between text-[13px] font-semibold">
              <span className="text-muted-foreground">
                {mode === "precision" ? (
                  <>Answer <b className="text-foreground">{result.correct + result.wrong}/20</b></>
                ) : (
                  <>Score <b className="text-foreground">{result.correct}</b>{best > 0 && <span className="text-muted-foreground"> · best {best}</span>}</>
                )}
              </span>
              {mode === "sprint" && <span className={timeLeft <= 5 ? "text-red-400" : "text-muted-foreground"}>⏱ {timeLeft}s</span>}
              {mode === "practice" && <span className="text-muted-foreground">📚 no pressure</span>}
            </div>

            <div
              className={`grid h-36 place-items-center rounded-2xl border transition-colors duration-150 ${
                flash === "ok" ? "border-emerald-500/60 bg-emerald-500/10" : flash === "no" ? "border-red-500/60 bg-red-500/10" : "border-border bg-surface"
              }`}
            >
              <span className="text-5xl font-black tracking-wide" style={{ color: COLORS[round.ink]!.hex }}>
                {COLORS[round.word]!.name}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => answer(c.name)}
                  className="h-12 rounded-xl text-[12px] font-bold text-white transition-transform active:scale-95"
                  style={{ background: c.hex }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </>
        )}

        {phase === "over" && (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <p className="text-[13px] uppercase tracking-widest text-muted-foreground">
                {mode === "precision" ? "Precision run" : "Sprint over"}
              </p>
              {mode === "precision" ? (
                <>
                  <p className="mt-2 text-5xl font-black text-foreground">{accuracy}%</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {result.correct}/20 correct · avg {fmtMs(avg)}
                  </p>
                  <div className="mt-3 text-[13px] font-semibold">
                    {accuracy >= 95 && avg > 0 && avg < 900 && <p className="text-emerald-400">Elite - fast AND flawless 🏆</p>}
                    {accuracy >= 95 && (avg === 0 || avg >= 900) && <p className="text-primary">Sharp - now push the speed ⚡</p>}
                    {accuracy < 95 && <p className="text-amber-400">Solid - the effect is strong in you 😄</p>}
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-2 text-5xl font-black text-foreground">{result.correct}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {result.wrong} misses · avg {fmtMs(avg)}{fastest > 0 && <> · fastest {fmtMs(fastest)}</>}
                  </p>
                  {result.correct >= best && result.correct > 0 && (
                    <p className="mt-2 text-[13px] font-semibold text-emerald-400">New personal best! 🎉</p>
                  )}
                  {best > 0 && result.correct < best && (
                    <p className="mt-2 text-sm text-muted-foreground">Best: {best}</p>
                  )}
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={start} className="h-12 rounded-xl bg-primary text-sm font-bold text-primary-foreground">↻ Again</button>
              <button onClick={() => setPhase("idle")} className="h-12 rounded-xl border border-border bg-surface text-sm font-bold text-muted-foreground">
                Modes
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
