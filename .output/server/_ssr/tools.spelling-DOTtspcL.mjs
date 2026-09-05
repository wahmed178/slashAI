import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.spelling-DOTtspcL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COMMON_CONFUSIONS = {
	"your": "you're",
	"youre": "you're",
	"their": "there/they're",
	"there": "their/they're",
	"its": "it's",
	"its'": "its",
	"then": "than (comparison)",
	"than": "then (sequence)",
	"affect": "effect (noun)",
	"effect": "affect (verb)",
	"loose": "lose",
	"lose": "loose",
	"accept": "except",
	"except": "accept",
	"advice": "advise",
	"advise": "advice",
	"practice": "practise (verb)",
	"practise": "practice (noun)",
	"definitely": "definately/difenitely",
	"separate": "seperate",
	"occurrence": "occurence",
	"necessary": "neccessary",
	"accommodate": "accomodate",
	"millennium": "millenium",
	"embarass": "embarrass"
};
function SpellingChecker() {
	const [text, setText] = (0, import_react.useState)("");
	const [corrections, setCorrections] = (0, import_react.useState)([]);
	const check = () => {
		const found = [];
		const repeatedMatch = text.match(/\b(\w+)\s+\1\b/gi);
		if (repeatedMatch) repeatedMatch.forEach((m) => {
			const word = m.split(/\s+/)[0];
			const idx = text.toLowerCase().indexOf(m.toLowerCase());
			found.push({
				word: m.trim(),
				suggestion: `Remove duplicate "${word}"`,
				index: idx
			});
		});
		text.split(/\s+/).forEach((word, i) => {
			const clean = word.toLowerCase().replace(/[^a-z]/g, "");
			if (COMMON_CONFUSIONS[clean]) {
				const idx = text.indexOf(word);
				found.push({
					word,
					suggestion: COMMON_CONFUSIONS[clean],
					index: idx
				});
			}
		});
		if (text.includes("  ")) found.push({
			word: "(double space)",
			suggestion: "Use single space",
			index: text.indexOf("  ")
		});
		const capMatch = text.match(/\.\s+[a-z]/g);
		if (capMatch) capMatch.forEach((m) => {
			const idx = text.indexOf(m);
			found.push({
				word: m,
				suggestion: `Capitalize after period: "${m[0]}${m[2]?.toUpperCase() ?? ""}${m.slice(3)}"`,
				index: idx
			});
		});
		setCorrections(found);
	};
	const stats = (0, import_react.useMemo)(() => {
		const words = text.trim().split(/\s+/).filter(Boolean);
		const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
		return {
			words: words.length,
			sentences,
			characters: text.length
		};
	}, [text]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Spelling Checker",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "✍️ Spelling & Grammar Checker"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Offline spell check — repeated words, common mistakes, capitalization. No API needed."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "Paste or type text to check...",
					className: "h-40 w-full rounded-xl border border-border bg-surface p-4 text-sm focus:outline-none focus:border-primary/50 resize-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-bold text-foreground",
								children: stats.words
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Words"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-bold text-foreground",
								children: stats.sentences
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Sentences"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-bold text-foreground",
								children: stats.characters
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Characters"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: check,
					disabled: !text.trim(),
					className: "w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
					children: "Check Text"
				}),
				corrections.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold text-muted-foreground mb-2",
						children: [
							corrections.length,
							" issue",
							corrections.length !== 1 ? "s" : "",
							" found"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: corrections.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-lg bg-surface-elevated px-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-red-400 font-mono",
									children: c.word
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "→"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-green font-medium",
									children: c.suggestion
								})
							]
						}, i))
					})]
				}),
				text && corrections.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-green/20 bg-green/5 p-4 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-green",
						children: "✓ No issues found"
					})
				})
			]
		})]
	});
}
//#endregion
export { SpellingChecker as component };
