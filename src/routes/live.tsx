import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  CloudSun,
  Droplets,
  Newspaper,
  RefreshCw,
  Search,
  Trophy,
  Wind,
  Radio,
} from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { getMatches, getNews, getWeather, type MatchItem } from "@/lib/live.functions";
import { feedback } from "@/lib/play-sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live — news, weather, cricket & football | SlashAI" },
      {
        name: "description",
        content:
          "One live dashboard: top stories, current weather anywhere, plus cricket and football fixtures and scores. Free, no sign-in.",
      },
      { property: "og:title", content: "Live — news, weather, cricket & football | SlashAI" },
      {
        property: "og:description",
        content: "Top stories, weather and live cricket + football scores in one calm dashboard.",
      },
    ],
  }),
  component: LivePage,
});

function Card({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="glass lift aurora overflow-hidden rounded-2xl p-5">
      <header className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          <Icon className="size-4 text-primary" /> {title}
        </h2>
        {action}
      </header>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 animate-pulse rounded-lg bg-surface-elevated" />
      ))}
    </div>
  );
}

function WeatherCard() {
  const fetchWeather = useServerFn(getWeather);
  const [place, setPlace] = useState("Hyderabad");
  const [draft, setDraft] = useState("Hyderabad");

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["weather", place],
    queryFn: () => fetchWeather({ data: { place } }),
    staleTime: 10 * 60 * 1000,
  });

  return (
    <Card
      title="Weather"
      icon={CloudSun}
      action={
        <button
          type="button"
          aria-label="Refresh weather"
          onClick={() => {
            feedback("tap");
            void refetch();
          }}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
        </button>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          feedback("tap");
          setPlace(draft.trim() || "Hyderabad");
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="City"
          placeholder="Any city in the world"
          className="h-10 w-full rounded-xl border border-border bg-surface pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
        />
      </form>

      {isFetching && !data ? (
        <div className="mt-4">
          <Skeleton rows={3} />
        </div>
      ) : data ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-foreground">{data.place}</p>
          <div className="mt-1 flex items-end gap-3">
            <span className="text-5xl leading-none font-bold text-foreground">{data.tempC}°</span>
            <span className="pb-1 text-sm text-muted-foreground">{data.summary}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Feels {data.feelsC}°</span>
            <span className="inline-flex items-center gap-1">
              <Wind className="size-3.5" /> {data.windKph} km/h
            </span>
            <span className="inline-flex items-center gap-1">
              <Droplets className="size-3.5" /> {data.humidity}%
            </span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {data.days.map((d) => (
              <div key={d.date} className="panel rounded-xl px-2 py-2 text-center">
                <p className="text-[11px] text-muted-foreground">
                  {new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{d.maxC}°</p>
                <p className="text-[11px] text-muted-foreground">{d.minC}°</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Couldn&apos;t find that place — try another spelling.
        </p>
      )}
    </Card>
  );
}

function NewsCard() {
  const fetchNews = useServerFn(getNews);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["news"],
    queryFn: () => fetchNews(),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Card
      title="Top stories"
      icon={Newspaper}
      action={
        <button
          type="button"
          aria-label="Refresh stories"
          onClick={() => {
            feedback("tap");
            void refetch();
          }}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
        </button>
      }
    >
      {!data ? (
        <Skeleton rows={6} />
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Stories are unavailable right now.</p>
      ) : (
        <ul className="space-y-1">
          {data.map((n) => (
            <li key={n.id}>
              <a
                href={n.url}
                target="_blank"
                rel="noreferrer noopener"
                className="block rounded-lg px-2 py-2 transition-colors hover:bg-accent"
              >
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {n.source} · {n.points} points · {n.comments} comments
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function MatchRow({ m }: { m: MatchItem }) {
  const live = /(1st|2nd|half|live|in play|innings)/i.test(m.status);
  return (
    <li className="panel lift flex items-center gap-3 rounded-xl px-3 py-2.5">
      {m.badge ? (
        <img src={m.badge} alt="" loading="lazy" className="size-8 shrink-0 rounded object-contain" />
      ) : (
        <Trophy className="size-8 shrink-0 p-1.5 text-primary" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {m.home && m.away ? `${m.home} vs ${m.away}` : m.event}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {m.league}
          {m.time
            ? ` · ${new Date(m.time).toLocaleString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "short",
              })}`
            : ""}
        </p>
      </div>
      <div className="shrink-0 text-right">
        {m.homeScore !== null && m.awayScore !== null ? (
          <p className="font-mono text-sm font-semibold text-foreground">
            {m.homeScore} – {m.awayScore}
          </p>
        ) : null}
        <p
          className={cn(
            "text-[11px]",
            live ? "font-semibold text-primary" : "text-muted-foreground",
          )}
        >
          {live && <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-primary align-middle" />}
          {m.status}
        </p>
      </div>
    </li>
  );
}

function ScoresCard({ sport, title }: { sport: "Soccer" | "Cricket"; title: string }) {
  const fetchMatches = useServerFn(getMatches);
  const [offset, setOffset] = useState(0);
  const { data, isFetching } = useQuery({
    queryKey: ["matches", sport, offset],
    queryFn: () => fetchMatches({ data: { sport, offsetDays: offset } }),
    staleTime: 60 * 1000,
  });

  const label = offset === 0 ? "Today" : offset === -1 ? "Yesterday" : "Tomorrow";

  return (
    <Card
      title={title}
      icon={Trophy}
      action={
        <div className="flex items-center gap-1">
          {[-1, 0, 1].map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => {
                feedback("tap");
                setOffset(o);
              }}
              className={cn(
                "rounded-lg px-2 py-1 text-xs transition-colors",
                offset === o
                  ? "bg-accent font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o === -1 ? "Yest" : o === 0 ? "Today" : "Tmrw"}
            </button>
          ))}
        </div>
      }
    >
      {!data && isFetching ? (
        <Skeleton rows={5} />
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {title.toLowerCase()} listed for {label.toLowerCase()}.</p>
      ) : (
        <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
          {data.map((m) => (
            <MatchRow key={m.id} m={m} />
          ))}
        </ul>
      )}
    </Card>
  );
}

function LivePage() {
  return (
    <AppShell wide title="Live">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Radio className="size-5 text-primary" /> Live
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Weather anywhere, today&apos;s top stories and cricket + football fixtures with scores.
          All from free public data — no account, no keys.
        </p>
      </header>

      <div className="mt-5 grid items-start gap-3 lg:grid-cols-2">
        <WeatherCard />
        <NewsCard />
        <ScoresCard sport="Cricket" title="Cricket" />
        <ScoresCard sport="Soccer" title="Football" />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Data: Open-Meteo (weather), Hacker News (stories), TheSportsDB (fixtures and scores).
        Refresh to pull the latest.
      </p>
    </AppShell>
  );
}
