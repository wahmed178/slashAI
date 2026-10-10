#!/usr/bin/env bun
// Writes the dev-only SPA shell (index.html) for `vite dev`.
//
// `vite dev` runs with appType "spa" and TanStack Start's SSR middleware
// disabled (see vite.config.ts), so Vite needs a plain HTML entry at the
// project root and src/client.tsx mounts the app with createRoot into
// `document.body` - there is no server-rendered markup to hydrate.
//
// The file must NOT be committed: `vite build` uses the root index.html as the
// production document when it exists, which ships this empty dev shell (raw
// /src/client.tsx script, no built assets) to the static host. So it is
// gitignored and regenerated here by the `predev` hook of `bun run dev`.
//
// `vite build` goes through TanStack Start + Nitro and emits its own document;
// scripts/build-for-freebuff.sh writes the dist/index.html used by the Freebuff
// static deploy.

import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "index.html");

const SHELL = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0a0a0a" />
    <title>SlashAI</title>
    <link rel="icon" href="/favicon.png" />
  </head>
  <body>
    <!-- Generated dev-only SPA shell - see scripts/dev-shell.mjs. Never deployed. -->
    <script type="module" src="/src/client.tsx"></script>
  </body>
</html>
`;

if (existsSync(target)) {
  console.log("[dev-shell] index.html already present");
} else {
  writeFileSync(target, SHELL, "utf8");
  console.log("[dev-shell] wrote index.html");
}
