import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as personalizeResults, I as useLibrary, O as resolveCommands, P as topPersonalCommands, h as cn, i as CATEGORY_TREE, j as suggestions, m as VERIFIED_TOTAL, n as Button, p as TYPES, v as filterCommands, w as isPersonalized, y as getCommand } from "./slashkits-CB7bx4DD.mjs";
import { m as searchResources } from "./resources-sbNg_EgT.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as SlidersHorizontal, E as Sparkles, L as Search, bn as Clock, i as X, pn as Command } from "../_libs/lucide-react.mjs";
import { a as SheetHeader, i as SheetDescription, n as Sheet, o as SheetTitle, r as SheetContent, t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as ResourceGrid } from "./ResourceCard-GrkmTIKp.mjs";
import { n as EmptyState, r as Highlight, t as CommandGrid } from "./CommandGrid-DFmNY4E7.mjs";
import { n as SORTS, t as Route } from "./search-DaS_q2vw.mjs";
import { t as VoiceSearchButton } from "./VoiceSearchButton-BhC7OFz4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-Dty4E6JO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* The single, universal search entry point. On Home it is the primary action;
* in the app header it is a compact affordance that leads to /search.
*/
function SearchBox({ value, onChange, size = "sm", placeholder, autoFocus, className }) {
	const navigate = useNavigate();
	const { recentSearches, recordSearch } = useLibrary();
	const [draft, setDraft] = (0, import_react.useState)(value ?? "");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [voiceInterim, setVoiceInterim] = (0, import_react.useState)("");
	const [voiceActive, setVoiceActive] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (value !== void 0) setDraft(value);
	}, [value]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const target = e.target;
			const typing = target && /^(INPUT|TEXTAREA)$/.test(target.tagName);
			if (e.key === "/" && !typing || e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				inputRef.current?.focus();
				inputRef.current?.select();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const sugg = (0, import_react.useMemo)(() => open ? suggestions(draft) : [], [draft, open]);
	const submit = (q) => {
		recordSearch(q);
		setOpen(false);
		navigate({
			to: "/search",
			search: {
				q,
				cat: "all",
				sub: "all",
				sort: "relevance"
			}
		});
	};
	const update = (next) => {
		setDraft(next);
		setOpen(true);
		onChange?.(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative min-w-0 flex-1", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: cn("pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground", size === "lg" ? "size-5" : "size-4") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				value: voiceActive && voiceInterim ? voiceInterim : draft,
				onChange: (e) => update(e.target.value),
				onFocus: () => setOpen(true),
				onBlur: () => window.setTimeout(() => setOpen(false), 120),
				onKeyDown: (e) => {
					if (e.key === "Enter") submit(draft);
					if (e.key === "Escape") setOpen(false);
				},
				type: "search",
				role: "searchbox",
				autoFocus,
				"aria-label": "Search commands",
				placeholder: placeholder ?? `Search ${VERIFIED_TOTAL.toLocaleString()} commands, tags or tasks…`,
				className: cn("w-full rounded-xl border border-border bg-surface pr-16 text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none", size === "lg" ? "h-14 pl-11 text-base" : "h-10 pl-9 text-sm")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceSearchButton, {
				size,
				onInterim: (t) => {
					setVoiceInterim(t);
					setVoiceActive(true);
				},
				onResult: (text) => {
					setVoiceInterim("");
					setVoiceActive(false);
					update(text);
					submit(text);
				},
				className: "absolute top-1/2 right-8 -translate-y-1/2"
			}),
			draft && !voiceActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Clear search",
				onClick: () => update(""),
				className: "absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			}),
			open && (sugg.length > 0 || !draft && recentSearches.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel absolute top-[calc(100%+6px)] left-0 z-40 w-full overflow-hidden rounded-xl py-1",
				children: [!draft && recentSearches.map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => submit(term),
					className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-xs text-muted-foreground",
						children: term
					})]
				}, term)), sugg.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => {
						recordSearch(draft);
						setOpen(false);
						navigate({
							to: "/c/$slug",
							params: { slug: s.id }
						});
					},
					className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "size-3.5 shrink-0 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlight, {
								text: s.command,
								query: draft
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-xs text-muted-foreground",
							children: s.title
						})
					]
				}, s.id))]
			})
		]
	});
}
function Chip({ active, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		onClick,
		className: cn("min-h-9 rounded-full border px-3.5 text-sm transition-colors", active ? "border-primary bg-accent text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
		children
	});
}
function SearchPage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: "/search" });
	const { favorites, settings } = useLibrary();
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const q = search.q ?? "";
	const cat = search.cat ?? "all";
	const sub = search.sub ?? "all";
	const page = search.page ?? 1;
	const set = (patch) => void navigate({ search: (prev) => ({
		...prev,
		page: 1,
		...patch
	}) });
	const results = (0, import_react.useMemo)(() => {
		const state = {
			q,
			category: cat,
			subcategory: sub,
			type: search.type ?? "all",
			difficulty: search.diff ?? "all",
			sort: search.sort ?? "relevance",
			onlyFavorites: false,
			favorites
		};
		const base = filterCommands(state);
		return (search.sort ?? "relevance") === "relevance" ? personalizeResults(base, q) : base;
	}, [
		q,
		cat,
		sub,
		search.type,
		search.diff,
		search.sort,
		favorites
	]);
	const personalPicks = (0, import_react.useMemo)(() => {
		if (!isPersonalized()) return [];
		const ids = topPersonalCommands(3, q);
		const matched = resolveCommands(ids, getCommand);
		return q ? matched.filter((c) => results.some((r) => r.id === c.id)) : matched;
	}, [q, results]);
	const resourceHits = (0, import_react.useMemo)(() => searchResources(q, 6), [q]);
	const pageSize = settings.pageSize;
	const pages = Math.max(1, Math.ceil(results.length / pageSize));
	const current = Math.min(page, pages);
	const visible = results.slice((current - 1) * pageSize, current * pageSize);
	const activeFilters = (search.type ?? "all") !== "all" || (search.diff ?? "all") !== "all" || (search.sort ?? "relevance") !== "relevance";
	const subcategories = CATEGORY_TREE.find((c) => c.category === cat)?.subcategories ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "Search",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBox, {
				size: "lg",
				value: q,
				onChange: (v) => set({ q: v }),
				autoFocus: true
			}),
			personalPicks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-xl border border-primary/20 bg-primary/[0.04] p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-1.5 px-1 text-xs font-semibold tracking-wide text-primary uppercase",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "size-3.5",
						"aria-hidden": true
					}), " Based on your usage"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-col gap-1.5",
					children: personalPicks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/c/$slug",
						params: { slug: c.id },
						className: "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-primary/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate font-mono text-xs text-foreground",
							children: c.command
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-[11px] text-muted-foreground",
							children: c.title
						})]
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "min-w-0 truncate text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: results.length.toLocaleString()
						}),
						" ",
						results.length === 1 ? "command" : "commands",
						q ? ` for “${q}”` : ""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: activeFilters ? "default" : "outline",
					size: "sm",
					className: "gap-1.5",
					onClick: () => setFiltersOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" }), " Filters"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: cat === "all",
					onClick: () => set({
						cat: "all",
						sub: "all"
					}),
					children: "All categories"
				}), CATEGORY_TREE.slice(0, 8).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: cat === c.category,
					onClick: () => set({
						cat: c.category,
						sub: "all"
					}),
					children: c.category
				}, c.category))]
			}),
			cat !== "all" && subcategories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
					active: sub === "all",
					onClick: () => set({ sub: "all" }),
					children: ["All of ", cat]
				}), subcategories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: sub === s.subcategory,
					onClick: () => set({ sub: s.subcategory }),
					children: s.subcategory
				}, s.subcategory))]
			}),
			resourceHits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mb-2 text-sm font-semibold text-foreground",
					children: [
						"Curated resources (",
						resourceHits.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceGrid, { resources: resourceHits })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: visible.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGrid, {
					commands: visible,
					query: q
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No commands match that yet",
					hint: "Try fewer words, a different spelling, or clear the filters.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "gap-1.5",
						onClick: () => void navigate({ search: {
							q: "",
							cat: "all",
							sub: "all",
							type: "all",
							diff: "all",
							sort: "relevance",
							page: 1
						} }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), " Reset search"]
					})
				})
			}),
			pages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center justify-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: current <= 1,
						onClick: () => void navigate({ search: (p) => ({
							...p,
							page: current - 1
						}) }),
						children: "Previous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [
							"Page ",
							current,
							" of ",
							pages
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: current >= pages,
						onClick: () => void navigate({ search: (p) => ({
							...p,
							page: current + 1
						}) }),
						children: "Next"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: filtersOpen,
				onOpenChange: setFiltersOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "right",
					className: "w-full gap-0 overflow-y-auto sm:max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Filters" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: "Narrow the results, then close this panel." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 px-4 pb-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
								children: "Sort by"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: SORTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: (search.sort ?? "relevance") === s,
									onClick: () => set({ sort: s }),
									children: s
								}, s))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
								children: "Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: (search.type ?? "all") === "all",
									onClick: () => set({ type: "all" }),
									children: "Any"
								}), TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: search.type === t,
									onClick: () => set({ type: t }),
									children: t
								}, t))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
								children: "Difficulty"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									"all",
									"easy",
									"medium",
									"advanced"
								].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: (search.diff ?? "all") === d,
									onClick: () => set({ diff: d }),
									children: d === "all" ? "Any" : d
								}, d))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
								children: "Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: cat === "all",
									onClick: () => set({
										cat: "all",
										sub: "all"
									}),
									children: "All"
								}), CATEGORY_TREE.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: cat === c.category,
									onClick: () => set({
										cat: c.category,
										sub: "all"
									}),
									children: c.category
								}, c.category))]
							})] })
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { SearchPage as component };
