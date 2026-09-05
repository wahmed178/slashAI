import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { wn as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as categoryIcon } from "./icons-BxDbBHfu.mjs";
import { t as COLLECTIONS } from "./collections-OIdjX1d6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections.index-C4kGSSHI.js
var import_jsx_runtime = require_jsx_runtime();
function CollectionsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black tracking-tight text-foreground",
				children: "Collections"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Curated starting points built from existing commands. Every collection is open to everyone."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3",
			children: COLLECTIONS.map((c) => {
				const Icon = categoryIcon(c.icon);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/collections/$id",
					params: { id: c.id },
					className: "panel group flex min-h-24 items-start gap-3 rounded-xl p-4 transition-colors hover:border-primary/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-5",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-base font-bold text-foreground",
									children: c.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block line-clamp-2 text-xs text-muted-foreground",
									children: c.blurb
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 block text-xs text-primary",
									children: [c.count, " commands"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							className: "size-4 shrink-0 text-muted-foreground",
							"aria-hidden": true
						})
					]
				}, c.id);
			})
		})]
	});
}
//#endregion
export { CollectionsPage as component };
