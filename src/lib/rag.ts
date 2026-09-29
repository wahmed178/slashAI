/**
 * Slash Ask - the retrieval engine behind the /assistant chat.
 *
 * This is a retriever, not a model. There is no LLM here and no network call:
 * the whole pipeline runs on data the app already ships, in the browser.
 *
 * How a question is answered, in order:
 *   1. CHUNK   - every catalogue record becomes one or more passages. Guides
 *                are split per section and then into word-capped chunks, so a
 *                citation points at a real paragraph and not a whole article.
 *   2. EXPAND  - a follow-up question inherits the salient terms of the turn
 *                before it, the way a RAG pipeline rewrites a query before it
 *                hits the retriever.
 *   3. SCORE   - Okapi BM25 over an inverted index, with the title field
 *                weighted 3x. Deterministic, no embeddings, no API.
 *   4. EXTRACT - the answer is the highest-scoring sentences of the winning
 *                passages, quoted verbatim. Nothing is paraphrased.
 *   5. CITE    - every quote carries a numbered link to the page it came from.
 *
 * The honesty rule that shapes the whole file: when the catalogue does not
 * cover a question, the answer says so and names the terms that matched
 * nothing. It never fills the gap with invented prose.
 */

import { COMMANDS, VERIFIED_TOTAL } from "./commands";
import { ALL_BLOG_POSTS } from "./blog-guides";
import { ALL_SLASH_TOOLS } from "./slashkits";
import { DECLARATIVE_TOOLS } from "./toolkit/catalog";
import { ALL_PLAY_GAMES } from "./slashplay";
import { ALL_GLOSSARY, GLOSSARY_TOTAL } from "./glossary";
import { COLLECTIONS } from "./collections";
import { TOOLS as AI_TOOLS } from "./tools";
import { BUILD_IDEAS } from "./build-ideas";
import { ALL_SLASH_APPS } from "./slashbar";

/* ────────────────────────────── types ────────────────────────────────── */

export type RagKind =
  "command" | "guide" | "tool" | "game" | "glossary" | "collection" | "aitool" | "idea" | "app";

export const RAG_KINDS: { id: RagKind; label: string; icon: string; blurb: string }[] = [
  { id: "command", label: "Commands", icon: "⌨️", blurb: "Copy-ready slash commands" },
  { id: "guide", label: "Guides", icon: "📖", blurb: "Long-form explainers" },
  { id: "tool", label: "Tools", icon: "🧰", blurb: "Free browser tools" },
  { id: "game", label: "Games", icon: "🎮", blurb: "Playable in the browser" },
  { id: "glossary", label: "Glossary", icon: "📚", blurb: "Plain-English definitions" },
  { id: "aitool", label: "AI tools", icon: "✨", blurb: "Free-tier AI directory" },
  { id: "idea", label: "Ideas", icon: "💡", blurb: "Build ideas with MVP scope" },
  { id: "collection", label: "Collections", icon: "🗂️", blurb: "Curated command bundles" },
  { id: "app", label: "Apps", icon: "⚡", blurb: "Slash apps" },
];

export interface RagDoc {
  /** stable, unique: "<kind>:<key>" */
  id: string;
  kind: RagKind;
  /** the passage heading shown in a citation */
  title: string;
  /** one line of context under the title (category, vendor, section...) */
  kicker: string;
  /** where the citation links to */
  to: string;
  icon: string;
  /** the retrievable text of this passage */
  body: string;
}

/* ────────────────────────── text utilities ───────────────────────────── */

/** Words that carry no retrieval signal. Kept short and explicit. */ const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "any",
  "about",
  "also",
  "am",
  "are",
  "as",
  "at",
  "be",
  "been",
  "but",
  "by",
  "can",
  "could",
  "did",
  "do",
  "does",
  "for",
  "from",
  "get",
  "got",
  "had",
  "has",
  "have",
  "he",
  "her",
  "him",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "just",
  "like",
  "make",
  "many",
  "me",
  "much",
  "my",
  "need",
  "no",
  "not",
  "number",
  "of",
  "on",
  "or",
  "our",
  "out",
  "she",
  "should",
  "so",
  "some",
  "than",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "to",
  "total",
  "up",
  "us",
  "use",
  "used",
  "using",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "will",
  "with",
  "would",
  "you",
  "your",
  "youre",
  "yours",
]);

/* ────────────────────────── Porter stemmer ──────────────────────────── */

const VOWELS = "aeiou";

/** Porter's consonant test, with the classic "y is a consonant after a vowel" rule. */
function isConsonant(w: string, i: number): boolean {
  const c = w[i];
  if (c === undefined) return true;
  if (VOWELS.includes(c)) return false;
  if (c === "y") return i === 0 ? true : !isConsonant(w, i - 1);
  return true;
}

