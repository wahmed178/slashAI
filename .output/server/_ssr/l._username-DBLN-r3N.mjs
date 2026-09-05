import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Route } from "./l._username-LpBmZ6-A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/l._username-DBLN-r3N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "slashai-linktree-profiles";
var THEMES = {
	dark: {
		bg: "#0a0a0f",
		card: "#161b22",
		text: "#f0f6fc",
		border: "#30363d",
		accent: "#58a6ff"
	},
	midnight: {
		bg: "#0f172a",
		card: "#1e293b",
		text: "#f1f5f9",
		border: "#334155",
		accent: "#818cf8"
	},
	ocean: {
		bg: "#042f2e",
		card: "#134e4a",
		text: "#f0fdfa",
		border: "#2dd4bf",
		accent: "#2dd4bf"
	},
	sunset: {
		bg: "#1c1917",
		card: "#292524",
		text: "#fef3c7",
		border: "#f59e0b",
		accent: "#f59e0b"
	},
	lavender: {
		bg: "#1e1b4b",
		card: "#312e81",
		text: "#e0e7ff",
		border: "#818cf8",
		accent: "#a78bfa"
	},
	light: {
		bg: "#ffffff",
		card: "#f8fafc",
		text: "#0f172a",
		border: "#e2e8f0",
		accent: "#2563eb"
	},
	gradient: {
		bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		card: "rgba(255,255,255,0.15)",
		text: "#ffffff",
		border: "rgba(255,255,255,0.25)",
		accent: "#ffffff"
	}
};
function decodeProfile(hash) {
	try {
		const decoded = decodeURIComponent(atob(hash.replace(/^#/, "")));
		const p = JSON.parse(decoded);
		if (p && p.username && p.links) return p;
	} catch {}
	return null;
}
function PublicProfile() {
	const { username } = Route.useParams();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [notFound, setNotFound] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const hash = window.location.hash;
		if (hash && hash.length > 5) {
			const decoded = decodeProfile(hash);
			if (decoded) {
				setProfile(decoded);
				return;
			}
		}
		try {
			const found = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").find((p) => p.username === username);
			if (found) {
				setProfile(found);
				return;
			}
		} catch {}
		setNotFound(true);
	}, [username]);
	if (notFound) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center",
		style: { background: "#0a0a0f" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-6xl mb-4",
					children: "🔍"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-white mb-2",
					children: "Profile not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-gray-400",
					children: [
						"/",
						username,
						" doesn't exist yet."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/tools/linktree",
					className: "mt-4 inline-block rounded-lg bg-[#58a6ff] px-4 py-2 text-sm font-medium text-white hover:opacity-90",
					children: "Create your link page"
				})
			]
		})
	});
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center",
		style: { background: "#0a0a0f" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-gray-400",
			children: "Loading..."
		})
	});
	const t = THEMES[profile.theme] ?? {
		bg: "#0a0a0f",
		card: "#161b22",
		text: "#f0f6fc",
		border: "#30363d",
		accent: "#58a6ff"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center p-6",
		style: {
			background: t.bg,
			color: t.text
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-20 rounded-full flex items-center justify-center text-4xl",
						style: {
							background: t.card,
							border: `2px solid ${t.border}`
						},
						children: profile.avatar || "👤"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-center text-2xl font-bold",
					children: profile.name || profile.username
				}),
				profile.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-center text-sm opacity-70",
					children: profile.bio
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-3",
					children: profile.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: link.url,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "flex items-center gap-3 rounded-xl py-3.5 px-5 text-center font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg",
						style: {
							background: t.card,
							border: `1px solid ${t.border}`,
							color: t.text
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg",
								children: link.icon || "🔗"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-sm",
								children: link.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs opacity-50",
								children: "→"
							})
						]
					}, link.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] opacity-40",
						children: "Created with SlashAI Link in Bio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/tools/linktree",
						className: "text-[10px] opacity-40 hover:opacity-70",
						children: "Create yours →"
					})]
				})
			]
		})
	});
}
//#endregion
export { PublicProfile as component };
