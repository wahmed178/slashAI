import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { SlashBarWidget } from "@/components/library/SlashBarWidget";
import { ALL_SLASH_APPS, appBySlug, type Widget } from "@/lib/slashbar";
import { PLAY_SECTIONS } from "@/lib/slashplay";
import { COURSES, COURSE_COUNT, TOTAL_LESSONS, lessonProgress, COURSES_CHANGE_EVENT } from "@/lib/courses";
import { Star, StarOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useLibrary } from "@/hooks/use-library";

export const Route = createFileRoute("/slash/$app")({
  loader: ({ params }) => {
    const app = appBySlug(params.app);
    if (!app || app.link) throw notFound();
    return { app };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found - SlashAI" }, { name: "robots", content: "noindex" }] };
    }
    const { app } = loaderData;
    const title = `${app.name} - working tools, free | SlashAI`;
    return {
      meta: [
        { title },
        { name: "description", content: app.desc },
        { property: "og:title", content: title },
      ],
    };
  },
  notFoundComponent: AppNotFound,
  component: SlashAppPage,
});

function AppNotFound() {
  return (
    <AppShell back={{ to: "/slash", label: "SlashBar" }} title="Not found">
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-[40px]">🧭</p>
        <p className="mt-2 text-sm font-semibold text-foreground">That Slash app doesn't exist yet.</p>
        <Link
          to="/slash"
          className="mt-4 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Back to SlashBar
        </Link>
      </div>
    </AppShell>
  );
}

function SlashAppPage() {
  const { app } = Route.useLoaderData();
  const { toolFavorites, isToolFavorite, toggleToolFavorite } = useLibrary();
  const saved = isToolFavorite(app.slug);
  // Brain Boosters embeds its playable games (Brain Training section) inline
  const games =
    app.slug === "brain-boosters"
      ? PLAY_SECTIONS.find((s) => s.title === "Brain Training")?.games ?? []
      : [];
  // Slash Learning embeds the full course catalog inline (same catalog as /learn)
  const courses = app.slug === "learning" ? COURSES : [];

  return (
    <AppShell wide hideHeaderSearch title={app.name}>
      <header className="page-enter pt-2">
        <Link
          to="/slash"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> SlashBar
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <span
            className="grid size-14 place-items-center rounded-2xl text-[28px]"
            style={{ background: `color-mix(in oklab, ${app.tint.hex} 16%, transparent)` }}
          >
            {app.emoji}
          </span>
          <div className="min-w-0">
            <h1
              className="text-xl font-bold tracking-tight sm:text-2xl"
              style={{ color: app.tint.hex }}
            >
              {app.name}
            </h1>
            <p className="text-[13px] text-muted-foreground">{app.desc}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => toggleToolFavorite(app.slug)}
                aria-label={saved ? `Remove ${app.name} from saved` : `Save ${app.name}`}
                className={`inline-flex h-7 items-center gap-1 rounded-full border px-3 text-[11.5px] font-semibold transition-colors ${
                  saved
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-surface text-muted-foreground hover:text-amber-300"
                }`}
              >
                {saved ? <><Star className="size-3 fill-current" /> Saved</> : <><StarOff className="size-3" /> Save</>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {games.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: app.tint.hex }}>
            🎮 Playable brain games
          </h2>
          <div className="cat-rule mt-1.5 w-24" />
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {games.map((g) => (
              <Link
                key={g.slug}
                to={`/play/${g.slug}` as string}
                className="ripple-press flex items-center gap-2.5 rounded-xl border bg-surface p-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
              >
                <span className="text-[22px]">{g.icon}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-bold text-foreground">{g.name}</span>
                  <span className="line-clamp-2 block text-[11px] leading-snug text-muted-foreground">{g.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {courses.length > 0 && <LearningCourses tint={app.tint.hex} />}

      <div className="stagger-children mt-5 grid gap-3 lg:grid-cols-2">
        {app.widgets.map((w: Widget) => (
          <SlashBarWidget key={w.title} widget={w} tint={app.tint.hex} />
        ))}
      </div>

      {app.link && (
        <div className="mt-6 flex justify-center">
          <Link
            to={app.link}
            className="ripple-press inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground"
          >
            Open {app.name}
          </Link>
        </div>
      )}

      {/* prev / next app navigation */}
      <nav className="mt-8 flex items-center justify-between border-t border-border pt-4">
        {(() => {
          const i = ALL_SLASH_APPS.findIndex((a) => a.slug === app.slug);
          const prev = ALL_SLASH_APPS[(i - 1 + ALL_SLASH_APPS.length) % ALL_SLASH_APPS.length]!;
          const next = ALL_SLASH_APPS[(i + 1) % ALL_SLASH_APPS.length]!;
          const label = (a: typeof prev) => `${a.emoji} ${a.name.replace("Slash ", "")}`;
          const cls = "ripple-press text-[12.5px] font-semibold text-muted-foreground transition-colors hover:text-foreground";
          return (
            <>
              {prev.link ? (
                <Link to={prev.link} className={cls}>← {label(prev)}</Link>
              ) : (
                <Link to="/slash/$app" params={{ app: prev.slug }} className={cls}>← {label(prev)}</Link>
              )}
              <Link
                to="/slash"
                className="text-[12px] text-muted-foreground hover:text-foreground"
              >
                All apps
              </Link>
              {next.link ? (
                <Link to={next.link} className={cls}>{label(next)} →</Link>
              ) : (
                <Link to="/slash/$app" params={{ app: next.slug }} className={cls}>{label(next)} →</Link>
              )}
            </>
          );
        })()}
      </nav>
    </AppShell>
  );
}

/* Slash Learning: course catalog cards with live progress, mirroring /learn */
function LearningCourses({ tint }: { tint: string }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener(COURSES_CHANGE_EVENT, bump);
    return () => window.removeEventListener(COURSES_CHANGE_EVENT, bump);
  }, []);

  return (
    <section className="mt-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: tint }}>
          🎓 Structured courses
        </h2>
        <Link to="/learn" className="text-[12px] font-bold text-primary transition-colors hover:text-primary/80">
          All courses →
        </Link>
      </div>
      <p className="mt-1 text-[12.5px] text-muted-foreground">
        {COURSE_COUNT} courses · {TOTAL_LESSONS} lessons · graded module tests · progress saved on your device
      </p>
      <div className="cat-rule mt-1.5 w-24" />
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c) => {
          const pct = Math.round(lessonProgress(c) * 100);
          return (
            <Link
              key={c.id}
              to="/learn/$courseId"
              params={{ courseId: c.id }}
              className="group flex items-start gap-3 rounded-xl border bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5"
              style={{ borderColor: `color-mix(in oklab, ${c.tint} 32%, transparent)` }}
            >
              <span
                className="grid size-11 shrink-0 place-items-center rounded-xl text-[22px]"
                style={{ background: `color-mix(in oklab, ${c.tint} 15%, transparent)` }}
                aria-hidden
              >
                {c.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-bold text-foreground">{c.title}</span>
                <span className="line-clamp-2 block text-[11.5px] leading-snug text-muted-foreground">{c.tagline}</span>
                {pct > 0 && (
                  <span className="mt-1.5 flex items-center gap-2">
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                      <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: c.tint }} />
                    </span>
                    <span className="text-[10px] font-bold tabular-nums" style={{ color: c.tint }}>{pct}%</span>
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