/** The m in Porter's rules: how many vowel-consonant sequences a stem contains. */
function measure(w: string): number {
  let n = 0;
  let i = 0;
  const len = w.length;
  while (i < len && isConsonant(w, i)) i++;
  while (i < len) {
    while (i < len && !isConsonant(w, i)) i++;
    if (i >= len) break;
    n++;
    while (i < len && isConsonant(w, i)) i++;
  }
  return n;
}

const hasVowel = (w: string) => {
  for (let i = 0; i < w.length; i++) if (!isConsonant(w, i)) return true;
  return false;
};

const endsDoubleConsonant = (w: string) =>
  w.length >= 2 && w.at(-1) === w.at(-2) && isConsonant(w, w.length - 1);

/** consonant-vowel-consonant, where the last is not w/x/y - triggers the "add e" rule. */
function endsCVC(w: string): boolean {
  if (w.length < 3) return false;
  const n = w.length;
  if (!isConsonant(w, n - 1) || isConsonant(w, n - 2) || !isConsonant(w, n - 3)) return false;
  return !"wxy".includes(w.at(-1)!);
}

/** Stem a word with Porter's 1980 algorithm. */
export function stem(word: string): string {
  let w = word;
  if (w.length < 3) return w;

  /* step 1a */
  if (w.endsWith("sses")) w = `${w.slice(0, -4)}ss`;
  // IES -> I, not "drop three characters": dropping them sent "query" to
  // "queri" and "queries" to "quer", so a question and its plural stopped
  // being able to find each other.
  else if (w.endsWith("ies")) w = `${w.slice(0, -3)}i`;
  else if (w.endsWith("ss")) {
    /* unchanged */
  } else if (w.endsWith("s")) w = w.slice(0, -1);

  /* step 1b */
  let step1bApplied = false;
  if (w.endsWith("eed")) {
    if (measure(w.slice(0, -3)) > 0) w = `${w.slice(0, -3)}ee`;
  } else if (w.endsWith("ed") && hasVowel(w.slice(0, -2))) {
    w = w.slice(0, -2);
    step1bApplied = true;
  } else if (w.endsWith("ing") && hasVowel(w.slice(0, -3))) {
    w = w.slice(0, -3);
    step1bApplied = true;
  }
  if (step1bApplied) {
    if (w.endsWith("at")) w = `${w.slice(0, -2)}ate`;
    else if (w.endsWith("bl")) w = `${w.slice(0, -2)}ble`;
    else if (w.endsWith("iz")) w = `${w.slice(0, -2)}ize`;
    else if (endsDoubleConsonant(w) && !"lsz".includes(w.at(-1)!)) w = w.slice(0, -1);
    else if (measure(w) === 1 && endsCVC(w)) w = `${w}e`;
  }

  /* step 1c */
  if (w.endsWith("y") && hasVowel(w.slice(0, -1))) w = `${w.slice(0, -1)}i`;

  /* step 2 */
  const STEP2: [string, string][] = [
    ["ational", "ate"],
    ["tional", "tion"],
    ["enci", "ence"],
    ["anci", "ance"],
    ["izer", "ize"],
    ["abli", "able"],
    ["alli", "al"],
    ["entli", "ent"],
    ["eli", "e"],
    ["ousli", "ous"],
    ["ization", "ize"],
    ["ation", "ate"],
    ["ator", "ate"],
    ["alism", "al"],
    ["iveness", "ive"],
    ["fulness", "ful"],
    ["ousness", "ous"],
    ["aliti", "al"],
    ["iviti", "ive"],
    ["biliti", "ble"],
  ];
  for (const [suffix, replacement] of STEP2) {
    if (!w.endsWith(suffix)) continue;
    if (measure(w.slice(0, -suffix.length)) > 0) w = w.slice(0, -suffix.length) + replacement;
    break;
  }

  /* step 3 */
  const STEP3: [string, string][] = [
    ["icate", "ic"],
    ["ative", ""],
    ["alize", "al"],
    ["iciti", "ic"],
    ["ical", "ic"],
    ["ful", ""],
    ["ness", ""],
  ];
  for (const [suffix, replacement] of STEP3) {
    if (!w.endsWith(suffix)) continue;
    if (measure(w.slice(0, -suffix.length)) > 0) w = w.slice(0, -suffix.length) + replacement;
    break;
  }

  /* step 4 */
  const STEP4 = [
    "al",
    "ance",
    "ence",
    "er",
    "ic",
    "able",
    "ible",
    "ant",
    "ement",
    "ment",
    "ent",
    "ou",
    "ism",
    "ate",
    "iti",
    "ous",
    "ive",
    "ize",
  ];
  let step4Done = false;
  if (w.endsWith("sion") || w.endsWith("tion")) {
    const base = w.slice(0, -3);
    if (measure(base) > 1) w = base;
    step4Done = true;
  }
  if (!step4Done) {
    for (const suffix of STEP4) {
      if (!w.endsWith(suffix)) continue;
      const base = w.slice(0, -suffix.length);
      if (measure(base) > 1) w = base;
      break;
    }
  }

  /* step 5a */
  if (w.endsWith("e")) {
    const base = w.slice(0, -1);
    const m = measure(base);
    if (m > 1 || (m === 1 && !endsCVC(base))) w = base;
  }

  /* step 5b */
  if (measure(w) > 1 && endsDoubleConsonant(w) && w.at(-1) === "l" && measure(w.slice(0, -1)) > 1) {
    w = w.slice(0, -1);
  }

  return w;
}

