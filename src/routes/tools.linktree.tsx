import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/linktree")({ component: LinkTreeBuilder });

interface Link { id: string; title: string; url: string }

function LinkTreeBuilder() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [theme, setTheme] = useState<"dark" | "light" | "gradient">("dark");

  const addLink = () => {
    if (!title.trim() || !url.trim()) return;
    setLinks(l => [...l, { id: crypto.randomUUID(), title: title.trim(), url: url.trim() }]);
    setTitle(""); setUrl("");
  };

  const removeLink = (id: string) => setLinks(l => l.filter(x => x.id !== id));

  const themes = {
    dark: { bg: "#0a0a0f", card: "#161b22", text: "#f0f6fc", border: "#30363d" },
    light: { bg: "#ffffff", card: "#f6f6f6", text: "#1a1a1a", border: "#e0e0e0" },
    gradient: { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", card: "rgba(255,255,255,0.2)", text: "#ffffff", border: "rgba(255,255,255,0.3)" },
  };

  const t = themes[theme];

  const exportHTML = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name || username}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Inter,system-ui,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;background:${t.bg};color:${t.text};padding:2rem}.container{max-width:400px;width:100%}.name{font-size:1.5rem;font-weight:700;text-align:center}.bio{text-align:center;margin:0.5rem 0 1.5rem;opacity:0.7;font-size:0.875rem}.link{display:block;padding:0.75rem 1.5rem;background:${t.card};border:1px solid ${t.border};border-radius:0.5rem;text-decoration:none;color:${t.text};text-align:center;margin-bottom:0.75rem;font-weight:500;transition:transform 0.15s}.link:hover{transform:translateY(-2px)}</style></head><body><div class="container"><div class="name">${name}</div><div class="bio">${bio}</div>${links.map(l => `<a class="link" href="${l.url}" target="_blank">${l.title}</a>`).join("")}</div></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${username || "linktree"}.html`; a.click();
  };

  return (
    <AppShell title="Link in Bio Builder">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔗 Free Link in Bio Builder</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create your personal link page. Download as HTML — works offline.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[10px] text-muted-foreground">Your Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Waseem Ahmed"
                className="h-8 w-full rounded-lg border border-border bg-surface px-2.5 text-xs focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-muted-foreground">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="waseem"
                className="h-8 w-full rounded-lg border border-border bg-surface px-2.5 text-xs focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-muted-foreground">Bio</label>
            <input value={bio} onChange={e => setBio(e.target.value)} placeholder="Developer, creator, etc."
              className="h-8 w-full rounded-lg border border-border bg-surface px-2.5 text-xs focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-muted-foreground">Theme</label>
            <div className="flex gap-1.5">
              {(["dark", "light", "gradient"] as const).map(th => (
                <button key={th} onClick={() => setTheme(th)} className={`rounded-lg border px-3 py-1 text-[10px] transition-colors ${theme === th ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{th}</button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3">
            <h3 className="mb-2 text-xs font-semibold">Add Link</h3>
            <div className="flex gap-1.5">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="h-8 flex-1 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none" />
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" className="h-8 flex-1 rounded-lg border border-border bg-surface-elevated px-2 text-xs focus:outline-none" />
              <button onClick={addLink} className="h-8 rounded-lg bg-primary px-2 text-xs text-primary-foreground">+</button>
            </div>
            <div className="mt-2 space-y-1">
              {links.map(l => (
                <div key={l.id} className="flex items-center justify-between rounded-lg bg-surface-elevated px-2.5 py-1.5 text-xs">
                  <span className="truncate">{l.title} → {l.url}</span>
                  <button onClick={() => removeLink(l.id)} className="ml-2 text-muted-foreground hover:text-red-400">×</button>
                </div>
              ))}
            </div>
          </div>
          <button onClick={exportHTML} disabled={!name || links.length === 0}
            className="h-9 w-full rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40">
            Download HTML
          </button>
        </div>

        <div className="flex flex-col items-center">
          <p className="mb-2 text-[10px] text-muted-foreground">Preview — /l/{username || "username"}</p>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: t.bg, color: t.text }}>
            <p className="text-center text-lg font-bold">{name || "Your Name"}</p>
            <p className="mt-1 text-center text-xs opacity-70">{bio || "Your bio here"}</p>
            <div className="mt-4 space-y-2">
              {links.length > 0 ? links.map(l => (
                <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="block rounded-lg py-2.5 text-center text-xs font-medium transition-transform hover:-translate-y-0.5"
                  style={{ background: t.card, border: `1px solid ${t.border}`, color: t.text }}>
                  {l.title}
                </a>
              )) : <p className="py-4 text-center text-xs opacity-50">Add links to see preview</p>}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
