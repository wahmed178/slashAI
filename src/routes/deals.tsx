import { useMemo, useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, MessageSquare, RefreshCw, Flame, Tag, DollarSign, Clock } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";
import seededData from "@/data/products.json";

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

const SUBREDDITS: { name: string; path: string; defaultCategory?: string }[] = [
  { name: "DesiDeal", path: "r/DesiDeal/top.json?t=day&limit=25" },
  { name: "IndianGaming", path: "r/IndianGaming/top.json?t=day&limit=15", defaultCategory: "gaming" },
  { name: "AmazonIndia", path: "r/AmazonIndia/top.json?t=day&limit=20" },
  { name: "PhoneDealsIndia", path: "r/PhoneDealsIndia/top.json?t=day&limit=15", defaultCategory: "phones" },
  { name: "Frugal_in", path: "r/Frugal_in/top.json?t=day&limit=15" },
  { name: "booksofindia", path: "r/booksofindia/top.json?t=day&limit=10", defaultCategory: "books" },
];

const CACHE_KEY = "slashai-deals-live";
const CACHE_TTL = 60 * 60 * 1000;

function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

function detectCategory(title: string): string {
  const t = title.toLowerCase();
  if (/phone|mobile|iphone|samsung|redmi|realme|oneplus|poco|vivo|oppo/.test(t)) return "phones";
  if (/laptop|pc|computer|processor|gpu|ram|ssd|monitor|keyboard|mouse/.test(t)) return "computers";
  if (/tv|television|led|oled/.test(t)) return "tv";
  if (/book|kindle|novel|textbook/.test(t)) return "books";
  if (/headphone|earphone|speaker|audio|bluetooth|tws|airpod/.test(t)) return "audio";
  if (/shoe|shirt|dress|clothing|fashion|sneaker/.test(t)) return "fashion";
  if (/kitchen|cooker|mixer|microwave|refrigerator/.test(t)) return "home";
  if (/game|gaming|ps5|xbox|nintendo|steam|console/.test(t)) return "gaming";
  if (/camera|lens|gopro|dslr/.test(t)) return "camera";
  if (/protein|gym|fitness|yoga/.test(t)) return "fitness";
  if (/skincare|beauty|makeup|perfume/.test(t)) return "beauty";
  return "deals";
}

function extractPrice(title: string): number {
  const patterns = [/₹\s*(\d[\d,]+)/, /Rs\.?\s*(\d[\d,]+)/i, /at\s+(\d[\d,]+)/i];
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
  return "other";
}

function extractDiscount(title: string): number {
  const m = title.match(/(\d+)\s*%\s*off/i);
  return m?.[1] ? parseInt(m[1]) : 0;
}

function parseRedditPosts(data: any, subName: string, defaultCategory?: string): Deal[] {
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
      const category = defaultCategory || detectCategory(post.title);
      const platform = detectPlatform(post.title, post.url || "");
      const hasImage = post.thumbnail?.startsWith("http") && !post.thumbnail.includes("self") && !post.thumbnail.includes("default");
      return {
        id: `reddit-${post.id}`,
        title: post.title.slice(0, 90),
        description: post.selftext?.slice(0, 120) || `${post.score} upvotes · r/${subName}`,
        price,
        discount,
        votes: post.score,
        image: hasImage ? post.thumbnail : "",
        url: post.url?.startsWith("http") ? post.url : `https://reddit.com${post.permalink}`,
        redditUrl: `https://reddit.com${post.permalink}`,
        platform,
        category,
        source: `r/${subName}`,
        badge: discount > 40 ? `${discount}% OFF` : price > 0 && price < 500 ? "Under ₹500" : "Community Deal",
      };
    });
}

