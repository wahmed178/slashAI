import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/click-speed")({
  head: () => ({
    meta: [
      { title: "Click Speed Test (CPS) - Free Browser Tool | SlashAI" },
      {
        name: "description",
        content:
          "Measure your clicks per second in 1, 5, 10 or 30-second rounds. Live counter, CPS score and personal best saved on your device. Free.",
      },
    ],
  }),
  component: ClickSpeedTool,
});

const WINDOWS = [1, 5, 10, 30];

function verdict(cps: number): string {
  if (cps >= 10) return "Butterfly-tier. Are you clicking with two fingers?";
  if (cps >= 8) return "Very fast — gamer territory.";
  if (cps >= 6) return "Above average clicking.";
  if (cps >= 4.5) return "Solid, normal fast clicking.";
  return "Warm-up pace. Try again with rhythm.";
}

function ClickSpeedTool() {
  const [duration, setDuration] = useState(5);
  const [clicks, setClicks] = useState(0);
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(duration);
  const [done, setDone] = useState(false);
  const endAt = useRef(0);
  const raf = useRef(0);
  const [bests, setBests] = useState<Record<number, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem("slashai-cps-bests") ?? "{}") as Record<number, number>;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const remaining = Math.max(0, endAt.current - performance.now());
      setLeft(remaining / 1000);
      if (remaining <= 0) {
        setRunning(false);
        setDone(true);
        setClicks((c) => {
          const cps = c / duration;
          setBests((b) => {
            if (cps <= (b[duration] ?? 0)) return b;
            const next = { ...b, [duration]: cps };
            localStorage.setItem("slashai-cps-bests", JSON.stringify(next));
            return next;
          });
          return c;
        });
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running, duration]);

  const start = () => {
    setClicks(0);
    setDone(false);
    setLeft(duration);
    endAt.current = performance.now() + duration * 1000;
    setRunning(true);
  };

  const cps = done || !running ? clicks / duration : clicks / Math.max(0.1, duration - left);

  const resetAll = () => {
    setClicks(0);
    setLeft(duration);
    setDone(false);
    setRunning(false);
  };

  return (
    <AppShell title="Click Speed Test">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🖱️ Click Speed Test</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          How many clicks per second (CPS) can you do? Pick a window, click the pad, beat your best.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        {/* duration picker */}
        <div className="flex gap-1.5 rounded-xl border border-border bg-surface p-1">
          {WINDOWS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => {
                setDuration(w);
                resetAll();
              }}
              className={`h-9 flex-1 rounded-lg text-[12.5px] font-bold transition-colors ${
                duration === w ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {w}s
            </button>
          ))}
        </div>

        {/* the pad */}
        <button
          type="button"
          onPointerDown={() => running && setClicks((c) => c + 1)}
          onClick={start}
          aria-label={running ? "Click pad" : "Start the test"}
          className="ripple-press grid h-56 w-full select-none place-items-center rounded-2xl border-2 border-primary/40 bg-primary/8 transition-colors hover:border-primary/60"
        >
          <span className="text-center">
            <span className="block text-5xl font-black tabular-nums text-foreground">
              {clicks}
            </span>
            <span className="mt-1 block text-[12px] font-bold uppercase tracking-wider text-primary">
              {running ? `${left.toFixed(1)}s left` : done ? `${(clicks / duration).toFixed(1)} CPS` : `Click to start · ${duration}s round`}
            </span>
          </span>
        </button>

        {/* result */}
        {done && (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center">
            <p className="text-3xl font-black tabular-nums text-foreground">{cps.toFixed(1)}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              clicks per second
            </p>
            <p className="mt-2 text-[13px] text-muted-foreground">{verdict(cps)}</p>
            <p className="mt-1 text-[11.5px] text-muted-foreground">
              Best for {duration}s:{" "}
              <b className="text-primary tabular-nums">{(bests[duration] ?? 0).toFixed(1)}</b>
            </p>
            <button
              type="button"
              onClick={start}
              className="ripple-press mt-3 h-10 rounded-xl bg-primary px-6 text-[13px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Go again
            </button>
          </div>
        )}

        {/* all bests */}
        <div className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="text-[13px] font-bold text-foreground">Your records (this device)</h2>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {WINDOWS.map((w) => (
              <div key={w} className="rounded-xl bg-surface-elevated p-2 text-center">
                <p className="text-[13px] font-black tabular-nums text-foreground">
                  {(bests[w] ?? 0) > 0 ? (bests[w] ?? 0).toFixed(1) : "—"}
                </p>
                <p className="text-[9.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {w}s best
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
