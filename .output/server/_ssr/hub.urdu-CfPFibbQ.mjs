import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hub.urdu-CfPFibbQ.js
var import_jsx_runtime = require_jsx_runtime();
var RESOURCES = [
	{
		name: "Rekhta",
		desc: "World's largest free Urdu poetry collection",
		url: "https://rekhta.org",
		emoji: "📖",
		category: "Poetry"
	},
	{
		name: "Urdu Web Kosh",
		desc: "Online Urdu dictionary with word meanings",
		url: "https://urduwebkosh.com",
		emoji: "📕",
		category: "Dictionary"
	},
	{
		name: "Google Noto Nastaliq",
		desc: "Free Urdu font — best for Nastaliq script",
		url: "https://fonts.google.com/noto/specimen/Noto+Nastaliq+Urdu",
		emoji: "🔤",
		category: "Fonts"
	},
	{
		name: "Google Input Tools — Urdu",
		desc: "Type Urdu in your browser without an Urdu keyboard",
		url: "https://www.google.com/inputtools/try/",
		emoji: "⌨️",
		category: "Tools"
	},
	{
		name: "Rekhta Aamozish",
		desc: "Learn the Urdu script and poetry online, free",
		url: "https://www.rekhta.org/aamozish",
		emoji: "🎓",
		category: "Learning"
	},
	{
		name: "BBC Urdu",
		desc: "News and features in Urdu",
		url: "https://www.bbc.com/urdu",
		emoji: "📰",
		category: "News"
	},
	{
		name: "Voice of America — Urdu",
		desc: "Urdu news and current affairs",
		url: "https://www.voanews.com/urdu",
		emoji: "📻",
		category: "News"
	},
	{
		name: "HamariWeb Urdu",
		desc: "Urdu literature and resources",
		url: "https://hamariweb.com/urdu",
		emoji: "📚",
		category: "Literature"
	}
];
var POETS = [
	{
		name: "Mirza Ghalib",
		era: "1797–1869",
		known: "Ghazal master, Delhi Urdu",
		famous: "Hazaaron Khwahishen Aisi"
	},
	{
		name: "Allama Iqbal",
		era: "1877–1938",
		known: "Poet-philosopher of the East",
		famous: "Shikwa, Jawaab-e-Shikwa"
	},
	{
		name: "Faiz Ahmed Faiz",
		era: "1911–1984",
		known: "Progressive poetry, Lahore",
		famous: "Mujh Se Pehli Si Mohabbat"
	},
	{
		name: "Mir Taqi Mir",
		era: "1723–1810",
		known: "Father of Urdu poetry",
		famous: "Dikhai Diye Yun"
	},
	{
		name: "Ahmad Faraz",
		era: "1931–2008",
		known: "Modern romantic ghazal",
		famous: "Ranjish Hi Sahi"
	},
	{
		name: "Sahir Ludhianvi",
		era: "1921–1980",
		known: "Film lyrics + revolutionary verse",
		famous: "Chin Taashing"
	},
	{
		name: "Parveen Shakir",
		era: "1952–1994",
		known: "Modern women's Urdu poetry",
		famous: "Kuch Toh Majbooriyan"
	},
	{
		name: "Josh Malihabadi",
		era: "1894–1982",
		known: "Poet of revolution",
		famous: "Shola-o-Shabnam"
	}
];
var GHAZALS = [
	{
		poet: "Mirza Ghalib",
		verse: "Hazaaron khwahishen aisi ke har khwahish pe dam nikle\nBahut nikle mere armaan lekin phir bhi kam nikle"
	},
	{
		poet: "Faiz Ahmed Faiz",
		verse: "Mujh se pehli si mohabbat mere mehboob na maang\nMaine samjha tha ke ishq ke liye kuch nahi baaki"
	},
	{
		poet: "Ahmad Faraz",
		verse: "Ranjish hi sahi dil hi dukhaane ke liye aa\nAa phir se mujhe chhod ke jaane ke liye aa"
	},
	{
		poet: "Mir Taqi Mir",
		verse: "Dikhai diye yun ke bekhud kiya\nHamein aap se bhi juda kar chale"
	},
	{
		poet: "Allama Iqbal",
		verse: "Sitaron se aage jahan aur bhi hain\nAbhi ishq ke imtihan aur bhi hain"
	}
];
function UrduHub() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Urdu Writers Hub",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🇵🇰 Urdu Writers Hub"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Resources for Urdu language writers, poets, and readers. 400M+ Urdu speakers served."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-lg font-semibold text-foreground",
					children: "📚 Resources"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: RESOURCES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: r.url,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-primary/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl",
							children: r.emoji
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-foreground",
								children: r.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: r.desc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-surface-elevated px-1.5 py-0.5 text-[8px] text-muted-foreground",
								children: r.category
							})
						] })]
					}, r.name))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-lg font-semibold text-foreground",
					children: "✨ Famous Urdu Poets"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: POETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-muted-foreground",
								children: [
									p.era,
									" · ",
									p.known
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-primary",
								children: ["Famous: ", p.famous]
							})
						]
					}, p.name))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-lg font-semibold text-foreground",
					children: "🌹 Famous Ghazals"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: GHAZALS.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-xs font-medium text-primary",
							children: g.poet
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "whitespace-pre-wrap text-sm leading-relaxed text-foreground",
							style: {
								fontFamily: "'Noto Nastaliq Urdu', serif",
								direction: "rtl",
								textAlign: "right"
							},
							children: g.verse
						})]
					}, i))
				})] })
			]
		})]
	});
}
//#endregion
export { UrduHub as component };
