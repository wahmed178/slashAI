/**
 * The drawn bouquet. Shared by the builder (/tools/bouquet) and the
 * bouquet-only share page (/tools/bouquet/$code), so both render identically.
 *
 * IMPORTANT: nothing here may rely on CSS transforms. A CSS `transform`
 * silently overrides the SVG `transform` attribute in the browser while being
 * absent from the exported file, which once made the preview and the download
 * disagree. Motion here is opacity only, and the export stamps `bq-static`.
 */
import { useMemo } from "react";
import {
  PAPER_COLORS,
  RIBBON_COLORS,
  TIE,
  byDepth,
  greenery,
  layout,
  shade,
  type Bouquet,
  type Flower,
  type PlacedStem,
} from "@/lib/bouquet";

/** how far back in the bunch a stem sits, used to dull the ones behind */
const FADE = 0.3;

/** a ring of petals around the head centre */
function petalRing(n: number, len: number, wide: number, fill: string, opacity = 1) {
  return Array.from({ length: n }).map((_, i) => {
    const a = (i / n) * 360;
    return (
      <ellipse
        key={a}
        cx="0"
        cy={-len * 0.52}
        rx={wide}
        ry={len}
        fill={fill}
        opacity={opacity}
        transform={`rotate(${a})`}
      />
    );
  });
}

function Bloom({
  flower,
  petal,
  core,
  scale = 1,
  delay = 0,
}: {
  flower: Flower;
  petal: string;
  core: string;
  scale?: number;
  delay?: number;
}) {
  const body = (() => {
    switch (flower.form) {
      case "rosette":
        return (
          <>
            {petalRing(flower.petals, 26, 13, shade(petal, -0.08))}
            {petalRing(flower.petals, 18, 10, petal)}
            {petalRing(Math.max(4, flower.petals - 3), 10, 7, shade(petal, 0.12))}
            <circle r="5" fill={core} />
          </>
        );
      case "cup":
        return (
          <>
            <path d="M-15 6 C -17 -12, -10 -22, 0 -22 C 10 -22, 17 -12, 15 6 Z" fill={petal} />
            <path
              d="M0 6 C -9 4, -14 -6, -12 -17 C -5 -14, 0 -8, 0 4 Z"
              fill={shade(petal, -0.1)}
            />
            <path d="M0 6 C 9 4, 14 -6, 12 -17 C 5 -14, 0 -8, 0 4 Z" fill={shade(petal, 0.1)} />
            <ellipse cx="0" cy="-17" rx="7" ry="5" fill={core} />
          </>
        );
      case "rays": {
        const long = flower.petals >= 14;
        return (
          <>
            {petalRing(flower.petals, long ? 26 : 22, long ? 6 : 8, petal)}
            {petalRing(flower.petals, long ? 15 : 13, 5, shade(petal, 0.1))}
            <circle r={long ? 11 : 7} fill={core} />
            <circle r={long ? 7 : 4} fill={shade(core, -0.18)} />
          </>
        );
      }
      case "spike":
        return (
          <>
            {petalRing(flower.petals, 22, 5.5, petal, 0.95)}
            <rect x="-2.5" y="-24" width="5" height="26" rx="2.5" fill={shade(petal, -0.14)} />
          </>
        );
      case "star":
        return (
          <>
            {petalRing(flower.petals, 27, 9, petal)}
            {petalRing(flower.petals, 16, 6, shade(petal, 0.14), 0.9)}
            <circle r="4.5" fill={core} />
          </>
        );
      case "wide":
        return (
          <>
            {petalRing(flower.petals, 27, 15, petal)}
            <circle r="4" fill={core} />
            <rect x="-1.5" y="-34" width="3" height="12" rx="1.5" fill={shade(core, -0.1)} />
            <circle cx="0" cy="-35" r="2.5" fill={core} />
          </>
        );
    }
  })();

  return (
    <g transform={`scale(${scale})`}>
      {/* stem + leaves, drawn unrotated so it always hangs downward */}
      <path
        d="M0 0 C 5 34, -5 66, 0 96"
        stroke={flower.leaf}
        strokeWidth="3.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M1 52 C -13 45, -22 54, -20 66 C -9 69, -1 62, 1 55 Z"
        fill={flower.leaf}
        opacity="0.9"
      />
      <path
        d="M0 70 C 14 63, 23 72, 21 84 C 10 87, 2 80, 0 73 Z"
        fill={flower.leaf}
        opacity="0.9"
      />
      {/* the head itself fades in — opacity only, so the export always matches */}
      <g style={{ animation: `bq-in 620ms ease-out ${delay}ms both` }}>{body}</g>
    </g>
  );
}

/** a filler sprig — a stem with a few leaves */
function Sprig({
  x,
  y,
  rotation,
  scale,
  depth,
}: {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  depth: number;
}) {
  const leaf = shade("#15803d", -0.1 - FADE * (1 - depth));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
      <path
        d="M0 0 C 4 30, -4 58, 0 84"
        stroke={leaf}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="-11" cy="40" rx="12" ry="7" fill={leaf} transform="rotate(-22 -11 40)" />
      <ellipse cx="11" cy="56" rx="12" ry="7" fill={leaf} transform="rotate(22 11 56)" />
      <ellipse
        cx="-8"
        cy="70"
        rx="9"
        ry="5"
        fill={shade(leaf, 0.1)}
        transform="rotate(-18 -8 70)"
      />
    </g>
  );
}

/** the little white filler flowers */
function Breath({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#f8fafc" opacity="0.92">
      <circle cx="0" cy="0" r="3.4" />
      <circle cx="-6" cy="-5" r="2.6" />
      <circle cx="6" cy="-4" r="2.4" />
      <circle cx="-2" cy="-10" r="2.2" />
      <circle cx="5" cy="-11" r="2" />
    </g>
  );
}

