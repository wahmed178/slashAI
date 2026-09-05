import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn, k as scoreCommand, n as Button, o as COMMANDS } from "./slashkits-CB7bx4DD.mjs";
import { m as searchResources } from "./resources-sbNg_EgT.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Sparkles, En as Check, Un as ArrowRight, c as WandSparkles, dn as Copy } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as ResourceGrid } from "./ResourceCard-GrkmTIKp.mjs";
import { t as BUILD_IDEAS } from "./build-ideas-u3AZgoYC.mjs";
import { t as categoryIcon } from "./icons-BxDbBHfu.mjs";
import { t as CommandGrid } from "./CommandGrid-DFmNY4E7.mjs";
import { t as Route } from "./find-SGMCI152.mjs";
import { t as feedback } from "./play-sound-4NQwUsQc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/find-CsoEOeAe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Intent engine — turns free-text keywords into a shortlist of app features,
* catalog matches and a ready-to-copy prompt. Purely local and deterministic,
* so it works offline and never spends credits.
*/
/** Everything in SlashAI a keyword can resolve to. */
var FEATURES = [
	{
		id: "commands",
		label: "Command library",
		blurb: "Slash commands for any AI assistant, with copy-ready examples.",
		to: "/search",
		keywords: [
			"command",
			"prompt",
			"slash",
			"ai",
			"chatgpt",
			"gemini",
			"claude",
			"write",
			"image",
			"code",
			"summarize"
		],
		icon: "Terminal"
	},
	{
		id: "ideas",
		label: "Build ideas",
		blurb: "Validated product ideas with MVP scope, monetisation and build steps.",
		to: "/build-ideas",
		keywords: [
			"idea",
			"startup",
			"saas",
			"business",
			"side project",
			"build",
			"app idea",
			"product",
			"mvp"
		],
		icon: "Lightbulb"
	},
	{
		id: "validate",
		label: "Idea validator",
		blurb: "Pressure-test an idea before you build it.",
		to: "/build-ideas/validate",
		keywords: [
			"validate",
			"validation",
			"market",
			"competition",
			"risk",
			"demand"
		],
		icon: "Sparkles"
	},
	{
		id: "projects",
		label: "My projects",
		blurb: "Track the ideas you saved and what stage they're at.",
		to: "/build-ideas/projects",
		keywords: [
			"project",
			"tracker",
			"progress",
			"stage",
			"saved"
		],
		icon: "FolderKanban"
	},
	{
		id: "assistant",
		label: "Assistant & tasks",
		blurb: "Ask in plain words, get a workflow plus tasks you can tick off.",
		to: "/assistant",
		keywords: [
			"assistant",
			"bot",
			"help",
			"task",
			"todo",
			"workflow",
			"plan",
			"steps",
			"checklist",
			"reminder"
		],
		icon: "Bot"
	},
	{
		id: "youtube",
		label: "YouTube hub",
		blurb: "Search videos and music, play them in an embedded player.",
		to: "/youtube",
		keywords: [
			"youtube",
			"video",
			"music",
			"song",
			"songs",
			"watch",
			"lofi",
			"playlist",
			"audio",
			"tutorial"
		],
		icon: "Youtube"
	},
	{
		id: "movies",
		label: "Movie finder",
		blurb: "Regional films from India, Pakistan and neighbours with legal watch links.",
		to: "/movies",
		keywords: [
			"movie",
			"movies",
			"film",
			"cinema",
			"bollywood",
			"telugu",
			"tamil",
			"hindi",
			"urdu",
			"malayalam",
			"pakistani",
			"netflix",
			"streaming"
		],
		icon: "Film"
	},
	{
		id: "live",
		label: "Live dashboard",
		blurb: "News, weather and cricket + football scores in one place.",
		to: "/live",
		keywords: [
			"news",
			"weather",
			"cricket",
			"football",
			"score",
			"match",
			"live",
			"today",
			"temperature",
			"forecast"
		],
		icon: "Radio"
	},
	{
		id: "tools",
		label: "Free tools",
		blurb: "Hand-checked free AI tools and web apps.",
		to: "/tools",
		keywords: [
			"tool",
			"tools",
			"free",
			"app",
			"software",
			"generator",
			"editor",
			"converter"
		],
		icon: "Wrench"
	},
	{
		id: "discover",
		label: "Discover hub",
		blurb: "Free AI, GitHub gems, Reddit wikis, websites and learning resources.",
		to: "/discover",
		keywords: [
			"discover",
			"resource",
			"github",
			"reddit",
			"website",
			"learn",
			"course",
			"free stuff",
			"open source"
		],
		icon: "Compass"
	},
	{
		id: "play",
		label: "Play & decide",
		blurb: "Coin toss, dice, decision wheel and a surprise command.",
		to: "/play",
		keywords: [
			"play",
			"game",
			"bored",
			"toss",
			"coin",
			"dice",
			"random",
			"decide",
			"fun",
			"time pass"
		],
		icon: "Dices"
	},
	{
		id: "collections",
		label: "Collections",
		blurb: "Curated command bundles for a specific job.",
		to: "/collections",
		keywords: [
			"collection",
			"bundle",
			"pack",
			"curated",
			"workflow"
		],
		icon: "Layers"
	},
	{
		id: "favorites",
		label: "Saved items",
		blurb: "Everything you starred, in one list.",
		to: "/favorites",
		keywords: [
			"saved",
			"favorite",
			"favourite",
			"starred",
			"bookmark"
		],
		icon: "Heart"
	}
];
var norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
var tokens = (s) => norm(s).split(/\s+/).filter((t) => t.length > 1);
function matchFeatures(query, limit = 5) {
	const q = norm(query).trim();
	if (!q) return [];
	const words = tokens(q);
	const out = [];
	for (const feature of FEATURES) {
		let score = 0;
		const hits = [];
		for (const kw of feature.keywords) {
			if (q.includes(kw)) {
				score += kw.includes(" ") ? 60 : 40;
				hits.push(kw);
				continue;
			}
			for (const w of words) if (kw.startsWith(w) || w.startsWith(kw)) {
				score += 18;
				hits.push(kw);
				break;
			}
		}
		if (norm(feature.label).includes(q)) score += 80;
		if (score > 0) out.push({
			feature,
			score,
			hits: [...new Set(hits)].slice(0, 4)
		});
	}
	return out.sort((a, b) => b.score - a.score).slice(0, limit);
}
function topCommands(q, limit) {
	const scored = [];
	for (const c of COMMANDS) {
		const s = scoreCommand(c, q);
		if (s > 0) scored.push({
			c,
			s
		});
	}
	return scored.sort((a, b) => b.s - a.s || b.c.popularity - a.c.popularity).slice(0, limit).map((x) => x.c);
}
function topIdeas(q, limit) {
	const words = tokens(q);
	if (words.length === 0) return [];
	return BUILD_IDEAS.map((idea) => {
		const hay = norm([
			idea.title,
			idea.shortDescription,
			idea.category,
			idea.tags.join(" ")
		].join(" "));
		let s = 0;
		for (const w of words) if (hay.includes(w)) s += w.length > 4 ? 3 : 2;
		return {
			idea,
			s
		};
	}).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || b.idea.opportunityScore - a.idea.opportunityScore).slice(0, limit).map((x) => x.idea);
}
/** Build a copy-ready prompt from the query and the strongest catalog matches. */
function buildPrompt(query, commands) {
	const goal = query.trim().replace(/\s+/g, " ");
	const useful = commands.slice(0, 3);
	const lines = [
		`Goal: ${goal || "help me get this done"}`,
		"Role: act as an expert who has shipped this exact thing many times.",
		"",
		"Do this:",
		"1. Ask me at most 3 questions only if something blocks you — otherwise start.",
		"2. Give a short plan, then the actual output (not a description of it).",
		"3. Flag assumptions and the one thing most likely to go wrong.",
		"",
		"Output format: headed sections, no filler, copy-paste ready."
	];
	if (useful.length) lines.push("", `Related SlashAI commands you can chain: ${useful.map((c) => c.command).join(", ")}`);
	return lines.join("\n");
}
/** Turn a query into an ordered, actionable workflow. */
function buildWorkflow(query, features) {
	const steps = [`Write the outcome in one sentence: "${query.trim() || "your goal"}" — done means what exactly?`, "Collect the inputs first (files, links, numbers) so nothing stalls mid-flow."];
	for (const f of features.slice(0, 3)) steps.push(`Open ${f.feature.label} — ${f.feature.blurb}`);
	steps.push("Run the generated prompt in your AI assistant and paste the raw output back.", "Review against the outcome sentence, then keep only what moves it forward.");
	return steps;
}
function resolveIntent(query) {
	const features = matchFeatures(query, 5);
	const commands = topCommands(query, 8);
	return {
		query,
		features,
		commands,
		ideas: topIdeas(query, 4),
		resources: query.trim() ? searchResources(query, 4) : [],
		prompt: buildPrompt(query, commands),
		steps: buildWorkflow(query, features)
	};
}
var EXAMPLES = [
	"make a study plan for my exams",
	"free tools to edit a podcast",
	"startup idea for local shops",
	"watch telugu movies legally",
	"cricket score and weather today",
	"write cold emails that convert"
];
function FindPage() {
	const { q } = Route.useSearch();
	const navigate = useNavigate({ from: "/find" });
	const [draft, setDraft] = (0, import_react.useState)(q);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const result = (0, import_react.useMemo)(() => resolveIntent(q), [q]);
	const submit = (term) => {
		feedback("tap");
		setDraft(term);
		navigate({ search: { q: term } });
	};
	const copyPrompt = async () => {
		try {
			await navigator.clipboard.writeText(result.prompt);
			feedback("win");
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "Advanced search",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
					children: "Say what you want"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: "Plain words in — the right features, commands and a ready prompt out."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					submit(draft.trim());
				},
				className: "glass flex flex-col gap-2 rounded-2xl p-3 sm:flex-row sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						autoFocus: true,
						"aria-label": "Describe what you want",
						placeholder: "e.g. plan my week, upscale an old photo, find free design tools…",
						className: "h-12 w-full rounded-xl border border-border bg-surface pr-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "min-h-12 gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), " Shortlist"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: EXAMPLES.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => submit(ex),
					className: "rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
					children: ex
				}, ex))
			}),
			!q.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted-foreground",
				children: "Start typing above — everything in SlashAI is searchable from this one box."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-7 space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
						children: [
							"Best features for “",
							q,
							"”"
						]
					}), result.features.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
						children: result.features.map(({ feature, hits }) => {
							const Icon = categoryIcon(feature.icon);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: feature.to,
								className: "glass lift flex items-start gap-3 rounded-2xl p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-4.5",
										"aria-hidden": true
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 text-sm font-semibold text-foreground",
											children: [
												feature.label,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 text-muted-foreground" })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 block text-sm text-muted-foreground",
											children: feature.blurb
										}),
										hits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-1.5 block truncate text-[11px] text-muted-foreground/80",
											children: ["matched: ", hits.join(", ")]
										})
									]
								})]
							}, feature.id);
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No feature matched directly — the command matches below are usually what you want."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2.5 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
							children: "Ready-to-copy prompt"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: copied ? "secondary" : "default",
							className: "gap-1.5",
							onClick: copyPrompt,
							children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copied" : "Copy prompt"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: cn("glass overflow-x-auto rounded-2xl p-4 font-mono text-[12.5px] leading-relaxed text-foreground"),
						children: result.prompt
					})] }),
					result.commands.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
						children: [
							"Matching commands (",
							result.commands.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGrid, {
						commands: result.commands,
						query: q
					})] }),
					result.ideas.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Build ideas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: result.ideas.map((idea) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/build-ideas/$slug",
							params: { slug: idea.slug },
							className: "glass lift rounded-2xl p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold text-foreground",
								children: idea.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-sm text-muted-foreground",
								children: idea.shortDescription
							})]
						}, idea.id))
					})] }),
					result.resources.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Free resources"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceGrid, { resources: result.resources })] })
				]
			})
		]
	});
}
//#endregion
export { FindPage as component };
