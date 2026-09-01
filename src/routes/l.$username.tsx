import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/l/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.username} — Link Page | SlashAI` },
      { name: "description", content: `Connect with ${params.username} — all their links in one place.` },
    ],
  }),
  component: PublicProfile,
});

const STORAGE_KEY = "slashai-linktree-profiles";
const THEMES: Record<string, { bg: string; card: string; text: string; border: string; accent: string }> = {
  dark: { bg: "#0a0a0f", card: "#161b22", text: "#f0f6fc", border: "#30363d", accent: "#58a6ff" },
  midnight: { bg: "#0f172a", card: "#1e293b", text: "#f1f5f9", border: "#334155", accent: "#818cf8" },
  ocean: { bg: "#042f2e", card: "#134e4a", text: "#f0fdfa", border: "#2dd4bf", accent: "#2dd4bf" },
  sunset: { bg: "#1c1917", card: "#292524", text: "#fef3c7", border: "#f59e0b", accent: "#f59e0b" },
  lavender: { bg: "#1e1b4b", card: "#312e81", text: "#e0e7ff", border: "#818cf8", accent: "#a78bfa" },
  light: { bg: "#ffffff", card: "#f8fafc", text: "#0f172a", border: "#e2e8f0", accent: "#2563eb" },
  gradient: { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", card: "rgba(255,255,255,0.15)", text: "#ffffff", border: "rgba(255,255,255,0.25)", accent: "#ffffff" },
};

function decodeProfile(hash: string): any | null {
  try {
    const decoded = decodeURIComponent(atob(hash.replace(/^#/, "")));
    const p = JSON.parse(decoded);
    if (p && p.username && p.links) return p;
  } catch {}
  return null;
}

function PublicProfile() {
  const { username } = Route.useParams();
  const [profile, setProfile] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // 1. Try URL hash first (shareable link)
    const hash = window.location.hash;
    if (hash && hash.length > 5) {
      const decoded = decodeProfile(hash);
      if (decoded) { setProfile(decoded); return; }
    }
    // 2. Try localStorage (owner's device)
    try {
      const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const found = profiles.find((p: any) => p.username === username);
      if (found) { setProfile(found); return; }
    } catch {}
    setNotFound(true);
  }, [username]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-white mb-2">Profile not found</h1>
          <p className="text-sm text-gray-400">/{username} doesn't exist yet.</p>
          <a href="/tools/linktree" className="mt-4 inline-block rounded-lg bg-[#58a6ff] px-4 py-2 text-sm font-medium text-white hover:opacity-90">Create your link page</a>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const defaultTheme = { bg: "#0a0a0f", card: "#161b22", text: "#f0f6fc", border: "#30363d", accent: "#58a6ff" };
  const t = THEMES[profile.theme] ?? defaultTheme;

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: t.bg, color: t.text }}>
      <div className="w-full max-w-md">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="size-20 rounded-full flex items-center justify-center text-4xl" style={{ background: t.card, border: `2px solid ${t.border}` }}>
            {profile.avatar || "👤"}
          </div>
        </div>

        {/* Name & Bio */}
        <h1 className="text-center text-2xl font-bold">{profile.name || profile.username}</h1>
        {profile.bio && <p className="mt-2 text-center text-sm opacity-70">{profile.bio}</p>}

        {/* Links */}
        <div className="mt-8 space-y-3">
          {profile.links.map((link: any) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl py-3.5 px-5 text-center font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: t.card, border: `1px solid ${t.border}`, color: t.text }}
            >
              <span className="text-lg">{link.icon || "🔗"}</span>
              <span className="flex-1 text-sm">{link.title}</span>
              <span className="text-xs opacity-50">→</span>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-[10px] opacity-40">Created with SlashAI Link in Bio</p>
          <a href="/tools/linktree" className="text-[10px] opacity-40 hover:opacity-70">Create yours →</a>
        </div>
      </div>
    </div>
  );
}
