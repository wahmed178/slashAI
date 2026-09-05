import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.gradient-BNoVl8qe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRESETS = [
	{
		name: "Sunset",
		colors: ["#ff512f", "#f09819"]
	},
	{
		name: "Ocean",
		colors: ["#2193b0", "#6dd5ed"]
	},
	{
		name: "Purple",
		colors: ["#667eea", "#764ba2"]
	},
	{
		name: "Emerald",
		colors: ["#11998e", "#38ef7d"]
	},
	{
		name: "Fire",
		colors: ["#f12711", "#f5af19"]
	},
	{
		name: "Night",
		colors: [
			"#0f0c29",
			"#302b63",
			"#24243e"
		]
	},
	{
		name: "Pink",
		colors: ["#ee9ca7", "#ffdde1"]
	},
	{
		name: "Cyan",
		colors: ["#00d2ff", "#3a7bd5"]
	}
];
function GradientGenerator() {
	const [colors, setColors] = (0, import_react.useState)(["#667eea", "#764ba2"]);
	const [angle, setAngle] = (0, import_react.useState)(135);
	const [type, setType] = (0, import_react.useState)("linear");
	const css = type === "linear" ? `background: linear-gradient(${angle}deg, ${colors.join(", ")});` : `background: radial-gradient(circle, ${colors.join(", ")});`;
	const tailwind = `bg-gradient-to-br from-[${colors[0]}] to-[${colors[1] || colors[0]}]`;
	const addColor = () => {
		if (colors.length < 5) setColors((c) => [...c, "#ffffff"]);
	};
	const updateColor = (i, val) => {
		const c = [...colors];
		c[i] = val;
		setColors(c);
	};
	const removeColor = (i) => {
		if (colors.length > 2) setColors((c) => c.filter((_, idx) => idx !== i));
	};
	const copy = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Gradient Generator",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🎨 CSS Gradient Generator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Pick colors, choose direction, copy as CSS or Tailwind."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-xs font-semibold text-foreground",
								children: "Colors"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1.5",
								children: colors.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "color",
											value: c,
											onChange: (e) => updateColor(i, e.target.value),
											className: "size-8 cursor-pointer rounded-lg border border-border"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: c,
											onChange: (e) => updateColor(i, e.target.value),
											className: "h-8 flex-1 rounded-lg border border-border bg-surface-elevated px-2 font-mono text-xs focus:outline-none"
										}),
										colors.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => removeColor(i),
											className: "text-xs text-muted-foreground hover:text-red-400",
											children: "×"
										})
									]
								}, i))
							}),
							colors.length < 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: addColor,
								className: "mt-2 h-7 w-full rounded-lg border border-dashed border-border text-[10px] text-muted-foreground",
								children: "+ Add color"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-1 block text-[10px] text-muted-foreground",
							children: [
								"Angle: ",
								angle,
								"°"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 360,
							value: angle,
							onChange: (e) => setAngle(Number(e.target.value)),
							className: "w-full"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-[10px] text-muted-foreground",
							children: "Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: ["linear", "radial"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setType(t),
								className: `flex-1 rounded-lg border px-2 py-1 text-[10px] ${type === t ? "border-primary text-primary" : "border-border text-muted-foreground"}`,
								children: t
							}, t))
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-medium text-foreground",
								children: "CSS"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => copy(css),
								className: "text-[10px] text-primary",
								children: "Copy"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "whitespace-pre-wrap rounded-lg bg-surface-elevated p-2 font-mono text-[10px] text-foreground",
							children: css
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-medium text-foreground",
								children: "Tailwind"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => copy(tailwind),
								className: "text-[10px] text-primary",
								children: "Copy"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "whitespace-pre-wrap rounded-lg bg-surface-elevated p-2 font-mono text-[10px] text-foreground",
							children: tailwind
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 rounded-2xl border border-border",
					style: { background: type === "linear" ? `linear-gradient(${angle}deg, ${colors.join(", ")})` : `radial-gradient(circle, ${colors.join(", ")})` }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-foreground",
					children: "Presets"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-1.5",
					children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setColors(p.colors),
						className: "group relative h-12 overflow-hidden rounded-lg border border-border transition-colors hover:border-primary/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0",
							style: { background: `linear-gradient(135deg, ${p.colors.join(", ")})` }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-x-0 bottom-0 bg-black/50 py-0.5 text-center text-[8px] text-white opacity-0 group-hover:opacity-100",
							children: p.name
						})]
					}, p.name))
				})] })]
			})]
		})]
	});
}
//#endregion
export { GradientGenerator as component };
