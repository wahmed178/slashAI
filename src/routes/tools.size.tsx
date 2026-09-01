import { useState, useMemo, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/size")({
  component: FileSizeCalculator,
});

const UNITS = ["Bytes", "KB", "MB", "GB", "TB", "PB"] as const;
const SPEEDS = [
  { label: "2G (50 Kbps)", mbps: 0.05 },
  { label: "3G (1 Mbps)", mbps: 1 },
  { label: "4G (25 Mbps)", mbps: 25 },
  { label: "5G (200 Mbps)", mbps: 200 },
  { label: "WiFi (50 Mbps)", mbps: 50 },
  { label: "Fiber (500 Mbps)", mbps: 500 },
];
const DEVICES = [
  { label: "16 GB Phone", gb: 16 },
  { label: "128 GB Phone", gb: 128 },
  { label: "1 TB Drive", gb: 1024 },
];
const COMPARISONS = [
  { label: "Text page", bytes: 2000 },
  { label: "MP3 song (3 min)", bytes: 4_000_000 },
  { label: "HD photo", bytes: 5_000_000 },
  { label: "4K photo", bytes: 15_000_000 },
  { label: "HD movie (720p)", bytes: 1_500_000_000 },
  { label: "4K movie", bytes: 15_000_000_000 },
  { label: "AAA game", bytes: 50_000_000_000 },
];

function toBytes(value: number, unit: string): number {
  const i = UNITS.indexOf(unit as typeof UNITS[number]);
  return value * Math.pow(1024, i);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2)} ${UNITS[i]}`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
}

function FileSizeCalculator() {
  const [value, setValue] = useState(1);
  const [unit, setUnit] = useState("MB");
  const bytes = useMemo(() => toBytes(value, unit), [value, unit]);

  return (
    <AppShell title="File Size Calculator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📐 File Size Calculator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Convert between units, see download times, and real-world comparisons.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        {/* Input */}
        <div className="flex gap-2">
          <input type="number" min={0} step={0.1} value={value} onChange={(e) => setValue(Number(e.target.value))}
            className="flex-1 h-11 rounded-xl border border-border bg-surface px-4 text-lg font-semibold focus:outline-none focus:border-primary/50" />
          <select value={unit} onChange={(e) => setUnit(e.target.value)}
            className="h-11 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary/50">
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        {/* All conversions */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">All Units</p>
          <div className="grid grid-cols-3 gap-2">
            {UNITS.map((u) => {
              const converted = bytes / Math.pow(1024, UNITS.indexOf(u));
              return (
                <div key={u} className={`rounded-lg p-2 text-center ${u === unit ? "bg-primary/10 border border-primary/30" : "bg-surface-elevated"}`}>
                  <p className="text-sm font-bold text-foreground">{converted < 0.001 && u !== "Bytes" ? "0" : converted.toFixed(converted >= 100 ? 0 : 2)}</p>
                  <p className="text-[10px] text-muted-foreground">{u}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Download times */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Download Time</p>
          <div className="space-y-1.5">
            {SPEEDS.map((s) => {
              const seconds = (bytes * 8) / (s.mbps * 1_000_000);
              return (
                <div key={s.label} className="flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="text-xs font-medium text-foreground">{isFinite(seconds) ? formatDuration(seconds) : "∞"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* How many fit on devices */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">How Many Fit on a Device</p>
          <div className="space-y-1.5">
            {DEVICES.map((d) => {
              const count = bytes > 0 ? Math.floor((d.gb * 1024 * 1024 * 1024) / bytes) : 0;
              return (
                <div key={d.label} className="flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5">
                  <span className="text-xs text-muted-foreground">{d.label}</span>
                  <span className="text-xs font-medium text-foreground">{count.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-world comparisons */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Real-World Comparison</p>
          <div className="space-y-1.5">
            {COMPARISONS.map((c) => {
              const count = bytes > 0 ? (bytes / c.bytes).toFixed(1) : "0";
              return (
                <div key={c.label} className="flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5">
                  <span className="text-xs text-muted-foreground">{c.label}</span>
                  <span className="text-xs font-medium text-foreground">≈ {count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
