import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/health-tracker")({ component: HealthTracker });

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  notes: string;
}

const STORAGE_KEY = "slashai-health-log";
const SETTINGS_KEY = "slashai-health-settings";

export default function HealthTracker() {
  const [entries, setEntries] = useState<WeightEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"); } catch { return {}; }
  });

  const [height, setHeight] = useState(settings.height || 170);
  const [unit, setUnit] = useState<"kg" | "lbs">(settings.unit || "kg");
  const [goalWeight, setGoalWeight] = useState(settings.goalWeight || 70);
  const [todayWeight, setTodayWeight] = useState("");
  const [todayNotes, setTodayNotes] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [period, setPeriod] = useState<"1w" | "1m" | "3m" | "all">("all");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ height, unit, goalWeight }));
  }, [height, unit, goalWeight]);

  const toKg = (w: number) => unit === "lbs" ? w * 0.453592 : w;
  const fromKg = (w: number) => unit === "lbs" ? w * 2.20462 : w;
  const unitLabel = unit === "lbs" ? "lbs" : "kg";

  const addEntry = () => {
    const w = parseFloat(todayWeight);
    if (!w) return;
    setEntries((prev) => [
      { id: Date.now().toString(), date: new Date().toISOString().split("T")[0] ?? new Date().toLocaleDateString(), weight: toKg(w), notes: todayNotes },
      ...prev,
    ]);
    setTodayWeight("");
    setTodayNotes("");
  };

  const deleteEntry = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const filtered = sorted.filter((e) => {
    if (period === "all") return true;
    const d = new Date(e.date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= (period === "1w" ? 7 : period === "1m" ? 30 : 90);
  });

  const lastEntry = filtered.length > 0 ? filtered[filtered.length - 1] : undefined;
  const firstEntry = filtered.length > 0 ? filtered[0] : undefined;
  const currentW = lastEntry?.weight ?? 0;
  const startW = firstEntry?.weight ?? 0;
  const bmi = currentW > 0 ? (currentW / ((height / 100) ** 2)).toFixed(1) : "—";
  const lost = filtered.length >= 2 && firstEntry ? (firstEntry.weight - currentW) : 0;

  // Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || filtered.length < 2) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width = canvas.offsetWidth * 2;
    const H = canvas.height = 300;
    ctx.scale(2, 2);
    const w = W / 2;
    const h = H / 2;

    ctx.clearRect(0, 0, w, h);

    const weights = filtered.map((e) => fromKg(e.weight));
    const minW = Math.min(...weights, goalWeight) - 2;
    const maxW = Math.max(...weights, goalWeight) + 2;
    const pad = { t: 20, r: 20, b: 30, l: 50 };
    const cw = w - pad.l - pad.r;
    const ch = h - pad.t - pad.b;

    // Grid
    ctx.strokeStyle = "#21262d";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = pad.t + (ch / 5) * i;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(w - pad.r, y);
      ctx.stroke();
      const val = maxW - ((maxW - minW) / 5) * i;
      ctx.fillStyle = "#8b949e";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(val.toFixed(1), pad.l - 8, y + 4);
    }

    // Goal line
    const goalY = pad.t + ch * (1 - (goalWeight - minW) / (maxW - minW));
    ctx.strokeStyle = "#3fb95060";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pad.l, goalY);
    ctx.lineTo(w - pad.r, goalY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#3fb950";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Goal: ${goalWeight.toFixed(0)}${unitLabel}`, w - pad.r - 80, goalY - 5);

    // Line
    ctx.strokeStyle = "#58a6ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    filtered.forEach((e, i) => {
      const x = pad.l + (cw / (filtered.length - 1)) * i;
      const y = pad.t + ch * (1 - (fromKg(e.weight) - minW) / (maxW - minW));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Points
    filtered.forEach((e, i) => {
      const x = pad.l + (cw / (filtered.length - 1)) * i;
      const y = pad.t + ch * (1 - (fromKg(e.weight) - minW) / (maxW - minW));
      ctx.fillStyle = "#58a6ff";
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [filtered, goalWeight, unitLabel, fromKg]);

  const bmiColor = bmi === "—" ? "#8b949e" : Number(bmi) < 18.5 ? "#d29922" : Number(bmi) < 25 ? "#3fb950" : Number(bmi) < 30 ? "#d29922" : "#f85149";

  const exportCsv = () => {
    const header = "Date,Weight,Notes\n";
    const rows = sorted.map((e) => `${e.date},${fromKg(e.weight).toFixed(1)},${e.notes}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "health-log.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">💪 Health Tracker</h1>
            <p className="text-sm text-muted-foreground">Track weight, BMI and health over time</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCsv} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">📊 Export</button>
            <button onClick={() => setShowSettings(!showSettings)} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">⚙️ Settings</button>
          </div>
        </div>

        {/* Settings */}
        {showSettings && (
          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Settings</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Height (cm)</label>
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Unit</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value as "kg" | "lbs")} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                  <option value="kg">Kilograms</option>
                  <option value="lbs">Pounds</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Goal Weight ({unitLabel})</label>
                <input type="number" value={goalWeight} onChange={(e) => setGoalWeight(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
              </div>
            </div>
          </div>
        )}

        {/* Quick log */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Log Today</h3>
          <div className="flex gap-2">
            <input type="number" value={todayWeight} onChange={(e) => setTodayWeight(e.target.value)} placeholder={`Weight (${unitLabel})`} className="w-28 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
            <input value={todayNotes} onChange={(e) => setTodayNotes(e.target.value)} placeholder="Notes (optional)" className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
            <button onClick={addEntry} disabled={!todayWeight} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">Log</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: "Starting", value: filtered.length ? `${fromKg(startW).toFixed(1)}${unitLabel}` : "—" },
            { label: "Current", value: filtered.length ? `${fromKg(currentW).toFixed(1)}${unitLabel}` : "—" },
            { label: "Goal", value: `${goalWeight}${unitLabel}` },
            { label: "Change", value: filtered.length >= 2 ? `${lost >= 0 ? "+" : ""}${fromKg(lost).toFixed(1)}${unitLabel}` : "—" },
            { label: "BMI", value: bmi, color: bmiColor },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-3 text-center">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-lg font-bold" style={{ color: s.color || "#f0f6fc" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Period */}
        <div className="flex gap-2">
          {(["1w", "1m", "3m", "all"] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${period === p ? "bg-primary text-background" : "bg-surface text-muted-foreground border border-border"}`}>
              {p === "all" ? "All" : p.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Chart */}
        {filtered.length >= 2 && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <canvas ref={canvasRef} className="w-full" style={{ height: 150 }} />
          </div>
        )}

        {/* History */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">History ({entries.length} entries)</h3>
          {sorted.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No entries yet. Log your first weight above!</p>
          ) : (
            <div className="max-h-60 space-y-1 overflow-y-auto">
              {sorted.map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-sm">
                  <span className="text-muted-foreground">{e.date}</span>
                  <span className="font-medium text-foreground">{fromKg(e.weight).toFixed(1)} {unitLabel}</span>
                  {e.notes && <span className="text-xs text-muted-foreground/60">{e.notes}</span>}
                  <button onClick={() => deleteEntry(e.id)} className="text-red-400 hover:text-red-300">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
