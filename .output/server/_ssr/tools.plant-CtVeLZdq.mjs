import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.plant-CtVeLZdq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LS_KEY = "slashai.plants";
function PlantTracker() {
	const [plants, setPlants] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
		} catch {
			return [];
		}
	});
	const [name, setName] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("");
	const [waterDays, setWaterDays] = (0, import_react.useState)("7");
	const [showAdd, setShowAdd] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(LS_KEY, JSON.stringify(plants));
		} catch {}
	}, [plants]);
	const addPlant = () => {
		if (!name.trim()) return;
		setPlants((p) => [...p, {
			id: crypto.randomUUID(),
			name: name.trim(),
			type: type.trim() || "Unknown",
			waterDays: parseInt(waterDays) || 7,
			lastWatered: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			notes: ""
		}]);
		setName("");
		setType("");
		setShowAdd(false);
	};
	const waterPlant = (id) => setPlants((p) => p.map((pl) => pl.id === id ? {
		...pl,
		lastWatered: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
	} : pl));
	const removePlant = (id) => setPlants((p) => p.filter((pl) => pl.id !== id));
	const getDaysUntilWater = (plant) => {
		const last = new Date(plant.lastWatered);
		const daysSince = Math.floor(((/* @__PURE__ */ new Date()).getTime() - last.getTime()) / 864e5);
		return plant.waterDays - daysSince;
	};
	const needsWater = plants.filter((p) => getDaysUntilWater(p) <= 0);
	const upcoming = plants.filter((p) => getDaysUntilWater(p) > 0).sort((a, b) => getDaysUntilWater(a) - getDaysUntilWater(b));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Plant Care",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "mb-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight text-foreground",
						children: "🌱 Plant Care Tracker"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Track when to water your plants."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowAdd(!showAdd),
						className: "h-8 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground",
						children: "+ Add Plant"
					})]
				})
			}),
			showAdd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 rounded-xl border border-border bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Plant name",
							className: "h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: type,
							onChange: (e) => setType(e.target.value),
							placeholder: "Type (e.g. Fern)",
							className: "h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: waterDays,
							onChange: (e) => setWaterDays(e.target.value),
							placeholder: "Water every X days",
							className: "h-8 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: addPlant,
					className: "mt-2 h-8 w-full rounded-lg bg-primary text-xs font-semibold text-primary-foreground",
					children: "Add"
				})]
			}),
			needsWater.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-xs font-semibold text-red-400",
					children: [
						"🚿 Needs Water (",
						needsWater.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: needsWater.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/5 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground",
							children: p.type
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => waterPlant(p.id),
							className: "rounded-lg bg-green-500/20 px-2.5 py-1 text-[10px] font-medium text-green-400",
							children: "💧 Watered"
						})]
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-2 text-xs font-semibold text-foreground",
				children: [
					"All Plants (",
					plants.length,
					")"
				]
			}), plants.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-10 text-center text-sm text-muted-foreground",
				children: "No plants yet. Add one above."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
				children: [...needsWater, ...upcoming].map((p) => {
					const days = getDaysUntilWater(p);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-foreground",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground",
									children: [
										p.type,
										" · every ",
										p.waterDays,
										" days"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removePlant(p.id),
									className: "text-xs text-muted-foreground hover:text-red-400",
									children: "×"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `mt-2 text-xs font-medium ${days <= 0 ? "text-red-400" : days <= 2 ? "text-yellow-400" : "text-green-400"}`,
								children: days <= 0 ? "Needs water now!" : `${days} day${days !== 1 ? "s" : ""} until water`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => waterPlant(p.id),
								className: "mt-2 h-7 w-full rounded-lg bg-surface-elevated text-[10px] text-muted-foreground hover:text-foreground",
								children: "💧 Mark as watered"
							})
						]
					}, p.id);
				})
			})] })
		]
	});
}
//#endregion
export { PlantTracker as component };
