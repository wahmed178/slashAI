import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/negotiate-raise")({ component: NegotiateRaise });

/**
 * Raise Negotiator — you never get the raise you deserve, you get the raise
 * you can argue for. This tool takes your pay, market benchmarks and standing,
 * then runs the numbers an employer runs (real-terms erosion by inflation, the
 * cost of replacing you, the band you should anchor at) and produces a
 * beat-by-beat talking script with copy buttons. Nothing is saved or sent.
 */

function inr(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function NegotiateRaise() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [current, setCurrent] = useState(900000);
  const [marketP50, setMarketP50] = useState(1200000);
  const [marketP75, setMarketP75] = useState(1450000);
  const [tenureMonths, setTenureMonths] = useState(28);
  const [rating, setRating] = useState<"top" | "strong" | "meets">("strong");

  const fmt = (n: number) =>
    currency === "INR" ? inr(n) : `$${Math.round(n).toLocaleString("en-US")}`;
  const step = currency === "INR" ? 25000 : 5000;

  const calc = useMemo(() => {
    const inflation = 0.06; // rough annual retail inflation
    const yearsSince = tenureMonths / 12;
    const realValue = current / Math.pow(1 + inflation, yearsSince);
    const realCut = yearsSince > 0 ? ((current - realValue) / current) * 100 : 0;

    const bandLow = Math.max(current, marketP50);
    const ask = marketP75 > bandLow ? marketP75 : bandLow * 1.12;
    const gap = ask - current;
    const pct = current > 0 ? (gap / current) * 100 : 0;

    // hiring fee (~25–50% of salary) + ramp-up (~2–3 months) — conservative
    const replacementCost = current * 0.75;

    // what waiting one more review cycle costs (typical merit increment ~9%)
    const waitCost = Math.max(0, gap - current * 0.09);

    return { realValue, realCut, ask, gap, pct, replacementCost, waitCost };
  }, [current, marketP50, marketP75, tenureMonths]);

  const tone =
    calc.pct >= 15 ? "strong" : calc.pct > 5 ? "solid" : "small";
  const toneMeta: Record<string, { label: string; cls: string; emoji: string }> = {
    strong: { label: "The gap is big — you have leverage", cls: "border-emerald-500/40 bg-emerald-500/5", emoji: "🟢" },
    solid: { label: "A fair, defensible ask", cls: "border-amber-500/40 bg-amber-500/5", emoji: "🟡" },
    small: { label: "Modest ask — anchor higher if you can defend it", cls: "border-sky-500/40 bg-sky-500/5", emoji: "🔵" },
  };

  const standingLine =
    rating === "top"
      ? "I've owned the two hardest workstreams this year and helped unblock others"
      : rating === "strong"
        ? "I've owned key deliverables end-to-end and supported teammates"
        : "I've run my area reliably and I want to grow into more";

  const script = [
    `I've been with the team for ${tenureMonths} months. In that time, ${standingLine}.`,
    `I know what this role pays: ${fmt(marketP50)} at median, up to ${fmt(marketP75)} for the level above mine. I'm at ${fmt(current)}.`,
    calc.realCut > 5
      ? `After inflation that's a ${calc.realCut.toFixed(0)}% real-terms cut since I joined — I'd much rather solve that here than by interviewing.`
      : `My pay has stayed flat against inflation — I'd much rather solve that here than by interviewing.`,
    `Based on that, I'm looking at ${fmt(calc.ask)}. Happy to walk through the data if useful.`,
    calc.pct > 15
      ? `If a full correction isn't possible this cycle, let's agree a dated plan: what I deliver by which month, reviewed against which number.`
      : `What would it take to close the gap this cycle — and if not fully, what dated milestones would get me there?`,
  ];

  return (
    <AppShell title="Raise Negotiator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">💼 Raise Negotiator</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          You never get the raise you deserve — you get the raise you can <em>argue</em> for. Enter your pay,
          market benchmarks and standing. The tool runs the numbers an employer runs: what inflation has
          quietly taken, the cost of replacing you, and the band you should anchor at — then writes the
          conversation for you. Everything stays on your device.
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your situation</p>
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
            <NumberField label="Current salary / year" value={current} onChange={setCurrent} step={step} min={0} />
            <NumberField label="Market median (P50)" value={marketP50} onChange={setMarketP50} step={step} min={0} />
            <NumberField label="Market P75 (top of your level)" value={marketP75} onChange={setMarketP75} step={step} min={0} />
            <NumberField label="Months in this role" value={tenureMonths} onChange={setTenureMonths} step={1} min={1} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">Your standing this year</label>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              {(["top", "strong", "meets"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRating(r)}
                  className={`rounded-xl border px-2 py-2 font-semibold ${rating === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                >
                  {r === "top" ? "🏆 Top" : r === "strong" ? "💪 Strong" : "😐 Meets"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${toneMeta[tone]!.cls}`}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {toneMeta[tone]!.emoji} {toneMeta[tone]!.label}
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            Inflation has quietly eroded your {fmt(current)} to a real value of{" "}
            <b>{fmt(calc.realValue)}</b> — {calc.realCut > 1 ? <>that's a <b>{calc.realCut.toFixed(0)}% pay cut you never agreed to</b>. </> : "pay has stayed flat in real terms. "}The gap
            to a defensible ask ({fmt(calc.ask)}) is {fmt(calc.gap)} ({calc.pct.toFixed(0)}%). Waiting one more
            review cycle burns roughly <b>{fmt(calc.waitCost)}</b> — less than the {fmt(calc.replacementCost)} it
            would cost your employer to replace you. That difference is your leverage.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Ask anchor" value={fmt(calc.ask)} />
          <Stat label="Gap vs today" value={`${calc.pct.toFixed(0)}%`} />
          <Stat label="Real-terms cut" value={`${calc.realCut.toFixed(0)}%`} />
          <Stat label="Cost to replace you" value={fmt(calc.replacementCost)} />
        </div>

        <details className="rounded-2xl border border-border bg-surface p-4" open>
          <summary className="cursor-pointer text-sm font-bold text-foreground">
            🎙️ Your 5-beat script for the conversation
          </summary>
          <div className="mt-3 space-y-2">
            {script.map((line, i) => (
              <p key={i} className="rounded-xl border border-border bg-background p-3 text-sm leading-relaxed text-foreground">
                <span className="mr-1 text-xs font-bold text-primary">{i + 1}.</span>
                {line}
                <CopyButton text={line} />
              </p>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Deliver beats 1–2, then pause. Most managers reveal their band by beat 3. Never name the first
            number if you can avoid it — and if you must, anchor at {fmt(calc.ask)}, not what you'd accept.
          </p>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-base font-bold text-foreground">{value}</p>
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
