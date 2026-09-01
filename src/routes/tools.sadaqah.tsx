import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/sadaqah")({
  component: CharityTracker,
});

interface Donation { id: number; amount: number; recipient: string; date: string; category: string; }

const CATEGORIES = ["Zakat", "Sadaqah", "Fitrana", "General"] as const;

function CharityTracker() {
  const [donations, setDonations] = useState<Donation[]>(() => {
    try { return JSON.parse(localStorage.getItem("slashai.sadaqah") || "[]"); } catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ amount: "", recipient: "", category: "Sadaqah", date: new Date().toISOString().slice(0, 10) as string });

  const save = (d: Donation[]) => { setDonations(d); try { localStorage.setItem("slashai.sadaqah", JSON.stringify(d)); } catch {} };

  const addDonation = () => {
    if (!form.amount || Number(form.amount) <= 0) return;
    const today = new Date().toISOString().slice(0, 10);
    save([...donations, { id: Date.now(), amount: Number(form.amount), recipient: form.recipient, date: form.date || today, category: form.category }]);
    setForm({ amount: "", recipient: "", category: "Sadaqah", date: today });
    setShowAdd(false);
  };

  const removeDonation = (id: number) => save(donations.filter((d) => d.id !== id));

  const total = donations.reduce((a, d) => a + d.amount, 0);
  const thisMonth = donations.filter((d) => d.date.startsWith(new Date().toISOString().slice(0, 7))).reduce((a, d) => a + d.amount, 0);
  const thisYear = donations.filter((d) => d.date.startsWith(new Date().getFullYear().toString())).reduce((a, d) => a + d.amount, 0);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    donations.forEach((d) => { map[d.category] = (map[d.category] || 0) + d.amount; });
    return map;
  }, [donations]);

  const exportCSV = () => {
    const csv = "Date,Amount,Recipient,Category\n" + donations.map((d) => `${d.date},${d.amount},"${d.recipient}","${d.category}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "sadaqah.csv"; a.click();
  };

  return (
    <AppShell title="Charity Tracker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🤲 Sadaqah & Charity Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your charitable giving. Private — stored locally only.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-surface p-3 text-center">
            <p className="text-2xl font-bold text-primary">{total.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Total Given</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{thisMonth.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">This Month</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{thisYear.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">This Year</p>
          </div>
        </div>

        {/* By category */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">By Category</p>
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <div key={cat} className="flex-1 rounded-lg bg-surface-elevated p-2 text-center">
                <p className="text-sm font-bold text-foreground">{(byCategory[cat] || 0).toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">{cat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => setShowAdd(!showAdd)} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90">+ Add Donation</button>
          <button onClick={exportCSV} className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Export</button>
        </div>

        {showAdd && (
          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" className="h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none" />
            <input value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} placeholder="Recipient / Organization" className="h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none" />
            <button onClick={addDonation} disabled={!form.amount || Number(form.amount) <= 0} className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40">Add</button>
          </div>
        )}

        {/* List */}
        <div className="space-y-2">
          {donations.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No donations yet. Start tracking your sadaqah.</p>
          ) : [...donations].reverse().map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{d.amount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{d.recipient || "Anonymous"} · {d.date}</p>
              </div>
              <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground">{d.category}</span>
              <button onClick={() => removeDonation(d.id)} className="text-xs text-muted-foreground hover:text-red-400">✕</button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
