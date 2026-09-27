/**
 * Runtime smoke test for the brain-training games and the Slash English
 * academy. It pulls the pure logic out of the route modules and plays a few
 * hundred rounds, so a broken staircase or a NaN score fails here instead of
 * in someone's browser.
 *
 * Run: bun scripts/smoke-brain-games.mjs
 */
import { readFileSync } from "node:fs";

/** Names each file contributes to the test. */
const TARGETS = {
  "src/routes/play.n-back.tsx": ["buildSequence", "zFromRate", "STIMULI"],
  "src/routes/play.go-no-go.tsx": ["zFromRate"],
  "src/routes/play.stop-the-color.tsx": ["COLORS"],
  "src/routes/english.tsx": ["checkGrammar", "RULES", "VOCAB", "PASSAGES"],
};

const transpiler = new Bun.Transpiler({ loader: "tsx", target: "bun" });
/**
 * Strips the framework shell (JSX, hooks, router registration) and evaluates
 * only the plain data + functions, so the test needs no DOM.
 */
async function load(path) {
  const names = TARGETS[path];
  const src = readFileSync(path, "utf8");
  let js = transpiler.transformSync(src);

  js = js
    .replace(/^import[\s\S]*?from\s*["'][^"']+["'];?$/gm, "")
    .replace(/export const Route = createFileRoute\([\s\S]*?^\}\);$/m, "")
    .replace(/createFileRoute\([^)]*\)\(\{[\s\S]*?^\}\)/m, "({})")
    // React hooks never run; stub them so the module body evaluates.
    .replace(/\b(useState|useRef|useMemo|useCallback|useEffect)\b/g, "__hook_$1")
    .replace(/^export /gm, "");

  const body = `${js}\n;return { ${names.join(", ")} };`;
  const fn = new Function(
    "__hook_useState",
    "__hook_useRef",
    "__hook_useMemo",
    "__hook_useCallback",
    "__hook_useEffect",
    "createFileRoute",
    "AppShell",
    body,
  );
  const stubHook = () => {
    throw new Error("a hook ran at module scope - the test only wants pure logic");
  };
  return fn(
    stubHook,
    stubHook,
    stubHook,
    stubHook,
    stubHook,
    () => ({}),
    () => null,
  );
}

let failures = 0;
const ok = (cond, msg) => {
  if (cond) console.log(`  ✅ ${msg}`);
  else {
    console.log(`  ❌ ${msg}`);
    failures++;
  }
};

console.log("\nSnake");
{
  // a plain module, not a route — imported directly
  const m = await import("../src/lib/games/snake.ts");
  const { SIZE, advance, collides, scoreOf, spawnFood, startSnake, turn } = m;

  ok(startSnake().length === 4, "the snake starts four segments long");
  ok(
    startSnake().every((p) => p.x >= 0 && p.x < SIZE && p.y >= 0 && p.y < SIZE),
    "the snake starts inside the board",
  );

  // the reported bug: a wall must wrap, never kill
  const edges = [
    ["left", { x: 0, y: 3 }],
    ["right", { x: SIZE - 1, y: 3 }],
    ["up", { x: 3, y: 0 }],
    ["down", { x: 3, y: SIZE - 1 }],
  ];
  let wraps = true;
  for (const [dir, pos] of edges) {
    const t = advance([pos], dir, { x: 5, y: 5 });
    const h = t.body[0];
    if (t.dead || h.x < 0 || h.x >= SIZE || h.y < 0 || h.y >= SIZE) wraps = false;
  }
  ok(wraps, "running into any wall wraps instead of killing");

  // a full lap of the board must survive
  let b = [{ x: 2, y: 2 }];
  for (let i = 0; i < SIZE * 4; i++) b = advance(b, "right", null).body;
  ok(b[0].x === 2 && b[0].y === 2, "four laps of the board survive the wrap");

  // self-collision is still fatal
  const ring = [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 3, y: 2 },
    { x: 2, y: 2 },
    { x: 1, y: 2 },
  ];
  ok(collides(ring, { x: 2, y: 1 }), "the head landing on the body is a hit");
  ok(advance(ring, "right", null).dead, "self-collision ends the run");
  ok(!collides(ring, ring[ring.length - 1]), "the vacated tail cell is safe to enter");

  ok(turn("right", "left") === "right", "the snake cannot reverse into itself");
  ok(turn("right", "up") === "up", "a 90° turn is allowed");

  const ate = advance(startSnake(), "right", { x: 10, y: 9 });
  ok(ate.body.length === 5 && !ate.dead, "eating grows the snake by one");
  ok(scoreOf(ate.body) === 1, "the score counts food eaten");
  ok(scoreOf(startSnake()) === 0, "the score starts at zero");

  const full = [];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) full.push({ x, y });
  ok(spawnFood(full) === null, "a full board has nowhere left to put food");

  let clean = true;
  for (let i = 0; i < 200; i++) {
    const f = spawnFood(startSnake());
    if (!f || startSnake().some((s) => s.x === f.x && s.y === f.y)) clean = false;
  }
  ok(clean, "200 spawns all land on a free cell");
}

