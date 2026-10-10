import { isChunkLoadError } from "../src/lib/app-update.ts";

const mustBeTrue = [
  ["vite:preloadError", "vite:preloadError"],
  ["Failed to fetch dynamically imported module: https://x/assets/a-1.js", ""],
  ["error loading dynamically imported module", ""],
  ["importing a module script failed", ""],
  ["Unable to load chunk", ""],
  ["Failed to load resource: the server responded with a status of 404 (Not Found) http://localhost:8080/assets/index-abc.js", ""],
  ["http://localhost:8080/assets/index-abc.js", ""],
  ["http://localhost:8080/src/routes/search.tsx", ""],
  ["https://cdn.example.com/main-Bx9.js", ""],
];

const mustBeFalse = [
  // The exact failures that were killing the page: Yahoo CORS-blocked fetches.
  ["", "empty message (bare resource failure)"],
  ["https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d&range=2d", "yahoo chart api"],
  ["net::ERR_FAILED", "net::ERR_FAILED"],
  ["Failed to load resource: net::ERR_FAILED", "net::ERR_FAILED w/ prefix"],
  ["https://example.com/photo.jpg", "image"],
  ["https://fonts.gstatic.com/s/inter.woff2", "font"],
  ["The server responded with a status of 500", "plain 500"],
  ["ResizeObserver loop completed with undelivered notifications.", "harmless dom warning"],
];

let bad = 0;
for (const [msg, note] of mustBeTrue) {
  const got = isChunkLoadError(msg);
  if (!got) { console.log("  FAIL expected true :", JSON.stringify(msg), note); bad++; }
}
for (const [msg, note] of mustBeFalse) {
  const got = isChunkLoadError(msg);
  if (got) { console.log("  FAIL expected false:", JSON.stringify(msg), note); bad++; }
}
console.log(bad === 0
  ? `isChunkLoadError: all ${mustBeTrue.length + mustBeFalse.length} cases PASS`
  : `${bad} case(s) failed`);
process.exitCode = bad === 0 ? 0 : 1;