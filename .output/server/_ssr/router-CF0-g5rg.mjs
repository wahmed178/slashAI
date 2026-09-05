import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { I as useLibrary, c as LibraryProvider, f as TOOL_SECTIONS, h as cn, i as CATEGORY_TREE, l as SLASH_TOOL_COUNT, m as VERIFIED_TOTAL, n as Button, s as LATEST_RELEASE } from "./slashkits-CB7bx4DD.mjs";
import { r as GLOSSARY_TOTAL } from "./glossary-CH5u11uF.mjs";
import { n as ROADMAP_TOTAL } from "./roadmaps-JDCJRZid.mjs";
import { c as RESOURCE_TOTAL } from "./resources-sbNg_EgT.mjs";
import { _ as useNavigate, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Sparkles, En as Check, i as X } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { s as IDEA_TOTAL } from "./build-ideas-u3AZgoYC.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route } from "./build-ideas._slug-BQipnQrN.mjs";
import { t as Route$217 } from "./c._slug-B_MoZEjQ.mjs";
import { t as Route$218 } from "./collections._id-BHaYYZ4i.mjs";
import { t as Route$219 } from "./discover._section-DLvscLXP.mjs";
import { t as Route$220 } from "./explore._category._subcategory-CoaBiaPn.mjs";
import { t as Route$221 } from "./explore._category.index-BvcIRnP_.mjs";
import { t as Route$222 } from "./find-SGMCI152.mjs";
import { t as Route$223 } from "./generators._id-C9x5K1Ji.mjs";
import { t as Route$224 } from "./hub._audience-v1UCoTCT.mjs";
import { t as Route$225 } from "./l._username-LpBmZ6-A.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$226 } from "./r._id-B-Bay6Ep.mjs";
import { t as Route$227 } from "./search-DaS_q2vw.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CF0-g5rg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-C10ciwDY.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
/**
* Single registrar for the offline app-shell service worker.
*
* Registration is refused in dev, inside iframes, in Lovable previews and when
* `?sw=off` is present — and in those cases any stale `/sw.js` registration is
* removed so the preview always serves fresh code.
*/
var BLOCKED_HOSTS = [
	"lovableproject.com",
	"lovableproject-dev.com",
	"beta.lovable.dev"
];
function isBlockedHost(hostname) {
	return BLOCKED_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`));
}
function shouldRegister() {
	if (typeof window === "undefined" || !("serviceWorker" in navigator)) return false;
	if (window.self !== window.top) return false;
	const { hostname, search } = window.location;
	if (hostname.startsWith("id-preview--") || hostname.startsWith("preview--")) return false;
	if (isBlockedHost(hostname)) return false;
	if (new URLSearchParams(search).has("sw") && new URLSearchParams(search).get("sw") === "off") return false;
	return true;
}
async function unregisterAppWorker() {
	if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
	const registrations = await navigator.serviceWorker.getRegistrations();
	await Promise.allSettled(registrations.filter((r) => (r.active?.scriptURL ?? r.installing?.scriptURL ?? "").endsWith("/sw.js")).map((r) => r.unregister()));
}
function registerServiceWorker() {
	if (!shouldRegister()) {
		unregisterAppWorker();
		return;
	}
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
	});
}
var SHORTCUTS = [
	{
		keys: "/",
		description: "Search commands"
	},
	{
		keys: "?",
		description: "Show this guide"
	},
	{
		keys: "G then H",
		description: "Go to Home"
	},
	{
		keys: "G then D",
		description: "Go to Discover"
	},
	{
		keys: "G then T",
		description: "Go to Trending"
	},
	{
		keys: "G then L",
		description: "Go to Live"
	},
	{
		keys: "Escape",
		description: "Close modal / drawer"
	}
];
function KeyboardShortcutsProvider({ children }) {
	const [showGuide, setShowGuide] = (0, import_react.useState)(false);
	const [pendingG, setPendingG] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const handleKey = (0, import_react.useCallback)((e) => {
		const target = e.target;
		if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
		if (e.key === "Escape") {
			setShowGuide(false);
			setPendingG(false);
			return;
		}
		if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
			e.preventDefault();
			setShowGuide(true);
			return;
		}
		if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
			e.preventDefault();
			navigate({ to: "/search" });
			return;
		}
		if (pendingG) {
			setPendingG(false);
			const route = {
				h: "/",
				d: "/discover",
				t: "/trending",
				l: "/live"
			}[e.key.toLowerCase()];
			if (route) {
				e.preventDefault();
				navigate({ to: route });
			}
			return;
		}
		if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey) {
			e.preventDefault();
			setPendingG(true);
			setTimeout(() => setPendingG(false), 1e3);
		}
	}, [navigate, pendingG]);
	(0, import_react.useEffect)(() => {
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [handleKey]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [children, showGuide && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutGuide, { onClose: () => setShowGuide(false) })] });
}
function ShortcutGuide({ onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center",
		onClick: onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "relative mx-4 w-full max-w-sm rounded-2xl border border-[#30363d] bg-[#161b22]/98 p-6 backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-sm font-semibold text-[#e6edf3]",
					children: "Keyboard Shortcuts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5",
					children: SHORTCUTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[13px] text-[#8b949e]",
							children: s.description
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "rounded-md border border-[#30363d] bg-[#21262d] px-2 py-0.5 font-mono text-[11px] text-[#8b949e]",
							children: s.keys
						})]
					}, s.keys))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "mt-5 w-full rounded-lg border border-[#30363d] bg-[#21262d] py-2 text-xs font-medium text-[#8b949e] transition-colors hover:text-[#e6edf3]",
					children: "Close"
				})
			]
		})]
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
/** Shown once after the app updates to a new version. */
function WhatsNewDialog() {
	const { showWhatsNew, dismissWhatsNew } = useLibrary();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: showWhatsNew,
		onOpenChange: (o) => !o && dismissWhatsNew(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							className: "size-5",
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-left",
						children: ["What's new — v", LATEST_RELEASE.version]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-left",
						children: LATEST_RELEASE.title
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "max-h-[45vh] pr-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2.5",
						children: LATEST_RELEASE.changes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2.5 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "mt-0.5 size-4 shrink-0 text-primary",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c })]
						}, c))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					onClick: dismissWhatsNew,
					children: "Got it"
				}) })
			]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$216 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "SlashAI" },
			{
				name: "description",
				content: "A searchable library of 1,200+ AI slash commands with copy-ready prompt templates."
			},
			{
				name: "author",
				content: "SlashAI"
			},
			{
				property: "og:title",
				content: "SlashAI"
			},
			{
				property: "og:description",
				content: "A searchable library of 1,200+ AI slash commands with copy-ready prompt templates."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			},
			{
				rel: "apple-touch-icon",
				href: "/icons/icon-192.png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `try{var t=localStorage.getItem('slashai-theme');var p=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='light'||(!t&&!p)){document.documentElement.classList.add('light')}var g=localStorage.getItem('slashai-glass-user');if(g==='true'){document.documentElement.classList.add('glass')}}catch(e){}` } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$216.useRouteContext();
	(0, import_react.useEffect)(() => {
		registerServiceWorker();
	}, []);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const prevPathname = (0, import_react.useRef)(pathname);
	(0, import_react.useEffect)(() => {
		if (prevPathname.current !== pathname) {
			window.scrollTo(0, 0);
			prevPathname.current = pathname;
		}
	}, [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(KeyboardShortcutsProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsNewDialog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "bottom-right" })
		] }) })
	});
}
var $$splitComponentImporter$205 = () => import("./routes-DBZcBJtC.mjs");
var Route$215 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: `SlashAI — find the right AI command in seconds` },
			{
				name: "description",
				content: `A calm, searchable library of ${VERIFIED_TOTAL} AI slash commands. Search by what you want to accomplish, save favourites and work offline.`
			},
			{
				property: "og:title",
				content: "SlashAI — AI slash command library"
			},
			{
				property: "og:description",
				content: `Search ${VERIFIED_TOTAL} copy-ready AI slash commands by task, category or collection. Free forever, no account needed.`
			},
			{
				name: "theme-color",
				content: "#12161c"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "SlashAI"
			}
		],
		links: [{
			rel: "manifest",
			href: "/manifest.webmanifest"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$205, "component")
});
var $$splitComponentImporter$204 = () => import("./about-CnZsabyn.mjs");
var Route$214 = createFileRoute("/about")({
	head: () => ({ meta: [{ title: "About — SlashAI" }, {
		name: "description",
		content: "What SlashAI is, what you get free, how it works, and what it's built with."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$204, "component")
});
var $$splitComponentImporter$203 = () => import("./ai-tools-qNf7Cm66.mjs");
var Route$213 = createFileRoute("/ai-tools")({
	head: () => ({ meta: [
		{ title: "AI Tools Directory — 100+ Free & Freemium Tools — SlashAI" },
		{
			name: "description",
			content: "Discover 100+ curated AI tools with real free tiers. Browse writing, image, video, coding, design, voice, marketing and more tools in one directory."
		},
		{
			property: "og:title",
			content: "AI Tools Directory — SlashAI"
		},
		{
			property: "og:description",
			content: "100+ curated AI tools with genuinely usable free tiers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$203, "component")
});
var $$splitComponentImporter$202 = () => import("./alternatives-DdmAS_OQ.mjs");
var Route$212 = createFileRoute("/alternatives")({
	head: () => ({ meta: [
		{ title: "Free alternatives to paid software | SlashAI" },
		{
			name: "description",
			content: "Free and open-source stand-ins for popular paid tools, with the licence model stated and no claims of feature parity."
		},
		{
			property: "og:title",
			content: "Free alternatives — SlashAI"
		},
		{
			property: "og:description",
			content: "Open-source and free-tier replacements for common paid software."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$202, "component")
});
var $$splitComponentImporter$201 = () => import("./assistant-ByBHmZzT.mjs");
var Route$211 = createFileRoute("/assistant")({
	head: () => ({ meta: [{ title: "SlashAI Assistant" }, {
		name: "description",
		content: "AI assistant with free API providers. Your key stays on your device."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$201, "component")
});
var $$splitComponentImporter$200 = () => import("./changelog-BDATRer8.mjs");
var Route$210 = createFileRoute("/changelog")({
	head: () => ({ meta: [{ title: "Changelog — SlashAI" }, {
		name: "description",
		content: "What's new in SlashAI — every feature, fix, and improvement."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$200, "component")
});
var $$splitComponentImporter$199 = () => import("./compare-BqovJDXk.mjs");
var Route$209 = createFileRoute("/compare")({
	head: () => ({ meta: [{ title: "AI Model Comparison 2026 — SlashAI" }, {
		name: "description",
		content: "Side-by-side comparison of the best AI models available today — free and paid."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$199, "component")
});
var $$splitComponentImporter$198 = () => import("./contact-BTeETCPt.mjs");
var Route$208 = createFileRoute("/contact")({
	head: () => ({ meta: [{ title: "Contact — SlashAI" }, {
		name: "description",
		content: "Get in touch with the SlashAI team — feedback, bugs, feature requests, or just say hello."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$198, "component")
});
var $$splitComponentImporter$197 = () => import("./deals-CmGJWlDL.mjs");
var Route$207 = createFileRoute("/deals")({
	head: () => ({ meta: [{ title: "Deals & Products — SlashAI" }, {
		name: "description",
		content: "Best deals from Indian communities — updated daily."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$197, "component")
});
var $$splitComponentImporter$196 = () => import("./designs-DQ9JZtTR.mjs");
var Route$206 = createFileRoute("/designs")({
	head: () => ({ meta: [{ title: "Designs — SlashAI" }, {
		name: "description",
		content: "Complete design systems for SlashAI — Linear, Notion, Vercel, Stripe, Supabase and Framer. Apply any one instantly, free."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$196, "component")
});
var $$splitComponentImporter$195 = () => import("./favorites-CLmORm-v.mjs");
var Route$205 = createFileRoute("/favorites")({
	head: () => ({ meta: [
		{ title: "Favorites — SlashAI" },
		{
			name: "description",
			content: "The AI slash commands you saved on this device."
		},
		{
			property: "og:title",
			content: "Favorites — SlashAI"
		},
		{
			property: "og:description",
			content: "Your saved SlashAI commands, kept on-device."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$195, "component")
});
var $$splitComponentImporter$194 = () => import("./glass-BX5_8XQx.mjs");
var Route$204 = createFileRoute("/glass")({
	head: () => ({ meta: [{ title: "SlashAI" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$194, "component")
});
/**
* The paid "Glass" tier no longer exists — every feature is free.
* Redirect anywhere pointing at the old waitlist page back home.
*/
var $$splitComponentImporter$193 = () => import("./glossary-DGhZFonk.mjs");
var Route$203 = createFileRoute("/glossary")({
	head: () => ({ meta: [
		{ title: `AI glossary — ${GLOSSARY_TOTAL} terms in plain English | SlashAI` },
		{
			name: "description",
			content: `${GLOSSARY_TOTAL} AI terms explained simply — LLMs, RAG, fine-tuning, agents, safety and shipping. No jargon walls.`
		},
		{
			property: "og:title",
			content: "AI Glossary — SlashAI"
		},
		{
			property: "og:description",
			content: "Every AI term a builder runs into, explained in one read each."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$193, "component")
});
var $$splitComponentImporter$192 = () => import("./graph-CUo8LAVK.mjs");
var Route$202 = createFileRoute("/graph")({
	head: () => ({ meta: [{ title: "Your Knowledge Graph — see how saved items connect | SlashAI" }, {
		name: "description",
		content: "A visual graph of everything you saved on SlashAI — commands, resources, collections and journal notes — connected by category and use."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$192, "component")
});
var $$splitComponentImporter$191 = () => import("./hunyuan-DMX81t8d.mjs");
var Route$201 = createFileRoute("/hunyuan")({
	head: () => ({ meta: [{ title: "Tencent Hunyuan AI — Free Chat | SlashAI" }, {
		name: "description",
		content: "Chat with Tencent's Hy4 Preview and other flagship models via TokenHub API. Free trial credits available."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$191, "component")
});
var $$splitComponentImporter$190 = () => import("./journal-gf5pkxwU.mjs");
var Route$200 = createFileRoute("/journal")({
	head: () => ({ meta: [
		{ title: "Build journal & achievements — SlashAI" },
		{
			name: "description",
			content: "Log your build progress day by day, keep your streak alive, and unlock achievements as you copy, save and ship."
		},
		{
			property: "og:title",
			content: "Build journal — SlashAI"
		},
		{
			property: "og:description",
			content: "A local-first build-in-public journal with streaks and achievement badges."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$190, "component")
});
var $$splitComponentImporter$189 = () => import("./keyboard-iDhtHO3s.mjs");
var Route$199 = createFileRoute("/keyboard")({
	head: () => ({ meta: [{ title: "Keyboard Shortcuts — SlashAI" }, {
		name: "description",
		content: "Every keyboard shortcut available across SlashAI."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$189, "component")
});
var $$splitComponentImporter$188 = () => import("./live-CIT1804v.mjs");
var Route$198 = createFileRoute("/live")({
	head: () => ({ meta: [
		{ title: "Live — markets, news, weather, prayers & space | SlashAI" },
		{
			name: "description",
			content: "One live dashboard: NIFTY & SENSEX, crypto prices, forex rates, India headlines, weather, air quality, prayer times with Hijri date, cricket, football and the ISS — all free, no sign-in."
		},
		{
			property: "og:title",
			content: "Live — markets, news, weather & more | SlashAI"
		},
		{
			property: "og:description",
			content: "Live Indian markets, crypto, forex, India news, weather, AQI, prayer times and space data in one calm dashboard."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$188, "component")
});
/** 60 s refresh while NSE/BSE are open (Mon–Fri, 09:15–15:30 IST); off otherwise. */
var $$splitComponentImporter$187 = () => import("./me-C-VsW127.mjs");
var Route$197 = createFileRoute("/me")({
	head: () => ({ meta: [
		{ title: "Profile & Settings — SlashAI" },
		{
			name: "description",
			content: "Your persona, interests, streak, theme, layout, backup and saved commands — all stored on this device."
		},
		{
			property: "og:title",
			content: "Profile & Settings — SlashAI"
		},
		{
			property: "og:description",
			content: "Personalise SlashAI: persona, interests, theme, layout and more."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$187, "component")
});
var $$splitComponentImporter$186 = () => import("./movies-CkDNrFf7.mjs");
var Route$196 = createFileRoute("/movies")({
	head: () => ({ meta: [
		{ title: "Regional movie finder — India, Pakistan & neighbours | SlashAI" },
		{
			name: "description",
			content: "Find Hindi, Telugu, Tamil, Malayalam, Pakistani, Bangladeshi, Nepali and Sri Lankan films, then jump straight to legal streaming pages that actually play them."
		},
		{
			property: "og:title",
			content: "Regional movie finder — India, Pakistan & neighbours | SlashAI"
		},
		{
			property: "og:description",
			content: "Search South Asian cinema and open legal watch pages in one tap."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$186, "component")
});
/** Legal, region-aware places to actually watch a title. */
var $$splitComponentImporter$185 = () => import("./play-Dd9m-0iX.mjs");
var Route$195 = createFileRoute("/play")({
	head: () => ({ meta: [
		{ title: "Play — quick games & decision makers | SlashAI" },
		{
			name: "description",
			content: "Bored? Flip a coin, roll dice, spin a decision wheel or hit the Surprise me button to land on a random AI command."
		},
		{
			property: "og:title",
			content: "Play — quick games & decision makers | SlashAI"
		},
		{
			property: "og:description",
			content: "Coin toss, dice, decision wheel and a Surprise me button, all inside SlashAI."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$185, "component")
});
/** Big tactile action button: press-scale, glow, sound + haptics. */
var $$splitComponentImporter$184 = () => import("./privacy-DCddL2zd.mjs");
var Route$194 = createFileRoute("/privacy")({
	head: () => ({ meta: [{ title: "Privacy Policy — SlashAI" }, {
		name: "description",
		content: "SlashAI's privacy policy — what we collect, how we use it, and your rights."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$184, "component")
});
var $$splitComponentImporter$183 = () => import("./quiz-DuXeVmXD.mjs");
var Route$193 = createFileRoute("/quiz")({
	head: () => ({ meta: [{ title: "Daily Quiz — SlashAI" }, {
		name: "description",
		content: "Test your knowledge with daily trivia quizzes across 24 categories. Fresh questions every day."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$183, "component")
});
var $$splitComponentImporter$182 = () => import("./radar-DATZOQ9q.mjs");
var Route$192 = createFileRoute("/radar")({
	head: () => ({ meta: [
		{ title: "Free Radar — new free tools, offers and courses | SlashAI" },
		{
			name: "description",
			content: "Newly spotted free AI tools, student offers, open-source projects and free courses, each with the conditions stated plainly."
		},
		{
			property: "og:title",
			content: "Free Radar — SlashAI"
		},
		{
			property: "og:description",
			content: "Free finds with honest eligibility and a verification date."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$182, "component")
});
var $$splitComponentImporter$181 = () => import("./recent-DzQSrLZn.mjs");
var Route$191 = createFileRoute("/recent")({
	head: () => ({ meta: [
		{ title: "Recently used — SlashAI" },
		{
			name: "description",
			content: "The AI slash commands you opened most recently."
		},
		{
			property: "og:title",
			content: "Recently used — SlashAI"
		},
		{
			property: "og:description",
			content: "Pick up where you left off in SlashAI."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$181, "component")
});
var $$splitComponentImporter$180 = () => import("./roadmaps-CVM1Ui_o.mjs");
var Route$190 = createFileRoute("/roadmaps")({
	head: () => ({ meta: [
		{ title: `Founder roadmaps — ${ROADMAP_TOTAL} visual paths | SlashAI` },
		{
			name: "description",
			content: "Step-by-step founder roadmaps: validate an idea in 14 days, ship an MVP in 30, get your first 100 users, learn AI engineering, prep fundraising and launch like a pro."
		},
		{
			property: "og:title",
			content: "Founder Roadmaps — SlashAI"
		},
		{
			property: "og:description",
			content: "Visual, phase-by-phase paths for the journeys every builder repeats."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$180, "component")
});
var $$splitComponentImporter$179 = () => import("./settings-CJE6b-bb.mjs");
var Route$189 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Settings — SlashAI" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$179, "component")
});
var $$splitComponentImporter$178 = () => import("./terms-63Mi79Ql.mjs");
var Route$188 = createFileRoute("/terms")({
	head: () => ({ meta: [{ title: "Terms of Service — SlashAI" }, {
		name: "description",
		content: "SlashAI's terms of service — rules for using the app, disclaimers, and your responsibilities."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$178, "component")
});
var $$splitComponentImporter$177 = () => import("./tools-C4Lwg4-D.mjs");
var Route$187 = createFileRoute("/tools")({ component: lazyRouteComponent($$splitComponentImporter$177, "component") });
var $$splitComponentImporter$176 = () => import("./trending-oTmCS6zN.mjs");
var Route$186 = createFileRoute("/trending")({
	head: () => ({ meta: [{ title: "Trending on SlashAI" }, {
		name: "description",
		content: "What people are copying, saving and building with right now — commands, resources, generators, roadmaps, glossary."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$176, "component")
});
var $$splitComponentImporter$175 = () => import("./whats-new-BfPibMAz.mjs");
var Route$185 = createFileRoute("/whats-new")({
	head: () => ({ meta: [
		{ title: "What's new — weekly finds and app updates | SlashAI" },
		{
			name: "description",
			content: "Weekly free finds, monthly resource drops, special collections and the SlashAI app changelog in one place."
		},
		{
			property: "og:title",
			content: "What's new — SlashAI"
		},
		{
			property: "og:description",
			content: "Weekly, monthly and yearly curated drops plus release notes."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$175, "component")
});
var $$splitComponentImporter$174 = () => import("./workflow-BWPADbv2.mjs");
var Route$184 = createFileRoute("/workflow")({
	head: () => ({ meta: [
		{ title: "AI Workflows — chain commands — SlashAI" },
		{
			name: "description",
			content: "Build a step-by-step AI workflow by chaining SlashAI commands into one copy-ready prompt. Save, reorder and reuse your chains — all on your device."
		},
		{
			property: "og:title",
			content: "AI Workflows — SlashAI"
		},
		{
			property: "og:description",
			content: "Chain commands into one runnable prompt — no account, free forever."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$174, "component")
});
/** One step's block inside the chained prompt. */
var $$splitComponentImporter$173 = () => import("./youtube-qRW15OZ4.mjs");
var Route$183 = createFileRoute("/youtube")({
	head: () => ({ meta: [
		{ title: "YouTube hub — search videos & music | SlashAI" },
		{
			name: "description",
			content: "Search YouTube videos and music from inside SlashAI and play them in a smooth, distraction-free embedded player. Free, no sign-in."
		},
		{
			property: "og:title",
			content: "YouTube hub — search videos & music | SlashAI"
		},
		{
			property: "og:description",
			content: "A calm YouTube search and player for videos and music, built into SlashAI."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$173, "component")
});
var $$splitComponentImporter$172 = () => import("./assistant.about-CIeRTRWi.mjs");
var Route$182 = createFileRoute("/assistant/about")({
	head: () => ({ meta: [{ title: "How SlashAI Assistant Works" }, {
		name: "description",
		content: "Learn how the SlashAI assistant works with free AI providers."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$172, "component")
});
var $$splitComponentImporter$171 = () => import("./build-ideas.index-DTYkwEOb.mjs");
var Route$181 = createFileRoute("/build-ideas/")({
	head: () => ({ meta: [
		{ title: `${IDEA_TOTAL} startup ideas you can actually build | SlashAI` },
		{
			name: "description",
			content: `Browse ${IDEA_TOTAL} researched product ideas with the problem, target users, MVP scope, tech stack, pricing and a first-10-customers plan for each one.`
		},
		{
			property: "og:title",
			content: "Build Ideas Library — SlashAI"
		},
		{
			property: "og:description",
			content: "Researched product ideas with MVP scope, monetization and acquisition plans — free to browse, offline ready."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$171, "component")
});
var $$splitComponentImporter$170 = () => import("./build-ideas.projects-BJQhacGz.mjs");
var Route$180 = createFileRoute("/build-ideas/projects")({
	head: () => ({ meta: [
		{ title: "My projects — saved ideas and build tracker | SlashAI" },
		{
			name: "description",
			content: "Your saved build ideas and projects, tracked from idea to launch with notes — stored on your device, no account needed."
		},
		{
			property: "og:title",
			content: "My projects — SlashAI"
		},
		{
			property: "og:description",
			content: "Track saved ideas from idea to launch, on-device and offline."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$170, "component")
});
var $$splitComponentImporter$169 = () => import("./build-ideas.validate-B1Dx9t-H.mjs");
var Route$179 = createFileRoute("/build-ideas/validate")({
	head: () => ({ meta: [
		{ title: "Idea validator — score your startup idea in seconds | SlashAI" },
		{
			name: "description",
			content: "Describe your idea and get a structured read on problem clarity, competition, monetization potential, build difficulty and differentiation."
		},
		{
			property: "og:title",
			content: "Idea Validator — SlashAI"
		},
		{
			property: "og:description",
			content: "A structured second opinion on your idea before you spend a weekend building it."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$169, "component")
});
var $$splitComponentImporter$168 = () => import("./collections.index-C4kGSSHI.mjs");
var Route$178 = createFileRoute("/collections/")({
	head: () => ({ meta: [
		{ title: "Collections — SlashAI" },
		{
			name: "description",
			content: "Curated, use-case based sets of AI slash commands for students, creators, professionals, entrepreneurs and everyday life."
		},
		{
			property: "og:title",
			content: "Collections — SlashAI"
		},
		{
			property: "og:description",
			content: "Curated starting points into the SlashAI command catalog."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$168, "component")
});
var $$splitComponentImporter$167 = () => import("./discover.index-DobHvFB5.mjs");
var Route$177 = createFileRoute("/discover/")({
	head: () => ({ meta: [
		{ title: "Discover — AI tools, APIs, courses, channels | SlashAI" },
		{
			name: "description",
			content: `Explore ${RESOURCE_TOTAL}+ free tools, APIs, courses, and channels — curated for builders, developers and creators.`
		},
		{
			property: "og:title",
			content: "Discover — SlashAI"
		},
		{
			property: "og:description",
			content: "Curated tools, APIs, courses for builders."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$167, "component")
});
var $$splitComponentImporter$166 = () => import("./discover.reels-C0_s6n28.mjs");
var Route$176 = createFileRoute("/discover/reels")({
	head: () => ({ meta: [{ title: "Reels — SlashAI Viral Prompts" }, {
		name: "description",
		content: "Swipe through viral AI prompts in a TikTok-style full-screen feed. Copy, save, and try instantly."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$166, "component")
});
var $$splitComponentImporter$165 = () => import("./explore.index-Bng04-NO.mjs");
var Route$175 = createFileRoute("/explore/")({
	head: () => ({ meta: [
		{ title: "Commands — SlashAI" },
		{
			name: "description",
			content: `Browse ${VERIFIED_TOTAL} AI slash commands across ${CATEGORY_TREE.length} categories. Copy any command and paste it into ChatGPT, Claude or Gemini.`
		},
		{
			property: "og:title",
			content: "Commands — SlashAI"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$165, "component")
});
/** Each command gets a one-line description so users know exactly what it does */
/** Command card — shows name + description, copies on click */
var $$splitComponentImporter$164 = () => import("./generators.index-Cp1B4fxr.mjs");
var Route$174 = createFileRoute("/generators/")({
	head: () => ({ meta: [
		{ title: "25 Free AI Generators for Founders — SlashAI" },
		{
			name: "description",
			content: "25 free AI-powered generators for startup work: business names, MVP plans, pitch decks, cold emails, job descriptions and more. 5/day free."
		},
		{
			property: "og:title",
			content: "Founder AI Toolkit — SlashAI"
		},
		{
			property: "og:description",
			content: "25 free Claude-powered generators for startup work."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$164, "component")
});
var $$splitComponentImporter$163 = () => import("./hub.index-XI_gZYRL.mjs");
var Route$173 = createFileRoute("/hub/")({
	head: () => ({ meta: [{ title: "Hubs — SlashAI" }, {
		name: "description",
		content: "Role-based and language hubs with curated free resources."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$163, "component")
});
var $$splitComponentImporter$162 = () => import("./hub.arabic-DtXEq11-.mjs");
var Route$172 = createFileRoute("/hub/arabic")({
	head: () => ({ meta: [{ title: "Arabic Learners Hub — Free Resources | SlashAI" }, {
		name: "description",
		content: "Free Arabic learning resources: alphabet chart, courses, keyboard, grammar, and common phrases."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$162, "component")
});
var $$splitComponentImporter$161 = () => import("./hub.islam-CX84ap0k.mjs");
var Route$171 = createFileRoute("/hub/islam")({
	head: () => ({ meta: [
		{ title: "Islam Hub — Quran, Hadith, prayer, learning & daily tools | SlashAI" },
		{
			name: "description",
			content: "Free, authentic Islamic resources — Quran, Hadith, prayer, learning and daily tools. Everything here is completely free."
		},
		{
			property: "og:title",
			content: "Islam Hub — SlashAI"
		},
		{
			property: "og:description",
			content: "Free, authentic Islamic resources — Quran, Hadith, prayer, learning and daily tools."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$161, "component")
});
var $$splitComponentImporter$160 = () => import("./hub.quotes-CrgPnviD.mjs");
var Route$170 = createFileRoute("/hub/quotes")({
	head: () => ({ meta: [{ title: "Curated Quotes — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$160, "component")
});
var $$splitComponentImporter$159 = () => import("./hub.urdu-CfPFibbQ.mjs");
var Route$169 = createFileRoute("/hub/urdu")({ component: lazyRouteComponent($$splitComponentImporter$159, "component") });
var $$splitComponentImporter$158 = () => import("./tools.index-C7K62LDa.mjs");
var Route$168 = createFileRoute("/tools/")({
	head: () => ({ meta: [{ title: `SlashKits — ${SLASH_TOOL_COUNT} free browser tools | SlashAI` }, {
		name: "description",
		content: `SlashKits: ${SLASH_TOOL_COUNT} free browser tools — image compress, calculators, noise, tasbeeh, timers, screensavers. No upload, no account.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$158, "component")
});
[...TOOL_SECTIONS.map((s) => s.title)];
var $$splitComponentImporter$157 = () => import("./tools.age-calculator-Cyu7j3j8.mjs");
var Route$167 = createFileRoute("/tools/age-calculator")({
	head: () => ({ meta: [{ title: "Age Calculator — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$157, "component")
});
var $$splitComponentImporter$156 = () => import("./tools.age-of-things-DBAlbzhb.mjs");
var Route$166 = createFileRoute("/tools/age-of-things")({ component: lazyRouteComponent($$splitComponentImporter$156, "component") });
var $$splitComponentImporter$155 = () => import("./tools.alphabet-cipher-8x6rFf0q.mjs");
var Route$165 = createFileRoute("/tools/alphabet-cipher")({ component: lazyRouteComponent($$splitComponentImporter$155, "component") });
var $$splitComponentImporter$154 = () => import("./tools.analyze-CslSidXE.mjs");
var Route$164 = createFileRoute("/tools/analyze")({
	head: () => ({ meta: [{ title: "Website Analyser — free SEO, speed & security audit | SlashAI" }, {
		name: "description",
		content: "Paste any URL for a free instant audit: PageSpeed scores, security headers, SEO basics, social meta tags and tech-stack detection. No sign-up, no API key."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$154, "component")
});
/** crude but honest fingerprinting from raw HTML — no external service needed */
var $$splitComponentImporter$153 = () => import("./tools.api-tester-DPCxNN_g.mjs");
var Route$163 = createFileRoute("/tools/api-tester")({ component: lazyRouteComponent($$splitComponentImporter$153, "component") });
var Route$162 = createFileRoute("/tools/arabic-keyboard")({ component: ArabicKeyboard });
var arabicLayout = [
	[
		"ض",
		"ص",
		"ث",
		"ق",
		"ف",
		"غ",
		"ع",
		"ه",
		"خ",
		"ح",
		"ج",
		"ش"
	],
	[
		"س",
		"ي",
		"ب",
		"ل",
		"ا",
		"ت",
		"ن",
		"م",
		"ك",
		"ط"
	],
	[
		"ئ",
		"ء",
		"ؤ",
		"ر",
		"ل",
		"ى",
		"ة",
		"و",
		"ز",
		"ظ"
	]
];
var romanMap = {
	a: "ا",
	b: "ب",
	t: "ت",
	th: "ث",
	j: "ج",
	"7": "ح",
	kh: "خ",
	d: "د",
	"dh": "ذ",
	r: "ر",
	z: "ز",
	s: "س",
	sh: "ش",
	"'": "ع",
	gh: "غ",
	f: "ف",
	q: "ق",
	k: "ك",
	l: "ل",
	m: "م",
	n: "ن",
	h: "ه",
	w: "و",
	y: "ي",
	"2": "ء"
};
var harakat = [
	"َ",
	"ُ",
	"ِ",
	"ْ",
	"ّ",
	"ً",
	"ٌ",
	"ٍ"
];
var harakatNames = [
	"Fathah",
	"Kasrah",
	"Dammah",
	"Sukun",
	"Shadda",
	"Tanwin Fath",
	"Tanwin Damm",
	"Tanwin Kasr"
];
var phrases = [
	"بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
	"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
	"سُبْحَانَ اللَّه",
	"لَا إِلَهَ إِلَّا اللَّهُ",
	"اللَّهُ أَكْبَرُ",
	"إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
	"أَسْتَغْفِرُ اللَّه",
	"لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّه",
	"مَا شَاءَ اللَّه",
	"جَزَاكَ اللَّهُ خَيْرًا",
	"رَحِمَهُ اللَّه",
	"اللَّهُمَّ صَلِّ عَلَى مُحَمَّد"
];
function ArabicKeyboard() {
	const [text, setText] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("visual");
	const [showPhrases, setShowPhrases] = (0, import_react.useState)(false);
	const [fontSize, setFontSize] = (0, import_react.useState)(24);
	const insertChar = (0, import_react.useCallback)((char) => {
		setText((prev) => prev + char);
	}, []);
	const insertHarakat = (0, import_react.useCallback)((h) => {
		setText((prev) => prev + h);
	}, []);
	const insertPhrase = (0, import_react.useCallback)((p) => {
		setText((prev) => prev + (prev ? "\n" : "") + p);
	}, []);
	const handleRomanInput = (e) => {
		const val = e.target.value;
		let arabic = "";
		let i = 0;
		while (i < val.length) {
			let found = false;
			for (const len of [
				3,
				2,
				1
			]) {
				const chunk = val.slice(i, i + len).toLowerCase();
				if (romanMap[chunk]) {
					arabic += romanMap[chunk];
					i += len;
					found = true;
					break;
				}
			}
			if (!found) {
				arabic += val[i];
				i++;
			}
		}
		setText(arabic);
	};
	const downloadPNG = () => {
		const canvas = document.createElement("canvas");
		canvas.width = 800;
		canvas.height = 200;
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = "#161b22";
		ctx.fillRect(0, 0, 800, 200);
		ctx.fillStyle = "#f0f6fc";
		ctx.font = `${fontSize * 1.5}px serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		text.split("\n").forEach((line, i) => {
			ctx.fillText(line, 400, 60 + i * 60, 750);
		});
		const link = document.createElement("a");
		link.download = "arabic-text.png";
		link.href = canvas.toDataURL("image/png");
		link.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 lg:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "⌨️ Arabic Keyboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Type in Arabic without an Arabic keyboard"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1 rounded-xl bg-surface p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("visual"),
						className: `flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${mode === "visual" ? "bg-primary text-background" : "text-muted-foreground"}`,
						children: "Visual Keyboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("roman"),
						className: `flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${mode === "roman" ? "bg-primary text-background" : "text-muted-foreground"}`,
						children: "Romanized Input"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						dir: "rtl",
						className: "min-h-[120px] rounded-lg bg-background p-4 text-foreground focus:outline-none",
						style: {
							fontSize,
							lineHeight: 1.8,
							direction: "rtl",
							textAlign: "right"
						},
						children: text || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground/50",
							children: "اكتب هنا..."
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Size:"
						}), [
							{
								label: "S",
								value: 16
							},
							{
								label: "M",
								value: 24
							},
							{
								label: "L",
								value: 36
							},
							{
								label: "XL",
								value: 48
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFontSize(s.value),
							className: `rounded px-2 py-1 text-xs ${fontSize === s.value ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`,
							children: s.label
						}, s.label))]
					})]
				}),
				mode === "roman" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-sm font-semibold text-foreground",
							children: "Romanized Input"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs text-muted-foreground",
							children: "Type in English letters → converts to Arabic"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							onChange: handleRomanInput,
							placeholder: "Type: bismillah → بسم الله",
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1",
							children: Object.entries(romanMap).slice(0, 20).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded bg-background px-1.5 py-0.5 text-xs text-muted-foreground",
								children: [
									k,
									"→",
									v
								]
							}, k))
						})
					]
				}),
				mode === "visual" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-2",
					children: [arabicLayout.map((row, ri) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center gap-1",
						children: row.map((letter) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => insertChar(letter),
							className: "flex h-11 w-11 items-center justify-center rounded-lg bg-background text-lg font-medium text-foreground transition-colors hover:bg-primary/20 active:bg-primary/30",
							children: letter
						}, letter))
					}, ri)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap justify-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 flex items-center text-xs text-muted-foreground",
							children: "Diacritics:"
						}), harakat.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => insertHarakat(h),
							className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-lg text-primary transition-colors hover:bg-primary/20",
							title: harakatNames[i],
							children: h
						}, h))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => navigator.clipboard?.writeText(text),
							className: "flex-1 rounded-xl border border-border bg-surface py-2.5 text-sm text-foreground hover:bg-background",
							children: "📋 Copy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setText(""),
							className: "flex-1 rounded-xl border border-border bg-surface py-2.5 text-sm text-foreground hover:bg-background",
							children: "🗑 Clear"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: downloadPNG,
							disabled: !text,
							className: "flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
							children: "⬇ PNG"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowPhrases(!showPhrases),
						className: "flex w-full items-center justify-between p-4 text-sm font-semibold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📖 Common Islamic Phrases" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: showPhrases ? "▲" : "▼"
						})]
					}), showPhrases && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1 px-4 pb-4",
						children: phrases.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => insertPhrase(p),
							className: "w-full rounded-lg bg-background p-3 text-right text-lg text-foreground transition-colors hover:bg-primary/10",
							dir: "rtl",
							children: p
						}, p))
					})]
				})
			]
		})
	});
}
var $$splitComponentImporter$152 = () => import("./tools.ascii-9FJQ7q7Y.mjs");
var Route$161 = createFileRoute("/tools/ascii")({
	head: () => ({ meta: [{ title: "ASCII Art Generator — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$152, "component")
});
var $$splitComponentImporter$151 = () => import("./tools.aspect-DGRG2bZW.mjs");
var Route$160 = createFileRoute("/tools/aspect")({ component: lazyRouteComponent($$splitComponentImporter$151, "component") });
var $$splitComponentImporter$150 = () => import("./tools.base64-TfSgswNQ.mjs");
var Route$159 = createFileRoute("/tools/base64")({ component: lazyRouteComponent($$splitComponentImporter$150, "component") });
var $$splitComponentImporter$149 = () => import("./tools.binary-calculator-Cef3XXoc.mjs");
var Route$158 = createFileRoute("/tools/binary-calculator")({ component: lazyRouteComponent($$splitComponentImporter$149, "component") });
var $$splitComponentImporter$148 = () => import("./tools.bio-CV-SpGCw.mjs");
var Route$157 = createFileRoute("/tools/bio")({ component: lazyRouteComponent($$splitComponentImporter$148, "component") });
var $$splitComponentImporter$147 = () => import("./tools.bmi-calculator-BrbYM_20.mjs");
var Route$156 = createFileRoute("/tools/bmi-calculator")({
	head: () => ({ meta: [{ title: "BMI Calculator — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$147, "component")
});
var $$splitComponentImporter$146 = () => import("./tools.bmi-calculator2-BG4Ro_d6.mjs");
var Route$155 = createFileRoute("/tools/bmi-calculator2")({ component: lazyRouteComponent($$splitComponentImporter$146, "component") });
var $$splitComponentImporter$145 = () => import("./tools.bmi-chart-BHfWrRra.mjs");
var Route$154 = createFileRoute("/tools/bmi-chart")({ component: lazyRouteComponent($$splitComponentImporter$145, "component") });
var $$splitComponentImporter$144 = () => import("./tools.border-radius-NXhiDGhw.mjs");
var Route$153 = createFileRoute("/tools/border-radius")({ component: lazyRouteComponent($$splitComponentImporter$144, "component") });
var $$splitComponentImporter$143 = () => import("./tools.box-shadow-BW2YxxuO.mjs");
var Route$152 = createFileRoute("/tools/box-shadow")({ component: lazyRouteComponent($$splitComponentImporter$143, "component") });
var $$splitComponentImporter$142 = () => import("./tools.budget-Cxl-0XZl.mjs");
var Route$151 = createFileRoute("/tools/budget")({
	head: () => ({ meta: [{ title: "Monthly Budget Tracker — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$142, "component")
});
var Route$150 = createFileRoute("/tools/calorie")({ component: CalorieTracker });
var STORAGE_KEY$2 = "slashai-calorie-log";
var SETTINGS_KEY$1 = "slashai-calorie-settings";
var defaultGoals = {
	calories: 2e3,
	protein: 150,
	carbs: 250,
	fat: 65
};
var mealTypes = [
	"Sehri / Breakfast",
	"Lunch",
	"Iftar / Dinner",
	"Snack"
];
function CalorieTracker() {
	const [entries, setEntries] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY$2) || "[]");
		} catch {
			return [];
		}
	});
	const [goals, setGoals] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem(SETTINGS_KEY$1) || JSON.stringify(defaultGoals));
		} catch {
			return defaultGoals;
		}
	});
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [searchResults, setSearchResults] = (0, import_react.useState)([]);
	const [showAdd, setShowAdd] = (0, import_react.useState)(false);
	const [newFood, setNewFood] = (0, import_react.useState)({
		name: "",
		calories: 0,
		protein: 0,
		carbs: 0,
		fat: 0,
		meal: mealTypes[0]
	});
	(0, import_react.useEffect)(() => {
		localStorage.setItem(STORAGE_KEY$2, JSON.stringify(entries));
	}, [entries]);
	(0, import_react.useEffect)(() => {
		localStorage.setItem(SETTINGS_KEY$1, JSON.stringify(goals));
	}, [goals]);
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0] ?? (/* @__PURE__ */ new Date()).toLocaleDateString();
	const todayEntries = entries.filter((e) => e.date === today);
	const totals = todayEntries.reduce((acc, e) => ({
		cal: acc.cal + e.calories,
		pro: acc.pro + e.protein,
		carb: acc.carb + e.carbs,
		fat: acc.fat + e.fat
	}), {
		cal: 0,
		pro: 0,
		carb: 0,
		fat: 0
	});
	const pct = (val, goal) => Math.min(100, val / goal * 100);
	const searchFood = async (q) => {
		setSearchQuery(q);
		if (q.length < 2) {
			setSearchResults([]);
			return;
		}
		try {
			const data = await (await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&json=1&fields=product_name,nutriments&page_size=8`)).json();
			setSearchResults((data.products || []).map((p) => ({
				name: String(p.product_name || "Unknown"),
				calories: Math.round(Number(p.nutriments?.["energy-kcal_100g"]) || 0),
				protein: Math.round(Number(p.nutriments?.proteins_100g) || 0),
				carbs: Math.round(Number(p.nutriments?.carbohydrates_100g) || 0),
				fat: Math.round(Number(p.nutriments?.fat_100g) || 0)
			})).filter((f) => f.name !== "Unknown"));
		} catch {
			setSearchResults([]);
		}
	};
	const addFromSearch = (food) => {
		const entry = {
			id: Date.now().toString(),
			...food,
			meal: newFood.meal,
			date: today
		};
		setEntries((prev) => [entry, ...prev]);
	};
	const addManual = () => {
		if (!newFood.name || !newFood.calories) return;
		const entry = {
			id: Date.now().toString(),
			...newFood,
			date: today
		};
		setEntries((prev) => [entry, ...prev]);
		setNewFood({
			name: "",
			calories: 0,
			protein: 0,
			carbs: 0,
			fat: 0,
			meal: mealTypes[0] ?? "Sehri / Breakfast"
		});
		setShowAdd(false);
	};
	const deleteEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));
	const Ring = ({ value, goal, color, label }) => {
		const p = pct(value, goal);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-20 w-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 36 36",
						className: "h-full w-full -rotate-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "18",
							cy: "18",
							r: "16",
							fill: "none",
							stroke: "#21262d",
							strokeWidth: "3"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "18",
							cy: "18",
							r: "16",
							fill: "none",
							stroke: color,
							strokeWidth: "3",
							strokeDasharray: `${p} ${100 - p}`,
							strokeLinecap: "round"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold text-foreground",
							children: Math.round(value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 text-xs text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[10px] text-muted-foreground/60",
					children: [
						Math.round(p),
						"% of ",
						goal
					]
				})
			]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 lg:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-foreground",
						children: "🥗 Calorie & Macro Tracker"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Track daily calories and macros — no account needed"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowAdd(!showAdd),
						className: "rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-background hover:opacity-90",
						children: "+ Add Food"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-surface p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-around",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
								value: totals.cal,
								goal: goals.calories,
								color: "#3fb950",
								label: "Calories"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
								value: totals.pro,
								goal: goals.protein,
								color: "#58a6ff",
								label: "Protein"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
								value: totals.carb,
								goal: goals.carbs,
								color: "#d29922",
								label: "Carbs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
								value: totals.fat,
								goal: goals.fat,
								color: "#f85149",
								label: "Fat"
							})
						]
					})
				}),
				showAdd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-foreground",
							children: "Search Food (Open Food Facts)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: searchQuery,
							onChange: (e) => searchFood(e.target.value),
							placeholder: "Search food name...",
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
						}),
						searchResults.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1 max-h-48 overflow-y-auto",
							children: searchResults.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => addFromSearch(f),
								className: "flex w-full items-center justify-between rounded-lg bg-background p-2 text-left text-xs text-foreground hover:bg-primary/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate flex-1",
									children: f.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 text-muted-foreground",
									children: [
										f.calories,
										"cal | P:",
										f.protein,
										"g C:",
										f.carbs,
										"g F:",
										f.fat,
										"g"
									]
								})]
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: mealTypes.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setNewFood((f) => ({
									...f,
									meal: m
								})),
								className: `flex-1 rounded-lg px-2 py-1.5 text-xs ${newFood.meal === m ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`,
								children: m.split(" /")[0]
							}, m))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-foreground",
							children: "Or Add Manually"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-5 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: newFood.name,
									onChange: (e) => setNewFood((f) => ({
										...f,
										name: e.target.value
									})),
									placeholder: "Food name",
									className: "col-span-5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									placeholder: "Cal",
									value: newFood.calories || "",
									onChange: (e) => setNewFood((f) => ({
										...f,
										calories: Number(e.target.value)
									})),
									className: "rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									placeholder: "Protein",
									value: newFood.protein || "",
									onChange: (e) => setNewFood((f) => ({
										...f,
										protein: Number(e.target.value)
									})),
									className: "rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									placeholder: "Carbs",
									value: newFood.carbs || "",
									onChange: (e) => setNewFood((f) => ({
										...f,
										carbs: Number(e.target.value)
									})),
									className: "rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									placeholder: "Fat",
									value: newFood.fat || "",
									onChange: (e) => setNewFood((f) => ({
										...f,
										fat: Number(e.target.value)
									})),
									className: "rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: addManual,
									disabled: !newFood.name,
									className: "rounded-lg bg-primary px-2 py-1.5 text-xs font-semibold text-background disabled:opacity-40",
									children: "Add"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 text-sm font-semibold text-foreground",
						children: "Daily Goals"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-2",
						children: [
							{
								key: "calories",
								label: "Calories",
								color: "#3fb950"
							},
							{
								key: "protein",
								label: "Protein (g)",
								color: "#58a6ff"
							},
							{
								key: "carbs",
								label: "Carbs (g)",
								color: "#d29922"
							},
							{
								key: "fat",
								label: "Fat (g)",
								color: "#f85149"
							}
						].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 text-xs",
							style: { color: g.color },
							children: g.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: goals[g.key],
							onChange: (e) => setGoals((prev) => ({
								...prev,
								[g.key]: Number(e.target.value)
							})),
							className: "w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
						})] }, g.key))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "mb-3 text-sm font-semibold text-foreground",
						children: [
							"Today's Log (",
							todayEntries.length,
							" items)"
						]
					}), todayEntries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-4 text-center text-sm text-muted-foreground",
						children: "No food logged today"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1 max-h-60 overflow-y-auto",
						children: todayEntries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg bg-background px-3 py-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-primary",
									children: e.meal.split(" /")[0]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 truncate text-foreground",
									children: e.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 text-xs text-muted-foreground",
									children: [
										e.calories,
										"cal | P:",
										e.protein,
										"g"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => deleteEntry(e.id),
									className: "ml-2 text-red-400",
									children: "✕"
								})
							]
						}, e.id))
					})]
				})
			]
		})
	});
}
var $$splitComponentImporter$141 = () => import("./tools.calorie-calc-DflffJ57.mjs");
var Route$149 = createFileRoute("/tools/calorie-calc")({ component: lazyRouteComponent($$splitComponentImporter$141, "component") });
var Route$148 = createFileRoute("/tools/certificate")({ component: CertificateGenerator });
var templates$1 = [
	{
		id: "classic",
		name: "Classic",
		bg: "#fffef7",
		text: "#1a1a1a",
		accent: "#d29922",
		border: "#d29922"
	},
	{
		id: "modern",
		name: "Modern",
		bg: "#0d1117",
		text: "#f0f6fc",
		accent: "#58a6ff",
		border: "#30363d"
	},
	{
		id: "islamic",
		name: "Islamic",
		bg: "#0a1a0a",
		text: "#f0f6fc",
		accent: "#3fb950",
		border: "#d29922"
	}
];
var certTypes = [
	"Completion",
	"Achievement",
	"Participation",
	"Appreciation",
	"Excellence"
];
function CertificateGenerator() {
	const [recipient, setRecipient] = (0, import_react.useState)("Ahmed Khan");
	const [certType, setCertType] = (0, import_react.useState)("Completion");
	const [course, setCourse] = (0, import_react.useState)("Advanced Web Development");
	const [issuedBy, setIssuedBy] = (0, import_react.useState)("SlashAI Academy");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [sigName, setSigName] = (0, import_react.useState)("Dr. Sarah Ahmed");
	const [sigTitle, setSigTitle] = (0, import_react.useState)("Director of Education");
	const [templateIdx, setTemplateIdx] = (0, import_react.useState)(0);
	const canvasRef = (0, import_react.useRef)(null);
	const tpl = templates$1[templateIdx];
	const draw = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		const W = 2480;
		const H = 1754;
		canvas.width = W;
		canvas.height = H;
		ctx.fillStyle = tpl.bg;
		ctx.fillRect(0, 0, W, H);
		ctx.strokeStyle = tpl.border;
		ctx.lineWidth = 16;
		ctx.strokeRect(60, 60, 2360, 1634);
		ctx.strokeStyle = tpl.border;
		ctx.lineWidth = 4;
		ctx.strokeRect(90, 90, 2300, 1574);
		[
			[100, 100],
			[2380, 100],
			[100, 1654],
			[2380, 1654]
		].forEach(([cx, cy]) => {
			if (cx === void 0 || cy === void 0) return;
			ctx.fillStyle = tpl.accent;
			ctx.beginPath();
			ctx.arc(cx, cy, 12, 0, Math.PI * 2);
			ctx.fill();
		});
		if (templateIdx === 2) {
			ctx.strokeStyle = tpl.accent + "30";
			ctx.lineWidth = 2;
			for (let i = 0; i < 20; i++) {
				const y = 120 + i * 80;
				ctx.beginPath();
				ctx.moveTo(120, y);
				for (let x = 120; x < 2360; x += 40) ctx.quadraticCurveTo(x + 20, y + 20, x + 40, y);
				ctx.stroke();
			}
		}
		ctx.fillStyle = tpl.accent;
		ctx.font = "bold 90px Georgia, serif";
		ctx.textAlign = "center";
		ctx.fillText("CERTIFICATE", W / 2, 280);
		ctx.fillStyle = tpl.text;
		ctx.font = "50px Georgia, serif";
		ctx.fillText(`OF ${certType.toUpperCase()}`, W / 2, 370);
		ctx.strokeStyle = tpl.accent;
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(W / 2 - 200, 400);
		ctx.lineTo(1440, 400);
		ctx.stroke();
		ctx.fillStyle = tpl.text + "aa";
		ctx.font = "40px sans-serif";
		ctx.fillText("This is to certify that", W / 2, 520);
		ctx.fillStyle = tpl.text;
		ctx.font = `bold ${recipient.length > 20 ? 70 : 90}px Georgia, serif`;
		ctx.fillText(recipient || "Recipient Name", W / 2, 660);
		const nameW = ctx.measureText(recipient || "Recipient Name").width;
		ctx.strokeStyle = tpl.accent;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(W / 2 - nameW / 2 - 20, 680);
		ctx.lineTo(W / 2 + nameW / 2 + 20, 680);
		ctx.stroke();
		ctx.fillStyle = tpl.text + "cc";
		ctx.font = "38px sans-serif";
		ctx.fillText("has successfully completed", W / 2, 760);
		ctx.fillStyle = tpl.text;
		ctx.font = "bold 56px Georgia, serif";
		ctx.fillText(course || "Course Name", W / 2, 840);
		ctx.fillStyle = tpl.text + "aa";
		ctx.font = "36px sans-serif";
		const dateStr = new Date(date ?? "").toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
		ctx.fillText(`Awarded on ${dateStr}`, W / 2, 960);
		ctx.fillStyle = tpl.text + "cc";
		ctx.font = "32px sans-serif";
		ctx.fillText(`Issued by: ${issuedBy || "Organization"}`, W / 2, 1040);
		ctx.strokeStyle = tpl.text + "40";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(W / 2 - 200, 1350);
		ctx.lineTo(1440, 1350);
		ctx.stroke();
		ctx.fillStyle = tpl.text;
		ctx.font = "bold 36px sans-serif";
		ctx.fillText(sigName || "Signatory Name", W / 2, 1400);
		ctx.fillStyle = tpl.text + "aa";
		ctx.font = "28px sans-serif";
		ctx.fillText(sigTitle || "Title", W / 2, 1440);
		ctx.strokeStyle = tpl.text + "40";
		ctx.beginPath();
		ctx.moveTo(W / 2 - 700, 1350);
		ctx.lineTo(W / 2 - 300, 1350);
		ctx.stroke();
		ctx.fillStyle = tpl.text;
		ctx.font = "bold 32px sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(issuedBy || "Organization", W / 2 - 500, 1400);
		ctx.fillStyle = tpl.text + "aa";
		ctx.font = "24px sans-serif";
		ctx.fillText("Issuing Authority", W / 2 - 500, 1440);
		ctx.fillStyle = tpl.accent;
		ctx.font = "28px sans-serif";
		ctx.fillText(`Certificate #${Date.now().toString(36).toUpperCase()}`, W / 2, 1600);
		ctx.textAlign = "left";
	}, [
		recipient,
		certType,
		course,
		issuedBy,
		date,
		sigName,
		sigTitle,
		tpl,
		templateIdx
	]);
	(0, import_react.useEffect)(() => {
		draw();
	}, [draw]);
	const download = (fmt) => {
		if (!canvasRef.current) return;
		const link = document.createElement("a");
		link.download = `certificate-${recipient.replace(/\s+/g, "-").toLowerCase()}.${fmt}`;
		link.href = canvasRef.current.toDataURL(fmt === "jpg" ? "image/jpeg" : "image/png", .95);
		link.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 lg:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "🏆 Certificate Generator"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Create beautiful certificates in seconds"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[420px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold text-foreground",
									children: "Certificate Details"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: recipient,
									onChange: (e) => setRecipient(e.target.value),
									placeholder: "Recipient Name",
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: certType,
									onChange: (e) => setCertType(e.target.value),
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
									children: certTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: t,
										children: t
									}, t))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: course,
									onChange: (e) => setCourse(e.target.value),
									placeholder: "Course / Event Name",
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: issuedBy,
									onChange: (e) => setIssuedBy(e.target.value),
									placeholder: "Issued By (Organization)",
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: date,
									onChange: (e) => setDate(e.target.value),
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: sigName,
										onChange: (e) => setSigName(e.target.value),
										placeholder: "Signature Name",
										className: "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: sigTitle,
										onChange: (e) => setSigTitle(e.target.value),
										placeholder: "Title",
										className: "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold text-foreground",
								children: "Template"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: templates$1.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setTemplateIdx(i),
									className: "flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-colors",
									style: {
										borderColor: templateIdx === i ? tpl.accent : "transparent",
										background: t.bg + "20"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl",
										children: t.id === "classic" ? "🏅" : t.id === "modern" ? "🔷" : "☪️"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-foreground",
										children: t.name
									})]
								}, t.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => download("png"),
								className: "flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90",
								children: "⬇ Download PNG"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => download("jpg"),
								className: "flex-1 rounded-xl border border-border bg-surface py-3 text-sm font-semibold text-foreground hover:bg-background",
								children: "⬇ Download JPG"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:sticky lg:top-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-sm font-semibold text-muted-foreground",
						children: "Preview (A4 Landscape)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-border bg-surface p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
							ref: canvasRef,
							className: "w-full rounded-lg",
							style: { aspectRatio: "2480/1754" }
						})
					})]
				})]
			})]
		})
	});
}
var $$splitComponentImporter$140 = () => import("./tools.changelog-maker-lugQGftg.mjs");
var Route$147 = createFileRoute("/tools/changelog-maker")({ component: lazyRouteComponent($$splitComponentImporter$140, "component") });
var $$splitComponentImporter$139 = () => import("./tools.code-beautifier-CMdsu_Hj.mjs");
var Route$146 = createFileRoute("/tools/code-beautifier")({ component: lazyRouteComponent($$splitComponentImporter$139, "component") });
var Route$145 = createFileRoute("/tools/code-screenshot")({ component: CodeScreenshot });
var themes = [
	{
		name: "Dracula",
		bg: "#282a36",
		fg: "#f8f8f2",
		keyword: "#ff79c6",
		string: "#f1fa8c",
		comment: "#6272a4",
		number: "#bd93f9"
	},
	{
		name: "GitHub Dark",
		bg: "#0d1117",
		fg: "#c9d1d9",
		keyword: "#ff7b72",
		string: "#a5d6ff",
		comment: "#8b949e",
		number: "#79c0ff"
	},
	{
		name: "One Dark",
		bg: "#282c34",
		fg: "#abb2bf",
		keyword: "#c678dd",
		string: "#98c379",
		comment: "#5c6370",
		number: "#d19a66"
	},
	{
		name: "Nord",
		bg: "#2e3440",
		fg: "#eceff4",
		keyword: "#81a1c1",
		string: "#a3be8c",
		comment: "#616e88",
		number: "#b48ead"
	},
	{
		name: "Monokai",
		bg: "#272822",
		fg: "#f8f8f2",
		keyword: "#f92672",
		string: "#e6db74",
		comment: "#75715e",
		number: "#ae81ff"
	}
];
var gradients = [
	"linear-gradient(135deg, #0a0a0f, #1a1a2e)",
	"linear-gradient(135deg, #1a0a2e, #0a1628)",
	"linear-gradient(135deg, #0d1117, #161b22)",
	"linear-gradient(135deg, #0a2e1a, #0a1a2e)",
	"linear-gradient(135deg, #2e0a1a, #1a0a2e)",
	"linear-gradient(135deg, #f5f5f5, #e0e0e0)",
	"linear-gradient(135deg, #fffef7, #f0e6d3)",
	"linear-gradient(135deg, #667eea, #764ba2)",
	"linear-gradient(135deg, #f093fb, #f5576c)",
	"linear-gradient(135deg, #4facfe, #00f2fe)"
];
var fonts$1 = [
	"JetBrains Mono",
	"Fira Code",
	"Source Code Pro",
	"Cascadia Code",
	"IBM Plex Mono"
];
var languages = [
	"javascript",
	"typescript",
	"python",
	"html",
	"css",
	"sql",
	"bash",
	"json",
	"yaml",
	"rust",
	"go",
	"java",
	"cpp",
	"php"
];
var sampleCode = {
	javascript: `// SlashAI Code Screenshot
function fibonacci(n) {
  if (n <= 1) return n;
  
  const memo = new Map();
  const fib = (x) => {
    if (memo.has(x)) return memo.get(x);
    const result = fib(x - 1) + fib(x - 2);
    memo.set(x, result);
    return result;
  };
  
  return fib(n);
}

console.log(fibonacci(50));
// Output: 12586269025`,
	typescript: `interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

async function getUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) throw new Error("User not found");
  return response.json();
}

const user = await getUser("abc-123");
console.log(\`\${user.name} (\${user.role})\`);`,
	python: `# SlashAI Code Screenshot
from dataclasses import dataclass
from typing import List

@dataclass
class Task:
    title: str
    done: bool = False
    priority: int = 0

def sort_tasks(tasks: List[Task]) -> List[Task]:
    return sorted(tasks, key=lambda t: -t.priority)

tasks = [
    Task("Build AI assistant", priority=10),
    Task("Write docs", priority=5),
    Task("Ship it!", priority=8),
]

for task in sort_tasks(tasks):
    status = "✓" if task.done else "○"
    print(f"{status} [{task.priority}] {task.title}")`,
	bash: `#!/bin/bash
# SlashAI deployment script
set -euo pipefail

echo "🚀 Building SlashAI..."
npm run build

echo "📦 Deploying to production..."
rsync -avz dist/ server:/var/www/slashai/

echo "✅ Deployed successfully!"
echo "🌐 Visit: https://slashai.dev"`
};
function CodeScreenshot() {
	const [code, setCode] = (0, import_react.useState)(sampleCode["javascript"] ?? "");
	const [lang, setLang] = (0, import_react.useState)("javascript");
	const [themeIdx, setThemeIdx] = (0, import_react.useState)(1);
	const [bgIdx, setBgIdx] = (0, import_react.useState)(0);
	const [bgType, setBgType] = (0, import_react.useState)("gradient");
	const [solidBg, setSolidBg] = (0, import_react.useState)("#0d1117");
	const [padding, setPadding] = (0, import_react.useState)(48);
	const [radius, setRadius] = (0, import_react.useState)(16);
	const [shadow, setShadow] = (0, import_react.useState)("large");
	const [windowStyle, setWindowStyle] = (0, import_react.useState)("mac");
	const [fontIdx, setFontIdx] = (0, import_react.useState)(0);
	const [fontSize, setFontSize] = (0, import_react.useState)(14);
	const [lineNumbers, setLineNumbers] = (0, import_react.useState)(true);
	const [watermark, setWatermark] = (0, import_react.useState)(true);
	const previewRef = (0, import_react.useRef)(null);
	const theme = themes[themeIdx] ?? themes[0];
	const font = fonts$1[fontIdx] ?? fonts$1[0];
	const highlight = (code) => {
		return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/(\/\/.*$)/gm, `<span style="color:${theme.comment}">$1</span>`).replace(/(#.*$)/gm, `<span style="color:${theme.comment}">$1</span>`).replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, `<span style="color:${theme.string}">$1</span>`).replace(/\b(function|const|let|var|return|if|else|for|while|class|interface|type|import|from|export|default|async|await|new|throw|try|catch|def|print|True|False|None|set|echo|fi|do|done)\b/g, `<span style="color:${theme.keyword}">$1</span>`).replace(/\b(\d+\.?\d*)\b/g, `<span style="color:${theme.number}">$1</span>`);
	};
	code.split("\n");
	const highlighted = highlight(code);
	const shadowStyle = shadow === "none" ? "none" : shadow === "small" ? "0 4px 24px rgba(0,0,0,0.3)" : "0 8px 48px rgba(0,0,0,0.5), 0 0 80px rgba(88,166,255,0.1)";
	const bgColor = bgType === "gradient" ? gradients[bgIdx] : solidBg;
	const capture = async () => {
		if (!previewRef.current) return;
		try {
			const html2canvas = (await import("../_libs/html2canvas.mjs").then((n) => n.t)).default;
			const canvas = await html2canvas(previewRef.current, {
				scale: 2,
				backgroundColor: null,
				useCORS: true
			});
			const link = document.createElement("a");
			link.download = "code-screenshot.png";
			link.href = canvas.toDataURL("image/png");
			link.click();
		} catch {
			alert("Download not available. Try copying the screenshot instead.");
		}
	};
	const copyToClipboard = async () => {
		if (!previewRef.current) return;
		try {
			const html2canvas = (await import("../_libs/html2canvas.mjs").then((n) => n.t)).default;
			(await html2canvas(previewRef.current, {
				scale: 2,
				backgroundColor: null,
				useCORS: true
			})).toBlob(async (blob) => {
				if (blob) {
					await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
					alert("Copied to clipboard!");
				}
			});
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 lg:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "📸 Code Screenshot Maker"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Turn code into beautiful shareable images"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1fr_480px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold text-foreground",
									children: "Code"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: lang,
									onChange: (e) => {
										setLang(e.target.value);
										const sc = sampleCode[e.target.value];
										if (sc) setCode(sc);
									},
									className: "rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground",
									children: languages.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: l,
										children: l
									}, l))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: code,
								onChange: (e) => setCode(e.target.value),
								rows: 12,
								className: "w-full rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none",
								spellCheck: false
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold text-foreground",
								children: "Theme"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: themes.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setThemeIdx(i),
									className: "flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs transition-colors",
									style: {
										background: t.bg,
										color: t.fg,
										borderColor: themeIdx === i ? "#58a6ff" : "transparent"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-3 w-3 rounded-full",
										style: { background: t.keyword }
									}), t.name]
								}, t.name))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-3 text-sm font-semibold text-foreground",
									children: "Background"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setBgType("gradient"),
										className: `rounded-lg px-3 py-1.5 text-xs ${bgType === "gradient" ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`,
										children: "Gradient"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setBgType("solid"),
										className: `rounded-lg px-3 py-1.5 text-xs ${bgType === "solid" ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`,
										children: "Solid"
									})]
								}),
								bgType === "gradient" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-5 gap-2",
									children: gradients.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setBgIdx(i),
										className: "h-10 rounded-lg border-2 transition-colors",
										style: {
											background: g,
											borderColor: bgIdx === i ? "#58a6ff" : "transparent"
										}
									}, i))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "color",
										value: solidBg,
										onChange: (e) => setSolidBg(e.target.value),
										className: "h-8 w-8 cursor-pointer rounded border-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: solidBg
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs text-muted-foreground",
											children: "Padding"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: padding,
											onChange: (e) => setPadding(Number(e.target.value)),
											className: "w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground",
											children: [
												16,
												24,
												32,
												48,
												64
											].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: p,
												children: [p, "px"]
											}, p))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs text-muted-foreground",
											children: "Radius"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: radius,
											onChange: (e) => setRadius(Number(e.target.value)),
											className: "w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground",
											children: [
												0,
												8,
												16,
												24
											].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: r,
												children: [r, "px"]
											}, r))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs text-muted-foreground",
											children: "Shadow"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: shadow,
											onChange: (e) => setShadow(e.target.value),
											className: "w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground",
											children: [
												"none",
												"small",
												"large"
											].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: s,
												children: s
											}, s))
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs text-muted-foreground",
											children: "Window"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: windowStyle,
											onChange: (e) => setWindowStyle(e.target.value),
											className: "w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground",
											children: [
												"mac",
												"windows",
												"none"
											].map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: w,
												children: w
											}, w))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs text-muted-foreground",
											children: "Font"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: fontIdx,
											onChange: (e) => setFontIdx(Number(e.target.value)),
											className: "w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground",
											children: fonts$1.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: i,
												children: f
											}, f))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs text-muted-foreground",
											children: "Size"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: fontSize,
											onChange: (e) => setFontSize(Number(e.target.value)),
											className: "w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground",
											children: [
												11,
												12,
												13,
												14,
												15,
												16,
												18,
												20
											].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: s,
												children: [s, "px"]
											}, s))
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: lineNumbers,
											onChange: (e) => setLineNumbers(e.target.checked),
											className: "rounded"
										}), "Line numbers"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: watermark,
											onChange: (e) => setWatermark(e.target.checked),
											className: "rounded"
										}), "Watermark"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: capture,
								className: "flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90",
								children: "⬇ Download PNG"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: copyToClipboard,
								className: "flex-1 rounded-xl border border-border bg-surface py-3 text-sm font-semibold text-foreground hover:bg-background",
								children: "📋 Copy"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:sticky lg:top-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-sm font-semibold text-muted-foreground",
						children: "Preview"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-border bg-surface p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: previewRef,
							style: {
								background: bgColor,
								padding: "48px",
								borderRadius: "16px"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									borderRadius: radius,
									overflow: "hidden",
									boxShadow: shadowStyle,
									fontFamily: `"${font}", monospace`
								},
								children: [
									windowStyle === "mac" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											background: theme.bg,
											padding: "12px 16px",
											display: "flex",
											alignItems: "center",
											gap: 8,
											borderBottom: `1px solid ${theme.fg}15`
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
												width: 12,
												height: 12,
												borderRadius: "50%",
												background: "#ff5f57"
											} }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
												width: 12,
												height: 12,
												borderRadius: "50%",
												background: "#febc2e"
											} }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
												width: 12,
												height: 12,
												borderRadius: "50%",
												background: "#28c840"
											} })
										]
									}),
									windowStyle === "windows" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											background: theme.bg,
											padding: "8px 16px",
											display: "flex",
											alignItems: "center",
											borderBottom: `1px solid ${theme.fg}15`
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												flex: 1,
												fontSize: 11,
												color: theme.fg + "80"
											},
											children: lang
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												color: theme.fg + "60",
												fontSize: 14
											},
											children: "— □ ✕"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											background: theme.bg,
											padding,
											overflowX: "auto"
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
											style: {
												margin: 0,
												fontSize,
												lineHeight: 1.6,
												color: theme.fg
											},
											children: (lineNumbers ? highlighted.split("\n") : [highlighted]).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: { display: "flex" },
												children: [lineNumbers && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														userSelect: "none",
														color: theme.fg + "30",
														marginRight: 16,
														minWidth: 24,
														textAlign: "right",
														fontSize: fontSize - 2
													},
													children: i + 1
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { dangerouslySetInnerHTML: { __html: line } })]
											}, i))
										})
									})
								]
							}), watermark && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									textAlign: "right",
									marginTop: 12,
									fontSize: 11,
									color: "#ffffff40",
									fontFamily: "sans-serif"
								},
								children: "⚡ SlashAI"
							})]
						})
					})]
				})]
			})]
		})
	});
}
var $$splitComponentImporter$138 = () => import("./tools.coin-flip-DPVCN9MY.mjs");
var Route$144 = createFileRoute("/tools/coin-flip")({ component: lazyRouteComponent($$splitComponentImporter$138, "component") });
var $$splitComponentImporter$137 = () => import("./tools.color-blend-iUU8bR0K.mjs");
var Route$143 = createFileRoute("/tools/color-blend")({ component: lazyRouteComponent($$splitComponentImporter$137, "component") });
var $$splitComponentImporter$136 = () => import("./tools.color-contrast-Bxs3f5e6.mjs");
var Route$142 = createFileRoute("/tools/color-contrast")({ component: lazyRouteComponent($$splitComponentImporter$136, "component") });
var $$splitComponentImporter$135 = () => import("./tools.color-palette-8u4F7jSn.mjs");
var Route$141 = createFileRoute("/tools/color-palette")({
	head: () => ({ meta: [{ title: "Color Palette Studio — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$135, "component")
});
var $$splitComponentImporter$134 = () => import("./tools.color-picker-Do8Cfron.mjs");
var Route$140 = createFileRoute("/tools/color-picker")({ component: lazyRouteComponent($$splitComponentImporter$134, "component") });
var $$splitComponentImporter$133 = () => import("./tools.contract-3rFdTz6F.mjs");
var Route$139 = createFileRoute("/tools/contract")({ component: lazyRouteComponent($$splitComponentImporter$133, "component") });
var $$splitComponentImporter$132 = () => import("./tools.countdown-CEAPZhdn.mjs");
var Route$138 = createFileRoute("/tools/countdown")({
	head: () => ({ meta: [{ title: "Countdown Timer — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$132, "component")
});
var $$splitComponentImporter$131 = () => import("./tools.crack-hash-PyxeSg44.mjs");
var Route$137 = createFileRoute("/tools/crack-hash")({ component: lazyRouteComponent($$splitComponentImporter$131, "component") });
var $$splitComponentImporter$130 = () => import("./tools.cron-hJvsTvDg.mjs");
var Route$136 = createFileRoute("/tools/cron")({ component: lazyRouteComponent($$splitComponentImporter$130, "component") });
var $$splitComponentImporter$129 = () => import("./tools.css-flexbox-SycqFJid.mjs");
var Route$135 = createFileRoute("/tools/css-flexbox")({ component: lazyRouteComponent($$splitComponentImporter$129, "component") });
var $$splitComponentImporter$128 = () => import("./tools.css-grid-BX3J-xBQ.mjs");
var Route$134 = createFileRoute("/tools/css-grid")({ component: lazyRouteComponent($$splitComponentImporter$128, "component") });
var $$splitComponentImporter$127 = () => import("./tools.css-playground-BUXwRJG9.mjs");
var Route$133 = createFileRoute("/tools/css-playground")({ component: lazyRouteComponent($$splitComponentImporter$127, "component") });
var $$splitComponentImporter$126 = () => import("./tools.csv-to-json-RgHtI1dT.mjs");
var Route$132 = createFileRoute("/tools/csv-to-json")({
	head: () => ({ meta: [{ title: "CSV to JSON — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$126, "component")
});
var $$splitComponentImporter$125 = () => import("./tools.currency-history-ClDvuAtX.mjs");
var Route$131 = createFileRoute("/tools/currency-history")({ component: lazyRouteComponent($$splitComponentImporter$125, "component") });
var $$splitComponentImporter$124 = () => import("./tools.cv-BL_Gv4Hb.mjs");
var Route$130 = createFileRoute("/tools/cv")({ component: lazyRouteComponent($$splitComponentImporter$124, "component") });
var $$splitComponentImporter$123 = () => import("./tools.daily-planner-DssgzoBn.mjs");
var Route$129 = createFileRoute("/tools/daily-planner")({ component: lazyRouteComponent($$splitComponentImporter$123, "component") });
var $$splitComponentImporter$122 = () => import("./tools.dice-Dydx7k_Q.mjs");
var Route$128 = createFileRoute("/tools/dice")({ component: lazyRouteComponent($$splitComponentImporter$122, "component") });
var $$splitComponentImporter$121 = () => import("./tools.diff-j1fet8jn.mjs");
var Route$127 = createFileRoute("/tools/diff")({
	head: () => ({ meta: [{ title: "Text Diff Checker — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$121, "component")
});
var $$splitComponentImporter$120 = () => import("./tools.diff-viewer-C9x51IvP.mjs");
var Route$126 = createFileRoute("/tools/diff-viewer")({ component: lazyRouteComponent($$splitComponentImporter$120, "component") });
var $$splitComponentImporter$119 = () => import("./tools.distance-calc-BNuHQZVg.mjs");
var Route$125 = createFileRoute("/tools/distance-calc")({ component: lazyRouteComponent($$splitComponentImporter$119, "component") });
var $$splitComponentImporter$118 = () => import("./tools.dua-maker-DOqnslVe.mjs");
var Route$124 = createFileRoute("/tools/dua-maker")({ component: lazyRouteComponent($$splitComponentImporter$118, "component") });
var $$splitComponentImporter$117 = () => import("./tools.emi-calculator-CjA8lY7A.mjs");
var Route$123 = createFileRoute("/tools/emi-calculator")({
	head: () => ({ meta: [{ title: "EMI Calculator — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$117, "component")
});
var $$splitComponentImporter$116 = () => import("./tools.emoji-DjkHE9ac.mjs");
var Route$122 = createFileRoute("/tools/emoji")({ component: lazyRouteComponent($$splitComponentImporter$116, "component") });
var $$splitComponentImporter$115 = () => import("./tools.equation-8-MdMafz.mjs");
var Route$121 = createFileRoute("/tools/equation")({ component: lazyRouteComponent($$splitComponentImporter$115, "component") });
var $$splitComponentImporter$114 = () => import("./tools.expense-BzeTw2WI.mjs");
var Route$120 = createFileRoute("/tools/expense")({ component: lazyRouteComponent($$splitComponentImporter$114, "component") });
var $$splitComponentImporter$113 = () => import("./tools.fake-email-wwu3QYUo.mjs");
var Route$119 = createFileRoute("/tools/fake-email")({
	component: lazyRouteComponent($$splitComponentImporter$113, "component"),
	head: () => ({ meta: [{ title: "Temp Email Generator — SlashAI" }, {
		name: "description",
		content: "Disposable email addresses with an inbox powered by Guerrilla Mail — no sign-up, nothing stored here."
	}] })
});
var $$splitComponentImporter$112 = () => import("./tools.flashcard-maker-D9jDvhqm.mjs");
var Route$118 = createFileRoute("/tools/flashcard-maker")({ component: lazyRouteComponent($$splitComponentImporter$112, "component") });
var $$splitComponentImporter$111 = () => import("./tools.flip-clock-BQE3En1Z.mjs");
var Route$117 = createFileRoute("/tools/flip-clock")({
	head: () => ({ meta: [{ title: "Flip Clock — SlashKits" }] }),
	component: lazyRouteComponent($$splitComponentImporter$111, "component")
});
var $$splitComponentImporter$110 = () => import("./tools.focus-nS_lYImh.mjs");
var Route$116 = createFileRoute("/tools/focus")({
	head: () => ({ meta: [{ title: "Deep Work Mode — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$110, "component")
});
var $$splitComponentImporter$109 = () => import("./tools.focus-screen-Ckr_POyK.mjs");
var Route$115 = createFileRoute("/tools/focus-screen")({
	head: () => ({ meta: [{ title: "Focus Screen — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$109, "component")
});
var $$splitComponentImporter$108 = () => import("./tools.font-eV8bh5No.mjs");
var Route$114 = createFileRoute("/tools/font")({ component: lazyRouteComponent($$splitComponentImporter$108, "component") });
var $$splitComponentImporter$107 = () => import("./tools.font-size-CKKrrOTc.mjs");
var Route$113 = createFileRoute("/tools/font-size")({ component: lazyRouteComponent($$splitComponentImporter$107, "component") });
var $$splitComponentImporter$106 = () => import("./tools.gift-BQyyzZnX.mjs");
var Route$112 = createFileRoute("/tools/gift")({ component: lazyRouteComponent($$splitComponentImporter$106, "component") });
var $$splitComponentImporter$105 = () => import("./tools.gradient-BNoVl8qe.mjs");
var Route$111 = createFileRoute("/tools/gradient")({ component: lazyRouteComponent($$splitComponentImporter$105, "component") });
var $$splitComponentImporter$104 = () => import("./tools.gratitude-journal-HjgnJWpE.mjs");
var Route$110 = createFileRoute("/tools/gratitude-journal")({ component: lazyRouteComponent($$splitComponentImporter$104, "component") });
var $$splitComponentImporter$103 = () => import("./tools.gst-calculator-pys4kZv2.mjs");
var Route$109 = createFileRoute("/tools/gst-calculator")({
	head: () => ({ meta: [{ title: "GST Calculator — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$103, "component")
});
var $$splitComponentImporter$102 = () => import("./tools.habit-stack-DCThC20B.mjs");
var Route$108 = createFileRoute("/tools/habit-stack")({ component: lazyRouteComponent($$splitComponentImporter$102, "component") });
var $$splitComponentImporter$101 = () => import("./tools.habits-COa1OIH6.mjs");
var Route$107 = createFileRoute("/tools/habits")({
	head: () => ({ meta: [{ title: "Habit Tracker — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$101, "component")
});
var Route$106 = createFileRoute("/tools/health-tracker")({ component: HealthTracker });
var STORAGE_KEY$1 = "slashai-health-log";
var SETTINGS_KEY = "slashai-health-settings";
function HealthTracker() {
	const [entries, setEntries] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY$1) || "[]");
		} catch {
			return [];
		}
	});
	const [settings, setSettings] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
		} catch {
			return {};
		}
	});
	const [height, setHeight] = (0, import_react.useState)(settings.height || 170);
	const [unit, setUnit] = (0, import_react.useState)(settings.unit || "kg");
	const [goalWeight, setGoalWeight] = (0, import_react.useState)(settings.goalWeight || 70);
	const [todayWeight, setTodayWeight] = (0, import_react.useState)("");
	const [todayNotes, setTodayNotes] = (0, import_react.useState)("");
	const [showSettings, setShowSettings] = (0, import_react.useState)(false);
	const [period, setPeriod] = (0, import_react.useState)("all");
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		localStorage.setItem(STORAGE_KEY$1, JSON.stringify(entries));
	}, [entries]);
	(0, import_react.useEffect)(() => {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify({
			height,
			unit,
			goalWeight
		}));
	}, [
		height,
		unit,
		goalWeight
	]);
	const toKg = (w) => unit === "lbs" ? w * .453592 : w;
	const fromKg = (w) => unit === "lbs" ? w * 2.20462 : w;
	const unitLabel = unit === "lbs" ? "lbs" : "kg";
	const addEntry = () => {
		const w = parseFloat(todayWeight);
		if (!w) return;
		setEntries((prev) => [{
			id: Date.now().toString(),
			date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] ?? (/* @__PURE__ */ new Date()).toLocaleDateString(),
			weight: toKg(w),
			notes: todayNotes
		}, ...prev]);
		setTodayWeight("");
		setTodayNotes("");
	};
	const deleteEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));
	const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
	const filtered = sorted.filter((e) => {
		if (period === "all") return true;
		const d = new Date(e.date);
		return ((/* @__PURE__ */ new Date()).getTime() - d.getTime()) / 864e5 <= (period === "1w" ? 7 : period === "1m" ? 30 : 90);
	});
	const lastEntry = filtered.length > 0 ? filtered[filtered.length - 1] : void 0;
	const firstEntry = filtered.length > 0 ? filtered[0] : void 0;
	const currentW = lastEntry?.weight ?? 0;
	const startW = firstEntry?.weight ?? 0;
	const bmi = currentW > 0 ? (currentW / (height / 100) ** 2).toFixed(1) : "—";
	const lost = filtered.length >= 2 && firstEntry ? firstEntry.weight - currentW : 0;
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas || filtered.length < 2) return;
		const ctx = canvas.getContext("2d");
		const W = canvas.width = canvas.offsetWidth * 2;
		const H = canvas.height = 300;
		ctx.scale(2, 2);
		const w = W / 2;
		const h = H / 2;
		ctx.clearRect(0, 0, w, h);
		const weights = filtered.map((e) => fromKg(e.weight));
		const minW = Math.min(...weights, goalWeight) - 2;
		const maxW = Math.max(...weights, goalWeight) + 2;
		const pad = {
			t: 20,
			r: 20,
			b: 30,
			l: 50
		};
		const cw = w - pad.l - pad.r;
		const ch = h - pad.t - pad.b;
		ctx.strokeStyle = "#21262d";
		ctx.lineWidth = .5;
		for (let i = 0; i <= 5; i++) {
			const y = pad.t + ch / 5 * i;
			ctx.beginPath();
			ctx.moveTo(pad.l, y);
			ctx.lineTo(w - pad.r, y);
			ctx.stroke();
			const val = maxW - (maxW - minW) / 5 * i;
			ctx.fillStyle = "#8b949e";
			ctx.font = "10px sans-serif";
			ctx.textAlign = "right";
			ctx.fillText(val.toFixed(1), pad.l - 8, y + 4);
		}
		const goalY = pad.t + ch * (1 - (goalWeight - minW) / (maxW - minW));
		ctx.strokeStyle = "#3fb95060";
		ctx.lineWidth = 1;
		ctx.setLineDash([4, 4]);
		ctx.beginPath();
		ctx.moveTo(pad.l, goalY);
		ctx.lineTo(w - pad.r, goalY);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.fillStyle = "#3fb950";
		ctx.font = "9px sans-serif";
		ctx.textAlign = "left";
		ctx.fillText(`Goal: ${goalWeight.toFixed(0)}${unitLabel}`, w - pad.r - 80, goalY - 5);
		ctx.strokeStyle = "#58a6ff";
		ctx.lineWidth = 2;
		ctx.beginPath();
		filtered.forEach((e, i) => {
			const x = pad.l + cw / (filtered.length - 1) * i;
			const y = pad.t + ch * (1 - (fromKg(e.weight) - minW) / (maxW - minW));
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		});
		ctx.stroke();
		filtered.forEach((e, i) => {
			const x = pad.l + cw / (filtered.length - 1) * i;
			const y = pad.t + ch * (1 - (fromKg(e.weight) - minW) / (maxW - minW));
			ctx.fillStyle = "#58a6ff";
			ctx.beginPath();
			ctx.arc(x, y, 3, 0, Math.PI * 2);
			ctx.fill();
		});
	}, [
		filtered,
		goalWeight,
		unitLabel,
		fromKg
	]);
	const bmiColor = bmi === "—" ? "#8b949e" : Number(bmi) < 18.5 ? "#d29922" : Number(bmi) < 25 ? "#3fb950" : Number(bmi) < 30 ? "#d29922" : "#f85149";
	const exportCsv = () => {
		const header = "Date,Weight,Notes\n";
		const rows = sorted.map((e) => `${e.date},${fromKg(e.weight).toFixed(1)},${e.notes}`).join("\n");
		const blob = new Blob([header + rows], { type: "text/csv" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "health-log.csv";
		link.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 lg:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-foreground",
						children: "💪 Health Tracker"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Track weight, BMI and health over time"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: exportCsv,
							className: "rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground",
							children: "📊 Export"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowSettings(!showSettings),
							className: "rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground",
							children: "⚙️ Settings"
						})]
					})]
				}),
				showSettings && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-foreground",
						children: "Settings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs text-muted-foreground",
								children: "Height (cm)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: height,
								onChange: (e) => setHeight(Number(e.target.value)),
								className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs text-muted-foreground",
								children: "Unit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: unit,
								onChange: (e) => setUnit(e.target.value),
								className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "kg",
									children: "Kilograms"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "lbs",
									children: "Pounds"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1 block text-xs text-muted-foreground",
								children: [
									"Goal Weight (",
									unitLabel,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: goalWeight,
								onChange: (e) => setGoalWeight(Number(e.target.value)),
								className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
							})] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 text-sm font-semibold text-foreground",
						children: "Log Today"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: todayWeight,
								onChange: (e) => setTodayWeight(e.target.value),
								placeholder: `Weight (${unitLabel})`,
								className: "w-28 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: todayNotes,
								onChange: (e) => setTodayNotes(e.target.value),
								placeholder: "Notes (optional)",
								className: "flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: addEntry,
								disabled: !todayWeight,
								className: "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
								children: "Log"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-5 gap-2",
					children: [
						{
							label: "Starting",
							value: filtered.length ? `${fromKg(startW).toFixed(1)}${unitLabel}` : "—"
						},
						{
							label: "Current",
							value: filtered.length ? `${fromKg(currentW).toFixed(1)}${unitLabel}` : "—"
						},
						{
							label: "Goal",
							value: `${goalWeight}${unitLabel}`
						},
						{
							label: "Change",
							value: filtered.length >= 2 ? `${lost >= 0 ? "+" : ""}${fromKg(lost).toFixed(1)}${unitLabel}` : "—"
						},
						{
							label: "BMI",
							value: bmi,
							color: bmiColor
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-bold",
							style: { color: s.color || "#f0f6fc" },
							children: s.value
						})]
					}, s.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: [
						"1w",
						"1m",
						"3m",
						"all"
					].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setPeriod(p),
						className: `rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${period === p ? "bg-primary text-background" : "bg-surface text-muted-foreground border border-border"}`,
						children: p === "all" ? "All" : p.toUpperCase()
					}, p))
				}),
				filtered.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
						ref: canvasRef,
						className: "w-full",
						style: { height: 150 }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "mb-3 text-sm font-semibold text-foreground",
						children: [
							"History (",
							entries.length,
							" entries)"
						]
					}), sorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm text-muted-foreground py-8",
						children: "No entries yet. Log your first weight above!"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-60 space-y-1 overflow-y-auto",
						children: sorted.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg bg-background px-3 py-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: e.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-foreground",
									children: [
										fromKg(e.weight).toFixed(1),
										" ",
										unitLabel
									]
								}),
								e.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground/60",
									children: e.notes
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => deleteEntry(e.id),
									className: "text-red-400 hover:text-red-300",
									children: "✕"
								})
							]
						}, e.id))
					})]
				})
			]
		})
	});
}
var $$splitComponentImporter$100 = () => import("./tools.heart-rate-DPxt2PfZ.mjs");
var Route$105 = createFileRoute("/tools/heart-rate")({ component: lazyRouteComponent($$splitComponentImporter$100, "component") });
var $$splitComponentImporter$99 = () => import("./tools.hijri-CprLbC32.mjs");
var Route$104 = createFileRoute("/tools/hijri")({ component: lazyRouteComponent($$splitComponentImporter$99, "component") });
var $$splitComponentImporter$98 = () => import("./tools.html-compiler-HGwKiBMa.mjs");
var Route$103 = createFileRoute("/tools/html-compiler")({
	head: () => ({ meta: [{ title: "HTML Compiler & Viewer — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$98, "component")
});
var $$splitComponentImporter$97 = () => import("./tools.html-entity-ByekRr1p.mjs");
var Route$102 = createFileRoute("/tools/html-entity")({ component: lazyRouteComponent($$splitComponentImporter$97, "component") });
var $$splitComponentImporter$96 = () => import("./tools.html-preview-DJMIx7GY.mjs");
var Route$101 = createFileRoute("/tools/html-preview")({ component: lazyRouteComponent($$splitComponentImporter$96, "component") });
var $$splitComponentImporter$95 = () => import("./tools.html-to-pdf--gJxdOVL.mjs");
var Route$100 = createFileRoute("/tools/html-to-pdf")({
	head: () => ({ meta: [{ title: "HTML to PDF — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$95, "component")
});
var $$splitComponentImporter$94 = () => import("./tools.http-status-D1eKyXck.mjs");
var Route$99 = createFileRoute("/tools/http-status")({ component: lazyRouteComponent($$splitComponentImporter$94, "component") });
var $$splitComponentImporter$93 = () => import("./tools.ideal-weight-dMneQvsU.mjs");
var Route$98 = createFileRoute("/tools/ideal-weight")({ component: lazyRouteComponent($$splitComponentImporter$93, "component") });
var $$splitComponentImporter$92 = () => import("./tools.image-base64-C7Sra2Ex.mjs");
var Route$97 = createFileRoute("/tools/image-base64")({ component: lazyRouteComponent($$splitComponentImporter$92, "component") });
var $$splitComponentImporter$91 = () => import("./tools.image-compress-_qF4vuyd.mjs");
var Route$96 = createFileRoute("/tools/image-compress")({
	head: () => ({ meta: [{ title: "Image Compressor — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$91, "component")
});
var $$splitComponentImporter$90 = () => import("./tools.image-convert-v9iSUyQm.mjs");
var Route$95 = createFileRoute("/tools/image-convert")({
	head: () => ({ meta: [{ title: "Image Converter — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$90, "component")
});
var $$splitComponentImporter$89 = () => import("./tools.images-to-pdf-Cx_jqxAB.mjs");
var Route$94 = createFileRoute("/tools/images-to-pdf")({
	head: () => ({ meta: [{ title: "Images to PDF — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$89, "component")
});
var $$splitComponentImporter$88 = () => import("./tools.interview-g-ptcCu5.mjs");
var Route$93 = createFileRoute("/tools/interview")({
	head: () => ({ meta: [{ title: "Mock Interview Simulator — practice with feedback | SlashAI" }, {
		name: "description",
		content: "Practice real interview questions for developer, design, data, product and more. Voice or typed answers with instant feedback on length, fillers, STAR and pace."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$88, "component")
});
var $$splitComponentImporter$87 = () => import("./tools.invoice-XLyhKyDk.mjs");
var Route$92 = createFileRoute("/tools/invoice")({
	head: () => ({ meta: [{ title: "Invoice Generator — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$87, "component")
});
var $$splitComponentImporter$86 = () => import("./tools.invoice-lookup--LgID1bI.mjs");
var Route$91 = createFileRoute("/tools/invoice-lookup")({ component: lazyRouteComponent($$splitComponentImporter$86, "component") });
var $$splitComponentImporter$85 = () => import("./tools.ip-B_U275CD.mjs");
var Route$90 = createFileRoute("/tools/ip")({ component: lazyRouteComponent($$splitComponentImporter$85, "component") });
var $$splitComponentImporter$84 = () => import("./tools.js-playground-IA1jPBgC.mjs");
var Route$89 = createFileRoute("/tools/js-playground")({ component: lazyRouteComponent($$splitComponentImporter$84, "component") });
var $$splitComponentImporter$83 = () => import("./tools.json-formatter-QlNQ25U3.mjs");
var Route$88 = createFileRoute("/tools/json-formatter")({ component: lazyRouteComponent($$splitComponentImporter$83, "component") });
var $$splitComponentImporter$82 = () => import("./tools.json-tree-CgtZLQFD.mjs");
var Route$87 = createFileRoute("/tools/json-tree")({ component: lazyRouteComponent($$splitComponentImporter$82, "component") });
var $$splitComponentImporter$81 = () => import("./tools.kharch-BbrgxfAn.mjs");
var Route$86 = createFileRoute("/tools/kharch")({ component: lazyRouteComponent($$splitComponentImporter$81, "component") });
var $$splitComponentImporter$80 = () => import("./tools.linktree-CqG2RQwz.mjs");
var Route$85 = createFileRoute("/tools/linktree")({ component: lazyRouteComponent($$splitComponentImporter$80, "component") });
var $$splitComponentImporter$79 = () => import("./tools.lorem-CYXNwRK3.mjs");
var Route$84 = createFileRoute("/tools/lorem")({
	head: () => ({ meta: [{ title: "Content Generator — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$79, "component")
});
var $$splitComponentImporter$78 = () => import("./tools.markdown-editor-rvbqwwDY.mjs");
var Route$83 = createFileRoute("/tools/markdown-editor")({
	head: () => ({ meta: [{ title: "Markdown Editor — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$78, "component")
});
var $$splitComponentImporter$77 = () => import("./tools.markdown-html2-Cv_Y9zqV.mjs");
var Route$82 = createFileRoute("/tools/markdown-html2")({ component: lazyRouteComponent($$splitComponentImporter$77, "component") });
var $$splitComponentImporter$76 = () => import("./tools.markdown-stats-LD0dEpLy.mjs");
var Route$81 = createFileRoute("/tools/markdown-stats")({ component: lazyRouteComponent($$splitComponentImporter$76, "component") });
var $$splitComponentImporter$75 = () => import("./tools.markdown-to-html-DtKVytnH.mjs");
var Route$80 = createFileRoute("/tools/markdown-to-html")({
	head: () => ({ meta: [{ title: "Markdown to HTML — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$75, "component")
});
var $$splitComponentImporter$74 = () => import("./tools.meeting-D3Ou0aT7.mjs");
var Route$79 = createFileRoute("/tools/meeting")({ component: lazyRouteComponent($$splitComponentImporter$74, "component") });
var Route$78 = createFileRoute("/tools/meme")({ component: MemeGenerator });
var templates = [
	{
		name: "Drake Hotline",
		url: "https://i.imgflip.com/30b1gx.jpg",
		width: 500,
		height: 500
	},
	{
		name: "Distracted Boyfriend",
		url: "https://i.imgflip.com/1ur9b0.jpg",
		width: 600,
		height: 400
	},
	{
		name: "Two Buttons",
		url: "https://i.imgflip.com/1g8my4.jpg",
		width: 500,
		height: 500
	},
	{
		name: "Change My Mind",
		url: "https://i.imgflip.com/24y43o.jpg",
		width: 500,
		height: 500
	},
	{
		name: "Expanding Brain",
		url: "https://i.imgflip.com/1jwhww.jpg",
		width: 500,
		height: 500
	},
	{
		name: "Surprised Pikachu",
		url: "https://i.imgflip.com/30b1gx.jpg",
		width: 500,
		height: 500
	},
	{
		name: "This Is Fine",
		url: "https://i.imgflip.com/26am6d.jpg",
		width: 600,
		height: 400
	},
	{
		name: "Woman Yelling Cat",
		url: "https://i.imgflip.com/345v97.jpg",
		width: 600,
		height: 400
	},
	{
		name: "UNO Draw",
		url: "https://i.imgflip.com/3vzen3.jpg",
		width: 500,
		height: 500
	},
	{
		name: "Running Away Balloon",
		url: "https://i.imgflip.com/261o3j.jpg",
		width: 600,
		height: 400
	},
	{
		name: "Left Exit 12 Off Ramp",
		url: "https://i.imgflip.com/22bdq6.jpg",
		width: 600,
		height: 400
	},
	{
		name: "Roll Safe Think",
		url: "https://i.imgflip.com/1h7in3.jpg",
		width: 500,
		height: 500
	},
	{
		name: "Buff Doge vs Cheems",
		url: "https://i.imgflip.com/43a45p.jpg",
		width: 600,
		height: 400
	},
	{
		name: "Boardroom Meeting",
		url: "https://i.imgflip.com/4vz2k1.jpg",
		width: 500,
		height: 500
	},
	{
		name: "Bernie Sanders",
		url: "https://i.imgflip.com/48z2ig.jpg",
		width: 500,
		height: 500
	},
	{
		name: "Anakin Padme",
		url: "https://i.imgflip.com/4t0m60.jpg",
		width: 500,
		height: 500
	},
	{
		name: " expanding brain meme",
		url: "https://i.imgflip.com/1jwhww.jpg",
		width: 500,
		height: 500
	},
	{
		name: "Trade Offer",
		url: "https://i.imgflip.com/4x9xg0.jpg",
		width: 500,
		height: 500
	},
	{
		name: "My Brain After",
		url: "https://i.imgflip.com/46wfbm.jpg",
		width: 500,
		height: 500
	},
	{
		name: "Clown Putting Makeup",
		url: "https://i.imgflip.com/47waa6.jpg",
		width: 500,
		height: 500
	}
];
var fonts = [
	"Impact",
	"Arial Black",
	"Comic Sans MS",
	"Courier New"
];
var textColors = [
	"#ffffff",
	"#000000",
	"#ffff00",
	"#00ff00",
	"#ff0000"
];
function MemeGenerator() {
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [topText, setTopText] = (0, import_react.useState)("");
	const [bottomText, setBottomText] = (0, import_react.useState)("");
	const [fontSize, setFontSize] = (0, import_react.useState)(42);
	const [textColor, setTextColor] = (0, import_react.useState)("#ffffff");
	const [stroke, setStroke] = (0, import_react.useState)(true);
	const [font, setFont] = (0, import_react.useState)("Impact");
	const [search, setSearch] = (0, import_react.useState)("");
	const [customImg, setCustomImg] = (0, import_react.useState)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const filtered = templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
	const drawMeme = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		const imgSource = customImg || selected?.url;
		if (!canvas || !imgSource) return;
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			const ctx = canvas.getContext("2d");
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			const fs = Math.round(fontSize * (img.width / 500));
			ctx.font = `bold ${fs}px "${font}"`;
			ctx.textAlign = "center";
			ctx.textBaseline = "top";
			const strokeW = Math.round(fs / 12);
			if (topText) {
				const x = canvas.width / 2;
				const words = topText.toUpperCase().split(" ");
				let line = "";
				let y = 20;
				for (const word of words) {
					const testLine = line + word + " ";
					if (ctx.measureText(testLine).width > canvas.width - 40) {
						if (stroke) {
							ctx.strokeStyle = "#000";
							ctx.lineWidth = strokeW;
							ctx.lineJoin = "round";
							ctx.strokeText(line.trim(), x, y);
						}
						ctx.fillStyle = textColor;
						ctx.fillText(line.trim(), x, y);
						line = word + " ";
						y += fs + 4;
					} else line = testLine;
				}
				if (stroke) {
					ctx.strokeStyle = "#000";
					ctx.lineWidth = strokeW;
					ctx.lineJoin = "round";
					ctx.strokeText(line.trim(), x, y);
				}
				ctx.fillStyle = textColor;
				ctx.fillText(line.trim(), x, y);
			}
			if (bottomText) {
				const x = canvas.width / 2;
				const words = bottomText.toUpperCase().split(" ");
				let lines = [];
				let line = "";
				for (const word of words) {
					const testLine = line + word + " ";
					if (ctx.measureText(testLine).width > canvas.width - 40) {
						lines.push(line.trim());
						line = word + " ";
					} else line = testLine;
				}
				lines.push(line.trim());
				let y = canvas.height - 20 - lines.length * (fs + 4);
				for (const l of lines) {
					if (stroke) {
						ctx.strokeStyle = "#000";
						ctx.lineWidth = strokeW;
						ctx.lineJoin = "round";
						ctx.strokeText(l, x, y);
					}
					ctx.fillStyle = textColor;
					ctx.fillText(l, x, y);
					y += fs + 4;
				}
			}
		};
		img.src = imgSource;
	}, [
		selected,
		topText,
		bottomText,
		fontSize,
		textColor,
		stroke,
		font,
		customImg
	]);
	(0, import_react.useState)(() => {
		drawMeme();
	});
	const download = () => {
		if (!canvasRef.current) return;
		drawMeme();
		setTimeout(() => {
			const link = document.createElement("a");
			link.download = "meme.png";
			link.href = canvasRef.current.toDataURL("image/png");
			link.click();
		}, 100);
	};
	const copyToClipboard = async () => {
		if (!canvasRef.current) return;
		drawMeme();
		setTimeout(async () => {
			try {
				const blob = await new Promise((resolve) => canvasRef.current.toBlob((b) => resolve(b), "image/png"));
				await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
				alert("Copied!");
			} catch {}
		}, 100);
	};
	const onCustomUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			setCustomImg(reader.result);
			setSelected(null);
		};
		reader.readAsDataURL(file);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 lg:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "😂 Meme Generator"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Create memes instantly — no watermark, completely free"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[320px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search templates...",
							className: "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => fileRef.current?.click(),
							className: "w-full rounded-xl border-2 border-dashed border-border bg-surface p-4 text-center text-sm text-muted-foreground hover:border-primary/50",
							children: "📷 Upload custom image"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: onCustomUpload
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-[50vh] space-y-2 overflow-y-auto",
							children: filtered.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setSelected(t);
									setCustomImg(null);
								},
								className: `flex w-full items-center gap-3 rounded-xl border p-2 transition-colors ${selected?.url === t.url ? "border-primary bg-primary/5" : "border-border bg-surface hover:bg-background"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: t.url,
									alt: t.name,
									className: "h-14 w-14 rounded-lg object-cover",
									crossOrigin: "anonymous"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-foreground",
									children: t.name
								})]
							}, i))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center",
							children: selected || customImg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
								ref: canvasRef,
								className: "max-h-[50vh] w-full rounded-lg"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-64 items-center justify-center text-muted-foreground",
								children: "Select a template or upload an image"
							})
						})
					}), (selected || customImg) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs text-muted-foreground",
									children: "Top Text"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: topText,
									onChange: (e) => setTopText(e.target.value),
									placeholder: "Top text...",
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs text-muted-foreground",
									children: "Bottom Text"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: bottomText,
									onChange: (e) => setBottomText(e.target.value),
									placeholder: "Bottom text...",
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs text-muted-foreground",
										children: "Size"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 20,
										max: 80,
										value: fontSize,
										onChange: (e) => setFontSize(Number(e.target.value)),
										className: "flex-1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: fontSize
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: textColors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setTextColor(c),
									className: "h-7 w-7 rounded-full border-2",
									style: {
										backgroundColor: c,
										borderColor: textColor === c ? "#58a6ff" : "transparent"
									}
								}, c))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: font,
									onChange: (e) => setFont(e.target.value),
									className: "rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground",
									children: fonts.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: f,
										children: f
									}, f))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: stroke,
										onChange: (e) => setStroke(e.target.checked)
									}), "Text outline"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										drawMeme();
										setTimeout(download, 100);
									},
									className: "flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90",
									children: "⬇ Download PNG"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										drawMeme();
										setTimeout(copyToClipboard, 100);
									},
									className: "flex-1 rounded-xl border border-border bg-surface py-3 text-sm font-semibold text-foreground hover:bg-background",
									children: "📋 Copy"
								})]
							})
						]
					})]
				})]
			})]
		})
	});
}
var $$splitComponentImporter$73 = () => import("./tools.memo-generator-CyZ6uver.mjs");
var Route$77 = createFileRoute("/tools/memo-generator")({ component: lazyRouteComponent($$splitComponentImporter$73, "component") });
var $$splitComponentImporter$72 = () => import("./tools.meta-DlckH8Sf.mjs");
var Route$76 = createFileRoute("/tools/meta")({ component: lazyRouteComponent($$splitComponentImporter$72, "component") });
var $$splitComponentImporter$71 = () => import("./tools.mime-type-CEmcQ21X.mjs");
var Route$75 = createFileRoute("/tools/mime-type")({ component: lazyRouteComponent($$splitComponentImporter$71, "component") });
var $$splitComponentImporter$70 = () => import("./tools.mind-map-DGZXZFXj.mjs");
var Route$74 = createFileRoute("/tools/mind-map")({ component: lazyRouteComponent($$splitComponentImporter$70, "component") });
var $$splitComponentImporter$69 = () => import("./tools.mood-tracker-DASDEP4x.mjs");
var Route$73 = createFileRoute("/tools/mood-tracker")({ component: lazyRouteComponent($$splitComponentImporter$69, "component") });
var $$splitComponentImporter$68 = () => import("./tools.muhurrat-ARKUHP-P.mjs");
var Route$72 = createFileRoute("/tools/muhurrat")({ component: lazyRouteComponent($$splitComponentImporter$68, "component") });
var $$splitComponentImporter$67 = () => import("./tools.multi-timer-DnKbo5--.mjs");
var Route$71 = createFileRoute("/tools/multi-timer")({
	head: () => ({ meta: [{ title: "Multi Timer — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$67, "component")
});
var $$splitComponentImporter$66 = () => import("./tools.name-BTgyEmcY.mjs");
var Route$70 = createFileRoute("/tools/name")({ component: lazyRouteComponent($$splitComponentImporter$66, "component") });
var $$splitComponentImporter$65 = () => import("./tools.namecard-CyMrMag6.mjs");
var Route$69 = createFileRoute("/tools/namecard")({
	head: () => ({ meta: [{ title: "Digital Business Card — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$65, "component")
});
var $$splitComponentImporter$64 = () => import("./tools.new-tab-3ocq-8V4.mjs");
var Route$68 = createFileRoute("/tools/new-tab")({
	head: () => ({ meta: [{ title: "New Tab Screen — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$64, "component")
});
var $$splitComponentImporter$63 = () => import("./tools.noise-B1jD96Vq.mjs");
var Route$67 = createFileRoute("/tools/noise")({ component: lazyRouteComponent($$splitComponentImporter$63, "component") });
var $$splitComponentImporter$62 = () => import("./tools.notes-D9bCwxMe.mjs");
var Route$66 = createFileRoute("/tools/notes")({
	head: () => ({ meta: [{ title: "Quick Notes — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$62, "component")
});
var $$splitComponentImporter$61 = () => import("./tools.number-words-Ck0N_09-.mjs");
var Route$65 = createFileRoute("/tools/number-words")({ component: lazyRouteComponent($$splitComponentImporter$61, "component") });
var $$splitComponentImporter$60 = () => import("./tools.one-liner-tox13LrC.mjs");
var Route$64 = createFileRoute("/tools/one-liner")({
	head: () => ({ meta: [{ title: "OneLiner Quotes — SlashKits" }, {
		name: "description",
		content: "Browse 500+ aesthetic one-liner quotes. Copy or download as clean black PNG. 27 categories, 3 fonts."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$60, "component")
});
var $$splitComponentImporter$59 = () => import("./tools.password-Wq16bFx-.mjs");
var Route$63 = createFileRoute("/tools/password")({
	head: () => ({ meta: [{ title: "Password Manager (Local) — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$59, "component")
});
var $$splitComponentImporter$58 = () => import("./tools.password-gen-C6tsWm9q.mjs");
var Route$62 = createFileRoute("/tools/password-gen")({ component: lazyRouteComponent($$splitComponentImporter$58, "component") });
var $$splitComponentImporter$57 = () => import("./tools.percentage-B5FBPOYi.mjs");
var Route$61 = createFileRoute("/tools/percentage")({
	head: () => ({ meta: [{ title: "Percentage Calculator — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$57, "component")
});
var $$splitComponentImporter$56 = () => import("./tools.pitch-BmlXnISc.mjs");
var Route$60 = createFileRoute("/tools/pitch")({ component: lazyRouteComponent($$splitComponentImporter$56, "component") });
var $$splitComponentImporter$55 = () => import("./tools.plant-CtVeLZdq.mjs");
var Route$59 = createFileRoute("/tools/plant")({ component: lazyRouteComponent($$splitComponentImporter$55, "component") });
var $$splitComponentImporter$54 = () => import("./tools.poll-B7kOZ6xh.mjs");
var Route$58 = createFileRoute("/tools/poll")({ component: lazyRouteComponent($$splitComponentImporter$54, "component") });
var $$splitComponentImporter$53 = () => import("./tools.pomodoro-6JLrR2QR.mjs");
var Route$57 = createFileRoute("/tools/pomodoro")({
	head: () => ({ meta: [{ title: "Pomodoro Timer — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$53, "component")
});
var $$splitComponentImporter$52 = () => import("./tools.pomodoro-advanced-BJSfpoQU.mjs");
var Route$56 = createFileRoute("/tools/pomodoro-advanced")({ component: lazyRouteComponent($$splitComponentImporter$52, "component") });
var $$splitComponentImporter$51 = () => import("./tools.prayer-schedule-VOBP7Hi2.mjs");
var Route$55 = createFileRoute("/tools/prayer-schedule")({ component: lazyRouteComponent($$splitComponentImporter$51, "component") });
var Route$54 = createFileRoute("/tools/qibla")({ component: QiblaCompass });
var cities = {
	"Mecca": {
		lat: 21.4225,
		lng: 39.8262
	},
	"Medina": {
		lat: 24.4539,
		lng: 39.6142
	},
	"Riyadh": {
		lat: 24.7136,
		lng: 46.6753
	},
	"Dubai": {
		lat: 25.2048,
		lng: 55.2708
	},
	"Istanbul": {
		lat: 41.0082,
		lng: 28.9784
	},
	"Cairo": {
		lat: 30.0444,
		lng: 31.2357
	},
	"Lahore": {
		lat: 31.5204,
		lng: 74.3587
	},
	"Karachi": {
		lat: 24.8607,
		lng: 67.0011
	},
	"Mumbai": {
		lat: 19.076,
		lng: 72.8777
	},
	"Delhi": {
		lat: 28.7041,
		lng: 77.1025
	},
	"Kuala Lumpur": {
		lat: 3.139,
		lng: 101.6869
	},
	"Jakarta": {
		lat: -6.2088,
		lng: 106.8456
	},
	"London": {
		lat: 51.5074,
		lng: -.1278
	},
	"Paris": {
		lat: 48.8566,
		lng: 2.3522
	},
	"New York": {
		lat: 40.7128,
		lng: -74.006
	},
	"Los Angeles": {
		lat: 34.0522,
		lng: -118.2437
	},
	"Toronto": {
		lat: 43.6532,
		lng: -79.3832
	},
	"Sydney": {
		lat: -33.8688,
		lng: 151.2093
	},
	"Tokyo": {
		lat: 35.6762,
		lng: 139.6503
	},
	"Dhaka": {
		lat: 23.8103,
		lng: 90.4125
	},
	"Islamabad": {
		lat: 33.6844,
		lng: 73.0479
	},
	"Abu Dhabi": {
		lat: 24.4539,
		lng: 54.3773
	},
	"Doha": {
		lat: 25.2854,
		lng: 51.531
	},
	"Kuwait City": {
		lat: 29.3759,
		lng: 47.9774
	},
	"Amman": {
		lat: 31.9454,
		lng: 35.9284
	},
	"Baghdad": {
		lat: 33.3152,
		lng: 44.3661
	},
	"Tehran": {
		lat: 35.6892,
		lng: 51.389
	},
	"Casablanca": {
		lat: 33.5731,
		lng: -7.5898
	},
	"Lagos": {
		lat: 6.5244,
		lng: 3.3792
	},
	"Nairobi": {
		lat: -1.2921,
		lng: 36.8219
	}
};
var getQiblaDirection = (lat, lng) => {
	const meccaLat = 21.3891 * (Math.PI / 180);
	const meccaLng = 39.8579 * (Math.PI / 180);
	const userLat = lat * (Math.PI / 180);
	const userLng = lng * (Math.PI / 180);
	const y = Math.sin(meccaLng - userLng);
	const x = Math.cos(userLat) * Math.tan(meccaLat) - Math.sin(userLat) * Math.cos(meccaLng - userLng);
	return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
};
var getDistance = (lat1, lng1) => {
	const R = 6371;
	const mLat = 21.3891;
	const mLng = 39.8579;
	const dLat = (mLat - lat1) * Math.PI / 180;
	const dLng = (mLng - lng1) * Math.PI / 180;
	const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(mLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
function QiblaCompass() {
	const [state, setState] = (0, import_react.useState)("idle");
	const [qiblaAngle, setQiblaAngle] = (0, import_react.useState)(0);
	const [distance, setDistance] = (0, import_react.useState)(0);
	const [lat, setLat] = (0, import_react.useState)(0);
	const [lng, setLng] = (0, import_react.useState)(0);
	const [manualCity, setManualCity] = (0, import_react.useState)("");
	const [deviceAngle, setDeviceAngle] = (0, import_react.useState)(0);
	const [useDevice, setUseDevice] = (0, import_react.useState)(false);
	const compassRef = (0, import_react.useRef)(null);
	const requestLocation = () => {
		setState("loading");
		navigator.geolocation?.getCurrentPosition((pos) => {
			const { latitude, longitude } = pos.coords;
			setLat(latitude);
			setLng(longitude);
			setQiblaAngle(getQiblaDirection(latitude, longitude));
			setDistance(getDistance(latitude, longitude));
			setState("done");
		}, () => setState("manual"), {
			enableHighAccuracy: true,
			timeout: 1e4
		});
	};
	const selectCity = (city) => {
		const c = cities[city];
		if (!c) return;
		setLat(c.lat);
		setLng(c.lng);
		setQiblaAngle(getQiblaDirection(c.lat, c.lng));
		setDistance(getDistance(c.lat, c.lng));
		setManualCity(city);
		setState("done");
	};
	(0, import_react.useEffect)(() => {
		if (!useDevice || state !== "done") return;
		const handler = (e) => {
			if (e.alpha !== null) setDeviceAngle(e.alpha);
		};
		window.addEventListener("deviceorientation", handler);
		return () => window.removeEventListener("deviceorientation", handler);
	}, [useDevice, state]);
	const compassRotation = useDevice ? (qiblaAngle - deviceAngle + 360) % 360 : qiblaAngle;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 lg:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-foreground",
						children: "🧭 Qibla Compass"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Find the direction of Mecca from anywhere"
					})]
				}),
				state === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-8 text-center space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-4xl",
								children: "🕌"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-semibold text-foreground",
							children: "Find Qibla Direction"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Allow location access or select a city to find the direction of Mecca"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: requestLocation,
							className: "w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90",
							children: "📍 Allow Location Access"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setState("manual"),
							className: "w-full rounded-xl border border-border bg-surface py-3 text-sm text-foreground hover:bg-background",
							children: "🏙 Select City Instead"
						})
					]
				}),
				state === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-8 text-center space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Getting your location..."
					})]
				}),
				state === "manual" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-foreground",
						children: "Select your city"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2 max-h-64 overflow-y-auto",
						children: Object.keys(cities).map((city) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => selectCity(city),
							className: "rounded-lg border border-border bg-background p-2 text-xs text-foreground hover:bg-primary/10",
							children: city
						}, city))
					})]
				}),
				state === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-72 w-72",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full border-2 border-border bg-surface" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute left-1/2 top-2 -translate-x-1/2 text-xs font-bold text-red-400",
										children: "N"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-muted-foreground",
										children: "S"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground",
										children: "W"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground",
										children: "E"
									}),
									Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute left-1/2 top-1/2 h-full w-px origin-bottom",
										style: {
											transform: `translate(-50%, -100%) rotate(${deg}deg)`,
											background: deg % 90 === 0 ? "#8b949e" : "#21262d"
										}
									}, deg)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										ref: compassRef,
										className: "absolute left-1/2 top-1/2 h-24 w-1 origin-bottom transition-transform duration-1000 ease-out",
										style: { transform: `translate(-50%, -100%) rotate(${compassRotation}deg)` },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1/2 w-full rounded-t-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1/2 w-full rounded-b-full bg-primary/30" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full",
										style: { transform: `translate(-50%, -100%) rotate(${compassRotation}deg) translateY(-88px)` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg",
											children: "🕋"
										})
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4 text-center space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-2xl font-bold text-primary",
									children: [qiblaAngle.toFixed(1), "°"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "from North"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm text-foreground",
									children: [Math.round(distance).toLocaleString(), " km from Mecca"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground/60",
									children: [
										lat.toFixed(4),
										", ",
										lng.toFixed(4),
										" ",
										manualCity && `(${manualCity})`
									]
								})
							]
						}),
						typeof DeviceOrientationEvent !== "undefined" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setUseDevice(!useDevice),
							className: `w-full rounded-xl py-3 text-sm font-semibold transition-colors ${useDevice ? "bg-primary text-background" : "border border-border bg-surface text-foreground hover:bg-background"}`,
							children: useDevice ? "📱 Using device compass — rotate your phone" : "📱 Use device compass"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setState("idle"),
							className: "w-full rounded-xl border border-border bg-surface py-3 text-sm text-muted-foreground hover:text-foreground",
							children: "🔄 Change Location"
						})
					]
				})
			]
		})
	});
}
var $$splitComponentImporter$50 = () => import("./tools.qr-code-DEBYZz0a.mjs");
var Route$53 = createFileRoute("/tools/qr-code")({ component: lazyRouteComponent($$splitComponentImporter$50, "component") });
var Route$52 = createFileRoute("/tools/quiz-maker")({ component: QuizMaker });
var emptyQuestion = () => ({
	text: "",
	options: [
		"",
		"",
		"",
		""
	],
	correct: 0,
	explanation: ""
});
var STORAGE_KEY = "slashai-my-quizzes";
function QuizMaker() {
	const [mode, setMode] = (0, import_react.useState)(() => {
		if (new URLSearchParams(window.location.search).get("q")) return "play";
		return "list";
	});
	const [quizzes, setQuizzes] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
		} catch {
			return [];
		}
	});
	const [quiz, setQuiz] = (0, import_react.useState)(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get("q")) try {
			return JSON.parse(decodeURIComponent(atob(params.get("q"))));
		} catch {}
		return {
			title: "",
			questions: [emptyQuestion()]
		};
	});
	const [currentQ, setCurrentQ] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)([]);
	const [showResult, setShowResult] = (0, import_react.useState)(false);
	const [shareUrl, setShareUrl] = (0, import_react.useState)("");
	const addQuestion = () => setQuiz((q) => ({
		...q,
		questions: [...q.questions, emptyQuestion()]
	}));
	const removeQuestion = (i) => setQuiz((q) => ({
		...q,
		questions: q.questions.filter((_, idx) => idx !== i)
	}));
	const updateQuestion = (i, field, value) => {
		setQuiz((q) => {
			const questions = [...q.questions];
			const existing = questions[i];
			if (!existing) return q;
			questions[i] = {
				...existing,
				[field]: value
			};
			return {
				...q,
				questions
			};
		});
	};
	const updateOption = (qi, oi, val) => {
		setQuiz((q) => {
			const questions = [...q.questions];
			const existing = questions[qi];
			if (!existing) return q;
			const opts = [...existing.options];
			opts[oi] = val;
			questions[qi] = {
				...existing,
				options: opts
			};
			return {
				...q,
				questions
			};
		});
	};
	const saveQuiz = () => {
		setQuizzes((prev) => {
			const updated = [...prev, quiz];
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
			return updated;
		});
		setMode("list");
	};
	const startPlay = (q) => {
		setQuiz(q);
		setCurrentQ(0);
		setAnswers([]);
		setShowResult(false);
		setMode("play");
	};
	const answerQuestion = (idx) => {
		if (answers.length > currentQ) return;
		const newAnswers = [...answers, idx];
		setAnswers(newAnswers);
		setShowResult(true);
	};
	const nextQuestion = () => {
		if (currentQ < quiz.questions.length - 1) {
			setCurrentQ(currentQ + 1);
			setShowResult(false);
		}
	};
	const generateShare = () => {
		const encoded = btoa(encodeURIComponent(JSON.stringify(quiz)));
		const url = `${window.location.origin}/tools/quiz-maker?q=${encoded}`;
		setShareUrl(url);
		navigator.clipboard?.writeText(url);
	};
	const deleteQuiz = (i) => {
		setQuizzes((prev) => {
			const updated = prev.filter((_, idx) => idx !== i);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
			return updated;
		});
	};
	const score = answers.filter((a, i) => a === (quiz.questions[i]?.correct ?? 0)).length;
	if (mode === "play" && quiz.questions.length > 0) {
		const q = quiz.questions[currentQ];
		const answered = currentQ < answers.length;
		const finished = currentQ >= quiz.questions.length - 1 && answered;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-screen bg-background p-4 lg:p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("list"),
						className: "text-sm text-primary hover:underline",
						children: "← Back to quizzes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold text-foreground",
						children: quiz.title || "Quiz"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 w-full overflow-hidden rounded-full bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary transition-all",
							style: { width: `${(currentQ + 1) / quiz.questions.length * 100}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"Question ",
							currentQ + 1,
							" of ",
							quiz.questions.length
						]
					}),
					finished ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-8 text-center space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-5xl",
								children: score === quiz.questions.length ? "🎉" : score > quiz.questions.length / 2 ? "👍" : "💪"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-2xl font-bold text-foreground",
								children: [
									score,
									"/",
									quiz.questions.length
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: score === quiz.questions.length ? "Perfect score!" : `You got ${Math.round(score / quiz.questions.length * 100)}% correct`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: generateShare,
									className: "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background",
									children: "🔗 Share Quiz"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => startPlay(quiz),
									className: "rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground",
									children: "🔄 Try Again"
								})]
							}),
							shareUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-primary break-all",
								children: shareUrl
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold text-foreground",
								children: q.text
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: q.options.map((opt, i) => {
									if (!opt) return null;
									const isCorrect = i === q.correct;
									const isSelected = answered && answers[currentQ] === i;
									let cls = "border border-border bg-surface hover:bg-background";
									if (answered && isCorrect) cls = "border border-green-500/50 bg-green-500/10";
									else if (answered && isSelected) cls = "border border-red-500/50 bg-red-500/10";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => answerQuestion(i),
										disabled: answered,
										className: `w-full rounded-xl px-4 py-3 text-left text-sm transition-colors ${cls}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium text-foreground",
												children: [String.fromCharCode(65 + i), "."]
											}),
											" ",
											opt
										]
									}, i);
								})
							}),
							showResult && q.explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground",
								children: ["💡 ", q.explanation]
							}),
							showResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: nextQuestion,
								className: "w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90",
								children: currentQ < quiz.questions.length - 1 ? "Next Question →" : "See Results"
							})
						]
					})
				]
			})
		});
	}
	if (mode === "build") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 lg:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-foreground",
						children: "❓ Quiz Builder"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("list"),
						className: "text-sm text-primary hover:underline",
						children: "← Back"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: quiz.title,
					onChange: (e) => setQuiz({
						...quiz,
						title: e.target.value
					}),
					placeholder: "Quiz title...",
					className: "w-full rounded-xl border border-border bg-surface px-4 py-3 text-lg font-semibold text-foreground"
				}),
				quiz.questions.map((q, qi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold text-foreground",
								children: ["Q", qi + 1]
							}), quiz.questions.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => removeQuestion(qi),
								className: "text-xs text-red-400 hover:text-red-300",
								children: "Remove"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q.text,
							onChange: (e) => updateQuestion(qi, "text", e.target.value),
							placeholder: "Question text...",
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: q.options.map((opt, oi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => updateQuestion(qi, "correct", oi),
									className: `h-6 w-6 rounded-full border-2 text-xs ${q.correct === oi ? "border-green-500 bg-green-500/20 text-green-400" : "border-border text-muted-foreground"}`,
									children: String.fromCharCode(65 + oi)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: opt,
									onChange: (e) => updateOption(qi, oi, e.target.value),
									placeholder: `Option ${String.fromCharCode(65 + oi)}`,
									className: "flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
								})]
							}, oi))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q.explanation,
							onChange: (e) => updateQuestion(qi, "explanation", e.target.value),
							placeholder: "Explanation (shown after answer)...",
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
						})
					]
				}, qi)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: addQuestion,
						className: "flex-1 rounded-xl border border-border bg-surface py-3 text-sm text-foreground hover:bg-background",
						children: "+ Add Question"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: saveQuiz,
						disabled: !quiz.title || quiz.questions.some((q) => !q.text),
						className: "flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
						children: "💾 Save Quiz"
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 lg:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "❓ Quiz Builder"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Build and share quizzes — no account needed"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMode("build"),
					className: "rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-background hover:opacity-90",
					children: "+ Create Quiz"
				})]
			}), quizzes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 text-5xl",
						children: "📝"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-lg font-semibold text-foreground",
						children: "No quizzes yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Create your first quiz and share it with anyone!"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: quizzes.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-foreground",
						children: q.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [q.questions.length, " questions"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => startPlay(q),
								className: "rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-background",
								children: "▶ Play"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setQuiz(q);
									setMode("build");
								},
								className: "rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground",
								children: "✏️ Edit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => deleteQuiz(i),
								className: "rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-red-400",
								children: "🗑"
							})
						]
					})]
				}, i))
			})]
		})
	});
}
var $$splitComponentImporter$49 = () => import("./tools.quote-maker-CZI6jLR_.mjs");
var Route$51 = createFileRoute("/tools/quote-maker")({ component: lazyRouteComponent($$splitComponentImporter$49, "component") });
var $$splitComponentImporter$48 = () => import("./tools.quote-screen-ZCII78mU.mjs");
var Route$50 = createFileRoute("/tools/quote-screen")({
	head: () => ({ meta: [{ title: "Quote of the Day — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
var $$splitComponentImporter$47 = () => import("./tools.quran-search-C_RcGK7L.mjs");
var Route$49 = createFileRoute("/tools/quran-search")({ component: lazyRouteComponent($$splitComponentImporter$47, "component") });
var $$splitComponentImporter$46 = () => import("./tools.rain-screen-Cij5xbSc.mjs");
var Route$48 = createFileRoute("/tools/rain-screen")({
	head: () => ({ meta: [{ title: "Rain Screen — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
var $$splitComponentImporter$45 = () => import("./tools.random-number-BLUCQ5gM.mjs");
var Route$47 = createFileRoute("/tools/random-number")({ component: lazyRouteComponent($$splitComponentImporter$45, "component") });
var $$splitComponentImporter$44 = () => import("./tools.readability--vR-lYTQ.mjs");
var Route$46 = createFileRoute("/tools/readability")({
	head: () => ({ meta: [{ title: "Text Readability Analyser — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
var $$splitComponentImporter$43 = () => import("./tools.readability2-LpIl3wZ_.mjs");
var Route$45 = createFileRoute("/tools/readability2")({ component: lazyRouteComponent($$splitComponentImporter$43, "component") });
var $$splitComponentImporter$42 = () => import("./tools.reading-BQulobLu.mjs");
var Route$44 = createFileRoute("/tools/reading")({ component: lazyRouteComponent($$splitComponentImporter$42, "component") });
var $$splitComponentImporter$41 = () => import("./tools.reading-list-CywU1vjk.mjs");
var Route$43 = createFileRoute("/tools/reading-list")({ component: lazyRouteComponent($$splitComponentImporter$41, "component") });
var $$splitComponentImporter$40 = () => import("./tools.recipe-scaler-B2UAAiBf.mjs");
var Route$42 = createFileRoute("/tools/recipe-scaler")({ component: lazyRouteComponent($$splitComponentImporter$40, "component") });
var $$splitComponentImporter$39 = () => import("./tools.regex-CtT3kpZc.mjs");
var Route$41 = createFileRoute("/tools/regex")({
	head: () => ({ meta: [{ title: "Regex Playground — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
var $$splitComponentImporter$38 = () => import("./tools.regex-tester-DG6dZpPP.mjs");
var Route$40 = createFileRoute("/tools/regex-tester")({ component: lazyRouteComponent($$splitComponentImporter$38, "component") });
var $$splitComponentImporter$37 = () => import("./tools.roman-numeral-f_ktCb_N.mjs");
var Route$39 = createFileRoute("/tools/roman-numeral")({ component: lazyRouteComponent($$splitComponentImporter$37, "component") });
var $$splitComponentImporter$36 = () => import("./tools.sadaqah-8C5qMwsI.mjs");
var Route$38 = createFileRoute("/tools/sadaqah")({ component: lazyRouteComponent($$splitComponentImporter$36, "component") });
var $$splitComponentImporter$35 = () => import("./tools.scanner-s13vp-Ow.mjs");
var Route$37 = createFileRoute("/tools/scanner")({
	head: () => ({ meta: [{ title: "Document Scanner — turn photos into clean scans | SlashAI" }, {
		name: "description",
		content: "Scan documents with your camera or an uploaded photo. Enhance, black & white, multi-page, export as JPG or PDF — all in your browser."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
/** Downscale wide images so pages stay small enough to persist + export fast. */
/** Pixel-level enhancement applied on export / preview. */
var $$splitComponentImporter$34 = () => import("./tools.screenshot-B5N106rL.mjs");
var Route$36 = createFileRoute("/tools/screenshot")({ component: lazyRouteComponent($$splitComponentImporter$34, "component") });
var $$splitComponentImporter$33 = () => import("./tools.shortcut-DcJ_At4U.mjs");
var Route$35 = createFileRoute("/tools/shortcut")({ component: lazyRouteComponent($$splitComponentImporter$33, "component") });
var $$splitComponentImporter$32 = () => import("./tools.sip-calculator-D1PoIJ0b.mjs");
var Route$34 = createFileRoute("/tools/sip-calculator")({
	head: () => ({ meta: [{ title: "SIP Calculator — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./tools.size-Cok_KnEs.mjs");
var Route$33 = createFileRoute("/tools/size")({ component: lazyRouteComponent($$splitComponentImporter$31, "component") });
var $$splitComponentImporter$30 = () => import("./tools.sleep-calc-DnXM95Db.mjs");
var Route$32 = createFileRoute("/tools/sleep-calc")({ component: lazyRouteComponent($$splitComponentImporter$30, "component") });
var $$splitComponentImporter$29 = () => import("./tools.smart-paste-Css-uzCO.mjs");
var Route$31 = createFileRoute("/tools/smart-paste")({
	head: () => ({ meta: [{ title: "Smart Paste Bin — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./tools.speech-to-text-D2LEYVIY.mjs");
var Route$30 = createFileRoute("/tools/speech-to-text")({ component: lazyRouteComponent($$splitComponentImporter$28, "component") });
var $$splitComponentImporter$27 = () => import("./tools.spelling-DOTtspcL.mjs");
var Route$29 = createFileRoute("/tools/spelling")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
var $$splitComponentImporter$26 = () => import("./tools.standup-BcpvO2Cf.mjs");
var Route$28 = createFileRoute("/tools/standup")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
var $$splitComponentImporter$25 = () => import("./tools.starfield-0xDY3JD8.mjs");
var Route$27 = createFileRoute("/tools/starfield")({
	head: () => ({ meta: [{ title: "Starfield — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./tools.sticker-BZa_0BKs.mjs");
var Route$26 = createFileRoute("/tools/sticker")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./tools.stopwatch-Djtes0ve.mjs");
var Route$25 = createFileRoute("/tools/stopwatch")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var Route$24 = createFileRoute("/tools/story")({ component: StoryWritingKit });
var prompts = {
	"Romance": [
		"A letter arrives 20 years late, addressed to someone you've never met.",
		"Two strangers share the same recurring dream every night.",
		"You find a love letter in a used book at a thrift store — it's addressed to you.",
		"Your childhood imaginary friend turns out to be real.",
		"You discover a hidden room in your new apartment that someone else has been living in."
	],
	"Thriller": [
		"You wake up in a locked room with 5 strangers and a note: one of you is the killer.",
		"Your phone autocorrects to reveal messages you never sent.",
		"You receive a package with tomorrow's newspaper — you're on the front page.",
		"The last person on Earth hears a knock at the door.",
		"You find security footage of yourself doing something you have no memory of."
	],
	"Horror": [
		"Your shadow moves independently of your body.",
		"Every mirror in your house shows a slightly different version of you.",
		"You hear a voice through the baby monitor — it's yours, but coming from another room.",
		"The stop-motion figures in your child's room have moved since yesterday.",
		"You receive a phone call from your own number."
	],
	"Fantasy": [
		"You discover you can taste emotions as flavors.",
		"A door appears in your wall every full moon, leading to a different world.",
		"The creatures from your childhood nightmares have formed a union.",
		"You inherit a map to a place that doesn't exist on any other map.",
		"Words spoken in anger become physically visible, floating in the air."
	],
	"Sci-Fi": [
		"You wake up as the only human on a space station orbiting an unfamiliar planet.",
		"Time moves at different speeds in different rooms of your house.",
		"You find a USB drive containing 50 years of future news articles.",
		"Aliens make contact, but their message is a TikTok dance.",
		"You discover that déjà vu is actually your brain remembering a parallel universe."
	],
	"Islamic Fiction": [
		"A Quran teacher discovers that a student's ancestor wrote a lost commentary.",
		"During Hajj, a man finds a 300-year-old journal hidden in the Kaaba walls.",
		"A mosque's old key opens a door no one has entered in centuries.",
		"A calligrapher's pen writes words of someone who hasn't been born yet.",
		"During Laylat al-Qadr, every dua you make starts coming true — but with unexpected twists."
	],
	"Literary": [
		"A librarian discovers that the library's forgotten section contains books not yet written.",
		"You receive a letter from yourself, ten years in the future, with one instruction.",
		"A lighthouse keeper realizes the ships they've been warning are all from different centuries.",
		"Your autobiography writes itself while you sleep.",
		"The last conversation you ever have with someone turns out to be the one they remember forever."
	]
};
var moods = [
	"Hopeful",
	"Dark",
	"Whimsical",
	"Intense",
	"Melancholic"
];
function StoryWritingKit() {
	const [tab, setTab] = (0, import_react.useState)("prompts");
	const [selectedGenre, setSelectedGenre] = (0, import_react.useState)("");
	const [selectedMood, setSelectedMood] = (0, import_react.useState)("");
	const [currentPrompt, setCurrentPrompt] = (0, import_react.useState)("");
	const [chars, setChars] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("slashai-story-chars") || "[]");
		} catch {
			return [];
		}
	});
	const [charName, setCharName] = (0, import_react.useState)("");
	const [charRole, setCharRole] = (0, import_react.useState)("hero");
	const [charTraits, setCharTraits] = (0, import_react.useState)([]);
	const [charStory, setCharStory] = (0, import_react.useState)("");
	const [charMot, setCharMot] = (0, import_react.useState)("");
	const traitOptions = [
		"Brave",
		"Witty",
		"Loyal",
		"Mysterious",
		"Kind",
		"Cunning",
		"Strong",
		"Quiet",
		"Passionate",
		"Wise",
		"Reckless",
		"Compassionate"
	];
	const addChar = () => {
		if (!charName) return;
		const updated = [...chars, {
			name: charName,
			role: charRole,
			traits: charTraits,
			backstory: charStory,
			motivation: charMot
		}];
		setChars(updated);
		localStorage.setItem("slashai-story-chars", JSON.stringify(updated));
		setCharName("");
		setCharTraits([]);
		setCharStory("");
		setCharMot("");
	};
	const removeChar = (i) => {
		const updated = chars.filter((_, idx) => idx !== i);
		setChars(updated);
		localStorage.setItem("slashai-story-chars", JSON.stringify(updated));
	};
	const [plot, setPlot] = (0, import_react.useState)({
		setup: "",
		rising: "",
		climax: "",
		falling: "",
		resolution: ""
	});
	const filterPrompts = () => {
		let pool = [];
		if (selectedGenre) pool = [...prompts[selectedGenre] || []];
		else pool = Object.values(prompts).flat();
		if (selectedMood) pool = pool.filter((_, i) => i % (moods.indexOf(selectedMood) + 2) === 0);
		return pool;
	};
	const shufflePrompt = () => {
		const pool = filterPrompts();
		setCurrentPrompt(pool[Math.floor(Math.random() * pool.length)] || "Write about something that changed you forever.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 lg:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "📖 Story Writing Kit"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Plan, write and structure stories"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 rounded-xl bg-surface p-1",
					children: [
						{
							id: "prompts",
							label: "✨ Prompts"
						},
						{
							id: "characters",
							label: "👤 Characters"
						},
						{
							id: "plot",
							label: "🗺️ Plot"
						}
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(t.id),
						className: `flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${tab === t.id ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground"}`,
						children: t.label
					}, t.id))
				}),
				tab === "prompts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold text-foreground",
									children: "Filter"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setSelectedGenre("");
											setCurrentPrompt("");
										},
										className: `rounded-lg px-3 py-1.5 text-xs ${!selectedGenre ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`,
										children: "All"
									}), Object.keys(prompts).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setSelectedGenre(g);
											setCurrentPrompt("");
										},
										className: `rounded-lg px-3 py-1.5 text-xs ${selectedGenre === g ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`,
										children: g
									}, g))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: moods.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSelectedMood(selectedMood === m ? "" : m),
										className: `rounded-lg px-3 py-1.5 text-xs ${selectedMood === m ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`,
										children: m
									}, m))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: shufflePrompt,
									className: "w-full rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90",
									children: "🎲 Random Prompt"
								})
							]
						}),
						currentPrompt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-primary/30 bg-primary/5 p-6 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-medium text-foreground",
								children: currentPrompt
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold text-foreground",
								children: "Browse Prompts"
							}), filterPrompts().map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCurrentPrompt(p),
								className: "w-full rounded-xl border border-border bg-surface p-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground",
								children: p
							}, i))]
						})
					]
				}),
				tab === "characters" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold text-foreground",
								children: "Create Character"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: charName,
								onChange: (e) => setCharName(e.target.value),
								placeholder: "Character name",
								className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: charRole,
								onChange: (e) => setCharRole(e.target.value),
								className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
								children: [
									"hero",
									"villain",
									"mentor",
									"comic relief",
									"love interest",
									"sidekick"
								].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: r,
									children: r
								}, r))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs text-muted-foreground",
								children: "Personality Traits"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: traitOptions.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setCharTraits((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]),
									className: `rounded-lg px-2 py-1 text-xs ${charTraits.includes(t) ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`,
									children: t
								}, t))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: charStory,
								onChange: (e) => setCharStory(e.target.value),
								placeholder: "Backstory...",
								rows: 3,
								className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: charMot,
								onChange: (e) => setCharMot(e.target.value),
								placeholder: "Motivation / Goal / Fear",
								className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: addChar,
								disabled: !charName,
								className: "w-full rounded-xl bg-primary py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
								children: "Add Character"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: chars.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-semibold text-foreground",
										children: c.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeChar(i),
										className: "text-xs text-red-400",
										children: "Remove"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-primary capitalize",
									children: c.role
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-1",
									children: c.traits.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-primary/10 px-2 py-0.5 text-xs text-primary",
										children: t
									}, t))
								}),
								c.backstory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: c.backstory
								}),
								c.motivation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: ["🎯 ", c.motivation]
								})
							]
						}, i))
					})]
				}),
				tab === "plot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-4 text-sm font-semibold text-foreground",
							children: "5-Act Story Structure"
						}), [
							{
								key: "setup",
								label: "1. Setup",
								color: "#58a6ff"
							},
							{
								key: "rising",
								label: "2. Rising Action",
								color: "#3fb950"
							},
							{
								key: "climax",
								label: "3. Climax",
								color: "#d29922"
							},
							{
								key: "falling",
								label: "4. Falling Action",
								color: "#f0883e"
							},
							{
								key: "resolution",
								label: "5. Resolution",
								color: "#a371f7"
							}
						].map((act) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1 flex items-center gap-2 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-3 w-3 rounded-full inline-block",
									style: { background: act.color }
								}), act.label]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: plot[act.key],
								onChange: (e) => setPlot((p) => ({
									...p,
									[act.key]: e.target.value
								})),
								placeholder: `What happens in ${act.label.toLowerCase()}...`,
								rows: 3,
								className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
							})]
						}, act.key))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 text-sm font-semibold text-foreground",
							children: "Story Arc"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 400 120",
							className: "w-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M 20 100 Q 100 100, 160 40 Q 200 0, 240 40 Q 300 100, 380 100",
									fill: "none",
									stroke: "#58a6ff",
									strokeWidth: "2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: 40,
									cy: 95,
									r: 5,
									fill: "#58a6ff"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: 40,
									y: 115,
									textAnchor: "middle",
									fill: "#8b949e",
									fontSize: "8",
									children: "Setup"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: 140,
									cy: 50,
									r: 5,
									fill: "#3fb950"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: 140,
									y: 115,
									textAnchor: "middle",
									fill: "#8b949e",
									fontSize: "8",
									children: "Rising"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: 200,
									cy: 15,
									r: 6,
									fill: "#d29922"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: 200,
									y: 115,
									textAnchor: "middle",
									fill: "#8b949e",
									fontSize: "8",
									children: "Climax"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: 260,
									cy: 50,
									r: 5,
									fill: "#f0883e"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: 260,
									y: 115,
									textAnchor: "middle",
									fill: "#8b949e",
									fontSize: "8",
									children: "Falling"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: 360,
									cy: 95,
									r: 5,
									fill: "#a371f7"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: 360,
									y: 115,
									textAnchor: "middle",
									fill: "#8b949e",
									fontSize: "8",
									children: "End"
								})
							]
						})]
					})]
				})
			]
		})
	});
}
var $$splitComponentImporter$22 = () => import("./tools.string-hash-BWvsNMP_.mjs");
var Route$23 = createFileRoute("/tools/string-hash")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./tools.svg-preview-BW3ygYo0.mjs");
var Route$22 = createFileRoute("/tools/svg-preview")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./tools.table-DBiqHNRm.mjs");
var Route$21 = createFileRoute("/tools/table")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./tools.tasbeeh-Xfsbf_GI.mjs");
var Route$20 = createFileRoute("/tools/tasbeeh")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./tools.text-case-DIJl5BeQ.mjs");
var Route$19 = createFileRoute("/tools/text-case")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./tools.text-stats-DEHL-24h.mjs");
var Route$18 = createFileRoute("/tools/text-stats")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./tools.text-to-speech-BPqVKEFH.mjs");
var Route$17 = createFileRoute("/tools/text-to-speech")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./tools.thread-maker-DOYALLY3.mjs");
var Route$16 = createFileRoute("/tools/thread-maker")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./tools.thumbnail-BZa_PVYS.mjs");
var Route$15 = createFileRoute("/tools/thumbnail")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./tools.timestamp-sL9r-orx.mjs");
var Route$14 = createFileRoute("/tools/timestamp")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./tools.timezone-converter-B1dHEMMs.mjs");
var Route$13 = createFileRoute("/tools/timezone-converter")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./tools.tip-calculator-DJwkUYbW.mjs");
var Route$12 = createFileRoute("/tools/tip-calculator")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./tools.typing-test-BB7LGoKj.mjs");
var Route$11 = createFileRoute("/tools/typing-test")({
	head: () => ({ meta: [{ title: "Typing Speed Test — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./tools.unicode-lookup-YhKdUkj-.mjs");
var Route$10 = createFileRoute("/tools/unicode-lookup")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./tools.unit-converter-LI0qkfoD.mjs");
var Route$9 = createFileRoute("/tools/unit-converter")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./tools.upi-D2RDEShL.mjs");
var Route$8 = createFileRoute("/tools/upi")({
	head: () => ({ meta: [{ title: "UPI Payment Link Generator — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./tools.url-encoder-B-yy9iUr.mjs");
var Route$7 = createFileRoute("/tools/url-encoder")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./tools.vcard-gen-DAElP_sA.mjs");
var Route$6 = createFileRoute("/tools/vcard-gen")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./tools.water-tracker-C7IrdL6W.mjs");
var Route$5 = createFileRoute("/tools/water-tracker")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./tools.watermark-Xjy2CmUA.mjs");
var Route$4 = createFileRoute("/tools/watermark")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./tools.whitespace-O9k-teSJ.mjs");
var Route$3 = createFileRoute("/tools/whitespace")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./tools.wifi-qr-BgQrkhGg.mjs");
var Route$2 = createFileRoute("/tools/wifi-qr")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./tools.world-clock-DeLa0bbm.mjs");
var Route$1 = createFileRoute("/tools/world-clock")({
	head: () => ({ meta: [{ title: "World Clock — SlashAI" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$215.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$216
});
var AboutRoute = Route$214.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$216
});
var AiToolsRoute = Route$213.update({
	id: "/ai-tools",
	path: "/ai-tools",
	getParentRoute: () => Route$216
});
var AlternativesRoute = Route$212.update({
	id: "/alternatives",
	path: "/alternatives",
	getParentRoute: () => Route$216
});
var AssistantRoute = Route$211.update({
	id: "/assistant",
	path: "/assistant",
	getParentRoute: () => Route$216
});
var ChangelogRoute = Route$210.update({
	id: "/changelog",
	path: "/changelog",
	getParentRoute: () => Route$216
});
var CompareRoute = Route$209.update({
	id: "/compare",
	path: "/compare",
	getParentRoute: () => Route$216
});
var ContactRoute = Route$208.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$216
});
var DealsRoute = Route$207.update({
	id: "/deals",
	path: "/deals",
	getParentRoute: () => Route$216
});
var DesignsRoute = Route$206.update({
	id: "/designs",
	path: "/designs",
	getParentRoute: () => Route$216
});
var FavoritesRoute = Route$205.update({
	id: "/favorites",
	path: "/favorites",
	getParentRoute: () => Route$216
});
var FindRoute = Route$222.update({
	id: "/find",
	path: "/find",
	getParentRoute: () => Route$216
});
var GlassRoute = Route$204.update({
	id: "/glass",
	path: "/glass",
	getParentRoute: () => Route$216
});
var GlossaryRoute = Route$203.update({
	id: "/glossary",
	path: "/glossary",
	getParentRoute: () => Route$216
});
var GraphRoute = Route$202.update({
	id: "/graph",
	path: "/graph",
	getParentRoute: () => Route$216
});
var HunyuanRoute = Route$201.update({
	id: "/hunyuan",
	path: "/hunyuan",
	getParentRoute: () => Route$216
});
var JournalRoute = Route$200.update({
	id: "/journal",
	path: "/journal",
	getParentRoute: () => Route$216
});
var KeyboardRoute = Route$199.update({
	id: "/keyboard",
	path: "/keyboard",
	getParentRoute: () => Route$216
});
var LiveRoute = Route$198.update({
	id: "/live",
	path: "/live",
	getParentRoute: () => Route$216
});
var MeRoute = Route$197.update({
	id: "/me",
	path: "/me",
	getParentRoute: () => Route$216
});
var MoviesRoute = Route$196.update({
	id: "/movies",
	path: "/movies",
	getParentRoute: () => Route$216
});
var PlayRoute = Route$195.update({
	id: "/play",
	path: "/play",
	getParentRoute: () => Route$216
});
var PrivacyRoute = Route$194.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$216
});
var QuizRoute = Route$193.update({
	id: "/quiz",
	path: "/quiz",
	getParentRoute: () => Route$216
});
var RadarRoute = Route$192.update({
	id: "/radar",
	path: "/radar",
	getParentRoute: () => Route$216
});
var RecentRoute = Route$191.update({
	id: "/recent",
	path: "/recent",
	getParentRoute: () => Route$216
});
var RoadmapsRoute = Route$190.update({
	id: "/roadmaps",
	path: "/roadmaps",
	getParentRoute: () => Route$216
});
var SearchRoute = Route$227.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$216
});
var SettingsRoute = Route$189.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$216
});
var TermsRoute = Route$188.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$216
});
var ToolsRoute = Route$187.update({
	id: "/tools",
	path: "/tools",
	getParentRoute: () => Route$216
});
var TrendingRoute = Route$186.update({
	id: "/trending",
	path: "/trending",
	getParentRoute: () => Route$216
});
var WhatsNewRoute = Route$185.update({
	id: "/whats-new",
	path: "/whats-new",
	getParentRoute: () => Route$216
});
var WorkflowRoute = Route$184.update({
	id: "/workflow",
	path: "/workflow",
	getParentRoute: () => Route$216
});
var YoutubeRoute = Route$183.update({
	id: "/youtube",
	path: "/youtube",
	getParentRoute: () => Route$216
});
var AssistantAboutRoute = Route$182.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => AssistantRoute
});
var BuildIdeasIndexRoute = Route$181.update({
	id: "/build-ideas/",
	path: "/build-ideas/",
	getParentRoute: () => Route$216
});
var BuildIdeasSlugRoute = Route.update({
	id: "/build-ideas/$slug",
	path: "/build-ideas/$slug",
	getParentRoute: () => Route$216
});
var BuildIdeasProjectsRoute = Route$180.update({
	id: "/build-ideas/projects",
	path: "/build-ideas/projects",
	getParentRoute: () => Route$216
});
var BuildIdeasValidateRoute = Route$179.update({
	id: "/build-ideas/validate",
	path: "/build-ideas/validate",
	getParentRoute: () => Route$216
});
var CSlugRoute = Route$217.update({
	id: "/c/$slug",
	path: "/c/$slug",
	getParentRoute: () => Route$216
});
var CollectionsIndexRoute = Route$178.update({
	id: "/collections/",
	path: "/collections/",
	getParentRoute: () => Route$216
});
var CollectionsIdRoute = Route$218.update({
	id: "/collections/$id",
	path: "/collections/$id",
	getParentRoute: () => Route$216
});
var DiscoverIndexRoute = Route$177.update({
	id: "/discover/",
	path: "/discover/",
	getParentRoute: () => Route$216
});
var DiscoverSectionRoute = Route$219.update({
	id: "/discover/$section",
	path: "/discover/$section",
	getParentRoute: () => Route$216
});
var DiscoverReelsRoute = Route$176.update({
	id: "/discover/reels",
	path: "/discover/reels",
	getParentRoute: () => Route$216
});
var ExploreIndexRoute = Route$175.update({
	id: "/explore/",
	path: "/explore/",
	getParentRoute: () => Route$216
});
var GeneratorsIndexRoute = Route$174.update({
	id: "/generators/",
	path: "/generators/",
	getParentRoute: () => Route$216
});
var GeneratorsIdRoute = Route$223.update({
	id: "/generators/$id",
	path: "/generators/$id",
	getParentRoute: () => Route$216
});
var HubIndexRoute = Route$173.update({
	id: "/hub/",
	path: "/hub/",
	getParentRoute: () => Route$216
});
var HubAudienceRoute = Route$224.update({
	id: "/hub/$audience",
	path: "/hub/$audience",
	getParentRoute: () => Route$216
});
var HubArabicRoute = Route$172.update({
	id: "/hub/arabic",
	path: "/hub/arabic",
	getParentRoute: () => Route$216
});
var HubIslamRoute = Route$171.update({
	id: "/hub/islam",
	path: "/hub/islam",
	getParentRoute: () => Route$216
});
var HubQuotesRoute = Route$170.update({
	id: "/hub/quotes",
	path: "/hub/quotes",
	getParentRoute: () => Route$216
});
var HubUrduRoute = Route$169.update({
	id: "/hub/urdu",
	path: "/hub/urdu",
	getParentRoute: () => Route$216
});
var LUsernameRoute = Route$225.update({
	id: "/l/$username",
	path: "/l/$username",
	getParentRoute: () => Route$216
});
var RIdRoute = Route$226.update({
	id: "/r/$id",
	path: "/r/$id",
	getParentRoute: () => Route$216
});
var ToolsIndexRoute = Route$168.update({
	id: "/",
	path: "/",
	getParentRoute: () => ToolsRoute
});
var ToolsAgeCalculatorRoute = Route$167.update({
	id: "/age-calculator",
	path: "/age-calculator",
	getParentRoute: () => ToolsRoute
});
var ToolsAgeOfThingsRoute = Route$166.update({
	id: "/age-of-things",
	path: "/age-of-things",
	getParentRoute: () => ToolsRoute
});
var ToolsAlphabetCipherRoute = Route$165.update({
	id: "/alphabet-cipher",
	path: "/alphabet-cipher",
	getParentRoute: () => ToolsRoute
});
var ToolsAnalyzeRoute = Route$164.update({
	id: "/analyze",
	path: "/analyze",
	getParentRoute: () => ToolsRoute
});
var ToolsApiTesterRoute = Route$163.update({
	id: "/api-tester",
	path: "/api-tester",
	getParentRoute: () => ToolsRoute
});
var ToolsArabicKeyboardRoute = Route$162.update({
	id: "/arabic-keyboard",
	path: "/arabic-keyboard",
	getParentRoute: () => ToolsRoute
});
var ToolsAsciiRoute = Route$161.update({
	id: "/ascii",
	path: "/ascii",
	getParentRoute: () => ToolsRoute
});
var ToolsAspectRoute = Route$160.update({
	id: "/aspect",
	path: "/aspect",
	getParentRoute: () => ToolsRoute
});
var ToolsBase64Route = Route$159.update({
	id: "/base64",
	path: "/base64",
	getParentRoute: () => ToolsRoute
});
var ToolsBinaryCalculatorRoute = Route$158.update({
	id: "/binary-calculator",
	path: "/binary-calculator",
	getParentRoute: () => ToolsRoute
});
var ToolsBioRoute = Route$157.update({
	id: "/bio",
	path: "/bio",
	getParentRoute: () => ToolsRoute
});
var ToolsBmiCalculatorRoute = Route$156.update({
	id: "/bmi-calculator",
	path: "/bmi-calculator",
	getParentRoute: () => ToolsRoute
});
var ToolsBmiCalculator2Route = Route$155.update({
	id: "/bmi-calculator2",
	path: "/bmi-calculator2",
	getParentRoute: () => ToolsRoute
});
var ToolsBmiChartRoute = Route$154.update({
	id: "/bmi-chart",
	path: "/bmi-chart",
	getParentRoute: () => ToolsRoute
});
var ToolsBorderRadiusRoute = Route$153.update({
	id: "/border-radius",
	path: "/border-radius",
	getParentRoute: () => ToolsRoute
});
var ToolsBoxShadowRoute = Route$152.update({
	id: "/box-shadow",
	path: "/box-shadow",
	getParentRoute: () => ToolsRoute
});
var ToolsBudgetRoute = Route$151.update({
	id: "/budget",
	path: "/budget",
	getParentRoute: () => ToolsRoute
});
var ToolsCalorieRoute = Route$150.update({
	id: "/calorie",
	path: "/calorie",
	getParentRoute: () => ToolsRoute
});
var ToolsCalorieCalcRoute = Route$149.update({
	id: "/calorie-calc",
	path: "/calorie-calc",
	getParentRoute: () => ToolsRoute
});
var ToolsCertificateRoute = Route$148.update({
	id: "/certificate",
	path: "/certificate",
	getParentRoute: () => ToolsRoute
});
var ToolsChangelogMakerRoute = Route$147.update({
	id: "/changelog-maker",
	path: "/changelog-maker",
	getParentRoute: () => ToolsRoute
});
var ToolsCodeBeautifierRoute = Route$146.update({
	id: "/code-beautifier",
	path: "/code-beautifier",
	getParentRoute: () => ToolsRoute
});
var ToolsCodeScreenshotRoute = Route$145.update({
	id: "/code-screenshot",
	path: "/code-screenshot",
	getParentRoute: () => ToolsRoute
});
var ToolsCoinFlipRoute = Route$144.update({
	id: "/coin-flip",
	path: "/coin-flip",
	getParentRoute: () => ToolsRoute
});
var ToolsColorBlendRoute = Route$143.update({
	id: "/color-blend",
	path: "/color-blend",
	getParentRoute: () => ToolsRoute
});
var ToolsColorContrastRoute = Route$142.update({
	id: "/color-contrast",
	path: "/color-contrast",
	getParentRoute: () => ToolsRoute
});
var ToolsColorPaletteRoute = Route$141.update({
	id: "/color-palette",
	path: "/color-palette",
	getParentRoute: () => ToolsRoute
});
var ToolsColorPickerRoute = Route$140.update({
	id: "/color-picker",
	path: "/color-picker",
	getParentRoute: () => ToolsRoute
});
var ToolsContractRoute = Route$139.update({
	id: "/contract",
	path: "/contract",
	getParentRoute: () => ToolsRoute
});
var ToolsCountdownRoute = Route$138.update({
	id: "/countdown",
	path: "/countdown",
	getParentRoute: () => ToolsRoute
});
var ToolsCrackHashRoute = Route$137.update({
	id: "/crack-hash",
	path: "/crack-hash",
	getParentRoute: () => ToolsRoute
});
var ToolsCronRoute = Route$136.update({
	id: "/cron",
	path: "/cron",
	getParentRoute: () => ToolsRoute
});
var ToolsCssFlexboxRoute = Route$135.update({
	id: "/css-flexbox",
	path: "/css-flexbox",
	getParentRoute: () => ToolsRoute
});
var ToolsCssGridRoute = Route$134.update({
	id: "/css-grid",
	path: "/css-grid",
	getParentRoute: () => ToolsRoute
});
var ToolsCssPlaygroundRoute = Route$133.update({
	id: "/css-playground",
	path: "/css-playground",
	getParentRoute: () => ToolsRoute
});
var ToolsCsvToJsonRoute = Route$132.update({
	id: "/csv-to-json",
	path: "/csv-to-json",
	getParentRoute: () => ToolsRoute
});
var ToolsCurrencyHistoryRoute = Route$131.update({
	id: "/currency-history",
	path: "/currency-history",
	getParentRoute: () => ToolsRoute
});
var ToolsCvRoute = Route$130.update({
	id: "/cv",
	path: "/cv",
	getParentRoute: () => ToolsRoute
});
var ToolsDailyPlannerRoute = Route$129.update({
	id: "/daily-planner",
	path: "/daily-planner",
	getParentRoute: () => ToolsRoute
});
var ToolsDiceRoute = Route$128.update({
	id: "/dice",
	path: "/dice",
	getParentRoute: () => ToolsRoute
});
var ToolsDiffRoute = Route$127.update({
	id: "/diff",
	path: "/diff",
	getParentRoute: () => ToolsRoute
});
var ToolsDiffViewerRoute = Route$126.update({
	id: "/diff-viewer",
	path: "/diff-viewer",
	getParentRoute: () => ToolsRoute
});
var ToolsDistanceCalcRoute = Route$125.update({
	id: "/distance-calc",
	path: "/distance-calc",
	getParentRoute: () => ToolsRoute
});
var ToolsDuaMakerRoute = Route$124.update({
	id: "/dua-maker",
	path: "/dua-maker",
	getParentRoute: () => ToolsRoute
});
var ToolsEmiCalculatorRoute = Route$123.update({
	id: "/emi-calculator",
	path: "/emi-calculator",
	getParentRoute: () => ToolsRoute
});
var ToolsEmojiRoute = Route$122.update({
	id: "/emoji",
	path: "/emoji",
	getParentRoute: () => ToolsRoute
});
var ToolsEquationRoute = Route$121.update({
	id: "/equation",
	path: "/equation",
	getParentRoute: () => ToolsRoute
});
var ToolsExpenseRoute = Route$120.update({
	id: "/expense",
	path: "/expense",
	getParentRoute: () => ToolsRoute
});
var ToolsFakeEmailRoute = Route$119.update({
	id: "/fake-email",
	path: "/fake-email",
	getParentRoute: () => ToolsRoute
});
var ToolsFlashcardMakerRoute = Route$118.update({
	id: "/flashcard-maker",
	path: "/flashcard-maker",
	getParentRoute: () => ToolsRoute
});
var ToolsFlipClockRoute = Route$117.update({
	id: "/flip-clock",
	path: "/flip-clock",
	getParentRoute: () => ToolsRoute
});
var ToolsFocusRoute = Route$116.update({
	id: "/focus",
	path: "/focus",
	getParentRoute: () => ToolsRoute
});
var ToolsFocusScreenRoute = Route$115.update({
	id: "/focus-screen",
	path: "/focus-screen",
	getParentRoute: () => ToolsRoute
});
var ToolsFontRoute = Route$114.update({
	id: "/font",
	path: "/font",
	getParentRoute: () => ToolsRoute
});
var ToolsFontSizeRoute = Route$113.update({
	id: "/font-size",
	path: "/font-size",
	getParentRoute: () => ToolsRoute
});
var ToolsGiftRoute = Route$112.update({
	id: "/gift",
	path: "/gift",
	getParentRoute: () => ToolsRoute
});
var ToolsGradientRoute = Route$111.update({
	id: "/gradient",
	path: "/gradient",
	getParentRoute: () => ToolsRoute
});
var ToolsGratitudeJournalRoute = Route$110.update({
	id: "/gratitude-journal",
	path: "/gratitude-journal",
	getParentRoute: () => ToolsRoute
});
var ToolsGstCalculatorRoute = Route$109.update({
	id: "/gst-calculator",
	path: "/gst-calculator",
	getParentRoute: () => ToolsRoute
});
var ToolsHabitStackRoute = Route$108.update({
	id: "/habit-stack",
	path: "/habit-stack",
	getParentRoute: () => ToolsRoute
});
var ToolsHabitsRoute = Route$107.update({
	id: "/habits",
	path: "/habits",
	getParentRoute: () => ToolsRoute
});
var ToolsHealthTrackerRoute = Route$106.update({
	id: "/health-tracker",
	path: "/health-tracker",
	getParentRoute: () => ToolsRoute
});
var ToolsHeartRateRoute = Route$105.update({
	id: "/heart-rate",
	path: "/heart-rate",
	getParentRoute: () => ToolsRoute
});
var ToolsHijriRoute = Route$104.update({
	id: "/hijri",
	path: "/hijri",
	getParentRoute: () => ToolsRoute
});
var ToolsHtmlCompilerRoute = Route$103.update({
	id: "/html-compiler",
	path: "/html-compiler",
	getParentRoute: () => ToolsRoute
});
var ToolsHtmlEntityRoute = Route$102.update({
	id: "/html-entity",
	path: "/html-entity",
	getParentRoute: () => ToolsRoute
});
var ToolsHtmlPreviewRoute = Route$101.update({
	id: "/html-preview",
	path: "/html-preview",
	getParentRoute: () => ToolsRoute
});
var ToolsHtmlToPdfRoute = Route$100.update({
	id: "/html-to-pdf",
	path: "/html-to-pdf",
	getParentRoute: () => ToolsRoute
});
var ToolsHttpStatusRoute = Route$99.update({
	id: "/http-status",
	path: "/http-status",
	getParentRoute: () => ToolsRoute
});
var ToolsIdealWeightRoute = Route$98.update({
	id: "/ideal-weight",
	path: "/ideal-weight",
	getParentRoute: () => ToolsRoute
});
var ToolsImageBase64Route = Route$97.update({
	id: "/image-base64",
	path: "/image-base64",
	getParentRoute: () => ToolsRoute
});
var ToolsImageCompressRoute = Route$96.update({
	id: "/image-compress",
	path: "/image-compress",
	getParentRoute: () => ToolsRoute
});
var ToolsImageConvertRoute = Route$95.update({
	id: "/image-convert",
	path: "/image-convert",
	getParentRoute: () => ToolsRoute
});
var ToolsImagesToPdfRoute = Route$94.update({
	id: "/images-to-pdf",
	path: "/images-to-pdf",
	getParentRoute: () => ToolsRoute
});
var ToolsInterviewRoute = Route$93.update({
	id: "/interview",
	path: "/interview",
	getParentRoute: () => ToolsRoute
});
var ToolsInvoiceRoute = Route$92.update({
	id: "/invoice",
	path: "/invoice",
	getParentRoute: () => ToolsRoute
});
var ToolsInvoiceLookupRoute = Route$91.update({
	id: "/invoice-lookup",
	path: "/invoice-lookup",
	getParentRoute: () => ToolsRoute
});
var ToolsIpRoute = Route$90.update({
	id: "/ip",
	path: "/ip",
	getParentRoute: () => ToolsRoute
});
var ToolsJsPlaygroundRoute = Route$89.update({
	id: "/js-playground",
	path: "/js-playground",
	getParentRoute: () => ToolsRoute
});
var ToolsJsonFormatterRoute = Route$88.update({
	id: "/json-formatter",
	path: "/json-formatter",
	getParentRoute: () => ToolsRoute
});
var ToolsJsonTreeRoute = Route$87.update({
	id: "/json-tree",
	path: "/json-tree",
	getParentRoute: () => ToolsRoute
});
var ToolsKharchRoute = Route$86.update({
	id: "/kharch",
	path: "/kharch",
	getParentRoute: () => ToolsRoute
});
var ToolsLinktreeRoute = Route$85.update({
	id: "/linktree",
	path: "/linktree",
	getParentRoute: () => ToolsRoute
});
var ToolsLoremRoute = Route$84.update({
	id: "/lorem",
	path: "/lorem",
	getParentRoute: () => ToolsRoute
});
var ToolsMarkdownEditorRoute = Route$83.update({
	id: "/markdown-editor",
	path: "/markdown-editor",
	getParentRoute: () => ToolsRoute
});
var ToolsMarkdownHtml2Route = Route$82.update({
	id: "/markdown-html2",
	path: "/markdown-html2",
	getParentRoute: () => ToolsRoute
});
var ToolsMarkdownStatsRoute = Route$81.update({
	id: "/markdown-stats",
	path: "/markdown-stats",
	getParentRoute: () => ToolsRoute
});
var ToolsMarkdownToHtmlRoute = Route$80.update({
	id: "/markdown-to-html",
	path: "/markdown-to-html",
	getParentRoute: () => ToolsRoute
});
var ToolsMeetingRoute = Route$79.update({
	id: "/meeting",
	path: "/meeting",
	getParentRoute: () => ToolsRoute
});
var ToolsMemeRoute = Route$78.update({
	id: "/meme",
	path: "/meme",
	getParentRoute: () => ToolsRoute
});
var ToolsMemoGeneratorRoute = Route$77.update({
	id: "/memo-generator",
	path: "/memo-generator",
	getParentRoute: () => ToolsRoute
});
var ToolsMetaRoute = Route$76.update({
	id: "/meta",
	path: "/meta",
	getParentRoute: () => ToolsRoute
});
var ToolsMimeTypeRoute = Route$75.update({
	id: "/mime-type",
	path: "/mime-type",
	getParentRoute: () => ToolsRoute
});
var ToolsMindMapRoute = Route$74.update({
	id: "/mind-map",
	path: "/mind-map",
	getParentRoute: () => ToolsRoute
});
var ToolsMoodTrackerRoute = Route$73.update({
	id: "/mood-tracker",
	path: "/mood-tracker",
	getParentRoute: () => ToolsRoute
});
var ToolsMuhurratRoute = Route$72.update({
	id: "/muhurrat",
	path: "/muhurrat",
	getParentRoute: () => ToolsRoute
});
var ToolsMultiTimerRoute = Route$71.update({
	id: "/multi-timer",
	path: "/multi-timer",
	getParentRoute: () => ToolsRoute
});
var ToolsNameRoute = Route$70.update({
	id: "/name",
	path: "/name",
	getParentRoute: () => ToolsRoute
});
var ToolsNamecardRoute = Route$69.update({
	id: "/namecard",
	path: "/namecard",
	getParentRoute: () => ToolsRoute
});
var ToolsNewTabRoute = Route$68.update({
	id: "/new-tab",
	path: "/new-tab",
	getParentRoute: () => ToolsRoute
});
var ToolsNoiseRoute = Route$67.update({
	id: "/noise",
	path: "/noise",
	getParentRoute: () => ToolsRoute
});
var ToolsNotesRoute = Route$66.update({
	id: "/notes",
	path: "/notes",
	getParentRoute: () => ToolsRoute
});
var ToolsNumberWordsRoute = Route$65.update({
	id: "/number-words",
	path: "/number-words",
	getParentRoute: () => ToolsRoute
});
var ToolsOneLinerRoute = Route$64.update({
	id: "/one-liner",
	path: "/one-liner",
	getParentRoute: () => ToolsRoute
});
var ToolsPasswordRoute = Route$63.update({
	id: "/password",
	path: "/password",
	getParentRoute: () => ToolsRoute
});
var ToolsPasswordGenRoute = Route$62.update({
	id: "/password-gen",
	path: "/password-gen",
	getParentRoute: () => ToolsRoute
});
var ToolsPercentageRoute = Route$61.update({
	id: "/percentage",
	path: "/percentage",
	getParentRoute: () => ToolsRoute
});
var ToolsPitchRoute = Route$60.update({
	id: "/pitch",
	path: "/pitch",
	getParentRoute: () => ToolsRoute
});
var ToolsPlantRoute = Route$59.update({
	id: "/plant",
	path: "/plant",
	getParentRoute: () => ToolsRoute
});
var ToolsPollRoute = Route$58.update({
	id: "/poll",
	path: "/poll",
	getParentRoute: () => ToolsRoute
});
var ToolsPomodoroRoute = Route$57.update({
	id: "/pomodoro",
	path: "/pomodoro",
	getParentRoute: () => ToolsRoute
});
var ToolsPomodoroAdvancedRoute = Route$56.update({
	id: "/pomodoro-advanced",
	path: "/pomodoro-advanced",
	getParentRoute: () => ToolsRoute
});
var ToolsPrayerScheduleRoute = Route$55.update({
	id: "/prayer-schedule",
	path: "/prayer-schedule",
	getParentRoute: () => ToolsRoute
});
var ToolsQiblaRoute = Route$54.update({
	id: "/qibla",
	path: "/qibla",
	getParentRoute: () => ToolsRoute
});
var ToolsQrCodeRoute = Route$53.update({
	id: "/qr-code",
	path: "/qr-code",
	getParentRoute: () => ToolsRoute
});
var ToolsQuizMakerRoute = Route$52.update({
	id: "/quiz-maker",
	path: "/quiz-maker",
	getParentRoute: () => ToolsRoute
});
var ToolsQuoteMakerRoute = Route$51.update({
	id: "/quote-maker",
	path: "/quote-maker",
	getParentRoute: () => ToolsRoute
});
var ToolsQuoteScreenRoute = Route$50.update({
	id: "/quote-screen",
	path: "/quote-screen",
	getParentRoute: () => ToolsRoute
});
var ToolsQuranSearchRoute = Route$49.update({
	id: "/quran-search",
	path: "/quran-search",
	getParentRoute: () => ToolsRoute
});
var ToolsRainScreenRoute = Route$48.update({
	id: "/rain-screen",
	path: "/rain-screen",
	getParentRoute: () => ToolsRoute
});
var ToolsRandomNumberRoute = Route$47.update({
	id: "/random-number",
	path: "/random-number",
	getParentRoute: () => ToolsRoute
});
var ToolsReadabilityRoute = Route$46.update({
	id: "/readability",
	path: "/readability",
	getParentRoute: () => ToolsRoute
});
var ToolsReadability2Route = Route$45.update({
	id: "/readability2",
	path: "/readability2",
	getParentRoute: () => ToolsRoute
});
var ToolsReadingRoute = Route$44.update({
	id: "/reading",
	path: "/reading",
	getParentRoute: () => ToolsRoute
});
var ToolsReadingListRoute = Route$43.update({
	id: "/reading-list",
	path: "/reading-list",
	getParentRoute: () => ToolsRoute
});
var ToolsRecipeScalerRoute = Route$42.update({
	id: "/recipe-scaler",
	path: "/recipe-scaler",
	getParentRoute: () => ToolsRoute
});
var ToolsRegexRoute = Route$41.update({
	id: "/regex",
	path: "/regex",
	getParentRoute: () => ToolsRoute
});
var ToolsRegexTesterRoute = Route$40.update({
	id: "/regex-tester",
	path: "/regex-tester",
	getParentRoute: () => ToolsRoute
});
var ToolsRomanNumeralRoute = Route$39.update({
	id: "/roman-numeral",
	path: "/roman-numeral",
	getParentRoute: () => ToolsRoute
});
var ToolsSadaqahRoute = Route$38.update({
	id: "/sadaqah",
	path: "/sadaqah",
	getParentRoute: () => ToolsRoute
});
var ToolsScannerRoute = Route$37.update({
	id: "/scanner",
	path: "/scanner",
	getParentRoute: () => ToolsRoute
});
var ToolsScreenshotRoute = Route$36.update({
	id: "/screenshot",
	path: "/screenshot",
	getParentRoute: () => ToolsRoute
});
var ToolsShortcutRoute = Route$35.update({
	id: "/shortcut",
	path: "/shortcut",
	getParentRoute: () => ToolsRoute
});
var ToolsSipCalculatorRoute = Route$34.update({
	id: "/sip-calculator",
	path: "/sip-calculator",
	getParentRoute: () => ToolsRoute
});
var ToolsSizeRoute = Route$33.update({
	id: "/size",
	path: "/size",
	getParentRoute: () => ToolsRoute
});
var ToolsSleepCalcRoute = Route$32.update({
	id: "/sleep-calc",
	path: "/sleep-calc",
	getParentRoute: () => ToolsRoute
});
var ToolsSmartPasteRoute = Route$31.update({
	id: "/smart-paste",
	path: "/smart-paste",
	getParentRoute: () => ToolsRoute
});
var ToolsSpeechToTextRoute = Route$30.update({
	id: "/speech-to-text",
	path: "/speech-to-text",
	getParentRoute: () => ToolsRoute
});
var ToolsSpellingRoute = Route$29.update({
	id: "/spelling",
	path: "/spelling",
	getParentRoute: () => ToolsRoute
});
var ToolsStandupRoute = Route$28.update({
	id: "/standup",
	path: "/standup",
	getParentRoute: () => ToolsRoute
});
var ToolsStarfieldRoute = Route$27.update({
	id: "/starfield",
	path: "/starfield",
	getParentRoute: () => ToolsRoute
});
var ToolsStickerRoute = Route$26.update({
	id: "/sticker",
	path: "/sticker",
	getParentRoute: () => ToolsRoute
});
var ToolsStopwatchRoute = Route$25.update({
	id: "/stopwatch",
	path: "/stopwatch",
	getParentRoute: () => ToolsRoute
});
var ToolsStoryRoute = Route$24.update({
	id: "/story",
	path: "/story",
	getParentRoute: () => ToolsRoute
});
var ToolsStringHashRoute = Route$23.update({
	id: "/string-hash",
	path: "/string-hash",
	getParentRoute: () => ToolsRoute
});
var ToolsSvgPreviewRoute = Route$22.update({
	id: "/svg-preview",
	path: "/svg-preview",
	getParentRoute: () => ToolsRoute
});
var ToolsTableRoute = Route$21.update({
	id: "/table",
	path: "/table",
	getParentRoute: () => ToolsRoute
});
var ToolsTasbeehRoute = Route$20.update({
	id: "/tasbeeh",
	path: "/tasbeeh",
	getParentRoute: () => ToolsRoute
});
var ToolsTextCaseRoute = Route$19.update({
	id: "/text-case",
	path: "/text-case",
	getParentRoute: () => ToolsRoute
});
var ToolsTextStatsRoute = Route$18.update({
	id: "/text-stats",
	path: "/text-stats",
	getParentRoute: () => ToolsRoute
});
var ToolsTextToSpeechRoute = Route$17.update({
	id: "/text-to-speech",
	path: "/text-to-speech",
	getParentRoute: () => ToolsRoute
});
var ToolsThreadMakerRoute = Route$16.update({
	id: "/thread-maker",
	path: "/thread-maker",
	getParentRoute: () => ToolsRoute
});
var ToolsThumbnailRoute = Route$15.update({
	id: "/thumbnail",
	path: "/thumbnail",
	getParentRoute: () => ToolsRoute
});
var ToolsTimestampRoute = Route$14.update({
	id: "/timestamp",
	path: "/timestamp",
	getParentRoute: () => ToolsRoute
});
var ToolsTimezoneConverterRoute = Route$13.update({
	id: "/timezone-converter",
	path: "/timezone-converter",
	getParentRoute: () => ToolsRoute
});
var ToolsTipCalculatorRoute = Route$12.update({
	id: "/tip-calculator",
	path: "/tip-calculator",
	getParentRoute: () => ToolsRoute
});
var ToolsTypingTestRoute = Route$11.update({
	id: "/typing-test",
	path: "/typing-test",
	getParentRoute: () => ToolsRoute
});
var ToolsUnicodeLookupRoute = Route$10.update({
	id: "/unicode-lookup",
	path: "/unicode-lookup",
	getParentRoute: () => ToolsRoute
});
var ToolsUnitConverterRoute = Route$9.update({
	id: "/unit-converter",
	path: "/unit-converter",
	getParentRoute: () => ToolsRoute
});
var ToolsUpiRoute = Route$8.update({
	id: "/upi",
	path: "/upi",
	getParentRoute: () => ToolsRoute
});
var ToolsUrlEncoderRoute = Route$7.update({
	id: "/url-encoder",
	path: "/url-encoder",
	getParentRoute: () => ToolsRoute
});
var ToolsVcardGenRoute = Route$6.update({
	id: "/vcard-gen",
	path: "/vcard-gen",
	getParentRoute: () => ToolsRoute
});
var ToolsWaterTrackerRoute = Route$5.update({
	id: "/water-tracker",
	path: "/water-tracker",
	getParentRoute: () => ToolsRoute
});
var ToolsWatermarkRoute = Route$4.update({
	id: "/watermark",
	path: "/watermark",
	getParentRoute: () => ToolsRoute
});
var ToolsWhitespaceRoute = Route$3.update({
	id: "/whitespace",
	path: "/whitespace",
	getParentRoute: () => ToolsRoute
});
var ToolsWifiQrRoute = Route$2.update({
	id: "/wifi-qr",
	path: "/wifi-qr",
	getParentRoute: () => ToolsRoute
});
var ToolsWorldClockRoute = Route$1.update({
	id: "/world-clock",
	path: "/world-clock",
	getParentRoute: () => ToolsRoute
});
var ExploreCategoryIndexRoute = Route$221.update({
	id: "/explore/$category/",
	path: "/explore/$category/",
	getParentRoute: () => Route$216
});
var ExploreCategorySubcategoryRoute = Route$220.update({
	id: "/explore/$category/$subcategory",
	path: "/explore/$category/$subcategory",
	getParentRoute: () => Route$216
});
var AssistantRouteChildren = { AssistantAboutRoute };
var AssistantRouteWithChildren = AssistantRoute._addFileChildren(AssistantRouteChildren);
var ToolsRouteChildren = {
	ToolsAgeCalculatorRoute,
	ToolsAgeOfThingsRoute,
	ToolsAlphabetCipherRoute,
	ToolsAnalyzeRoute,
	ToolsApiTesterRoute,
	ToolsArabicKeyboardRoute,
	ToolsAsciiRoute,
	ToolsAspectRoute,
	ToolsBase64Route,
	ToolsBinaryCalculatorRoute,
	ToolsBioRoute,
	ToolsBmiCalculatorRoute,
	ToolsBmiCalculator2Route,
	ToolsBmiChartRoute,
	ToolsBorderRadiusRoute,
	ToolsBoxShadowRoute,
	ToolsBudgetRoute,
	ToolsCalorieRoute,
	ToolsCalorieCalcRoute,
	ToolsCertificateRoute,
	ToolsChangelogMakerRoute,
	ToolsCodeBeautifierRoute,
	ToolsCodeScreenshotRoute,
	ToolsCoinFlipRoute,
	ToolsColorBlendRoute,
	ToolsColorContrastRoute,
	ToolsColorPaletteRoute,
	ToolsColorPickerRoute,
	ToolsContractRoute,
	ToolsCountdownRoute,
	ToolsCrackHashRoute,
	ToolsCronRoute,
	ToolsCssFlexboxRoute,
	ToolsCssGridRoute,
	ToolsCssPlaygroundRoute,
	ToolsCsvToJsonRoute,
	ToolsCurrencyHistoryRoute,
	ToolsCvRoute,
	ToolsDailyPlannerRoute,
	ToolsDiceRoute,
	ToolsDiffRoute,
	ToolsDiffViewerRoute,
	ToolsDistanceCalcRoute,
	ToolsDuaMakerRoute,
	ToolsEmiCalculatorRoute,
	ToolsEmojiRoute,
	ToolsEquationRoute,
	ToolsExpenseRoute,
	ToolsFakeEmailRoute,
	ToolsFlashcardMakerRoute,
	ToolsFlipClockRoute,
	ToolsFocusRoute,
	ToolsFocusScreenRoute,
	ToolsFontRoute,
	ToolsFontSizeRoute,
	ToolsGiftRoute,
	ToolsGradientRoute,
	ToolsGratitudeJournalRoute,
	ToolsGstCalculatorRoute,
	ToolsHabitStackRoute,
	ToolsHabitsRoute,
	ToolsHealthTrackerRoute,
	ToolsHeartRateRoute,
	ToolsHijriRoute,
	ToolsHtmlCompilerRoute,
	ToolsHtmlEntityRoute,
	ToolsHtmlPreviewRoute,
	ToolsHtmlToPdfRoute,
	ToolsHttpStatusRoute,
	ToolsIdealWeightRoute,
	ToolsImageBase64Route,
	ToolsImageCompressRoute,
	ToolsImageConvertRoute,
	ToolsImagesToPdfRoute,
	ToolsInterviewRoute,
	ToolsInvoiceRoute,
	ToolsInvoiceLookupRoute,
	ToolsIpRoute,
	ToolsJsPlaygroundRoute,
	ToolsJsonFormatterRoute,
	ToolsJsonTreeRoute,
	ToolsKharchRoute,
	ToolsLinktreeRoute,
	ToolsLoremRoute,
	ToolsMarkdownEditorRoute,
	ToolsMarkdownHtml2Route,
	ToolsMarkdownStatsRoute,
	ToolsMarkdownToHtmlRoute,
	ToolsMeetingRoute,
	ToolsMemeRoute,
	ToolsMemoGeneratorRoute,
	ToolsMetaRoute,
	ToolsMimeTypeRoute,
	ToolsMindMapRoute,
	ToolsMoodTrackerRoute,
	ToolsMuhurratRoute,
	ToolsMultiTimerRoute,
	ToolsNameRoute,
	ToolsNamecardRoute,
	ToolsNewTabRoute,
	ToolsNoiseRoute,
	ToolsNotesRoute,
	ToolsNumberWordsRoute,
	ToolsOneLinerRoute,
	ToolsPasswordRoute,
	ToolsPasswordGenRoute,
	ToolsPercentageRoute,
	ToolsPitchRoute,
	ToolsPlantRoute,
	ToolsPollRoute,
	ToolsPomodoroRoute,
	ToolsPomodoroAdvancedRoute,
	ToolsPrayerScheduleRoute,
	ToolsQiblaRoute,
	ToolsQrCodeRoute,
	ToolsQuizMakerRoute,
	ToolsQuoteMakerRoute,
	ToolsQuoteScreenRoute,
	ToolsQuranSearchRoute,
	ToolsRainScreenRoute,
	ToolsRandomNumberRoute,
	ToolsReadabilityRoute,
	ToolsReadability2Route,
	ToolsReadingRoute,
	ToolsReadingListRoute,
	ToolsRecipeScalerRoute,
	ToolsRegexRoute,
	ToolsRegexTesterRoute,
	ToolsRomanNumeralRoute,
	ToolsSadaqahRoute,
	ToolsScannerRoute,
	ToolsScreenshotRoute,
	ToolsShortcutRoute,
	ToolsSipCalculatorRoute,
	ToolsSizeRoute,
	ToolsSleepCalcRoute,
	ToolsSmartPasteRoute,
	ToolsSpeechToTextRoute,
	ToolsSpellingRoute,
	ToolsStandupRoute,
	ToolsStarfieldRoute,
	ToolsStickerRoute,
	ToolsStopwatchRoute,
	ToolsStoryRoute,
	ToolsStringHashRoute,
	ToolsSvgPreviewRoute,
	ToolsTableRoute,
	ToolsTasbeehRoute,
	ToolsTextCaseRoute,
	ToolsTextStatsRoute,
	ToolsTextToSpeechRoute,
	ToolsThreadMakerRoute,
	ToolsThumbnailRoute,
	ToolsTimestampRoute,
	ToolsTimezoneConverterRoute,
	ToolsTipCalculatorRoute,
	ToolsTypingTestRoute,
	ToolsUnicodeLookupRoute,
	ToolsUnitConverterRoute,
	ToolsUpiRoute,
	ToolsUrlEncoderRoute,
	ToolsVcardGenRoute,
	ToolsWaterTrackerRoute,
	ToolsWatermarkRoute,
	ToolsWhitespaceRoute,
	ToolsWifiQrRoute,
	ToolsWorldClockRoute,
	ToolsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AiToolsRoute,
	AlternativesRoute,
	AssistantRoute: AssistantRouteWithChildren,
	ChangelogRoute,
	CompareRoute,
	ContactRoute,
	DealsRoute,
	DesignsRoute,
	FavoritesRoute,
	FindRoute,
	GlassRoute,
	GlossaryRoute,
	GraphRoute,
	HunyuanRoute,
	JournalRoute,
	KeyboardRoute,
	LiveRoute,
	MeRoute,
	MoviesRoute,
	PlayRoute,
	PrivacyRoute,
	QuizRoute,
	RadarRoute,
	RecentRoute,
	RoadmapsRoute,
	SearchRoute,
	SettingsRoute,
	TermsRoute,
	ToolsRoute: ToolsRoute._addFileChildren(ToolsRouteChildren),
	TrendingRoute,
	WhatsNewRoute,
	WorkflowRoute,
	YoutubeRoute,
	BuildIdeasSlugRoute,
	BuildIdeasProjectsRoute,
	BuildIdeasValidateRoute,
	CSlugRoute,
	CollectionsIdRoute,
	DiscoverSectionRoute,
	DiscoverReelsRoute,
	GeneratorsIdRoute,
	HubAudienceRoute,
	HubArabicRoute,
	HubIslamRoute,
	HubQuotesRoute,
	HubUrduRoute,
	LUsernameRoute,
	RIdRoute,
	BuildIdeasIndexRoute,
	CollectionsIndexRoute,
	DiscoverIndexRoute,
	ExploreIndexRoute,
	GeneratorsIndexRoute,
	HubIndexRoute,
	ExploreCategorySubcategoryRoute,
	ExploreCategoryIndexRoute
};
var routeTree = Route$216._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
