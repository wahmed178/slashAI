import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.text-case-DIJl5BeQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CASES = [
	{
		label: "UPPER CASE",
		fn: (s) => s.toUpperCase()
	},
	{
		label: "lower case",
		fn: (s) => s.toLowerCase()
	},
	{
		label: "Title Case",
		fn: (s) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
	},
	{
		label: "Sentence case",
		fn: (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase())
	},
	{
		label: "camelCase",
		fn: (s) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
	},
	{
		label: "PascalCase",
		fn: (s) => s.toLowerCase().replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, c) => c.toUpperCase())
	},
	{
		label: "snake_case",
		fn: (s) => s.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "")
	},
	{
		label: "kebab-case",
		fn: (s) => s.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "")
	},
	{
		label: "CONSTANT_CASE",
		fn: (s) => s.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "")
	},
	{
		label: "dot.case",
		fn: (s) => s.toLowerCase().replace(/[^a-zA-Z0-9]+/g, ".").replace(/^\.|\.$/g, "")
	},
	{
		label: "path/case",
		fn: (s) => s.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "/").replace(/^\/|\/$/g, "")
	},
	{
		label: "reverse",
		fn: (s) => s.split("").reverse().join("")
	}
];
function TextCaseConverter() {
	const [input, setInput] = (0, import_react.useState)("hello world example text");
	const [copied, setCopied] = (0, import_react.useState)("");
	const copy = (text, label) => {
		navigator.clipboard.writeText(text);
		setCopied(label);
		setTimeout(() => setCopied(""), 1200);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Text Case Converter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🔄 Text Case Converter"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Convert text between 12 different cases instantly."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: input,
				onChange: (e) => setInput(e.target.value),
				placeholder: "Type or paste text...",
				className: "h-24 w-full rounded-xl border border-border bg-surface p-4 text-sm focus:outline-none focus:border-primary/50 resize-none"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: CASES.map((c) => {
					const result = c.fn(input);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 w-28 text-[11px] font-medium text-muted-foreground",
								children: c.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-sm text-foreground font-mono truncate",
								children: result
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => copy(result, c.label),
								className: "shrink-0 text-[11px] text-primary hover:underline",
								children: copied === c.label ? "✓" : "Copy"
							})
						]
					}, c.label);
				})
			})]
		})]
	});
}
//#endregion
export { TextCaseConverter as component };
