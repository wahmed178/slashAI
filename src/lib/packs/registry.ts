/**
 * Pack registry — turns the seed tables into hundreds of distinct, fully
 * playable game packs. SlashPlay's hand-built games stay untouched; packs are
 * additive content served through the /play/$slug dynamic route (static game
 * routes always win, so nothing existing changes).
 *
 * Every pack is real content: quiz packs are seeded draws from fact tables
 * (stable across reloads — same slug, same questions), word packs carry their
 * own word lists, memory packs carry emoji sets, and the sliding packs are the
 * classic n-puzzle including a date-seeded daily 8-puzzle.
 */
import {
  COUNTRIES,
  flagEmoji,
  SPELLING,
  OPPOSITES,
  PLURALS,
  RHYMES,
  BABIES,
  HELPERS,
  COLOUR_MIX,
  CALENDAR,
  RIDDLES,
  FESTIVALS,
  INVENTIONS,
  BOOKS,
  PLACES,
  SPACE_MISSIONS,
  BODY_FACTS,
  WORLD_FOOD,
  TECH_BRANDS,
  SPORTS_FACTS,
  GK_PACKS,
} from "./quiz-data";
import {
  WONDERS, INDIA_GK, SCIENCE_GK, CULTURE_GK, SPORTS_GK, MOVIES_GK, MUSIC_GK,
  GAMES_GK, RIDDLE_PACK, FLAGS_GK, MYTHOLOGY_GK, SPACE_GK, TECH_GK, FOOD_GK,
  GEO_GK, HISTORY_GK, CRICKET_GK, BRANDS_GK,
} from "./quiz-facts";

type Row = [string, string, string, string, string]; // [question, answer, wrong1, wrong2, wrong3]

export type PackKind = "quiz" | "scramble" | "hangman" | "memory" | "emoji" | "wouldyourather" | "sliding";
export type PackGroup = "Quiz Packs" | "Word Play" | "Kids Corner" | "Puzzles" | "Party";

export interface Pack {
  slug: string;
  name: string;
  kind: PackKind;
  group: PackGroup;
  desc: string;
  icon: string;
  kids?: boolean | undefined;
  /** quiz rounds */
  rows?: Row[];
  /** scramble/hangman words */
  words?: string[];
  /** memory: emoji faces, one per tile pair */
  emojis?: string[];
  /** emoji phrases: [emoji string, phrase] */
  phrases?: [string, string][];
  /** would-you-rather: [option A, option B] */
  choices?: [string, string][];
  /** sliding puzzle side lengths */
  sizes?: number[];
  /** sliding: date-seeded daily shuffle */
  daily?: boolean;
  /** scramble/hangman hint line */
  hint?: string;
  minutes: number;
}

/* ─────────────────────────── deterministic RNG ─────────────────────── */

