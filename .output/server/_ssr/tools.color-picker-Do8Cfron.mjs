import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.color-picker-Do8Cfron.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function hexToRgb(hex) {
	const m = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
	return m ? {
		r: parseInt(m[1] ?? "0", 16),
		g: parseInt(m[2] ?? "0", 16),
		b: parseInt(m[3] ?? "0", 16)
	} : null;
}
function rgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h = 0, s = 0, l = (max + min) / 2;
	if (max !== min) {
		const d = max - min;
		s = l > .5 ? d / (2 - max - min) : d / (max + min);
		if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
		else if (max === g) h = ((b - r) / d + 2) / 6;
		else h = ((r - g) / d + 4) / 6;
	}
	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100)
	};
}
function luminance(r, g, b) {
	const [rs, gs, bs] = [
		r,
		g,
		b
	].map((c) => {
		c /= 255;
		return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
	});
	return .2126 * rs + .7152 * gs + .0722 * bs;
}
function contrastRatio(rgb1, rgb2) {
	const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
	const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);
	const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
	return (lighter + .05) / (darker + .05);
}
function ColorPicker() {
	const [color, setColor] = (0, import_react.useState)("#58a6ff");
	const [bgColor, setBgColor] = (0, import_react.useState)("#0d1117");
	const [copied, setCopied] = (0, import_react.useState)("");
	const rgb = (0, import_react.useMemo)(() => hexToRgb(color) || {
		r: 0,
		g: 0,
		b: 0
	}, [color]);
	const hsl = (0, import_react.useMemo)(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);
	const bgRgb = (0, import_react.useMemo)(() => hexToRgb(bgColor) || {
		r: 0,
		g: 0,
		b: 0
	}, [bgColor]);
	const ratio = (0, import_react.useMemo)(() => contrastRatio(rgb, bgRgb), [rgb, bgRgb]);
	const rating = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA Large" : "Fail";
	const copy = (text, label) => {
		navigator.clipboard.writeText(text);
		setCopied(label);
		setTimeout(() => setCopied(""), 1200);
	};
	const palettes = (0, import_react.useMemo)(() => {
		const base = hsl.h;
		return {
			complementary: `hsl(${(base + 180) % 360}, ${hsl.s}%, ${hsl.l}%)`,
			analogous1: `hsl(${(base + 30) % 360}, ${hsl.s}%, ${hsl.l}%)`,
			analogous2: `hsl(${(base - 30 + 360) % 360}, ${hsl.s}%, ${hsl.l}%)`,
			triadic1: `hsl(${(base + 120) % 360}, ${hsl.s}%, ${hsl.l}%)`,
			triadic2: `hsl(${(base + 240) % 360}, ${hsl.s}%, ${hsl.l}%)`
		};
	}, [hsl]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Color Picker",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🎨 Color Picker"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Pick colors, convert formats, check contrast ratio, generate palettes."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "color",
						value: color,
						onChange: (e) => setColor(e.target.value),
						className: "size-16 rounded-xl border border-border cursor-pointer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: color,
							onChange: (e) => setColor(e.target.value),
							className: "w-full h-8 rounded-lg border border-border bg-surface px-2 font-mono text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"RGB(",
								rgb.r,
								", ",
								rgb.g,
								", ",
								rgb.b,
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"HSL(",
								hsl.h,
								"°, ",
								hsl.s,
								"%, ",
								hsl.l,
								"%)"
							] })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						"HEX",
						"RGB",
						"HSL",
						"CSS"
					].map((label) => {
						const val = {
							HEX: color,
							RGB: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
							HSL: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
							CSS: `--color: ${color};`
						}[label] ?? "";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => copy(val, label),
							className: "rounded-lg border border-border bg-surface p-2 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-mono text-foreground truncate",
								children: copied === label ? "✓ Copied" : val
							})]
						}, label);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-muted-foreground mb-2",
							children: "Contrast Checker"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 items-center mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] text-muted-foreground",
									children: "FG"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "color",
									value: color,
									onChange: (e) => setColor(e.target.value),
									className: "size-6 rounded"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] text-muted-foreground",
									children: "BG"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "color",
									value: bgColor,
									onChange: (e) => setBgColor(e.target.value),
									className: "size-6 rounded"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg p-3 text-center",
							style: {
								backgroundColor: bgColor,
								color
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-bold",
								children: "Sample Text Aa"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: ratio.toFixed(2)
								}),
								" · ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: rating === "Fail" ? "text-red-400" : "text-green",
									children: rating
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: "Color Palette"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: Object.entries(palettes).map(([name, hex]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => copy(hex, name),
							className: "flex-1 rounded-lg h-12 transition-transform hover:scale-105",
							style: { backgroundColor: hex },
							title: name
						}, name))
					})]
				})
			]
		})]
	});
}
//#endregion
export { ColorPicker as component };
