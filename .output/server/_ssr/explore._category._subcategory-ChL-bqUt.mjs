import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Button, o as COMMANDS } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as EmptyState, t as CommandGrid } from "./CommandGrid-DFmNY4E7.mjs";
import { t as Route } from "./explore._category._subcategory-CoaBiaPn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore._category._subcategory-ChL-bqUt.js
var import_jsx_runtime = require_jsx_runtime();
function SubcategoryPage() {
	const { category, subcategory } = Route.useParams();
	const commands = COMMANDS.filter((c) => c.category === category && c.subcategory === subcategory).sort((a, b) => b.popularity - a.popularity);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		back: {
			to: "/explore",
			label: category
		},
		hideHeaderSearch: true,
		title: subcategory,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "pt-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/explore/$category",
					params: { category },
					className: "text-xs font-medium text-primary hover:underline",
					children: category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-black tracking-tight text-foreground",
					children: subcategory
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 text-sm text-muted-foreground",
					children: [commands.length, " commands"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5",
			children: commands.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGrid, { commands }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nothing here yet",
				hint: "This subcategory has no commands. Try another one in this category.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/explore/$category",
						params: { category },
						children: ["Back to ", category]
					})
				})
			})
		})]
	});
}
//#endregion
export { SubcategoryPage as component };
