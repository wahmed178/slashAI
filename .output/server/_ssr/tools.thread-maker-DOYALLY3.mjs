import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.thread-maker-DOYALLY3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ThreadMaker() {
	const [text, setText] = (0, import_react.useState)("");
	const [format, setFormat] = (0, import_react.useState)("twitter");
	const MAX_CHARS = 280;
	const splitIntoTweets = (0, import_react.useMemo)(() => {
		if (!text.trim()) return [];
		if (format === "linkedin") return text.split(/\n\n+/).filter((p) => p.trim()).map((p, i) => `${i + 1}. ${p.trim()}`);
		const sentences = text.replace(/\n/g, " ").split(/(?<=[.!?])\s+/).filter(Boolean);
		const tweets = [];
		let current = "";
		sentences.forEach((s) => {
			if ((current + " " + s).trim().length > 276) {
				if (current.trim()) tweets.push(current.trim());
				current = s;
			} else current = (current + " " + s).trim();
		});
		if (current.trim()) tweets.push(current.trim());
		return tweets.map((t, i) => `${i + 1}/${tweets.length} ${t}`);
	}, [text, format]);
	const copyAll = async () => {
		const all = splitIntoTweets.join("\n\n");
		try {
			await navigator.clipboard.writeText(all);
		} catch {}
	};
	const copySingle = async (tweet) => {
		try {
			await navigator.clipboard.writeText(tweet);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Thread Maker",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🧵 Social Media Thread Formatter"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Auto-split text into Twitter/X threads (280 chars) or LinkedIn posts."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setFormat("twitter"),
						className: `flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${format === "twitter" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
						children: "🐦 Twitter/X"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setFormat("linkedin"),
						className: `flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${format === "linkedin" ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
						children: "💼 LinkedIn"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "Write your long-form text here...",
					className: "h-40 w-full rounded-xl border border-border bg-surface p-4 text-sm focus:outline-none focus:border-primary/50 resize-none"
				}),
				splitIntoTweets.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							splitIntoTweets.length,
							" ",
							format === "twitter" ? "tweets" : "paragraphs"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: copyAll,
						className: "rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-background hover:opacity-90",
						children: "Copy All"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: splitIntoTweets.map((tweet, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap",
							children: tweet
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center justify-between",
							children: [format === "twitter" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground",
								children: [
									tweet.length,
									"/",
									MAX_CHARS
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => copySingle(tweet),
								className: "text-[11px] text-primary hover:underline",
								children: "Copy"
							})]
						})]
					}, i))
				})] })
			]
		})]
	});
}
//#endregion
export { ThreadMaker as component };
