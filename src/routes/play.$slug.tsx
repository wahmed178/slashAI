import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Target } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { PackRunner } from "@/components/games/PackPlayer";
import { getPack, packLevel } from "@/lib/packs/registry";

export const Route = createFileRoute("/play/$slug")({
  head: ({ params }) => {
    const pack = getPack(params.slug);
    return {
      meta: [
        {
          title: pack
            ? `${pack.name} — Free Pack Game | SlashAI`
            : "Game Packs | SlashAI Play",
        },
        {
          name: "description",
          content: pack
            ? `${pack.desc}. Play ${pack.name} free in your browser — no download, no account.`
            : "Hundreds of free quiz, word, memory and puzzle packs. No account needed.",
        },
      ],
    };
  },
  component: PackPage,
});

function PackPage() {
  const { slug } = Route.useParams();
  const pack = getPack(slug);

  if (!pack) {
    return (
      <AppShell title="Game not found">
        <div className="mx-auto max-w-xl py-16 text-center">
          <div className="text-5xl">🧩</div>
          <h1 className="mt-4 text-2xl font-bold">That pack doesn't exist</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The pack may have been renamed. Browse the full collection instead —
            there are hundreds to pick from.
          </p>
          <Link
            to="/play"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <ArrowLeft className="size-4" /> All games
          </Link>
        </div>
      </AppShell>
    );
  }

  const level = packLevel(pack);
  return (
    <AppShell title={pack.name}>
      <div className="mx-auto max-w-2xl">
        <Link
          to="/play"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All games
        </Link>

        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {pack.icon} {pack.name}
            </h1>
            {pack.kids && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                🧸 Kids friendly
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{pack.desc}</p>
          <p className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> {pack.minutes} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Target className="size-3.5" /> {level}
            </span>
            <span>{pack.group}</span>
          </p>
        </header>

        <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
          <PackRunner pack={pack} />
        </section>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Part of the {pack.group.toLowerCase()} on{" "}
          <Link to="/play" className="underline hover:text-foreground">
            SlashPlay
          </Link>{" "}
          — 500+ free games, no account needed.
        </p>
      </div>
    </AppShell>
  );
}
