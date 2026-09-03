import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, RotateCcw, Search, Share2, ZoomIn } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/hooks/use-library";
import { getCommand } from "@/lib/commands";
import { COLLECTIONS } from "@/lib/collections";
import { getResource } from "@/lib/resources";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/graph")({
  head: () => ({
    meta: [
      { title: "Your Knowledge Graph — see how saved items connect | SlashAI" },
      {
        name: "description",
        content:
          "A visual graph of everything you saved on SlashAI — commands, resources, collections and journal notes — connected by category and use.",
      },
    ],
  }),
  component: GraphPage,
});

type Kind = "command" | "resource" | "collection" | "note";

interface GraphNode {
  id: string;
  kind: Kind;
  label: string;
  sub: string;
  url?: string;
  size: number;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface GraphLink {
  a: string;
  b: string;
  dist: number;
}

const KIND_COLORS: Record<Kind, string> = {
  command: "#58a6ff",
  resource: "#3fb950",
  collection: "#a371f7",
  note: "#d29922",
};

const KIND_ICONS: Record<Kind, string> = {
  command: "/",
  resource: "★",
  collection: "❖",
  note: "✦",
};

const FILTERS: { id: Kind | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "command", label: "Commands" },
  { id: "resource", label: "Resources" },
  { id: "collection", label: "Collections" },
  { id: "note", label: "Notes" },
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function GraphPage() {
  const { favorites, journal } = useLibrary();
  const [activeKinds, setActiveKinds] = useState<Set<Kind | "all">>(new Set(["all"]));
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tick, setTick] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  /* ── assemble the graph from what the user actually saved ─────────── */
  const { nodes, links, neighbors } = useMemo(() => {
    const commandIds = favorites;
    const commands = commandIds
      .map((id) => getCommand(id))
      .filter((c): c is NonNullable<ReturnType<typeof getCommand>> => Boolean(c));
    const commandSet = new Set(commands.map((c) => c.id));

    let savedResourceIds: string[] = [];
    try {
      const raw = localStorage.getItem("slashai-saved-resources");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) savedResourceIds = parsed.filter((x): x is string => typeof x === "string");
      }
    } catch {
      /* ignore malformed storage */
    }
    const resources = savedResourceIds
      .map((id) => getResource(id))
      .filter((r): r is NonNullable<ReturnType<typeof getResource>> => Boolean(r));

    const notes = journal.filter((e) => e.title || e.body);

    /* which collections each saved command belongs to */
    const commandToCollections = new Map<string, string[]>();
    for (const coll of COLLECTIONS) {
      for (const cid of coll.commandIds) {
        if (!commandSet.has(cid)) continue;
        const list = commandToCollections.get(cid) ?? [];
        list.push(coll.id);
        commandToCollections.set(cid, list);
      }
    }

    const nodeList: GraphNode[] = [];
    const byId = new Map<string, GraphNode>();
    const push = (n: GraphNode) => {
      if (byId.has(n.id)) return;
      byId.set(n.id, n);
      nodeList.push(n);
    };

    for (const c of commands) {
      push({
        id: `cmd:${c.id}`,
        kind: "command",
        label: c.command,
        sub: c.description,
        url: `/c/${c.id}`,
        size: 11,
        color: KIND_COLORS.command,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      });
    }
    for (const r of resources) {
      push({
        id: `res:${r.id}`,
        kind: "resource",
        label: r.name,
        sub: r.category,
        url: `/r/${r.id}`,
        size: 10,
        color: KIND_COLORS.resource,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      });
    }
    for (const n of notes) {
      push({
        id: `note:${n.id}`,
        kind: "note",
        label: n.title || "(untitled note)",
        sub: n.mood,
        url: "/journal",
        size: 9,
        color: KIND_COLORS.note,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      });
    }
    for (const coll of COLLECTIONS) {
      const members = coll.commandIds.filter((cid) => commandSet.has(cid));
      if (members.length === 0 && commands.length > 0) continue; // only collections that connect to saved work
      push({
        id: `col:${coll.id}`,
        kind: "collection",
        label: coll.title,
        sub: `${coll.count} commands`,
        url: `/collections/${coll.id}`,
        size: 17,
        color: KIND_COLORS.collection,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      });
    }

