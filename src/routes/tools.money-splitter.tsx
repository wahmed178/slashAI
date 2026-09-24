import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/money-splitter")({ component: MoneySplitter });

/**
 * Other People's Money — group spending in the open. Most "who owes what"
 * tools stop at settlement math; this one adds the layer that actually
 * prevents fights: every entry is labeled as a shared expense or a personal
 * lend (the two things that always get conflated), net balances show where
 * each person stands, and a planner answers "can we afford X?" before anyone
 * commits. Everything stays on this device.
 */

interface Entry {
  id: number;
  label: string;
  amount: number;
  paidBy: number; // index into people
  kind: "expense" | "lend";
  /** for lends: index of the person who received the money */
  to?: number;
  /** custom amounts per person (expense with custom split) */
  custom?: number[];
}

function inr(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function MoneySplitter() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [people, setPeople] = useState([{ name: "Me" }, { name: "Friend 1" }]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [nextId, setNextId] = useState(1);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [kind, setKind] = useState<Entry["kind"]>("expense");
  const [paidBy, setPaidBy] = useState(0);
  const [to, setTo] = useState(0);
  const [custom, setCustom] = useState<number[]>([]);
  const [plannerAmount, setPlannerAmount] = useState(0);
  const [plannerSplit, setPlannerSplit] = useState<"equal" | "proportional">("equal");

  const fmt = (n: number) =>
    currency === "INR" ? inr(n) : `$${Math.round(n).toLocaleString("en-US")}`;
  const step = currency === "INR" ? 50 : 5;

  const { balances, settlements } = useMemo(() => {
    const net = people.map(() => 0);
    for (const e of entries) {
      if (e.kind === "lend") {
        // a personal lend: payer is owed the full amount by the recipient only
        net[e.paidBy] = (net[e.paidBy] ?? 0) + e.amount;
        if (e.to !== undefined) net[e.to] = (net[e.to] ?? 0) - e.amount;
        continue;
      }
      // shared expense
      if (e.custom) {
        // custom split: the entered amounts ARE the shares; payer fronts it all
        const parts = people.map((_, i) => e.custom?.[i] ?? 0);
        const totalParts = parts.reduce((a, b) => a + b, 0) || 1;
        for (let i = 0; i < people.length; i++) {
          net[i] = (net[i] ?? 0) + (e.amount * parts[i]!) / totalParts;
        }
        net[e.paidBy] = (net[e.paidBy] ?? 0) + e.amount;
      } else {
        const share = e.amount / people.length;
        for (let i = 0; i < people.length; i++) net[i] = (net[i] ?? 0) + share;
        net[e.paidBy] = (net[e.paidBy] ?? 0) + e.amount - share;
      }
    }
    // minimal transfers via greedy matching
    const debtors = net.map((v, i) => ({ i, v })).filter((x) => x.v < -0.5).sort((a, b) => a.v - b.v);
    const creditors = net.map((v, i) => ({ i, v })).filter((x) => x.v > 0.5).sort((a, b) => b.v - a.v);
    const transfers: { from: number; to: number; amount: number }[] = [];
    let di = 0;
    let ci = 0;
    let dv = debtors.map((d) => -d.v);
    let cv = creditors.map((c) => c.v);
    while (di < dv.length && ci < cv.length) {
      const pay = Math.min(dv[di]!, cv[ci]!);
      if (pay > 0.5) transfers.push({ from: debtors[di]!.i, to: creditors[ci]!.i, amount: pay });
      dv[di] = dv[di]! - pay;
      cv[ci] = cv[ci]! - pay;
      if (dv[di]! < 0.5) di++;
      if (cv[ci]! < 0.5) ci++;
    }
    return { balances: net, settlements: transfers };
  }, [entries, people]);

  const addEntry = () => {
    if (!label.trim() || amount <= 0) return;
    setEntries((prev) => [
      ...prev,
      {
        id: nextId,
        label: label.trim(),
        amount,
        paidBy,
        kind,
        ...(kind === "lend" ? { to } : {}),
        ...(kind === "expense" && custom.some((c) => c > 0) ? { custom: [...custom] } : {}),
      },
    ]);
    setNextId((n) => n + 1);
    setLabel("");
    setAmount(0);
    setCustom([]);
  };

  const removeEntry = (id: number) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const netFor = (i: number) => balances[i] ?? 0;

  const plannerText = (() => {
    if (plannerAmount <= 0) return null;
    if (plannerSplit === "equal") {
      const each = plannerAmount / people.length;
      return `Split equally: ${fmt(each)} per person across ${people.length} people.`;
    }
    const totalSpent = entries.filter((e) => e.kind === "expense").reduce((a, e) => a + e.amount, 0);
    if (totalSpent <= 0)
      return `No shared spending yet, so proportional ≈ equal: ${fmt(plannerAmount / people.length)} each.`;
    return `By spend so far: the biggest spender's share scales with what they've already fronted — ${fmt(
      (plannerAmount * Math.max(...entries.filter((e) => e.kind === "expense").map((e) => e.amount))) / totalSpent,
    )} for the top contributor, less for others.`;
  })();

  return (
    <AppShell title="Other People's Money">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">👥 Other People's Money</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Group spending without the spreadsheet. Tag every entry as a shared <b>expense</b> or a personal{" "}
          <b>lend</b> — the two things group trips always conflate — see clean net balances, get the minimum
          set of transfers to settle up, and plan the next spend before committing. Everything stays on this
          device.
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        {/* people + balances */}
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">People & net balance</p>
            <div className="flex gap-1 text-[11px]">
              {(["INR", "USD"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`rounded-full px-2.5 py-0.5 font-bold ${currency === c ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {people.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={p.name}
                  onChange={(e) =>
                    setPeople((prev) => prev.map((pp, j) => (j === i ? { ...pp, name: e.target.value } : pp)))
                  }
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <span className={`w-28 text-right text-xs font-bold ${netFor(i) > 0.5 ? "text-emerald-500" : netFor(i) < -0.5 ? "text-red-400" : "text-muted-foreground"}`}>
                  {netFor(i) > 0.5 ? `gets ${fmt(netFor(i))}` : netFor(i) < -0.5 ? `owes ${fmt(-netFor(i))}` : "settled"}
                </span>
                <button
                  onClick={() => {
                    setPeople((prev) => prev.filter((_, j) => j !== i));
                    setEntries((prev) => prev.filter((e) => e.paidBy !== i && e.to !== i && !(e.custom ?? [])[i]));
                  }}
                  disabled={people.length <= 2}
                  className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-red-400 disabled:opacity-30"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPeople((prev) => [...prev, { name: `Friend ${prev.length}` }])}
            className="w-full rounded-xl border border-dashed border-border py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary"
          >
            + add person
          </button>
        </div>

        {/* add entry */}
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Add entry</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">What</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Dinner at Cafe Mocha"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Amount</label>
              <input
                type="number"
                value={amount || ""}
                step={step}
                min={0}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Type</label>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {([
                  ["expense", "🧾 Expense"],
                  ["lend", "🤝 Lend"],
                ] as const).map(([k, lab]) => (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    className={`rounded-xl border px-2 py-2 font-semibold ${kind === k ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                  >
                    {lab}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Paid by</label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {people.map((p, i) => (
                  <option key={i} value={i}>{p.name || `Person ${i + 1}`}</option>
                ))}
              </select>
            </div>
          </div>

          {kind === "lend" && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Money went to</label>
              <select
                value={to}
                onChange={(e) => setTo(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {people.map((p, i) => (
                  <option key={i} value={i}>{p.name || `Person ${i + 1}`}</option>
                ))}
              </select>
            </div>
          )}

          {kind === "expense" && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">
                Split — optional custom amounts (blank = equal)
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {people.map((p, i) => (
                  <div key={i}>
                    <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">{p.name || `P${i + 1}`}</label>
                    <input
                      type="number"
                      value={custom[i] ?? ""}
                      step={step}
                      min={0}
                      placeholder="equal"
                      onChange={(e) =>
                        setCustom((prev) => {
                          const n = [...prev];
                          n[i] = Number(e.target.value) || 0;
                          return n;
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Leave all blank for an equal split, or type who actually owes what (they don't need to add up —
                the tool scales them).
              </p>
            </div>
          )}

          <button
            onClick={addEntry}
            disabled={!label.trim() || amount <= 0}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-40"
          >
            Add to ledger
          </button>
        </div>

        {/* ledger + settle up */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Ledger & settle up
          </p>
          {entries.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No entries yet — add the first one above.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {settlements.length > 0 && (
                <div className="rounded-xl bg-primary/10 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Settle up in {settlements.length} transfer{settlements.length > 1 ? "s" : ""}
                  </p>
                  {settlements.map((s, i) => (
                    <p key={i} className="mt-1 text-sm text-foreground">
                      <b>{people[s.from]?.name ?? "?"}</b> pays <b>{people[s.to]?.name ?? "?"}</b> — {fmt(s.amount)}
                      <CopyButton text={`${people[s.from]?.name} owes ${people[s.to]?.name}: ${fmt(s.amount)}`} />
                    </p>
                  ))}
                </div>
              )}
              {settlements.length === 0 && (
                <p className="text-xs text-muted-foreground">Everyone is settled. 🎉</p>
              )}
              <details>
                <summary className="cursor-pointer text-xs font-semibold text-muted-foreground">
                  Show all {entries.length} entries
                </summary>
                <div className="mt-2 space-y-1.5">
                  {entries.map((e) => (
                    <div key={e.id} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-1.5 text-xs">
                      <span className="truncate text-foreground">
                        {e.kind === "lend" ? "🤝" : "🧾"} {e.label} · {people[e.paidBy]?.name ?? "?"} paid
                        {e.kind === "lend" && e.to !== undefined ? ` → ${people[e.to]?.name ?? "?"}` : ""}
                      </span>
                      <span className="ml-2 flex shrink-0 items-center gap-2">
                        <span className="font-bold text-foreground">{fmt(e.amount)}</span>
                        <button onClick={() => removeEntry(e.id)} className="text-muted-foreground hover:text-red-400">✕</button>
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>

        {/* planner */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Afford planner</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Answer "can we afford X?" before anyone commits.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Planned cost</label>
              <input
                type="number"
                value={plannerAmount || ""}
                step={currency === "INR" ? 500 : 25}
                min={0}
                onChange={(e) => setPlannerAmount(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Split</label>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {([
                  ["equal", "🟰 Equal"],
                  ["proportional", "⚖️ Proportional"],
                ] as const).map(([m, lab]) => (
                  <button
                    key={m}
                    onClick={() => setPlannerSplit(m)}
                    className={`rounded-xl border px-2 py-2 font-semibold ${plannerSplit === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                  >
                    {lab}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {plannerText && (
            <div className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3">
              <p className="text-sm text-foreground">{plannerText}</p>
            </div>
          )}
        </div>

        <FaqSection />
      </div>
    </AppShell>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold ${done ? "bg-emerald-500/20 text-emerald-500" : "bg-muted text-muted-foreground hover:text-foreground"}`}
    >
      {done ? "copied" : "copy"}
    </button>
  );
}
