import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Code2,
  ExternalLink,
  GraduationCap,
  Globe,
  Image as ImageIcon,
  Newspaper,
  Search,
  ShoppingBag,
  Sparkles,
  Video,
  X,
} from "lucide-react";

import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/web-search")({
  head: () => ({
    meta: [
      { title: "Free Search - search the whole web, zero tracking | SlashAI" },
      {
        name: "description",
        content:
          "A free meta search engine: one query, every major free engine. Inline Wikipedia answers, plus instant hand-offs to image, video, news, academic and code search. No ads, no tracking, no account.",
      },
    ],
  }),
  component: WebSearchPage,
});

/* ──────────── categories ──────────── */

interface Category {
  id: string;
  label: string;
  icon: typeof Globe;
  tint: string;
  hint: string;
}

const CATEGORIES: Category[] = [
  { id: "web", label: "Web", icon: Globe, tint: "#38bdf8", hint: "General search" },
  { id: "images", label: "Images", icon: ImageIcon, tint: "#a78bfa", hint: "Free-to-search images" },
  { id: "videos", label: "Videos", icon: Video, tint: "#f472b6", hint: "Video platforms" },
  { id: "news", label: "News", icon: Newspaper, tint: "#fb923c", hint: "Current events" },
  { id: "academic", label: "Academic", icon: GraduationCap, tint: "#34d399", hint: "Papers & research" },
  { id: "code", label: "Code", icon: Code2, tint: "#818cf8", hint: "Repos & docs" },
  { id: "shopping", label: "Shopping", icon: ShoppingBag, tint: "#fbbf24", hint: "Price hunting" },
  { id: "books", label: "Books", icon: BookOpen, tint: "#4ade80", hint: "Reading & libraries" },
];

interface Engine {
  name: string;
  note: string;
  build: (q: string) => string;
}

const ENGINES: Record<string, Engine[]> = {
  web: [
    { name: "DuckDuckGo", note: "No tracking, no ad profile", build: (q) => `https://duckduckgo.com/?q=${q}` },
    { name: "Startpage", note: "Google results, private", build: (q) => `https://www.startpage.com/sp/search?query=${q}` },
    { name: "Mojeek", note: "Independent crawler, own index", build: (q) => `https://www.mojeek.com/search?q=${q}` },
    { name: "Brave Search", note: "Own index, no profiling", build: (q) => `https://search.brave.com/search?q=${q}` },
    { name: "Marginalia", note: "Finds the non-commercial web", build: (q) => `https://search.marginalia.nu/search?query=${q}` },
    { name: "Wiby", note: "Classic lightweight pages", build: (q) => `https://wiby.me/?q=${q}` },
  ],
  images: [
    { name: "Openverse", note: "700M+ openly-licensed images", build: (q) => `https://openverse.org/search/?q=${q}` },
    { name: "Wikimedia Commons", note: "Public-domain media", build: (q) => `https://commons.wikimedia.org/w/index.php?search=${q}` },
    { name: "Unsplash", note: "Free high-res photography", build: (q) => `https://unsplash.com/s/photos/${q}` },
    { name: "Pexels", note: "Free stock photos & video", build: (q) => `https://www.pexels.com/search/${q}/` },
    { name: "Flickr CC", note: "Creative-Commons only", build: (q) => `https://flickr.com/search/?license=2%2C3%2C4%2C5%2C6%2C9&text=${q}` },
  ],
  videos: [
    { name: "YouTube", note: "The everything library", build: (q) => `https://www.youtube.com/results?search_query=${q}` },
    { name: "PeerTube", note: "Decentralised video", build: (q) => `https://sepiasearch.org/search?search=${q}` },
    { name: "Pexels Video", note: "Free stock footage", build: (q) => `https://www.pexels.com/search/videos/${q}/` },
    { name: "Internet Archive", note: "Historic & public-domain film", build: (q) => `https://archive.org/search?query=${q}&and[]=mediatype%3A%22movies%22` },
  ],
  news: [
    { name: "Ground News", note: "Compare across the bias spectrum", build: (q) => `https://ground.news/search?q=${q}` },
    { name: "Google News", note: "Wide coverage, ranked", build: (q) => `https://news.google.com/search?q=${q}` },
    { name: "AP News", note: "Wire-service reporting", build: (q) => `https://apnews.com/search?q=${q}` },
    { name: "Reuters", note: "Global newsroom", build: (q) => `https://www.reuters.com/site-search/?query=${q}` },
  ],
  academic: [
    { name: "arXiv", note: "Open-access preprints", build: (q) => `https://arxiv.org/abs/?searchtype=all&query=${q}` },
    { name: "Semantic Scholar", note: "AI-ranked 200M+ papers", build: (q) => `https://www.semanticscholar.org/search?q=${q}` },
    { name: "Google Scholar", note: "The academic standard", build: (q) => `https://scholar.google.com/scholar?q=${q}` },
    { name: "CORE", note: "Largest open-research aggregator", build: (q) => `https://core.ac.uk/search?q=${q}` },
    { name: "PubMed", note: "Biomedical literature", build: (q) => `https://pubmed.ncbi.nlm.nih.gov/?term=${q}` },
  ],
  code: [
    { name: "GitHub", note: "Search 400M+ repositories", build: (q) => `https://github.com/search?q=${q}&type=repositories` },
    { name: "Sourcegraph", note: "Search across public code", build: (q) => `https://sourcegraph.com/search?q=${q}` },
    { name: "grep.app", note: "Regex search across GitHub", build: (q) => `https://grep.app/search?q=${q}` },
    { name: "Stack Overflow", note: "Programming Q&A", build: (q) => `https://stackoverflow.com/search?q=${q}` },
    { name: "MDN", note: "Web API & CSS docs", build: (q) => `https://developer.mozilla.org/en-US/search?q=${q}` },
  ],
  shopping: [
    { name: "Google Shopping", note: "Compare across stores", build: (q) => `https://www.google.com/search?tbm=shop&q=${q}` },
    { name: "CamelCamelCamel", note: "Amazon price history", build: (q) => `https://camelcamelcamel.com/search?sq=${q}` },
    { name: "eBay", note: "New & used marketplace", build: (q) => `https://www.ebay.com/sch/i.html?_nkw=${q}` },
    { name: "Slickdeals", note: "Community-vetted deals", build: (q) => `https://slickdeals.net/newsearch.php?q=${q}` },
  ],
  books: [
    { name: "Open Library", note: "Borrow 3M+ free books", build: (q) => `https://openlibrary.org/search?q=${q}` },
    { name: "Project Gutenberg", note: "70k public-domain classics", build: (q) => `https://www.gutenberg.org/ebooks/search/?query=${q}` },
    { name: "Standard Ebooks", note: "Beautifully typeset classics", build: (q) => `https://standardebooks.org/ebooks?query=${q}` },
    { name: "Goodreads", note: "Reviews & reading lists", build: (q) => `https://www.goodreads.com/search?q=${q}` },
    { name: "Anna's Archive meta", note: "Index of open libraries", build: (q) => `https://annas-archive.org/search?q=${q}` },
  ],
};

