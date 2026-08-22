import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { CommandDetailContent } from "@/components/library/CommandDetailContent";
import { OfflineBadge } from "@/components/library/OfflineBadge";
import { useLibrary } from "@/hooks/use-library";
import { getCommand, type SlashCommand } from "@/lib/commands";

const HOME_SEARCH = {
  q: "",
  cat: "all",
  sub: "all",
  type: "all",
  diff: "all",
  sort: "relevance" as const,
  fav: false,
  page: 1,
  cmd: undefined,
};

export const Route = createFileRoute("/c/$slug")({
  head: ({ params }) => {
    const command = getCommand(params.slug);
    const title = command
      ? `${command.command} — ${command.title} | SlashAI`
      : "Command not found | SlashAI";
    const description = command
      ? `${command.description} ${command.category} / ${command.subcategory}.`
      : "This slash command is not in the SlashAI library.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(command ? [] : [{ name: "robots", content: "noindex" }]),
      ],
      links: [{ rel: "manifest", href: "/manifest.webmanifest" }],
    };
  },
  component: CommandPage,
});

function CommandPage() {
  const { slug } = Route.useParams();
  const command = getCommand(slug);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useLibrary();

  const open = (cmd: SlashCommand) => void navigate({ to: "/c/$slug", params: { slug: cmd.id } });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            to="/"
            search={HOME_SEARCH}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← SlashAI library
          </Link>
          <div className="ml-auto">
            <OfflineBadge />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {command ? (
          <>
            <h1 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
              {command.title}
            </h1>
            <CommandDetailContent
              command={command}
              favorite={isFavorite(command.id)}
              onToggleFavorite={toggleFavorite}
              onOpenCommand={open}
            />
          </>
        ) : (
          <div className="panel flex flex-col items-center rounded-xl px-6 py-16 text-center">
            <h1 className="text-lg font-semibold text-foreground">Command not found</h1>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              “{slug}” isn’t in the library. It may have been renamed or merged into another
              command.
            </p>
            <Button asChild variant="secondary" className="mt-4">
              <Link to="/" search={HOME_SEARCH}>
                Browse all commands
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
