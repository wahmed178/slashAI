/**
 * Snake — pure rules.
 *
 * Kept separate from the route so the movement, wrap and collision rules can be
 * tested directly (the same split the other games in this folder use).
 *
 * The board wraps: running into an edge takes you out the opposite side rather
 * than killing you, which is how most modern Snake plays. Only running into
 * yourself is fatal.
 */

export const SIZE = 19;

export interface Pt {
  x: number;
  y: number;
}

export type Dir = "up" | "down" | "left" | "right";

export const DELTA: Record<Dir, Pt> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

/** a turn is illegal only if it reverses straight back into the neck */
export function turn(current: Dir, next: Dir): Dir {
  return next === OPPOSITE[current] ? current : next;
}

/** fold a coordinate back onto the board, so the snake exits one side and
 *  reappears on the other */
export function wrap(v: number): number {
  return ((v % SIZE) + SIZE) % SIZE;
}

export function startSnake(): Pt[] {
  return [
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
    { x: 6, y: 9 },
  ];
}

export function step(body: Pt[], dir: Dir): Pt {
  const head = body[0]!;
  const d = DELTA[dir];
  return { x: wrap(head.x + d.x), y: wrap(head.y + d.y) };
}

/**
 * Does the head land on the body? The tail cell is exempt on the tick the
 * snake moves off it — standard, and it stops the game killing you when you
 * chase your own tail through a tight corner.
 */
export function collides(body: Pt[], next: Pt): boolean {
  const moving = body.slice(0, Math.max(0, body.length - 1));
  return moving.some((s) => s.x === next.x && s.y === next.y);
}

/** pick an empty cell; null means the board is full and the player has won */
export function spawnFood(body: Pt[]): Pt | null {
  const free: Pt[] = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (!body.some((s) => s.x === x && s.y === y)) free.push({ x, y });
    }
  }
  if (free.length === 0) return null;
  return free[Math.floor(Math.random() * free.length)]!;
}

export interface Tick {
  body: Pt[];
  food: Pt | null;
  dead: boolean;
  won: boolean;
}

export function advance(body: Pt[], dir: Dir, food: Pt | null): Tick {
  const next = step(body, dir);
  if (collides(body, next)) return { body, food, dead: true, won: false };

  const grew = food !== null && next.x === food.x && next.y === food.y;
  const nb = [next, ...body];
  if (!grew) nb.pop();
  const nextFood = grew ? spawnFood(nb) : food;
  return { body: nb, food: nextFood, dead: false, won: nextFood === null };
}

export function scoreOf(body: Pt[]): number {
  return Math.max(0, body.length - 4);
}
