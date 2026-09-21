import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/play/tower-of-hanoi")({ component: TowerOfHanoi });

/**
 * Tower of Hanoi — the classic recursion puzzle. Move the whole stack to the
 * last peg, one disk at a time, never placing a larger disk on a smaller one.
 * The fewest possible moves is 2^n − 1, so you can see exactly how close to
 * optimal you played. Disks 3 through 8.
 */

const optimal = (n: number) => 2 ** n - 1;

function TowerOfHanoi() {
  const [disks, setDisks] = useState(4);
  const [pegs, setPegs] = useState<number[][]>([[4, 3, 2, 1], [], []]);
  const [held, setHeld] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const timer = useRef<number | null>(null);

  const reset = useCallback((n: number) => {
    setDisks(n);
    setPegs([Array.from({ length: n }, (_, i) => n - i), [], []]);
    setHeld(null);
    setMoves(0);
    setWon(false);
    setSeconds(0);
    setInvalid(false);
  }, []);

  useEffect(() => {
    if (won) return;
    timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [won]);

  const [best, setBest] = useState<Record<number, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem("slashai.hanoi.best") ?? "{}");
    } catch {
      return {};
    }
  });

  const tapPeg = (p: number) => {
    if (won) return;
    setInvalid(false);
    if (held === null) {
      if (pegs[p]!.length === 0) return;
      setHeld(p);
      return;
    }
    if (held === p) {
      setHeld(null);
      return;
    }
    const from = pegs[held]!;
    const to = pegs[p]!;
    const disk = from[from.length - 1]!;
    const top = to[to.length - 1];
    if (top !== undefined && top < disk) {
      setInvalid(true);
      setHeld(null);
      return;
    }
    const next = pegs.map((x) => [...x]);
    next[held]!.pop();
    next[p]!.push(disk);
    setPegs(next);
    setHeld(null);
    setMoves((m) => m + 1);
    if (next[2]!.length === disks) {
      setWon(true);
      setBest((b) => {
        const prev = b[disks];
        const total = moves + 1;
        if (prev !== undefined && prev <= total) return b;
        const nb = { ...b, [disks]: total };
        localStorage.setItem("slashai.hanoi.best", JSON.stringify(nb));
        return nb;
      });
    }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const perfect = moves === optimal(disks);

  return (
    <AppShell title="Tower of Hanoi">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🗼 Tower of Hanoi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Shift the whole stack to the right peg — one disk at a time, never a bigger disk onto a smaller one.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-3">
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Moves</p>
            <p className="text-[16px] font-black text-foreground">{moves}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Minimum</p>
            <p className="text-[16px] font-black text-primary">{optimal(disks)}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Time</p>
            <p className="text-[16px] font-black text-foreground tabular-nums">{fmt(seconds)}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Best</p>
            <p className="text-[16px] font-black text-amber-400">{best[disks] ?? "–"}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-3">
          <div className="grid grid-cols-3 gap-2">
            {pegs.map((stack, p) => (
              <button
                key={p}
                onClick={() => tapPeg(p)}
                className={`relative flex h-[240px] flex-col-reverse items-center justify-start gap-[3px] rounded-lg border pb-2 transition-colors ${
                  held === p ? "border-primary bg-primary/10" : invalid && held === null ? "border-red-500/40" : "border-border hover:border-primary/40"
                }`}
              >
                {stack.map((d, i) => {
                  const width = 26 + (d / disks) * 66;
                  return (
                    <span
                      key={`${d}-${i}`}
                      className="block h-[14px] rounded-full transition-all"
                      style={{
                        width,
                        background:
                          d % 5 === 0 ? "#0ea5e9" : d % 5 === 1 ? "#2dd4bf" : d % 5 === 2 ? "#a78bfa" : d % 5 === 3 ? "#fbbf24" : "#fb7185",
                      }}
                    />
                  );
                })}
                {held === p && stack.length > 0 && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-background">
                    holding
                  </span>
                )}
                {/* peg */}
                <span aria-hidden className="pointer-events-none absolute bottom-2 left-1/2 h-[200px] w-[6px] -translate-x-1/2 rounded bg-foreground/15" />
              </button>
            ))}
          </div>
        </div>

        {won && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
            <p className="text-[15px] font-bold text-emerald-400">
              Solved in {moves} moves{perfect ? " — that is optimal! 🏅" : ""}
            </p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Minimum for {disks} disks is {optimal(disks)} · time {fmt(seconds)}
            </p>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-1.5">
          {[3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              onClick={() => reset(n)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                disks === n ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {n} disks
            </button>
          ))}
        </div>
        <button
          onClick={() => reset(disks)}
          className="mx-auto block rounded-lg border border-border bg-surface px-4 py-2 text-[12px] font-semibold text-foreground hover:bg-primary/10"
        >
          ↻ Restart
        </button>

        <p className="text-center text-[11px] text-muted-foreground">
          Tip: with 8 disks the optimal run is 255 moves — recursion beats brute force.
        </p>
      </div>
    </AppShell>
  );
}
