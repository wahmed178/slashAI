import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Button } from "./slashkits-CB7bx4DD.mjs";
import { E as Sparkles, _ as TriangleAlert, bt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { i as saveValidation } from "./use-build-ideas-DCF1BjC5.mjs";
import { t as Badge } from "./badge-V3Q5-w3O.mjs";
import { t as Textarea } from "./textarea-B8ksLbD-.mjs";
import { n as useServerFn } from "./createSsrRpc-DSyYfJsl.mjs";
import { r as validateIdea, t as Skeleton } from "./build-ideas.functions-BpW3u4I2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/build-ideas.validate-B1Dx9t-H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ScoreCard({ title, score, notes }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel rounded-xl p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-bold text-foreground",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-lg font-black text-primary",
				children: [score, "/10"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: notes
		})]
	});
}
function ValidatePage() {
	const run = useServerFn(validateIdea);
	const [idea, setIdea] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function submit() {
		setLoading(true);
		setError(null);
		setResult(null);
		try {
			const res = await run({ data: { idea: idea.trim() } });
			const parsed = JSON.parse(res.json.replace(/^```json\s*|```$/g, "").trim());
			setResult(parsed);
		} catch (e) {
			setError(e instanceof Error && e.message.length < 160 ? e.message : "Could not analyse that idea. Try again in a moment.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideHeaderSearch: true,
		title: "Idea validator",
		back: {
			to: "/build-ideas",
			label: "Build Ideas"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "flex items-center gap-2 text-2xl font-black tracking-tight text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "size-6 text-primary",
						"aria-hidden": true
					}), " Idea validator"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Describe your idea in a few sentences — the problem, who it's for, and how you'd charge. You'll get a structured read before you spend a weekend on it."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-4 space-y-3 rounded-xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: idea,
					onChange: (e) => setIdea(e.target.value),
					rows: 6,
					placeholder: "A tool that watches a freelancer's invoices and chases late payers automatically over email and WhatsApp…",
					"aria-label": "Describe your idea"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => void submit(),
						disabled: loading || idea.trim().length < 20,
						children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "Validate idea"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: idea.trim().length < 20 ? "Add a little more detail (20+ characters)." : ""
					})]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-2.5 sm:grid-cols-2",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel space-y-2 rounded-xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-1/2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-2/3" })
					]
				}, i))
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-4 space-y-3 rounded-xl p-4",
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
					onClick: () => void submit(),
					children: "Try again"
				})]
			}) : null,
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel flex flex-col gap-2 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Overall opportunity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-3xl font-black text-foreground",
							children: [result.overallScore, "/10"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: result.recommendation
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-md text-sm text-muted-foreground",
								children: result.reason
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2.5 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCard, {
								title: "Problem clarity",
								score: result.problemClarity.score,
								notes: result.problemClarity.notes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCard, {
								title: "Monetization potential",
								score: result.monetization.score,
								notes: result.monetization.notes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCard, {
								title: "Build difficulty",
								score: result.buildDifficulty.score,
								notes: result.buildDifficulty.notes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCard, {
								title: "Acquisition difficulty",
								score: result.acquisitionDifficulty.score,
								notes: result.acquisitionDifficulty.notes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "panel rounded-xl p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-bold text-foreground",
										children: "Target customer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-medium text-primary",
										children: result.targetCustomer.customer
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: result.targetCustomer.notes
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "panel rounded-xl p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-bold text-foreground",
										children: "Competition"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-medium text-primary",
										children: result.competition.level
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: result.competition.notes
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel rounded-xl p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-foreground",
							children: "Differentiation opportunities"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 ml-4 list-disc space-y-1 text-sm text-muted-foreground",
							children: result.differentiation.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: d }, d))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => {
								saveValidation({
									id: `val-${Date.now()}`,
									input: idea.trim(),
									result,
									createdAt: (/* @__PURE__ */ new Date()).toISOString()
								});
								toast.success("Saved to My projects");
							},
							children: "Save this analysis"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "AI-generated analysis. Not guaranteed market research."
						})]
					})
				]
			}) : null
		]
	});
}
//#endregion
export { ValidatePage as component };
