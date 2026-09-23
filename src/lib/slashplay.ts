/**
 * SlashPlay - the games catalogue. Single source of truth for the
 * /play hub, homepage previews and breadcrumbs.
 *
 * Rules for this file:
 * - No duplicate games. Each slug appears once.
 * - Every game links to a real route under /play/<slug>.
 * - Descriptions describe exactly what the game does.
 * - All games run fully in the browser (no downloads, works offline).
 *   Multiplayer means pass-and-play on one device.
 */

export type Players = "Solo" | "2P" | "2P + AI" | "Solo + 2P";

/** How demanding a game is to pick up. */
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface PlayGame {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  players: Players;
  /**
   * ISO date the game shipped. Items added within `NEW_WINDOW_DAYS`
   * (see lib/ux) get the 🆕 badge, so the badge ages out on its own.
   */
  added?: string;
}

export interface PlaySection {
  title: string;
  icon: string;
  games: PlayGame[];
}

export const PLAY_SECTIONS: PlaySection[] = [
  {
    title: "Multiplayer",
    icon: "🎯",
    games: [
      { slug: "cricket", name: "Cricket", desc: "Time your shots, hit sixes, chase targets - solo, vs AI or 2P", icon: "🏏", players: "Solo + 2P" },
      { slug: "tic-tac-toe", name: "Tic Tac Toe", desc: "Classic 3x3 - play a friend or the unbeatable AI", icon: "❌", players: "2P + AI" },
      { slug: "connect-four", name: "Connect Four", desc: "Drop discs, line up four - friend or AI", icon: "🔴", players: "2P + AI" },
      { slug: "dots-boxes", name: "Dots and Boxes", desc: "Draw lines, claim boxes, outscore your rival", icon: "🔗", players: "2P" },
      { slug: "battleship", name: "Battleship", desc: "Place your fleet, hunt and sink ships", icon: "🚢", players: "2P" },
      { slug: "dice-duel", name: "Dice Duel", desc: "Push-your-luck Pig dice - first to 100 wins", icon: "🎲", players: "2P" },
      { slug: "checkers", name: "Checkers", desc: "Jump, capture and crown kings - friend or AI", icon: "⚫", players: "2P + AI" },
      { slug: "reversi", name: "Reversi", desc: "Flip discs to dominate the 8x8 board - friend or AI", icon: "🔵", players: "2P + AI" },
      { slug: "snakes-ladders", name: "Snakes and Ladders", desc: "Roll the dice, climb ladders, dodge snakes", icon: "🪜", players: "2P" },
      { slug: "math-duel", name: "Math Duel", desc: "Race a friend to tap the right answer first", icon: "➗", players: "2P" },
      { slug: "ludo", name: "Ludo", desc: "Classic race home - capture, safe squares, exact rolls to finish", icon: "🎲", players: "Solo + 2P", added: "2026-09-23" },
      { slug: "eight-ball", name: "8-Ball Pool", desc: "Real billiards physics - pot your set then the black, 2P", icon: "🎱", players: "2P", added: "2026-09-23" },
      { slug: "hand-cricket", name: "Hand Cricket", desc: "Schoolyard classic - match fingers to get the batter out", icon: "🤚", players: "Solo + 2P", added: "2026-09-23" },
      { slug: "word-chain", name: "Word Chain", desc: "Shiritori - chain words on the last letter before the clock dies", icon: "🔗", players: "Solo + 2P", added: "2026-09-23" },
      { slug: "tambola", name: "Tambola", desc: "90-ball housie vs AI players - lines, Early Five, Full House", icon: "🎟️", players: "Solo", added: "2026-09-23" },
    ],
  },
  {
    title: "Sports",
    icon: "🏅",
    games: [
      { slug: "table-tennis", name: "Table Tennis", desc: "Top-down table, real 11-point scoring - beat the AI or a friend", icon: "🏓", players: "Solo + 2P", added: "2026-09-21" },
      { slug: "air-hockey", name: "Air Hockey", desc: "Smash the puck past the AI mallet - first to seven", icon: "🏒", players: "Solo", added: "2026-09-21" },
      { slug: "penalty-shootout", name: "Penalty Shootout", desc: "Five penalties each way: you shoot, then you dive", icon: "⚽", players: "Solo", added: "2026-09-21" },
      { slug: "darts", name: "Darts", desc: "Real 501 board with trebles, doubles and busts", icon: "🎯", players: "Solo", added: "2026-09-21" },
      { slug: "basketball", name: "Basketball", desc: "Sixty seconds of shooting - timing and streaks", icon: "🏀", players: "Solo", added: "2026-09-21" },
      { slug: "bowling", name: "Bowling", desc: "Ten frames, two balls, real strike and spare scoring", icon: "🎳", players: "Solo", added: "2026-09-21" },
      { slug: "cricket-bowling", name: "Cricket Bowling", desc: "Doodle-style bowling - stop the timing arc to beat the batter", icon: "🏏", players: "Solo", added: "2026-09-23" },
      { slug: "volleyball", name: "Volleyball", desc: "Beach rally vs AI - don't let it bounce twice on your side", icon: "🏐", players: "Solo", added: "2026-09-23" },
      { slug: "archery", name: "Archery", desc: "10 arrows at a real ring target - breathing sway and wind drift", icon: "🏹", players: "Solo", added: "2026-09-23" },
      { slug: "mini-golf", name: "Mini Golf", desc: "9 hand-built holes with sand, water and real pars", icon: "⛳", players: "Solo", added: "2026-09-23" },
      { slug: "carrom", name: "Carrom", desc: "Slingshot the striker, pot your coins and cover the queen", icon: "🪙", players: "Solo", added: "2026-09-23" },
    ],
  },
  {
    title: "Card Games",
    icon: "🃏",
    games: [
      { slug: "blackjack", name: "Blackjack", desc: "Hit, stand, double down against the dealer", icon: "♠️", players: "Solo" },
      { slug: "go-fish", name: "Go Fish", desc: "Collect books of four in this classic card duel", icon: "🐟", players: "2P" },
      { slug: "memory-match", name: "Memory Match", desc: "Flip and pair emojis - solo or face-off", icon: "🧩", players: "Solo + 2P" },
      { slug: "higher-lower", name: "Higher or Lower", desc: "Will the next card be higher or lower? Build a streak", icon: "📈", players: "Solo" },
    ],
  },
  {
    title: "Arcade",
    icon: "👾",
    games: [
      { slug: "snake", name: "Snake", desc: "Eat, grow, survive - classic arcade action", icon: "🐍", players: "Solo" },
      { slug: "2048", name: "2048", desc: "Swipe and merge tiles to reach 2048", icon: "🔢", players: "Solo" },
      { slug: "minesweeper", name: "Minesweeper", desc: "Clear the field without hitting a mine", icon: "💣", players: "Solo" },
      { slug: "pong", name: "Pong", desc: "Retro paddle duel - vs AI or a friend", icon: "🏓", players: "Solo + 2P" },
      { slug: "breakout", name: "Breakout", desc: "Smash every brick without losing your ball", icon: "🧱", players: "Solo" },
      { slug: "sky-dash", name: "Sky Dash", desc: "Tap to fly through pipe gaps - how far can you go?", icon: "🐦", players: "Solo" },
      { slug: "bird-hunter", name: "Bird Hunter", desc: "Duck-hunt: tap flying ducks across speeding waves - 3 misses and out", icon: "🦆", players: "Solo", added: "2026-09-23" },
      { slug: "bubbles-shooter", name: "Bubbles Shooter", desc: "Match 3+ bubbles to pop, drop floaters, survive the creeping ceiling", icon: "🫧", players: "Solo", added: "2026-09-23" },
      { slug: "stack", name: "Stack", desc: "Drop sliding blocks - overhang gets sliced, perfect drops regrow width", icon: "🏗️", players: "Solo", added: "2026-09-23" },
      { slug: "paper-toss", name: "Paper Toss", desc: "Flick paper into the bin while the fan blows it sideways", icon: "🗑️", players: "Solo", added: "2026-09-23" },
    ],
  },
  {
    title: "Word & Puzzle",
    icon: "🧩",
    games: [
      { slug: "hangman", name: "Hangman", desc: "Guess the hidden word one letter at a time", icon: "🔤", players: "Solo" },
      { slug: "word-guess", name: "Word Guess", desc: "Crack the 5-letter word in six tries", icon: "📝", players: "Solo" },
      { slug: "word-scramble", name: "Word Scramble", desc: "Unscramble common words, hint if stuck, streaks", icon: "🔀", players: "Solo" },
      { slug: "reach-24", name: "Reach 24", desc: "Combine four numbers with + − × ÷ to make 24", icon: "🎯", players: "Solo" },
      { slug: "peg-jump", name: "Peg Jump", desc: "Jump pegs, remove them, leave exactly one", icon: "🔺", players: "Solo" },
      { slug: "odd-one-out", name: "Odd One Out", desc: "Find the off-shade tile before the clock dies", icon: "🔍", players: "Solo" },
      { slug: "capitals", name: "World Capitals", desc: "Name the capital of 60+ countries, streaks", icon: "🌍", players: "Solo" },
      { slug: "word-search", name: "Word Search", desc: "Twelve themes, words hidden in eight directions", icon: "🔍", players: "Solo", added: "2026-09-21" },
    ],
  },
  {
    title: "Brain Training",
    icon: "🧠",
    games: [
      { slug: "memory-palace", name: "Memory Palace", desc: "Place items in rooms, then recall every room - method of loci", icon: "🏛️", players: "Solo", added: "2026-09-10" },
      { slug: "stroop-test", name: "Stroop Test", desc: "The 1935 psychology classic - name the ink, fight the reflex", icon: "🌈", players: "Solo" },
      { slug: "stop-the-color", name: "Stop the Color", desc: "Quick-fire Stroop - 30 seconds, most correct taps wins", icon: "🎨", players: "Solo", added: "2026-09-10" },
      { slug: "digit-span", name: "Digit Span", desc: "Digits flash once - type them back, forward or reversed", icon: "🔢", players: "Solo" },
      { slug: "schulte-table", name: "Schulte Table", desc: "Tap 1-N in order, eyes fixed on centre - pilot vision drill", icon: "🎯", players: "Solo", added: "2026-09-10" },
      { slug: "memory-matrix", name: "Memory Matrix", desc: "Memorize flashing tile patterns across progressive spatial stages", icon: "🧩", players: "Solo", added: "2026-09-18" },
      { slug: "sudoku", name: "Sudoku", desc: "Brand-new puzzles with one solution - four difficulty tiers", icon: "🧮", players: "Solo", added: "2026-09-21" },
      { slug: "sliding-puzzle", name: "Sliding Puzzle", desc: "8, 15 and 24 puzzles - every shuffle is solvable", icon: "🔢", players: "Solo", added: "2026-09-21" },
      { slug: "mastermind", name: "Mastermind", desc: "Break the hidden colour code with black and white pegs", icon: "🔐", players: "Solo", added: "2026-09-21" },
      { slug: "tower-of-hanoi", name: "Tower of Hanoi", desc: "Move the stack in 2^n-1 moves - recursion you can touch", icon: "🗼", players: "Solo", added: "2026-09-21" },
      { slug: "nonogram", name: "Nonogram", desc: "Reveal a hidden picture from run-length clues - 11 hand-drawn puzzles", icon: "🖼️", players: "Solo", added: "2026-09-21" },
      { slug: "sokoban", name: "Sokoban", desc: "Push crates onto targets across 10 verified warehouse puzzles", icon: "📦", players: "Solo", added: "2026-09-23" },
      { slug: "flow-connect", name: "Flow Connect", desc: "Paint pipes between matching dots - fill every cell without crossing", icon: "🌈", players: "Solo", added: "2026-09-23" },
      { slug: "block-fit", name: "Block Fit", desc: "Pack polyomino pieces into the board - rotate until it fits", icon: "🧱", players: "Solo", added: "2026-09-23" },
      { slug: "eight-queens", name: "Eight Queens", desc: "Place 8 queens, none attacking - the 1848 chess classic", icon: "♛", players: "Solo", added: "2026-09-23" },
      { slug: "knights-quest", name: "Knight's Quest", desc: "Knight's tour - visit every square exactly once with L-moves", icon: "♞", players: "Solo", added: "2026-09-23" },
      { slug: "takuzu", name: "Takuzu", desc: "Binary logic - no three in a line, equal counts, unique rows", icon: "⚫", players: "Solo", added: "2026-09-23" },
    ],
  },
  {
    title: "Viral & Zen",
    icon: "🔥",
    games: [
      { slug: "perfect-circle", name: "Perfect Circle", desc: "Draw a circle, get judged. Brutally. One stroke", icon: "⭕", players: "Solo" },
      { slug: "password-game", name: "The Password Game", desc: "25 escalating rules. Keep them ALL true at once", icon: "🔑", players: "Solo" },
      { slug: "kindle", name: "Kindle", desc: "Drag to spark glowing embers - a zen fireplace", icon: "🕯️", players: "Solo" },
      { slug: "guess-the-year", name: "Guess the Year", desc: "10 famous moments - how close to the real year?", icon: "📅", players: "Solo" },
      { slug: "cosmic-dive", name: "Cosmic Dive", desc: "Scroll from Earth to the edge of the universe", icon: "🌌", players: "Solo" },
      { slug: "maze-runner", name: "Maze Runner", desc: "Escape freshly generated mazes in 3 sizes", icon: "🌀", players: "Solo" },
      { slug: "tap-the-difference", name: "Tap the Difference", desc: "One tile is a shade off. Find it before time dies", icon: "🔎", players: "Solo" },
      { slug: "bounce", name: "Bounce", desc: "Stop the ball in a shrinking, speeding zone", icon: "🏀", players: "Solo" },
      { slug: "flag-guess", name: "Flag Guess", desc: "Name the country from its flag - 10 rounds", icon: "🚩", players: "Solo" },
      { slug: "would-you-rather", name: "Would You Rather", desc: "Impossible choices, pass-and-play debates", icon: "🤔", players: "2P" },
      { slug: "bubble-wrap", name: "Bubble Wrap", desc: "Pop an endless sheet. Drag to pop rows. Zen", icon: "🫧", players: "Solo" },
      { slug: "ten-seconds", name: "Ten Seconds", desc: "Stop the timer at exactly 10.00s. Pure feel", icon: "⏱️", players: "Solo" },
      { slug: "aim-trainer", name: "Aim Trainer", desc: "Pop 30 targets fast - reflexes and accuracy", icon: "🎯", players: "Solo" },
      { slug: "lights-out", name: "Lights Out", desc: "Flip cells to kill every light - classic logic", icon: "💡", players: "Solo" },
      { slug: "fake-or-fact", name: "Fake or Fact", desc: "Real claim or internet nonsense? Guess right", icon: "🧐", players: "Solo" },
      { slug: "emoji-phrase", name: "Emoji Phrase", desc: "Decode the movie or phrase hidden in emojis", icon: "🤡", players: "Solo" },
    ],
  },
  {
    title: "Quick Plays",
    icon: "⚡",
    games: [
      { slug: "rock-paper-scissors", name: "Rock Paper Scissors", desc: "Instant duel - vs AI or pass-and-play", icon: "✂️", players: "Solo + 2P" },
      { slug: "rock-paper-scissors-lizard-spock", name: "RPS Lizard Spock", desc: "5-way duel: each move beats two, loses to two", icon: "🖖", players: "Solo + 2P" },
      { slug: "simon", name: "Simon", desc: "Repeat the growing light and sound pattern", icon: "🎵", players: "Solo" },
      { slug: "whack-a-mole", name: "Whack-a-Mole", desc: "Tap the moles fast before the timer runs out", icon: "🔨", players: "Solo" },
      { slug: "reaction-test", name: "Reaction Test", desc: "Test your reflexes down to the millisecond", icon: "⚡", players: "Solo" },
      { slug: "dice", name: "Dice Roller", desc: "Roll D4-D100 for any tabletop game", icon: "🎲", players: "Solo" },
      { slug: "coin-flip", name: "Coin Flipper", desc: "Virtual coin flip with history", icon: "🪙", players: "Solo" },
      { slug: "typing-test", name: "Typing Speed Test", desc: "60-second test - WPM, accuracy, streaks", icon: "⌨️", players: "Solo" },
      { slug: "math-sprint", name: "Speed Math Sprint", desc: "60-second mental arithmetic sprint - speed and streaks", icon: "⚡", players: "Solo", added: "2026-09-18" },
      { slug: "random-number", name: "Random Number", desc: "Generate numbers in any range", icon: "🔢", players: "Solo" },
    ],
  },
];

