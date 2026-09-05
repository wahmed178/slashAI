import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.sip-calculator-D1PoIJ0b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatINR(n) {
	return "₹" + Math.round(n).toLocaleString("en-IN");
}
function SipCalculator() {
	const [monthly, setMonthly] = (0, import_react.useState)(5e3);
	const [rate, setRate] = (0, import_react.useState)(12);
	const [years, setYears] = (0, import_react.useState)(10);
	const result = (0, import_react.useMemo)(() => {
		const r = rate / 12 / 100;
		const n = years * 12;
		const invested = monthly * n;
		const future = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : invested;
		return {
			invested,
			returns: future - invested,
			total: future
		};
	}, [
		monthly,
		rate,
		years
	]);
	const invPct = result.total > 0 ? result.invested / result.total * 100 : 50;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "SIP Calculator",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between text-sm text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly investment" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-medium text-primary",
								children: formatINR(monthly)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 500,
							max: 1e5,
							step: 500,
							value: monthly,
							onChange: (e) => setMonthly(Number(e.target.value)),
							className: "mt-2 w-full accent-primary"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between text-sm text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Expected annual return" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono font-medium text-primary",
								children: [rate, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 1,
							max: 30,
							value: rate,
							onChange: (e) => setRate(Number(e.target.value)),
							className: "mt-2 w-full accent-primary"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between text-sm text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Investment period" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono font-medium text-primary",
								children: [years, " years"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 1,
							max: 40,
							value: years,
							onChange: (e) => setYears(Number(e.target.value)),
							className: "mt-2 w-full accent-primary"
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
									strokeDasharray: `${invPct * 3.14} ${(100 - invPct) * 3.14}`,
									strokeLinecap: "round"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 flex flex-col items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg font-bold text-primary",
									children: formatINR(result.total)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "Total value"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["Total invested: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: formatINR(result.invested)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["Estimated returns: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-green",
									children: formatINR(result.returns)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex justify-center gap-4 text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-2 rounded-full bg-primary" }), " Invested"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-2 rounded-full bg-green" }), " Returns"]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted-foreground",
					children: "Estimated returns based on assumed rate. Actual returns may vary. Not financial advice."
				})
			]
		})
	});
}
//#endregion
export { SipCalculator as component };
