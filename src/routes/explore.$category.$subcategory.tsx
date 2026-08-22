import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { CommandGrid, EmptyState } from "@/components/library/CommandGrid";
import { COMMANDS } from "@/lib/commands";

export const Route = createFileRoute("/explore/$category/$subcategory")({
  head: ({ params }) => {
    const title = `${params.subcategory} — ${params.category} | SlashAI`;
    const description = `AI slash commands for ${params.subcategory} inside the ${params.category} category.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SubcategoryPage,
});

function SubcategoryPage() {
  const { category, subcategory } = Route.useParams();
  const commands = COMMANDS.filter(
    (c) => c.category === category && c.subcategory === subcategory,
  ).sort((a, b) => b.popularity - a.popularity);

  return (
    <AppShell wide back={{ to: "/explore", label: category }} hideHeaderSearch title={subcategory}>
      <header className="pt-2">
        <Link
          to="/explore/$category"
          params={{ category }}
          className="text-xs font-medium text-primary hover:underline"
        >
          {category}
        </Link>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground">{subcategory}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{commands.length} commands</p>
      </header>

      <div className="mt-5">
        {commands.length > 0 ? (
          <CommandGrid commands={commands} />
        ) : (
          <EmptyState
            title="Nothing here yet"
            hint="This subcategory has no commands. Try another one in this category."
            action={
              <Button asChild variant="secondary">
                <Link to="/explore/$category" params={{ category }}>
                  Back to {category}
                </Link>
              </Button>
            }
          />
        )}
      </div>
    </AppShell>
  );
}
