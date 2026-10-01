#!/usr/bin/env node
/**
 * Post-process the built client bundle for static SPA hosting.
 *
 * The React mount itself is NOT patched here: src/client.tsx is a real
 * client entry that imports createRoot, so the bundler keeps the
 * implementation. An earlier version rewrote the minified entry with a
 * regex to call createRoot, but createRoot had been tree-shaken out of
 * the build, so the app threw "createRoot is not a function" and rendered
 * a blank page.
 *
 * What is left to neutralise is the server-adapter code, which assumes a
 * Nitro/Vercel backend that static hosting does not provide.
 *
 * This is a Node port of the previous scripts/patch-entry.py. The Freebuff
 * hosting builder is a Node-only image with no python3.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const distAssets = "dist/assets";

function entryFiles() {
  let names;
  try {
    names = readdirSync(distAssets);
  } catch {
    console.warn("WARNING: dist/assets not found, skipping entry patch");
    return [];
  }
  return names.filter((n) => /^index-.*\.js$/.test(n)).map((n) => join(distAssets, n));
}

const files = entryFiles();
if (files.length === 0) {
  console.error("ERROR: no built entry JS found in dist/assets");
  process.exit(1);
}

for (const fpath of files) {
  const original = readFileSync(fpath, "utf8");
  let content = original;

  // The server adapter's hydrateRoot polyfill must not run without a backend.
  content = content.replace(
    /\.hydrateRoot=function\([^)]*\)\{[^}]*\}/g,
    ".hydrateRoot=function(){return null}",
  );

  // getOptions() belongs to the server adapter; never let it throw.
  content = content.replace(
    /await (\w+)\.getOptions\(\)/g,
    (_m, v) => `(await (function(){try{return ${v}.getOptions()}catch{return{}}})())`,
  );

  if (content !== original) {
    writeFileSync(fpath, content);
    console.log("Patched " + fpath);
  } else {
    console.log("No changes needed in " + fpath);
  }
}

/**
 * Guard the failure that shipped: the entry called createRoot but no chunk
 * defined it, so the SPA mounted nothing. Fail the build instead.
 */
let failed = false;
for (const fpath of files) {
  const content = readFileSync(fpath, "utf8");
  if (!/createRoot/.test(content)) {
    console.error(`ERROR: ${fpath} never references createRoot - the SPA cannot mount.`);
    failed = true;
  }
}
if (failed) {
  console.error("Build aborted: the client bundle cannot mount.");
  process.exit(1);
}
console.log("Entry patch OK");
