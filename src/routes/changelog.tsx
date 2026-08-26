import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — SlashAI" },
      {
        name: "description",
        content:
          "What's new in SlashAI — every feature, fix, and improvement.",
      },
    ],
  }),
  component: ChangelogPage,
});

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

const ENTRIES: ChangelogEntry[] = [
  {
    version: "2.5.0",
    date: "August 2026",
    title: "Navigation redesign, trending commands, glass tier",
    changes: [
      "Trending /commands page with 80 viral slash modifiers",
      "Command of the Week spotlight with detail drawer",
      "Glass tier waitlist page (/glass)",
      "About page with full editorial content",
      "Changelog page with timeline layout",
      "Bottom tab bar expanded to 5 tabs",
      "Global keyboard shortcuts: /, ?, G+H, G+D, G+T, G+L",
      "South Asia & Global free resources section (India, Pakistan, Bangladesh, Arab)",
      "40+ new free APIs added to Discover",
    ],
  },
  {
    version: "2.4.0",
    date: "August 2026",
    title: "Live dashboard expanded, new hubs",
    changes: [
      "Live dashboard: Gold/Silver prices, Global indices, Earthquake alerts",
      "Prayer times (Aladhan API) + Hijri calendar on Live page",
      "ISS location, NASA APOD, Moon phase on Live page",
      "Word of the Day panel (Free Dictionary API)",
      "India Hub, Finance Hub, Designer Hub, Founder Hub launched",
      "Health Hub launched with fitness, nutrition, mental health resources",
    ],
  },
  {
    version: "2.3.0",
    date: "August 2026",
    title: "Generators, roadmaps, glossary, journal",
    changes: [
      "10 Founder Generators powered by Claude API",
      "25 generators across 4 categories: Business, Content, Legal & Ops, Growth",
      "6 Founder Roadmaps with step completion tracking",
      "20 roadmaps covering startup, career, skill-building journeys",
      "AI Glossary: 560+ terms across 8 categories",
      "Build Journal with mood chips, streaks, and 12 achievement badges",
      "Discover: Free APIs section with 65+ documented APIs",
      "YouTube channels expanded to 62 curated channels",
    ],
  },
  {
    version: "2.0.0",
    date: "July 2026",
    title: "Major rebuild — 5,635 commands",
    changes: [
      "Complete rebuild with Lovable + TanStack Start",
      "5,635 AI slash commands indexed and searchable",
      "Discover section launched with 317+ curated resources",
      "Live dashboard: weather, cricket, football, India news",
      "Hubs: Students, Professionals, Developers, Creators",
      "16 curated command collections by role",
      "PWA with offline support and installability",
      "Command of the Day + Random Command features",
    ],
  },
];

function ChangelogPage() {
  return (
    <AppShell hideHeaderSearch title="Changelog">
      <div className="pt-2">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#e6edf3] sm:text-3xl">
            Changelog
          </h1>
          <p className="mt-1.5 text-sm text-[#8b949e]">
            What's new in SlashAI — every feature, fix, and improvement.
          </p>
        </header>

        {/* Timeline */}
        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#30363d]" />

          {ENTRIES.map((entry, i) => (
            <div key={entry.version} className="relative flex gap-5 pb-10 last:pb-0">
              {/* Dot */}
              <div className="relative z-10 mt-1 flex shrink-0 items-start">
                <div className="size-[10px] rounded-full border-2 border-[#58a6ff] bg-[#0d1117]" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="rounded-full bg-[#58a6ff]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#58a6ff]">
                    v{entry.version}
                  </span>
                  <span className="text-[11px] text-[#8b949e]">
                    {entry.date}
                  </span>
                </div>
                <h2 className="mt-2 text-base font-semibold text-[#e6edf3]">
                  {entry.title}
                </h2>
                <ul className="mt-2 space-y-1.5">
                  {entry.changes.map((change, j) => (
                    <li
                      key={j}
                      className="flex gap-2 text-[13px] leading-relaxed text-[#8b949e]"
                    >
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-[#30363d]" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
