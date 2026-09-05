import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.base64-TfSgswNQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EncodersPage() {
	const [tab, setTab] = (0, import_react.useState)("base64");
	const [input, setInput] = (0, import_react.useState)("");
	const [output, setOutput] = (0, import_react.useState)("");
	const process = (t, val) => {
		try {
			if (t === "base64") setOutput(val ? btoa(unescape(encodeURIComponent(val))) : "");
			else if (t === "url") setOutput(val ? encodeURIComponent(val) : "");
			else if (t === "html") setOutput(val ? val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : "");
			else if (t === "jwt") {
				if (!val.includes(".")) {
					setOutput("Invalid JWT — paste a token with dots");
					return;
				}
				const parts = val.split(".");
				const p0 = parts[0] ?? "";
				const p1 = parts[1] ?? "";
				const header = JSON.parse(atob(p0.replace(/-/g, "+").replace(/_/g, "/")));
				const payload = JSON.parse(atob(p1.replace(/-/g, "+").replace(/_/g, "/")));
				setOutput(`Header:\n${JSON.stringify(header, null, 2)}\n\nPayload:\n${JSON.stringify(payload, null, 2)}\n\nExpiry: ${payload.exp ? (/* @__PURE__ */ new Date(payload.exp * 1e3)).toLocaleString() : "No expiry"}`);
			} else if (t === "hash") {
				if (!val) {
					setOutput("");
					return;
				}
				const data = new TextEncoder().encode(val);
				crypto.subtle.digest("SHA-256", data).then((buf) => {
					const hex = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
					setOutput(`SHA-256: ${hex}\n\nLength: ${hex.length} characters`);
				});
				return;
			}
		} catch {
			setOutput("Error processing input");
		}
	};
	const handleInput = (val) => {
		setInput(val);
		process(tab, val);
	};
	const handleTab = (t) => {
		setTab(t);
		setOutput("");
		setInput("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Encoders",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🔧 Encoders & Decoders"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Base64, URL, HTML entities, JWT decode, SHA-256 hash — all in browser."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 flex gap-1",
					children: [
						{
							id: "base64",
							label: "Base64"
						},
						{
							id: "url",
							label: "URL"
						},
						{
							id: "html",
							label: "HTML"
						},
						{
							id: "jwt",
							label: "JWT"
						},
						{
							id: "hash",
							label: "SHA-256"
						}
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleTab(t.id),
						className: `rounded-lg px-3 py-1.5 text-xs transition-colors ${tab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`,
						children: t.label
					}, t.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: input,
					onChange: (e) => handleInput(e.target.value),
					rows: 6,
					placeholder: tab === "jwt" ? "Paste JWT token..." : tab === "hash" ? "Enter text to hash..." : "Enter text...",
					className: "w-full rounded-xl border border-border bg-surface p-3 font-mono text-xs focus:border-primary/60 focus:outline-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-surface p-4 font-mono text-xs text-foreground",
					children: output || "Output will appear here"
				})
			]
		})]
	});
}
//#endregion
export { EncodersPage as component };
