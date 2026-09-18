const path = require('path');
const { writeData } = require('./lib/data-write.cjs');

const HEADERS = { 'User-Agent': 'SlashAI-Bot/1.0 (+https://slashai.in)' };
const TIMEOUT = 10000;

/**
 * Reddit blocks datacenter IPs (every *.json call below returns 403 from CI),
 * so the real work is done by these Indian deal RSS feeds, which do respond.
 */
/** How many items to keep from each feed per run. */
const PER_FEED_LIMIT = 30;

const RSS_FEEDS = [
  { url: 'https://www.dealsmagnet.com/feed', source: 'DealsMagnet' },
  { url: 'https://freekaamaal.com/feed', source: 'Freekaamaal' },
];

function decodeEntities(text) {
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

function rssField(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? decodeEntities(match[1]) : '';
}

async function fetchRssFeed({ url, source }) {
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(TIMEOUT) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
    return items
      .map((block) => {
        const title = rssField(block, 'title');
        const link = rssField(block, 'link');
        const description = rssField(block, 'description').slice(0, 160);
        if (!title || !link) return null;

        const price = extractPrice(`${title} ${description}`);
        const discount = extractDiscount(`${title} ${description}`);

        return {
          id: `${source.toLowerCase()}-${Buffer.from(link).toString('base64url').slice(0, 12)}`,
          title: title.slice(0, 90),
          description: description || `Live deal from ${source}`,
          price,
          discount,
          rating: 0,
          votes: 0,
          image: '',
          url: link,
          redditUrl: '',
          platform: detectPlatform(title, link),
          category: detectCategory(title),
          source,
          badge:
            discount > 40
              ? `${discount}% OFF`
              : price > 0 && price < 500
                ? 'Under ₹500'
                : price > 0 && price < 999
                  ? 'Under ₹999'
                  : 'Live Deal',
          fetchedAt: new Date().toISOString().split('T')[0],
        };
      })
      .filter(Boolean)
      // The feeds publish hundreds of items a day; we only need the freshest
      // slice, otherwise every daily commit adds tens of thousands of lines.
      .slice(0, PER_FEED_LIMIT);
  } catch (e) {
    console.log(`${source} failed:`, e.message);
    return [];
  }
}

function detectCategory(title) {
  const t = title.toLowerCase();
  if (t.match(/phone|mobile|iphone|samsung|redmi|realme|oneplus|poco|vivo|oppo/))
    return 'phones';
  if (t.match(/laptop|pc|computer|processor|gpu|ram|ssd|monitor|keyboard|mouse/))
    return 'computers';
  if (t.match(/tv|television|led|oled|smart tv/))
    return 'tv';
  if (t.match(/book|kindle|novel|textbook|epub/))
    return 'books';
  if (t.match(/headphone|earphone|speaker|audio|bluetooth|tws|airpod/))
    return 'audio';
  if (t.match(/shoe|shirt|dress|clothing|fashion|apparel|sneaker|jacket/))
    return 'fashion';
  if (t.match(/kitchen|cooker|mixer|microwave|refrigerator|washing/))
    return 'home';
  if (t.match(/game|gaming|ps5|xbox|nintendo|steam|console/))
    return 'gaming';
  if (t.match(/camera|lens|gopro|dslr|mirrorless|tripod/))
    return 'camera';
  if (t.match(/supplement|protein|gym|fitness|yoga|dumbbell/))
    return 'fitness';
  if (t.match(/skincare|beauty|makeup|perfume|lotion|shampoo/))
    return 'beauty';
  return 'deals';
}

function extractPrice(title) {
  const patterns = [
    /₹\s*(\d[\d,]+)/,
    /Rs\.?\s*(\d[\d,]+)/i,
    /INR\s*(\d[\d,]+)/i,
    /at\s+(\d[\d,]+)/i,
  ];
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) return parseInt(match[1].replace(/,/g, ''));
  }
  return 0;
}

function detectPlatform(title, url) {
  const t = (title + url).toLowerCase();
  if (t.includes('amazon')) return 'amazon';
  if (t.includes('flipkart')) return 'flipkart';
  if (t.includes('meesho')) return 'meesho';
  if (t.includes('myntra')) return 'myntra';
  if (t.includes('ajio')) return 'ajio';
  if (t.includes('croma')) return 'croma';
  if (t.includes('reliance')) return 'reliance';
  if (t.includes('nykaa')) return 'nykaa';
  if (t.includes('steam')) return 'steam';
  if (t.includes('jiomart')) return 'jiomart';
  return 'other';
}

function extractDiscount(title) {
  const match = title.match(/(\d+)\s*%\s*off/i);
  return match ? parseInt(match[1]) : 0;
}

