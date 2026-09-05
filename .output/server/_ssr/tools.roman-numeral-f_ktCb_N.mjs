import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.roman-numeral-f_ktCb_N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROMAN = [
	[1e3, "M"],
	[900, "CM"],
	[500, "D"],
	[400, "CD"],
	[100, "C"],
	[90, "XC"],
	[50, "L"],
	[40, "XL"],
	[10, "X"],
	[9, "IX"],
	[5, "V"],
	[4, "IV"],
	[1, "I"]
];
function toRoman(num) {
	if (num <= 0 || num > 3999) return "Out of range (1-3999)";
	let result = "";
	for (const [value, symbol] of ROMAN) while (num >= value) {
		result += symbol;
		num -= value;
	}
	return result;
}
function fromRoman(str) {
	const map = {
		I: 1,
		V: 5,
		X: 10,
		L: 50,
		C: 100,
		D: 500,
		M: 1e3
	};
	let result = 0;
	for (let i = 0; i < str.length; i++) {
		const curr = map[str[i] ?? ""] ?? 0;
		const next = map[str[i + 1] ?? ""] ?? 0;
		if (!curr) return "Invalid Roman numeral";
		if (next > 0 && curr < next) {
			result += next - curr;
			i++;
		} else result += curr;
	}
	return result;
}
function RomanNumeralConverter() {
	const [number, setNumber] = (0, import_react.useState)("1994");
	const [roman, setRoman] = (0, import_react.useState)("MCMXCIV");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Roman Numeral Converter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🏛️ Roman Numeral Converter"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Convert between numbers and Roman numerals (1-3999)."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground mb-1 block",
						children: "Number → Roman"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: number,
							onChange: (e) => {
								setNumber(e.target.value);
								const n = parseInt(e.target.value);
								if (n) setRoman(toRoman(n));
							},
							className: "flex-1 h-10 rounded-lg border border-border bg-surface-elevated px-3 text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 h-10 rounded-lg border border-primary/30 bg-primary/5 px-3 flex items-center text-sm font-bold text-primary",
							children: roman
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground mb-1 block",
						children: "Roman → Number"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: roman,
						onChange: (e) => {
							setRoman(e.target.value.toUpperCase());
							const n = fromRoman(e.target.value.toUpperCase());
							setNumber(typeof n === "number" ? n.toString() : "");
						},
						className: "w-full h-10 rounded-lg border border-border bg-surface-elevated px-3 text-sm font-mono"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: "Quick Reference"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2 text-xs",
						children: [
							["I", "1"],
							["V", "5"],
							["X", "10"],
							["L", "50"],
							["C", "100"],
							["D", "500"],
							["M", "1000"]
						].map(([r, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between rounded bg-surface-elevated px-2 py-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-primary",
								children: r
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: n
							})]
						}, r))
					})]
				})
			]
		})]
	});
}
//#endregion
export { RomanNumeralConverter as component };
