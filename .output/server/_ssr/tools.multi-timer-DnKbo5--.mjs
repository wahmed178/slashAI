import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { $ as Pause, U as RotateCcw, X as Plus, Z as Play, y as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.multi-timer-DnKbo5--.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MultiTimer() {
	const [timers, setTimers] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("multi_timers") || "[]");
		} catch {
			return [];
		}
	});
	const [newLabel, setNewLabel] = (0, import_react.useState)("");
	const [newMinutes, setNewMinutes] = (0, import_react.useState)(5);
	const intervalsRef = (0, import_react.useRef)({});
	const saveTimers = (0, import_react.useCallback)((next) => {
		setTimers(next);
		try {
			localStorage.setItem("multi_timers", JSON.stringify(next));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			Object.values(intervalsRef.current).forEach(clearInterval);
		};
	}, []);
	const addTimer = () => {
		const timer = {
			id: crypto.randomUUID(),
			label: newLabel || `Timer ${timers.length + 1}`,
			total: newMinutes * 60,
			remaining: newMinutes * 60,
			running: false
		};
		saveTimers([...timers, timer]);
		setNewLabel("");
	};
	const removeTimer = (id) => {
		if (intervalsRef.current[id]) {
			clearInterval(intervalsRef.current[id]);
			delete intervalsRef.current[id];
		}
		saveTimers(timers.filter((t) => t.id !== id));
	};
	const toggleTimer = (id) => {
		setTimers((prev) => prev.map((t) => {
			if (t.id !== id) return t;
			if (t.running) {
				clearInterval(intervalsRef.current[id]);
				delete intervalsRef.current[id];
				return {
					...t,
					running: false
				};
			}
			const interval = window.setInterval(() => {
				setTimers((current) => {
					return current.map((ct) => {
						if (ct.id !== id || !ct.running) return ct;
						if (ct.remaining <= 1) {
							clearInterval(intervalsRef.current[id]);
							delete intervalsRef.current[id];
							try {
								new Notification(`${ct.label} done!`);
							} catch {}
							try {
								const ctx = new AudioContext();
								const osc = ctx.createOscillator();
								osc.type = "sine";
								osc.frequency.value = 523;
								osc.connect(ctx.destination);
								osc.start();
								setTimeout(() => {
									osc.stop();
									ctx.close();
								}, 500);
							} catch {}
							return {
								...ct,
								remaining: 0,
								running: false
							};
						}
						return {
							...ct,
							remaining: ct.remaining - 1
						};
					});
				});
			}, 1e3);
			intervalsRef.current[id] = interval;
			return {
				...t,
				running: true
			};
		}));
	};
	const resetTimer = (id) => {
		if (intervalsRef.current[id]) {
			clearInterval(intervalsRef.current[id]);
			delete intervalsRef.current[id];
		}
		setTimers((prev) => prev.map((t) => t.id === id ? {
			...t,
			remaining: t.total,
			running: false
		} : t));
	};
	const format = (s) => {
		const h = Math.floor(s / 3600);
		const m = Math.floor(s % 3600 / 60);
		const sec = s % 60;
		if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
		return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Multi Timer",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-5 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "Multi Timer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Run multiple timers simultaneously — browser notifications when done."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: newLabel,
							onChange: (e) => setNewLabel(e.target.value),
							onKeyDown: (e) => e.key === "Enter" && addTimer(),
							placeholder: "Label (e.g., Pasta)",
							className: "h-10 flex-1 rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 1,
								max: 999,
								value: newMinutes,
								onChange: (e) => setNewMinutes(parseInt(e.target.value) || 1),
								className: "h-10 w-16 rounded-lg border border-border bg-surface px-2 text-center text-sm text-foreground focus:outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "min"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: addTimer,
							className: "flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm text-white hover:bg-primary/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [timers.map((t) => {
						const pct = t.total > 0 ? (t.total - t.remaining) / t.total * 100 : 0;
						const isDone = t.remaining === 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded-[10px] border bg-surface p-4 transition-all ${isDone ? "border-green/40 bg-green/5" : "border-border"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleTimer(t.id),
										className: `flex size-10 items-center justify-center rounded-full transition-all ${t.running ? "bg-yellow/10 text-yellow" : "bg-primary/10 text-primary"}`,
										children: t.running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5 ml-0.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-foreground",
										children: t.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `font-mono text-2xl font-bold ${isDone ? "text-green" : "text-foreground"}`,
										children: format(t.remaining)
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => resetTimer(t.id),
										className: "text-muted-foreground hover:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeTimer(t.id),
										className: "text-muted-foreground hover:text-red",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-1.5 overflow-hidden rounded-full bg-surface-elevated",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full rounded-full transition-all duration-1000 ${isDone ? "bg-green" : t.running ? "bg-primary" : "bg-muted-foreground/30"}`,
									style: { width: `${pct}%` }
								})
							})]
						}, t.id);
					}), timers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-8 text-center text-sm text-muted-foreground",
						children: "No timers yet. Add one above."
					})]
				})
			]
		})
	});
}
//#endregion
export { MultiTimer as component };
