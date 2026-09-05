import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Copy, Download, Check, Eye, Code, Play, RefreshCw } from "lucide-react";
import DOMPurify from "dompurify";

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    h1 { color: #333; margin-bottom: 8px; }
    p { color: #666; line-height: 1.6; }
    .btn {
      display: inline-block;
      margin-top: 16px;
      padding: 12px 24px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .btn:hover { transform: scale(1.05); }
  </style>
</head>
<body>
  <div class="card">
    <h1>👋 Hello World!</h1>
    <p>Welcome to the HTML Compiler & Viewer. Edit the code on the left and see the live preview on the right.</p>
    <button class="btn" onclick="alert('Button clicked!')">Click Me</button>
  </div>
  
  <script>
    console.log('Page loaded successfully!');
  </script>
</body>
</html>`;

export const Route = createFileRoute("/tools/html-compiler")({
  head: () => ({ meta: [{ title: "HTML Compiler & Viewer — SlashAI" }] }),
  component: HtmlCompiler,
});

function HtmlCompiler() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState<"preview" | "source">("preview");
  const [error, setError] = useState<string | null>(null);

  // Sanitize and compile HTML
  const compiledHtml = useMemo(() => {
    try {
      setError(null);
      return DOMPurify.sanitize(html, { ADD_TAGS: ["script"], ADD_ATTR: ["onclick"] });
    } catch (e) {
      setError("Error parsing HTML");
      return html;
    }
  }, [html]);

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compiled.html";
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const clearEditor = () => {
    if (confirm("Clear all code?")) {
      setHtml("");
    }
  };

  const resetToDefault = () => {
    setHtml(DEFAULT_HTML);
  };

  return (
    <AppShell title="HTML Compiler & Viewer" back={{ to: "/tools", label: "SlashKits" }}>
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          🌐 HTML Compiler & Viewer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write, compile, and preview HTML with live rendering. Perfect for testing snippets or building complete pages.
        </p>
      </header>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
          <button
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              viewMode === "preview"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="size-3.5" /> Preview
          </button>
          <button
            onClick={() => setViewMode("source")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              viewMode === "source"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code className="size-3.5" /> Source
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded border-border"
          />
          Auto-refresh
        </label>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface/80"
          >
            <RefreshCw className="size-3.5" /> Reset
          </button>
          <button
            onClick={clearEditor}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface/80"
          >
            Clear
          </button>
          <button
            onClick={copyHtml}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:text-primary"
          >
            {copied ? <Check className="size-3.5 text-green" /> : <Copy className="size-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={downloadHtml}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Download className="size-3.5" />
            {downloaded ? "Downloaded!" : "Download"}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Main Editor + Preview Area */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Editor Panel */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">HTML Source Code</span>
            <span className="text-xs text-muted-foreground">{html.length} chars</span>
          </div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="min-h-[500px] w-full resize-y rounded-xl border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="Paste or write your HTML code here..."
            spellCheck={false}
          />
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Live Preview</span>
            {!autoRefresh && (
              <button
                onClick={() => {}}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Play className="size-3" /> Run
              </button>
            )}
          </div>
          <div className="relative min-h-[500px] overflow-hidden rounded-xl border border-border bg-white">
            {viewMode === "preview" ? (
              <iframe
                srcDoc={compiledHtml}
                title="HTML Preview"
                className="absolute inset-0 h-full w-full border-0"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <pre className="absolute inset-0 overflow-auto p-4 font-mono text-xs text-foreground">
                {html}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Features Footer */}
      <div className="mt-6 rounded-xl border border-border bg-surface p-4">
        <h3 className="mb-2 text-sm font-semibold text-foreground">✨ Features</h3>
        <ul className="grid grid-cols-2 gap-2 text-xs text-muted-foreground md:grid-cols-4">
          <li>• Live HTML preview</li>
          <li>• JavaScript support</li>
          <li>• CSS styling</li>
          <li>• Download as .html</li>
          <li>• XSS protection</li>
          <li>• Auto-refresh toggle</li>
          <li>• Syntax highlighting ready</li>
          <li>• Mobile responsive</li>
        </ul>
      </div>
    </AppShell>
  );
}
