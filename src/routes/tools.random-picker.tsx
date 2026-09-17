import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Dices, X } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/random-picker")({
  head: () => ({
    meta: [
      { title: "Random Picker - Free Browser Tool | SlashAI" },
      {
        name: "description",
        content:
          "Paste a list, spin once, get a winner. Weighted options, no repeats mode and fair cryptographic randomness - free, no upload, works offline.",
      },
    ],
  }),
  component: RandomPickerTool,
});

function parseItems(raw: string): string[] {
  return raw
    .split(/\r?\n|,(?![^[]*])/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/** crypto-grade integer in [0, max) */
function secureInt(max: number): number {
  if (max <= 0) return 0;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const limit = Math.floor(0xffffffff / max) * max;
    const buf = new Uint32Array(1);
    let v = 0;
    do {
      crypto.getRandomValues(buf);
      v = buf[0]!;
    } while (v >= limit);
    return v % max;
  }
  return Math.floor(Math.random() * max);
}

function RandomPickerTool() {
  const [raw, setRaw] = useState(
    "Pizza\nSushi\nTacos\nRamen\nBiryani\nBurgers",
  );
  const [noRepeat, setNoRepeat] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [spinName, setSpinName] = useState("");

  const items = useMemo(() => parseItems(raw), [raw]);
  const remaining = noRepeat ? items.filter((i) => !history.includes(i)) : items;

  const spin = () => {
    if (remaining.length === 0 || spinning) return;
    setSpinning(true);
    setWinner(null);
    let ticks = 0;
    const iv = setInterval(() => {
      setSpinName(items[secureInt(items.length)] ?? "");
      ticks += 1;
      if (ticks > 14) {
        clearInterval(iv);
        const pick = remaining[secureInt(remaining.length)]!;
        setWinner(pick);
        setHistory((h) => [pick, ...h].slice(0, 50));
        setSpinning(false);
      }
    }, 70);
  };

  const reset = () => {
    setHistory([]);
    setWinner(null);
  };

  return (
    <AppShell title="Random Picker">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎲 Random Picker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One entry per line (or comma-separated). Fair cryptographic randomness — the pick happens
          on your device.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          <p className="min-h-[56px] text-2xl font-black text-foreground">
            {spinning ? (
              <span className="text-lg text-muted-foreground">{spinName}</span>
            ) : winner ? (
              winner
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                {items.length} option{items.length === 1 ? "" : "s"} loaded — spin to pick
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={spin}
            disabled={remaining.length === 0 || spinning}
            className="ripple-press mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Dices className="size-5" aria-hidden />
            {remaining.length === 0 ? "All options picked" : spinning ? "Picking…" : "Pick one"}
          </button>
          <label className="mt-3 flex items-center justify-center gap-2 text-[12.5px] text-muted-foreground">
            <input
              type="checkbox"
              checked={noRepeat}
              onChange={(e) => {
                setNoRepeat(e.target.checked);
                reset();
              }}
              className="size-4 accent-[var(--primary)]"
            />
            No repeats (each option can win once)
          </label>
        </div>

        <div className="relative">
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={7}
            spellCheck={false}
            aria-label="Options, one per line"
            className="w-full rounded-xl border border-border bg-surface p-3.5 font-mono text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
            placeholder={"Option A\nOption B\nOption C"}
          />
          {items.length > 0 && (
            <span className="absolute right-3 top-3 rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              {items.length} items
            </span>
          )}
        </div>

        {history.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-foreground">
                Picked ({history.length}
                {noRepeat ? `/${items.length}` : ""})
              </h2>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden /> Clear
              </button>
            </div>
            <ol className="mt-2 space-y-1 text-[13px] text-muted-foreground">
              {history.map((h, i) => (
                <li key={`${h}-${i}`} className="flex items-center gap-2">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface-elevated text-[10px] font-bold text-foreground">
                    {i + 1}
                  </span>
                  {h}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </AppShell>
  );
}
