import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { CommandDetailContent } from "@/components/library/CommandDetailContent";
import { useLibrary } from "@/hooks/use-library";
import { getCommand, type SlashCommand } from "@/lib/commands";

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
  const { isFavorite, toggleFavorite, recordUse } = useLibrary();

  useEffect(() => {
    if (command) recordUse(command.id);
  }, [command, recordUse]);

  const open = (cmd: SlashCommand) => void navigate({ to: "/c/$slug", params: { slug: cmd.id } });

  return (
    <AppShell
      hideHeaderSearch
      title={command?.command ?? "Command"}
      back={{ to: "/explore", label: "Back" }}
    >
      {command ? (
        <>
          <p className="text-xs text-muted-foreground">
            <Link
              to="/explore/$category"
              params={{ category: command.category }}
              className="text-primary hover:underline"
            >
              {command.category}
            </Link>{" "}
            /{" "}
            <Link
              to="/explore/$category/$subcategory"
              params={{ category: command.category, subcategory: command.subcategory }}
              className="hover:underline"
            >
              {command.subcategory}
            </Link>
          </p>
          <h1 className="mt-1 mb-4 text-2xl font-black tracking-tight text-foreground">
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
            “{slug}” isn’t in the library. It may have been renamed or merged into another command.
          </p>
          <Button asChild variant="secondary" className="mt-4">
            <Link to="/explore">Browse all commands</Link>
          </Button>
        </div>
      )}
    </AppShell>
  );
}
