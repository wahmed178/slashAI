#!/usr/bin/env node
/**
 * Validates Android app-link (Digital Asset Links) association before a TWA build.
 *
 * A Trusted Web Activity only hides the browser address bar when the SHA-256
 * fingerprint of the APK signing certificate is listed in the site's
 * /.well-known/assetlinks.json for the exact package name. If they disagree,
 * the "app" opens as a plain browser tab.
 *
 * Usage:
 *   BUBBLEWRAP_KEYSTORE_PASSWORD='...' bun run android:validate -- android/android.keystore
 *
 * Optional env:
 *   TWA_KEYSTORE_PATH     keystore path (alternative to the CLI argument)
 *   TWA_KEY_ALIAS         key alias (defaults to twa-manifest signingKey.alias)
 *   PUBLISHED_DOMAIN      overrides the host from twa-manifest.json
 *   SKIP_KEYSTORE_CHECK   set to "1" to only validate the JSON/manifest wiring
 */
import { execFileSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const MANIFEST_PATH = resolve(rootDir, "android/twa-manifest.json");
const ASSETLINKS_PATH = resolve(rootDir, "public/.well-known/assetlinks.json");

const FINGERPRINT_RE = /^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/;

function fail(message) {
  console.error(`\n[android:validate] FAIL — ${message}\n`);
  process.exit(1);
}

function normalizeFingerprint(value) {
  return String(value).trim().toUpperCase().replace(/\s+/g, "");
}

function readJson(path, label) {
  if (!existsSync(path)) fail(`${label} not found at ${path}`);
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
}

function keytoolFingerprint(keystorePath, alias, storePassword) {
  const keytool = process.env.JAVA_HOME ? resolve(process.env.JAVA_HOME, "bin/keytool") : "keytool";
  let output;
  try {
    output = execFileSync(
      keytool,
      ["-list", "-v", "-keystore", keystorePath, "-alias", alias, "-storepass", storePassword],
      { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] },
    );
  } catch (error) {
    const detail = (error.stderr || error.stdout || error.message || "").toString().trim();
    fail(`keytool could not read the keystore (alias "${alias}").\n${detail}`);
  }
  const match = output.match(/SHA256:\s*([0-9A-Fa-f:]{95})/);
  if (!match) fail(`No SHA-256 fingerprint found for alias "${alias}" in ${keystorePath}`);
  return normalizeFingerprint(match[1]);
}

function main() {
  const manifest = readJson(MANIFEST_PATH, "twa-manifest.json");
  const assetlinks = readJson(ASSETLINKS_PATH, "assetlinks.json");

  const host = process.env.PUBLISHED_DOMAIN || manifest.host;
  const packageId = manifest.packageId;

  if (!host || host.includes("REPLACE_WITH")) {
    fail("twa-manifest.json still has a placeholder host. Set your published domain.");
  }
  if (!packageId) fail("twa-manifest.json is missing packageId.");

  if (!Array.isArray(assetlinks) || assetlinks.length === 0) {
    fail("assetlinks.json must be a non-empty array of Digital Asset Links statements.");
  }

  const statements = assetlinks.filter(
    (entry) =>
      entry?.target?.namespace === "android_app" &&
      entry?.target?.package_name === packageId &&
      Array.isArray(entry?.relation) &&
      entry.relation.includes("delegate_permission/common.handle_all_urls"),
  );

  if (statements.length === 0) {
    fail(
      `assetlinks.json has no statement for package "${packageId}" with relation ` +
        `"delegate_permission/common.handle_all_urls".`,
    );
  }

  const declared = statements
    .flatMap((entry) => entry.target.sha256_cert_fingerprints || [])
    .map(normalizeFingerprint);

  if (declared.length === 0) {
    fail(`assetlinks.json lists no sha256_cert_fingerprints for package "${packageId}".`);
  }

  const invalid = declared.filter((fp) => !FINGERPRINT_RE.test(fp));
  if (invalid.length > 0) {
    fail(
      `These entries are not valid colon-separated SHA-256 fingerprints:\n  ${invalid.join("\n  ")}`,
    );
  }

  console.log("[android:validate] Domain            :", host);
  console.log("[android:validate] Package           :", packageId);
  console.log("[android:validate] Declared certs    :", declared.length);
  declared.forEach((fp) => console.log("                    -", fp));

  if (process.env.SKIP_KEYSTORE_CHECK === "1") {
    console.log(
      "\n[android:validate] OK — assetlinks.json wiring is valid (keystore check skipped).\n",
    );
    return;
  }

  const keystorePath = resolve(
    rootDir,
    process.argv[2] || process.env.TWA_KEYSTORE_PATH || manifest.signingKey?.path || "",
  );
  if (!existsSync(keystorePath)) {
    fail(
      `Keystore not found at ${keystorePath}. Pass a path as an argument or set TWA_KEYSTORE_PATH.`,
    );
  }

  const storePassword = process.env.BUBBLEWRAP_KEYSTORE_PASSWORD;
  if (!storePassword) fail("BUBBLEWRAP_KEYSTORE_PASSWORD is not set.");

  const alias = process.env.TWA_KEY_ALIAS || manifest.signingKey?.alias || "slashai";
  const actual = keytoolFingerprint(keystorePath, alias, storePassword);

  console.log("[android:validate] Signing cert      :", actual);

  if (!declared.includes(actual)) {
    fail(
      `The signing certificate is NOT listed in assetlinks.json.\n` +
        `  Signing key fingerprint : ${actual}\n` +
        `  Declared fingerprints   : ${declared.join(", ")}\n\n` +
        `Add the signing fingerprint to public/.well-known/assetlinks.json and redeploy the\n` +
        `web app, otherwise the installed APK will show the browser address bar.\n` +
        `If you use Google Play App Signing, also add the Play "App signing key certificate"\n` +
        `SHA-256 from Play Console → Setup → App integrity as an additional entry.`,
    );
  }

  console.log(
    `\n[android:validate] OK — signing certificate matches assetlinks.json for https://${host}\n`,
  );
}

main();
