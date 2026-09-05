import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.habit-stack-DCThC20B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STACK_LABELS = {
	morning: {
		label: "Morning",
		icon: "🌅"
	},
	evening: {
		label: "Evening",
		icon: "🌙"
	},
	work: {
		label: "Work",
		icon: "💼"
	}
};
function HabitStackingPlanner() {
	const [activeStack, setActiveStack] = (0, import_react.useState)("morning");
	const [stacks, setStacks] = (0, import_react.useState)({
		morning: [{
			id: 1,
			habit: "Wake up",
			reward: "Glass of water"
		}, {
			id: 2,
			habit: "Drink water",
			reward: "Stretch for 2 min"
		}],
		evening: [{
			id: 1,
			habit: "Put phone away",
			reward: "Read for 10 min"
		}],
		work: [{
			id: 1,
			habit: "Open laptop",
			reward: "Review task list"
		}]
	});
	const [completedToday, setCompletedToday] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("slashai.habit-stack.done") || "{}");
		} catch {
			return {};
		}
	});
	const [habit, setHabit] = (0, import_react.useState)("");
	const [reward, setReward] = (0, import_react.useState)("");
	const addItem = (0, import_react.useCallback)(() => {
		if (!habit.trim()) return;
		setStacks((s) => ({
			...s,
			[activeStack]: [...s[activeStack], {
				id: Date.now(),
				habit: habit.trim(),
				reward: reward.trim() || "None"
			}]
		}));
		setHabit("");
		setReward("");
	}, [
		habit,
		reward,
		activeStack
	]);
	const removeItem = (id) => {
		setStacks((s) => ({
			...s,
			[activeStack]: s[activeStack].filter((i) => i.id !== id)
		}));
	};
	const toggleDone = (key) => {
		setCompletedToday((prev) => {
			const next = {
				...prev,
				[key]: !prev[key]
			};
			try {
				localStorage.setItem("slashai.habit-stack.done", JSON.stringify(next));
			} catch {}
			return next;
		});
	};
	const currentItems = stacks[activeStack];
	const doneCount = currentItems.filter((item) => completedToday[`${activeStack}-${item.id}`]).length;
	const streak = Object.keys(completedToday).length > 0 ? Math.min(7, Object.keys(completedToday).filter((k) => k.startsWith(activeStack)).length) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Habit Stacking Planner",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📋 Habit Stacking Planner"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Design routines based on Atomic Habits — \"After I [habit], I will [new habit].\""
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: Object.keys(STACK_LABELS).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveStack(key),
						className: `flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${activeStack === key ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
						children: [
							STACK_LABELS[key].icon,
							" ",
							STACK_LABELS[key].label
						]
					}, key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-2xl font-bold text-foreground",
							children: [
								doneCount,
								"/",
								currentItems.length
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground",
							children: "Completed Today"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold text-primary",
							children: streak
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground",
							children: "Day Streak"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-3",
						children: [
							STACK_LABELS[activeStack].icon,
							" ",
							STACK_LABELS[activeStack].label,
							" Stack"
						]
					}), currentItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground text-center py-4",
						children: "No habits yet. Add your first habit below."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: currentItems.map((item, idx) => {
							const key = `${activeStack}-${item.id}`;
							const done = completedToday[key];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleDone(key),
										className: `flex size-7 shrink-0 items-center justify-center rounded-lg border text-sm transition-colors ${done ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-surface-elevated text-muted-foreground hover:border-primary/30"}`,
										children: done ? "✓" : idx + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: `text-sm font-medium ${done ? "text-muted-foreground line-through" : "text-foreground"}`,
											children: [idx === 0 ? "" : "After ", item.habit]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground",
											children: ["→ Reward: ", item.reward]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeItem(item.id),
										className: "shrink-0 text-xs text-muted-foreground hover:text-red-400",
										children: "✕"
									}),
									idx < currentItems.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[27px] mt-8 w-px h-2 bg-border" })
								]
							}, item.id);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Add to stack"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: habit,
							onChange: (e) => setHabit(e.target.value),
							placeholder: "After I [existing habit]...",
							className: "h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none focus:border-primary/50",
							onKeyDown: (e) => e.key === "Enter" && addItem()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: reward,
							onChange: (e) => setReward(e.target.value),
							placeholder: "Then reward myself with [optional]...",
							className: "h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none focus:border-primary/50",
							onKeyDown: (e) => e.key === "Enter" && addItem()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addItem,
							disabled: !habit.trim(),
							className: "w-full rounded-lg bg-primary py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
							children: "Add Habit"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { HabitStackingPlanner as component };
