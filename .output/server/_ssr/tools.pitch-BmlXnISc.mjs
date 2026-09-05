import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.pitch-BmlXnISc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ElevatorPitchBuilder() {
	const [fields, setFields] = (0, import_react.useState)({
		product: "",
		audience: "",
		problem: "",
		different: "",
		ask: ""
	});
	const [isTiming, setIsTiming] = (0, import_react.useState)(false);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(60);
	const timerRef = (0, import_react.useRef)(null);
	const update = (k, v) => setFields((p) => ({
		...p,
		[k]: v
	}));
	const pitch = `We built ${fields.product || "[your product]"} for ${fields.audience || "[your audience]"}. ${fields.problem ? `The problem is ${fields.problem}. ` : ""}${fields.different ? `What makes us different is ${fields.different}. ` : ""}${fields.ask || "[Your ask here]"}`;
	const wordCount = pitch.split(/\s+/).filter(Boolean).length;
	const readTimeSeconds = Math.ceil(wordCount / 150 * 60);
	const startTimer = () => {
		setIsTiming(true);
		setTimeLeft(60);
		timerRef.current = setInterval(() => {
			setTimeLeft((t) => {
				if (t <= 1) {
					setIsTiming(false);
					clearInterval(timerRef.current);
					return 0;
				}
				return t - 1;
			});
		}, 1e3);
	};
	(0, import_react.useEffect)(() => () => {
		if (timerRef.current) clearInterval(timerRef.current);
	}, []);
	const speak = () => {
		if ("speechSynthesis" in window) {
			window.speechSynthesis.cancel();
			const u = new SpeechSynthesisUtterance(pitch);
			u.rate = .9;
			window.speechSynthesis.speak(u);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Elevator Pitch Builder",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🎤 Elevator Pitch Builder"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Build a tight 60-second pitch. Practice with timer and read-aloud."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: [
						[
							"product",
							"What does your product do?",
							"e.g. a free browser-based design tool"
						],
						[
							"audience",
							"Who is it for?",
							"e.g. indie hackers and solo founders"
						],
						[
							"problem",
							"What problem does it solve?",
							"e.g. expensive design tools lock out small teams"
						],
						[
							"different",
							"How is it different?",
							"e.g. zero signup, works offline, free forever"
						],
						[
							"ask",
							"What do you want from the listener?",
							"e.g. try it today at slashai.app"
						]
					].map(([k, label, placeholder]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs text-muted-foreground",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: fields[k],
						onChange: (e) => update(k, e.target.value),
						placeholder,
						className: "h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary/50"
					})] }, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Your Pitch"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `text-xs font-medium ${wordCount > 150 ? "text-red-400" : "text-primary"}`,
							children: [
								wordCount,
								" words · ~",
								readTimeSeconds,
								"s"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-foreground",
						children: pitch
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: speak,
						className: "flex-1 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-foreground hover:bg-surface-elevated transition-colors",
						children: "🔊 Read Aloud"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: startTimer,
						disabled: isTiming,
						className: "flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
						children: isTiming ? `${timeLeft}s` : "⏱ 60s Timer"
					})]
				}),
				isTiming && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 rounded-full bg-surface overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary transition-all duration-1000",
						style: { width: `${(60 - timeLeft) / 60 * 100}%` }
					})
				})
			]
		})]
	});
}
//#endregion
export { ElevatorPitchBuilder as component };
