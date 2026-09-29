/**
 * Smoke test for the Slash Ask retriever (src/lib/rag.ts).
 *
 * The feature's whole promise is that answers are grounded and never invented,
 * so this checks the three ways that promise can break:
 *
 *   1. Retrieval - a question about a real command, tool, game or glossary
 *      term must find that exact record, and the ranking must be stable.
 *   2. Extractive answers - every returned "quote" must appear verbatim in the
 *      passage it cites. If this fails, the retriever has started paraphrasing,
 *      which is the one thing this feature is not allowed to do.
 *   3. Honesty - a question the catalogue cannot answer must come back as a
 *      gap with named missing terms, never as a confident wrong answer.
 *
 * Also pins the index invariants (unique ids, no empty bodies) and the BM25
 * maths, because a broken idf silently turns every query into noise.
 *
 * Run: bun scripts/smoke-rag.mjs
 */
let failures = 0;
const ok = (cond, msg) => {
  if (cond) return;
  console.log(`  ❌ ${msg}`);
  failures++;
};
const group = (name) => console.log(`\n── ${name}`);

const R = await import("../src/lib/rag.ts");

/* ── index invariants ────────────────────────────────────────────────── */

group("corpus");
const corpus = R.getCorpus();
ok(corpus.length > 6000, `expected a corpus of 6000+ passages, got ${corpus.length}`);

const ids = new Set();
for (const d of corpus) {
  if (ids.has(d.id)) ok(false, `duplicate passage id: ${d.id}`);
  ids.add(d.id);
  if (!d.body.trim()) ok(false, `empty body: ${d.id}`);
  if (!d.to.startsWith("/")) ok(false, `bad link on ${d.id}: ${d.to}`);
  if (!d.title.trim()) ok(false, `empty title: ${d.id}`);
}
ok(ids.size === corpus.length, "passage ids must be unique");
ok(
  corpus.every((d) => R.tokenize(d.body).length > 0),
  "every passage must index at least one term",
);

const kinds = new Set(corpus.map((d) => d.kind));
for (const k of [
  "command",
  "guide",
  "tool",
  "game",
  "glossary",
  "collection",
  "aitool",
  "idea",
  "app",
]) {
  ok(kinds.has(k), `corpus is missing the "${k}" family`);
}

const guideChunks = corpus.filter((d) => d.id.startsWith("guide:"));
ok(
  guideChunks.length > 60,
  `guides should be chunked into many passages, got ${guideChunks.length}`,
);
ok(
  guideChunks.every((d) => d.id.split("#").length === 3),
  "every guide chunk id should carry post, section and chunk index",
);

/* ── tokenising ──────────────────────────────────────────────────────── */

group("tokenizer");
ok(R.tokenize("How do I chain AI prompts?")[0] === "chain", "stemming should drop the plural");
ok(!R.tokenize("what is the best way to do this").includes("the"), "stopwords must be dropped");
ok(R.tokenize("embeddings").includes("embed"), "'embeddings' should stem to 'embed'");
ok(R.contentTerms("RAG retrieval augmented generation").length === 4, "content terms de-duplicate");
ok(
  R.contentTerms("summarise summarise summarise").length === 1,
  "a repeated word collapses to one term",
);
ok(R.tokenize("!!! ??? ---").length === 0, "punctuation-only input yields no terms");
ok(R.tokenize("").length === 0, "empty input yields no terms");

// a word and its inflections must land on one stem, or they cannot find
// each other in the index - the bug that made "compress" miss "compressing"
const sameStem = (a, b) => R.stem(a) === R.stem(b);
for (const [a, b] of [
  ["compress", "compressed"],
  ["compress", "compressing"],
  ["image", "images"],
  ["file", "files"],
  ["query", "queries"],
  ["search", "searches"],
  ["upscale", "upscaling"],
  ["play", "plays"],
  ["answer", "answers"],
  ["tool", "tools"],
  ["embeddings", "embedding"],
]) {
  ok(sameStem(a, b), `"${a}" and "${b}" should share a stem, got ${R.stem(a)} / ${R.stem(b)}`);
}
ok(R.stem("relational") === "relat", "Porter step 4 should drop -ational");
ok(R.stem("matting") === "mat", "a doubled consonant left by -ing should collapse");
ok(R.stem("ponies") === "poni", "-ies should become -i, not vanish");

