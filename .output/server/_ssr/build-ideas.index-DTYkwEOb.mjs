import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn, n as Button } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as SlidersHorizontal, E as Sparkles, Ot as Lightbulb, Zt as FolderKanban, i as X } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { a as EMPTY_FILTERS, c as SUITABLE_FOR, i as DIFFICULTIES, l as filterIdeas, n as BUILD_TYPES, o as IDEA_CATEGORIES, r as BUSINESS_MODELS, s as IDEA_TOTAL } from "./build-ideas-u3AZgoYC.mjs";
import { a as useIdeaLibrary } from "./use-build-ideas-DCF1BjC5.mjs";
import { t as Badge } from "./badge-V3Q5-w3O.mjs";
import { t as IdeaCard } from "./IdeaCard-Ba3S1bU-.mjs";
import { t as Input } from "./input-DFGjVhGW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/build-ideas.index-DTYkwEOb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SORTS = [
	{
		id: "newest",
		label: "Newest"
	},
	{
		id: "opportunity",
		label: "Highest opportunity"
	},
	{
		id: "saved",
		label: "Most saved"
	},
	{
		id: "easiest",
		label: "Easiest to build"
	}
];
var PAGE = 24;
function FilterGroup({ label, options, selected, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
			className: "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-1.5",
			children: options.map((option) => {
				const active = selected.includes(option);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": active,
					onClick: () => onToggle(option),
					className: cn("min-h-8 rounded-full border px-3 text-xs font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"),
					children: option
				}, option);
			})
		})]
	});
}
function BuildIdeasIndex() {
	const [filters, setFilters] = (0, import_react.useState)(EMPTY_FILTERS);
	const [sort, setSort] = (0, import_react.useState)("newest");
	const [visible, setVisible] = (0, import_react.useState)(PAGE);
	const [panelOpen, setPanelOpen] = (0, import_react.useState)(false);
	const { saved, toggleSaved } = useIdeaLibrary();
	const results = (0, import_react.useMemo)(() => filterIdeas(filters, sort, saved), [
		filters,
		sort,
		saved
	]);
	const activeCount = filters.categories.length + filters.difficulties.length + filters.models.length + filters.types.length + filters.suitable.length;
	function toggle(key, value) {
		setVisible(PAGE);
		setFilters((prev) => {
			const list = prev[key];
			const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
			return {
				...prev,
				[key]: next
			};
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "Build Ideas",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "flex items-center gap-2 text-2xl font-black tracking-tight text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, {
							className: "size-6 text-primary",
							"aria-hidden": true
						}), " Build Ideas"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [IDEA_TOTAL, " researched product ideas. Every one states the problem, who pays, the MVP scope, a stack, pricing and how to find the first ten customers."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/build-ideas/validate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), " Validate your own idea"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/build-ideas/projects",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "size-4" }), " My projects"]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-2 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: filters.query,
					onChange: (e) => {
						setVisible(PAGE);
						setFilters((prev) => ({
							...prev,
							query: e.target.value
						}));
					},
					placeholder: "Search ideas, problems, features, tags…",
					"aria-label": "Search build ideas",
					className: "flex-1"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						"aria-label": "Sort ideas",
						className: "h-9 rounded-lg border border-border bg-background px-2 text-sm text-foreground",
						children: SORTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.label
						}, s.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setPanelOpen((v) => !v),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" }),
							" Filters",
							activeCount ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: activeCount
							}) : null
						]
					})]
				})]
			}),
			panelOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-3 space-y-4 rounded-xl p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						label: "Category",
						options: IDEA_CATEGORIES,
						selected: filters.categories,
						onToggle: (v) => toggle("categories", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						label: "Difficulty",
						options: DIFFICULTIES,
						selected: filters.difficulties,
						onToggle: (v) => toggle("difficulties", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						label: "Business model",
						options: BUSINESS_MODELS,
						selected: filters.models,
						onToggle: (v) => toggle("models", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						label: "Build type",
						options: BUILD_TYPES,
						selected: filters.types,
						onToggle: (v) => toggle("types", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						label: "Suitable for",
						options: SUITABLE_FOR,
						selected: filters.suitable,
						onToggle: (v) => toggle("suitable", v)
					}),
					activeCount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => setFilters({
							...EMPTY_FILTERS,
							query: filters.query
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), " Clear filters"]
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs text-muted-foreground",
				children: [
					results.length,
					" ",
					results.length === 1 ? "idea" : "ideas",
					filters.query ? ` for “${filters.query}”` : ""
				]
			}),
			results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-4 rounded-xl p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-foreground",
						children: "No ideas match that yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Try a broader search term, or clear a filter or two."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: "secondary",
						size: "sm",
						onClick: () => setFilters(EMPTY_FILTERS),
						children: "Reset everything"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3",
				children: results.slice(0, visible).map((idea) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdeaCard, {
					idea,
					saved: saved.includes(idea.id),
					onToggleSave: toggleSaved
				}, idea.id))
			}), visible < results.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => setVisible((v) => v + PAGE),
					children: "Load more ideas"
				})
			}) : null] })
		]
	});
}
//#endregion
export { BuildIdeasIndex as component };