    const linkList: GraphLink[] = [];
    const addLink = (a: string, b: string, dist: number) => {
      if (!byId.has(a) || !byId.has(b) || a === b) return;
      if (linkList.some((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a))) return;
      linkList.push({ a, b, dist });
    };

    /* saved command ↔ collection membership */
    for (const [cid, collIds] of commandToCollections) {
      for (const cid2 of collIds) addLink(`cmd:${cid}`, `col:${cid2}`, 120);
    }

    /* saved commands sharing a category form a cluster */
    const byCategory = new Map<string, string[]>();
    for (const c of commands) {
      const list = byCategory.get(c.category) ?? [];
      list.push(c.id);
      byCategory.set(c.category, list);
    }
    for (const list of byCategory.values()) {
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          addLink(`cmd:${list[i]}`, `cmd:${list[j]}`, 70);
        }
      }
    }

    /* resource ↔ saved command sharing a topic word */
    const cmdByToken = new Map<string, string[]>();
    for (const c of commands) {
      for (const t of `${c.title} ${c.description}`.toLowerCase().match(/[a-z0-9]{4,}/g) ?? []) {
        const list = cmdByToken.get(t) ?? [];
        list.push(c.id);
        cmdByToken.set(t, list);
      }
    }
    for (const r of resources) {
      const hay = `${r.name} ${r.category} ${(r.tags ?? []).join(" ")}`.toLowerCase();
      const hits = new Set<string>();
      for (const t of hay.match(/[a-z0-9]{4,}/g) ?? []) {
        for (const cid of cmdByToken.get(t) ?? []) {
          if (hits.size >= 3) break;
          hits.add(cid);
        }
        if (hits.size >= 3) break;
      }
      for (const cid of hits) addLink(`res:${r.id}`, `cmd:${cid}`, 95);
    }

    /* notes mentioning a saved command's name connect to it */
    for (const n of notes) {
      const hay = `${n.title} ${n.body}`.toLowerCase();
      let connected = 0;
      for (const c of commands) {
        if (connected >= 3) break;
        const token = c.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 24);
        if (token.length < 4) continue;
        if (hay.includes(token)) {
          addLink(`note:${n.id}`, `cmd:${c.id}`, 85);
          connected++;
        }
      }
    }

    /* seed positions on a circle so the layout starts clean */
    const count = nodeList.length;
    for (let i = 0; i < count; i++) {
      const ang = (i / Math.max(1, count)) * Math.PI * 2;
      nodeList[i]!.x = Math.cos(ang) * 40 + (Math.random() - 0.5) * 60;
      nodeList[i]!.y = Math.sin(ang) * 40 + (Math.random() - 0.5) * 60;
    }

    /* neighbour lookup for hover highlighting */
    const nb = new Map<string, Set<string>>();
    for (const l of linkList) {
      if (!nb.has(l.a)) nb.set(l.a, new Set());
      if (!nb.has(l.b)) nb.set(l.b, new Set());
      nb.get(l.a)!.add(l.b);
      nb.get(l.b)!.add(l.a);
    }
    return { nodes: nodeList, links: linkList, neighbors: nb };
  }, [favorites, journal]);

  const showAll = activeKinds.has("all");
  const isVisible = useCallback(
    (n: GraphNode) => (showAll || activeKinds.has(n.kind)) && (!query.trim() || n.label.toLowerCase().includes(query.trim().toLowerCase()) || n.sub.toLowerCase().includes(query.trim().toLowerCase())),
    [activeKinds, query, showAll],
  );

  const { visibleNodes, visibleLinks } = useMemo(() => {
    const vn = nodes.filter(isVisible);
    const ids = new Set(vn.map((n) => n.id));
    const vl = links.filter((l) => ids.has(l.a) && ids.has(l.b));
    return { visibleNodes: vn, visibleLinks: vl };
  }, [nodes, links, isVisible]);

  /* measured viewport for the simulation */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      sizeRef.current = { w: Math.max(320, r.width), h: Math.max(320, r.height) };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* simple force simulation — no dependencies, runs fully client-side */
  useEffect(() => {
    if (visibleNodes.length === 0) return;
    let raf = 0;
    let running = true;
    const step = () => {
      if (!running) return;
      const { w, h } = sizeRef.current;
      const cx = w / 2;
      const cy = h / 2;
      const active = visibleNodes.filter((n) => n.vx !== undefined);
      const byId = new Map(active.map((n) => [n.id, n]));

      /* repulsion */
      for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
          const a = active[i]!;
          const b = active[j]!;
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 0.01) {
            dx = (Math.random() - 0.5) * 2;
            dy = (Math.random() - 0.5) * 2;
            d2 = dx * dx + dy * dy;
          }
          const d = Math.sqrt(d2);
          const min = (a.size + b.size) * 2.6;
          const f = d < min ? ((min - d) / min) * 0.55 : 90 / d2;
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          if (a.vx !== undefined) {
            a.vx += fx;
            a.vy += fy;
          }
          if (b.vx !== undefined) {
            b.vx -= fx;
            b.vy -= fy;
          }
        }
      }

      /* springs */
      for (const l of visibleLinks) {
        const a = byId.get(l.a);
        const b = byId.get(l.b);
        if (!a || !b || a.vx === undefined || b.vx === undefined) continue;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const d = Math.max(0.01, Math.sqrt(dx * dx + dy * dy));
        const f = (d - l.dist) * 0.012;
        dx /= d;
        dy /= d;
        a.vx += dx * f;
        a.vy += dy * f;
        b.vx -= dx * f;
        b.vy -= dy * f;
      }

      /* centre gravity + integrate */
      for (const n of active) {
        if (n.vx === undefined) continue;
        n.vx += (cx - n.x) * 0.002;
        n.vy += (cy - n.y) * 0.002;
        n.vx *= 0.82;
        n.vy *= 0.82;
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > 7) {
          n.vx = (n.vx / speed) * 7;
          n.vy = (n.vy / speed) * 7;
        }
        n.x = clamp(n.x + n.vx, -sizeRef.current.w, sizeRef.current.w * 2);
        n.y = clamp(n.y + n.vy, -sizeRef.current.h, sizeRef.current.h * 2);
      }
      setTick((t) => t + 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [visibleNodes, visibleLinks]);

  /* pointer drag */
  const dragRef = useRef<{ id: string; moved: boolean } | null>(null);

  const onPointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    dragRef.current = { id, moved: false };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const rect = (e.currentTarget as Element).getBoundingClientRect();
    const px = (e.clientX - rect.left - sizeRef.current.w / 2) / scale - pan.x / scale;
    const py = (e.clientY - rect.top - sizeRef.current.h / 2) / scale - pan.y / scale;
    const n = nodes.find((x) => x.id === drag.id);
    if (!n) return;
    const dx = px - n.x;
    const dy = py - n.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.moved = true;
    n.x += dx;
    n.y += dy;
    n.vx = 0;
    n.vy = 0;
  };
  const endDrag = (e: React.PointerEvent, n: GraphNode) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag && !drag.moved && n.url) {
      window.location.href = n.url;
    }
  };

  const isHoverActive = (n: GraphNode) =>
    hovered === n.id || (hovered !== null && neighbors.get(hovered)?.has(n.id));

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    for (const n of nodes) {
      n.vx = 0;
      n.vy = 0;
    }
  };

  const zoom = (dir: 1 | -1) => setScale((s) => clamp(Number((s + dir * 0.25).toFixed(2)), 0.4, 2.4));

  const count = nodes.length;
  const note = count === 0 ? "Save some commands and resources first — they'll appear here as a connected graph." : undefined;

  return (
    <AppShell wide title="Knowledge graph">
      <header className="page-enter pt-2">
        <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-foreground">
          <span className="flex size-10 items-center justify-center rounded-xl bg-surface-elevated text-[18px] text-primary">
            <Share2 className="size-5" aria-hidden />
          </span>
          Knowledge Graph
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Everything you saved on this device — commands, resources, collections and journal notes — mapped by how they connect.
        </p>
      </header>

      {/* controls */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a node…"
            className="h-9 w-full rounded-lg border border-border bg-surface pr-3 pl-9 text-[13px] text-foreground outline-none focus:border-primary/60 min-w-[180px]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const on = activeKinds.has(f.id);
            return (
              <button
                key={f.id}
                onClick={() => {
                  const next = new Set(activeKinds);
                  if (f.id === "all") {
                    setActiveKinds(new Set(["all"]));
                  } else {
                    next.delete("all");
                    if (on) next.delete(f.id);
                    else next.add(f.id);
                    if (next.size === 0) next.add("all");
                    setActiveKinds(next);
                  }
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors",
                  on
                    ? "bg-primary text-background"
                    : "border border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => zoom(-1)} aria-label="Zoom out" className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground">
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center font-mono text-[12px] text-muted-foreground">{Math.round(scale * 100)}%</span>
          <button onClick={() => zoom(1)} aria-label="Zoom in" className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground">
            <Plus className="size-4" />
          </button>
          <button onClick={resetView} className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground">
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
        {(Object.keys(KIND_COLORS) as Kind[]).map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: KIND_COLORS[k] }} />
            {k[0]!.toUpperCase() + k.slice(1)}
            <span className="text-muted-foreground/50">· {nodes.filter((n) => n.kind === k).length}</span>
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface/60 p-1">
        <div
          ref={wrapRef}
          className="relative h-[62vh] min-h-[380px] w-full touch-none overflow-hidden rounded-lg bg-[rgba(10,10,15,0.35)]"
          onPointerMove={onPointerMove}
          onPointerUp={(e) => {
            const drag = dragRef.current;
            if (!drag) return;
            const n = nodes.find((x) => x.id === drag.id);
            if (n) endDrag(e, n);
          }}
          onPointerLeave={() => {
            dragRef.current = null;
          }}
        >
          {note ? (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div>
                <ZoomIn className="mx-auto size-8 text-muted-foreground/50" aria-hidden />
                <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">{note}</p>
                <Button asChild variant="secondary" size="sm" className="mt-4">
                  <Link to="/explore">Find commands to save</Link>
                </Button>
              </div>
            </div>
          ) : (
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${sizeRef.current.w || 800} ${sizeRef.current.h || 600}`}
              className="block cursor-grab"
            >
              <g transform={`translate(${sizeRef.current.w / 2 + pan.x} ${sizeRef.current.h / 2 + pan.y}) scale(${scale})`}>
                {visibleLinks.map((l) => {
                  const a = nodes.find((n) => n.id === l.a);
                  const b = nodes.find((n) => n.id === l.b);
                  if (!a || !b) return null;
                  const dim = hovered !== null && !(hovered === l.a || hovered === l.b);
                  return (
                    <line
                      key={`${l.a}|${l.b}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={dim ? "rgba(48,54,61,0.18)" : "rgba(88,166,255,0.28)"}
                      strokeWidth={dim ? 0.5 : 1}
                    />
                  );
                })}
                {visibleNodes.map((n) => {
                  const dim = hovered !== null && !isHoverActive(n);
                  const match = hovered === n.id;
                  return (
                    <g
                      key={n.id}
                      transform={`translate(${n.x} ${n.y})`}
                      onPointerDown={(e) => onPointerDown(e, n.id)}
                      className="cursor-pointer"
                      onMouseEnter={() => setHovered(n.id)}
                      onMouseLeave={() => setHovered(null)}
                      opacity={dim ? 0.28 : 1}
                    >
                      <circle r={n.size + (match ? 5 : hovered !== null && isHoverActive(n) && !match ? 2.5 : 0)} fill={n.color} opacity={match ? 0.25 : 0.12} />
                      <circle r={n.size} fill={n.color} opacity={match ? 1 : 0.9} stroke="rgba(230,237,243,0.35)" strokeWidth={match ? 1.6 : 0.8} />
                      <text y={n.size + 14} textAnchor="middle" fontSize={match ? 12 : 11} fill={match ? "var(--foreground, #e6edf3)" : "var(--muted-foreground, #8b949e)"} fontWeight={match ? 700 : 500}>
                        {n.label.length > 28 ? `${n.label.slice(0, 27)}…` : n.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          )}
        </div>
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground/70">
        {visibleNodes.length} of {count} nodes visible · drag to move · hover to trace connections · click a node to open it
      </p>
    </AppShell>
  );
}
