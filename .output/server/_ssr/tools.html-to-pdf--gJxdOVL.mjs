import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { nn as Eye, on as Download, tn as FileText } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.html-to-pdf--gJxdOVL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TEMPLATES = {
	Invoice: `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:40px;color:#333}h1{color:#58a6ff}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style></head><body><h1>Invoice #001</h1><p>Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}</p><p>Bill to: [Client Name]</p><table><tr><th>Item</th><th>Qty</th><th>Price</th></tr><tr><td>Service</td><td>1</td><td>₹10,000</td></tr></table><p style="text-align:right;margin-top:20px;font-weight:bold">Total: ₹10,000</p></body></html>`,
	Report: `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:40px;color:#333}h1{border-bottom:2px solid #58a6ff;padding-bottom:10px}h2{color:#58a6ff;margin-top:30px}</style></head><body><h1>Quarterly Report</h1><h2>Summary</h2><p>Add your report content here.</p><h2>Key Metrics</h2><ul><li>Metric 1: 100%</li><li>Metric 2: 50%</li></ul></body></html>`,
	Letter: `<!DOCTYPE html><html><head><style>body{font-family:serif;padding:40px;color:#333;max-width:600px;margin:0 auto}.date{margin-bottom:20px}.body{line-height:1.8}.sign{margin-top:40px}</style></head><body><div class="date">${(/* @__PURE__ */ new Date()).toLocaleDateString()}</div><p>Dear [Name],</p><div class="body"><p>I am writing to express my interest in [topic].</p><p>Add your letter content here.</p></div><div class="sign"><p>Sincerely,</p><p>[Your Name]</p></div></body></html>`
};
function HtmlToPdf() {
	const [html, setHtml] = (0, import_react.useState)("");
	const [showPreview, setShowPreview] = (0, import_react.useState)(false);
	const iframeRef = (0, import_react.useRef)(null);
	const handlePrint = () => {
		const iframe = iframeRef.current;
		if (!iframe) return;
		iframe.contentWindow?.print();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "HTML to PDF",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2",
				children: Object.keys(TEMPLATES).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setHtml(TEMPLATES[t] ?? "");
						setShowPreview(true);
					},
					className: "flex min-h-[36px] items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-muted-foreground hover:text-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3" }),
						" ",
						t
					]
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: html,
				onChange: (e) => {
					setHtml(e.target.value);
					setShowPreview(false);
				},
				placeholder: "Paste your HTML here…",
				className: "mt-3 min-h-[300px] w-full resize-y rounded-xl border border-border bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none",
				style: { tabSize: 2 }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setShowPreview(true),
					className: "flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground hover:text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), " Preview"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handlePrint,
					className: "flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download as PDF"]
				})]
			}),
			showPreview && html && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl border border-border bg-surface p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-[11px] text-muted-foreground",
					children: "Preview — Use browser print dialog to save as PDF"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					ref: iframeRef,
					srcDoc: html,
					className: "h-[500px] w-full rounded-lg border border-border bg-white",
					title: "Preview"
				})]
			})
		]
	});
}
//#endregion
export { HtmlToPdf as component };
