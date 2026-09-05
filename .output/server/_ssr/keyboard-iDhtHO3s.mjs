import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/keyboard-iDhtHO3s.js
var import_jsx_runtime = require_jsx_runtime();
var SECTIONS = [
	{
		title: "Global",
		shortcuts: [
			{
				action: "Open search",
				keys: ["/"]
			},
			{
				action: "Show shortcut guide",
				keys: ["?"]
			},
			{
				action: "Go to Home",
				keys: ["G", "H"]
			},
			{
				action: "Go to Discover",
				keys: ["G", "D"]
			},
			{
				action: "Go to Trending",
				keys: ["G", "T"]
			},
			{
				action: "Go to Live",
				keys: ["G", "L"]
			},
			{
				action: "Close / dismiss",
				keys: ["Esc"]
			}
		]
	},
	{
		title: "Search",
		shortcuts: [
			{
				action: "Open search",
				keys: ["/"]
			},
			{
				action: "Navigate results",
				keys: ["↑", "↓"]
			},
			{
				action: "Select result",
				keys: ["Enter"]
			},
			{
				action: "Clear search",
				keys: ["Esc"]
			}
		]
	},
	{
		title: "Commands",
		shortcuts: [
			{
				action: "Copy command",
				keys: ["C"]
			},
			{
				action: "Save to favorites",
				keys: ["S"]
			},
			{
				action: "Open command detail",
				keys: ["Enter"]
			}
		]
	},
	{
		title: "Quiz",
		shortcuts: [
			{
				action: "Next question",
				keys: ["Space"]
			},
			{
				action: "Previous question",
				keys: ["←"]
			},
			{
				action: "End quiz",
				keys: ["Esc"]
			}
		]
	}
];
function KbdKey({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
		className: "inline-block rounded border border-border border-b-2 border-b-[#484f58] bg-surface-elevated px-2 py-0.5 font-mono text-[13px] text-foreground",
		children
	});
}
function KeyboardPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		wide: true,
		title: "Shortcuts",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground sm:text-3xl",
					children: "Keyboard Shortcuts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Every shortcut available across SlashAI"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-8",
					children: SECTIONS.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 text-lg font-semibold text-foreground",
						children: section.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: section.shortcuts.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-foreground",
								children: s.action
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1",
								children: s.keys.map((key, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "then"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KbdKey, { children: key })]
								}, i))
							})]
						}, s.action))
					})] }, section.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/about",
						className: "text-sm text-primary hover:underline",
						children: "About SlashAI →"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/changelog",
						className: "text-sm text-primary hover:underline",
						children: "Changelog →"
					})]
				})
			]
		})
	});
}
//#endregion
export { KeyboardPage as component };
