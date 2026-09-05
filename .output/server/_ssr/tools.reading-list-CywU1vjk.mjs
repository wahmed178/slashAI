import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.reading-list-CywU1vjk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_LABELS = {
	want: "Want to Read",
	reading: "Reading",
	finished: "Finished"
};
function BookTracker() {
	const [books, setBooks] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("slashai.reading-list") || "[]");
		} catch {
			return [];
		}
	});
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [showAdd, setShowAdd] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		author: "",
		genre: "",
		notes: ""
	});
	const save = (b) => {
		setBooks(b);
		try {
			localStorage.setItem("slashai.reading-list", JSON.stringify(b));
		} catch {}
	};
	const addBook = () => {
		if (!form.title.trim()) return;
		save([...books, {
			id: Date.now(),
			...form,
			status: "want",
			rating: 0
		}]);
		setForm({
			title: "",
			author: "",
			genre: "",
			notes: ""
		});
		setShowAdd(false);
	};
	const updateStatus = (id, status) => {
		save(books.map((b) => b.id === id ? {
			...b,
			status,
			finishDate: status === "finished" ? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : b.finishDate
		} : b));
	};
	const updateRating = (id, rating) => {
		save(books.map((b) => b.id === id ? {
			...b,
			rating
		} : b));
	};
	const removeBook = (id) => save(books.filter((b) => b.id !== id));
	const filtered = filter === "all" ? books : books.filter((b) => b.status === filter);
	const finishedThisYear = books.filter((b) => b.status === "finished" && b.finishDate?.startsWith((/* @__PURE__ */ new Date()).getFullYear().toString())).length;
	const avgRating = books.filter((b) => b.rating > 0);
	const avg = avgRating.length > 0 ? (avgRating.reduce((a, b) => a + b.rating, 0) / avgRating.length).toFixed(1) : "—";
	[...new Set(books.map((b) => b.genre).filter(Boolean))];
	const exportCSV = () => {
		const csv = "Title,Author,Status,Rating,Genre\n" + books.map((b) => `"${b.title}","${b.author}","${STATUS_LABELS[b.status]}",${b.rating},"${b.genre}"`).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "reading-list.csv";
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Book Tracker",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "📚 Reading List"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Track books privately — no social pressure, just your reading journey."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold text-foreground",
								children: books.length
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Total Books"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold text-primary",
								children: finishedThisYear
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Read This Year"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold text-foreground",
								children: avg
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Avg Rating"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto",
					style: { scrollbarWidth: "none" },
					children: [
						"all",
						"want",
						"reading",
						"finished"
					].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setFilter(f),
						className: `shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`,
						children: f === "all" ? `All (${books.length})` : `${STATUS_LABELS[f]} (${books.filter((b) => b.status === f).length})`
					}, f))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowAdd(!showAdd),
						className: "flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90",
						children: "+ Add Book"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: exportCSV,
						className: "rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
						children: "Export CSV"
					})]
				}),
				showAdd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.title,
							onChange: (e) => setForm({
								...form,
								title: e.target.value
							}),
							placeholder: "Book title",
							className: "h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.author,
							onChange: (e) => setForm({
								...form,
								author: e.target.value
							}),
							placeholder: "Author",
							className: "h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.genre,
							onChange: (e) => setForm({
								...form,
								genre: e.target.value
							}),
							placeholder: "Genre (e.g. Fiction, Self-help)",
							className: "h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: form.notes,
							onChange: (e) => setForm({
								...form,
								notes: e.target.value
							}),
							placeholder: "Notes (optional)",
							className: "h-16 w-full rounded-lg border border-border bg-surface-elevated p-3 text-sm focus:outline-none resize-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addBook,
							disabled: !form.title.trim(),
							className: "w-full rounded-lg bg-primary py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40",
							children: "Add Book"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm text-muted-foreground py-8",
						children: "No books yet. Add your first book!"
					}) : filtered.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-foreground",
										children: book.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [book.author, book.genre ? ` · ${book.genre}` : ""]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeBook(book.id),
									className: "text-xs text-muted-foreground hover:text-red-400",
									children: "✕"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex gap-2",
								children: [
									"want",
									"reading",
									"finished"
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => updateStatus(book.id, s),
									className: `rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${book.status === s ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`,
									children: STATUS_LABELS[s]
								}, s))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex gap-1",
								children: [
									1,
									2,
									3,
									4,
									5
								].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => updateRating(book.id, r),
									className: "text-sm",
									children: r <= book.rating ? "⭐" : "☆"
								}, r))
							}),
							book.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: book.notes
							})
						]
					}, book.id))
				})
			]
		})]
	});
}
//#endregion
export { BookTracker as component };
