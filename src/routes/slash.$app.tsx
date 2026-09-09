import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { SlashBarWidget } from "@/components/library/SlashBarWidget";
import { ALL_SLASH_APPS, appBySlug, type Widget } from "@/lib/slashbar";

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
          </div>
        </div>
      </header>

      <div className="stagger-children mt-5 grid gap-3 lg:grid-cols-2">
        {app.widgets.map((w: Widget) => (
          <SlashBarWidget key={w.title} widget={w} tint={app.tint.hex} />
        ))}
      </div>

      {/* SlashKits / SlashPlay apps live on their own sections */}

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
          return (
            <>
              <Link
                to={prev.link ?? "/slash/$app"}
                params={prev.link ? undefined : { app: prev.slug }}
                className="ripple-press text-[12.5px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                ← {label(prev)}
              </Link>
              <Link
                to="/slash"
                className="text-[12px] text-muted-foreground hover:text-foreground"
              >
                All apps
              </Link>
              <Link
                to={next.link ?? "/slash/$app"}
                params={next.link ? undefined : { app: next.slug }}
                className="ripple-press text-[12.5px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {label(next)} →
              </Link>
            </>
          );
        })()}
      </nav>
    </AppShell>
  );
}
