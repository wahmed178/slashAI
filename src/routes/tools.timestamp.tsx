import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/timestamp")({ component: TimestampConverter });

function TimestampConverter() {
  const [now, setNow] = useState(Date.now());
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"toHuman" | "toUnix">("toHuman");
  const [result, setResult] = useState("");

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const convert = () => {
    if (mode === "toHuman") {
      const ts = parseInt(input);
      const date = isNaN(ts) ? new Date(input) : ts > 1e12 ? new Date(ts) : new Date(ts * 1000);
      if (isNaN(date.getTime())) { setResult("Invalid input"); return; }
      setResult(JSON.stringify({
        iso: date.toISOString(),
        local: date.toLocaleString(),
        utc: date.toUTCString(),
        unix_seconds: Math.floor(date.getTime() / 1000),
        unix_milliseconds: date.getTime(),
        relative: getRelative(date),
      }, null, 2));
    } else {
      const date = new Date(input);
      if (isNaN(date.getTime())) { setResult("Invalid date"); return; }
      setResult(JSON.stringify({
        unix_seconds: Math.floor(date.getTime() / 1000),
        unix_milliseconds: date.getTime(),
      }, null, 2));
    }
  };

  const getRelative = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const abs = Math.abs(diff);
    const suffix = diff > 0 ? "ago" : "from now";
    if (abs < 60000) return `${Math.floor(abs / 1000)} seconds ${suffix}`;
    if (abs < 3600000) return `${Math.floor(abs / 60000)} minutes ${suffix}`;
    if (abs < 86400000) return `${Math.floor(abs / 3600000)} hours ${suffix}`;
    return `${Math.floor(abs / 86400000)} days ${suffix}`;
  };

  return (
    <AppShell title="Timestamp Converter">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⏱️ Timestamp Converter</h1>
        <p className="mt-1 text-sm text-muted-foreground">Convert between Unix timestamps and human-readable dates.</p>
      </header>
      <div className="mx-auto max-w-lg space-y-4">
        {/* Live clock */}
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-3xl font-mono font-bold text-primary">{Math.floor(now / 1000)}</p>
          <p className="text-xs text-muted-foreground mt-1">Current Unix Timestamp</p>
          <p className="text-sm text-foreground mt-1">{new Date(now).toISOString()}</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setMode("toHuman")} className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${mode === "toHuman" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}>Timestamp → Date</button>
          <button onClick={() => setMode("toUnix")} className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${mode === "toUnix" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`}>Date → Timestamp</button>
        </div>

        <input value={input} onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "toHuman" ? "Enter timestamp (e.g. 1700000000)" : "Enter date (e.g. 2024-01-01 or Jan 1, 2024)"}
          className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary/50" onKeyDown={(e) => e.key === "Enter" && convert()} />

        <button onClick={convert} disabled={!input.trim()} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">Convert</button>

        {result && (
          <pre className="max-h-64 overflow-auto rounded-xl border border-border bg-surface p-4 font-mono text-sm text-foreground whitespace-pre-wrap">{result}</pre>
        )}
      </div>
    </AppShell>
  );
}
