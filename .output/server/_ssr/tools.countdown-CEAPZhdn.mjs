import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { X as Plus, y as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.countdown-CEAPZhdn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getCountdowns() {
	try {
		return JSON.parse(localStorage.getItem("countdowns") || "[]");
	} catch {
		return [];
	}
}
function saveCountdowns(c) {
	localStorage.setItem("countdowns", JSON.stringify(c));
}
function CountdownTimer() {
	const [name, setName] = (0, import_react.useState)("");
	const [target, setTarget] = (0, import_react.useState)("");
	const [countdowns, setCountdowns] = (0, import_react.useState)(getCountdowns);
	const [active, setActive] = (0, import_react.useState)(null);
	const [now, setNow] = (0, import_react.useState)(Date.now());
	const selectedTarget = target ? new Date(target).getTime() : null;
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setNow(Date.now()), 1e3);
		return () => clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!selectedTarget) {
			setActive(null);
			return;
		}
		const diff = selectedTarget - now;
		if (diff <= 0) {
			setActive({
				days: 0,
				hours: 0,
				mins: 0,
				secs: 0
			});
			return;
		}
		setActive({
			days: Math.floor(diff / 864e5),
			hours: Math.floor(diff / 36e5 % 24),
			mins: Math.floor(diff / 6e4 % 60),
			secs: Math.floor(diff / 1e3 % 60)
		});
	}, [selectedTarget, now]);
	const addCountdown = () => {
		if (!name || !target || countdowns.length >= 5) return;
		const c = [...countdowns, {
			id: Date.now().toString(),
			name,
			target
		}];
		setCountdowns(c);
		saveCountdowns(c);
		setName("");
		setTarget("");
	};
	const remove = (id) => {
		const c = countdowns.filter((x) => x.id !== id);
		setCountdowns(c);
		saveCountdowns(c);
	};
	const UnitBox = ({ val, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center rounded-lg bg-surface p-3 min-w-[60px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-2xl font-bold font-mono text-primary",
			children: String(val).padStart(2, "0")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 text-[10px] text-muted-foreground uppercase",
			children: label
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Countdown Timer",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-5",
			children: [
				active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitBox, {
							val: active.days,
							label: "Days"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitBox, {
							val: active.hours,
							label: "Hours"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitBox, {
							val: active.mins,
							label: "Minutes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitBox, {
							val: active.secs,
							label: "Seconds"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm text-foreground",
							children: "Event name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "e.g. Eid ul-Adha",
							className: "mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm text-foreground",
							children: "Target date & time"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: target,
							onChange: (e) => setTarget(e.target.value),
							className: "mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: addCountdown,
							disabled: !name || !target || countdowns.length >= 5,
							className: "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add countdown"]
						})
					]
				}),
				countdowns.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground uppercase",
						children: "Saved countdowns"
					}), countdowns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => setTarget(c.target),
						className: "flex items-center justify-between rounded-xl border border-border bg-surface p-3 cursor-pointer hover:border-primary/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: new Date(c.target).toLocaleString()
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								remove(c.id);
							},
							className: "p-2 text-muted-foreground hover:text-red",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					}, c.id))]
				})
			]
		})
	});
}
//#endregion
export { CountdownTimer as component };
