import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  X,
  Copy,
  Check,
  ExternalLink,
  Heart,
  Flame,
  Compass,
  Sparkles,
} from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { EmptyState } from "@/components/library/CommandGrid";
import {
  VIRAL_PROMPTS,
  CATEGORY_GRADIENTS,
  CATEGORY_EMOJI,
  type PromptCategory,
} from "@/lib/viral-prompts";
import { SOUTH_ASIA_RESOURCES } from "@/lib/south-asia-resources";
import { NEW_APIS } from "@/lib/new-apis";
import {
  SECTIONS,
  resourcesBySection,
  RESOURCE_TOTAL,
  type Resource,
} from "@/lib/resources";
import { VERIFIED_TOTAL, CATEGORY_ICONS } from "@/lib/commands";

/* ═══════════════════════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════════════════════ */

type CardType = "prompt" | "resource" | "command";

interface DiscoverCard {
  id: string;
  type: CardType;
  title: string;
  description: string;
  category: string;
  gradient?: string;
  emoji?: string;
  badge?: string;
  prompt?: string;
  url?: string;
  pricing?: string;
}

const CATEGORY_GRADIENT_MAP: Record<string, string> = {
  "AI Tools": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "Free APIs": "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
  YouTube: "linear-gradient(135deg, #ff0000 0%, #ff6b6b 100%)",
  GitHub: "linear-gradient(135deg, #24292e 0%, #586069 100%)",
  Courses: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "India Hub": "linear-gradient(135deg, #ff9933 0%, #138808 100%)",
  Finance: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  Health: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  Students: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  Developers: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)",
  Founders: "linear-gradient(135deg, #f77062 0%, #fe5196 100%)",
  Designers: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
};

const FILTER_TABS = [
  "All",
  "🔥 Trending",
  "🎨 Prompts",
  "🛠️ Tools",
  "📡 APIs",
  "🎬 YouTube",
  "💻 GitHub",
  "📚 Courses",
  "🇮🇳 India",
  "💰 Finance",
  "🏥 Health",
  "🎓 Students",
  "💼 Founders",
  "🎨 Designers",
  "🌍 South Asia",
] as const;

/* ═══════════════════════════════════════════════════════════════════
   COPY BUTTON
   ═══════════════════════════════════════════════════════════════════ */
