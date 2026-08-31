import { useState, useMemo, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Copy, Check, Heart, Share2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/hub/quotes")({
  head: () => ({ meta: [{ title: "Curated Quotes — SlashAI" }] }),
  component: QuoteLibrary,
});

const QUOTES: Array<{ text: string; author: string; source?: string; category: string }> = [
  // Leadership
  { text: "The greatest leader is not the one who does the greatest things, but the one who gets people to do the greatest things.", author: "Ronald Reagan", category: "Leadership" },
  { text: "A leader is one who knows the way, goes the way, and shows the way.", author: "John C. Maxwell", category: "Leadership" },
  { text: "The measure of intelligence is the ability to change.", author: "Albert Einstein", category: "Leadership" },
  { text: "It is not the strongest of the species that survives, nor the most intelligent. It is the one most adaptable to change.", author: "Charles Darwin", category: "Leadership" },
  { text: "Before you are a leader, success is all about growing yourself. When you become a leader, success is all about growing others.", author: "Jack Welch", category: "Leadership" },
  // Stoicism
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius", source: "Meditations", category: "Stoicism" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca", category: "Stoicism" },
  { text: "No man is free who is not master of himself.", author: "Epictetus", category: "Stoicism" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius", source: "Meditations", category: "Stoicism" },
  { text: "He who fears death will never do anything worthy of a man who is alive.", author: "Seneca", category: "Stoicism" },
  // Islam
  { text: "Seek knowledge from the cradle to the grave.", author: "Prophet Muhammad ﷺ", category: "Islam" },
  { text: "The seeking of knowledge is obligatory for every Muslim.", author: "Prophet Muhammad ﷺ", source: "Ibn Majah", category: "Islam" },
  { text: "Verily, with hardship comes ease.", author: "Quran 94:6", category: "Islam" },
  { text: "The best among you are those who learn the Quran and teach it.", author: "Prophet Muhammad ﷺ", source: "Bukhari", category: "Islam" },
  { text: "Trust in Allah, but tie your camel.", author: "Prophet Muhammad ﷺ", category: "Islam" },
  // Productivity
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "Productivity" },
  { text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein", category: "Productivity" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg", category: "Productivity" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr.", category: "Productivity" },
  { text: "Focus is saying no to the hundred other good ideas.", author: "Steve Jobs", category: "Productivity" },
  // Startup
  { text: "Move fast and break things.", author: "Mark Zuckerberg", category: "Startup" },
  { text: "If you're not embarrassed by the first version of your product, you've launched too late.", author: "Reid Hoffman", category: "Startup" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "Startup" },
  { text: "Ideas are worthless. Execution is everything.", author: "Steve Case", category: "Startup" },
  { text: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates", category: "Startup" },
  // Coding
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "Coding" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", category: "Coding" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds", category: "Coding" },
  { text: "Premature optimization is the root of all evil.", author: "Donald Knuth", category: "Coding" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", category: "Coding" },
  // Life
  { text: "In three words I can sum up life: it goes on.", author: "Robert Frost", category: "Life" },
  { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi", category: "Life" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "Life" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West", category: "Life" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", category: "Life" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", category: "Life" },
  // Creativity
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein", category: "Creativity" },
  { text: "The chief enemy of creativity is good sense.", author: "Pablo Picasso", category: "Creativity" },
  { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson", category: "Creativity" },
  { text: "Imagination is everything. It is the preview of life's coming attractions.", author: "Albert Einstein", category: "Creativity" },
  // Success
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Success" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "Success" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "Success" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "Success" },
];

const CATEGORIES = [...new Set(QUOTES.map((q) => q.category))];

function QuoteLibrary() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [favourites, setFavourites] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("quote_favs") || "[]")); } catch { return new Set(); }
  });
  const [copiedIdx, setCopiedIdx] = useState(-1);

  // Daily quote (date-seeded)
  const todayIdx = useMemo(() => {
    const d = new Date();
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    return seed % QUOTES.length;
  }, []);

  const filtered = useMemo(() => {
    return QUOTES.filter((q) => {
      if (category !== "All" && q.category !== category) return false;
      if (search && !q.text.toLowerCase().includes(search.toLowerCase()) && !q.author.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, search]);

  const toggleFav = useCallback((idx: number) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      try { localStorage.setItem("quote_favs", JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const copyQuote = (q: typeof QUOTES[0], idx: number) => {
    const text = `"${q.text}" — ${q.author}${q.source ? ` (${q.source})` : ""}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(-1), 1500);
  };

  const dailyQuote = QUOTES[todayIdx] || QUOTES[0]!;

  return (
    <AppShell title="Curated Quotes">
      <div className="mx-auto max-w-3xl space-y-6 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Curated Quotes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {QUOTES.length} quotes across {CATEGORIES.length} categories. Share, save, get inspired.
          </p>
        </div>

        {/* Daily quote */}
        <div className="rounded-[10px] border border-primary/20 bg-primary/5 p-5">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">✨ Quote of the Day</p>
          <p className="text-base font-medium text-foreground leading-relaxed">"{dailyQuote.text}"</p>
          <p className="mt-2 text-sm text-muted-foreground">— {dailyQuote.author}</p>
        </div>

        {/* Search + categories */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quotes or authors..."
          className="h-10 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />

        <div className="flex flex-wrap gap-1.5">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                category === cat
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "border border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quote list */}
        <div className="space-y-2">
          {filtered.map((q, i) => {
            const globalIdx = QUOTES.indexOf(q);
            return (
              <div key={i} className="rounded-[10px] border border-border bg-surface p-4 transition-all hover:border-[#484f58]">
                <p className="text-sm leading-relaxed text-foreground">"{q.text}"</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    — {q.author}{q.source ? `, ${q.source}` : ""} · <span className="text-primary/70">{q.category}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleFav(globalIdx)} className="text-muted-foreground transition-colors hover:text-red">
                      <Heart className={`size-4 ${favourites.has(globalIdx) ? "fill-red text-red" : ""}`} />
                    </button>
                    <button onClick={() => copyQuote(q, globalIdx)} className="text-muted-foreground transition-colors hover:text-foreground">
                      {copiedIdx === globalIdx ? <Check className="size-4 text-green" /> : <Copy className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No quotes found.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