const QUICK_PILLS = [
  "how do solar panels work",
  "aurora borealis tonight",
  "best free design tools",
  "learn python basics",
  "who invented the stapler",
];

/* ──────────── Wikipedia answer (free, key-less, CORS-enabled) ──────────── */

interface WikiAnswer {
  title: string;
  extract: string;
  url: string;
  thumbnail?: string;
}

function useWikiAnswer(query: string) {
  const [answer, setAnswer] = useState<WikiAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setAnswer(null);
      setFailed(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setFailed(false);
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=160&redirects=1&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=1&gsrnamespace=0`,
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("http"))))
      .then((data: { query?: { pages?: Record<string, { title: string; extract?: string; thumbnail?: { source: string }; fullurl?: string }> } }) => {
        if (!alive) return;
        const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
        const page = pages[0];
        if (page?.extract) {
          const thumb = page.thumbnail?.source;
          setAnswer({
            title: page.title,
            extract: page.extract.split("\n")[0] ?? page.extract,
            url: page.fullurl ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
            ...(thumb ? { thumbnail: thumb } : {}),
          });
        } else {
          setAnswer(null);
        }
      })
      .catch(() => {
        if (alive) {
          setAnswer(null);
          setFailed(true);
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [query]);

  return { answer, loading, failed };
}

/* ──────────── page ──────────── */

function WebSearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [cat, setCat] = useState("web");
  const inputRef = useRef<HTMLInputElement>(null);

  const { answer, loading } = useWikiAnswer(submitted);

  const run = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setSubmitted(trimmed);
  }, []);

  const engines = ENGINES[cat] ?? ENGINES["web"]!;
  const activeCat = CATEGORIES.find((c) => c.id === cat) ?? CATEGORIES[0]!;
  const enc = encodeURIComponent(submitted.trim());

  return (
    <AppShell wide hideHeaderSearch title="Free Search">
      <div className="mx-auto max-w-3xl">
        {/* hero + search box */}
        <div className="page-enter rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#38bdf8] via-[#818cf8] to-[#a78bfa] text-white shadow-lg">
              <Search className="size-5" aria-hidden />
            </span>
            <div>
              <h1 className="font-display text-[22px] font-black tracking-tight text-foreground">
                <span className="bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#a78bfa] bg-clip-text text-transparent">
                  Free Search
                </span>
              </h1>
              <p className="text-[12px] text-muted-foreground">One query → every major free engine. No ads, no tracking.</p>
            </div>
          </div>

          <form
            className="mt-5 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              run(query);
            }}
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything…"
                enterKeyHint="search"
                className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-9 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-surface-elevated text-muted-foreground hover:text-foreground"
                  aria-label="Clear query"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="ripple-press grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] text-white shadow-lg transition-transform active:scale-95"
              aria-label="Search"
            >
              <Sparkles className="size-5" aria-hidden />
            </button>
          </form>

          {!submitted && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {QUICK_PILLS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setQuery(p);
                    run(p);
                  }}
                  className="ripple-press rounded-full border border-border bg-background px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* category chips */}
        <div className="stagger-children mt-4 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                style={active ? { background: `${c.tint}22`, borderColor: `${c.tint}66`, color: c.tint } : undefined}
                className={`ripple-press flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-all ${
                  active ? "" : "border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" aria-hidden />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* results */}
        {submitted ? (
          <div className="mt-5 flex flex-col gap-4">
            {/* instant answer */}
            <section className="scale-in rounded-2xl border border-border bg-surface p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Instant answer · Wikipedia</p>
              {loading ? (
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-surface-elevated" />
                  <div className="h-3 w-full animate-pulse rounded bg-surface-elevated" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-surface-elevated" />
                </div>
              ) : answer ? (
                <div className="mt-2.5 flex gap-4">
                  {answer.thumbnail ? (
                    <img
                      src={answer.thumbnail}
                      alt=""
                      className="size-20 shrink-0 rounded-xl object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <a
                      href={answer.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[16px] font-bold text-foreground hover:underline"
                    >
                      {answer.title}
                    </a>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{answer.extract}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-2.5 text-[13px] text-muted-foreground">
                  No Wikipedia entry for “{submitted}” — try the engines below for full web results.
                </p>
              )}
            </section>

            {/* engine grid for the active category */}
            <section>
              <div className="mb-2.5 flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-foreground">
                  {activeCat.label} results for “{submitted}”
                </h2>
                <span className="text-[11px] text-muted-foreground">{activeCat.hint}</span>
              </div>
              <div className="stagger-children grid gap-2 sm:grid-cols-2">
                {engines.map((e) => (
                  <a
                    key={e.name}
                    href={e.build(enc)}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ ["--tint" as string]: activeCat.tint }}
                    className="tint-card group flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5 transition-all hover:-translate-y-0.5"
                  >
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-lg text-[15px] font-black text-white"
                      style={{ background: `linear-gradient(135deg, ${activeCat.tint}, ${activeCat.tint}99)` }}
                    >
                      {e.name.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-bold text-foreground">{e.name}</span>
                      <span className="block truncate text-[11.5px] text-muted-foreground">{e.note}</span>
                    </span>
                    <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden />
                  </a>
                ))}
              </div>
            </section>

            {/* one-tap open in top engines */}
            <section className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-[12px] font-bold text-foreground">Or open everywhere at once</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {engines.slice(0, 4).map((e) => (
                  <a
                    key={`top-${e.name}`}
                    href={e.build(enc)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ripple-press rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {e.name} ↗
                  </a>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <section className="mt-5 grid gap-2 sm:grid-cols-2">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const first = (ENGINES[c.id] ?? [])[0];
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCat(c.id);
                    inputRef.current?.focus();
                  }}
                  style={{ ["--tint" as string]: c.tint }}
                  className="tint-card flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-all hover:-translate-y-0.5"
                >
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-xl text-white"
                    style={{ background: `linear-gradient(135deg, ${c.tint}, ${c.tint}99)` }}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold text-foreground">{c.label}</span>
                    <span className="block truncate text-[11.5px] text-muted-foreground">
                      {first ? `${first.name} + ${(ENGINES[c.id] ?? []).length - 1} more engines` : c.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </section>
        )}

        <p className="mt-6 pb-4 text-center text-[11px] text-muted-foreground">
          SlashAI never sees your searches — results open directly on each engine in a new tab.
        </p>
      </div>
    </AppShell>
  );
}
