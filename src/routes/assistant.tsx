import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUp,
  Check,
  Copy,
  FileText,
  Globe,
  Menu,
  Paperclip,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/library/AppShell";
import { cn } from "@/lib/utils";

/* ─── types ─── */

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

type AppState = "setup" | "chat";

interface ProviderConfig {
  id: string;
  name: string;
  icon: string;
  baseUrl: string;
  modelsUrl?: string; // endpoint to fetch models (defaults to /models)
  headerKey: string;
  headerPrefix: string;
  needsKey: boolean;
  keyUrl: string; // link to get API key
  fallbackModels: { id: string; name: string }[];
  freeLabel?: string; // e.g. "Free tier" or "Free credits"
}

/* ─── providers ─── */

const PROVIDERS: ProviderConfig[] = [
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
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
    ],
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
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant" },
      { id: "gemma2-9b-it", name: "Gemma 2 9B" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
    ],
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
      { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)" },
      { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (Free)" },
      { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B (Free)" },
      { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen 2.5 72B (Free)" },
    ],
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
      { id: "meta-llama/Llama-3.3-70B-Instruct-Turbo", name: "Llama 3.3 70B" },
      { id: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", name: "Llama 3.1 8B" },
      { id: "Qwen/Qwen2.5-72B-Instruct-Turbo", name: "Qwen 2.5 72B" },
    ],
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
    fallbackModels: [
      { id: "deepseek-chat", name: "DeepSeek V3" },
      { id: "deepseek-reasoner", name: "DeepSeek R1" },
    ],
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
      { id: "mistral-small-latest", name: "Mistral Small" },
      { id: "mistral-large-latest", name: "Mistral Large" },
      { id: "open-mistral-nemo", name: "Mistral Nemo" },
    ],
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
    fallbackModels: [
      { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B" },
      { id: "deepseek/deepseek-r1", name: "DeepSeek R1" },
    ],
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
      { id: "meta-llama/Llama-3.3-70B-Instruct", name: "Llama 3.3 70B" },
      { id: "Qwen/Qwen2.5-72B-Instruct", name: "Qwen 2.5 72B" },
      { id: "mistralai/Mistral-7B-Instruct-v0.3", name: "Mistral 7B" },
    ],
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
    fallbackModels: [],
  },
];

const STORAGE_KEY = "slashai-assistant-config";
const HISTORY_KEY = "slashai-assistant-history";
const MODELS_CACHE_KEY = "slashai-assistant-models-cache";

const STARTER_PROMPTS = [
  "Explain quantum computing simply",
  "Write a cold email template",
  "Summarise this text: [paste]",
  "What are 5 business ideas for 2026?",
];

/* ─── markdown render ─── */

function renderMarkdown(text: string): string {
  let html = text;
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-surface-elevated rounded-md p-3 my-2 overflow-x-auto text-sm font-mono"><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-surface-elevated rounded px-1.5 py-0.5 text-sm font-mono text-accent">$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/\n/g, "<br/>");
  return html;
}

/* ─── fetch models from provider ─── */

