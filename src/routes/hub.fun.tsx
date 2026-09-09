import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { ExternalLink, Search, Dices } from "lucide-react";
import { funCategoryColor } from "@/lib/category-colors";

export const Route = createFileRoute("/hub/fun")({
  head: () => ({
    meta: [
      { title: "Fun Sites Hub - The Most Interesting Websites on the Internet | SlashAI" },
      {
        name: "description",
        content:
          "A hand-picked directory of the most interesting, delightful and pointless websites ever made: neal.fun, bored.com, Bored Button, Window Swap and 25+ more. All free, no signups.",
      },
    ],
  }),
  component: FunSitesHub,
});

interface FunSite {
  name: string;
  url: string;
  emoji: string;
  category: string;
  desc: string;
}

const SITES: FunSite[] = [
  // Interactive explainers / toys
  { name: "neal.fun", url: "https://neal.fun", emoji: "🎈", category: "Interactive", desc: "The internet's playground: spend billions, scale of the universe, deep sea, life stats and more tiny masterpieces." },
  { name: "The Scale of the Universe", url: "https://htwins.net/scale2/", emoji: "🔬", category: "Interactive", desc: "Zoom from Planck length to the entire universe in one scrolling canvas." },
  { name: "Window Swap", url: "https://window-swap.com", emoji: "🪟", category: "Interactive", desc: "Open a random window somewhere in the world and see someone else's view." },
  { name: "Radio Garden", url: "http://radio.garden", emoji: "📻", category: "Interactive", desc: "Spin the globe and listen to live radio from thousands of cities." },
  { name: "FlightRadar24", url: "https://www.flightradar24.com", emoji: "✈️", category: "Interactive", desc: "Watch every plane in the sky, live, in real time." },
  { name: "Earth Camera", url: "https://www.earthcam.com", emoji: "📹", category: "Interactive", desc: "Live public webcams from Times Square, Dublin pubs, zoos and beaches." },
  { name: "The Deep Sea (Neal)", url: "https://neal.fun/deep-sea/", emoji: "🌊", category: "Interactive", desc: "Scroll 10,000 metres down past the creatures that live at every depth." },

  // Time-wasters / games directories
  { name: "Bored.com", url: "https://www.bored.com", emoji: "🥱", category: "Directory", desc: "Hundreds of hand-picked fun websites, mini games and tools - the cure for boredom since forever." },
  { name: "Bored Button", url: "https://www.boredbutton.com", emoji: "🔴", category: "Directory", desc: "Press the big red button and get teleported to a random fun website." },
  { name: "The Useless Web", url: "https://theuselessweb.com", emoji: "🌀", category: "Directory", desc: "One button, endless pointless websites. A legend of the old internet." },
  { name: "Pointer Pointer", url: "https://pointerpointer.com", emoji: "👆", category: "Weird", desc: "Point anywhere at the screen. A photo of someone pointing back appears. Uncanny." },
  { name: "Staggering Beauty", url: "https://www.staggeringbeauty.com", emoji: "🖤", category: "Weird", desc: "A wiggling black worm that gets increasingly chaotic. Warning: flashing lights." },
  { name: "Eel Slap", url: "https://eelslap.com", emoji: "🐟", category: "Weird", desc: "Slap a man in the face with an eel by dragging your mouse. Exactly what it sounds like." },
  { name: "Zoomquilt", url: "https://zoomquilt.org", emoji: "🖼️", category: "Weird", desc: "An infinite zooming painting that never ends. Hypnotic art." },
  { name: "Patatap", url: "https://patatap.com", emoji: "🎹", category: "Weird", desc: "Press any key for animated sounds and shapes. The keyboard becomes an instrument." },

  // Calm / ambient
  { name: "A Soft Murmur", url: "https://asoftmurmur.com", emoji: "🌧️", category: "Calm", desc: "Mix rain, thunder, waves, fire and more into your perfect ambient soundscape." },
  { name: "Calm Sound", url: "https://calmsound.com", emoji: "🌊", category: "Calm", desc: "Nature sounds for sleep, study and relaxation." },
  { name: "Noisli", url: "https://www.noisli.com", emoji: "🎧", category: "Calm", desc: "Background noise and colour generator for focus and relaxation." },
  { name: "Rainy Mood", url: "https://www.rainymood.com", emoji: "☔", category: "Calm", desc: "Just rain. The purest rain sound on the internet since 2007." },
  { name: "This Is Sand", url: "https://thisissand.com", emoji: "🏖️", category: "Calm", desc: "Pour digital sand with your cursor and build layered landscapes. Weirdly meditative." },

  // Games in browser
  { name: "Quick, Draw!", url: "https://quickdraw.withgoogle.com", emoji: "✏️", category: "Games", desc: "Google's neural net guesses your doodles in 20 seconds. Eerily good." },
  { name: "GeoGuessr (free games)", url: "https://www.geoguessr.com", emoji: "🌍", category: "Games", desc: "Get dropped somewhere on Earth and guess where you are." },
  { name: "Skribbl.io", url: "https://skribbl.io", emoji: "🎨", category: "Games", desc: "Free multiplayer drawing and guessing Pictionary-style." },
  { name: "Slither.io", url: "https://slither.io", emoji: "🐍", category: "Games", desc: "Massive multiplayer snake arena. Grow huge, avoid heads." },
  { name: "Cookie Clicker", url: "https://orteil.dashnet.org/cookieclicker/", emoji: "🍪", category: "Games", desc: "The idle game that started it all. Click cookies, buy grandmas." },
  { name: "2048", url: "https://play2048.co", emoji: "🔢", category: "Games", desc: "The original tile-sliding number puzzle that ate 2014." },
  { name: "Mini Metro (browser demo)", url: "https://dinopoloclub.com/minimetro", emoji: "🚇", category: "Games", desc: "Design subway maps under pressure - clean, elegant, addictive." },

  // Learning + curiosity
  { name: "Every Noise at Once", url: "http://everynoise.com", emoji: "🎼", category: "Learning", desc: "An algorithmic map of 6,000+ music genres. Click anything to hear it." },
  { name: "The Secret Language of Birthdays", url: "https://personality.page", emoji: "🎂", category: "Learning", desc: "Personality snapshots by birthday - surprisingly accurate fun." },
  { name: "FutureMe", url: "https://www.futureme.org", emoji: "📬", category: "Learning", desc: "Write an email to your future self, delivered in 1, 3 or 5 years." },
];

