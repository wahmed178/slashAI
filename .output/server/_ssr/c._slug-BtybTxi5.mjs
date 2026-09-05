import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as relatedCommands, I as useLibrary, _ as commandTemplate, h as cn, n as Button, r as CATEGORY_ICONS, x as getRandomCommand, y as getCommand } from "./slashkits-CB7bx4DD.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { En as Check, P as Share2, T as Star, Ut as Hash, c as WandSparkles, dn as Copy, in as ExternalLink, j as Shuffle } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as Route } from "./c._slug-B_MoZEjQ.mjs";
import { t as categoryIcon } from "./icons-BxDbBHfu.mjs";
import { t as useCommandActions } from "./use-command-actions-VhrigLFg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/c._slug-BtybTxi5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AI_TARGETS = [
	{
		id: "chatgpt",
		name: "ChatGPT",
		url: "https://chat.openai.com",
		tip: "Paste the command, then attach the file or text on the same message — it handles mixed input well.",
		free: "Free tier"
	},
	{
		id: "claude",
		name: "Claude",
		url: "https://claude.ai",
		tip: "Best with long input. Put the command first, then the document underneath it.",
		free: "Free plan"
	},
	{
		id: "gemini",
		name: "Gemini",
		url: "https://gemini.google.com",
		tip: "Strong on images and current information — good for anything visual or web-grounded.",
		free: "Free"
	},
	{
		id: "grok",
		name: "Grok",
		url: "https://grok.com",
		tip: "Add 'be concise' after the command; it defaults to a chatty tone.",
		free: "Free tier"
	},
	{
		id: "perplexity",
		name: "Perplexity",
		url: "https://www.perplexity.ai",
		tip: "Use it when you want sources — ask the command to cite links in the answer.",
		free: "Free"
	},
	{
		id: "deepseek",
		name: "DeepSeek",
		url: "https://chat.deepseek.com",
		tip: "Turn on the reasoning mode for analysis, maths and multi-step commands.",
		free: "Free tier"
	},
	{
		id: "duck",
		name: "Duck.ai",
		url: "https://duck.ai",
		tip: "Anonymous and no sign-in — the safest place for anything personal.",
		free: "Completely free"
	}
];
var defaultAiTarget = AI_TARGETS[0];
function CommandDetailContent({ command, favorite, onToggleFavorite, onOpenCommand }) {
	const Icon = categoryIcon(CATEGORY_ICONS[command.category]);
	const related = relatedCommands(command);
	const { copyCommand, copyPrompt, runCommand, shareCommand } = useCommandActions();
	const [template, setTemplate] = (0, import_react.useState)(() => commandTemplate(command));
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [targetId, setTargetId] = (0, import_react.useState)(defaultAiTarget.id);
	const target = AI_TARGETS.find((t) => t.id === targetId) ?? defaultAiTarget;
	(0, import_react.useEffect)(() => {
		setTemplate(commandTemplate(command));
		setCopied(false);
	}, [command]);
	const flash = () => {
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1600);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-accent/50 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "min-w-0 flex-1 font-mono text-lg font-semibold break-all text-foreground",
						children: command.command
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "secondary",
						className: "gap-1.5",
						onClick: () => {
							copyCommand(command);
							flash();
						},
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copied" : "Copy"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: command.category }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: command.subcategory }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md border border-border px-1.5 py-0.5 capitalize",
						children: command.difficulty
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md border border-border px-1.5 py-0.5 capitalize",
						children: command.type
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
				children: "What it does"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-sm text-foreground",
				children: command.description
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
				children: "How to use"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-sm text-foreground",
				children: command.howToUse
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
				children: "Example"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-1.5 overflow-x-auto rounded-lg border border-border bg-muted p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground",
				children: command.example
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: "command-template",
				className: "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
				children: "Editable template"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "command-template",
				value: template,
				onChange: (e) => setTemplate(e.target.value),
				spellCheck: false,
				rows: 8,
				className: "mt-1.5 w-full resize-y rounded-lg border border-border bg-surface p-3 font-mono text-xs leading-relaxed text-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
					children: "Run it in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1",
					children: AI_TARGETS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": target.id === t.id,
						onClick: () => setTargetId(t.id),
						className: cn("min-h-9 shrink-0 rounded-full border px-3.5 text-sm transition-colors", target.id === t.id ? "border-primary bg-accent text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
						children: t.name
					}, t.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 rounded-xl border border-border bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-foreground",
						children: target.tip
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2.5 flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							className: "gap-1.5",
							onClick: () => {
								navigator.clipboard.writeText(template);
								flash();
								window.open(target.url, "_blank", "noopener,noreferrer");
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }),
								" Copy & open ",
								target.name
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: target.free
						})]
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex flex-wrap items-center gap-1.5",
				children: command.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {
						className: "size-3",
						"aria-hidden": true
					}), tag]
				}, tag))
			}),
			related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
					children: "Related commands"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					className: "h-7 gap-1.5 text-xs",
					onClick: () => onOpenCommand(related[Math.floor(Math.random() * related.length)] ?? getRandomCommand(command.id)),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-3.5" }), " Random related"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-1.5",
				children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onOpenCommand(r),
					className: "rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
					children: r.command
				}, r.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-t border-border pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => runCommand(command, template),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4" }), " Use command"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => copyPrompt(command, template),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Copy full prompt"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => void shareCommand(command),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), " Share"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						"aria-pressed": favorite,
						onClick: () => onToggleFavorite(command.id),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-4", favorite && "fill-primary text-primary") }), favorite ? "Favorited" : "Favorite"]
					})
				]
			})
		]
	});
}
function CommandPage() {
	const { slug } = Route.useParams();
	const command = getCommand(slug);
	const navigate = useNavigate();
	const { isFavorite, toggleFavorite, recordUse } = useLibrary();
	(0, import_react.useEffect)(() => {
		if (command) recordUse(command.id);
	}, [command, recordUse]);
	const open = (cmd) => void navigate({
		to: "/c/$slug",
		params: { slug: cmd.id }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		hideHeaderSearch: true,
		title: command?.command ?? "Command",
		back: {
			to: "/explore",
			label: "Back"
		},
		children: command ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/explore/$category",
						params: { category: command.category },
						className: "text-primary hover:underline",
						children: command.category
					}),
					" ",
					"/",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/explore/$category/$subcategory",
						params: {
							category: command.category,
							subcategory: command.subcategory
						},
						className: "hover:underline",
						children: command.subcategory
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 mb-4 text-2xl font-black tracking-tight text-foreground",
				children: command.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandDetailContent, {
				command,
				favorite: isFavorite(command.id),
				onToggleFavorite: toggleFavorite,
				onOpenCommand: open
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel flex flex-col items-center rounded-xl px-6 py-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold text-foreground",
					children: "Command not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 max-w-sm text-sm text-muted-foreground",
					children: [
						"“",
						slug,
						"” isn’t in the library. It may have been renamed or merged into another command."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/explore",
						children: "Browse all commands"
					})
				})
			]
		})
	});
}
//#endregion
export { CommandPage as component };
