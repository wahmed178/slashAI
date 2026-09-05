import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as streakMessage, I as useLibrary, a as CHANGELOG, d as THEMES, h as cn, i as CATEGORY_TREE, m as VERIFIED_TOTAL, n as Button, t as APP_DETAILS, y as getCommand } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Rows4, E as Sparkles, En as Check, F as Settings, Ft as Info, Nt as Keyboard, Qt as Flame, V as Rows3, h as Upload, kt as LayoutGrid, m as UserRound, n as Zap, on as Download, xt as List, y as Trash2, zt as History } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as INTERESTS } from "./collections-OIdjX1d6.mjs";
import { n as EmptyState, t as CommandGrid } from "./CommandGrid-DFmNY4E7.mjs";
import { n as getPersona, t as PERSONAS } from "./personas-DBrTON6n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/me-C-VsW127.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SHORTCUTS = [
	["/  or  Ctrl K", "Focus search"],
	["Esc", "Close suggestions or dialog"],
	["Enter", "Search the catalog"]
];
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-7",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-2.5 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
			children: title
		}), children]
	});
}
function MePage() {
	const { hydrated, settings, updateSettings, favorites, recents, streak, stats, clearAllData, clearRecents, clearFavorites, clearSearches, recentSearches, exportBackup, importBackup, openWhatsNew } = useLibrary();
	const fileRef = (0, import_react.useRef)(null);
	const [editingPersona, setEditingPersona] = (0, import_react.useState)(false);
	const persona = getPersona(settings.persona);
	const visibleThemes = THEMES;
	const resolve = (ids) => ids.slice(0, 6).map((id) => getCommand(id)).filter((c) => Boolean(c));
	const saved = resolve(favorites);
	const recent = resolve(recents);
	const toggleInterest = (id) => updateSettings({
		interests: settings.interests.includes(id) ? settings.interests.filter((x) => x !== id) : [...settings.interests, id],
		onboarded: true
	});
	const download = () => {
		const blob = new Blob([JSON.stringify(exportBackup(), null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `slashai-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Backup file saved");
	};
	const onFile = async (file) => {
		if (!file) return;
		const result = importBackup(await file.text());
		if (result.ok) toast.success(result.message);
		else toast.error(result.message);
		if (fileRef.current) fileRef.current.value = "";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		hideHeaderSearch: true,
		title: "Profile",
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-2xl",
						children: persona ? persona.emoji : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
							className: "size-6 text-primary",
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-black tracking-tight text-foreground",
							children: persona ? persona.label : "Your profile"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: hydrated ? `${favorites.length} saved · ${stats.copies} copied` : " "
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							className: "gap-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/about",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4" }), " About"]
							})
						})
					})
				]
			}),
			hydrated && streak.count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-5 flex items-center gap-3 rounded-2xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
						className: "size-5",
						"aria-hidden": true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-foreground",
						children: [
							"Day ",
							streak.count,
							" streak ",
							streak.count >= 3 && "🔥"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							streakMessage(streak.count),
							" Best: ",
							streak.best,
							" day",
							streak.best === 1 ? "" : "s",
							"."
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Your persona",
				children: persona && !editingPersona ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel flex items-center gap-3 rounded-xl p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl",
							children: persona.emoji
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "min-w-0 flex-1 text-sm text-muted-foreground",
							children: persona.pitch
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setEditingPersona(true),
							children: "Change"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
					children: PERSONAS.map((p) => {
						const on = settings.persona === p.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": on,
							onClick: () => {
								updateSettings({ persona: on ? "" : p.id });
								setEditingPersona(false);
							},
							className: cn("flex min-h-14 items-center gap-2 rounded-xl border px-3 text-left text-sm transition-colors", on ? "border-primary bg-accent text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg",
								"aria-hidden": true,
								children: p.emoji
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0",
								children: p.label
							})]
						}, p.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Interests",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs text-muted-foreground",
					children: "Used only on this device to shape the \"For you\" row on Home."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: INTERESTS.map((i) => {
						const on = settings.interests.includes(i.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": on,
							onClick: () => toggleInterest(i.id),
							className: cn("flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors", on ? "border-primary bg-accent text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
							children: [on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "size-3.5",
								"aria-hidden": true
							}), i.label]
						}, i.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Theme",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: visibleThemes.map((t) => {
						const active = settings.theme === t.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": active,
							onClick: () => updateSettings({ theme: t.id }),
							className: cn("flex items-center gap-3 rounded-xl border p-3 text-left transition-colors active:scale-[0.99]", active ? "border-primary bg-accent" : "border-border bg-surface hover:border-primary/40"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-8 shrink-0 rounded-full border border-border",
									style: { backgroundColor: t.swatch },
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-semibold text-foreground",
										children: t.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-xs text-muted-foreground",
										children: t.hint
									})]
								}),
								active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "size-4 shrink-0 text-primary",
									"aria-hidden": true
								})
							]
						}, t.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Layout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: settings.view === "grid" ? "default" : "outline",
						onClick: () => updateSettings({ view: "grid" }),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" }), " Grid"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: settings.view === "list" ? "default" : "outline",
						onClick: () => updateSettings({ view: "list" }),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-4" }), " List"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: settings.density === "comfortable" ? "default" : "outline",
						onClick: () => updateSettings({ density: "comfortable" }),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rows3, { className: "size-4" }), " Comfortable"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: settings.density === "compact" ? "default" : "outline",
						onClick: () => updateSettings({ density: "compact" }),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rows4, { className: "size-4" }), " Compact"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5" }), " Motion"] }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: !settings.reducedMotion ? "default" : "outline",
						onClick: () => updateSettings({ reducedMotion: false }),
						children: "Smooth"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: settings.reducedMotion ? "default" : "outline",
						onClick: () => updateSettings({ reducedMotion: true }),
						children: "Off"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Results per page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						24,
						48,
						96
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: settings.pageSize === n ? "default" : "outline",
						onClick: () => updateSettings({ pageSize: n }),
						children: n
					}, n))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Saved commands",
				children: saved.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGrid, { commands: saved }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					className: "mt-2 gap-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/favorites",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-3.5" }),
							" All ",
							favorites.length,
							" saved"
						]
					})
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nothing saved yet",
					hint: "Tap the heart on any command to keep it here.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/explore",
							children: "Explore commands"
						})
					})
				})
			}),
			recent.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Recent",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGrid, { commands: recent }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					className: "mt-2 gap-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/recent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-3.5" }), " Full history"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Backup & restore",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-2 text-xs text-muted-foreground",
						children: [
							"Save your ",
							favorites.length,
							" favourite",
							favorites.length === 1 ? "" : "s",
							", history and settings to a file, then load it on another device."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "gap-1.5",
							onClick: download,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Backup"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "gap-1.5",
							onClick: () => fileRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), " Restore"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "application/json,.json",
						className: "hidden",
						onChange: (e) => void onFile(e.target.files?.[0])
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Privacy & data",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs text-muted-foreground",
					children: "Everything lives in this browser. No account, no uploads, no tracking."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "gap-1.5",
							disabled: recentSearches.length === 0,
							onClick: () => {
								clearSearches();
								toast.success("Search history cleared");
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }),
								" Clear search history (",
								recentSearches.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "gap-1.5",
							disabled: recents.length === 0,
							onClick: () => {
								clearRecents();
								toast.success("Recently opened cleared");
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }),
								" Clear recently opened (",
								recents.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "gap-1.5",
							disabled: favorites.length === 0,
							onClick: () => {
								clearFavorites();
								toast.success("Saved commands cleared");
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }),
								" Clear saved commands (",
								favorites.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "gap-1.5 text-destructive",
							onClick: () => {
								if (!confirm("Clear saved commands, history, journal and settings on this device? This cannot be undone.")) return;
								clearAllData();
								toast.success("All local data cleared");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Clear everything"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "size-3.5" }), " Keyboard shortcuts"] }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5",
					children: SHORTCUTS.map(([keys, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 truncate text-muted-foreground",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]",
							children: keys
						})]
					}, keys))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/keyboard",
						children: "Full shortcut reference →"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Updates"] }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: CHANGELOG.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel rounded-xl p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center justify-between text-sm font-semibold text-foreground",
								children: [
									"v",
									r.version,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-normal text-muted-foreground",
										children: r.date
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-primary",
								children: r.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1.5",
								children: r.changes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2 text-xs leading-relaxed text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 size-1 shrink-0 rounded-full bg-primary" }), c]
								}, c))
							})
						]
					}, r.version))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					className: "mt-2",
					onClick: openWhatsNew,
					children: "Show update popup again"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-3.5" }), " App details"] }),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "panel divide-y divide-border rounded-xl text-sm",
						children: [
							["App", APP_DETAILS.name],
							["Version", `v${APP_DETAILS.version}`],
							["Commands", VERIFIED_TOTAL.toLocaleString()],
							["Categories", String(CATEGORY_TREE.length)],
							["Model", "Free forever · No account · No tracking"],
							["Created by", APP_DETAILS.creator]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "truncate font-medium text-foreground",
								children: v
							})]
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: APP_DETAILS.storage
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/changelog",
								className: "text-primary hover:underline",
								children: "Changelog"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://github.com/wahmed178/slashAI",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "text-primary hover:underline",
								children: "GitHub"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/about",
								className: "text-primary hover:underline",
								children: "About"
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { MePage as component };
