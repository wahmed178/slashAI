import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { En as Check, dn as Copy, on as Download } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.csv-to-json-RgHtI1dT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EXAMPLE_CSV = `name,age,city
Alice,28,Hyderabad
Bob,35,Delhi
Charlie,22,Bangalore`;
function csvToJson(csv, hasHeader) {
	const lines = csv.trim().split("\n").map((l) => l.split(",").map((c) => c.trim()));
	if (!lines.length) return [];
	if (hasHeader) {
		const headers = lines[0];
		return lines.slice(1).map((row) => {
			const obj = {};
			headers.forEach((h, i) => {
				obj[h] = row[i] ?? "";
			});
			return obj;
		});
	}
	return lines.map((row) => row);
}
function jsonToCsv(json) {
	if (!Array.isArray(json) || !json.length) return "";
	if (typeof json[0] !== "object" || json[0] === null) return json.join("\n");
	const headers = Object.keys(json[0]);
	const rows = json.map((row) => headers.map((h) => String(row[h] ?? "")).join(","));
	return [headers.join(","), ...rows].join("\n");
}
function CsvToJson() {
	const [mode, setMode] = (0, import_react.useState)("csv-to-json");
	const [input, setInput] = (0, import_react.useState)(EXAMPLE_CSV);
	const [hasHeader, setHasHeader] = (0, import_react.useState)(true);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const output = (0, import_react.useMemo)(() => {
		try {
			if (mode === "csv-to-json") {
				const result = csvToJson(input, hasHeader);
				return JSON.stringify(result, null, 2);
			} else {
				const parsed = JSON.parse(input);
				return jsonToCsv(Array.isArray(parsed) ? parsed : [parsed]);
			}
		} catch {
			return "Invalid input";
		}
	}, [
		input,
		mode,
		hasHeader
	]);
	const copy = () => {
		navigator.clipboard.writeText(output);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const download = () => {
		const ext = mode === "csv-to-json" ? "json" : "csv";
		const blob = new Blob([output], { type: ext === "json" ? "application/json" : "text/csv" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `export.${ext}`;
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "CSV ↔ JSON",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode("csv-to-json"),
					className: "min-h-[40px] flex-1 rounded-lg border px-3 text-sm font-medium transition-colors",
					style: {
						background: mode === "csv-to-json" ? "var(--primary)" : "var(--surface-elevated)",
						borderColor: mode === "csv-to-json" ? "transparent" : "var(--border)",
						color: mode === "csv-to-json" ? "var(--background)" : "var(--muted-foreground)"
					},
					children: "CSV → JSON"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode("json-to-csv"),
					className: "min-h-[40px] flex-1 rounded-lg border px-3 text-sm font-medium transition-colors",
					style: {
						background: mode === "json-to-csv" ? "var(--primary)" : "var(--surface-elevated)",
						borderColor: mode === "json-to-csv" ? "transparent" : "var(--border)",
						color: mode === "json-to-csv" ? "var(--background)" : "var(--muted-foreground)"
					},
					children: "JSON → CSV"
				})]
			}),
			mode === "csv-to-json" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 flex items-center gap-2 text-sm text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: hasHeader,
					onChange: (e) => setHasHeader(e.target.checked),
					className: "accent-primary"
				}), "First row is header"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-[11px] text-muted-foreground",
					children: "Input"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: input,
					onChange: (e) => setInput(e.target.value),
					className: "min-h-[300px] w-full resize-y rounded-xl border border-border bg-surface p-4 font-mono text-sm text-foreground focus:border-primary focus:outline-none",
					placeholder: mode === "csv-to-json" ? "Paste CSV here…" : "Paste JSON here…"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-[11px] text-muted-foreground",
					children: "Output"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "min-h-[300px] overflow-auto rounded-xl border border-border bg-surface p-4 font-mono text-sm text-foreground",
					children: output
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: copy,
					className: "flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground hover:text-primary",
					children: [
						copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }),
						" ",
						copied ? "Copied!" : "Copy"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: download,
					className: "flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download"]
				})]
			})
		]
	});
}
//#endregion
export { CsvToJson as component };
