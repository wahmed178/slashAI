import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/library/AppShell";
import { CommandGrid, EmptyState } from "@/components/library/CommandGrid";
import { COMMANDS } from "@/lib/commands";
import { resolveCategory, resolveSubcategory, slugify, categoryHref, subcategoryHref } from "@/lib/explore-slugs";

export const Route = createFileRoute("/explore/$category/$subcategory")({
  head: ({ params }) => {
    const category = resolveCategory(params.category);
    const subcategory = category ? resolveSubcategory(category, params.subcategory) : null;
    if (!category || !subcategory) {
      return {
        meta: [{ title: "Not found - SlashAI" }, { name: "robots", content: "noindex" }],
      };
    }
    const count = COMMANDS.filter(
      (c) => c.category === category && c.subcategory === subcategory,
    ).length;
    const title = `${subcategory} - ${category} | SlashAI`;
    const description = `${count} AI slash commands for ${subcategory} inside the ${category} category. Copy any command and paste it into your AI tool.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  loader: ({ params }) => {
    const category = resolveCategory(params.category);
    const subcategory = category ? resolveSubcategory(category, params.subcategory) : null;
    if (!category || !subcategory) throw notFound();
    // Legacy percent-encoded URLs 301 to the clean slug pair.
    const catSlug = slugify(category);
    const subSlug = slugify(subcategory);
    if (
      decodeURIComponent(params.category) !== catSlug ||
      decodeURIComponent(params.subcategory) !== subSlug
    ) {
      throw redirect({
        to: subcategoryHref(category, subcategory),
        statusCode: 301,
      });
    }
    return null;
  },
  notFoundComponent: SubcategoryMissing,
  component: SubcategoryPage,
});

function SubcategoryMissing() {
  return (
    <AppShell wide back={{ to: "/explore", label: "Explore" }} hideHeaderSearch title="Not found">
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-[40px]">🗂️</p>
        <p className="text-sm font-semibold text-foreground">That subcategory doesn't exist.</p>
        <Button asChild variant="secondary">
          <Link to="/explore">Back to Explore</Link>
        </Button>
      </div>
    </AppShell>
  );
}

function SubcategoryPage() {
  const params = Route.useParams();
  const category = resolveCategory(params.category) ?? "";
  const subcategory = category ? resolveSubcategory(category, params.subcategory) ?? "" : "";
  const commands = COMMANDS.filter(
    (c) => c.category === category && c.subcategory === subcategory,
  ).sort((a, b) => b.popularity - a.popularity);

  return (
    <AppShell wide back={{ to: "/explore", label: category }} hideHeaderSearch title={subcategory}>
      <header className="pt-2">
        <Link
          to={categoryHref(category)}
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
                <Link to={categoryHref(category)}>
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
