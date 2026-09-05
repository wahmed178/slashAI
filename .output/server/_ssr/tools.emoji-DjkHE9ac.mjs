import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.emoji-DjkHE9ac.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMOJI_DATA = {
	"Smileys": [
		"😀",
		"😃",
		"😄",
		"😁",
		"😆",
		"😅",
		"🤣",
		"😂",
		"🙂",
		"😊",
		"😇",
		"🥰",
		"😍",
		"🤩",
		"😘",
		"😗",
		"😚",
		"😙",
		"🥲",
		"😋",
		"😛",
		"😜",
		"🤪",
		"😝",
		"🤑",
		"🤗",
		"🤭",
		"🫢",
		"🤫",
		"🤔",
		"🫡",
		"🤐",
		"🤨",
		"😐",
		"😑",
		"😶",
		"🫥",
		"😏",
		"😒",
		"🙄",
		"😬",
		"🤥",
		"😌",
		"😔",
		"😪",
		"🤤",
		"😴",
		"😷",
		"🤒",
		"🤕",
		"🤢",
		"🤮",
		"🥵",
		"🥶",
		"🥴",
		"😵",
		"🤯",
		"🤠",
		"🥳",
		"🥸",
		"😎",
		"🤓",
		"🧐"
	],
	"Gestures": [
		"👋",
		"🤚",
		"🖐️",
		"✋",
		"🖖",
		"🫱",
		"🫲",
		"🫳",
		"🫴",
		"👌",
		"🤌",
		"🤏",
		"✌️",
		"🤞",
		"🫰",
		"🤟",
		"🤘",
		"🤙",
		"👈",
		"👉",
		"👆",
		"🖕",
		"👇",
		"☝️",
		"🫵",
		"👍",
		"👎",
		"✊",
		"👊",
		"🤛",
		"🤜",
		"👏",
		"🙌",
		"🫶",
		"👐",
		"🤲",
		"🤝",
		"🙏"
	],
	"Hearts": [
		"❤️",
		"🧡",
		"💛",
		"💚",
		"💙",
		"💜",
		"🖤",
		"🤍",
		"🤎",
		"💔",
		"❤️‍🔥",
		"❤️‍🩹",
		"❣️",
		"💕",
		"💞",
		"💓",
		"💗",
		"💖",
		"💘",
		"💝",
		"💟"
	],
	"Nature": [
		"🌸",
		"🌺",
		"🌻",
		"🌹",
		"🌷",
		"🌼",
		"🪷",
		"🌿",
		"🍀",
		"🍁",
		"🍂",
		"🍃",
		"🪹",
		"🪺",
		"🪵",
		"🌵",
		"🌴",
		"🌳",
		"🌲",
		"🪨",
		"🌊"
	],
	"Food": [
		"🍎",
		"🍐",
		"🍊",
		"🍋",
		"🍌",
		"🍉",
		"🍇",
		"🍓",
		"🫐",
		"🍈",
		"🍒",
		"🍑",
		"🥭",
		"🍍",
		"🥝",
		"🍅",
		"🥑",
		"🫑",
		"🥬",
		"🫒"
	],
	"Objects": [
		"💻",
		"📱",
		"⌨️",
		"🖥️",
		"🖨️",
		"🖱️",
		"🖲️",
		"💡",
		"🔦",
		"🕯️",
		"📷",
		"📸",
		"📹",
		"🎥",
		"📽️",
		"🎞️",
		"📞",
		"☎️",
		"📟",
		"📠"
	],
	"Symbols": [
		"✅",
		"❌",
		"⭕",
		"❗",
		"❓",
		"‼️",
		"⁉️",
		"💯",
		"🔥",
		"✨",
		"🎉",
		"🎊",
		"🎈",
		"🎁",
		"🎯",
		"🏆",
		"⚽",
		"🏀",
		"🎾",
		"🎮"
	]
};
function EmojiPicker() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [recent, setRecent] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("slashai.emoji.recent") || "[]");
		} catch {
			return [];
		}
	});
	const [copied, setCopied] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		if (!search) return EMOJI_DATA;
		const result = {};
		for (const [cat, emojis] of Object.entries(EMOJI_DATA)) {
			const match = emojis.filter(() => cat.toLowerCase().includes(search.toLowerCase()));
			if (match.length) result[cat] = match;
		}
		return result;
	}, [search]);
	const pick = async (emoji) => {
		try {
			await navigator.clipboard.writeText(emoji);
		} catch {}
		setCopied(emoji);
		setTimeout(() => setCopied(""), 1200);
		setRecent((r) => {
			const next = [emoji, ...r.filter((e) => e !== emoji)].slice(0, 20);
			try {
				localStorage.setItem("slashai.emoji.recent", JSON.stringify(next));
			} catch {}
			return next;
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Emoji Picker",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "😀 Emoji Picker"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Search 3,600+ emojis. Click to copy."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Search emojis...",
					className: "h-10 w-full rounded-xl border border-border bg-surface px-4 text-sm focus:border-primary/60 focus:outline-none"
				}),
				copied && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-center text-xs text-primary",
					children: ["Copied ", copied]
				}),
				recent.length > 0 && !search && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 text-xs font-medium text-foreground",
						children: "Recently Used"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: recent.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => pick(e),
							className: "flex size-9 items-center justify-center rounded-lg border border-border text-lg hover:bg-accent",
							children: e
						}, e))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-4",
					children: Object.entries(filtered).map(([cat, emojis]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1.5 text-xs font-medium text-foreground",
						children: cat
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: emojis.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => pick(e),
							className: "flex size-9 items-center justify-center rounded-lg border border-border text-lg transition-colors hover:bg-accent hover:border-primary/40",
							children: e
						}, e))
					})] }, cat))
				})
			]
		})]
	});
}
//#endregion
export { EmojiPicker as component };
