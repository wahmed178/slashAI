import { t as GENERATORS } from "./generators-BQMEiZJM.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as CATEGORY_TREE, l as SLASH_TOOL_COUNT, m as VERIFIED_TOTAL } from "./slashkits-CB7bx4DD.mjs";
import { r as GLOSSARY_TOTAL } from "./glossary-CH5u11uF.mjs";
import { t as ALL_ROADMAPS } from "./roadmaps-JDCJRZid.mjs";
import { c as RESOURCE_TOTAL } from "./resources-sbNg_EgT.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-CnZsabyn.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		hideHeaderSearch: true,
		title: "About",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "mx-auto max-w-xl space-y-10 pt-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight text-foreground",
						children: "About SlashAI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: [
							"SlashAI is a free, offline-capable library of ",
							VERIFIED_TOTAL.toLocaleString(),
							" AI slash commands and ",
							RESOURCE_TOTAL,
							" curated resources, built for builders, students, creators and curious people everywhere."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: "No account. No tracking. No payment. Everything works. Everything is free."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-foreground",
					children: "What you get — free, always"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [VERIFIED_TOTAL.toLocaleString(), " copy-ready AI slash commands"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [RESOURCE_TOTAL, " curated free resources — tools, APIs, channels"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [SLASH_TOOL_COUNT, " browser-based tools in SlashKits"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [GENERATORS.length, " AI-powered founder generators"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [ALL_ROADMAPS.length, " step-by-step founder roadmaps"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							GLOSSARY_TOTAL,
							"-term AI and startup glossary across ",
							CATEGORY_TREE.length,
							" categories"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Live dashboard — markets, cricket, prayer, weather" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Daily quiz across 24 categories" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "12 curated hubs — role-based and language-focused" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Islam Hub — Quran, Hadith, prayer tools" })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-foreground",
					children: "How it works"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted-foreground",
					children: [
						"Press ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-[13px] text-foreground",
							children: "/"
						}),
						" anywhere to search commands. Use Discover to browse free tools, APIs and channels. Use Hubs to find resources curated for your role. Use SlashKits for ",
						SLASH_TOOL_COUNT,
						" browser tools — nothing uploads. All your saved items stay on your device."
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-foreground",
					children: "Built with"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted-foreground",
					children: "React · TanStack Start · Vercel · Inter font Open-Meteo · CoinGecko · Aladhan · TheSportsDB HackerNews · AlQuran.cloud · NASA APOD Open Trivia Database · Frankfurter · OpenAQ"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "https://github.com/wahmed178/slashAI/issues",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "inline-flex items-center gap-1 text-sm font-medium text-primary transition-all hover:translate-x-[3px] hover:text-primary/80",
					children: "Found something we missed? Open an issue on GitHub →"
				}) })
			]
		})
	});
}
//#endregion
export { AboutPage as component };
