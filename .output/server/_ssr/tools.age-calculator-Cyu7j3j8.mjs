import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.age-calculator-Cyu7j3j8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ZODIAC = [
	{
		start: [1, 20],
		end: [2, 18],
		name: "Aquarius",
		sign: "♒"
	},
	{
		start: [2, 19],
		end: [3, 20],
		name: "Pisces",
		sign: "♓"
	},
	{
		start: [3, 21],
		end: [4, 19],
		name: "Aries",
		sign: "♈"
	},
	{
		start: [4, 20],
		end: [5, 20],
		name: "Taurus",
		sign: "♉"
	},
	{
		start: [5, 21],
		end: [6, 20],
		name: "Gemini",
		sign: "♊"
	},
	{
		start: [6, 21],
		end: [7, 22],
		name: "Cancer",
		sign: "♋"
	},
	{
		start: [7, 23],
		end: [8, 22],
		name: "Leo",
		sign: "♌"
	},
	{
		start: [8, 23],
		end: [9, 22],
		name: "Virgo",
		sign: "♍"
	},
	{
		start: [9, 23],
		end: [10, 22],
		name: "Libra",
		sign: "♎"
	},
	{
		start: [10, 23],
		end: [11, 21],
		name: "Scorpio",
		sign: "♏"
	},
	{
		start: [11, 22],
		end: [12, 21],
		name: "Sagittarius",
		sign: "♐"
	},
	{
		start: [12, 22],
		end: [1, 19],
		name: "Capricorn",
		sign: "♑"
	}
];
var DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
function AgeCalculator() {
	const [dob, setDob] = (0, import_react.useState)("1995-06-15");
	const result = (0, import_react.useMemo)(() => {
		if (!dob) return null;
		const birth = new Date(dob);
		const now = /* @__PURE__ */ new Date();
		if (birth > now) return null;
		let years = now.getFullYear() - birth.getFullYear();
		let months = now.getMonth() - birth.getMonth();
		let days = now.getDate() - birth.getDate();
		if (days < 0) {
			months--;
			days += 30;
		}
		if (months < 0) {
			years--;
			months += 12;
		}
		const diffMs = now.getTime() - birth.getTime();
		const totalDays = Math.floor(diffMs / 864e5);
		const totalMonths = Math.floor(totalDays / 30);
		const totalHours = Math.floor(diffMs / 36e5);
		const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
		if (nextBday < now) nextBday.setFullYear(nextBday.getFullYear() + 1);
		const daysUntil = Math.ceil((nextBday.getTime() - now.getTime()) / 864e5);
		const zodiac = ZODIAC.find((z) => {
			const sm = z.start[0];
			const sd = z.start[1];
			const em = z.end[0];
			const ed = z.end[1];
			const mm = now.getMonth() + 1;
			const dd = now.getDate();
			if (sm <= em) return (mm > sm || mm === sm && dd >= sd) && (mm < em || mm === em && dd <= ed);
			return mm > sm || mm === sm && dd >= sd || mm < em || mm === em && dd <= ed;
		});
		return {
			years,
			months,
			days,
			totalDays,
			totalMonths,
			totalHours,
			dayBorn: DAYS[birth.getDay()],
			daysUntil,
			zodiac
		};
	}, [dob]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Age Calculator",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm text-foreground",
					children: "Date of birth"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: dob,
					onChange: (e) => setDob(e.target.value),
					className: "mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
				})]
			}), result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-2xl font-bold text-primary",
						children: [
							result.years,
							" years, ",
							result.months,
							" months, ",
							result.days,
							" days"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: ["Next birthday in ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium text-foreground",
							children: [result.daysUntil, " days"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2 pt-2",
						children: [
							["Months", result.totalMonths.toLocaleString()],
							["Days", result.totalDays.toLocaleString()],
							["Hours", result.totalHours.toLocaleString()],
							["Born on", result.dayBorn]
						].map(([label, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface-elevated p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-bold text-foreground",
								children: val
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: label
							})]
						}, label))
					}),
					result.zodiac && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-lg bg-surface-elevated p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl",
							children: result.zodiac.sign
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium text-foreground",
							children: result.zodiac.name
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { AgeCalculator as component };
