import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/text-case")({ component: TextCaseConverter });

const CASES = [
  { label: "UPPER CASE", fn: (s: string) => s.toUpperCase() },
  { label: "lower case", fn: (s: string) => s.toLowerCase() },
  { label: "Title Case", fn: (s: string) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { label: "Sentence case", fn: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()) },
  { label: "camelCase", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { label: "PascalCase", fn: (s: string) => s.toLowerCase().replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, c) => c.toUpperCase()) },
  { label: "snake_case", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") },
  { label: "kebab-case", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") },
  { label: "CONSTANT_CASE", fn: (s: string) => s.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "") },
  { label: "dot.case", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+/g, ".").replace(/^\.|\.$/g, "") },
  { label: "path/case", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "/").replace(/^\/|\/$/g, "") },
  { label: "reverse", fn: (s: string) => s.split("").reverse().join("") },
];

function TextCaseConverter() {
  const [input, setInput] = useState("hello world example text");
  const [copied, setCopied] = useState("");

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1200);
  };

  return (
    <AppShell title="Text Case Converter">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔄 Text Case Converter</h1>
        <p className="mt-1 text-sm text-muted-foreground">Convert text between 12 different cases instantly.</p>
      </header>
      <div className="mx-auto max-w-2xl space-y-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or paste text..."
          className="h-24 w-full rounded-xl border border-border bg-surface p-4 text-sm focus:outline-none focus:border-primary/50 resize-none" />
        <div className="space-y-2">
          {CASES.map((c) => {
            const result = c.fn(input);
            return (
              <div key={c.label} className="flex items-center gap-2 rounded-xl border border-border bg-surface p-3">
                <span className="shrink-0 w-28 text-[11px] font-medium text-muted-foreground">{c.label}</span>
                <span className="flex-1 text-sm text-foreground font-mono truncate">{result}</span>
                <button onClick={() => copy(result, c.label)} className="shrink-0 text-[11px] text-primary hover:underline">{copied === c.label ? "✓" : "Copy"}</button>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
