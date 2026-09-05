// One-off launch QA audit — external link checker.
// Extracts every http(s) URL from src/ and public/, then HEAD-checks in small batches.
import fs from "node:fs";
import path from "node:path";

const urls = new Map();
function scan(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      if (f === "isolate" || f === "node_modules" || f.startsWith(".")) continue;
      scan(p);
      continue;
    }
    if (!/\.(tsx|ts|json|webmanifest)$/.test(f) || f.endsWith(".gen.ts")) continue;
    const src = fs.readFileSync(p, "utf8");
    for (const m of src.matchAll(/https?:\/\/[^\s"'`)\]>,]+/g)) {
      const u = m[0].replace(/[.,]+$/, "");
      if (!urls.has(u)) urls.set(u, []);
      urls.get(u).push(p);
    }
  }
}
scan("src");
scan("public");

const list = [...urls.keys()].filter((u) => !u.includes("localhost"));
console.log("unique external URLs:", list.length);

const bad = [];
async function check(u) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(u, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 (slashai-link-audit)" },
    });
    if (res.status >= 400) bad.push([u, res.status]);
  } catch (e) {
    bad.push([u, "ERR " + (e?.cause?.code || e?.name || "fail")]);
  } finally {
    clearTimeout(t);
  }
}

const CONC = 12;
for (let i = 0; i < list.length; i += CONC) {
  await Promise.all(list.slice(i, i + CONC).map(check));
  process.stdout.write(`\rchecked ${Math.min(i + CONC, list.length)}/${list.length}`);
}
console.log("");
console.log("FAILURES (" + bad.length + "):");
for (const [u, s] of bad) console.log(" ", s, u, "<-", (urls.get(u) || []).slice(0, 2).join(","));
