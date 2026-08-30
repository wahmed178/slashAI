import { useMemo, useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, MessageSquare, RefreshCw, Flame, Tag, DollarSign, Clock } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";

interface Deal {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  votes: number;
  image: string;
  url: string;
  redditUrl: string;
  platform: string;
  category: string;
  source: string;
  badge: string;
}

type SortKey = "trending" | "discount" | "price" | "latest";

const SORT_OPTIONS: { key: SortKey; label: string; icon: typeof Flame }[] = [
  { key: "trending", label: "Trending", icon: Flame },
  { key: "discount", label: "Biggest Discount", icon: Tag },
  { key: "price", label: "Lowest Price", icon: DollarSign },
  { key: "latest", label: "Latest", icon: Clock },
];

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "phones", label: "📱 Phones" },
  { key: "computers", label: "💻 Computers" },
  { key: "gaming", label: "🎮 Gaming" },
  { key: "books", label: "📚 Books" },
  { key: "audio", label: "🎧 Audio" },
  { key: "fashion", label: "👗 Fashion" },
  { key: "home", label: "🏠 Home" },
  { key: "tv", label: "📺 TV" },
  { key: "camera", label: "📷 Camera" },
  { key: "fitness", label: "💪 Fitness" },
  { key: "beauty", label: "💄 Beauty" },
];

const PRICE_FILTERS = [
  { key: "any", label: "Any Price" },
  { key: "499", label: "Under ₹499" },
  { key: "999", label: "Under ₹999" },
  { key: "1999", label: "Under ₹1,999" },
];

const CATEGORY_EMOJIS: Record<string, string> = {
  phones: "📱", computers: "💻", gaming: "🎮", books: "📚",
  audio: "🎧", fashion: "👗", home: "🏠", tv: "📺",
  camera: "📷", fitness: "💪", beauty: "💄", deals: "🏷️",
};

const PLATFORM_STYLES: Record<string, string> = {
  amazon: "bg-[rgba(255,153,0,0.12)] border-[rgba(255,153,0,0.4)] text-[#ff9900]",
  flipkart: "bg-[rgba(40,116,240,0.12)] border-[rgba(40,116,240,0.4)] text-[#2874f0]",
  meesho: "bg-[rgba(151,71,255,0.12)] border-[rgba(151,71,255,0.4)] text-[#9747ff]",
  other: "bg-[#21262d] border-[#30363d] text-muted-foreground",
};

const SUBREDDITS: { name: string; url: string; defaultCategory?: string }[] = [
  { name: "DesiDeal", url: "https://www.reddit.com/r/DesiDeal/top.json?t=day&limit=25" },
  { name: "IndianGaming", url: "https://www.reddit.com/r/IndianGaming/top.json?t=day&limit=15", defaultCategory: "gaming" },
  { name: "AmazonIndia", url: "https://www.reddit.com/r/AmazonIndia/top.json?t=day&limit=20" },
  { name: "PhoneDealsIndia", url: "https://www.reddit.com/r/PhoneDealsIndia/top.json?t=day&limit=15", defaultCategory: "phones" },
  { name: "Frugal_in", url: "https://www.reddit.com/r/Frugal_in/top.json?t=day&limit=15" },
  { name: "booksofindia", url: "https://www.reddit.com/r/booksofindia/top.json?t=day&limit=10", defaultCategory: "books" },
  { name: "buildapc", url: "https://www.reddit.com/r/buildapc/top.json?t=day&limit=10", defaultCategory: "computers" },
  { name: "india", url: "https://www.reddit.com/r/india/search.json?q=deal+discount+sale&sort=top&t=day&limit=15" },
];

const CACHE_KEY = "slashai-deals-cache";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Deals & Products — SlashAI" },
      { name: "description", content: "Best deals from Indian communities — updated daily." },
    ],
  }),
  component: DealsPage,
});

/* ─── helpers ─── */

function detectCategory(title: string): string {
  const t = title.toLowerCase();
  if (/phone|mobile|iphone|samsung|redmi|realme|oneplus|poco|vivo|oppo/.test(t)) return "phones";
  if (/laptop|pc|computer|processor|gpu|ram|ssd|monitor|keyboard|mouse/.test(t)) return "computers";
  if (/tv|television|led|oled|smart tv/.test(t)) return "tv";
  if (/book|kindle|novel|textbook|epub/.test(t)) return "books";
  if (/headphone|earphone|speaker|audio|bluetooth|tws|airpod/.test(t)) return "audio";
  if (/shoe|shirt|dress|clothing|fashion|apparel|sneaker|jacket/.test(t)) return "fashion";
  if (/kitchen|cooker|mixer|microwave|refrigerator|washing/.test(t)) return "home";
  if (/game|gaming|ps5|xbox|nintendo|steam|console/.test(t)) return "gaming";
  if (/camera|lens|gopro|dslr|mirrorless|tripod/.test(t)) return "camera";
  if (/supplement|protein|gym|fitness|yoga|dumbbell/.test(t)) return "fitness";
  if (/skincare|beauty|makeup|perfume|lotion|shampoo/.test(t)) return "beauty";
  return "deals";
}