function CopyBtn({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);
  return (
    <button
      type="button"
      onClick={copy}
      className={`flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-all ${className}`}
      style={{
        background: copied ? "#3fb950" : "var(--primary)",
        color: "#fff",
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PROMPT CARD (Type A)
   ═══════════════════════════════════════════════════════════════════ */
function PromptCard({
  prompt,
  featured = false,
}: {
  prompt: typeof VIRAL_PROMPTS[0];
  featured?: boolean;
}) {
  const encoded = encodeURIComponent(prompt.prompt);
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 ${featured ? "col-span-2 row-span-2" : ""}`}
      style={{ background: CATEGORY_GRADIENTS[prompt.category] }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-0.5 text-[11px] font-semibold text-white">
          {prompt.badge}
        </span>
        {prompt.viral && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-red-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white">
            🔥
          </span>
        )}
      </div>
      <span className={`block ${featured ? "text-4xl" : "text-2xl"} mt-2`} aria-hidden>
        {CATEGORY_EMOJI[prompt.category]}
      </span>
      <h3 className={`mt-2 font-black text-white ${featured ? "text-2xl" : "text-base"}`}>
        {prompt.title}
      </h3>
      <p className={`mt-1 text-white/80 ${featured ? "text-sm" : "text-xs"}`}>{prompt.teaser}</p>

      {featured && (
        <div className="mt-3 rounded-lg p-3" style={{ background: "rgba(0,0,0,0.4)" }}>
          <p className="text-xs leading-relaxed text-white/85 whitespace-pre-wrap">"{prompt.prompt}"</p>
        </div>
      )}

      <div className="mt-3 flex gap-1.5">
        <CopyBtn
          text={prompt.prompt}
          className={`flex-1 ${featured ? "h-10 text-sm" : "h-9 text-xs"}`}
        />
        <a
          href={`https://chat.openai.com/?q=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 ${featured ? "h-10 w-10" : "h-9 w-9"}`}
        >
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RESOURCE CARD (Type B)
   ═══════════════════════════════════════════════════════════════════ */
function ResourceCardItem({ resource }: { resource: Resource }) {
  const domain = resource.url
    ? new URL(resource.url).hostname.replace("www.", "")
    : "";
  return (
    <div className="panel flex flex-col rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50">
      <div className="flex items-start gap-3">
        {domain && (
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            alt=""
            className="size-8 rounded-lg"
            loading="lazy"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-foreground">{resource.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center gap-2 pt-3">
        <span
          className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{
            background:
              resource.pricing === "Completely Free"
                ? "#3fb95020"
                : resource.pricing === "Free Tier"
                  ? "#58a6ff20"
                  : "var(--surface-elevated)",
            color:
              resource.pricing === "Completely Free"
                ? "#3fb950"
                : resource.pricing === "Free Tier"
                  ? "#58a6ff"
                  : "var(--muted-foreground)",
          }}
        >
          {resource.pricing}
        </span>
        <span className="text-[10px] text-muted-foreground">{resource.category}</span>
      </div>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary/10 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
      >
        Visit <ExternalLink className="size-3" />
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COMMAND CARD (Type C)
   ═══════════════════════════════════════════════════════════════════ */
function CommandCardItem({ cmd }: { cmd: { command: string; description: string; category: string } }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(cmd.command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [cmd.command]);

  return (
    <div className="panel rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50">
      <div className="flex items-start gap-2">
        <span
          className="h-full w-0.5 shrink-0 rounded-full"
          style={{
            background:
              CATEGORY_GRADIENT_MAP[cmd.category] || "var(--primary)",
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm font-bold text-foreground">{cmd.command}</p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{cmd.description}</p>
          <span className="mt-2 inline-block rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground">
            {cmd.category}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={copy}
        className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-all"
        style={{
          background: copied ? "#3fb950" : "var(--primary)",
          color: "#fff",
        }}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? "Copied!" : "Copy Command"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURED BANNER
   ═══════════════════════════════════════════════════════════════════ */
function FeaturedBanner() {
  const seed = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const featured = VIRAL_PROMPTS[seed % VIRAL_PROMPTS.length]!;
  if (!featured) return null;
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6"
      style={{ background: CATEGORY_GRADIENTS[featured.category] }}
    >
      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
        ⭐ Featured this week
      </span>
      <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">{featured.title}</h2>
      <p className="mt-1.5 text-sm text-white/80">{featured.teaser}</p>
      <div className="mt-4 flex gap-2">
        <a
          href={`https://chat.openai.com/?q=${encodeURIComponent(featured.prompt)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 items-center gap-2 rounded-xl bg-white/25 px-4 text-sm font-semibold text-white hover:bg-white/35"
        >
          Try it now <ExternalLink className="size-3.5" />
        </a>
        <CopyBtn
          text={featured.prompt}
          className="h-10 px-4 text-sm bg-white/25 text-white"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export const Route = createFileRoute("/discover/")({
  head: () => ({
    meta: [
      { title: "Discover — AI tools, prompts, APIs, courses | SlashAI" },
      {
        name: "description",
        content: `Explore ${RESOURCE_TOTAL}+ free tools, APIs, courses, and viral prompts — curated for builders, developers and creators.`,
      },
      { property: "og:title", content: "Discover — SlashAI" },
      { property: "og:description", content: "Curated tools, prompts, APIs, and courses for builders." },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  // Build card list from all sources
  const allCards = useMemo(() => {
    const cards: DiscoverCard[] = [];

    // Viral prompts → Type A
    VIRAL_PROMPTS.forEach((p) => {
      cards.push({
        id: `prompt-${p.id}`,
        type: "prompt",
        title: p.title,
        description: p.teaser,
        category: "Prompts",
        gradient: CATEGORY_GRADIENTS[p.category],
        emoji: CATEGORY_EMOJI[p.category],
        badge: p.badge,
        prompt: p.prompt,
      });
    });

    // Resources → Type B
    for (const section of SECTIONS) {
      const resources = resourcesBySection(section.id);
      resources.forEach((r) => {
        cards.push({
          id: `resource-${r.id}`,
          type: "resource",
          title: r.name,
          description: r.description,
          category: section.label,
          url: r.url,
          pricing: r.pricing,
        });
      });
    }

    // South Asia resources → Type B
    SOUTH_ASIA_RESOURCES.forEach((r) => {
      cards.push({
        id: `southasia-${r.id}`,
        type: "resource",
        title: r.flag + " " + r.name,
        description: r.description,
        category: "South Asia",
        url: r.url,
        pricing: r.freeTier,
      });
    });

    // New free APIs → Type B
    NEW_APIS.forEach((api) => {
      cards.push({
        id: `api-${api.id}`,
        type: "resource",
        title: "📡 " + api.name,
        description: api.description,
        category: "Free APIs",
        url: api.url,
        pricing: api.auth,
      });
    });

    return cards;
  }, []);

  // Filter
  const filtered = useMemo(() => {
    let result = allCards;
    const tab = activeTab.toLowerCase();
    if (tab !== "all") {
      const tabClean = tab.replace(/[^\w]/g, "");
      result = result.filter(
        (c) =>
          c.category.toLowerCase().includes(tabClean) ||
          c.title.toLowerCase().includes(tabClean),
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [allCards, activeTab, search]);

  return (
    <AppShell hideHeaderSearch title="Discover">
      {/* Featured banner */}
      <FeaturedBanner />

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-30 -mx-4 mt-4 overflow-x-auto border-b border-border bg-background/90 px-4 pb-2 pt-2 backdrop-blur-md scrollbar-none">
        <div className="flex gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                background:
                  activeTab === tab
                    ? "var(--primary)"
                    : "var(--surface)",
                color:
                  activeTab === tab
                    ? "var(--primary-foreground, #fff)"
                    : "var(--muted-foreground)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mt-3">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools, prompts, APIs…"
          className="h-9 w-full rounded-xl border border-border bg-surface pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="mt-3 text-xs text-muted-foreground">
        {filtered.length} items · {RESOURCE_TOTAL}+ resources · {VIRAL_PROMPTS.length} viral prompts
      </p>

      {/* Masonry grid */}
      <div className="mt-4 columns-2 gap-2 sm:columns-3 xl:columns-4">
        {filtered.map((card, i) => (
          <div key={card.id} className="mb-2 break-inside-avoid">
            {card.type === "prompt" && card.prompt ? (
              <PromptCard
                prompt={{
                  id: card.id.replace("prompt-", ""),
                  title: card.title,
                  badge: card.badge || "",
                  category: (Object.keys(CATEGORY_EMOJI).find(
                    (k) => CATEGORY_EMOJI[k as PromptCategory] === card.emoji,
                  ) || "Image Prompt") as PromptCategory,
                  teaser: card.description,
                  prompt: card.prompt,
                  worksWith: "ChatGPT, Claude, Gemini",
                  viral: card.badge?.includes("VIRAL") ?? false,
                }}
                featured={i % 11 === 0}
              />
            ) : card.type === "resource" ? (
              <ResourceCardItem
                resource={{
                  id: card.id.replace("resource-", ""),
                  name: card.title,
                  description: card.description,
                  url: card.url || "",
                  pricing: (card.pricing || "Free") as any,
                  category: card.category,
                  section: card.category as any,
                  audience: ["Everyone"],
                  addedDate: "",
                  tags: [],
                  type: "resource" as any,
                  lastUpdated: "",
                  lastVerified: "",
                  status: "active" as any,
                }}
              />
            ) : (
              <CommandCardItem
                cmd={{
                  command: card.title,
                  description: card.description,
                  category: card.category,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm font-semibold text-foreground">Nothing found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try a different search or clear the filter.</p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("All");
              setSearch("");
            }}
            className="mt-3 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </button>
        </div>
      )}
    </AppShell>
  );
}
