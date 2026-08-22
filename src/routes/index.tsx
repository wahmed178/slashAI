import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Menu,
  Shuffle,
  Star,
  History,
  Settings as SettingsIcon,
  LayoutGrid,
  List,
  X,
  Command as CommandIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useLibrary } from "@/hooks/use-library";
import { useCommandActions } from "@/hooks/use-command-actions";
import { SidebarContents } from "@/components/library/AppSidebar";
import { CommandCard } from "@/components/library/CommandCard";
import { CommandDetail } from "@/components/library/CommandDetail";
import { DashboardWidgets } from "@/components/library/DashboardWidgets";
import { OfflineBadge } from "@/components/library/OfflineBadge";
import { SettingsPanel } from "@/components/library/SettingsPanel";
import { Highlight } from "@/components/library/Highlight";
import { categoryIcon } from "@/components/library/icons";
import {
  CATEGORY_ICONS,
  CATEGORY_TREE,
  SUBCATEGORY_TOTAL,
  TYPES,
  VERIFIED_TOTAL,
  filterCommands,
  getCommand,
  getRandomCommand,
  suggestions,
  type SlashCommand,
  type SortKey,
} from "@/lib/commands";

interface LibrarySearch {
  q: string;
  cat: string;
  sub: string;
  type: string;
  diff: string;
  sort: SortKey;
  fav: boolean;
  page: number;
  cmd: string | undefined;
}

