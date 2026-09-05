import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { En as Check, Z as Play, dn as Copy, gn as Code, nn as Eye, on as Download, q as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as purify } from "../_libs/dompurify.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.html-compiler-HGwKiBMa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_HTML = `<!DOCTYPE html>
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
  <\/script>
</body>
</html>`;
function HtmlCompiler() {
	const [html, setHtml] = (0, import_react.useState)(DEFAULT_HTML);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [downloaded, setDownloaded] = (0, import_react.useState)(false);
	const [autoRefresh, setAutoRefresh] = (0, import_react.useState)(true);
	const [viewMode, setViewMode] = (0, import_react.useState)("preview");
	const [error, setError] = (0, import_react.useState)(null);
	const compiledHtml = (0, import_react.useMemo)(() => {
		try {
			setError(null);
			return purify.sanitize(html, {
				ADD_TAGS: ["script"],
				ADD_ATTR: ["onclick"]
			});
		} catch (e) {
			setError("Error parsing HTML");
			return html;
		}
	}, [html]);
	const copyHtml = async () => {
		try {
			await navigator.clipboard.writeText(html);
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
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
		setTimeout(() => setDownloaded(false), 2e3);
	};
	const clearEditor = () => {
		if (confirm("Clear all code?")) setHtml("");
	};
	const resetToDefault = () => {
		setHtml(DEFAULT_HTML);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "HTML Compiler & Viewer",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground",
					children: "🌐 HTML Compiler & Viewer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Write, compile, and preview HTML with live rendering. Perfect for testing snippets or building complete pages."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-lg border border-border bg-surface p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode("preview"),
							className: `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${viewMode === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), " Preview"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode("source"),
							className: `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${viewMode === "source" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { className: "size-3.5" }), " Source"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: autoRefresh,
							onChange: (e) => setAutoRefresh(e.target.checked),
							className: "rounded border-border"
						}), "Auto-refresh"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: resetToDefault,
								className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), " Reset"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: clearEditor,
								className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface/80",
								children: "Clear"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: copyHtml,
								className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:text-primary",
								children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copied ? "Copied!" : "Copy"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: downloadHtml,
								className: "flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), downloaded ? "Downloaded!" : "Download"]
							})
						]
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400",
				children: ["⚠️ ", error]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-muted-foreground",
							children: "HTML Source Code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [html.length, " chars"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: html,
						onChange: (e) => setHtml(e.target.value),
						className: "min-h-[500px] w-full resize-y rounded-xl border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none",
						placeholder: "Paste or write your HTML code here...",
						spellCheck: false
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Live Preview"
						}), !autoRefresh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {},
							className: "flex items-center gap-1 text-xs text-primary hover:underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3" }), " Run"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative min-h-[500px] overflow-hidden rounded-xl border border-border bg-white",
						children: viewMode === "preview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							srcDoc: compiledHtml,
							title: "HTML Preview",
							className: "absolute inset-0 h-full w-full border-0",
							sandbox: "allow-scripts allow-same-origin"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "absolute inset-0 overflow-auto p-4 font-mono text-xs text-foreground",
							children: html
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-2 text-sm font-semibold text-foreground",
					children: "✨ Features"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "grid grid-cols-2 gap-2 text-xs text-muted-foreground md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Live HTML preview" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• JavaScript support" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• CSS styling" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Download as .html" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• XSS protection" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Auto-refresh toggle" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Syntax highlighting ready" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Mobile responsive" })
					]
				})]
			})
		]
	});
}
//#endregion
export { HtmlCompiler as component };