async function fetchSubreddit(subreddit, endpoint, category) {
  try {
    const res = await fetch(endpoint, {
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return data.data.children
      .filter(p => {
        const post = p.data;
        return post.score > 5
          && !post.stickied
          && post.title?.length > 10;
      })
      .map(p => {
        const post = p.data;
        const price = extractPrice(post.title);
        const discount = extractDiscount(post.title);
        const detectedCategory = category || detectCategory(post.title);
        const platform = detectPlatform(post.title, post.url || '');

        const hasImage = post.thumbnail
          && post.thumbnail.startsWith('http')
          && !post.thumbnail.includes('self')
          && !post.thumbnail.includes('default');

        return {
          id: `reddit-${post.id}`,
          title: post.title.slice(0, 90),
          description: post.selftext?.slice(0, 120) || `${post.score} upvotes · r/${subreddit}`,
          price: price,
          discount: discount,
          rating: 0,
          votes: post.score,
          image: hasImage ? post.thumbnail : '',
          url: post.url?.startsWith('http')
            ? post.url
            : `https://reddit.com${post.permalink}`,
          redditUrl: `https://reddit.com${post.permalink}`,
          platform: platform,
          category: detectedCategory,
          source: `r/${subreddit}`,
          badge: discount > 40
            ? `${discount}% OFF`
            : price > 0 && price < 500
            ? 'Under ₹500'
            : price > 0 && price < 999
            ? 'Under ₹999'
            : 'Community Deal',
          fetchedAt: new Date().toISOString().split('T')[0]
        };
      });
  } catch (e) {
    console.log(`r/${subreddit} failed:`, e.message);
    return [];
  }
}

async function main() {
  console.log('Fetching deals from free sources...');
  const today = new Date().toISOString().split('T')[0];

  const rssFeeds = await Promise.all(RSS_FEEDS.map(fetchRssFeed));

  const [
    desiDeal,
    indianGaming,
    india,
    amazonIndia,
    frugalIn,
    phoneDeals,
    books,
    buildapc
  ] = await Promise.all([
    fetchSubreddit('DesiDeal',
      'https://www.reddit.com/r/DesiDeal/top.json?t=day&limit=25'),
    fetchSubreddit('IndianGaming',
      'https://www.reddit.com/r/IndianGaming/top.json?t=day&limit=15',
      'gaming'),
    fetchSubreddit('india',
      'https://www.reddit.com/r/india/search.json?q=deal+discount+sale&sort=top&t=day&limit=15'),
    fetchSubreddit('AmazonIndia',
      'https://www.reddit.com/r/AmazonIndia/top.json?t=day&limit=20'),
    fetchSubreddit('Frugal_in',
      'https://www.reddit.com/r/Frugal_in/top.json?t=day&limit=15'),
    fetchSubreddit('PhoneDealsIndia',
      'https://www.reddit.com/r/PhoneDealsIndia/top.json?t=day&limit=15',
      'phones'),
    fetchSubreddit('booksofindia',
      'https://www.reddit.com/r/booksofindia/top.json?t=day&limit=10',
      'books'),
    fetchSubreddit('buildapc',
      'https://www.reddit.com/r/buildapc/top.json?t=day&limit=10',
      'computers')
  ]);

  const all = [
    ...rssFeeds.flat(),
    ...desiDeal, ...indianGaming, ...india,
    ...amazonIndia, ...frugalIn, ...phoneDeals,
    ...books, ...buildapc
  ];

  const seen = new Set();
  const unique = all.filter(item => {
    const key = item.title.toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`Fetched ${unique.length} unique deals`);

  const categories = {
    phones: unique.filter(d => d.category === 'phones'),
    computers: unique.filter(d => d.category === 'computers'),
    gaming: unique.filter(d => d.category === 'gaming'),
    books: unique.filter(d => d.category === 'books'),
    audio: unique.filter(d => d.category === 'audio'),
    fashion: unique.filter(d => d.category === 'fashion'),
    home: unique.filter(d => d.category === 'home'),
    tv: unique.filter(d => d.category === 'tv'),
    camera: unique.filter(d => d.category === 'camera'),
    fitness: unique.filter(d => d.category === 'fitness'),
    beauty: unique.filter(d => d.category === 'beauty'),
    deals: unique.filter(d => d.category === 'deals')
  };

  const platforms = {
    amazon: unique.filter(d => d.platform === 'amazon'),
    flipkart: unique.filter(d => d.platform === 'flipkart'),
    meesho: unique.filter(d => d.platform === 'meesho'),
    other: unique.filter(d =>
      !['amazon','flipkart','meesho'].includes(d.platform))
  };

  const byPrice = {
    under_499: unique
      .filter(d => d.price > 0 && d.price < 499)
      .sort((a, b) => a.price - b.price),
    under_999: unique
      .filter(d => d.price >= 499 && d.price < 999)
      .sort((a, b) => a.price - b.price),
    under_1999: unique
      .filter(d => d.price >= 999 && d.price < 1999)
      .sort((a, b) => a.price - b.price)
  };

  const trending = [...unique]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 20);

  const bigDiscounts = unique
    .filter(d => d.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 20);

  const productOfDay = trending[0] || unique[0] || null;

  const output = {
    updated: today,
    updatedTime: new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit'
    }),
    total: unique.length,
    featured: productOfDay,
    trending,
    bigDiscounts,
    byPrice,
    categories,
    platforms,
    sources: [
      ...RSS_FEEDS.map((f) => f.source),
      'r/DesiDeal', 'r/AmazonIndia', 'r/PhoneDealsIndia',
      'r/IndianGaming', 'r/Frugal_in', 'r/booksofindia',
      'r/buildapc', 'r/india'
    ]
  };

  writeData(path.join(__dirname, '../src/data/products.json'), output, {
    count: unique.length,
    previousCount: (prev) =>
      Array.isArray(prev.trending) ? prev.trending.length : Number(prev.total) || 0,
    label: 'deals',
  });
}

main().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
