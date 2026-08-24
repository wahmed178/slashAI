import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Film, Search, Star, X } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { searchMovies, type MovieHit } from "@/lib/media.functions";
import { feedback } from "@/lib/play-sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/movies")({
  head: () => ({
    meta: [
      { title: "Regional movie finder — India, Pakistan & neighbours | SlashAI" },
      {
        name: "description",
        content:
          "Find Hindi, Telugu, Tamil, Malayalam, Pakistani, Bangladeshi, Nepali and Sri Lankan films, then jump straight to legal streaming pages that actually play them.",
      },
      {
        property: "og:title",
        content: "Regional movie finder — India, Pakistan & neighbours | SlashAI",
      },
      {
        property: "og:description",
        content: "Search South Asian cinema and open legal watch pages in one tap.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MoviesPage,
});

/** Regional shelves — each maps to a Cinemeta genre/keyword seed. */
const SHELVES = [
  { label: "Bollywood", genre: "Bollywood" },
  { label: "Hindi", genre: "Hindi" },
  { label: "Telugu", genre: "Telugu" },
  { label: "Tamil", genre: "Tamil" },
  { label: "Malayalam", genre: "Malayalam" },
  { label: "Kannada", genre: "Kannada" },
  { label: "Marathi", genre: "Marathi" },
  { label: "Bengali", genre: "Bengali" },
  { label: "Punjabi", genre: "Punjabi" },
  { label: "Pakistani", genre: "Urdu" },
  { label: "Nepali", genre: "Nepali" },
  { label: "Sinhala", genre: "Sinhala" },
] as const;

/** Legal, region-aware places to actually watch a title. */
const SOURCES = (title: string, year: string) => {
  const q = encodeURIComponent(year ? `${title} ${year}` : title);
  const plain = encodeURIComponent(title);
  return [
    { label: "Where to stream (JustWatch)", url: `https://www.justwatch.com/in/search?q=${plain}` },
    { label: "Prime Video", url: `https://www.primevideo.com/search?phrase=${plain}` },
    { label: "Netflix", url: `https://www.netflix.com/search?q=${plain}` },
    { label: "JioHotstar", url: `https://www.hotstar.com/in/explore?search_query=${plain}` },
    { label: "Zee5", url: `https://www.zee5.com/search?q=${plain}` },
    { label: "SonyLIV", url: `https://www.sonyliv.com/search?searchTerm=${plain}` },
    { label: "YouTube Movies (free & rent)", url: `https://www.youtube.com/results?search_query=${q}+full+movie` },
    { label: "IMDb page", url: `https://www.imdb.com/find/?q=${plain}` },
  ];
};

function MoviesPage() {
  const run = useServerFn(searchMovies);
  const [draft, setDraft] = useState("");
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState<string>("Bollywood");
  const [open, setOpen] = useState<MovieHit | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["movies", q, genre],
    queryFn: () => run({ data: { q, genre } }),
    staleTime: 10 * 60_000,
  });

  const movies = data ?? [];

  return (
    <AppShell wide hideHeaderSearch title="Movies">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Regional movie finder
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          South Asian cinema — Hindi, Telugu, Tamil, Malayalam, Urdu, Bengali, Nepali and more —
          with legal watch pages for every title.
        </p>
      </header>

      <div className="glass rounded-2xl p-3 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            feedback("tap");
            setQ(draft.trim());
          }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Search movies"
              placeholder="Search any film — e.g. Jawan, Sairat, Joyland…"
              className="h-11 w-full rounded-xl border border-border bg-surface pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
            />
          </div>
          <Button type="submit" className="min-h-11">
            Search
          </Button>
          {q && (
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => {
                setDraft("");
                setQ("");
              }}
            >
              Clear
            </Button>
          )}
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {SHELVES.map((s) => (
            <button
              key={s.label}
              type="button"
              aria-pressed={!q && genre === s.genre}
              onClick={() => {
                feedback("tap");
                setQ("");
                setDraft("");
                setGenre(s.genre);
              }}
              className={cn(
                "min-h-9 rounded-full border px-3.5 text-sm transition-colors",
                !q && genre === s.genre
                  ? "border-primary bg-accent text-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {isFetching && movies.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-2xl bg-surface-elevated" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {movies.map((m) => (
              <article
                key={m.id}
                role="button"
                tabIndex={0}
                aria-label={`Watch options for ${m.title}`}
                onClick={() => {
                  feedback("tap");
                  setOpen(m);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen(m);
                  }
                }}
                className="glass lift group cursor-pointer overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-surface-elevated">
                  {m.poster ? (
                    <img
                      src={m.poster}
                      alt={`${m.title} poster`}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <span className="grid size-full place-items-center text-muted-foreground">
                      <Film className="size-7" aria-hidden />
                    </span>
                  )}
                  {m.rating && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
                      <Star className="size-3 fill-current" aria-hidden /> {m.rating}
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <h3 className="line-clamp-2 text-sm font-medium text-foreground">{m.title}</h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {[m.year, m.genres[0]].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl px-6 py-14 text-center">
            <p className="text-base font-semibold text-foreground">Nothing found</p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
              Try the film's original title, or pick a language shelf above.
            </p>
          </div>
        )}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Watch ${open.title}`}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setOpen(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-2xl p-5 sm:rounded-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-foreground">{open.title}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {[open.year, open.runtime, open.genres.join(", ")].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {open.description && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {open.description}
              </p>
            )}
            {open.cast.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">Cast: {open.cast.join(", ")}</p>
            )}

            <h3 className="mt-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Legal ways to watch
            </h3>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {SOURCES(open.title, open.year).map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-accent"
                >
                  <span className="truncate">{s.label}</span>
                  <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                </a>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              SlashAI links only to official platforms and store pages — availability depends on
              your country and subscriptions.
            </p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
