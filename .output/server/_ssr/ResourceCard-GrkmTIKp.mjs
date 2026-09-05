import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Hn as ArrowUpRight, wn as ChevronRight, zn as BadgeCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ResourceCard-GrkmTIKp.js
var import_jsx_runtime = require_jsx_runtime();
var PRICING_TONE = {
	"Completely Free": "border-primary/40 bg-accent text-foreground",
	"Open Source": "border-primary/40 bg-accent text-foreground",
	"Free Tier": "border-border bg-surface text-muted-foreground",
	Freemium: "border-border bg-surface text-muted-foreground",
	"Free for Students": "border-primary/40 bg-accent text-foreground",
	"Limited-Time Free": "border-primary/40 bg-accent text-foreground",
	Paid: "border-border bg-muted text-muted-foreground"
};
function PricingBadge({ pricing, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", PRICING_TONE[pricing], className),
		children: pricing
	});
}
function VerifiedLine({ resource }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
				className: "size-3.5 text-primary",
				"aria-hidden": true
			}),
			"Last checked ",
			resource.lastVerified,
			resource.status !== "Active" && ` · ${resource.status}`
		]
	});
}
/** Compact, tappable card used by every resource surface. */
function ResourceCard({ resource }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/r/$id",
		params: { id: resource.id },
		className: "panel group flex flex-col gap-2 rounded-xl p-3.5 transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate text-sm font-bold text-foreground",
						children: resource.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block truncate text-[11px] text-muted-foreground",
						children: [
							resource.type,
							" · ",
							resource.category
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingBadge, { pricing: resource.pricing })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "line-clamp-2 text-xs leading-relaxed text-muted-foreground",
				children: resource.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifiedLine, { resource }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: "size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5",
					"aria-hidden": true
				})]
			})
		]
	});
}
function ResourceGrid({ resources, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3", className),
		children: resources.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceCard, { resource: x }, x.id))
	});
}
function VisitButton({ url, label = "Visit resource" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: url,
		target: "_blank",
		rel: "noreferrer noopener",
		className: "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
		children: [
			label,
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
				className: "size-4",
				"aria-hidden": true
			})
		]
	});
}
//#endregion
export { ResourceGrid as n, VisitButton as r, PricingBadge as t };