/** all games, preserving section order */
export const ALL_PLAY_GAMES: PlayGame[] = PLAY_SECTIONS.flatMap((s) => s.games);

/** total game count (deduped - slugs are unique by rule) */
export const PLAY_GAME_COUNT = new Set(ALL_PLAY_GAMES.map((g) => g.slug)).size;

const gameBySlug = new Map(ALL_PLAY_GAMES.map((g) => [g.slug, g]));

export const getPlayGame = (slug: string | undefined) =>
  slug ? gameBySlug.get(slug) : undefined;

/** counts per mode for hub stats */
export function playModeCounts() {
  let multiplayer = 0;
  let vsAi = 0;
  let solo = 0;
  for (const g of ALL_PLAY_GAMES) {
    if (g.players === "2P + AI") {
      multiplayer++;
      vsAi++;
    } else if (g.players === "Solo + 2P") {
      multiplayer++;
      solo++;
    } else if (g.players === "2P") {
      multiplayer++;
    } else {
      solo++;
    }
  }
  return { multiplayer, vsAi, solo };
}

/* ── daily pick + surprise me ──────────────────────────────────────── */

/** day number since epoch, stable across timezones (UTC) */
function dayNumber(now = new Date()): number {
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
}

/** deterministic day-index picker shared by the daily puzzle + daily shuffle */
export function dailyPick<T>(list: readonly T[], now = new Date()): T {
  return list[dayNumber(now) % list.length]!;
}

