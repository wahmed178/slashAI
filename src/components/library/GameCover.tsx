/**
 * Cartridge label art for a game.
 *
 * Drawn rather than uploaded: 96 generated image files would be dead weight and
 * most games have no artwork anywhere. The colours and pattern come from the
 * slug (see lib/gameboy), so every game has a stable, recognisable label that
 * works offline, in the PWA and in the Android shell.
 *
 * If a game ever gets a real cover, pass `src` and it is used instead.
 */
import { coverPalette, coverPattern } from "@/lib/gameboy";
import { getPlayGame } from "@/lib/slashplay";

export function GameCover({
  slug,
  src,
  className = "",
  radius = 10,
}: {
  slug: string;
  /** optional real artwork, when a game has one */
  src?: string;
  className?: string;
  radius?: number;
}) {
  const pal = coverPalette(slug);
  const game = getPlayGame(slug);
  const pattern = coverPattern(slug);
  const name = game?.name ?? slug;
  const icon = game?.icon ?? "🎮";
  const id = `cov-${slug}`;

  if (src) {
    return (
      <img
        src={src}
        alt={`${name} cover`}
        className={`block h-full w-full object-cover ${className}`}
        style={{ borderRadius: radius }}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 120 90"
      role="img"
      aria-label={`${name} cover`}
      className={`block h-full w-full ${className}`}
      style={{ borderRadius: radius }}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={pal.bg} />
          <stop offset="100%" stopColor={pal.band} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect x="0" y="0" width="120" height="90" rx={radius} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-clip)`}>
        <rect width="120" height="90" fill={`url(#${id}-bg)`} />

        {/* one of four repeating motifs, chosen by the slug */}
        {pattern === 0 && (
          <g fill={pal.accent} opacity="0.22">
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={i} cx={12 + i * 16} cy={-6 + (i % 3) * 26} r="9" />
            ))}
          </g>
        )}
        {pattern === 1 && (
          <g stroke={pal.accent} strokeWidth="5" opacity="0.2" strokeLinecap="round">
            {Array.from({ length: 7 }).map((_, i) => (
              <path key={i} d={`M-10 ${8 + i * 14} L130 ${-6 + i * 14}`} />
            ))}
          </g>
        )}
        {pattern === 2 && (
          <g fill={pal.ink} opacity="0.14">
            {Array.from({ length: 24 }).map((_, i) => (
              <rect
                key={i}
                x={(i % 6) * 22}
                y={Math.floor(i / 6) * 24}
                width="12"
                height="12"
                rx="3"
              />
            ))}
          </g>
        )}
        {pattern === 3 && (
          <g stroke={pal.ink} strokeWidth="3" fill="none" opacity="0.18">
            {Array.from({ length: 5 }).map((_, i) => (
              <path key={i} d={`M0 ${i * 24} L60 ${i * 24 - 20} L120 ${i * 24}`} />
            ))}
          </g>
        )}

        {/* title band */}
        <rect x="0" y="58" width="120" height="32" fill={pal.band} opacity="0.92" />
        <rect x="0" y="58" width="120" height="2" fill={pal.accent} opacity="0.8" />

        <text
          x="60"
          y="20"
          textAnchor="middle"
          fontSize="30"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {icon}
        </text>
        <text
          x="60"
          y="75"
          textAnchor="middle"
          fontSize={name.length > 15 ? 8 : name.length > 11 ? 9.5 : 11}
          fontWeight="800"
          fill={pal.ink}
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {name.length > 20 ? `${name.slice(0, 19)}…` : name}
        </text>
        <text
          x="60"
          y="86"
          textAnchor="middle"
          fontSize="6"
          letterSpacing="1.5"
          fill={pal.ink}
          opacity="0.75"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          SLASHPLAY
        </text>
      </g>
    </svg>
  );
}
