import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.coin-flip-DPVCN9MY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CoinFlipper() {
	const [result, setResult] = (0, import_react.useState)(null);
	const [flipping, setFlipping] = (0, import_react.useState)(false);
	const [history, setHistory] = (0, import_react.useState)([]);
	const flip = () => {
		setFlipping(true);
		setTimeout(() => {
			const side = Math.random() > .5 ? "heads" : "tails";
			setResult(side);
			setHistory((p) => [{
				side,
				time: Date.now()
			}, ...p].slice(0, 50));
			setFlipping(false);
		}, 600);
	};
	const heads = history.filter((h) => h.side === "heads").length;
	const tails = history.filter((h) => h.side === "tails").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Coin Flipper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🪙 Coin Flipper"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Flip a virtual coin with animation."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: flip,
						disabled: flipping,
						className: `size-32 rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center text-6xl transition-all ${flipping ? "animate-spin" : "hover:scale-105 active:scale-95"}`,
						children: result ? result === "heads" ? "👑" : "🌙" : "🪙"
					})
				}),
				result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-lg font-bold text-foreground capitalize",
					children: [result, "!"]
				}),
				history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold text-foreground",
								children: heads
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Heads"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold text-foreground",
								children: tails
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Tails"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold text-foreground",
								children: history.length
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Total"
							})]
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { CoinFlipper as component };
