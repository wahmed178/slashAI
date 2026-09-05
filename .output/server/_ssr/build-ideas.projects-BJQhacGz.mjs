import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn, n as Button } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Zt as FolderKanban, y as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as BUILD_IDEAS } from "./build-ideas-u3AZgoYC.mjs";
import { a as useIdeaLibrary, r as readValidations, t as PROJECT_STAGES } from "./use-build-ideas-DCF1BjC5.mjs";
import { t as Badge } from "./badge-V3Q5-w3O.mjs";
import { t as Textarea } from "./textarea-B8ksLbD-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/build-ideas.projects-BJQhacGz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectsPage() {
	const { ready, saved, removeSaved, projects, upsertProject, removeProject } = useIdeaLibrary();
	const [validations, setValidations] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => setValidations(readValidations()), []);
	const savedIdeas = BUILD_IDEAS.filter((i) => saved.includes(i.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "My projects",
		back: {
			to: "/build-ideas",
			label: "Build Ideas"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "flex items-center gap-2 text-2xl font-black tracking-tight text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, {
						className: "size-6 text-primary",
						"aria-hidden": true
					}), " My projects"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Everything here lives on this device — no login required. It travels with your JSON backup from Settings."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-base font-bold tracking-tight text-foreground",
					children: [
						"Saved ideas (",
						savedIdeas.length,
						")"
					]
				}), !ready ? null : savedIdeas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel mt-2 rounded-xl p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-foreground",
							children: "Nothing saved yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Tap the bookmark on any idea to keep it here."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-4",
							size: "sm",
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/build-ideas",
								children: "Browse ideas"
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3",
					children: savedIdeas.map((idea) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel flex flex-col gap-2 rounded-xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/build-ideas/$slug",
								params: { slug: idea.slug },
								className: "text-sm font-bold text-foreground hover:text-primary",
								children: idea.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: idea.shortDescription
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-auto flex items-center justify-between gap-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									children: idea.category
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => upsertProject({
											ideaId: idea.id,
											slug: idea.slug,
											title: idea.title,
											stage: "Idea"
										}),
										children: "Track"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										"aria-label": `Remove ${idea.title}`,
										onClick: () => removeSaved(idea.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})]
								})]
							})
						]
					}, idea.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-base font-bold tracking-tight text-foreground",
					children: [
						"Projects (",
						projects.length,
						")"
					]
				}), !ready ? null : projects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel mt-2 rounded-xl p-6 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-foreground",
						children: "No projects tracked"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Hit “Build this” on an idea, or “Track” on a saved one, to start a tracker."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 space-y-3",
					children: projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "panel rounded-xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/build-ideas/$slug",
									params: { slug: project.slug },
									className: "text-sm font-bold text-foreground hover:text-primary",
									children: project.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									"aria-label": `Remove project ${project.title}`,
									onClick: () => removeProject(project.ideaId),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-1.5",
								children: PROJECT_STAGES.map((stage) => {
									const current = PROJECT_STAGES.indexOf(project.stage);
									const done = PROJECT_STAGES.indexOf(stage) <= current;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": project.stage === stage,
										onClick: () => upsertProject({
											ideaId: project.ideaId,
											stage
										}),
										className: cn("min-h-8 rounded-full border px-3 text-xs font-medium transition-colors", project.stage === stage ? "border-primary bg-primary text-primary-foreground" : done ? "border-primary/40 text-primary" : "border-border text-muted-foreground hover:text-foreground"),
										children: stage
									}, stage);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-3",
								rows: 3,
								placeholder: "Notes — what's next, what's blocked, what you learned…",
								"aria-label": `Notes for ${project.title}`,
								defaultValue: project.notes,
								onBlur: (e) => upsertProject({
									ideaId: project.ideaId,
									notes: e.target.value
								})
							})
						]
					}, project.ideaId))
				})]
			}),
			validations.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-base font-bold tracking-tight text-foreground",
					children: [
						"Saved validations (",
						validations.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 space-y-2",
					children: validations.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel rounded-xl p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground",
							children: v.input
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								"Analysed ",
								new Date(v.createdAt).toLocaleDateString(),
								" · AI-generated analysis, not guaranteed market research."
							]
						})]
					}, v.id))
				})]
			}) : null
		]
	});
}
//#endregion
export { ProjectsPage as component };
