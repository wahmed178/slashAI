import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/whitespace")({ component: WhitespaceRemover });

function WhitespaceRemover() {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState({ doubleSpaces: true, trailingSpaces: true, leadingSpaces: true, tabs: true, lineBreaks: false, emptyLines: false });

  const process = (text: string): string => {
    let result = text;
    if (options.trailingSpaces) result = result.replace(/[ \t]+$/gm, "");
    if (options.leadingSpaces) result = result.replace(/^[ \t]+/gm, "");
    if (options.doubleSpaces) result = result.replace(/ {2,}/g, " ");
    if (options.tabs) result = result.replace(/\t/g, " ");
    if (options.lineBreaks) result = result.replace(/\n/g, " ");
    if (options.emptyLines) result = result.replace(/\n\s*\n/g, "\n");
    return result;
  };

  const output = process(input);
  const savedChars = input.length - output.length;

  const copy = async () => { try { await navigator.clipboard.writeText(output); } catch {} };

  return (
    <AppShell title="Whitespace Remover">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🧹 Whitespace Remover</h1>
        <p className="mt-1 text-sm text-muted-foreground">Clean text: remove extra spaces, tabs, line breaks, and trailing whitespace.</p>
      </header>
      <div className="mx-auto max-w-2xl space-y-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste messy text here..."
          className="h-32 w-full rounded-xl border border-border bg-surface p-4 text-sm focus:outline-none focus:border-primary/50 resize-none" />
        <div className="grid grid-cols-2 gap-2">
          {([
            ["doubleSpaces", "Remove double spaces"],
            ["trailingSpaces", "Remove trailing spaces"],
            ["leadingSpaces", "Remove leading spaces"],
            ["tabs", "Replace tabs with spaces"],
            ["lineBreaks", "Remove line breaks"],
            ["emptyLines", "Remove empty lines"],
          ] as [string, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-lg border border-border bg-surface p-2.5 text-xs text-foreground cursor-pointer hover:bg-surface-elevated">
              <input type="checkbox" checked={(options as any)[key]} onChange={(e) => setOptions({ ...options, [key]: e.target.checked })} className="accent-primary" />
              {label}
            </label>
          ))}
        </div>
        {savedChars > 0 && <p className="text-xs text-green text-center">Saved {savedChars} characters ({Math.round(savedChars / input.length * 100)}%)</p>}
        <div className="flex gap-2">
          <button onClick={copy} disabled={!output} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">Copy Cleaned Text</button>
          <button onClick={() => { navigator.clipboard.writeText(output); }} className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground">Count: {output.length}</button>
        </div>
        {output && <pre className="max-h-48 overflow-auto rounded-xl border border-border bg-surface p-4 text-sm text-foreground whitespace-pre-wrap">{output}</pre>}
      </div>
    </AppShell>
  );
}
