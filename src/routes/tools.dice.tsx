import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/dice")({ component: DiceRoller });

const DICE = [
  { sides: 4, label: "D4" }, { sides: 6, label: "D6" }, { sides: 8, label: "D8" },
  { sides: 10, label: "D10" }, { sides: 12, label: "D12" }, { sides: 20, label: "D20" }, { sides: 100, label: "D100" },
];

function DiceRoller() {
  const [results, setResults] = useState<{ die: string; value: number }[]>([]);
  const [selected, setSelected] = useState([6]);
  const [count, setCount] = useState(1);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      const r = selected.flatMap((sides) =>
        Array.from({ length: count }, () => ({ die: `D${sides}`, value: Math.floor(Math.random() * sides) + 1 }))
      );
      setResults(r);
      setRolling(false);
    }, 300);
  };

  const toggleDie = (sides: number) => {
    setSelected((prev) => prev.includes(sides) ? prev.filter((s) => s !== sides) : [...prev, sides]);
  };

  const total = results.reduce((a, r) => a + r.value, 0);

  return (
    <AppShell title="Dice Roller">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎲 Dice Roller</h1>
        <p className="mt-1 text-sm text-muted-foreground">Roll D4, D6, D8, D10, D12, D20, D100 for tabletop games.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {DICE.map((d) => (
            <button key={d.sides} onClick={() => toggleDie(d.sides)}
              className={`rounded-xl border p-3 text-center transition-all ${selected.includes(d.sides) ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"}`}>
              <p className="text-lg font-bold">{d.label}</p>
              <p className="text-[10px]">{d.sides} sides</p>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-muted-foreground">Count</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setCount(n)}
                className={`size-8 rounded-lg text-xs font-medium ${count === n ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}>{n}</button>
            ))}
          </div>
        </div>
        <button onClick={roll} disabled={selected.length === 0}
          className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-background hover:opacity-90 disabled:opacity-40 transition-all active:scale-95">
          {rolling ? "Rolling..." : "🎲 Roll!"}
        </button>
        {results.length > 0 && (
          <>
            <div className="grid grid-cols-4 gap-2">
              {results.map((r, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-3 text-center animate-bounce" style={{ animationDuration: "0.3s" }}>
                  <p className="text-2xl font-bold text-primary">{r.value}</p>
                  <p className="text-[10px] text-muted-foreground">{r.die}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total: <span className="text-lg font-bold text-foreground">{total}</span></p>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
