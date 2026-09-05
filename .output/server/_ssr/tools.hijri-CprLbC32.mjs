import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.hijri-CprLbC32.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HIJRI_MONTHS = [
	"Muharram",
	"Safar",
	"Rabi al-Awwal",
	"Rabi al-Thani",
	"Jumada al-Ula",
	"Jumada al-Thani",
	"Rajab",
	"Sha'ban",
	"Ramadan",
	"Shawwal",
	"Dhu al-Qi'dah",
	"Dhu al-Hijjah"
];
var ISLAMIC_EVENTS = {
	"1-1": "Islamic New Year",
	"1-10": "Day of Ashura",
	"1-12": "Mawlid al-Nabi",
	"3-12": "Mawlid al-Nabi (Sunni)",
	"7-27": "Laylat al-Mi'raj",
	"8-15": "Laylat al-Bara'at",
	"9-1": "Ramadan Begins",
	"9-27": "Laylat al-Qadr",
	"10-1": "Eid al-Fitr",
	"12-10": "Eid al-Adha",
	"12-9": "Day of Arafah"
};
function HijriCalendar() {
	const [currentDate, setCurrentDate] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [hijriData, setHijriData] = (0, import_react.useState)(null);
	const [selectedDay, setSelectedDay] = (0, import_react.useState)(null);
	const month = currentDate.getMonth();
	const year = currentDate.getFullYear();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDay = new Date(year, month, 1).getDay();
	(0, import_react.useEffect)(() => {
		fetch(`https://api.aladhan.com/v1/gToH/${String(currentDate.getDate()).padStart(2, "0")}-${String(month + 1).padStart(2, "0")}-${year}`).then((r) => r.json()).then((d) => setHijriData(d.data)).catch(() => {});
	}, [currentDate]);
	const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
	const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Hijri Calendar",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🌙 Hijri Calendar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Interactive monthly calendar with both Hijri and Gregorian dates. Islamic events highlighted."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: prevMonth,
							className: "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted-foreground hover:text-foreground",
							children: "← Prev"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg font-bold text-foreground",
								children: [
									months[month],
									" ",
									year
								]
							}), hijriData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-primary",
								children: [
									HIJRI_MONTHS[hijriData.hijri.month.number - 1],
									" ",
									hijriData.hijri.year,
									" AH"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: nextMonth,
							className: "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted-foreground hover:text-foreground",
							children: "Next →"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-7 gap-1",
						children: [
							[
								"Sun",
								"Mon",
								"Tue",
								"Wed",
								"Thu",
								"Fri",
								"Sat"
							].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center text-[10px] font-semibold text-muted-foreground py-1",
								children: d
							}, d)),
							Array.from({ length: firstDay }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, `e${i}`)),
							Array.from({ length: daysInMonth }).map((_, i) => {
								const day = i + 1;
								const isToday = (/* @__PURE__ */ new Date()).getDate() === day && (/* @__PURE__ */ new Date()).getMonth() === month && (/* @__PURE__ */ new Date()).getFullYear() === year;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSelectedDay(selectedDay === day ? null : day),
									className: `aspect-square rounded-lg text-center text-sm transition-colors ${isToday ? "bg-primary text-background font-bold" : selectedDay === day ? "bg-primary/10 text-primary" : "text-foreground hover:bg-surface-elevated"}`,
									children: day
								}, day);
							})
						]
					})
				}),
				selectedDay && hijriData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-bold text-foreground",
							children: [
								months[month],
								" ",
								selectedDay,
								", ",
								year
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-primary",
							children: [
								hijriData.hijri.day,
								" ",
								HIJRI_MONTHS[hijriData.hijri.month.number - 1],
								" ",
								hijriData.hijri.year,
								" AH"
							]
						}),
						hijriData.hijri.holidays?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-green",
							children: hijriData.hijri.holidays.join(", ")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: "Islamic Events"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: Object.entries(ISLAMIC_EVENTS).map(([key, event]) => {
							const parts = key.split("-").map(Number);
							const m = parts[0] ?? 1;
							const d = parts[1] ?? 1;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-foreground",
									children: event
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground",
									children: [
										HIJRI_MONTHS[m - 1],
										" ",
										d
									]
								})]
							}, key);
						})
					})]
				})
			]
		})]
	});
}
//#endregion
export { HijriCalendar as component };
