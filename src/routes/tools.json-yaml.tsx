import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/json-yaml")({ component: JsonYaml });

function parseYaml(yaml: string): unknown {
  // Minimal indentation-based YAML subset parser (maps, lists, scalars).
  const lines: string[] = yaml.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));
  let i = 0;

  const parseBlock = (indent: number): unknown => {
    if (i >= lines.length || lines[i] === undefined) return null;
    const firstLine: string = lines[i]!;
    const firstIndent = firstLine.length - firstLine.trimStart().length;
    if (firstIndent < indent) return null;
    if (firstLine.trimStart().startsWith("- ")) {
      const arr: unknown[] = [];
      while (i < lines.length) {
        const line: string | undefined = lines[i];
        if (line === undefined) break;
        const ind = line.length - line.trimStart().length;
        if (ind !== indent || !line.trimStart().startsWith("- ")) break;
        arr.push(line.trimStart().slice(2).trim());
        i++;
      }
      return arr;
    }
    const obj: Record<string, unknown> = {};
    while (i < lines.length) {
      const line: string | undefined = lines[i];
      if (line === undefined) break;
      const ind = line.length - line.trimStart().length;
      if (ind !== indent || line.trimStart().startsWith("- ")) break;
      const idx = line.indexOf(":");
      if (idx === -1) break;
      const key = line.slice(0, idx).trim();
      const raw = line.slice(idx + 1).trim();
      i++;
      if (raw === "") {
        obj[key] = parseBlock(indent + 2);
      } else {
        obj[key] = raw === "null" ? null : raw === "true" ? true : raw === "false" ? false : isNaN(Number(raw)) ? raw.replace(/^["']|["']$/g, "") : Number(raw);
      }
    }
    return obj;
  };

  return parseBlock(0);
}

function toYaml(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (value === null) return "null";
  if (typeof value !== "object") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return value.map((v) => `\n${pad}- ${toYaml(v, indent + 1).trimStart()}`).join("").trimStart();
  }
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return "{}";
  return entries
    .map(([k, v]) => {
      if (v && typeof v === "object") return `${pad}${k}:${toYaml(v, indent + 1).startsWith("\n") ? toYaml(v, indent + 1) : `\n${toYaml(v, indent + 1)}`}`;
      return `${pad}${k}: ${toYaml(v)}`;
    })
    .join("\n");
}

function JsonYaml() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const jsonToYaml = () => {
    setError("");
    try {
      setOutput(toYaml(JSON.parse(input)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const yamlToJson = () => {
    setError("");
    try {
      setOutput(JSON.stringify(parseYaml(input), null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid YAML");
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(output); } catch { /* ignore */ }
  };

  return (
    <AppShell title="JSON-YAML Converter">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔁 JSON-YAML Converter</h1>
        <p className="mt-1 text-sm text-muted-foreground">Convert between JSON and YAML without leaving your browser.</p>
      </header>
      <div className="mx-auto max-w-3xl space-y-3">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Paste JSON or YAML here...' rows={10} className="w-full rounded-xl border border-border bg-surface p-3 font-mono text-[12.5px]" />
        <div className="flex gap-2">
          <button type="button" onClick={jsonToYaml} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90">
            JSON to YAML
          </button>
          <button type="button" onClick={yamlToJson} className="flex-1 rounded-xl border border-border bg-surface py-3 text-sm font-semibold hover:text-primary">
            YAML to JSON
          </button>
        </div>
        {error && <p className="text-sm text-red">{error}</p>}
        {output && (
          <div className="rounded-xl border border-border bg-surface p-3">
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap font-mono text-[12.5px] text-primary">{output}</pre>
            <button type="button" onClick={copy} className="mt-2 min-h-[32px] rounded-md border border-border px-3 text-[12.5px] font-medium hover:text-primary">
              Copy
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
