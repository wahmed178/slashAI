import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/stop-the-color")({
  head: () => ({
    meta: [
      { title: "Stop the Color - Advanced Stroop Test | SlashAI" },
      {
        name: "description",
        content:
          "Advanced Stroop brain training: 8 ink colours, 3 task modes (ink, word, counting), keyboard play, adaptive difficulty and a real interference score. Free, no download.",
      },
    ],
  }),
  component: StopTheColor,
});

/* ── ink palette ──────────────────────────────────────────────────────
 * Eight well-separated hues. The interference comes from reading the
 * word, not from squinting at two near-identical blues, so the hues
 * themselves stay legible for colour-blind players.
 */
const COLORS = [
  { name: "RED", hex: "#e5484d" },
  { name: "BLUE", hex: "#3b82f6" },
  { name: "GREEN", hex: "#22c55e" },
  { name: "YELLOW", hex: "#eab308" },
  { name: "ORANGE", hex: "#f97316" },
  { name: "PURPLE", hex: "#a855f7" },
  { name: "PINK", hex: "#ec4899" },
  { name: "CYAN", hex: "#06b6d4" },
] as const;

const MAX_COLORS = COLORS.length;

/** 1-based digit keys → colour index. Keys 1-8 pick a colour. */
const KEY_LABEL = ["1", "2", "3", "4", "5", "6", "7", "8"];

/** Task variants. Each one isolates a different interference channel. */
type Mode = "ink" | "word" | "count";

const MODES: { id: Mode; name: string; blurb: string }[] = [
  {
    id: "ink",
    name: "Name the ink",
    blurb: "Tap the colour the word is printed in. The classic 1935 Stroop task.",
  },
  {
    id: "word",
    name: "Name the word",
    blurb: "Tap the word you can actually read, ignoring the ink entirely.",
  },
  {
    id: "count",
    name: "Count the word",
    blurb: "How many times does the target word appear? Colour is pure noise.",
  },
];

/** Difficulty tiers. More time, and the palette widens as you go. */
interface Level {
  id: number;
  name: string;
  seconds: number;
  rampTo: number;
  feedback: number;
}

const LEVELS: Level[] = [
  { id: 0, name: "Warm up", seconds: 45, rampTo: 3, feedback: 260 },
  { id: 1, name: "Classic", seconds: 60, rampTo: 5, feedback: 210 },
  { id: 2, name: "Intense", seconds: 75, rampTo: 8, feedback: 160 },
];

type Phase = "idle" | "playing" | "paused" | "over";

interface Trial {
  /** for ink/word: the printed word; for count: the four printed words */
  words: string[];
  /** for ink/word: the ink colour; for count: one ink per printed word */
  inks: number[];
  /** number of correct answers accepted */
  answer: number;
  /** 0 = 8/8 shown, 1 = nothing shown yet */
  congruent: boolean;
  /** what the screen asks for, shown as a caption */
  prompt: string;
}

function mean(xs: number[]): number | null {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}

