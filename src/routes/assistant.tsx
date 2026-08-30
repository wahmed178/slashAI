import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUp,
  Bot,
  Check,
  Copy,
  FileText,
  Info,
  Menu,
  Paperclip,
  Plus,
  RefreshCw,
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
  models: { id: string; name: string; free: boolean }[];
  headerKey: string; // e.g. "Authorization" or "x-goog-api-key"
  headerPrefix: string; // e.g. "Bearer " or ""
  needsKey: boolean;
}

/* ─── providers ─── */

const PROVIDERS: ProviderConfig[] = [
  {
    id: "google",
    name: "Google AI Studio",
    icon: "🟢",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", free: true },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", free: true },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", free: true },
    ],
    headerKey: "Authorization",
    headerPrefix: "Bearer ",
    needsKey: true,
  },
  {
    id: "groq",
    name: "Groq",
    icon: "⚡",
    baseUrl: "https://api.groq.com/openai/v1",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", free: true },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", free: true },
      { id: "gemma2-9b-it", name: "Gemma 2 9B", free: true },
    ],
    headerKey: "Authorization",
    headerPrefix: "Bearer ",
    needsKey: true,
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    icon: "🔀",
    baseUrl: "https://openrouter.ai/api/v1",
    models: [
      { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)", free: true },
      { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (Free)", free: true },
      { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B (Free)", free: true },
    ],
    headerKey: "Authorization",
    headerPrefix: "Bearer ",
    needsKey: true,
  },
  {
    id: "together",
    name: "Together AI",
    icon: "🤝",
    baseUrl: "https://api.together.xyz/v1",
    models: [
      { id: "meta-llama/Llama-3.3-70B-Instruct-Turbo", name: "Llama 3.3 70B", free: true },
      { id: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", name: "Llama 3.1 8B", free: true },
    ],
    headerKey: "Authorization",
    headerPrefix: "Bearer ",
    needsKey: true,
  },
  {
    id: "custom",
    name: "Custom (OpenAI-compatible)",
    icon: "🔧",
    baseUrl: "",
    models: [
      { id: "custom-model", name: "Your model", free: false },
    ],
    headerKey: "Authorization",
    headerPrefix: "Bearer ",
    needsKey: true,
  },
];

const STORAGE_KEY = "slashai-assistant-config";
const HISTORY_KEY = "slashai-assistant-history";

const STARTER_PROMPTS = [
  "Explain quantum computing simply",
  "Write a cold email template",
  "Summarise this text: [paste]",
  "What are 5 business ideas for 2026?",
];

/* ─── markdown render ─── */

function renderMarkdown(text: string): string {
  let html = text;
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-[#21262d] rounded-md p-3 my-2 overflow-x-auto text-sm font-mono"><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#21262d] rounded px-1.5 py-0.5 text-sm font-mono text-accent">$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/\n/g, "<br/>");
  return html;
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

  // Save config (except apiKey for security note)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      provider: selectedProvider,
      apiKey,
      baseUrl,
      customModel,
      model: selectedModel,
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

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey && provider.headerKey) {
      headers[provider.headerKey] = provider.headerPrefix + apiKey;
    }
    return headers;
  }, [apiKey, provider]);

  const getBaseUrl = useCallback(() => {
    if (selectedProvider === "custom") return baseUrl;
    return provider.baseUrl;
  }, [selectedProvider, provider, baseUrl]);

  const getModelId = useCallback(() => {
    if (selectedProvider === "custom") return customModel;
    return selectedModel || provider.models[0]?.id || "";
  }, [selectedProvider, customModel, selectedModel, provider]);

  const handleSaveConfig = () => {
    if (!apiKey && provider.needsKey) return;
    if (selectedProvider === "custom" && !baseUrl) return;
    setSelectedModel(selectedModel || provider.models[0]?.id || "");
    setAppState("chat");
    setShowSettings(false);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
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
      content: "You are SlashAI Assistant, a helpful AI. Be concise, helpful, and friendly. Use markdown when appropriate.",
    };

    const chatHistory = messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const userContent = attachedFile?.text
      ? `${currentInput}\n\n---\nDocument context:\n${attachedFile.text.slice(0, 8000)}`
      : currentInput;

    const body = {
      model: getModelId(),
      messages: [systemMsg, ...chatHistory, { role: "user", content: userContent }],
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    };

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch(`${getBaseUrl()}/chat/completions`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
        signal: controller.signal,
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
          } catch { /* skip malformed */ }
        }
      }

      if (fullText) {
        setMessages((prev) => [...prev, {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: fullText,
          timestamp: new Date().toISOString(),
        }]);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // User cancelled
      } else {
        setError(err instanceof Error ? err.message : "Request failed");
      }
    } finally {
      setIsGenerating(false);
      setStreamingText("");
      abortRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let text = "";
      if (file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".csv") || file.name.endsWith(".json")) {
        text = await file.text();
      } else if (file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const rawText = new TextDecoder().decode(bytes);
        const matches = rawText.match(/BT[\s\S]*?ET/g);
        text = matches ? matches.join("\n").replace(/[^a-zA-Z0-9\s.,!?;:'"()-]/g, " ") : "Could not extract text";
      } else if (file.name.endsWith(".docx")) {
        try {
          const mammoth = await import("mammoth");
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          text = result.value;
        } catch {
          text = "Could not extract text from DOCX";
        }
      } else {
        text = await file.text();
      }
      setAttachedFile({ name: file.name, text: text.slice(0, 8000) });
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

  const copyMsg = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  /* ─── SETUP STATE ─── */
  if (appState === "setup" || showSettings) {
    return (
      <AppShell wide hideHeaderSearch title="Assistant">
        <div className="mx-auto max-w-lg py-6">
          <div className="text-center">
            <span className="text-5xl">🤖</span>
            <h1 className="mt-4 text-2xl font-bold text-foreground">Set up your AI assistant</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a free provider and add your API key. Your key stays on this device only.
            </p>
          </div>

          {/* Provider selection */}
          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium text-foreground">Provider</label>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProvider(p.id); setSelectedModel(p.models[0]?.id || ""); }}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-all duration-150",
                    selectedProvider === p.id
                      ? "border-primary/50 bg-[rgba(88,166,255,0.05)]"
                      : "border-border bg-surface hover:border-[#484f58]"
                  )}
                >
                  <span className="text-xl">{p.icon}</span>
                  <div className="mt-1 text-sm font-medium text-foreground">{p.name}</div>
                  {p.models.some((m) => m.free) && (
                    <span className="mt-0.5 inline-block rounded bg-green/15 px-1.5 py-0.5 text-[10px] font-medium text-green">Free tier</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Model selection */}
          {provider.models.length > 1 && selectedProvider !== "custom" && (
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium text-foreground">Model</label>
              <div className="space-y-1.5">
                {provider.models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all duration-150",
                      selectedModel === m.id
                        ? "border-primary/50 bg-[rgba(88,166,255,0.05)]"
                        : "border-border bg-surface hover:border-[#484f58]"
                    )}
                  >
                    <span className="text-sm text-foreground">{m.name}</span>
                    {m.free && <span className="text-[10px] text-green">Free</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* API Key input */}
          {provider.needsKey && (
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium text-foreground">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${provider.name} API key`}
                className="h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
              />
              <p className="text-[11px] text-muted-foreground">
                🔒 Stored only in your browser. Never sent to any server.
              </p>
            </div>
          )}

          {/* Custom provider inputs */}
          {selectedProvider === "custom" && (
            <>
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-foreground">Base URL</label>
                <input
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://your-api.com/v1"
                  className="h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
                />
              </div>
              <div className="mt-3 space-y-2">
                <label className="text-sm font-medium text-foreground">Model ID</label>
                <input
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="e.g. gpt-4o-mini"
                  className="h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Get key links */}
          <div className="mt-4 rounded-lg border border-border bg-surface p-3">
            <p className="text-xs font-medium text-foreground">Don't have an API key?</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {selectedProvider === "google" && (
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Get Google AI key (free)</a>
              )}
              {selectedProvider === "groq" && (
                <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Get Groq key (free)</a>
              )}
              {selectedProvider === "openrouter" && (
                <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Get OpenRouter key (free)</a>
              )}
              {selectedProvider === "together" && (
                <a href="https://api.together.xyz/settings/api-keys" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Get Together key (free)</a>
              )}
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleSaveConfig}
            disabled={provider.needsKey && !apiKey}
            className={cn(
              "mt-6 flex h-[48px] w-full items-center justify-center rounded-lg text-sm font-bold transition-opacity",
              provider.needsKey && !apiKey
                ? "bg-[#21262d] text-muted-foreground cursor-not-allowed"
                : "bg-primary text-[#0d1117] hover:opacity-90"
            )}
          >
            Start chatting
          </button>

          <Link to="/assistant/about" className="mt-3 block text-center text-sm text-primary hover:underline">
            How does this work?
          </Link>
        </div>
      </AppShell>
    );
  }

  /* ─── CHAT STATE ─── */
  return (
    <div className="flex h-screen flex-col bg-[#0d1117]">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border bg-[#0d1117] px-3">
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green" />
          <span className="text-sm font-medium text-foreground">{provider.icon} {provider.name}</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground"
          >
            <Menu className="size-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-surface py-1 shadow-lg">
              <button onClick={() => { setShowSettings(true); setShowMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent">
                <Settings className="size-3.5" /> Switch provider
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

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !streamingText ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-4xl">🤖</span>
            <h2 className="mt-3 text-base font-semibold text-foreground">Start a conversation</h2>
            <p className="mt-1 text-sm text-muted-foreground">Powered by {provider.name}. Your key stays on your device.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setInputText(p)}
                  className="rounded-full border border-border bg-[#21262d] px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-[#484f58] hover:text-foreground"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5",
                    msg.role === "user"
                      ? "rounded-br-sm bg-[rgba(88,166,255,0.15)] border border-[rgba(88,166,255,0.3)] text-foreground"
                      : "rounded-bl-sm bg-surface border border-border text-[#e6edf3]"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <div
                      className="prose-invert text-sm leading-relaxed [&_br]:my-0.5"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                    />
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => copyMsg(msg.id, msg.content)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {copiedId === msg.id ? <Check className="size-3 text-green" /> : <Copy className="size-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming */}
            {streamingText && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-surface px-3.5 py-2.5">
                  <div
                    className="prose-invert text-sm leading-relaxed [&_br]:my-0.5"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingText) }}
                  />
                  <span className="inline-block size-1.5 animate-pulse rounded-full bg-primary" />
                </div>
              </div>
            )}

            {/* Thinking dots */}
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
              <div className="rounded-lg border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.08)] p-3 text-sm text-[#f85149]">
                {error}
                <button onClick={() => setError("")} className="ml-2 text-xs underline">Dismiss</button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-[#0d1117] px-4 py-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto max-w-2xl">
          {attachedFile && (
            <div className="mb-2 flex items-center gap-2 rounded-md border border-border bg-[#21262d] px-3 py-1.5">
              <FileText className="size-3.5 text-muted-foreground" />
              <span className="flex-1 truncate text-xs text-muted-foreground">{attachedFile.name}</span>
              <button onClick={() => setAttachedFile(null)} className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <label className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-[#21262d] text-muted-foreground transition-colors hover:text-foreground">
              <Paperclip className="size-4" />
              <input type="file" className="hidden" accept=".pdf,.docx,.txt,.md,.csv,.json" onChange={handleFileAttach} />
            </label>

            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message SlashAI Assistant..."
              rows={1}
              className="min-h-[40px] max-h-[144px] flex-1 resize-none rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
              style={{ lineHeight: "1.5" }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 144) + "px";
              }}
            />

            <button
              onClick={() => { if (isGenerating) abortRef.current?.abort(); else sendMessage(); }}
              disabled={!inputText.trim() && !isGenerating}
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
                isGenerating
                  ? "bg-red text-white"
                  : inputText.trim()
                  ? "bg-primary text-[#0d1117]"
                  : "bg-[#21262d] text-muted-foreground"
              )}
            >
              {isGenerating ? <X className="size-4" /> : <ArrowUp className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
