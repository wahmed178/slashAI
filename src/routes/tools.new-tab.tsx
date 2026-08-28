import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

const DEFAULT_BOOKMARKS = [
  { icon: "\u{1F5BC}\u{FE0F}", name: "SlashAI", url: "https://slashai-nu.vercel.app" },
  { icon: "\u{2709}\u{FE0F}", name: "Gmail", url: "https://mail.google.com" },
  { icon: "\u{1F3AC}", name: "YouTube", url: "https://youtube.com" },
  { icon: "\u{1F4AC}", name: "WhatsApp", url: "https://web.whatsapp.com" },
  { icon: "\u{1F50D}", name: "Google", url: "https://google.com" },
  { icon: "\u{1F419}", name: "GitHub", url: "https://github.com" },
];

function getGreeting(hour: number) {
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export const Route = createFileRoute("/tools/new-tab")({
  head: () => ({ meta: [{ title: "New Tab Screen \u2014 SlashAI" }] }),
  component: NewTabScreen,
});

function NewTabScreen() {
  const [now, setNow] = useState(new Date());
  const [name, setName] = useState(() => localStorage.getItem("newtab-name") || "");
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("newtab-bookmarks") || "null") || DEFAULT_BOOKMARKS; } catch { return DEFAULT_BOOKMARKS; }
  });

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    if (search.startsWith("/")) window.location.href = `https://slashai-nu.vercel.app/search?q=${encodeURIComponent(search)}`;
    else window.location.href = `https://www.google.com/search?q=${encodeURIComponent(search)}`;
  };

  const saveName = () => { localStorage.setItem("newtab-name", name); };
  const saveBookmarks = () => { localStorage.setItem("newtab-bookmarks", JSON.stringify(bookmarks)); setEditMode(false); };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4" style={{ background: "#0d1117" }}>
      {/* Greeting */}
      <p className="text-lg text-muted-foreground">
        {getGreeting(now.getHours())}, {name || "builder"} {"\u2600\u{FE0F}"}
      </p>
      {!name && (
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} onBlur={saveName}
          onKeyDown={(e) => e.key === "Enter" && saveName()}
          placeholder="What's your name?"
          className="mt-1 bg-transparent text-center text-lg text-foreground border-b border-border focus:border-primary focus:outline-none" />
      )}

      {/* Time */}
      <p className="mt-6 text-7xl sm:text-9xl font-bold font-mono text-foreground tracking-tight">
        {now.toLocaleTimeString("en-US", { hour12: false })}
      </p>
      <p className="mt-2 text-lg text-muted-foreground">
        {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      </p>

      {/* Search */}
      <form onSubmit={handleSearch} className="mt-8 w-full max-w-md">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search the web or /command\u2026"
          className="w-full rounded-xl border border-border bg-surface px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
      </form>

      {/* Bookmarks */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {bookmarks.map((b: any, i: number) => (
          <a key={i} href={b.url} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface p-3 w-16 transition-all hover:border-primary/40 hover:-translate-y-0.5">
            <span className="text-xl">{b.icon}</span>
            <span className="text-[10px] text-muted-foreground truncate w-full text-center">{b.name}</span>
          </a>
        ))}
        <button type="button" onClick={() => setEditMode(!editMode)}
          className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-border p-3 w-16 text-muted-foreground hover:text-foreground">
          <span className="text-xl">+</span>
          <span className="text-[10px]">Edit</span>
        </button>
      </div>

      {editMode && (
        <div className="mt-4 rounded-xl border border-border bg-surface p-4 max-w-sm w-full">
          <p className="text-xs text-muted-foreground mb-2">Edit bookmarks (icon | name | url, one per line)</p>
          <textarea
            defaultValue={bookmarks.map((b: any) => `${b.icon} | ${b.name} | ${b.url}`).join("\n")}
            onBlur={(e) => {
              const lines = e.target.value.split("\n").filter(Boolean);
              const newBookmarks = lines.map((l) => {
                const parts = l.split("|").map((s) => s.trim());
                return { icon: parts[0] || "\u{1F516}", name: parts[1] || "Link", url: parts[2] || "#" };
              });
              setBookmarks(newBookmarks);
            }}
            className="w-full rounded-lg border border-border bg-surface-elevated p-2 font-mono text-xs text-foreground h-32 focus:border-primary focus:outline-none" />
          <button type="button" onClick={saveBookmarks}
            className="mt-2 min-h-[36px] w-full rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground">Save</button>
        </div>
      )}
    </div>
  );
}
