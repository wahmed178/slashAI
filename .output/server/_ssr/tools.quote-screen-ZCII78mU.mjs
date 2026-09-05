import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { En as Check, dn as Copy, q as RefreshCw } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.quote-screen-ZCII78mU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuoteScreen() {
	const [quote, setQuote] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const fetchQuote = async () => {
		setLoading(true);
		try {
			const data = await (await fetch("https://zenquotes.io/api/random")).json();
			if (data?.[0]) setQuote({
				text: data[0].q,
				author: data[0].a
			});
		} catch {
			try {
				const data = await (await fetch("https://api.adviceslip.com/advice")).json();
				setQuote({
					text: data.slip?.advice || "The best time to start was yesterday.",
					author: "Unknown"
				});
			} catch {
				setQuote({
					text: "The best time to start was yesterday.",
					author: "Unknown"
				});
			}
		}
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchQuote();
	}, []);
	const [showControls, setShowControls] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const show = () => {
			setShowControls(true);
		};
		const hide = setTimeout(() => setShowControls(false), 3e3);
		window.addEventListener("mousemove", show);
		window.addEventListener("touchstart", show);
		return () => {
			window.removeEventListener("mousemove", show);
			window.removeEventListener("touchstart", show);
			clearTimeout(hide);
		};
	}, [showControls]);
	const copy = () => {
		if (!quote) return;
		navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center px-6 text-center",
		style: {
			background: "linear-gradient(135deg, var(--background), rgba(10,22,40,1), rgba(26,13,40,1), var(--background))",
			backgroundSize: "400% 400%",
			animation: "gradientShift 60s ease infinite"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `fixed top-4 left-4 z-50 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => window.history.back(),
					className: "rounded-lg border border-border bg-surface/80 backdrop-blur px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
					children: "Close"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }` }),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1.5",
				children: [[
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-3 rounded-full bg-primary",
					style: { animation: `pulse 1.4s ease-in-out ${i * .2}s infinite` }
				}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes pulse { 0%,80%,100%{opacity:0.3;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }` })]
			}) : quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-2xl sm:text-3xl italic text-foreground leading-relaxed",
					style: { fontFamily: "Georgia, 'Times New Roman', serif" },
					children: [
						"\"",
						quote.text,
						"\""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-base text-muted-foreground",
					children: ["— ", quote.author]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: fetchQuote,
					className: "flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface/80 backdrop-blur px-5 text-sm text-muted-foreground hover:text-foreground transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), " Next quote"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: copy,
					className: "flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface/80 backdrop-blur px-5 text-sm text-muted-foreground hover:text-foreground transition-colors",
					children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copied!" : "Copy"]
				})]
			})
		]
	});
}
//#endregion
export { QuoteScreen as component };
