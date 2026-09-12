import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/schulte-table")({ component: SchulteTable });

/**
 * Schulte Table - the peripheral-vision attention drill used in pilot and
 * speed-reading training. Tap 1→N in order without moving your eyes from the
 * centre dot. Sizes 3x3 to 6x6, with a personal-best board per size.
 */

function shuffled(n: number): number[] {
  const arr: number[] = [...Array(n).keys()].map((i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

const fmtMs = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`);

function SchulteTable() {
  const [size, setSize] = useState(4);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [numbers, setNumbers] = useState<number[]>(() => shuffled(16));
  const [next, setNext] = useState(1);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [misses, setMisses] = useState(0);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);
  const [bests, setBests] = useState<Record<number, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem("slashai.schulte.bests") ?? "{}");
    } catch {
      return {};
    }
  });
  const tick = useRef<number | null>(null);

  const total = size * size;

  useEffect(() => {
    if (phase !== "playing") return;
    tick.current = window.setInterval(() => setElapsed(Date.now() - startedAt), 100);
    return () => {
      if (tick.current) window.clearInterval(tick.current);
    };
  }, [phase, startedAt]);

  const bestKey = size;
  const bestMs = bests[bestKey];

  const start = () => {
    setNumbers(shuffled(total));
    setNext(1);
    setMisses(0);
    setElapsed(0);
    setStartedAt(Date.now());
    setPhase("playing");
  };

  const tap = (n: number) => {
    if (phase !== "playing") return;
    if (n === next) {
      if (n === total) {
        const ms = Date.now() - startedAt;
        setElapsed(ms);
        if (!bestMs || ms < bestMs) {
          const nb = { ...bests, [bestKey]: ms };
          setBests(nb);
          localStorage.setItem("slashai.schulte.bests", JSON.stringify(nb));
        }
        setPhase("over");
      }
      setNext((v) => v + 1);
      setFlash("ok");
      window.setTimeout(() => setFlash(null), 120);
    } else {
      setMisses((m) => m + 1);
      setFlash("no");
      window.setTimeout(() => setFlash(null), 160);
    }
  };

  const progress = useMemo(() => ((next - 1) / total) * 100, [next, total]);

  return (
    <AppShell title="Schulte Table">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎯 Schulte Table</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap 1 to {total} in order <b className="text-foreground">without moving your eyes</b> from the centre. It trains peripheral sight - how speed readers find words.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-5">
        {phase === "idle" && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-xl border p-2.5 text-center transition-colors ${
                    size === s ? "border-primary/60 bg-primary/10" : "border-border bg-surface hover:border-primary/30"
                  }`}
                >
                  <span className="block text-[13px] font-bold text-foreground">{s}×{s}</span>
                  {bests[s] && <span className="mt-0.5 block text-[9.5px] text-primary">{fmtMs(bests[s])}</span>}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-4xl">🎯</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Keep your gaze on the <b className="text-foreground">ⵙ centre</b> and find numbers with your side vision.<br />
                Start with 3×3 - 5×5 is the classic pilot standard.
              </p>
            </div>
            <button onClick={start} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              ▶ Start {size}×{size}
            </button>
          </div>
        )}

        {phase === "playing" && (
          <>
            <div className="flex items-center justify-between text-[13px] font-semibold">
              <span className="text-muted-foreground">
                Find <b className="text-2xl text-primary">{next}</b>
              </span>
              <span className={misses > 0 ? "text-red-400" : "text-muted-foreground"}>
                {misses > 0 ? `✗ ${misses}` : "clean"} · {(elapsed / 1000).toFixed(1)}s
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-surface-elevated">
              <div className="h-full rounded-full bg-primary transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
            <div
              className={`relative mx-auto grid gap-1.5 rounded-2xl border p-2 transition-colors duration-150 ${
                flash === "no" ? "border-red-500/50" : flash === "ok" ? "border-emerald-500/40" : "border-border"
              } bg-surface`}
              style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, maxWidth: 400 }}
            >
              {numbers.map((n) => {
                const done = n < next;
                return (
                  <button
                    key={n}
                    onClick={() => tap(n)}
                    className={`grid aspect-square place-items-center rounded-lg text-[15px] font-bold transition-colors duration-100 sm:text-[17px] ${
                      done ? "bg-primary/10 text-muted-foreground/40" : "bg-surface-elevated text-foreground hover:bg-accent active:scale-95"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
              {/* fixation dot - keep your eyes here */}
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 z-10 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/70"
              />
            </div>
            <p className="text-center text-[11px] text-muted-foreground">Eyes on the dot · find with the corners of your vision</p>
          </>
        )}

        {phase === "over" && (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <p className="text-[13px] uppercase tracking-widest text-muted-foreground">{size}×{size} complete</p>
              <p className="mt-2 text-5xl font-black text-foreground">{(elapsed / 1000).toFixed(2)}s</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {misses === 0 ? "Flawless - zero wrong taps" : `${misses} wrong ${misses === 1 ? "tap" : "taps"}`}
              </p>
              {elapsed <= (bestMs ?? Infinity) && (
                <p className="mt-2 text-[13px] font-semibold text-emerald-400">New record for {size}×{size}! 🎉</p>
              )}
              {bestMs && elapsed > bestMs && <p className="mt-1 text-sm text-muted-foreground">Your best: {fmtMs(bestMs)}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={start} className="h-12 rounded-xl bg-primary text-sm font-bold text-primary-foreground">↻ Again</button>
              <button onClick={() => setPhase("idle")} className="h-12 rounded-xl border border-border bg-surface text-sm font-bold text-muted-foreground">
                Change size
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
