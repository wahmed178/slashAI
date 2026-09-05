import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { En as Check, dn as Copy } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.diff-j1fet8jn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function diffLines(a, b) {
	const aLines = a.split("\n");
	const bLines = b.split("\n");
	const m = aLines.length, n = bLines.length;
	const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
	for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) if ((aLines[i - 1] ?? "") === (bLines[j - 1] ?? "")) dp[i][j] = (dp[i - 1][j - 1] ?? 0) + 1;
	else dp[i][j] = Math.max(dp[i - 1][j] ?? 0, dp[i][j - 1] ?? 0);
	let i = m, j = n;
	const raw = [];
	while (i > 0 || j > 0) if (i > 0 && j > 0 && (aLines[i - 1] ?? "") === (bLines[j - 1] ?? "")) {
		raw.unshift({
			type: "same",
			text: aLines[i - 1] ?? ""
		});
		i--;
		j--;
	} else if (j > 0 && (i === 0 || (dp[i][j - 1] ?? 0) >= (dp[i - 1][j] ?? 0))) {
		raw.unshift({
			type: "added",
			text: bLines[j - 1] ?? ""
		});
		j--;
	} else {
		raw.unshift({
			type: "removed",
			text: aLines[i - 1] ?? ""
		});
		i--;
	}
	return raw;
}
function TextDiff() {
	const [left, setLeft] = (0, import_react.useState)("The quick brown fox jumps over the lazy dog.\nPack my box with five dozen liquor jugs.\nA journey of a thousand miles.");
	const [right, setRight] = (0, import_react.useState)("The quick brown fox leaps over the lazy cat.\nPack my box with five dozen liquor jugs.\nA journey of a thousand miles begins with a single step.");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const diffResult = (0, import_react.useMemo)(() => diffLines(left, right), [left, right]);
	const stats = (0, import_react.useMemo)(() => {
		const added = diffResult.filter((d) => d.type === "added").length;
		const removed = diffResult.filter((d) => d.type === "removed").length;
		return {
			added,
			removed,
			same: diffResult.length - added - removed
		};
	}, [diffResult]);
	const copyDiff = () => {
		const text = diffResult.map((d) => {
			if (d.type === "added") return `+ ${d.text}`;
			if (d.type === "removed") return `- ${d.text}`;
			return `  ${d.text}`;
		}).join("\n");
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Text Diff Checker",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl space-y-5 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-foreground",
						children: "Text Diff Checker"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Compare two texts side by side — changes highlighted instantly."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: copyDiff,
						className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground transition-all hover:text-foreground",
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copied ? "Copied" : "Copy diff"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-lg bg-green/10 px-2.5 py-1 text-xs text-green",
							children: [
								"+",
								stats.added,
								" added"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-lg bg-red/10 px-2.5 py-1 text-xs text-red",
							children: [
								"-",
								stats.removed,
								" removed"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-lg bg-surface px-2.5 py-1 text-xs text-muted-foreground",
							children: [stats.same, " unchanged"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1.5 text-xs font-medium text-muted-foreground",
						children: "Original"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: left,
						onChange: (e) => setLeft(e.target.value),
						className: "h-48 w-full resize-none rounded-[10px] border border-border bg-surface p-3 font-mono text-xs text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30",
						placeholder: "Paste original text..."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1.5 text-xs font-medium text-muted-foreground",
						children: "Modified"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: right,
						onChange: (e) => setRight(e.target.value),
						className: "h-48 w-full resize-none rounded-[10px] border border-border bg-surface p-3 font-mono text-xs text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30",
						placeholder: "Paste modified text..."
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[10px] border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-xs font-medium text-muted-foreground",
						children: "Result"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-xs leading-6",
						children: diffResult.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded px-3 ${d.type === "added" ? "bg-green/10 text-green" : d.type === "removed" ? "bg-red/10 text-red" : "text-muted-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-2 select-none opacity-40",
								children: d.type === "added" ? "+" : d.type === "removed" ? "-" : " "
							}), d.text || "\xA0"]
						}, i))
					})]
				})
			]
		})
	});
}
//#endregion
export { TextDiff as component };
