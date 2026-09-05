import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Markdown-C4_Kb83X.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Minimal markdown renderer for AI-generated specs. Handles headings, lists,
* fenced code blocks, bold and paragraphs — enough for the spec format we ask
* the model for, with no extra dependency.
*/
function inline(text) {
	return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
		if (part.startsWith("**") && part.endsWith("**")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-semibold text-foreground",
			children: part.slice(2, -2)
		}, i);
		if (part.startsWith("`") && part.endsWith("`")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded bg-accent px-1 py-0.5 text-[12px]",
			children: part.slice(1, -1)
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i);
	});
}
function Markdown({ source }) {
	const lines = source.split("\n");
	const blocks = [];
	let list = [];
	let code = null;
	let table = null;
	const flushTable = () => {
		if (!table || !table.length) {
			table = null;
			return;
		}
		const [header, ...rows] = table;
		blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full border-collapse text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: (header ?? []).map((cell, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "border-b border-border px-2 py-1.5 font-semibold text-foreground",
					children: inline(cell)
				}, i)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row, r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: row.map((cell, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "border-b border-border/50 px-2 py-1.5 align-top text-muted-foreground",
					children: inline(cell)
				}, i)) }, r)) })]
			})
		}, `tbl-${blocks.length}`));
		table = null;
	};
	const splitRow = (line) => line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
	const flushList = () => {
		if (!list.length) return;
		blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "ml-4 list-disc space-y-1 text-sm text-muted-foreground",
			children: list.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(item) }, i))
		}, `ul-${blocks.length}`));
		list = [];
	};
	for (const raw of lines) {
		const line = raw.trimEnd();
		if (line.trim().startsWith("```")) {
			if (code) {
				blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "overflow-x-auto rounded-lg bg-accent/60 p-3 text-[12px] whitespace-pre-wrap",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code.join("\n") })
				}, `code-${blocks.length}`));
				code = null;
			} else {
				flushList();
				code = [];
			}
			continue;
		}
		if (code) {
			code.push(raw);
			continue;
		}
		if (/^#{1,3}\s/.test(line)) {
			flushList();
			const level = line.match(/^#+/)[0].length;
			const text = line.replace(/^#+\s*/, "");
			blocks.push(level <= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-base font-bold text-foreground",
				children: text
			}, `h-${blocks.length}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "mt-3 text-sm font-semibold text-foreground",
				children: text
			}, `h-${blocks.length}`));
			continue;
		}
		if (/^[-*]\s+/.test(line.trim()) || /^\d+\.\s+/.test(line.trim())) {
			list.push(line.trim().replace(/^([-*]|\d+\.)\s+/, ""));
			continue;
		}
		if (/^\|.*\|/.test(line.trim())) {
			flushList();
			const cells = splitRow(line);
			if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
			table = table ?? [];
			table.push(cells);
			continue;
		}
		flushTable();
		if (!line.trim()) {
			flushList();
			continue;
		}
		flushList();
		blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: inline(line)
		}, `p-${blocks.length}`));
	}
	flushList();
	flushTable();
	if (code?.length) blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
		className: "overflow-x-auto rounded-lg bg-accent/60 p-3 text-[12px] whitespace-pre-wrap",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code.join("\n") })
	}, "code-tail"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: blocks
	});
}
/** Pulls the first fenced code block out of a spec — that's the Lovable prompt. */
function extractPrompt(markdown) {
	return markdown.match(/```[a-z]*\n([\s\S]*?)```/i)?.[1]?.trim() ?? "";
}
//#endregion
export { extractPrompt as n, Markdown as t };
