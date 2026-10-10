#!/usr/bin/env node
/**
 * Light wrapper around GitHub Checks API polling for a PR.
 *
 * Usage: node scripts/freebuff-pr-check.mjs <owner> <repo> <pr-number>
 *
 * This is meant to be used after a PR is created. It lists the latest
 * commit on the PR and the associated check-suites, then polls GitHub's
 * check-runs API until every suite is either `completed` with conclusion
 * `success`, or the timeout is reached.
 *
 * It is intentionally lightweight: no third-party deps, no credential
 * handling beyond the environment's current GitHub token. It expects
 * `gh` or `GITHUB_TOKEN` in the environment from the host session.
 */
import { execFileSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

function envToken() {
  return process.env.GITHUB_TOKEN ?? execFileSync("gh", ["auth", "token"], {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

async function ghJson(args) {
  const token = envToken();
  const opts = {
    env: { ...process.env, GITHUB_TOKEN: token },
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  };
  const out = execFileSync("gh", ["api", ...args, "-f", "per_page=100"], opts).trim();
  return JSON.parse(out);
}

function describeSuite(suite) {
  const status = suite.status;
  const conclusion = suite.conclusion;
  if (status === "queued" || status === "in_progress") {
    return `in-progress (${suite.status})`;
  }
  if (conclusion === "success") {
    return "green";
  }
  return `completed (${conclusion ?? suite.status})`;
}

async function run(owner, repo, prNumber, timeoutSeconds = 900) {
  const token = envToken();
  const start = Date.now();
  const intervalMs = 30_000;

  console.log(`PR #${prNumber} in ${owner}/${repo}`);
  console.log(`Polling check suites for up to ${timeoutSeconds}s from now...`);

  while (true) {
    const suites = await ghJson([
      `repos/${owner}/${repo}/pulls/${prNumber}/check-suites`,
    `?state=all`,
  ]);
    const items = Array.isArray(suites) ? suites : (suites.check_suites ?? []);
    if (items.length === 0) {
      console.log("No check-suites found yet.");
    } else {
      const lines = items.map((s) => {
        const head = s.head_sha?.slice(0, 7) ?? "???";
        return `  ${head}  ${s.name}  —  ${describeSuite(s)}`;
      });
      console.log(`Check suites (${items.length}):`);
      for (const line of lines) {
        console.log(line);
      }
    }

    const completed = items.filter((s) => s.status !== "queued" && s.status !== "in_progress");
    const allDone = items.length > 0 && completed.length === items.length;
    const allGreen = allDone && items.every((s) => s.conclusion === "success");

    if (items.length > 0 && allDone) {
      if (allGreen) {
        console.log("All check suites are green.");
        process.exit(0);
      } else {
        console.log("Some check suites did not succeed.");
        const failed = items.filter((s) => s.conclusion !== "success").map((s) => `${s.name}: ${s.conclusion ?? s.status}`).join(", ");
        console.log(`Failed: ${failed}`);
        process.exit(1);
      }
    }

    const elapsed = Date.now() - start;
    if (elapsed > timeoutSeconds * 1000) {
      console.error("Timed out waiting for check-suite completion.");
      process.exit(2);
    }

    await sleep(intervalMs);
  }
}

const [owner, repo, prNumberRaw] = (process.argv[2] ?? "").split("/").concat(["", "", ""]).slice(0, 3);
if (!owner || !repo || !prNumberRaw) {
  console.error("Usage: node scripts/freebuff-pr-check.mjs <owner>/<repo> <pr-number>");
  process.exit(3);
}
run(owner, repo, parseInt(prNumberRaw, 10)).catch((err) => {
  console.error(err);
  process.exit(4);
});
