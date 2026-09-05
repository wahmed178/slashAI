import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.readability--vR-lYTQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAMPLE = `The quick brown fox jumps over the lazy dog. This is a simple sentence. However, the utilization of polysyllabic terminology significantly diminishes comprehension thresholds among general audiences. It is imperative that content creators prioritize accessibility in their written communications.`;
function syllableCount(word) {
	word = word.toLowerCase().replace(/[^a-z]/g, "");
	if (word.length <= 3) return 1;
	word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
	word = word.replace(/^y/, "");
	const m = word.match(/[aeiouy]{1,2}/g);
	return m ? m.length : 1;
}
function ReadabilityAnalyser() {
	const [text, setText] = (0, import_react.useState)(SAMPLE);
	const stats = (0, import_react.useMemo)(() => {
		if (!text.trim()) return null;
		const words = text.split(/\s+/).filter((w) => w.length > 0);
		const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
		const syllables = words.reduce((sum, w) => sum + syllableCount(w), 0);
		const complexWords = words.filter((w) => syllableCount(w) >= 3).length;
		const asl = words.length / Math.max(sentences.length, 1);
		const asw = syllables / Math.max(words.length, 1);
		const flesch = Math.max(0, Math.min(100, 206.835 - 1.015 * asl - 84.6 * asw));
		const fkGrade = Math.max(0, .39 * asl + 11.8 * asw - 15.59);
		const passiveMatches = text.match(/\b(was|is|are|were|be|been|being)\s+\w+ed\b/gi) || [];
		const longSentences = sentences.filter((s) => s.split(/\s+/).length > 25);
		const avgWordLen = words.reduce((sum, w) => sum + w.replace(/[^a-z]/gi, "").length, 0) / Math.max(words.length, 1);
		return {
			words: words.length,
			sentences: sentences.length,
			syllables,
			complexWords,
			flesch: Math.round(flesch),
			fkGrade: fkGrade.toFixed(1),
			avgSentenceLength: Math.round(asl),
			avgWordLen: avgWordLen.toFixed(1),
			passiveCount: passiveMatches.length,
			longSentences: longSentences.map((s) => s.trim().slice(0, 80)),
			readingTime: Math.max(1, Math.ceil(words.length / 200))
		};
	}, [text]);
	const fleschColor = (score) => {
		if (score >= 80) return "text-green";
		if (score >= 60) return "text-primary";
		if (score >= 40) return "text-yellow";
		return "text-red";
	};
	const fleschLabel = (score) => {
		if (score >= 80) return "Easy to read";
		if (score >= 60) return "Standard";
		if (score >= 40) return "Difficult";
		return "Very difficult";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Text Readability Analyser",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-5 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "Readability Analyser"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Analyse any text for readability, grade level, and writing quality."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: text,
					onChange: (e) => setText(e.target.value),
					className: "h-40 w-full resize-none rounded-[10px] border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30",
					placeholder: "Paste or type text to analyse..."
				}),
				stats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[10px] border border-border bg-surface p-5 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-5xl font-bold ${fleschColor(stats.flesch)}`,
									children: stats.flesch
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Flesch Reading Ease"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-xs font-medium ${fleschColor(stats.flesch)}`,
									children: fleschLabel(stats.flesch)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto mt-3 h-2 w-48 overflow-hidden rounded-full bg-surface-elevated",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-full rounded-full transition-all ${fleschColor(stats.flesch).replace("text-", "bg-")}`,
										style: { width: `${stats.flesch}%` }
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2 sm:grid-cols-5",
							children: [
								{
									label: "Grade Level",
									value: stats.fkGrade
								},
								{
									label: "Words",
									value: String(stats.words)
								},
								{
									label: "Sentences",
									value: String(stats.sentences)
								},
								{
									label: "Avg Words/Sentence",
									value: String(stats.avgSentenceLength)
								},
								{
									label: "Reading Time",
									value: `${stats.readingTime} min`
								},
								{
									label: "Avg Word Length",
									value: `${stats.avgWordLen} chars`
								},
								{
									label: "Complex Words",
									value: String(stats.complexWords)
								},
								{
									label: "Passive Voice",
									value: String(stats.passiveCount)
								},
								{
									label: "Long Sentences",
									value: String(stats.longSentences.length)
								},
								{
									label: "Syllables",
									value: String(stats.syllables)
								}
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[10px] border border-border bg-surface p-3 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold text-foreground",
									children: s.value
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: s.label
								})]
							}, s.label))
						}),
						stats.longSentences.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[10px] border border-yellow/30 bg-yellow/5 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs font-semibold text-yellow",
								children: "Long sentences (over 25 words):"
							}), stats.longSentences.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"• ",
									s,
									"..."
								]
							}, i))]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { ReadabilityAnalyser as component };
