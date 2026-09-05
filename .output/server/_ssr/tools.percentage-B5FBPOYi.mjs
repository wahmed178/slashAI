import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.percentage-B5FBPOYi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PercentageCalc() {
	const [mode, setMode] = (0, import_react.useState)(0);
	const [a, setA] = (0, import_react.useState)(25);
	const [b, setB] = (0, import_react.useState)(200);
	const result = (() => {
		if (mode === 0) return a / 100 * b;
		if (mode === 1) return b !== 0 ? a / b * 100 : 0;
		return b !== 0 ? (b - a) / a * 100 : 0;
	})();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Percentage Calculator",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 overflow-x-auto",
					children: [
						"What is X% of Y?",
						"X is what % of Y?",
						"% change from X to Y"
					].map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setMode(i),
						className: "min-h-[40px] shrink-0 rounded-lg border px-3 text-xs font-medium transition-colors",
						style: {
							background: mode === i ? "var(--primary)" : "var(--surface-elevated)",
							borderColor: mode === i ? "transparent" : "var(--border)",
							color: mode === i ? "var(--background)" : "var(--muted-foreground)"
						},
						children: l
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] text-muted-foreground",
							children: mode === 2 ? "From (X)" : mode === 0 ? "X (%)" : "X"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: a,
							onChange: (e) => setA(Number(e.target.value)),
							className: "mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] text-muted-foreground",
							children: mode === 0 ? "Y" : mode === 1 ? "of Y" : "To (Y)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: b,
							onChange: (e) => setB(Number(e.target.value)),
							className: "mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
						})] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-5 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-3xl font-bold text-primary",
						children: mode === 1 ? `${result.toFixed(2)}%` : result.toFixed(2)
					}), mode === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						style: { color: result >= 0 ? "#3fb950" : "#f85149" },
						children: result >= 0 ? "▲ Increase" : "▼ Decrease"
					})]
				})
			]
		})
	});
}
//#endregion
export { PercentageCalc as component };
