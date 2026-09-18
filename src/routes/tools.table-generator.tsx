import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Table, Copy, Check, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/table-generator")({
  head: () => ({
    meta: [
      { title: "Markdown Table Studio - SlashAI" },
      {
        name: "description",
        content: "Interactive Markdown table generator and visual grid editor. Add rows, format alignments and export GitHub-flavored tables.",
      },
    ],
  }),
  component: TableGeneratorPage,
});

type Alignment = "left" | "center" | "right";

interface TableState {
  headers: string[];
  alignments: Alignment[];
  rows: string[][];
}

const INITIAL_TABLE: TableState = {
  headers: ["Feature", "Starter Tier", "Pro Tier", "Enterprise"],
  alignments: ["left", "center", "center", "right"],
  rows: [
    ["Command Catalog", "5,600+ free", "5,600+ free", "Full Vault Access"],
    ["Local Storage", "Yes", "Yes", "Yes (Exportable)"],
    ["API Calls", "0 / Offline", "0 / Offline", "Unlimited Offline"],
    ["Pricing", "₹0 / Free", "₹0 / Free", "Free Forever"],
  ],
};

function generateMarkdownTable(state: TableState): string {
  const { headers, alignments, rows } = state;
  if (headers.length === 0) return "";

  // Compute max width per column
  const colWidths = headers.map((h, i) => {
    let max = h.length;
    for (const row of rows) {
      const cell = row[i] ?? "";
      if (cell.length > max) max = cell.length;
    }
    return Math.max(max, 3);
  });

  const formatRow = (cells: string[]) => {
    return (
      "| " +
      cells
        .map((cell, i) => {
          const width = colWidths[i] ?? 3;
          const align = alignments[i] ?? "left";
          if (align === "center") {
            const padTotal = Math.max(0, width - cell.length);
            const padLeft = Math.floor(padTotal / 2);
            const padRight = padTotal - padLeft;
            return " ".repeat(padLeft) + cell + " ".repeat(padRight);
          }
          if (align === "right") {
            return cell.padStart(width, " ");
          }
          return cell.padEnd(width, " ");
        })
        .join(" | ") +
      " |"
    );
  };

  const headerLine = formatRow(headers);

  const delimiterLine =
    "| " +
    alignments
      .map((align, i) => {
        const width = colWidths[i] ?? 3;
        if (align === "center") return ":" + "-".repeat(Math.max(1, width - 2)) + ":";
        if (align === "right") return "-".repeat(Math.max(2, width - 1)) + ":";
        return ":" + "-".repeat(Math.max(2, width - 1));
      })
      .join(" | ") +
    " |";

  const rowLines = rows.map((r) => formatRow(r));

  return [headerLine, delimiterLine, ...rowLines].join("\n");
}

