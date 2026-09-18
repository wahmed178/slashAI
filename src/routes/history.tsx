import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Check, Trash2, Search, ArrowLeft, History as HistoryIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { getCopyHistory, clearCopyHistory, timeAgo, type CopyHistoryItem } from "@/lib/ux";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Copy History - SlashAI" },
      {
        name: "description",
        content: "View and re-copy your recently copied AI commands. Stored locally on your device.",
      },
    ],
  }),
  component: HistoryPage,
});


function HistoryPage() {
  const [items, setItems] = useState<CopyHistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setItems(getCopyHistory());
  }, []);

  const copyItem = async (item: CopyHistoryItem) => {
    try {
      await navigator.clipboard.writeText(item.text);
      setCopiedId(item.id + item.timestamp);
      toast.success(`Copied ${item.name}`);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      toast.error("Clipboard blocked by browser");
    }
  };

  const handleClear = () => {
    clearCopyHistory();
    setItems([]);
    toast.success("Copy history cleared");
  };

  const filtered = items.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.text.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell wide hideHeaderSearch title="Copy History">
      <div className="mx-auto max-w-3xl pb-10">
        <header className="page-enter flex flex-wrap items-center justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <HistoryIcon className="size-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Copy History
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Your recent prompt copies. Stored privately on your device.
            </p>
          </div>

          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Clear history
            </Button>
          )}
        </header>

        {items.length > 0 && (
          <div className="relative mt-5">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search copied commands…"
              className="h-10 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-8 text-center">
            <span className="text-3xl">📋</span>
            <h3 className="mt-2 text-base font-semibold text-foreground">
              {items.length === 0 ? "No copy history yet" : "No matching commands"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {items.length === 0
                ? "When you copy slash commands or prompt templates, they will appear here for fast re-use."
                : "Try a different search term or clear the filter."}
            </p>
            {items.length === 0 && (
              <Button asChild className="mt-4" size="sm">
                <Link to="/explore">Browse commands</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {filtered.map((item) => {
              const isCopied = copiedId === item.id + item.timestamp;
              return (
                <div
                  key={item.id + item.timestamp}
                  className="group flex flex-col justify-between gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/50 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to="/c/$slug"
                        params={{ slug: item.id }}
                        className="font-mono text-sm font-bold text-foreground hover:text-primary hover:underline"
                      >
                        {item.name}
                      </Link>
                      <span className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {timeAgo(item.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 font-mono text-xs text-muted-foreground">
                      {item.text}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      size="sm"
                      variant={isCopied ? "default" : "secondary"}
                      className="gap-1.5 text-xs"
                      onClick={() => copyItem(item)}
                    >
                      {isCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      {isCopied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
