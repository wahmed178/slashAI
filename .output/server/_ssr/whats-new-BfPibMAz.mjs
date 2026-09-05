import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CHANGELOG } from "./slashkits-CB7bx4DD.mjs";
import { d as dropItems, i as NEWEST_RESOURCES, n as DROPS } from "./resources-sbNg_EgT.mjs";
import { E as Sparkles, jn as CalendarClock } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as ResourceGrid } from "./ResourceCard-GrkmTIKp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/whats-new-BfPibMAz.js
var import_jsx_runtime = require_jsx_runtime();
var CADENCE_ORDER = [
	"Weekly",
	"Monthly",
	"Special",
	"Yearly"
];
function WhatsNewPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "What's new",
		back: {
			to: "/discover",
			label: "Discover"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "flex items-center gap-2 text-2xl font-black tracking-tight text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "size-6 text-primary",
						"aria-hidden": true
					}), " What's new"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Curated drops are compiled by hand — weekly finds, a monthly batch, special occasions and a yearly toolkit."
				})]
			}),
			CADENCE_ORDER.map((cadence) => {
				const drops = DROPS.filter((d) => d.cadence === cadence);
				if (drops.length === 0) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold tracking-tight text-foreground",
						children: cadence
					}), drops.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1.5 text-sm font-semibold text-foreground",
								children: [d.title, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 text-[11px] font-normal text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, {
											className: "size-3.5",
											"aria-hidden": true
										}),
										" ",
										d.published
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 mb-2.5 text-xs text-muted-foreground",
								children: d.blurb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceGrid, { resources: dropItems(d) })
						]
					}, d.id))]
				}, cadence);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold tracking-tight text-foreground",
					children: "Recently added"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceGrid, { resources: NEWEST_RESOURCES })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold tracking-tight text-foreground",
					children: "App updates"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 space-y-3",
					children: CHANGELOG.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel rounded-xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center justify-between text-sm font-semibold text-foreground",
								children: [
									"v",
									r.version,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-normal text-muted-foreground",
										children: r.date
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-primary",
								children: r.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1.5",
								children: r.changes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2 text-xs leading-relaxed text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 size-1 shrink-0 rounded-full bg-primary" }), c]
								}, c))
							})
						]
					}, r.version))
				})]
			})
		]
	});
}
//#endregion
export { WhatsNewPage as component };
