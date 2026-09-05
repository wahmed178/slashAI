import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { $ as Pause, U as RotateCcw, Z as Play } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.pomodoro-6JLrR2QR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Pomodoro() {
	const [mode, setMode] = (0, import_react.useState)("work");
	const [workMin, setWorkMin] = (0, import_react.useState)(25);
	const [shortMin, setShortMin] = (0, import_react.useState)(5);
	const [longMin, setLongMin] = (0, import_react.useState)(15);
	const [session, setSession] = (0, import_react.useState)(1);
	const [totalSessions, setTotalSessions] = (0, import_react.useState)(4);
	const [seconds, setSeconds] = (0, import_react.useState)(1500);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [totalSeconds, setTotalSeconds] = (0, import_react.useState)(1500);
	const intervalRef = (0, import_react.useRef)(null);
	const chime = () => {
		try {
			const ctx = new AudioContext();
			const osc = ctx.createOscillator();
			osc.frequency.value = 440;
			osc.connect(ctx.destination);
			osc.start();
			setTimeout(() => osc.stop(), 300);
		} catch {}
	};
	const switchMode = (0, import_react.useCallback)((m) => {
		setMode(m);
		const dur = m === "work" ? workMin * 60 : m === "short" ? shortMin * 60 : longMin * 60;
		setSeconds(dur);
		setTotalSeconds(dur);
		setRunning(false);
	}, [
		workMin,
		shortMin,
		longMin
	]);
	(0, import_react.useEffect)(() => {
		if (!running) {
			if (intervalRef.current) clearInterval(intervalRef.current);
			return;
		}
		intervalRef.current = window.setInterval(() => {
			setSeconds((s) => {
				if (s <= 1) {
					chime();
					if (mode === "work") if (session >= totalSessions) {
						setSession(1);
						switchMode("long");
					} else {
						setSession((p) => p + 1);
						switchMode("short");
					}
					else switchMode("work");
					return 0;
				}
				return s - 1;
			});
		}, 1e3);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [
		running,
		mode,
		session,
		totalSessions,
		switchMode
	]);
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	const pct = totalSeconds > 0 ? (totalSeconds - seconds) / totalSeconds * 100 : 0;
	const circumference = 2 * Math.PI * 70;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Pomodoro Timer",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-col items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 mb-6",
					children: [
						["work", `${workMin}m Work`],
						["short", `${shortMin}m Break`],
						["long", `${longMin}m Long`]
					].map(([m, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => switchMode(m),
						className: "min-h-[36px] rounded-full border px-4 text-xs font-medium transition-colors",
						style: {
							background: mode === m ? "var(--primary)" : "var(--surface-elevated)",
							borderColor: mode === m ? "transparent" : "var(--border)",
							color: mode === m ? "var(--background)" : "var(--muted-foreground)"
						},
						children: label
					}, m))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative size-[200px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 160 160",
						className: "size-full -rotate-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "80",
							cy: "80",
							r: "70",
							fill: "none",
							stroke: "var(--surface-elevated)",
							strokeWidth: "6"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "80",
							cy: "80",
							r: "70",
							fill: "none",
							stroke: "var(--primary)",
							strokeWidth: "6",
							strokeDasharray: circumference,
							strokeDashoffset: circumference * (1 - pct / 100),
							strokeLinecap: "round",
							style: { transition: "stroke-dashoffset 1s linear" }
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-4xl font-bold font-mono text-foreground",
							children: [
								String(mins).padStart(2, "0"),
								":",
								String(secs).padStart(2, "0")
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: [
						"Pomodoro ",
						session,
						" of ",
						totalSessions
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setRunning(!running),
						className: "flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90",
						children: running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setRunning(false);
							switchMode(mode);
						},
						className: "flex size-12 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 w-full max-w-sm rounded-xl border border-border bg-surface p-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground uppercase",
						children: "Settings"
					}), [
						{
							label: "Work",
							val: workMin,
							set: setWorkMin,
							min: 15,
							max: 60
						},
						{
							label: "Short break",
							val: shortMin,
							set: setShortMin,
							min: 1,
							max: 15
						},
						{
							label: "Long break",
							val: longMin,
							set: setLongMin,
							min: 10,
							max: 30
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-foreground",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: item.min,
								max: item.max,
								value: item.val,
								onChange: (e) => item.set(Number(e.target.value)),
								className: "w-24 accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "w-8 text-right text-sm font-mono text-primary",
								children: [item.val, "m"]
							})]
						})]
					}, item.label))]
				})
			]
		})
	});
}
//#endregion
export { Pomodoro as component };
