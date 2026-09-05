import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { En as Check, In as BookOpen, dn as Copy } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.regex-CtT3kpZc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COMMON_PATTERNS = [
	{
		name: "Email",
		pattern: "[\\w.-]+@[\\w.-]+\\.\\w+",
		flags: "gi",
		desc: "Standard email addresses"
	},
	{
		name: "URL",
		pattern: "https?:\\/\\/[^\\s]+",
		flags: "gi",
		desc: "HTTP/HTTPS URLs"
	},
	{
		name: "Phone (IN)",
		pattern: "(\\+91[\\s-]?)?[6-9]\\d{9}",
		flags: "g",
		desc: "Indian mobile numbers"
	},
	{
		name: "Date (DD/MM/YYYY)",
		pattern: "\\d{1,2}\\/\\d{1,2}\\/\\d{4}",
		flags: "g",
		desc: "Indian date format"
	},
	{
		name: "IPv4",
		pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b",
		flags: "g",
		desc: "IP addresses"
	},
	{
		name: "Indian PIN",
		pattern: "\\b[1-9]\\d{5}\\b",
		flags: "g",
		desc: "6-digit PIN codes"
	},
	{
		name: "UPI ID",
		pattern: "[\\w.]+@[\\w]+",
		flags: "g",
		desc: "UPI payment IDs"
	},
	{
		name: "HTML Tag",
		pattern: "<([a-z][a-z0-9]*)\\b[^>]*>(.*?)<\\/\\1>",
		flags: "gi",
		desc: "HTML elements"
	},
	{
		name: "Hex Color",
		pattern: "#[0-9a-f]{3,8}",
		flags: "gi",
		desc: "HEX color codes"
	},
	{
		name: "PAN Card",
		pattern: "\\b[A-Z]{5}\\d{4}[A-Z]\\b",
		flags: "g",
		desc: "Indian PAN format"
	}
];
var LANG_EXPORTS = [
	{
		lang: "JavaScript",
		fn: (p, f) => `new RegExp("${p}", "${f}")`
	},
	{
		lang: "Python",
		fn: (p, f) => `re.compile(r"${p}"${f.includes("i") ? ", re.IGNORECASE" : ""})`
	},
	{
		lang: "PHP",
		fn: (p, f) => `preg_match_all("/${p}/${f.replace("g", "")}", $text, $matches)`
	},
	{
		lang: "Java",
		fn: (p, f) => `Pattern.compile("${p}"${f.includes("i") ? ", Pattern.CASE_INSENSITIVE" : ""})`
	},
	{
		lang: "Go",
		fn: (p, f) => `regexp.${f.includes("i") ? "MustCompile(?i)" : "MustCompile"}("${p}")`
	}
];
function RegexPlayground() {
	const [pattern, setPattern] = (0, import_react.useState)("\\b\\w+@\\w+\\.\\w+\\b");
	const [flags, setFlags] = (0, import_react.useState)("gi");
	const [testText, setTestText] = (0, import_react.useState)("Contact us at hello@slashai.dev or support@example.com for help.");
	const [error, setError] = (0, import_react.useState)("");
	const [copiedLang, setCopiedLang] = (0, import_react.useState)("");
	const regex = (0, import_react.useMemo)(() => {
		try {
			const r = new RegExp(pattern, flags);
			setError("");
			return r;
		} catch (e) {
			setError(e.message);
			return null;
		}
	}, [pattern, flags]);
	const matches = (0, import_react.useMemo)(() => {
		if (!regex || !testText) return [];
		const m = [];
		let match;
		const r = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
		while ((match = r.exec(testText)) !== null) {
			m.push({
				text: match[0],
				index: match.index
			});
			if (!flags.includes("g")) break;
		}
		return m;
	}, [
		regex,
		pattern,
		flags,
		testText
	]);
	const highlighted = (0, import_react.useCallback)(() => {
		if (!matches.length || !regex) return testText;
		const parts = [];
		let lastIdx = 0;
		const r = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
		let match;
		while ((match = r.exec(testText)) !== null) {
			if (match.index > lastIdx) parts.push({
				text: testText.slice(lastIdx, match.index),
				highlight: false
			});
			parts.push({
				text: match[0],
				highlight: true
			});
			lastIdx = match.index + match[0].length;
			if (!flags.includes("g")) break;
		}
		if (lastIdx < testText.length) parts.push({
			text: testText.slice(lastIdx),
			highlight: false
		});
		return parts;
	}, [
		matches,
		regex,
		pattern,
		flags,
		testText
	])();
	const copyExport = (lang, code) => {
		navigator.clipboard.writeText(code);
		setCopiedLang(lang);
		setTimeout(() => setCopiedLang(""), 1500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Regex Playground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-5 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "Regex Playground"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Test regex patterns with live matching and export to any language."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 items-center rounded-[10px] border border-border bg-surface",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pl-3 font-mono text-sm text-muted-foreground",
								children: "/"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: pattern,
								onChange: (e) => setPattern(e.target.value),
								className: "flex-1 bg-transparent px-1 py-2.5 font-mono text-sm text-foreground focus:outline-none",
								placeholder: "regex pattern"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pr-1 font-mono text-sm text-muted-foreground",
								children: "/"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: flags,
								onChange: (e) => setFlags(e.target.value),
								className: "w-12 bg-transparent px-1 py-2.5 text-center font-mono text-sm text-primary focus:outline-none",
								placeholder: "gi"
							})
						]
					})
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg bg-red/10 px-3 py-2 text-xs text-red",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: testText,
					onChange: (e) => setTestText(e.target.value),
					className: "h-32 w-full resize-none rounded-[10px] border border-border bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30",
					placeholder: "Enter test text..."
				}),
				testText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[10px] border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between mb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: matches.length
								}),
								" match",
								matches.length !== 1 ? "es" : ""
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap",
						children: Array.isArray(highlighted) ? highlighted.map((part, i) => part.highlight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
							className: "rounded bg-primary/20 px-0.5 text-primary",
							children: part.text
						}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part.text }, i)) : highlighted
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-3.5" }), " Common Patterns"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-1.5 sm:grid-cols-3",
					children: COMMON_PATTERNS.map((cp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setPattern(cp.pattern);
							setFlags(cp.flags);
						},
						className: "rounded-lg border border-border bg-surface px-3 py-2 text-left transition-all hover:border-primary/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-foreground",
							children: cp.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 truncate font-mono text-[10px] text-muted-foreground",
							children: cp.pattern
						})]
					}, cp.name))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: "Export"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1.5",
					children: LANG_EXPORTS.map((le) => {
						const code = le.fn(pattern, flags);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => copyExport(le.lang, code),
							className: "flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 transition-all hover:border-primary/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-foreground",
									children: le.lang
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 truncate font-mono text-[10px] text-muted-foreground",
									children: code
								})]
							}), copiedLang === le.lang ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 text-muted-foreground" })]
						}, le.lang);
					})
				})] })
			]
		})
	});
}
//#endregion
export { RegexPlayground as component };
