import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Eye,
  ExternalLink,
  ListPlus,
  ListVideo,
  Music2,
  Pause,
  Play,
  Repeat,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Trash2,
  Video,
  X,
} from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { useYouTubePlayer } from "@/hooks/use-yt-player";
import { searchVideos, type VideoHit } from "@/lib/media.functions";
import { feedback } from "@/lib/play-sound";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/youtube")({
  head: () => ({
    meta: [
      { title: "YouTube hub — search videos & music | SlashAI" },
      {
        name: "description",
        content:
          "Search YouTube videos and music from inside SlashAI and play them in a smooth, distraction-free embedded player. Free, no sign-in.",
      },
      { property: "og:title", content: "YouTube hub — search videos & music | SlashAI" },
      {
        property: "og:description",
        content: "A calm YouTube search and player for videos and music, built into SlashAI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: YouTubePage,
});

const QUICK = [
  "lofi beats to study",
  "bollywood hits 2026",
  "javascript crash course",
  "telugu melody songs",
  "productivity system",
  "ambient focus music",
];

const fmtDuration = (s: number) => {
  if (!s) return "";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`;
};

const fmtViews = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v / 1000)}K` : `${v}`;

const QUEUE_KEY = "slashai.yt.queue.v1";

function loadQueue(): VideoHit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as VideoHit[]).slice(0, 100) : [];
  } catch {
    return [];
  }
}

