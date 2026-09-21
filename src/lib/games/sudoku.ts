/**
 * Sudoku engine.
 *
 * Puzzles are generated in the browser: a complete random grid is built with
 * backtracking, then clues are removed one at a time and kept only when a
 * counting solver still finds exactly one solution. That guarantee is what
 * stops a player being asked to solve an ambiguous board.
 */

export const DIFFICULTY = { Easy: 40, Medium: 48, Hard: 53, Expert: 57 } as const;
export type Level = keyof typeof DIFFICULTY;

/** 81 cells, 0 meaning empty */
export type Grid = number[];

export const clone = (g: Grid): Grid => [...g];

export function boxStart(i: number): { r: number; c: number } {
  const r = Math.floor(i / 9);
  const c = i % 9;
  return { r: Math.floor(r / 3) * 3, c: Math.floor(c / 3) * 3 };
}

export function canPlace(g: Grid, i: number, v: number): boolean {
  const r = Math.floor(i / 9);
  const c = i % 9;
  for (let k = 0; k < 9; k++) {
    if (g[r * 9 + k] === v) return false;
    if (g[k * 9 + c] === v) return false;
  }
  const { r: br, c: bc } = boxStart(i);
  for (let dr = 0; dr < 3; dr++) {
    for (let dc = 0; dc < 3; dc++) {
      if (g[(br + dr) * 9 + bc + dc] === v) return false;
    }
  }
  return true;
}

/** fill a blank grid with a random complete solution */
export function generateSolved(): Grid {
  const g: Grid = Array(81).fill(0);
  const fill = (pos: number): boolean => {
    if (pos === 81) return true;
    if (g[pos] !== 0) return fill(pos + 1);
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = nums[i]!;
      nums[i] = nums[j]!;
      nums[j] = t;
    }
    for (const v of nums) {
      if (canPlace(g, pos, v)) {
        g[pos] = v;
        if (fill(pos + 1)) return true;
        g[pos] = 0;
      }
    }
    return false;
  };
  fill(0);
  return g;
}

/** count solutions, stopping as soon as we know there is more than one */
export function countSolutions(g: Grid, limit = 2): number {
  let found = 0;
  const work = clone(g);
  const search = (): void => {
    if (found >= limit) return;
    let best = -1;
    let bestOptions: number[] | null = null;
    for (let i = 0; i < 81; i++) {
      if (work[i] !== 0) continue;
      const options: number[] = [];
      for (let v = 1; v <= 9; v++) if (canPlace(work, i, v)) options.push(v);
      if (options.length === 0) return;
      if (!bestOptions || options.length < bestOptions.length) {
        best = i;
        bestOptions = options;
        if (options.length === 1) break;
      }
    }
    if (best === -1) {
      found += 1;
      return;
    }
    for (const v of bestOptions!) {
      work[best] = v;
      search();
      work[best] = 0;
      if (found >= limit) return;
    }
  };
  search();
  return found;
}

/** a puzzle with exactly one solution, plus that solution */
export function makePuzzle(level: Level): { puzzle: Grid; solution: Grid } {
  const solution = generateSolved();
  const puzzle = clone(solution);
  const order = Array.from({ length: 81 }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = order[i]!;
    order[i] = order[j]!;
    order[j] = t;
  }
  let removed = 0;
  const target = DIFFICULTY[level];
  for (const i of order) {
    if (removed >= target) break;
    const backup = puzzle[i]!;
    puzzle[i] = 0;
    if (countSolutions(puzzle) !== 1) puzzle[i] = backup;
    else removed += 1;
  }
  return { puzzle, solution };
}

/** true when a completed grid breaks no row, column or box rule */
export function isValidSolution(g: Grid): boolean {
  const unit = (cells: number[]) => new Set(cells.map((i) => g[i])).size === 9 && cells.every((i) => g[i]! >= 1 && g[i]! <= 9);
  for (let r = 0; r < 9; r++) if (!unit(Array.from({ length: 9 }, (_, c) => r * 9 + c))) return false;
  for (let c = 0; c < 9; c++) if (!unit(Array.from({ length: 9 }, (_, r) => r * 9 + c))) return false;
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const cells: number[] = [];
      for (let dr = 0; dr < 3; dr++) for (let dc = 0; dc < 3; dc++) cells.push((br * 3 + dr) * 9 + bc * 3 + dc);
      if (!unit(cells)) return false;
    }
  }
  return true;
}
