/**
 * Weekly trending prompt resources.
 *
 * Previously Reddit-only — every subreddit now returns 403 to datacenter IPs,
 * so this job produced zero items every week. It now uses two sources that
 * actually respond from CI: the GitHub search API (starred prompt repos) and
 * the Hacker News Algolia API (high-scoring prompt discussions).
 *
 * Output: { updated, prompts: [{ title, url, source, score, category, description }] }
 */
const path = require('path');
const { writeData } = require('./lib/data-write.cjs');

const HEADERS = {
  'User-Agent': 'SlashAI-Bot/1.0 (+https://slashai.in)',
  Accept: 'application/vnd.github+json',
};
const TIMEOUT = 10_000;

/** Prompt repos worth surfacing, by search query. */
const GITHUB_QUERIES = [
  { q: 'awesome prompts', category: 'Libraries' },
  { q: 'prompt engineering', category: 'Engineering' },
  { q: 'chatgpt prompts', category: 'Writing & Chat' },
  { q: 'midjourney prompts', category: 'Image Prompts' },
];

async function getJson(url, headers = HEADERS) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchGithubRepos({ q, category }) {
  try {
    const url =
      'https://api.github.com/search/repositories' +
      `?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=6`;
    const data = await getJson(url);
    return (data.items || [])
      .filter((repo) => repo.stargazers_count > 200 && repo.description)
      .map((repo) => ({
        title: repo.full_name,
        url: repo.html_url,
        source: 'GitHub',
        score: repo.stargazers_count,
        category,
        description: repo.description.slice(0, 180),
      }));
  } catch (error) {
    console.log(`GitHub search "${q}" failed:`, error.message);
    return [];
  }
}

async function fetchHackerNews() {
  try {
    const url =
      'https://hn.algolia.com/api/v1/search' +
      '?query=prompt%20engineering&tags=story&numericFilters=points%3E60&hitsPerPage=10';
    const data = await getJson(url, { 'User-Agent': HEADERS['User-Agent'] });
    return (data.hits || [])
      .filter((hit) => hit.title && hit.url)
      .map((hit) => ({
        title: hit.title.slice(0, 120),
        url: hit.url,
        source: 'HackerNews',
        score: hit.points || 0,
        category: 'Discussion',
        description: `${hit.points || 0} points · ${hit.num_comments || 0} comments`,
      }));
  } catch (error) {
    console.log('HackerNews fetch failed:', error.message);
    return [];
  }
}

async function main() {
  console.log('Fetching trending prompt resources...');

  const [github, hn] = await Promise.all([
    Promise.all(GITHUB_QUERIES.map(fetchGithubRepos)).then((r) => r.flat()),
    fetchHackerNews(),
  ]);

  // de-duplicate by URL, keep the highest score, then take the top 20
  const byUrl = new Map();
  for (const item of [...github, ...hn]) {
    const existing = byUrl.get(item.url);
    if (!existing || item.score > existing.score) byUrl.set(item.url, item);
  }
  const all = [...byUrl.values()].sort((a, b) => b.score - a.score).slice(0, 20);

  const output = {
    updated: new Date().toISOString().split('T')[0],
    prompts: all,
  };

  writeData(path.join(__dirname, '../src/data/trending-prompts.json'), output, {
    count: all.length,
    previousCount: (prev) => (Array.isArray(prev.prompts) ? prev.prompts.length : 0),
    label: 'trending prompts',
  });
}

main().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
