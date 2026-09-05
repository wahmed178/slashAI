import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Button } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { En as Check, Fn as BookmarkCheck, N as ShieldAlert, Pn as Bookmark, Wt as Hammer, _ as TriangleAlert, bt as LoaderCircle, dn as Copy, wt as ListChecks } from "../_libs/lucide-react.mjs";
import { a as SheetHeader, i as SheetDescription, n as Sheet, o as SheetTitle, r as SheetContent, t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { d as relatedIdeas } from "./build-ideas-u3AZgoYC.mjs";
import { a as useIdeaLibrary, n as readSpecCache, o as writeSpecCache } from "./use-build-ideas-DCF1BjC5.mjs";
import { t as Badge } from "./badge-V3Q5-w3O.mjs";
import { n as IdeaScore } from "./IdeaCard-Ba3S1bU-.mjs";
import { n as useServerFn } from "./createSsrRpc-DSyYfJsl.mjs";
import { n as generateSpec, t as Skeleton } from "./build-ideas.functions-BpW3u4I2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./build-ideas._slug-BQipnQrN.mjs";
import { n as extractPrompt, t as Markdown } from "./Markdown-C4_Kb83X.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DQVddJ8f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/build-ideas2._slug-CfaVvDQ7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BuildSpecDrawer({ idea, open, onOpenChange }) {
	const run = useServerFn(generateSpec);
	const [spec, setSpec] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await run({ data: {
				title: idea.title,
				short: idea.shortDescription,
				problem: idea.problem,
				targetUsers: idea.targetUsers,
				solution: idea.proposedSolution,
				keyFeatures: idea.keyFeatures,
				mvpFeatures: idea.mvpFeatures,
				techStack: idea.techStack,
				businessModel: idea.businessModel,
				buildType: idea.buildType
			} });
			setSpec(res.markdown);
			writeSpecCache(idea.slug, res.markdown);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not generate the specification.");
		} finally {
			setLoading(false);
		}
	}, [idea, run]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const cached = readSpecCache(idea.slug);
		if (cached) {
			setSpec(cached);
			return;
		}
		if (!spec && !loading) load();
	}, [open, idea.slug]);
	const prompt = spec ? extractPrompt(spec) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "right",
			className: "w-full overflow-y-auto sm:max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
				className: "text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, { children: ["Build spec — ", idea.title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: "A full product specification plus a paste-ready prompt. Generated once, then kept on this device so it opens instantly and works offline." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 px-4 pb-8",
				children: [
					prompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						onClick: async () => {
							await navigator.clipboard.writeText(prompt);
							setCopied(true);
							toast.success("Prompt copied — paste it into Lovable");
							setTimeout(() => setCopied(false), 1600);
						},
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy Lovable prompt"]
					}) : null,
					loading && !spec ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full" }, i))
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel space-y-3 rounded-xl p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-sm font-semibold text-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
									className: "size-4 text-primary",
									"aria-hidden": true
								}),
								" ",
								error
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => void load(),
							children: "Try again"
						})]
					}) : null,
					spec ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { source: spec }) : null,
					spec ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => void load(),
						disabled: loading,
						children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, " Regenerate"]
					}) : null
				]
			})]
		})
	});
}
function Section({ title, icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel mt-4 rounded-xl p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "flex items-center gap-2 text-base font-bold tracking-tight text-foreground",
			children: [icon, title]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 space-y-2 text-sm text-muted-foreground",
			children
		})]
	});
}
function Bullets({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "ml-4 list-disc space-y-1",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
	});
}
function IdeaDetail() {
	const { idea } = Route.useLoaderData();
	const { saved, toggleSaved, upsertProject } = useIdeaLibrary();
	const [specOpen, setSpecOpen] = (0, import_react.useState)(false);
	const isSaved = saved.includes(idea.id);
	const related = relatedIdeas(idea);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideHeaderSearch: true,
		title: idea.title,
		back: {
			to: "/build-ideas",
			label: "Build Ideas"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pt-2",
				children: [
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
								children: idea.buildType
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: idea.suitableFor
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdeaScore, { score: idea.opportunityScore })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-2xl font-black tracking-tight text-foreground",
						children: idea.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: idea.shortDescription
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => {
								setSpecOpen(true);
								upsertProject({
									ideaId: idea.id,
									slug: idea.slug,
									title: idea.title,
									stage: "Planning"
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hammer, { className: "size-4" }), " Build this"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => toggleSaved(idea.id),
							children: [isSaved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), isSaved ? "Saved" : "Save idea"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Problem & target users",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: idea.problem }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: "Who it's for:"
					}),
					" ",
					idea.targetUsers
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Proposed solution",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: idea.proposedSolution })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel mt-4 rounded-xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold tracking-tight text-foreground",
					children: "Features"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "key",
					className: "mt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "key",
								children: "Key"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "mvp",
								children: "MVP"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "future",
								children: "Future"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "key",
							className: "mt-3 text-sm text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: idea.keyFeatures })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "mvp",
							className: "mt-3 text-sm text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: idea.mvpFeatures })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "future",
							className: "mt-3 text-sm text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: idea.futureFeatures })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Difficulty & tech stack",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: "Difficulty:"
					}),
					" ",
					idea.difficulty
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: idea.techStack.map((tech) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: tech
					}, tech))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Monetization & pricing",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: idea.monetizationOptions }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: "Suggested pricing:"
					}),
					" ",
					idea.pricingSuggestions
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Customer acquisition",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: idea.customerAcquisition }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: "First 10 customers:"
					}),
					" ",
					idea.first10Customers
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Build steps",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, {
					className: "size-4 text-primary",
					"aria-hidden": true
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "ml-4 list-decimal space-y-1",
					children: idea.buildSteps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: step }, step))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Risks & challenges",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
					className: "size-4 text-primary",
					"aria-hidden": true
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bullets, { items: idea.risks })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-4 flex flex-col gap-3 rounded-xl p-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base font-bold text-foreground",
					children: "Ready to build it?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Get a full product spec plus a paste-ready prompt for your AI app builder."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setSpecOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hammer, { className: "size-4" }), " Build this"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => toggleSaved(idea.id),
						children: isSaved ? "Saved" : "Save idea"
					})]
				})]
			}),
			related.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mb-2 text-base font-bold tracking-tight text-foreground",
					children: [
						"More ",
						idea.category,
						" ideas"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2.5 sm:grid-cols-3",
					children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/build-ideas/$slug",
						params: { slug: r.slug },
						className: "panel rounded-xl p-4 transition-colors hover:border-primary/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-bold text-foreground",
							children: r.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-muted-foreground",
							children: r.shortDescription
						})]
					}, r.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuildSpecDrawer, {
				idea,
				open: specOpen,
				onOpenChange: setSpecOpen
			})
		]
	});
}
//#endregion
export { IdeaDetail as component };
