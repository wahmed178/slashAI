/**
 * Smoke test for the "Shorten link" feature.
 *
 * Covers the pure URL logic in lib/shorten and renders the actual popup, so a
 * change that starts mangling links or breaks the dialog fails here rather than
 * when someone tries to share something.
 *
 * Run: bun scripts/smoke-shorten.mjs
 */
import { createRequire } from "node:module";

/**
 * Pin react and react-dom/server to the project's copies. Importing them
 * normally pulls a second React out of the global cache, and the hooks in the
 * popup then blow up with "resolveDispatcher().useState".
 */
const req = createRequire(new URL("../package.json", import.meta.url).pathname);
const React = req("react");
const { renderToStaticMarkup } = req("react-dom/server");

let failures = 0;
const ok = (cond, msg) => {
  if (cond) console.log(`  ✅ ${msg}`);
  else {
    console.log(`  ❌ ${msg}`);
    failures++;
  }
};

const { shortenUrl, savedSummary } = await import("../src/lib/shorten.ts");

console.log("\nShorten — the classic tracking link");
{
  const r = shortenUrl(
    "https://www.slashai.in/tools/bouquet?utm_source=whatsapp&utm_medium=social&utm_campaign=flowers&fbclid=abc123",
  );
  ok(r.changed, "a tracking-heavy link is shortened");
  ok(r.url === "https://slashai.in/tools/bouquet", `result is clean (${r.url})`);
  ok(
    r.removed.join(",") === "utm_source,utm_medium,utm_campaign,fbclid",
    `it names what it removed (${r.removed.join(", ")})`,
  );
  ok(r.saved > 0, `it saved ${r.saved} characters`);
  ok(savedSummary(r).includes("shorter"), `summary reads well ("${savedSummary(r)}")`);
}

console.log("\nShorten — it must not break a link");
{
  // real parameters survive
  const r = shortenUrl("https://slashai.in/search?q=prompt+engineering&utm_source=x");
  ok(r.url.includes("q=prompt+engineering"), `a real query survives (${r.url})`);
  ok(!r.url.includes("utm_source"), "…and the tracker still goes");

  // the fragment is the bouquet. Losing it loses the gift.
  const hash = "v2.blush.crimson.cone.classic.111.rose~0,peony~2";
  const frag = shortenUrl(`https://slashai.in/tools/bouquet#${hash}`);
  ok(frag.url.endsWith(`#${hash}`), "a fragment is never discarded");
  ok(!frag.changed, "an already-clean link is left byte-for-byte alone");
  // the current share form puts the code in the path
  const path = shortenUrl(`https://slashai.in/tools/bouquet/${hash}?utm_source=wa`);
  ok(path.url === `https://slashai.in/tools/bouquet/${hash}`, `path code survives (${path.url})`);

  ok(
    shortenUrl("HTTPS://SlashAI.In/Tools/").url === "https://slashai.in/Tools",
    "host lowercased, www and trailing slash dropped",
  );
  ok(
    shortenUrl("https://slashai.in:443/play/snake").url === "https://slashai.in/play/snake",
    "the default port is dropped",
  );
  ok(
    shortenUrl("https://slashai.in//tools///meta").url === "https://slashai.in/tools/meta",
    "duplicate slashes collapse",
  );
  const bare = shortenUrl("slashai.in/tools/meta");
  ok(bare.url === "https://slashai.in/tools/meta", "a bare host gets https://");
  ok(
    savedSummary(bare) === "Tidied up — nothing left to trim",
    "a bare host does not claim a saving",
  );
}

console.log("\nShorten — honest about doing nothing");
{
  const r = shortenUrl("https://slashai.in/play/snake");
  ok(!r.changed && r.saved === 0, "a clean link reports no change");
  ok(savedSummary(r) === "Already as short as it gets", "and says so in words");
}

console.log("\nShorten — rubbish in, nothing mangled");
{
  for (const bad of [
    "",
    "   ",
    "hello world",
    "not a url",
    "javascript:alert(1)",
    "mailto:a@b.com",
  ]) {
    const r = shortenUrl(bad);
    ok(r.invalid, `rejected: ${JSON.stringify(bad)}`);
    ok(r.url === bad.trim(), `…and left untouched: ${JSON.stringify(bad)}`);
  }
}

console.log("\nShorten — the popup");
{
  const { ShortenProvider } = await import("../src/components/library/shorten-context.tsx");
  const render = (url) =>
    renderToStaticMarkup(
      React.createElement(
        ShortenProvider,
        { initialUrl: url },
        React.createElement("span", null, "page"),
      ),
    );

  const h = render(
    "https://www.slashai.in/tools/bouquet?utm_source=whatsapp&utm_medium=social&fbclid=xyz",
  );
  ok(h.includes("Shorten a link"), "the popup renders its heading");
  ok(/\d+ characters shorter \(\d+%\)/.test(h), "it reports the real saving");
  ok(h.includes("Copy short link") && h.includes("Test it"), "copy and test actions are present");
  ok(h.includes("page"), "the page underneath still renders");
  ok(h.includes("utm_source") && h.includes("fbclid"), "it shows which parameters it dropped");
  // the input keeps what was pasted, and nowhere else repeats it
  const original =
    "https://www.slashai.in/tools/bouquet?utm_source=whatsapp&amp;utm_medium=social&amp;fbclid=xyz";
  ok(h.includes(`value="${original}"`), "the input still shows what the user pasted");
  ok(h.split(original).length - 1 === 1, "the unshortened link appears only in the input");
  ok(h.includes("https://slashai.in/tools/bouquet<"), "the shortened link is offered");

  ok(
    render("https://slashai.in/play/snake").includes("Already as short as it gets"),
    "a clean link is not oversold",
  );
  ok(render("hello world").includes("does not look like a link"), "nonsense is called out");

  const closed = renderToStaticMarkup(
    React.createElement(ShortenProvider, null, React.createElement("span", null, "page")),
  );
  ok(
    !closed.includes("Shorten a link"),
    "the popup is closed by default — it is not always on screen",
  );
  ok(closed.includes("page"), "…and the page still renders when it is closed");
}

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
