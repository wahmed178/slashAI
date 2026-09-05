import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Button } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Fn as BookmarkCheck, Pn as Bookmark, Yt as Gauge } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-V3Q5-w3O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/IdeaCard-Ba3S1bU-.js
var import_jsx_runtime = require_jsx_runtime();
function IdeaScore({ score }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 text-xs font-semibold text-primary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, {
				className: "size-3.5",
				"aria-hidden": true
			}),
			score,
			"/10"
		]
	});
}
function IdeaCard({ idea, saved, onToggleSave }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "panel group flex flex-col gap-3 rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-bold leading-tight text-foreground",
					children: idea.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "-mt-1 -mr-1 shrink-0",
					"aria-label": saved ? `Remove ${idea.title} from saved ideas` : `Save ${idea.title}`,
					onClick: () => onToggleSave(idea.id),
					children: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "size-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: idea.shortDescription
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: idea.category
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: idea.difficulty
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: idea.businessModel
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto flex items-center justify-between gap-2 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdeaScore, { score: idea.opportunityScore }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/build-ideas/$slug",
						params: { slug: idea.slug },
						children: "View idea"
					})
				})]
			})
		]
	});
}
//#endregion
export { IdeaScore as n, IdeaCard as t };
