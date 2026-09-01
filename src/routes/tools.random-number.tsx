import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/random-number")({ component: RandomNumberGenerator });

function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [unique, setUnique] = useState(true);

  const generate = () => {
    const nums: number[] = [];
    const used = new Set<number>();
    while (nums.length < count) {
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      if (unique && used.has(n)) continue;
      nums.push(n);
      used.add(n);
    }
    setResults(nums);
  };

  const sorted = [...results].sort((a, b) => a - b);

  return (
    <AppShell title="Random Number Generator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔢 Random Number Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generate random numbers in any range.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-muted-foreground mb-1 block">Min</label><input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Max</label><input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm" /></div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-muted-foreground">Count</label>
          <input type="range" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="flex-1 accent-primary" />
          <span className="text-xs text-foreground">{count}</span>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="accent-primary" /> Unique only
        </label>
        <button onClick={generate} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90">Generate</button>
        {results.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {sorted.map((n, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-2 text-center">
                <p className="text-lg font-bold text-primary">{n}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
