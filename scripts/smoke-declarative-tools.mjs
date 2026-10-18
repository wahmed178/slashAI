/**
 * Smoke test for the declarative toolkit (src/lib/toolkit).
 *
 * Every /tools/<slug> page in the declarative family is data: a catalogue row
 * naming an op, plus the sample the runner feeds it on mount. That makes three
 * silent failure modes possible, and all three ship as a broken page:
 *
 *   1. a row whose `op` is not in the OPS table — the tool renders and then
 *      says "No implementation registered";
 *   2. an op that throws on its own sample (the sample is what users see first);
 *   3. an op that returns an empty string, so the tool looks dead.
 *
 * It also refuses duplicate slugs, because a duplicate makes one of the two
 * tools unreachable (TOOL_BY_SLUG keeps the last one) and silently changes the
 * count printed on /tools.
 *
 * Run: bun scripts/smoke-declarative-tools.mjs
 */
import { readFileSync } from "node:fs";

import { SLASH_TOOL_COUNT } from "../src/lib/slashkits.ts";
import { DECLARATIVE_TOOLS, TOOL_BY_SLUG } from "../src/lib/toolkit/catalog.ts";
import { OPS, NO_INPUT_OPS } from "../src/lib/toolkit/ops.ts";
import { SEO_COUNTS } from "../src/lib/seo-counts.ts";

let failures = 0;
const ok = (cond, msg) => {
  if (cond) return;
  console.log(`  ❌ ${msg}`);
  failures++;
};

const slugCounts = new Map();
for (const tool of DECLARATIVE_TOOLS)
  slugCounts.set(tool.slug, (slugCounts.get(tool.slug) ?? 0) + 1);
const duplicates = [...slugCounts.entries()].filter(([, n]) => n > 1);
ok(duplicates.length === 0, `duplicate slugs: ${duplicates.map(([s]) => s).join(", ")}`);

console.log(
  `── ${DECLARATIVE_TOOLS.length} declarative tools in ${new Set(DECLARATIVE_TOOLS.map((t) => t.section)).size} sections`,
);

const bySection = new Map();
for (const tool of DECLARATIVE_TOOLS) {
  bySection.set(tool.section, (bySection.get(tool.section) ?? 0) + 1);
}
for (const [section, n] of bySection)
  console.log(`     ${section.padEnd(22)} ${String(n).padStart(3)}`);

console.log("\n── every row has a working op, and the op runs on the tool's own sample");

let checked = 0;
for (const tool of DECLARATIVE_TOOLS) {
  const op = OPS[tool.op];
  if (!op) {
    ok(false, `${tool.slug}: no op named "${tool.op}" in the OPS table`);
    continue;
  }
  ok(
    TOOL_BY_SLUG.get(tool.slug) === tool,
    `${tool.slug}: TOOL_BY_SLUG does not resolve this row (duplicate slug?)`,
  );
  ok(tool.name.length > 2, `${tool.slug}: name is too short`);
  ok(tool.desc.length > 10, `${tool.slug}: description is too thin`);
  ok(tool.icon.length > 0, `${tool.slug}: no icon`);

  const options = Object.fromEntries((tool.options ?? []).map((o) => [o.key, o.values[0][0]]));
  for (const option of tool.options ?? []) {
    ok(option.values.length > 0, `${tool.slug}: option "${option.key}" has no values`);
  }

  if (tool.noInput && !NO_INPUT_OPS.has(tool.op)) {
    // Not fatal — NO_INPUT_OPS is advisory — but a no-input tool whose op is
    // missing from that set is usually a copy-paste slip worth checking.
    console.log(`  ⚠ ${tool.slug} is marked noInput but "${tool.op}" is not in NO_INPUT_OPS`);
  }

  try {
    const result = await op(tool.sample ?? "", options);
    ok(
      typeof result === "string",
      `${tool.slug}: op returned ${typeof result} instead of a string`,
    );
    ok(result.trim().length > 0, `${tool.slug}: op produced an empty result`);
    if (/\bNaN\b|undefined|\[object Object\]/.test(result)) {
      ok(
        false,
        `${tool.slug}: op output contains "${result.match(/\bNaN\b|undefined|\[object Object\]/)[0]}"`,
      );
    }
    checked++;
  } catch (e) {
    ok(false, `${tool.slug} (${tool.op}) threw: ${e.message}`);
  }
}

