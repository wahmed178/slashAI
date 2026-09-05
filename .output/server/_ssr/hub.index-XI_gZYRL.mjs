import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { u as audienceResources } from "./resources-sbNg_EgT.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { It as IndianRupee, Kt as GraduationCap, Mn as Briefcase, W as Rocket, gn as Code, jt as Languages, nt as Paintbrush, qt as Globe, v as TrendingUp, w as Stethoscope } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { i as INDIA_RESOURCES, n as FOUNDERS_RESOURCES, r as HEALTH_RESOURCES, t as FINANCE_RESOURCES } from "./hub-health-D6gjO23M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hub.index-XI_gZYRL.js
var import_jsx_runtime = require_jsx_runtime();
var HUB_DEDICATED = {
	founders: {
		label: "Founders Hub",
		icon: Rocket,
		desc: "Validate, build, ship, grow — from idea to revenue",
		list: FOUNDERS_RESOURCES
	},
	india: {
		label: "India Hub",
		icon: IndianRupee,
		desc: "Free tools, courses and APIs for Indian builders",
		list: INDIA_RESOURCES
	},
	finance: {
		label: "Finance Hub",
		icon: TrendingUp,
		desc: "Investing, personal finance, and crypto tools",
		list: FINANCE_RESOURCES
	},
	health: {
		label: "Health Hub",
		icon: Stethoscope,
		desc: "Fitness, nutrition and wellbeing tools",
		list: HEALTH_RESOURCES
	}
};
var HUBS = [
	{
		audience: "students",
		label: "Student Hub",
		icon: GraduationCap,
		desc: "Courses, tools, and resources for learners",
		audienceKey: "Students"
	},
	{
		audience: "developers",
		label: "Developer Hub",
		icon: Code,
		desc: "APIs, tools, and tutorials for devs",
		audienceKey: "Developers"
	},
	{
		audience: "creators",
		label: "Creator Hub",
		icon: Paintbrush,
		desc: "Content creation tools and channels",
		audienceKey: "Creators"
	},
	{
		audience: "professionals",
		label: "Professional Hub",
		icon: Briefcase,
		desc: "Productivity tools for working professionals",
		audienceKey: "Professionals"
	},
	{
		audience: "founders",
		label: "Founders Hub",
		icon: Rocket,
		desc: "From idea to launch — free resources",
		dedicated: "founders"
	},
	{
		audience: "india",
		label: "India Hub",
		icon: IndianRupee,
		desc: "Free tools, courses and APIs for Indian builders",
		dedicated: "india"
	},
	{
		audience: "islam",
		label: "Islam Hub",
		icon: Globe,
		desc: "Quran, Hadith, prayer, learning and daily tools — all free",
		staticCount: 53
	},
	{
		audience: "urdu",
		label: "Urdu Hub",
		icon: Languages,
		desc: "Urdu poetry, dictionaries, fonts and learning",
		staticCount: 8
	},
	{
		audience: "arabic",
		label: "Arabic Hub",
		icon: Languages,
		desc: "Arabic alphabet, courses, keyboard and phrases",
		staticCount: 4,
		countLabel: "4 curated + alphabet"
	},
	{
		audience: "designers",
		label: "Designers Hub",
		icon: Paintbrush,
		desc: "Free design tools, assets and learning",
		audienceKey: "Designers"
	},
	{
		audience: "finance",
		label: "Finance Hub",
		icon: TrendingUp,
		desc: "Markets, crypto and money tools",
		dedicated: "finance"
	},
	{
		audience: "health",
		label: "Health Hub",
		icon: Stethoscope,
		desc: "Evidence-based health and fitness tools",
		dedicated: "health"
	}
];
function countFor(hub) {
	if (hub.dedicated) return HUB_DEDICATED[hub.dedicated].list.length;
	if (hub.audienceKey) return audienceResources(hub.audienceKey).length;
	return hub.staticCount ?? 0;
}
function HubIndexPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		hideHeaderSearch: true,
		title: "Hubs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "page-enter pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
				children: "Hubs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Role-based and language hubs with curated free resources — every link verified, nothing behind a paywall."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4",
			children: HUBS.map((hub) => {
				const Icon = hub.icon;
				const count = countFor(hub);
				const linkProps = [
					"islam",
					"urdu",
					"arabic"
				].includes(hub.audience) ? { to: `/hub/${hub.audience}` } : {
					to: "/hub/$audience",
					params: { audience: hub.audience }
				};
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					...linkProps,
					className: "group flex flex-col items-center rounded-[10px] border border-border bg-surface p-5 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-12 items-center justify-center rounded-xl bg-surface-elevated text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[16px] font-semibold text-foreground",
							children: hub.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-[13px] text-muted-foreground",
							children: hub.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-3 inline-flex items-center rounded border px-2 py-0.5 text-[11px]",
							style: {
								background: "var(--surface-elevated)",
								borderColor: "var(--border)",
								color: "var(--muted-foreground)"
							},
							children: hub.countLabel ?? `${count} resources`
						})
					]
				}, hub.audience);
			})
		})]
	});
}
//#endregion
export { HubIndexPage as component };
