import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.tip-calculator-DJwkUYbW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TipCalculator() {
	const [bill, setBill] = (0, import_react.useState)("");
	const [tipPercent, setTipPercent] = (0, import_react.useState)(15);
	const [people, setPeople] = (0, import_react.useState)(1);
	const total = (0, import_react.useMemo)(() => {
		const b = parseFloat(bill) || 0;
		const tip = b * (tipPercent / 100);
		return {
			tip,
			total: b + tip,
			perPerson: people > 0 ? (b + tip) / people : 0
		};
	}, [
		bill,
		tipPercent,
		people
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Tip Calculator",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "💰 Tip Calculator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Calculate tips and split bills easily."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted-foreground mb-1 block",
					children: "Bill Amount"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					value: bill,
					onChange: (e) => setBill(e.target.value),
					placeholder: "0.00",
					className: "w-full h-12 rounded-xl border border-border bg-surface px-4 text-xl font-bold focus:outline-none"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-muted-foreground mb-1 block",
						children: [
							"Tip: ",
							tipPercent,
							"%"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 50,
						value: tipPercent,
						onChange: (e) => setTipPercent(Number(e.target.value)),
						className: "w-full accent-primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 mt-1",
						children: [
							10,
							15,
							18,
							20,
							25
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setTipPercent(t),
							className: `flex-1 rounded-lg py-1 text-xs ${tipPercent === t ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`,
							children: [t, "%"]
						}, t))
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs text-muted-foreground mb-1 block",
					children: [
						"Split between: ",
						people,
						" ",
						people === 1 ? "person" : "people"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPeople(Math.max(1, people - 1)),
							className: "size-9 rounded-lg border border-border bg-surface text-lg",
							children: "-"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg font-bold w-8 text-center",
							children: people
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPeople(people + 1),
							className: "size-9 rounded-lg border border-border bg-surface text-lg",
							children: "+"
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Tip"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-primary",
								children: ["$", total.tip.toFixed(2)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-foreground",
								children: ["$", total.total.toFixed(2)]
							})]
						}),
						people > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm border-t border-border pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Per Person"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-primary text-lg",
								children: ["$", total.perPerson.toFixed(2)]
							})]
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { TipCalculator as component };
