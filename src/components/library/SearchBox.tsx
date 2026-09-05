import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X, Clock, Command as CommandIcon } from "lucide-react";

import { useLibrary } from "@/hooks/use-library";
import { suggestions, VERIFIED_TOTAL } from "@/lib/commands";
import { cn } from "@/lib/utils";
import { Highlight } from "./Highlight";
import { VoiceSearchButton } from "./VoiceSearchButton";

interface Props {
  /** current query when the box is rendered on the search page */
  value?: string;
  /** called on every keystroke — when omitted the box navigates to /search */
  onChange?: (value: string) => void;
  size?: "sm" | "lg";
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

/**
 * The single, universal search entry point. On Home it is the primary action;
 * in the app header it is a compact affordance that leads to /search.
 */
function useSearchShortcut(inputRef: React.RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA)$/.test(target.tagName);
      if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inputRef]);
}

function SearchDropdown({
  open,
  draft,
  recentSearches,
  suggestionsList,
  onSubmit,
  onNavigate,
}: {
  open: boolean;
  draft: string;
  recentSearches: string[];
  suggestionsList: any[];
  onSubmit: (term: string) => void;
  onNavigate: (id: string) => void;
}) {
  if (!open || (suggestionsList.length === 0 && (draft || recentSearches.length === 0))) {
    return null;
  }

  return (
    <div className="panel absolute top-[calc(100%+6px)] left-0 z-40 w-full overflow-hidden rounded-xl py-1">
      {!draft &&
        recentSearches.map((term) => (
          <button
            key={term}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSubmit(term)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
          >
            <Clock className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate text-xs text-muted-foreground">{term}</span>
          </button>
        ))}
      {suggestionsList.map((s) => (
        <button
          key={s.id}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onNavigate(s.id)}
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
  );
}

export function SearchBox({
  value,
  onChange,
  size = "sm",
  placeholder,
  autoFocus,
  className,
}: Props) {
  const navigate = useNavigate();
  const { recentSearches, recordSearch } = useLibrary();
  const [draft, setDraft] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [voiceInterim, setVoiceInterim] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== undefined) setDraft(value);
  }, [value]);

  // keyboard shortcut: "/" or Ctrl/Cmd-K focuses search
  useSearchShortcut(inputRef);

  const sugg = useMemo(() => (open ? suggestions(draft) : []), [draft, open]);

  const submit = (q: string) => {
    recordSearch(q);
    setOpen(false);
    void navigate({ to: "/search", search: { q, cat: "all", sub: "all", sort: "relevance" } });
  };

  const update = (next: string) => {
    setDraft(next);
    setOpen(true);
    onChange?.(next);
  };

  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      <Search
        className={cn(
          "pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground",
          size === "lg" ? "size-5" : "size-4",
        )}
      />
      <input
        ref={inputRef}
        value={voiceActive && voiceInterim ? voiceInterim : draft}
        onChange={(e) => update(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit(draft);
          if (e.key === "Escape") setOpen(false);
        }}
        type="search"
        role="searchbox"
        autoFocus={autoFocus}
        aria-label="Search commands"
        placeholder={
          placeholder ?? `Search ${VERIFIED_TOTAL.toLocaleString()} commands, tags or tasks…`
        }
        className={cn(
          "w-full rounded-xl border border-border bg-surface pr-16 text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40 focus:outline-none",
          size === "lg" ? "h-14 pl-11 text-base" : "h-10 pl-9 text-sm",
        )}
      />
      <VoiceSearchButton
        size={size}
        onInterim={(t) => {
          setVoiceInterim(t);
          setVoiceActive(true);
        }}
        onResult={(text) => {
          setVoiceInterim("");
          setVoiceActive(false);
          update(text);
          submit(text);
        }}
        className="absolute top-1/2 right-8 -translate-y-1/2"
      />
      {draft && !voiceActive && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => update("")}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}

      <SearchDropdown
        open={open}
        draft={draft}
        recentSearches={recentSearches}
        suggestionsList={sugg}
        onSubmit={submit}
        onNavigate={(id) => {
          recordSearch(draft);
          setOpen(false);
          void navigate({ to: "/c/$slug", params: { slug: id } });
        }}
      />
    </div>
  );
}
