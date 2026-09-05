import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Qt as Flame, X as Plus, y as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.habits-COa1OIH6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"#2dd4bf",
	"#58a6ff",
	"#3fb950",
	"#d29922",
	"#f85149",
	"#bc8cff",
	"#f778ba",
	"#ff9a3c"
];
function dateKey(d) {
	return d.toISOString().slice(0, 10);
}
function today() {
	return dateKey(/* @__PURE__ */ new Date());
}
function getStreak(days) {
	let streak = 0;
	const d = /* @__PURE__ */ new Date();
	while (days[dateKey(d)]) {
		streak++;
		d.setDate(d.getDate() - 1);
	}
	return streak;
}
function ContributionGrid({ days, color }) {
	const weeks = [];
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() - 83);
	d.setDate(d.getDate() - d.getDay());
	for (let w = 0; w < 12; w++) {
		const week = [];
		for (let day = 0; day < 7; day++) {
			week.push(dateKey(d));
			d.setDate(d.getDate() + 1);
		}
		weeks.push(week);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-[3px]",
		children: weeks.map((week, wi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-[3px]",
			children: week.map((dk) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "size-[14px] rounded-[2px] transition-colors",
				style: {
					background: days[dk] ? color : "var(--surface-elevated, #1c2128)",
					opacity: dk > today() ? .3 : 1
				},
				title: dk
			}, dk))
		}, wi))
	});
}
function HabitTracker() {
	const [habits, setHabits] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("habits") || "[]");
		} catch {
			return [];
		}
	});
	const [newName, setNewName] = (0, import_react.useState)("");
	const [newColor, setNewColor] = (0, import_react.useState)(COLORS[0]);
	const save = (next) => {
		setHabits(next);
		try {
			localStorage.setItem("habits", JSON.stringify(next));
		} catch {}
	};
	const addHabit = () => {
		if (!newName.trim()) return;
		const c = newColor || COLORS[0];
		save([...habits, {
			id: crypto.randomUUID(),
			name: newName.trim(),
			color: c,
			days: {}
		}]);
		setNewName("");
	};
	const toggleDay = (id, date) => {
		save(habits.map((h) => h.id === id ? {
			...h,
			days: {
				...h.days,
				[date]: !h.days[date]
			}
		} : h));
	};
	const removeHabit = (id) => save(habits.filter((h) => h.id !== id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Habit Tracker",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-6 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "Habit Tracker"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Build consistency — track habits with a visual grid."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: newName,
							onChange: (e) => setNewName(e.target.value),
							onKeyDown: (e) => e.key === "Enter" && addHabit(),
							placeholder: "New habit (e.g., Read 30 min)",
							className: "h-10 flex-1 rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setNewColor(c),
								className: "size-6 rounded-full border-2",
								style: {
									background: c,
									borderColor: c === newColor ? "#f0f6fc" : "transparent"
								}
							}, c))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: addHabit,
							className: "flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm text-white hover:bg-primary/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [habits.map((h) => {
						const streak = getStreak(h.days);
						const todayDone = h.days[today()];
						const completedDays = Object.values(h.days).filter(Boolean).length;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[10px] border border-border bg-surface p-4 transition-all hover:border-[#484f58]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleDay(h.id, today()),
										className: `flex size-9 items-center justify-center rounded-lg border-2 transition-all ${todayDone ? "border-transparent text-white" : "border-border bg-surface-elevated text-muted-foreground hover:border-[#484f58]"}`,
										style: todayDone ? { background: h.color } : {},
										children: todayDone ? "✓" : ""
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-foreground",
										children: h.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-muted-foreground",
										children: [completedDays, " days total"]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [streak > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 text-xs text-yellow",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5" }),
											" ",
											streak,
											" day streak"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeHabit(h.id),
										className: "text-muted-foreground hover:text-red",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContributionGrid, {
								days: h.days,
								color: h.color
							})]
						}, h.id);
					}), habits.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-12 text-center text-sm text-muted-foreground",
						children: "No habits yet. Add one above to start tracking!"
					})]
				})
			]
		})
	});
}
//#endregion
export { HabitTracker as component };
