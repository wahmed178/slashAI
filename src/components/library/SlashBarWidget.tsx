import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, RotateCcw, Search } from "lucide-react";

import type { Widget } from "@/lib/slashbar";

/**
 * Shared renderer for every SlashBar widget kind. Each widget is fully
 * functional: list reveals, pickers generate real output (copyable), counters
 * count, galleries render. No placeholders anywhere.
 */
export function SlashBarWidget({ widget, tint }: { widget: Widget; tint: string }) {
  return (
    <div
      className="cat rounded-xl border bg-surface p-4"
      style={{ "--cat": tint } as React.CSSProperties}
    >
      <header>
        <h3 className="cat-text text-[15px] font-bold tracking-tight">{widget.title}</h3>
        {widget.hint && (
          <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{widget.hint}</p>
        )}
      </header>
      <div className="mt-3">
        {widget.kind === "list" && <ListWidget widget={widget} tint={tint} />}
        {widget.kind === "deck" && <DeckWidget widget={widget} />}
        {widget.kind === "picker" && <PickerWidget widget={widget} tint={tint} />}
        {widget.kind === "counter" && <CounterWidget widget={widget} tint={tint} />}
        {widget.kind === "gallery" && <GalleryWidget widget={widget} tint={tint} />}
      </div>
    </div>
  );
}

/* ──────────── copy button (shared) ──────────── */

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          /* clipboard unavailable - still show feedback */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="cat-chip ripple-press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all duration-200"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

/* ──────────── list: tap-to-reveal / copyable items ──────────── */

