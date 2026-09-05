import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Button } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore._category.index-CS0jYP9b.js
var import_jsx_runtime = require_jsx_runtime();
function CategoryMissing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		back: {
			to: "/explore",
			label: "Explore"
		},
		hideHeaderSearch: true,
		title: "Not found",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel mt-6 rounded-xl px-6 py-14 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold text-foreground",
				children: "Category not found"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "secondary",
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/explore",
					children: "Back to Explore"
				})
			})]
		})
	});
}
//#endregion
export { CategoryMissing as t };