console.log(
  `  ✅ ${checked}/${DECLARATIVE_TOOLS.length} tools ran their own sample and produced output`,
);

/* ── the spec-driven tools added in this batch, checked for real answers ── */

console.log("\n── spot checks on the arithmetic-heavy additions");

/**
 * Run a tool the way the real runner does: the first value of every option is
 * the default, and the caller only overrides what it is testing.
 */
const run = async (slug, input, overrides = {}) => {
  const tool = TOOL_BY_SLUG.get(slug);
  ok(Boolean(tool), `${slug}: not in the catalogue`);
  if (!tool) return "";
  const defaults = Object.fromEntries((tool.options ?? []).map((o) => [o.key, o.values[0][0]]));
  return await OPS[tool.op](input, { ...defaults, ...overrides });
};

ok((await run("number-base", "255")).includes("0xFF"), "number-base: 255 should be 0xFF");
ok(
  (await run("number-base", "0b1010")).startsWith("decimal   10"),
  "number-base: 0b1010 should be 10",
);
ok((await run("px-rem", "16")).includes("1rem"), "px-rem: 16px at a 16px root should be 1rem");
ok(
  (await run("px-rem", "1", { direction: "rem2px" })).includes("16px"),
  "px-rem: 1rem should be 16px",
);
ok(
  (await run("colour-mix", "#000000 #ffffff")).includes("#808080"),
  "colour-mix: black + white at 50% should be #808080",
);
ok(
  (await run("duration-format", "3725")).startsWith("01:02:05"),
  "duration-format: 3725s should be 01:02:05",
);
ok(
  (await run("duration-format", "90061")).startsWith("1:01:01:01"),
  "duration-format: 90061s should show days in the clock",
);
ok(
  (await run("duration-format", "90", { unit: "minutes" })).startsWith("01:30:00"),
  "duration-format: 90 minutes should be 01:30:00",
);
ok(
  (await run("basic-auth", "user:pass")).includes("dXNlcjpwYXNz"),
  "basic-auth: user:pass should encode to dXNlcjpwYXNz",
);
ok(
  (await run("password-strength", "1234")).includes("very weak"),
  "password-strength: 1234 should be very weak",
);
ok((await run("http-status", "404")).includes("Not Found"), "http-status: 404 should be Not Found");
ok(
  (await run("json-paths", '{"a":{"b":[1,2]}}')).includes("a.b[1]"),
  "json-paths: should list a.b[1]",
);
ok(
  (await run("json-schema", '{"n":1}')).includes('"type": "integer"'),
  "json-schema: 1 should infer integer",
);
ok((await run("hmac", "key\nmessage")).length > 40, "hmac: should produce a signature");
ok(
  (await run("ulid-generator", "", { count: "3" })).length > 26,
  "ulid-generator: should produce IDs",
);
ok(
  /^[0-9A-HJKMNP-TV-Z]{26}$/.test((await run("ulid-generator", "", { count: "3" })).split("\n")[0]),
  "ulid-generator: first line should be a 26-character Crockford ULID",
);
ok(
  (await run("curl-to-fetch", 'curl https://a.test -H "X-A: 1"')).includes(
    'fetch("https://a.test"',
  ),
  "curl-to-fetch: should emit fetch()",
);
ok(
  (await run("curl-to-fetch", 'curl -X POST https://a.test -d "{\\"n\\":1}"')).includes(
    'body: {"n":1}',
  ),
  "curl-to-fetch: a double-quoted JSON body should stay valid JSON",
);
ok(
  (await run("hmac", "key\nmessage")).includes(
    "base64  bp7ym3X//Ft6uuUn1Y/a2y/kLnIZARl2kXNDBl9Y7Uo=",
  ),
  "hmac: base64 should be the raw digest bytes, not a UTF-8 re-encoding",
);
ok(
  (await run("dotenv-to-json", 'A=1\nB="2"')).includes('"A": "1"'),
  "dotenv-to-json: should keep unquoted values as text",
);
ok(
  (await run("markdown-table-to-csv", "| a | b |\n| --- | --- |\n| 1 | 2 |")) === "a,b\n1,2",
  "markdown-table-to-csv: should emit a,b / 1,2",
);
ok(
  (await run("utm-builder", "https://slashai.in/tools\nsource=news")).startsWith(
    "https://slashai.in/tools?utm_source=news",
  ),
  "utm-builder: should tag utm_source",
);
ok(
  (await run("seo-title-audit", "Too short\nToo short")).includes("duplicate"),
  "seo-title-audit: should flag duplicates",
);
ok(
  (await run("date-in-zones", "2026-10-18T09:00:00Z")).includes("Asia/Kolkata"),
  "date-in-zones: should list Asia/Kolkata",
);
ok(
  (await run("css-specificity", "#a .b")).includes("(1,1,0)"),
  "css-specificity: #a .b should be (1,1,0)",
);
ok(
  (await run("data-uri", "hi", { mime: "text/plain", encoding: "percent" })).includes(
    "data:text/plain,hi",
  ),
  "data-uri: percent encoding should be readable",
);
ok(
  (await run("smart-quotes", 'He said "hi"')).includes("\u201C"),
  "smart-quotes: should open with a curly quote",
);
ok(
  (await run("strip-markdown", "# Title\n**bold**")).includes("Title") &&
    !(await run("strip-markdown", "# Title\n**bold**")).includes("**"),
  "strip-markdown: should drop syntax",
);
ok(
  (await run("split-chunks", "a ".repeat(100), { length: "160" })).includes("1/"),
  "split-chunks: should number the chunks",
);

