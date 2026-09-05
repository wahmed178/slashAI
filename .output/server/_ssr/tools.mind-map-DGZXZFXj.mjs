import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.mind-map-DGZXZFXj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"#58a6ff",
	"#3fb950",
	"#d29922",
	"#f85149",
	"#bc8cff",
	"#f0883e",
	"#79c0ff",
	"#56d364"
];
function MindMapBuilder() {
	const [nodes, setNodes] = (0, import_react.useState)([{
		id: 1,
		x: 400,
		y: 300,
		text: "Central Idea",
		parent: null,
		color: COLORS[0] ?? "#58a6ff"
	}]);
	const [selected, setSelected] = (0, import_react.useState)(1);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [dragging, setDragging] = (0, import_react.useState)(null);
	const svgRef = (0, import_react.useRef)(null);
	const addChild = (0, import_react.useCallback)(() => {
		const parent = selected || 1;
		const parentNode = nodes.find((n) => n.id === parent);
		if (!parentNode) return;
		const angle = (nodes.filter((n) => n.parent === parent).length * 60 + 30) * (Math.PI / 180);
		const dist = 120;
		const colorIdx = nodes.length % COLORS.length;
		const newNode = {
			id: Date.now(),
			x: parentNode.x + Math.cos(angle) * dist,
			y: parentNode.y + Math.sin(angle) * dist,
			text: "New idea",
			parent,
			color: COLORS[colorIdx] ?? COLORS[0]
		};
		setNodes((prev) => [...prev, newNode]);
		setSelected(newNode.id);
		setEditing(newNode.id);
	}, [selected, nodes]);
	const addSibling = (0, import_react.useCallback)(() => {
		if (!selected) return;
		const node = nodes.find((n) => n.id === selected);
		if (!node || !node.parent) return;
		const angle = nodes.filter((n) => n.parent === node.parent).length * 45 * (Math.PI / 180);
		const newNode = {
			id: Date.now(),
			x: node.x + Math.cos(angle) * 80,
			y: node.y + Math.sin(angle) * 80,
			text: "New idea",
			parent: node.parent,
			color: node.color
		};
		setNodes((prev) => [...prev, newNode]);
		setSelected(newNode.id);
	}, [selected, nodes]);
	const removeNode = (0, import_react.useCallback)((id) => {
		if (id === 1) return;
		const removeIds = /* @__PURE__ */ new Set();
		const collect = (nid) => {
			removeIds.add(nid);
			nodes.filter((n) => n.parent === nid).forEach((n) => collect(n.id));
		};
		collect(id);
		setNodes((prev) => prev.filter((n) => !removeIds.has(n.id)));
		if (selected && removeIds.has(selected)) setSelected(1);
	}, [selected, nodes]);
	const handleMouseDown = (id, e) => {
		e.stopPropagation();
		setSelected(id);
		setDragging(id);
	};
	const handleMouseMove = (e) => {
		if (!dragging || !svgRef.current) return;
		const rect = svgRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setNodes((prev) => prev.map((n) => n.id === dragging ? {
			...n,
			x,
			y
		} : n));
	};
	const handleMouseUp = () => setDragging(null);
	const handleKeyDown = (e) => {
		if (editing) return;
		if (e.key === "Tab") {
			e.preventDefault();
			addChild();
		}
		if (e.key === "Enter") {
			e.preventDefault();
			addSibling();
		}
		if (e.key === "Delete" || e.key === "Backspace") {
			if (selected) removeNode(selected);
		}
		if (e.key === " ") {
			e.preventDefault();
			if (selected) setEditing(selected);
		}
	};
	const edges = nodes.filter((n) => n.parent !== null).map((n) => {
		const parent = nodes.find((p) => p.id === n.parent);
		return parent ? {
			from: parent,
			to: n
		} : null;
	}).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Mind Map Builder",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight text-foreground",
				children: "🧠 Mind Map Builder"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Visual mind map — Tab: add child, Enter: sibling, Delete: remove, Space: edit"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addChild,
							className: "rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated",
							children: "+ Child (Tab)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addSibling,
							className: "rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated",
							children: "+ Sibling (Enter)"
						}),
						selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => removeNode(selected),
							className: "rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20",
							children: "Delete"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setEditing(selected),
							className: "rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated",
							children: "Edit Text"
						})
					]
				}),
				editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: nodes.find((n) => n.id === editing)?.text || "",
						onChange: (e) => setNodes((prev) => prev.map((n) => n.id === editing ? {
							...n,
							text: e.target.value
						} : n)),
						onKeyDown: (e) => {
							if (e.key === "Enter") setEditing(null);
						},
						className: "flex-1 h-9 rounded-lg border border-primary bg-surface px-3 text-sm focus:outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setEditing(null),
						className: "rounded-lg bg-primary px-3 text-sm font-medium text-background",
						children: "Done"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					ref: svgRef,
					viewBox: "0 0 800 600",
					className: "w-full rounded-xl border border-border bg-surface cursor-crosshair",
					onMouseMove: handleMouseMove,
					onMouseUp: handleMouseUp,
					onMouseLeave: handleMouseUp,
					onKeyDown: handleKeyDown,
					tabIndex: 0,
					children: [edges.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: e.from.x,
						y1: e.from.y,
						x2: e.to.x,
						y2: e.to.y,
						stroke: e.to.color,
						strokeWidth: "1.5",
						strokeOpacity: "0.4"
					}, i)), nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						onMouseDown: (e) => handleMouseDown(n.id, e),
						style: { cursor: "grab" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: n.x - 40,
							y: n.y - 16,
							width: 80,
							height: 32,
							rx: 8,
							fill: n.id === selected ? n.color + "30" : n.color + "15",
							stroke: n.id === selected ? n.color : n.color + "40",
							strokeWidth: n.id === selected ? 2 : 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: n.x,
							y: n.y + 4,
							textAnchor: "middle",
							fill: "var(--foreground)",
							fontSize: "11",
							fontFamily: "Inter, sans-serif",
							children: n.text.length > 12 ? n.text.slice(0, 12) + "…" : n.text
						})]
					}, n.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-[10px] text-muted-foreground",
					children: "Click to select · Drag to move · Tab = child · Enter = sibling · Space = edit · Del = remove"
				})
			]
		})]
	});
}
//#endregion
export { MindMapBuilder as component };