function Wrap({ bouquet }: { bouquet: Bouquet }) {
  const paper = PAPER_COLORS.find((p) => p.id === bouquet.paper) ?? PAPER_COLORS[0]!;
  const ribbon = RIBBON_COLORS.find((r) => r.id === bouquet.ribbon) ?? RIBBON_COLORS[0]!;
  const outer = bouquet.mono ? "#e5e7eb" : paper.wrap;
  const inner = bouquet.mono ? "#f9fafb" : paper.bg;
  const tie = bouquet.mono ? "#111827" : ribbon.value;
  const gradId = "bq-paper";

  // cone = wide flared top, tall = narrow, round = softly curved
  const shape =
    bouquet.wrap === "tall"
      ? "M92 210 L228 210 L208 330 L112 330 Z"
      : bouquet.wrap === "round"
        ? "M74 212 L246 212 L206 330 L114 330 Z"
        : "M82 210 L238 210 L200 330 L120 330 Z";

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={inner} />
          <stop offset="100%" stopColor={outer} />
        </linearGradient>
      </defs>
      <path d={shape} fill={`url(#${gradId})`} />
      {/* folded-over top edge, so it reads as paper and not a solid block */}
      <path d={shape.replace(/210/, "232")} fill={outer} opacity="0.55" />
      <path
        d="M74 226 Q160 246 246 226"
        fill="none"
        stroke={bouquet.mono ? "#9ca3af" : "#ffffff"}
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path
        d="M160 232 L200 330"
        stroke={bouquet.mono ? "#9ca3af" : shade(paper.wrap, -0.12)}
        strokeWidth="1.2"
        opacity="0.5"
        fill="none"
      />

      {bouquet.bow === "classic" && (
        <g>
          <path d="M160 246 C 138 232, 120 240, 126 252 C 132 262, 148 256, 160 246 Z" fill={tie} />
          <path
            d="M160 246 C 182 232, 200 240, 194 252 C 188 262, 172 256, 160 246 Z"
            fill={shade(tie, -0.12)}
          />
          <rect x="150" y="240" width="20" height="13" rx="4" fill={shade(tie, 0.12)} />
          <path d="M154 252 L146 274 L158 268 L164 276 Z" fill={shade(tie, -0.06)} />
          <path d="M166 252 L174 274 L162 268 L156 276 Z" fill={tie} />
        </g>
      )}
      {bouquet.bow === "knot" && (
        <g>
          <rect x="142" y="240" width="36" height="14" rx="5" fill={tie} />
          <circle cx="160" cy="247" r="7" fill={shade(tie, 0.14)} />
        </g>
      )}
      {bouquet.bow === "twine" && (
        <g
          stroke={bouquet.mono ? "#111827" : "#a16207"}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M124 244 Q160 256 196 244" />
          <path d="M124 252 Q160 264 196 252" />
        </g>
      )}
    </g>
  );
}

export function BouquetArt({ bouquet, idSuffix }: { bouquet: Bouquet; idSuffix: string }) {
  const stems = useMemo(() => byDepth(layout(bouquet)), [bouquet]);
  const leaves = useMemo(
    () => greenery(bouquet, Math.min(14, Math.ceil(stems.length * 0.8))),
    [bouquet, stems.length],
  );
  const paper = PAPER_COLORS.find((p) => p.id === bouquet.paper) ?? PAPER_COLORS[0]!;
  const ordered = useMemo(() => [...leaves].sort((a, b) => a.depth - b.depth), [leaves]);

  return (
    <svg viewBox="0 0 320 340" role="img" aria-label="A digital bouquet" className="h-auto w-full">
      <defs>
        <radialGradient id={`bg-${idSuffix}`} cx="50%" cy="38%" r="72%">
          <stop offset="0%" stopColor={bouquet.mono ? "#fafafa" : paper.bg} stopOpacity="0.55" />
          <stop offset="100%" stopColor={bouquet.mono ? "#ffffff" : paper.bg} stopOpacity="0" />
        </radialGradient>
        {/* The keyframes live inside the SVG, so the exported file carries the
            same rule. `.bq-static` is stamped on the clone we serialise, which
            forces every bloom to full opacity — an export can never catch a
            stem mid-fade and save a blank bouquet. */}
        <style>{`@keyframes bq-in{from{opacity:0}to{opacity:1}}.bq-static [style]{animation:none!important;opacity:1!important}`}</style>
      </defs>
      <ellipse cx="160" cy="150" rx="150" ry="140" fill={`url(#bg-${idSuffix})`} />

      {/* back of the bunch first, front last */}
      {ordered.map((g, i) => (
        <Sprig key={`leaf-${i}`} {...g} />
      ))}

      {bouquet.breath &&
        ordered.map((g, i) => (
          <Breath
            key={`breath-${i}`}
            x={g.x + 6}
            y={g.y + 14}
            scale={0.7 + (1 - Math.abs(g.x - TIE.x) / 120) * 0.5}
          />
        ))}

      {stems.map((s: PlacedStem, i) => {
        // blooms further back are dimmer, which is what sells the depth
        const petal = bouquet.mono ? "#f9fafb" : shade(s.tone.petal, -FADE * (1 - s.depth));
        const core = bouquet.mono ? "#111827" : s.tone.core;
        return (
          <g
            key={`${s.flower.id}-${i}`}
            transform={`translate(${s.x} ${s.y}) rotate(${s.rotation})`}
          >
            <Bloom
              flower={bouquet.mono ? { ...s.flower, leaf: "#374151" } : s.flower}
              petal={petal}
              core={core}
              scale={s.scale}
              delay={s.delay}
            />
          </g>
        );
      })}

      <Wrap bouquet={bouquet} />
    </svg>
  );
}
