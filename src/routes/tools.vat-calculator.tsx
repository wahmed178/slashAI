import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/vat-calculator")({
  head: () => ({
    meta: [
      { title: "VAT / Sales Tax Calculator - Free Browser Tool | SlashAI" },
      {
        name: "description",
        content:
          "Add or remove VAT / sales tax at any rate. Instant gross, net and tax breakdown with common VAT presets. Free, no upload, works offline.",
      },
    ],
  }),
  component: VatTool,
});

const fmt = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function VatTool() {
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [rate, setRate] = useState(20);
  const [amount, setAmount] = useState("100");

  const parsed = Number(amount) || 0;

  const calc = useMemo(() => {
    const r = rate / 100;
    if (mode === "add") {
      const net = parsed;
      const tax = net * r;
      return { net, tax, gross: net + tax };
    }
    const gross = parsed;
    const tax = gross - gross / (1 + r);
    return { net: gross / (1 + r), tax, gross };
  }, [mode, parsed, rate]);

  return (
    <AppShell title="VAT Calculator">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🧾 VAT / Sales Tax Calculator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add VAT to a net price, or take it back out of a gross price — any rate, instant results.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <div className="flex rounded-xl border border-border bg-surface p-1">
          {(
            [
              ["add", "Add VAT"],
              ["remove", "Remove VAT"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`h-9 flex-1 rounded-lg text-[12.5px] font-bold transition-colors ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <label className="block text-[12px] font-semibold text-muted-foreground">
            {mode === "add" ? "Net amount (excl. VAT)" : "Gross amount (incl. VAT)"}
          </label>
          <input
            type="number"
            min={0}
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
          />

          <label className="mt-3 block text-[12px] font-semibold text-muted-foreground">VAT rate</label>
          <input
            type="number"
            min={0}
            max={100}
            step="any"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
            className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              [20, "UK 20%"],
              [19, "Germany 19%"],
              [18, "India GST 18%"],
              [10, "Australia 10%"],
              [5, "UAE 5%"],
              [0, "Zero 0%"],
            ].map(([v, label]) => (
              <button
                key={label}
                type="button"
                onClick={() => setRate(v as number)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  rate === v ? "bg-primary text-primary-foreground" : "bg-surface-elevated text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { v: fmt(mode === "add" ? calc.net : calc.net), l: "Net", hi: mode === "remove" },
            { v: fmt(calc.tax), l: `VAT ${rate}%`, hi: false },
            { v: fmt(calc.gross), l: "Gross", hi: mode === "add" },
          ].map((s) => (
            <div
              key={s.l}
              className={`rounded-2xl border p-4 text-center ${
                s.hi ? "border-primary/50 bg-primary/8" : "border-border bg-surface"
              }`}
            >
              <p className="text-[15px] font-black tabular-nums text-foreground">{s.v}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {s.l}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-[11.5px] leading-relaxed text-muted-foreground">
          {mode === "add"
            ? `${fmt(parsed)} + ${rate}% VAT = ${fmt(calc.gross)} gross`
            : `${fmt(parsed)} gross includes ${fmt(calc.tax)} VAT — net ${fmt(calc.net)}`}
        </p>
      </div>
    </AppShell>
  );
}
