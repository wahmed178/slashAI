import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/json-formatter")({ component: JSONFormatter });

function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError("");
    } catch (e: any) { setError(e.message); }
  };

  const copy = async () => { try { await navigator.clipboard.writeText(output); } catch {} };

  const stats = (() => {
    try {
      const parsed = JSON.parse(input);
      const str = JSON.stringify(parsed);
      const keys = (str.match(/"[^"]+"/g) || []).length;
      const depth = JSON.stringify(parsed).split("").reduce((d: number, c: string) => {
        if (c === "{") return d + 1; if (c === "}") return d - 1; return d;
      }, 0);
      return { keys, depth, valid: true };
    } catch { return { keys: 0, depth: 0, valid: false }; }
  })();

  return (
    <AppShell title="JSON Formatter">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔧 JSON Formatter</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pretty print, minify, and validate JSON instantly.</p>
      </header>
      <div className="mx-auto max-w-4xl space-y-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Paste JSON here... {"key": "value"}'
          className="h-48 w-full rounded-xl border border-border bg-surface p-4 font-mono text-sm focus:outline-none focus:border-primary/50 resize-none" />
        <div className="flex gap-2 items-center">
          <button onClick={format} disabled={!input.trim()} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40">Pretty Print</button>
          <button onClick={minify} disabled={!input.trim()} className="rounded-xl border border-border bg-surface px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40">Minify</button>
          <div className="ml-auto flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Indent</label>
            <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="rounded-lg border border-border bg-surface px-2 py-1 text-xs">
              <option value={2}>2</option><option value={4}>4</option><option value={8}>8</option><option value={"\t"}>Tab</option>
            </select>
          </div>
        </div>
        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">❌ {error}</div>}
        {output && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span>{stats.valid ? "✅ Valid JSON" : "❌ Invalid"}</span>
                <span>{stats.keys} keys</span>
                <span>Depth: {stats.depth}</span>
              </div>
              <button onClick={copy} className="text-xs text-primary hover:underline">Copy</button>
            </div>
            <pre className="max-h-96 overflow-auto rounded-xl border border-border bg-surface p-4 font-mono text-sm text-foreground whitespace-pre-wrap">{output}</pre>
          </>
        )}
      </div>
    </AppShell>
  );
}