/** 🎲 Surprise me — any game in the catalogue */
export function randomGameSlug(): string {
  return dailyPick(ALL_PLAY_GAMES).slug;
}

/* ── field trip: the useless-web, curated + explained ───────────────── */

/**
 * Field trip — a curated slice of the useless web. Every site is real and
 * free; the explainer tells you what it does before you click, which is what
 * random web-surfing buttons always miss. Filtered by mood and kid-safety.
 */
export interface FieldTripSite {
  name: string;
  url: string;
  what: string;
  group: "Curiosity" | "Create" | "Relax" | "Play" | "Learn";
  kidsOk: boolean;
}

export const FIELD_TRIP_SITES: FieldTripSite[] = [
  { name: "The Useless Web", url: "https://theuselessweb.com/", what: "A button that flings you to a random pointless-yet-delightful website", group: "Play", kidsOk: false },
  { name: "Window Swap", url: "https://window-swap.com/", what: "Look through strangers' windows from cities around the world", group: "Relax", kidsOk: true },
  { name: "Radio Garden", url: "https://radio.garden/", what: "Spin a 3D globe and tune into live radio from anywhere on Earth", group: "Learn", kidsOk: true },
  { name: "This Word Does Not Exist", url: "https://www.thisworddoesnotexist.com/", what: "An AI invents a brand-new English word and its definition", group: "Learn", kidsOk: true },
  { name: " Neal.fun", url: "https://neal.fun/", what: "A playground of clever toys: spend Bill Gates' money, scale the universe, more", group: "Play", kidsOk: true },
  { name: "Zoom Quilt", url: "https://zoomquilt.org/", what: "An endlessly zooming collaborative artwork that never repeats", group: "Relax", kidsOk: true },
  { name: "A Soft Murmur", url: "https://asoftmurmur.com/", what: "Mix rain, waves, fires and coffee-shop sounds into your own ambience", group: "Relax", kidsOk: true },
  { name: "This Is Sand", url: "https://thisissand.com/", what: "Pour digital sand into glittering layered landscapes", group: "Create", kidsOk: true },
  { name: "Quick, Draw!", url: "https://quickdraw.withgoogle.com/", what: "Google's neural net guesses your doodles in 20 seconds", group: "Play", kidsOk: true },
  { name: "Silk", url: "http://weavesilk.com/", what: "Mirror-draw glowing silky patterns with your cursor", group: "Create", kidsOk: true },
  { name: "GeoGuessr (free daily)", url: "https://www.geoguessr.com/", what: "Dropped somewhere on Earth in Street View — guess where", group: "Learn", kidsOk: true },
  { name: "Patatap", url: "https://patatap.com/", what: "Every keypress makes an animation and a musical sound", group: "Create", kidsOk: true },
  { name: "The Deep Sea", url: "https://neal.fun/deep-sea/", what: "Scroll from the surface to the Mariana Trench and meet what lives there", group: "Learn", kidsOk: true },
  { name: "Stars Chrome Experiment", url: "https://stars.chromeexperiments.com/", what: "Fly through 100,000 stars of the Milky Way in 3D", group: "Learn", kidsOk: true },
  { name: "Blob Opera", url: "https://artsandculture.google.com/experiment/blob-opera", what: "Four opera blobs sing anything you drag — machine-learned harmonies", group: "Create", kidsOk: true },
  { name: "Lines. Cat Bounce", url: "https://catbounce.net/", what: "Bouncing cats. That's it. Drag them, fling them, be happy", group: "Relax", kidsOk: true },
];

