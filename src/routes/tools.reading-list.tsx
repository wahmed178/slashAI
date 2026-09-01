import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/reading-list")({
  component: BookTracker,
});

interface Book {
  id: number; title: string; author: string;
  status: "want" | "reading" | "finished";
  rating: number; notes: string; genre: string;
  startDate?: string;  finishDate?: string | undefined;
}

const STATUS_LABELS = { want: "Want to Read", reading: "Reading", finished: "Finished" };

function BookTracker() {
  const [books, setBooks] = useState<Book[]>(() => {
    try { return JSON.parse(localStorage.getItem("slashai.reading-list") || "[]"); } catch { return []; }
  });
  const [filter, setFilter] = useState<"all" | "want" | "reading" | "finished">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", genre: "", notes: "" });

  const save = (b: Book[]) => { setBooks(b); try { localStorage.setItem("slashai.reading-list", JSON.stringify(b)); } catch {} };

  const addBook = () => {
    if (!form.title.trim()) return;
    save([...books, { id: Date.now(), ...form, status: "want", rating: 0 }]);
    setForm({ title: "", author: "", genre: "", notes: "" });
    setShowAdd(false);
  };

  const updateStatus = (id: number, status: Book["status"]) => {
    save(books.map((b) => b.id === id ? { ...b, status, finishDate: status === "finished" ? new Date().toISOString().split("T")[0] : b.finishDate } : b));
  };

  const updateRating = (id: number, rating: number) => {
    save(books.map((b) => b.id === id ? { ...b, rating } : b));
  };

  const removeBook = (id: number) => save(books.filter((b) => b.id !== id));

  const filtered = filter === "all" ? books : books.filter((b) => b.status === filter);
  const finishedThisYear = books.filter((b) => b.status === "finished" && b.finishDate?.startsWith(new Date().getFullYear().toString())).length;
  const avgRating = books.filter((b) => b.rating > 0);
  const avg = avgRating.length > 0 ? (avgRating.reduce((a, b) => a + b.rating, 0) / avgRating.length).toFixed(1) : "—";
  const genres = [...new Set(books.map((b) => b.genre).filter(Boolean))];

  const exportCSV = () => {
    const csv = "Title,Author,Status,Rating,Genre\n" + books.map((b) => `"${b.title}","${b.author}","${STATUS_LABELS[b.status]}",${b.rating},"${b.genre}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "reading-list.csv"; a.click();
  };

  return (
    <AppShell title="Book Tracker">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📚 Reading List</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track books privately — no social pressure, just your reading journey.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-surface p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{books.length}</p>
            <p className="text-[10px] text-muted-foreground">Total Books</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 text-center">
            <p className="text-2xl font-bold text-primary">{finishedThisYear}</p>
            <p className="text-[10px] text-muted-foreground">Read This Year</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{avg}</p>
            <p className="text-[10px] text-muted-foreground">Avg Rating</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {(["all", "want", "reading", "finished"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
              {f === "all" ? `All (${books.length})` : `${STATUS_LABELS[f]} (${books.filter((b) => b.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => setShowAdd(!showAdd)} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90">+ Add Book</button>
          <button onClick={exportCSV} className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Export CSV</button>
        </div>

        {showAdd && (
          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Book title" className="h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none" />
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author" className="h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none" />
            <input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} placeholder="Genre (e.g. Fiction, Self-help)" className="h-9 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm focus:outline-none" />
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes (optional)" className="h-16 w-full rounded-lg border border-border bg-surface-elevated p-3 text-sm focus:outline-none resize-none" />
            <button onClick={addBook} disabled={!form.title.trim()} className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40">Add Book</button>
          </div>
        )}

        {/* Book list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No books yet. Add your first book!</p>
          ) : filtered.map((book) => (
            <div key={book.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{book.title}</p>
                  <p className="text-xs text-muted-foreground">{book.author}{book.genre ? ` · ${book.genre}` : ""}</p>
                </div>
                <button onClick={() => removeBook(book.id)} className="text-xs text-muted-foreground hover:text-red-400">✕</button>
              </div>
              <div className="mt-2 flex gap-2">
                {(["want", "reading", "finished"] as const).map((s) => (
                  <button key={s} onClick={() => updateStatus(book.id, s)}
                    className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${book.status === s ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} onClick={() => updateRating(book.id, r)} className="text-sm">{r <= book.rating ? "⭐" : "☆"}</button>
                ))}
              </div>
              {book.notes && <p className="mt-2 text-xs text-muted-foreground">{book.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
