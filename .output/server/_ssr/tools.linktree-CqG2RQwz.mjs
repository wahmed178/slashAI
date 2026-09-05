import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.linktree-CqG2RQwz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "slashai-linktree-profiles";
var THEMES = [
	{
		id: "dark",
		label: "Dark",
		bg: "#0a0a0f",
		card: "#161b22",
		text: "#f0f6fc",
		border: "#30363d",
		accent: "#58a6ff"
	},
	{
		id: "midnight",
		label: "Midnight",
		bg: "#0f172a",
		card: "#1e293b",
		text: "#f1f5f9",
		border: "#334155",
		accent: "#818cf8"
	},
	{
		id: "ocean",
		label: "Ocean",
		bg: "#042f2e",
		card: "#134e4a",
		text: "#f0fdfa",
		border: "#2dd4bf",
		accent: "#2dd4bf"
	},
	{
		id: "sunset",
		label: "Sunset",
		bg: "#1c1917",
		card: "#292524",
		text: "#fef3c7",
		border: "#f59e0b",
		accent: "#f59e0b"
	},
	{
		id: "lavender",
		label: "Lavender",
		bg: "#1e1b4b",
		card: "#312e81",
		text: "#e0e7ff",
		border: "#818cf8",
		accent: "#a78bfa"
	},
	{
		id: "light",
		label: "Light",
		bg: "#ffffff",
		card: "#f8fafc",
		text: "#0f172a",
		border: "#e2e8f0",
		accent: "#2563eb"
	},
	{
		id: "gradient",
		label: "Gradient",
		bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		card: "rgba(255,255,255,0.15)",
		text: "#ffffff",
		border: "rgba(255,255,255,0.25)",
		accent: "#ffffff"
	}
];
var ICONS = [
	"🔗",
	"🌐",
	"📸",
	"🐦",
	"💼",
	"🎵",
	"📺",
	"📝",
	"🎮",
	"🛒",
	"📧",
	"📱",
	"💻",
	"🎨",
	"📷",
	"🔊",
	"📚",
	"🎯",
	"⚡",
	"🚀"
];
function encodeProfile(profile) {
	try {
		return btoa(encodeURIComponent(JSON.stringify(profile)));
	} catch {
		return "";
	}
}
function getShareUrl(profile) {
	const base = `${window.location.origin}/l/${profile.username}`;
	const hash = encodeProfile(profile);
	return hash ? `${base}#${hash}` : base;
}
function LinkTreeBuilder() {
	const [profiles, setProfiles] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
		} catch {
			return [];
		}
	});
	const [activeProfile, setActiveProfile] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [linkTitle, setLinkTitle] = (0, import_react.useState)("");
	const [linkUrl, setLinkUrl] = (0, import_react.useState)("");
	const [linkIcon, setLinkIcon] = (0, import_react.useState)("🔗");
	const [copied, setCopied] = (0, import_react.useState)("");
	const [showThemes, setShowThemes] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
		} catch {}
	}, [profiles]);
	const createProfile = () => {
		setActiveProfile({
			username: "",
			name: "",
			bio: "",
			avatar: "👤",
			theme: "dark",
			links: []
		});
		setEditing(true);
	};
	const saveProfile = () => {
		if (!activeProfile) return;
		const p = activeProfile;
		if (!p.username.trim()) return;
		setProfiles((prev) => {
			const existing = prev.findIndex((x) => x.username === p.username);
			if (existing >= 0) {
				const next = [...prev];
				next[existing] = p;
				return next;
			}
			return [...prev, p];
		});
		setEditing(false);
	};
	const deleteProfile = (username) => {
		setProfiles((prev) => prev.filter((p) => p.username !== username));
		setActiveProfile(null);
	};
	const addLink = () => {
		if (!linkTitle.trim() || !linkUrl.trim() || !activeProfile) return;
		const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
		setActiveProfile({
			...activeProfile,
			links: [...activeProfile.links, {
				id: crypto.randomUUID(),
				title: linkTitle.trim(),
				url,
				icon: linkIcon
			}]
		});
		setLinkTitle("");
		setLinkUrl("");
		setLinkIcon("🔗");
	};
	const removeLink = (id) => {
		if (!activeProfile) return;
		setActiveProfile({
			...activeProfile,
			links: activeProfile.links.filter((l) => l.id !== id)
		});
	};
	const moveLink = (id, dir) => {
		if (!activeProfile) return;
		const idx = activeProfile.links.findIndex((l) => l.id === id);
		if (idx < 0) return;
		const links = [...activeProfile.links];
		const newIdx = idx + dir;
		if (newIdx < 0 || newIdx >= links.length) return;
		const a = links[idx];
		const b = links[newIdx];
		if (!a || !b) return;
		links[idx] = b;
		links[newIdx] = a;
		setActiveProfile({
			...activeProfile,
			links
		});
	};
	const shareUrl = activeProfile ? getShareUrl(activeProfile) : "";
	const copyShare = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied("share");
			setTimeout(() => setCopied(""), 1200);
		} catch {}
	};
	THEMES.find((th) => th.id === activeProfile?.theme) || THEMES[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Link in Bio Builder",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🔗 Link in Bio Builder"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Create your personal link page. Save, share, and download as HTML."
			})]
		}), !activeProfile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [profiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-muted-foreground",
					children: "Your Profiles"
				}), profiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border bg-surface p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-10 rounded-full bg-primary/10 flex items-center justify-center text-lg",
							children: p.avatar || "👤"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: p.name || p.username
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"/",
									p.username,
									" · ",
									p.links.length,
									" links"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								const url = getShareUrl(p);
								navigator.clipboard.writeText(url);
								setCopied(p.username);
								setTimeout(() => setCopied(""), 1200);
							},
							className: "text-[11px] text-primary hover:underline",
							children: copied === p.username ? "✓ Copied" : "Share"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/l/${p.username}`,
							className: "text-[11px] text-muted-foreground hover:text-foreground",
							children: "View"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setActiveProfile(p);
								setEditing(true);
							},
							className: "text-[11px] text-muted-foreground hover:text-foreground",
							children: "Edit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => deleteProfile(p.username),
							className: "text-[11px] text-muted-foreground hover:text-red-400",
							children: "Delete"
						})
					]
				}, p.username))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: createProfile,
				className: "w-full rounded-xl border-2 border-dashed border-border bg-surface py-8 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors",
				children: "+ Create New Link Page"
			})]
		}) : editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-[10px] text-muted-foreground",
						children: "Username (unique)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: activeProfile.username,
						onChange: (e) => setActiveProfile({
							...activeProfile,
							username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "")
						}),
						placeholder: "yourname",
						className: "h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-[10px] text-muted-foreground",
						children: "Display Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: activeProfile.name,
						onChange: (e) => setActiveProfile({
							...activeProfile,
							name: e.target.value
						}),
						placeholder: "Your Name",
						className: "h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-[10px] text-muted-foreground",
					children: "Bio"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: activeProfile.bio,
					onChange: (e) => setActiveProfile({
						...activeProfile,
						bio: e.target.value
					}),
					placeholder: "Developer, creator, etc.",
					className: "h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-[10px] text-muted-foreground",
					children: "Avatar Emoji"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1.5 flex-wrap",
					children: [
						"👤",
						"👨",
						"👩",
						"🧑",
						"Developer",
						"Designer",
						"Creator",
						"Student",
						"🚀",
						"⚡",
						"🎨",
						"💼"
					].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveProfile({
							...activeProfile,
							avatar: a
						}),
						className: `size-9 rounded-lg border text-sm flex items-center justify-center ${activeProfile.avatar === a ? "border-primary bg-primary/10" : "border-border bg-surface"}`,
						children: a
					}, a))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-[10px] text-muted-foreground",
					children: "Theme"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 flex-wrap",
					children: THEMES.map((th) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveProfile({
							...activeProfile,
							theme: th.id
						}),
						className: `flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${activeProfile.theme === th.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-4 rounded",
							style: {
								background: th.bg,
								border: `1px solid ${th.border}`
							}
						}), th.label]
					}, th.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-foreground",
						children: "Add Link"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: linkIcon,
								onChange: (e) => setLinkIcon(e.target.value),
								className: "h-9 w-12 rounded-lg border border-border bg-surface-elevated text-center text-sm",
								children: ICONS.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: i,
									children: i
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: linkTitle,
								onChange: (e) => setLinkTitle(e.target.value),
								placeholder: "Link title",
								className: "h-9 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: linkUrl,
								onChange: (e) => setLinkUrl(e.target.value),
								placeholder: "https://...",
								className: "h-9 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: addLink,
								className: "h-9 rounded-lg bg-primary px-4 text-sm font-medium text-background hover:opacity-90",
								children: "Add"
							})
						]
					})]
				}),
				activeProfile.links.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1.5",
					children: activeProfile.links.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-lg border border-border bg-surface p-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg",
								children: l.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-foreground truncate",
									children: l.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground truncate",
									children: l.url
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => moveLink(l.id, -1),
								disabled: i === 0,
								className: "text-xs text-muted-foreground hover:text-foreground disabled:opacity-30",
								children: "↑"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => moveLink(l.id, 1),
								disabled: i === activeProfile.links.length - 1,
								className: "text-xs text-muted-foreground hover:text-foreground disabled:opacity-30",
								children: "↓"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => removeLink(l.id),
								className: "text-xs text-muted-foreground hover:text-red-400",
								children: "✕"
							})
						]
					}, l.id))
				}),
				activeProfile.username && activeProfile.links.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-primary/20 bg-primary/5 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground mb-1",
							children: "Your shareable link:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "flex-1 text-xs text-primary break-all font-mono",
								children: shareUrl
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: copyShare,
								className: "shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-medium text-background hover:opacity-90",
								children: copied === "share" ? "✓ Copied" : "Copy"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[10px] text-muted-foreground",
							children: "Anyone with this link can see your page — works on any device."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: saveProfile,
						disabled: !activeProfile.username.trim(),
						className: "flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40",
						children: "Save Profile"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setActiveProfile(null);
							setEditing(false);
						},
						className: "rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground hover:text-foreground",
						children: "Cancel"
					})]
				})
			]
		}) : null]
	});
}
//#endregion
export { LinkTreeBuilder as component };
