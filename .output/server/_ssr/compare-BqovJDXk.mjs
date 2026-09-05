import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compare-BqovJDXk.js
var import_jsx_runtime = require_jsx_runtime();
var MODELS = [
	{
		name: "GPT-4o",
		provider: "OpenAI",
		free: "Limited (ChatGPT free)",
		context: "128K",
		coding: 5,
		reasoning: 5,
		vision: true,
		speed: "Fast",
		speedColor: "text-green",
		bestFor: "General use, coding, analysis"
	},
	{
		name: "Claude Sonnet 4.5",
		provider: "Anthropic",
		free: "Limited (Claude.ai)",
		context: "200K",
		coding: 5,
		reasoning: 5,
		vision: true,
		speed: "Fast",
		speedColor: "text-green",
		bestFor: "Long documents, writing, coding"
	},
	{
		name: "Gemini 1.5 Pro",
		provider: "Google",
		free: "Limited (AI Studio)",
		context: "1M",
		coding: 4,
		reasoning: 4,
		vision: true,
		speed: "Medium",
		speedColor: "text-yellow",
		bestFor: "Very long documents, multimodal"
	},
	{
		name: "Gemini Flash 2.0",
		provider: "Google",
		free: "Generous (AI Studio)",
		context: "1M",
		coding: 3,
		reasoning: 3,
		vision: true,
		speed: "Very fast",
		speedColor: "text-green",
		bestFor: "Quick tasks, high volume, free"
	},
	{
		name: "Grok 2",
		provider: "xAI",
		free: "Limited (X/Twitter)",
		context: "128K",
		coding: 4,
		reasoning: 4,
		vision: true,
		speed: "Fast",
		speedColor: "text-green",
		bestFor: "Real-time info, X integration"
	},
	{
		name: "DeepSeek V3",
		provider: "DeepSeek",
		free: "Generous API free tier",
		context: "128K",
		coding: 5,
		reasoning: 5,
		vision: false,
		speed: "Fast",
		speedColor: "text-green",
		bestFor: "Coding, cheap API alternative"
	},
	{
		name: "Llama 3.1 70B",
		provider: "Meta (open source)",
		free: "Free to download",
		context: "128K",
		coding: 4,
		reasoning: 4,
		vision: false,
		speed: "Varies",
		speedColor: "text-yellow",
		bestFor: "Self-hosting, privacy"
	},
	{
		name: "Mistral Large",
		provider: "Mistral AI",
		free: "API free trial",
		context: "128K",
		coding: 4,
		reasoning: 4,
		vision: false,
		speed: "Fast",
		speedColor: "text-green",
		bestFor: "European privacy, multilingual"
	}
];
function Stars({ count }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "text-sm",
		children: ["⭐".repeat(count), "☆".repeat(5 - count)]
	});
}
function ComparePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		wide: true,
		title: "Compare",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground sm:text-3xl",
					children: "AI Model Comparison 2026"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Side-by-side comparison of the best AI models available today — free and paid."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-2 inline-block rounded-full bg-surface-elevated px-2.5 py-1 text-[11px] text-muted-foreground",
					children: "Last verified: August 2026"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 overflow-x-auto rounded-[10px] border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[700px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border bg-surface-elevated",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "sticky left-0 z-10 bg-surface-elevated px-4 py-3 text-left text-xs font-semibold text-muted-foreground",
									children: "Model"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground",
									children: "Free Tier"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground",
									children: "Context"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground",
									children: "Coding"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground",
									children: "Reasoning"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground",
									children: "Vision"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground",
									children: "Speed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground",
									children: "Best For"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: MODELS.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: `border-b border-border/50 transition-colors hover:bg-surface-elevated ${i % 2 === 0 ? "bg-surface" : "bg-surface-elevated"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "sticky left-0 z-10 bg-inherit px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-foreground",
										children: m.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: m.provider
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-block rounded bg-green/15 px-2 py-0.5 text-[11px] font-medium text-green",
										children: m.free
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-foreground",
									children: m.context
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { count: m.coding })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { count: m.reasoning })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: m.vision ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-green",
										children: "✅ Yes"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red",
										children: "❌ No"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: m.speedColor,
										children: m.speed
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: m.bestFor
								})
							]
						}, m.name)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-center text-[11px] text-muted-foreground",
					children: "Model capabilities change frequently. Always verify on the official provider website."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/assistant",
						className: "text-sm text-primary hover:underline",
						children: "Try the AI Assistant →"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/assistant/about",
						className: "text-sm text-primary hover:underline",
						children: "Learn more →"
					})]
				})
			]
		})
	});
}
//#endregion
export { ComparePage as component };
