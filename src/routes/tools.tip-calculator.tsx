import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/tip-calculator")({ component: TipCalculator });

function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState(1);

  const total = useMemo(() => {
    const b = parseFloat(bill) || 0;
    const tip = b * (tipPercent / 100);
    return { tip, total: b + tip, perPerson: people > 0 ? (b + tip) / people : 0 };
  }, [bill, tipPercent, people]);

  return (
    <AppShell title="Tip Calculator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">💰 Tip Calculator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Calculate tips and split bills easily.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Bill Amount</label>
          <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="0.00"
            className="w-full h-12 rounded-xl border border-border bg-surface px-4 text-xl font-bold focus:outline-none" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Tip: {tipPercent}%</label>
          <input type="range" min={0} max={50} value={tipPercent} onChange={(e) => setTipPercent(Number(e.target.value))} className="w-full accent-primary" />
          <div className="flex gap-2 mt-1">{[10, 15, 18, 20, 25].map((t) => (
            <button key={t} onClick={() => setTipPercent(t)} className={`flex-1 rounded-lg py-1 text-xs ${tipPercent === t ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}>{t}%</button>
          ))}</div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Split between: {people} {people === 1 ? "person" : "people"}</label>
          <div className="flex gap-2 items-center">
            <button onClick={() => setPeople(Math.max(1, people - 1))} className="size-9 rounded-lg border border-border bg-surface text-lg">-</button>
            <span className="text-lg font-bold w-8 text-center">{people}</span>
            <button onClick={() => setPeople(people + 1)} className="size-9 rounded-lg border border-border bg-surface text-lg">+</button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tip</span><span className="font-bold text-primary">${total.tip.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="font-bold text-foreground">${total.total.toFixed(2)}</span></div>
          {people > 1 && <div className="flex justify-between text-sm border-t border-border pt-2"><span className="text-muted-foreground">Per Person</span><span className="font-bold text-primary text-lg">${total.perPerson.toFixed(2)}</span></div>}
        </div>
      </div>
    </AppShell>
  );
}
