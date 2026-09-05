import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn, n as Button } from "./slashkits-CB7bx4DD.mjs";
import { h as sectionCategories, p as resourcesBySection, r as FREE_STATUSES } from "./resources-sbNg_EgT.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as ResourceGrid } from "./ResourceCard-GrkmTIKp.mjs";
import { n as EmptyState } from "./CommandGrid-DFmNY4E7.mjs";
import { t as Route } from "./discover._section-DLvscLXP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover._section-vCl4K09_.js
var import_jsx_runtime = require_jsx_runtime();
function Chip({ active, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		onClick,
		className: cn("min-h-9 rounded-full border px-3.5 text-sm transition-colors", active ? "border-primary bg-accent text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
		children
	});
}
function SectionPage() {
	const { def } = Route.useLoaderData();
	const { cat = "all", price = "all" } = Route.useSearch();
	const navigate = useNavigate({ from: "/discover/$section" });
	const set = (patch) => void navigate({ search: (p) => ({
		...p,
		...patch
	}) });
	const all = resourcesBySection(def.id);
	const cats = sectionCategories(def.id);
	const list = all.filter((x) => (cat === "all" || x.category === cat) && (price === "all" || x.pricing === price));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: def.label,
		back: {
			to: "/discover",
			label: "Discover"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-black tracking-tight text-foreground",
					children: def.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: def.blurb
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
					active: cat === "all",
					onClick: () => set({ cat: "all" }),
					children: [
						"All (",
						all.length,
						")"
					]
				}), cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
					active: cat === c.category,
					onClick: () => set({ cat: c.category }),
					children: [
						c.category,
						" (",
						c.count,
						")"
					]
				}, c.category))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: price === "all",
					onClick: () => set({ price: "all" }),
					children: "Any status"
				}), FREE_STATUSES.filter((p) => all.some((x) => x.pricing === p)).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: price === p,
					onClick: () => set({ price: p }),
					children: p
				}, p))]
			}),
			def.id === "ai" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "AI Commands live in the full slash-command library."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/explore",
						children: "Browse commands"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: list.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceGrid, { resources: list }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nothing here with those filters",
					hint: "Clear the status filter or pick another category.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => set({
							cat: "all",
							price: "all"
						}),
						children: "Clear filters"
					})
				})
			})
		]
	});
}
//#endregion
export { SectionPage as component };
