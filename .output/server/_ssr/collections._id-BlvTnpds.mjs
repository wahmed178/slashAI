import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Button } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as categoryIcon } from "./icons-BxDbBHfu.mjs";
import { i as getCollection, r as collectionCommands } from "./collections-OIdjX1d6.mjs";
import { t as Route } from "./collections._id-BHaYYZ4i.mjs";
import { n as EmptyState, t as CommandGrid } from "./CommandGrid-DFmNY4E7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections._id-BlvTnpds.js
var import_jsx_runtime = require_jsx_runtime();
function CollectionPage() {
	const { id } = Route.useParams();
	const collection = getCollection(id);
	const commands = collection ? collectionCommands(id) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: collection?.title ?? "Collection",
		back: {
			to: "/collections",
			label: "Collections"
		},
		children: collection ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-start gap-3 pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary",
				children: (() => {
					const Icon = categoryIcon(collection.icon);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "size-6",
						"aria-hidden": true
					});
				})()
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-black tracking-tight text-foreground",
						children: collection.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-sm text-muted-foreground",
						children: collection.blurb
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: [commands.length, " commands"]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGrid, { commands })
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Collection not found",
			hint: "This collection may have been renamed.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/collections",
					children: "All collections"
				})
			})
		})
	});
}
//#endregion
export { CollectionPage as component };