/** Lowercase, split on anything that is not a letter or digit, stem, drop stops. */
export function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.toLowerCase().split(/[^a-z0-9]+/)) {
    if (raw.length < 2 || raw.length > 32) continue;
    if (STOPWORDS.has(raw)) continue;
    const s = stem(raw);
    if (s.length < 2 || STOPWORDS.has(s)) continue;
    out.push(s);
  }
  return out;
}

/** Content words in reading order, de-duplicated - used to report query coverage. */
export function contentTerms(query: string): string[] {
  const seen = new Set<string>();
  for (const t of tokenize(query)) seen.add(t);
  return [...seen];
}

/**
 * Words that describe the *shape* of a question rather than its subject.
 *
 * "a free tool to compress an image" should be judged on whether the catalogue
 * covers compressing an image, not on whether it happens to say "free" and
 * "tool" - every entry here is free and every entry here is a tool, so
 * counting them made a perfect answer look like a 50% miss.
 */
const GENERIC_TERMS = new Set([
  "best",
  "thing",
  "thing",
  "page",
  "site",
  "website",
  "online",
  "offline",
  "way",
  "something",
  "anyone",
  "somebody",
  "app",
  "tool",
  "free",
]);

/** The terms a question is actually about, once filler is discounted. */
export function substantiveTerms(terms: string[]): string[] {
  const kept = terms.filter((t) => !GENERIC_TERMS.has(t));
  return kept.length > 0 ? kept : terms;
}

/* ─────────────────────────── chunking ────────────────────────────────── */

/** Longest passage we will ever index or quote from, in words. */
const CHUNK_WORDS = 90;

/**
 * Split into sentences without cutting after an acronym, an initial or a
 * common abbreviation. A naive `(?<=[.!?])\s+(?=[A-Z])` split turns the
 * glossary entry "RAG. Retrieval-Augmented Generation: ..." into a useless
 * "RAG." fragment plus a definition that no longer scores - which is exactly
 * the kind of degenerate citation this feature must never show.
 */
