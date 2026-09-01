import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/changelog-maker")({
  component: ChangelogMaker,
});

interface ChangelogEntry { id: number; text: string; }
type Category = "new" | "improved" | "fixed" | "removed";

const CAT_CONFIG: Record<Category, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "#3fb950", bg: "rgba(63,185,80,0.1)" },
  improved: { label: "Improved", color: "#58a6ff", bg: "rgba(88,166,255,0.1)" },
  fixed: { label: "Fixed", color: "#d29922", bg: "rgba(210,153,34,0.1)" },
  removed: { label: "Removed", color: "#f85149", bg: "rgba(248,81,73,0.1)" },
};

function ChangelogMaker() {
  const [product, setProduct] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [entries, setEntries] = useState<Record<Category, ChangelogEntry[]>>({
    new: [], improved: [], fixed: [], removed: [],
  });
  const [activeCat, setActiveCat] = useState<Category>("new");
  const [input, setInput] = useState("");
  const [format, setFormat] = useState<"markdown" | "html" | "text" | "json">("markdown");

  const addEntry = () => {
    if (!input.trim()) return;
    setEntries((e) => ({ ...e, [activeCat]: [...e[activeCat], { id: Date.now(), text: input.trim() }] }));
    setInput("");
  };

  const removeEntry = (cat: Category, id: number) => {
    setEntries((e) => ({ ...e, [cat]: e[cat].filter((en) => en.id !== id) }));
  };

  const generateMarkdown = () => {
    let md = `# ${product || "Product"} ${version}\n\n**Release Date:** ${date}\n\n`;
    for (const [cat, items] of Object.entries(entries) as [Category, ChangelogEntry[]][]) {
      if (items.length === 0) continue;
      md += `### ${CAT_CONFIG[cat].label}\n\n`;
      items.forEach((item) => { md += `- ${item.text}\n`; });
      md += "\n";
    }
    return md;
  };

  const generateHTML = () => {
    let html = `<h1>${product || "Product"} ${version}</h1>\n<p><em>${date}</em></p>\n`;
    for (const [cat, items] of Object.entries(entries) as [Category, ChangelogEntry[]][]) {
      if (items.length === 0) continue;
      html += `<h3 style="color:${CAT_CONFIG[cat].color}">${CAT_CONFIG[cat].label}</h3>\n<ul>\n`;
      items.forEach((item) => { html += `  <li>${item.text}</li>\n`; });
      html += "</ul>\n";
    }
    return html;
  };

  const generateText = () => {
    let txt = `${product || "Product"} ${version} — ${date}\n${"=".repeat(40)}\n\n`;
    for (const [cat, items] of Object.entries(entries) as [Category, ChangelogEntry[]][]) {
      if (items.length === 0) continue;
      txt += `[${CAT_CONFIG[cat].label}]\n`;
      items.forEach((item) => { txt += `  • ${item.text}\n`; });
      txt += "\n";
    }
    return txt;
  };

  const generateJSON = () => {
    const obj = { product: product || "Product", version, date, changes: {} as Record<string, string[]> };
    for (const [cat, items] of Object.entries(entries) as [Category, ChangelogEntry[]][]) {
      if (items.length > 0) obj.changes[cat] = items.map((i) => i.text);
    }
    return JSON.stringify(obj, null, 2);
  };

  const output = format === "markdown" ? generateMarkdown() : format === "html" ? generateHTML() : format === "json" ? generateJSON() : generateText();

  const copy = async () => { try { await navigator.clipboard.writeText(output); } catch {} };

  return (
    <AppShell title="Changelog Maker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📝 Changelog Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Fill in your release details → get a clean changelog in Markdown, HTML, text, or JSON.</p>
      </header>

      <div className="mx-auto max-w-3xl space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Product name" className="h-9 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary/50" />
          <input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="Version" className="h-9 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary/50" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary/50" />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2">
          {(Object.keys(CAT_CONFIG) as Category[]).map((cat) => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${activeCat === cat ? "text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}
              style={activeCat === cat ? { background: CAT_CONFIG[cat].color } : {}}>
              {CAT_CONFIG[cat].label} ({entries[cat].length})
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Add a ${CAT_CONFIG[activeCat].label.toLowerCase()} item...`} className="flex-1 h-9 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary/50" onKeyDown={(e) => e.key === "Enter" && addEntry()} />
          <button onClick={addEntry} className="rounded-lg bg-primary px-4 text-sm font-medium text-background hover:opacity-90">Add</button>
        </div>

        {/* Entries */}
        <div className="space-y-2">
          {(Object.keys(CAT_CONFIG) as Category[]).map((cat) => entries[cat].length > 0 && (
            <div key={cat}>
              <p className="text-[11px] font-semibold mb-1" style={{ color: CAT_CONFIG[cat].color }}>{CAT_CONFIG[cat].label}</p>
              {entries[cat].map((en) => (
                <div key={en.id} className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 mb-1">
                  <span className="text-sm flex-1 text-foreground">{en.text}</span>
                  <button onClick={() => removeEntry(cat, en.id)} className="text-xs text-muted-foreground hover:text-red-400">✕</button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Output */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              {(["markdown", "html", "text", "json"] as const).map((f) => (
                <button key={f} onClick={() => setFormat(f)} className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${format === f ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground"}`}>{f}</button>
              ))}
            </div>
            <button onClick={copy} className="text-xs text-primary hover:underline">Copy</button>
          </div>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-surface-elevated p-3 font-mono text-[11px] leading-relaxed text-foreground">{output}</pre>
        </div>
      </div>
    </AppShell>
  );
}
