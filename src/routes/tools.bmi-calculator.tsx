import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/bmi-calculator")({
  head: () => ({ meta: [{ title: "BMI Calculator \u2014 SlashAI" }] }),
  component: BmiCalculator,
});

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "#58a6ff", note: "Consider consulting a nutritionist for a balanced diet plan." };
  if (bmi < 25) return { label: "Normal", color: "#3fb950", note: "Great job! Maintain your healthy lifestyle with regular exercise." };
  if (bmi < 30) return { label: "Overweight", color: "#d29922", note: "Light exercise and dietary changes can help bring BMI to normal range." };
  return { label: "Obese", color: "#f85149", note: "Please consult a healthcare professional for personalized guidance." };
}

function BmiCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  const bmi = useMemo(() => {
    if (unit === "metric") {
      return weight / Math.pow(height / 100, 2);
    } else {
      // imperial: weight in lbs, height in inches
      return (weight / Math.pow(height, 2)) * 703;
    }
  }, [weight, height, unit]);

  const cat = getBmiCategory(bmi);
  const barPct = Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100);

  return (
    <AppShell title="BMI Calculator" back={{ to: "/tools", label: "SlashKit" }}>
      <div className="mt-4 space-y-4">
        <div className="flex gap-2">
          {(["metric", "imperial"] as const).map((u) => (
            <button key={u} type="button" onClick={() => setUnit(u)}
              className="min-h-[40px] flex-1 rounded-lg border px-3 text-sm font-medium capitalize transition-colors"
              style={{ background: unit === u ? "#58a6ff" : "#21262d", borderColor: unit === u ? "transparent" : "#30363d", color: unit === u ? "#0d1117" : "#8b949e" }}>
              {u === "metric" ? "Metric (kg/cm)" : "Imperial (lbs/in)"}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <div>
            <label className="text-sm text-foreground">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-sm text-foreground">Height ({unit === "metric" ? "cm" : "inches"})</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <p className="text-4xl font-black" style={{ color: cat.color }}>{bmi.toFixed(1)}</p>
          <p className="mt-1 text-lg font-semibold" style={{ color: cat.color }}>{cat.label}</p>

          {/* BMI bar */}
          <div className="mt-4 h-3 rounded-full bg-surface-elevated relative overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="h-full" style={{ width: "33%", background: "rgba(88,166,255,0.3)" }}></div>
              <div className="h-full" style={{ width: "20%", background: "rgba(63,185,80,0.3)" }}></div>
              <div className="h-full" style={{ width: "17%", background: "rgba(210,153,34,0.3)" }}></div>
              <div className="h-full flex-1" style={{ background: "rgba(248,81,73,0.3)" }}></div>
            </div>
            <div className="absolute top-0 h-full w-0.5 bg-white rounded-full transition-all duration-300" style={{ left: `${barPct}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">{cat.note}</p>
        </div>
        <p className="text-[11px] text-muted-foreground">BMI is a screening tool, not a diagnostic measure.</p>
      </div>
    </AppShell>
  );
}
