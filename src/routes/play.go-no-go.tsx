import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/go-no-go")({
  head: () => ({
    meta: [
      { title: "Go / No-Go - Inhibitory Control Training | SlashAI" },
      {
        name: "description",
        content:
          "Tap the green circles, hold back on the blue ones. Train inhibitory control with real d-prime scoring, commission errors and omission errors. Free, no download.",
      },
    ],
  }),
  component: GoNoGo,
});

const TRIALS = 40;
/** 30% stop trials — enough to measure inhibition without becoming a guessing game. */
const STOP_RATE = 0.3;
/** go trials unanswered after this count as omissions */
const OMIT_MS = 1500;
/** beat this to score */
const MAX_RT = 500;

type Phase = "idle" | "fixate" | "running" | "done";

function zFromRate(p: number): number {
  const c = Math.min(0.999, Math.max(0.001, p));
  const a = [
    -39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472,
    2.50662827745924,
  ];
  const b = [
    -54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857,
  ];
  const cc = [
    -0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373,
    4.37466414146497, 2.93816398269878,
  ];
  const d = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742];
  const lo = 0.02425;
  let q: number;
  if (c < lo) {
    q = Math.sqrt(-2 * Math.log(c));
    return (
      (((((cc[0]! * q + cc[1]!) * q + cc[2]!) * q + cc[3]!) * q + cc[4]!) * q + cc[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  if (c > 1 - lo) {
    q = Math.sqrt(-2 * Math.log(1 - c));
    return (
      -(((((cc[0]! * q + cc[1]!) * q + cc[2]!) * q + cc[3]!) * q + cc[4]!) * q + cc[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  q = c - 0.5;
  const r = q * q;
  return (
    ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q) /
    (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1)
  );
}

function GoNoGo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [index, setIndex] = useState(0);
  const [isStop, setIsStop] = useState(false);
  const [flash, setFlash] = useState<"hit" | "miss" | null>(null);
  const [tally, setTally] = useState({
    hits: 0,
    misses: 0,
    commissions: 0,
    omissions: 0,
    rts: [] as number[],
  });
  const [best, setBest] = useState(() => Number(localStorage.getItem("slashai.gonogo.best") ?? 0));

  const plan = useRef<boolean[]>([]);
  const shownAt = useRef(0);
  const answered = useRef(false);

  /** score the trial, then hand over to the next fixate after a beat */
  const finish = useCallback(() => {
    window.setTimeout(() => {
      setFlash(null);
      setIndex((i) => {
        if (i + 1 >= TRIALS) {
          setPhase("done");
          return i;
        }
        const next = i + 1;
        setIsStop(plan.current[next]!);
        answered.current = false;
        setPhase("fixate");
        return next;
      });
    }, 260);
  }, []);

  const goTrials = plan.current.filter((s) => !s).length;
  const stopTrials = plan.current.filter((s) => s).length;
  const dPrime = (() => {
    const hr = goTrials ? tally.hits / goTrials : 0;
    const nStop = stopTrials + tally.commissions;
    const fr = nStop ? tally.commissions / nStop : 0;
    if (!goTrials || !nStop) return 0;
    return Math.round((zFromRate(hr) - zFromRate(fr)) * 100) / 100;
  })();
  const meanRt = tally.rts.length
    ? Math.round(tally.rts.reduce((a, b) => a + b, 0) / tally.rts.length)
    : 0;

  const start = useCallback(() => {
    // exactly 30% stop trials, shuffled, so the score is comparable run to run
    const stops = Math.round(TRIALS * STOP_RATE);
    const seq = Array.from({ length: TRIALS }, (_, i) => i < stops);
    for (let i = seq.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [seq[i], seq[j]] = [seq[j]!, seq[i]!];
    }
    plan.current = seq;
    setIndex(0);
    setIsStop(seq[0]!);
    setTally({ hits: 0, misses: 0, commissions: 0, omissions: 0, rts: [] });
    setFlash(null);
    answered.current = false;
    setPhase("fixate");
  }, []);

  /* fixate → stimulus → resolve, one scheduled chain per trial */
  useEffect(() => {
    if (phase !== "fixate") return;
    const t = window.setTimeout(() => {
      shownAt.current = performance.now();
      answered.current = false;
      setPhase("running");
    }, 600);
    return () => window.clearTimeout(t);
  }, [phase, index]);

  useEffect(() => {
    if (phase !== "running") return;
    // Every trial gets the same response window. On a go trial, silence past
    // the window is an omission; on a no-go trial, waiting it out is correct.
    const t = window.setTimeout(() => {
      if (answered.current) return;
      answered.current = true;
      if (!isStop) {
        setTally((s) => ({ ...s, omissions: s.omissions + 1 }));
        setFlash("miss");
      }
      finish();
    }, OMIT_MS);
    return () => window.clearTimeout(t);
  }, [finish, index, isStop, phase]);

  const respond = useCallback(() => {
    if (phase !== "running" || answered.current) return;
    answered.current = true;
    const rt = performance.now() - shownAt.current;
    if (isStop) {
      setTally((s) => ({ ...s, commissions: s.commissions + 1 }));
      setFlash("miss");
    } else {
      setTally((s) => ({ ...s, hits: s.hits + 1, rts: [...s.rts, Math.round(rt)] }));
      setFlash("hit");
    }
    finish();
  }, [finish, isStop, phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.key !== "Enter") return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      e.preventDefault();
      if (phase === "idle" || phase === "done") start();
      else if (phase === "running") respond();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, respond, start]);

  useEffect(() => {
    if (phase !== "done") return;
    const score = Math.round(dPrime * 100);
    if (score > 0) {
      saveGameBest("go-no-go", score);
      setBest((b) => Math.max(b, score));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <AppShell title="Go / No-Go">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🚦 Go / No-Go</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap every <b className="text-emerald-400">green</b> circle as fast as you can — and do
          absolutely nothing on the <b className="text-sky-400">blue</b> ones. The blue ones are the
          whole test.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-5">
        {phase === "idle" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-5xl">🧠</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                This is the classic childhood go/no-go task, still the cleanest measure of
                inhibitory control — the ability to stop a response you have already started.
                Impulsive lapses here predict risk-taking far better than raw reaction time.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-border bg-surface p-4 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/25 text-emerald-400">
                  ●
                </span>
                <span className="mt-2 block text-[13px] font-bold text-foreground">GO</span>
                <span className="block text-[11px] text-muted-foreground">tap or press space</span>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-sky-500/25 text-sky-400">
                  ●
                </span>
                <span className="mt-2 block text-[13px] font-bold text-foreground">NO-GO</span>
                <span className="block text-[11px] text-muted-foreground">do nothing at all</span>
              </div>
            </div>
            {best > 0 && (
              <p className="text-center text-[12px] font-semibold text-amber-400">
                🏆 Best d′ {(best / 100).toFixed(2)}
              </p>
            )}
            <button
              onClick={start}
              className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
            >
              ▶ Start 40 trials
            </button>
          </div>
        )}

        {(phase === "fixate" || phase === "running") && (
          <>
            <div className="flex items-center justify-between text-[13px] font-semibold text-muted-foreground">
              <span>
                Trial {index + 1} / {TRIALS}
              </span>
              <span>
                d′ <b className="text-foreground">{dPrime.toFixed(2)}</b>
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${((index + 1) / TRIALS) * 100}%` }}
              />
            </div>

            <button
              onClick={respond}
              disabled={phase !== "running"}
              className={`grid h-64 w-full place-items-center rounded-2xl border transition-all duration-75 ${
                phase === "fixate"
                  ? "border-border bg-surface"
                  : isStop
                    ? flash === "miss"
                      ? "scale-95 border-red-500 bg-sky-500/40"
                      : "border-sky-500/50 bg-sky-500/20"
                    : flash === "hit"
                      ? "scale-95 border-emerald-400 bg-emerald-500/40"
                      : "border-emerald-500/50 bg-emerald-500/20"
              }`}
              aria-label={phase === "running" ? (isStop ? "No-go trial" : "Go trial") : "Preparing"}
            >
              {phase === "fixate" ? (
                <span className="text-6xl font-black text-muted-foreground">+</span>
              ) : (
                <span
                  className={`size-24 rounded-full ${isStop ? "bg-sky-500" : "bg-emerald-500"}`}
                />
              )}
            </button>

            <p className="text-center text-[11px] text-muted-foreground">
              {phase === "fixate" ? "Get ready…" : isStop ? "Blue — do not tap" : "Green — tap now"}
            </p>
          </>
        )}

        {phase === "done" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-[13px] uppercase tracking-widest text-muted-foreground">
                Complete
              </p>
              <p className="mt-2 text-5xl font-black text-foreground">{dPrime.toFixed(2)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                d′ · best {(best / 100).toFixed(2)}
              </p>

              <dl className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-2 text-left">
                {[
                  { k: "Correct taps", v: `${tally.hits}/${goTrials}` },
                  { k: "Commission errors", v: `${tally.commissions}/${stopTrials}` },
                  { k: "Omissions", v: String(tally.omissions) },
                  { k: "Mean response", v: meanRt ? `${meanRt} ms` : "—" },
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
                {tally.commissions === 0
                  ? "Zero commission errors — perfect inhibition. That is genuinely hard to sustain over 40 trials."
                  : tally.commissions <= 2
                    ? "Very few impulsive taps. Solid control."
                    : "You are reacting rather than deciding. Try slowing the anticipation between trials."}
              </p>
            </div>
            <button
              onClick={start}
              className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
            >
              ↻ Run again
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
