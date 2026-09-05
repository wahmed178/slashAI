import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.url-encoder-B-yy9iUr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function URLEncoder() {
	const [input, setInput] = (0, import_react.useState)("https://example.com/search?q=hello world&lang=en");
	const [mode, setMode] = (0, import_react.useState)("encode");
	const output = mode === "encode" ? (() => {
		try {
			return encodeURI(input);
		} catch {
			return "Error encoding";
		}
	})() : (() => {
		try {
			return decodeURI(input);
		} catch {
			return "Error decoding";
		}
	})();
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(output);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "URL Encoder/Decoder",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🔗 URL Encoder/Decoder"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Encode and decode URLs and query parameters."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("encode"),
						className: `flex-1 rounded-xl py-2.5 text-sm font-medium ${mode === "encode" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`,
						children: "Encode"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("decode"),
						className: `flex-1 rounded-xl py-2.5 text-sm font-medium ${mode === "decode" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`,
						children: "Decode"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: mode === "encode" ? "Enter URL to encode..." : "Enter encoded URL to decode...",
					className: "h-24 w-full rounded-xl border border-border bg-surface p-3 font-mono text-sm focus:outline-none resize-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "max-h-32 overflow-auto rounded-xl border border-border bg-surface p-3 font-mono text-sm text-foreground whitespace-pre-wrap",
						children: output
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: copy,
						className: "absolute top-2 right-2 text-[10px] text-primary hover:underline",
						children: "Copy"
					})]
				})
			]
		})]
	});
}
//#endregion
export { URLEncoder as component };
