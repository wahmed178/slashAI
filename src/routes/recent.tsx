import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { CommandGrid, EmptyState } from "@/components/library/CommandGrid";
import { useLibrary } from "@/hooks/use-library";
import { getCommand, type SlashCommand } from "@/lib/commands";

export const Route = createFileRoute("/recent")({
  head: () => ({
    meta: [
      { title: "Recently used — SlashAI" },
      { name: "description", content: "The AI slash commands you opened most recently." },
      { property: "og:title", content: "Recently used — SlashAI" },
      { property: "og:description", content: "Pick up where you left off in SlashAI." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RecentPage,
});

function RecentPage() {
  const { recents, hydrated, clearRecents } = useLibrary();
  const commands = useMemo(
    () => recents.map((id) => getCommand(id)).filter((c): c is SlashCommand => Boolean(c)),
    [recents],
  );

  return (
    <AppShell wide>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 pt-2">
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight text-foreground">Recent</h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {hydrated ? `${commands.length} recently used` : "Loading…"}
          </p>
        </div>
        {commands.length > 0 && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={clearRecents}>
            <Trash2 className="size-3.5" /> Clear
          </Button>
        )}
      </header>

      <div className="mt-5">
        {commands.length > 0 ? (
          <CommandGrid commands={commands} />
        ) : (
          hydrated && (
            <EmptyState
              title="Nothing used yet"
              hint="Commands you open or copy show up here so you can get back to them fast."
              action={
                <Button asChild variant="secondary">
                  <Link to="/explore">Find a command</Link>
                </Button>
              }
            />
          )
        )}
      </div>
    </AppShell>
  );
}