const CATEGORIES = ["All", ...new Set(SITES.map((s) => s.category))];

function FunSitesHub() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      SITES.filter((s) => {
        if (category !== "All" && s.category !== category) return false;
        if (q && !`${s.name} ${s.desc} ${s.category}`.toLowerCase().includes(q)) return false;
        return true;
      }),
    [category, q],
  );

  const surprise = () => {
    const site = SITES[Math.floor(Math.random() * SITES.length)]!;
    window.open(site.url, "_blank", "noopener");
  };

  return (
    <AppShell title="Fun Sites Hub">
      <header className="mb-5">
        <h1 className="bg-gradient-to-r from-[#22d3ee] via-[#e879f9] to-[#fbbf24] bg-clip-text text-2xl font-bold tracking-tight text-transparent">🎪 Fun Sites Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {SITES.length} of the most interesting, delightful and gloriously pointless websites ever made.
          Every one free, no signup, safe to open at 2am.
        </p>
      </header>

      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-52 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sites..."
              className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
          </div>
          <button
            onClick={surprise}
            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Dices className="size-4" /> Surprise me
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const cc = c === "All" ? undefined : funCategoryColor(c);
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={
                  active && cc
                    ? { background: cc.hex, borderColor: cc.hex, color: "oklch(0.15 0.02 255)" }
                    : undefined
                }
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
                {c !== "All" && (
                  <span className="ml-1 opacity-70">{SITES.filter((s) => s.category === c).length}</span>
                )}
              </button>
            );
          })}
        </div>

        {q && (
          <p className="text-xs text-muted-foreground">
            {filtered.length} site{filtered.length === 1 ? "" : "s"} found
          </p>
        )}

        <div className="grid gap-2.5 sm:grid-cols-2">
          {filtered.map((site) => {
            const cc = funCategoryColor(site.category);
            return (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noreferrer noopener"
                style={{ "--cat": cc.hex } as React.CSSProperties}
                className="cat cat-glow group flex items-start gap-3 rounded-xl border bg-surface p-4"
              >
                <span className="cat-tile grid size-11 shrink-0 place-items-center rounded-lg text-xl">{site.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                    {site.name}
                    <ExternalLink className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </p>
                  <p className="cat-text mt-0.5 text-[11px] font-semibold uppercase tracking-wide">{site.category}</p>
                  <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{site.desc}</p>
                </div>
              </a>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">Nothing matches that search.</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="mt-2 text-xs font-semibold text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Want games you can play right here instead? Head to{" "}
            <Link to="/play" className="font-semibold text-primary hover:underline">SlashPlay</Link> or browse{" "}
            <Link to="/tools" className="font-semibold text-primary hover:underline">SlashKits</Link>.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
