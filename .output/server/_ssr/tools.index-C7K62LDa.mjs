import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { N as toolOfTheDay, f as TOOL_SECTIONS, l as SLASH_TOOL_COUNT } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as Search, i as X } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.index-C7K62LDa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = ["All", ...TOOL_SECTIONS.map((s) => s.title)];
var DAY_TOOL = toolOfTheDay();
function matches(tool, q) {
	const text = `${tool.name} ${tool.desc}`.toLowerCase();
	return q.split(/\s+/).every((word) => text.includes(word));
}
function ToolsIndex() {
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [search, setSearch] = (0, import_react.useState)("");
	const q = search.trim().toLowerCase();
	const visibleSections = filter === "All" ? TOOL_SECTIONS : TOOL_SECTIONS.filter((s) => s.title === filter);
	const matchingTools = !q ? visibleSections.flatMap((s) => s.tools) : TOOL_SECTIONS.flatMap((s) => s.tools).filter((t) => matches(t, q));
	const foundCount = q ? TOOL_SECTIONS.reduce((acc, s) => acc + [...s.tools, ...s.hubTools ?? []].filter((t) => matches(t, q)).length, 0) : matchingTools.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		title: "SlashKits",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "page-enter pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
					children: "SlashKits"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[15px] text-muted-foreground",
					children: [SLASH_TOOL_COUNT, " browser-based tools. Nothing uploaded. All client-side."]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 overflow-hidden rounded-xl border border-[rgba(45,212,191,0.25)] bg-[rgba(45,212,191,0.04)] p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[14px]",
							children: "⭐"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold uppercase tracking-wider text-primary",
							children: "Tool of the Day"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground",
							children: "· changes daily"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2.5 flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface text-3xl",
						children: DAY_TOOL.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[16px] font-bold text-foreground",
								children: DAY_TOOL.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-[13px] text-muted-foreground",
								children: DAY_TOOL.desc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary",
									children: "100% Free"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground",
									children: "Browser only"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `/tools/${DAY_TOOL.slug}`,
								className: "mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[12px] font-bold text-background transition-colors hover:bg-primary/90",
								children: "Try it now →"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground",
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search tools by name or use case…",
						"aria-label": "Search tools",
						className: "h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
					}),
					search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Clear search",
						onClick: () => setSearch(""),
						className: "absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				]
			}),
			q && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [foundCount === 1 ? "1 tool found" : `${foundCount} tools found`, filter !== "All" ? ` in ${filter}` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto pb-2",
				style: { scrollbarWidth: "none" },
				children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilter(f),
					className: `shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${filter === f ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
					children: f === "All" ? `All (${SLASH_TOOL_COUNT})` : `${TOOL_SECTIONS.find((s) => s.title === f)?.icon} ${f}`
				}, f))
			}),
			q && foundCount === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-xl border border-border bg-surface p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-foreground",
						children: [
							"No tools match “",
							search.trim(),
							"”"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Try: compress / calculate / timer / Islamic"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSearch(""),
						className: "mt-4 inline-flex h-9 items-center rounded-lg border border-border bg-surface-elevated px-4 text-xs font-medium text-foreground transition-colors hover:border-primary/40",
						children: "Clear search"
					})
				]
			}),
			visibleSections.map((section) => {
				return {
					section,
					tools: q ? [...section.tools, ...section.hubTools || []].filter((t) => matches(t, q)) : [...section.tools, ...section.hubTools || []]
				};
			}).filter(({ tools }) => tools.length > 0).map(({ section, tools }, si) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: section.title.toLowerCase().replace(/[^a-z]/g, ""),
				className: si === 0 ? "mt-4" : "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg",
							children: section.icon
						}),
						" ",
						section.title
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3",
					children: tools.map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: tool.slug.startsWith("/") ? tool.slug : `/tools/${tool.slug}`,
						className: "group flex items-start gap-3 rounded-[10px] border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-[22px]",
								children: tool.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[15px] font-semibold text-foreground group-hover:text-primary",
											children: tool.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 rounded-full border border-[rgba(45,212,191,0.25)] bg-[rgba(45,212,191,0.08)] px-1.5 py-0.5 text-[9px] font-semibold text-primary",
											children: "Free"
										}),
										tool.noUpload && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded border px-1.5 py-0.5 text-[9px] font-medium text-green",
											style: {
												background: "rgba(63,185,80,0.08)",
												borderColor: "rgba(63,185,80,0.3)"
											},
											children: "No upload"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-[13px] text-muted-foreground line-clamp-1",
									children: tool.desc
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 shrink-0 text-[13px] text-muted-foreground transition-colors group-hover:text-primary",
								children: "→"
							})
						]
					}, tool.slug))
				})]
			}, section.title))
		]
	});
}
//#endregion
export { ToolsIndex as component };
