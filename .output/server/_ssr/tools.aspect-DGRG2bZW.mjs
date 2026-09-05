import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.aspect-DGRG2bZW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RATIOS = [
	"16:9",
	"4:3",
	"1:1",
	"9:16",
	"21:9",
	"4:5",
	"3:2",
	"5:4"
];
function AspectRatioCalc() {
	const [w, setW] = (0, import_react.useState)("");
	const [h, setH] = (0, import_react.useState)("");
	const [ratio, setRatio] = (0, import_react.useState)("");
	const width = parseFloat(w) || 0;
	const height = parseFloat(h) || 0;
	const [rw, rh] = ratio ? ratio.split(":").map(Number) : [0, 0];
	if (width && !height && rw && rh) Math.round(width * rh / rw);
	else if (!width && height && rw && rh) Math.round(height * rw / rh);
	else if (width && height) {
		const gcd = (a, b) => b ? gcd(b, a % b) : a;
		gcd(width, height);
	}
	const detectedRatio = width && height ? (() => {
		const gcd = (a, b) => b ? gcd(b, a % b) : a;
		const g = gcd(width, height);
		return `${width / g}:${height / g}`;
	})() : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Aspect Ratio",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📐 Aspect Ratio Calculator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Input any two values — get the third instantly."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs text-muted-foreground",
							children: "Width (px)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: w,
							onChange: (e) => {
								setW(e.target.value);
								setRatio("");
							},
							placeholder: "1920",
							className: "h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm font-mono focus:border-primary/60 focus:outline-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs text-muted-foreground",
							children: "Height (px)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: h,
							onChange: (e) => {
								setH(e.target.value);
								setRatio("");
							},
							placeholder: "1080",
							className: "h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm font-mono focus:border-primary/60 focus:outline-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs text-muted-foreground",
							children: "Ratio"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: ratio,
							onChange: (e) => {
								setRatio(e.target.value);
								setW("");
								setH("");
							},
							placeholder: "16:9",
							className: "h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm font-mono focus:border-primary/60 focus:outline-none"
						})] })
					]
				}),
				(detectedRatio || ratio) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-primary/30 bg-primary/5 p-4 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-bold text-foreground",
						children: detectedRatio || ratio
					}), width && height && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							width,
							"×",
							height,
							" pixels"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-foreground",
					children: "Common Ratios"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-1.5",
					children: RATIOS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setRatio(r);
							if (width) {
								const parts = r.split(":");
								const rw = Number(parts[0]);
								const rh = Number(parts[1]);
								if (rw && rh) setH(String(Math.round(width * rh / rw)));
							}
						},
						className: "rounded-lg border border-border bg-surface px-2 py-2 text-center text-xs transition-colors hover:border-primary/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: r
						})
					}, r))
				})] })
			]
		})]
	});
}
//#endregion
export { AspectRatioCalc as component };
