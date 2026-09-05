import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Ht as Heading1, Ln as Bold, Pt as Italic, Q as PenLine, Tt as Link, gn as Code, nn as Eye, on as Download, tn as FileText, xt as List } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.markdown-editor-rvbqwwDY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TEMPLATES = [
	{
		name: "Blog Post",
		content: "# Title\n\n> A brief introduction to hook the reader.\n\n## Section 1\n\nYour content here...\n\n## Section 2\n\nMore content...\n\n## Conclusion\n\nWrap up your thoughts.\n"
	},
	{
		name: "README",
		content: "# Project Name\n\nA short description of the project.\n\n## Installation\n\n```bash\nnpm install\n```\n\n## Usage\n\n```js\nimport { something } from 'package';\n```\n\n## License\n\nMIT\n"
	},
	{
		name: "Meeting Notes",
		content: "# Meeting Notes — [Date]\n\n## Attendees\n- Person 1\n- Person 2\n\n## Agenda\n1. Topic 1\n2. Topic 2\n\n## Discussion\n\nNotes here...\n\n## Action Items\n- [ ] Task 1 — @person\n- [ ] Task 2 — @person\n"
	},
	{
		name: "Resume",
		content: "# Name\n\n**Email** | **Phone** | **LinkedIn**\n\n## Experience\n\n### Company — Role\n*Date — Present*\n- Achievement 1\n- Achievement 2\n\n## Education\n\n### University — Degree\n*Year*\n\n## Skills\n\nSkill 1, Skill 2, Skill 3\n"
	}
];
function simpleMarkdown(md) {
	return md.replace(/^### (.+)$/gm, "<h3 style='margin:16px 0 8px;color:#f0f6fc'>$1</h3>").replace(/^## (.+)$/gm, "<h2 style='margin:20px 0 10px;color:#f0f6fc;border-bottom:1px solid #21262d;padding-bottom:6px'>$1</h2>").replace(/^# (.+)$/gm, "<h1 style='margin:0 0 16px;color:#f0f6fc;font-size:28px'>$1</h1>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`([^`]+)`/g, "<code style='background:#161b22;padding:2px 6px;border-radius:4px;font-size:13px'>$1</code>").replace(/^```(\w*)\n([\s\S]*?)```/gm, (_, lang, code) => `<pre style='background:#161b22;padding:12px;border-radius:8px;overflow-x:auto;font-size:13px'><code>${code.replace(/</g, "&lt;")}</code></pre>`).replace(/^> (.+)$/gm, "<blockquote style='border-left:3px solid #58a6ff;padding-left:12px;color:#8b949e;margin:8px 0'>$1</blockquote>").replace(/^- \[ \] (.+)$/gm, "<p style='margin:4px 0'>☐ $1</p>").replace(/^- \[x\] (.+)$/gm, "<p style='margin:4px 0'>☑ $1</p>").replace(/^- (.+)$/gm, "<li style='margin:4px 0;margin-left:16px'>$1</li>").replace(/^\d+\. (.+)$/gm, "<li style='margin:4px 0;margin-left:16px;list-style-type:decimal'>$1</li>").replace(/\n\n/g, "</p><p style='margin:12px 0'>").replace(/\n/g, "<br>");
}
var MARKDOWN = `# Hello World

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
	const [md, setMd] = (0, import_react.useState)(MARKDOWN);
	const [preview, setPreview] = (0, import_react.useState)(true);
	const [template, setTemplate] = (0, import_react.useState)("");
	const html = (0, import_react.useMemo)(() => simpleMarkdown(md), [md]);
	const wordCount = md.split(/\s+/).filter(Boolean).length;
	const charCount = md.length;
	const readingTime = Math.max(1, Math.ceil(wordCount / 200));
	const insertAt = (before, after) => {
		const ta = document.querySelector("textarea");
		if (!ta) return;
		const start = ta.selectionStart;
		const end = ta.selectionEnd;
		const selected = md.slice(start, end);
		const newText = md.slice(0, start) + before + selected + after + md.slice(end);
		setMd(newText);
	};
	const applyTemplate = (name) => {
		const t = TEMPLATES.find((t) => t.name === name);
		if (t) {
			setMd(t.content);
			setTemplate("");
		}
	};
	const download = (ext) => {
		const blob = ext === "html" ? new Blob([`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title><style>body{font-family:Inter,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#f0f6fc;background:#0a0a0f}code{background:#161b22;padding:2px 6px;border-radius:4px}pre{background:#161b22;padding:16px;border-radius:8px;overflow-x:auto}blockquote{border-left:3px solid #58a6ff;padding-left:12px;color:#8b949e}a{color:#58a6ff}</style></head><body>${html}</body></html>`], { type: "text/html" }) : new Blob([md], { type: "text/markdown" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `document.${ext}`;
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Markdown Editor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[calc(100vh-120px)] flex-col pt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-center gap-1 rounded-[10px] border border-border bg-surface px-2 py-1.5",
				children: [
					[
						{
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bold, { className: "size-3.5" }),
							action: () => insertAt("**", "**")
						},
						{
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Italic, { className: "size-3.5" }),
							action: () => insertAt("*", "*")
						},
						{
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading1, { className: "size-3.5" }),
							action: () => insertAt("## ", "")
						},
						{
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { className: "size-3.5" }),
							action: () => insertAt("`", "`")
						},
						{
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "size-3.5" }),
							action: () => insertAt("[", "](url)")
						},
						{
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-3.5" }),
							action: () => insertAt("- ", "")
						}
					].map((btn, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: btn.action,
						className: "flex size-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground",
						children: btn.icon
					}, i)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 h-5 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: template,
						onChange: (e) => applyTemplate(e.target.value),
						className: "rounded border border-border bg-surface-elevated px-2 py-1 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Templates..."
						}), TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t.name,
							children: t.name
						}, t.name))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-[10px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [wordCount, " words"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [charCount, " chars"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [readingTime, " min read"] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setPreview(!preview),
						className: `flex items-center gap-1 rounded px-2 py-1 text-xs ${preview ? "text-primary" : "text-muted-foreground"}`,
						children: [preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-3.5" }), preview ? "Split" : "Edit"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => download("md"),
						className: "text-muted-foreground hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => download("html"),
						className: "text-muted-foreground hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 gap-0 overflow-hidden rounded-[10px] border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: md,
					onChange: (e) => setMd(e.target.value),
					className: `flex-1 resize-none bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none ${preview ? "border-r border-border" : ""}`,
					style: { display: preview ? "block" : "none" }
				}), preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-auto bg-surface-elevated p-4 text-sm leading-relaxed text-foreground",
					dangerouslySetInnerHTML: { __html: html }
				})]
			})]
		})
	});
}
//#endregion
export { MarkdownEditor as component };
