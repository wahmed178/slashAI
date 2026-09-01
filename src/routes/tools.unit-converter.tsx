import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/unit-converter")({ component: UnitConverter });

const CATEGORIES = {
  "Temperature": { units: ["Celsius", "Fahrenheit", "Kelvin"], convert: (v: number, from: string, to: string) => {
    const c = from === "Celsius" ? v : from === "Fahrenheit" ? (v - 32) * 5/9 : v - 273.15;
    return to === "Celsius" ? c : to === "Fahrenheit" ? c * 9/5 + 32 : c + 273.15;
  }},
  "Length": { units: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"], factor: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 } },
  "Weight": { units: ["mg", "g", "kg", "lb", "oz", "ton"], factor: { mg: 0.000001, g: 0.001, kg: 1, lb: 0.453592, oz: 0.0283495, ton: 907.185 } },
  "Area": { units: ["mm²", "cm²", "m²", "km²", "in²", "ft²", "acre", "hectare"], factor: { "mm²": 1e-6, "cm²": 1e-4, "m²": 1, "km²": 1e6, "in²": 0.000645, "ft²": 0.0929, acre: 4046.86, hectare: 10000 } },
  "Volume": { units: ["ml", "L", "gal", "cup", "fl oz", "tbsp", "tsp"], factor: { ml: 0.001, L: 1, gal: 3.78541, cup: 0.236588, "fl oz": 0.0295735, tbsp: 0.0147868, tsp: 0.00492892 } },
  "Speed": { units: ["m/s", "km/h", "mph", "knot", "mach"], factor: { "m/s": 1, "km/h": 0.277778, mph: 0.44704, knot: 0.514444, mach: 343 } },
  "Data": { units: ["B", "KB", "MB", "GB", "TB", "PB"], factor: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624 } },
};

function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof CATEGORIES>("Length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [value, setValue] = useState("1");

  const config = CATEGORIES[category];
  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return "";
    if ("convert" in config && config.convert) return config.convert(v, fromUnit, toUnit).toFixed(4);
    const factors = (config as any).factor;
    const base = v * (factors[fromUnit] || 1);
    return (base / (factors[toUnit] || 1)).toFixed(6);
  }, [value, fromUnit, toUnit, config]);

  const switchUnits = () => { setFromUnit(toUnit); setToUnit(fromUnit); };

  return (
    <AppShell title="Unit Converter">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📐 Unit Converter</h1>
        <p className="mt-1 text-sm text-muted-foreground">Convert between temperature, length, weight, area, volume, speed, and data units.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {Object.keys(CATEGORIES).map((cat) => (
            <button key={cat} onClick={() => { setCategory(cat as keyof typeof CATEGORIES); const units = CATEGORIES[cat as keyof typeof CATEGORIES].units; setFromUnit(units[0] ?? ""); setToUnit(units[1] ?? ""); }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${category === cat ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>{cat}</button>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">From</label>
            <div className="flex gap-2">
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="flex-1 h-11 rounded-lg border border-border bg-surface-elevated px-3 text-lg font-semibold focus:outline-none" />
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="h-11 rounded-lg border border-border bg-surface-elevated px-3 text-sm">
                {config.units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-center">
            <button onClick={switchUnits} className="size-9 rounded-full border border-border bg-surface-elevated flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">⇅</button>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">To</label>
            <div className="flex gap-2">
              <div className="flex-1 h-11 rounded-lg border border-primary/30 bg-primary/5 px-3 flex items-center text-lg font-semibold text-primary">{result}</div>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="h-11 rounded-lg border border-border bg-surface-elevated px-3 text-sm">
                {config.units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
