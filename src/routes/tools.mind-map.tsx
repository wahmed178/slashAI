import { useState, useRef, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/mind-map")({
  component: MindMapBuilder,
});

interface Node { id: number; x: number; y: number; text: string; parent: number | null; color: string; }
const COLORS = ["#58a6ff", "#3fb950", "#d29922", "#f85149", "#bc8cff", "#f0883e", "#79c0ff", "#56d364"] as const;

function MindMapBuilder() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 1, x: 400, y: 300, text: "Central Idea", parent: null,      color: COLORS[0] ?? "#58a6ff" },
  ]);
  const [selected, setSelected] = useState<number>(1);
  const [editing, setEditing] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const addChild = useCallback(() => {
    const parent = selected || 1;
    const parentNode = nodes.find((n) => n.id === parent);
    if (!parentNode) return;
    const childCount = nodes.filter((n) => n.parent === parent).length;
    const angle = (childCount * 60 + 30) * (Math.PI / 180);
    const dist = 120;
    const colorIdx = nodes.length % COLORS.length;
    const newNode: Node = {
      id: Date.now(),
      x: parentNode.x + Math.cos(angle) * dist,
      y: parentNode.y + Math.sin(angle) * dist,
      text: "New idea",
      parent,
      color: COLORS[colorIdx] ?? COLORS[0],
    };
    setNodes((prev) => [...prev, newNode]);
    setSelected(newNode.id);
    setEditing(newNode.id);
  }, [selected, nodes]);

  const addSibling = useCallback(() => {
    if (!selected) return;
    const node = nodes.find((n) => n.id === selected);
    if (!node || !node.parent) return;
    const siblingCount = nodes.filter((n) => n.parent === node.parent).length;
    const angle = (siblingCount * 45) * (Math.PI / 180);
    const newNode: Node = {
      id: Date.now(),
      x: node.x + Math.cos(angle) * 80,
      y: node.y + Math.sin(angle) * 80,
      text: "New idea",
      parent: node.parent,
      color: node.color,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelected(newNode.id);
  }, [selected, nodes]);

  const removeNode = useCallback((id: number) => {
    if (id === 1) return;
    const removeIds = new Set<number>();
    const collect = (nid: number) => {
      removeIds.add(nid);
      nodes.filter((n) => n.parent === nid).forEach((n) => collect(n.id));
    };
    collect(id);
    setNodes((prev) => prev.filter((n) => !removeIds.has(n.id)));
    if (selected && removeIds.has(selected)) setSelected(1);
  }, [selected, nodes]);

  const handleMouseDown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(id);
    setDragging(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNodes((prev) => prev.map((n) => n.id === dragging ? { ...n, x, y } : n));
  };

  const handleMouseUp = () => setDragging(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (editing) return;
    if (e.key === "Tab") { e.preventDefault(); addChild(); }
    if (e.key === "Enter") { e.preventDefault(); addSibling(); }
    if (e.key === "Delete" || e.key === "Backspace") { if (selected) removeNode(selected); }
    if (e.key === " ") { e.preventDefault(); if (selected) setEditing(selected); }
  };

  const edges = nodes.filter((n) => n.parent !== null).map((n) => {
    const parent = nodes.find((p) => p.id === n.parent);
    return parent ? { from: parent, to: n } : null;
  }).filter(Boolean);

  return (
    <AppShell title="Mind Map Builder">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🧠 Mind Map Builder</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visual mind map — Tab: add child, Enter: sibling, Delete: remove, Space: edit</p>
      </header>

      <div className="mx-auto max-w-4xl space-y-3">
        <div className="flex gap-2">
          <button onClick={addChild} className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated">+ Child (Tab)</button>
          <button onClick={addSibling} className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated">+ Sibling (Enter)</button>
          {selected && <button onClick={() => removeNode(selected)} className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20">Delete</button>}
          <button onClick={() => setEditing(selected)} className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated">Edit Text</button>
        </div>

        {editing && (
          <div className="flex gap-2">
            <input autoFocus value={nodes.find((n) => n.id === editing)?.text || ""} onChange={(e) => setNodes((prev) => prev.map((n) => n.id === editing ? { ...n, text: e.target.value } : n))}
              onKeyDown={(e) => { if (e.key === "Enter") setEditing(null); }} className="flex-1 h-9 rounded-lg border border-primary bg-surface px-3 text-sm focus:outline-none" />
            <button onClick={() => setEditing(null)} className="rounded-lg bg-primary px-3 text-sm font-medium text-background">Done</button>
          </div>
        )}

        <svg ref={svgRef} viewBox="0 0 800 600" className="w-full rounded-xl border border-border bg-surface cursor-crosshair"
          onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onKeyDown={handleKeyDown} tabIndex={0}>
          {edges.map((e, i) => (
            <line key={i} x1={e!.from.x} y1={e!.from.y} x2={e!.to.x} y2={e!.to.y} stroke={e!.to.color} strokeWidth="1.5" strokeOpacity="0.4" />
          ))}
          {nodes.map((n) => (
            <g key={n.id} onMouseDown={(e) => handleMouseDown(n.id, e)} style={{ cursor: "grab" }}>
              <rect x={n.x - 40} y={n.y - 16} width={80} height={32} rx={8}
                fill={n.id === selected ? n.color + "30" : n.color + "15"}
                stroke={n.id === selected ? n.color : n.color + "40"} strokeWidth={n.id === selected ? 2 : 1} />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fill="var(--foreground)" fontSize="11" fontFamily="Inter, sans-serif">
                {n.text.length > 12 ? n.text.slice(0, 12) + "\u2026" : n.text}
              </text>
            </g>
          ))}
        </svg>

        <p className="text-center text-[10px] text-muted-foreground">Click to select · Drag to move · Tab = child · Enter = sibling · Space = edit · Del = remove</p>
      </div>
    </AppShell>
  );
}
