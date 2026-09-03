import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/code-screenshot")({ component: CodeScreenshot });

const themes = [
  { name: "Dracula", bg: "#282a36", fg: "#f8f8f2", keyword: "#ff79c6", string: "#f1fa8c", comment: "#6272a4", number: "#bd93f9" },
  { name: "GitHub Dark", bg: "#0d1117", fg: "#c9d1d9", keyword: "#ff7b72", string: "#a5d6ff", comment: "#8b949e", number: "#79c0ff" },
  { name: "One Dark", bg: "#282c34", fg: "#abb2bf", keyword: "#c678dd", string: "#98c379", comment: "#5c6370", number: "#d19a66" },
  { name: "Nord", bg: "#2e3440", fg: "#eceff4", keyword: "#81a1c1", string: "#a3be8c", comment: "#616e88", number: "#b48ead" },
  { name: "Monokai", bg: "#272822", fg: "#f8f8f2", keyword: "#f92672", string: "#e6db74", comment: "#75715e", number: "#ae81ff" },
];

const gradients = [
  "linear-gradient(135deg, #0a0a0f, #1a1a2e)",
  "linear-gradient(135deg, #1a0a2e, #0a1628)",
  "linear-gradient(135deg, #0d1117, #161b22)",
  "linear-gradient(135deg, #0a2e1a, #0a1a2e)",
  "linear-gradient(135deg, #2e0a1a, #1a0a2e)",
  "linear-gradient(135deg, #f5f5f5, #e0e0e0)",
  "linear-gradient(135deg, #fffef7, #f0e6d3)",
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #4facfe, #00f2fe)",
];

const fonts = ["JetBrains Mono", "Fira Code", "Source Code Pro", "Cascadia Code", "IBM Plex Mono"];

const languages = ["javascript", "typescript", "python", "html", "css", "sql", "bash", "json", "yaml", "rust", "go", "java", "cpp", "php"];

const sampleCode: Record<string, string> = {
  javascript: `// SlashAI Code Screenshot
function fibonacci(n) {
  if (n <= 1) return n;
  
  const memo = new Map();
  const fib = (x) => {
    if (memo.has(x)) return memo.get(x);
    const result = fib(x - 1) + fib(x - 2);
    memo.set(x, result);
    return result;
  };
  
  return fib(n);
}

console.log(fibonacci(50));
// Output: 12586269025`,
  typescript: `interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

async function getUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) throw new Error("User not found");
  return response.json();
}

const user = await getUser("abc-123");
console.log(\`\${user.name} (\${user.role})\`);`,
  python: `# SlashAI Code Screenshot
from dataclasses import dataclass
from typing import List

@dataclass
class Task:
    title: str
    done: bool = False
    priority: int = 0

def sort_tasks(tasks: List[Task]) -> List[Task]:
    return sorted(tasks, key=lambda t: -t.priority)

tasks = [
    Task("Build AI assistant", priority=10),
    Task("Write docs", priority=5),
    Task("Ship it!", priority=8),
]

for task in sort_tasks(tasks):
    status = "✓" if task.done else "○"
    print(f"{status} [{task.priority}] {task.title}")`,
  bash: `#!/bin/bash
# SlashAI deployment script
set -euo pipefail

echo "🚀 Building SlashAI..."
npm run build

echo "📦 Deploying to production..."
rsync -avz dist/ server:/var/www/slashai/

echo "✅ Deployed successfully!"
echo "🌐 Visit: https://slashai.dev"`,
};

