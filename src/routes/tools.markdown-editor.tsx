import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Bold, Italic, Heading1, Link, Code, List, Download, FileText, Eye, Edit3 } from "lucide-react";

export const Route = createFileRoute("/tools/markdown-editor")({
  head: () => ({ meta: [{ title: "Markdown Editor — SlashAI" }] }),
  component: MarkdownEditor,
});

const TEMPLATES: Array<{ name: string; content: string }> = [
  {
    name: "Blog Post",
    content: "# Title\n\n> A brief introduction to hook the reader.\n\n## Section 1\n\nYour content here...\n\n## Section 2\n\nMore content...\n\n## Conclusion\n\nWrap up your thoughts.\n",
  },
  {
    name: "README",
    content: "# Project Name\n\nA short description of the project.\n\n## Installation\n\n```bash\nnpm install\n```\n\n## Usage\n\n```js\nimport { something } from 'package';\n```\n\n## License\n\nMIT\n",
  },
  {
    name: "Meeting Notes",
    content: "# Meeting Notes — [Date]\n\n## Attendees\n- Person 1\n- Person 2\n\n## Agenda\n1. Topic 1\n2. Topic 2\n\n## Discussion\n\nNotes here...\n\n## Action Items\n- [ ] Task 1 — @person\n- [ ] Task 2 — @person\n",
  },
  {
    name: "Resume",
    content: "# Name\n\n**Email** | **Phone** | **LinkedIn**\n\n## Experience\n\n### Company — Role\n*Date — Present*\n- Achievement 1\n- Achievement 2\n\n## Education\n\n### University — Degree\n*Year*\n\n## Skills\n\nSkill 1, Skill 2, Skill 3\n",
  },
];

function simpleMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3 style='margin:16px 0 8px;color:#f0f6fc'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 style='margin:20px 0 10px;color:#f0f6fc;border-bottom:1px solid #21262d;padding-bottom:6px'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 style='margin:0 0 16px;color:#f0f6fc;font-size:28px'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code style='background:#161b22;padding:2px 6px;border-radius:4px;font-size:13px'>$1</code>")
    .replace(/^```(\w*)\n([\s\S]*?)```/gm, (_, lang, code) => `<pre style='background:#161b22;padding:12px;border-radius:8px;overflow-x:auto;font-size:13px'><code>${code.replace(/</g, "&lt;")}</code></pre>`)
    .replace(/^> (.+)$/gm, "<blockquote style='border-left:3px solid #58a6ff;padding-left:12px;color:#8b949e;margin:8px 0'>$1</blockquote>")
    .replace(/^- \[ \] (.+)$/gm, "<p style='margin:4px 0'>☐ $1</p>")
    .replace(/^- \[x\] (.+)$/gm, "<p style='margin:4px 0'>☑ $1</p>")
    .replace(/^- (.+)$/gm, "<li style='margin:4px 0;margin-left:16px'>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li style='margin:4px 0;margin-left:16px;list-style-type:decimal'>$1</li>")
    .replace(/\n\n/g, "</p><p style='margin:12px 0'>")
    .replace(/\n/g, "<br>");
}

const MARKDOWN = `# Hello World

This is **bold** and this is *italic*.

## Features
- Live preview
- Export as .md or HTML
- Templates included

> The best way to predict the future is to create it.

\`\`\`js
console.log("Hello from SlashAI!");
\`\`\`

1. First item
2. Second item
3. Third item

---

*Happy writing!* ✍️`;

function MarkdownEditor() {
  const [md, setMd] = useState(MARKDOWN);
  const [preview, setPreview] = useState(true);
  const [template, setTemplate] = useState("");

  const html = useMemo(() => simpleMarkdown(md), [md]);
  const wordCount = md.split(/\s+/).filter(Boolean).length;
  const charCount = md.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const insertAt = (before: string, after: string) => {
    const ta = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = md.slice(start, end);
    const newText = md.slice(0, start) + before + selected + after + md.slice(end);
    setMd(newText);
  };

  const applyTemplate = (name: string) => {
    const t = TEMPLATES.find((t) => t.name === name);
    if (t) { setMd(t.content); setTemplate(""); }
  };

  const download = (ext: string) => {
    const blob = ext === "html"
      ? new Blob([`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title><style>body{font-family:Inter,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#f0f6fc;background:#0a0a0f}code{background:#161b22;padding:2px 6px;border-radius:4px}pre{background:#161b22;padding:16px;border-radius:8px;overflow-x:auto}blockquote{border-left:3px solid #58a6ff;padding-left:12px;color:#8b949e}a{color:#58a6ff}</style></head><body>${html}</body></html>`], { type: "text/html" })
      : new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `document.${ext}`;
    a.click();
  };

  return (
    <AppShell title="Markdown Editor">
      <div className="flex h-[calc(100vh-120px)] flex-col pt-4">
        {/* Toolbar */}
        <div className="mb-2 flex flex-wrap items-center gap-1 rounded-[10px] border border-border bg-surface px-2 py-1.5">
          {[
            { icon: <Bold className="size-3.5" />, action: () => insertAt("**", "**") },
            { icon: <Italic className="size-3.5" />, action: () => insertAt("*", "*") },
            { icon: <Heading1 className="size-3.5" />, action: () => insertAt("## ", "") },
            { icon: <Code className="size-3.5" />, action: () => insertAt("`", "`") },
            { icon: <Link className="size-3.5" />, action: () => insertAt("[", "](url)") },
            { icon: <List className="size-3.5" />, action: () => insertAt("- ", "") },
          ].map((btn, i) => (
            <button key={i} onClick={btn.action} className="flex size-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground">
              {btn.icon}
            </button>
          ))}

          <div className="mx-1 h-5 w-px bg-border" />

          <select value={template} onChange={(e) => applyTemplate(e.target.value)} className="rounded border border-border bg-surface-elevated px-2 py-1 text-xs text-muted-foreground">
            <option value="">Templates...</option>
            {TEMPLATES.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>

          <div className="flex-1" />

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{charCount} chars</span>
            <span>·</span>
            <span>{readingTime} min read</span>
          </div>

          <button onClick={() => setPreview(!preview)} className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${preview ? "text-primary" : "text-muted-foreground"}`}>
            {preview ? <Eye className="size-3.5" /> : <Edit3 className="size-3.5" />}
            {preview ? "Split" : "Edit"}
          </button>

          <button onClick={() => download("md")} className="text-muted-foreground hover:text-foreground"><Download className="size-3.5" /></button>
          <button onClick={() => download("html")} className="text-muted-foreground hover:text-foreground"><FileText className="size-3.5" /></button>
        </div>

        {/* Editor + Preview */}
        <div className="flex flex-1 gap-0 overflow-hidden rounded-[10px] border border-border">
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            className={`flex-1 resize-none bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none ${preview ? "border-r border-border" : ""}`}
            style={{ display: preview ? "block" : "none" }}
          />
          {preview && (
            <div
              className="flex-1 overflow-auto bg-surface-elevated p-4 text-sm leading-relaxed text-foreground"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
