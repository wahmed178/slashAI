import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { En as Check, dn as Copy } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.smart-paste-Css-uzCO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function detect(text) {
	if (!text.trim()) return {
		type: "Empty",
		icon: "📝",
		details: []
	};
	const lines = text.split("\n");
	const details = [];
	const wordCount = text.split(/\s+/).filter(Boolean).length;
	const readingTime = Math.max(1, Math.ceil(wordCount / 200));
	if ([
		/^(import|export|const|let|var|function|class|def |async |await )/m,
		/[{}\[\]();]/g,
		/=>\s*{/,
		/console\.(log|error|warn)/,
		/<\/?[a-z][\w-]*[\s>]/i,
		/^\s*(if|else|for|while|switch|return)\s*[\({]/m
	].filter((p) => p.test(text)).length >= 2) {
		let lang = "Unknown";
		if (/^\s*(def |import |from |class |if __name__)/m.test(text)) lang = "Python";
		else if (/^\s*(fn |let |const |pub |impl |match )/m.test(text)) lang = "Rust";
		else if (/^\s*(func |package |import ")/m.test(text)) lang = "Go";
		else if (/\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/i.test(text)) lang = "SQL";
		else if (/<\/?[a-z][\w-]*[\s>]/i.test(text)) lang = "HTML/JSX";
		else if (/\bconsole\.(log|error|warn)\b/.test(text)) lang = "JavaScript/TypeScript";
		else lang = "Code";
		const funcs = (text.match(/\b(function|def|fn|func)\s+\w+/g) || []).length;
		const lines2 = lines.length;
		details.push(`Language: ${lang}`, `${lines2} lines`, `${wordCount} words`);
		if (funcs) details.push(`${funcs} function(s)`);
		return {
			type: "Code",
			icon: "💻",
			details
		};
	}
	try {
		const parsed = JSON.parse(text);
		const keys = typeof parsed === "object" && parsed !== null ? Object.keys(parsed).length : 0;
		details.push(`Valid JSON`, `${keys} top-level keys`, `${text.length} chars`);
		return {
			type: "JSON",
			icon: "📦",
			details
		};
	} catch {}
	const csvLines = lines.filter((l) => l.includes(","));
	if (csvLines.length > lines.length * .7 && lines.length > 2) {
		const cols = (csvLines[0] ?? "").split(",").length;
		details.push(`${lines.length} rows`, `${cols} columns`);
		return {
			type: "CSV",
			icon: "📊",
			details
		};
	}
	const emailPattern = /[\w.-]+@[\w.-]+\.\w+/;
	const fromMatch = text.match(/From:\s*(.+)/i);
	const subjectMatch = text.match(/Subject:\s*(.+)/i);
	if (fromMatch || subjectMatch || emailPattern.test(text) && text.length < 2e3) {
		if (fromMatch?.[1]) details.push(`From: ${fromMatch[1].trim()}`);
		if (subjectMatch?.[1]) details.push(`Subject: ${subjectMatch[1].trim()}`);
		const actionItems = text.match(/(action item|todo|follow.?up|deadline|please|needs to)/gi);
		if (actionItems) details.push(`${actionItems.length} action item(s) detected`);
		return {
			type: "Email",
			icon: "📧",
			details
		};
	}
	if ((text.match(/\b(agenda|minutes|attendees?|decisions?|action items?|meeting|discussed|resolved|tabled)\b/gi) || []).length >= 2) {
		const decisions = text.match(/(decided|resolved|agreed|approved|tabled)/gi) || [];
		const tasks = text.match(/(todo|action|task|assign|follow.?up)/gi) || [];
		details.push(`${decisions.length} decision(s)`, `${tasks.length} task(s)`);
		return {
			type: "Meeting Notes",
			icon: "📋",
			details
		};
	}
	const urls = text.match(/https?:\/\/[^\s]+/g) || [];
	if (urls.length >= 3 && urls.length > wordCount * .3) {
		details.push(`${urls.length} URL(s) detected`);
		return {
			type: "URL List",
			icon: "🔗",
			details
		};
	}
	const sentences = text.split(/[.!?]+/).filter(Boolean).length;
	const avgWordLen = wordCount > 0 ? (text.replace(/\s/g, "").length / wordCount).toFixed(1) : "0";
	details.push(`${wordCount} words`, `${lines.length} lines`, `${sentences} sentences`, `${readingTime} min read`, `Avg word length: ${avgWordLen} chars`);
	return {
		type: "Plain Text",
		icon: "📝",
		details
	};
}
function SmartPaste() {
	const [text, setText] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const result = (0, import_react.useMemo)(() => detect(text), [text]);
	const copyType = () => {
		navigator.clipboard.writeText(JSON.stringify(result, null, 2));
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Smart Paste Bin",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-5 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "Smart Paste Bin"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Paste any text — instantly detect what it is and extract insights."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "Paste or type anything here...",
					className: "h-52 w-full resize-none rounded-[10px] border border-border bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
				}),
				text.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[10px] border border-border bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-3xl",
								children: result.icon
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-semibold text-foreground",
								children: result.type
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Detected from ",
									text.split("\n").length,
									" lines · ",
									text.length,
									" characters"
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: copyType,
							className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted-foreground transition-all duration-150 hover:text-foreground",
							children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copied ? "Copied" : "Copy"]
						})]
					}), result.details.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3",
						children: result.details.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-border bg-surface-elevated px-3 py-2 text-xs text-foreground",
							children: d
						}, d))
					})]
				})
			]
		})
	});
}
//#endregion
export { SmartPaste as component };
