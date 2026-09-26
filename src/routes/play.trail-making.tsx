import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { saveGameBest } from "@/lib/ux";

export const Route = createFileRoute("/play/trail-making")({
  head: () => ({
    meta: [
      { title: "Trail Making Test - Task Switching Training | SlashAI" },
      {
        name: "description",
        content:
          "Trail Making A and B brain training: alternate between numbers and letters, time yourself, and compare the two to measure your task-switching cost. Free, no download.",
      },
    ],
  }),
  component: TrailMaking,
});

/** 1 A 2 B ... 8 H — sixteen nodes, sized to stay tappable on a phone. */
const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

const SEQUENCE: string[] = NUMBERS.flatMap((n, i) => [n, LETTERS[i]!]);

type Variant = "A" | "B";
type Phase = "idle" | "running" | "done";

interface Node {
  label: string;
  x: number;
  y: number;
  square: boolean;
  step: number;
}

/**
 * Scatters nodes with a minimum separation so nothing overlaps. Test B asks
 * for a wider gap — that is the whole point of the two-test design.
 */
function layout(variant: Variant): Node[] {
  const minGap = variant === "A" ? 17 : 22;
  const placed: { x: number; y: number }[] = [];
  const out: Node[] = [];
  const isLetter = (l: string) => /^[A-H]$/.test(l);

  for (const label of SEQUENCE) {
    let best: { x: number; y: number } | null = null;
    let bestDist = -1;
    for (let attempt = 0; attempt < 220; attempt++) {
      const x = 8 + Math.random() * 84;
      const y = 9 + Math.random() * 82;
      let nearest = Infinity;
      for (const p of placed) {
        const dx = p.x - x;
        const dy = p.y - y;
        nearest = Math.min(nearest, Math.sqrt(dx * dx + dy * dy));
      }
      if (nearest > bestDist) {
        bestDist = nearest;
        best = { x, y };
      }
      if (nearest >= minGap) break;
    }
    const p = best ?? { x: 50, y: 50 };
    placed.push(p);
    out.push({
      label,
      x: p.x,
      y: p.y,
      // B uses shapes to separate the two streams; A uses plain circles
      square: variant === "B" ? isLetter(label) : false,
      step: SEQUENCE.indexOf(label),
    });
  }
  return out;
}

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}.${String(Math.floor((ms % 1000) / 100))}`;
}

/** Reitan correction: raw time plus a penalty for every wrong tap. */
function correctedTime(ms: number, errors: number): number {
  return ms + errors * 800;
}

function TrailMaking() {
  const [variant, setVariant] = useState<Variant>("A");
  const [phase, setPhase] = useState<Phase>("idle");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [next, setNext] = useState(0);
  const [errors, setErrors] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [wrongLabel, setWrongLabel] = useState<string | null>(null);
  const [bests, setBests] = useState<{ a: number | null; b: number | null }>(() => ({
    a: Number(localStorage.getItem("slashai.trail.a") ?? 0) || null,
    b: Number(localStorage.getItem("slashai.trail.b") ?? 0) || null,
  }));

  const startedAt = useRef(0);
  const clock = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "running") return;
    startedAt.current = performance.now();
    clock.current = window.setInterval(
      () => setElapsed(performance.now() - startedAt.current),
      100,
    );
    return () => {
      if (clock.current) window.clearInterval(clock.current);
    };
  }, [phase]);

  const start = useCallback((v: Variant) => {
    setVariant(v);
    setNodes(layout(v));
    setNext(0);
    setErrors(0);
    setElapsed(0);
    setWrongLabel(null);
    setPhase("running");
  }, []);

  const tap = useCallback(
    (label: string) => {
      if (phase !== "running") return;
      if (SEQUENCE[next] === label) {
        const after = next + 1;
        setNext(after);
        setWrongLabel(null);
        if (after >= SEQUENCE.length) {
          const ms = performance.now() - startedAt.current;
          setElapsed(ms);
          setPhase("done");
          const key = variant === "A" ? "a" : "b";
          const corrected = Math.round(correctedTime(ms, errors));
          if (!bests[key] || corrected < bests[key]!) {
            saveGameBest(`trail-making-${variant}`, corrected);
            setBests((b) => ({ ...b, [key]: corrected }));
          }
        }
        return;
      }
      setErrors((e) => e + 1);
      setWrongLabel(label);
      window.setTimeout(() => setWrongLabel(null), 400);
    },
    [bests, errors, next, phase, variant],
  );

  const finalMs = phase === "done" ? elapsed : 0;
  const corrected = correctedTime(finalMs, errors);
  const expected = next > 0 ? (finalMs / next) * SEQUENCE.length : 0;

  const switchingCost = useMemo(() => {
    if (!bests.a || !bests.b) return null;
    return Math.round((bests.b - bests.a) / 100) / 10;
  }, [bests]);

  return (
    <AppShell title="Trail Making Test">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔀 Trail Making Test</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Alternating between numbers and letters measures how fast you can switch rules mid-task.
          Test A is the baseline; Test B adds a second stream to switch between.
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        {phase === "idle" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-5xl">🧠</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Tap <b className="text-foreground">1 → A → 2 → B</b> in order, as fast as you can
                without losing your place. The gap between your B time and your A time is your
                switching cost — the number this test was invented for.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {(["A", "B"] as Variant[]).map((v) => (
                <button
                  key={v}
                  onClick={() => start(v)}
                  className="rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:bg-surface-elevated"
                >
                  <span className="block text-[14px] font-bold text-foreground">
                    Test {v} {v === "A" ? "· baseline" : "· two streams"}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                    {v === "A"
                      ? "Numbers and letters, both in circles, close together."
                      : "Letters move into squares and the layout spreads out."}
                  </span>
                  {bests[v.toLowerCase() as "a" | "b"] && (
                    <span className="mt-1.5 block text-[11px] font-semibold text-amber-400">
                      🏆 Best {formatTime(bests[v.toLowerCase() as "a" | "b"]!)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "running" && (
          <>
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5 text-[13px] font-semibold">
              <span className="text-muted-foreground">
                Test {variant} · next <b className="text-foreground">{SEQUENCE[next]}</b>
              </span>
              <span className="text-foreground">⏱ {formatTime(elapsed)}</span>
              <span className={errors ? "text-red-400" : "text-muted-foreground"}>
                {errors} error{errors === 1 ? "" : "s"}
              </span>
            </div>

            <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-border bg-surface sm:h-[460px]">
              {nodes.map((n) => {
                const done = n.step < next;
                const isNext = n.step === next;
                const wrong = wrongLabel === n.label;
                return (
                  <button
                    key={n.label}
                    onClick={() => tap(n.label)}
                    aria-label={n.label}
                    className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center text-[15px] font-black transition-all duration-100 ${
                      n.square ? "rounded-lg" : "rounded-full"
                    } ${
                      wrong
                        ? "scale-110 border-2 border-red-500 bg-red-500/25 text-red-200"
                        : isNext
                          ? "scale-110 border-2 border-primary bg-primary/25 text-primary-foreground"
                          : done
                            ? "border border-border bg-surface-elevated text-muted-foreground opacity-50"
                            : "border border-border bg-surface-elevated text-foreground hover:scale-105 hover:border-primary/50"
                    }`}
                    style={{ left: `${n.x}%`, top: `${n.y}%`, width: 46, height: 46 }}
                  >
                    {n.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPhase("idle")}
              className="h-10 w-full rounded-xl border border-border bg-surface text-[13px] font-semibold text-muted-foreground"
            >
              Abandon run
            </button>
          </>
        )}

        {phase === "done" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-[13px] uppercase tracking-widest text-muted-foreground">
                Test {variant} complete
              </p>
              <p className="mt-2 text-4xl font-black text-foreground">{formatTime(finalMs)}</p>
              <p className="mt-1 text-sm text-muted-foreground">raw time</p>

              <dl className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-2 text-left">
                {[
                  { k: "Errors", v: String(errors) },
                  { k: "Corrected", v: formatTime(corrected) },
                  { k: "Pace / node", v: `${Math.round(expected)} ms` },
                  { k: "B minus A", v: switchingCost === null ? "run A + B" : `${switchingCost}s` },
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
                {errors === 0
                  ? "Zero errors. Now see if you can shave seconds off without introducing any."
                  : "Each wrong tap adds 0.8s to the corrected score. Clean runs beat fast messy ones."}
              </p>
            </div>
            <button
              onClick={() => start(variant === "A" ? "B" : "A")}
              className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
            >
              ↻ Run Test {variant === "A" ? "B" : "A"}
            </button>
            <button
              onClick={() => setPhase("idle")}
              className="h-10 w-full rounded-xl border border-border bg-surface text-[13px] font-semibold text-muted-foreground"
            >
              Back to tests
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
