import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Button } from "./slashkits-CB7bx4DD.mjs";
import { g as sectionDef, s as RESOURCES } from "./resources-sbNg_EgT.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as Flag, C as Tag, K as Repeat2, wt as ListChecks } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as ResourceGrid, r as VisitButton, t as PricingBadge } from "./ResourceCard-GrkmTIKp.mjs";
import { t as Route } from "./r._id-B-Bay6Ep.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/r._id-BVT-7QUf.js
var import_jsx_runtime = require_jsx_runtime();
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-3 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "shrink-0 text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "min-w-0 text-right font-medium text-foreground",
			children: value
		})]
	});
}
function ResourcePage() {
	const { resource } = Route.useLoaderData();
	const def = sectionDef(resource.section);
	const related = RESOURCES.filter((x) => x.id !== resource.id && (x.category === resource.category || x.section === resource.section)).slice(0, 6);
	const reportUrl = `mailto:?subject=${encodeURIComponent(`SlashAI — broken resource: ${resource.name}`)}&body=${encodeURIComponent(`Resource id: ${resource.id}\nURL: ${resource.url}\nWhat changed: `)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideHeaderSearch: true,
		title: resource.name,
		back: {
			to: `/discover/${resource.section}`,
			label: def?.label ?? "Discover"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				"aria-label": "Breadcrumb",
				className: "pt-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/discover",
						className: "hover:text-foreground",
						children: "Discover"
					}),
					" ",
					"/",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/discover/$section",
						params: { section: resource.section },
						className: "hover:text-foreground",
						children: def?.label
					}),
					" ",
					"/ ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: resource.category
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-black tracking-tight text-foreground",
							children: resource.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingBadge, { pricing: resource.pricing })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: resource.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisitButton, { url: resource.url }), resource.commandQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "min-h-11",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/search",
								search: { q: resource.commandQuery },
								children: "Matching commands"
							})
						})]
					})
				]
			}),
			resource.eligibility && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "panel mt-4 rounded-xl border-primary/30 bg-accent/40 p-3 text-sm text-foreground",
				children: ["Eligibility: ", resource.eligibility]
			}),
			resource.region && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: ["Availability: ", resource.region]
			}),
			resource.steps && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-1.5 text-sm font-semibold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, {
						className: "size-4 text-primary",
						"aria-hidden": true
					}), " How to do it"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-2 space-y-2",
					children: resource.steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2.5 text-sm leading-relaxed text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-primary",
							children: i + 1
						}), s]
					}, s))
				})]
			}),
			resource.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel mt-6 rounded-xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-wider text-primary uppercase",
					children: "Editorial note"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm leading-relaxed text-muted-foreground",
					children: resource.notes
				})]
			}),
			resource.alternativeTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 flex items-center gap-1.5 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat2, {
						className: "size-4 text-primary",
						"aria-hidden": true
					}),
					"A practical free alternative to",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: resource.alternativeTo.join(", ")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-sm font-semibold text-foreground",
						children: "Details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "panel divide-y divide-border rounded-xl text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Type",
								value: resource.type
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Category",
								value: resource.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Audience",
								value: resource.audience.join(", ")
							}),
							resource.platform && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Platform",
								value: resource.platform.join(", ")
							}),
							resource.owner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Owner",
								value: resource.owner
							}),
							resource.language && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Language",
								value: resource.language
							}),
							resource.license && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "License",
								value: resource.license
							}),
							resource.difficulty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Difficulty",
								value: resource.difficulty
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Status",
								value: resource.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Added",
								value: resource.addedDate
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Last updated",
								value: resource.lastUpdated
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Last verified",
								value: resource.lastVerified
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Metadata is curated manually; anything we could not verify is left out rather than guessed."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-1.5",
				children: resource.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
						className: "size-3",
						"aria-hidden": true
					}), t]
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: reportUrl,
				className: "mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
					className: "size-3.5",
					"aria-hidden": true
				}), " Report a broken or changed link"]
			}),
			related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-lg font-bold tracking-tight text-foreground",
					children: "Related"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceGrid, { resources: related })]
			})
		]
	});
}
//#endregion
export { ResourcePage as component };
