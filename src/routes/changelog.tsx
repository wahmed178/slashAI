import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import changelogData from "@/data/changelog.json";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — SlashAI" },
      { name: "description", content: "What's new in SlashAI — every feature, fix, and improvement." },
    ],
  }),
  component: ChangelogPage,
});

function ChangelogPage() {
  const entries = (changelogData as any).entries || [];

  return (
    <AppShell hideHeaderSearch title="Changelog">
      <div className="pt-2">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Changelog</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">What's new in SlashAI — every feature, fix, and improvement.</p>
        </header>

        <div className="relative space-y-0">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

          {entries.map((entry: any) => (
            <div key={entry.version} className="relative flex gap-5 pb-10 last:pb-0">
              <div className="relative z-10 mt-1 flex shrink-0 items-start">
                <div className="size-[10px] rounded-full border-2 border-primary bg-background" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">v{entry.version}</span>
                  <span className="text-[11px] text-muted-foreground">{entry.date}</span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {entry.changes.map((change: string, j: number) => (
                    <li key={j} className="flex gap-2 text-[13px] leading-relaxed text-muted-foreground">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-border" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <Link to="/about" className="text-sm text-primary hover:underline">About SlashAI →</Link>
          <Link to="/keyboard" className="text-sm text-primary hover:underline">Keyboard shortcuts →</Link>
        </div>
      </div>
    </AppShell>
  );
}
