import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { $ as Pause, O as SkipForward, Z as Play, d as Volume2, gt as Maximize, lt as Minimize } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.focus-nS_lYImh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SOUNDS = [
	{
		name: "Rain",
		icon: "🌧️",
		gen: (ctx) => {
			const bufferSize = 2 * ctx.sampleRate;
			const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * .3;
			const source = ctx.createBufferSource();
			source.buffer = buffer;
			source.loop = true;
			const filter = ctx.createBiquadFilter();
			filter.type = "lowpass";
			filter.frequency.value = 800;
			source.connect(filter);
			return filter;
		}
	},
	{
		name: "White Noise",
		icon: "📻",
		gen: (ctx) => {
			const bufferSize = 2 * ctx.sampleRate;
			const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * .15;
			const source = ctx.createBufferSource();
			source.buffer = buffer;
			source.loop = true;
			return source;
		}
	},
	{
		name: "Café",
		icon: "☕",
		gen: (ctx) => {
			const bufferSize = 2 * ctx.sampleRate;
			const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * .08;
			const source = ctx.createBufferSource();
			source.buffer = buffer;
			source.loop = true;
			const filter = ctx.createBiquadFilter();
			filter.type = "bandpass";
			filter.frequency.value = 400;
			filter.Q.value = .5;
			source.connect(filter);
			return filter;
		}
	},
	{
		name: "Forest",
		icon: "🌲",
		gen: (ctx) => {
			const bufferSize = 2 * ctx.sampleRate;
			const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) {
				const t = i / ctx.sampleRate;
				data[i] = (Math.random() * 2 - 1) * .05 * (.5 + .5 * Math.sin(t * .3));
			}
			const source = ctx.createBufferSource();
			source.buffer = buffer;
			source.loop = true;
			const filter = ctx.createBiquadFilter();
			filter.type = "highpass";
			filter.frequency.value = 200;
			source.connect(filter);
			return filter;
		}
	},
	{
		name: "Lo-fi",
		icon: "🎵",
		gen: (ctx) => {
			const bufferSize = 2 * ctx.sampleRate;
			const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) {
				const t = i / ctx.sampleRate;
				data[i] = (Math.random() * 2 - 1) * .12 * (.6 + .4 * Math.sin(t * .15));
			}
			const source = ctx.createBufferSource();
			source.buffer = buffer;
			source.loop = true;
			const filter = ctx.createBiquadFilter();
			filter.type = "lowpass";
			filter.frequency.value = 600;
			source.connect(filter);
			return filter;
		}
	}
];
function FocusMode() {
	const [task, setTask] = (0, import_react.useState)("");
	const [isRunning, setIsRunning] = (0, import_react.useState)(false);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(1500);
	const [mode, setMode] = (0, import_react.useState)("work");
	const [selectedSound, setSelectedSound] = (0, import_react.useState)(null);
	const [muted, setMuted] = (0, import_react.useState)(true);
	const [isFullscreen, setIsFullscreen] = (0, import_react.useState)(false);
	const [sessionLog, setSessionLog] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("focus_log") || "[]");
		} catch {
			return [];
		}
	});
	const timerRef = (0, import_react.useRef)(null);
	const audioCtxRef = (0, import_react.useRef)(null);
	const sourceRef = (0, import_react.useRef)(null);
	const WORK_TIME = 1500;
	const BREAK_TIME = 300;
	(0, import_react.useEffect)(() => {
		if (!isRunning) return;
		timerRef.current = window.setInterval(() => {
			setTimeLeft((t) => {
				if (t <= 1) {
					clearInterval(timerRef.current);
					if (mode === "work") {
						const log = [...sessionLog, {
							task: task || "Focus session",
							duration: WORK_TIME,
							date: (/* @__PURE__ */ new Date()).toISOString()
						}];
						setSessionLog(log);
						try {
							localStorage.setItem("focus_log", JSON.stringify(log.slice(-50)));
						} catch {}
						setMode("break");
						setTimeLeft(BREAK_TIME);
					} else {
						setMode("work");
						setIsRunning(false);
						setTimeLeft(WORK_TIME);
					}
					try {
						const ctx = new AudioContext();
						const osc = ctx.createOscillator();
						osc.type = "sine";
						osc.frequency.value = mode === "work" ? 523 : 440;
						osc.connect(ctx.destination);
						osc.start();
						setTimeout(() => {
							osc.stop();
							ctx.close();
						}, 500);
					} catch {}
					return mode === "work" ? BREAK_TIME : WORK_TIME;
				}
				return t - 1;
			});
		}, 1e3);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [
		isRunning,
		mode,
		task,
		sessionLog
	]);
	const startSound = (0, import_react.useCallback)((idx) => {
		if (audioCtxRef.current) {
			audioCtxRef.current.close();
			audioCtxRef.current = null;
			sourceRef.current = null;
		}
		if (selectedSound === idx && !muted) {
			setMuted(true);
			setSelectedSound(null);
			return;
		}
		const ctx = new AudioContext();
		audioCtxRef.current = ctx;
		const sound = SOUNDS[idx];
		if (!sound) return;
		const node = sound.gen(ctx);
		const gain = ctx.createGain();
		gain.gain.value = .5;
		node.connect(gain);
		if (ctx.destination) gain.connect(ctx.destination);
		node instanceof AudioBufferSourceNode && node.start();
		sourceRef.current = node;
		setSelectedSound(idx);
		setMuted(false);
	}, [selectedSound, muted]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (audioCtxRef.current) audioCtxRef.current.close();
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);
	const toggleFullscreen = () => {
		if (!document.fullscreenElement) document.documentElement.requestFullscreen();
		else document.exitFullscreen();
		setIsFullscreen(!isFullscreen);
	};
	const mins = Math.floor(timeLeft / 60);
	const secs = timeLeft % 60;
	const progress = mode === "work" ? (WORK_TIME - timeLeft) / WORK_TIME * 100 : (BREAK_TIME - timeLeft) / BREAK_TIME * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Deep Work Mode",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex flex-col items-center justify-center ${isFullscreen ? "fixed inset-0 z-50 bg-background" : "min-h-[70vh] pt-8"}`,
			children: [
				isFullscreen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: toggleFullscreen,
					className: "absolute right-4 top-4 text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `text-sm font-medium ${mode === "work" ? "text-primary" : "text-green"}`,
					children: mode === "work" ? "🎯 Deep Work" : "☕ Break Time"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-8 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-8xl font-bold text-foreground tabular-nums",
						children: [
							String(mins).padStart(2, "0"),
							":",
							String(secs).padStart(2, "0")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mt-4 h-1.5 w-64 overflow-hidden rounded-full bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `h-full rounded-full transition-all duration-1000 ${mode === "work" ? "bg-primary" : "bg-green"}`,
							style: { width: `${progress}%` }
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: task,
					onChange: (e) => setTask(e.target.value),
					placeholder: "What are you working on?",
					className: "w-72 rounded-lg border border-border bg-surface px-4 py-2.5 text-center text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setIsRunning(!isRunning);
							},
							className: "flex size-12 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-primary/90",
							children: isRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5 ml-0.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setIsRunning(false);
								setMode("work");
								setTimeLeft(WORK_TIME);
							},
							className: "flex size-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: toggleFullscreen,
							className: "flex size-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, { className: "size-4" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4 text-muted-foreground" }), SOUNDS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => startSound(i),
						className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all ${selectedSound === i && !muted ? "border border-primary/30 bg-primary/10 text-primary" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.icon }),
							" ",
							s.name
						]
					}, s.name))]
				}),
				sessionLog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 w-full max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-2 text-xs text-muted-foreground",
						children: [
							"Recent sessions (",
							sessionLog.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: sessionLog.slice(-5).reverse().map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg bg-surface px-3 py-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: s.task
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [Math.floor(s.duration / 60), "m"]
							})]
						}, i))
					})]
				})
			]
		})
	});
}
//#endregion
export { FocusMode as component };
