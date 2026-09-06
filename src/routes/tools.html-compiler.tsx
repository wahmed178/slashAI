import { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download, Play, RotateCcw, Maximize2, Minimize2, Check, Code2 } from "lucide-react";

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
    return { html: DEFAULT_HTML, css: DEFAULT_CSS, js: DEFAULT_JS };
  });

  const [activeTab, setActiveTab] = useState<Tab>("html");
  const [consoleLog, setConsoleLog] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
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
    setCode({ html: DEFAULT_HTML, css: DEFAULT_CSS, js: DEFAULT_JS });
    setConsoleLog([]);
  };

  const copyCode = async () => {
    const full = `<style>\n${code.css}\n</style>\n\n${code.html}\n\n<script>\n${code.js}\n<\/script>`;
    await navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const full = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>My Page</title>\n<style>\n${code.css}\n</style>\n</head>\n<body>\n${code.html}\n<script>\n${code.js}\n<\/script>\n</body>\n</html>`;
    const blob = new Blob([full], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "page.html";
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
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0f1318] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          <span className="font-semibold text-sm">HTML Compiler</span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Live Preview</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={run} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/15 text-cyan-400 rounded-md text-xs font-medium hover:bg-cyan-500/25 transition-colors" title="Run (refresh preview)">
            <Play className="w-3.5 h-3.5" /> Run
          </button>
          <button onClick={copyCode} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-slate-700 transition-colors" title="Copy full code">
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={download} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-slate-700 transition-colors" title="Download as HTML file">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-slate-700 transition-colors" title="Reset to defaults">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor panel */}
        <div className={`flex flex-col ${fullscreen ? "hidden lg:flex lg:w-1/2" : "w-full lg:w-1/2"} border-r border-slate-800`}>
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
          <div className="flex-1 relative overflow-auto">
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
        <div className={`flex flex-col ${fullscreen ? "w-full lg:w-1/2" : "w-full lg:w-1/2"}`}>
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
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded transition-colors"
                title={fullscreen ? "Exit fullscreen" : "Fullscreen preview"}
              >
                {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* iframe */}
          <div className="flex-1 bg-white relative">
            {outputSrc ? (
              <iframe
                ref={iframeRef}
                srcDoc={outputSrc}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-modals"
                title="Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Click <strong className="mx-1 text-cyan-400">Run</strong> to preview
              </div>
            )}
          </div>

          {/* Console */}
          {consoleLog.length > 0 && (
            <div className="h-28 border-t border-slate-800 bg-[#0d1117] overflow-auto font-mono text-[11px] leading-relaxed">
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