export function fieldTripSites(kidsOnly: boolean): FieldTripSite[] {
  return kidsOnly ? FIELD_TRIP_SITES.filter((s) => s.kidsOk) : FIELD_TRIP_SITES;
}

export function randomFieldTrip(): FieldTripSite {
  return FIELD_TRIP_SITES[Math.floor(Math.random() * FIELD_TRIP_SITES.length)]!;
}
/* ─────────────────────────── card metadata ───────────────────────────
 * Typical session length (minutes) and pick-up difficulty, shown on every
 * game card as "⏱ 2 min · 🎯 Easy". Kept as a lookup so the catalogue rows
 * stay short; `gameMeta()` supplies an honest fallback for anything unlisted.
 */
export interface GameMeta {
  minutes: number;
  level: Difficulty;
}

const GAME_META: Record<string, GameMeta> = {
  // Sports
  "table-tennis": { minutes: 4, level: "Medium" },
  "air-hockey": { minutes: 4, level: "Medium" },
  "penalty-shootout": { minutes: 4, level: "Easy" },
  darts: { minutes: 7, level: "Medium" },
  basketball: { minutes: 2, level: "Easy" },
  bowling: { minutes: 10, level: "Medium" },
  "cricket-bowling": { minutes: 4, level: "Medium" },
  volleyball: { minutes: 5, level: "Medium" },
  archery: { minutes: 3, level: "Medium" },
  "mini-golf": { minutes: 8, level: "Easy" },
  carrom: { minutes: 8, level: "Medium" },
  // Multiplayer
  cricket: { minutes: 3, level: "Medium" },
  "tic-tac-toe": { minutes: 1, level: "Easy" },
  "connect-four": { minutes: 3, level: "Easy" },
  "dots-boxes": { minutes: 4, level: "Easy" },
  battleship: { minutes: 6, level: "Medium" },
  "dice-duel": { minutes: 4, level: "Easy" },
  checkers: { minutes: 6, level: "Medium" },
  reversi: { minutes: 6, level: "Medium" },
  "snakes-ladders": { minutes: 5, level: "Easy" },
  "math-duel": { minutes: 2, level: "Easy" },
  ludo: { minutes: 12, level: "Easy" },
  "eight-ball": { minutes: 8, level: "Medium" },
  "hand-cricket": { minutes: 4, level: "Easy" },
  "word-chain": { minutes: 5, level: "Medium" },
  tambola: { minutes: 10, level: "Easy" },
  // Card
  blackjack: { minutes: 4, level: "Easy" },
  "go-fish": { minutes: 5, level: "Easy" },
  "memory-match": { minutes: 3, level: "Easy" },
  "higher-lower": { minutes: 2, level: "Easy" },
  // Brain boosters
  sudoku: { minutes: 9, level: "Hard" },
  "sliding-puzzle": { minutes: 6, level: "Medium" },
  mastermind: { minutes: 6, level: "Hard" },
  "tower-of-hanoi": { minutes: 5, level: "Medium" },
  "word-search": { minutes: 6, level: "Easy" },
  nonogram: { minutes: 7, level: "Hard" },
  sokoban: { minutes: 6, level: "Medium" },
  "flow-connect": { minutes: 5, level: "Medium" },
  "block-fit": { minutes: 7, level: "Hard" },
  "eight-queens": { minutes: 8, level: "Hard" },
  "knights-quest": { minutes: 7, level: "Medium" },
  takuzu: { minutes: 8, level: "Hard" },
  // Arcade
  snake: { minutes: 3, level: "Medium" },
  "2048": { minutes: 6, level: "Medium" },
  minesweeper: { minutes: 7, level: "Hard" },
  pong: { minutes: 3, level: "Medium" },
  breakout: { minutes: 4, level: "Medium" },
  "sky-dash": { minutes: 2, level: "Hard" },
  "bird-hunter": { minutes: 3, level: "Easy" },
  "bubbles-shooter": { minutes: 5, level: "Easy" },
  stack: { minutes: 3, level: "Easy" },
  "paper-toss": { minutes: 3, level: "Easy" },
  // Word & Puzzle
  hangman: { minutes: 3, level: "Easy" },
  "word-guess": { minutes: 3, level: "Medium" },
  "word-scramble": { minutes: 2, level: "Easy" },
  "reach-24": { minutes: 3, level: "Hard" },
  "peg-jump": { minutes: 4, level: "Medium" },
  "odd-one-out": { minutes: 1, level: "Easy" },
  capitals: { minutes: 3, level: "Medium" },
  // Brain training
  "memory-palace": { minutes: 5, level: "Medium" },
  "stroop-test": { minutes: 2, level: "Medium" },
  "stop-the-color": { minutes: 2, level: "Medium" },
  "digit-span": { minutes: 3, level: "Medium" },
  "schulte-table": { minutes: 2, level: "Hard" },
  // Viral & zen
  "perfect-circle": { minutes: 1, level: "Easy" },
  "password-game": { minutes: 15, level: "Hard" },
  kindle: { minutes: 2, level: "Easy" },
  "guess-the-year": { minutes: 3, level: "Medium" },
  "cosmic-dive": { minutes: 3, level: "Easy" },
  "maze-runner": { minutes: 4, level: "Medium" },
  "tap-the-difference": { minutes: 2, level: "Medium" },
  bounce: { minutes: 2, level: "Hard" },
  "flag-guess": { minutes: 3, level: "Medium" },
  "would-you-rather": { minutes: 4, level: "Easy" },
  "bubble-wrap": { minutes: 2, level: "Easy" },
  "ten-seconds": { minutes: 1, level: "Easy" },
  "aim-trainer": { minutes: 2, level: "Medium" },
  "lights-out": { minutes: 5, level: "Hard" },
  "fake-or-fact": { minutes: 3, level: "Medium" },
  "emoji-phrase": { minutes: 3, level: "Medium" },
  // Quick plays
  "rock-paper-scissors": { minutes: 1, level: "Easy" },
  "rock-paper-scissors-lizard-spock": { minutes: 1, level: "Easy" },
  simon: { minutes: 2, level: "Medium" },
  "whack-a-mole": { minutes: 2, level: "Easy" },
  "reaction-test": { minutes: 1, level: "Easy" },
  dice: { minutes: 1, level: "Easy" },
  "coin-flip": { minutes: 1, level: "Easy" },
  "typing-test": { minutes: 2, level: "Medium" },
  "random-number": { minutes: 1, level: "Easy" },
};

