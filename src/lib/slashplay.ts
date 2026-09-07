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

export interface PlayGame {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  players: Players;
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
    ],
  },
  {
    title: "Word & Puzzle",
    icon: "🧠",
    games: [
      { slug: "hangman", name: "Hangman", desc: "Guess the hidden word one letter at a time", icon: "🔤", players: "Solo" },
      { slug: "word-guess", name: "Word Guess", desc: "Crack the 5-letter word in six tries", icon: "📝", players: "Solo" },
    ],
  },
  {
    title: "Quick Plays",
    icon: "⚡",
    games: [
      { slug: "rock-paper-scissors", name: "Rock Paper Scissors", desc: "Instant duel - vs AI or pass-and-play", icon: "✂️", players: "Solo + 2P" },
      { slug: "simon", name: "Simon", desc: "Repeat the growing light and sound pattern", icon: "🎵", players: "Solo" },
      { slug: "whack-a-mole", name: "Whack-a-Mole", desc: "Tap the moles fast before the timer runs out", icon: "🔨", players: "Solo" },
      { slug: "reaction-test", name: "Reaction Test", desc: "Test your reflexes down to the millisecond", icon: "⚡", players: "Solo" },
      { slug: "dice", name: "Dice Roller", desc: "Roll D4-D100 for any tabletop game", icon: "🎲", players: "Solo" },
      { slug: "coin-flip", name: "Coin Flipper", desc: "Virtual coin flip with history", icon: "🪙", players: "Solo" },
      { slug: "typing-test", name: "Typing Speed Test", desc: "60-second test - WPM, accuracy, streaks", icon: "⌨️", players: "Solo" },
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
    if (g.players === "2P" || g.players === "2P + AI") multiplayer++;
    if (g.players.includes("AI")) vsAi++;
    if (g.players !== "2P") solo++;
  }
  return { multiplayer, vsAi, solo };
}
