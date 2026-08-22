import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Flame,
  Lightbulb,
  Shuffle,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FeedCard } from "./FeedCard";
import { categoryIcon } from "./icons";
import { useLibrary } from "@/hooks/use-library";
import { COLLECTIONS } from "@/lib/collections";
import { getPersona, personaCommands } from "@/lib/personas";
import { toolsForPersona } from "@/lib/tools";
import { COMMANDS, getDailyCommand, getRandomCommand, todayKey, type SlashCommand } from "@/lib/commands";
import { NEWEST_COMMANDS, newToYou, tipForDay, trendingCommands } from "@/lib/engagement";

type Block =
  | { kind: "header"; id: string; icon: typeof Flame; title: string; hint?: string }
  | { kind: "command"; id: string; command: SlashCommand }
  | { kind: "daily"; id: string; command: SlashCommand }
  | { kind: "tip"; id: string }
  | { kind: "collections"; id: string }
  | { kind: "tools"; id: string }
  | { kind: "guides"; id: string }
  | { kind: "surprise"; id: string };

const PAGE = 8;

/** Instagram-style vertical feed over the catalog. Opt-in via the Home tabs. */
export function HomeFeed() {
  const { settings, recents, favorites } = useLibrary();
  const [dayKey, setDayKey] = useState("2026-01-01");
  const [visible, setVisible] = useState(PAGE);
  const sentinel = useRef<HTMLDivElement>(null);

  // resolve the real date after hydration so SSR output stays stable
  useEffect(() => setDayKey(todayKey()), []);

  const persona = getPersona(settings.persona);

  const blocks = useMemo<Block[]>(() => {
    const out: Block[] = [];
    const push = (b: Block) => out.push(b);
    const cmds = (list: SlashCommand[], prefix: string) =>
      list.forEach((c) => push({ kind: "command", id: `${prefix}-${c.id}`, command: c }));

    push({ kind: "daily", id: "daily", command: getDailyCommand(dayKey) });
    push({
      kind: "header",
      id: "h-trending",
      icon: Flame,
      title: "Trending today",
      hint: "The commands people reach for most.",
    });
    cmds(trendingCommands(dayKey, 6), "tr");

    push({
      kind: "header",
      id: "h-foryou",
      icon: Star,
      title: persona ? `For you, ${persona.label.split(" / ")[0]}` : "For you",
      hint: "Matched to your persona and interests.",
    });
    cmds(personaCommands(settings.persona, 6), "fy");

    push({ kind: "tip", id: "tip" });

    push({ kind: "header", id: "h-new", icon: Sparkles, title: "Newly added" });
    cmds(NEWEST_COMMANDS.slice(0, 5), "nw");

    push({ kind: "collections", id: "collections" });
    push({ kind: "tools", id: "tools" });

    push({
      kind: "header",
      id: "h-newtoyou",
      icon: ArrowRight,
      title: "New to you",
      hint: "In your areas, never opened.",
    });
    cmds(newToYou(persona?.categories ?? [], [...recents, ...favorites], 5), "ny");

    push({ kind: "guides", id: "guides" });
    push({ kind: "surprise", id: "surprise" });

    // endless tail: the rest of the catalog, most useful first
    const shown = new Set(
      out.filter((b) => b.kind === "command" || b.kind === "daily").map((b) => (b as never as { command: SlashCommand }).command.id),
    );
    const tail = [...COMMANDS]
      .filter((c) => !shown.has(c.id))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 240);
    tail.forEach((c, i) => {
      if (i % 20 === 0) {
        push({ kind: "header", id: `h-more-${i}`, icon: Shuffle, title: "More to explore" });
      }
      push({ kind: "command", id: `tl-${c.id}`, command: c });
    });

    return out;
  }, [dayKey, settings.persona, persona, recents, favorites]);

  // prefetch the next page when the sentinel approaches the viewport
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible((v) => Math.min(v + PAGE, blocks.length));
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [blocks.length]);

  return (
    <div className="space-y-3">
      {blocks.slice(0, visible).map((block, i) => (
        <FeedBlock key={block.id} block={block} index={i} personaId={settings.persona} />
      ))}
      {visible < blocks.length && (
        <div ref={sentinel} className="py-8 text-center text-xs text-muted-foreground">
          Loading more…
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof Flame;
  title: string;
  hint?: string | undefined;
}) {
  return (
    <div className="pt-5 pb-1">
      <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground">
        <Icon className="size-4 text-primary" aria-hidden />
        {title}
      </h2>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function FeedBlock({
  block,
  index,
  personaId,
}: {
  block: Block;
  index: number;
  personaId: string;
}) {
  const [surprise, setSurprise] = useState<SlashCommand | null>(null);

  switch (block.kind) {
    case "header":
      return <SectionHeader icon={block.icon} title={block.title} hint={block.hint} />;

    case "command":
      return <FeedCard command={block.command} index={index} />;

    case "daily":
      return (
        <section className="panel feed-in rounded-2xl border-primary/30 bg-accent/40 p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-primary uppercase">
            <CalendarDays className="size-3.5" aria-hidden /> Command of the day
          </p>
          <div className="mt-2">
            <FeedCard command={block.command} />
          </div>
        </section>
      );

    case "tip": {
      const tip = tipForDay(todayKey());
      return (
        <section className="panel feed-in rounded-2xl p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-primary uppercase">
            <Lightbulb className="size-3.5" aria-hidden /> Did you know?
          </p>
          <h3 className="mt-2 text-base font-semibold text-foreground">{tip.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tip.body}</p>
        </section>
      );
    }

    case "collections":
      return (
        <section className="feed-in">
          <SectionHeader icon={Sparkles} title="Collections for you" />
          <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
            {COLLECTIONS.slice(0, 8).map((c) => {
              const Icon = categoryIcon(c.icon);
              return (
                <Link
                  key={c.id}
                  to="/collections/$id"
                  params={{ id: c.id }}
                  className="panel flex w-44 shrink-0 snap-start flex-col gap-2 rounded-xl p-3 transition-colors hover:border-primary/50"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <span className="text-sm font-semibold text-foreground">{c.title}</span>
                  <span className="text-xs text-muted-foreground">{c.count} commands</span>
                </Link>
              );
            })}
          </div>
        </section>
      );

    case "tools":
      return (
        <section className="feed-in">
          <SectionHeader icon={Wrench} title="Free AI tools" hint="All usable without paying." />
          <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
            {toolsForPersona(personaId).map((t) => (
              <a
                key={t.id}
                href={t.url}
                target="_blank"
                rel="noreferrer noopener"
                className="panel flex w-44 shrink-0 snap-start flex-col gap-1 rounded-xl p-3 transition-colors hover:border-primary/50"
              >
                <span className="text-sm font-semibold text-foreground">{t.name}</span>
                <span className="text-xs text-muted-foreground">{t.bestFor}</span>
                <span className="mt-1 text-[11px] text-primary">{t.freeTier}</span>
              </a>
            ))}
          </div>
          <div className="mt-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/tools">
                See all tools <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </section>
      );

    case "guides":
      return (
        <section className="panel feed-in rounded-2xl p-4">
          <p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
            How-to guides
          </p>
          <ul className="mt-2 space-y-2 text-sm">
            {[
              ["How to write better prompts", "/about"],
              ["What is a slash command?", "/about"],
              ["Best commands for students", "/collections/for-students"],
              ["Best commands for creators", "/collections/for-creators"],
            ].map(([label, to]) => (
              <li key={label}>
                <Link
                  to={to!}
                  className="flex items-center gap-1.5 text-foreground hover:text-primary"
                >
                  <ArrowRight className="size-3.5 text-primary" aria-hidden /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      );

    case "surprise":
      return (
        <section className="panel feed-in rounded-2xl p-4 text-center">
          <p className="text-sm text-muted-foreground">Not sure what you need?</p>
          <Button className="mt-3 gap-2" onClick={() => setSurprise(getRandomCommand(surprise?.id))}>
            <Shuffle className="size-4" /> Surprise me
          </Button>
          {surprise && (
            <div className="mt-3 text-left">
              <FeedCard command={surprise} />
            </div>
          )}
        </section>
      );
  }
}
