/**
 * "Shorten link" popup.
 *
 * Shortening happens on the device (see lib/shorten): no account, no server,
 * nothing sent anywhere. It drops campaign and click-tracking parameters and
 * tidies the link, then says exactly what it did — including when there was
 * nothing to do, rather than inventing a saving.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, ExternalLink, Link2, X } from "lucide-react";
import { toast } from "sonner";

import { savedSummary, shortenUrl } from "@/lib/shorten";
import { useShortenLink } from "./shorten-store";

const HISTORY_KEY = "slashai:shortened";

interface HistoryItem {
  url: string;
  at: number;
}

function readHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryItem[]).slice(0, 5) : [];
  } catch {
    return [];
  }
}

function writeHistory(url: string) {
  try {
    const next: HistoryItem[] = [
      { url, at: Date.now() },
      ...readHistory().filter((h) => h.url !== url),
    ];
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next.slice(0, 5)));
  } catch {
    /* private mode — the shortening still worked, only the history is lost */
  }
}

export function ShortenLinkDialog() {
  const { url, setUrl, close } = useShortenLink();
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(readHistory());
    // focus and select so the user can paste straight over it
    const id = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 40);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [close]);

  const value = url ?? "";
  const result = useMemo(() => shortenUrl(value), [value]);
  const summary = savedSummary(result);

  const copy = async () => {
    if (result.invalid) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      writeHistory(result.url);
      setHistory(readHistory());
      toast.success("Short link copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Clipboard blocked by the browser");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Shorten link"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-full max-w-lg animate-slide-in-up rounded-2xl border border-border bg-background p-4 shadow-2xl sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Link2 className="size-4" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-bold text-foreground">Shorten a link</h2>
              <p className="text-[11px] text-muted-foreground">
                Strips tracking junk. Nothing leaves your device.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <label
          className="mt-4 block text-xs font-semibold text-muted-foreground"
          htmlFor="shorten-input"
        >
          Link to share
        </label>
        <input
          id="shorten-input"
          ref={inputRef}
          value={value}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void copy();
          }}
          placeholder="Paste any link"
          autoComplete="off"
          spellCheck={false}
          className="mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 font-mono text-[12px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none"
        />

        <div
          className={`mt-3 rounded-xl border p-3 ${
            result.invalid
              ? "border-destructive/40 bg-destructive/5"
              : result.changed
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-surface"
          }`}
        >
          <p
            className={`text-xs font-semibold ${
              result.invalid
                ? "text-destructive"
                : result.changed
                  ? "text-primary"
                  : "text-muted-foreground"
            }`}
          >
            {summary}
          </p>
          {result.removed.length > 0 && (
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Removed:{" "}
              {result.removed.slice(0, 8).map((p) => (
                <code
                  key={p}
                  className="mr-1 rounded bg-background px-1 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {p}
                </code>
              ))}
              {result.removed.length > 8 ? `+${result.removed.length - 8} more` : ""}
            </p>
          )}
          {result.changed && !result.invalid && (
            <p className="mt-2 break-all rounded-lg bg-background px-2.5 py-2 font-mono text-[11px] text-foreground">
              {result.url}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copy}
            disabled={result.invalid}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy short link"}
          </button>
          {!result.invalid && (
            <a
              href={result.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
            >
              <ExternalLink className="size-4" />
              Test it
            </a>
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Recent
            </p>
            <ul className="mt-1.5 space-y-1">
              {history.map((h) => (
                <li key={h.url}>
                  <button
                    type="button"
                    onClick={() => setUrl(h.url)}
                    className="w-full truncate rounded-md px-2 py-1 text-left font-mono text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {h.url}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
