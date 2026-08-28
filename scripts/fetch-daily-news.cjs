const fs = require('fs');
const path = require('path');

async function fetchHackerNewsTop() {
  try {
    const storiesRes = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { signal: AbortSignal.timeout(8000) }
    );
    const ids = await storiesRes.json();
    const top20 = ids.slice(0, 20);

    const stories = await Promise.all(
      top20.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`,
          { signal: AbortSignal.timeout(5000) })
          .then(r => r.json())
          .catch(() => null)
      )
    );

    return stories
      .filter(s => s && s.url && s.score > 50)
      .map(s => ({
        title: s.title,
        url: s.url,
        source: 'HackerNews',
        score: s.score,
        publishedAt: new Date(s.time * 1000).toISOString().split('T')[0]
      }))
      .slice(0, 8);
  } catch (e) {
    console.log('HN news fetch failed:', e.message);
    return [];
  }
}

async function fetchRedditTech() {
  try {
    const res = await fetch(
      'https://www.reddit.com/r/technology/top.json?t=day&limit=10',
      { headers: { 'User-Agent': 'SlashAI-Bot/1.0' },
        signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    return data.data.children
      .filter(p => p.data.score > 500 && p.data.url)
      .map(p => ({
        title: p.data.title,
        url: p.data.url.startsWith('http') ? p.data.url : `https://reddit.com${p.data.permalink}`,
        source: 'Reddit/technology',
        score: p.data.score,
        publishedAt: new Date().toISOString().split('T')[0]
      }))
      .slice(0, 5);
  } catch (e) {
    console.log('Reddit tech fetch failed:', e.message);
    return [];
  }
}

async function main() {
  console.log('Fetching daily news...');
  const [hn, reddit] = await Promise.all([
    fetchHackerNewsTop(),
    fetchRedditTech()
  ]);

  const all = [...hn, ...reddit]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const output = {
    updated: new Date().toISOString(),
    articles: all
  };

  const filePath = path.join(__dirname, '../src/data/daily-news.json');
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2));
  console.log(`Written ${all.length} news articles`);
}

main();
