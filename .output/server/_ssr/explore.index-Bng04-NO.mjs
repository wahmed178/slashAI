import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as CATEGORY_TREE, m as VERIFIED_TOTAL, u as SUBCATEGORY_TOTAL } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { En as Check, dn as Copy, wn as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as categoryIcon } from "./icons-BxDbBHfu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore.index-Bng04-NO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Each command gets a one-line description so users know exactly what it does */
var USE_CASES = [
	{
		id: "images",
		icon: "🖼️",
		title: "Images & Design",
		description: "Generate, edit and upscale images",
		commands: [
			{
				cmd: "/bokeh",
				desc: "Add cinematic depth-of-field blur to photos"
			},
			{
				cmd: "/hd",
				desc: "Upscale any image to high resolution"
			},
			{
				cmd: "/upscale",
				desc: "Enhance image quality and detail"
			},
			{
				cmd: "/ghibli",
				desc: "Transform photos into Studio Ghibli art style"
			},
			{
				cmd: "/cinematic",
				desc: "Give images a dramatic movie look"
			},
			{
				cmd: "/pixar",
				desc: "Turn portraits into Pixar-style 3D characters"
			}
		]
	},
	{
		id: "video",
		icon: "🎬",
		title: "Video & Audio",
		description: "Create video scripts, storyboards and audio content",
		commands: [
			{
				cmd: "/WriteVideoScript",
				desc: "Write a full video script with hooks and CTA"
			},
			{
				cmd: "/VoiceOver",
				desc: "Generate a voiceover script for any topic"
			},
			{
				cmd: "/storyboard",
				desc: "Break a scene into shot-by-shot frames"
			},
			{
				cmd: "/montage",
				desc: "Plan a montage sequence with transitions"
			},
			{
				cmd: "/subtitle",
				desc: "Generate SRT subtitles from transcript text"
			}
		]
	},
	{
		id: "writing",
		icon: "✍️",
		title: "Writing & Content",
		description: "Blog posts, emails, social media and more",
		commands: [
			{
				cmd: "/WriteEmail",
				desc: "Draft professional emails with the right tone"
			},
			{
				cmd: "/WriteLinkedIn",
				desc: "Create engaging LinkedIn posts that get reach"
			},
			{
				cmd: "/WriteCoverLetter",
				desc: "Tailored cover letter for any job posting"
			},
			{
				cmd: "/Rewrite",
				desc: "Rewrite text for clarity, tone or audience"
			},
			{
				cmd: "/bullets",
				desc: "Turn long text into crisp bullet points"
			},
			{
				cmd: "/thread",
				desc: "Create a Twitter/X thread from any topic"
			}
		]
	},
	{
		id: "code",
		icon: "💻",
		title: "Code & Debug",
		description: "Fix bugs, explain code and build features faster",
		commands: [
			{
				cmd: "/FixBug",
				desc: "Diagnose and fix errors with context"
			},
			{
				cmd: "/ExplainCode",
				desc: "Walk through any code line by line"
			},
			{
				cmd: "/DebugError",
				desc: "Trace error messages to root cause"
			},
			{
				cmd: "/WriteAPI",
				desc: "Scaffold a REST API endpoint with validation"
			},
			{
				cmd: "/refactor",
				desc: "Clean up messy code without changing behavior"
			},
			{
				cmd: "/test",
				desc: "Generate unit tests for any function"
			}
		]
	},
	{
		id: "learn",
		icon: "🎓",
		title: "Learning & Study",
		description: "Summarize, translate and create study materials",
		commands: [
			{
				cmd: "/eli5",
				desc: "Explain any concept like you're five years old"
			},
			{
				cmd: "/tldr",
				desc: "Get the essential points in 3 sentences"
			},
			{
				cmd: "/SummarizeDoc",
				desc: "Condense articles, papers or notes"
			},
			{
				cmd: "/TranslateText",
				desc: "Translate with context-aware accuracy"
			},
			{
				cmd: "/CreateOutline",
				desc: "Build a structured outline for any topic"
			},
			{
				cmd: "/flashcards",
				desc: "Generate study flashcards from any content"
			}
		]
	},
	{
		id: "business",
		icon: "🚀",
		title: "Business & Startup",
		description: "Strategy frameworks, pitch decks and analysis",
		commands: [
			{
				cmd: "/swot",
				desc: "Run a strengths / weaknesses / opportunities / threats analysis"
			},
			{
				cmd: "/risks",
				desc: "Identify and rank potential risks for any plan"
			},
			{
				cmd: "/firstprinciples",
				desc: "Break a problem down to fundamental truths"
			},
			{
				cmd: "/steelman",
				desc: "Build the strongest possible version of an argument"
			},
			{
				cmd: "/critique",
				desc: "Get constructive critique on any idea or draft"
			},
			{
				cmd: "/pro",
				desc: "Elevate any text to a professional, polished tone"
			}
		]
	}
];
/** Command card — shows name + description, copies on click */
function CommandCard({ cmd, desc }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const handleCopy = (0, import_react.useCallback)(() => {
		navigator.clipboard.writeText(cmd).catch(() => {});
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	}, [cmd]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: handleCopy,
		className: "group flex min-h-[56px] flex-col justify-center gap-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/50 sm:px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: "min-w-0 flex-1 truncate text-[13px] font-semibold",
				style: {
					fontFamily: "Geist Mono, ui-monospace, monospace",
					color: copied ? "#3fb950" : "var(--foreground)"
				},
				children: cmd
			}), copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 shrink-0 text-green-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "line-clamp-1 text-[12px] text-muted-foreground",
			children: desc
		})]
	});
}
function ExplorePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		wide: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-content",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-black tracking-tight text-foreground sm:text-3xl",
						children: "Commands"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							VERIFIED_TOTAL.toLocaleString(),
							" commands across ",
							CATEGORY_TREE.length,
							" categories · Copy any command and paste it into ChatGPT, Claude, Gemini or any AI"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-8",
					children: USE_CASES.map((uc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl",
							"aria-hidden": true,
							children: uc.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[15px] font-bold text-foreground",
							children: uc.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] text-muted-foreground",
							children: uc.description
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
						children: uc.commands.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandCard, {
							cmd: c.cmd,
							desc: c.desc
						}, c.cmd))
					})] }, uc.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-8 border-t border-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 text-[15px] font-bold text-foreground",
						children: "All Categories"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-4 text-[12px] text-muted-foreground",
						children: [
							CATEGORY_TREE.length,
							" categories · ",
							SUBCATEGORY_TOTAL,
							" subcategories"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3",
						children: CATEGORY_TREE.map((c) => {
							const Icon = categoryIcon(c.icon);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/explore/$category",
								params: { category: c.category },
								className: "group flex min-h-[72px] items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											className: "size-5",
											"aria-hidden": true
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm font-bold text-foreground",
											children: c.category
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block truncate text-xs text-muted-foreground",
											children: [
												c.count,
												" commands · ",
												c.subcategories.length,
												" subcategories"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
										className: "size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5",
										"aria-hidden": true
									})
								]
							}, c.category);
						})
					})
				] })
			]
		})
	});
}
//#endregion
export { ExplorePage as component };
