import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { I as useLibrary, h as cn, n as Button, y as getCommand } from "./slashkits-CB7bx4DD.mjs";
import { f as getResource } from "./resources-sbNg_EgT.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as Search, P as Share2, U as RotateCcw, X as Plus, ct as Minus, t as ZoomIn } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { t as COLLECTIONS } from "./collections-OIdjX1d6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/graph-CUo8LAVK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KIND_COLORS = {
	command: "#58a6ff",
	resource: "#3fb950",
	collection: "#a371f7",
	note: "#d29922"
};
var FILTERS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "command",
		label: "Commands"
	},
	{
		id: "resource",
		label: "Resources"
	},
	{
		id: "collection",
		label: "Collections"
	},
	{
		id: "note",
		label: "Notes"
	}
];
var clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
function GraphPage() {
	const { favorites, journal } = useLibrary();
	const [activeKinds, setActiveKinds] = (0, import_react.useState)(/* @__PURE__ */ new Set(["all"]));
	const [query, setQuery] = (0, import_react.useState)("");
	const [hovered, setHovered] = (0, import_react.useState)(null);
	const [scale, setScale] = (0, import_react.useState)(1);
	const [pan, setPan] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [tick, setTick] = (0, import_react.useState)(0);
	const wrapRef = (0, import_react.useRef)(null);
	const sizeRef = (0, import_react.useRef)({
		w: 0,
		h: 0
	});
	const { nodes, links, neighbors } = (0, import_react.useMemo)(() => {
		const commands = favorites.map((id) => getCommand(id)).filter((c) => Boolean(c));
		const commandSet = new Set(commands.map((c) => c.id));
		let savedResourceIds = [];
		try {
			const raw = localStorage.getItem("slashai-saved-resources");
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) savedResourceIds = parsed.filter((x) => typeof x === "string");
			}
		} catch {}
		const resources = savedResourceIds.map((id) => getResource(id)).filter((r) => Boolean(r));
		const notes = journal.filter((e) => e.title || e.body);
		const commandToCollections = /* @__PURE__ */ new Map();
		for (const coll of COLLECTIONS) for (const cid of coll.commandIds) {
			if (!commandSet.has(cid)) continue;
			const list = commandToCollections.get(cid) ?? [];
			list.push(coll.id);
			commandToCollections.set(cid, list);
		}
		const nodeList = [];
		const byId = /* @__PURE__ */ new Map();
		const push = (n) => {
			if (byId.has(n.id)) return;
			byId.set(n.id, n);
			nodeList.push(n);
		};
		for (const c of commands) push({
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
			vy: 0
		});
		for (const r of resources) push({
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
			vy: 0
		});
		for (const n of notes) push({
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
			vy: 0
		});
		for (const coll of COLLECTIONS) {
			if (coll.commandIds.filter((cid) => commandSet.has(cid)).length === 0 && commands.length > 0) continue;
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
				vy: 0
			});
		}
		const linkList = [];
		const addLink = (a, b, dist) => {
			if (!byId.has(a) || !byId.has(b) || a === b) return;
			if (linkList.some((l) => l.a === a && l.b === b || l.a === b && l.b === a)) return;
			linkList.push({
				a,
				b,
				dist
			});
		};
		for (const [cid, collIds] of commandToCollections) for (const cid2 of collIds) addLink(`cmd:${cid}`, `col:${cid2}`, 120);
		const byCategory = /* @__PURE__ */ new Map();
		for (const c of commands) {
			const list = byCategory.get(c.category) ?? [];
			list.push(c.id);
			byCategory.set(c.category, list);
		}
		for (const list of byCategory.values()) for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) addLink(`cmd:${list[i]}`, `cmd:${list[j]}`, 70);
		const cmdByToken = /* @__PURE__ */ new Map();
		for (const c of commands) for (const t of `${c.title} ${c.description}`.toLowerCase().match(/[a-z0-9]{4,}/g) ?? []) {
			const list = cmdByToken.get(t) ?? [];
			list.push(c.id);
			cmdByToken.set(t, list);
		}
		for (const r of resources) {
			const hay = `${r.name} ${r.category} ${(r.tags ?? []).join(" ")}`.toLowerCase();
			const hits = /* @__PURE__ */ new Set();
			for (const t of hay.match(/[a-z0-9]{4,}/g) ?? []) {
				for (const cid of cmdByToken.get(t) ?? []) {
					if (hits.size >= 3) break;
					hits.add(cid);
				}
				if (hits.size >= 3) break;
			}
			for (const cid of hits) addLink(`res:${r.id}`, `cmd:${cid}`, 95);
		}
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
		const count = nodeList.length;
		for (let i = 0; i < count; i++) {
			const ang = i / Math.max(1, count) * Math.PI * 2;
			nodeList[i].x = Math.cos(ang) * 40 + (Math.random() - .5) * 60;
			nodeList[i].y = Math.sin(ang) * 40 + (Math.random() - .5) * 60;
		}
		const nb = /* @__PURE__ */ new Map();
		for (const l of linkList) {
			if (!nb.has(l.a)) nb.set(l.a, /* @__PURE__ */ new Set());
			if (!nb.has(l.b)) nb.set(l.b, /* @__PURE__ */ new Set());
			nb.get(l.a).add(l.b);
			nb.get(l.b).add(l.a);
		}
		return {
			nodes: nodeList,
			links: linkList,
			neighbors: nb
		};
	}, [favorites, journal]);
	const showAll = activeKinds.has("all");
	const isVisible = (0, import_react.useCallback)((n) => (showAll || activeKinds.has(n.kind)) && (!query.trim() || n.label.toLowerCase().includes(query.trim().toLowerCase()) || n.sub.toLowerCase().includes(query.trim().toLowerCase())), [
		activeKinds,
		query,
		showAll
	]);
	const { visibleNodes, visibleLinks } = (0, import_react.useMemo)(() => {
		const vn = nodes.filter(isVisible);
		const ids = new Set(vn.map((n) => n.id));
		return {
			visibleNodes: vn,
			visibleLinks: links.filter((l) => ids.has(l.a) && ids.has(l.b))
		};
	}, [
		nodes,
		links,
		isVisible
	]);
	(0, import_react.useEffect)(() => {
		const el = wrapRef.current;
		if (!el) return;
		const measure = () => {
			const r = el.getBoundingClientRect();
			sizeRef.current = {
				w: Math.max(320, r.width),
				h: Math.max(320, r.height)
			};
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		if (visibleNodes.length === 0) return;
		let raf = 0;
		let running = true;
		const step = () => {
			if (!running) return;
			const { w, h } = sizeRef.current;
			const cx = w / 2;
			const cy = h / 2;
			const active = visibleNodes.filter((n) => n.vx !== void 0);
			const byId = new Map(active.map((n) => [n.id, n]));
			for (let i = 0; i < active.length; i++) for (let j = i + 1; j < active.length; j++) {
				const a = active[i];
				const b = active[j];
				let dx = a.x - b.x;
				let dy = a.y - b.y;
				let d2 = dx * dx + dy * dy;
				if (d2 < .01) {
					dx = (Math.random() - .5) * 2;
					dy = (Math.random() - .5) * 2;
					d2 = dx * dx + dy * dy;
				}
				const d = Math.sqrt(d2);
				const min = (a.size + b.size) * 2.6;
				const f = d < min ? (min - d) / min * .55 : 90 / d2;
				const fx = dx / d * f;
				const fy = dy / d * f;
				if (a.vx !== void 0) {
					a.vx += fx;
					a.vy += fy;
				}
				if (b.vx !== void 0) {
					b.vx -= fx;
					b.vy -= fy;
				}
			}
			for (const l of visibleLinks) {
				const a = byId.get(l.a);
				const b = byId.get(l.b);
				if (!a || !b || a.vx === void 0 || b.vx === void 0) continue;
				let dx = b.x - a.x;
				let dy = b.y - a.y;
				const d = Math.max(.01, Math.sqrt(dx * dx + dy * dy));
				const f = (d - l.dist) * .012;
				dx /= d;
				dy /= d;
				a.vx += dx * f;
				a.vy += dy * f;
				b.vx -= dx * f;
				b.vy -= dy * f;
			}
			for (const n of active) {
				if (n.vx === void 0) continue;
				n.vx += (cx - n.x) * .002;
				n.vy += (cy - n.y) * .002;
				n.vx *= .82;
				n.vy *= .82;
				const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
				if (speed > 7) {
					n.vx = n.vx / speed * 7;
					n.vy = n.vy / speed * 7;
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
	const dragRef = (0, import_react.useRef)(null);
	const onPointerDown = (e, id) => {
		e.stopPropagation();
		dragRef.current = {
			id,
			moved: false
		};
		e.target.setPointerCapture?.(e.pointerId);
	};
	const onPointerMove = (e) => {
		const drag = dragRef.current;
		if (!drag) return;
		const rect = e.currentTarget.getBoundingClientRect();
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
	const endDrag = (e, n) => {
		const drag = dragRef.current;
		dragRef.current = null;
		if (drag && !drag.moved && n.url) window.location.href = n.url;
	};
	const isHoverActive = (n) => hovered === n.id || hovered !== null && neighbors.get(hovered)?.has(n.id);
	const resetView = () => {
		setScale(1);
		setPan({
			x: 0,
			y: 0
		});
		for (const n of nodes) {
			n.vx = 0;
			n.vy = 0;
		}
	};
	const zoom = (dir) => setScale((s) => clamp(Number((s + dir * .25).toFixed(2)), .4, 2.4));
	const count = nodes.length;
	const note = count === 0 ? "Save some commands and resources first — they'll appear here as a connected graph." : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		wide: true,
		title: "Knowledge graph",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "page-enter pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "flex items-center gap-2.5 text-2xl font-black tracking-tight text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 items-center justify-center rounded-xl bg-surface-elevated text-[18px] text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {
							className: "size-5",
							"aria-hidden": true
						})
					}), "Knowledge Graph"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: "Everything you saved on this device — commands, resources, collections and journal notes — mapped by how they connect."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Find a node…",
							className: "h-9 w-full rounded-lg border border-border bg-surface pr-3 pl-9 text-[13px] text-foreground outline-none focus:border-primary/60 min-w-[180px]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: FILTERS.map((f) => {
							const on = activeKinds.has(f.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									const next = new Set(activeKinds);
									if (f.id === "all") setActiveKinds(/* @__PURE__ */ new Set(["all"]));
									else {
										next.delete("all");
										if (on) next.delete(f.id);
										else next.add(f.id);
										if (next.size === 0) next.add("all");
										setActiveKinds(next);
									}
								},
								className: cn("rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors", on ? "bg-primary text-background" : "border border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"),
								children: f.label
							}, f.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => zoom(-1),
								"aria-label": "Zoom out",
								className: "flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "w-10 text-center font-mono text-[12px] text-muted-foreground",
								children: [Math.round(scale * 100), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => zoom(1),
								"aria-label": "Zoom in",
								className: "flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: resetView,
								className: "flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), " Reset"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground",
				children: Object.keys(KIND_COLORS).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-2.5 rounded-full",
							style: { background: KIND_COLORS[k] }
						}),
						k[0].toUpperCase() + k.slice(1),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground/50",
							children: ["· ", nodes.filter((n) => n.kind === k).length]
						})
					]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 rounded-xl border border-border bg-surface/60 p-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: wrapRef,
					className: "relative h-[62vh] min-h-[380px] w-full touch-none overflow-hidden rounded-lg bg-[rgba(10,10,15,0.35)]",
					onPointerMove,
					onPointerUp: (e) => {
						const drag = dragRef.current;
						if (!drag) return;
						const n = nodes.find((x) => x.id === drag.id);
						if (n) endDrag(e, n);
					},
					onPointerLeave: () => {
						dragRef.current = null;
					},
					children: note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center justify-center p-6 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, {
								className: "mx-auto size-8 text-muted-foreground/50",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-3 max-w-sm text-sm text-muted-foreground",
								children: note
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "secondary",
								size: "sm",
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/explore",
									children: "Find commands to save"
								})
							})
						] })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						width: "100%",
						height: "100%",
						viewBox: `0 0 ${sizeRef.current.w || 800} ${sizeRef.current.h || 600}`,
						className: "block cursor-grab",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
							transform: `translate(${sizeRef.current.w / 2 + pan.x} ${sizeRef.current.h / 2 + pan.y}) scale(${scale})`,
							children: [visibleLinks.map((l) => {
								const a = nodes.find((n) => n.id === l.a);
								const b = nodes.find((n) => n.id === l.b);
								if (!a || !b) return null;
								const dim = hovered !== null && !(hovered === l.a || hovered === l.b);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: a.x,
									y1: a.y,
									x2: b.x,
									y2: b.y,
									stroke: dim ? "rgba(48,54,61,0.18)" : "rgba(88,166,255,0.28)",
									strokeWidth: dim ? .5 : 1
								}, `${l.a}|${l.b}`);
							}), visibleNodes.map((n) => {
								const dim = hovered !== null && !isHoverActive(n);
								const match = hovered === n.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
									transform: `translate(${n.x} ${n.y})`,
									onPointerDown: (e) => onPointerDown(e, n.id),
									className: "cursor-pointer",
									onMouseEnter: () => setHovered(n.id),
									onMouseLeave: () => setHovered(null),
									opacity: dim ? .28 : 1,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											r: n.size + (match ? 5 : hovered !== null && isHoverActive(n) && !match ? 2.5 : 0),
											fill: n.color,
											opacity: match ? .25 : .12
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											r: n.size,
											fill: n.color,
											opacity: match ? 1 : .9,
											stroke: "rgba(230,237,243,0.35)",
											strokeWidth: match ? 1.6 : .8
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											y: n.size + 14,
											textAnchor: "middle",
											fontSize: match ? 12 : 11,
											fill: match ? "var(--foreground, #e6edf3)" : "var(--muted-foreground, #8b949e)",
											fontWeight: match ? 700 : 500,
											children: n.label.length > 28 ? `${n.label.slice(0, 27)}…` : n.label
										})
									]
								}, n.id);
							})]
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-[11px] text-muted-foreground/70",
				children: [
					visibleNodes.length,
					" of ",
					count,
					" nodes visible · drag to move · hover to trace connections · click a node to open it"
				]
			})
		]
	});
}
//#endregion
export { GraphPage as component };
