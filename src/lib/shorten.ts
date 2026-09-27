/**
 * Shorten a link — locally, on the user's device.
 *
 * There is no server here and no third party: a hosted shortener would need an
 * account, would expire, would leak every shared link to whoever runs it, and
 * would contradict the site's offline-first, no-tracking stance. So the link is
 * shortened honestly: tracking and campaign parameters are stripped, the host
 * and path are normalised, and the result is reported as a character count.
 *
 * If a link genuinely cannot be made shorter the function says so instead of
 * pretending. That is the whole contract.
 */

export interface ShortenResult {
  /** what to share — identical to the input when nothing could be removed */
  url: string;
  /** exactly what was typed/pasted in */
  original: string;
  /** query parameters that were dropped, in the order they were found */
  removed: string[];
  /** characters saved (never negative) */
  saved: number;
  /** false when the link was already as short as it can be */
  changed: boolean;
  /** true when the input could not be understood as a link at all */
  invalid: boolean;
}

/**
 * Campaign and click-tracking parameters. These are noise on a shared link:
 * they make it longer, they identify the person who shared it, and the
 * destination does not need them.
 */
const TRACKING = new Set<string>([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "utm_name",
  "utm_cid",
  "utm_reader",
  "utm_viz_id",
  "utm_source_platform",
  "utm_creative_format",
  "utm_marketing_tactic",
  "gclid",
  "gclsrc",
  "dclid",
  "wbraid",
  "gbraid",
  "fbclid",
  "msclkid",
  "yclid",
  "twclid",
  "ttclid",
  "igshid",
  "igsh",
  "li_fat_id",
  "mc_cid",
  "mc_eid",
  "mkt_tok",
  "vero_id",
  "vero_conv",
  "oly_enc_id",
  "oly_anon_id",
  "hsCtaTracking",
  "_hsenc",
  "_hsmi",
  "__hstc",
  "__hssc",
  "__hsfp",
  "ck_subscriber_id",
  "sc_channel",
  "sc_campaign",
  "sc_geo",
  "sc_country",
  "_ga",
  "_gl",
  "trk",
  "trkCampaign",
  "spm",
  "scm",
  "cmpid",
  "icid",
]);

const looksLikeHost = (v: string) => /^[a-z0-9-]+(\.[a-z0-9-]+)+(?=[/:?#]|$)/i.test(v);

/**
 * Normalise a link and drop the tracking junk.
 *
 * The fragment is always preserved: on SlashAI it carries real state (a
 * bouquet lives entirely in it), so quietly discarding it would break the link.
 */
export function shortenUrl(raw: string): ShortenResult {
  const original = (raw ?? "").trim();
  const base: ShortenResult = {
    url: original,
    original,
    removed: [],
    saved: 0,
    changed: false,
    invalid: false,
  };
  if (!original) return { ...base, invalid: true };

  // a bare host like "slashai.in/tools" is a link people actually paste
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(original)
    ? original
    : looksLikeHost(original)
      ? `https://${original}`
      : null;
  if (!candidate) return { ...base, invalid: true };

  let u: URL;
  try {
    u = new URL(candidate);
  } catch {
    return { ...base, invalid: true };
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return { ...base, invalid: true };

  // host: lowercase, no www, no default port
  u.hostname = u.hostname.toLowerCase().replace(/^www\./, "");
  if (
    (u.protocol === "http:" && u.port === "80") ||
    (u.protocol === "https:" && u.port === "443")
  ) {
    u.port = "";
  }

  // path: collapse duplicate slashes and drop a trailing one (except the root)
  u.pathname = u.pathname.replace(/\/{2,}/g, "/");
  if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
    u.pathname = u.pathname.replace(/\/+$/, "");
  }

  // query: drop tracking params
  const removed: string[] = [];
  if (u.search) {
    const keep: [string, string][] = [];
    for (const [k, v] of u.searchParams) {
      if (TRACKING.has(k.toLowerCase())) removed.push(k);
      else keep.push([k, v]);
    }
    u.search = "";
    for (const [k, v] of keep) u.searchParams.append(k, v);
  }

  const url = u.toString();
  // `changed` compares against what the user gave us, not the internal
  // candidate, so adding a missing https:// counts as a change.
  const changed = url !== original;
  return {
    url,
    original,
    removed,
    saved: Math.max(0, original.length - url.length),
    changed,
    invalid: false,
  };
}

/**
 * A short human summary for the popup. It never claims a saving that did not
 * happen — a link with nothing to trim says so rather than showing "0%".
 */
export function savedSummary(r: ShortenResult): string {
  if (r.invalid) return "That does not look like a link";
  if (!r.changed) return "Already as short as it gets";
  if (r.saved <= 0) return "Tidied up — nothing left to trim";
  const pct = Math.round((r.saved / r.original.length) * 100);
  return `${r.saved} character${r.saved === 1 ? "" : "s"} shorter (${pct}%)`;
}
