import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/kharch")({ component: KharchTracker });

type Lang = "en" | "ur" | "hi";

const LABELS: Record<Lang, Record<string, string>> = {
  en: { title: "Kharch Tracker", income: "Income", expense: "Expense", amount: "Amount", desc: "Description", cat: "Category", add: "Add", total: "Total", remaining: "Remaining", savings: "Savings Rate" },
  ur: { title: "خرچ ٹریکر", income: "آمدنی", expense: "اخراجات", amount: "رقم", desc: "تفصیل", cat: "زمرہ", add: "شامل کریں", total: "کل", remaining: "بچت", savings: "بچت کا شرح" },
  hi: { title: "खर्च ट्रैकर", income: "आय", expense: "खर्च", amount: "रकम", desc: "विवरण", cat: "श्रेणी", add: "जोड़ें", total: "कुल", remaining: "शेष", savings: "बचत दर" },
};

const CATEGORIES_EN = ["Rent", "Groceries", "Utilities", "Transport", "Food", "Recharge", "OTT", "Savings", "EMI", "Medical", "Education", "Misc"];

function KharchTracker() {
  const [lang, setLang] = useState<Lang>("en");
  const [entries, setEntries] = useState<{ id: string; type: "income" | "expense"; amount: number; desc: string; cat: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem("slashai.kharch") || "[]"); } catch { return []; }
  });
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("Misc");
  const [entryType, setEntryType] = useState<"income" | "expense">("expense");

  useEffect(() => { try { localStorage.setItem("slashai.kharch", JSON.stringify(entries)); } catch {} }, [entries]);

  const L = LABELS[lang];
  const totalIncome = entries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpense = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const remaining = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  const addEntry = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setEntries(e => [...e, { id: crypto.randomUUID(), type: entryType, amount: amt, desc: desc.trim() || cat, cat }]);
    setAmount(""); setDesc("");
  };

  const removeEntry = (id: string) => setEntries(e => e.filter(x => x.id !== id));

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    entries.filter(e => e.type === "expense").forEach(e => { map[e.cat] = (map[e.cat] || 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  return (
    <AppShell title={L["title"] ?? "Kharch Tracker"}>
      <header className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{L["title"] ?? "Kharch Tracker"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{lang === "en" ? "Track income and expenses with Indian categories" : lang === "ur" ? "آمدنی اور اخراجات کو ٹریک کریں" : "आय और खर्च को ट्रैक करें"}</p>
          </div>
          <div className="flex gap-1">
            {(["en", "ur", "hi"] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} className={`rounded-lg border px-2 py-1 text-xs uppercase transition-colors ${lang === l ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{l}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-border bg-surface p-3">
              <p className="text-lg font-bold text-green-400">₹{totalIncome.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">{L["income"]}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-3">
              <p className="text-lg font-bold text-red-400">₹{totalExpense.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">{L["expense"]}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-3">
              <p className={`text-lg font-bold ${remaining >= 0 ? "text-primary" : "text-red-400"}`}>₹{remaining.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">{L["remaining"]} · {savingsRate}%</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3">
            <div className="flex gap-1.5">
              {(["income", "expense"] as const).map(t => (
                <button key={t} onClick={() => setEntryType(t)} className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${entryType === t ? t === "income" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400" : "bg-surface-elevated text-muted-foreground"}`}>{L[t]}</button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={L["amount"]}
                className="h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none" />
              <input value={desc} onChange={e => setDesc(e.target.value)} placeholder={L["desc"]}
                className="h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none" />
            </div>
            <div className="mt-2 flex gap-1.5">
              <select value={cat} onChange={e => setCat(e.target.value)} className="h-8 flex-1 rounded-lg border border-border bg-surface-elevated px-2 text-xs">
                {CATEGORIES_EN.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={addEntry} className="h-8 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground">{L["add"]}</button>
            </div>
          </div>

          <div className="space-y-1">
            {entries.slice(-10).reverse().map(e => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-xs">
                <div>
                  <span className="text-foreground">{e.desc}</span>
                  <span className="ml-2 text-muted-foreground">{e.cat}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={e.type === "income" ? "text-green-400" : "text-red-400"}>{e.type === "income" ? "+" : "-"}₹{e.amount.toLocaleString()}</span>
                  <button onClick={() => removeEntry(e.id)} className="text-muted-foreground hover:text-red-400">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold text-foreground">{lang === "en" ? "Spending by Category" : lang === "ur" ? "زمرے کے مطابق خرچ" : "श्रेणी के अनुसार खर्च"}</h3>
          <div className="space-y-2">
            {byCategory.map(([cat, amt]) => {
              const pct = totalExpense > 0 ? (amt / totalExpense) * 100 : 0;
              return (
                <div key={cat} className="rounded-lg border border-border bg-surface p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{cat}</span>
                    <span className="text-muted-foreground">₹{amt.toLocaleString()} ({Math.round(pct)}%)</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {byCategory.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">{lang === "en" ? "No expenses yet" : "ابھی تک کوئی اخراجات نہیں"}</p>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