async function fetchModels(provider: ProviderConfig, apiKey: string): Promise<{ id: string; name: string }[]> {
  // Check cache first (1 hour TTL)
  const cacheKey = `${MODELS_CACHE_KEY}-${provider.id}`;
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    if (cached && Date.now() - cached.ts < 3600000) return cached.models;
  } catch { /* ignore */ }

  const modelsUrl = provider.modelsUrl || `${provider.baseUrl}/models`;
  try {
    const headers: Record<string, string> = {};
    if (apiKey) headers[provider.headerKey] = provider.headerPrefix + apiKey;

    const res = await fetch(modelsUrl, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const models = (data.data || data.models || [])
      .filter((m: any) => m.id && !m.id.includes("embedding") && !m.id.includes("tts") && !m.id.includes("whisper"))
      .map((m: any) => ({
        id: m.id,
        name: m.name || m.id.replace(/[-_/]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      }))
      .sort((a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id));

    if (models.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify({ models, ts: Date.now() }));
      return models;
    }
  } catch { /* fallback */ }

  return provider.fallbackModels;
}

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "SlashAI Assistant" },
      { name: "description", content: "AI assistant with free API providers. Your key stays on your device." },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  const [appState, setAppState] = useState<AppState>("setup");
  const [selectedProvider, setSelectedProvider] = useState("google");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState<{ id: string; name: string }[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [attachedFile, setAttachedFile] = useState<{ name: string; text: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load saved config
  useEffect(() => {
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
    } catch { /* ignore */ }
  }, []);

  // Save config
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      provider: selectedProvider, apiKey, baseUrl, customModel, model: selectedModel,
    }));
  }, [selectedProvider, apiKey, baseUrl, customModel, selectedModel]);

  // Save history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-50)));
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, streamingText]);

  const provider = PROVIDERS.find((p) => p.id === selectedProvider) ?? PROVIDERS[0]!;

  // Fetch models when provider or API key changes
  const loadModels = useCallback(async () => {
    if (selectedProvider === "custom") {
      setModels([]);
      return;
    }
    setModelsLoading(true);
    try {
      const fetched = await fetchModels(provider, apiKey);
      setModels(fetched);
      // Auto-select first model if none selected
      if (!selectedModel && fetched.length > 0 && fetched[0]) {
        setSelectedModel(fetched[0].id);
      }
    } catch {
      setModels(provider.fallbackModels);
    }
    setModelsLoading(false);
  }, [provider, apiKey, selectedProvider, selectedModel]);

  useEffect(() => {
    if (apiKey || !provider.needsKey) {
      loadModels();
    } else {
      setModels(provider.fallbackModels);
    }
  }, [selectedProvider, apiKey]);

  const filteredModels = useMemo(() => {
    if (!modelSearch) return models;
    const q = modelSearch.toLowerCase();
    return models.filter((m) => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q));
  }, [models, modelSearch]);

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey && provider.headerKey) headers[provider.headerKey] = provider.headerPrefix + apiKey;
    return headers;
  }, [apiKey, provider]);

  const getBaseUrl = useCallback(() => {
    return selectedProvider === "custom" ? baseUrl : provider.baseUrl;
  }, [selectedProvider, provider, baseUrl]);

  const getModelId = useCallback(() => {
    return selectedProvider === "custom" ? customModel : selectedModel || models[0]?.id || "";
  }, [selectedProvider, customModel, selectedModel, models]);

  const handleSaveConfig = () => {
    if (!apiKey && provider.needsKey) return;
    if (selectedProvider === "custom" && !baseUrl) return;
    if (!selectedModel && models.length > 0 && models[0]) setSelectedModel(models[0].id);
    setAppState("chat");
    setShowSettings(false);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`, role: "user", content: inputText.trim(), timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText("");
    setAttachedFile(null);
    setIsGenerating(true);
    setStreamingText("");
    setError("");

    const systemMsg = { role: "system", content: "You are SlashAI Assistant, a helpful AI. Be concise, helpful, and friendly. Use markdown when appropriate." };
    const chatHistory = messages.slice(-10).map((m) => ({ role: m.role, content: m.content }));
    const userContent = attachedFile?.text
      ? `${currentInput}\n\n---\nDocument context:\n${attachedFile.text.slice(0, 8000)}`
      : currentInput;

    const body = {
      model: getModelId(),
      messages: [systemMsg, ...chatHistory, { role: "user", content: userContent }],
      stream: true, temperature: 0.7, max_tokens: 1024,
    };

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch(`${getBaseUrl()}/chat/completions`, {
        method: "POST", headers: getHeaders(), body: JSON.stringify(body), signal: controller.signal,
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
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content || "";
            fullText += delta;
            setStreamingText(fullText);
          } catch { /* skip */ }
        }
      }

      if (fullText) {
        setMessages((prev) => [...prev, {
          id: `ai-${Date.now()}`, role: "assistant", content: fullText, timestamp: new Date().toISOString(),
        }]);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message || "Request failed");
      }
    } finally {
      setIsGenerating(false);
      setStreamingText("");
      abortRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      let text = "";
      if (file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".csv") || file.name.endsWith(".json")) {
        text = await file.text();
      } else if (file.name.endsWith(".docx")) {
        const mammoth = await import("mammoth");
        const buf = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buf });
        text = result.value;
      } else if (file.name.endsWith(".pdf")) {
        const buf = await file.arrayBuffer();
        const raw = new TextDecoder().decode(new Uint8Array(buf));
        const matches = raw.match(/BT[\s\S]*?ET/g);
        text = matches ? matches.join("\n").replace(/[^a-zA-Z0-9\s.,!?;:'"()-]/g, " ") : "Could not extract text";
      } else {
        text = await file.text();
      }
      setAttachedFile({ name: file.name, text: text.slice(0, 8000) });
    } catch { alert("Could not read file."); }
    e.target.value = "";
  };

  const clearChat = () => { setMessages([]); setStreamingText(""); setIsGenerating(false); setError(""); localStorage.removeItem(HISTORY_KEY); setShowMenu(false); };
  const exportChat = () => {
    const text = messages.map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "slashai-chat.txt"; a.click();
    URL.revokeObjectURL(url); setShowMenu(false);
  };
  const copyMsg = async (id: string, text: string) => { await navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 1500); };

  /* ─── SETUP STATE ─── */
  if (appState === "setup" || showSettings) {
    return (
      <AppShell wide hideHeaderSearch title="Assistant">
        <div className="mx-auto max-w-2xl py-6">
          <div className="text-center">
            <span className="text-5xl">🤖</span>
            <h1 className="mt-4 text-2xl font-bold text-foreground">Set up your AI assistant</h1>
            <p className="mt-2 text-sm text-muted-foreground">Choose a provider and add your API key. Your key stays on this device only.</p>
          </div>

          {/* Provider grid */}
          <div className="mt-6">
            <label className="text-sm font-medium text-foreground">Choose provider</label>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-3">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProvider(p.id); setSelectedModel(""); setModels([]); }}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-all duration-150",
                    selectedProvider === p.id
                      ? "border-primary/50 bg-[rgba(88,166,255,0.05)]"
                      : "border-border bg-surface hover:border-border"
                  )}
                >
                  <span className="text-xl">{p.icon}</span>
                  <div className="mt-1 text-xs font-medium text-foreground leading-tight">{p.name}</div>
                  {p.freeLabel && <div className="mt-0.5 text-[10px] text-green">{p.freeLabel}</div>}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          {provider.needsKey && (
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">API Key</label>
                {provider.keyUrl && (
                  <a href={provider.keyUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                    Get free key →
                  </a>
                )}
              </div>
              <input
                type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${provider.name} API key`}
                className="h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
              />
              <p className="text-[11px] text-muted-foreground">🔒 Stored in your browser only. Never sent to any server except {provider.name}.</p>
            </div>
          )}

          {/* Custom provider */}
          {selectedProvider === "custom" && (
            <>
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-foreground">Base URL</label>
                <input type="url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://your-api.com/v1"
                  className="h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none" />
              </div>
              <div className="mt-3 space-y-2">
                <label className="text-sm font-medium text-foreground">Model ID</label>
                <input type="text" value={customModel} onChange={(e) => setCustomModel(e.target.value)} placeholder="e.g. gpt-4o-mini"
                  className="h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none" />
              </div>
            </>
          )}

          {/* Model selection */}
          {selectedProvider !== "custom" && (
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Model</label>
                <button onClick={loadModels} className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <RefreshCw className={`size-3 ${modelsLoading ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>

              {/* Search */}
              {models.length > 6 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text" value={modelSearch} onChange={(e) => setModelSearch(e.target.value)} placeholder="Search models..."
                    className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
                  />
                </div>
              )}

              {/* Model list */}
              <div className="max-h-[280px] space-y-1 overflow-y-auto rounded-lg border border-border bg-surface p-1.5">
                {modelsLoading && models.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">Loading models...</div>
                )}
                {!modelsLoading && filteredModels.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No models found. {apiKey ? "Check your API key." : "Add your API key to load models."}
                  </div>
                )}
                {filteredModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors",
                      selectedModel === m.id
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    <span className="truncate text-sm">{m.name}</span>
                    <span className="ml-2 shrink-0 truncate text-[11px] text-muted-foreground font-mono">{m.id}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {filteredModels.length} model{filteredModels.length !== 1 ? "s" : ""} available from {provider.name}
              </p>
            </div>
          )}

          {/* Start button */}
          <button
            onClick={handleSaveConfig}
            disabled={provider.needsKey && !apiKey}
            className={cn(
              "mt-6 flex h-[48px] w-full items-center justify-center rounded-lg text-sm font-bold transition-opacity",
              provider.needsKey && !apiKey ? "bg-surface-elevated text-muted-foreground cursor-not-allowed" : "bg-primary text-background hover:opacity-90"
            )}
          >
            Start chatting
          </button>

          <Link to="/assistant/about" className="mt-3 block text-center text-sm text-primary hover:underline">How does this work?</Link>
        </div>
      </AppShell>
    );
  }

  /* ─── CHAT STATE ─── */
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border bg-background px-3">
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">← Back</Link>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green" />
          <span className="text-sm font-medium text-foreground">{provider.icon} {provider.name}</span>
          <span className="text-[11px] text-muted-foreground">· {models.find((m) => m.id === selectedModel)?.name || selectedModel}</span>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground">
            <Menu className="size-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-surface py-1 shadow-lg">
              <button onClick={() => { setShowSettings(true); setShowMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent">
                <Settings className="size-3.5" /> Switch provider / model
              </button>
              <button onClick={clearChat} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent">
                <Trash2 className="size-3.5" /> Clear conversation
              </button>
              <button onClick={exportChat} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent">
                <FileText className="size-3.5" /> Export chat
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !streamingText ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-4xl">🤖</span>
            <h2 className="mt-3 text-base font-semibold text-foreground">Start a conversation</h2>
            <p className="mt-1 text-sm text-muted-foreground">Powered by {provider.name}. Your key stays on your device.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {STARTER_PROMPTS.map((p) => (
                <button key={p} onClick={() => setInputText(p)} className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-border hover:text-foreground">{p}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[85%] rounded-2xl px-3.5 py-2.5", msg.role === "user" ? "rounded-br-sm bg-[rgba(88,166,255,0.15)] border border-[rgba(88,166,255,0.3)]" : "rounded-bl-sm bg-surface border border-border")}>
                  {msg.role === "assistant" ? (
                    <div className="prose-invert text-sm leading-relaxed [&_br]:my-0.5" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                  ) : (
                    <p className="text-sm text-foreground">{msg.content}</p>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                    {msg.role === "assistant" && (
                      <button onClick={() => copyMsg(msg.id, msg.content)} className="text-muted-foreground hover:text-foreground">
                        {copiedId === msg.id ? <Check className="size-3 text-green" /> : <Copy className="size-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {streamingText && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-surface px-3.5 py-2.5">
                  <div className="prose-invert text-sm leading-relaxed [&_br]:my-0.5" dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingText) }} />
                  <span className="inline-block size-1.5 animate-pulse rounded-full bg-primary" />
                </div>
              </div>
            )}
            {isGenerating && !streamingText && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-border bg-surface px-3.5 py-2.5">
                  <span className="inline-flex gap-1 text-sm text-muted-foreground">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>●</span>
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-[rgba(248,81,73,0.3)] bg-red-500/10 p-3 text-sm text-red-500">
                {error} <button onClick={() => setError("")} className="ml-2 text-xs underline">Dismiss</button>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background px-4 py-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto max-w-2xl">
          {attachedFile && (
            <div className="mb-2 flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-3 py-1.5">
              <FileText className="size-3.5 text-muted-foreground" />
              <span className="flex-1 truncate text-xs text-muted-foreground">{attachedFile.name}</span>
              <button onClick={() => setAttachedFile(null)} className="text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <label className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-elevated text-muted-foreground transition-colors hover:text-foreground">
              <Paperclip className="size-4" />
              <input type="file" className="hidden" accept=".pdf,.docx,.txt,.md,.csv,.json" onChange={handleFileAttach} />
            </label>
            <textarea ref={textareaRef} value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Message SlashAI Assistant..." rows={1}
              className="min-h-[40px] max-h-[144px] flex-1 resize-none rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
              style={{ lineHeight: "1.5" }}
              onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 144) + "px"; }}
            />
            <button onClick={() => { if (isGenerating) abortRef.current?.abort(); else sendMessage(); }}
              disabled={!inputText.trim() && !isGenerating}
              className={cn("flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
                isGenerating ? "bg-red text-white" : inputText.trim() ? "bg-primary text-background" : "bg-surface-elevated text-muted-foreground"
              )}>
              {isGenerating ? <X className="size-4" /> : <ArrowUp className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
