import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { feedback } from "@/lib/play-sound";

export const Route = createFileRoute("/tools/nim")({
  head: () => ({
    meta: [
      { title: "Nim - The Strategy Game Trainer | SlashAI" },
      {
        name: "description",
        content:
          "Learn the winning strategy of Nim: take 1-3 counters per turn, whoever takes the last one wins. Play vs a perfect AI and study the losing positions.",
      },
    ],
  }),
  component: NimTool,
});

const WINNING = [1, 5, 9, 13, 17, 21]; // losing positions for the player to move from (mod 4 == 1)

function NimTool() {
  const [count, setCount] = useState(21);
  const [turn, setTurn] = useState<"you" | "ai">("you");
  const [log, setLog] = useState<string[]>([]);
  const [over, setOver] = useState<null | "you" | "ai">(null);
  const [aiHandicap, setAiHandicap] = useState(false);

  const start = () => {
    setCount(21);
    setTurn("you");
    setLog(["New game — 21 counters. Take 1–3 per turn; taking the last counter wins."]);
    setOver(null);
  };

  // reset on first mount
  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const take = (n: number) => {
    if (turn !== "you" || over) return;
    const left = count - n;
    setLog((l) => [`You took ${n} — ${left} left`, ...l]);
    if (left === 0) {
      setCount(0);
      setOver("you");
      feedback("success");
      return;
    }
    setCount(left);
    setTurn("ai");
  };

  useEffect(() => {
    if (turn !== "ai" || over) return;
    const t = setTimeout(() => {
      let n: number;
      if (aiHandicap) {
        n = 1 + Math.floor(Math.random() * 3);
      } else {
        // optimal play: move to a mod-4==1 position
        const mod = count % 4;
        n = mod === 1 ? 1 + Math.floor(Math.random() * 3) : Math.max(1, mod === 0 ? 3 : mod - 1);
      }
      n = Math.min(n, count);
      const left = count - n;
      setLog((l) => [`AI took ${n} — ${left} left`, ...l]);
      if (left === 0) {
        setCount(0);
        setOver("ai");
        return;
      }
      setCount(left);
      setTurn("you");
    }, 650);
    return () => clearTimeout(t);
  }, [turn, over, count, aiHandicap]);

  return (
    <AppShell title="Nim">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎲 Nim</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Take 1–3 counters. Whoever takes the <b className="text-foreground">last</b> one wins.
          Sounds fair — it isn't, if you know the trick.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {over ? "Game over" : turn === "you" ? "Your turn" : "AI thinking…"}
          </p>
          <div className="mt-3 flex min-h-[64px] flex-wrap items-center justify-center gap-1.5">
            {Array.from({ length: count }, (_, i) => (
              <span key={i} className="text-[22px]" aria-hidden>
                🪙
              </span>
            ))}
            {count === 0 && <span className="text-sm text-muted-foreground">no counters left</span>}
          </div>
          {over && (
            <p className={`mt-2 text-[15px] font-black ${over === "you" ? "text-emerald-500" : "text-rose-500"}`}>
              {over === "you" ? "🏆 You win!" : "🤖 AI wins — look at the pattern below"}
            </p>
          )}
          {!over && (
            <div className="mt-4 flex justify-center gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => take(n)}
                  disabled={turn !== "you" || n > count}
                  className="ripple-press h-11 w-14 rounded-xl bg-primary text-[15px] font-black text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
                >
                  {n}
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={start}
              className="h-9 rounded-lg border border-border px-4 text-[12.5px] font-bold text-foreground transition-colors hover:border-primary/40"
            >
              New game
            </button>
            <label className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <input
                type="checkbox"
                checked={aiHandicap}
                onChange={(e) => setAiHandicap(e.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Easy mode
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="text-[13px] font-bold text-foreground">The secret (spoilers)</h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
            The winning move is always to leave a count that is{" "}
            <b className="text-foreground">1 more than a multiple of 4</b> (21, 17, 13, 9, 5, 1). The
            AI plays perfectly — unless you switch on easy mode. To beat it: make the first move,
            and every time the AI takes k, you take 4 − k.
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {WINNING.map((w) => (
              <span
                key={w}
                className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10.5px] font-bold tabular-nums text-foreground"
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="text-[13px] font-bold text-foreground">Move log</h2>
          <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-[12.5px] text-muted-foreground">
            {log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