/* ── retrieval finds the right record ────────────────────────────────── */

group("retrieval");

const summarize = R.retrieve("summarize a long document", { limit: 5 });
ok(summarize.length > 0, "expected hits for 'summarize a long document'");
ok(
  summarize.some((h) => h.doc.kind === "command" && /summar/i.test(h.doc.title)),
  "a summarising command should be retrieved",
);
ok(
  summarize.every((h) => h.score > 0),
  "no hit may score zero or less",
);
for (let i = 1; i < summarize.length; i++) {
  ok(summarize[i - 1].score >= summarize[i].score, "hits must come back ranked by score");
}

const again = R.retrieve("summarize a long document", { limit: 5 });
ok(
  again.map((h) => h.doc.id).join("|") === summarize.map((h) => h.doc.id).join("|"),
  "retrieval must be deterministic across identical queries",
);

const pool = R.retrieve("cricket", { limit: 8 });
ok(
  pool.some((h) => h.doc.kind === "game"),
  "a game should be retrieved for 'cricket'",
);
ok(
  pool.filter((h) => /cricket/i.test(h.doc.title)).length >= 3,
  "the cricket games should dominate a cricket query",
);

const glossary = R.retrieve("what is a vector database", { limit: 3, definitional: true });
ok(
  glossary[0]?.doc.kind === "glossary",
  `a definitional question should lead with the glossary, got ${glossary[0]?.doc.kind}`,
);

// a kind filter must be honoured
const onlyGames = R.retrieve("puzzle game", { limit: 5, kinds: ["game"] });
ok(
  onlyGames.every((h) => h.doc.kind === "game"),
  "the kinds filter must exclude other families",
);

// nonsense that cannot be in a catalogue of AI commands
ok(
  R.retrieve("zzzzqqqqxxxx").length === 0,
  "an unmatched query must return no hits, not weak ones",
);

// stopword-only input is a no-op, not a full scan
ok(R.retrieve("what is the").length === 0, "a query of only stopwords must not match anything");

/* ── answers quote their sources verbatim ────────────────────────────── */

group("answers");

const a1 = R.answerQuery("how do I chain AI prompts");
ok(a1.mode === "grounded", `'how do I chain AI prompts' should be answerable, got ${a1.mode}`);
ok(a1.passages.length > 0, "expected at least one quoted passage");
ok(a1.citations.length === a1.passages.length, "every passage needs a citation");
ok(
  a1.passages.every((p) => p.n === a1.passages.indexOf(p) + 1),
  "citations must be numbered 1..n in order",
);
for (const p of a1.passages) {
  const source = corpus.find((d) => d.id === p.doc.id);
  ok(!!source, `citation ${p.n} points at a passage that is not in the corpus`);
  const normalise = (s) => s.replace(/…/g, "").replace(/\s+/g, " ").trim();
  ok(
    normalise(p.text)
      .split(". ")
      .every((s) => !s || normalise(source.body).includes(s)),
    `quote ${p.n} is not verbatim in its source passage`,
  );
  ok(p.text.length <= 360, `quote ${p.n} should stay short, got ${p.text.length} chars`);
}
ok(a1.considered === corpus.length, "the answer should report the real corpus size");
ok(
  a1.missing.length === 0,
  `"how do I chain AI prompts" should miss no terms, missed ${a1.missing}`,
);
ok(a1.lead.includes("verbatim"), "the lead should say the passages are quoted");

// factual counts come from the live catalogue
const counts = R.answerQuery("how many commands are there");
ok(counts.facts.length > 0, "'how many commands' should resolve to a count fact");
const commandFact = counts.facts.find((f) => f.id === "commands");
ok(!!commandFact, "expected a 'commands' count fact");
ok(commandFact.value > 5000, `command count looks wrong: ${commandFact.value}`);
ok(
  counts.lead.includes("Straight from the catalogue"),
  "a pure count question should be answered from the catalogue, not from a passage",
);

