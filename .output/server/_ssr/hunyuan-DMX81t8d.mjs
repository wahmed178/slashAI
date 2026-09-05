import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { F as Settings, Vn as ArrowUp } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hunyuan-DMX81t8d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "slashai-hunyuan-config";
var MODELS = [
	{
		id: "hy4-preview",
		name: "Hy4 Preview",
		desc: "770B MoE — Tencent's flagship",
		icon: "🐉",
		tier: "flagship"
	},
	{
		id: "deepseek-v4-pro",
		name: "DeepSeek V4 Pro",
		desc: "Advanced reasoning",
		icon: "🐋",
		tier: "pro"
	},
	{
		id: "deepseek-v4-flash",
		name: "DeepSeek V4 Flash",
		desc: "Fast responses",
		icon: "⚡",
		tier: "fast"
	},
	{
		id: "glm-5.1",
		name: "GLM 5.1",
		desc: "Zhipu AI's latest",
		icon: "🧠",
		tier: "pro"
	},
	{
		id: "kimi-k2.6",
		name: "Kimi K2.6",
		desc: "Moonshot AI",
		icon: "🌙",
		tier: "pro"
	},
	{
		id: "minimax-m3",
		name: "MiniMax M3",
		desc: "Multimodal capable",
		icon: "✨",
		tier: "pro"
	}
];
var TIER_COLORS = {
	flagship: "bg-amber-500/10 text-amber-400 border-amber-500/30",
	pro: "bg-primary/10 text-primary border-primary/30",
	fast: "bg-green/10 text-green border-green/30"
};
var STARTER_PROMPTS = [
	"Explain quantum computing in simple terms",
	"Write a Python function to sort a list",
	"What are the best practices for React?",
	"Help me write a business plan",
	"Translate this to Urdu: Hello, how are you?",
	"Write a poem about artificial intelligence"
];
function HunyuanChat() {
	const [apiKey, setApiKey] = (0, import_react.useState)("");
	const [selectedModel, setSelectedModel] = (0, import_react.useState)("hy4-preview");
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [isStreaming, setIsStreaming] = (0, import_react.useState)(false);
	const [showSettings, setShowSettings] = (0, import_react.useState)(false);
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const messagesEndRef = (0, import_react.useRef)(null);
	const abortRef = (0, import_react.useRef)(null);
	const textareaRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		try {
			const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
			if (saved.apiKey) setApiKey(saved.apiKey);
			if (saved.model) setSelectedModel(saved.model);
			if (saved.messages) setMessages(saved.messages);
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({
				apiKey,
				model: selectedModel,
				messages
			}));
		} catch {}
	}, [
		apiKey,
		selectedModel,
		messages
	]);
	(0, import_react.useEffect)(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	const stopStreaming = () => {
		abortRef.current?.abort();
		setIsStreaming(false);
	};
	const sendMessage = (0, import_react.useCallback)(async (text) => {
		const msg = (text || input).trim();
		if (!msg || !apiKey || isStreaming) return;
		const userMsg = {
			id: Date.now().toString(),
			role: "user",
			content: msg,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		const assistantMsg = {
			id: (Date.now() + 1).toString(),
			role: "assistant",
			content: "",
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		setMessages((prev) => [
			...prev,
			userMsg,
			assistantMsg
		]);
		setInput("");
		setIsStreaming(true);
		if (textareaRef.current) textareaRef.current.style.height = "auto";
		const history = [...messages, userMsg].map((m) => ({
			role: m.role,
			content: m.content
		}));
		try {
			abortRef.current = new AbortController();
			const res = await fetch("https://tokenhub.tencentcloudmaas.com/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					model: selectedModel,
					messages: history,
					stream: true,
					temperature: .7,
					max_tokens: 4096
				}),
				signal: abortRef.current.signal
			});
			if (!res.ok) {
				const err = await res.text();
				setMessages((prev) => prev.map((m) => m.id === assistantMsg.id ? {
					...m,
					content: `Error: ${res.status} — ${err.slice(0, 200)}`
				} : m));
				setIsStreaming(false);
				return;
			}
			const reader = res.body?.getReader();
			if (!reader) return;
			const decoder = new TextDecoder();
			let buffer = "";
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";
				for (const line of lines) {
					if (!line.startsWith("data: ")) continue;
					const data = line.slice(6);
					if (data === "[DONE]") break;
					try {
						const delta = JSON.parse(data).choices?.[0]?.delta?.content;
						if (delta) setMessages((prev) => prev.map((m) => m.id === assistantMsg.id ? {
							...m,
							content: m.content + delta
						} : m));
					} catch {}
				}
			}
		} catch (e) {
			if (e.name !== "AbortError") setMessages((prev) => prev.map((m) => m.id === assistantMsg.id ? {
				...m,
				content: `Error: ${e.message}`
			} : m));
		} finally {
			setIsStreaming(false);
		}
	}, [
		input,
		apiKey,
		selectedModel,
		messages,
		isStreaming
	]);
	const copyMessage = async (id, content) => {
		try {
			await navigator.clipboard.writeText(content);
			setCopiedId(id);
			setTimeout(() => setCopiedId(null), 1200);
		} catch {}
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};
	const model = MODELS.find((m) => m.id === selectedModel);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Hunyuan AI",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl flex flex-col min-h-[calc(100vh-120px)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl",
							children: "🐉"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl font-bold text-foreground",
							children: "Tencent Hunyuan AI"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Chat with Hy4 Preview (770B MoE) and other flagship models via TokenHub"
						})] })]
					})
				}),
				!apiKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-6 mb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Connect to Tencent TokenHub"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mb-3",
							children: "Get a free API key from Tencent Cloud with trial credits. Your key stays in your browser — never sent to our servers."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: apiKey,
								onChange: (e) => setApiKey(e.target.value),
								placeholder: "Paste your TokenHub API key...",
								className: "flex-1 h-10 rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none focus:border-primary/50"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://console.tencentcloud.com/hunyuan/apiKey",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "shrink-0 rounded-lg bg-primary px-4 h-10 flex items-center text-xs font-medium text-background hover:opacity-90 transition-opacity",
								children: "Get Key →"
							})]
						})
					]
				}),
				apiKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-2 mb-4",
					style: { scrollbarWidth: "none" },
					children: MODELS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSelectedModel(m.id),
						className: `shrink-0 rounded-xl border p-2.5 text-left transition-all min-w-[140px] ${selectedModel === m.id ? "border-primary/50 bg-primary/10" : "border-border bg-surface hover:bg-surface-elevated"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg",
									children: m.icon
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-foreground",
									children: m.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground mt-0.5",
								children: m.desc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `mt-1 inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${TIER_COLORS[m.tier]}`,
								children: m.tier
							})
						]
					}, m.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-4 mb-4",
					children: [
						messages.length === 0 && apiKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-12 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-4xl mb-3",
									children: "🐉"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-lg font-bold text-foreground",
									children: ["Chat with ", model?.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mt-1",
									children: model?.desc
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6 grid grid-cols-2 gap-2 max-w-md mx-auto",
									children: STARTER_PROMPTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => sendMessage(p),
										className: "rounded-lg border border-border bg-surface p-3 text-left text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors",
										children: p
									}, p))
								})
							]
						}),
						messages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `max-w-[85%] rounded-xl px-4 py-3 ${msg.role === "user" ? "bg-primary text-background" : "border border-border bg-surface text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-relaxed whitespace-pre-wrap",
									children: msg.content || (isStreaming && msg.id === messages[messages.length - 1]?.id ? "..." : "")
								}), msg.role === "assistant" && msg.content && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => copyMessage(msg.id, msg.content),
									className: "mt-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors",
									children: copiedId === msg.id ? "✓ Copied" : "Copy"
								})]
							})
						}, msg.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
					]
				}),
				apiKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky bottom-0 border-t border-border bg-background pt-3 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								ref: textareaRef,
								value: input,
								onChange: (e) => {
									setInput(e.target.value);
									e.target.style.height = "auto";
									e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
								},
								onKeyDown: handleKeyDown,
								placeholder: `Message ${model?.name || "Hunyuan"}...`,
								rows: 1,
								className: "w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 pr-12 text-sm focus:outline-none focus:border-primary/50 min-h-[44px] max-h-[120px]"
							})
						}), isStreaming ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: stopStreaming,
							className: "shrink-0 size-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-3 rounded-sm bg-red-400" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => sendMessage(),
							disabled: !input.trim(),
							className: "shrink-0 size-11 rounded-xl bg-primary flex items-center justify-center text-background hover:opacity-90 disabled:opacity-40 transition-opacity",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-center text-[10px] text-muted-foreground",
						children: [
							"Powered by Tencent TokenHub · ",
							model?.name,
							" · Free trial credits available"
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { HunyuanChat as component };
