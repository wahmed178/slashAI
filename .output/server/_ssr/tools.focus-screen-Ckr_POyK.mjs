import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.focus-screen-Ckr_POyK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FocusScreen() {
	const [now, setNow] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [showControls, setShowControls] = (0, import_react.useState)(false);
	const [quote, setQuote] = (0, import_react.useState)(null);
	const [prayer, setPrayer] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		fetch("https://zenquotes.io/api/today").then((r) => r.json()).then(([q]) => {
			if (q) setQuote({
				text: q.q,
				author: q.a
			});
		}).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		fetch("https://api.aladhan.com/v1/timingsByCity?city=Hyderabad&country=India").then((r) => r.json()).then((data) => {
			const t = data.data?.timings;
			if (!t) return;
			const nowH = now.getHours();
			const prayers = [
				{
					name: "Fajr",
					time: t.Fajr
				},
				{
					name: "Sunrise",
					time: t.Sunrise
				},
				{
					name: "Dhuhr",
					time: t.Dhuhr
				},
				{
					name: "Asr",
					time: t.Asr
				},
				{
					name: "Maghrib",
					time: t.Maghrib
				},
				{
					name: "Isha",
					time: t.Isha
				}
			];
			for (const p of prayers) {
				const [h, m] = p.time.split(":").map(Number);
				if (h !== void 0 && m !== void 0 && (h > nowH || h === nowH && m > now.getMinutes())) {
					setPrayer(`${p.name} at ${p.time}`);
					return;
				}
			}
			if (prayers[0]) setPrayer("Fajr at " + prayers[0].time);
		}).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		const handler = () => setShowControls(true);
		const hide = setTimeout(() => setShowControls(false), 3e3);
		window.addEventListener("mousemove", handler);
		return () => {
			window.removeEventListener("mousemove", handler);
			clearTimeout(hide);
		};
	}, [showControls]);
	const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
	const dateStr = now.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen flex-col items-center justify-center overflow-hidden",
		style: {
			background: "linear-gradient(135deg, var(--background), rgba(10,22,40,1), rgba(26,13,40,1), var(--background))",
			backgroundSize: "400% 400%",
			animation: "gradientShift 60s ease infinite"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-6xl sm:text-8xl font-bold font-mono text-foreground tracking-tight",
				children: timeStr
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-lg text-muted-foreground",
				children: dateStr
			}),
			prayer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm",
				style: { color: "#d29922" },
				children: prayer
			}),
			quote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 max-w-md text-center px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-base italic text-muted-foreground",
					children: [
						"\"",
						quote.text,
						"\""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted-foreground/60",
					children: ["— ", quote.author]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `fixed bottom-4 right-4 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => window.history.back(),
					className: "rounded-lg border border-border bg-surface/80 backdrop-blur px-4 py-2 text-sm text-muted-foreground hover:text-foreground",
					children: "Close"
				})
			})
		]
	});
}
//#endregion
export { FocusScreen as component };
