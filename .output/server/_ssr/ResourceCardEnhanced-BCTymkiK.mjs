import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Pn as Bookmark, in as ExternalLink } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ResourceCardEnhanced-BCTymkiK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRICING_STYLE = {
	"Completely Free": {
		text: "#3fb950",
		bg: "rgba(63,185,80,0.1)",
		border: "rgba(63,185,80,0.3)"
	},
	"Free Tier": {
		text: "#58a6ff",
		bg: "rgba(88,166,255,0.1)",
		border: "rgba(88,166,255,0.3)"
	},
	"Open Source": {
		text: "#d29922",
		bg: "rgba(210,153,34,0.1)",
		border: "rgba(210,153,34,0.3)"
	},
	Freemium: {
		text: "#8b949e",
		bg: "#21262d",
		border: "#30363d"
	},
	"Free for Students": {
		text: "#3fb950",
		bg: "rgba(63,185,80,0.1)",
		border: "rgba(63,185,80,0.3)"
	},
	"Limited-Time Free": {
		text: "#d29922",
		bg: "rgba(210,153,34,0.1)",
		border: "rgba(210,153,34,0.3)"
	},
	Paid: {
		text: "#8b949e",
		bg: "#21262d",
		border: "#30363d"
	}
};
function getDomain(url) {
	try {
		return new URL(url).hostname.replace("www.", "");
	} catch {
		return "";
	}
}
function ResourceCardEnhanced({ resource, compact = false }) {
	const [saved, setSaved] = (0, import_react.useState)(() => {
		try {
			const s = localStorage.getItem("slashai-saved-resources");
			return s ? JSON.parse(s) : [];
		} catch {
			return [];
		}
	});
	const domain = getDomain(resource.url);
	const isSaved = saved.includes(resource.id);
	const pricingStyle = PRICING_STYLE[resource.pricing] ?? PRICING_STYLE["Freemium"];
	const toggleSave = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		e.stopPropagation();
		setSaved((prev) => {
			const next = isSaved ? prev.filter((id) => id !== resource.id) : [...prev, resource.id];
			localStorage.setItem("slashai-saved-resources", JSON.stringify(next));
			return next;
		});
	}, [isSaved, resource.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/r/$id",
		params: { id: resource.id },
		className: "resource-card-enhanced group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex size-10 shrink-0 items-center justify-center rounded-lg text-[18px] font-bold",
				style: {
					background: "var(--surface-elevated)",
					color: "var(--muted-foreground)",
					fontFamily: "var(--font-mono)"
				},
				children: domain ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
					alt: "",
					className: "size-6 rounded",
					loading: "lazy",
					onError: (e) => {
						const el = e.currentTarget;
						el.style.display = "none";
						const parent = el.parentElement;
						if (parent && !parent.querySelector(".fallback-letter")) {
							const span = document.createElement("span");
							span.className = "fallback-letter";
							span.textContent = resource.name.charAt(0).toUpperCase();
							parent.appendChild(span);
						}
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: resource.name.charAt(0).toUpperCase() })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-[14px] font-semibold text-foreground",
						children: resource.name
					}),
					!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 line-clamp-2 text-[13px] text-muted-foreground",
						children: resource.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px]",
								style: {
									background: "var(--surface-elevated)",
									borderColor: "var(--border)",
									color: "var(--muted-foreground)"
								},
								children: resource.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px]",
								style: {
									background: pricingStyle.bg,
									borderColor: pricingStyle.border,
									color: pricingStyle.text
								},
								children: resource.pricing
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground",
								children: ["Last checked ", resource.lastVerified]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-col items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: resource.url,
					target: "_blank",
					rel: "noopener noreferrer",
					onClick: (e) => e.stopPropagation(),
					className: "flex h-8 items-center gap-1 rounded-md border px-2.5 text-[10px] font-medium transition-all duration-150",
					style: {
						background: "var(--surface-elevated)",
						borderColor: "var(--border)",
						color: "var(--primary)"
					},
					onMouseEnter: (e) => {
						e.currentTarget.style.background = "rgba(88,166,255,0.08)";
						e.currentTarget.style.borderColor = "var(--primary)";
					},
					onMouseLeave: (e) => {
						e.currentTarget.style.background = "var(--surface-elevated)";
						e.currentTarget.style.borderColor = "var(--border)";
					},
					children: ["Visit ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: toggleSave,
					className: "rounded p-1 transition-colors duration-150",
					style: { color: isSaved ? "var(--primary)" : "var(--muted-foreground)" },
					"aria-label": isSaved ? "Unsave" : "Save",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, {
						className: "size-4",
						fill: isSaved ? "var(--primary)" : "none"
					})
				})]
			})
		]
	});
}
//#endregion
export { ResourceCardEnhanced as t };
