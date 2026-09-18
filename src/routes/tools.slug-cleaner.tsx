import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Link2, Copy, Check, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tools/slug-cleaner")({
  head: () => ({
    meta: [
      { title: "URL Slug Cleaner & Permalink Generator - SlashAI" },
      {
        name: "description",
        content: "Turn article headlines, product titles and filenames into clean, SEO-optimized URL slugs in your browser.",
      },
    ],
  }),
  component: SlugCleanerPage,
});

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "about", "above", "after", "along", "for", "from",
  "in", "into", "near", "of", "off", "on", "onto", "out", "over", "to", "up", "with", "is", "at"
]);

function SlugCleanerPage() {
  const [input, setInput] = useState("Best AI Prompts for Developers & Founders in 2026: The Complete Guide!");
  const [separator, setSeparator] = useState<"-" | "_">("-");
  const [lowercase, setLowercase] = useState(true);
  const [stripStopWords, setStripStopWords] = useState(false);
  const [maxLength, setMaxLength] = useState(80);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => {
    let text = input.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // strip accents
    if (lowercase) text = text.toLowerCase();

    // Replace non-alphanumeric with spaces
    text = text.replace(/[^a-zA-Z0-9\s]/g, " ");

    let words = text.split(/\s+/).filter(Boolean);

    if (stripStopWords) {
      words = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
    }

    let result = words.join(separator);
    if (result.length > maxLength) {
      result = result.slice(0, maxLength).replace(new RegExp(`\\${separator}+$`), "");
    }

    return result;
  }, [input, separator, lowercase, stripStopWords, maxLength]);

  const handleCopy = async () => {
    if (!slug) return;
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      toast.success("Slug copied to clipboard!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard blocked");
    }
  };

  return (
    <AppShell title="Slug Cleaner">
      <div className="mx-auto max-w-3xl pb-14">
        <header className="page-enter pt-2">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Link2 className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              URL Slug Cleaner
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Generate clean, SEO-friendly permalinks for blogs, documentation, APIs and products.
          </p>
        </header>

        {/* Input */}
        <div className="mt-6 space-y-2">
          <label htmlFor="title-input" className="block text-xs font-semibold text-muted-foreground">
            Enter Title or Headline:
          </label>
          <textarea
            id="title-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="Type your title or headline here..."
            className="w-full resize-none rounded-xl border border-border bg-surface p-3.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Options */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 rounded-xl border border-border bg-surface p-4">
          <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="size-4 rounded border-border accent-primary"
            />
            <span>Convert to lowercase</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={stripStopWords}
              onChange={(e) => setStripStopWords(e.target.checked)}
              className="size-4 rounded border-border accent-primary"
            />
            <span>Remove stop words (the, and, for, etc.)</span>
          </label>

          <div className="flex items-center gap-3 text-xs text-foreground">
            <span>Separator:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setSeparator("-")}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium border ${
                  separator === "-" ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface-elevated text-muted-foreground"
                }`}
              >
                Hyphen (-)
              </button>
              <button
                type="button"
                onClick={() => setSeparator("_")}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium border ${
                  separator === "_" ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface-elevated text-muted-foreground"
                }`}
              >
                Underscore (_)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-foreground">
            <span>Max characters:</span>
            <input
              type="number"
              min={20}
              max={200}
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value) || 80)}
              className="w-20 rounded-md border border-border bg-surface-elevated px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Output */}
        <div className="mt-6 rounded-xl border border-primary/30 bg-surface p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Generated Slug</span>
            <span className="font-mono text-[11px]">{slug.length} chars</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 overflow-x-auto rounded-lg border border-border bg-surface-elevated p-3 font-mono text-sm text-primary font-medium select-all">
              {slug || "slug-will-appear-here"}
            </div>
            <Button
              onClick={handleCopy}
              disabled={!slug}
              className="gap-1.5 shrink-0"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy Slug"}
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Preview: <code className="text-foreground font-mono">https://example.com/posts/{slug || "slug"}</code>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
