import { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download, Play, RotateCcw, Check, Code2, FilePlus2, LayoutTemplate, X } from "lucide-react";

import { HTML_SAMPLES, type HtmlSample } from "@/lib/html-samples";

export const Route = createFileRoute("/tools/html-compiler")({
  head: () => ({
    meta: [
      { title: "HTML Compiler - SlashAI" },
      { name: "description", content: "Write HTML, CSS and JavaScript in a live split-pane editor with instant preview. A free browser-based CodePen alternative - no install, no account." },
    ],
  }),
  component: HtmlCompiler,
});

const STORAGE_KEY = "slashai-html-compiler";

interface SavedCode {
  html: string;
  css: string;
  js: string;
  /** document title used for the <title> tag and the download filename */
  title?: string;
}

const DEFAULT_HTML = `<div class="container">
  <h1>Hello, World!</h1>
  <p>Start editing to see your changes live.</p>
  <button id="click-btn">Click me</button>
  <p id="counter"></p>
</div>`;

const DEFAULT_CSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

p {
  color: #94a3b8;
  margin-bottom: 1rem;
}

button {
  background: #38bdf8;
  color: #0f172a;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #7dd3fc;
  transform: translateY(-1px);
}

#counter {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #38bdf8;
}`;

const DEFAULT_JS = `let count = 0;
const btn = document.getElementById('click-btn');
const counter = document.getElementById('counter');

