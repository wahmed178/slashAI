import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.speech-to-text-D2LEYVIY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SpeechToText() {
	const [isListening, setIsListening] = (0, import_react.useState)(false);
	const [transcript, setTranscript] = (0, import_react.useState)("");
	const [interim, setInterim] = (0, import_react.useState)("");
	const [history, setHistory] = (0, import_react.useState)([]);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const recognitionRef = (0, import_react.useRef)(null);
	const [supported] = (0, import_react.useState)(() => typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window));
	const start = (0, import_react.useCallback)(() => {
		if (!supported) return;
		const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = "en-US";
		recognition.onresult = (event) => {
			let interimText = "";
			let finalText = "";
			for (let i = event.resultIndex; i < event.results.length; i++) if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
			else interimText += event.results[i][0].transcript;
			if (finalText) {
				setTranscript((p) => p + " " + finalText);
				setHistory((p) => [...p, finalText.trim()]);
			}
			setInterim(interimText);
		};
		recognition.onerror = () => setIsListening(false);
		recognition.onend = () => setIsListening(false);
		recognitionRef.current = recognition;
		recognition.start();
		setIsListening(true);
	}, [supported]);
	const stop = () => {
		recognitionRef.current?.stop();
		setIsListening(false);
	};
	const copy = async () => {
		await navigator.clipboard.writeText(transcript);
		setCopied(true);
		setTimeout(() => setCopied(false), 1200);
	};
	const clear = () => {
		setTranscript("");
		setInterim("");
		setHistory([]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Speech to Text",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🎤 Speech to Text"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Real-time speech transcription using Web Speech API. 100% browser-based."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: !supported ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-surface p-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Speech recognition is not supported in this browser. Try Chrome or Edge."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: isListening ? stop : start,
							className: `flex-1 rounded-xl py-3 text-sm font-semibold transition-colors ${isListening ? "bg-red-500 text-white" : "bg-primary text-background hover:opacity-90"}`,
							children: isListening ? "⏹ Stop" : "🎤 Start Listening"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: copy,
							disabled: !transcript.trim(),
							className: "rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40",
							children: copied ? "✓" : "Copy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: clear,
							className: "rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground hover:text-foreground",
							children: "Clear"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-[200px] rounded-xl border border-border bg-surface p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap",
						children: [transcript || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Transcription will appear here..."
						}), interim && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground italic",
							children: [" ", interim]
						})]
					})
				}),
				history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: [
							"Segments (",
							history.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: history.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								i + 1,
								". ",
								h
							]
						}, i))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[10px] text-muted-foreground text-center",
					children: [
						"Words: ",
						transcript.trim().split(/\s+/).filter(Boolean).length,
						" · Characters: ",
						transcript.length
					]
				})
			] })
		})]
	});
}
//#endregion
export { SpeechToText as component };
