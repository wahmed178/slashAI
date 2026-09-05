import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.prayer-schedule-VOBP7Hi2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PrayerSchedule() {
	const [city, setCity] = (0, import_react.useState)("Karachi");
	const [year, setYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear());
	const [schedule, setSchedule] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [month, setMonth] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getMonth());
	const fetchSchedule = async () => {
		setLoading(true);
		try {
			const m = month + 1;
			const d = await (await fetch(`https://api.aladhan.com/v1/calendarByCity/${year}/${m}?city=${city}&country=Pakistan&method=2`)).json();
			if (d.data) setSchedule(d.data.map((day) => ({
				date: day.date.readable,
				fajr: day.timings.Fajr.split(" ")[0],
				sunrise: day.timings.Sunrise.split(" ")[0],
				dhuhr: day.timings.Dhuhr.split(" ")[0],
				asr: day.timings.Asr.split(" ")[0],
				maghrib: day.timings.Maghrib.split(" ")[0],
				isha: day.timings.Isha.split(" ")[0]
			})));
		} catch {}
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchSchedule();
	}, [
		city,
		year,
		month
	]);
	const downloadCSV = () => {
		const csv = "Date,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Isha\n" + schedule.map((s) => `${s.date},${s.fajr},${s.sunrise},${s.dhuhr},${s.asr},${s.maghrib},${s.isha}`).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `prayer-times-${city}-${year}-${month + 1}.csv`;
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Prayer Schedule",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🕌 Prayer Time Schedule"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Full month prayer times via Aladhan API. Export as CSV."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: city,
						onChange: (e) => setCity(e.target.value),
						placeholder: "City name",
						className: "flex-1 h-10 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary/50"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: month,
						onChange: (e) => setMonth(Number(e.target.value)),
						className: "h-10 rounded-xl border border-border bg-surface px-3 text-sm focus:outline-none",
						children: [
							"Jan",
							"Feb",
							"Mar",
							"Apr",
							"May",
							"Jun",
							"Jul",
							"Aug",
							"Sep",
							"Oct",
							"Nov",
							"Dec"
						].map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: i,
							children: m
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: year,
						onChange: (e) => setYear(Number(e.target.value)),
						className: "h-10 rounded-xl border border-border bg-surface px-3 text-sm focus:outline-none",
						children: [
							2025,
							2026,
							2027
						].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: y,
							children: y
						}, y))
					})
				]
			}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground",
				children: "Loading prayer times..."
			}) : schedule.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground",
				children: "No data. Try a different city."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: downloadCSV,
				className: "rounded-xl border border-border bg-surface px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
				children: "📥 Export CSV"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border bg-surface-elevated",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left font-semibold text-muted-foreground",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-center font-semibold text-muted-foreground",
								children: "Fajr"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-center font-semibold text-muted-foreground",
								children: "Sunrise"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-center font-semibold text-muted-foreground",
								children: "Dhuhr"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-center font-semibold text-muted-foreground",
								children: "Asr"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-center font-semibold text-muted-foreground",
								children: "Maghrib"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-center font-semibold text-muted-foreground",
								children: "Isha"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: schedule.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: `border-b border-border/50 ${i % 2 === 0 ? "bg-surface" : "bg-transparent"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-1.5 text-foreground",
								children: s.date
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-1.5 text-center text-primary",
								children: s.fajr
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-1.5 text-center text-foreground",
								children: s.sunrise
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-1.5 text-center text-foreground",
								children: s.dhuhr
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-1.5 text-center text-foreground",
								children: s.asr
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-1.5 text-center text-primary",
								children: s.maghrib
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-1.5 text-center text-foreground",
								children: s.isha
							})
						]
					}, i)) })]
				})
			})] })]
		})]
	});
}
//#endregion
export { PrayerSchedule as component };