function splitSentences(text: string): string[] {
  const flat = text.replace(/\s+/g, " ").trim();
  if (!flat) return [];
  const out: string[] = [];
  let start = 0;

  for (let i = 0; i < flat.length; i++) {
    const ch = flat[i]!;
    if (ch !== "." && ch !== "!" && ch !== "?") continue;
    let j = i + 1;
    while (j < flat.length && flat[j] === " ") j++;
    if (j >= flat.length) break;
    if (!/[A-Z0-9"'(]/.test(flat[j]!)) continue;

    const head = flat.slice(start, i + 1);
    const lastWord = head.split(/[\s(]/).pop() ?? "";
    const isAcronym = lastWord.length <= 3 && /^[A-Z][A-Za-z]*$/.test(lastWord);
    const isAbbreviation = lastWord.length <= 5 && lastWord.includes(".");
    if (isAcronym || isAbbreviation) continue;

    out.push(head.trim());
    start = j;
    i = j - 1;
  }

  const tail = flat.slice(start).trim();
  if (tail) out.push(tail);
  return out.filter(Boolean);
}

/** Split a body into word-capped passages on sentence boundaries. */
function chunk(text: string, maxWords = CHUNK_WORDS): string[] {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return [];
  const out: string[] = [];
  let current = "";
  let count = 0;
  for (const s of sentences) {
    const words = s.split(/\s+/).length;
    if (current && count + words > maxWords) {
      out.push(current);
      current = "";
      count = 0;
    }
    current = current ? `${current} ${s}` : s;
    count += words;
  }
  if (current) out.push(current);
  return out;
}

/* ─────────────────────────── the corpus ──────────────────────────────── */

let CORPUS: RagDoc[] | null = null;

/**
 * Flatten a section's blocks into plain searchable prose.
 *
 * Code blocks are left out on purpose. A quote has to read like an answer, and
 * a fragment of JSON lifted out of a fenced block is the fastest way to make a
 * citation look like nonsense. The code still lives on the page itself.
 */
function blockText(section: {
  blocks: { type: string; text?: string; items?: string[] }[];
}): string {
  const parts: string[] = [];
  for (const block of section.blocks) {
    if (block.type === "code") continue;
    if (block.text) parts.push(block.text);
    if (block.items) parts.push(block.items.join(" "));
  }
  return parts.join(" ");
}

/** Chunks shorter than this carry no answer, only a heading. */
const MIN_CHUNK_WORDS = 12;

/**
 * Every passage Slash Ask can quote, in one flat list. Built lazily on first
 * use so the ~6,700 passages cost nothing on pages that never ask a question.
 */
export function getCorpus(): RagDoc[] {
  if (CORPUS) return CORPUS;
  const docs: RagDoc[] = [];

  for (const c of COMMANDS) {
    docs.push({
      id: `command:${c.id}`,
      kind: "command",
      title: `${c.command} — ${c.title}`,
      kicker: `${c.category} / ${c.subcategory}`,
      to: `/c/${c.id}`,
      icon: "⌨️",
      body: [c.title, c.description, c.howToUse, c.example, c.tags.join(" ")]
        .filter(Boolean)
        .join(" "),
    });
  }

  for (const post of ALL_BLOG_POSTS) {
    for (const section of post.sections) {
      const text = [section.intro, blockText(section)].filter(Boolean).join(" ");
      if (!text.trim()) continue;
      // The heading already rides in the title and kicker (and is indexed
      // there at a higher weight), so repeating it in the body only gave the
      // quote step a heading fragment to latch onto instead of real prose.
      const pieces = chunk(text).filter((p) => p.split(/\s+/).length >= MIN_CHUNK_WORDS);
      pieces.forEach((piece, i) => {
        docs.push({
          id: `guide:${post.slug}#${section.id}#${i}`,
          kind: "guide",
          title: pieces.length > 1 ? `${post.title} › ${section.heading}` : post.title,
          kicker: `${post.tag} · ${section.heading}`,
          to: `/blog/${post.slug}`,
          icon: post.emoji,
          body: piece,
        });
      });
    }
  }

  for (const t of ALL_SLASH_TOOLS) {
    docs.push({
      id: `tool:${t.slug}`,
      kind: "tool",
      title: t.name,
      kicker: t.desc,
      to: t.hub ? t.slug : `/tools/${t.slug}`,
      icon: t.icon,
      body: `${t.name}. ${t.desc}. Free to use, and it runs in your browser.`,
    });
  }

  for (const t of DECLARATIVE_TOOLS) {
    docs.push({
      id: `tool:${t.slug}`,
      kind: "tool",
      title: t.name,
      kicker: t.desc,
      to: `/tools/${t.slug}`,
      icon: t.icon,
      body: `${t.name}. ${t.desc}. Part of ${t.section}, and it runs in your browser.`,
    });
  }

  for (const g of ALL_PLAY_GAMES) {
    docs.push({
      id: `game:${g.slug}`,
      kind: "game",
      title: g.name,
      kicker: g.desc,
      to: `/play/${g.slug}`,
      icon: g.icon,
      body: `${g.name}. ${g.desc} Play it in the browser - modes: ${g.players}.`,
    });
  }

  for (const t of ALL_GLOSSARY) {
    docs.push({
      id: `glossary:${t.term}`,
      kind: "glossary",
      title: t.term,
      kicker: t.category,
      to: `/glossary`,
      icon: "📚",
      body: `${t.term}. ${t.def}`,
    });
  }

  for (const c of COLLECTIONS) {
    docs.push({
      id: `collection:${c.id}`,
      kind: "collection",
      title: c.title,
      kicker: c.blurb,
      to: `/collections/${c.id}`,
      icon: c.icon,
      body: `${c.title}. ${c.blurb}`,
    });
  }

  for (const t of AI_TOOLS) {
    docs.push({
      id: `aitool:${t.id}`,
      kind: "aitool",
      title: t.name,
      kicker: `${t.vendor} · ${t.pricing}`,
      to: "/ai-tools",
      icon: t.icon,
      body: `${t.name} is a ${t.category} tool by ${t.vendor}. Best for ${t.bestFor}. Free tier: ${t.freeTier}. Pricing: ${t.pricing}, ${t.difficulty} to pick up.`,
    });
  }

  for (const idea of BUILD_IDEAS) {
    docs.push({
      id: `idea:${idea.slug}`,
      kind: "idea",
      title: idea.title,
      kicker: `${idea.category} · ${idea.difficulty}`,
      to: `/build-ideas/${idea.slug}`,
      icon: "💡",
      body: [
        idea.title,
        idea.shortDescription,
        idea.problem,
        idea.targetUsers,
        idea.proposedSolution,
        idea.tags.join(" "),
        idea.techStack.join(" "),
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  for (const a of ALL_SLASH_APPS) {
    docs.push({
      id: `app:${a.slug}`,
      kind: "app",
      title: a.name,
      kicker: a.desc,
      to: a.link ?? `/slash/${a.slug}`,
      icon: a.emoji,
      body: `${a.name}. ${a.desc}`,
    });
  }

  CORPUS = dedupe(docs);
  return CORPUS;
}

/**
 * Last line of defence. The AI-tool directory currently ships three repeated
 * ids, and a duplicate passage id would silently shadow a real citation in the
 * index - so the corpus refuses to hold one.
 */
function dedupe(docs: RagDoc[]): RagDoc[] {
  const seen = new Set<string>();
  const out: RagDoc[] = [];
  for (const d of docs) {
    if (seen.has(d.id)) continue;
    seen.add(d.id);
    out.push(d);
  }
  return out;
}

/** How many passages the retriever can quote from. Shown in the UI, honestly. */
export function corpusSize(): number {
  return getCorpus().length;
}

/**
 * Build the inverted index ahead of the first question.
 *
 * Tokenising every passage takes a few hundred milliseconds, which is fine
 * once but terrible to pay inside the click handler for the first question -
 * the composer would just look frozen. Call this after mount.
 */
export function warmUp(): void {
  getIndex();
}

/* ─────────────────────────── the index ───────────────────────────────── */

const K1 = 1.2;
const B = 0.75;
/** BM25f field weight for the title, which is the strongest signal we have. */
const TITLE_WEIGHT = 5;
/**
 * A flat bonus per query term found in the title, on top of the field weight.
 * Without it a long guide that happens to mention "compress an image" outranks
 * the tool actually called Image Compressor.
 */
const TITLE_HIT = 0.9;

interface Index {
  docs: RagDoc[];
  /** term -> flat [docIdx, tf, docIdx, tf, ...] postings */
  postings: Map<string, number[]>;
  /** terms present in a doc's title */
  titleTerms: Set<string>[];
  len: Float64Array;
  avg: number;
}

let INDEX: Index | null = null;

function buildIndex(): Index {
  const docs = getCorpus();
  const postings = new Map<string, number[]>();
  const titleTerms: Set<string>[] = [];
  const len = new Float64Array(docs.length);
  let total = 0;

  docs.forEach((doc, i) => {
    const counts = new Map<string, number>();
    const add = (terms: string[], weight: number) => {
      for (const t of terms) counts.set(t, (counts.get(t) ?? 0) + weight);
    };
    const title = tokenize(doc.title);
    add(title, TITLE_WEIGHT);
    add(tokenize(doc.kicker), 2);
    add(tokenize(doc.body), 1);
    titleTerms.push(new Set(title));

    let length = 0;
    for (const [term, tf] of counts) {
      length += tf;
      const list = postings.get(term);
      if (list) list.push(i, tf);
      else postings.set(term, [i, tf]);
    }
    len[i] = length;
    total += length;
  });

  return { docs, postings, titleTerms, len, avg: docs.length ? total / docs.length : 1 };
}

function getIndex(): Index {
  INDEX ??= buildIndex();
  return INDEX;
}

/* ─────────────────────────── retrieval ───────────────────────────────── */

export interface RagHit {
  doc: RagDoc;
  score: number;
  /** the query terms this passage actually contains, stemmed */
  matched: string[];
  /** 0..1 - how much of the question this passage accounts for */
  coverage: number;
  /** the verbatim quote that will be shown as the answer */
  quote: string;
}

export interface RetrieveOptions {
  limit?: number;
  kinds?: RagKind[] | undefined;
  /** definitional questions ("what is RAG") lean on the glossary */
  definitional?: boolean | undefined;
}

const DEFINITION_RE = /^\s*(what|whats|who|who's|define|definition|meaning|explain)\b/i;

/**
 * BM25 over the whole corpus. Returns nothing at all rather than a weak match
 * when nothing in the index matches - a near-zero score is worse than an
 * honest "not in the catalogue".
 */
export function retrieve(query: string, options: RetrieveOptions = {}): RagHit[] {
  const { limit = 6, kinds, definitional = DEFINITION_RE.test(query) } = options;
  const terms = contentTerms(query);
  if (terms.length === 0) return [];

  const { docs, postings, titleTerms, len, avg } = getIndex();
  const kindSet = kinds && kinds.length ? new Set(kinds) : null;
  const scores = new Map<number, { score: number; matched: Set<string> }>();
  const glossaryBoost = definitional ? 2.2 : 1;

  for (const term of terms) {
    const list = postings.get(term);
    if (!list) continue;
    const df = list.length / 2;
    // Okapi BM25 idf, floored at a small positive so a term that appears in
    // almost everything can never subtract from the score.
    const idf = Math.max(0.05, Math.log(1 + (docs.length - df + 0.5) / (df + 0.5)));
    for (let p = 0; p < list.length; p += 2) {
      const i = list[p]!;
      const tf = list[p + 1]!;
      const norm = K1 * (1 - B + (B * len[i]!) / avg);
      let contribution = (idf * (tf * (K1 + 1))) / (tf + norm);
      if (titleTerms[i]!.has(term)) contribution += idf * TITLE_HIT;
      if (glossaryBoost !== 1 && docs[i]!.kind === "glossary") contribution *= glossaryBoost;
      const entry = scores.get(i);
      if (entry) {
        entry.score += contribution;
        entry.matched.add(term);
      } else {
        scores.set(i, { score: contribution, matched: new Set([term]) });
      }
    }
  }

  const scored = [...scores.entries()]
    .filter(([i]) => !kindSet || kindSet.has(docs[i]!.kind))
    .map(([i, entry]) => {
      const doc = docs[i]!;
      const substantive = substantiveTerms(terms);
      const hit = substantive.filter((t) => entry.matched.has(t)).length;
      return {
        doc,
        score: entry.score,
        matched: terms.filter((t) => entry.matched.has(t)),
        coverage: substantive.length === 0 ? 0 : hit / substantive.length,
      };
    })
    .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title));

  if (scored.length === 0) return [];

  // A passage that answers one word of a five-word question is not an answer.
  const best = scored[0]!.score;
  const floor = best * 0.12;
  const strong = scored.filter((s) => s.score >= floor);

  return strong.slice(0, limit).map((s) => ({
    ...s,
    quote: bestPassage(s.doc.body, terms, s.matched),
  }));
}

/* ─────────────────────── extractive answers ──────────────────────────── */

const MAX_QUOTE = 320;

/**
 * A window of text centred on the first place a query term appears, snapped to
 * word boundaries. The safety net for sources whose sentences are too coarse
 * to quote on their own.
 */
function windowAround(body: string, wanted: string[], max = MAX_QUOTE): string {
  const lower = body.toLowerCase();
  let at = -1;
  for (const t of wanted) {
    const found = lower.indexOf(t);
    if (found !== -1 && (at === -1 || found < at)) at = found;
  }
  if (at === -1) return body.slice(0, max).trim();

  let start = Math.max(0, at - 40);
  if (start > 0) {
    const sp = body.indexOf(" ", start);
    start = sp === -1 ? start : sp + 1;
  }
  let end = Math.min(body.length, start + max);
  if (end < body.length) {
    const sp = body.lastIndexOf(" ", end);
    if (sp > start) end = sp;
  }
  const prefix = start > 0 ? "… " : "";
  const suffix = end < body.length ? " …" : "";
  return `${prefix}${body.slice(start, end).trim()}${suffix}`;
}

/**
 * Pick the sentences of `body` that best cover `terms` and quote them verbatim.
 * This is the whole trick behind Slash Ask not being able to hallucinate: the
 * answer text is copied out of the source, never written.
 */
export function bestPassage(body: string, terms: string[], matched?: string[]): string {
  const wanted = matched && matched.length ? matched : terms;
  if (wanted.length === 0) return body.slice(0, MAX_QUOTE).trim();

  const sentences = splitSentences(body);
  if (sentences.length <= 1) return windowAround(body, wanted);

  const scored = sentences.map((text, i) => {
    const bag = new Set(tokenize(text));
    let hits = 0;
    for (const t of wanted) if (bag.has(t)) hits += 1;
    return { text, i, hits, score: hits + (hits > 0 ? 0.5 / (1 + i) : 0) };
  });

  // If no single sentence carries the terms, sentence-level quoting would
  // return an orphan fragment. Fall back to a window around the first hit.
  const bestHits = Math.max(...scored.map((s) => s.hits));
  if (bestHits < Math.min(2, wanted.length)) return windowAround(body, wanted);

  const picked: { text: string; i: number }[] = [];
  let length = 0;
  for (const s of scored.filter((s) => s.hits > 0).sort((a, b) => b.score - a.score)) {
    const extra = picked.length ? 1 : 0;
    if (length + s.text.length + extra > MAX_QUOTE) continue;
    picked.push({ text: s.text, i: s.i });
    length += s.text.length + extra;
  }
  if (picked.length === 0) return windowAround(body, wanted);

  picked.sort((a, b) => a.i - b.i);
  let quote = picked.map((p) => p.text).join(" ");
  if (picked[0]!.i > 0) quote = `… ${quote}`;
  if (picked[picked.length - 1]!.i < sentences.length - 1) quote = `${quote} …`;
  return quote;
}

/* ─────────────────────── grounded count facts ────────────────────────── */

export interface RagFact {
  id: string;
  label: string;
  value: number;
  to: string;
  /** matched against the stemmed query tokens */
  keywords: string[];
}

/**
 * Counts the app can state with certainty because they are read off the live
 * catalogue, never hard-coded. "How many commands" gets a real answer with a
 * real link instead of a passage that happens to contain the word "many".
 */
export function countFacts(): RagFact[] {
  return [
    {
      id: "commands",
      label: "slash commands",
      value: VERIFIED_TOTAL,
      to: "/explore",
      keywords: ["command", "slash", "prompt"],
    },
    {
      id: "tools",
      label: "free browser tools",
      value: new Set([
        ...ALL_SLASH_TOOLS.map((t) => t.slug),
        ...DECLARATIVE_TOOLS.map((t) => t.slug),
      ]).size,
      to: "/tools",
      keywords: ["tool", "utilit", "converter", "generator"],
    },
    {
      id: "games",
      label: "browser games",
      value: ALL_PLAY_GAMES.length,
      to: "/play",
      keywords: ["game", "play"],
    },
    {
      id: "guides",
      label: "written guides",
      value: ALL_BLOG_POSTS.length,
      to: "/blog",
      keywords: ["guide", "article", "blog", "post", "read"],
    },
    {
      id: "glossary",
      label: "glossary terms",
      value: GLOSSARY_TOTAL,
      to: "/glossary",
      keywords: ["glossary", "term", "definition", "mean", "meanings"],
    },
    {
      id: "ideas",
      label: "build ideas",
      value: BUILD_IDEAS.length,
      to: "/build-ideas",
      keywords: ["idea", "startup", "mvp", "saas", "business"],
    },
    {
      id: "aitools",
      label: "free-tier AI tools",
      value: AI_TOOLS.length,
      to: "/ai-tools",
      keywords: ["vendor", "app", "software", "aitool", "model"],
    },
    {
      id: "collections",
      label: "curated collections",
      value: COLLECTIONS.length,
      to: "/collections",
      keywords: ["collection", "bundle", "pack"],
    },
  ];
}

const COUNT_RE = /\b(how many|how much|how long|count of|number of|total)\b/i;

function factsFor(query: string): RagFact[] {
  if (!COUNT_RE.test(query)) return [];
  const terms = new Set(contentTerms(query));
  return countFacts().filter((f) => f.keywords.some((k) => terms.has(stem(k))));
}

const nf = new Intl.NumberFormat("en-IN");

/* ─────────────────── conversation query rewriting ────────────────────── */

const ANAPHORA_RE = /\b(it|its|that|those|they|them|these|those|instead|else)\b/i;

export interface RagTurn {
  query: string;
  /** content terms this turn actually found, used to rewrite the next one */
  terms: string[];
}

/**
 * Query expansion for follow-ups. "What about images?" on its own retrieves
 * nothing useful, so it inherits the salient terms of the previous turn -
 * the same rewrite step a server-side RAG pipeline does before retrieval.
 *
 * A question is treated as a follow-up when it is very short (in a chat, a
 * one or two word message almost always leans on the last turn) or when it
 * points backwards with a pronoun. A self-contained question is never touched.
 */
export function expandQuery(
  query: string,
  history: RagTurn[],
): { resolved: string; carried: string[] } {
  const own = contentTerms(query);
  const previous = history[history.length - 1];
  const isFollowUp = own.length <= 2 || ANAPHORA_RE.test(query);
  if (!previous || !isFollowUp) return { resolved: query, carried: [] };

  // Carry the previous turn's rarest terms - the ones that actually narrowed
  // it - and never more than three, or the original question gets buried.
  const carried = previous.terms.filter((t) => !own.includes(t)).slice(0, 3);
  if (carried.length === 0) return { resolved: query, carried: [] };
  return { resolved: `${carried.join(" ")} ${query}`, carried };
}

/* ─────────────────────────── the answer ──────────────────────────────── */

export interface RagCitation {
  n: number;
  doc: RagDoc;
}

export interface RagAnswer {
  query: string;
  /** the query actually sent to the retriever (after follow-up expansion) */
  resolved: string;
  carried: string[];
  /**
   * "grounded" - the catalogue really covers the question.
   * "partial" - something matched, but most of the question is not in here.
   * "gap"     - the catalogue is silent, and the answer says so.
   */
  mode: "grounded" | "partial" | "gap";
  lead: string;
  facts: RagFact[];
  passages: { n: number; text: string; doc: RagDoc }[];
  citations: RagCitation[];
  /** query terms that matched at least one passage */
  covered: string[];
  /** query terms that appear nowhere in the catalogue */
  missing: string[];
  /** total passages in the index, for honest reporting */
  considered: number;
  ms: number;
}

export interface AnswerOptions extends RetrieveOptions {
  history?: RagTurn[] | undefined;
}

/**
 * A question is only "answered" when a passage accounts for most of it.
 * Below this, the honest answer is that SlashAI does not cover the question,
 * with whatever partial match there is shown separately and clearly labelled.
 */
const MIN_COVERAGE = 0.6;

/**
 * Answer a question from the catalogue, or say plainly that it cannot.
 */
export function answerQuery(query: string, options: AnswerOptions = {}): RagAnswer {
  const started = typeof performance === "undefined" ? Date.now() : performance.now();
  const { history = [], limit = 4, kinds, definitional } = options;
  const { resolved, carried } = expandQuery(query, history);
  const terms = contentTerms(resolved);

  const hits = retrieve(resolved, { limit, kinds, definitional });
  const facts = factsFor(resolved);
  const considered = corpusSize();
  const covered = terms.filter((t) => hits.some((h) => h.matched.includes(t)));
  const missing = terms.filter((t) => !covered.includes(t));
  const substantive = substantiveTerms(terms);
  const coveredSubstantive = substantive.filter((t) => covered.includes(t));
  const coverage = substantive.length === 0 ? 0 : coveredSubstantive.length / substantive.length;
  const narrow = hits[0]?.doc;

  const mode: RagAnswer["mode"] =
    hits.length === 0 ? "gap" : coverage < MIN_COVERAGE ? "partial" : "grounded";
  // A partial match is a pointer, not an answer - show fewer of them.
  const shown = mode === "partial" ? hits.slice(0, 2) : hits;

  const citations: RagCitation[] = shown.map((h, i) => ({ n: i + 1, doc: h.doc }));
  const passages = shown.map((h, i) => ({ n: i + 1, text: h.quote, doc: h.doc }));

  const list = (items: string[]) => items.map((t) => `"${t}"`).join(", ");
  let lead: string;

  if (mode === "gap") {
    lead =
      missing.length > 0
        ? `Nothing in SlashAI's catalogue mentions ${list(missing)}. That is a real gap, not a failed search - the retriever scanned all ${nf.format(considered)} passages and found no match.`
        : `No passage in SlashAI's catalogue matches that. Try naming the thing you want to do - a task, a topic, or a tool.`;
  } else if (facts.length > 0) {
    lead = `Straight from the catalogue: ${facts.map((f) => `${nf.format(f.value)} ${f.label}`).join(", ")}.`;
  } else if (mode === "partial") {
    lead =
      `SlashAI does not really cover this. Only ${coveredSubstantive.length} of ${substantive.length} substantive terms in your question` +
      ` ${coveredSubstantive.length === 1 ? "appears" : "appear"} anywhere in the catalogue` +
      `${coveredSubstantive.length > 0 ? ` (${list(coveredSubstantive)})` : ""}` +
      `${narrow ? `. The closest thing in here is "${narrow.title}" - treat it as a lead, not an answer.` : "."}`;
  } else {
    const families = new Set(hits.map((h) => h.doc.kind)).size;
    lead =
      `Found ${hits.length === 1 ? "one passage" : `${hits.length} passages`}` +
      `${families > 1 ? ` across ${families} parts of SlashAI` : ""} that match ${list(terms)}. ` +
      `Everything below is quoted verbatim from those pages.`;
  }

  const ms = (typeof performance === "undefined" ? Date.now() : performance.now()) - started;

  return {
    query,
    resolved,
    carried,
    mode,
    lead,
    facts,
    passages,
    citations,
    covered,
    missing,
    considered,
    ms,
  };
}
