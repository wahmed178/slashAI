import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.unit-converter-LI0qkfoD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = {
	"Temperature": {
		units: [
			"Celsius",
			"Fahrenheit",
			"Kelvin"
		],
		convert: (v, from, to) => {
			const c = from === "Celsius" ? v : from === "Fahrenheit" ? (v - 32) * 5 / 9 : v - 273.15;
			return to === "Celsius" ? c : to === "Fahrenheit" ? c * 9 / 5 + 32 : c + 273.15;
		}
	},
	"Length": {
		units: [
			"mm",
			"cm",
			"m",
			"km",
			"in",
			"ft",
			"yd",
			"mi"
		],
		factor: {
			mm: .001,
			cm: .01,
			m: 1,
			km: 1e3,
			in: .0254,
			ft: .3048,
			yd: .9144,
			mi: 1609.344
		}
	},
	"Weight": {
		units: [
			"mg",
			"g",
			"kg",
			"lb",
			"oz",
			"ton"
		],
		factor: {
			mg: 1e-6,
			g: .001,
			kg: 1,
			lb: .453592,
			oz: .0283495,
			ton: 907.185
		}
	},
	"Area": {
		units: [
			"mm²",
			"cm²",
			"m²",
			"km²",
			"in²",
			"ft²",
			"acre",
			"hectare"
		],
		factor: {
			"mm²": 1e-6,
			"cm²": 1e-4,
			"m²": 1,
			"km²": 1e6,
			"in²": 645e-6,
			"ft²": .0929,
			acre: 4046.86,
			hectare: 1e4
		}
	},
	"Volume": {
		units: [
			"ml",
			"L",
			"gal",
			"cup",
			"fl oz",
			"tbsp",
			"tsp"
		],
		factor: {
			ml: .001,
			L: 1,
			gal: 3.78541,
			cup: .236588,
			"fl oz": .0295735,
			tbsp: .0147868,
			tsp: .00492892
		}
	},
	"Speed": {
		units: [
			"m/s",
			"km/h",
			"mph",
			"knot",
			"mach"
		],
		factor: {
			"m/s": 1,
			"km/h": .277778,
			mph: .44704,
			knot: .514444,
			mach: 343
		}
	},
	"Data": {
		units: [
			"B",
			"KB",
			"MB",
			"GB",
			"TB",
			"PB"
		],
		factor: {
			B: 1,
			KB: 1024,
			MB: 1048576,
			GB: 1073741824,
			TB: 1099511627776,
			PB: 0x4000000000000
		}
	}
};
function UnitConverter() {
	const [category, setCategory] = (0, import_react.useState)("Length");
	const [fromUnit, setFromUnit] = (0, import_react.useState)("m");
	const [toUnit, setToUnit] = (0, import_react.useState)("ft");
	const [value, setValue] = (0, import_react.useState)("1");
	const config = CATEGORIES[category];
	const result = (0, import_react.useMemo)(() => {
		const v = parseFloat(value);
		if (isNaN(v)) return "";
		if ("convert" in config && config.convert) return config.convert(v, fromUnit, toUnit).toFixed(4);
		const factors = config.factor;
		return (v * (factors[fromUnit] || 1) / (factors[toUnit] || 1)).toFixed(6);
	}, [
		value,
		fromUnit,
		toUnit,
		config
	]);
	const switchUnits = () => {
		setFromUnit(toUnit);
		setToUnit(fromUnit);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Unit Converter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📐 Unit Converter"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Convert between temperature, length, weight, area, volume, speed, and data units."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto pb-1",
				style: { scrollbarWidth: "none" },
				children: Object.keys(CATEGORIES).map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setCategory(cat);
						const units = CATEGORIES[cat].units;
						setFromUnit(units[0] ?? "");
						setToUnit(units[1] ?? "");
					},
					className: `shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${category === cat ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
					children: cat
				}, cat))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground mb-1 block",
						children: "From"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value,
							onChange: (e) => setValue(e.target.value),
							className: "flex-1 h-11 rounded-lg border border-border bg-surface-elevated px-3 text-lg font-semibold focus:outline-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: fromUnit,
							onChange: (e) => setFromUnit(e.target.value),
							className: "h-11 rounded-lg border border-border bg-surface-elevated px-3 text-sm",
							children: config.units.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: u,
								children: u
							}, u))
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: switchUnits,
							className: "size-9 rounded-full border border-border bg-surface-elevated flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
							children: "⇅"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground mb-1 block",
						children: "To"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 h-11 rounded-lg border border-primary/30 bg-primary/5 px-3 flex items-center text-lg font-semibold text-primary",
							children: result
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: toUnit,
							onChange: (e) => setToUnit(e.target.value),
							className: "h-11 rounded-lg border border-border bg-surface-elevated px-3 text-sm",
							children: config.units.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: u,
								children: u
							}, u))
						})]
					})] })
				]
			})]
		})]
	});
}
//#endregion
export { UnitConverter as component };
