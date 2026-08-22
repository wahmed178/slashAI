import { createFileRoute, Link } from "@tanstack/react-router";
import { UserRound, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { APP_DETAILS } from "@/lib/app-meta";
import { CATEGORY_TREE, SUBCATEGORY_TOTAL, VERIFIED_TOTAL } from "@/lib/commands";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SlashAI" },
      {
        name: "description",
        content: `SlashAI is an offline-friendly library of ${VERIFIED_TOTAL} AI slash commands, created by ${APP_DETAILS.creator}.`,
      },
      { property: "og:title", content: "About SlashAI" },
      {
        property: "og:description",
        content: `The story and stats behind SlashAI's ${VERIFIED_TOTAL}-command library.`,
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell hideHeaderSearch title="About">
      <header className="flex items-center gap-3 pt-2">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Terminal className="size-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight text-foreground">SlashAI</h1>
          <p className="text-sm text-muted-foreground">v{APP_DETAILS.version}</p>
        </div>
      </header>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        SlashAI is a calm, searchable library of copy-ready AI slash commands. Instead of showing
        everything at once, it starts with one question — what are you working on — and guides you
        from a search or a category down to a single command you can copy and edit.
      </p>

      <dl className="panel mt-5 grid grid-cols-3 divide-x divide-border rounded-xl text-center">
        {[
          ["Commands", VERIFIED_TOTAL.toLocaleString()],
          ["Categories", String(CATEGORY_TREE.length)],
          ["Subcategories", String(SUBCATEGORY_TOTAL)],
        ].map(([k, v]) => (
          <div key={k} className="px-2 py-4">
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="mt-0.5 text-lg font-bold text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="panel mt-6 rounded-xl p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
          <UserRound className="size-3.5" /> Creator
        </p>
        <h2 className="mt-2 text-base font-semibold text-foreground">
          Created by {APP_DETAILS.creator}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          SlashAI exists for one reason: AI is most useful when its capabilities are organised well
          enough to reach in a second. {VERIFIED_TOTAL.toLocaleString()} commands across{" "}
          {CATEGORY_TREE.length} categories, each written to be understood and used immediately.
        </p>
      </section>

      <p className="mt-6 text-xs text-muted-foreground">{APP_DETAILS.storage}</p>

      <div className="mt-4 flex gap-2">
        <Button asChild variant="secondary">
          <Link to="/explore">Explore commands</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/settings">Settings</Link>
        </Button>
      </div>
    </AppShell>
  );
}
