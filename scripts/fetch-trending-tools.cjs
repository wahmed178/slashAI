/**
 * Weekly trending AI tools - powers the homepage "This week's free finds".
 *
 * Sources, in order of reliability:
 *  1. Product Hunt — an ATOM feed (not RSS). The previous code only matched
 *     RSS <item> tags, so this source silently contributed nothing.
 *  2. Hacker News Algolia — filtered down to "Show HN" launches and tool-ish
 *     stories; unfiltered it pulled in AI *news* ("Nvidia is the central bank
 *     of AI") into a feed that is supposed to list tools.
 *  3. Reddit r/artificial — best effort only; Reddit 403s datacenter IPs.
 *
 * Output: { updated, week, items: [{ name, url, description, source, category, badge }] }
 */
const path = require('path');
const { writeData } = require('./lib/data-write.cjs');

const HEADERS = { 'User-Agent': 'SlashAI-Bot/1.0 (+https://slashai.in)' };
const TIMEOUT = 10_000;

function decode(text) {
  return String(text)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Product Hunt publishes Atom (<entry>), so handle that as well as RSS. */
async function fetchProductHunt() {
  try {
    const res = await fetch('https://www.producthunt.com/feed', {
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    const blocks = [
      ...[...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]),
      ...[...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]),
    ];

    return blocks
      .map((block) => {
        const rawTitle = decode(
          block.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] || '',
        );
        // Atom links live in a href attribute; RSS puts the URL in the body.
        const link =
          block.match(/<link[^>]*href="([^"]+)"/)?.[1] ||
          decode(block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '');
        const summary = decode(
          block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)?.[1] ||
            block.match(/<content[^>]*>([\s\S]*?)<\/content>/)?.[1] ||
            block.match(/<description[^>]*>([\s\S]*?)<\/description>/)?.[1] ||
            '',
        );
        // PH titles look like "Product Name - Tagline"; keep the product name.
        const name = rawTitle.split(' - ')[0].trim();
        if (!name || !link) return null;
        return {
          name: name.slice(0, 60),
          url: link,
          description: (summary || rawTitle).slice(0, 120),
          source: 'ProductHunt',
          category: 'AI Tools',
          badge: 'Free Tier',
        };
      })
      .filter(Boolean)
      .slice(0, 8);
  } catch (error) {
    console.log('ProductHunt fetch failed:', error.message);
    return [];
  }
}

async function fetchRedditAI() {
  try {
    const res = await fetch(
      'https://www.reddit.com/r/artificial/top.json?t=week&limit=10',
      { headers: HEADERS, signal: AbortSignal.timeout(TIMEOUT) },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data.data?.children || [])
      .filter((p) => p.data.score > 100 && p.data.url)
      .map((p) => ({
        name: p.data.title.slice(0, 60).trim(),
        url: p.data.url.startsWith('http')
          ? p.data.url
          : `https://reddit.com${p.data.permalink}`,
        description: `${p.data.score} upvotes - r/artificial`,
        source: 'Reddit',
        category: 'AI Tools',
        badge: 'Free',
      }))
      .slice(0, 5);
  } catch (error) {
    console.log('Reddit fetch failed:', error.message);
    return [];
  }
}

/** Tool-shaped, not news-shaped: launches, releases and open-source projects. */
const TOOL_SIGNAL =
  /\b(show hn|launch|released?|open[- ]sourc|github|tool|app|api|cli|plugin|library|v\d)\b/i;

async function fetchHackerNewsAI() {
  const weekAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
  const url =
    'https://hn.algolia.com/api/v1/search' +
    `?query=AI%20tool&tags=story&numericFilters=created_at_i>${weekAgo},points>40&hitsPerPage=30`;

  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return (data.hits || [])
      .filter((hit) => hit.url && hit.title)
      // "Show HN" posts are literally new tools; everything else must at least
      // look like a product rather than a think-piece.
      .filter((hit) => /^show hn/i.test(hit.title) || TOOL_SIGNAL.test(hit.title))
      .map((hit) => ({
        name: hit.title.replace(/^show hn:\s*/i, '').slice(0, 60).trim(),
        url: hit.url,
        description: `${hit.points} points on Hacker News`,
        source: 'HackerNews',
        category: 'AI Tools',
        badge: 'Free',
      }))
      .slice(0, 8);
  } catch (error) {
    console.log('HN fetch failed:', error.message);
    return [];
  }
}

/** De-duplicate by URL and by title — not by hostname. */
function dedupe(items) {
  const urls = new Set();
  const titles = new Set();
  return items.filter((item) => {
    let key;
    try {
      const parsed = new URL(item.url);
      key = `${parsed.hostname}${parsed.pathname}`.replace(/\/$/, '');
    } catch {
      key = item.url;
    }
    const titleKey = item.name.toLowerCase().slice(0, 40);
    if (urls.has(key) || titles.has(titleKey)) return false;
    urls.add(key);
    titles.add(titleKey);
    return true;
  });
}

async function main() {
  console.log('Fetching trending tools...');
  const [ph, reddit, hn] = await Promise.all([
    fetchProductHunt(),
    fetchRedditAI(),
    fetchHackerNewsAI(),
  ]);

  console.log(`  ProductHunt: ${ph.length} · Reddit: ${reddit.length} · HN: ${hn.length}`);
  const unique = dedupe([...ph, ...reddit, ...hn]).slice(0, 15);

  const now = new Date();
  const output = {
    updated: now.toISOString().split('T')[0],
    week: `${now.getFullYear()}-W${Math.ceil(
      (now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000),
    )}`,
    items: unique,
  };

  writeData(path.join(__dirname, '../src/data/trending-tools.json'), output, {
    count: unique.length,
    previousCount: (prev) => (Array.isArray(prev.items) ? prev.items.length : 0),
    label: 'trending tools',
  });
}

main().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
