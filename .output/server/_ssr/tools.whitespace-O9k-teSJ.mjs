import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.whitespace-O9k-teSJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WhitespaceRemover() {
	const [input, setInput] = (0, import_react.useState)("");
	const [options, setOptions] = (0, import_react.useState)({
		doubleSpaces: true,
		trailingSpaces: true,
		leadingSpaces: true,
		tabs: true,
		lineBreaks: false,
		emptyLines: false
	});
	const process = (text) => {
		let result = text;
		if (options.trailingSpaces) result = result.replace(/[ \t]+$/gm, "");
		if (options.leadingSpaces) result = result.replace(/^[ \t]+/gm, "");
		if (options.doubleSpaces) result = result.replace(/ {2,}/g, " ");
		if (options.tabs) result = result.replace(/\t/g, " ");
		if (options.lineBreaks) result = result.replace(/\n/g, " ");
		if (options.emptyLines) result = result.replace(/\n\s*\n/g, "\n");
		return result;
	};
	const output = process(input);
	const savedChars = input.length - output.length;
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(output);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Whitespace Remover",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🧹 Whitespace Remover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Clean text: remove extra spaces, tabs, line breaks, and trailing whitespace."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: "Paste messy text here...",
					className: "h-32 w-full rounded-xl border border-border bg-surface p-4 text-sm focus:outline-none focus:border-primary/50 resize-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						["doubleSpaces", "Remove double spaces"],
						["trailingSpaces", "Remove trailing spaces"],
						["leadingSpaces", "Remove leading spaces"],
						["tabs", "Replace tabs with spaces"],
						["lineBreaks", "Remove line breaks"],
						["emptyLines", "Remove empty lines"]
					].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 rounded-lg border border-border bg-surface p-2.5 text-xs text-foreground cursor-pointer hover:bg-surface-elevated",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: options[key],
							onChange: (e) => setOptions({
								...options,
								[key]: e.target.checked
							}),
							className: "accent-primary"
						}), label]
					}, key))
				}),
				savedChars > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-green text-center",
					children: [
						"Saved ",
						savedChars,
						" characters (",
						Math.round(savedChars / input.length * 100),
						"%)"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: copy,
						disabled: !output,
						className: "flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
						children: "Copy Cleaned Text"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							navigator.clipboard.writeText(output);
						},
						className: "rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground",
						children: ["Count: ", output.length]
					})]
				}),
				output && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-48 overflow-auto rounded-xl border border-border bg-surface p-4 text-sm text-foreground whitespace-pre-wrap",
					children: output
				})
			]
		})]
	});
}
//#endregion
export { WhitespaceRemover as component };
