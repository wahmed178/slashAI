import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.reading-BQulobLu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SpeedReadingTrainer() {
	const [text, setText] = (0, import_react.useState)("");
	const [wpm, setWpm] = (0, import_react.useState)(300);
	const [fontSize, setFontSize] = (0, import_react.useState)(48);
	const [isRunning, setIsRunning] = (0, import_react.useState)(false);
	const [currentWord, setCurrentWord] = (0, import_react.useState)("");
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [wordIndex, setWordIndex] = (0, import_react.useState)(0);
	const wordsRef = (0, import_react.useRef)([]);
	const timerRef = (0, import_react.useRef)(null);
	const startReading = (0, import_react.useCallback)(() => {
		if (!text.trim()) return;
		wordsRef.current = text.trim().split(/\s+/);
		setWordIndex(0);
		setProgress(0);
		setIsRunning(true);
		setCurrentWord(wordsRef.current[0] ?? "");
	}, [text]);
	const stopReading = (0, import_react.useCallback)(() => {
		setIsRunning(false);
		if (timerRef.current) clearTimeout(timerRef.current);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isRunning || wordIndex >= wordsRef.current.length) {
			if (isRunning && wordIndex >= wordsRef.current.length) setIsRunning(false);
			return;
		}
		const interval = 6e4 / wpm;
		setCurrentWord(wordsRef.current[wordIndex] ?? "");
		setProgress(Math.round(wordIndex / wordsRef.current.length * 100));
		timerRef.current = setTimeout(() => setWordIndex((i) => i + 1), interval);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [
		isRunning,
		wordIndex,
		wpm
	]);
	const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
	const normalMinutes = wordCount > 0 ? (wordCount / 238).toFixed(1) : "0";
	const speedMinutes = wordCount > 0 ? (wordCount / wpm).toFixed(1) : "0";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Speed Reading Trainer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📖 Speed Reading Trainer"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "RSVP technique — flash one word at a time to train your reading speed."
			})]
		}), !isRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "Paste or type any text here to practice reading...",
					className: "h-40 w-full rounded-xl border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-1 block text-xs text-muted-foreground",
							children: [
								"Speed: ",
								wpm,
								" WPM"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 100,
							max: 1e3,
							step: 10,
							value: wpm,
							onChange: (e) => setWpm(Number(e.target.value)),
							className: "w-full accent-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-[10px] text-muted-foreground mt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1000" })]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-1 block text-xs text-muted-foreground",
							children: [
								"Font Size: ",
								fontSize,
								"px"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 24,
							max: 80,
							step: 4,
							value: fontSize,
							onChange: (e) => setFontSize(Number(e.target.value)),
							className: "w-full accent-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-[10px] text-muted-foreground mt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "24px" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "80px" })]
						})
					] })]
				}),
				wordCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-bold text-foreground",
								children: wordCount
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Words"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg font-bold text-foreground",
								children: [normalMinutes, "m"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Normal speed"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg font-bold text-primary",
								children: [speedMinutes, "m"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-muted-foreground",
								children: [
									"At ",
									wpm,
									" WPM"
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: startReading,
					disabled: !text.trim(),
					className: "w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40",
					children: "Start Training"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						wordIndex + 1,
						" / ",
						wordsRef.current.length
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [wpm, " WPM"] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 rounded-full bg-surface overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary transition-all duration-100",
						style: { width: `${progress}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-foreground transition-all duration-75",
						style: { fontSize: `${fontSize}px` },
						children: currentWord
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setIsRunning((r) => !r);
						},
						className: "flex-1 rounded-xl border border-border bg-surface py-3 text-sm font-medium text-foreground hover:bg-surface-elevated transition-colors",
						children: isRunning ? "Pause" : "Resume"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: stopReading,
						className: "flex-1 rounded-xl bg-red-500/10 border border-red-500/20 py-3 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors",
						children: "Stop"
					})]
				})
			]
		})]
	});
}
//#endregion
export { SpeedReadingTrainer as component };