export default function CodeScreenshot() {
  const [code, setCode] = useState(sampleCode['javascript'] ?? '');
  const [lang, setLang] = useState("javascript");
  const [themeIdx, setThemeIdx] = useState(1);
  const [bgIdx, setBgIdx] = useState(0);
  const [bgType, setBgType] = useState<"gradient" | "solid">("gradient");
  const [solidBg, setSolidBg] = useState("#0d1117");
  const [padding, setPadding] = useState(48);
  const [radius, setRadius] = useState(16);
  const [shadow, setShadow] = useState("large");
  const [windowStyle, setWindowStyle] = useState<"mac" | "windows" | "none">("mac");
  const [fontIdx, setFontIdx] = useState(0);
  const [fontSize, setFontSize] = useState(14);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [watermark, setWatermark] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const theme = (themes[themeIdx] ?? themes[0]) as typeof themes[number];
  const font = (fonts[fontIdx] ?? fonts[0]) as typeof fonts[number];

  // Simple syntax highlighting
  const highlight = (code: string) => {
    let html = code
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/(\/\/.*$)/gm, `<span style="color:${theme.comment}">$1</span>`)
      .replace(/(#.*$)/gm, `<span style="color:${theme.comment}">$1</span>`)
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, `<span style="color:${theme.string}">$1</span>`)
      .replace(/\b(function|const|let|var|return|if|else|for|while|class|interface|type|import|from|export|default|async|await|new|throw|try|catch|def|print|True|False|None|set|echo|fi|do|done)\b/g, `<span style="color:${theme.keyword}">$1</span>`)
      .replace(/\b(\d+\.?\d*)\b/g, `<span style="color:${theme.number}">$1</span>`);
    return html;
  };

  const lines = code.split("\n");
  const highlighted = highlight(code);

  const shadowStyle = shadow === "none" ? "none" : shadow === "small" ? "0 4px 24px rgba(0,0,0,0.3)" : "0 8px 48px rgba(0,0,0,0.5), 0 0 80px rgba(88,166,255,0.1)";
  const bgColor = bgType === "gradient" ? gradients[bgIdx] : solidBg;

  const capture = async () => {
    if (!previewRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: null, useCORS: true });
      const link = document.createElement("a");
      link.download = "code-screenshot.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Fallback: just copy
      alert("Download not available. Try copying the screenshot instead.");
    }
  };

  const copyToClipboard = async () => {
    if (!previewRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: null, useCORS: true });
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          alert("Copied to clipboard!");
        }
      });
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">📸 Code Screenshot Maker</h1>
          <p className="text-sm text-muted-foreground">Turn code into beautiful shareable images</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_480px]">
          {/* Controls */}
          <div className="space-y-4">
            {/* Code input */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Code</h3>
                <select value={lang} onChange={(e) => { setLang(e.target.value); const sc = sampleCode[e.target.value]; if (sc) setCode(sc); }} className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground">
                  {languages.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={12} className="w-full rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none" spellCheck={false} />
            </div>

            {/* Theme */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Theme</h3>
              <div className="flex flex-wrap gap-2">
                {themes.map((t, i) => (
                  <button key={t.name} onClick={() => setThemeIdx(i)} className="flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs transition-colors" style={{ background: t.bg, color: t.fg, borderColor: themeIdx === i ? "#58a6ff" : "transparent" }}>
                    <span className="h-3 w-3 rounded-full" style={{ background: t.keyword }} />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Background */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Background</h3>
              <div className="mb-3 flex gap-2">
                <button onClick={() => setBgType("gradient")} className={`rounded-lg px-3 py-1.5 text-xs ${bgType === "gradient" ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`}>Gradient</button>
                <button onClick={() => setBgType("solid")} className={`rounded-lg px-3 py-1.5 text-xs ${bgType === "solid" ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`}>Solid</button>
              </div>
              {bgType === "gradient" ? (
                <div className="grid grid-cols-5 gap-2">
                  {gradients.map((g, i) => (
                    <button key={i} onClick={() => setBgIdx(i)} className="h-10 rounded-lg border-2 transition-colors" style={{ background: g, borderColor: bgIdx === i ? "#58a6ff" : "transparent" }} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input type="color" value={solidBg} onChange={(e) => setSolidBg(e.target.value)} className="h-8 w-8 cursor-pointer rounded border-0" />
                  <span className="text-xs text-muted-foreground">{solidBg}</span>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Padding</label>
                  <select value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground">
                    {[16, 24, 32, 48, 64].map((p) => <option key={p} value={p}>{p}px</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Radius</label>
                  <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground">
                    {[0, 8, 16, 24].map((r) => <option key={r} value={r}>{r}px</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Shadow</label>
                  <select value={shadow} onChange={(e) => setShadow(e.target.value)} className="w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground">
                    {["none", "small", "large"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Window</label>
                  <select value={windowStyle} onChange={(e) => setWindowStyle(e.target.value as "mac" | "windows" | "none")} className="w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground">
                    {["mac", "windows", "none"].map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Font</label>
                  <select value={fontIdx} onChange={(e) => setFontIdx(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground">
                    {fonts.map((f, i) => <option key={f} value={i}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Size</label>
                  <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground">
                    {[11, 12, 13, 14, 15, 16, 18, 20].map((s) => <option key={s} value={s}>{s}px</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={lineNumbers} onChange={(e) => setLineNumbers(e.target.checked)} className="rounded" />
                  Line numbers
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={watermark} onChange={(e) => setWatermark(e.target.checked)} className="rounded" />
                  Watermark
                </label>
              </div>
            </div>

            {/* Export */}
            <div className="flex gap-2">
              <button onClick={capture} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90">⬇ Download PNG</button>
              <button onClick={copyToClipboard} className="flex-1 rounded-xl border border-border bg-surface py-3 text-sm font-semibold text-foreground hover:bg-background">📋 Copy</button>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-4">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Preview</h3>
            <div className="rounded-xl border border-border bg-surface p-2">
              <div ref={previewRef} style={{ background: bgColor, padding: "48px", borderRadius: "16px" }}>
                <div style={{ borderRadius: radius, overflow: "hidden", boxShadow: shadowStyle, fontFamily: `"${font}", monospace` }}>
                  {/* Window chrome */}
                  {windowStyle === "mac" && (
                    <div style={{ background: theme.bg, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${theme.fg}15` }}>
                      <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                      <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
                      <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
                    </div>
                  )}
                  {windowStyle === "windows" && (
                    <div style={{ background: theme.bg, padding: "8px 16px", display: "flex", alignItems: "center", borderBottom: `1px solid ${theme.fg}15` }}>
                      <span style={{ flex: 1, fontSize: 11, color: theme.fg + "80" }}>{lang}</span>
                      <span style={{ color: theme.fg + "60", fontSize: 14 }}>— □ ✕</span>
                    </div>
                  )}

                  {/* Code */}
                  <div style={{ background: theme.bg, padding, overflowX: "auto" }}>
                    <pre style={{ margin: 0, fontSize, lineHeight: 1.6, color: theme.fg }}>
                      {(lineNumbers ? highlighted.split("\n") : [highlighted]).map((line, i) => (
                        <div key={i} style={{ display: "flex" }}>
                          {lineNumbers && <span style={{ userSelect: "none", color: theme.fg + "30", marginRight: 16, minWidth: 24, textAlign: "right", fontSize: fontSize - 2 }}>{i + 1}</span>}
                          <span dangerouslySetInnerHTML={{ __html: line }} />
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>

                {/* Watermark */}
                {watermark && (
                  <div style={{ textAlign: "right", marginTop: 12, fontSize: 11, color: "#ffffff40", fontFamily: "sans-serif" }}>
                    ⚡ SlashAI
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