const SORTS: SortKey[] = ["relevance", "name", "category", "popularity", "newest"];
const str = (v: unknown, fallback: string) => (typeof v === "string" && v ? v : fallback);

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): LibrarySearch => ({
    q: str(search["q"], ""),
    cat: str(search["cat"], "all"),
    sub: str(search["sub"], "all"),
    type: str(search["type"], "all"),
    diff: str(search["diff"], "all"),
    sort: (SORTS.includes(search["sort"] as SortKey) ? search["sort"] : "relevance") as SortKey,
    fav: search["fav"] === true || search["fav"] === "true",
    page: Math.max(1, Number(search["page"]) || 1),
    cmd: typeof search["cmd"] === "string" && search["cmd"] ? (search["cmd"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: `SlashAI Command Library — ${VERIFIED_TOTAL} AI slash commands` },
      {
        name: "description",
        content: `Search ${VERIFIED_TOTAL} verified AI slash commands for images, documents, writing, code, data and research. Copy-ready prompts, favorites and offline access.`,
      },
      { property: "og:title", content: "SlashAI Command Library" },
      {
        property: "og:description",
        content: `A searchable dashboard of ${VERIFIED_TOTAL} AI slash commands with copy-ready prompt templates.`,
      },
      { name: "theme-color", content: "#12161c" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "SlashAI" },
    ],
    links: [{ rel: "manifest", href: "/manifest.webmanifest" }],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const {
    hydrated,
    favorites,
    recents,
    recentSearches,
    settings,
    isFavorite,
    toggleFavorite,
    recordSearch,
    clearRecents,
    updateSettings,
  } = useLibrary();
  const { copyCommand } = useCommandActions();

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [recentsOpen, setRecentsOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [draft, setDraft] = useState(search.q);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(search.q), [search.q]);

  const setSearch = useCallback(
    (patch: Partial<LibrarySearch>) => {
      void navigate({ search: (prev) => ({ ...prev, page: 1, ...patch }), replace: true });
    },
    [navigate],
  );

  // debounce the search box into the URL
  useEffect(() => {
    if (draft === search.q) return;
    const t = setTimeout(() => setSearch({ q: draft }), 160);
    return () => clearTimeout(t);
  }, [draft, search.q, setSearch]);

  const results = useMemo(
    () =>
      filterCommands({
        q: search.q,
        category: search.cat,
        subcategory: search.sub,
        type: search.type,
        difficulty: search.diff,
        sort: search.sort,
        onlyFavorites: search.fav,
        favorites,
      }),
    [
      search.q,
      search.cat,
      search.sub,
      search.type,
      search.diff,
      search.sort,
      search.fav,
      favorites,
    ],
  );

  const pageSize = settings.pageSize;
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const page = Math.min(search.page, pageCount);
  const pageItems = results.slice((page - 1) * pageSize, page * pageSize);

  const selected = getCommand(search.cmd);
  const sugg = useMemo(() => (suggestOpen ? suggestions(draft) : []), [draft, suggestOpen]);
  const activeCategory = CATEGORY_TREE.find((c) => c.category === search.cat);

  const openCommand = useCallback(
    (cmd: SlashCommand) => void navigate({ search: (prev) => ({ ...prev, cmd: cmd.id }) }),
    [navigate],
  );
  const closeCommand = useCallback(
    () => void navigate({ search: (prev) => ({ ...prev, cmd: undefined }) }),
    [navigate],
  );

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA)$/.test(target.tagName);
      if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (e.key === "Escape" && typing) {
        setDraft("");
        setSuggestOpen(false);
      } else if (e.key.toLowerCase() === "r" && !typing && !e.metaKey && !e.ctrlKey) {
        openCommand(getRandomCommand());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openCommand]);

  const activeFilters =
    (search.cat !== "all" ? 1 : 0) +
    (search.sub !== "all" ? 1 : 0) +
    (search.type !== "all" ? 1 : 0) +
    (search.diff !== "all" ? 1 : 0) +
    (search.fav ? 1 : 0);

  const isHome = !search.q && search.cat === "all" && !search.fav;

  const sidebar = (
    <SidebarContents
      category={search.cat}
      onCategory={(c) => {
        setSearch({ cat: c, sub: "all", fav: false });
        setMenuOpen(false);
      }}
      onlyFavorites={search.fav}
      onToggleFavorites={() => {
        setSearch({ fav: !search.fav });
        setMenuOpen(false);
      }}
      favoritesCount={favorites.length}
      recentsCount={recents.length}
      onOpenRecents={() => {
        setRecentsOpen(true);
        setMenuOpen(false);
      }}
      onOpenSettings={() => {
        setSettingsOpen(true);
        setMenuOpen(false);
      }}
      onClose={menuOpen ? () => setMenuOpen(false) : undefined}
    />
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border lg:block">
        {sidebar}
      </aside>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-xs p-0 sm:max-w-sm">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Categories and library shortcuts</SheetDescription>
          </SheetHeader>
          {sidebar}
        </SheetContent>
      </Sheet>

      <main className="min-w-0 flex-1 pb-20 lg:pb-0">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-5" />
            </Button>

            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setSuggestOpen(true);
                }}
                onFocus={() => setSuggestOpen(true)}
                onBlur={() => {
                  window.setTimeout(() => setSuggestOpen(false), 120);
                  recordSearch(draft);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && sugg[0]) {
                    setSuggestOpen(false);
                    recordSearch(draft);
                    openCommand(sugg[0]);
                  }
                }}
                type="search"
                role="searchbox"
                aria-label="Search commands"
                placeholder={`Search ${VERIFIED_TOTAL.toLocaleString()} commands, tags or descriptions…`}
                className="h-11 w-full rounded-xl border border-border bg-surface pr-20 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none"
              />
              {draft ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setDraft("")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              ) : (
                <kbd className="absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground sm:block">
                  /
                </kbd>
              )}

              {suggestOpen && (sugg.length > 0 || (!draft && recentSearches.length > 0)) && (
                <div className="panel absolute top-[calc(100%+6px)] left-0 z-30 w-full overflow-hidden rounded-xl py-1">
                  {!draft &&
                    recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setDraft(term);
                          setSuggestOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                      >
                        <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate text-xs text-muted-foreground">{term}</span>
                      </button>
                    ))}
                  {sugg.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSuggestOpen(false);
                        recordSearch(draft);
                        openCommand(s);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                    >
                      <CommandIcon className="size-3.5 shrink-0 text-primary" />
                      <span className="font-mono text-xs">
                        <Highlight text={s.command} query={draft} />
                      </span>
                      <span className="truncate text-xs text-muted-foreground">{s.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Random command"
              onClick={() => openCommand(getRandomCommand())}
            >
              <Shuffle className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              aria-label="Settings"
              onClick={() => setSettingsOpen(true)}
            >
              <SettingsIcon className="size-5" />
            </Button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-6">
          {isHome && (
            <section className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                The SlashAI Command Library
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {VERIFIED_TOTAL.toLocaleString()}
                </span>{" "}
                verified, de-duplicated AI slash commands across {CATEGORY_TREE.length} categories
                and {SUBCATEGORY_TOTAL} subcategories. Search, copy a ready-to-edit prompt, and save
                the ones you keep coming back to.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground">
                  {favorites.length} favorite{favorites.length === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  onClick={() => setRecentsOpen(true)}
                  className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {recents.length} recently used
                </button>
                <OfflineBadge />
              </div>

              <div className="mt-5">
                <DashboardWidgets
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  onOpen={openCommand}
                />
              </div>

              {recents.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Recently used
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {recents.slice(0, 10).map((id) => {
                      const c = getCommand(id);
                      if (!c) return null;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => openCommand(c)}
                          className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                        >
                          {c.command}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {CATEGORY_TREE.map((c) => {
                  const Icon = categoryIcon(c.icon);
                  return (
                    <button
                      key={c.category}
                      type="button"
                      onClick={() => setSearch({ cat: c.category, sub: "all" })}
                      className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                      <Icon className="size-3.5" /> {c.category}
                      <span className="text-muted-foreground/70">{c.count}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* subcategory explorer */}
          {activeCategory && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSearch({ sub: "all" })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  search.sub === "all"
                    ? "border-primary/60 bg-accent text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground",
                )}
              >
                All {activeCategory.category} ({activeCategory.count})
              </button>
              {activeCategory.subcategories.map((s) => (
                <button
                  key={s.subcategory}
                  type="button"
                  onClick={() => setSearch({ sub: s.subcategory })}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition-colors",
                    search.sub === s.subcategory
                      ? "border-primary/60 bg-accent text-foreground"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.subcategory}{" "}
                  <span className="text-muted-foreground/70">{s.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* toolbar */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {results.length.toLocaleString()}
              </span>{" "}
              command
              {results.length === 1 ? "" : "s"}
              {search.fav && " in favorites"}
              {search.cat !== "all" && ` in ${search.cat}`}
              {search.sub !== "all" && ` / ${search.sub}`}
            </p>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <select
                aria-label="Filter by type"
                value={search.type}
                onChange={(e) => setSearch({ type: e.target.value })}
                className="h-9 rounded-lg border border-border bg-surface px-2 text-xs text-foreground capitalize focus:ring-2 focus:ring-ring/40 focus:outline-none"
              >
                <option value="all">All types</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                aria-label="Filter by difficulty"
                value={search.diff}
                onChange={(e) => setSearch({ diff: e.target.value })}
                className="h-9 rounded-lg border border-border bg-surface px-2 text-xs text-foreground capitalize focus:ring-2 focus:ring-ring/40 focus:outline-none"
              >
                <option value="all">Any level</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                aria-label="Sort commands"
                value={search.sort}
                onChange={(e) => setSearch({ sort: e.target.value as SortKey })}
                className="h-9 rounded-lg border border-border bg-surface px-2 text-xs text-foreground capitalize focus:ring-2 focus:ring-ring/40 focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    Sort: {s}
                  </option>
                ))}
              </select>
              <div className="flex rounded-lg border border-border bg-surface p-0.5">
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={settings.view === "grid"}
                  onClick={() => updateSettings({ view: "grid" })}
                  className={cn(
                    "rounded-md p-1.5",
                    settings.view === "grid"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={settings.view === "list"}
                  onClick={() => updateSettings({ view: "list" })}
                  className={cn(
                    "rounded-md p-1.5",
                    settings.view === "list"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <List className="size-4" />
                </button>
              </div>
              {activeFilters > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSearch({ cat: "all", sub: "all", type: "all", diff: "all", fav: false })
                  }
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          {/* results */}
          {!hydrated && results.length === 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="panel flex flex-col items-center rounded-xl px-6 py-16 text-center">
              <Search className="size-6 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">
                {search.fav ? "No favorites yet" : "No commands match that search"}
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {search.fav
                  ? "Tap the star on any command to keep it here — favorites are stored on this device."
                  : "Try a shorter keyword, clear the filters, or explore a category from the sidebar."}
              </p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  setDraft("");
                  setSearch({ q: "", cat: "all", sub: "all", type: "all", diff: "all", fav: false });
                }}
              >
                Reset search
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-3",
                settings.view === "grid" && "sm:grid-cols-2 xl:grid-cols-3",
                settings.density === "compact" && "gap-2",
              )}
            >
              {pageItems.map((c) => (
                <CommandCard
                  key={c.id}
                  command={c}
                  query={search.q}
                  view={settings.view}
                  compact={settings.density === "compact"}
                  favorite={isFavorite(c.id)}
                  onOpen={openCommand}
                  onToggleFavorite={toggleFavorite}
                  onCopy={copyCommand}
                />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => void navigate({ search: (p) => ({ ...p, page: page - 1 }) })}
              >
                <ChevronLeft className="size-4" /> Prev
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pageCount}
                onClick={() => void navigate({ search: (p) => ({ ...p, page: page + 1 }) })}
              >
                Next <ChevronRight className="size-4" />
              </Button>
            </nav>
          )}
        </div>
      </main>

      {/* mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-surface/95 backdrop-blur-md lg:hidden">
        {[
          {
            label: "Browse",
            icon: LayoutGrid,
            action: () => setSearch({ cat: "all", sub: "all", fav: false }),
          },
          { label: "Search", icon: Search, action: () => inputRef.current?.focus() },
          { label: "Favorites", icon: Star, action: () => setSearch({ fav: true }) },
          { label: "Recent", icon: History, action: () => setRecentsOpen(true) },
          { label: "Settings", icon: SettingsIcon, action: () => setSettingsOpen(true) },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            className="flex min-h-12 flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] text-muted-foreground active:text-foreground"
          >
            <item.icon className="size-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <Sheet open={recentsOpen} onOpenChange={setRecentsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Recently used</SheetTitle>
            <SheetDescription>The last commands you copied on this device.</SheetDescription>
          </SheetHeader>
          <div className="space-y-1.5 px-4 pb-6">
            {recents.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nothing here yet — copy or use a command and it will show up.
              </p>
            )}
            {recents.map((id) => {
              const c = getCommand(id);
              if (!c) return null;
              const Icon = categoryIcon(CATEGORY_ICONS[c.category]);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setRecentsOpen(false);
                    openCommand(c);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-left hover:border-primary/50"
                >
                  <Icon className="size-4 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-xs">{c.command}</span>
                    <span className="block truncate text-xs text-muted-foreground">{c.title}</span>
                  </span>
                </button>
              );
            })}
            {recents.length > 0 && (
              <Button variant="ghost" size="sm" className="mt-2" onClick={clearRecents}>
                Clear history
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />

      <CommandDetail
        command={selected}
        open={Boolean(selected)}
        favorite={selected ? isFavorite(selected.id) : false}
        onOpenChange={(o) => !o && closeCommand()}
        onToggleFavorite={toggleFavorite}
        onSelectRelated={openCommand}
      />
    </div>
  );
}
