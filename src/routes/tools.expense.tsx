import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/expense")({
  component: ExpenseSplitter,
});

interface Person { id: string; name: string }
interface Expense { id: string; desc: string; amount: number; paidBy: string }

function minimizeTransactions(balances: Map<string, number>): { from: string; to: string; amount: number }[] {
  const txns: { from: string; to: string; amount: number }[] = [];
  const debtors: { name: string; amount: number }[] = [];
  const creditors: { name: string; amount: number }[] = [];
  balances.forEach((amt, name) => {
    if (amt < -0.01) debtors.push({ name, amount: -amt });
    else if (amt > 0.01) creditors.push({ name, amount: amt });
  });
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i]!, c = creditors[j]!;
    const amt = Math.min(d.amount, c.amount);
    if (amt > 0.01) txns.push({ from: d.name, to: c.name, amount: Math.round(amt) });
    d.amount -= amt; c.amount -= amt;
    if (d.amount < 0.01) i++;
    if (c.amount < 0.01) j++;
  }
  return txns;
}

function ExpenseSplitter() {
  const [event, setEvent] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [personName, setPersonName] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expPaidBy, setExpPaidBy] = useState("");

  const addPerson = () => {
    if (!personName.trim()) return;
    setPeople(p => [...p, { id: crypto.randomUUID(), name: personName.trim() }]);
    setPersonName("");
  };

  const addExpense = () => {
    if (!expDesc.trim() || !expAmount || !expPaidBy) return;
    setExpenses(e => [...e, { id: crypto.randomUUID(), desc: expDesc.trim(), amount: parseFloat(expAmount), paidBy: expPaidBy }]);
    setExpDesc(""); setExpAmount("");
  };

  const removeExpense = (id: string) => setExpenses(e => e.filter(x => x.id !== id));

  const transactions = useMemo(() => {
    if (!people.length || !expenses.length) return [];
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const perPerson = total / people.length;
    const balances = new Map(people.map(p => [p.name, 0]));
    expenses.forEach(e => { balances.set(e.paidBy, (balances.get(e.paidBy) || 0) + e.amount); });
    people.forEach(p => { balances.set(p.name, (balances.get(p.name) || 0) - perPerson); });
    return minimizeTransactions(balances);
  }, [people, expenses]);

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = people.length > 0 ? totalSpent / people.length : 0;

  const handleCopy = async () => {
    let text = `💰 ${event || "Expense Split"}\n\n`;
    text += `Total: ₹${totalSpent} | Per person: ₹${Math.round(perPerson)}\n\n`;
    text += `Expenses:\n`;
    expenses.forEach(e => { text += `• ${e.desc}: ₹${e.amount} (paid by ${e.paidBy})\n`; });
    text += `\nSettlements:\n`;
    transactions.forEach(t => { text += `→ ${t.from} pays ${t.to} ₹${t.amount}\n`; });
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <AppShell title="Expense Splitter">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">💸 Trip Expense Splitter</h1>
        <p className="mt-1 text-sm text-muted-foreground">Split expenses fairly. Calculates minimum transactions to settle.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Event Name</label>
            <input value={event} onChange={e => setEvent(e.target.value)} placeholder="e.g. Goa Trip 2026"
              className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary/60 focus:outline-none" />
          </div>

          <div className="rounded-xl border border-border bg-surface p-3">
            <h3 className="mb-2 text-xs font-semibold text-foreground">People</h3>
            <div className="flex gap-2">
              <input value={personName} onChange={e => setPersonName(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addPerson())} placeholder="Add person..."
                className="h-8 flex-1 rounded-lg border border-border bg-surface-elevated px-2.5 text-xs focus:border-primary/60 focus:outline-none" />
              <button type="button" onClick={addPerson} className="h-8 rounded-lg bg-primary px-3 text-xs text-primary-foreground">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {people.map(p => (
                <span key={p.id} className="flex items-center gap-1 rounded-md bg-surface-elevated px-2 py-0.5 text-[10px]">
                  {p.name}
                  <button type="button" onClick={() => { setPeople(pe => pe.filter(x => x.id !== p.id)); setExpenses(ex => ex.filter(e => e.paidBy !== p.name)); }} className="text-muted-foreground hover:text-red-400">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3">
            <h3 className="mb-2 text-xs font-semibold text-foreground">Add Expense</h3>
            <div className="grid grid-cols-3 gap-2">
              <input value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="Description" className="h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none" />
              <input type="number" value={expAmount} onChange={e => setExpAmount(e.target.value)} placeholder="Amount ₹" className="h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none" />
              <select value={expPaidBy} onChange={e => setExpPaidBy(e.target.value)} className="h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs">
                <option value="">Paid by</option>
                {people.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <button type="button" onClick={addExpense} className="mt-2 h-8 w-full rounded-lg bg-surface-elevated text-xs font-medium text-foreground hover:bg-accent">+ Add Expense</button>

            {expenses.length > 0 && (
              <div className="mt-3 space-y-1">
                {expenses.map(e => (
                  <div key={e.id} className="flex items-center justify-between rounded-lg bg-surface-elevated px-2.5 py-1.5 text-xs">
                    <span>{e.desc}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">₹{e.amount} · {e.paidBy}</span>
                      <button type="button" onClick={() => removeExpense(e.id)} className="text-muted-foreground hover:text-red-400">×</button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-surface-elevated p-3">
                <p className="text-xl font-bold text-primary">₹{totalSpent}</p>
                <p className="text-[10px] text-muted-foreground">Total Spent</p>
              </div>
              <div className="rounded-lg bg-surface-elevated p-3">
                <p className="text-xl font-bold text-foreground">₹{Math.round(perPerson)}</p>
                <p className="text-[10px] text-muted-foreground">Per Person</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">💸 Settlements</h3>
            {transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.map((t, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-2">
                    <span className="text-xs text-foreground"><span className="font-medium">{t.from}</span> pays <span className="font-medium">{t.to}</span></span>
                    <span className="text-sm font-bold text-primary">₹{t.amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Add people and expenses to see settlements</p>
            )}
          </div>

          {transactions.length > 0 && (
            <button type="button" onClick={handleCopy}
              className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90">
              Copy Summary
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
