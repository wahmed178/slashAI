/**
 * Random pick - the neal.fun / BoredButton style "take me somewhere fun"
 * picker. Builds one pool from every SlashKits tool and SlashPlay game and
 * guarantees the destination is a real, working route (both catalogs are
 * kept 1:1 with the route tree).
 */

import { ALL_SLASH_TOOLS } from "./slashkits";
import { ALL_PLAY_GAMES } from "./slashplay";

export interface RandomPick {
  path: string;
  name: string;
  desc: string;
  icon: string;
  kind: "tool" | "game";
}

function buildPool(): RandomPick[] {
  const pool: RandomPick[] = [];
  for (const t of ALL_SLASH_TOOLS) {
    pool.push({
      path: t.hub ? t.slug : `/tools/${t.slug}`,
      name: t.name,
      desc: t.desc,
      icon: t.icon,
      kind: "tool",
    });
  }
  for (const g of ALL_PLAY_GAMES) {
    pool.push({
      path: `/play/${g.slug}`,
      name: g.name,
      desc: g.desc,
      icon: g.icon,
      kind: "game",
    });
  }
  return pool.filter((p) => Boolean(p.path));
}

const POOL = buildPool();

/** how many destinations the random picker can land on */
export const RANDOM_POOL_SIZE = POOL.length;

/** picks a random destination, optionally excluding one path (e.g. where you are) */
export function pickRandom(excludePath?: string): RandomPick {
  const candidates = excludePath ? POOL.filter((p) => p.path !== excludePath) : POOL;
  const list = candidates.length > 0 ? candidates : POOL;
  return list[Math.floor(Math.random() * list.length)]!;
}

/** several distinct picks for a teaser list (used by the /random page) */
export function pickSeveral(count: number, excludePath?: string): RandomPick[] {
  const seen = new Set<string>();
  const out: RandomPick[] = [];
  for (let i = 0; i < count * 8 && out.length < count; i++) {
    const pick = pickRandom(excludePath);
    if (!seen.has(pick.path)) {
      seen.add(pick.path);
      out.push(pick);
    }
  }
  return out;
}
