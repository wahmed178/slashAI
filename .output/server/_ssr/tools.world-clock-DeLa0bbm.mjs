import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.world-clock-DeLa0bbm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CITIES = [
	{
		name: "Hyderabad",
		tz: "Asia/Kolkata",
		flag: "🇮🇳"
	},
	{
		name: "Dubai",
		tz: "Asia/Dubai",
		flag: "🇦🇪"
	},
	{
		name: "London",
		tz: "Europe/London",
		flag: "🇬🇧"
	},
	{
		name: "New York",
		tz: "America/New_York",
		flag: "🇺🇸"
	},
	{
		name: "Tokyo",
		tz: "Asia/Tokyo",
		flag: "🇯🇵"
	},
	{
		name: "Karachi",
		tz: "Asia/Karachi",
		flag: "🇵🇰"
	},
	{
		name: "Dhaka",
		tz: "Asia/Dhaka",
		flag: "🇩🇩"
	},
	{
		name: "Riyadh",
		tz: "Asia/Riyadh",
		flag: "🇸🇦"
	},
	{
		name: "Singapore",
		tz: "Asia/Singapore",
		flag: "🇸🇬"
	},
	{
		name: "Sydney",
		tz: "Australia/Sydney",
		flag: "🇦🇺"
	},
	{
		name: "Toronto",
		tz: "America/Toronto",
		flag: "🇨🇦"
	},
	{
		name: "Paris",
		tz: "Europe/Paris",
		flag: "🇫🇷"
	}
];
function WorldClock() {
	const [now, setNow] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "World Clock",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4",
			children: CITIES.map((city) => {
				const time = now.toLocaleTimeString("en-US", {
					timeZone: city.tz,
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: false
				});
				const date = now.toLocaleDateString("en-US", {
					timeZone: city.tz,
					weekday: "short",
					month: "short",
					day: "numeric"
				});
				const offset = now.toLocaleTimeString("en-US", {
					timeZone: city.tz,
					timeZoneName: "short"
				}).split(" ").pop();
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[10px] border border-border bg-surface p-4 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl",
							children: city.flag
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm font-semibold text-foreground",
							children: city.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-xl font-bold text-primary",
							children: time
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: date
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[10px] text-muted-foreground",
							children: offset
						})
					]
				}, city.name);
			})
		})
	});
}
//#endregion
export { WorldClock as component };
