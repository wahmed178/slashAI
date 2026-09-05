import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.equation-8-MdMafz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MathEquationRenderer() {
	const [latex, setLatex] = (0, import_react.useState)("\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}");
	const [rendered, setRendered] = (0, import_react.useState)(true);
	const containerRef = (0, import_react.useRef)(null);
	const loadKaTeX = () => {
		if (window.katex) return;
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
		document.head.appendChild(link);
		const script = document.createElement("script");
		script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
		script.onload = () => setRendered((r) => !r);
		document.head.appendChild(script);
	};
	loadKaTeX();
	const renderLatex = () => {
		try {
			const katex = window.katex;
			if (katex && containerRef.current) katex.render(latex, containerRef.current, {
				throwOnError: false,
				displayMode: true
			});
		} catch {}
	};
	(0, import_react.useState)(() => {
		setTimeout(renderLatex, 100);
	});
	const copyAs = async (type) => {
		let text = latex;
		if (type === "unicode") text = latex.replace(/\\frac\{(\d+)\}\{(\d+)\}/g, "$1/$2").replace(/[\\{}]/g, "").replace(/sqrt/, "√").replace(/pm/, "±").replace(/\^(\d+)/g, "^$1");
		try {
			await navigator.clipboard.writeText(text);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Math Equation Renderer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🔢 Math Equation Renderer"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Type LaTeX, see beautiful equations. Uses KaTeX (free, no server)."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: latex,
					onChange: (e) => {
						setLatex(e.target.value);
						setTimeout(renderLatex, 50);
					},
					placeholder: "Type LaTeX math notation...",
					className: "h-24 w-full rounded-xl border border-border bg-surface p-4 font-mono text-sm focus:outline-none focus:border-primary/50 resize-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-surface p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: containerRef,
						className: "text-center text-foreground min-h-[60px] flex items-center justify-center"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => copyAs("latex"),
						className: "flex-1 rounded-xl border border-border bg-surface py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
						children: "Copy LaTeX"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => copyAs("unicode"),
						className: "flex-1 rounded-xl border border-border bg-surface py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
						children: "Copy Unicode"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: "Quick Templates"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [
							{
								label: "Quadratic formula",
								tex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
							},
							{
								label: "Integral",
								tex: "\\int_{a}^{b} f(x) \\, dx"
							},
							{
								label: "Sum",
								tex: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}"
							},
							{
								label: "Matrix",
								tex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}"
							},
							{
								label: "Limit",
								tex: "\\lim_{x \\to \\infty} \\frac{1}{x} = 0"
							},
							{
								label: "Derivative",
								tex: "\\frac{d}{dx} x^n = nx^{n-1}"
							}
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setLatex(t.tex);
								setTimeout(renderLatex, 50);
							},
							className: "rounded-lg border border-border bg-surface-elevated p-2 text-left text-[11px] text-muted-foreground hover:text-foreground transition-colors",
							children: t.label
						}, t.label))
					})]
				})
			]
		})]
	});
}
//#endregion
export { MathEquationRenderer as component };
