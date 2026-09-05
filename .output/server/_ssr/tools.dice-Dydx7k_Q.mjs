import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.dice-Dydx7k_Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DICE = [
	{
		sides: 4,
		label: "D4"
	},
	{
		sides: 6,
		label: "D6"
	},
	{
		sides: 8,
		label: "D8"
	},
	{
		sides: 10,
		label: "D10"
	},
	{
		sides: 12,
		label: "D12"
	},
	{
		sides: 20,
		label: "D20"
	},
	{
		sides: 100,
		label: "D100"
	}
];
function DiceRoller() {
	const [results, setResults] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)([6]);
	const [count, setCount] = (0, import_react.useState)(1);
	const [rolling, setRolling] = (0, import_react.useState)(false);
	const roll = () => {
		setRolling(true);
		setTimeout(() => {
			const r = selected.flatMap((sides) => Array.from({ length: count }, () => ({
				die: `D${sides}`,
				value: Math.floor(Math.random() * sides) + 1
			})));
			setResults(r);
			setRolling(false);
		}, 300);
	};
	const toggleDie = (sides) => {
		setSelected((prev) => prev.includes(sides) ? prev.filter((s) => s !== sides) : [...prev, sides]);
	};
	const total = results.reduce((a, r) => a + r.value, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Dice Roller",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🎲 Dice Roller"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Roll D4, D6, D8, D10, D12, D20, D100 for tabletop games."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: DICE.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => toggleDie(d.sides),
						className: `rounded-xl border p-3 text-center transition-all ${selected.includes(d.sides) ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-bold",
							children: d.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px]",
							children: [d.sides, " sides"]
						})]
					}, d.sides))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Count"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: [
							1,
							2,
							3,
							4,
							5
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCount(n),
							className: `size-8 rounded-lg text-xs font-medium ${count === n ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`,
							children: n
						}, n))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: roll,
					disabled: selected.length === 0,
					className: "w-full rounded-xl bg-primary py-4 text-lg font-bold text-background hover:opacity-90 disabled:opacity-40 transition-all active:scale-95",
					children: rolling ? "Rolling..." : "🎲 Roll!"
				}),
				results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: results.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3 text-center animate-bounce",
						style: { animationDuration: "0.3s" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold text-primary",
							children: r.value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground",
							children: r.die
						})]
					}, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: ["Total: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg font-bold text-foreground",
							children: total
						})]
					})
				})] })
			]
		})]
	});
}
//#endregion
export { DiceRoller as component };