function extractPrice(title: string): number {
  const patterns = [/₹\s*(\d[\d,]+)/, /Rs\.?\s*(\d[\d,]+)/i, /INR\s*(\d[\d,]+)/i, /at\s+(\d[\d,]+)/i];
  for (const p of patterns) {
    const m = title.match(p);
    if (m?.[1]) return parseInt(m[1].replace(/,/g, ""));
  }
  return 0;
}

function detectPlatform(title: string, url: string): string {
  const t = (title + url).toLowerCase();
  if (t.includes("amazon")) return "amazon";
  if (t.includes("flipkart")) return "flipkart";
  if (t.includes("meesho")) return "meesho";
  if (t.includes("myntra") || t.includes("ajio")) return "fashion";
  if (t.includes("croma") || t.includes("reliance")) return "other";
  return "other";
}

function extractDiscount(title: string): number {
  const m = title.match(/(\d+)\s*%\s*off/i);
  return m?.[1] ? parseInt(m[1]) : 0;
}

function formatINR(n: number): string {
  return "\u20b9" + n.toLocaleString("en-IN");
}

/* ─── fetch + parse ─── */

async function fetchDeals(): Promise<Deal[]> {
  const all: Deal[] = [];

  const fetches = SUBREDDITS.map(async (sub) => {
    try {
      const res = await fetch(sub.url, {
        headers: { "User-Agent": "SlashAI-Bot/1.0" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const children = data?.data?.children || [];

      return children
        .filter((p: any) => {
          const post = p.data;
          return post.score > 5 && !post.stickied && post.title?.length > 10;
        })
        .map((p: any) => {
          const post = p.data;
          const price = extractPrice(post.title);
          const discount = extractDiscount(post.title);
          const category = sub.defaultCategory || detectCategory(post.title);
          const platform = detectPlatform(post.title, post.url || "");
          const hasImage =
            post.thumbnail &&
            post.thumbnail.startsWith("http") &&
            !post.thumbnail.includes("self") &&
            !post.thumbnail.includes("default");

          return {
            id: `reddit-${post.id}`,
            title: post.title.slice(0, 90),
            description: post.selftext?.slice(0, 120) || `${post.score} upvotes \u00b7 r/${sub.name}`,
            price,
            discount,
            votes: post.score,
            image: hasImage ? post.thumbnail : "",
            url: post.url?.startsWith("http") ? post.url : `https://reddit.com${post.permalink}`,
            redditUrl: `https://reddit.com${post.permalink}`,
            platform,
            category,
            source: `r/${sub.name}`,
            badge:
              discount > 40
                ? `${discount}% OFF`
                : price > 0 && price < 500
                ? "Under \u20b9500"
                : price > 0 && price < 999
                ? "Under \u20b9999"
                : "Community Deal",
          };
        });
    } catch {
      return [];
    }
  });

  const results = await Promise.all(fetches);
  for (const r of results) all.push(...r);

  // Deduplicate
  const seen = new Set<string>();
  return all.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* ─── skeleton ─── */

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-border bg-surface animate-pulse">
      <div className="h-[140px] bg-[#21262d]" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-3/4 rounded bg-[#21262d]" />
        <div className="h-3 w-1/2 rounded bg-[#21262d]" />
        <div className="h-2 w-1/3 rounded bg-[#21262d]" />
      </div>
    </div>
  );
}

/* ─── card components ─── */

function DealCard({ deal }: { deal: Deal }) {
  const isSameUrl = deal.url === deal.redditUrl;
  return (
    <article className="group overflow-hidden rounded-[10px] border border-border bg-surface transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]">
      <div className="relative flex h-[140px] items-center justify-center bg-[#21262d]">
        {deal.image ? (
          <img src={deal.image} alt="" loading="lazy" className="size-full object-contain" />
        ) : (
          <span className="text-[40px]">{CATEGORY_EMOJIS[deal.category] || "\ud83c\udff7\ufe0f"}</span>
        )}
        {deal.discount > 0 && (
          <span className="absolute top-2 left-2 rounded-full bg-red/90 px-2 py-0.5 text-[10px] font-bold text-white">
            {deal.discount}% OFF
          </span>
        )}
        <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-muted-foreground">
          {deal.source}
        </span>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-[13px] font-semibold text-foreground">{deal.title}</h3>
        {deal.price > 0 && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-base font-bold text-green">{formatINR(deal.price)}</span>
            {deal.discount > 0 && (
              <span className="text-[11px] font-medium text-red">({deal.discount}% off)</span>
            )}
          </div>
        )}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">\u25b2 {deal.votes}</span>
          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${PLATFORM_STYLES[deal.platform] || PLATFORM_STYLES["other"]}`}>
            {deal.platform.charAt(0).toUpperCase() + deal.platform.slice(1)}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <a
            href={deal.url}
            target="_blank"
            rel="noreferrer noopener"
            className="flex h-8 flex-1 items-center justify-center gap-1 rounded-md border border-primary/40 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Deal <ExternalLink className="size-3" />
          </a>
          {!isSameUrl && (
            <a
              href={deal.redditUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent"
              title="View discussion"
            >
              <MessageSquare className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function FeaturedDeal({ deal }: { deal: Deal }) {
  const isSameUrl = deal.url === deal.redditUrl;
  return (
    <div className="rounded-[10px] border border-border border-l-[3px] border-l-primary bg-surface p-5">
      <span className="text-[11px] font-semibold text-primary">\ud83d\udd25 Deal of the Day</span>
      <div className="mt-3 flex gap-4">
        <div className="flex size-[100px] shrink-0 items-center justify-center rounded-lg bg-[#21262d]">
          {deal.image ? (
            <img src={deal.image} alt="" className="size-full rounded-lg object-contain" />
          ) : (
            <span className="text-[48px]">{CATEGORY_EMOJIS[deal.category] || "\ud83c\udff7\ufe0f"}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground line-clamp-2">{deal.title}</h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {deal.price > 0 && <span className="text-base font-bold text-green">{formatINR(deal.price)}</span>}
            {deal.discount > 0 && <span className="rounded bg-red/15 px-2 py-0.5 text-xs font-semibold text-red">{deal.discount}% OFF</span>}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">\u25b2 {deal.votes} upvotes \u00b7 {deal.source}</p>
          <div className="mt-3 flex items-center gap-2">
            <a
              href={deal.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex h-8 items-center gap-1.5 rounded-md border border-primary/40 px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              View Deal <ExternalLink className="size-3" />
            </a>
            {!isSameUrl && (
              <a
                href={deal.redditUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs text-muted-foreground transition-colors hover:bg-accent"
              >
                Discussion <MessageSquare className="size-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, count, onSeeAll }: { title: string; count: number; onSeeAll?: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-bold text-foreground">{title} <span className="text-sm font-normal text-muted-foreground">({count})</span></h2>
      {onSeeAll && (
        <button onClick={onSeeAll} className="text-xs font-medium text-primary hover:underline">
          See all \u2192
        </button>
      )}
    </div>
  );
}

/* ─── main page ─── */

function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("trending");
  const [category, setCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("any");
  const [updatedAt, setUpdatedAt] = useState("");

  const loadDeals = useCallback(async (force = false) => {
    // Check cache first
    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (cached && Date.now() - cached.ts < CACHE_TTL && cached.deals?.length > 0) {
          setDeals(cached.deals);
          setUpdatedAt(cached.time || "recently");
          setLoading(false);
          return;
        }
      } catch { /* ignore */ }
    }

    setLoading(true);
    try {
      const fetched = await fetchDeals();
      const time = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
      setDeals(fetched);
      setUpdatedAt(time);
      // Cache
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ deals: fetched, time, ts: Date.now() }));
      } catch { /* quota */ }
    } catch {
      // Try stale cache
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (cached?.deals?.length) {
          setDeals(cached.deals);
          setUpdatedAt(cached.time || "earlier");
        }
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  const filtered = useMemo(() => {
    let items = [...deals];
    if (category !== "all") items = items.filter((d) => d.category === category);
    if (priceFilter === "499") items = items.filter((d) => d.price > 0 && d.price < 499);
    else if (priceFilter === "999") items = items.filter((d) => d.price > 0 && d.price < 999);
    else if (priceFilter === "1999") items = items.filter((d) => d.price > 0 && d.price < 1999);

    if (sort === "trending") items.sort((a, b) => b.votes - a.votes);
    else if (sort === "discount") items.sort((a, b) => b.discount - a.discount);
    else if (sort === "price") items.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    else if (sort === "latest") items.reverse();
    return items;
  }, [deals, sort, category, priceFilter]);

  const featured: Deal | null = useMemo(() => {
    if (category !== "all" || priceFilter !== "any") return null;
    const sorted = [...deals].sort((a, b) => b.votes - a.votes);
    return sorted[0] || null;
  }, [deals, category, priceFilter]);

  const sectionData = useMemo(() => {
    const grouped: Record<string, Deal[]> = {
      phones: [], computers: [], gaming: [], books: [], audio: [], home: [],
    };
    for (const d of deals) {
      const cat = d.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(d);
    }
    return grouped;
  }, [deals]);

  const getSection = (key: string): Deal[] => sectionData[key] || [];
  const showSection = (items: Deal[]) => items.length >= 2;

  return (
    <AppShell wide title="Deals & Products">
      {/* Header */}
      <header className="page-enter pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Deals & Products</h1>
            <p className="mt-1 text-[15px] text-muted-foreground">
              Best deals from Indian communities \u2014 updated daily.
            </p>
          </div>
          <button
            onClick={() => loadDeals(true)}
            disabled={loading}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            title="Refresh deals"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {updatedAt && (
            <span className="rounded-full bg-surface-elevated px-2.5 py-1 text-[11px] text-muted-foreground">
              Updated {updatedAt} IST \u00b7 {deals.length} deals
            </span>
          )}
          <span className="text-[12px] text-muted-foreground">
            Sourced from r/DesiDeal, r/AmazonIndia and more
          </span>
        </div>
      </header>

      {/* Loading skeleton */}
      {loading && deals.length === 0 && (
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && deals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-4xl">\ud83d\udd04</span>
          <h2 className="mt-4 text-lg font-semibold text-foreground">No deals found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Reddit may be temporarily unavailable. Try refreshing.
          </p>
          <button
            onClick={() => loadDeals(true)}
            className="mt-4 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      )}

      {/* Filters + content (only when we have data) */}
      {deals.length > 0 && (
        <>
          {/* Sort tabs */}
          <div className="mt-5 flex gap-1.5 overflow-x-auto pb-1">
            {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  sort === key
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" /> {label}
              </button>
            ))}
          </div>

          {/* Category tabs */}
          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === key
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Price tabs */}
          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
            {PRICE_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPriceFilter(key)}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  priceFilter === key
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Featured deal */}
          {featured && category === "all" && priceFilter === "any" && (
            <div className="mt-5">
              <FeaturedDeal deal={featured} />
            </div>
          )}

          {/* Filtered grid */}
          {filtered.length > 0 && (
            <div className="mt-5">
              <SectionHeader title="Filtered Results" count={filtered.length} />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.slice(0, 20).map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          )}

          {/* Category sections (only in "All" view) */}
          {category === "all" && priceFilter === "any" && (
            <div className="mt-8 space-y-8">
              {showSection(getSection("phones")) && (
                <div>
                  <SectionHeader title="\ud83d\udcf1 Phone Deals" count={getSection("phones").length} onSeeAll={() => setCategory("phones")} />
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                    {getSection("phones").slice(0, 4).map((deal: Deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </div>
                </div>
              )}

              {showSection(getSection("computers")) && (
                <div>
                  <SectionHeader title="\ud83d\udcbb PC & Computers" count={getSection("computers").length} onSeeAll={() => setCategory("computers")} />
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                    {getSection("computers").slice(0, 4).map((deal: Deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </div>
                </div>
              )}

              {showSection(getSection("gaming")) && (
                <div>
                  <SectionHeader title="\ud83c\udfae Gaming Deals" count={getSection("gaming").length} onSeeAll={() => setCategory("gaming")} />
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                    {getSection("gaming").slice(0, 4).map((deal: Deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </div>
                </div>
              )}

              {showSection(getSection("books")) && (
                <div>
                  <SectionHeader title="\ud83d\udcda Book Deals" count={getSection("books").length} onSeeAll={() => setCategory("books")} />
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                    {getSection("books").slice(0, 4).map((deal: Deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </div>
                </div>
              )}

              {showSection(getSection("audio")) && (
                <div>
                  <SectionHeader title="\ud83c\udfa7 Audio Deals" count={getSection("audio").length} onSeeAll={() => setCategory("audio")} />
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                    {getSection("audio").slice(0, 4).map((deal: Deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </div>
                </div>
              )}

              {showSection(getSection("home")) && (
                <div>
                  <SectionHeader title="\ud83c\udfe0 Home & Kitchen" count={getSection("home").length} onSeeAll={() => setCategory("home")} />
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                    {getSection("home").slice(0, 4).map((deal: Deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer note */}
          <p className="mt-6 text-[11px] text-muted-foreground">
            All deals sourced from Reddit communities. Prices and availability may change. Not affiliated with any retailer.
          </p>
        </>
      )}
    </AppShell>
  );
}
