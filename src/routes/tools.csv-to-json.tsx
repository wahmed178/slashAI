import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Copy, Download, Check, ArrowRightLeft } from "lucide-react";

const EXAMPLE_CSV = `name,age,city
Alice,28,Hyderabad
Bob,35,Delhi
Charlie,22,Bangalore`;

export const Route = createFileRoute("/tools/csv-to-json")({
  head: () => ({ meta: [{ title: "CSV to JSON \u2014 SlashAI" }] }),
  component: CsvToJson,
});

function csvToJson(csv: string, hasHeader: boolean): unknown[] {
  const lines = csv.trim().split("\n").map((l) => l.split(",").map((c) => c.trim()));
  if (!lines.length) return [];
  if (hasHeader) {
    const headers = lines[0]!;
    return lines.slice(1).map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = row[i] ?? ""; });
      return obj;
    });
  }
  return lines.map((row) => row);
}

function jsonToCsv(json: unknown[]): string {
  if (!Array.isArray(json) || !json.length) return "";
  if (typeof json[0] !== "object" || json[0] === null) return json.join("\n");
  const headers = Object.keys(json[0] as Record<string, unknown>);
  const rows = json.map((row) => headers.map((h) => String((row as Record<string, unknown>)[h] ?? "")).join(","));
  return [headers.join(","), ...rows].join("\n");
}

function CsvToJson() {
  const [mode, setMode] = useState<"csv-to-json" | "json-to-csv">("csv-to-json");
  const [input, setInput] = useState(EXAMPLE_CSV);
  const [hasHeader, setHasHeader] = useState(true);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    try {
      if (mode === "csv-to-json") {
        const result = csvToJson(input, hasHeader);
        return JSON.stringify(result, null, 2);
      } else {
        const parsed = JSON.parse(input);
        return jsonToCsv(Array.isArray(parsed) ? parsed : [parsed]);
      }
    } catch { return "Invalid input"; }
  }, [input, mode, hasHeader]);

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const download = () => {
    const ext = mode === "csv-to-json" ? "json" : "csv";
    const blob = new Blob([output], { type: ext === "json" ? "application/json" : "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `export.${ext}`;
    a.click();
  };

  return (
    <AppShell title="CSV \u2194 JSON" back={{ to: "/tools", label: "Tools" }}>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => setMode("csv-to-json")}
          className="min-h-[40px] flex-1 rounded-lg border px-3 text-sm font-medium transition-colors"
          style={{ background: mode === "csv-to-json" ? "#58a6ff" : "#21262d", borderColor: mode === "csv-to-json" ? "transparent" : "#30363d", color: mode === "csv-to-json" ? "#0d1117" : "#8b949e" }}>
          CSV \u2192 JSON
        </button>
        <button type="button" onClick={() => setMode("json-to-csv")}
          className="min-h-[40px] flex-1 rounded-lg border px-3 text-sm font-medium transition-colors"
          style={{ background: mode === "json-to-csv" ? "#58a6ff" : "#21262d", borderColor: mode === "json-to-csv" ? "transparent" : "#30363d", color: mode === "json-to-csv" ? "#0d1117" : "#8b949e" }}>
          JSON \u2192 CSV
        </button>
      </div>
      {mode === "csv-to-json" && (
        <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="accent-[#58a6ff]" />
          First row is header
        </label>
      )}
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-[11px] text-muted-foreground">Input</p>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            className="min-h-[300px] w-full resize-y rounded-xl border border-border bg-surface p-4 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
            placeholder={mode === "csv-to-json" ? "Paste CSV here\u2026" : "Paste JSON here\u2026"} />
        </div>
        <div>
          <p className="mb-1 text-[11px] text-muted-foreground">Output</p>
          <pre className="min-h-[300px] overflow-auto rounded-xl border border-border bg-surface p-4 font-mono text-sm text-foreground">{output}</pre>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={copy} className="flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground hover:text-primary">
          {copied ? <Check className="size-4 text-green" /> : <Copy className="size-4" />} {copied ? "Copied!" : "Copy"}
        </button>
        <button type="button" onClick={download} className="flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Download className="size-4" /> Download
        </button>
      </div>
    </AppShell>
  );
}