function StopTheColor() {
  const [mode, setMode] = useState<Mode>("ink");
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState<Phase>("idle");
  const [trial, setTrial] = useState<Trial | null>(null);
  const [poolSize, setPoolSize] = useState(5);

  const [correct, setCorrect] = useState(0);
  const [misses, setMisses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVELS[1]!.seconds);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);
  const [best, setBest] = useState(() =>
    Number(localStorage.getItem("slashai.stopcolor.best") ?? 0),
  );

  /** reaction times split by condition — the interference index needs both */
  const rtAll = useRef<number[]>([]);
  const rtCongruent = useRef<number[]>([]);
  const rtIncongruent = useRef<number[]>([]);
  const shownAt = useRef(0);
  const nextTimer = useRef<number | null>(null);
  const clock = useRef<number | null>(null);
  const locked = useRef(false);

  const cfg = LEVELS[level]!;

  /* ── trial generation ──────────────────────────────────────────────── */

  const makeTrial = useCallback((pool: number, m: Mode, n: number): Trial => {
    const pick = () => Math.floor(Math.random() * pool);

    if (m === "count") {
      // four printed words, one target; ink colours are decoys
      const target = pick();
      const others = Array.from({ length: MAX_COLORS - 1 }, (_, i) => (i < target ? i : i + 1));
      const slots: number[] = [];
      for (let i = 0; i < 4; i++) {
        slots.push(
          Math.random() < 0.5 ? target : others[Math.floor(Math.random() * others.length)]!,
        );
      }
      return {
        words: slots.map((i) => COLORS[i]!.name),
        inks: slots.map(() => pick()),
        answer: slots.filter((i) => i === target).length,
        congruent: false,
        prompt: `How many "${COLORS[target]!.name}"?`,
      };
    }

    // ink / word: one word, one ink, usually mismatched
    const w = pick();
    let ink = pick();
    if (ink === w) {
      // 72% incongruent once the palette is wide enough to be worth it
      if (Math.random() < (pool > 1 ? 0.72 : 0))
        ink = (ink + 1 + Math.floor(Math.random() * (pool - 1))) % pool;
      else ink = w;
    }
    return {
      words: [COLORS[w]!.name],
      inks: [ink],
      answer: m === "ink" ? ink : w,
      congruent: ink === w,
      prompt: m === "ink" ? "Tap the INK colour" : "Tap the WORD you read",
    };
  }, []);

  const nextTrial = useCallback(
    (n: number) => {
      const pool = Math.min(cfg.rampTo, Math.max(2, Math.min(MAX_COLORS, 2 + Math.floor(n / 8))));
      setPoolSize(pool);
      setTrial(makeTrial(pool, mode, n));
      shownAt.current = performance.now();
      locked.current = false;
    },
    [cfg.rampTo, makeTrial, mode],
  );

  /* ── clocks ────────────────────────────────────────────────────────── */

  useEffect(() => {
    if (phase !== "playing") return;
    clock.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPhase("over");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (clock.current) window.clearInterval(clock.current);
    };
  }, [phase]);

  // cancel a pending "advance to next trial" timer on unmount / pause
  useEffect(() => {
    return () => {
      if (nextTimer.current) window.clearTimeout(nextTimer.current);
    };
  }, []);

  /* ── scoring ───────────────────────────────────────────────────────── */

  useEffect(() => {
    if (phase !== "over") return;
    const net = Math.max(0, correct - misses);
    if (net > 0) {
      saveGameBest("stop-the-color", net);
      setBest((b) => Math.max(b, net));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const start = useCallback(() => {
    rtAll.current = [];
    rtCongruent.current = [];
    rtIncongruent.current = [];
    setCorrect(0);
    setMisses(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(cfg.seconds);
    setPhase("playing");
    nextTrial(0);
  }, [cfg.seconds, nextTrial]);

  const answer = useCallback(
    (value: number) => {
      if (phase !== "playing" || !trial || locked.current) return;
      locked.current = true;

      const rt = performance.now() - shownAt.current;
      rtAll.current.push(rt);
      (trial.congruent ? rtCongruent : rtIncongruent).current.push(rt);

      const hit = value === trial.answer;
      setFlash(hit ? "ok" : "no");
      if (hit) {
        setCorrect((c) => c + 1);
        setStreak((s) => {
          const n = s + 1;
          if (n > bestStreak) setBestStreak(n);
          return n;
        });
      } else {
        setMisses((m) => m + 1);
        setStreak(0);
      }

      const n = correct + misses + 1;
      nextTimer.current = window.setTimeout(() => {
        setFlash(null);
        if (n >= 400) {
          setPhase("over");
          return;
        }
        nextTrial(n);
      }, cfg.feedback);
    },
    [bestStreak, cfg.feedback, correct, misses, nextTrial, phase, trial],
  );

  /* ── keyboard: digits pick answers, space starts / restarts, P pauses ── */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (phase === "idle" || phase === "over") start();
        else if (phase === "playing") {
          if (nextTimer.current) window.clearTimeout(nextTimer.current);
          setPhase("paused");
        } else {
          setPhase("playing");
          shownAt.current = performance.now();
        }
        return;
      }
      if (e.key === "p" || e.key === "P") {
        if (phase === "playing") {
          if (nextTimer.current) window.clearTimeout(nextTimer.current);
          setPhase("paused");
        } else if (phase === "paused") {
          setPhase("playing");
          shownAt.current = performance.now();
        }
        return;
      }
      if (phase !== "playing") return;
      if (mode === "count") {
        const n = Number(e.key);
        if (n >= 0 && n <= 4) {
          e.preventDefault();
          answer(n);
        }
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= poolSize) {
        e.preventDefault();
        answer(n - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, mode, phase, poolSize, start]);

  /* ── derived stats ─────────────────────────────────────────────────── */

  const attempts = correct + misses;
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
  const net = Math.max(0, correct - misses);
  const rtMean = mean(rtAll.current);
  const rtC = mean(rtCongruent.current);
  const rtI = mean(rtIncongruent.current);
  /** positive = interference: reading the word slowed you down */
  const interference = rtC !== null && rtI !== null ? Math.round(rtI - rtC) : null;

  /* ── render ────────────────────────────────────────────────────────── */

  const buttonCols = mode === "count" ? "grid-cols-5" : "grid-cols-4";

  return (
    <AppShell title="Stop the Color">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎨 Stop the Color</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          An advanced Stroop lab — 8 ink colours, three task variants and a real interference score.
          Keyboard or taps.
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-5">
        {phase === "idle" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-5xl">🧠</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Your brain reads words automatically. These drills force it to override that reflex
                — the delay is called <b className="text-foreground">Stroop interference</b>, and we
                measure it for you.
              </p>
            </div>

            <fieldset>
              <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Task
              </legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    aria-pressed={mode === m.id}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      mode === m.id
                        ? "border-primary/60 bg-primary/10"
                        : "border-border bg-surface hover:bg-surface-elevated"
                    }`}
                  >
                    <span className="block text-[13px] font-bold text-foreground">{m.name}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                      {m.blurb}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Difficulty
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLevel(l.id)}
                    aria-pressed={level === l.id}
                    className={`rounded-xl border px-3 py-2.5 text-center transition-colors ${
                      level === l.id
                        ? "border-primary/60 bg-primary/10"
                        : "border-border bg-surface hover:bg-surface-elevated"
                    }`}
                  >
                    <span className="block text-[13px] font-bold text-foreground">{l.name}</span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">
                      {l.seconds}s · {l.rampTo} colours
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <p className="text-center text-[11px] text-muted-foreground">
              Press <kbd className="rounded border border-border px-1">Space</kbd> to start ·{" "}
              <kbd className="rounded border border-border px-1">1</kbd>–
              <kbd className="rounded border border-border px-1">{poolSize}</kbd> to answer ·{" "}
              <kbd className="rounded border border-border px-1">P</kbd> to pause
            </p>

            <button
              onClick={start}
              className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
            >
              ▶ Start drill
            </button>
          </div>
        )}

        {(phase === "playing" || phase === "paused") && trial && (
          <>
            <div className="flex items-center justify-between text-[13px] font-semibold">
              <span className="text-muted-foreground">
                <b className="text-foreground">{net}</b> net · {accuracy}%
              </span>
              <span className="text-muted-foreground">
                🔥 {streak} · {poolSize} colours
              </span>
              <span className={timeLeft <= 5 ? "text-red-400" : "text-muted-foreground"}>
                ⏱ {timeLeft}s
              </span>
            </div>

            <div
              className={`grid min-h-36 place-items-center rounded-2xl border px-4 py-6 text-center transition-colors duration-150 ${
                flash === "ok"
                  ? "border-emerald-500/60 bg-emerald-500/10"
                  : flash === "no"
                    ? "border-red-500/60 bg-red-500/10"
                    : "border-border bg-surface"
              }`}
            >
              <span className="mb-3 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                {trial.prompt}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                {trial.words.map((w, i) => (
                  <span
                    key={`${i}-${w}`}
                    className="text-4xl font-black tracking-wide sm:text-5xl"
                    style={{ color: COLORS[trial.inks[i]!]!.hex }}
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {mode === "count" ? (
              <div className={`grid ${buttonCols} gap-2`}>
                {[0, 1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => answer(n)}
                    className="h-12 rounded-xl bg-primary text-base font-black text-primary-foreground transition-transform active:scale-95"
                  >
                    {n}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className={`grid ${buttonCols} gap-2`}>
                  {COLORS.slice(0, poolSize).map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => answer(i)}
                      className="flex h-12 flex-col items-center justify-center rounded-xl text-white transition-transform active:scale-95"
                      style={{ background: c.hex }}
                    >
                      <span className="text-[11px] font-bold leading-none">{c.name}</span>
                      <span className="mt-0.5 text-[9px] font-semibold opacity-80 leading-none">
                        {KEY_LABEL[i]}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-center text-[11px] text-muted-foreground">
                  <kbd className="rounded border border-border px-1">P</kbd> pause ·{" "}
                  <kbd className="rounded border border-border px-1">Space</kbd> stop
                </p>
              </>
            )}
          </>
        )}

        {phase === "over" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-[13px] uppercase tracking-widest text-muted-foreground">
                {MODES.find((m) => m.id === mode)?.name} · {cfg.name}
              </p>
              <p className="mt-2 text-5xl font-black text-foreground">{net}</p>
              <p className="mt-1 text-sm text-muted-foreground">net score · best {best}</p>

              <dl className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-2 text-left">
                {[
                  { k: "Correct", v: String(correct) },
                  { k: "Missed", v: String(misses) },
                  { k: "Accuracy", v: `${accuracy}%` },
                  { k: "Best streak", v: String(bestStreak) },
                  { k: "Mean response", v: rtMean ? `${Math.round(rtMean)} ms` : "—" },
                  {
                    k: "Interference",
                    v:
                      interference === null
                        ? "—"
                        : `${interference > 0 ? "+" : ""}${interference} ms`,
                  },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="rounded-lg border border-border bg-surface-elevated px-3 py-2"
                  >
                    <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {row.k}
                    </dt>
                    <dd className="text-[14px] font-bold text-foreground">{row.v}</dd>
                  </div>
                ))}
              </dl>

              {interference !== null && (
                <p className="mx-auto mt-3 max-w-sm text-[11px] leading-snug text-muted-foreground">
                  {interference > 60
                    ? "Strong interference — the word is hijacking your attention. Slow down and read the task, not the word."
                    : interference > 25
                      ? "Mild interference — normal range for a trained reader. Under 25 ms is genuinely good control."
                      : "Excellent control — the ink barely slows you down."}
                </p>
              )}

              {net >= 60 && (
                <p className="mt-3 text-[13px] font-semibold text-emerald-400">Elite focus 🏆</p>
              )}
              {net >= 35 && net < 60 && (
                <p className="mt-3 text-[13px] font-semibold text-primary">Sharp brain ⚡</p>
              )}
            </div>
            <button
              onClick={start}
              className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
            >
              ↻ Run it again
            </button>
            <button
              onClick={() => setPhase("idle")}
              className="h-10 w-full rounded-xl border border-border bg-surface text-[13px] font-semibold text-muted-foreground"
            >
              Change task or difficulty
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
