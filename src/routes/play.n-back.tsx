import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/n-back")({
  head: () => ({
    meta: [
      { title: "N-Back - Working Memory Training | SlashAI" },
      {
        name: "description",
        content:
          "Train working memory with 1-back, 2-back and 3-back N-back blocks. Real d-prime scoring, adaptive pacing, hits and false alarms. Free, no download.",
      },
    ],
  }),
  component: NBack,
});

/** Stimuli are single keys so the match test is unambiguous. */
const STIMULI = ["B", "F", "K", "M", "R"] as const;

/** Trials per block. Targets are ~45%, close to the classic 2n-IFL design. */
const BLOCK = 24;

const MODES = [
  { n: 1, name: "1-back", blurb: "Match the letter you saw one step ago" },
  { n: 2, name: "2-back", blurb: "Match the letter two steps back" },
  { n: 3, name: "3-back", blurb: "Match the letter three steps back" },
] as const;

type Phase = "idle" | "playing" | "over";

/** inverse normal CDF — turns hit/false-alarm rates into a d-prime. */
function zFromRate(p: number): number {
  const clamped = Math.min(0.999, Math.max(0.001, p));
  // Acklam's algorithm, a close and cheap approximation of erf⁻¹
  const a = [
    -39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472,
    2.50662827745924,
  ];
  const b = [
    -54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857,
  ];
  const c = [
    -0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373,
    4.37466414146497, 2.93816398269878,
  ];
  const d = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742];
  const pLow = 0.02425;
  let q: number;
  if (clamped < pLow) {
    q = Math.sqrt(-2 * Math.log(clamped));
    return (
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  if (clamped > 1 - pLow) {
    q = Math.sqrt(-2 * Math.log(1 - clamped));
    return (
      -(((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  q = clamped - 0.5;
  const r = q * q;
  return (
    ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q) /
    (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1)
  );
}

function buildSequence(n: number, count: number): string[] {
  const out: string[] = [];
  // seed with n random stimuli so the first n trials are never targets
  for (let i = 0; i < n; i++) out.push(STIMULI[Math.floor(Math.random() * STIMULI.length)]!);

  for (let i = n; i < count; i++) {
    const isTarget = Math.random() < 0.45;
    if (isTarget) {
      out.push(out[i - n]!);
    } else {
      // avoid an accidental match on the immediately previous step
      const prev = out[i - 1]!;
      const choices = STIMULI.filter((s) => s !== prev && s !== out[i - n]);
      out.push(
        choices.length
          ? choices[Math.floor(Math.random() * choices.length)]!
          : prev === "B"
            ? "F"
            : "B",
      );
    }
  }
  return out;
}

function NBack() {
  const [mode, setMode] = useState<number>(2);
  const [pace, setPace] = useState(1400);
  const [phase, setPhase] = useState<Phase>("idle");
  const [index, setIndex] = useState(0);
  const [letter, setLetter] = useState<string | null>(null);
  const [tally, setTally] = useState({ hits: 0, misses: 0, falseAlarms: 0, correctRejects: 0 });
  const [flash, setFlash] = useState<"hit" | "miss" | "fa" | null>(null);
  const [best, setBest] = useState(() => Number(localStorage.getItem("slashai.nback.best") ?? 0));

  const seq = useRef<string[]>([]);
  const answered = useRef(false);

  const hits = tally.hits;
  const misses = tally.misses;
  const falseAlarms = tally.falseAlarms;
  const correctRejects = tally.correctRejects;

  const targets = Math.max(0, seq.current.length - mode);
  const isTarget = index >= mode && seq.current[index] === seq.current[index - mode];
  const progress = Math.round(((index + 1) / BLOCK) * 100);

  const start = useCallback(() => {
    seq.current = buildSequence(mode, BLOCK);
    setIndex(0);
    setLetter(seq.current[0]!);
    setTally({ hits: 0, misses: 0, falseAlarms: 0, correctRejects: 0 });
    setFlash(null);
    answered.current = false;
    setPhase("playing");
  }, [mode]);

  const respond = useCallback(() => {
    if (phase !== "playing" || answered.current) return;
    answered.current = true;
    setTally((t) =>
      isTarget ? { ...t, hits: t.hits + 1 } : { ...t, falseAlarms: t.falseAlarms + 1 },
    );
    setFlash(isTarget ? "hit" : "fa");
  }, [isTarget, phase]);

  /* One timer per trial: expire → score the omission → show the result → move on. */
  useEffect(() => {
    if (phase !== "playing") return;
    const target = index >= mode && seq.current[index] === seq.current[index - mode];

    const t = window.setTimeout(() => {
      if (!answered.current) {
        answered.current = true;
        setTally((s) =>
          target ? { ...s, misses: s.misses + 1 } : { ...s, correctRejects: s.correctRejects + 1 },
        );
        setFlash(target ? "miss" : null);
      }
      window.setTimeout(() => {
        setFlash(null);
        setIndex((i) => {
          if (i + 1 >= BLOCK) {
            setPhase("over");
            return i;
          }
          const next = i + 1;
          setLetter(seq.current[next]!);
          answered.current = false;
          return next;
        });
      }, 300);
    }, pace);

    return () => window.clearTimeout(t);
  }, [phase, index, mode, pace]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.key !== "Enter") return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      e.preventDefault();
      if (phase === "idle" || phase === "over") start();
      else respond();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, respond, start]);

  useEffect(() => {
    if (phase !== "over") return;
    const t = tally;
    const nTargets = Math.max(1, seq.current.length - mode);
    const hitRate = t.hits / nTargets;
    const nonTargetTrials = t.correctRejects + t.falseAlarms;
    const faRate = nonTargetTrials ? t.falseAlarms / nonTargetTrials : 0;
    const d = Math.max(0, Math.round((zFromRate(hitRate) - zFromRate(faRate)) * 100) / 100);
    if (d > 0) {
      saveGameBest(`n-back-${mode}`, d);
      setBest((b) => Math.max(b, d));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const dPrime = (() => {
    const hitRate = targets ? hits / targets : 0;
    const faRate = correctRejects + falseAlarms ? falseAlarms / (correctRejects + falseAlarms) : 0;
    return Math.round((zFromRate(hitRate) - zFromRate(faRate)) * 100) / 100;
  })();

  return (
    <AppShell title="N-Back">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🧠 N-Back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The gold-standard working-memory drill used in real cognitive research. A letter appears —
          decide instantly whether it repeats the one <i>n</i> steps back.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-5">
        {phase === "idle" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-5xl">🧩</p>
              <p className="mt-3 text-sm text-muted-foreground">
                2-back trains the same ability as juggling while answering questions. It is hard on
                purpose — most people plateau at 2, and 3-back is where real training lives.
              </p>
            </div>

            <fieldset>
              <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Difficulty
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {MODES.map((m) => (
                  <button
                    key={m.n}
                    type="button"
                    onClick={() => setMode(m.n)}
                    aria-pressed={mode === m.n}
                    className={`rounded-xl border p-3 text-center transition-colors ${
                      mode === m.n
                        ? "border-primary/60 bg-primary/10"
                        : "border-border bg-surface hover:bg-surface-elevated"
                    }`}
                  >
                    <span className="block text-[14px] font-bold text-foreground">{m.name}</span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">
                      {m.blurb}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Pace
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { ms: 1800, name: "Calm" },
                  { ms: 1400, name: "Steady" },
                  { ms: 1000, name: "Brutal" },
                ].map((p) => (
                  <button
                    key={p.ms}
                    type="button"
                    onClick={() => setPace(p.ms)}
                    aria-pressed={pace === p.ms}
                    className={`rounded-xl border py-2.5 text-center transition-colors ${
                      pace === p.ms
                        ? "border-primary/60 bg-primary/10"
                        : "border-border bg-surface hover:bg-surface-elevated"
                    }`}
                  >
                    <span className="block text-[13px] font-bold text-foreground">{p.name}</span>
                    <span className="block text-[10px] text-muted-foreground">
                      {(60_000 / p.ms).toFixed(0)} / min
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <p className="text-center text-[11px] text-muted-foreground">
              Tap the big button or press{" "}
              <kbd className="rounded border border-border px-1">Space</kbd> when the letter repeats
              the one {mode} back
            </p>

            <button
              onClick={start}
              className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
            >
              ▶ Start {mode}-back
            </button>
          </div>
        )}

        {phase === "playing" && (
          <>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[12px] font-semibold text-muted-foreground">
                <span>
                  Trial {index + 1} / {BLOCK}
                </span>
                <span>{mode}-back</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div
              className={`grid h-48 place-items-center rounded-2xl border transition-colors duration-100 ${
                flash === "hit"
                  ? "border-emerald-500/60 bg-emerald-500/10"
                  : flash === "miss" || flash === "fa"
                    ? "border-red-500/60 bg-red-500/10"
                    : "border-border bg-surface"
              }`}
            >
              <span className="text-7xl font-black tracking-tight text-foreground">{letter}</span>
            </div>

            <button
              onClick={respond}
              className="h-16 w-full rounded-xl bg-primary text-base font-black text-primary-foreground transition-transform active:scale-[0.98]"
            >
              MATCH
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              Say nothing when it is different. Let the trial pass.
            </p>
          </>
        )}

        {phase === "over" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-[13px] uppercase tracking-widest text-muted-foreground">
                {mode}-back complete
              </p>
              <p className="mt-2 text-5xl font-black text-foreground">{dPrime.toFixed(2)}</p>
              <p className="mt-1 text-sm text-muted-foreground">d′ · best {best.toFixed(2)}</p>

              <dl className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-2 text-left">
                {[
                  { k: "Hits", v: `${hits}/${targets}` },
                  { k: "Missed targets", v: String(misses) },
                  { k: "False alarms", v: String(falseAlarms) },
                  { k: "Correct rejects", v: String(correctRejects) },
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

              <p className="mx-auto mt-3 max-w-sm text-[11px] leading-snug text-muted-foreground">
                {dPrime >= 2
                  ? "Elite. That is genuine working-memory capacity, not guessing."
                  : dPrime >= 1
                    ? "Strong. Keep the pace and the hit rate climbing."
                    : dPrime >= 0.4
                      ? "Solid baseline. Try a shorter pace before stepping up to the next n."
                      : "Tighten up: slow down and prioritise not missing targets, even if you miss some."}
              </p>
            </div>
            <button
              onClick={start}
              className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
            >
              ↻ Another block
            </button>
            <button
              onClick={() => setPhase("idle")}
              className="h-10 w-full rounded-xl border border-border bg-surface text-[13px] font-semibold text-muted-foreground"
            >
              Change difficulty
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
