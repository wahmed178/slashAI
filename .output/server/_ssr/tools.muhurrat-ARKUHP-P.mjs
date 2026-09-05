import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.muhurrat-ARKUHP-P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ISLAMIC_EVENTS = [
	{
		name: "Ramadan Start",
		month: 9,
		day: 1,
		emoji: "🌙"
	},
	{
		name: "Laylat al-Qadr",
		month: 9,
		day: 27,
		emoji: "✨"
	},
	{
		name: "Eid al-Fitr",
		month: 10,
		day: 1,
		emoji: "🎉"
	},
	{
		name: "Eid al-Adha",
		month: 12,
		day: 10,
		emoji: "🕋"
	},
	{
		name: "Islamic New Year",
		month: 1,
		day: 1,
		emoji: "📅"
	},
	{
		name: "Mawlid al-Nabi",
		month: 3,
		day: 12,
		emoji: "🌟"
	}
];
var HIJRI_MONTHS = [
	"Muharram",
	"Safar",
	"Rabi al-Awwal",
	"Rabi al-Thani",
	"Jumada al-Ula",
	"Jumada al-Thani",
	"Rajab",
	"Shaban",
	"Ramadan",
	"Shawwal",
	"Dhu al-Qi'dah",
	"Dhu al-Hijjah"
];
function gregorianToHijri(date) {
	const jd = Math.floor(365.25 * (date.getFullYear() + 4716)) + Math.floor(30.6001 * (date.getMonth() + 2 < 3 ? date.getMonth() + 14 : date.getMonth() + 2)) + date.getDate() - 1524.5;
	const l = Math.floor(jd - 1948439.5 + 10632);
	const n = Math.floor((l - 1) / 10631);
	const lr = l - 10631 * n + 354;
	const j = Math.floor((10985 - lr) / 5316) * Math.floor(50 * lr / 17719) + Math.floor(lr / 5670) * Math.floor(43 * lr / 15238);
	const ld = lr - Math.floor((30 - j) / 15) * Math.floor(17719 * j / 50) - Math.floor(j / 16) * Math.floor(15238 * j / 43) + 29;
	const hm = Math.floor(24 * ld / 709);
	const hd = ld - Math.floor(709 * hm / 24);
	const hy = 30 * n + j - 30;
	return `${hd} ${HIJRI_MONTHS[hm - 1] || "?"} ${hy} AH`;
}
function MuhurratFinder() {
	const [view, setView] = (0, import_react.useState)("today");
	const today = (0, import_react.useMemo)(() => /* @__PURE__ */ new Date(), []);
	const hijriDate = (0, import_react.useMemo)(() => gregorianToHijri(today), [today]);
	const nextEvent = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		const thisYear = now.getFullYear();
		for (const evt of ISLAMIC_EVENTS) {
			const d = new Date(thisYear, evt.month - 1, evt.day);
			if (d >= now) return {
				...evt,
				date: d
			};
		}
		const first = ISLAMIC_EVENTS[0];
		return {
			...first,
			date: new Date(thisYear + 1, first.month - 1, first.day)
		};
	}, []);
	const daysUntil = Math.ceil((nextEvent.date.getTime() - today.getTime()) / 864e5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Muhurrat Finder",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🌙 Islamic Date Finder"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Hijri dates, Islamic events, and Ramadan timetable."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Today (Hijri)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-lg font-bold text-foreground",
							children: hijriDate
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: today.toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-primary/30 bg-primary/5 p-4 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Next Event"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-lg font-bold text-foreground",
							children: [
								nextEvent.emoji,
								" ",
								nextEvent.name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-primary",
							children: daysUntil > 0 ? `In ${daysUntil} days` : "Today!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: nextEvent.date.toLocaleDateString("en-US", {
								month: "long",
								day: "numeric",
								year: "numeric"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-semibold text-foreground",
					children: "Upcoming Events"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: ISLAMIC_EVENTS.map((evt, i) => {
						const d = new Date(today.getFullYear(), evt.month - 1, evt.day);
						if (d < today) d.setFullYear(d.getFullYear() + 1);
						const days = Math.ceil((d.getTime() - today.getTime()) / 864e5);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium text-foreground",
								children: [
									evt.emoji,
									" ",
									evt.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: d.toLocaleDateString("en-US", {
									month: "long",
									day: "numeric"
								})
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-md bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground",
								children: [days, " days"]
							})]
						}, i);
					})
				})] })
			]
		})]
	});
}
//#endregion
export { MuhurratFinder as component };
