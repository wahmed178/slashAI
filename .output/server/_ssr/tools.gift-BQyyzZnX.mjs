import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.gift-BQyyzZnX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GIFTS = {
	friend: {
		"under500": [
			{
				name: "Personalized Keychain",
				desc: "Custom metal keychain with name engraving",
				why: "Thoughtful, useful daily reminder",
				price: "₹200–400",
				tags: ["personal", "everyday"]
			},
			{
				name: "Scented Candle Set",
				desc: "3-pack soy candles in lavender, vanilla, jasmine",
				why: "Relaxing and universally liked",
				price: "₹300–500",
				tags: ["home", "relaxing"]
			},
			{
				name: "Custom Meme Mug",
				desc: "Print a funny inside joke on a ceramic mug",
				why: "Personal and gets used daily",
				price: "₹250–400",
				tags: ["funny", "personal"]
			},
			{
				name: "Mini Succulent Set",
				desc: "3 small succulents in pastel pots",
				why: "Low-maintenance greenery for desk",
				price: "₹300–500",
				tags: ["plants", "desk"]
			}
		],
		"500-2000": [
			{
				name: "Portable Bluetooth Speaker",
				desc: "JBL Go 3 or equivalent",
				why: "Music lover's perfect companion",
				price: "₹800–1,500",
				tags: ["tech", "music"]
			},
			{
				name: "Gourmet Chocolate Box",
				desc: "Artisan chocolates from local chocolatier",
				why: "Indulgent treat everyone loves",
				price: "₹600–1,200",
				tags: ["food", "premium"]
			},
			{
				name: "Customized Notebook",
				desc: "Leather-bound with embossed initials",
				why: "Classy and personal",
				price: "₹500–1,000",
				tags: ["stationery", "personal"]
			},
			{
				name: "Board Game",
				desc: "Codenames, Catan, or Exploding Kittens",
				why: "Creates shared memories",
				price: "₹800–1,800",
				tags: ["fun", "group"]
			}
		]
	},
	partner: {
		"500-2000": [
			{
				name: "Photo Book",
				desc: "Custom photo book with your best moments",
				why: "Deeply personal and emotional",
				price: "₹800–1,500",
				tags: ["personal", "memories"]
			},
			{
				name: "Couple Watch Set",
				desc: "Matching minimalist watches",
				why: "Wear a piece of each other daily",
				price: "₹1,500–2,000",
				tags: ["fashion", "matching"]
			},
			{
				name: "Experience Voucher",
				desc: "Couples spa, dinner, or adventure activity",
				why: "Creates new memories together",
				price: "₹1,000–2,000",
				tags: ["experience", "together"]
			},
			{
				name: "Personalized Star Map",
				desc: "Map of the sky on your first date",
				why: "Romantic and unique",
				price: "₹800–1,500",
				tags: ["romantic", "decor"]
			}
		],
		"2000-5000": [
			{
				name: "Smart Watch",
				desc: "Amazfit or Samsung Galaxy Watch",
				why: "Health tracking + style",
				price: "₹3,000–5,000",
				tags: ["tech", "health"]
			},
			{
				name: "Silk Scarf / Pocket Square",
				desc: "Premium silk accessory",
				why: "Timeless elegance",
				price: "₹2,000–3,500",
				tags: ["fashion", "premium"]
			},
			{
				name: "Weekend Getaway",
				desc: "Book a 2-night stay at a hill station",
				why: "Quality time away from routine",
				price: "₹3,000–5,000",
				tags: ["experience", "travel"]
			}
		]
	},
	parent: { "under5000": [
		{
			name: "Digital Photo Frame",
			desc: "WiFi frame that cycles family photos",
			why: "See loved ones every day",
			price: "₹2,000–4,000",
			tags: ["tech", "family"]
		},
		{
			name: "Massager Cushion",
			desc: "Heated neck/back massager pillow",
			why: "Comfort for everyday aches",
			price: "₹1,500–3,000",
			tags: ["health", "comfort"]
		},
		{
			name: "Subscription Box",
			desc: "Tea, snacks, or book subscription for 3 months",
			why: "Gift that keeps giving",
			price: "₹1,500–3,000",
			tags: ["food", "ongoing"]
		},
		{
			name: "Smart Light Bulb Set",
			desc: "Philips Hue or equivalent starter kit",
			why: "Smart home made easy",
			price: "₹2,500–4,500",
			tags: ["tech", "home"]
		}
	] }
};
var RECIPIENTS = [
	"friend",
	"partner",
	"parent",
	"sibling",
	"boss"
];
var BUDGETS = [
	"under500",
	"500-2000",
	"2000-5000"
];
function GiftGenerator() {
	const [recipient, setRecipient] = (0, import_react.useState)("friend");
	const [budget, setBudget] = (0, import_react.useState)("500-2000");
	const results = (0, import_react.useMemo)(() => {
		const byRecipient = GIFTS[recipient] || {};
		const direct = byRecipient[budget] || [];
		const all = Object.values(byRecipient).flat();
		return direct.length > 0 ? direct : all.slice(0, 6);
	}, [recipient, budget]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Gift Ideas",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🎁 Gift Idea Generator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Curated gift ideas by recipient, budget, and occasion. No AI — all hand-picked."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-medium text-foreground",
					children: "Recipient"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: RECIPIENTS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setRecipient(r),
						className: `rounded-lg border px-2.5 py-1 text-xs capitalize transition-colors ${recipient === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`,
						children: r
					}, r))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-medium text-foreground",
					children: "Budget"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: BUDGETS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setBudget(b),
						className: `rounded-lg border px-2.5 py-1 text-xs transition-colors ${budget === b ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`,
						children: b === "under500" ? "Under ₹500" : b === "500-2000" ? "₹500–2,000" : "₹2,000–5,000"
					}, b))
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: results.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold text-foreground",
								children: g.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground",
								children: g.price
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: g.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-[11px] text-primary",
							children: ["💡 ", g.why]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1",
							children: g.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-surface-elevated px-1.5 py-0.5 text-[9px] text-muted-foreground capitalize",
								children: t
							}, t))
						})
					]
				}, i))
			})]
		})]
	});
}
//#endregion
export { GiftGenerator as component };
