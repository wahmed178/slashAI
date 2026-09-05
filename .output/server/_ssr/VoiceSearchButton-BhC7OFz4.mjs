import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn } from "./slashkits-CB7bx4DD.mjs";
import { bt as LoaderCircle, jt as Languages, ut as Mic } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/VoiceSearchButton-BhC7OFz4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var VOICE_LANGS = [
	{
		code: "en-US",
		label: "English"
	},
	{
		code: "hi-IN",
		label: "हिन्दी (Hindi)"
	},
	{
		code: "ar-SA",
		label: "العربية (Arabic)"
	},
	{
		code: "ur-PK",
		label: "اردو (Urdu)"
	}
];
function getRecognitionCtor() {
	if (typeof window === "undefined") return null;
	const w = window;
	return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}
/** Microphone button for every search input — voice search in EN/HI/AR/UR. */
function VoiceSearchButton({ onResult, onInterim, size = "sm", className }) {
	typeof window !== "undefined" && getRecognitionCtor();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [listening, setListening] = (0, import_react.useState)(false);
	const [unsupported, setUnsupported] = (0, import_react.useState)(false);
	const [lang, setLang] = (0, import_react.useState)("en-US");
	const [interim, setInterim] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const recognitionRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => () => recognitionRef.current?.abort(), []);
	const stop = (0, import_react.useCallback)(() => {
		setListening(false);
		recognitionRef.current?.stop();
		recognitionRef.current = null;
	}, []);
	const start = (0, import_react.useCallback)(() => {
		const Ctor = getRecognitionCtor();
		if (!Ctor) {
			setUnsupported(true);
			setOpen(true);
			return;
		}
		setUnsupported(false);
		setError("");
		setInterim("");
		try {
			const recognition = new Ctor();
			recognition.continuous = false;
			recognition.interimResults = true;
			recognition.lang = lang;
			recognition.onresult = (event) => {
				let interimText = "";
				let finalText = "";
				for (let i = event.resultIndex; i < event.results.length; i++) {
					const transcript = event.results[i][0].transcript;
					if (event.results[i].isFinal) finalText += transcript;
					else interimText += transcript;
				}
				if (interimText) {
					setInterim(interimText);
					onInterim?.(interimText);
				}
				if (finalText) {
					setInterim("");
					onResult(finalText.trim());
				}
			};
			recognition.onerror = (event) => {
				if (event?.error === "not-allowed" || event?.error === "service-not-allowed") setError("Microphone permission denied — allow mic access and try again.");
				else if (event?.error === "no-speech") setError("No speech detected — try again.");
				else setError("Voice recognition failed — try again.");
				setListening(false);
			};
			recognition.onend = () => {
				setListening(false);
				setInterim("");
				recognitionRef.current = null;
			};
			recognitionRef.current = recognition;
			recognition.start();
			setListening(true);
			setOpen(true);
		} catch {
			setError("Could not start voice recognition on this device.");
			setListening(false);
		}
	}, [
		lang,
		onResult,
		onInterim
	]);
	const toggle = () => {
		if (listening) {
			stop();
			return;
		}
		setOpen((o) => !o);
		start();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Voice search",
			title: "Search by voice",
			onClick: toggle,
			className: cn("flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none", size === "lg" ? "size-10" : "size-8", listening && "animate-pulse bg-red-500/15 text-red-400 hover:text-red-300 ring-1 ring-red-500/40"),
			children: listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: cn("animate-spin", size === "lg" ? "size-5" : "size-4") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: size === "lg" ? "size-5" : "size-4" })
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel absolute top-[calc(100%+6px)] right-0 z-50 w-64 overflow-hidden rounded-xl p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-foreground",
						children: listening ? "Listening…" : "Voice search"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-1 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: lang,
							onChange: (e) => setLang(e.target.value),
							className: "max-w-[120px] rounded border border-border bg-surface px-1 py-0.5 text-[11px] text-foreground outline-none",
							"aria-label": "Voice search language",
							children: VOICE_LANGS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: l.code,
								children: l.label
							}, l.code))
						})]
					})]
				}),
				listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 items-center justify-center gap-1",
							children: [
								0,
								1,
								2
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-1 rounded-full bg-red-400",
								style: {
									height: "12px",
									animation: "voice-wave 0.9s ease-in-out infinite",
									animationDelay: `${i * .15}s`
								}
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-center text-xs text-muted-foreground",
							children: interim ? `“${interim}”` : "Speak now — say what you want to search"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: stop,
							className: "mt-3 w-full rounded-lg bg-red-500/90 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-500",
							children: "Stop"
						})
					]
				}) : unsupported ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 rounded-lg border border-border bg-surface p-2.5 text-[11px] leading-relaxed text-muted-foreground",
					children: [
						"🎙️ Voice search requires ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: "Chrome or Edge"
						}),
						" browser."
					]
				}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 rounded-lg border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.08)] p-2.5 text-[11px] leading-relaxed text-red-300",
					children: error
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[11px] leading-relaxed text-muted-foreground",
					children: "Tap the mic and say what you're looking for — commands, topics or tasks."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes voice-wave { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }` })
			]
		})]
	});
}
//#endregion
export { VoiceSearchButton as t };
