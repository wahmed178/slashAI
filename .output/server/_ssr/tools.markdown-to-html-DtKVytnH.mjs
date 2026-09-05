import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { En as Check, dn as Copy, on as Download } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as purify } from "../_libs/dompurify.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.markdown-to-html-DtKVytnH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EXAMPLE = `# Hello World\n\nThis is **bold** and this is *italic*.\n\n- Item 1\n- Item 2\n- Item 3\n\n> A blockquote\n\n\`\`\`js\nconsole.log("Hello");\n\`\`\``;
function simpleMarkdown(md) {
	const wrappedHtml = `<div style="font-family:Inter,sans-serif;max-width:700px;margin:0 auto;padding:20px"><p>${md.replace(/^### (.+)$/gm, "<h3>$1</h3>").replace(/^## (.+)$/gm, "<h2>$1</h2>").replace(/^# (.+)$/gm, "<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`(.+?)`/g, "<code>$1</code>").replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>").replace(/^- (.+)$/gm, "<li>$1</li>").replace(/(<li>.+<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p></div>`;
	return purify.sanitize(wrappedHtml);
}
function MarkdownToHtml() {
	const [md, setMd] = (0, import_react.useState)(EXAMPLE);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const html = (0, import_react.useMemo)(() => simpleMarkdown(md), [md]);
	const copy = () => {
		navigator.clipboard.writeText(html);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const download = () => {
		const full = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Exported HTML</title></head><body>${html}</body></html>`;
		const blob = new Blob([full], { type: "text/html" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "export.html";
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Markdown to HTML",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-[11px] text-muted-foreground",
				children: "Markdown"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: md,
				onChange: (e) => setMd(e.target.value),
				className: "min-h-[350px] w-full resize-y rounded-xl border border-border bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-[11px] text-muted-foreground",
				children: "Preview"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-[350px] overflow-auto rounded-xl border border-border bg-white p-4 text-sm text-gray-800",
				dangerouslySetInnerHTML: { __html: html }
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: copy,
				className: "flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground hover:text-primary",
				children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copied!" : "Copy HTML"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: download,
				className: "flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download .html"]
			})]
		})]
	});
}
//#endregion
export { MarkdownToHtml as component };
