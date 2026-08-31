import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Plus, Trash2, Search, Download, FileText } from "lucide-react";

export const Route = createFileRoute("/tools/notes")({
  head: () => ({ meta: [{ title: "Quick Notes — SlashAI" }] }),
  component: QuickNotes,
});

type Note = { id: string; title: string; body: string; updated: number };

function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try { return JSON.parse(localStorage.getItem("quick_notes") || "[]"); } catch { return []; }
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const save = (next: Note[]) => {
    setNotes(next);
    try { localStorage.setItem("quick_notes", JSON.stringify(next)); } catch { /* ignore */ }
  };

  const createNote = () => {
    const note: Note = { id: crypto.randomUUID(), title: "Untitled", body: "", updated: Date.now() };
    save([note, ...notes]);
    setSelected(note.id);
  };

  const updateNote = (id: string, field: "title" | "body", val: string) => {
    const next = notes.map((n) => n.id === id ? { ...n, [field]: val, updated: Date.now() } : n);
    save(next);
  };

  const deleteNote = (id: string) => {
    save(notes.filter((n) => n.id !== id));
    if (selected === id) setSelected(null);
  };

  const filtered = useMemo(() => {
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

  return (
    <AppShell title="Quick Notes">
      <div className="flex h-[calc(100vh-100px)] gap-0 pt-4">
        {/* Sidebar */}
        <div className="w-64 shrink-0 border-r border-border pr-4">
          <div className="mb-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-full rounded-lg border border-border bg-surface pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none" placeholder="Search..." />
            </div>
            <button onClick={createNote} className="flex size-8 items-center justify-center rounded-lg bg-primary text-white text-xs hover:bg-primary/90"><Plus className="size-3.5" /></button>
          </div>
          <div className="space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
            {filtered.map((n) => (
              <button key={n.id} onClick={() => setSelected(n.id)} className={`w-full rounded-lg px-3 py-2 text-left transition-all ${selected === n.id ? "bg-primary/10 border border-primary/30" : "hover:bg-surface-elevated border border-transparent"}`}>
                <p className="truncate text-xs font-medium text-foreground">{n.title || "Untitled"}</p>
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{n.body.slice(0, 60) || "Empty"}</p>
              </button>
            ))}
            {filtered.length === 0 && <p className="py-4 text-center text-xs text-muted-foreground">No notes</p>}
          </div>
          <button onClick={exportAll} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs text-muted-foreground hover:text-foreground">
            <Download className="size-3" /> Export all
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 pl-4">
          {current ? (
            <div className="flex h-full flex-col">
              <input value={current.title} onChange={(e) => updateNote(current.id, "title", e.target.value)} className="mb-2 bg-transparent text-lg font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none" placeholder="Title..." />
              <textarea value={current.body} onChange={(e) => updateNote(current.id, "body", e.target.value)} className="flex-1 resize-none bg-transparent text-sm text-foreground leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none" placeholder="Start writing..." />
              <div className="flex items-center justify-between pt-2 text-[10px] text-muted-foreground">
                <span>{current.body.split(/\s+/).filter(Boolean).length} words · {current.body.length} chars</span>
                <button onClick={() => deleteNote(current.id)} className="text-muted-foreground hover:text-red"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Select a note or create a new one
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
