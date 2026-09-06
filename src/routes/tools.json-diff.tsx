import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/json-diff")({ component: JsonDiff });

type DiffRow = { key: string; left: string; right: string; status: "same" | "changed" | "only-left" | "only-right" };

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(out, flatten(v as Record<string, unknown>, path));
    else out[path] = JSON.stringify(v);
  }
  return out;
}

function JsonDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [rows, setRows] = useState<DiffRow[] | null>(null);
  const [error, setError] = useState("");

  const compare = () => {
    setError("");
    try {
      const l = flatten(JSON.parse(left || "{}"));
      const r = flatten(JSON.parse(right || "{}"));
      const keys = [...new Set([...Object.keys(l), ...Object.keys(r)])].sort();
      const out: DiffRow[] = keys.map((key) => {
        const lv = l[key] ?? "";
        const rv = r[key] ?? "";
        if (!(key in r)) return { key, left: lv, right: "", status: "only-left" };
        if (!(key in l)) return { key, left: "", right: rv, status: "only-right" };
        return { key, left: lv, right: rv, status: lv === rv ? "same" : "changed" };
      });
      setRows(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setRows(null);
    }
  };

  const color = (s: DiffRow["status"]) =>
    s === "same" ? "text-muted-foreground" : s === "changed" ? "text-yellow" : s === "only-left" ? "text-red" : "text-primary";

  return (
    <AppShell title="JSON Diff">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔍 JSON Diff</h1>
        <p className="mt-1 text-sm text-muted-foreground">Compare two JSON objects key by key. Everything stays in your browser.</p>
      </header>
      <div className="mx-auto max-w-3xl space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <textarea value={left} onChange={(e) => setLeft(e.target.value)} placeholder='JSON A - {"name":"Ada"}' rows={8} className="w-full rounded-xl border border-border bg-surface p-3 font-mono text-[12.5px]" />
          <textarea value={right} onChange={(e) => setRight(e.target.value)} placeholder='JSON B - {"name":"Grace"}' rows={8} className="w-full rounded-xl border border-border bg-surface p-3 font-mono text-[12.5px]" />
        </div>
        {error && <p className="text-sm text-red">{error}</p>}
        <button type="button" onClick={compare} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90">
          Compare
        </button>
        {rows && (
          <div className="overflow-hidden rounded-xl border border-border">
            {rows.map((row) => (
              <div key={row.key} className="flex flex-col gap-0.5 border-b border-border bg-surface px-3 py-2 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-3">
                <span className={`w-48 shrink-0 font-mono text-[12px] ${color(row.status)}`}>{row.key}</span>
                <span className="min-w-0 flex-1 break-all font-mono text-[11.5px] text-muted-foreground">{row.left}</span>
                <span className="min-w-0 flex-1 break-all font-mono text-[11.5px] text-muted-foreground">{row.right}</span>
                <span className="shrink-0 text-[10.5px] uppercase tracking-wide text-muted-foreground">{row.status === "same" ? "same" : row.status === "changed" ? "changed" : row.status === "only-left" ? "only in A" : "only in B"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
