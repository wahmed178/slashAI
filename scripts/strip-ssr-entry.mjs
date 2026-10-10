#!/usr/bin/env node
/**
 * For builds that freshened the entry after Freebuff's SPA patch, re-apply the
 * minimal static-site rewrite so the app still boots from a bare `dist/` without
 * a server adapter runtime.
 *
 * Idempotent: once patched, running again should be a no-op.
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , entryRel] = process.argv;
if (!entryRel) {
  console.error("usage: node strip-ssr-entry.mjs <assets/index-*.js>");
  process.exit(1);
}

const entryPath = `dist/${entryRel}`;
try {
  let src = readFileSync(entryPath, "utf8");
  let patched = false;

  // 1) Neutralize TanStack Start's server-bootstrap path so SSR code never
  //    reaches for `document` in a way that assumes a real request/response.
  if (/from[".\\/]@tanstack\/start[".\/]server\b/.test(src)) {
    src = src.replace(
      /from[".\\/]@tanstack\/start[".\/]server\b/g,
      "from \"@tanstack/start/static\"",
    );
    patched = true;
  }

  // 2) If the entry is still a TanStack Start SSR install, replace the install
  //    call with a static-ready createRoot render of RouterProvider.
  if (/installRouterFromServerManifest/.test(src)) {
    src = src.replace(
      /(\b)installRouterFromServerManifest\(/.source,
      "$1// installRouterFromServerManifest(",
    );
    // Ensure createRoot-based rendering is reachable at runtime.
    src = src.replace(
      /((\s*)(\/\/)?)createRoot\(/g,
      "$1$2createRoot(",
    );
    patched = true;
  }

  if (patched) {
    writeFileSync(entryPath, src, "utf8");
    console.log("patched", entryPath);
  } else {
    console.log("already patched or no SSR markers found in", entryPath);
  }
} catch (err) {
  console.error("strip-ssr-entry failed:", err);
  process.exit(1);
}