console.log("\nN-Back");
{
  const m = await load("src/routes/play.n-back.tsx");
  let targets = 0;
  let valid = true;
  for (let run = 0; run < 400; run++) {
    const n = [1, 2, 3][run % 3];
    const seq = m.buildSequence(n, 24);
    if (seq.length !== 24) valid = false;
    for (const s of seq) if (!m.STIMULI.includes(s)) valid = false;
    for (let i = n; i < 24; i++) if (seq[i] === seq[i - n]) targets++;
  }
  ok(valid, "400 generated blocks are all 24 valid stimuli");
  const rate = targets / 400 / 22;
  ok(rate > 0.3 && rate < 0.6, `target rate sits near 45% (got ${(rate * 100).toFixed(0)}%)`);

  ok(Math.abs(m.zFromRate(0.5)) < 0.001, "z(0.5) === 0");
  ok(m.zFromRate(0.9) > 1.2, "z(0.9) > 1.2 (upper tail correct)");
  ok(m.zFromRate(0.1) < -1.2, "z(0.1) < -1.2 (lower tail correct)");
  ok(
    Number.isFinite(m.zFromRate(0)) && Number.isFinite(m.zFromRate(1)),
    "z(0) and z(1) stay finite (clamped)",
  );
}

console.log("\nGo / No-Go");
{
  const m = await load("src/routes/play.go-no-go.tsx");
  ok(Math.abs(m.zFromRate(0.5)) < 0.001, "z(0.5) === 0");
  ok(m.zFromRate(0.95) > 1.6, "z(0.95) > 1.6");
  ok(Number.isFinite(m.zFromRate(0.999)), "no NaN at the clamp boundary");
}

console.log("\nStop the Color");
{
  const m = await load("src/routes/play.stop-the-color.tsx");
  ok(m.COLORS.length === 8, "8 ink colours registered");
  const hexes = new Set(m.COLORS.map((c) => c.hex));
  ok(hexes.size === 8, "every ink hex is unique");
  ok(
    m.COLORS.every((c) => /^#[0-9a-f]{6}$/.test(c.hex)),
    "all inks are valid 6-digit hex",
  );
}

console.log("\nSlash English");
{
  const m = await load("src/routes/english.tsx");

  ok(m.VOCAB.length >= 100, `${m.VOCAB.length} vocabulary words loaded`);
  const words = m.VOCAB.map((v) => v.w);
  ok(new Set(words).size === words.length, "no duplicate vocabulary entries");
  ok(
    m.VOCAB.every((v) => v.def.length > 15 && v.pos),
    "every word has a part of speech and a real definition",
  );

  ok(m.PASSAGES.length >= 3, `${m.PASSAGES.length} reading passages`);
  for (const p of m.PASSAGES) {
    ok(p.qs.length === 3, `"${p.title}" has 3 questions`);
    ok(
      p.qs.every((q) => q.answer >= 0 && q.answer < q.options.length),
      `"${p.title}" answers are in range`,
    );
    ok(new Set(p.qs[0].options).size === 4, `"${p.title}" options are distinct`);
  }

  const cases = [
    ["i dont have alot of time", "I don't have a lot of time"],
    ["definately not", "definitely not"],
    ["He are coming here .", "He is coming here."],
    ["more people then less", "more people than less"],
    ["could of been", "could have been"],
    ["Your welcome to come", "You're welcome to come"],
    ["irregardless of that", "regardless of that"],
  ];
  for (const [input, want] of cases) {
    const got = m.checkGrammar(input).fixed;
    ok(got.toLowerCase() === want.toLowerCase(), `"${input}" → "${got}"`);
  }

  const clean = "The committee agreed that the results were clear and the data was sufficient.";
  ok(
    m.checkGrammar(clean).issues.length === 0,
    "correct English produces zero issues (no false positives)",
  );

  const articles = [
    ["a apple", "an apple"],
    ["an book", "a book"],
    ["a hour", "an hour"],
    ["an university", "a university"],
    ["a honest mistake", "an honest mistake"],
    ["a European plan", "a European plan"],
  ];
  for (const [input, want] of articles) {
    const got = m.checkGrammar(input).fixed;
    ok(got.toLowerCase() === want.toLowerCase(), `"${input}" → "${got}"`);
  }

  const dense = m.checkGrammar(
    "i dont have alot of time and definately not enough , less people then me .",
  );
  ok(dense.issues.length >= 5, `dense bad input flags ${dense.issues.length} distinct issues`);
  ok(
    m.RULES.every((r) => r.note.length > 30 && r.label),
    "every rule has a label and a real explanation",
  );
}

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
