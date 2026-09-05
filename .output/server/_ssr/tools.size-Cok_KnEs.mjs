import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.size-Cok_KnEs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var UNITS = [
	"Bytes",
	"KB",
	"MB",
	"GB",
	"TB",
	"PB"
];
var SPEEDS = [
	{
		label: "2G (50 Kbps)",
		mbps: .05
	},
	{
		label: "3G (1 Mbps)",
		mbps: 1
	},
	{
		label: "4G (25 Mbps)",
		mbps: 25
	},
	{
		label: "5G (200 Mbps)",
		mbps: 200
	},
	{
		label: "WiFi (50 Mbps)",
		mbps: 50
	},
	{
		label: "Fiber (500 Mbps)",
		mbps: 500
	}
];
var DEVICES = [
	{
		label: "16 GB Phone",
		gb: 16
	},
	{
		label: "128 GB Phone",
		gb: 128
	},
	{
		label: "1 TB Drive",
		gb: 1024
	}
];
var COMPARISONS = [
	{
		label: "Text page",
		bytes: 2e3
	},
	{
		label: "MP3 song (3 min)",
		bytes: 4e6
	},
	{
		label: "HD photo",
		bytes: 5e6
	},
	{
		label: "4K photo",
		bytes: 15e6
	},
	{
		label: "HD movie (720p)",
		bytes: 15e8
	},
	{
		label: "4K movie",
		bytes: 15e9
	},
	{
		label: "AAA game",
		bytes: 5e10
	}
];
function toBytes(value, unit) {
	const i = UNITS.indexOf(unit);
	return value * Math.pow(1024, i);
}
function formatDuration(seconds) {
	if (seconds < 60) return `${Math.round(seconds)}s`;
	if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
	return `${(seconds / 3600).toFixed(1)}h`;
}
function FileSizeCalculator() {
	const [value, setValue] = (0, import_react.useState)(1);
	const [unit, setUnit] = (0, import_react.useState)("MB");
	const bytes = (0, import_react.useMemo)(() => toBytes(value, unit), [value, unit]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "File Size Calculator",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📐 File Size Calculator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Convert between units, see download times, and real-world comparisons."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 0,
						step: .1,
						value,
						onChange: (e) => setValue(Number(e.target.value)),
						className: "flex-1 h-11 rounded-xl border border-border bg-surface px-4 text-lg font-semibold focus:outline-none focus:border-primary/50"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: unit,
						onChange: (e) => setUnit(e.target.value),
						className: "h-11 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary/50",
						children: UNITS.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: u,
							children: u
						}, u))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: "All Units"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: UNITS.map((u) => {
							const converted = bytes / Math.pow(1024, UNITS.indexOf(u));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-lg p-2 text-center ${u === unit ? "bg-primary/10 border border-primary/30" : "bg-surface-elevated"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold text-foreground",
									children: converted < .001 && u !== "Bytes" ? "0" : converted.toFixed(converted >= 100 ? 0 : 2)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: u
								})]
							}, u);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: "Download Time"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: SPEEDS.map((s) => {
							const seconds = bytes * 8 / (s.mbps * 1e6);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: s.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-foreground",
									children: isFinite(seconds) ? formatDuration(seconds) : "∞"
								})]
							}, s.label);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: "How Many Fit on a Device"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: DEVICES.map((d) => {
							const count = bytes > 0 ? Math.floor(d.gb * 1024 * 1024 * 1024 / bytes) : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: d.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-foreground",
									children: count.toLocaleString()
								})]
							}, d.label);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: "Real-World Comparison"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: COMPARISONS.map((c) => {
							const count = bytes > 0 ? (bytes / c.bytes).toFixed(1) : "0";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: c.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-medium text-foreground",
									children: ["≈ ", count]
								})]
							}, c.label);
						})
					})]
				})
			]
		})]
	});
}
//#endregion
export { FileSizeCalculator as component };