function YouTubePage() {
  const run = useServerFn(searchVideos);
  const [draft, setDraft] = useState("lofi beats to study");
  const [q, setQ] = useState("lofi beats to study");
  const [music, setMusic] = useState(false);
  const [queue, setQueue] = useState<VideoHit[]>([]);
  const [index, setIndex] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);

  // hydrate the persisted queue after mount so SSR markup stays stable
  useEffect(() => setQueue(loadQueue()), []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(0, 100)));
    } catch {
      /* storage full or blocked — the queue simply stays in memory */
    }
  }, [queue]);

  const now = queue[index] ?? null;

  const advance = useCallback(
    (step: 1 | -1) => {
      setIndex((i) => {
        if (queue.length === 0) return 0;
        if (shuffle && step === 1) {
          if (queue.length === 1) return 0;
          let next = i;
          while (next === i) next = Math.floor(Math.random() * queue.length);
          return next;
        }
        const next = i + step;
        if (next >= queue.length) return repeat ? 0 : i;
        if (next < 0) return repeat ? queue.length - 1 : 0;
        return next;
      });
    },
    [queue.length, repeat, shuffle],
  );

  const player = useYouTubePlayer(() => advance(1));
  const { attach, reset } = player;
  useEffect(() => {
    if (now) reset();
  }, [now?.id, reset, now]);

  const { data, isFetching } = useQuery({
    queryKey: ["yt", q, music],
    queryFn: () => run({ data: { q, music } }),
    enabled: q.trim().length > 0,
    staleTime: 5 * 60_000,
  });

  const hits = data?.hits ?? [];
  const queuedIds = useMemo(() => new Set(queue.map((v) => v.id)), [queue]);

  const search = (term: string) => {
    const next = term.trim();
    if (!next) return;
    feedback("tap");
    setDraft(next);
    setQ(next);
  };

  /** Play now: put the track at the front of the "up next" run and jump to it. */
  const playNow = (video: VideoHit) => {
    feedback("tap");
    setQueue((prev) => {
      const existing = prev.findIndex((v) => v.id === video.id);
      if (existing >= 0) {
        setIndex(existing);
        return prev;
      }
      const next = [...prev];
      next.splice(index + (prev.length ? 1 : 0), 0, video);
      setIndex(prev.length ? index + 1 : 0);
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const enqueue = (video: VideoHit) => {
    feedback("tap");
    setQueue((prev) => (prev.some((v) => v.id === video.id) ? prev : [...prev, video]));
  };

  const removeAt = (i: number) => {
    setQueue((prev) => prev.filter((_, n) => n !== i));
    setIndex((cur) => (i < cur ? cur - 1 : Math.max(0, Math.min(cur, queue.length - 2))));
  };

  const handoff = now
    ? `https://www.youtube.com/watch?v=${now.id}${player.time > 3 ? `&t=${Math.floor(player.time)}s` : ""}`
    : "#";

  const progress =
    player.duration > 0 ? Math.min(100, (player.time / player.duration) * 100) : 0;


  return (
    <AppShell wide hideHeaderSearch title="YouTube">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          YouTube hub
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Search videos or music and play them right here — no ads-page detour, no sign-in.
        </p>
      </header>

      <div className="glass rounded-2xl p-3 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search(draft);
          }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label={music ? "Search music" : "Search videos"}
              placeholder={music ? "Search songs, artists, albums…" : "Search any video or topic…"}
              className="h-11 w-full rounded-xl border border-border bg-surface pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <div
              role="tablist"
              aria-label="Result type"
              className="flex rounded-xl border border-border bg-surface p-1"
            >
              {[
                { key: false, label: "Videos", icon: Video },
                { key: true, label: "Music", icon: Music2 },
              ].map((t) => (
                <button
                  key={String(t.key)}
                  type="button"
                  role="tab"
                  aria-selected={music === t.key}
                  onClick={() => {
                    feedback("tap");
                    setMusic(t.key);
                  }}
                  className={cn(
                    "flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm transition-colors",
                    music === t.key
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <t.icon className="size-4" /> {t.label}
                </button>
              ))}
            </div>
            <Button type="submit" className="min-h-11">
              Search
            </Button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => search(term)}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {now && (
        <section className="glass lift mt-5 overflow-hidden rounded-2xl">
          <div className="aspect-video w-full bg-black">
            <iframe
              key={now.id}
              title={now.title}
              src={`https://www.youtube-nocookie.com/embed/${now.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="size-full border-0"
            />
          </div>
          <div className="flex items-start gap-3 p-4">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold text-foreground">{now.title}</h2>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{now.author}</p>
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${now.id}`}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Open on YouTube"
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <ExternalLink className="size-4" />
            </a>
            <button
              type="button"
              aria-label="Close player"
              onClick={() => setNow(null)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </section>
      )}

      <div className="mt-6">
        {isFetching && hits.length === 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-surface-elevated" />
            ))}
          </div>
        ) : hits.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {hits.map((v) => (
              <article
                key={v.id}
                role="button"
                tabIndex={0}
                aria-label={`Play ${v.title}`}
                onClick={() => {
                  feedback("tap");
                  setNow(v);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setNow(v);
                  }
                }}
                className={cn(
                  "glass lift group cursor-pointer overflow-hidden rounded-2xl outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  now?.id === v.id && "ring-2 ring-primary",
                )}
              >
                <div className="relative aspect-video overflow-hidden bg-surface-elevated">
                  <img
                    src={v.thumb}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="size-9 text-white drop-shadow" aria-hidden />
                  </span>
                  {v.duration > 0 && (
                    <span className="absolute right-2 bottom-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white">
                      {fmtDuration(v.duration)}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-medium text-foreground">{v.title}</h3>
                  <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{v.author}</span>
                    {v.views > 0 && (
                      <span className="flex shrink-0 items-center gap-1">
                        <Eye className="size-3" /> {fmtViews(v.views)}
                      </span>
                    )}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl px-6 py-14 text-center">
            <p className="text-base font-semibold text-foreground">No results right now</p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
              {data?.degraded
                ? "The free search mirrors are busy. Try again in a moment, or open the search on YouTube."
                : "Try a different phrase, an artist name, or one of the suggestions above."}
            </p>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border px-4 text-sm text-foreground hover:bg-accent"
            >
              <ExternalLink className="size-4" /> Search on YouTube
            </a>
          </div>
        )}
      </div>
    </AppShell>
  );
}
