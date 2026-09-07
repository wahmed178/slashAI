import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/reaction-test")({ component: ReactionTest });

function loadBest(): number {
  try {
    return Number(localStorage.getItem("play-reaction-best") ?? 0) || 0;
  } catch {
    return 0;
  }
}

function ReactionTest() {
  const [phase, setPhase] = useState<"idle" | "waiting" | "go" | "result" | "early">("idle");
  const [last, setLast] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [best, setBest] = useState(loadBest);
  const timeout = useRef(0);
  const goAt = useRef(0);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  function arm() {
    window.clearTimeout(timeout.current);
    setPhase("waiting");
    timeout.current = window.setTimeout(() => {
      goAt.current = performance.now();
      setPhase("go");
    }, 1200 + Math.random() * 2300);
  }

  function tap() {
    if (phase === "idle" || phase === "result" || phase === "early") {
      arm();
      return;
    }
    if (phase === "waiting") {
      window.clearTimeout(timeout.current);
      setPhase("early");
      return;
    }
    // phase === "go"
    const ms = Math.round(performance.now() - goAt.current);
    setLast(ms);
    setHistory((h) => [...h.slice(-9), ms]);
    setPhase("result");
    setBest((b) => {
      if (b === 0 || ms < b) {
        try {
          localStorage.setItem("play-reaction-best", String(ms));
        } catch {
          /* storage unavailable */
        }
        return ms;
      }
      return b;
    });
  }

  const avg = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : 0;

  const style: Record<typeof phase, string> = {
    idle: "bg-surface hover:border-primary/40",
    waiting: "bg-[#f87171]/15 border-[#f87171]/40",
    go: "bg-[#4ade80]/20 border-[#4ade80]/50",
    result: "bg-surface hover:border-primary/40",
    early: "bg-[#fbbf24]/10 border-[#fbbf24]/40",
  };

  const label: Record<typeof phase, string> = {
    idle: "Tap to start",
    waiting: "Wait for green...",
    go: "TAP NOW!",
    result: `${last} ms - tap to retry`,
    early: "Too early! 😅 Tap to retry",
  };

  const rating =
    last === 0
      ? ""
      : last < 200
        ? "Lightning reflexes ⚡"
        : last < 280
          ? "Sharp!"
          : last < 400
            ? "Solid."
            : "Warm up those thumbs.";

  return (
    <AppShell title="Reaction Test">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⚡ Reaction Test</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Wait for the panel to turn green, then tap as fast as you can. Tap too soon and the round
          is void.
        </p>
      </header>

      <div className="mx-auto max-w-sm space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-border bg-surface px-3 py-2.5 text-center">
            <p className="text-[17px] font-bold text-foreground">{last || "-"}</p>
            <p className="text-[10px] text-muted-foreground">Last (ms)</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2.5 text-center">
            <p className="text-[17px] font-bold text-foreground">{avg || "-"}</p>
            <p className="text-[10px] text-muted-foreground">Avg (ms)</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-3 py-2.5 text-center">
            <p className="text-[17px] font-bold text-primary">{best || "-"}</p>
            <p className="text-[10px] text-muted-foreground">Best (ms)</p>
          </div>
        </div>

        <button
          onClick={tap}
          className={`flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-border transition-colors duration-150 ${style[phase]}`}
        >
          <span className="text-[26px]">
            {phase === "go" ? "🟢" : phase === "waiting" ? "🔴" : phase === "early" ? "😬" : "⚡"}
          </span>
          <span className="text-[16px] font-black text-foreground">{label[phase]}</span>
          {phase === "result" && rating && (
            <span className="text-[12px] text-muted-foreground">{rating}</span>
          )}
        </button>

        {history.length > 0 && (
          <div className="rounded-xl border border-border bg-surface px-3.5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Recent attempts
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {history.map((ms, i) => (
                <span
                  key={i}
                  className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                    ms === best
                      ? "bg-primary/20 text-primary"
                      : "bg-surface-elevated text-muted-foreground"
                  }`}
                >
                  {ms}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-muted-foreground">
          Average human reaction time is around 250 ms. Sleep, caffeine and luck all matter.
        </p>
      </div>
    </AppShell>
  );
}
