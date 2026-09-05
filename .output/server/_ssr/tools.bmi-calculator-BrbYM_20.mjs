import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.bmi-calculator-BrbYM_20.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getBmiCategory(bmi) {
	if (bmi < 18.5) return {
		label: "Underweight",
		color: "var(--primary)",
		note: "Consider consulting a nutritionist for a balanced diet plan."
	};
	if (bmi < 25) return {
		label: "Normal",
		color: "#3fb950",
		note: "Great job! Maintain your healthy lifestyle with regular exercise."
	};
	if (bmi < 30) return {
		label: "Overweight",
		color: "#d29922",
		note: "Light exercise and dietary changes can help bring BMI to normal range."
	};
	return {
		label: "Obese",
		color: "#f85149",
		note: "Please consult a healthcare professional for personalized guidance."
	};
}
function BmiCalculator() {
	const [unit, setUnit] = (0, import_react.useState)("metric");
	const [weight, setWeight] = (0, import_react.useState)(70);
	const [height, setHeight] = (0, import_react.useState)(170);
	const bmi = (0, import_react.useMemo)(() => {
		if (unit === "metric") return weight / Math.pow(height / 100, 2);
		else return weight / Math.pow(height, 2) * 703;
	}, [
		weight,
		height,
		unit
	]);
	const cat = getBmiCategory(bmi);
	const barPct = Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "BMI Calculator",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: ["metric", "imperial"].map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setUnit(u),
						className: "min-h-[40px] flex-1 rounded-lg border px-3 text-sm font-medium capitalize transition-colors",
						style: {
							background: unit === u ? "var(--primary)" : "var(--surface-elevated)",
							borderColor: unit === u ? "transparent" : "var(--border)",
							color: unit === u ? "var(--background)" : "var(--muted-foreground)"
						},
						children: u === "metric" ? "Metric (kg/cm)" : "Imperial (lbs/in)"
					}, u))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm text-foreground",
						children: [
							"Weight (",
							unit === "metric" ? "kg" : "lbs",
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: weight,
						onChange: (e) => setWeight(Number(e.target.value)),
						className: "mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm text-foreground",
						children: [
							"Height (",
							unit === "metric" ? "cm" : "inches",
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: height,
						onChange: (e) => setHeight(Number(e.target.value)),
						className: "mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-4xl font-black",
							style: { color: cat.color },
							children: bmi.toFixed(1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-lg font-semibold",
							style: { color: cat.color },
							children: cat.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 h-3 rounded-full bg-surface-elevated relative overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full",
										style: {
											width: "33%",
											background: "rgba(88,166,255,0.3)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full",
										style: {
											width: "20%",
											background: "rgba(63,185,80,0.3)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full",
										style: {
											width: "17%",
											background: "rgba(210,153,34,0.3)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full flex-1",
										style: { background: "rgba(248,81,73,0.3)" }
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-0 h-full w-0.5 bg-white rounded-full transition-all duration-300",
								style: { left: `${barPct}%` }
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-[10px] text-muted-foreground mt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "15" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "18.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "25" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "30" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "40" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: cat.note
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted-foreground",
					children: "BMI is a screening tool, not a diagnostic measure."
				})
			]
		})
	});
}
//#endregion
export { BmiCalculator as component };
