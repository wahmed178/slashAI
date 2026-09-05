import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.flashcard-maker-D9jDvhqm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LS_KEY = "slashai.flashcards";
function FlashcardMaker() {
	const [decks, setDecks] = (0, import_react.useState)(() => {
		try {
			const s = localStorage.getItem(LS_KEY);
			return s ? JSON.parse(s) : { default: [] };
		} catch {
			return { default: [] };
		}
	});
	const [activeDeck, setActiveDeck] = (0, import_react.useState)("default");
	const [front, setFront] = (0, import_react.useState)("");
	const [back, setBack] = (0, import_react.useState)("");
	const [studying, setStudying] = (0, import_react.useState)(false);
	const [currentIdx, setCurrentIdx] = (0, import_react.useState)(0);
	const [showBack, setShowBack] = (0, import_react.useState)(false);
	const [newDeckName, setNewDeckName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(LS_KEY, JSON.stringify(decks));
		} catch {}
	}, [decks]);
	const cards = decks[activeDeck] || [];
	const currentCard = cards[currentIdx];
	const addCard = () => {
		if (!front.trim() || !back.trim()) return;
		setDecks((d) => ({
			...d,
			[activeDeck]: [...d[activeDeck] || [], {
				id: crypto.randomUUID(),
				front: front.trim(),
				back: back.trim(),
				ease: 2.5,
				interval: 1,
				nextReview: Date.now()
			}]
		}));
		setFront("");
		setBack("");
	};
	const gradeCard = (0, import_react.useCallback)((quality) => {
		if (!currentCard) return;
		const updated = { ...currentCard };
		if (quality < 2) {
			updated.interval = 1;
			updated.ease = Math.max(1.3, updated.ease - .2);
		} else {
			updated.interval = Math.round(updated.interval * updated.ease);
			updated.ease = Math.min(3, updated.ease + .1);
		}
		updated.nextReview = Date.now() + updated.interval * 864e5;
		setDecks((d) => ({
			...d,
			[activeDeck]: (d[activeDeck] || []).map((c) => c.id === updated.id ? updated : c)
		}));
		setShowBack(false);
		setCurrentIdx((i) => (i + 1) % cards.length);
	}, [
		currentCard,
		cards.length,
		activeDeck
	]);
	const addDeck = () => {
		if (!newDeckName.trim()) return;
		setDecks((d) => ({
			...d,
			[newDeckName.trim()]: []
		}));
		setActiveDeck(newDeckName.trim());
		setNewDeckName("");
	};
	if (studying && currentCard) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Flashcards",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-xs text-muted-foreground",
					children: [
						"Card ",
						currentIdx + 1,
						" of ",
						cards.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex h-64 w-full max-w-lg cursor-pointer items-center justify-center rounded-2xl border border-border bg-surface p-8 text-center transition-all hover:border-primary/40",
					onClick: () => setShowBack(!showBack),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-medium text-foreground",
						children: showBack ? currentCard.back : currentCard.front
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-xs text-muted-foreground",
					children: showBack ? "How well did you know this?" : "Click card to reveal answer"
				}),
				showBack && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => gradeCard(0),
							className: "rounded-lg bg-red-500/20 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/30",
							children: "Wrong"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => gradeCard(2),
							className: "rounded-lg bg-yellow-500/20 px-4 py-2 text-xs font-medium text-yellow-400 hover:bg-yellow-500/30",
							children: "Hard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => gradeCard(4),
							className: "rounded-lg bg-green-500/20 px-4 py-2 text-xs font-medium text-green-400 hover:bg-green-500/30",
							children: "Easy"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setStudying(false);
						setCurrentIdx(0);
					},
					className: "mt-6 text-xs text-muted-foreground hover:text-foreground",
					children: "← Back to cards"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Flashcards",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🧠 Flashcard Maker"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Create your own flashcard decks. Study with spaced repetition."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-xs font-semibold text-foreground",
							children: "Decks"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: newDeckName,
								onChange: (e) => setNewDeckName(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && addDeck(),
								placeholder: "New deck...",
								className: "h-8 flex-1 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: addDeck,
								className: "h-8 rounded-lg bg-primary px-2 text-xs text-primary-foreground",
								children: "+"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 space-y-1",
							children: Object.keys(decks).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveDeck(d),
								className: `flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${activeDeck === d ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-surface-elevated"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (decks[d] || []).length })]
							}, d))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-xs font-semibold text-foreground",
							children: "Add Card"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: front,
							onChange: (e) => setFront(e.target.value),
							placeholder: "Front (question)",
							className: "mb-1.5 h-8 w-full rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: back,
							onChange: (e) => setBack(e.target.value),
							placeholder: "Back (answer)",
							className: "mb-1.5 h-8 w-full rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addCard,
							className: "h-8 w-full rounded-lg bg-surface-elevated text-xs font-medium hover:bg-accent",
							children: "+ Add Card"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-sm font-semibold text-foreground",
						children: [
							"Cards (",
							cards.length,
							")"
						]
					}), cards.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setStudying(true);
							setCurrentIdx(0);
							setShowBack(false);
						},
						className: "rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90",
						children: [
							"Study (",
							cards.length,
							" cards)"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [cards.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs font-medium text-foreground",
								children: c.front
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-[10px] text-muted-foreground",
								children: c.back
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setDecks((d) => ({
								...d,
								[activeDeck]: (d[activeDeck] || []).filter((x) => x.id !== c.id)
							})),
							className: "ml-2 text-[10px] text-muted-foreground hover:text-red-400",
							children: "×"
						})]
					}, c.id)), cards.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-10 text-center text-sm text-muted-foreground",
						children: "No cards yet. Add some above."
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { FlashcardMaker as component };
