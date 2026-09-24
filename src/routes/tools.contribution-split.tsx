import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/contribution-split")({ component: ContributionSplit });

/**
 * Living Contribution Splitter — the rent-splitting tool for couples. Almost
 * every split (50/50 or "she pays the rent") quietly breeds resentment because
 * neither matches reality. This splits household costs by the ratio of take-home
 * incomes, applies the widely-recommended 30% of individual income rent cap to
 * flag unaffordable arrangements, and shows both partners exactly what each
 * pays — with the money conversation scripted for them.
 */

interface Person {
  name: string;
  income: number;
}

function inr(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function ContributionSplit() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [mode, setMode] = useState<"ratio" | "equal" | "custom">("ratio");
  const [rent, setRent] = useState(30000);
  const [utilities, setUtilities] = useState(5000);
  const [other, setOther] = useState(6000);
  const [p1, setP1] = useState<Person>({ name: "Partner A", income: 90000 });
  const [p2, setP2] = useState<Person>({ name: "Partner B", income: 55000 });
  const [customPct, setCustomPct] = useState(60);

  const fmt = (n: number) =>
    currency === "INR" ? inr(n) : `$${Math.round(n).toLocaleString("en-US")}`;
  const step = currency === "INR" ? 1000 : 250;

  const calc = useMemo(() => {
    const totalIncome = Math.max(1, p1.income + p2.income);
    const total = rent + utilities + other;

    let share1: number;
    if (mode === "equal") share1 = 0.5;
    else if (mode === "custom") share1 = customPct / 100;
    else share1 = p1.income / totalIncome;

    const s1 = total * share1;
    const s2 = total - s1;

    // 30% rule per person on their own income
    const cap1 = p1.income * 0.3;
    const cap2 = p2.income * 0.3;
    const over1 = s1 > cap1;
    const over2 = s2 > cap2;

    // fairness read: share vs income ratio divergence
    const incomeShare = p1.income / totalIncome;
    const fairnessGap = Math.abs(share1 - incomeShare) * 100;

    // the earlier split suggestion if rent is too heavy for one partner
    const fairRent1 = Math.min(rent, cap1 - (utilities + other) * share1);
    const suggestedRent = Math.max(0, Math.floor((cap1 - (utilities + other) * share1) / (share1 || 1)));

    return {
      total,
      s1,
      s2,
      over1,
      over2,
      fairnessGap,
      suggestedRent,
      fairRent1,
      incomeSharePct: incomeShare * 100,
    };
  }, [rent, utilities, other, p1, p2, mode, customPct]);

  const problem = calc.over1 || calc.over2;

  const convo = [
    `We bring home ${fmt(p1.income)} and ${fmt(p2.income)} — that's ${calc.incomeSharePct.toFixed(0)}/${(100 - calc.incomeSharePct).toFixed(0)} of the household.`,
    `So on a proportional split, our ${fmt(calc.total)} of shared costs lands at ${fmt(calc.s1)} for ${p1.name || "me"} and ${fmt(calc.s2)} for ${p2.name || "you"}.`,
    problem
      ? `That share is over 30% of one of our incomes, which is the stress threshold. Either we cap rent near ${fmt(calc.suggestedRent)}, or find a cheaper place — not because anyone is failing, but because that's the maths of not resenting each other.`
      : `Both shares stay under 30% of our individual incomes, which is the comfort zone — this split is sustainable, not just fair.`,
    `We'll revisit this every time either income changes — same rule, no renegotiation drama.`,
  ];

  return (
    <AppShell title="Living Contribution Splitter">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏠 Living Contribution Splitter</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          50/50 splits breed resentment when incomes differ; "they pay the rent" breeds fragility. This splits
          household costs by the ratio of what you each actually bring home, checks both shares against the
          30%-of-income comfort rule, and writes the money conversation for you. Everything stays on your device.
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Household</p>
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Partner A name</label>
              <input
                value={p1.name}
                onChange={(e) => setP1({ ...p1, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Partner B name</label>
              <input
                value={p2.name}
                onChange={(e) => setP2({ ...p2, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <NumberField label={`${p1.name || "Partner A"} take-home / month`} value={p1.income} onChange={(v) => setP1({ ...p1, income: v })} step={step} min={0} />
            <NumberField label={`${p2.name || "Partner B"} take-home / month`} value={p2.income} onChange={(v) => setP2({ ...p2, income: v })} step={step} min={0} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <NumberField label="Rent / month" value={rent} onChange={setRent} step={step} min={0} />
            <NumberField label="Utilities & bills" value={utilities} onChange={setUtilities} step={step} min={0} />
            <NumberField label="Other shared (help, subscriptions…)" value={other} onChange={setOther} step={step} min={0} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">Split method</label>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              {([
                ["ratio", "⚖️ Proportional", "by income share"],
                ["equal", "🟰 50/50", "same for both"],
                ["custom", "🎛️ Custom", "you decide %"],
              ] as const).map(([m, label, hint]) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-xl border px-2 py-2 font-semibold ${mode === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                >
                  <span className="block">{label}</span>
                  <span className="block text-[9px] font-normal opacity-70">{hint}</span>
                </button>
              ))}
            </div>
            {mode === "custom" && (
              <div className="mt-3">
                <label className="mb-1 block text-xs font-semibold text-foreground">
                  {p1.name || "Partner A"} pays {customPct}% · {p2.name || "Partner B"} pays {100 - customPct}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={customPct}
                  onChange={(e) => setCustomPct(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </div>
            )}
          </div>
        </div>

        {/* result cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className={`rounded-2xl border p-5 ${calc.over1 ? "border-red-500/40 bg-red-500/5" : "border-emerald-500/40 bg-emerald-500/5"}`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{p1.name || "Partner A"}</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">{fmt(calc.s1)}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {((calc.s1 / Math.max(1, p1.income)) * 100).toFixed(0)}% of their take-home ·{" "}
              {calc.over1 ? "over the 30% comfort line" : "within the 30% comfort line"}
            </p>
          </div>
          <div className={`rounded-2xl border p-5 ${calc.over2 ? "border-red-500/40 bg-red-500/5" : "border-emerald-500/40 bg-emerald-500/5"}`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{p2.name || "Partner B"}</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">{fmt(calc.s2)}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {((calc.s2 / Math.max(1, p2.income)) * 100).toFixed(0)}% of their take-home ·{" "}
              {calc.over2 ? "over the 30% comfort line" : "within the 30% comfort line"}
            </p>
          </div>
        </div>

        {problem && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              ⚠️ one of you is over the comfort line
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              A share above 30% of take-home is where money stress starts. On these incomes, a{" "}
              <b>sustainable rent is about {fmt(calc.suggestedRent)}</b> — or shift more of the shared pool onto the
              higher income with the custom slider. The point isn't who's right; it's that neither of you should be
              one bad month away from borrowing.
            </p>
          </div>
        )}

        <details className="rounded-2xl border border-border bg-surface p-4" open>
          <summary className="cursor-pointer text-sm font-bold text-foreground">
            💬 The money conversation, scripted
          </summary>
          <div className="mt-3 space-y-2">
            {convo.map((line, i) => (
              <p key={i} className="rounded-xl border border-border bg-background p-3 text-sm leading-relaxed text-foreground">
                <span className="mr-1 text-xs font-bold text-primary">{i + 1}.</span>
                {line}
                <CopyButton text={line} />
              </p>
            ))}
          </div>
        </details>

        <FaqSection />
      </div>
    </AppShell>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-foreground">{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
    </div>
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
