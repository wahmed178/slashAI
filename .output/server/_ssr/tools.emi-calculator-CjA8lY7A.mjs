import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.emi-calculator-CjA8lY7A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatINR(n) {
	return "₹" + Math.round(n).toLocaleString("en-IN");
}
function EmiCalculator() {
	const [principal, setPrincipal] = (0, import_react.useState)(1e6);
	const [rate, setRate] = (0, import_react.useState)(8.5);
	const [tenure, setTenure] = (0, import_react.useState)(20);
	const result = (0, import_react.useMemo)(() => {
		const r = rate / 12 / 100;
		const n = tenure * 12;
		const emi = r > 0 ? principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : principal / n;
		return {
			emi,
			total: emi * n,
			interest: emi * n - principal
		};
	}, [
		principal,
		rate,
		tenure
	]);
	const principalPct = result.total > 0 ? principal / result.total * 100 : 50;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "EMI Calculator",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center justify-between text-sm text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loan amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-medium text-primary",
							children: formatINR(principal)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 1e4,
						max: 1e7,
						step: 1e4,
						value: principal,
						onChange: (e) => setPrincipal(Number(e.target.value)),
						className: "mt-2 w-full accent-primary"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center justify-between text-sm text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Annual interest rate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono font-medium text-primary",
							children: [rate, "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 1,
						max: 24,
						step: .5,
						value: rate,
						onChange: (e) => setRate(Number(e.target.value)),
						className: "mt-2 w-full accent-primary"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center justify-between text-sm text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loan tenure" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono font-medium text-primary",
							children: [tenure, " years"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 1,
						max: 30,
						value: tenure,
						onChange: (e) => setTenure(Number(e.target.value)),
						className: "mt-2 w-full accent-primary"
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-5 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto size-40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 120 120",
							className: "size-full -rotate-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "60",
								cy: "60",
								r: "50",
								fill: "none",
								stroke: "var(--surface-elevated)",
								strokeWidth: "14"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "60",
								cy: "60",
								r: "50",
								fill: "none",
								stroke: "var(--primary)",
								strokeWidth: "14",
								strokeDasharray: `${principalPct * 3.14} ${(100 - principalPct) * 3.14}`,
								strokeLinecap: "round"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 flex flex-col items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-bold text-primary",
								children: formatINR(result.emi)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: "Monthly EMI"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["Principal: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: formatINR(principal)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["Total interest: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-green",
									children: formatINR(result.interest)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["Total payable: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: formatINR(result.total)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex justify-center gap-4 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-2 rounded-full bg-primary" }), " Principal"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-2 rounded-full bg-green" }), " Interest"]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { EmiCalculator as component };
