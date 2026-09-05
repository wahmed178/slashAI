import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { I as useLibrary, n as Button, y as getCommand } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as EmptyState, t as CommandGrid } from "./CommandGrid-DFmNY4E7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/favorites-CLmORm-v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FavoritesPage() {
	const { favorites, hydrated } = useLibrary();
	const commands = (0, import_react.useMemo)(() => favorites.map((id) => getCommand(id)).filter((c) => Boolean(c)), [favorites]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-black tracking-tight text-foreground",
					children: "Favorites"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: hydrated ? `${commands.length} saved on this device` : "Loading…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/graph",
				className: "mt-4 flex items-center gap-3 rounded-[10px] border border-primary/20 bg-primary/[0.04] p-3.5 transition-all duration-150 hover:border-primary/40 hover:bg-primary/[0.07]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-[16px]",
						children: "🕸️"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[13.5px] font-semibold text-foreground",
							children: "See these as a Knowledge Graph"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[12px] text-muted-foreground",
							children: "Commands, resources, collections and notes mapped by how they connect."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-muted-foreground transition-colors group-hover:text-primary",
						children: "→"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: !hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
					children: [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "panel h-28 animate-pulse rounded-xl" }, i))
				}) : commands.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGrid, { commands }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No favorites yet",
					hint: "Tap the star on any command to keep it here for later.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/explore",
							children: "Browse categories"
						})
					})
				})
			})
		]
	});
}
//#endregion
export { FavoritesPage as component };
