import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/digit-span")({ component: DigitSpan });

/**
 * Digit Span - the working-memory test used by real psychologists.
 * A number flashes one digit at a time; type it back.
 * Forward: repeat as shown. Backward: reverse it. Length grows by one each round.
 * Three strikes and the test ends - your span is the longest length survived.
 */

type Dir = "forward" | "backward";
type Phase = "idle" | "show" | "input" | "over";

function DigitSpan() {
  const [dir, setDir] = useState<Dir>("forward");
  const [phase, setPhase] = useState<Phase>("idle");
  const [length, setLength] = useState(3);
  const [best, setBest] = useState<{ forward: number; backward: number }>(() => ({
    forward: Number(localStorage.getItem("slashai.digitspan.forward") ?? 0),
    backward: Number(localStorage.getItem("slashai.digitspan.backward") ?? 0),
  }));
  const [digits, setDigits] = useState("");
  const [shown, setShown] = useState(""); // currently visible digit
  const [entry, setEntry] = useState("");
  const [lives, setLives] = useState(3);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);
  const hideRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "show") return;
    let i = 0;
    const step = () => {
      if (i >= digits.length) {
        setShown("");
        setPhase("input");
        return;
      }
      setShown(digits[i]!);
      hideRef.current = window.setTimeout(() => {
        i++;
        step();
      }, 750);
    };
    // small beat before the first digit
    hideRef.current = window.setTimeout(step, 500);
    return () => {
      if (hideRef.current) window.clearTimeout(hideRef.current);
    };
  }, [phase, digits]);

  const begin = () => {
    setLength(3);
    setLives(3);
    setEntry("");
    nextRound(3);
  };

  const nextRound = (len: number) => {
    let d = "";
    for (let i = 0; i < len; i++) d += Math.floor(Math.random() * 10);
    setDigits(d);
    setEntry("");
    setPhase("show");
  };

  const submit = () => {
    const target = dir === "forward" ? digits : [...digits].reverse().join("");
    if (entry === target) {
      setFlash("ok");
      window.setTimeout(() => {
        setFlash(null);
        setLength(length + 1);
        nextRound(length + 1);
      }, 450);
    } else {
      const remaining = lives - 1;
      setLives(remaining);
      setFlash("no");
      window.setTimeout(() => {
        setFlash(null);
        setEntry("");
        if (remaining <= 0) {
          const key = dir === "forward" ? "slashai.digitspan.forward" : "slashai.digitspan.backward";
          if (length - 1 > best[dir]) {
            setBest((b) => ({ ...b, [dir]: length - 1 }));
            localStorage.setItem(key, String(length - 1));
          }
          setPhase("over");
        } else {
          nextRound(digits.length);
        }
      }, 700);
    }
  };

  return (
    <AppShell title="Digit Span">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔢 Digit Span</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Digits flash one by one - type them back. Backward mode asks for them reversed. Most people top out at 7.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-5">
        {phase === "idle" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["forward", "➡️ Forward", "Repeat as shown", best.forward],
                  ["backward", "⬅️ Backward", "Reverse order", best.backward],
                ] as const
              ).map(([d, label, sub, b]) => (
                <button
                  key={d}
                  onClick={() => setDir(d)}
                  className={`rounded-xl border p-3 text-center transition-colors ${
                    dir === d ? "border-primary/60 bg-primary/10" : "border-border bg-surface hover:border-primary/30"
                  }`}
                >
                  <span className="block text-[13px] font-bold text-foreground">{label}</span>
                  <span className="mt-0.5 block text-[10.5px] text-muted-foreground">{sub}</span>
                  {b > 0 && <span className="mt-1 block text-[11px] font-semibold text-primary">Best: {b}</span>}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <p className="text-4xl">🔢</p>
              <p className="mt-3 text-sm text-muted-foreground">
                3 digits to start, +1 every success.<br />
                3 lives. Your <b className="text-foreground">digit span</b> is the longest run you cleared.
              </p>
            </div>
            <button onClick={begin} className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              ▶ Begin the test
            </button>
          </div>
        )}

        {phase === "show" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[13px] font-semibold">
              <span className="text-muted-foreground">
                {dir === "backward" && <span className="text-amber-400">reverse it!</span>}
              </span>
              <span className="text-muted-foreground">
                Digit <b className="text-foreground">{Math.min(entry.length + 1, digits.length) === 0 ? 1 : entry.length + 1 > digits.length ? digits.length : entry.length + 1}/{digits.length}</b> · ❤️ {lives}
              </span>
            </div>
            <div className="grid h-40 place-items-center rounded-2xl border border-border bg-surface">
              <span className="text-7xl font-black tracking-widest text-foreground">{shown || "…"}</span>
            </div>
            <p className="text-center text-[12px] text-muted-foreground">
              {dir === "forward" ? "Watch, then type it back in order" : "Watch, then type it back reversed"}
            </p>
          </div>
        )}

        {phase === "input" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[13px] font-semibold">
              <span className={dir === "backward" ? "text-amber-400" : "text-primary"}>
                {dir === "backward" ? "type it reversed" : "type it in order"}
              </span>
              <span className="text-muted-foreground">❤️ {lives}</span>
            </div>
            <div
              className={`grid h-24 place-items-center rounded-2xl border transition-colors ${
                flash === "ok" ? "border-emerald-500/60 bg-emerald-500/10" : flash === "no" ? "border-red-500/60 bg-red-500/10" : "border-border bg-surface"
              }`}
            >
              <span className="text-4xl font-black tracking-[0.3em] text-foreground">{entry || "…"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                <button
                  key={n}
                  onClick={() => setEntry((e) => (e.length < digits.length ? e + n : e))}
                  className="h-12 rounded-xl border border-border bg-surface text-lg font-bold text-foreground transition-transform active:scale-95"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setEntry((e) => e.slice(0, -1))}
                className="h-12 rounded-xl border border-border bg-surface text-sm font-bold text-muted-foreground transition-transform active:scale-95"
              >
                ⌫
              </button>
              <button
                onClick={() => setEntry((e) => (e.length < digits.length ? e + "0" : e))}
                className="h-12 rounded-xl border border-border bg-surface text-lg font-bold text-foreground transition-transform active:scale-95"
              >
                0
              </button>
              <button
                onClick={submit}
                disabled={entry.length !== digits.length}
                className="h-12 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-opacity disabled:opacity-30"
              >
                ✓
              </button>
            </div>
          </div>
        )}

        {phase === "over" && (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <p className="text-[13px] uppercase tracking-widest text-muted-foreground">Your digit span</p>
              <p className="mt-2 text-6xl font-black text-foreground">{length - 1}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {dir === "forward" ? "forward" : "backward"} digits · {length - 1 >= 7 ? "that's exceptional" : length - 1 >= 5 ? "above the adult average" : "room to grow"}
              </p>
              {length - 1 >= best[dir] && length - 1 > 0 && (
                <p className="mt-2 text-[13px] font-semibold text-emerald-400">New personal best! 🎉</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={begin} className="h-12 rounded-xl bg-primary text-sm font-bold text-primary-foreground">↻ Again</button>
              <button onClick={() => setPhase("idle")} className="h-12 rounded-xl border border-border bg-surface text-sm font-bold text-muted-foreground">
                Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
