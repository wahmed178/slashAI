import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn } from "./slashkits-CB7bx4DD.mjs";
import { n as GLOSSARY_CATEGORIES, r as GLOSSARY_TOTAL, t as ALL_GLOSSARY } from "./glossary-CH5u11uF.mjs";
import { In as BookOpen, L as Search } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as EmptyState } from "./CommandGrid-DFmNY4E7.mjs";
import { t as feedback } from "./play-sound-4NQwUsQc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/glossary-DGhZFonk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function normalize(s) {
	return s.toLowerCase().trim();
}
function GlossaryPage() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("All");
	const list = (0, import_react.useMemo)(() => {
		const q = normalize(query);
		return ALL_GLOSSARY.filter((t) => {
			if (cat !== "All" && t.category !== cat) return false;
			if (!q) return true;
			return normalize(t.term).includes(q) || normalize(t.def).includes(q);
		}).sort((a, b) => a.term.localeCompare(b.term));
	}, [query, cat]);
	const grouped = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const t of list) {
			const letter = t.term[0]?.toUpperCase() ?? "#";
			const arr = map.get(letter);
			if (arr) arr.push(t);
			else map.set(letter, [t]);
		}
		return [...map.entries()];
	}, [list]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideHeaderSearch: true,
		title: "Glossary",
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "flex items-center gap-2 text-2xl font-black tracking-tight text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
						className: "size-6 text-primary",
						"aria-hidden": true
					}), "AI Glossary"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: [GLOSSARY_TOTAL, " terms, one clear definition each — foundations to shipping."]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-3 focus-within:border-primary/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "size-4 shrink-0 text-muted-foreground",
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search terms or definitions…",
					"aria-label": "Search the glossary",
					className: "min-h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1",
				children: ["All", ...GLOSSARY_CATEGORIES].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": cat === c,
					onClick: () => {
						feedback("tap");
						setCat(c);
					},
					className: cn("min-h-9 shrink-0 snap-start rounded-full border px-3.5 text-sm transition-colors", cat === c ? "border-primary bg-accent text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
					children: c
				}, c))
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No matching terms",
					hint: `Try a shorter search — or browse “All” across ${GLOSSARY_TOTAL} entries.`
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs text-muted-foreground",
				"aria-live": "polite",
				children: [
					list.length,
					" ",
					list.length === 1 ? "term" : "terms"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-6 pb-8",
				children: grouped.map(([letter, terms]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "sticky top-[52px] z-10 -mx-1 mb-2 bg-background/85 px-1 py-1 text-sm font-black tracking-widest text-primary backdrop-blur-sm",
					children: letter
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "panel divide-y divide-border overflow-hidden rounded-xl",
					children: terms.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
							className: "flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-foreground",
							children: [t.term, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-medium tracking-wider text-muted-foreground uppercase",
								children: t.category
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-0.5 text-sm leading-relaxed text-muted-foreground",
							children: t.def
						})]
					}, t.term))
				})] }, letter))
			})] })
		]
	});
}
//#endregion
export { GlossaryPage as component };
