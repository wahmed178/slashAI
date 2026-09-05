import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { I as useLibrary, h as cn, r as CATEGORY_ICONS } from "./slashkits-CB7bx4DD.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Hn as ArrowUpRight, T as Star, dn as Copy } from "../_libs/lucide-react.mjs";
import { t as categoryIcon } from "./icons-BxDbBHfu.mjs";
import { t as useCommandActions } from "./use-command-actions-VhrigLFg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CommandGrid-DFmNY4E7.js
var import_jsx_runtime = require_jsx_runtime();
/** Highlights case-insensitive matches of every query term inside `text`. */
function Highlight({ text, query, className }) {
	const terms = query.trim().replace(/^\//, "").split(/\s+/).map((t) => t.toLowerCase()).filter((t) => t.length > 1);
	if (terms.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className,
		children: text
	});
	const lower = text.toLowerCase();
	const marks = [];
	for (const term of terms) {
		let from = 0;
		while (marks.length < 30) {
			const found = lower.indexOf(term, from);
			if (found === -1) break;
			marks.push([found, found + term.length]);
			from = found + term.length;
		}
	}
	if (marks.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className,
		children: text
	});
	marks.sort((a, b) => a[0] - b[0]);
	const merged = [];
	for (const [start, end] of marks) {
		const last = merged[merged.length - 1];
		if (last && start <= last[1]) last[1] = Math.max(last[1], end);
		else merged.push([start, end]);
	}
	const parts = [];
	let index = 0;
	merged.forEach(([start, end], i) => {
		if (start > index) parts.push(text.slice(index, start));
		parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
			className: "rounded-[3px] bg-primary/25 px-0.5 text-foreground",
			children: text.slice(start, end)
		}, i));
		index = end;
	});
	if (index < text.length) parts.push(text.slice(index));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className,
		children: parts
	});
}
var difficultyStyles = {
	easy: "border-chart-2/40 text-chart-2",
	medium: "border-chart-3/40 text-chart-3",
	advanced: "border-chart-5/40 text-chart-5"
};
function CommandCard({ command, query, view, compact, favorite, onOpen, onToggleFavorite, onCopy }) {
	const Icon = categoryIcon(CATEGORY_ICONS[command.category]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		role: "button",
		tabIndex: 0,
		"aria-label": `Open ${command.command}`,
		onClick: () => onOpen(command),
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onOpen(command);
			}
		},
		className: cn("group panel relative cursor-pointer rounded-xl outline-none transition-colors", "hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring", compact ? "p-3" : "p-4", view === "list" && "flex items-start gap-4"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex items-start gap-3", view === "list" ? "min-w-0 flex-1" : ""),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-4.5",
					"aria-hidden": true
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "truncate font-mono text-sm font-semibold tracking-tight text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlight, {
							text: command.command,
							query
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1 text-sm text-muted-foreground", compact || view === "list" ? "line-clamp-1" : "line-clamp-2"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlight, {
							text: command.description,
							query
						})
					}),
					!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground",
								children: command.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-md border px-1.5 py-0.5 text-[11px] capitalize", difficultyStyles[command.difficulty]),
								children: command.difficulty
							}),
							command.tags.slice(0, view === "list" ? 4 : 2).map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted-foreground/80",
								children: ["#", tag]
							}, tag))
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-2 right-2 flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": favorite ? "Remove from favorites" : "Add to favorites",
					"aria-pressed": favorite,
					onClick: (e) => {
						e.stopPropagation();
						onToggleFavorite(command.id);
					},
					className: "rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-4", favorite && "fill-primary text-primary") })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Copy ${command.command}`,
					onClick: (e) => {
						e.stopPropagation();
						onCopy(command);
					},
					className: "rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden rounded-md p-1.5 text-muted-foreground sm:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })
				})
			]
		})]
	});
}
/** Shared card grid — every card links to the /c/$slug detail route. */
function CommandGrid({ commands, query = "", className }) {
	const navigate = useNavigate();
	const { isFavorite, toggleFavorite, settings } = useLibrary();
	const { copyCommand, openCommand } = useCommandActions();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid gap-3", settings.view === "grid" && "sm:grid-cols-2 xl:grid-cols-3", settings.density === "compact" && "gap-2", className),
		children: commands.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandCard, {
			command: c,
			query,
			view: settings.view,
			compact: settings.density === "compact",
			favorite: isFavorite(c.id),
			onOpen: (cmd) => {
				openCommand(cmd);
				navigate({
					to: "/c/$slug",
					params: { slug: cmd.id }
				});
			},
			onToggleFavorite: toggleFavorite,
			onCopy: copyCommand
		}, c.id))
	});
}
function EmptyState({ title, hint, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel flex flex-col items-center rounded-xl px-6 py-14 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base font-semibold text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 max-w-sm text-sm text-muted-foreground",
				children: hint
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: action
			})
		]
	});
}
//#endregion
export { EmptyState as n, Highlight as r, CommandGrid as t };
