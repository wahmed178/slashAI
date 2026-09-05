import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.table-DBiqHNRm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TableMaker() {
	const [rows, setRows] = (0, import_react.useState)(3);
	const [cols, setCols] = (0, import_react.useState)(3);
	const [data, setData] = (0, import_react.useState)([
		[
			"Name",
			"Age",
			"City"
		],
		[
			"Alice",
			"28",
			"Mumbai"
		],
		[
			"Bob",
			"34",
			"Delhi"
		]
	]);
	const [exportFormat, setExportFormat] = (0, import_react.useState)("markdown");
	const updateCell = (r, c, val) => {
		const d = data.map((row) => [...row]);
		while (d.length <= r) d.push(Array(cols).fill(""));
		while ((d[r] ?? []).length <= c) (d[r] ?? []).push("");
		if (d[r]) d[r][c] = val;
		setData(d);
	};
	const addRow = () => {
		setRows((r) => r + 1);
		setData((d) => [...d, Array(cols).fill("")]);
	};
	const addCol = () => {
		setCols((c) => c + 1);
		setData((d) => d.map((row) => [...row, ""]));
	};
	const getExport = () => {
		const header = data[0] ?? [];
		if (exportFormat === "markdown") {
			let md = "| " + header.join(" | ") + " |\n| " + header.map(() => "---").join(" | ") + " |\n";
			data.slice(1).forEach((row) => {
				md += "| " + (row ?? []).join(" | ") + " |\n";
			});
			return md;
		}
		if (exportFormat === "csv") return data.map((row) => (row ?? []).map((c) => `"${(c ?? "").replace(/"/g, "\"\"")}"`).join(",")).join("\n");
		if (exportFormat === "json") return JSON.stringify(data.slice(1).map((row) => {
			const obj = {};
			header.forEach((h, i) => {
				obj[h] = (row ?? [])[i] || "";
			});
			return obj;
		}), null, 2);
		let html = "<table>\n<thead><tr>" + header.map((h) => `<th>${h}</th>`).join("") + "</tr></thead>\n<tbody>\n";
		data.slice(1).forEach((row) => {
			html += "<tr>" + (row ?? []).map((c) => `<td>${c ?? ""}</td>`).join("") + "</tr>\n";
		});
		return html + "</tbody></table>";
	};
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(getExport());
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Table Maker",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground",
					children: "📊 Table Maker"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Create and edit tables visually. Export as Markdown, HTML, CSV, or JSON."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: addRow,
					className: "h-8 rounded-lg border border-border px-2 text-xs hover:bg-accent",
					children: "+ Row"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: addCol,
					className: "h-8 rounded-lg border border-border px-2 text-xs hover:bg-accent",
					children: "+ Col"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-auto rounded-xl border border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
					className: "w-full text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.map((row, r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-b border-border last:border-0",
						children: row.map((cell, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "border-r border-border last:border-r-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: cell,
								onChange: (e) => updateCell(r, c, e.target.value),
								className: "w-full bg-transparent px-2 py-1.5 text-xs text-foreground focus:bg-surface-elevated focus:outline-none"
							})
						}, c))
					}, r)) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-2",
				children: [[
					"markdown",
					"html",
					"csv",
					"json"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setExportFormat(f),
					className: `rounded-lg px-2.5 py-1 text-[10px] capitalize transition-colors ${exportFormat === f ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`,
					children: f
				}, f)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: copy,
					className: "ml-auto h-8 rounded-lg bg-primary px-3 text-xs text-primary-foreground hover:opacity-90",
					children: "Copy"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-surface p-4 text-xs text-foreground",
				children: getExport()
			})
		]
	});
}
//#endregion
export { TableMaker as component };
