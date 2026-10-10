/**
 * Browser smoke test for the search surfaces.
 *
 * Regression guard for the 2.36.1 freeze: the client rendered a whole second
 * document (<html>/<head>/<body>) inside its own #root container, so the
 * browser's `selectionchange` event - fired the moment a search input takes
 * focus - sent React's event system into an endless listener walk at 100% CPU.
 * /search, /find and /tools/finder, and any focus in the homepage search box,
 * froze the tab permanently.
 *
 * For every search surface it checks that
 *   1. the page still answers evaluate() after load (it never did while frozen),
 *   2. the search input is focused on arrival (autoFocus still works),
 *   3. focusing + typing in the homepage search box keeps the page responsive
 *      and still renders the suggestion panel.
 *
 * Run: bun scripts/smoke-search-focus.mjs [baseUrl]
 *      BASE_URL=https://slashai.freebuff.app bun scripts/smoke-search-focus.mjs
 */
import { chromium } from "playwright";

const BASE = (process.argv[2] || process.env["BASE_URL"] || "http://localhost:8080").replace(
  /\/+$/,
  "",
);
const RESPONSE_TIMEOUT_MS = 4000;
const SETTLE_MS = 2500;
const FOCUS_WAIT_MS = 5000;

/** Routes that focus a search box on arrival. */
const SEARCH_ROUTES = ["/search", "/find", "/tools/finder"];

/** Never let a wedged page hold the run open forever. */
const bounded = (promise, ms = RESPONSE_TIMEOUT_MS) =>
  Promise.race([
    promise.catch(() => undefined),
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "  ok  " : "  FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

/**
 * Follow document.activeElement for `samples` ticks - a search box that takes
 * focus and then loses it is a different bug from one that never had it.
 */
const focusTrace = async (page, samples = 6, everyMs = 400) => {
  const trace = [];
  for (let i = 0; i < samples; i++) {
    trace.push(
      await Promise.race([
        page.evaluate(() => {
          const a = document.activeElement;
          return a ? a.tagName + (a === document.body ? "(body)" : "") : "none";
        }),
        new Promise((r) => setTimeout(() => r("TIMEOUT"), RESPONSE_TIMEOUT_MS)),
      ]),
    );
    await page.waitForTimeout(everyMs);
  }
  return trace.join(">");
};

const snapshot = (page, ms = RESPONSE_TIMEOUT_MS) =>
  Promise.race([
    page.evaluate(() => {
      const active = document.activeElement;
      return {
        active: active ? active.tagName : null,
        activeLabel: active ? active.getAttribute("aria-label") : null,
        inputValue: active && "value" in active ? String(active.value) : "",
        text: document.body.innerText,
      };
    }),
    new Promise((resolve) => setTimeout(() => resolve("TIMEOUT"), ms)),
  ]);

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });

for (const route of SEARCH_ROUTES) {
  const page = await browser.newPage();
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(SETTLE_MS);

  const state = await snapshot(page);
  const responsive = state !== "TIMEOUT";
  check(`${route} stays responsive after load`, responsive, responsive ? "" : "main thread frozen");
  if (!responsive) {
    await bounded(page.close());
    continue;
  }

  // A slow first compile can land focus a moment after the settle window, so
  // give it a bounded wait instead of sampling once.
  const focused = await page
    .waitForFunction(() => document.activeElement?.tagName === "INPUT", null, {
      timeout: FOCUS_WAIT_MS,
    })
    .then(() => true)
    .catch(() => false);
  const label = focused
    ? await page.evaluate(() => document.activeElement?.getAttribute("aria-label"))
    : null;
  check(
    `${route} focuses its search input`,
    focused,
    focused ? `label=${label ?? "-"}` : `trace=${await focusTrace(page)}`,
  );
  await bounded(page.close());
}

{
  // The homepage advertises search too, and focusing it used to freeze the tab.
  const page = await browser.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(SETTLE_MS);

  const before = await snapshot(page);
  check("/ loads and responds", before !== "TIMEOUT", before === "TIMEOUT" ? "main thread frozen" : "");

  const focused = await Promise.race([
    page
      .evaluate(() => {
        const input = document.querySelector("input");
        if (!input) return "no input";
        input.focus();
        return "ok";
      })
      .catch(() => "error"),
    new Promise((resolve) => setTimeout(() => resolve("TIMEOUT"), RESPONSE_TIMEOUT_MS)),
  ]);
  check("/ focuses a search input without freezing", focused === "ok", String(focused));

  await bounded(page.keyboard.type("email", { delay: 40, timeout: 3000 }));
  await page.waitForTimeout(1500);
  const after = await snapshot(page);
  check("/ still answers after typing", after !== "TIMEOUT", after === "TIMEOUT" ? "main thread frozen" : "");
  if (after !== "TIMEOUT") {
    check(
      "/ live search shows suggestions",
      after.inputValue === "email" && after.text.includes("matching"),
      `value="${after.inputValue}"`,
    );
  }
  await bounded(page.close());
}

await bounded(browser.close(), 5000);

const failed = results.filter((r) => !r.ok);
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed against ${BASE}`,
);
process.exit(failed.length === 0 ? 0 : 1);
