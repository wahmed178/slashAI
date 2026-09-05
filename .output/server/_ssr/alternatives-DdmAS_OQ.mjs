import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as ALTERNATIVES } from "./resources-sbNg_EgT.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { K as Repeat2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as PricingBadge } from "./ResourceCard-GrkmTIKp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alternatives-DdmAS_OQ.js
var import_jsx_runtime = require_jsx_runtime();
function AlternativesPage() {
	const groups = /* @__PURE__ */ new Map();
	for (const x of ALTERNATIVES) for (const paid of x.alternativeTo ?? []) groups.set(paid, [...groups.get(paid) ?? [], x]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "Free alternatives",
		back: {
			to: "/discover",
			label: "Discover"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-2xl font-black tracking-tight text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat2, {
					className: "size-6 text-primary",
					"aria-hidden": true
				}), " Free alternatives"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Practical replacements, not identical products — check the feature you rely on before you switch."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 space-y-4",
			children: [...groups.entries()].map(([paid, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel rounded-xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-sm font-semibold text-muted-foreground",
					children: ["Instead of ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: paid
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 divide-y divide-border",
					children: items.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/r/$id",
						params: { id: x.id },
						className: "flex min-h-14 items-center gap-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm font-bold text-foreground",
								children: x.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs text-muted-foreground",
								children: x.description
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingBadge, { pricing: x.pricing })]
					}) }, x.id))
				})]
			}, paid))
		})]
	});
}
//#endregion
export { AlternativesPage as component };
