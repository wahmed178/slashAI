import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/percentage")({
  head: () => ({ meta: [{ title: "Percentage Calculator - SlashAI" }] }),
  component: PercentageCalc,
});

function PercentageCalc() {
  const [mode, setMode] = useState(0);
  const [a, setA] = useState(25);
  const [b, setB] = useState(200);

  const result = (() => {
    if (mode === 0) return (a / 100) * b;
    if (mode === 1) return b !== 0 ? (a / b) * 100 : 0;
    return b !== 0 ? ((b - a) / a) * 100 : 0;
  })();

  const labels = ["What is X% of Y?", "X is what % of Y?", "% change from X to Y"];

  /** one-line human explanation of the current calculation */
  const working = (() => {
    if (mode === 0) return `${a} ÷ 100 = ${a / 100} → ${a / 100} × ${b} = ${(a / 100) * b}`;
    if (mode === 1)
      return `${a} ÷ ${b} = ${b !== 0 ? (a / b).toFixed(4) : "—"} → × 100 = ${result.toFixed(2)}%`;
    return `(${b} − ${a}) ÷ ${a} = ${a !== 0 ? (((b - a) / a) * 100).toFixed(4) : "—"}%`;
  })();

  const gst = Math.round(((a / 100) * b + Number.EPSILON) * 100) / 100;

  return (
    <AppShell
      title="Percentage Calculator"
      back={{ to: "/tools", label: "SlashKits" }}
      srH1="Percentage Calculator - SlashAI"
    >
      <div className="mt-4 space-y-4">
        <div className="flex gap-1 overflow-x-auto">
          {labels.map((l, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setMode(i)}
              className="min-h-[40px] shrink-0 rounded-lg border px-3 text-xs font-medium transition-colors"
              style={{
                background: mode === i ? "var(--primary)" : "var(--surface-elevated)",
                borderColor: mode === i ? "transparent" : "var(--border)",
                color: mode === i ? "var(--background)" : "var(--muted-foreground)",
              }}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-muted-foreground">
                {mode === 2 ? "From (X)" : mode === 0 ? "X (%)" : "X"}
              </label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">
                {mode === 0 ? "Y" : mode === 1 ? "of Y" : "To (Y)"}
              </label>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <p className="text-3xl font-bold text-primary">
            {mode === 1 ? `${result.toFixed(2)}%` : result.toFixed(2)}
          </p>
          {mode === 2 && (
            <p className="mt-1 text-sm" style={{ color: result >= 0 ? "#3fb950" : "#f85149" }}>
              {result >= 0 ? "▲ Increase" : "▼ Decrease"}
            </p>
          )}
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">{working}</p>
        </div>

        {/* quick real-life presets (mode 0 only) */}
        {mode === 0 && (
          <div className="rounded-xl border border-border bg-surface p-3.5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Quick use
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "18% GST", x: 18 },
                { label: "10% tip", x: 10 },
                { label: "5% GST", x: 5 },
                { label: "50% off", x: 50 },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setA(chip.x)}
                  className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-[11.5px] font-medium text-foreground transition-colors hover:border-primary/50"
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              e.g. {a}% of ₹{b} = ₹{gst} — set Y to the bill amount, X to the rate.
            </p>
          </div>
        )}
      </div>

      <FaqSection />
    </AppShell>
  );
}
