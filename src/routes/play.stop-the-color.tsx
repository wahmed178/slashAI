import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/stop-the-color")({ component: StopTheColor });

const COLORS = [
  { name: "RED", hex: "#f85149" },
  { name: "BLUE", hex: "#58a6ff" },
  { name: "GREEN", hex: "#3fb950" },
  { name: "YELLOW", hex: "#d29922" },
  { name: "PURPLE", hex: "#a371f7" },
];

interface Round {
  wordIdx: number;
  colorIdx: number;
}

function StopTheColor() {
  const [state, setState] = useState<"idle" | "playing" | "over">("idle");
  const [round, setRound] = useState<Round | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("slashai.stopcolor.best") ?? 0));
  const [timeLeft, setTimeLeft] = useState(30);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);
  const timer = useRef<number | null>(null);

  const nextRound = () => {
    let w = Math.floor(Math.random() * COLORS.length);
    let c = Math.floor(Math.random() * COLORS.length);
    if (Math.random() < 0.6 && w === c) c = (c + 1) % COLORS.length; // 60% mismatch
    setRound({ wordIdx: w, colorIdx: c });
  };

  useEffect(() => {
    if (state !== "playing") return;
    timer.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setState("over");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [state]);

  useEffect(() => {
    if (state === "over" && score > best) {
      setBest(score);
      localStorage.setItem("slashai.stopcolor.best", String(score));
    }
  }, [state]);

  const start = () => {
    setScore(0);
    setTimeLeft(30);
    setState("playing");
    nextRound();
  };

  const answer = (colorName: string) => {
    if (!round) return;
    const correct = COLORS[round.colorIdx]!.name === colorName;
    if (correct) {
      setScore((s) => s + 1);
      setFlash("ok");
    } else {
      setScore((s) => Math.max(0, s - 1));
      setFlash("no");
    }
    window.setTimeout(() => setFlash(null), 150);
    nextRound();
  };

  return (
    <AppShell title="Stop the Color">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎨 Stop the Color</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tap the INK colour of the word - not what it says. Your brain will fight you.</p>
      </header>
      <div className="mx-auto max-w-md space-y-5">
        {state === "idle" && (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <p className="text-5xl">🧠</p>
              <p className="mt-3 text-sm text-muted-foreground">
                You'll see a colour word printed in a different colour.<br />
                Tap the button matching the <b className="text-foreground">colour it's printed in</b>.<br />
                30 seconds. Most correct taps wins.
              </p>
            </div>
            <button onClick={start} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">▶ Start</button>
          </div>
        )}

        {state === "playing" && round && (
          <>
            <div className="flex items-center justify-between text-[13px] font-semibold">
              <span className="text-muted-foreground">Score <b className="text-foreground">{score}</b></span>
              <span className={timeLeft <= 5 ? "text-red-400" : "text-muted-foreground"}>⏱ {timeLeft}s</span>
            </div>
            <div
              className={`grid h-36 place-items-center rounded-2xl border transition-colors duration-150 ${
                flash === "ok" ? "border-emerald-500/60 bg-emerald-500/10" : flash === "no" ? "border-red-500/60 bg-red-500/10" : "border-border bg-surface"
              }`}
            >
              <span className="text-5xl font-black tracking-wide" style={{ color: COLORS[round.colorIdx]!.hex }}>
                {COLORS[round.wordIdx]!.name}
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

        {state === "over" && (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <p className="text-[13px] uppercase tracking-widest text-muted-foreground">Time!</p>
              <p className="mt-2 text-5xl font-black text-foreground">{score}</p>
              <p className="mt-1 text-sm text-muted-foreground">Best: {best}</p>
              {score >= 25 && <p className="mt-2 text-[13px] font-semibold text-emerald-400">Incredible focus 🏆</p>}
              {score >= 15 && score < 25 && <p className="mt-2 text-[13px] font-semibold text-primary">Strong brain ⚡</p>}
              {score < 15 && <p className="mt-2 text-[13px] text-muted-foreground">The Stroop effect wins this round 😄</p>}
            </div>
            <button onClick={start} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">↻ Play again</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
