import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as RESOURCE_TOTAL, i as NEWEST_RESOURCES, l as SECTIONS, m as searchResources, p as resourcesBySection } from "./resources-sbNg_EgT.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as Search, i as X } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as ResourceCardEnhanced } from "./ResourceCardEnhanced-BCTymkiK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover.index-DobHvFB5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORY_ICONS = {
	ai: "🤖",
	"free-tools": "🛠️",
	"free-ai": "✨",
	"free-apis": "📡",
	github: "🐙",
	learn: "🎓",
	resources: "📦",
	youtube: "🎬",
	reddit: "💬",
	websites: "🌐",
	"free-time": "🎮",
	tips: "💡"
};
var sectionsWithCounts = SECTIONS.map((s) => ({
	...s,
	count: resourcesBySection(s.id).length
}));
function DiscoverPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const filteredSections = (0, import_react.useMemo)(() => {
		if (!search.trim()) return sectionsWithCounts;
		const q = search.toLowerCase();
		return sectionsWithCounts.filter((s) => s.label.toLowerCase().includes(q) || s.blurb.toLowerCase().includes(q) || s.categories.some((c) => c.toLowerCase().includes(q)));
	}, [search]);
	const filteredRecent = (0, import_react.useMemo)(() => {
		const list = NEWEST_RESOURCES.slice(0, 8);
		if (!search.trim()) return list;
		const q = search.toLowerCase();
		return list.filter((r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
	}, [search]);
	const results = (0, import_react.useMemo)(() => search.trim() ? searchResources(search.trim(), 40) : [], [search]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "Discover",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "page-enter pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
					children: "Discover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [RESOURCE_TOTAL, "+ free tools, APIs, courses and channels — curated for builders."]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search tools, APIs, courses, channels…",
						className: "h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
					}),
					search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSearch(""),
						className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
					})
				]
			}),
			search.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold tracking-wide text-muted-foreground uppercase",
					children: results.length === 1 ? "1 resource found" : `${results.length} resources found`
				}), results.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-col gap-2",
					children: results.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceCardEnhanced, { resource: r }, r.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: [
						"No resources match “",
						search.trim(),
						"”. Try a broader term like “AI”, “course” or “free”."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Browse categories"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4",
						children: filteredSections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/discover/$section",
							params: { section: section.id },
							className: "group rounded-[10px] border border-border bg-surface p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[32px]",
									"aria-hidden": true,
									children: CATEGORY_ICONS[section.id] || "📦"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-[16px] font-semibold text-foreground",
									children: section.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 line-clamp-1 text-[13px] text-muted-foreground",
									children: section.blurb
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-3 inline-flex items-center rounded border px-2 py-0.5 text-[11px]",
									style: {
										background: "var(--surface-elevated)",
										borderColor: "var(--border)",
										color: "var(--muted-foreground)"
									},
									children: [section.count, " resources"]
								})
							]
						}, section.id))
					}),
					filteredSections.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: "No categories match your search."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-6 border-t border-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Recently added"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/discover",
						className: "text-xs font-medium text-primary hover:underline",
						children: "See all new →"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-col gap-2",
					children: filteredRecent.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceCardEnhanced, { resource: r }, r.id))
				}),
				filteredRecent.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "No recently added items match your search."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/discover/$section",
					params: { section: "free-apis" },
					className: "inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-5 text-sm font-medium text-foreground transition-colors hover:text-primary",
					children: "Explore all resources →"
				})
			})
		]
	});
}
//#endregion
export { DiscoverPage as component };