async function fetchLiveDeals(): Promise<Deal[]> {
  const all: Deal[] = [];
  const fetches = SUBREDDITS.map(async (sub) => {
    try {
      const res = await fetch(`https://www.reddit.com/${sub.path}`, {
        headers: { "User-Agent": "SlashAI/1.0" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return parseRedditPosts(data, sub.name, sub.defaultCategory);
    } catch {
      return [];
    }
  });
  const results = await Promise.all(fetches);
  for (const r of results) all.push(...r);
  const seen = new Set<string>();
  return all.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Deals & Products — SlashAI" },
      { name: "description", content: "Best deals from Indian communities — updated daily." },
    ],
  }),
  component: DealsPage,
});

/* ─── card components ─── */

function DealCard({ deal }: { deal: Deal }) {
  const isSameUrl = deal.url === deal.redditUrl;
  return (
    <article className="group overflow-hidden rounded-[10px] border border-border bg-surface transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]">
      <div className="relative flex h-[140px] items-center justify-center bg-[#21262d]">
        {deal.image ? (
          <img src={deal.image} alt="" loading="lazy" className="size-full object-contain" />
        ) : (
          <span className="text-[40px]">{CATEGORY_EMOJIS[deal.category] || "🏷️"}</span>
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
            {deal.discount > 0 && <span className="text-[11px] font-medium text-red">({deal.discount}% off)</span>}
          </div>
        )}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">▲ {deal.votes}</span>
          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${PLATFORM_STYLES[deal.platform] || PLATFORM_STYLES["other"]}`}>
            {deal.platform.charAt(0).toUpperCase() + deal.platform.slice(1)}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <a href={deal.url} target="_blank" rel="noreferrer noopener"
            className="flex h-8 flex-1 items-center justify-center gap-1 rounded-md border border-primary/40 text-xs font-medium text-primary transition-colors hover:bg-primary/10">
            Deal <ExternalLink className="size-3" />
          </a>
          {!isSameUrl && (
            <a href={deal.redditUrl} target="_blank" rel="noreferrer noopener"
              className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent"
              title="View discussion">
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
      <span className="text-[11px] font-semibold text-primary">🔥 Deal of the Day</span>
      <div className="mt-3 flex gap-4">
        <div className="flex size-[100px] shrink-0 items-center justify-center rounded-lg bg-[#21262d]">
          {deal.image ? (
            <img src={deal.image} alt="" className="size-full rounded-lg object-contain" />
          ) : (
            <span className="text-[48px]">{CATEGORY_EMOJIS[deal.category] || "🏷️"}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground line-clamp-2">{deal.title}</h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {deal.price > 0 && <span className="text-base font-bold text-green">{formatINR(deal.price)}</span>}
            {deal.discount > 0 && <span className="rounded bg-red/15 px-2 py-0.5 text-xs font-semibold text-red">{deal.discount}% OFF</span>}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">▲ {deal.votes} upvotes · {deal.source}</p>
          <div className="mt-3 flex items-center gap-2">
            <a href={deal.url} target="_blank" rel="noreferrer noopener"
              className="flex h-8 items-center gap-1.5 rounded-md border border-primary/40 px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/10">
              View Deal <ExternalLink className="size-3" />
            </a>
            {!isSameUrl && (
              <a href={deal.redditUrl} target="_blank" rel="noreferrer noopener"
                className="flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs text-muted-foreground transition-colors hover:bg-accent">
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
      {onSeeAll && <button onClick={onSeeAll} className="text-xs font-medium text-primary hover:underline">See all →</button>}
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
  const [dataSource, setDataSource] = useState<"live" | "seeded">("seeded");

  const loadDeals = useCallback(async (force = false) => {
    // Check cache first
    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (cached && Date.now() - cached.ts < CACHE_TTL && cached.deals?.length > 0) {
          setDeals(cached.deals);
          setUpdatedAt(cached.time);
          setDataSource("live");
          setLoading(false);
          return;
        }
      } catch { /* ignore */ }
    }

    setLoading(true);

    // Show seeded data immediately while fetching live
    const seeded = (seededData as any).trending || [];
    if (seeded.length > 0) {
      setDeals(seeded);
      setUpdatedAt((seededData as any).updatedTime || "seeded");
      setDataSource("seeded");
      setLoading(false);
    }

    // Fetch live from Reddit
    try {
      const live = await fetchLiveDeals();
      if (live.length > 0) {
        const time = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
        setDeals(live);
        setUpdatedAt(time);
        setDataSource("live");
        localStorage.setItem(CACHE_KEY, JSON.stringify({ deals: live, time, ts: Date.now() }));
      }
    } catch {
      // Keep seeded data
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
    return deals[0] || null;
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
      <header className="page-enter pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Deals & Products</h1>
            <p className="mt-1 text-[15px] text-muted-foreground">Best deals from Indian communities — updated daily.</p>
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
            <span className={`rounded-full px-2.5 py-1 text-[11px] ${dataSource === "live" ? "bg-green/10 text-green" : "bg-surface-elevated text-muted-foreground"}`}>
              {dataSource === "live" ? `Live · ${updatedAt} IST` : `Sample · Showing curated picks`} · {deals.length} deals
            </span>
          )}
          <span className="text-[12px] text-muted-foreground">
            {dataSource === "live" ? "Sourced from r/DesiDeal, r/AmazonIndia and more" : "Refresh for live Reddit deals"}
          </span>
        </div>
      </header>

      {/* Sort tabs */}
      <div className="mt-5 flex gap-1.5 overflow-x-auto pb-1">
        {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setSort(key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${sort === key ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
            <Icon className="size-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map(({ key, label }) => (
          <button key={key} onClick={() => setCategory(key)}
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${category === key ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Price tabs */}
      <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
        {PRICE_FILTERS.map(({ key, label }) => (
          <button key={key} onClick={() => setPriceFilter(key)}
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${priceFilter === key ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featured && category === "all" && priceFilter === "any" && (
        <div className="mt-5"><FeaturedDeal deal={featured} /></div>
      )}

      {/* Filtered grid */}
      {filtered.length > 0 && (
        <div className="mt-5">
          <SectionHeader title="All Deals" count={filtered.length} />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.slice(0, 20).map((deal) => <DealCard key={deal.id} deal={deal} />)}
          </div>
        </div>
      )}

      {/* Category sections */}
      {category === "all" && priceFilter === "any" && (
        <div className="mt-8 space-y-8">
          {showSection(getSection("phones")) && (
            <div>
              <SectionHeader title="📱 Phone Deals" count={getSection("phones").length} onSeeAll={() => setCategory("phones")} />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {getSection("phones").slice(0, 4).map((d) => <DealCard key={d.id} deal={d} />)}
              </div>
            </div>
          )}
          {showSection(getSection("computers")) && (
            <div>
              <SectionHeader title="💻 Computers" count={getSection("computers").length} onSeeAll={() => setCategory("computers")} />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {getSection("computers").slice(0, 4).map((d) => <DealCard key={d.id} deal={d} />)}
              </div>
            </div>
          )}
          {showSection(getSection("gaming")) && (
            <div>
              <SectionHeader title="🎮 Gaming" count={getSection("gaming").length} onSeeAll={() => setCategory("gaming")} />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {getSection("gaming").slice(0, 4).map((d) => <DealCard key={d.id} deal={d} />)}
              </div>
            </div>
          )}
          {showSection(getSection("books")) && (
            <div>
              <SectionHeader title="📚 Books" count={getSection("books").length} onSeeAll={() => setCategory("books")} />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {getSection("books").slice(0, 4).map((d) => <DealCard key={d.id} deal={d} />)}
              </div>
            </div>
          )}
          {showSection(getSection("audio")) && (
            <div>
              <SectionHeader title="🎧 Audio" count={getSection("audio").length} onSeeAll={() => setCategory("audio")} />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {getSection("audio").slice(0, 4).map((d) => <DealCard key={d.id} deal={d} />)}
              </div>
            </div>
          )}
        </div>
      )}

      <p className="mt-6 text-[11px] text-muted-foreground">
        {dataSource === "live"
          ? "Live deals from Reddit communities. Prices and availability may change."
          : "Showing curated deals. Tap refresh for live Reddit deals."}
      </p>
    </AppShell>
  );
}
