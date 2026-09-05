import { o as __toESM } from "../_runtime.mjs";
import { n as init_performance, r as performance_default } from "../_libs/canvg+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.api-tester-DPCxNN_g.js
init_performance();
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var METHODS = [
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE"
];
function APITester() {
	const [method, setMethod] = (0, import_react.useState)("GET");
	const [url, setUrl] = (0, import_react.useState)("https://jsonplaceholder.typicode.com/posts/1");
	const [headers, setHeaders] = (0, import_react.useState)("{\n  \"Content-Type\": \"application/json\"\n}");
	const [body, setBody] = (0, import_react.useState)("");
	const [response, setResponse] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [time, setTime] = (0, import_react.useState)(0);
	const send = async () => {
		setLoading(true);
		const start = performance_default.now();
		try {
			const h = JSON.parse(headers || "{}");
			const opts = {
				method,
				headers: h
			};
			if ([
				"POST",
				"PUT",
				"PATCH"
			].includes(method) && body) opts.body = body;
			const res = await fetch(url, opts);
			const text = await res.text();
			let data;
			try {
				data = JSON.parse(text);
			} catch {
				data = text;
			}
			setResponse({
				status: res.status,
				statusText: res.statusText,
				headers: Object.fromEntries(res.headers.entries()),
				body: data,
				time: Math.round(performance_default.now() - start)
			});
		} catch (e) {
			setResponse({
				status: 0,
				statusText: "Error",
				body: e.message,
				time: Math.round(performance_default.now() - start),
				headers: {}
			});
		}
		setLoading(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "API Tester",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🔌 API Tester"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Test REST APIs from your browser. Like mini Postman."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: method,
							onChange: (e) => setMethod(e.target.value),
							className: "h-11 rounded-xl border border-border bg-surface px-3 text-sm font-semibold",
							children: METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: m,
								children: m
							}, m))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: url,
							onChange: (e) => setUrl(e.target.value),
							placeholder: "https://api.example.com/endpoint",
							className: "flex-1 h-11 rounded-xl border border-border bg-surface px-4 text-sm font-mono focus:outline-none focus:border-primary/50"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: send,
							disabled: loading,
							className: "shrink-0 rounded-xl bg-primary px-6 h-11 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
							children: loading ? "..." : "Send"
						})
					]
				}),
				[
					"POST",
					"PUT",
					"PATCH"
				].includes(method) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted-foreground mb-1 block",
					children: "Request Body"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: body,
					onChange: (e) => setBody(e.target.value),
					placeholder: "{\"key\": \"value\"}",
					className: "h-24 w-full rounded-xl border border-border bg-surface p-3 font-mono text-sm focus:outline-none resize-none"
				})] }),
				response && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `font-bold ${response.status >= 200 && response.status < 300 ? "text-green" : response.status >= 400 ? "text-red-400" : "text-yellow"}`,
							children: [
								response.status,
								" ",
								response.statusText
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [response.time, "ms"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "max-h-80 overflow-auto rounded-xl border border-border bg-surface p-4 font-mono text-xs text-foreground whitespace-pre-wrap",
						children: typeof response.body === "string" ? response.body : JSON.stringify(response.body, null, 2)
					})]
				})
			]
		})]
	});
}
//#endregion
export { APITester as component };
