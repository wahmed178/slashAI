import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.gst-calculator-pys4kZv2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatINR(n) {
	return "₹" + n.toFixed(2);
}
function GstCalculator() {
	const [mode, setMode] = (0, import_react.useState)("add");
	const [amount, setAmount] = (0, import_react.useState)(1e3);
	const [rate, setRate] = (0, import_react.useState)(18);
	const [customRate, setCustomRate] = (0, import_react.useState)("");
	const effectiveRate = customRate ? Number(customRate) : rate;
	const result = (0, import_react.useMemo)(() => {
		if (mode === "add") {
			const gst = amount * effectiveRate / 100;
			return {
				base: amount,
				gst,
				total: amount + gst
			};
		} else {
			const base = amount / (1 + effectiveRate / 100);
			return {
				base,
				gst: amount - base,
				total: amount
			};
		}
	}, [
		amount,
		effectiveRate,
		mode
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "GST Calculator",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: ["add", "remove"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setMode(m),
						className: "min-h-[40px] flex-1 rounded-lg border px-3 text-sm font-medium capitalize transition-colors",
						style: {
							background: mode === m ? "var(--primary)" : "var(--surface-elevated)",
							borderColor: mode === m ? "transparent" : "var(--border)",
							color: mode === m ? "var(--background)" : "var(--muted-foreground)"
						},
						children: m === "add" ? "Add GST" : "Remove GST"
					}, m))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm text-foreground",
						children: mode === "add" ? "Base amount" : "Amount (incl. GST)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: amount,
						onChange: (e) => setAmount(Number(e.target.value)),
						className: "mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm text-foreground font-mono focus:border-primary focus:outline-none"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm text-foreground mb-1 block",
						children: "GST Rate"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1.5 flex-wrap",
						children: [[
							5,
							12,
							18,
							28
						].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setRate(r);
								setCustomRate("");
							},
							className: "min-h-[36px] rounded-lg border px-3 text-xs font-medium transition-colors",
							style: {
								background: !customRate && rate === r ? "var(--primary)" : "var(--surface-elevated)",
								borderColor: !customRate && rate === r ? "transparent" : "var(--border)",
								color: !customRate && rate === r ? "var(--background)" : "var(--muted-foreground)"
							},
							children: [r, "%"]
						}, r)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							placeholder: "Custom %",
							value: customRate,
							onChange: (e) => setCustomRate(e.target.value),
							className: "h-9 w-20 rounded-lg border border-border bg-surface-elevated px-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
						})]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-5 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Base amount"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: formatINR(result.base)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									"GST (",
									effectiveRate,
									"%)"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-green",
								children: formatINR(result.gst)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border pt-3 flex justify-between text-lg font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: formatINR(result.total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-xs text-muted-foreground pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"CGST (",
								effectiveRate / 2,
								"%): ",
								formatINR(result.gst / 2)
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"SGST (",
								effectiveRate / 2,
								"%): ",
								formatINR(result.gst / 2)
							] })]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { GstCalculator as component };
