import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, Check, Copy, Trash2, Settings, Zap, Brain, Sparkles } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";

interface ChatMessage { id: string; role: "user" | "assistant"; content: string; timestamp: string; }

const STORAGE_KEY = "slashai-hunyuan-config";
const HISTORY_KEY = "slashai-hunyuan-history";

const MODELS = [
  { id: "hy4-preview", name: "Hy4 Preview", desc: "770B MoE — Tencent's flagship", icon: "🐉", tier: "flagship" },
  { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro", desc: "Advanced reasoning", icon: "🐋", tier: "pro" },
  { id: "deepseek-v4-flash", name: "DeepSeek V4 Flash", desc: "Fast responses", icon: "⚡", tier: "fast" },
  { id: "glm-5.1", name: "GLM 5.1", desc: "Zhipu AI's latest", icon: "🧠", tier: "pro" },
  { id: "kimi-k2.6", name: "Kimi K2.6", desc: "Moonshot AI", icon: "🌙", tier: "pro" },
  { id: "minimax-m3", name: "MiniMax M3", desc: "Multimodal capable", icon: "✨", tier: "pro" },
];

const TIER_COLORS: Record<string, string> = {
  flagship: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  pro: "bg-primary/10 text-primary border-primary/30",
  fast: "bg-green/10 text-green border-green/30",
};

const STARTER_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Write a Python function to sort a list",
  "What are the best practices for React?",
  "Help me write a business plan",
  "Translate this to Urdu: Hello, how are you?",
  "Write a poem about artificial intelligence",
];

export const Route = createFileRoute("/hunyuan")({
  head: () => ({
    meta: [
      { title: "Tencent Hunyuan AI — Free Chat | SlashAI" },
      { name: "description", content: "Chat with Tencent's Hy4 Preview and other flagship models via TokenHub API. Free trial credits available." },
    ],
  }),
  component: HunyuanChat,
});

function HunyuanChat() {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("hy4-preview");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load config from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (saved.apiKey) setApiKey(saved.apiKey);
      if (saved.model) setSelectedModel(saved.model);
      if (saved.messages) setMessages(saved.messages);
    } catch {}
  }, []);

  // Save config
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiKey, model: selectedModel, messages }));
    } catch {}
  }, [apiKey, selectedModel, messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stopStreaming = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || !apiKey || isStreaming) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: msg, timestamp: new Date().toISOString() };
    const assistantMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: "assistant", content: "", timestamp: new Date().toISOString() };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsStreaming(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

    try {
      abortRef.current = new AbortController();
      const res = await fetch("https://tokenhub.tencentcloudmaas.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ model: selectedModel, messages: history, stream: true, temperature: 0.7, max_tokens: 4096 }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.text();
        setMessages((prev) => prev.map((m) => m.id === assistantMsg.id ? { ...m, content: `Error: ${res.status} — ${err.slice(0, 200)}` } : m));
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
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              setMessages((prev) => prev.map((m) => m.id === assistantMsg.id ? { ...m, content: m.content + delta } : m));
            }
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setMessages((prev) => prev.map((m) => m.id === assistantMsg.id ? { ...m, content: `Error: ${e.message}` } : m));
      }
    } finally {
      setIsStreaming(false);
    }
  }, [input, apiKey, selectedModel, messages, isStreaming]);

  const clearChat = () => { setMessages([]); stopStreaming(); };

  const copyMessage = async (id: string, content: string) => {
    try { await navigator.clipboard.writeText(content); setCopiedId(id); setTimeout(() => setCopiedId(null), 1200); } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const model = MODELS.find((m) => m.id === selectedModel);

  return (
    <AppShell title="Hunyuan AI">
      <div className="mx-auto max-w-3xl flex flex-col min-h-[calc(100vh-120px)]">
        {/* Header */}
        <header className="mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐉</span>
            <div>
              <h1 className="text-xl font-bold text-foreground">Tencent Hunyuan AI</h1>
              <p className="text-xs text-muted-foreground">Chat with Hy4 Preview (770B MoE) and other flagship models via TokenHub</p>
            </div>
          </div>
        </header>

        {/* API Key Setup */}
        {!apiKey && (
          <div className="rounded-xl border border-border bg-surface p-6 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="size-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Connect to Tencent TokenHub</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Get a free API key from Tencent Cloud with trial credits. Your key stays in your browser — never sent to our servers.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your TokenHub API key..."
                className="flex-1 h-10 rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none focus:border-primary/50"
              />
              <a href="https://console.tencentcloud.com/hunyuan/apiKey" target="_blank" rel="noopener noreferrer"
                className="shrink-0 rounded-lg bg-primary px-4 h-10 flex items-center text-xs font-medium text-background hover:opacity-90 transition-opacity">
                Get Key →
              </a>
            </div>
          </div>
        )}

        {/* Model Selector */}
        {apiKey && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: "none" }}>
            {MODELS.map((m) => (
              <button key={m.id} onClick={() => setSelectedModel(m.id)}
                className={`shrink-0 rounded-xl border p-2.5 text-left transition-all min-w-[140px] ${
                  selectedModel === m.id ? "border-primary/50 bg-primary/10" : "border-border bg-surface hover:bg-surface-elevated"
                }`}>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{m.icon}</span>
                  <span className="text-xs font-semibold text-foreground">{m.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>
                <span className={`mt-1 inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${TIER_COLORS[m.tier]}`}>
                  {m.tier}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-4 mb-4">
          {messages.length === 0 && apiKey && (
            <div className="py-12 text-center">
              <p className="text-4xl mb-3">🐉</p>
              <p className="text-lg font-bold text-foreground">Chat with {model?.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{model?.desc}</p>
              <div className="mt-6 grid grid-cols-2 gap-2 max-w-md mx-auto">
                {STARTER_PROMPTS.map((p) => (
                  <button key={p} onClick={() => sendMessage(p)}
                    className="rounded-lg border border-border bg-surface p-3 text-left text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-primary text-background"
                  : "border border-border bg-surface text-foreground"
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content || (isStreaming && msg.id === messages[messages.length - 1]?.id ? "..." : "")}</p>
                {msg.role === "assistant" && msg.content && (
                  <button onClick={() => copyMessage(msg.id, msg.content)}
                    className="mt-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                    {copiedId === msg.id ? "✓ Copied" : "Copy"}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {apiKey && (
          <div className="sticky bottom-0 border-t border-border bg-background pt-3 pb-4">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${model?.name || "Hunyuan"}...`}
                  rows={1}
                  className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 pr-12 text-sm focus:outline-none focus:border-primary/50 min-h-[44px] max-h-[120px]"
                />
              </div>
              {isStreaming ? (
                <button onClick={stopStreaming}
                  className="shrink-0 size-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors">
                  <div className="size-3 rounded-sm bg-red-400" />
                </button>
              ) : (
                <button onClick={() => sendMessage()} disabled={!input.trim()}
                  className="shrink-0 size-11 rounded-xl bg-primary flex items-center justify-center text-background hover:opacity-90 disabled:opacity-40 transition-opacity">
                  <ArrowUp className="size-5" />
                </button>
              )}
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Powered by Tencent TokenHub · {model?.name} · Free trial credits available
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
