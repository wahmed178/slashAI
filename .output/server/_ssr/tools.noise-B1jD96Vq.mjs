import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.noise-B1jD96Vq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NOISES = [
	{
		type: "white",
		label: "White Noise",
		icon: "📻",
		desc: "Static hiss, blocks all frequencies"
	},
	{
		type: "brown",
		label: "Brown Noise",
		icon: "🌊",
		desc: "Deep rumble, most soothing"
	},
	{
		type: "pink",
		label: "Pink Noise",
		icon: "🩷",
		desc: "Balanced, like steady rain"
	},
	{
		type: "rain",
		label: "Rain",
		icon: "🌧️",
		desc: "Gentle rainfall ambience"
	},
	{
		type: "cafe",
		label: "Cafe",
		icon: "☕",
		desc: "Coffee shop murmur"
	},
	{
		type: "ocean",
		label: "Ocean Waves",
		icon: "🏖️",
		desc: "Rolling wave pattern"
	},
	{
		type: "forest",
		label: "Forest",
		icon: "🌲",
		desc: "Wind through trees"
	}
];
var TIMERS = [
	{
		label: "25 min",
		value: 1500
	},
	{
		label: "45 min",
		value: 2700
	},
	{
		label: "60 min",
		value: 3600
	},
	{
		label: "90 min",
		value: 5400
	}
];
function NoiseGenerator() {
	const [active, setActive] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [volume, setVolume] = (0, import_react.useState)(.5);
	const [timer, setTimer] = (0, import_react.useState)(null);
	const [remaining, setRemaining] = (0, import_react.useState)(0);
	const ctxRef = (0, import_react.useRef)(null);
	const nodesRef = (0, import_react.useRef)({});
	const intervalRef = (0, import_react.useRef)(null);
	const getCtx = (0, import_react.useCallback)(() => {
		if (!ctxRef.current) ctxRef.current = new AudioContext();
		return ctxRef.current;
	}, []);
	const createNoiseBuffer = (ctx, type) => {
		const sr = ctx.sampleRate;
		const len = sr * 4;
		const buf = ctx.createBuffer(1, len, sr);
		const data = buf.getChannelData(0);
		if (type === "white" || type === "rain" || type === "cafe" || type === "forest") for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
		else if (type === "brown") {
			let last = 0;
			for (let i = 0; i < len; i++) {
				last = (last + (Math.random() * 2 - 1)) / 1.02;
				data[i] = last * 3.5;
			}
		} else {
			let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
			for (let i = 0; i < len; i++) {
				const w = Math.random() * 2 - 1;
				b0 = .99886 * b0 + w * .0555179;
				b1 = .99332 * b1 + w * .0750759;
				b2 = .969 * b2 + w * .153852;
				b3 = .8665 * b3 + w * .3104856;
				b4 = .55 * b4 + w * .5329522;
				b5 = -.7616 * b5 - w * .016898;
				data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * .5362) * .11;
				b6 = w * .115926;
			}
		}
		return buf;
	};
	const startNoise = (0, import_react.useCallback)((type) => {
		const ctx = getCtx();
		const gain = ctx.createGain();
		gain.gain.value = type === "rain" || type === "cafe" || type === "forest" ? volume * .6 : volume * .4;
		gain.connect(ctx.destination);
		const buf = createNoiseBuffer(ctx, type);
		const src = ctx.createBufferSource();
		src.buffer = buf;
		src.loop = true;
		if (type === "rain" || type === "forest") {
			const lpf = ctx.createBiquadFilter();
			lpf.type = "lowpass";
			lpf.frequency.value = 800;
			src.connect(lpf);
			lpf.connect(gain);
		} else if (type === "cafe") {
			const hpf = ctx.createBiquadFilter();
			hpf.type = "highpass";
			hpf.frequency.value = 400;
			const lpf = ctx.createBiquadFilter();
			lpf.type = "lowpass";
			lpf.frequency.value = 2e3;
			src.connect(hpf);
			hpf.connect(lpf);
			lpf.connect(gain);
		} else if (type === "ocean") {
			const lpf = ctx.createBiquadFilter();
			lpf.type = "lowpass";
			lpf.frequency.value = 500;
			src.connect(lpf);
			lpf.connect(gain);
			const lfo = ctx.createOscillator();
			lfo.frequency.value = .1;
			const lfoGain = ctx.createGain();
			lfoGain.gain.value = 300;
			lfo.connect(lfoGain);
			lfoGain.connect(lpf.frequency);
			lfo.start();
		} else src.connect(gain);
		src.start();
		nodesRef.current[type] = {
			gain,
			source: src
		};
	}, [getCtx, volume]);
	const stopNoise = (0, import_react.useCallback)((type) => {
		const node = nodesRef.current[type];
		if (node) {
			node.source.stop();
			node.gain.disconnect();
			delete nodesRef.current[type];
		}
	}, []);
	const toggle = (type) => {
		setActive((prev) => {
			const next = new Set(prev);
			if (next.has(type)) {
				next.delete(type);
				stopNoise(type);
			} else {
				next.add(type);
				startNoise(type);
			}
			return next;
		});
	};
	const stopAll = (0, import_react.useCallback)(() => {
		active.forEach((type) => stopNoise(type));
		setActive(/* @__PURE__ */ new Set());
		if (intervalRef.current) clearInterval(intervalRef.current);
		setRemaining(0);
		setTimer(null);
	}, [active, stopNoise]);
	(0, import_react.useEffect)(() => {
		active.forEach((type) => {
			const node = nodesRef.current[type];
			if (node) {
				const isFiltered = type === "rain" || type === "cafe" || type === "forest" || type === "ocean";
				node.gain.gain.value = isFiltered ? volume * .6 : volume * .4;
			}
		});
	}, [volume, active]);
	const startTimer = (seconds) => {
		setTimer(seconds);
		setRemaining(seconds);
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			setRemaining((r) => {
				if (r <= 1) {
					stopAll();
					return 0;
				}
				return r - 1;
			});
		}, 1e3);
	};
	const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Background Noise Generator",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🔊 Background Noise Generator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Synthesised ambient sounds — mix multiple, set a timer. Zero audio files."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
					children: NOISES.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => toggle(n.type),
						className: `rounded-xl border p-4 text-left transition-all ${active.has(n.type) ? "border-primary/40 bg-primary/10" : "border-border bg-surface hover:bg-surface-elevated"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl",
								children: n.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `mt-1 text-sm font-medium ${active.has(n.type) ? "text-primary" : "text-foreground"}`,
								children: n.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: n.desc
							})
						]
					}, n.type))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground",
							children: "Master Volume"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-medium text-foreground",
							children: [Math.round(volume * 100), "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 100,
						value: Math.round(volume * 100),
						onChange: (e) => setVolume(Number(e.target.value) / 100),
						className: "w-full accent-primary"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-muted-foreground mb-2",
							children: "Auto-stop Timer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2",
							children: TIMERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => startTimer(t.value),
								className: `flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${timer === t.value ? "bg-primary text-background" : "border border-border bg-surface-elevated text-muted-foreground hover:text-foreground"}`,
								children: t.label
							}, t.value))
						}),
						remaining > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-center text-sm font-mono text-primary",
							children: formatTime(remaining)
						})
					]
				}),
				active.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: stopAll,
					className: "w-full rounded-xl bg-red-500/10 border border-red-500/20 py-3 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors",
					children: [
						"Stop All Sounds (",
						active.size,
						" active)"
					]
				})
			]
		})]
	});
}
//#endregion
export { NoiseGenerator as component };