btn.addEventListener('click', () => {
  count++;
  counter.textContent = \`Clicked \${count} time\${count !== 1 ? 's' : ''}\`;
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => btn.style.transform = '', 150);
});`;

type Tab = "html" | "css" | "js";

function HtmlCompiler() {
  const [code, setCode] = useState<SavedCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return { html: DEFAULT_HTML, css: DEFAULT_CSS, js: DEFAULT_JS, title: "My Page" };
  });

  const [showSamples, setShowSamples] = useState(false);
  const [loadedSample, setLoadedSample] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("html");
  const [consoleLog, setConsoleLog] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewMode, setViewMode] = useState<"code" | "split" | "preview">("split");
  const [outputSrc, setOutputSrc] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(code));
    } catch { /* ignore */ }
  }, [code]);

  // Build the iframe srcdoc
  const buildOutput = useCallback(() => {
    const logs: string[] = [];
    const wrappedJs = `
      (function() {
        const _origLog = console.log;
        const _origError = console.error;
        const _origWarn = console.warn;
        console.log = function() {
          _origLog.apply(console, arguments);
          parent.postMessage({ type: 'console', level: 'log', args: Array.from(arguments).map(String).join(' ') }, '*');
        };
        console.error = function() {
          _origError.apply(console, arguments);
          parent.postMessage({ type: 'console', level: 'error', args: Array.from(arguments).map(String).join(' ') }, '*');
        };
        console.warn = function() {
          _origWarn.apply(console, arguments);
          parent.postMessage({ type: 'console', level: 'warn', args: Array.from(arguments).map(String).join(' ') }, '*');
        };
        window.onerror = function(msg, src, line, col, err) {
          parent.postMessage({ type: 'console', level: 'error', args: msg + ' (line ' + line + ')' }, '*');
          return false;
        };
        try {
          ${code.js}
        } catch(e) {
          parent.postMessage({ type: 'console', level: 'error', args: e.toString() }, '*');
        }
      })();
    `;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${code.css}</style>
</head>
<body>
  ${code.html}
  <script>${wrappedJs}<\/script>
</body>
</html>`;
  }, [code.html, code.css, code.js]);

  // Update iframe on code change (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setOutputSrc(buildOutput());
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [buildOutput]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "console") {
        setConsoleLog((prev) => {
          const next = [...prev, `[${e.data.level}] ${e.data.args}`];
          return next.length > 100 ? next.slice(-100) : next;
        });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Run button: force refresh
  const run = () => {
    setConsoleLog([]);
    setOutputSrc("");
    requestAnimationFrame(() => setOutputSrc(buildOutput()));
  };

  const reset = () => {
    setCode({ html: DEFAULT_HTML, css: DEFAULT_CSS, js: DEFAULT_JS, title: "My Page" });
    setLoadedSample(null);
    setConsoleLog([]);
  };

  /** Load one of the ready-made starter projects. */
  const loadSample = (sample: HtmlSample) => {
    setCode({ html: sample.html, css: sample.css, js: sample.js, title: sample.name });
    setLoadedSample(sample.id);
    setConsoleLog([]);
    setShowSamples(false);
    setActiveTab("html");
    setViewMode("split");
  };

  /** Start a clean, minimal page without wiping the whole tool. */
  const newPage = () => {
    setCode({
      html: '<h1>New page</h1>\n<p>Start building.</p>',
      css: 'body {\n  font-family: system-ui, sans-serif;\n  background: #0f172a;\n  color: #e2e8f0;\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n}',
      js: 'console.log("Ready.");',
      title: "Untitled page",
    });
    setLoadedSample(null);
    setConsoleLog([]);
    setActiveTab("html");
  };

  const copyCode = async () => {
    const full = `<style>\n${code.css}\n</style>\n\n${code.html}\n\n<script>\n${code.js}\n<\/script>`;
    await navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const full = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${code.title || "My Page"}</title>\n<style>\n${code.css}\n</style>\n</head>\n<body>\n${code.html}\n<script>\n${code.js}\n<\/script>\n</body>\n</html>`;
    const blob = new Blob([full], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = (code.title || "page")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    a.href = url;
    a.download = `${slug || "page"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      const newVal = val.substring(0, start) + "  " + val.substring(end);
      const field = activeTab;
      setCode((prev) => ({ ...prev, [field]: newVal }));
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  const currentCode = code[activeTab];
  const lineCount = currentCode.split("\n").length;

  const tabColors: Record<Tab, string> = {
    html: "text-orange-400 border-orange-400",
    css: "text-blue-400 border-blue-400",
    js: "text-yellow-400 border-yellow-400",
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#0a0a0f] text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0f1318] border-b border-slate-800">
        <div className="flex min-w-0 items-center gap-2">
          <Code2 className="w-5 h-5 shrink-0 text-cyan-400" />
          <span className="hidden font-semibold text-sm sm:inline">HTML Compiler</span>
          <input
            value={code.title ?? ""}
            onChange={(e) => setCode((prev) => ({ ...prev, title: e.target.value }))}
            aria-label="Page title"
            placeholder="Untitled page"
            className="h-7 w-[110px] min-w-0 rounded-md border border-slate-700 bg-[#0d1117] px-2 text-[12px] text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/60 focus:outline-none sm:w-[170px]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={newPage}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:text-cyan-300 sm:bg-slate-700/50 sm:hover:bg-slate-700"
            title="Start a new, empty page"
          >
            <FilePlus2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>
          <button
            onClick={() => setShowSamples((v) => !v)}
            aria-expanded={showSamples}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              showSamples ? "bg-cyan-500/20 text-cyan-300" : "text-slate-300 hover:text-cyan-300 sm:bg-slate-700/50 sm:hover:bg-slate-700"
            }`}
            title="Browse ready-made starter projects"
          >
            <LayoutTemplate className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Samples</span>
            <span className="font-mono text-[10px] text-slate-500">{HTML_SAMPLES.length}</span>
          </button>
          {/* View mode switcher - lives here so it is reachable in EVERY mode */}
          <div className="mr-0.5 flex items-center rounded-md border border-slate-700 p-0.5">
            {(["code", "split", "preview"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`rounded px-2 py-1 text-[10px] font-medium capitalize sm:px-2.5 sm:text-[11px] ${
                  viewMode === mode ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {mode === "preview" ? "View" : mode}
              </button>
            ))}
          </div>
          <button onClick={run} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300 sm:bg-cyan-500/15 sm:rounded-md sm:hover:bg-cyan-500/25" title="Run (refresh preview)">
            <Play className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Run</span>
          </button>
          <button onClick={copyCode} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-slate-700 transition-colors" title="Copy full code">
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>
          <button onClick={download} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-slate-700 transition-colors" title="Download as HTML file">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={reset} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-slate-700 transition-colors" title="Reset to defaults">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Samples — full starter projects you can open, edit and download */}
      {showSamples && (
        <div className="max-h-[46vh] shrink-0 overflow-y-auto border-b border-slate-800 bg-[#0d1117] px-3 py-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Start from a sample
            </p>
            <button
              onClick={() => setShowSamples(false)}
              aria-label="Close samples"
              className="rounded-md p-1 text-slate-500 transition-colors hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {HTML_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => loadSample(sample)}
                className={`flex items-start gap-2.5 rounded-lg border p-3 text-left transition-colors ${
                  loadedSample === sample.id
                    ? "border-cyan-500/60 bg-cyan-500/10"
                    : "border-slate-800 bg-[#0f1318] hover:border-cyan-500/40"
                }`}
              >
                <span className="text-[20px] leading-none" aria-hidden>
                  {sample.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-semibold text-slate-100">
                    {sample.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-slate-400">
                    {sample.desc}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-[11px] text-slate-500">
            Loading a sample replaces the current draft — use Export first if you want to keep it.
            Your work auto-saves locally.
          </p>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Editor panel */}
        <div
          className={`flex min-h-0 flex-col border-slate-800 lg:border-r ${
            viewMode === "code"
              ? "w-full flex-1"
              : viewMode === "split"
                ? "h-[45vh] w-full shrink-0 lg:h-auto lg:w-1/2"
                : "hidden"
          }`}
        >
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-[#0f1318]">
            {(["html", "css", "js"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? `${tabColors[tab]} border-b-2 bg-slate-800/50`
                    : "text-slate-500 hover:text-slate-300 border-b-2 border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
            <div className="ml-auto pr-3 text-[11px] text-slate-600">
              {lineCount} lines
            </div>
          </div>

          {/* Code editor */}
          <div className="relative min-h-0 flex-1">
            <div className="absolute inset-0 flex">
              {/* Line numbers */}
              <div className="w-12 flex-shrink-0 bg-[#0a0a0f] border-r border-slate-800/50 pt-3 text-right pr-2 text-[11px] text-slate-600 select-none font-mono leading-[1.6] overflow-hidden">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i + 1}>{i + 1}</div>
                ))}
              </div>
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={currentCode}
                onChange={(e) => setCode((prev) => ({ ...prev, [activeTab]: e.target.value }))}
                onKeyDown={handleTabKey}
                spellCheck={false}
                className="flex-1 bg-[#0d1117] p-3 text-[13px] leading-[1.6] text-slate-200 resize-none outline-none font-mono placeholder:text-slate-600"
                placeholder={`Write your ${activeTab.toUpperCase()} here...`}
                style={{ tabSize: 2 }}
              />
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className={`flex min-h-0 flex-1 flex-col ${viewMode === "code" ? "hidden" : ""}`}>
          {/* Preview header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#0f1318] border-b border-slate-800">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Preview</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setConsoleLog([])}
                className="text-[11px] text-slate-500 hover:text-slate-300 px-2 py-0.5 rounded transition-colors"
              >
                Clear console
              </button>
            </div>
          </div>

          {/* iframe */}
          <div className="relative min-h-0 flex-1 bg-white">
            {outputSrc ? (
              <iframe
                ref={iframeRef}
                srcDoc={outputSrc}
                className="absolute inset-0 h-full w-full border-0"
                sandbox="allow-scripts allow-modals"
                title="Preview"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                Click <strong className="mx-1 text-cyan-400">Run</strong> to preview
              </div>
            )}
          </div>

          {/* Console */}
          {consoleLog.length > 0 && (
            <div className="h-28 shrink-0 border-t border-slate-800 bg-[#0d1117] overflow-auto font-mono text-[11px] leading-relaxed">
              {consoleLog.map((msg, i) => (
                <div
                  key={i}
                  className={`px-3 py-0.5 ${
                    msg.startsWith("[error]")
                      ? "text-red-400"
                      : msg.startsWith("[warn]")
                        ? "text-yellow-400"
                        : "text-slate-400"
                  }`}
                >
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
