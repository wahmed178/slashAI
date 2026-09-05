import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.tasbeeh-Xfsbf_GI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRESET_DHIKR = [
	{
		label: "SubhanAllah",
		target: 33
	},
	{
		label: "Alhamdulillah",
		target: 33
	},
	{
		label: "Allahu Akbar",
		target: 34
	},
	{
		label: "Astaghfirullah",
		target: 100
	},
	{
		label: "La ilaha illallah",
		target: 100
	},
	{
		label: "Hasbiyallahu la ilaha illa Huwa",
		target: 100
	},
	{
		label: "SubhanAllahi wa bihamdihi",
		target: 100
	},
	{
		label: "La hawla wa la quwwata illa billah",
		target: 100
	}
];
function TasbeehCounter() {
	const [dhikr, setDhikr] = (0, import_react.useState)(PRESET_DHIKR[0]);
	const [count, setCount] = (0, import_react.useState)(0);
	const [target, setTarget] = (0, import_react.useState)(dhikr.target);
	const [history, setHistory] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("slashai.tasbeeh") || "{}");
		} catch {
			return {};
		}
	});
	const playClick = (0, import_react.useCallback)(() => {
		try {
			const ctx = new AudioContext();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.frequency.value = 800;
			gain.gain.value = .05;
			osc.start();
			gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .05);
			osc.stop(ctx.currentTime + .05);
		} catch {}
	}, []);
	const vibrate = (0, import_react.useCallback)(() => {
		try {
			navigator.vibrate?.(15);
		} catch {}
	}, []);
	const tap = (0, import_react.useCallback)(() => {
		setCount((c) => {
			const next = c + 1;
			if (next >= target) {
				setHistory((h) => {
					const newH = {
						...h,
						[dhikr.label]: (h[dhikr.label] || 0) + 1
					};
					try {
						localStorage.setItem("slashai.tasbeeh", JSON.stringify(newH));
					} catch {}
					return newH;
				});
				vibrate();
				return 0;
			}
			return next;
		});
		playClick();
		vibrate();
	}, [
		target,
		dhikr,
		playClick,
		vibrate
	]);
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (e.code === "Space" || e.code === "Enter") {
				e.preventDefault();
				tap();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [tap]);
	const selectDhikr = (d) => {
		setDhikr(d);
		setTarget(d.target);
		setCount(0);
	};
	const progress = target > 0 ? count / target * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Tasbeeh Counter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📿 Digital Tasbeeh"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Tap anywhere or press Space to count. Vibration + sound on mobile."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-1",
					style: { scrollbarWidth: "none" },
					children: PRESET_DHIKR.slice(0, 5).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => selectDhikr(d),
						className: `shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${dhikr.label === d.label ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
						children: d.label
					}, d.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: tap,
					className: "w-full rounded-2xl border border-border bg-surface p-8 transition-all active:scale-95 active:border-primary/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-medium text-muted-foreground mb-2",
							children: dhikr.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-7xl font-bold text-foreground",
							children: count
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground mt-2",
							children: ["/ ", target]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-2 rounded-full bg-surface-elevated overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-primary transition-all duration-200",
								style: { width: `${progress}%` }
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: "Target Count"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [[
							33,
							99,
							100
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setTarget(t);
								setCount(0);
							},
							className: `flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${target === t ? "bg-primary text-background" : "border border-border bg-surface-elevated text-muted-foreground hover:text-foreground"}`,
							children: t
						}, t)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: target,
							onChange: (e) => {
								setTarget(Number(e.target.value) || 1);
								setCount(0);
							},
							className: "w-20 h-9 rounded-lg border border-border bg-surface-elevated px-2 text-center text-xs focus:outline-none"
						})]
					})]
				}),
				Object.keys(history).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: "Today's Sessions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: Object.entries(history).map(([label, total]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-foreground",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-medium text-primary",
								children: [total, "×"]
							})]
						}, label))
					})]
				})
			]
		})]
	});
}
//#endregion
export { TasbeehCounter as component };
