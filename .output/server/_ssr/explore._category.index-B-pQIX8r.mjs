import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as CATEGORY_TREE, o as COMMANDS } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { wn as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as categoryIcon } from "./icons-BxDbBHfu.mjs";
import { t as CommandGrid } from "./CommandGrid-DFmNY4E7.mjs";
import { t as Route } from "./explore._category.index-BvcIRnP_.mjs";
import { t as CategoryMissing } from "./explore._category.index-CS0jYP9b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore._category.index-B-pQIX8r.js
var import_jsx_runtime = require_jsx_runtime();
function CategoryPage() {
	const { category } = Route.useParams();
	const node = CATEGORY_TREE.find((c) => c.category === category);
	if (!node) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryMissing, {});
	const Icon = categoryIcon(node.icon);
	const popular = COMMANDS.filter((c) => c.category === category).sort((a, b) => b.popularity - a.popularity).slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		back: {
			to: "/explore",
			label: "Explore"
		},
		hideHeaderSearch: true,
		title: category,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start gap-3 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "size-6",
						"aria-hidden": true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-black tracking-tight text-foreground",
						children: node.category
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-sm text-muted-foreground",
						children: [
							node.count,
							" commands · ",
							node.subcategories.length,
							" subcategories"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-7 mb-3 text-lg font-bold tracking-tight text-foreground",
				children: "Subcategories"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
				children: node.subcategories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/explore/$category/$subcategory",
					params: {
						category: node.category,
						subcategory: s.subcategory
					},
					className: "group flex min-h-14 items-center gap-2 rounded-xl border border-border bg-surface px-3.5 transition-colors hover:border-primary/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate text-sm font-medium text-foreground",
							children: s.subcategory
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-xs text-muted-foreground",
							children: s.count
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							className: "size-4 shrink-0 text-muted-foreground",
							"aria-hidden": true
						})
					]
				}, s.subcategory))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-8 mb-3 text-lg font-bold tracking-tight text-foreground",
				children: ["Popular in ", node.category]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGrid, { commands: popular })
		]
	});
}
//#endregion
export { CategoryPage as component };
