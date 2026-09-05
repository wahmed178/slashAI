import { o as __toESM } from "../_runtime.mjs";
import { i as readRunCount, t as GENERATORS } from "./generators-BQMEiZJM.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { I as useLibrary } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Sparkles, bn as Clock } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as Badge } from "./badge-V3Q5-w3O.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DQVddJ8f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generators.index-Cp1B4fxr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		value: "all",
		label: "All"
	},
	{
		value: "business",
		label: "Business"
	},
	{
		value: "content",
		label: "Content"
	},
	{
		value: "legal",
		label: "Legal & Ops"
	},
	{
		value: "growth",
		label: "Growth"
	}
];
var CATEGORY_MAP = {
	business: [
		"business-names",
		"mvp-planner",
		"business-model-canvas",
		"pricing-page",
		"competitor-research",
		"financial-projection",
		"qbr-template",
		"okr"
	],
	content: [
		"landing-copy",
		"pitch-deck",
		"twitter-thread",
		"linkedin-post",
		"app-store",
		"seo-meta",
		"pivot-story",
		"product-hunt",
		"newsletter"
	],
	legal: [
		"privacy-policy",
		"terms-of-service",
		"sop"
	],
	growth: [
		"cold-email",
		"welcome-email",
		"partnership-email",
		"ab-test"
	]
};
function GeneratorsIndex() {
	const runs = typeof window !== "undefined" ? readRunCount() : 0;
	const left = Math.max(0, 5 - runs);
	const [activeTab, setActiveTab] = (0, import_react.useState)("all");
	const { recents } = useLibrary();
	const filtered = (0, import_react.useMemo)(() => {
		if (activeTab === "all") return GENERATORS;
		const ids = new Set(CATEGORY_MAP[activeTab] ?? []);
		return GENERATORS.filter((g) => ids.has(g.id));
	}, [activeTab]);
	const recentGenerators = (0, import_react.useMemo)(() => {
		return recents.filter((id) => id.startsWith("gen:")).map((id) => id.replace("gen:", "")).map((id) => GENERATORS.find((g) => g.id === id)).filter(Boolean).slice(0, 5);
	}, [recents]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideHeaderSearch: true,
		title: "AI Toolkit",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "flex items-center gap-2 text-2xl font-black tracking-tight text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							className: "size-6 text-primary",
							"aria-hidden": true
						}), "Founder AI toolkit"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm text-muted-foreground",
						children: "25 focused generators that do one job well. Powered by Claude — every output is built from your inputs."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: "Free tier"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							left,
							" of ",
							5,
							" generations left today · resets at midnight UTC"
						] })]
					})
				]
			}),
			recentGenerators.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
						className: "size-3.5 text-primary",
						"aria-hidden": true
					}), " Recently used"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex gap-2 overflow-x-auto pb-1",
					children: recentGenerators.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/generators/$id",
						params: { id: g.id },
						className: "panel flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:border-primary/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: g.emoji }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: g.title
						})]
					}, g.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: activeTab,
				onValueChange: setActiveTab,
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
					className: "w-full overflow-x-auto",
					children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: tab.value,
						className: "flex-1 sm:flex-none",
						children: tab.label
					}, tab.value))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: activeTab,
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
						children: filtered.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/generators/$id",
							params: { id: g.id },
							className: "panel group flex flex-col rounded-2xl p-4 transition-transform active:scale-[0.98]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl",
									"aria-hidden": true,
									children: g.emoji
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2.5 font-bold text-foreground group-hover:text-primary",
									children: g.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 flex-1 text-sm text-muted-foreground",
									children: g.tagline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-3 text-xs font-medium text-primary/80",
									children: [g.fields.length, " inputs → full draft"]
								})
							]
						}, g.id))
					})
				})]
			})
		]
	});
}
//#endregion
export { GeneratorsIndex as component };
