import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn } from "./slashkits-CB7bx4DD.mjs";
import { n as ROADMAP_TOTAL, t as ALL_ROADMAPS } from "./roadmaps-JDCJRZid.mjs";
import { H as Route, Tn as ChevronDown, b as Timer, p as Users } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as feedback } from "./play-sound-4NQwUsQc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roadmaps-CVM1Ui_o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Meta({ icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 text-xs text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-3.5",
			"aria-hidden": true
		}), children]
	});
}
function Timeline({ roadmap }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "mt-4 space-y-5 border-l border-border/70 pl-4",
		children: roadmap.phases.map((phase) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: "absolute -left-[21px] top-1 size-2.5 rounded-full bg-primary ring-4 ring-background"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold tracking-wide text-primary uppercase",
					children: phase.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2.5",
					children: phase.steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-primary",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: step.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted-foreground",
								children: step.detail
							})]
						})]
					}, step.title))
				})
			]
		}, phase.name))
	});
}
function RoadmapsPage() {
	const [openId, setOpenId] = (0, import_react.useState)(ALL_ROADMAPS[0]?.id ?? null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideHeaderSearch: true,
		title: "Roadmaps",
		wide: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-2xl font-black tracking-tight text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
					className: "size-6 text-primary",
					"aria-hidden": true
				}), "Founder Roadmaps"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1.5 text-sm text-muted-foreground",
				children: [ROADMAP_TOTAL, " visual paths for the journeys every builder repeats — pick one, follow the phases."]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 space-y-3 pb-8",
			children: ALL_ROADMAPS.map((r) => {
				const open = openId === r.id;
				const steps = r.phases.reduce((n, p) => n + p.steps.length, 0);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "panel overflow-hidden rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-expanded": open,
						onClick: () => {
							feedback("tap");
							setOpenId(open ? null : r.id);
						},
						className: "flex w-full items-start justify-between gap-3 p-4 text-left transition-colors hover:bg-accent/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold text-foreground",
									children: r.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-sm text-muted-foreground",
									children: r.tagline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
											icon: Timer,
											children: r.duration
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
											icon: Users,
											children: r.audience
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Meta, {
											icon: Route,
											children: [
												r.phases.length,
												" phases · ",
												steps,
												" steps"
											]
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
							className: cn("mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180"),
							"aria-hidden": true
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-t border-border/60 px-4 pb-4 pt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, { roadmap: r })
							})
						})
					})]
				}, r.id);
			})
		})]
	});
}
//#endregion
export { RoadmapsPage as component };
