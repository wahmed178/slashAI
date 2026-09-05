import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.timestamp-sL9r-orx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TimestampConverter() {
	const [now, setNow] = (0, import_react.useState)(Date.now());
	const [input, setInput] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("toHuman");
	const [result, setResult] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setNow(Date.now()), 1e3);
		return () => clearInterval(t);
	}, []);
	const convert = () => {
		if (mode === "toHuman") {
			const ts = parseInt(input);
			const date = isNaN(ts) ? new Date(input) : ts > 0xe8d4a51000 ? new Date(ts) : /* @__PURE__ */ new Date(ts * 1e3);
			if (isNaN(date.getTime())) {
				setResult("Invalid input");
				return;
			}
			setResult(JSON.stringify({
				iso: date.toISOString(),
				local: date.toLocaleString(),
				utc: date.toUTCString(),
				unix_seconds: Math.floor(date.getTime() / 1e3),
				unix_milliseconds: date.getTime(),
				relative: getRelative(date)
			}, null, 2));
		} else {
			const date = new Date(input);
			if (isNaN(date.getTime())) {
				setResult("Invalid date");
				return;
			}
			setResult(JSON.stringify({
				unix_seconds: Math.floor(date.getTime() / 1e3),
				unix_milliseconds: date.getTime()
			}, null, 2));
		}
	};
	const getRelative = (date) => {
		const diff = Date.now() - date.getTime();
		const abs = Math.abs(diff);
		const suffix = diff > 0 ? "ago" : "from now";
		if (abs < 6e4) return `${Math.floor(abs / 1e3)} seconds ${suffix}`;
		if (abs < 36e5) return `${Math.floor(abs / 6e4)} minutes ${suffix}`;
		if (abs < 864e5) return `${Math.floor(abs / 36e5)} hours ${suffix}`;
		return `${Math.floor(abs / 864e5)} days ${suffix}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Timestamp Converter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "⏱️ Timestamp Converter"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Convert between Unix timestamps and human-readable dates."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-mono font-bold text-primary",
							children: Math.floor(now / 1e3)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Current Unix Timestamp"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground mt-1",
							children: new Date(now).toISOString()
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("toHuman"),
						className: `flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${mode === "toHuman" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`,
						children: "Timestamp → Date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("toUnix"),
						className: `flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${mode === "toUnix" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground"}`,
						children: "Date → Timestamp"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: mode === "toHuman" ? "Enter timestamp (e.g. 1700000000)" : "Enter date (e.g. 2024-01-01 or Jan 1, 2024)",
					className: "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary/50",
					onKeyDown: (e) => e.key === "Enter" && convert()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: convert,
					disabled: !input.trim(),
					className: "w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
					children: "Convert"
				}),
				result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-64 overflow-auto rounded-xl border border-border bg-surface p-4 font-mono text-sm text-foreground whitespace-pre-wrap",
					children: result
				})
			]
		})]
	});
}
//#endregion
export { TimestampConverter as component };
