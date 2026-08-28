const fs = require('fs');
const path = require('path');

async function fetchProductHuntRSS() {
  try {
    const res = await fetch('https://www.producthunt.com/feed', {
      headers: { 'User-Agent': 'SlashAI-Bot/1.0' },
      signal: AbortSignal.timeout(8000)
    });
    const text = await res.text();
    const items = [];
    const itemMatches = text.matchAll(/<item>([\s\S]*?)<\/item>/g);
    for (const match of itemMatches) {
      const block = match[1];
      const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
                 || block.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const link = block.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const desc = block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1]
                || block.match(/<description>(.*?)<\/description>/)?.[1] || '';
      if (title && link) {
        items.push({
          name: title.replace(/ - .*$/, '').trim(),
          url: link,
          description: desc.replace(/<[^>]*>/g, '').slice(0, 120).trim(),
          source: 'ProductHunt',
          category: 'AI Tools',
          badge: 'Free Tier'
        });
      }
    }
    return items.slice(0, 8);
  } catch (e) {
    console.log('ProductHunt fetch failed:', e.message);
    return [];
  }
}

async function fetchRedditAI() {
  try {
    const res = await fetch(
      'https://www.reddit.com/r/artificial/top.json?t=week&limit=10',
      { headers: { 'User-Agent': 'SlashAI-Bot/1.0' },
        signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    return data.data.children
      .filter(p => p.data.score > 100 && p.data.url)
      .map(p => ({
        name: p.data.title.slice(0, 60).trim(),
        url: p.data.url.startsWith('http') ? p.data.url : `https://reddit.com${p.data.permalink}`,
        description: `${p.data.score} upvotes — r/artificial`,
        source: 'Reddit',
        category: 'AI Tools',
        badge: 'Free'
      }))
      .slice(0, 5);
  } catch (e) {
    console.log('Reddit fetch failed:', e.message);
    return [];
  }
}

async function fetchHackerNewsAI() {
  try {
    const res = await fetch(
      `https://hn.algolia.com/api/v1/search?query=AI+tool&tags=story&numericFilters=created_at_i>${Math.floor((Date.now() - 7*24*60*60*1000) / 1000)},points>50`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    return data.hits
      .filter(h => h.url)
      .map(h => ({
        name: h.title.slice(0, 60).trim(),
        url: h.url,
        description: `${h.points} points on Hacker News`,
        source: 'HackerNews',
        category: 'AI Tools',
        badge: 'Free'
      }))
      .slice(0, 5);
  } catch (e) {
    console.log('HN fetch failed:', e.message);
    return [];
  }
}

async function main() {
  console.log('Fetching trending tools...');
  const [ph, reddit, hn] = await Promise.all([
    fetchProductHuntRSS(),
    fetchRedditAI(),
    fetchHackerNewsAI()
  ]);

  const all = [...ph, ...reddit, ...hn];
  const seen = new Set();
  const unique = all.filter(item => {
    const key = new URL(item.url).hostname;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 15);

  const now = new Date();
  const output = {
    updated: now.toISOString().split('T')[0],
    week: `${now.getFullYear()}-W${Math.ceil((now - new Date(now.getFullYear(),0,1))/(7*24*60*60*1000))}`,
    items: unique
  };

  const filePath = path.join(__dirname, '../src/data/trending-tools.json');
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2));
  console.log(`Written ${unique.length} trending tools to ${filePath}`);
}

main();
