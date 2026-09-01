import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/table")({ component: TableMaker });

function TableMaker() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [data, setData] = useState<string[][]>([["Name", "Age", "City"], ["Alice", "28", "Mumbai"], ["Bob", "34", "Delhi"]]);
  const [exportFormat, setExportFormat] = useState<"markdown" | "html" | "csv" | "json">("markdown");

  const updateCell = (r: number, c: number, val: string) => {
    const d = data.map(row => [...row]);
    while (d.length <= r) d.push(Array(cols).fill(""));
    while ((d[r] ?? []).length <= c) (d[r] ?? []).push("");
    if (d[r]) d[r]![c] = val;
    setData(d);
  };

  const addRow = () => { setRows(r => r + 1); setData(d => [...d, Array(cols).fill("")]); };
  const addCol = () => { setCols(c => c + 1); setData(d => d.map(row => [...row, ""])); };

  const getExport = () => {
    const header = data[0] ?? [];
    if (exportFormat === "markdown") {
      let md = "| " + header.join(" | ") + " |\n| " + header.map(() => "---").join(" | ") + " |\n";
      data.slice(1).forEach(row => { md += "| " + (row ?? []).join(" | ") + " |\n"; });
      return md;
    }
    if (exportFormat === "csv") return data.map(row => (row ?? []).map(c => `"${(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    if (exportFormat === "json") return JSON.stringify(data.slice(1).map(row => { const obj: Record<string, string> = {}; header.forEach((h, i) => { obj[h] = (row ?? [])[i] || ""; }); return obj; }), null, 2);
    let html = "<table>\n<thead><tr>" + header.map(h => `<th>${h}</th>`).join("") + "</tr></thead>\n<tbody>\n";
    data.slice(1).forEach(row => { html += "<tr>" + (row ?? []).map(c => `<td>${c ?? ""}</td>`).join("") + "</tr>\n"; });
    return html + "</tbody></table>";
  };

  const copy = async () => { try { await navigator.clipboard.writeText(getExport()); } catch {} };

  return (
    <AppShell title="Table Maker">
      <header className="mb-5"><h1 className="text-2xl font-bold tracking-tight text-foreground">📊 Table Maker</h1><p className="mt-1 text-sm text-muted-foreground">Create and edit tables visually. Export as Markdown, HTML, CSV, or JSON.</p></header>
      <div className="mb-3 flex gap-2">
        <button onClick={addRow} className="h-8 rounded-lg border border-border px-2 text-xs hover:bg-accent">+ Row</button>
        <button onClick={addCol} className="h-8 rounded-lg border border-border px-2 text-xs hover:bg-accent">+ Col</button>
      </div>
      <div className="overflow-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-xs">
          <tbody>{data.map((row, r) => (
            <tr key={r} className="border-b border-border last:border-0">{row.map((cell, c) => (
              <td key={c} className="border-r border-border last:border-r-0"><input value={cell} onChange={e => updateCell(r, c, e.target.value)}
                className="w-full bg-transparent px-2 py-1.5 text-xs text-foreground focus:bg-surface-elevated focus:outline-none" /></td>
            ))}</tr>
          ))}</tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {(["markdown", "html", "csv", "json"] as const).map(f => (
          <button key={f} onClick={() => setExportFormat(f)} className={`rounded-lg px-2.5 py-1 text-[10px] capitalize transition-colors ${exportFormat === f ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{f}</button>
        ))}
        <button onClick={copy} className="ml-auto h-8 rounded-lg bg-primary px-3 text-xs text-primary-foreground hover:opacity-90">Copy</button>
      </div>
      <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-surface p-4 text-xs text-foreground">{getExport()}</pre>
    </AppShell>
  );
}
