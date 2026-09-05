import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.json-formatter-QlNQ25U3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JSONFormatter() {
	const [input, setInput] = (0, import_react.useState)("");
	const [output, setOutput] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [indent, setIndent] = (0, import_react.useState)(2);
	const format = () => {
		try {
			const parsed = JSON.parse(input);
			setOutput(JSON.stringify(parsed, null, indent));
			setError("");
		} catch (e) {
			setError(e.message);
			setOutput("");
		}
	};
	const minify = () => {
		try {
			setOutput(JSON.stringify(JSON.parse(input)));
			setError("");
		} catch (e) {
			setError(e.message);
		}
	};
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(output);
		} catch {}
	};
	const stats = (() => {
		try {
			const parsed = JSON.parse(input);
			return {
				keys: (JSON.stringify(parsed).match(/"[^"]+"/g) || []).length,
				depth: JSON.stringify(parsed).split("").reduce((d, c) => {
					if (c === "{") return d + 1;
					if (c === "}") return d - 1;
					return d;
				}, 0),
				valid: true
			};
		} catch {
			return {
				keys: 0,
				depth: 0,
				valid: false
			};
		}
	})();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "JSON Formatter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🔧 JSON Formatter"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Pretty print, minify, and validate JSON instantly."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: "Paste JSON here... {\"key\": \"value\"}",
					className: "h-48 w-full rounded-xl border border-border bg-surface p-4 font-mono text-sm focus:outline-none focus:border-primary/50 resize-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: format,
							disabled: !input.trim(),
							className: "rounded-xl bg-primary px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40",
							children: "Pretty Print"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: minify,
							disabled: !input.trim(),
							className: "rounded-xl border border-border bg-surface px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40",
							children: "Minify"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground",
								children: "Indent"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: indent,
								onChange: (e) => setIndent(Number(e.target.value)),
								className: "rounded-lg border border-border bg-surface px-2 py-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 2,
										children: "2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 4,
										children: "4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 8,
										children: "8"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "	",
										children: "Tab"
									})
								]
							})]
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400",
					children: ["❌ ", error]
				}),
				output && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stats.valid ? "✅ Valid JSON" : "❌ Invalid" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [stats.keys, " keys"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Depth: ", stats.depth] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: copy,
						className: "text-xs text-primary hover:underline",
						children: "Copy"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-96 overflow-auto rounded-xl border border-border bg-surface p-4 font-mono text-sm text-foreground whitespace-pre-wrap",
					children: output
				})] })
			]
		})]
	});
}
//#endregion
export { JSONFormatter as component };
