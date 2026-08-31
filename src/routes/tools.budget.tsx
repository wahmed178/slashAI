import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Plus, Trash2, Download } from "lucide-react";

export const Route = createFileRoute("/tools/budget")({
  head: () => ({ meta: [{ title: "Monthly Budget Tracker — SlashAI" }] }),
  component: BudgetTracker,
});

const EXPENSE_CATS = ["Rent/EMI", "Groceries", "Fuel", "Recharge", "OTT", "Eating Out", "Shopping", "Health", "Education", "Transport", "Utilities", "Other"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type BudgetData = {
  [month: string]: {
    income: Array<{ source: string; amount: number }>;
    expenses: Array<{ category: string; amount: number }>;
  };
};

function BudgetTracker() {
  const [data, setData] = useState<BudgetData>(() => {
    try { return JSON.parse(localStorage.getItem("budget_data") || "{}"); } catch { return {}; }
  });
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [newIncome, setNewIncome] = useState({ source: "", amount: "" });
  const [newExpense, setNewExpense] = useState({ category: "Rent/EMI", amount: "" });

  const current = data[month] || { income: [], expenses: [] };
  const totalIncome = current.income.reduce((s, i) => s + i.amount, 0);
  const totalExpense = current.expenses.reduce((s, e) => s + e.amount, 0);
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  const save = (next: BudgetData) => {
    setData(next);
    try { localStorage.setItem("budget_data", JSON.stringify(next)); } catch { /* ignore */ }
  };

  const addIncome = () => {
    if (!newIncome.source || !newIncome.amount) return;
    const d = { ...data, [month]: { ...current, income: [...current.income, { source: newIncome.source, amount: parseFloat(newIncome.amount) }] } };
    save(d);
    setNewIncome({ source: "", amount: "" });
  };

  const addExpense = () => {
    if (!newExpense.amount) return;
    const d = { ...data, [month]: { ...current, expenses: [...current.expenses, { category: newExpense.category, amount: parseFloat(newExpense.amount) }] } };
    save(d);
    setNewExpense({ ...newExpense, amount: "" });
  };

  const removeIncome = (idx: number) => {
    const d = { ...data, [month]: { ...current, income: current.income.filter((_, i) => i !== idx) } };
    save(d);
  };

  const removeExpense = (idx: number) => {
    const d = { ...data, [month]: { ...current, expenses: current.expenses.filter((_, i) => i !== idx) } };
    save(d);
  };

  const exportCSV = () => {
    let csv = "Type,Category/Source,Amount\n";
    current.income.forEach((i) => { csv += `Income,${i.source},${i.amount}\n`; });
    current.expenses.forEach((e) => { csv += `Expense,${e.category},${e.amount}\n`; });
    csv += `\nTotal Income,,${totalIncome}\nTotal Expenses,,${totalExpense}\nSavings,,${savings}\n`;
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `budget-${month}.csv`;
    a.click();
  };

  // Per-category breakdown for chart
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    current.expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [current.expenses]);

  return (
    <AppShell title="Monthly Budget Tracker">
      <div className="mx-auto max-w-3xl space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Budget Tracker</h1>
            <p className="mt-1 text-sm text-muted-foreground">Track income vs expenses — all stored locally.</p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground hover:text-foreground"><Download className="size-3.5" /> Export CSV</button>
        </div>

        {/* Month selector */}
        <div className="flex flex-wrap gap-1.5">
          {MONTHS.map((m, i) => {
            const key = `${new Date().getFullYear()}-${String(i + 1).padStart(2, "0")}`;
            return (
              <button key={m} onClick={() => setMonth(key)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${month === key ? "bg-primary/10 text-primary border border-primary/30" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
                {m}
              </button>
            );
          })}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Income", value: `₹${totalIncome.toLocaleString("en-IN")}`, color: "text-green" },
            { label: "Expenses", value: `₹${totalExpense.toLocaleString("en-IN")}`, color: "text-red" },
            { label: "Savings", value: `₹${savings.toLocaleString("en-IN")}`, color: savings >= 0 ? "text-green" : "text-red" },
            { label: "Savings Rate", value: `${savingsRate}%`, color: savingsRate >= 20 ? "text-green" : savingsRate >= 0 ? "text-yellow" : "text-red" },
          ].map((s) => (
            <div key={s.label} className="rounded-[10px] border border-border bg-surface p-3 text-center">
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Income vs Expenses bar */}
        {totalIncome > 0 && (
          <div className="rounded-[10px] border border-border bg-surface p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Income vs Expenses</p>
            <div className="h-6 overflow-hidden rounded-full bg-surface-elevated">
              <div className="flex h-full">
                <div className="bg-green transition-all" style={{ width: `${Math.min((totalExpense / totalIncome) * 100, 100)}%` }} />
                <div className="bg-primary/30 transition-all" style={{ width: `${Math.min(savingsRate, 100)}%` }} />
              </div>
            </div>
            <div className="mt-1.5 flex justify-between text-[10px]">
              <span className="text-green">Expenses ₹{totalExpense.toLocaleString("en-IN")}</span>
              <span className="text-primary">Saved ₹{savings.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}

        {/* Category breakdown */}
        {categoryTotals.length > 0 && (
          <div className="rounded-[10px] border border-border bg-surface p-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground">Category Breakdown</p>
            <div className="space-y-2">
              {categoryTotals.map(([cat, amt]) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className="w-28 text-xs text-foreground">{cat}</span>
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-surface-elevated">
                    <div className="h-full rounded-full bg-primary/50" style={{ width: `${(amt / totalExpense) * 100}%` }} />
                  </div>
                  <span className="w-20 text-right text-xs text-muted-foreground">₹{amt.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add income */}
        <div className="rounded-[10px] border border-border bg-surface p-4">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Add Income</p>
          <div className="flex gap-2">
            <input value={newIncome.source} onChange={(e) => setNewIncome((p) => ({ ...p, source: e.target.value }))} placeholder="Source (Salary, Freelance)" className="h-9 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
            <input type="number" value={newIncome.amount} onChange={(e) => setNewIncome((p) => ({ ...p, amount: e.target.value }))} placeholder="₹ Amount" className="h-9 w-32 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
            <button onClick={addIncome} className="flex size-9 items-center justify-center rounded-lg bg-green/10 text-green hover:bg-green/20"><Plus className="size-4" /></button>
          </div>
          {current.income.map((inc, idx) => (
            <div key={idx} className="mt-2 flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5 text-xs">
              <span className="text-foreground">{inc.source}</span>
              <div className="flex items-center gap-2">
                <span className="text-green">+₹{inc.amount.toLocaleString("en-IN")}</span>
                <button onClick={() => removeIncome(idx)} className="text-muted-foreground hover:text-red"><Trash2 className="size-3" /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Add expense */}
        <div className="rounded-[10px] border border-border bg-surface p-4">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Add Expense</p>
          <div className="flex gap-2">
            <select value={newExpense.category} onChange={(e) => setNewExpense((p) => ({ ...p, category: e.target.value }))} className="h-9 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground focus:outline-none">
              {EXPENSE_CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input type="number" value={newExpense.amount} onChange={(e) => setNewExpense((p) => ({ ...p, amount: e.target.value }))} placeholder="₹ Amount" className="h-9 w-32 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
            <button onClick={addExpense} className="flex size-9 items-center justify-center rounded-lg bg-red/10 text-red hover:bg-red/20"><Plus className="size-4" /></button>
          </div>
          {current.expenses.map((exp, idx) => (
            <div key={idx} className="mt-2 flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5 text-xs">
              <span className="text-foreground">{exp.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-red">-₹{exp.amount.toLocaleString("en-IN")}</span>
                <button onClick={() => removeExpense(idx)} className="text-muted-foreground hover:text-red"><Trash2 className="size-3" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
