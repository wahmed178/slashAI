import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Copy, Download, Check } from "lucide-react";

const EXAMPLE = `# Hello World\n\nThis is **bold** and this is *italic*.\n\n- Item 1\n- Item 2\n- Item 3\n\n> A blockquote\n\n\`\`\`js\nconsole.log("Hello");\n\`\`\``;

export const Route = createFileRoute("/tools/markdown-to-html")({
  head: () => ({ meta: [{ title: "Markdown to HTML — SlashAI" }] }),
  component: MarkdownToHtml,
});

function simpleMarkdown(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.+<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");
  return `<div style="font-family:Inter,sans-serif;max-width:700px;margin:0 auto;padding:20px"><p>${html}</p></div>`;
}

function MarkdownToHtml() {
  const [md, setMd] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => simpleMarkdown(md), [md]);

  const copy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const full = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Exported HTML</title></head><body>${html}</body></html>`;
    const blob = new Blob([full], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "export.html";
    a.click();
  };

  return (
    <AppShell title="Markdown to HTML" back={{ to: "/tools", label: "SlashKits" }}>
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-[11px] text-muted-foreground">Markdown</p>
          <textarea value={md} onChange={(e) => setMd(e.target.value)}
            className="min-h-[350px] w-full resize-y rounded-xl border border-border bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <p className="mb-1 text-[11px] text-muted-foreground">Preview</p>
          <div className="min-h-[350px] overflow-auto rounded-xl border border-border bg-white p-4 text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={copy} className="flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground hover:text-primary">
          {copied ? <Check className="size-4 text-green" /> : <Copy className="size-4" />}
          {copied ? "Copied!" : "Copy HTML"}
        </button>
        <button type="button" onClick={download} className="flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Download className="size-4" /> Download .html
        </button>
      </div>
    </AppShell>
  );
}
