import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.standup-BcpvO2Cf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LS_KEY = "slashai.standups";
function StandupGenerator() {
	const [yesterday, setYesterday] = (0, import_react.useState)("");
	const [today, setToday] = (0, import_react.useState)("");
	const [blockers, setBlockers] = (0, import_react.useState)("");
	const [history, setHistory] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
		} catch {
			return [];
		}
	});
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(LS_KEY, JSON.stringify(history.slice(0, 30)));
		} catch {}
	}, [history]);
	const formatStandup = (style) => {
		const d = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
			weekday: "short",
			month: "short",
			day: "numeric"
		});
		if (style === "slack") {
			let s = `*Standup ${d}*\n\n`;
			if (yesterday) s += `:white_check_mark: *Yesterday:*\n${yesterday.split("\n").map((l) => `• ${l}`).join("\n")}\n\n`;
			if (today) s += `:rocket: *Today:*\n${today.split("\n").map((l) => `• ${l}`).join("\n")}\n\n`;
			if (blockers) s += `:warning: *Blockers:*\n${blockers.split("\n").map((l) => `• ${l}`).join("\n")}\n`;
			return s;
		}
		if (style === "bullet") {
			let s = `Standup — ${d}\n\n`;
			if (yesterday) s += `Yesterday:\n${yesterday.split("\n").map((l) => `• ${l}`).join("\n")}\n\n`;
			if (today) s += `Today:\n${today.split("\n").map((l) => `• ${l}`).join("\n")}\n\n`;
			if (blockers) s += `Blockers:\n${blockers.split("\n").map((l) => `• ${l}`).join("\n")}\n`;
			return s;
		}
		if (style === "email") {
			let s = `Subject: Daily Standup — ${d}\n\nHi team,\n\nHere's my standup:\n\nYesterday I completed:\n${yesterday.split("\n").map((l) => `  - ${l}`).join("\n") || "  (none)"}`;
			s += `\n\nToday I will work on:\n${today.split("\n").map((l) => `  - ${l}`).join("\n") || "  (none)"}`;
			if (blockers) s += `\n\nBlockers:\n${blockers.split("\n").map((l) => `  - ${l}`).join("\n")}`;
			s += `\n\nThanks,\n`;
			return s;
		}
		return `Yesterday: ${yesterday}\nToday: ${today}\nBlockers: ${blockers || "None"}`;
	};
	const handleCopy = async (style) => {
		try {
			await navigator.clipboard.writeText(formatStandup(style));
		} catch {}
	};
	const handleSave = () => {
		const text = formatStandup("bullet");
		setHistory((h) => [{
			date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN"),
			text
		}, ...h]);
		setYesterday("");
		setToday("");
		setBlockers("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Standup Generator",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📋 Daily Standup Generator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Fill in 3 sections → get a formatted standup message instantly."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold text-foreground",
							children: "Yesterday I did:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: yesterday,
							onChange: (e) => setYesterday(e.target.value),
							rows: 3,
							placeholder: "What did you accomplish yesterday?",
							className: "w-full rounded-lg border border-border bg-surface-elevated p-2 text-xs text-foreground focus:outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold text-foreground",
							children: "Today I will:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: today,
							onChange: (e) => setToday(e.target.value),
							rows: 3,
							placeholder: "What are you working on today?",
							className: "w-full rounded-lg border border-border bg-surface-elevated p-2 text-xs text-foreground focus:outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold text-foreground",
							children: "Blockers (optional):"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: blockers,
							onChange: (e) => setBlockers(e.target.value),
							rows: 2,
							placeholder: "Any blockers?",
							className: "w-full rounded-lg border border-border bg-surface-elevated p-2 text-xs text-foreground focus:outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleCopy("slack"),
								className: "flex-1 h-9 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:opacity-90",
								children: "Copy Slack"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleCopy("bullet"),
								className: "flex-1 h-9 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent",
								children: "Copy Bullet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleCopy("email"),
								className: "flex-1 h-9 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent",
								children: "Copy Email"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSave,
						className: "h-9 w-full rounded-lg bg-surface-elevated text-xs font-medium text-foreground hover:bg-accent",
						children: "Save & Clear"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-sm font-semibold text-foreground",
					children: "Preview"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "whitespace-pre-wrap text-xs leading-relaxed text-foreground",
						children: formatStandup("bullet")
					})
				}),
				history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-xs font-semibold text-foreground",
						children: "History (last 10)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 max-h-60 overflow-auto",
						children: history.slice(0, 10).map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-surface p-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: h.date
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 whitespace-pre-wrap text-[11px] text-foreground line-clamp-3",
								children: h.text
							})]
						}, i))
					})]
				})
			] })]
		})]
	});
}
//#endregion
export { StandupGenerator as component };
