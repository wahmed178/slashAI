import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { I as useLibrary, S as getSlashTool, h as cn, n as Button } from "./slashkits-CB7bx4DD.mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { At as Layers, C as Tag, E as Sparkles, F as Settings, In as BookOpen, J as Radio, L as Search, Nn as Bot, P as Share2, Pn as Bookmark, Qt as Flame, Rn as Bell, Rt as House, _t as Map, a as Wrench, fn as Compass, i as X, it as NotebookPen, kt as LayoutGrid, mt as Menu, n as Zap, o as Workflow, on as Download, r as Youtube, tt as Palette, un as Cpu, x as Terminal, yn as CloudOff, zt as History } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-D5HnqCEQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
/** Tracks connectivity after hydration; SSR always assumes online. */
function useOnline() {
	const [online, setOnline] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const update = () => setOnline(navigator.onLine);
		update();
		window.addEventListener("online", update);
		window.addEventListener("offline", update);
		return () => {
			window.removeEventListener("online", update);
			window.removeEventListener("offline", update);
		};
	}, []);
	return online;
}
/**
* Full-width offline notice. Appears the moment the connection drops and
* auto-hides the moment it returns. Dismissing hides it for this session
* only — the next disconnect shows it again.
*/
function OfflineBanner() {
	const online = useOnline();
	const [dismissed, setDismissed] = (0, import_react.useState)(false);
	if (online || dismissed) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 border-b border-[rgba(210,153,34,0.3)] bg-[rgba(210,153,34,0.1)] px-4 py-2.5 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, {
				className: "size-4 shrink-0 text-[#d29922]",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "min-w-0 flex-1 text-[12.5px] text-foreground/90",
				children: "📴 You're offline — all 5,635 commands are still available. Live data is paused until you reconnect."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setDismissed(true),
				"aria-label": "Dismiss offline notice",
				className: "shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			})
		]
	});
}
var VISIT_KEY = "slashai-visits";
var DISMISS_KEY = "slashai-install-dismissed";
var SEEN_AFTER = 3;
function countVisit() {
	try {
		const n = Number(localStorage.getItem(VISIT_KEY) ?? "0") + 1;
		localStorage.setItem(VISIT_KEY, String(n));
		return n;
	} catch {
		return SEEN_AFTER;
	}
}
function InstallBanner() {
	const [deferred, setDeferred] = (0, import_react.useState)(null);
	const [hidden, setHidden] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		try {
			if (localStorage.getItem(DISMISS_KEY) === "1") return;
			if (window.matchMedia("(display-mode: standalone)").matches) return;
			if (countVisit() < SEEN_AFTER) return;
		} catch {
			return;
		}
		const onPrompt = (e) => {
			e.preventDefault();
			setDeferred(e);
			setHidden(false);
		};
		const onInstalled = () => setHidden(true);
		window.addEventListener("beforeinstallprompt", onPrompt);
		window.addEventListener("appinstalled", onInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", onPrompt);
			window.removeEventListener("appinstalled", onInstalled);
		};
	}, []);
	if (hidden || !deferred) return null;
	const install = async () => {
		try {
			await deferred.prompt();
			if ((await deferred.userChoice).outcome === "accepted") setHidden(true);
		} catch {}
		try {
			localStorage.setItem(DISMISS_KEY, "1");
		} catch {}
		setHidden(true);
	};
	const dismiss = () => {
		try {
			localStorage.setItem(DISMISS_KEY, "1");
		} catch {}
		setHidden(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 border-b border-[rgba(210,153,34,0.25)] bg-[rgba(210,153,34,0.08)] px-4 py-2.5 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
				className: "size-4 shrink-0 text-[#d29922]",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "min-w-0 flex-1 text-[12.5px] text-foreground/90",
				children: "Add SlashAI to your home screen for full offline access — all 5,635 commands stay available with no connection."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: install,
				className: "shrink-0 rounded-md border border-[rgba(210,153,34,0.45)] bg-[#d29922]/15 px-3 py-1.5 text-[12px] font-semibold text-[#e3b341] transition-colors hover:bg-[#d29922]/25",
				children: "Install"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: dismiss,
				"aria-label": "Dismiss install prompt",
				className: "shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			})
		]
	});
}
var NAV_ITEMS$1 = [
	{
		to: "/",
		label: "Home",
		icon: House,
		exact: true
	},
	{
		to: "/explore",
		label: "Commands",
		icon: Terminal
	},
	{
		to: "/trending",
		label: "Trending",
		icon: Flame,
		badge: "New"
	},
	{
		to: "/discover",
		label: "Discover",
		icon: Compass
	},
	{
		to: "/tools",
		label: "SlashKits",
		icon: Wrench
	},
	{
		to: "/ai-tools",
		label: "AI Tools",
		icon: Cpu,
		badge: "100+"
	},
	{
		to: "/hub",
		label: "Hubs",
		icon: LayoutGrid
	},
	{
		to: "/assistant",
		label: "AI Assistant",
		icon: Bot
	},
	{
		to: "/hunyuan",
		label: "Hunyuan AI",
		icon: Zap
	},
	{
		to: "/generators",
		label: "Generators",
		icon: Zap
	},
	{
		to: "/roadmaps",
		label: "Roadmaps",
		icon: Map
	},
	{
		to: "/workflow",
		label: "AI Workflows",
		icon: Workflow,
		badge: "New"
	},
	{
		to: "/live",
		label: "Live",
		icon: Radio,
		badge: "Hot"
	},
	{
		to: "/youtube",
		label: "YouTube",
		icon: Youtube
	},
	{
		to: "/quiz",
		label: "Daily Quiz",
		icon: Sparkles
	},
	{
		to: "/glossary",
		label: "Glossary",
		icon: BookOpen
	},
	{
		to: "/collections",
		label: "Collections",
		icon: Layers
	},
	{
		to: "/deals",
		label: "Deals",
		icon: Tag
	},
	{
		to: "/designs",
		label: "Designs",
		icon: Palette
	}
];
var SECONDARY_ITEMS$1 = [
	{
		to: "/journal",
		label: "Journal",
		icon: NotebookPen
	},
	{
		to: "/graph",
		label: "Knowledge Graph",
		icon: Share2,
		badge: "New"
	},
	{
		to: "/recent",
		label: "Recent",
		icon: History
	},
	{
		to: "/favorites",
		label: "Saved",
		icon: Bookmark
	},
	{
		to: "/me",
		label: "Profile & Settings",
		icon: Settings
	}
];
function isActive$1(pathname, to, exact) {
	if (exact) return pathname === to;
	if (to === "/hub") return pathname.startsWith("/hub");
	if (to === "/explore") return pathname.startsWith("/explore") || pathname.startsWith("/search") || pathname.startsWith("/find") || pathname.startsWith("/c/");
	if (to === "/discover") return pathname.startsWith("/discover") || pathname.startsWith("/r/") || pathname.startsWith("/whats-new") || pathname.startsWith("/radar");
	if (to === "/tools") return pathname.startsWith("/tools");
	return pathname.startsWith(to);
}
function DesktopSidebar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5 px-2 focus-visible:outline-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[22px]",
							children: "⚡"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[18px] font-bold text-foreground",
							children: "SlashAI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "ml-1 size-3.5 text-muted-foreground",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m6 9 6 6 6-6" })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-surface-elevated" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex-1 overflow-y-auto px-2 py-3 space-y-0.5",
				children: [
					NAV_ITEMS$1.map((item) => {
						const active = isActive$1(pathname, item.to, item.exact);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: `flex h-[36px] items-center gap-2.5 rounded-[6px] px-2.5 text-[13px] transition-all duration-150 ${active ? "bg-primary/10 text-foreground border-l-2 border-l-primary pl-2" : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground border-l-2 border-l-transparent pl-2"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
									className: `size-[18px] shrink-0 ${active ? "text-primary" : ""}`,
									strokeWidth: active ? 2.2 : 1.8
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									children: item.label
								}),
								item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none ${item.badge === "Hot" ? "bg-red-500 text-white" : "bg-primary text-background"}`,
									children: item.badge
								})
							]
						}, item.to);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 h-px bg-surface-elevated" }),
					SECONDARY_ITEMS$1.map((item) => {
						const active = isActive$1(pathname, item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: `flex h-[36px] items-center gap-2.5 rounded-[6px] px-2.5 text-[13px] transition-all duration-150 ${active ? "bg-primary/10 text-foreground border-l-2 border-l-primary pl-2" : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground border-l-2 border-l-transparent pl-2"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
									className: `size-[18px] shrink-0 ${active ? "text-primary" : ""}`,
									strokeWidth: active ? 2.2 : 1.8
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									children: item.label
								}),
								item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold leading-none text-background",
									children: item.badge
								})
							]
						}, item.to);
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 border-t border-sidebar-border px-3 py-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-background",
						children: "S"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[13px] text-foreground",
							children: "Slash User"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "No account · Local only"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/me",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4 shrink-0 text-muted-foreground hover:text-foreground transition-colors" })
					})
				]
			})
		]
	});
}
/** Shared nav items — same as DesktopSidebar */
var NAV_ITEMS = [
	{
		to: "/",
		label: "Home",
		icon: House,
		exact: true
	},
	{
		to: "/explore",
		label: "Commands",
		icon: Terminal
	},
	{
		to: "/trending",
		label: "Trending",
		icon: Flame,
		badge: "New"
	},
	{
		to: "/discover",
		label: "Discover",
		icon: Compass
	},
	{
		to: "/tools",
		label: "SlashKits",
		icon: Wrench
	},
	{
		to: "/ai-tools",
		label: "AI Tools",
		icon: Cpu,
		badge: "100+"
	},
	{
		to: "/hub",
		label: "Hubs",
		icon: LayoutGrid
	},
	{
		to: "/assistant",
		label: "AI Assistant",
		icon: Bot
	},
	{
		to: "/hunyuan",
		label: "Hunyuan AI",
		icon: Zap
	},
	{
		to: "/generators",
		label: "Generators",
		icon: Zap
	},
	{
		to: "/roadmaps",
		label: "Roadmaps",
		icon: Map
	},
	{
		to: "/live",
		label: "Live",
		icon: Radio,
		badge: "Hot"
	},
	{
		to: "/youtube",
		label: "YouTube",
		icon: Youtube
	},
	{
		to: "/quiz",
		label: "Daily Quiz",
		icon: Sparkles
	},
	{
		to: "/glossary",
		label: "Glossary",
		icon: BookOpen
	},
	{
		to: "/collections",
		label: "Collections",
		icon: Layers
	},
	{
		to: "/deals",
		label: "Deals",
		icon: Tag
	},
	{
		to: "/designs",
		label: "Designs",
		icon: Palette
	}
];
var SECONDARY_ITEMS = [
	{
		to: "/journal",
		label: "Journal",
		icon: NotebookPen
	},
	{
		to: "/graph",
		label: "Knowledge Graph",
		icon: Share2,
		badge: "New"
	},
	{
		to: "/recent",
		label: "Recent",
		icon: History
	},
	{
		to: "/favorites",
		label: "Saved",
		icon: Bookmark
	},
	{
		to: "/me",
		label: "Profile & Settings",
		icon: Settings
	}
];
/** mobile bottom bar — five essentials */
var PRIMARY = [
	{
		to: "/",
		label: "Home",
		icon: House,
		exact: true
	},
	{
		to: "/explore",
		label: "Commands",
		icon: Terminal,
		exact: false
	},
	{
		to: "/discover",
		label: "Discover",
		icon: Compass,
		exact: false
	},
	{
		to: "/tools",
		label: "SlashKits",
		icon: Wrench,
		exact: false
	},
	{
		to: "/hub",
		label: "Hubs",
		icon: LayoutGrid,
		exact: false
	}
];
function isActive(pathname, to, exact) {
	if (exact) return pathname === to;
	if (to === "/hub") return pathname.startsWith("/hub");
	if (to === "/explore") return pathname.startsWith("/explore") || pathname.startsWith("/search") || pathname.startsWith("/find") || pathname.startsWith("/c/");
	if (to === "/discover") return pathname.startsWith("/discover") || pathname.startsWith("/r/") || pathname.startsWith("/whats-new") || pathname.startsWith("/radar");
	if (to === "/tools") return pathname.startsWith("/tools");
	return pathname.startsWith(to);
}
var HUB_NAMES = {
	students: "Student Hub",
	developers: "Developer Hub",
	creators: "Creator Hub",
	professionals: "Professional Hub",
	founders: "Founders Hub",
	india: "India Hub",
	finance: "Finance Hub",
	designers: "Designers Hub",
	health: "Health Hub",
	islam: "Islam Hub",
	urdu: "Urdu Hub",
	arabic: "Arabic Hub"
};
var TOP_LEVEL_NAMES = {
	generators: {
		label: "Generators",
		to: "/generators"
	},
	roadmaps: {
		label: "Roadmaps",
		to: "/roadmaps"
	},
	glossary: {
		label: "Glossary",
		to: "/glossary"
	},
	quiz: {
		label: "Quiz",
		to: "/quiz"
	},
	deals: {
		label: "Deals",
		to: "/deals"
	},
	live: {
		label: "Live Dashboard",
		to: "/live"
	},
	"ai-tools": {
		label: "AI Tools",
		to: "/ai-tools"
	},
	workflow: {
		label: "AI Workflows",
		to: "/workflow"
	}
};
function humanize(slug) {
	return slug.split(/[-_]+/).filter(Boolean).map((w) => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ");
}
function breadcrumbsFor(pathname) {
	const segs = pathname.split("/").filter(Boolean);
	if (segs.length === 0) return null;
	const first = segs[0];
	if (first === "tools") {
		const tool = segs[1] ? getSlashTool(segs[1]) : void 0;
		if (!segs[1]) return [{
			label: "Home",
			to: "/"
		}, { label: "SlashKits" }];
		return [
			{
				label: "Home",
				to: "/"
			},
			{
				label: "SlashKits",
				to: "/tools"
			},
			{ label: tool?.name ?? humanize(segs[1]) }
		];
	}
	if (first === "hub") {
		if (!segs[1]) return [{
			label: "Home",
			to: "/"
		}, { label: "Hubs" }];
		return [
			{
				label: "Home",
				to: "/"
			},
			{
				label: "Hubs",
				to: "/hub"
			},
			{ label: HUB_NAMES[segs[1]] ?? humanize(segs[1]) }
		];
	}
	if (first === "c" && segs[1]) return [
		{
			label: "Home",
			to: "/"
		},
		{
			label: "Commands",
			to: "/explore"
		},
		{ label: `/${humanize(segs[1])}` }
	];
	if (first === "r") return [
		{
			label: "Home",
			to: "/"
		},
		{
			label: "Discover",
			to: "/discover"
		},
		{ label: "Resource" }
	];
	const top = TOP_LEVEL_NAMES[first];
	if (top && segs.length === 1) return [{
		label: "Home",
		to: "/"
	}, { label: top.label }];
	return null;
}
function Breadcrumbs({ pathname }) {
	const crumbs = breadcrumbsFor(pathname);
	if (!crumbs) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Breadcrumb",
		className: "mb-4 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-[12px] text-muted-foreground scrollbar-none",
		children: crumbs.map((c, i) => {
			const last = i === crumbs.length - 1;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5",
				children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					children: "›"
				}), c.to && !last ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: c.to,
					className: "transition-colors hover:text-foreground",
					children: c.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: last ? "text-foreground/80" : "",
					children: c.label
				})]
			}, `${c.label}-${i}`);
		})
	});
}
function DrawerNavList({ onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					onClick: onNavigate,
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[22px]",
						children: "⚡"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[18px] font-bold text-foreground",
						children: "SlashAI"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-surface-elevated" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex-1 overflow-y-auto px-2 py-3 space-y-0.5",
				children: [
					NAV_ITEMS.map((item) => {
						const active = isActive(pathname, item.to, item.exact);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							onClick: onNavigate,
							className: `flex h-[40px] items-center gap-2.5 rounded-[6px] px-2.5 text-[14px] transition-all duration-150 ${active ? "bg-primary/10 text-foreground border-l-2 border-l-primary pl-2" : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground border-l-2 border-l-transparent pl-2"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
									className: `size-[18px] shrink-0 ${active ? "text-primary" : ""}`,
									strokeWidth: active ? 2.2 : 1.8
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									children: item.label
								}),
								item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none ${item.badge === "Hot" ? "bg-red-500 text-white" : "bg-primary text-background"}`,
									children: item.badge
								})
							]
						}, item.to);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 h-px bg-surface-elevated" }),
					SECONDARY_ITEMS.map((item) => {
						const active = isActive(pathname, item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							onClick: onNavigate,
							className: `flex h-[40px] items-center gap-2.5 rounded-[6px] px-2.5 text-[14px] transition-all duration-150 ${active ? "bg-primary/10 text-foreground border-l-2 border-l-primary pl-2" : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground border-l-2 border-l-transparent pl-2"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
									className: `size-[18px] shrink-0 ${active ? "text-primary" : ""}`,
									strokeWidth: active ? 2.2 : 1.8
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									children: item.label
								}),
								item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold leading-none text-background",
									children: item.badge
								})
							]
						}, item.to);
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 border-t border-sidebar-border px-3 py-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-background",
						children: "S"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[13px] text-foreground",
							children: "Slash User"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "No account · Local only"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/me",
						onClick: onNavigate,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4 shrink-0 text-muted-foreground hover:text-foreground transition-colors" })
					})
				]
			})
		]
	});
}
function AppShell({ children, title, back, hideHeaderSearch, wide }) {
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { settings } = useLibrary();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full",
		style: { background: "var(--background)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesktopSidebar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: menuOpen,
				onOpenChange: setMenuOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "left",
					className: "w-[82vw] max-w-xs overflow-y-auto p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
						className: "sr-only",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Navigation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: "SlashAI navigation menu" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerNavList, { onNavigate: () => setMenuOpen(false) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
						className: "sticky top-0 z-30 border-b border-sidebar-border bg-[rgba(10,10,15,0.8)] backdrop-blur-[10px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-[52px] items-center gap-3 px-4 md:px-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "-ml-1 md:hidden",
									"aria-label": "Open menu",
									onClick: () => setMenuOpen(true),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/",
									className: "md:hidden flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[18px]",
										children: "⚡"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[16px] font-bold text-foreground",
										children: "SlashAI"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hidden md:flex flex-1 justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex h-[36px] w-[320px] items-center gap-2 rounded-[6px] border border-sidebar-border bg-surface px-3 transition-colors focus-within:border-primary",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-[14px] shrink-0 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												placeholder: "Search 5,635 commands...",
												className: "flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground",
												onFocus: () => window.location.href = "/search",
												readOnly: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-5 items-center rounded border border-border bg-surface-elevated px-1.5 font-mono text-[10px] text-muted-foreground",
												children: "⌘K"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ml-auto flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/changelog",
											className: "flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground",
											"aria-label": "Notifications & updates",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-[20px]" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/favorites",
											className: "flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground",
											"aria-label": "Saved items",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-[20px]" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/me",
											className: "flex size-8 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-background transition-opacity hover:opacity-90",
											"aria-label": "Profile",
											children: "S"
										})
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallBanner, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineBanner, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1 overflow-y-auto animate-slide-in-up",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full px-4 py-6 md:px-8 md:py-8 pb-28 md:pb-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { pathname }), children]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Primary",
				className: "fixed inset-x-0 bottom-0 z-30 flex border-t border-sidebar-border bg-[rgba(10,10,15,0.97)] pb-[env(safe-area-inset-bottom)] backdrop-blur-[10px] md:hidden",
				style: { height: "calc(56px + env(safe-area-inset-bottom))" },
				children: PRIMARY.map((item) => {
					const active = (() => {
						if (item.exact) return pathname === item.to;
						const p = item.to;
						if (p === "/hub") return pathname.startsWith("/hub");
						if (p === "/explore") return pathname.startsWith("/explore") || pathname.startsWith("/search") || pathname.startsWith("/find") || pathname.startsWith("/c/");
						if (p === "/discover") return pathname.startsWith("/discover") || pathname.startsWith("/r/") || pathname.startsWith("/whats-new") || pathname.startsWith("/radar") || pathname.startsWith("/deals");
						if (p === "/tools") return pathname.startsWith("/tools");
						return pathname.startsWith(p);
					})();
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: "ripple-press flex min-h-[56px] flex-1 flex-col items-center justify-center gap-[2px] text-[10px] font-medium transition-colors",
						style: { color: active ? "var(--primary)" : "var(--muted-foreground)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex flex-col items-center",
							children: [active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
								className: "size-[22px]",
								"aria-hidden": true,
								strokeWidth: active ? 2.4 : 1.8
							})]
						}), item.label]
					}, item.to);
				})
			})
		]
	});
}
//#endregion
export { SheetHeader as a, SheetDescription as i, Sheet as n, SheetTitle as o, SheetContent as r, AppShell as t };