/* ── the sitemap and the printed counts must include all of them ──────
   A tool can exist, work, and still be invisible: public/sitemap.xml is
   generated from this catalogue plus the authored route files, and
   seo-counts.ts feeds every number the UI prints. That broke for real — a
   formatter wrapped the catalogue rows onto several lines, the generator's
   text regex stopped matching, and 153 tool URLs silently vanished from the
   sitemap. Both are asserted here so the next format change fails loudly. */

console.log("\n── sitemap + printed counts");
{
  const sitemap = readFileSync("public/sitemap.xml", "utf8");
  const listed = new Set(
    [...sitemap.matchAll(/<loc>https:\/\/slashai\.in\/tools\/([a-z0-9-]+)<\/loc>/g)].map(
      (m) => m[1],
    ),
  );
  const missing = DECLARATIVE_TOOLS.filter((t) => !listed.has(t.slug));
  ok(
    missing.length === 0,
    `sitemap is missing ${missing.length} declarative tool pages: ${missing
      .slice(0, 5)
      .map((t) => t.slug)
      .join(", ")}`,
  );
  ok(
    SEO_COUNTS.tools === SLASH_TOOL_COUNT + DECLARATIVE_TOOLS.length,
    `seo-counts says ${SEO_COUNTS.tools} tools, but the catalogues add up to ${SLASH_TOOL_COUNT + DECLARATIVE_TOOLS.length}`,
  );
  ok(
    listed.size === SEO_COUNTS.tools + 1,
    `sitemap lists ${listed.size} tool pages (including /tools itself), expected ${SEO_COUNTS.tools + 1}`,
  );
  console.log(
    `  ✅ ${missing.length === 0 ? "all" : "some"} ${DECLARATIVE_TOOLS.length} declarative pages in the sitemap · ${listed.size} tool pages total`,
  );
}

console.log(
  failures === 0 ? "\n✅ declarative toolkit smoke passed" : `\n❌ ${failures} problem(s)`,
);
process.exit(failures === 0 ? 0 : 1);