// definitional questions should surface a definition
const def = R.answerQuery("what is RAG");
ok(
  def.passages.some((p) => p.doc.kind === "glossary"),
  "RAG should hit the glossary",
);
ok(
  def.passages.some((p) => /retrieval/i.test(p.text)),
  "the RAG glossary entry should mention retrieval",
);

/* ── honesty: gaps are gaps ──────────────────────────────────────────── */

group("gaps");
const gap = R.answerQuery("recommend a good dentist in poland");
ok(
  gap.mode === "partial",
  `a barely-related question must not be reported as an answer, got ${gap.mode}`,
);
ok(gap.passages.length <= 2, "a partial match should show at most a couple of pointers");
ok(gap.lead.includes("does not really cover this"), "the partial lead must admit the gap");
ok(gap.missing.includes("dentist"), "the missing terms should be named");
ok(gap.facts.length === 0, "a gap should not attach unrelated count facts");

// nothing at all in the catalogue: a real gap, and not one word invented
const void_ = R.answerQuery("zzzzqqqqxxxx");
ok(void_.mode === "gap", `an unmatched question must be a gap, got ${void_.mode}`);
ok(void_.passages.length === 0, "a gap must not invent passages");
ok(void_.citations.length === 0, "a gap must not invent citations");
ok(
  void_.lead.includes("real gap"),
  "the gap lead should be explicit that this is not a failed search",
);
ok(void_.missing.includes("zzzzqqqqxxxx"), "a gap should name the term that matched nothing");

/* ── conversation: follow-ups inherit context ────────────────────────── */

group("conversation");
const first = R.answerQuery("how do I chain AI prompts");
const turn = { query: first.query, terms: first.covered };
ok(turn.terms.length > 0, "the first turn should record the terms it covered");

const followUp = R.expandQuery("what about errors", [turn]);
ok(followUp.carried.length > 0, "a follow-up should carry terms from the previous turn");
ok(
  followUp.resolved.startsWith(followUp.carried.join(" ")),
  "carried terms lead the expanded query",
);
ok(followUp.resolved.endsWith("what about errors"), "the new question must stay intact");

// a fresh, self-contained question must NOT be polluted by history
const fresh = R.expandQuery("how do I convert json to yaml", [turn]);
ok(fresh.carried.length === 0, "a self-contained question should not inherit history");
ok(fresh.resolved === "how do I convert json to yaml", "a self-contained question is untouched");

// a one-word follow-up should still retrieve something
const pronoun = R.answerQuery("images", {
  history: [{ query: "image upscaling", terms: R.contentTerms("image upscaling") }],
});
ok(
  pronoun.resolved.split(/\s+/).length > 1,
  `a one-word follow-up should be expanded before retrieval, got "${pronoun.resolved}"`,
);
ok(
  pronoun.carried.length > 0 && pronoun.resolved.includes(pronoun.carried[0]),
  "the carried terms should lead the expanded query",
);
ok(pronoun.mode === "grounded", "the expanded follow-up should find passages");

/* ── BM25 behaviour ──────────────────────────────────────────────────── */

group("bm25");
const rare = R.retrieve("tambola", { limit: 3 });
const common = R.retrieve("text", { limit: 3 });
ok(rare.length > 0, "a rare term should still retrieve");
ok(
  rare[0].score > common[common.length - 1].score,
  "a rare term should out-score a term that appears everywhere",
);
ok(
  R.retrieve("text", { limit: 3 }).every((h) => h.coverage > 0 && h.coverage <= 1),
  "coverage must be a 0..1 ratio",
);

const partial = R.retrieve("chain prompts for a legal contract review", { limit: 5 });
ok(
  partial.length > 0,
  "a partially-matched question should still return the passages it can support",
);
ok(
  partial[0].coverage < 1,
  "a long question should not be reported as fully covered by one passage",
);

if (failures === 0) {
  console.log(`\n✅ rag: all checks passed (${corpus.length} passages indexed)`);
} else {
  console.log(`\n❌ rag: ${failures} check(s) failed`);
}
process.exit(failures ? 1 : 0);
