import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { En as Check, F as Settings, L as Search, Vn as ArrowUp, dn as Copy, et as Paperclip, i as X, mt as Menu, q as RefreshCw, tn as FileText, y as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assistant-ByBHmZzT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PROVIDERS = [
	{
		id: "google",
		name: "Google AI Studio",
		icon: "🟢",
		baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
		headerKey: "Authorization",
		headerPrefix: "Bearer ",
		needsKey: true,
		keyUrl: "https://aistudio.google.com/apikey",
		freeLabel: "Generous free tier",
		fallbackModels: [
			{
				id: "gemini-2.0-flash",
				name: "Gemini 2.0 Flash"
			},
			{
				id: "gemini-2.5-flash",
				name: "Gemini 2.5 Flash"
			},
			{
				id: "gemini-2.5-pro",
				name: "Gemini 2.5 Pro"
			},
			{
				id: "gemini-1.5-flash",
				name: "Gemini 1.5 Flash"
			}
		]
	},
	{
		id: "groq",
		name: "Groq",
		icon: "⚡",
		baseUrl: "https://api.groq.com/openai/v1",
		headerKey: "Authorization",
		headerPrefix: "Bearer ",
		needsKey: true,
		keyUrl: "https://console.groq.com/keys",
		freeLabel: "Fast + free tier",
		fallbackModels: [
			{
				id: "llama-3.3-70b-versatile",
				name: "Llama 3.3 70B"
			},
			{
				id: "llama-3.1-8b-instant",
				name: "Llama 3.1 8B Instant"
			},
			{
				id: "gemma2-9b-it",
				name: "Gemma 2 9B"
			},
			{
				id: "mixtral-8x7b-32768",
				name: "Mixtral 8x7B"
			}
		]
	},
	{
		id: "openrouter",
		name: "OpenRouter",
		icon: "🔀",
		baseUrl: "https://openrouter.ai/api/v1",
		modelsUrl: "https://openrouter.ai/api/v1/models",
		headerKey: "Authorization",
		headerPrefix: "Bearer ",
		needsKey: true,
		keyUrl: "https://openrouter.ai/keys",
		freeLabel: "Many free models",
		fallbackModels: [
			{
				id: "google/gemini-2.0-flash-exp:free",
				name: "Gemini 2.0 Flash (Free)"
			},
			{
				id: "meta-llama/llama-3.3-70b-instruct:free",
				name: "Llama 3.3 70B (Free)"
			},
			{
				id: "mistralai/mistral-7b-instruct:free",
				name: "Mistral 7B (Free)"
			},
			{
				id: "qwen/qwen-2.5-72b-instruct:free",
				name: "Qwen 2.5 72B (Free)"
			}
		]
	},
	{
		id: "together",
		name: "Together AI",
		icon: "🤝",
		baseUrl: "https://api.together.xyz/v1",
		headerKey: "Authorization",
		headerPrefix: "Bearer ",
		needsKey: true,
		keyUrl: "https://api.together.xyz/settings/api-keys",
		freeLabel: "Free credits on signup",
		fallbackModels: [
			{
				id: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
				name: "Llama 3.3 70B"
			},
			{
				id: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
				name: "Llama 3.1 8B"
			},
			{
				id: "Qwen/Qwen2.5-72B-Instruct-Turbo",
				name: "Qwen 2.5 72B"
			}
		]
	},
	{
		id: "deepseek",
		name: "DeepSeek",
		icon: "🐋",
		baseUrl: "https://api.deepseek.com/v1",
		headerKey: "Authorization",
		headerPrefix: "Bearer ",
		needsKey: true,
		keyUrl: "https://platform.deepseek.com/api_keys",
		freeLabel: "Free credits on signup",
		fallbackModels: [{
			id: "deepseek-chat",
			name: "DeepSeek V3"
		}, {
			id: "deepseek-reasoner",
			name: "DeepSeek R1"
		}]
	},
	{
		id: "mistral",
		name: "Mistral AI",
		icon: "🌀",
		baseUrl: "https://api.mistral.ai/v1",
		headerKey: "Authorization",
		headerPrefix: "Bearer ",
		needsKey: true,
		keyUrl: "https://console.mistral.ai/api-keys/",
		freeLabel: "Free tier available",
		fallbackModels: [
			{
				id: "mistral-small-latest",
				name: "Mistral Small"
			},
			{
				id: "mistral-large-latest",
				name: "Mistral Large"
			},
			{
				id: "open-mistral-nemo",
				name: "Mistral Nemo"
			}
		]
	},
	{
		id: "novita",
		name: "Novita AI",
		icon: "🚀",
		baseUrl: "https://api.novita.ai/v3/openai",
		headerKey: "Authorization",
		headerPrefix: "Bearer ",
		needsKey: true,
		keyUrl: "https://novita.ai/settings/api-keys",
		freeLabel: "Free tier",
		fallbackModels: [{
			id: "meta-llama/llama-3.3-70b-instruct",
			name: "Llama 3.3 70B"
		}, {
			id: "deepseek/deepseek-r1",
			name: "DeepSeek R1"
		}]
	},
	{
		id: "huggingface",
		name: "HuggingFace",
		icon: "🤗",
		baseUrl: "https://api-inference.huggingface.co/v1",
		headerKey: "Authorization",
		headerPrefix: "Bearer ",
		needsKey: true,
		keyUrl: "https://huggingface.co/settings/tokens",
		freeLabel: "Free inference API",
		fallbackModels: [
			{
				id: "meta-llama/Llama-3.3-70B-Instruct",
				name: "Llama 3.3 70B"
			},
			{
				id: "Qwen/Qwen2.5-72B-Instruct",
				name: "Qwen 2.5 72B"
			},
			{
				id: "mistralai/Mistral-7B-Instruct-v0.3",
				name: "Mistral 7B"
			}
		]
	},
	{
		id: "tencent",
		name: "Tencent Hunyuan",
		icon: "🐉",
		baseUrl: "https://tokenhub.tencentcloudmaas.com/v1",
		headerKey: "Authorization",
		headerPrefix: "Bearer ",
		needsKey: true,
		keyUrl: "https://console.tencentcloud.com/hunyuan/apiKey",
		freeLabel: "Free trial credits",
		fallbackModels: [
			{
				id: "deepseek-v4-pro",
				name: "DeepSeek V4 Pro"
			},
			{
				id: "deepseek-v4-flash",
				name: "DeepSeek V4 Flash"
			},
			{
				id: "hy4-preview",
				name: "Hy4 Preview (770B MoE)"
			},
			{
				id: "glm-5.1",
				name: "GLM 5.1"
			},
			{
				id: "kimi-k2.6",
				name: "Kimi K2.6"
			},
			{
				id: "minimax-m3",
				name: "MiniMax M3"
			}
		]
	},
	{
		id: "custom",
		name: "Custom (OpenAI-compatible)",
		icon: "🔧",
		baseUrl: "",
		headerKey: "Authorization",
		headerPrefix: "Bearer ",
		needsKey: true,
		keyUrl: "",
		fallbackModels: []
	}
];
var STORAGE_KEY = "slashai-assistant-config";
var HISTORY_KEY = "slashai-assistant-history";
var MODELS_CACHE_KEY = "slashai-assistant-models-cache";
var STARTER_PROMPTS = [
	"Explain quantum computing simply",
	"Write a cold email template",
	"Summarise this text: [paste]",
	"What are 5 business ideas for 2026?"
];
function renderMarkdown(text) {
	let html = text;
	html = html.replace(/```(\w*)\n([\s\S]*?)```/g, "<pre class=\"bg-surface-elevated rounded-md p-3 my-2 overflow-x-auto text-sm font-mono\"><code>$2</code></pre>");
	html = html.replace(/`([^`]+)`/g, "<code class=\"bg-surface-elevated rounded px-1.5 py-0.5 text-sm font-mono text-accent\">$1</code>");
	html = html.replace(/\*\*([^*]+)\*\*/g, "<strong class=\"font-semibold text-foreground\">$1</strong>");
	html = html.replace(/\*([^*]+)\*/g, "<em class=\"italic\">$1</em>");
	html = html.replace(/\n/g, "<br/>");
	return html;
}
async function fetchModels(provider, apiKey) {
	const cacheKey = `${MODELS_CACHE_KEY}-${provider.id}`;
	try {
		const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
		if (cached && Date.now() - cached.ts < 36e5) return cached.models;
	} catch {}
	const modelsUrl = provider.modelsUrl || `${provider.baseUrl}/models`;
	try {
		const headers = {};
		if (apiKey) headers[provider.headerKey] = provider.headerPrefix + apiKey;
		const res = await fetch(modelsUrl, { headers });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		const models = (data.data || data.models || []).filter((m) => m.id && !m.id.includes("embedding") && !m.id.includes("tts") && !m.id.includes("whisper")).map((m) => ({
			id: m.id,
			name: m.name || m.id.replace(/[-_/]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
		})).sort((a, b) => a.id.localeCompare(b.id));
		if (models.length > 0) {
			localStorage.setItem(cacheKey, JSON.stringify({
				models,
				ts: Date.now()
			}));
			return models;
		}
	} catch {}
	return provider.fallbackModels;
}
function AssistantPage() {
	const [appState, setAppState] = (0, import_react.useState)("setup");
	const [selectedProvider, setSelectedProvider] = (0, import_react.useState)("google");
	const [apiKey, setApiKey] = (0, import_react.useState)("");
	const [baseUrl, setBaseUrl] = (0, import_react.useState)("");
	const [customModel, setCustomModel] = (0, import_react.useState)("");
	const [selectedModel, setSelectedModel] = (0, import_react.useState)("");
	const [models, setModels] = (0, import_react.useState)([]);
	const [modelsLoading, setModelsLoading] = (0, import_react.useState)(false);
	const [modelSearch, setModelSearch] = (0, import_react.useState)("");
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [inputText, setInputText] = (0, import_react.useState)("");
	const [isGenerating, setIsGenerating] = (0, import_react.useState)(false);
	const [streamingText, setStreamingText] = (0, import_react.useState)("");
	const [attachedFile, setAttachedFile] = (0, import_react.useState)(null);
	const [showMenu, setShowMenu] = (0, import_react.useState)(false);
	const [showSettings, setShowSettings] = (0, import_react.useState)(false);
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const chatEndRef = (0, import_react.useRef)(null);
	const textareaRef = (0, import_react.useRef)(null);
	const abortRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const cfg = JSON.parse(saved);
				setSelectedProvider(cfg.provider || "google");
				setApiKey(cfg.apiKey || "");
				setBaseUrl(cfg.baseUrl || "");
				setCustomModel(cfg.customModel || "");
				setSelectedModel(cfg.model || "");
				if (cfg.apiKey) setAppState("chat");
			}
			const history = localStorage.getItem(HISTORY_KEY);
			if (history) setMessages(JSON.parse(history));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({
			provider: selectedProvider,
			apiKey,
			baseUrl,
			customModel,
			model: selectedModel
		}));
	}, [
		selectedProvider,
		apiKey,
		baseUrl,
		customModel,
		selectedModel
	]);
	(0, import_react.useEffect)(() => {
		if (messages.length > 0) localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-50)));
	}, [messages]);
	(0, import_react.useEffect)(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length, streamingText]);
	const provider = PROVIDERS.find((p) => p.id === selectedProvider) ?? PROVIDERS[0];
	const loadModels = (0, import_react.useCallback)(async () => {
		if (selectedProvider === "custom") {
			setModels([]);
			return;
		}
		setModelsLoading(true);
		try {
			const fetched = await fetchModels(provider, apiKey);
			setModels(fetched);
			if (!selectedModel && fetched.length > 0 && fetched[0]) setSelectedModel(fetched[0].id);
		} catch {
			setModels(provider.fallbackModels);
		}
		setModelsLoading(false);
	}, [
		provider,
		apiKey,
		selectedProvider,
		selectedModel
	]);
	(0, import_react.useEffect)(() => {
		if (apiKey || !provider.needsKey) loadModels();
		else setModels(provider.fallbackModels);
	}, [selectedProvider, apiKey]);
	const filteredModels = (0, import_react.useMemo)(() => {
		if (!modelSearch) return models;
		const q = modelSearch.toLowerCase();
		return models.filter((m) => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q));
	}, [models, modelSearch]);
	const getHeaders = (0, import_react.useCallback)(() => {
		const headers = { "Content-Type": "application/json" };
		if (apiKey && provider.headerKey) headers[provider.headerKey] = provider.headerPrefix + apiKey;
		return headers;
	}, [apiKey, provider]);
	const getBaseUrl = (0, import_react.useCallback)(() => {
		return selectedProvider === "custom" ? baseUrl : provider.baseUrl;
	}, [
		selectedProvider,
		provider,
		baseUrl
	]);
	const getModelId = (0, import_react.useCallback)(() => {
		return selectedProvider === "custom" ? customModel : selectedModel || models[0]?.id || "";
	}, [
		selectedProvider,
		customModel,
		selectedModel,
		models
	]);
	const handleSaveConfig = () => {
		if (!apiKey && provider.needsKey) return;
		if (selectedProvider === "custom" && !baseUrl) return;
		if (!selectedModel && models.length > 0 && models[0]) setSelectedModel(models[0].id);
		setAppState("chat");
		setShowSettings(false);
	};
	const sendMessage = async () => {
		if (!inputText.trim() || isGenerating) return;
		const userMsg = {
			id: `user-${Date.now()}`,
			role: "user",
			content: inputText.trim(),
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		setMessages((prev) => [...prev, userMsg]);
		const currentInput = inputText;
		setInputText("");
		setAttachedFile(null);
		setIsGenerating(true);
		setStreamingText("");
		setError("");
		const systemMsg = {
			role: "system",
			content: "You are SlashAI Assistant, a helpful AI. Be concise, helpful, and friendly. Use markdown when appropriate."
		};
		const chatHistory = messages.slice(-10).map((m) => ({
			role: m.role,
			content: m.content
		}));
		const userContent = attachedFile?.text ? `${currentInput}\n\n---\nDocument context:\n${attachedFile.text.slice(0, 8e3)}` : currentInput;
		const body = {
			model: getModelId(),
			messages: [
				systemMsg,
				...chatHistory,
				{
					role: "user",
					content: userContent
				}
			],
			stream: true,
			temperature: .7,
			max_tokens: 1024
		};
		try {
			const controller = new AbortController();
			abortRef.current = controller;
			const res = await fetch(`${getBaseUrl()}/chat/completions`, {
				method: "POST",
				headers: getHeaders(),
				body: JSON.stringify(body),
				signal: controller.signal
			});
			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.error?.message || `API error ${res.status}`);
			}
			const reader = res.body?.getReader();
			if (!reader) throw new Error("No response stream");
			const decoder = new TextDecoder();
			let fullText = "";
			let buffer = "";
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";
				for (const line of lines) {
					if (!line.startsWith("data: ")) continue;
					const data = line.slice(6).trim();
					if (data === "[DONE]") continue;
					try {
						const delta = JSON.parse(data).choices?.[0]?.delta?.content || "";
						fullText += delta;
						setStreamingText(fullText);
					} catch {}
				}
			}
			if (fullText) setMessages((prev) => [...prev, {
				id: `ai-${Date.now()}`,
				role: "assistant",
				content: fullText,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			}]);
		} catch (err) {
			if (err instanceof Error && err.name !== "AbortError") setError(err.message || "Request failed");
		} finally {
			setIsGenerating(false);
			setStreamingText("");
			abortRef.current = null;
		}
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};
	const handleFileAttach = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			let text = "";
			if (file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".csv") || file.name.endsWith(".json")) text = await file.text();
			else if (file.name.endsWith(".docx")) {
				const mammoth = await import("../_libs/mammoth+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
				const buf = await file.arrayBuffer();
				text = (await mammoth.extractRawText({ arrayBuffer: buf })).value;
			} else if (file.name.endsWith(".pdf")) {
				const buf = await file.arrayBuffer();
				const matches = new TextDecoder().decode(new Uint8Array(buf)).match(/BT[\s\S]*?ET/g);
				text = matches ? matches.join("\n").replace(/[^a-zA-Z0-9\s.,!?;:'"()-]/g, " ") : "Could not extract text";
			} else text = await file.text();
			setAttachedFile({
				name: file.name,
				text: text.slice(0, 8e3)
			});
		} catch {
			alert("Could not read file.");
		}
		e.target.value = "";
	};
	const clearChat = () => {
		setMessages([]);
		setStreamingText("");
		setIsGenerating(false);
		setError("");
		localStorage.removeItem(HISTORY_KEY);
		setShowMenu(false);
	};
	const exportChat = () => {
		const text = messages.map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.content}`).join("\n\n");
		const blob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "slashai-chat.txt";
		a.click();
		URL.revokeObjectURL(url);
		setShowMenu(false);
	};
	const copyMsg = async (id, text) => {
		await navigator.clipboard.writeText(text);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 1500);
	};
	if (appState === "setup" || showSettings) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "Assistant",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-5xl",
							children: "🤖"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 text-2xl font-bold text-foreground",
							children: "Set up your AI assistant"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Choose a provider and add your API key. Your key stays on this device only."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium text-foreground",
						children: "Choose provider"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid grid-cols-3 gap-2 sm:grid-cols-3",
						children: PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setSelectedProvider(p.id);
								setSelectedModel("");
								setModels([]);
							},
							className: cn("rounded-lg border p-3 text-left transition-all duration-150", selectedProvider === p.id ? "border-primary/50 bg-[rgba(88,166,255,0.05)]" : "border-border bg-surface hover:border-border"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl",
									children: p.icon
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs font-medium text-foreground leading-tight",
									children: p.name
								}),
								p.freeLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-[10px] text-green",
									children: p.freeLabel
								})
							]
						}, p.id))
					})]
				}),
				provider.needsKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium text-foreground",
								children: "API Key"
							}), provider.keyUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: provider.keyUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "text-xs text-primary hover:underline",
								children: "Get free key →"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: apiKey,
							onChange: (e) => setApiKey(e.target.value),
							placeholder: `Enter your ${provider.name} API key`,
							className: "h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground",
							children: [
								"🔒 Stored in your browser only. Never sent to any server except ",
								provider.name,
								"."
							]
						})
					]
				}),
				selectedProvider === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium text-foreground",
						children: "Base URL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "url",
						value: baseUrl,
						onChange: (e) => setBaseUrl(e.target.value),
						placeholder: "https://your-api.com/v1",
						className: "h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium text-foreground",
						children: "Model ID"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: customModel,
						onChange: (e) => setCustomModel(e.target.value),
						placeholder: "e.g. gpt-4o-mini",
						className: "h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
					})]
				})] }),
				selectedProvider !== "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium text-foreground",
								children: "Model"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: loadModels,
								className: "flex items-center gap-1 text-xs text-primary hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-3 ${modelsLoading ? "animate-spin" : ""}` }), " Refresh"]
							})]
						}),
						models.length > 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: modelSearch,
								onChange: (e) => setModelSearch(e.target.value),
								placeholder: "Search models...",
								className: "h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-h-[280px] space-y-1 overflow-y-auto rounded-lg border border-border bg-surface p-1.5",
							children: [
								modelsLoading && models.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-6 text-center text-sm text-muted-foreground",
									children: "Loading models..."
								}),
								!modelsLoading && filteredModels.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-6 text-center text-sm text-muted-foreground",
									children: ["No models found. ", apiKey ? "Check your API key." : "Add your API key to load models."]
								}),
								filteredModels.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setSelectedModel(m.id),
									className: cn("flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors", selectedModel === m.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm",
										children: m.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 shrink-0 truncate text-[11px] text-muted-foreground font-mono",
										children: m.id
									})]
								}, m.id))
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground",
							children: [
								filteredModels.length,
								" model",
								filteredModels.length !== 1 ? "s" : "",
								" available from ",
								provider.name
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleSaveConfig,
					disabled: provider.needsKey && !apiKey,
					className: cn("mt-6 flex h-[48px] w-full items-center justify-center rounded-lg text-sm font-bold transition-opacity", provider.needsKey && !apiKey ? "bg-surface-elevated text-muted-foreground cursor-not-allowed" : "bg-primary text-background hover:opacity-90"),
					children: "Start chatting"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/assistant/about",
					className: "mt-3 block text-center text-sm text-primary hover:underline",
					children: "How does this work?"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border bg-background px-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
						children: "← Back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-green" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-medium text-foreground",
								children: [
									provider.icon,
									" ",
									provider.name
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted-foreground",
								children: ["· ", models.find((m) => m.id === selectedModel)?.name || selectedModel]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowMenu(!showMenu),
							className: "flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
						}), showMenu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-surface py-1 shadow-lg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setShowSettings(true);
										setShowMenu(false);
									},
									className: "flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-3.5" }), " Switch provider / model"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: clearChat,
									className: "flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " Clear conversation"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: exportChat,
									className: "flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" }), " Export chat"]
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto px-4 py-4",
				children: messages.length === 0 && !streamingText ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-4xl",
							children: "🤖"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-base font-semibold text-foreground",
							children: "Start a conversation"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								"Powered by ",
								provider.name,
								". Your key stays on your device."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex flex-wrap justify-center gap-2",
							children: STARTER_PROMPTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setInputText(p),
								className: "rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-border hover:text-foreground",
								children: p
							}, p))
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-2xl space-y-4",
					children: [
						messages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("flex", msg.role === "user" ? "justify-end" : "justify-start"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("max-w-[85%] rounded-2xl px-3.5 py-2.5", msg.role === "user" ? "rounded-br-sm bg-[rgba(88,166,255,0.15)] border border-[rgba(88,166,255,0.3)]" : "rounded-bl-sm bg-surface border border-border"),
								children: [msg.role === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "prose-invert text-sm leading-relaxed [&_br]:my-0.5",
									dangerouslySetInnerHTML: { __html: renderMarkdown(msg.content) }
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-foreground",
									children: msg.content
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: new Date(msg.timestamp).toLocaleTimeString("en-IN", {
											hour: "2-digit",
											minute: "2-digit"
										})
									}), msg.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => copyMsg(msg.id, msg.content),
										className: "text-muted-foreground hover:text-foreground",
										children: copiedId === msg.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" })
									})]
								})]
							})
						}, msg.id)),
						streamingText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-surface px-3.5 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "prose-invert text-sm leading-relaxed [&_br]:my-0.5",
									dangerouslySetInnerHTML: { __html: renderMarkdown(streamingText) }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-1.5 animate-pulse rounded-full bg-primary" })]
							})
						}),
						isGenerating && !streamingText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-2xl rounded-bl-sm border border-border bg-surface px-3.5 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex gap-1 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "animate-bounce",
											style: { animationDelay: "0ms" },
											children: "●"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "animate-bounce",
											style: { animationDelay: "150ms" },
											children: "●"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "animate-bounce",
											style: { animationDelay: "300ms" },
											children: "●"
										})
									]
								})
							})
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-[rgba(248,81,73,0.3)] bg-red-500/10 p-3 text-sm text-red-500",
							children: [
								error,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setError(""),
									className: "ml-2 text-xs underline",
									children: "Dismiss"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: chatEndRef })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border bg-background px-4 py-3",
				style: { paddingBottom: "max(12px, env(safe-area-inset-bottom))" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-2xl",
					children: [attachedFile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-3 py-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 truncate text-xs text-muted-foreground",
								children: attachedFile.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setAttachedFile(null),
								className: "text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-elevated text-muted-foreground transition-colors hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									className: "hidden",
									accept: ".pdf,.docx,.txt,.md,.csv,.json",
									onChange: handleFileAttach
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								ref: textareaRef,
								value: inputText,
								onChange: (e) => setInputText(e.target.value),
								onKeyDown: handleKeyDown,
								placeholder: "Message SlashAI Assistant...",
								rows: 1,
								className: "min-h-[40px] max-h-[144px] flex-1 resize-none rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none",
								style: { lineHeight: "1.5" },
								onInput: (e) => {
									const t = e.currentTarget;
									t.style.height = "auto";
									t.style.height = Math.min(t.scrollHeight, 144) + "px";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									if (isGenerating) abortRef.current?.abort();
									else sendMessage();
								},
								disabled: !inputText.trim() && !isGenerating,
								className: cn("flex size-10 shrink-0 items-center justify-center rounded-full transition-colors", isGenerating ? "bg-red text-white" : inputText.trim() ? "bg-primary text-background" : "bg-surface-elevated text-muted-foreground"),
								children: isGenerating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { AssistantPage as component };
