import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { L as Search, X as Plus, on as Download, y as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.notes-D9bCwxMe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuickNotes() {
	const [notes, setNotes] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("quick_notes") || "[]");
		} catch {
			return [];
		}
	});
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const save = (next) => {
		setNotes(next);
		try {
			localStorage.setItem("quick_notes", JSON.stringify(next));
		} catch {}
	};
	const createNote = () => {
		const note = {
			id: crypto.randomUUID(),
			title: "Untitled",
			body: "",
			updated: Date.now()
		};
		save([note, ...notes]);
		setSelected(note.id);
	};
	const updateNote = (id, field, val) => {
		const next = notes.map((n) => n.id === id ? {
			...n,
			[field]: val,
			updated: Date.now()
		} : n);
		save(next);
	};
	const deleteNote = (id) => {
		save(notes.filter((n) => n.id !== id));
		if (selected === id) setSelected(null);
	};
	const filtered = (0, import_react.useMemo)(() => {
		return notes.filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase()));
	}, [notes, search]);
	const current = notes.find((n) => n.id === selected);
	const exportAll = () => {
		const text = notes.map((n) => `# ${n.title}\n\n${n.body}`).join("\n\n---\n\n");
		const blob = new Blob([text], { type: "text/markdown" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "notes.md";
		a.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Quick Notes",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[calc(100vh-100px)] gap-0 pt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-64 shrink-0 border-r border-border pr-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: search,
								onChange: (e) => setSearch(e.target.value),
								className: "h-8 w-full rounded-lg border border-border bg-surface pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none",
								placeholder: "Search..."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: createNote,
							className: "flex size-8 items-center justify-center rounded-lg bg-primary text-white text-xs hover:bg-primary/90",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 overflow-y-auto",
						style: { maxHeight: "calc(100vh - 200px)" },
						children: [filtered.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelected(n.id),
							className: `w-full rounded-lg px-3 py-2 text-left transition-all ${selected === n.id ? "bg-primary/10 border border-primary/30" : "hover:bg-surface-elevated border border-transparent"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs font-medium text-foreground",
								children: n.title || "Untitled"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 truncate text-[10px] text-muted-foreground",
								children: n.body.slice(0, 60) || "Empty"
							})]
						}, n.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-4 text-center text-xs text-muted-foreground",
							children: "No notes"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: exportAll,
						className: "mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), " Export all"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 pl-4",
				children: current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: current.title,
							onChange: (e) => updateNote(current.id, "title", e.target.value),
							className: "mb-2 bg-transparent text-lg font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none",
							placeholder: "Title..."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: current.body,
							onChange: (e) => updateNote(current.id, "body", e.target.value),
							className: "flex-1 resize-none bg-transparent text-sm text-foreground leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none",
							placeholder: "Start writing..."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-2 text-[10px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								current.body.split(/\s+/).filter(Boolean).length,
								" words · ",
								current.body.length,
								" chars"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => deleteNote(current.id),
								className: "text-muted-foreground hover:text-red",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full items-center justify-center text-sm text-muted-foreground",
					children: "Select a note or create a new one"
				})
			})]
		})
	});
}
//#endregion
export { QuickNotes as component };
