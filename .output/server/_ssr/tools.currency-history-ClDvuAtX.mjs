import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.currency-history-ClDvuAtX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAIRS = [
	"USD/INR",
	"EUR/INR",
	"AED/INR",
	"GBP/INR",
	"USD/EUR",
	"USD/GBP"
];
var PERIODS = [
	{
		label: "1W",
		days: 7
	},
	{
		label: "1M",
		days: 30
	},
	{
		label: "3M",
		days: 90
	},
	{
		label: "1Y",
		days: 365
	}
];
function CurrencyHistory() {
	const [pair, setPair] = (0, import_react.useState)("USD/INR");
	const [period, setPeriod] = (0, import_react.useState)(30);
	const [rates, setRates] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const [base, quote] = pair.split("/");
		const end = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		const start = (/* @__PURE__ */ new Date(Date.now() - period * 864e5)).toISOString().split("T")[0];
		setLoading(true);
		fetch(`https://api.frankfurter.app/${start}..${end}?from=${base}&to=${quote}`).then((r) => r.json()).then((data) => {
			setRates(data.rates || {});
			setLoading(false);
		}).catch(() => setLoading(false));
	}, [pair, period]);
	const entries = Object.entries(rates).sort(([a], [b]) => a.localeCompare(b));
	const values = entries.map(([, v]) => {
		return Object.values(v)[0] || 0;
	});
	const current = values.length > 0 ? values[values.length - 1] : 0;
	const high = values.length > 0 ? Math.max(...values) : 0;
	const low = values.length > 0 ? Math.min(...values) : 0;
	const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
	const maxVal = high || 1;
	const minVal = low || 0;
	const range = maxVal - minVal || 1;
	const buildPath = () => {
		if (values.length < 2) return "";
		const w = 100;
		const h = 60;
		return values.map((v, i) => {
			const x = i / (values.length - 1) * w;
			const y = h - (v - minVal) / range * h;
			return `${i === 0 ? "M" : "L"}${x},${y}`;
		}).join(" ");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Currency Rate History",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "💱 Currency Rate History"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Exchange rate charts powered by Frankfurter API (free, no key)."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-1",
					style: { scrollbarWidth: "none" },
					children: PAIRS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setPair(p),
						className: `shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${pair === p ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
						children: p
					}, p))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: PERIODS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setPeriod(p.days),
						className: `flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${period === p.days ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
						children: p.label
					}, p.days))
				}),
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground",
					children: "Loading rates..."
				}) : values.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground",
					children: "No data available"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-4 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-surface p-3 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold text-foreground",
									children: (current ?? 0).toFixed(2)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "Current"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-surface p-3 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold text-green",
									children: high.toFixed(2)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "High"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-surface p-3 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold text-red-400",
									children: low.toFixed(2)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "Low"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-surface p-3 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold text-foreground",
									children: avg.toFixed(2)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "Average"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 100 60",
							className: "w-full h-40",
							preserveAspectRatio: "none",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "grad",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "var(--primary)",
										stopOpacity: "0.3"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "var(--primary)",
										stopOpacity: "0"
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: `${buildPath()} L100,60 L0,60 Z`,
									fill: "url(#grad)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: buildPath(),
									fill: "none",
									stroke: "var(--primary)",
									strokeWidth: "0.5"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground text-center",
						children: [
							"Data: Frankfurter API · ",
							entries.length,
							" data points"
						]
					})
				] })
			]
		})]
	});
}
//#endregion
export { CurrencyHistory as component };
