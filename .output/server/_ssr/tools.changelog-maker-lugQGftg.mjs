import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.changelog-maker-lugQGftg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CAT_CONFIG = {
	new: {
		label: "New",
		color: "#3fb950",
		bg: "rgba(63,185,80,0.1)"
	},
	improved: {
		label: "Improved",
		color: "#58a6ff",
		bg: "rgba(88,166,255,0.1)"
	},
	fixed: {
		label: "Fixed",
		color: "#d29922",
		bg: "rgba(210,153,34,0.1)"
	},
	removed: {
		label: "Removed",
		color: "#f85149",
		bg: "rgba(248,81,73,0.1)"
	}
};
function ChangelogMaker() {
	const [product, setProduct] = (0, import_react.useState)("");
	const [version, setVersion] = (0, import_react.useState)("1.0.0");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [entries, setEntries] = (0, import_react.useState)({
		new: [],
		improved: [],
		fixed: [],
		removed: []
	});
	const [activeCat, setActiveCat] = (0, import_react.useState)("new");
	const [input, setInput] = (0, import_react.useState)("");
	const [format, setFormat] = (0, import_react.useState)("markdown");
	const addEntry = () => {
		if (!input.trim()) return;
		setEntries((e) => ({
			...e,
			[activeCat]: [...e[activeCat], {
				id: Date.now(),
				text: input.trim()
			}]
		}));
		setInput("");
	};
	const removeEntry = (cat, id) => {
		setEntries((e) => ({
			...e,
			[cat]: e[cat].filter((en) => en.id !== id)
		}));
	};
	const generateMarkdown = () => {
		let md = `# ${product || "Product"} ${version}\n\n**Release Date:** ${date}\n\n`;
		for (const [cat, items] of Object.entries(entries)) {
			if (items.length === 0) continue;
			md += `### ${CAT_CONFIG[cat].label}\n\n`;
			items.forEach((item) => {
				md += `- ${item.text}\n`;
			});
			md += "\n";
		}
		return md;
	};
	const generateHTML = () => {
		let html = `<h1>${product || "Product"} ${version}</h1>\n<p><em>${date}</em></p>\n`;
		for (const [cat, items] of Object.entries(entries)) {
			if (items.length === 0) continue;
			html += `<h3 style="color:${CAT_CONFIG[cat].color}">${CAT_CONFIG[cat].label}</h3>\n<ul>\n`;
			items.forEach((item) => {
				html += `  <li>${item.text}</li>\n`;
			});
			html += "</ul>\n";
		}
		return html;
	};
	const generateText = () => {
		let txt = `${product || "Product"} ${version} — ${date}\n${"=".repeat(40)}\n\n`;
		for (const [cat, items] of Object.entries(entries)) {
			if (items.length === 0) continue;
			txt += `[${CAT_CONFIG[cat].label}]\n`;
			items.forEach((item) => {
				txt += `  • ${item.text}\n`;
			});
			txt += "\n";
		}
		return txt;
	};
	const generateJSON = () => {
		const obj = {
			product: product || "Product",
			version,
			date,
			changes: {}
		};
		for (const [cat, items] of Object.entries(entries)) if (items.length > 0) obj.changes[cat] = items.map((i) => i.text);
		return JSON.stringify(obj, null, 2);
	};
	const output = format === "markdown" ? generateMarkdown() : format === "html" ? generateHTML() : format === "json" ? generateJSON() : generateText();
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(output);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Changelog Maker",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📝 Changelog Generator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Fill in your release details → get a clean changelog in Markdown, HTML, text, or JSON."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: product,
							onChange: (e) => setProduct(e.target.value),
							placeholder: "Product name",
							className: "h-9 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary/50"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: version,
							onChange: (e) => setVersion(e.target.value),
							placeholder: "Version",
							className: "h-9 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary/50"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value),
							className: "h-9 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary/50"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: Object.keys(CAT_CONFIG).map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveCat(cat),
						className: `flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${activeCat === cat ? "text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
						style: activeCat === cat ? { background: CAT_CONFIG[cat].color } : {},
						children: [
							CAT_CONFIG[cat].label,
							" (",
							entries[cat].length,
							")"
						]
					}, cat))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: `Add a ${CAT_CONFIG[activeCat].label.toLowerCase()} item...`,
						className: "flex-1 h-9 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary/50",
						onKeyDown: (e) => e.key === "Enter" && addEntry()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: addEntry,
						className: "rounded-lg bg-primary px-4 text-sm font-medium text-background hover:opacity-90",
						children: "Add"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: Object.keys(CAT_CONFIG).map((cat) => entries[cat].length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold mb-1",
						style: { color: CAT_CONFIG[cat].color },
						children: CAT_CONFIG[cat].label
					}), entries[cat].map((en) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm flex-1 text-foreground",
							children: en.text
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => removeEntry(cat, en.id),
							className: "text-xs text-muted-foreground hover:text-red-400",
							children: "✕"
						})]
					}, en.id))] }, cat))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: [
								"markdown",
								"html",
								"text",
								"json"
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFormat(f),
								className: `rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${format === f ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground"}`,
								children: f
							}, f))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: copy,
							className: "text-xs text-primary hover:underline",
							children: "Copy"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-surface-elevated p-3 font-mono text-[11px] leading-relaxed text-foreground",
						children: output
					})]
				})
			]
		})]
	});
}
//#endregion
export { ChangelogMaker as component };
