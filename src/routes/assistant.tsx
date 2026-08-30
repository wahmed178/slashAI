import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUp,
  Bot,
  Check,
  ChevronDown,
  Copy,
  FileText,
  Info,
  Menu,
  Paperclip,
  RefreshCw,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/library/AppShell";
import { cn } from "@/lib/utils";

// Worker types
interface WorkerMessage {
  type: string;
  payload?: Record<string, unknown>;
}

interface WorkerResponse {
  type: string;
  chunk?: string;
  fullText?: string;
  progress?: number;
  text?: string;
  modelName?: string;
  modelKey?: string;
  error?: string;
  supported?: boolean;
}

type AppState = "welcome" | "loading" | "chat" | "unsupported";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const MODEL_KEY = "slashai-ai-model";
const HISTORY_KEY = "slashai-ai-history";

const STARTER_PROMPTS = [
  "Explain quantum computing simply",
  "Write a cold email template",
  "Summarise this text: [paste]",
  "What are 5 business ideas for 2026?",
];

// Simple markdown renderer for AI responses
function renderMarkdown(text: string): string {
  let html = text;
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-[#21262d] rounded-md p-3 my-2 overflow-x-auto text-sm font-mono"><code>$2</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#21262d] rounded px-1.5 py-0.5 text-sm font-mono text-accent">$1</code>');
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  // Line breaks
  html = html.replace(/\n/g, "<br/>");
  return html;
}

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "SlashAI Assistant — Private AI" },
      {
        name: "description",
        content: "Private AI that runs in your browser. No API keys, no cloud, no data leaves your device.",
      },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [selectedModel, setSelectedModel] = useState("fast");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [modelName, setModelName] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [attachedFile, setAttachedFile] = useState<{ name: string; text: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [webgpuSupported, setWebgpuSupported] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MODEL_KEY);
      if (saved) setSelectedModel(saved);
      const history = localStorage.getItem(HISTORY_KEY);
      if (history) setMessages(JSON.parse(history));
    } catch { /* ignore */ }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem(MODEL_KEY, selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-50)));
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, streamingText]);

  // Check WebGPU
  useEffect(() => {
    setWebgpuSupported("gpu" in navigator);
  }, []);

  // Worker setup
  const initWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const worker = new Worker(new URL("@/workers/ai-worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const msg = event.data;
      switch (msg.type) {
        case "LOADING_START":
          setAppState("loading");
          setModelName(msg.modelName || "");
          break;
        case "LOADING_PROGRESS":
          setLoadingProgress(msg.progress || 0);
          setLoadingText(msg.text || "");
          break;
        case "LOADED":
          setModelName(msg.modelName || "");
          setAppState("chat");
          break;
        case "STREAM_START":
          setStreamingText("");
          setIsGenerating(true);
          break;
        case "STREAM_CHUNK":
          setStreamingText((prev) => prev + (msg.chunk || ""));
          break;
        case "STREAM_END":
          setIsGenerating(false);
          setStreamingText("");
          if (msg.fullText) {
            const aiMsg: ChatMessage = {
              id: `ai-${Date.now()}`,
              role: "assistant",
              content: msg.fullText,
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, aiMsg]);
          }
          break;
        case "ERROR":
          setIsGenerating(false);
          setStreamingText("");
          console.error("AI Worker error:", msg.error);
          break;
        case "WEBGPU_STATUS":
          setWebgpuSupported(msg.supported ?? false);
          break;
      }
    };
    workerRef.current = worker;
    return worker;
  }, []);

  // Cleanup worker on unmount
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const startLoading = () => {
    localStorage.setItem(MODEL_KEY, selectedModel);
    const worker = initWorker();
    worker.postMessage({ type: "LOAD_MODEL", payload: { model: selectedModel } });
  };

  const sendMessage = () => {
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

    // Build messages for the AI
    const systemMsg = {
      role: "system",
      content: "You are SlashAI Assistant, a helpful AI that runs privately in the user's browser. Be concise, helpful, and friendly. Use markdown formatting when appropriate.",
    };

    const chatMessages = [systemMsg];

    // Add file context if attached
    if (attachedFile?.text) {
      chatMessages.push({
        role: "system",
        content: `The user has provided a document:\n\n${attachedFile.text.slice(0, 8000)}`,
      });
    }

    // Add conversation history (last 10 messages)
    const recentHistory = messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));
    chatMessages.push(...recentHistory);
    chatMessages.push({ role: "user", content: currentInput });

    const worker = initWorker();
    worker.postMessage({ type: "CHAT", payload: { messages: chatMessages } });
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

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("File too large. Maximum size is 10MB.");
      return;
    }

    try {
      let text = "";
      if (file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".csv") || file.name.endsWith(".json")) {
        text = await file.text();
      } else if (file.name.endsWith(".pdf")) {
        // Simple PDF text extraction
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const rawText = new TextDecoder().decode(bytes);
        const matches = rawText.match(/BT[\s\S]*?ET/g);
        text = matches ? matches.join("\n").replace(/[^a-zA-Z0-9\s.,!?;:'"()-]/g, " ") : "Could not extract text from PDF";
      } else if (file.name.endsWith(".docx")) {
        try {
          const mammoth = await import("mammoth");
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          text = result.value;
        } catch {
          text = "Could not extract text from DOCX file";
        }
      } else {
        text = await file.text();
      }

      setAttachedFile({ name: file.name, text: text.slice(0, 8000) });
    } catch {
      alert("Could not read file. Try a different format.");
    }
    e.target.value = "";
  };

  const clearConversation = () => {
    setMessages([]);
    setStreamingText("");
    setIsGenerating(false);
    localStorage.removeItem(HISTORY_KEY);
    workerRef.current?.postMessage({ type: "RESET" });
    setShowMenu(false);
  };

  const exportChat = () => {
    const text = messages
      .map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.content}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "slashai-chat.txt";
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const copyMessage = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // ─── STATE: UNSUPPORTED ───
  if (!webgpuSupported) {
    return (
      <AppShell wide title="Assistant">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl">⚠️</span>
          <h1 className="mt-4 text-xl font-bold text-foreground">WebGPU Not Available</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Your browser does not support WebGPU, which is required for the local AI assistant.
            Try Google Chrome, Microsoft Edge, or Brave for the best experience.
          </p>
          <Link
            to="/assistant/about"
            className="mt-4 text-sm text-primary hover:underline"
          >
            Learn more about how this works
          </Link>
          <Link
            to="/"
            className="mt-2 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to SlashAI
          </Link>
        </div>
      </AppShell>
    );
  }

  // ─── STATE: WELCOME ───
  if (appState === "welcome") {
    return (
      <AppShell wide hideHeaderSearch title="Assistant">
        <div className="mx-auto max-w-2xl py-6">
          {/* Hero */}
          <div className="text-center">
            <span className="text-6xl">🧠</span>
            <h1 className="mt-4 text-[28px] font-bold text-foreground">Private AI — runs on your device</h1>
            <p className="mx-auto mt-2 max-w-md text-base text-muted-foreground">
              No API keys. No cloud. No data ever leaves your browser.
            </p>
          </div>

          {/* Capability cards */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[10px] border border-border bg-surface p-5">
              <span className="text-[32px]">💬</span>
              <h3 className="mt-2 text-base font-semibold text-foreground">Chat</h3>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Talk to an AI that runs entirely in your browser. Conversations stay completely private.
              </p>
            </div>
            <div className="rounded-[10px] border border-border bg-surface p-5">
              <span className="text-[32px]">📄</span>
              <h3 className="mt-2 text-base font-semibold text-foreground">Documents</h3>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Upload PDFs, Word docs, or text files. Ask questions about their content.
              </p>
            </div>
            <div className="relative rounded-[10px] border border-border bg-surface p-5">
              <span className="text-[32px]">🖼️</span>
              <span className="absolute top-4 right-4 rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground">
                Coming Soon
              </span>
              <h3 className="mt-2 text-base font-semibold text-foreground">Vision</h3>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Analyse images and ask questions about what you see. Powered by vision models.
              </p>
            </div>
          </div>

          {/* Model selector */}
          <div className="mt-8">
            <h2 className="text-base font-semibold text-foreground">Choose your AI model</h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Downloaded once, runs forever. Larger = smarter but slower.
            </p>

            <div className="mt-3 space-y-2">
              {(["fast", "balanced", "quality"] as const).map((key) => {
                const m = { fast: { label: "Fast Model", size: "~760MB", desc: "Quick responses. Good for general chat and questions.", icon: "⚡", speed: 3, quality: 2 }, balanced: { label: "Balanced Model", size: "~1.8GB", desc: "Better quality responses. Takes slightly longer.", icon: "⚖️", speed: 2, quality: 3 }, quality: { label: "Quality Model", size: "~4.9GB", desc: "Best quality. Needs a good GPU and fast internet.", icon: "🏆", speed: 1, quality: 4 } }[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedModel(key)}
                    className={cn(
                      "w-full rounded-[10px] border p-4 text-left transition-all duration-150",
                      selectedModel === key
                        ? "border-primary/50 bg-[rgba(88,166,255,0.05)]"
                        : "border-border bg-surface hover:border-[#484f58]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{m.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{m.label}</div>
                          <div className="text-[13px] text-muted-foreground">{m.desc}</div>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-surface-elevated px-2 py-0.5 text-[11px] text-muted-foreground">
                        {m.size}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-4 text-[11px] text-muted-foreground">
                      <span>Speed: {"⚡".repeat(m.speed)}</span>
                      <span>Quality: {"⭐".repeat(m.quality)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Warning */}
          <div className="mt-4 rounded-lg border border-[rgba(210,153,34,0.3)] bg-[rgba(210,153,34,0.08)] p-3">
            <p className="text-[13px] text-[#d29922]">
              ⚠️ The model downloads once from Hugging Face. After that it works completely offline. Make sure you're on Wi-Fi for the first download.
            </p>
          </div>

          {!webgpuSupported && (
            <div className="mt-3 rounded-lg border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.08)] p-3">
              <p className="text-[13px] text-[#f85149]">
                Your browser may not fully support WebGPU. For best results use Chrome, Edge, or Brave.
              </p>
            </div>
          )}

          {/* Start button */}
          <button
            onClick={startLoading}
            className="mt-6 flex h-[52px] w-full items-center justify-center rounded-lg bg-primary text-[15px] font-bold text-[#0d1117] transition-opacity hover:opacity-90"
          >
            Load AI Model
          </button>

          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            100% private · No account needed · MIT licensed
          </p>

          <Link to="/assistant/about" className="mt-2 block text-center text-sm text-primary hover:underline">
            How does this work?
          </Link>
        </div>
      </AppShell>
    );
  }

  // ─── STATE: LOADING ───
  if (appState === "loading") {
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (loadingProgress / 100) * circumference;

    return (
      <AppShell wide hideHeaderSearch title="Loading AI">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-lg font-semibold text-foreground">Loading {modelName}...</h2>

          {/* Progress circle */}
          <div className="relative mt-8 size-[120px]">
            <svg className="size-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#30363d" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="50" fill="none" stroke="#58a6ff" strokeWidth="6"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" className="transition-all duration-300"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-mono font-bold text-foreground">
              {loadingProgress}%
            </span>
          </div>

          {/* Progress text */}
          <p className="mt-4 max-w-xs text-[13px] font-mono text-muted-foreground">
            {loadingText || "Preparing..."}
          </p>

          {/* Stage indicators */}
          <div className="mt-6 flex gap-3">
            {["Checking cache", "Downloading", "Loading weights", "Ready"].map((stage, i) => {
              const active = loadingProgress < 10 ? i === 0 : loadingProgress < 80 ? i === 1 : loadingProgress < 95 ? i === 2 : i === 3;
              return (
                <span key={stage} className={cn("text-[11px]", active ? "text-primary font-semibold" : "text-muted-foreground")}>
                  {i + 1}. {stage}
                </span>
              );
            })}
          </div>

          {/* Notices */}
          <div className="mt-8 space-y-1.5 text-[12px] text-muted-foreground">
            <p>⚡ Keep this tab open during download</p>
            <p>📶 First download needs Wi-Fi — then works offline forever</p>
            <p>🔒 Files go to your browser cache, not any server</p>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── STATE: CHAT ───
  return (
    <div className="flex h-screen flex-col bg-[#0d1117]">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border bg-[#0d1117] px-3">
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green" />
          <span className="text-sm font-medium text-foreground">{modelName || "AI"}</span>
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
              <button onClick={clearConversation} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent">
                <Trash2 className="size-3.5" /> Clear conversation
              </button>
              <button onClick={exportChat} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent">
                <FileText className="size-3.5" /> Export chat
              </button>
              <Link to="/assistant/about" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent">
                <Info className="size-3.5" /> About this model
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !streamingText ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-4xl">🤖</span>
            <h2 className="mt-3 text-base font-semibold text-foreground">Start a conversation</h2>
            <p className="mt-1 text-sm text-muted-foreground">Ask me anything. I run entirely on your device.</p>
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
          /* Messages */
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
                        onClick={() => copyMessage(msg.id, msg.content)}
                        className="text-muted-foreground hover:text-foreground"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="size-3 text-green" /> : <Copy className="size-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming message */}
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

            {/* Thinking indicator */}
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

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-[#0d1117] px-4 py-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto max-w-2xl">
          {/* Attached file chip */}
          {attachedFile && (
            <div className="mb-2 flex items-center gap-2 rounded-md border border-border bg-[#21262d] px-3 py-1.5">
              <FileText className="size-3.5 text-muted-foreground" />
              <span className="flex-1 truncate text-xs text-muted-foreground">{attachedFile.name}</span>
              <button onClick={() => setAttachedFile(null)} className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* Main input row */}
          <div className="flex items-end gap-2">
            {/* Attach button */}
            <label className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-[#21262d] text-muted-foreground transition-colors hover:text-foreground">
              <Paperclip className="size-4" />
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt,.md,.csv,.json"
                onChange={handleFileAttach}
              />
            </label>

            {/* Textarea */}
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
                const target = e.currentTarget;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 144) + "px";
              }}
            />

            {/* Send button */}
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isGenerating}
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
                inputText.trim() && !isGenerating
                  ? "bg-primary text-[#0d1117]"
                  : "bg-[#21262d] text-muted-foreground"
              )}
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