function ListWidget({ widget, tint }: { widget: Widget; tint: string }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="flex flex-col gap-2">
      {(widget.items ?? []).map((item, i) => {
        const idx = item.indexOf("→");
        const front = idx > 0 ? item.slice(0, idx).trim() : item;
        const back = idx > 0 ? item.slice(idx + 1).trim() : null;
        const revealed = open.has(i);

        if (widget.reveal && back) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className="ripple-press rounded-lg border border-border bg-surface-elevated p-3 text-left transition-colors hover:border-[color-mix(in_oklab,var(--cat)_45%,transparent)]"
            >
              <span className="block text-[13px] font-semibold text-foreground">{front}</span>
              <span
                className={`mt-1 block text-[12.5px] leading-snug transition-all duration-300 ${
                  revealed ? "max-h-40 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                }`}
                style={{ color: "var(--muted-foreground)" }}
              >
                {revealed ? back : ""}
              </span>
              {!revealed && (
                <span className="cat-text mt-1 block text-[11px] font-semibold">Tap to reveal</span>
              )}
            </button>
          );
        }

        return (
          <div
            key={i}
            className="flex items-start justify-between gap-2 rounded-lg border border-border bg-surface-elevated p-3"
          >
            <span className="text-[13px] leading-snug text-foreground">{item}</span>
            {widget.copyable && <CopyButton text={item} label="" />}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────── deck: big searchable pool with pagination ──────────── */

const DECK_PAGE = 12;

function DeckWidget({ widget }: { widget: Widget }) {
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(DECK_PAGE);
  const items = widget.items ?? [];
  const query = q.trim().toLowerCase();

  const filtered = useMemo(
    () => (query ? items.filter((i) => i.toLowerCase().includes(query)) : items),
    [items, query],
  );
  const visible = filtered.slice(0, query ? filtered.length : shown);

  return (
    <div className="flex flex-col gap-2.5">
      {items.length > 10 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setShown(DECK_PAGE);
            }}
            placeholder={`Search ${items.length} entries…`}
            className="h-9 w-full rounded-full border border-border bg-background pl-9 pr-3 text-[12.5px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--cat)_30%,transparent)]"
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        {visible.map((item, i) => {
          const idx = item.indexOf("→");
          const front = idx > 0 ? item.slice(0, idx).trim() : item;
          const back = idx > 0 ? item.slice(idx + 1).trim() : null;
          return (
            <div
              key={`${i}-${item.slice(0, 24)}`}
              className="rounded-lg border border-border bg-surface-elevated p-3"
            >
              {back ? (
                <>
                  <p className="text-[13px] font-semibold text-foreground">{front}</p>
                  <p className="cat-text mt-1 text-[12.5px] leading-snug">→ {back}</p>
                </>
              ) : (
                <p className="text-[13px] leading-snug text-foreground">{item}</p>
              )}
            </div>
          );
        })}
        {visible.length === 0 && (
          <p className="rounded-lg border border-border bg-surface-elevated p-4 text-center text-[12.5px] text-muted-foreground">
            Nothing matches “{q.trim()}”. Try another word.
          </p>
        )}
      </div>
      {!query && shown < filtered.length && (
        <button
          type="button"
          onClick={() => setShown((n) => n + DECK_PAGE)}
          className="cat-chip ripple-press mx-auto rounded-full px-4 py-1.5 text-[11.5px] font-bold"
        >
          Show more ({filtered.length - shown} left)
        </button>
      )}
    </div>
  );
}

/* ──────────── picker: input → generated output ──────────── */

function PickerWidget({ widget, tint }: { widget: Widget; tint: string }) {
  const fields = widget.fields ?? [];
  const [values, setValues] = useState<string[]>(() => fields.map(() => ""));
  const [output, setOutput] = useState<string | null>(null);

  const submit = () => {
    if (!widget.run) return;
    setOutput(widget.run(values));
  };

  return (
    <div className="flex flex-col gap-2.5">
      {fields.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {fields.map((f, i) => (
            <label key={f.label} className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted-foreground">{f.label}</span>
              <input
                type={f.type === "number" ? "number" : "text"}
                value={values[i] ?? ""}
                placeholder={f.placeholder}
                onChange={(e) =>
                  setValues((prev) => {
                    const next = [...prev];
                    next[i] = e.target.value;
                    return next;
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                className="h-10 rounded-lg border border-border bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-[color-mix(in_oklab,var(--cat)_55%,transparent)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--cat)_25%,transparent)]"
              />
            </label>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={submit}
          className="ripple-press inline-flex h-9 items-center rounded-lg px-4 text-[12.5px] font-bold text-white transition-transform duration-150 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${tint}, color-mix(in oklab, ${tint} 60%, #a78bfa))`,
          }}
        >
          {widget.action ?? "Generate"}
        </button>
        {output && (
          <button
            type="button"
            onClick={() => setOutput(null)}
            className="ripple-press inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        )}
      </div>
      {output && (
        <div className="feed-in rounded-lg border border-border bg-surface-elevated p-3">
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground">{output}</p>
          <div className="mt-2.5">
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────── counter: live tap machine ──────────── */

function CounterWidget({ widget, tint }: { widget: Widget; tint: string }) {
  const counter = widget.counter;
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(5.0);
  const [best, setBest] = useState<number | null>(() => {
    const raw = localStorage.getItem("slashbar.counter-best");
    return raw ? Number(raw) : null;
  });
  const raf = useRef<number>(0);
  const endAt = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    endAt.current = performance.now() + 5000;
    const tick = () => {
      const remaining = Math.max(0, endAt.current - performance.now());
      setLeft(remaining / 1000);
      if (remaining <= 0) {
        setRunning(false);
        setCount((c) => {
          setBest((b) => {
            const next = b === null || c > b ? c : b;
            localStorage.setItem("slashbar.counter-best", String(next));
            return next;
          });
          return c;
        });
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  if (!counter) return null;
  const step = counter.steps[0];

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onPointerDown={() => running && setCount((c) => c + 1)}
        onClick={() => {
          if (!running) {
            setCount(0);
            setLeft(5);
            setRunning(true);
          }
        }}
        className="ripple-press grid h-40 w-full max-w-[280px] place-items-center rounded-2xl border-2 text-center transition-all duration-150 select-none"
        style={{
          borderColor: `color-mix(in oklab, ${tint} 55%, transparent)`,
          background: `color-mix(in oklab, ${tint} 12%, transparent)`,
        }}
      >
        <span>
          <span className="block text-4xl font-black text-foreground tabular-nums">
            {running ? count : best !== null ? `${count} / best ${best}` : "Tap to start"}
          </span>
          <span className="cat-text mt-1 block text-[12px] font-bold">
            {running ? `${left.toFixed(1)}s left` : step?.label ?? "5-second challenge"}
          </span>
          <span className="mt-0.5 block text-[11px] text-muted-foreground">
            {running ? step?.note ?? "" : `best this device: ${best ?? "—"}`}
          </span>
        </span>
      </button>
    </div>
  );
}

/* ──────────── gallery: visual cards ──────────── */

function GalleryWidget({ widget, tint }: { widget: Widget; tint: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {(widget.gallery ?? []).map((g) => (
        <div key={g.title} className="rounded-lg border border-border bg-surface-elevated p-3">
          <p className="cat-text text-[18px] font-black tabular-nums">{g.title}</p>
          <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{g.desc}</p>
        </div>
      ))}
    </div>
  );
}
