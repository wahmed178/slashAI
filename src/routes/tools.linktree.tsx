import { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/linktree")({ component: LinkTreeBuilder });

interface LinkItem { id: string; title: string; url: string; icon?: string; }
interface Profile { username: string; name: string; bio: string; avatar: string; theme: string; links: LinkItem[]; }

const STORAGE_KEY = "slashai-linktree-profiles";
const THEMES = [
  { id: "dark", label: "Dark", bg: "#0a0a0f", card: "#161b22", text: "#f0f6fc", border: "#30363d", accent: "#58a6ff" },
  { id: "midnight", label: "Midnight", bg: "#0f172a", card: "#1e293b", text: "#f1f5f9", border: "#334155", accent: "#818cf8" },
  { id: "ocean", label: "Ocean", bg: "#042f2e", card: "#134e4a", text: "#f0fdfa", border: "#2dd4bf", accent: "#2dd4bf" },
  { id: "sunset", label: "Sunset", bg: "#1c1917", card: "#292524", text: "#fef3c7", border: "#f59e0b", accent: "#f59e0b" },
  { id: "lavender", label: "Lavender", bg: "#1e1b4b", card: "#312e81", text: "#e0e7ff", border: "#818cf8", accent: "#a78bfa" },
  { id: "light", label: "Light", bg: "#ffffff", card: "#f8fafc", text: "#0f172a", border: "#e2e8f0", accent: "#2563eb" },
  { id: "gradient", label: "Gradient", bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", card: "rgba(255,255,255,0.15)", text: "#ffffff", border: "rgba(255,255,255,0.25)", accent: "#ffffff" },
];

const ICONS = ["🔗", "🌐", "📸", "🐦", "💼", "🎵", "📺", "📝", "🎮", "🛒", "📧", "📱", "💻", "🎨", "📷", "🔊", "📚", "🎯", "⚡", "🚀"];

function LinkTreeBuilder() {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkIcon, setLinkIcon] = useState("🔗");
  const [copied, setCopied] = useState("");
  const [showThemes, setShowThemes] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles)); } catch {}
  }, [profiles]);

  const createProfile = () => {
    const p: Profile = { username: "", name: "", bio: "", avatar: "👤", theme: "dark", links: [] };
    setActiveProfile(p);
    setEditing(true);
  };

  const saveProfile = () => {
    if (!activeProfile) return;
    const p = activeProfile;
    if (!p.username.trim()) return;
    setProfiles((prev) => {
      const existing = prev.findIndex((x) => x.username === p.username);
      if (existing >= 0) { const next = [...prev]; next[existing] = p; return next; }
      return [...prev, p];
    });
    setEditing(false);
  };

  const deleteProfile = (username: string) => {
    setProfiles((prev) => prev.filter((p) => p.username !== username));
    setActiveProfile(null);
  };

  const addLink = () => {
    if (!linkTitle.trim() || !linkUrl.trim() || !activeProfile) return;
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    setActiveProfile({ ...activeProfile, links: [...activeProfile.links, { id: crypto.randomUUID(), title: linkTitle.trim(), url, icon: linkIcon }] });
    setLinkTitle(""); setLinkUrl(""); setLinkIcon("🔗");
  };

  const removeLink = (id: string) => {
    if (!activeProfile) return;
    setActiveProfile({ ...activeProfile, links: activeProfile.links.filter((l) => l.id !== id) });
  };

  const moveLink = (id: string, dir: -1 | 1) => {
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
    setActiveProfile({ ...activeProfile, links });
  };

  const shareUrl = activeProfile?.username ? `${window.location.origin}/l/${activeProfile.username}` : "";

  const copyShare = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied("share"); setTimeout(() => setCopied(""), 1200); } catch {}
  };

  const t = THEMES.find((th) => th.id === activeProfile?.theme) || THEMES[0];

  return (
    <AppShell title="Link in Bio Builder">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔗 Link in Bio Builder</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create your personal link page. Save, share, and download as HTML.</p>
      </header>

      {!activeProfile ? (
        <div className="mx-auto max-w-2xl space-y-4">
          {profiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Your Profiles</p>
              {profiles.map((p) => (
                <div key={p.username} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">{p.avatar || "👤"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{p.name || p.username}</p>
                    <p className="text-[11px] text-muted-foreground">/{p.username} · {p.links.length} links</p>
                  </div>
                  <Link to={`/l/${p.username}`} className="text-[11px] text-primary hover:underline">View</Link>
                  <button onClick={() => { setActiveProfile(p); setEditing(true); }} className="text-[11px] text-muted-foreground hover:text-foreground">Edit</button>
                  <button onClick={() => deleteProfile(p.username)} className="text-[11px] text-muted-foreground hover:text-red-400">Delete</button>
                </div>
              ))}
            </div>
          )}
          <button onClick={createProfile} className="w-full rounded-xl border-2 border-dashed border-border bg-surface py-8 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
            + Create New Link Page
          </button>
        </div>
      ) : editing ? (
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-[10px] text-muted-foreground">Username (unique)</label>
              <input value={activeProfile.username} onChange={(e) => setActiveProfile({ ...activeProfile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })} placeholder="yourname"
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm" /></div>
            <div><label className="mb-1 block text-[10px] text-muted-foreground">Display Name</label>
              <input value={activeProfile.name} onChange={(e) => setActiveProfile({ ...activeProfile, name: e.target.value })} placeholder="Your Name"
                className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm" /></div>
          </div>
          <div><label className="mb-1 block text-[10px] text-muted-foreground">Bio</label>
            <input value={activeProfile.bio} onChange={(e) => setActiveProfile({ ...activeProfile, bio: e.target.value })} placeholder="Developer, creator, etc."
              className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm" /></div>

          {/* Avatar */}
          <div><label className="mb-1 block text-[10px] text-muted-foreground">Avatar Emoji</label>
            <div className="flex gap-1.5 flex-wrap">
              {["👤", "👨", "👩", "🧑", "Developer", "Designer", "Creator", "Student", "🚀", "⚡", "🎨", "💼"].map((a) => (
                <button key={a} onClick={() => setActiveProfile({ ...activeProfile, avatar: a })}
                  className={`size-9 rounded-lg border text-sm flex items-center justify-center ${activeProfile.avatar === a ? "border-primary bg-primary/10" : "border-border bg-surface"}`}>{a}</button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div><label className="mb-1 block text-[10px] text-muted-foreground">Theme</label>
            <div className="flex gap-2 flex-wrap">
              {THEMES.map((th) => (
                <button key={th.id} onClick={() => setActiveProfile({ ...activeProfile, theme: th.id })}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${activeProfile.theme === th.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                  <div className="size-4 rounded" style={{ background: th.bg, border: `1px solid ${th.border}` }} />
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Add Link */}
          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <p className="text-xs font-semibold text-foreground">Add Link</p>
            <div className="flex gap-2 items-center">
              <select value={linkIcon} onChange={(e) => setLinkIcon(e.target.value)} className="h-9 w-12 rounded-lg border border-border bg-surface-elevated text-center text-sm">
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
              <input value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="Link title" className="h-9 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm" />
              <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="h-9 flex-1 rounded-lg border border-border bg-surface-elevated px-3 text-sm" />
              <button onClick={addLink} className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-background hover:opacity-90">Add</button>
            </div>
          </div>

          {/* Links List */}
          {activeProfile.links.length > 0 && (
            <div className="space-y-1.5">
              {activeProfile.links.map((l, i) => (
                <div key={l.id} className="flex items-center gap-2 rounded-lg border border-border bg-surface p-2.5">
                  <span className="text-lg">{l.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{l.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{l.url}</p>
                  </div>
                  <button onClick={() => moveLink(l.id, -1)} disabled={i === 0} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">↑</button>
                  <button onClick={() => moveLink(l.id, 1)} disabled={i === activeProfile.links.length - 1} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">↓</button>
                  <button onClick={() => removeLink(l.id)} className="text-xs text-muted-foreground hover:text-red-400">✕</button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={saveProfile} disabled={!activeProfile.username.trim()} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">Save Profile</button>
            <button onClick={() => { setActiveProfile(null); setEditing(false); }} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
