import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { En as Check, dn as Copy, on as Download } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.ascii-9FJQ7q7Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FONT = {
	A: [
		"  █  ",
		" █ █ ",
		"█████",
		"█   █",
		"█   █"
	],
	B: [
		"████ ",
		"█   █",
		"████ ",
		"█   █",
		"████ "
	],
	C: [
		" ████",
		"█    ",
		"█    ",
		"█    ",
		" ████"
	],
	D: [
		"████ ",
		"█   █",
		"█   █",
		"█   █",
		"████ "
	],
	E: [
		"█████",
		"█    ",
		"████ ",
		"█    ",
		"█████"
	],
	F: [
		"█████",
		"█    ",
		"████ ",
		"█    ",
		"█    "
	],
	G: [
		" ████",
		"█    ",
		"█  ██",
		"█   █",
		" ████"
	],
	H: [
		"█   █",
		"█   █",
		"█████",
		"█   █",
		"█   █"
	],
	I: [
		"█████",
		"  █  ",
		"  █  ",
		"  █  ",
		"█████"
	],
	J: [
		"█████",
		"   █ ",
		"   █ ",
		"█  █ ",
		" ██  "
	],
	K: [
		"█   █",
		"█  █ ",
		"███  ",
		"█  █ ",
		"█   █"
	],
	L: [
		"█    ",
		"█    ",
		"█    ",
		"█    ",
		"█████"
	],
	M: [
		"█   █",
		"██ ██",
		"█ █ █",
		"█   █",
		"█   █"
	],
	N: [
		"█   █",
		"██  █",
		"█ █ █",
		"█  ██",
		"█   █"
	],
	O: [
		" ███ ",
		"█   █",
		"█   █",
		"█   █",
		" ███ "
	],
	P: [
		"████ ",
		"█   █",
		"████ ",
		"█    ",
		"█    "
	],
	Q: [
		" ███ ",
		"█   █",
		"█ █ █",
		"█  █ ",
		" ██ █"
	],
	R: [
		"████ ",
		"█   █",
		"████ ",
		"█  █ ",
		"█   █"
	],
	S: [
		" ████",
		"█    ",
		" ███ ",
		"    █",
		"████ "
	],
	T: [
		"█████",
		"  █  ",
		"  █  ",
		"  █  ",
		"  █  "
	],
	U: [
		"█   █",
		"█   █",
		"█   █",
		"█   █",
		" ███ "
	],
	V: [
		"█   █",
		"█   █",
		"█   █",
		" █ █ ",
		"  █  "
	],
	W: [
		"█   █",
		"█   █",
		"█ █ █",
		"██ ██",
		"█   █"
	],
	X: [
		"█   █",
		" █ █ ",
		"  █  ",
		" █ █ ",
		"█   █"
	],
	Y: [
		"█   █",
		" █ █ ",
		"  █  ",
		"  █  ",
		"  █  "
	],
	Z: [
		"█████",
		"   █ ",
		"  █  ",
		" █   ",
		"█████"
	],
	" ": [
		"     ",
		"     ",
		"     ",
		"     ",
		"     "
	],
	"0": [
		" ███ ",
		"█  ██",
		"█ █ █",
		"██  █",
		" ███ "
	],
	"1": [
		"  █  ",
		" ██  ",
		"  █  ",
		"  █  ",
		"█████"
	],
	"2": [
		" ███ ",
		"█   █",
		"  ██ ",
		" █   ",
		"█████"
	],
	"3": [
		"████ ",
		"    █",
		" ███ ",
		"    █",
		"████ "
	],
	"4": [
		"█   █",
		"█   █",
		"█████",
		"    █",
		"    █"
	],
	"5": [
		"█████",
		"█    ",
		"████ ",
		"    █",
		"████ "
	],
	"6": [
		" ████",
		"█    ",
		"████ ",
		"█   █",
		" ███ "
	],
	"7": [
		"█████",
		"    █",
		"   █ ",
		"  █  ",
		"  █  "
	],
	"8": [
		" ███ ",
		"█   █",
		" ███ ",
		"█   █",
		" ███ "
	],
	"9": [
		" ███ ",
		"█   █",
		" ████",
		"    █",
		"████ "
	]
};
function textToASCII(text) {
	const upper = text.toUpperCase();
	const lines = [
		"",
		"",
		"",
		"",
		""
	];
	for (const char of upper) {
		const glyph = FONT[char] ?? FONT[" "] ?? [
			"     ",
			"     ",
			"     ",
			"     ",
			"     "
		];
		for (let i = 0; i < 5; i++) lines[i] += (glyph[i] ?? "     ") + " ";
	}
	return lines.join("\n");
}
function ASCIIArt() {
	const [text, setText] = (0, import_react.useState)("SLASHAI");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const ascii = (0, import_react.useMemo)(() => textToASCII(text), [text]);
	const copy = () => {
		navigator.clipboard.writeText(ascii);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};
	const download = () => {
		const blob = new Blob([ascii], { type: "text/plain" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `${text.replace(/\s+/g, "_")}.txt`;
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "ASCII Art Generator",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-5 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "ASCII Art Generator"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Convert text to block ASCII art — perfect for READMEs and terminals."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: text,
					onChange: (e) => setText(e.target.value.toUpperCase().slice(0, 20)),
					placeholder: "Enter text (max 20 chars)",
					className: "h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-[10px] border border-border bg-surface p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "overflow-x-auto font-mono text-xs leading-4 text-primary",
						children: ascii
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: copy,
						className: "flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground",
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copied!" : "Copy"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: download,
						className: "flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm text-white hover:bg-primary/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download .txt"]
					})]
				})
			]
		})
	});
}
//#endregion
export { ASCIIArt as component };
