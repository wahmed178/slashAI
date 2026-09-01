import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/roman-numeral")({ component: RomanNumeralConverter });

const ROMAN: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(num: number): string {
  if (num <= 0 || num > 3999) return "Out of range (1-3999)";
  let result = "";
  for (const [value, symbol] of ROMAN) {
    while (num >= value) { result += symbol; num -= value; }
  }
  return result;
}

function fromRoman(str: string): number | string {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    const curr = map[str[i] ?? ""] ?? 0;
    const next = map[str[i + 1] ?? ""] ?? 0;
    if (!curr) return "Invalid Roman numeral";
    if (next > 0 && curr < next) { result += next - curr; i++; }
    else result += curr;
  }
  return result;
}

function RomanNumeralConverter() {
  const [number, setNumber] = useState("1994");
  const [roman, setRoman] = useState("MCMXCIV");

  return (
    <AppShell title="Roman Numeral Converter">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🏛️ Roman Numeral Converter</h1>
        <p className="mt-1 text-sm text-muted-foreground">Convert between numbers and Roman numerals (1-3999).</p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <label className="text-xs text-muted-foreground mb-1 block">Number → Roman</label>
          <div className="flex gap-2">
            <input value={number} onChange={(e) => { setNumber(e.target.value); const n = parseInt(e.target.value); if (n) setRoman(toRoman(n)); }} className="flex-1 h-10 rounded-lg border border-border bg-surface-elevated px-3 text-sm" />
            <div className="flex-1 h-10 rounded-lg border border-primary/30 bg-primary/5 px-3 flex items-center text-sm font-bold text-primary">{roman}</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <label className="text-xs text-muted-foreground mb-1 block">Roman → Number</label>
          <input value={roman} onChange={(e) => { setRoman(e.target.value.toUpperCase()); const n = fromRoman(e.target.value.toUpperCase()); setNumber(typeof n === "number" ? n.toString() : ""); }} className="w-full h-10 rounded-lg border border-border bg-surface-elevated px-3 text-sm font-mono" />
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Quick Reference</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[["I", "1"], ["V", "5"], ["X", "10"], ["L", "50"], ["C", "100"], ["D", "500"], ["M", "1000"]].map(([r, n]) => (
              <div key={r} className="flex justify-between rounded bg-surface-elevated px-2 py-1"><span className="font-mono text-primary">{r}</span><span className="text-muted-foreground">{n}</span></div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
