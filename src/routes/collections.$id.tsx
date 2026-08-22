import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { CommandGrid, EmptyState } from "@/components/library/CommandGrid";
import { categoryIcon } from "@/components/library/icons";
import { collectionCommands, getCollection } from "@/lib/collections";

export const Route = createFileRoute("/collections/$id")({
  head: ({ params }) => {
    const collection = getCollection(params.id);
    if (!collection) {
      return {
        meta: [{ title: "Collection not found — SlashAI" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${collection.title} — SlashAI collection`;
    return {
      meta: [
        { title },
        { name: "description", content: collection.blurb },
        { property: "og:title", content: title },
        { property: "og:description", content: collection.blurb },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { id } = Route.useParams();
  const collection = getCollection(id);
  const commands = collection ? collectionCommands(id) : [];

  return (
    <AppShell
      wide
      hideHeaderSearch
      title={collection?.title ?? "Collection"}
      back={{ to: "/collections", label: "Collections" }}
    >
      {collection ? (
        <>
          <header className="flex items-start gap-3 pt-2">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
              {(() => {
                const Icon = categoryIcon(collection.icon);
                return <Icon className="size-6" aria-hidden />;
              })()}
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                {collection.title}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{collection.blurb}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{commands.length} commands</p>
            </div>
          </header>
          <div className="mt-5">
            <CommandGrid commands={commands} />
          </div>
        </>
      ) : (
        <EmptyState
          title="Collection not found"
          hint="This collection may have been renamed."
          action={
            <Button asChild variant="secondary">
              <Link to="/collections">All collections</Link>
            </Button>
          }
        />
      )}
    </AppShell>
  );
}
