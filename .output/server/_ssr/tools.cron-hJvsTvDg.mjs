import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.cron-hJvsTvDg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRESETS = [
	{
		label: "Every minute",
		expr: "* * * * *"
	},
	{
		label: "Every hour",
		expr: "0 * * * *"
	},
	{
		label: "Every day at midnight",
		expr: "0 0 * * *"
	},
	{
		label: "Every day at 9 AM",
		expr: "0 9 * * *"
	},
	{
		label: "Every Monday",
		expr: "0 9 * * 1"
	},
	{
		label: "Weekdays at 9 AM",
		expr: "0 9 * * 1-5"
	},
	{
		label: "Every 1st of month",
		expr: "0 0 1 * *"
	},
	{
		label: "Every Sunday midnight",
		expr: "0 0 * * 0"
	}
];
var DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
function explainCron(expr) {
	const parts = expr.trim().split(/\s+/);
	if (parts.length !== 5) return "Invalid cron expression — expected 5 fields: minute hour day-of-month month day-of-week";
	const min = parts[0] ?? "*";
	const hour = parts[1] ?? "*";
	const dom = parts[2] ?? "*";
	const month = parts[3] ?? "*";
	const dow = parts[4] ?? "*";
	const bits = [];
	if (min === "*" && hour === "*" && dom === "*" && month === "*" && dow === "*") return "Every minute";
	if (min === "0" && hour === "*" && dom === "*" && month === "*" && dow === "*") return "Every hour, at minute 0";
	if (min === "0" && hour === "0" && dom === "*" && month === "*" && dow === "*") return "Every day at midnight";
	if (dow !== "*") if (dow.includes("-")) {
		const parts = dow.split("-").map(Number);
		const a = parts[0] ?? 0;
		const b = parts[1] ?? 6;
		const range = [];
		for (let i = a; i <= b; i++) range.push(DAYS[i % 7]);
		bits.push(`Every ${range.join(", ")}`);
	} else bits.push(`Every ${DAYS[Number(dow) % 7]}`);
	if (hour !== "*") if (hour.includes(",")) bits.push(`at hours ${hour}`);
	else bits.push(`at ${hour}:00`);
	else if (min !== "*") bits.push(`at minute ${min}`);
	if (dom !== "*") bits.push(`on day ${dom} of the month`);
	if (month !== "*") bits.push(`in month ${month}`);
	return bits.length > 0 ? bits.join(" ") : expr;
}
function CronExplainer() {
	const [expr, setExpr] = (0, import_react.useState)("0 9 * * 1-5");
	const explanation = (0, import_react.useMemo)(() => explainCron(expr), [expr]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Cron Explainer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "⏰ Cron Expression Explainer"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Type a cron expression → see it in plain English. Or pick a preset."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs text-muted-foreground",
					children: "Cron Expression (min hour dom month dow)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: expr,
					onChange: (e) => setExpr(e.target.value),
					placeholder: "0 9 * * 1-5",
					className: "h-10 w-full rounded-xl border border-border bg-surface px-4 font-mono text-sm focus:border-primary/60 focus:outline-none"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-primary/30 bg-primary/5 p-4 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-foreground",
						children: explanation
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-foreground",
					children: "Common Presets"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-1.5",
					children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setExpr(p.expr),
						className: "rounded-lg border border-border bg-surface px-3 py-2 text-left text-xs transition-colors hover:border-primary/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: p.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 font-mono text-[10px] text-muted-foreground",
							children: p.expr
						})]
					}, p.expr))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-3 text-[10px] text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-1 font-semibold text-foreground",
							children: ["Format: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "font-mono",
								children: "min hour dom month dow"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "min: 0-59 | hour: 0-23 | dom: 1-31 | month: 1-12 | dow: 0-6 (Sun-Sat)" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: "Use * for \"any\", commas for lists (1,3,5), ranges (1-5), steps (*/5)"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { CronExplainer as component };