/** The section a game belongs to, or undefined for an unknown slug. */
export function gameSection(slug: string): PlaySection | undefined {
  return PLAY_SECTIONS.find((s) => s.games.some((g) => g.slug === slug));
}

/** Games inside the freshness window, newest first. */
export function newGames(): PlayGame[] {
  return ALL_PLAY_GAMES.filter((g) => {
    if (g.added) return true;
    return (NEW_GAME_SLUGS as readonly string[]).includes(g.slug);
  });
}

/** Session length + difficulty for a game, with a safe fallback. */
export function gameMeta(slug: string): GameMeta {
  return GAME_META[slug] ?? { minutes: 3, level: "Medium" };
}

/** Games that keep a score worth beating, so cards can show "Your best". */
export const SCORING_GAMES = new Set([
  "cricket",
  "snake",
  "2048",
  "breakout",
  "sky-dash",
  "higher-lower",
  "word-scramble",
  "capitals",
  "simon",
  "whack-a-mole",
  "typing-test",
  "reaction-test",
  "number-guess",
  "aim-trainer",
  "schulte-table",
  "digit-span",
  "flag-guess",
  "bird-hunter",
  "bubbles-shooter",
  "stack",
  "paper-toss",
  "cricket-bowling",
  "archery",
  "mini-golf",
  "word-chain",
  "sokoban",
  "flow-connect",
  "block-fit",
  "eight-queens",
  "knights-quest",
  "takuzu",
]);

/** Games listed under "New Games" at the top of /play - newest release first. */
export const NEW_GAME_SLUGS = ["schulte-table", "stop-the-color", "memory-palace"] as const;