function TableGeneratorPage() {
  const [table, setTable] = useState<TableState>(INITIAL_TABLE);
  const [copied, setCopied] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [showCsvModal, setShowCsvModal] = useState(false);

  const markdownOutput = useMemo(() => generateMarkdownTable(table), [table]);

  const updateHeader = (index: number, val: string) => {
    const updated = [...table.headers];
    updated[index] = val;
    setTable({ ...table, headers: updated });
  };

  const updateCell = (rowIndex: number, colIndex: number, val: string) => {
    const updatedRows = table.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;
      const updatedRow = [...row];
      updatedRow[colIndex] = val;
      return updatedRow;
    });
    setTable({ ...table, rows: updatedRows });
  };

  const cycleAlignment = (index: number) => {
    const order: Alignment[] = ["left", "center", "right"];
    const current = table.alignments[index] ?? "left";
    const next = order[(order.indexOf(current) + 1) % order.length] ?? "left";
    const updated = [...table.alignments];
    updated[index] = next;
    setTable({ ...table, alignments: updated });
  };

  const addColumn = () => {
    const newColIndex = table.headers.length + 1;
    setTable({
      headers: [...table.headers, `Column ${newColIndex}`],
      alignments: [...table.alignments, "left"],
      rows: table.rows.map((r) => [...r, ""]),
    });
  };

  const deleteColumn = (colIdx: number) => {
    if (table.headers.length <= 1) {
      toast.error("Table must have at least one column");
      return;
    }
    setTable({
      headers: table.headers.filter((_, i) => i !== colIdx),
      alignments: table.alignments.filter((_, i) => i !== colIdx),
      rows: table.rows.map((r) => r.filter((_, i) => i !== colIdx)),
    });
  };

  const addRow = () => {
    const newRow = Array.from({ length: table.headers.length }, () => "");
    setTable({ ...table, rows: [...table.rows, newRow] });
  };

  const deleteRow = (rowIdx: number) => {
    if (table.rows.length <= 1) {
      toast.error("Table must have at least one row");
      return;
    }
    setTable({ ...table, rows: table.rows.filter((_, i) => i !== rowIdx) });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownOutput);
      setCopied(true);
      toast.success("Markdown table copied!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard blocked");
    }
  };

  const importCsv = () => {
    const lines = csvText.trim().split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    const parsed = lines.map((line) => line.split(",").map((c) => c.trim().replace(/^"|"$/g, "")));
    const headers = parsed[0] || ["Col 1"];
    const rows = parsed.slice(1);
    setTable({
      headers,
      alignments: Array.from({ length: headers.length }, () => "left"),
      rows: rows.length > 0 ? rows : [Array.from({ length: headers.length }, () => "")],
    });
    setShowCsvModal(false);
    setCsvText("");
    toast.success("Imported CSV into table");
  };

  return (
    <AppShell wide title="Markdown Table Studio">
      <div className="mx-auto max-w-6xl pb-14">
        <header className="page-enter pt-2">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Table className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Markdown Table Studio
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Visually craft clean GitHub-flavored markdown tables with live alignment &amp; column controls.
          </p>
        </header>

        {/* Action bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="secondary" onClick={addRow} className="h-8 gap-1 text-xs">
              <Plus className="size-3.5" /> Add Row
            </Button>
            <Button size="sm" variant="secondary" onClick={addColumn} className="h-8 gap-1 text-xs">
              <Plus className="size-3.5" /> Add Column
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCsvModal(!showCsvModal)}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <FileSpreadsheet className="size-3.5" /> Import CSV
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTable(INITIAL_TABLE)}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset Sample
            </Button>
            <Button size="sm" onClick={handleCopy} className="h-8 gap-1.5 text-xs">
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy Markdown"}
            </Button>
          </div>
        </div>

        {/* CSV Import drawer / expander */}
        {showCsvModal && (
          <div className="mt-3 rounded-xl border border-primary/30 bg-surface p-4">
            <h3 className="text-xs font-semibold text-foreground">Paste CSV or comma-separated rows:</h3>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Name, Role, Location&#10;Alice, Founder, Mumbai&#10;Bob, Lead Dev, Bengaluru"
              rows={4}
              className="mt-2 w-full rounded-lg border border-border bg-surface-elevated p-2.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setShowCsvModal(false)} className="h-7 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={importCsv} className="h-7 text-xs">
                Apply to Grid
              </Button>
            </div>
          </div>
        )}

        {/* Visual Interactive Table Editor */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface p-3">
          <table className="w-full min-w-[600px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="w-10 p-2 text-center text-muted-foreground font-mono">#</th>
                {table.headers.map((h, colIdx) => (
                  <th key={colIdx} className="p-2">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => updateHeader(colIdx, e.target.value)}
                        className="w-full rounded-md border border-border bg-surface-elevated px-2 py-1 font-semibold text-foreground focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => cycleAlignment(colIdx)}
                        title={`Alignment: ${table.alignments[colIdx]}`}
                        className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface-elevated text-muted-foreground hover:text-foreground"
                      >
                        {table.alignments[colIdx] === "center" ? (
                          <AlignCenter className="size-3.5 text-primary" />
                        ) : table.alignments[colIdx] === "right" ? (
                          <AlignRight className="size-3.5 text-primary" />
                        ) : (
                          <AlignLeft className="size-3.5 text-primary" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteColumn(colIdx)}
                        title="Delete column"
                        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </th>
                ))}
                <th className="w-10 p-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {table.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="group hover:bg-surface-elevated/40">
                  <td className="p-2 text-center font-mono text-muted-foreground text-[10px]">
                    {rowIdx + 1}
                  </td>
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className="p-2">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                        className={cn(
                          "w-full rounded-md border border-border/80 bg-surface px-2 py-1 text-foreground focus:border-primary focus:outline-none",
                          table.alignments[colIdx] === "center" && "text-center",
                          table.alignments[colIdx] === "right" && "text-right"
                        )}
                      />
                    </td>
                  ))}
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => deleteRow(rowIdx)}
                      title="Delete row"
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-60 hover:opacity-100 hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live Output Section */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Markdown Code Output</span>
            <span>Paste directly into GitHub, README or Docs</span>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border bg-surface-elevated p-4 font-mono text-xs leading-relaxed text-foreground whitespace-pre">
            {markdownOutput}
          </pre>
        </div>
      </div>
    </AppShell>
  );
}
