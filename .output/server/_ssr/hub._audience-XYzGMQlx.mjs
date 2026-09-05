import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Button } from "./slashkits-CB7bx4DD.mjs";
import { u as audienceResources } from "./resources-sbNg_EgT.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as EmptyState } from "./CommandGrid-DFmNY4E7.mjs";
import { t as ResourceCardEnhanced } from "./ResourceCardEnhanced-BCTymkiK.mjs";
import { t as Route } from "./hub._audience-v1UCoTCT.mjs";
import { i as INDIA_RESOURCES, n as FOUNDERS_RESOURCES, r as HEALTH_RESOURCES, t as FINANCE_RESOURCES } from "./hub-health-D6gjO23M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hub._audience-XYzGMQlx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HUB_SECTION_MAP = {
	students: [
		{
			icon: "🤖",
			title: "AI Study Tools",
			match: (r) => r.category === "AI Tools" || r.category === "AI Search" || r.category === "Free AI Chat"
		},
		{
			icon: "💻",
			title: "Free Courses",
			match: (r) => r.type === "Course" || r.category === "Courses"
		},
		{
			icon: "📚",
			title: "Learning Platforms & Roadmaps",
			match: (r) => r.type === "Tutorial" || r.type === "Cheat Sheet"
		},
		{
			icon: "🐙",
			title: "GitHub Resources",
			match: (r) => r.type === "GitHub"
		},
		{
			icon: "🛠️",
			title: "Student Tools",
			match: (r) => r.type === "Software" || r.type === "Website"
		},
		{
			icon: "🎬",
			title: "YouTube Channels",
			match: (r) => r.type === "YouTube"
		},
		{
			icon: "📖",
			title: "Free Reading & Wikis",
			match: (r) => r.type === "Wiki" || r.category === "Subreddits"
		},
		{
			icon: "💡",
			title: "Tips & Tricks",
			match: (r) => r.type === "Trick"
		}
	],
	developers: [
		{
			icon: "🤖",
			title: "AI Coding Tools",
			match: (r) => r.category === "AI Coding" || r.category === "AI Tools" || r.category === "Free AI Chat"
		},
		{
			icon: "🧠",
			title: "Local AI & Open Models",
			match: (r) => r.category === "Open Models" || r.category === "AI Models"
		},
		{
			icon: "📡",
			title: "Free APIs",
			match: (r) => r.type === "API"
		},
		{
			icon: "🐙",
			title: "GitHub Must-Haves",
			match: (r) => r.type === "GitHub"
		},
		{
			icon: "📚",
			title: "Developer Learning",
			match: (r) => r.type === "Course" || r.type === "Tutorial" || r.type === "Cheat Sheet"
		},
		{
			icon: "📖",
			title: "Docs & References",
			match: (r) => r.type === "Wiki" || r.type === "Website"
		},
		{
			icon: "🎬",
			title: "YouTube (Dev)",
			match: (r) => r.type === "YouTube"
		},
		{
			icon: "💬",
			title: "Communities",
			match: (r) => r.category === "Subreddits" || r.type === "Subreddit"
		}
	],
	creators: [
		{
			icon: "🤖",
			title: "AI Creative Tools",
			match: (r) => r.category === "AI Image" || r.category === "AI Video" || r.category === "AI Audio" || r.category === "AI Tools"
		},
		{
			icon: "🎨",
			title: "Design & Editing (Free)",
			match: (r) => r.category === "Image" || r.category === "Video" || r.category === "Audio"
		},
		{
			icon: "📸",
			title: "Free Stock & Assets",
			match: (r) => r.tags.includes("stock") || r.tags.includes("images") || r.tags.includes("photos")
		},
		{
			icon: "🎬",
			title: "YouTube (Creators)",
			match: (r) => r.type === "YouTube"
		},
		{
			icon: "✍️",
			title: "Writing & Content Tools",
			match: (r) => r.category === "Text" || r.category === "Productivity"
		},
		{
			icon: "🎵",
			title: "Free Music & Audio",
			match: (r) => r.type === "Software" && (r.tags.includes("music") || r.tags.includes("audio"))
		}
	],
	professionals: [
		{
			icon: "🤖",
			title: "AI Work Tools",
			match: (r) => r.category === "AI Tools" || r.category === "AI Coding"
		},
		{
			icon: "📝",
			title: "Productivity & Planning",
			match: (r) => r.category === "Productivity"
		},
		{
			icon: "📊",
			title: "Data & Analysis",
			match: (r) => r.type === "Dataset" || r.category.includes("Data")
		},
		{
			icon: "🎓",
			title: "Professional Learning",
			match: (r) => r.type === "Course"
		},
		{
			icon: "💼",
			title: "Career & Job Tools",
			match: (r) => r.category.includes("Resume") || r.category.includes("Job") || r.tags.includes("career")
		},
		{
			icon: "🎬",
			title: "YouTube (Professional)",
			match: (r) => r.type === "YouTube"
		}
	],
	founders: [
		{
			icon: "🤖",
			title: "AI Business Tools",
			match: (r) => r.category === "AI Tools" || r.category === "AI Research"
		},
		{
			icon: "🚀",
			title: "Startup Resources",
			match: (r) => r.tags.includes("startup") || r.tags.includes("business") || r.tags.includes("saas")
		},
		{
			icon: "📚",
			title: "Founder Learning",
			match: (r) => r.type === "Course" || r.type === "Tutorial"
		},
		{
			icon: "💰",
			title: "Finance & Payments",
			match: (r) => r.category === "Finance" || r.tags.includes("finance") || r.tags.includes("payments")
		},
		{
			icon: "🎬",
			title: "YouTube (Founders)",
			match: (r) => r.type === "YouTube"
		}
	],
	india: [
		{
			icon: "🤖",
			title: "AI Tools for India",
			match: (r) => r.category === "AI Tools" || r.category === "Free AI Chat"
		},
		{
			icon: "📡",
			title: "Indian APIs & Data",
			match: (r) => r.tags.includes("india") || r.tags.includes("indian")
		},
		{
			icon: "🎓",
			title: "Indian Courses & Platforms",
			match: (r) => r.type === "Course"
		},
		{
			icon: "🎬",
			title: "YouTube (India)",
			match: (r) => r.type === "YouTube"
		},
		{
			icon: "💼",
			title: "Indian Professional Tools",
			match: (r) => r.type === "Software" || r.type === "Website"
		}
	],
	finance: [
		{
			icon: "📊",
			title: "Stock & Crypto Tools",
			match: (r) => r.tags.includes("crypto") || r.tags.includes("stock") || r.tags.includes("trading")
		},
		{
			icon: "🤖",
			title: "AI Finance Tools",
			match: (r) => r.category === "AI Tools"
		},
		{
			icon: "📡",
			title: "Finance APIs",
			match: (r) => r.type === "API"
		},
		{
			icon: "🎓",
			title: "Financial Learning",
			match: (r) => r.type === "Course" || r.type === "Tutorial"
		},
		{
			icon: "🎬",
			title: "YouTube (Finance)",
			match: (r) => r.type === "YouTube"
		}
	],
	designers: [
		{
			icon: "🎨",
			title: "Design Tools",
			match: (r) => r.category === "Image" || r.category === "Video" || r.tags.includes("design")
		},
		{
			icon: "🤖",
			title: "AI Design Tools",
			match: (r) => r.category === "AI Image" || r.category === "AI Tools"
		},
		{
			icon: "📚",
			title: "Design Learning",
			match: (r) => r.type === "Course" || r.type === "Tutorial"
		},
		{
			icon: "🎬",
			title: "YouTube (Design)",
			match: (r) => r.type === "YouTube"
		}
	],
	health: [
		{
			icon: "🏃",
			title: "Fitness & Workout Tools",
			match: (r) => r.tags.includes("fitness") || r.tags.includes("workout") || r.tags.includes("exercise")
		},
		{
			icon: "🍎",
			title: "Nutrition & Diet",
			match: (r) => r.tags.includes("nutrition") || r.tags.includes("diet") || r.tags.includes("food")
		},
		{
			icon: "🤖",
			title: "AI Health Tools",
			match: (r) => r.category === "AI Tools"
		},
		{
			icon: "🎓",
			title: "Health Learning",
			match: (r) => r.type === "Course" || r.type === "Tutorial"
		}
	]
};
function HubPage() {
	const { hub } = Route.useLoaderData();
	const slug = hub.audience.toLowerCase();
	const dedicated = {
		founders: FOUNDERS_RESOURCES,
		india: INDIA_RESOURCES,
		finance: FINANCE_RESOURCES,
		health: HEALTH_RESOURCES
	}[slug];
	const allResources = dedicated ? dedicated.map((r) => ({
		...r,
		type: r.type,
		section: "resources",
		subcategory: r.category,
		audience: [hub.audience],
		platform: [],
		addedDate: "2026-08-27",
		lastUpdated: "2026-08-27",
		lastVerified: r.lastVerified,
		status: "Active",
		tags: r.tags
	})) : audienceResources(hub.audience);
	const sectionDefs = HUB_SECTION_MAP[slug] || [];
	const grouped = (0, import_react.useMemo)(() => {
		const sections = [];
		const matched = /* @__PURE__ */ new Set();
		for (const def of sectionDefs) {
			const items = allResources.filter((r) => {
				if (matched.has(r.id)) return false;
				const ok = def.match(r);
				if (ok) matched.add(r.id);
				return ok;
			});
			if (items.length > 0) sections.push({
				icon: def.icon,
				title: def.title,
				items
			});
		}
		const remaining = allResources.filter((r) => !matched.has(r.id));
		if (remaining.length > 0) sections.push({
			icon: "📦",
			title: "More Resources",
			items: remaining
		});
		return sections;
	}, [allResources, sectionDefs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: hub.title,
		back: {
			to: "/hub",
			label: "Hubs"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "page-enter pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-black tracking-tight text-foreground",
						children: hub.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: hub.blurb
					}),
					hub.collection && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/collections/$id",
							params: { id: hub.collection },
							children: "Matching commands"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [allResources.length, " resources"]
					})
				]
			}),
			slug === "professionals" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/tools/interview",
				className: "group mt-6 flex items-center gap-3 rounded-[10px] border border-primary/20 bg-primary/[0.04] p-4 transition-all duration-150 hover:border-primary/40 hover:bg-primary/[0.08]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-2xl",
						children: "🎤"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[15px] font-bold text-foreground group-hover:text-primary",
								children: "Mock Interview Simulator"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-[rgba(45,212,191,0.25)] bg-[rgba(45,212,191,0.08)] px-1.5 py-0.5 text-[9px] font-semibold text-primary",
								children: "Free"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-[13px] text-muted-foreground",
							children: "Practice real interview questions with instant feedback on your answers — no account needed."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-[15px] text-muted-foreground transition-colors group-hover:text-primary",
						children: "→"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: grouped.map((section, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: i > 0 ? "mt-7" : "",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hub-section-header",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[20px]",
								"aria-hidden": true,
								children: section.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "min-w-0 flex-1 text-[18px] font-semibold text-foreground",
								children: section.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-[12px] text-muted-foreground",
								children: [section.items.length, " resources"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-2",
						children: section.items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceCardEnhanced, { resource: r }, r.id))
					})]
				}, section.title))
			}),
			grouped.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No resources yet",
				hint: "Resources for this hub are being curated."
			})
		]
	});
}
//#endregion
export { HubPage as component };
