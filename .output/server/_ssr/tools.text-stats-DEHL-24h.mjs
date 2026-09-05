import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.text-stats-DEHL-24h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TextStatistics() {
	const [text, setText] = (0, import_react.useState)("");
	const stats = (0, import_react.useMemo)(() => {
		const words = text.trim() ? text.trim().split(/\s+/) : [];
		const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
		const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);
		const chars = text.length;
		const charsNoSpaces = text.replace(/\s/g, "").length;
		const readingTime = Math.ceil(words.length / 200);
		const speakingTime = Math.ceil(words.length / 130);
		const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ""))).size;
		return {
			words: words.length,
			sentences,
			paragraphs,
			chars,
			charsNoSpaces,
			readingTime,
			speakingTime,
			uniqueWords
		};
	}, [text]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Text Statistics",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📊 Text Statistics"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Word count, reading time, character count, and more."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: text,
				onChange: (e) => setText(e.target.value),
				placeholder: "Paste or type text to analyze...",
				className: "h-40 w-full rounded-xl border border-border bg-surface p-4 text-sm focus:outline-none focus:border-primary/50 resize-none"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: [
					["Words", stats.words],
					["Characters", stats.chars],
					["Characters (no spaces)", stats.charsNoSpaces],
					["Sentences", stats.sentences],
					["Paragraphs", stats.paragraphs],
					["Unique Words", stats.uniqueWords],
					["Reading Time", `${stats.readingTime} min`],
					["Speaking Time", `${stats.speakingTime} min`]
				].map(([label, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-bold text-foreground",
						children: val
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground",
						children: label
					})]
				}, label))
			})]
		})]
	});
}
//#endregion
export { TextStatistics as component };
