import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.random-number-BLUCQ5gM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RandomNumberGenerator() {
	const [min, setMin] = (0, import_react.useState)(1);
	const [max, setMax] = (0, import_react.useState)(100);
	const [count, setCount] = (0, import_react.useState)(1);
	const [results, setResults] = (0, import_react.useState)([]);
	const [unique, setUnique] = (0, import_react.useState)(true);
	const generate = () => {
		const nums = [];
		const used = /* @__PURE__ */ new Set();
		while (nums.length < count) {
			const n = Math.floor(Math.random() * (max - min + 1)) + min;
			if (unique && used.has(n)) continue;
			nums.push(n);
			used.add(n);
		}
		setResults(nums);
	};
	const sorted = [...results].sort((a, b) => a - b);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Random Number Generator",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🔢 Random Number Generator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Generate random numbers in any range."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground mb-1 block",
						children: "Min"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: min,
						onChange: (e) => setMin(Number(e.target.value)),
						className: "w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground mb-1 block",
						children: "Max"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: max,
						onChange: (e) => setMax(Number(e.target.value)),
						className: "w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground",
							children: "Count"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 1,
							max: 20,
							value: count,
							onChange: (e) => setCount(Number(e.target.value)),
							className: "flex-1 accent-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-foreground",
							children: count
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: unique,
						onChange: (e) => setUnique(e.target.checked),
						className: "accent-primary"
					}), " Unique only"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: generate,
					className: "w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90",
					children: "Generate"
				}),
				results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: sorted.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-border bg-surface p-2 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-bold text-primary",
							children: n
						})
					}, i))
				})
			]
		})]
	});
}
//#endregion
export { RandomNumberGenerator as component };
