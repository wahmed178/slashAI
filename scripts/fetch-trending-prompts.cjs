const fs = require('fs');
const path = require('path');

const SUBREDDITS = [
  'ChatGPT',
  'PromptEngineering',
  'midjourney',
  'StableDiffusion',
  'ClaudeAI'
];

async function fetchSubredditTop(subreddit) {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${subreddit}/top.json?t=week&limit=5`,
      { headers: { 'User-Agent': 'SlashAI-Bot/1.0' },
        signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    return data.data.children
      .filter(p => p.data.score > 200)
      .map(p => ({
        title: p.data.title.slice(0, 80),
        url: `https://reddit.com${p.data.permalink}`,
        subreddit: `r/${subreddit}`,
        score: p.data.score,
        category: subreddit === 'midjourney' || subreddit === 'StableDiffusion'
          ? 'Image Prompts'
          : subreddit === 'PromptEngineering'
          ? 'Engineering'
          : 'Writing & Chat'
      }));
  } catch (e) {
    console.log(`${subreddit} fetch failed:`, e.message);
    return [];
  }
}

async function main() {
  console.log('Fetching trending prompts...');
  const results = await Promise.all(
    SUBREDDITS.map(sub => fetchSubredditTop(sub))
  );

  const all = results.flat()
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  const output = {
    updated: new Date().toISOString().split('T')[0],
    prompts: all
  };

  const filePath = path.join(__dirname, '../src/data/trending-prompts.json');
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2));
  console.log(`Written ${all.length} trending prompts`);
}

main();
