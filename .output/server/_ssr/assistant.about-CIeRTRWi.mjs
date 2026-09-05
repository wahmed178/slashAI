import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Wn as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assistant.about-CIeRTRWi.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		wide: true,
		title: "About Assistant",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/assistant",
					className: "mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back to Assistant"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground sm:text-3xl",
					children: "How SlashAI Assistant works"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-foreground",
						children: "What is it?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: "SlashAI Assistant connects to free AI providers like Google AI Studio, Groq, OpenRouter, and more. You bring your own API key — it stays stored only in your browser and is never sent to any server except the AI provider you choose."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold text-foreground",
							children: "Supported providers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 pr-4 text-left text-muted-foreground",
											children: "Provider"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 pr-4 text-left text-muted-foreground",
											children: "Free tier"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 text-left text-muted-foreground",
											children: "Get key"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "text-foreground",
									children: [
										[
											"🟢 Google AI Studio",
											"Generous",
											"https://aistudio.google.com/apikey"
										],
										[
											"⚡ Groq",
											"Fast + free",
											"https://console.groq.com/keys"
										],
										[
											"🔀 OpenRouter",
											"Many free models",
											"https://openrouter.ai/keys"
										],
										[
											"🤝 Together AI",
											"Free credits",
											"https://api.together.xyz/settings/api-keys"
										],
										[
											"🐋 DeepSeek",
											"Free credits",
											"https://platform.deepseek.com/api_keys"
										],
										[
											"🌀 Mistral AI",
											"Free tier",
											"https://console.mistral.ai/api-keys/"
										],
										[
											"🚀 Novita AI",
											"Free tier",
											"https://novita.ai/settings/api-keys"
										],
										[
											"🤗 HuggingFace",
											"Free inference",
											"https://huggingface.co/settings/tokens"
										]
									].map(([name, tier, url]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border/50",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-4 font-medium",
												children: name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-4 text-green text-xs",
												children: tier
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: url,
													target: "_blank",
													rel: "noreferrer",
													className: "text-xs text-primary hover:underline",
													children: "Get key"
												})
											})
										]
									}, name))
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Models are loaded dynamically from each provider's API. You'll see all available models, not just a fixed list."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-foreground",
						children: "Your API key"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: "Your API key is stored in your browser's localStorage. It is only sent directly to the AI provider you choose. SlashAI never sees, stores, or transmits your key. Clearing your browser data removes it."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-foreground",
						children: "Uploading documents"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: "You can upload PDF, Word (DOCX), or text files. The Assistant reads the content and you can ask questions about it. Files are read entirely within your browser — never uploaded anywhere."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-foreground",
						children: "Privacy promise"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: "Zero telemetry. Zero tracking. No account. Your messages go only to the AI provider you configured. Your API key stays in your browser. Clearing cache removes everything."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-foreground",
						children: "Troubleshooting"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-foreground",
								children: "\"Unauthorized\" or \"Invalid API key\""
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Double-check your API key. Make sure it's active and has free tier credits." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-foreground",
								children: "\"Rate limited\""
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You've hit the free tier limit. Wait a minute or switch to another provider." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-foreground",
								children: "No models loading"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Click \"Refresh\" next to the model list. If still empty, your API key may not have the right permissions." })] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/assistant",
						className: "inline-flex h-10 items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/20",
						children: "Back to Assistant →"
					})
				})
			]
		})
	});
}
//#endregion
export { AboutPage as component };
