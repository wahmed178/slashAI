import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/font")({
  component: FontPairingStudio,
});

const MOODS = ["All", "Elegant", "Modern", "Playful", "Technical", "Bold"] as const;

const PAIRINGS = [
  { heading: "Playfair Display", body: "Source Sans 3", mood: "Elegant" },
  { heading: "Cormorant Garamond", body: "Lato", mood: "Elegant" },
  { heading: "Libre Baskerville", body: "Open Sans", mood: "Elegant" },
  { heading: "DM Serif Display", body: "DM Sans", mood: "Modern" },
  { heading: "Space Grotesk", body: "Inter", mood: "Modern" },
  { heading: "Outfit", body: "Plus Jakarta Sans", mood: "Modern" },
  { heading: "Sora", body: "Work Sans", mood: "Modern" },
  { heading: "Manrope", body: "Nunito Sans", mood: "Modern" },
  { heading: "Poppins", body: "Raleway", mood: "Playful" },
  { heading: "Fredoka", body: "Quicksand", mood: "Playful" },
  { heading: "Baloo 2", body: "Nunito", mood: "Playful" },
  { heading: "Comfortaa", body: "Lexend", mood: "Playful" },
  { heading: "Fira Code", body: "JetBrains Mono", mood: "Technical" },
  { heading: "IBM Plex Mono", body: "IBM Plex Sans", mood: "Technical" },
  { heading: "Source Code Pro", body: "Roboto", mood: "Technical" },
  { heading: "Inconsolata", body: "Fira Sans", mood: "Technical" },
  { heading: "Oswald", body: "Roboto Condensed", mood: "Bold" },
  { heading: "Anton", body: "Bebas Neue", mood: "Bold" },
  { heading: "Archivo Black", body: "Barlow", mood: "Bold" },
  { heading: "Black Ops One", body: "Rajdhani", mood: "Bold" },
  { heading: "Italiana", body: "Crimson Text", mood: "Elegant" },
  { heading: "Abril Fatface", body: "Lora", mood: "Elegant" },
  { heading: "Josefin Sans", body: "Montserrat", mood: "Modern" },
  { heading: "Lexend", body: "Inter", mood: "Modern" },
  { heading: "Bricolage Grotesque", body: "Figtree", mood: "Playful" },
  { heading: "Rubik", body: "Karla", mood: "Modern" },
  { heading: "Bitter", body: "Raleway", mood: "Elegant" },
  { heading: "Exo 2", body: "Hind", mood: "Technical" },
  { heading: "Rajdhani", body: "Barlow", mood: "Bold" },
  { heading: "Righteous", body: "Varela Round", mood: "Playful" },
];

function FontPairingStudio() {
  const [sample, setSample] = useState("The quick brown fox jumps over the lazy dog");
  const [mood, setMood] = useState<string>("All");
  const [copied, setCopied] = useState("");
  const [favs, setFavs] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("slashai.font.favs") || "[]")); } catch { return new Set(); }
  });

  const filtered = useMemo(() => mood === "All" ? PAIRINGS : PAIRINGS.filter((p) => p.mood === mood), [mood]);

  const loadFont = (name: string) => {
    const id = name.replace(/\s+/g, "+");
    if (!document.querySelector(`link[href*="${id}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${id}:wght@400;700&display=swap`;
      document.head.appendChild(link);
    }
  };

  const copyCSS = (p: typeof PAIRINGS[0]) => {
    const css = `/* ${p.heading} + ${p.body} */\n@import url('https://fonts.googleapis.com/css2?family=${p.heading.replace(/\s+/g, "+")}:wght@400;700&family=${p.body.replace(/\s+/g, "+")}:wght@400&display=swap');\n\nh1, h2, h3 { font-family: '${p.heading}', serif; }\nbody, p { font-family: '${p.body}', sans-serif; }`;
    navigator.clipboard.writeText(css).catch(() => {});
    setCopied(p.heading);
    setTimeout(() => setCopied(""), 1500);
  };

  const toggleFav = (i: number) => {
    setFavs((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      try { localStorage.setItem("slashai.font.favs", JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const downloadCSS = (p: typeof PAIRINGS[0]) => {
    const css = `@import url('https://fonts.googleapis.com/css2?family=${p.heading.replace(/\s+/g, "+")}:wght@400;700&family=${p.body.replace(/\s+/g, "+")}:wght@400&display=swap');\n\nh1, h2, h3 { font-family: '${p.heading}', serif; }\nbody, p { font-family: '${p.body}', sans-serif; }`;
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `font-pairing-${p.heading.toLowerCase().replace(/\s+/g, "-")}.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell title="Font Pairing Studio">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔤 Font Pairing Studio</h1>
        <p className="mt-1 text-sm text-muted-foreground">50+ Google Font combinations. Preview, copy CSS, download.</p>
      </header>

      <div className="mx-auto max-w-4xl space-y-4">
        <textarea value={sample} onChange={(e) => setSample(e.target.value)} placeholder="Type sample text..." className="h-16 w-full rounded-xl border border-border bg-surface p-3 text-sm focus:outline-none focus:border-primary/50 resize-none" />

        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {MOODS.map((m) => (
            <button key={m} onClick={() => setMood(m)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${mood === m ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>{m}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((p, i) => {
            loadFont(p.heading);
            loadFont(p.body);
            return (
              <div key={i} className="rounded-xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-[#484f58]">
                <div className="flex items-start justify-between mb-2">
                  <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground">{p.mood}</span>
                  <button onClick={() => toggleFav(i)} className="text-sm">{favs.has(i) ? "❤️" : "🤍"}</button>
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: `'${p.heading}', serif` }}>{p.heading}</h3>
                <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: `'${p.body}', sans-serif` }}>{sample}</p>
                <div className="flex gap-2">
                  <button onClick={() => copyCSS(p)} className="flex-1 rounded-lg border border-border bg-surface-elevated py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                    {copied === p.heading ? "✓ Copied!" : "Copy CSS"}
                  </button>
                  <button onClick={() => downloadCSS(p)} className="flex-1 rounded-lg border border-border bg-surface-elevated py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors">Download .css</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
