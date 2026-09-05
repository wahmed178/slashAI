import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/changelog-BDATRer8.js
var import_jsx_runtime = require_jsx_runtime();
var changelog_default = {
	version: "2.18.0",
	entries: [
		{
			"version": "2.18.0",
			"date": "2026-09-04",
			"changes": [
				"Removed the paid Glass tier app-wide — no upgrade prompts, no waitlist, every theme and design system is free",
				"Homepage clean-up: dead email-subscribe section removed, non-working 'More' chip removed, stats bar uses live counts with unique icons",
				"Homepage rebuilt with an 8-tool grid and a dedicated SlashKits preview section; footer rebuilt as 4 verified columns",
				"SlashKits: duplicates removed (regex-tester, diff-viewer, markdown-html2, duplicate JSON Formatter), Developer Utilities merged into Developer, dev tools moved out of Screens",
				"SlashKits: Health & Body (9 tools), Learning (6 tools) and Languages (5 tools) sections filled; clear category names",
				"Tool of the Day rotates daily on the homepage and /tools",
				"SlashKits search shows 'X tools found' and a helpful empty state",
				"Settings: all themes free, data-clearing buttons with item counts, language 'planned' placeholder removed",
				"Breadcrumbs added across SlashKits, hubs, commands, resources and top-level pages",
				"About page rewritten with accurate live counts",
				"Hub index now shows only real hubs with live resource counts (added Urdu and Arabic hubs)",
				"Discover search returns full-catalogue matches with a count",
				"Honest descriptions: Islamic baby names (50), temp-email note about Guerrilla Mail, age-of-things wording, fixed broken Urdu hub links"
			]
		},
		{
			"version": "2.17.0",
			"date": "2026-09-04",
			"changes": [
				"Rebuilt AI Tools Directory at /ai-tools with 100+ curated AI tools across 16 categories — writing, image, video, audio, coding, design, voice, marketing, data, automation, 3D, music and more",
				"Every tool shows pricing (Free / Freemium / Paid / Open Source), free-tier limits, tags and a one-click link to matching SlashAI commands",
				"Live search, category chips with counts, and 'Free first' sorting across the catalog",
				"Featured and Trending tool rows plus a daily Tool of the Day spotlight",
				"AI Tools added to the sidebar navigation and the homepage Explore grid"
			]
		},
		{
			"version": "2.16.0",
			"date": "2026-09-03",
			"changes": [
				"Document Scanner at /tools/scanner: capture pages with your camera or upload on desktop, enhance contrast/B&W, build multi-page documents and export as JPG or PDF",
				"Mock Interview Simulator at /tools/interview: 500+ questions by role, level and type — answer by voice or typing, get instant feedback on length, filler words, STAR coverage, keywords and pace",
				"Mock Interview ships with a PDF report download of your full session",
				"Website Analyser at /tools/analyze: free audit of any URL — PageSpeed mobile scores, security headers, SEO basics, social meta tags and tech-stack detection",
				"Personal Knowledge Graph at /graph: everything you saved (commands, resources, collections, journal notes) rendered as an interactive force graph with filters, search, zoom and hover tracing",
				"Knowledge Graph reachable from the sidebar and /favorites",
				"Offline upgrade: dismissible offline banner + 'Install SlashAI' prompt after 3 visits (full command library already cached offline by the service worker)"
			]
		},
		{
			"version": "2.15.0",
			"date": "2026-09-03",
			"changes": [
				"Command Intelligence Engine: SlashAI learns your copy/open/save habits on-device",
				"Search personalised: results blend your usage (70/30) after 20+ interactions, with a \"Based on your usage\" section",
				"\"Your most used\" section on the homepage — top 5 commands by personal score (appears after 10 interactions)",
				"Voice search everywhere: tap the mic in the homepage and search bars — English, Hindi, Arabic and Urdu",
				"AI Workflows at /workflow: chain commands into one copy-ready multi-step prompt",
				"Workflow builder: step picker with live command search, drag / arrow reorder, and per-step \"use output of previous step\" toggle",
				"Save and reload unlimited workflows on your device; estimated characters & tokens shown per chain"
			]
		},
		{
			"version": "2.14.0",
			"date": "2026-08-30",
			"changes": [
				"Global visual redesign: near-black navy background with electric cyan primary accent",
				"All hard-coded hex colors replaced with semantic CSS custom properties",
				"Dark theme refined: cooler background, darker sidebar, subtle ambient radial glow",
				"Consistent design system across all 33+ pages and components",
				"Sidebar, cards, inputs, buttons, toggles all use unified token system",
				"Light and AMOLED themes preserved with semantic overrides",
				"Improved contrast and readability with refined oklch color values"
			]
		},
		{
			"version": "2.13.0",
			"date": "2026-08-30",
			"changes": [
				"Complete layout redesign with persistent left sidebar navigation",
				"New top bar with centered search and notification icons",
				"Hero section: tagline pill, teal accent, 3D floating cube",
				"Stats bar: icon + number + label design",
				"Collections: unique border colors per collection",
				"SlashKits: 4-column list-row style with arrows",
				"Explore More: gradient cards with unique tints",
				"Newsletter section: email subscribe + floating mailbox",
				"New footer: minimal bottom bar with links",
				"Design system: teal accent (#2dd4bf), cooler background (#0a0a0f)",
				"Sidebar: upgrade to pro card, user indicator, hot/new badges"
			]
		},
		{
			"version": "2.12.0",
			"date": "2026-08-30",
			"changes": [
				"Homepage redesigned: static tagline, inline search bar, reduced clutter",
				"Stats bar: pure static JSX, guaranteed to show real numbers",
				"Intent chips reduced to 6 most universal options",
				"Tool grid reduced to 8 items, no duplicate icons",
				"Category links removed from homepage",
				"Your Week: better zero state with invite card",
				"Section headings: blue accent left bar visual anchor",
				"Ambient hero glow for premium feel",
				"Cards standardized: consistent bg, border, radius, hover states",
				"Mobile: 44px touch targets, safe area padding",
				"Footer: SlashKits added to Product section",
				"Keyboard shortcut styled as kbd element"
			]
		},
		{
			"version": "2.11.1",
			"date": "2026-08-28",
			"changes": [
				"Fixed deals page stuck on loading state",
				"Stats bar now shows real numbers with count-up animation",
				"Added /changelog page with version timeline",
				"Added /compare AI model comparison table",
				"Added /keyboard shortcuts reference page",
				"Deals page seeded with real Reddit deal data",
				"Bottom nav updated with SlashKits tab"
			]
		},
		{
			"version": "2.11.0",
			"date": "2026-08-28",
			"changes": [
				"AI Assistant with multi-provider API support (Google, Groq, OpenRouter, Together, DeepSeek, Mistral, Novita, HuggingFace)",
				"Daily Deals page from Indian Reddit communities",
				"22 free browser tools in SlashKits",
				"Daily Quiz with 24 categories",
				"Islam Hub with 53 resources",
				"Live ticker on homepage",
				"5-tab bottom navigation"
			]
		},
		{
			"version": "2.9.0",
			"date": "2026-08-20",
			"changes": [
				"Free Tools section launched (SlashKits)",
				"SIP, EMI, GST, BMI calculators added",
				"Flip Clock and Focus Screen screensavers",
				"World Clock with 12 cities",
				"Pomodoro timer with Web Audio chime"
			]
		},
		{
			"version": "2.8.0",
			"date": "2026-08-15",
			"changes": [
				"Daily Quiz launched with 24 categories",
				"Live ticker on homepage",
				"Islam Hub with 53 resources",
				"5-tab navigation"
			]
		},
		{
			"version": "2.7.0",
			"date": "2026-08-10",
			"changes": [
				"Build Ideas Library launched",
				"Idea Validator with AI scoring",
				"25 Founder Generators",
				"20 Founder Roadmaps"
			]
		},
		{
			"version": "2.0.0",
			"date": "2026-07-01",
			"changes": [
				"SlashAI rebuilt with TanStack Start",
				"5,635 AI commands indexed",
				"Live dashboard launched",
				"Hubs for Students, Developers, Creators, Professionals"
			]
		}
	]
};
function ChangelogPage() {
	const entries = changelog_default.entries || [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		hideHeaderSearch: true,
		title: "Changelog",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pt-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
						children: "Changelog"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm text-muted-foreground",
						children: "What's new in SlashAI — every feature, fix, and improvement."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative space-y-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[19px] top-0 bottom-0 w-px bg-border" }), entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex gap-5 pb-10 last:pb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative z-10 mt-1 flex shrink-0 items-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-[10px] rounded-full border-2 border-primary bg-background" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary",
									children: ["v", entry.version]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: entry.date
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1.5",
								children: entry.changes.map((change, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2 text-[13px] leading-relaxed text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1 shrink-0 rounded-full bg-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: change })]
								}, j))
							})]
						})]
					}, entry.version))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/about",
						className: "text-sm text-primary hover:underline",
						children: "About SlashAI →"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/keyboard",
						className: "text-sm text-primary hover:underline",
						children: "Keyboard shortcuts →"
					})]
				})
			]
		})
	});
}
//#endregion
export { ChangelogPage as component };