export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** stable shuffle */
export function seededShuffle<T>(list: readonly T[], rng: () => number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/* ─────────────────────────── helpers ───────────────────────────────── */

const chunk = <T,>(list: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  // merge a small tail into the previous chunk so no pack is a stub
  if (out.length > 1 && out[out.length - 1]!.length < size) {
    const tail = out.pop()!;
    out[out.length - 1]!.push(...tail);
  }
  return out;
};
const all = <T,>(...lists: readonly T[][]): T[] => lists.flat();
const FACT_TABLES: Row[] = all(
  WONDERS, INDIA_GK, SCIENCE_GK, CULTURE_GK, SPORTS_GK, MOVIES_GK, MUSIC_GK,
  GAMES_GK, RIDDLE_PACK, FLAGS_GK, MYTHOLOGY_GK, SPACE_GK, TECH_GK, FOOD_GK,
  GEO_GK, HISTORY_GK, CRICKET_GK, BRANDS_GK,
  INVENTIONS, BOOKS, PLACES, SPACE_MISSIONS, BODY_FACTS, WORLD_FOOD,
  FESTIVALS, TECH_BRANDS, SPORTS_FACTS, RIDDLES,
);

const packs: Pack[] = [];
const seenSlugs = new Set<string>();
function add(p: Pack) {
  if (seenSlugs.has(p.slug)) throw new Error(`duplicate pack slug ${p.slug}`);
  seenSlugs.add(p.slug);
  packs.push(p);
}

function quizPack(slug: string, name: string, icon: string, group: PackGroup, desc: string, rows: Row[], kids = false, minutes = 3) {
  add({ slug, name, kind: "quiz", group, desc, icon, rows, kids, minutes });
}

/* ─────────────────────────── 1. country angles ─────────────────────── */

const byContinent = (c: string) => COUNTRIES.filter((r) => r.continent === c);

const capitalRows = (rows: typeof COUNTRIES): Row[] =>
  rows.map((r) => {
    const rng = mulberry32(hashSeed(`cap-${r.iso}`));
    const wrong = seededShuffle(COUNTRIES.filter((x) => x.capital !== r.capital).map((x) => x.capital), rng).slice(0, 3);
    return [`What is the capital of ${r.name}?`, r.capital, wrong[0]!, wrong[1]!, wrong[2]!] as Row;
  });
const reversedCapitalRows = (rows: typeof COUNTRIES): Row[] =>
  rows.map((r) => {
    const rng = mulberry32(hashSeed(`revcap-${r.iso}`));
    const wrong = seededShuffle(COUNTRIES.filter((x) => x.name !== r.name).map((x) => x.name), rng).slice(0, 3);
    return [`${r.capital} is the capital of…?`, r.name, wrong[0]!, wrong[1]!, wrong[2]!] as Row;
  });
const currencyRows = (rows: typeof COUNTRIES): Row[] =>
  rows.map((r) => {
    const rng = mulberry32(hashSeed(`cur-${r.iso}`));
    const wrong = seededShuffle([...new Set(COUNTRIES.filter((x) => x.currency !== r.currency).map((x) => x.currency))], rng).slice(0, 3);
    return [`Which currency is used in ${r.name}?`, r.currency, wrong[0]!, wrong[1]!, wrong[2]!] as Row;
  });
const continentRows = (rows: typeof COUNTRIES): Row[] =>
  rows.map((r) => {
    const rng = mulberry32(hashSeed(`con-${r.iso}`));
    const wrong = seededShuffle((["Asia", "Europe", "Africa", "Americas", "Oceania"] as const).filter((c) => c !== r.continent), rng).slice(0, 3);
    return [`Which continent is ${r.name} in?`, r.continent, wrong[0]!, wrong[1]!, wrong[2]!] as Row;
  });
const flagRows = (rows: typeof COUNTRIES): Row[] =>
  rows.map((r) => {
    const rng = mulberry32(hashSeed(`flag-${r.iso}`));
    const wrong = seededShuffle(COUNTRIES.filter((x) => x.name !== r.name).map((x) => x.name), rng).slice(0, 3);
    return [`Which country's flag is ${flagEmoji(r.iso)}?`, r.name, wrong[0]!, wrong[1]!, wrong[2]!] as Row;
  });

const capitalPool = capitalRows(COUNTRIES);
const reversedPool = reversedCapitalRows(COUNTRIES);
const currencyPool = currencyRows(COUNTRIES);
const continentPool = continentRows(COUNTRIES);
const flagPool = flagRows(COUNTRIES);

chunk(capitalPool, 6).forEach((rows, i) =>
  quizPack(`capitals-world-${i + 1}`, `World Capitals ${i + 1}`, "🗺️", "Quiz Packs", `Name the capital city — sprint ${i + 1} of ${Math.ceil(capitalPool.length / 6)}`, rows));
chunk(reversedPool, 6).forEach((rows, i) =>
  quizPack(`capital-reverse-${i + 1}`, `Reverse Capitals ${i + 1}`, "🧭", "Quiz Packs", "Given the capital, name the country", rows));
chunk(currencyPool, 6).forEach((rows, i) =>
  quizPack(`world-currency-${i + 1}`, `World Currencies ${i + 1}`, "💱", "Quiz Packs", "Match the country to its currency", rows));
chunk(continentPool, 6).forEach((rows, i) =>
  quizPack(`world-continents-${i + 1}`, `Continents ${i + 1}`, "🌍", "Quiz Packs", "Which continent is it on?", rows));
chunk(flagPool, 6).forEach((rows, i) =>
  quizPack(`flag-quiz-${i + 1}`, `Flag Quiz ${i + 1}`, "🚩", "Quiz Packs", "Name the country from its flag", rows));

// continent specials
const CONTINENTS = ["Asia", "Europe", "Africa", "Americas", "Oceania"] as const;
quizPack("capitals-asia", "Capitals of Asia", "🏮", "Quiz Packs", "20 Asian capitals, from Tokyo to Tehran", capitalRows(byContinent("Asia")), false, 4);
quizPack("capitals-europe", "Capitals of Europe", "🏰", "Quiz Packs", "European capitals, London to Kyiv", capitalRows(byContinent("Europe")), false, 4);
quizPack("capitals-africa", "Capitals of Africa", "🦁", "Quiz Packs", "African capitals from Cairo to Pretoria", capitalRows(byContinent("Africa")));
quizPack("capitals-americas", "Capitals of the Americas", "🗽", "Quiz Packs", "From Ottawa to Havana", capitalRows(byContinent("Americas")));
quizPack("capitals-oceania", "Capitals of Oceania", "🏝️", "Quiz Packs", "The Pacific corner: Canberra, Wellington, Suva", capitalRows(byContinent("Oceania")));
for (const c of CONTINENTS) {
  const label = c === "Americas" ? "the Americas" : c;
  quizPack(`currency-${c.toLowerCase()}`, `Currencies of ${label}`, "💴", "Quiz Packs", `Money used across ${label}`, currencyRows(byContinent(c)), false, 3);
  quizPack(`continents-${c.toLowerCase()}`, `${label} Countries`, "🌐", "Quiz Packs", `Spot the continent of each ${label} country`, continentRows(byContinent(c)), false, 3);
  quizPack(`flags-${c.toLowerCase()}`, `Flags of ${label}`, "🎏", "Quiz Packs", `Flags from across ${label}`, flagRows(byContinent(c)), false, 3);
}

/* ─────────────── 2. fact tables → warm-up + pro sprints ────────────── */

const TABLE_META: { rows: Row[]; slug: string; name: string; icon: string; desc: string; kids?: boolean }[] = [
  { rows: WONDERS, slug: "world-wonders", name: "World Wonders", icon: "🗿", desc: "Monuments and the places that keep them" },
  { rows: INDIA_GK, slug: "india-gk", name: "India GK", icon: "🇮🇳", desc: "States, capitals, temples and superlatives" },
  { rows: SCIENCE_GK, slug: "science-gk", name: "Science GK", icon: "⚗️", desc: "Symbols, speeds and the laws that run the world" },
  { rows: CULTURE_GK, slug: "world-culture", name: "World Culture", icon: "🎭", desc: "Dances, art and where traditions began" },
  { rows: SPORTS_GK, slug: "sports-gk", name: "Sports GK", icon: "🏆", desc: "Rules, cups and legends" },
  { rows: MOVIES_GK, slug: "movies-quiz", name: "Movies Quiz", icon: "🎬", desc: "Bollywood, Hollywood and the Oscars" },
  { rows: MUSIC_GK, slug: "music-quiz", name: "Music Quiz", icon: "🎸", desc: "Strings, symphonies and ragas" },
  { rows: GAMES_GK, slug: "gaming-quiz", name: "Gaming Quiz", icon: "🕹️", desc: "Mario, Minecraft and where it all began" },
  { rows: RIDDLE_PACK, slug: "riddle-time", name: "Riddle Time", icon: "🤔", desc: "Classic riddles with a twist" },
  { rows: FLAGS_GK, slug: "flags-expert", name: "Flag Expert", icon: "🎏", desc: "Trickier flag trivia for vexillologists" },
  { rows: MYTHOLOGY_GK, slug: "mythology", name: "Mythology", icon: "⚡", desc: "Gods, epics and trickster spiders" },
  { rows: SPACE_GK, slug: "space-expert", name: "Space Expert", icon: "🪐", desc: "Planets, probes and black holes" },
  { rows: TECH_GK, slug: "tech-quiz", name: "Tech Quiz", icon: "💾", desc: "Computers, code and the first bug" },
  { rows: FOOD_GK, slug: "food-quiz", name: "Food Quiz", icon: "🍛", desc: "Dishes, origins and spicy details" },
  { rows: GEO_GK, slug: "geography-pro", name: "Geography Pro", icon: "⛰️", desc: "Deserts, straits and time zones" },
  { rows: HISTORY_GK, slug: "history-quiz", name: "History Quiz", icon: "📜", desc: "Dates, walls and turning points" },
  { rows: CRICKET_GK, slug: "cricket-quiz", name: "Cricket Quiz", icon: "🏏", desc: "Overs, cups and record books" },
  { rows: BRANDS_GK, slug: "brand-quiz", name: "Brand Quiz", icon: "🏷️", desc: "Slogans, logos and founders" },
  { rows: INVENTIONS, slug: "inventions", name: "Inventions", icon: "💡", desc: "Match the invention to its inventor" },
  { rows: BOOKS, slug: "book-nook", name: "Book Nook", icon: "📚", desc: "Authors, classics and golden tickets" },
  { rows: PLACES, slug: "places-monuments", name: "Places & Monuments", icon: "🗼", desc: "Where in the world is that landmark?" },
  { rows: SPACE_MISSIONS, slug: "space-missions", name: "Space Missions", icon: "🛰️", desc: "Sputnik to Chandrayaan" },
  { rows: BODY_FACTS, slug: "body-facts", name: "Body Facts", icon: "🫀", desc: "Bones, blood and the heart's chambers" },
  { rows: WORLD_FOOD, slug: "world-food", name: "World Food", icon: "🍜", desc: "Which kitchen did that dish come from?" },
  { rows: FESTIVALS, slug: "festivals", name: "Festivals", icon: "🪔", desc: "Lights, colours and harvests" },
  { rows: TECH_BRANDS, slug: "tech-brands", name: "Tech Brands", icon: "📱", desc: "Who makes what in tech" },
  { rows: SPORTS_FACTS, slug: "sports-facts", name: "Sports Facts", icon: "🥇", desc: "Records, distances and legends" },
];

for (const t of TABLE_META) {
  quizPack(`${t.slug}-warmup`, `${t.name} — Warm-up`, t.icon, t.kids ? "Kids Corner" : "Quiz Packs", `${t.desc} — the friendly half`, t.rows.slice(0, 6), t.kids);
  quizPack(`${t.slug}-pro`, `${t.name} — Pro`, t.icon, t.kids ? "Kids Corner" : "Quiz Packs", `${t.desc} — the tricky half`, t.rows.slice(6, 12), t.kids);
}

/* ─────────────── 3. hand-written GK packs → warm-up + pro ──────────── */

for (const g of GK_PACKS) {
  quizPack(`${g.id}-warmup`, `${g.name} — Warm-up`, g.icon, "Kids Corner", `${g.desc} — the friendly half`, g.rows.slice(0, 6), true);
  quizPack(`${g.id}-pro`, `${g.name} — Pro`, g.icon, "Kids Corner", `${g.desc} — the tougher half`, g.rows.slice(6, 12), true);
}

/* ─────────────── 4. word-table quiz packs ──────────────────────────── */

quizPack("spell-it-right-1", "Spell It Right 1", "🔤", "Word Play", "Pick the correct spelling — round one",
  SPELLING.slice(0, 9).map(([word, ...rest]): Row => {
    const [w1, w2, w3, hint] = rest as [string, string, string, string];
    const rng = mulberry32(hashSeed(`spell-${word}`));
    const opts = seededShuffle([w1, w2, w3], rng);
    return [`Which spelling is correct? (${hint})`, word, opts[0]!, opts[1]!, opts[2]!];
  }));
quizPack("spell-it-right-2", "Spell It Right 2", "🔤", "Word Play", "Pick the correct spelling — round two",
  SPELLING.slice(9).map(([word, ...rest]): Row => {
    const [w1, w2, w3, hint] = rest as [string, string, string, string];
    const rng = mulberry32(hashSeed(`spell-${word}`));
    const opts = seededShuffle([w1, w2, w3], rng);
    return [`Which spelling is correct? (${hint})`, word, opts[0]!, opts[1]!, opts[2]!];
  }));

const oppositeRows = (rows: [string, string][]): Row[] =>
  rows.map(([w, o]) => {
    const rng = mulberry32(hashSeed(`opp-${w}`));
    const wrong = seededShuffle(OPPOSITES.map(([, o2]) => o2).filter((x) => x !== o), rng).slice(0, 3);
    return [`What is the opposite of "${w}"?`, o, wrong[0]!, wrong[1]!, wrong[2]!];
  });
chunk(oppositeRows(OPPOSITES), 6).forEach((rows, i) =>
  quizPack(`opposites-${i + 1}`, `Opposites ${i + 1}`, "↔️", "Word Play", "Antonym sprints for sharp minds", rows));

const pluralRows = (rows: [string, string][], salt: string): Row[] =>
  rows.map(([s, p]) => {
    const rng = mulberry32(hashSeed(`${salt}-${s}`));
    const wrong = seededShuffle(PLURALS.map(([, p2]) => p2).filter((x) => x !== p), rng).slice(0, 3);
    return [`What is the plural of "${s}"?`, p, wrong[0]!, wrong[1]!, wrong[2]!];
  });
quizPack("plural-power", "Plural Power", "📇", "Word Play", "One mouse, two…? irregular plurals", pluralRows(PLURALS.slice(0, 8), "pl1"));
quizPack("plural-power-2", "Plural Power 2", "📇", "Word Play", "Sheep, geese and knives", pluralRows(PLURALS.slice(8), "pl2"));

quizPack("rhyme-time", "Rhyme Time", "🎵", "Word Play", "Which word rhymes?", RHYMES.map(([w, rs]): Row => {
  const rng = mulberry32(hashSeed(`rh-${w}`));
  const outside = seededShuffle(RHYMES.flatMap(([, r2]) => r2).filter((x) => !rs.includes(x)), rng)[0]!;
  const opts = seededShuffle([rs[1]!, rs[2]!, outside], rng);
  return [`Which word rhymes with "${w}"?`, rs[0]!, opts[0]!, opts[1]!, opts[2]!];
}));

quizPack("baby-animals", "Baby Animals", "🐣", "Kids Corner", "A baby kangaroo is a…?", BABIES.map(([a, b]): Row => {
  const rng = mulberry32(hashSeed(`baby-${a}`));
  const wrong = seededShuffle(BABIES.map(([, b2]) => b2).filter((x) => x !== b), rng).slice(0, 3);
  return [`What is a baby ${a} called?`, b, wrong[0]!, wrong[1]!, wrong[2]!];
}), true);

quizPack("community-helpers", "Community Helpers", "👷", "Kids Corner", "Who does what in the neighbourhood", HELPERS.map(([does, who, wrongs]): Row => {
  const rng = mulberry32(hashSeed(`help-${who}`));
  const extra = seededShuffle(HELPERS.map(([, w2]) => w2).filter((x) => x !== who && !wrongs.includes(x)), rng)[0]!;
  return [`Who ${does}?`, who, wrongs[0]!, wrongs[1]!, extra];
}), true);

quizPack("colour-mixing", "Colour Mixing", "🎨", "Kids Corner", "Red + blue = ?", COLOUR_MIX.map(([mix, res, d1, d2]): Row => {
  const rng = mulberry32(hashSeed(`mix-${mix}`));
  const wrong = seededShuffle([d1, d2, ...COLOUR_MIX.map(([, r2]) => r2).filter((x) => x !== res)], rng).slice(0, 3);
  return [`What does ${mix} make?`, res, wrong[0]!, wrong[1]!, wrong[2]!];
}), true);

quizPack("calendar-quiz", "Calendar Quiz", "📅", "Kids Corner", "Days, months and seasons", CALENDAR.map(([q, a, w1, w2, w3]): Row => [q, a, w1, w2, w3]), true);
quizPack("riddle-classics", "Riddle Classics", "🧠", "Word Play", "The riddles your parents grew up on", RIDDLES.map(([q, a, w1, w2, w3]): Row => [q, a, w1, w2, w3]));

/* ─────────────── 5. mixed samplers ─────────────────────────────────── */

/** draws seeded rows from a pool; each set is a genuinely different quiz */
function mixedSets(prefix: string, name: string, icon: string, group: PackGroup, desc: string, pool: Row[], sets: number, per: number, kids = false, minutes?: number) {
  for (let i = 1; i <= sets; i++) {
    const rng = mulberry32(hashSeed(`${prefix}-${i}`));
    const drawn = seededShuffle(pool, rng).slice(0, per);
    quizPack(`${prefix}-set-${i}`, `${name} — Set ${i}`, icon, group, `${desc} · ${per} questions, a fresh draw every set`, drawn, kids, minutes ?? (per <= 6 ? 2 : 4));
  }
}

const KIDS_POOL: Row[] = all(
  GK_PACKS.flatMap((g) => g.rows),
  BABIES.map(([a, b]): Row => [`What is a baby ${a} called?`, b, "Puppy", "Kitten", "Chick"]),
  COLOUR_MIX.map(([mix, res, d1, d2]): Row => [`What does ${mix} make?`, res, d1, d2, "Grey"]),
  CALENDAR.map(([q, a, w1, w2, w3]): Row => [q, a, w1, w2, w3]),
  RIDDLES.map(([q, a, w1, w2, w3]): Row => [q, a, w1, w2, w3]),
);
const MEGA_POOL: Row[] = all(FACT_TABLES, GK_PACKS.flatMap((g) => g.rows));

mixedSets("mixed-quiz", "Mixed Quiz", "🎲", "Quiz Packs", "A bit of everything — GK, science, movies, cricket", FACT_TABLES, 70, 5);
mixedSets("kids-mix", "Kids Mix", "🧸", "Kids Corner", "Easy, fun and made for young players", KIDS_POOL, 50, 5, true);
mixedSets("mega-mix", "Mega Mix", "🌟", "Quiz Packs", "Ten questions from every corner of the catalog", MEGA_POOL, 70, 10, false, 6);
mixedSets("india-mix", "India Mix", "🪔", "Quiz Packs", "States, festivals, cricket and cinema", all(INDIA_GK, GK_PACKS.find((g) => g.id === "india-kids")!.rows, FESTIVALS, CRICKET_GK, MOVIES_GK), 15, 6, false, 3);
mixedSets("world-mix", "World Mix", "🌐", "Quiz Packs", "Geography, flags, wonders and food", all(WONDERS, FLAGS_GK, GEO_GK, FOOD_GK, capitalRows(byContinent("Europe"))), 15, 6);
mixedSets("science-mix", "Science Mix", "🔬", "Quiz Packs", "Physics, chemistry, space and the body", all(SCIENCE_GK, SPACE_GK, TECH_GK, GK_PACKS.find((g) => g.id === "science-sparks")!.rows), 15, 6);
mixedSets("sports-mix", "Sports Mix", "⚽", "Quiz Packs", "Cricket, Olympics and record holders", all(SPORTS_GK, CRICKET_GK, SPORTS_FACTS, GK_PACKS.find((g) => g.id === "sports-kids")!.rows), 15, 6);
mixedSets("fun-mix", "Fun Mix", "🎈", "Party", "Riddles, movies, gaming and brands", all(RIDDLE_PACK, MOVIES_GK, GAMES_GK, BRANDS_GK, MUSIC_GK), 25, 5);

/* ─────────────── 6. word lists → scramble + hangman ────────────────── */

interface WordList { id: string; name: string; icon: string; hint: string; kids?: boolean; words: string[] }
const WORD_LISTS: WordList[] = [
  { id: "animals", name: "Animals", icon: "🦁", hint: "All creatures great and small", words: ["LION", "TIGER", "ELEPHANT", "GIRAFFE", "ZEBRA", "MONKEY", "PANDA", "KOALA", "RABBIT", "DOLPHIN", "PENGUIN", "LEOPARD", "CHEETAH", "BUFFALO", "FALCON", "SPARROW", "TORTOISE", "CROCODILE", "SQUIRREL", "OCTOPUS"] },
  { id: "food", name: "Food", icon: "🍕", hint: "Dishes and treats from around the world", words: ["PIZZA", "BURGER", "MANGO", "BANANA", "SAMOSA", "BIRYANI", "NOODLES", "PANCAKE", "CHOCOLATE", "SANDWICH", "PINEAPPLE", "STRAWBERRY", "DUMPLING", "LASAGNA", "CROISSANT", "GUACAMOLE", "POPCORN", "SPAGHETTI", "AVOCADO", "PARATHA"] },
  { id: "sports", name: "Sports", icon: "🏏", hint: "Games played on fields and courts", words: ["CRICKET", "FOOTBALL", "TENNIS", "HOCKEY", "BASKETBALL", "BADMINTON", "SWIMMING", "BOXING", "KABADDI", "ARCHERY", "MARATHON", "GYMNASTICS", "WRESTLING", "VOLLEYBALL", "CARROM", "CHESS", "GOLF", "SKATING"] },
  { id: "countries", name: "Countries", icon: "🌍", hint: "Nations from every continent", words: COUNTRIES.map((c) => c.name.toUpperCase()).filter((w) => /^[A-Z]{4,12}$/.test(w)).slice(0, 22) },
  { id: "space", name: "Space", icon: "🚀", hint: "Everything above the sky", words: ["PLANET", "GALAXY", "COMET", "ORBIT", "ROCKET", "SATELLITE", "ASTEROID", "NEBULA", "ECLIPSE", "GRAVITY", "JUPITER", "SATURN", "MERCURY", "ASTRONAUT", "TELESCOPE", "METEOR", "UNIVERSE", "COSMOS"] },
  { id: "school", name: "School", icon: "🎒", hint: "Things you find in class", words: ["PENCIL", "ERASER", "NOTEBOOK", "TEACHER", "STUDENT", "LIBRARY", "BACKPACK", "HOMEWORK", "CLASSROOM", "EXAM", "SCIENCE", "HISTORY", "RULER", "COMPASS", "PROJECT", "DEGREE", "LESSON", "PLAYGROUND"] },
  { id: "body", name: "Human Body", icon: "🫀", hint: "Parts of the machine you live in", words: ["HEART", "LUNGS", "BRAIN", "LIVER", "KIDNEY", "MUSCLE", "SKELETON", "STOMACH", "SHOULDER", "EYEBROW", "THUMB", "ANKLE", "SPINE", "FINGERNAIL", "EARDRUM", "ELBOW", "WRIST", "TONGUE"] },
  { id: "nature", name: "Nature", icon: "🌳", hint: "Forests, rivers and weather", words: ["FOREST", "RIVER", "MOUNTAIN", "VALLEY", "DESERT", "GLACIER", "VOLCANO", "WATERFALL", "MONSOON", "RAINBOW", "THUNDER", "MEADOW", "JUNGLE", "ISLAND", "CANYON", "LAGOON", "BLOSSOM", "BREEZE"] },
  { id: "jobs", name: "Jobs", icon: "👷", hint: "Careers and the people who do them", words: ["DOCTOR", "ENGINEER", "TEACHER", "FARMER", "PILOT", "DENTIST", "CHEF", "PLUMBER", "ELECTRICIAN", "JOURNALIST", "ARCHITECT", "SCIENTIST", "LAWYER", "PHARMACIST", "FIREFIGHTER", "CARPENTER", "TAILOR", "MECHANIC"] },
  { id: "toys", name: "Toys & Fun", icon: "🧸", hint: "Playtime classics", kids: true, words: ["TEDDY", "PUZZLE", "DOLL", "KITE", "DICE", "MARBLE", "SWING", "SLIDE", "BALLOON", "TRAMPOLINE", "WHISTLE", "CRAYON", "STICKER", "YOYO", "BLOCKS", "SKIPPING"] },
  { id: "cartoon", name: "Cartoon Time", icon: "🐭", hint: "Characters kids love", kids: true, words: ["MICKEY", "DONALD", "GOOFY", "DORAEMON", "SHINCHAN", "POKEMON", "PIKACHU", "SPONGEBOB", "SCOOBY", "JERRY", "BHEEM", "SPIDER", "BATMAN", "SUPERMAN", "FROZEN", "ELSA"] },
  { id: "music-words", name: "Music", icon: "🎵", hint: "Instruments and notes", words: ["GUITAR", "VIOLIN", "PIANO", "DRUMS", "FLUTE", "SITAR", "TABLA", "HARMONIUM", "KEYBOARD", "TRUMPET", "SAXOPHONE", "MELODY", "RHYTHM", "CHORUS", "OCTAVE", "LYRICS", "BANJO", "HARP"] },
];
// guarantee no duplicate words inside any list
for (const l of WORD_LISTS) l.words = [...new Set(l.words)];

for (const list of WORD_LISTS) {
  add({
    slug: `word-scramble-${list.id}`, name: `Scramble: ${list.name}`, kind: "scramble", group: list.kids ? "Kids Corner" : "Word Play",
    desc: `Unscramble ${list.name.toLowerCase()} words — letters, timer and streaks`, icon: list.icon, kids: list.kids,
    words: list.words, hint: list.hint, minutes: 4,
  });
  add({
    slug: `hangman-${list.id}`, name: `Hangman: ${list.name}`, kind: "hangman", group: list.kids ? "Kids Corner" : "Word Play",
    desc: `Guess the hidden ${list.name.toLowerCase()} word, one letter at a time`, icon: "🔤", kids: list.kids,
    words: list.words, hint: list.hint, minutes: 5,
  });
}

/* ─────────────── 7. memory packs ───────────────────────────────────── */

const MEMORY_SETS: { id: string; name: string; icon: string; kids?: boolean; emojis: string[] }[] = [
  { id: "farm", name: "Farm Friends", icon: "🐄", kids: true, emojis: ["🐄", "🐖", "🐎", "🐑", "🐔", "🦆", "🐱", "🐶", "🐰", "🐭"] },
  { id: "ocean", name: "Ocean Pals", icon: "🐠", kids: true, emojis: ["🐠", "🐙", "🦈", "🐬", "🐳", "🦀", "🐡", "🦐", "🐢", "🦑"] },
  { id: "jungle", name: "Jungle Book", icon: "🦁", kids: true, emojis: ["🦁", "🐯", "🐘", "🦒", "🐒", "🦜", "🐍", "🦛", "🦏", "🐊"] },
  { id: "fruits", name: "Fruit Basket", icon: "🍎", kids: true, emojis: ["🍎", "🍌", "🍇", "🍓", "🍒", "🍍", "🥭", "🍑", "🥝", "🍉"] },
  { id: "vehicles", name: "Things That Go", icon: "🚗", kids: true, emojis: ["🚗", "🚌", "🚒", "🚑", "🚲", "✈️", "🚂", "🚀", "🚁", "🛴"] },
  { id: "space", name: "Space Match", icon: "🪐", emojis: ["🪐", "🌙", "⭐", "☄️", "🛸", "🌍", "🌞", "🛰️", "🔭", "👽"] },
  { id: "sweets", name: "Sweet Tooth", icon: "🍰", kids: true, emojis: ["🍰", "🍩", "🍪", "🍫", "🍬", "🧁", "🍭", "🍮", "🍯", "🥮"] },
  { id: "sports", name: "Sports Day", icon: "⚽", emojis: ["⚽", "🏀", "🏈", "🎾", "🏐", "🏓", "⛳", "🎳", "🥊", "🛹"] },
  { id: "birds", name: "Bird Watch", icon: "🦜", emojis: ["🦜", "🦚", "🦉", "🦅", "🦆", "🦢", "🦩", "🐦", "🐧", "🕊️"] },
  { id: "bugs", name: "Bug Hunt", icon: "🦋", kids: true, emojis: ["🦋", "🐝", "🐞", "🐜", "🦗", "🕷️", "🦂", "🐛", "🦟", "🐌"] },
  { id: "flowers", name: "Garden Blooms", icon: "🌻", kids: true, emojis: ["🌻", "🌹", "🌷", "🌸", "🌺", "🌼", "💐", "🪻", "🥀", "🌱"] },
  { id: "faces", name: "Emoji Faces", icon: "😀", emojis: ["😀", "😂", "🥳", "😎", "🤩", "😴", "🤖", "👻", "🎃", "🥶"] },
];
for (const m of MEMORY_SETS) {
  add({
    slug: `memory-${m.id}`, name: `Memory: ${m.name}`, kind: "memory", group: m.kids ? "Kids Corner" : "Puzzles",
    desc: `Flip and pair ${m.name.toLowerCase()} emojis — solo or face-off`, icon: m.icon, kids: m.kids,
    emojis: m.emojis, minutes: 3,
  });
}

/* ─────────────── 8. emoji phrases ──────────────────────────────────── */

const EMOJI_SETS: { id: string; name: string; icon: string; kids?: boolean; phrases: [string, string][] }[] = [
  { id: "movies", name: "Emoji Movies", icon: "🎬", phrases: [
    ["🦁👑", "The Lion King"], ["🧊❄️👩", "Frozen"], ["🕷️🧑", "Spider-Man"], ["🦇🧑", "Batman"],
    ["🃏🤡", "Joker"], ["🌊🐠", "Finding Nemo"], ["🧙‍♂️💍", "The Lord of the Rings"], ["🚢💔", "Titanic"],
    ["🤠🚀🦖", "Toy Story"], ["🌟✨🧞", "Aladdin"], ["🐭👨‍🍳", "Ratatouille"], ["🐍🏫🪄", "Harry Potter"],
  ]},
  { id: "bollywood", name: "Emoji Bollywood", icon: "🪔", phrases: [
    ["🔥🌊", "RRR"], ["⚔️👦💪", "Baahubali"], ["🚂🔥🔫", "Sholay"], ["👩‍❤️‍👨🚗🥁", "DDLJ"],
    ["🇮🇳🏆🪖", "Lagaan"], ["😂😂😂", "Hera Pheri"], ["🍛👨‍🍳", "Bawarchi"], ["🏏🏅✈️", "MS Dhoni: The Untold Story"],
    ["🕺💃🪩", "Disco Dancer"], ["👑🤴💔🎨", "Mughal-e-Azam"], ["📕🎓😂", "3 Idiots"], ["👽🤖🚀", "Koi… Mil Gaya"],
  ]},
  { id: "idioms", name: "Emoji Idioms", icon: "💬", phrases: [
    ["🌧️🐱🐶", "Raining cats and dogs"], ["🐝📚", "Busy bee"], ["🐑🖤", "Black sheep"], ["🦶🎈", "Footloose"],
    ["🧊🎂", "Icing on the cake"], ["🐂🏪", "Bull in a china shop"], ["🐟💧", "Fish out of water"], ["🌙🧀", "Over the moon"],
    ["🍎🩺", "An apple a day keeps the doctor away"], ["🤐🤐", "Zip it"], ["🐴👄", "Straight from the horse's mouth"], ["🥚🚶", "Walking on eggshells"],
  ]},
  { id: "food", name: "Emoji Food", icon: "🍕", kids: true, phrases: [
    ["🍕🧀", "Cheese pizza"], ["🍔🍟", "Burger and fries"], ["🌭🍞", "Hot dog"], ["🌮🎉", "Taco party"],
    ["🍣🐟", "Sushi"], ["🍜🍲", "Ramen"], ["🍛🍚", "Curry rice"], ["🥭🥤", "Mango shake"],
    ["🍦🍨", "Ice cream"], ["🍿🎬", "Popcorn and a movie"], ["🧆🥙", "Falafel wrap"], ["🫓🧈", "Butter naan"],
  ]},
  { id: "animals", name: "Emoji Animals", icon: "🐯", kids: true, phrases: [
    ["🐝🍯", "Bee and honey"], ["🐢🏁", "Tortoise wins the race"], ["🐺🌕", "Wolf howls at the moon"], ["🐘🦷", "Elephant tusks"],
    ["🐧❄️", "Penguin on ice"], ["🦒🌿", "Giraffe eats leaves"], ["🐴🏇", "Horse race"], ["🐨🌿", "Koala and eucalyptus"],
    ["🦋🌸", "Butterfly garden"], ["🦉🌙", "Night owl"], ["🐙🌊", "Octopus in the deep"], ["🦜🗣️", "Parrot talks"],
  ]},
  { id: "cricket", name: "Emoji Cricket", icon: "🏏", phrases: [
    ["🏏💥", "Slog sweep"], ["🎯🧤", "Caught behind"], ["🏏🏃", "Running between wickets"], ["🌧️⏸️", "Rain delay"],
    ["6️⃣💥", "Out of the park"], ["⚪⚪⚪⚪⚪⚪", "Maiden over"], ["🧱🛡️🏏", "Defensive block"], ["🔁🏏", "Strike rotated"],
    ["🏆🇮🇳1983", "Kapil's Devils lift the Cup"], ["🏆🇮🇳2011", "Dhoni's six to win it"], ["🔴⚪🧢", "Test cap"], ["🟡👕", "The yellow jersey of CSK"],
  ]},
];
for (const e of EMOJI_SETS) {
  add({
    slug: `emoji-${e.id}`, name: e.name, kind: "emoji", group: e.kids ? "Kids Corner" : "Party",
    desc: "Decode the phrase hidden in the emojis", icon: e.icon, kids: e.kids,
    phrases: e.phrases, minutes: 3,
  });
}

/* ─────────────── 9. would-you-rather ───────────────────────────────── */

const WYR_SETS: { id: string; name: string; icon: string; kids?: boolean; choices: [string, string][] }[] = [
  { id: "classic", name: "Would You Rather", icon: "🤔", choices: [
    ["Be able to fly", "Be invisible"], ["Talk to animals", "Speak every language"], ["Never wait in a queue", "Never have a bad hair day"],
    ["Have a rewind button for life", "A pause button"], ["Live without music", "Live without the internet"], ["Know the history of every object you touch", "Be able to talk to plants"],
    ["Time travel to the past", "Jump to 100 years ahead"], ["Be the funniest person in the room", "The smartest"], ["Have unlimited free flights", "Unlimited free food"],
    ["One close friend", "A hundred acquaintances"], ["Be a famous singer", "A brilliant unknown writer"], ["Live in a quiet village", "A buzzing city"],
    ["Find ₹1,000 on the street", "Never lose your keys again"], ["Read minds", "See the future"],
  ]},
  { id: "kids", name: "Would You Rather: Kids", icon: "🧒", kids: true, choices: [
    ["Be a superhero", "Be a wizard"], ["Have a pet dragon", "A pet unicorn"], ["Ride a rocket to space", "Dive to the deep sea in a submarine"],
    ["Never do homework again", "Never brush your hair"], ["Eat only ice cream forever", "Only pizza forever"], ["Be the fastest kid in school", "The best at drawing"],
    ["Live in a treehouse", "A castle"], ["Have a robot friend", "A talking dog"], ["Be able to shrink tiny", "Grow giant"],
    ["Sleep on a cloud", "In a spaceship"], ["Every day is your birthday", "Every day is a holiday"], ["Talk like a parrot", "Hop like a kangaroo"],
  ]},
  { id: "food", name: "Would You Rather: Food", icon: "🍜", choices: [
    ["Only sweet food forever", "Only spicy food forever"], ["Give up chai", "Give up coffee"], ["Cook every meal yourself", "A chef cooks every meal but picks the menu"],
    ["Pizza with pineapple", "Pizza without cheese"], ["Breakfast for dinner", "Dinner for breakfast"], ["One cuisine for life", "A surprise every meal"],
    ["Street food daily", "Fine dining monthly"], ["Never eat mango again", "Never eat chocolate again"], ["Everything extra spicy", "Everything extra bland"],
    ["Dessert before every meal", "No dessert ever again"], ["Eat soup with a fork", "Eat rice with chopsticks (no practice)"], ["Momos forever", "Biryani forever"],
  ]},
  { id: "school", name: "Would You Rather: School", icon: "🎒", kids: true, choices: [
    ["No exams but daily quizzes", "One giant exam a year"], ["Study at the beach", "Study in a library"], ["Maths homework forever", "Essay homework forever"],
    ["A strict-but-fair teacher", "A chill-but-scattered one"], ["School starts at noon", "School ends by noon"], ["Have perfect memory", "Perfect handwriting"],
    ["Sit beside your best friend", "Choose your own seat daily"], ["Wear a uniform you design", "No uniform ever"], ["One long summer break", "Many short breaks"],
    ["Be class monitor", "Be sports captain"], ["Learn any instrument instantly", "Any language instantly"], ["Unlimited stationery", "Unlimited books"],
  ]},
  { id: "superpowers", name: "Would You Rather: Powers", icon: "🦸", choices: [
    ["Teleport anywhere", "Read any book in a second"], ["Freeze time for 10 minutes a day", "Fly for 10 minutes a day"], ["Super strength", "Super speed"],
    ["Talk to your past self", "Your future self"], ["Heal others", "Heal yourself"], ["Invisibility", "Mind reading"],
    ["Never feel tired", "Never feel afraid"], ["Control the weather", "Control plants"], ["Breathe underwater", "Survive any temperature"],
    ["Perfect aim", "Perfect balance"], ["Shapeshift into any animal", "Any object"], ["One wish for you", "Three wishes for others"],
  ]},
  { id: "silly", name: "Would You Rather: Silly", icon: "🤪", kids: true, choices: [
    ["Hair that sings when brushed", "Socks that giggle"], ["Sneeze confetti", "Burp bubbles"], ["Everything tastes like mint", "Everything sounds 5% louder"],
    ["A pet cloud", "A pet rock that tells jokes"], ["Nose that honks when pressed", "Ears that wiggle on command"], ["Finger lights instead of torch", "Permanent marker freckles"],
    ["Walk like a crab for a day", "Talk like a pirate for a week"], ["Pizza-flavoured toothpaste", "Toothpaste-flavoured pizza"], ["A tail you can wag", "Ears like a cat"],
    ["Hiccup glitter", "Sneeze petals"], ["Slippers that squeak", "A hat that honks"], ["Laugh in whispers", "Cry in confetti"],
  ]},
];
for (const w of WYR_SETS) {
  add({
    slug: `would-you-rather-${w.id}`, name: w.name, kind: "wouldyourather", group: w.kids ? "Kids Corner" : "Party",
    desc: "Two options. One impossible choice. Debate with friends", icon: w.icon, kids: w.kids,
    choices: w.choices, minutes: 5,
  });
}

/* ─────────────── 10. sliding puzzles ───────────────────────────────── */

add({
  slug: "sliding-daily", name: "Daily 8-Puzzle", kind: "sliding", group: "Puzzles",
  desc: "The mystic square — one fresh shuffle every day, 3×3 or 4×4", icon: "🔢",
  sizes: [3, 4], daily: true, minutes: 5,
});
add({
  slug: "sliding-numbers", name: "Sliding Numbers", kind: "sliding", group: "Puzzles",
  desc: "Classic n-puzzle in 3×3, 4×4 and the brutal 5×5", icon: "🧩",
  sizes: [3, 4, 5], minutes: 6,
});
add({
  slug: "sliding-emoji", name: "Sliding Emojis", kind: "sliding", group: "Kids Corner",
  desc: "The n-puzzle with emoji tiles — friendlier faces, same logic", icon: "🙂", kids: true,
  sizes: [3, 4], minutes: 5,
});

/* ─────────────── exports ───────────────────────────────────────────── */

export const PACKS: Pack[] = packs;

export const PACK_GROUP_ORDER: { title: PackGroup; icon: string; blurb: string }[] = [
  { title: "Quiz Packs", icon: "🧠", blurb: "Seeded sprints across GK, geography, science and cricket" },
  { title: "Word Play", icon: "🔤", blurb: "Scrambles, hangman, spelling and opposites" },
  { title: "Kids Corner", icon: "🧸", blurb: "Gentle, funny and made for young players" },
  { title: "Puzzles", icon: "🧩", blurb: "Memory boards and the classic sliding puzzle" },
  { title: "Party", icon: "🎉", blurb: "Would-you-rather debates and emoji decoding" },
];

export const PACK_COUNT = packs.length;

const bySlug = new Map(packs.map((p) => [p.slug, p]));
export const getPack = (slug: string | undefined): Pack | undefined =>
  slug ? bySlug.get(slug) : undefined;

/** rows for the /play hub cards (shape matches PlayGame) */
export interface PackCard {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  players: "Solo" | "2P";
  added: string;
}

export const packCards = (group: PackGroup): PackCard[] =>
  packs.filter((p) => p.group === group).map((p) => ({
    slug: p.slug, name: p.name, desc: p.desc, icon: p.icon,
    players: p.kind === "wouldyourather" ? "2P" : "Solo",
    added: "2026-09-20",
  }));

export const PACK_MINUTES = (p: Pack): number => p.minutes;

/** difficulty label derived from kind */
export const packLevel = (p: Pack): "Easy" | "Medium" | "Hard" =>
  p.kind === "quiz" ? (p.slug.endsWith("-pro") || p.slug.startsWith("mega-mix") ? "Hard" : "Easy")
  : p.kind === "sliding" ? (p.sizes && p.sizes.includes(5) ? "Hard" : "Medium")
  : "Easy";
