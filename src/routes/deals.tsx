import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, MessageSquare, RefreshCw, Flame, Tag, DollarSign, Clock } from "lucide-react";
import { AppShell } from "@/components/library/AppShell";
import productsData from "@/data/products.json";

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

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Deals & Products — SlashAI" },
      { name: "description", content: "Best deals from Indian communities — updated daily. Phones, gaming, books and more." },
    ],
  }),
  component: DealsPage,
});

function formatINR(n: number): string {
  return "\u20b9" + n.toLocaleString("en-IN");
}

function DealCard({ deal }: { deal: Deal }) {
  const isSameUrl = deal.url === deal.redditUrl;
  return (
    <article className="group overflow-hidden rounded-[10px] border border-border bg-surface transition-all duration-150 hover:-translate-y-0.5 hover:border-[#484f58]">
      {/* Image area */}
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
      {/* Content */}
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
          <span className="text-[11px] text-muted-foreground">▲ {deal.votes}</span>
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
          See all →
        </button>
      )}
    </div>
  );
}

function DealsPage() {
  const data = productsData as any;
  const [sort, setSort] = useState<SortKey>("trending");
  const [category, setCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("any");

  const allDeals: Deal[] = useMemo(() => {
    if (!data.trending) return [];
    return data.trending;
  }, [data]);

  const filtered = useMemo(() => {
    let items = [...allDeals];
    if (category !== "all") items = items.filter((d) => d.category === category);
    if (priceFilter === "499") items = items.filter((d) => d.price > 0 && d.price < 499);
    else if (priceFilter === "999") items = items.filter((d) => d.price > 0 && d.price < 999);
    else if (priceFilter === "1999") items = items.filter((d) => d.price > 0 && d.price < 1999);

    if (sort === "trending") items.sort((a, b) => b.votes - a.votes);
    else if (sort === "discount") items.sort((a, b) => b.discount - a.discount);
    else if (sort === "price") items.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    else if (sort === "latest") items.reverse();
    return items;
  }, [allDeals, sort, category, priceFilter]);

  const featured: Deal | null = data.featured || null;

  const sectionData = useMemo(() => {
    const cats = data.categories || {};
    return {
      phones: cats.phones || [],
      computers: cats.computers || [],
      gaming: cats.gaming || [],
      books: cats.books || [],
      audio: cats.audio || [],
      home: cats.home || [],
    };
  }, [data]);

  const showSection = (items: Deal[]) => items.length >= 2;

  if (!data.updated) {
    return (
      <AppShell wide title="Deals & Products">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-4xl">🔄</span>
          <h2 className="mt-4 text-lg font-semibold text-foreground">Deals are loading for the first time</h2>
          <p className="mt-2 text-sm text-muted-foreground">Check back in a few minutes.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell wide title="Deals & Products">
      {/* Header */}
      <header className="page-enter pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Deals & Products</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Best deals from Indian communities — updated daily.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {data.updatedTime && (
            <span className="rounded-full bg-surface-elevated px-2.5 py-1 text-[11px] text-muted-foreground">
              Updated {data.updatedTime} IST · {data.total} deals
            </span>
          )}
          <span className="text-[12px] text-muted-foreground">
            Sourced from r/DesiDeal, r/AmazonIndia and more
          </span>
        </div>
      </header>

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
          {showSection(sectionData.phones) && (
            <div>
              <SectionHeader title="📱 Phone Deals" count={sectionData.phones.length} onSeeAll={() => setCategory("phones")} />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {sectionData.phones.slice(0, 4).map((deal: Deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          )}

          {showSection(sectionData.computers) && (
            <div>
              <SectionHeader title="💻 PC & Computers" count={sectionData.computers.length} onSeeAll={() => setCategory("computers")} />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {sectionData.computers.slice(0, 4).map((deal: Deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          )}

          {showSection(sectionData.gaming) && (
            <div>
              <SectionHeader title="🎮 Gaming Deals" count={sectionData.gaming.length} onSeeAll={() => setCategory("gaming")} />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {sectionData.gaming.slice(0, 4).map((deal: Deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          )}

          {showSection(sectionData.books) && (
            <div>
              <SectionHeader title="📚 Book Deals" count={sectionData.books.length} onSeeAll={() => setCategory("books")} />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {sectionData.books.slice(0, 4).map((deal: Deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          )}

          {showSection(sectionData.audio) && (
            <div>
              <SectionHeader title="🎧 Audio Deals" count={sectionData.audio.length} onSeeAll={() => setCategory("audio")} />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {sectionData.audio.slice(0, 4).map((deal: Deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          )}

          {showSection(sectionData.home) && (
            <div>
              <SectionHeader title="🏠 Home & Kitchen" count={sectionData.home.length} onSeeAll={() => setCategory("home")} />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {sectionData.home.slice(0, 4).map((deal: Deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Under ₹499 section (All view only) */}
      {category === "all" && priceFilter === "any" && data.byPrice?.under_499?.length > 1 && (
        <div className="mt-8">
          <SectionHeader title="💰 Under ₹499" count={data.byPrice.under_499.length} />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {data.byPrice.under_499.slice(0, 4).map((deal: Deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      )}

      {/* Footer note */}
      <p className="mt-6 text-[11px] text-muted-foreground">
        All deals sourced from Reddit communities. Prices and availability may change. Not affiliated with any retailer.
      </p>
    </AppShell>
  );
}
