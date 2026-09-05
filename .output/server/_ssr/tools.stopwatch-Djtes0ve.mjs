import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.stopwatch-Djtes0ve.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Stopwatch() {
	const [time, setTime] = (0, import_react.useState)(0);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [laps, setLaps] = (0, import_react.useState)([]);
	const intervalRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (running) intervalRef.current = setInterval(() => setTime((t) => t + 10), 10);
		else if (intervalRef.current) clearInterval(intervalRef.current);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [running]);
	const formatTime = (ms) => {
		const min = Math.floor(ms / 6e4);
		const sec = Math.floor(ms % 6e4 / 1e3);
		const cent = Math.floor(ms % 1e3 / 10);
		return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(cent).padStart(2, "0")}`;
	};
	const lap = () => {
		setLaps((p) => [time, ...p]);
	};
	const reset = () => {
		setTime(0);
		setLaps([]);
		setRunning(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Stopwatch",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "⏱️ Stopwatch"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Precision stopwatch with lap times."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center py-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-5xl font-mono font-bold text-foreground",
						children: formatTime(time)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setRunning(!running),
							className: `w-24 rounded-xl py-3 text-sm font-semibold ${running ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-primary text-background"}`,
							children: running ? "Pause" : "Start"
						}),
						running && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: lap,
							className: "w-24 rounded-xl border border-border bg-surface py-3 text-sm text-muted-foreground",
							children: "Lap"
						}),
						!running && time > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: reset,
							className: "w-24 rounded-xl border border-border bg-surface py-3 text-sm text-muted-foreground",
							children: "Reset"
						})
					]
				}),
				laps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-surface p-3 space-y-1",
					children: laps.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-sm py-1 border-b border-border/50 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: ["Lap ", laps.length - i]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-foreground",
							children: formatTime(l)
						})]
					}, i))
				})
			]
		})]
	});
}
//#endregion
export { Stopwatch as component };
