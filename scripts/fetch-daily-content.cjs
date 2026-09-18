/**
 * Daily content refresh — quote, advice slip and a museum artwork.
 *
 * All three sources are free and key-less. Every fetch is best-effort: if a
 * source is down or rate-limited we KEEP the value already in the file rather
 * than blanking the homepage widget. Exits 0 even when a source fails, so a
 * flaky third party never turns the daily job red.
 *
 * Used by .github/workflows/daily-content.yml
 */
const fs = require('fs');
const path = require('path');
const { writeData } = require('./lib/data-write.cjs');

const OUT = path.join(__dirname, '../src/data/daily-content.json');
const TIMEOUT = 8000;

function readPrevious() {
  try {
    return JSON.parse(fs.readFileSync(OUT, 'utf8'));
  } catch {
    return {};
  }
}

async function getJson(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT),
    headers: { 'User-Agent': 'SlashAI-Bot/1.0 (+https://slashai.in)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchQuote() {
  const data = await getJson('https://zenquotes.io/api/random');
  const first = Array.isArray(data) ? data[0] : null;
  if (!first || !first.q) throw new Error('empty quote payload');
  return { text: first.q, author: first.a || '' };
}

async function fetchAdvice() {
  const data = await getJson('https://api.adviceslip.com/advice');
  const advice = data?.slip?.advice;
  if (!advice) throw new Error('empty advice payload');
  return advice;
}

async function fetchArtwork() {
  // Rotate deterministically by day so the artwork changes once a day.
  const page = (Math.floor(Date.now() / 86_400_000) % 1000) + 1;
  const data = await getJson(
    `https://api.artic.edu/api/v1/artworks?limit=1&page=${page}` +
      '&fields=id,title,artist_display,image_id',
  );
  const item = data?.data?.[0];
  if (!item || !item.image_id) throw new Error('empty artwork payload');
  return {
    title: item.title || '',
    artist: item.artist_display || '',
    imageId: item.image_id || '',
  };
}

async function main() {
  const previous = readPrevious();

  const [quote, advice, artwork] = await Promise.all([
    fetchQuote()
      .then((v) => {
        console.log('Quote:', v.text.slice(0, 60));
        return v;
      })
      .catch((e) => {
        console.warn('Quote fetch failed, keeping previous:', e.message);
        return previous.quote || { text: '', author: '' };
      }),
    fetchAdvice()
      .then((v) => {
        console.log('Advice:', v.slice(0, 60));
        return v;
      })
      .catch((e) => {
        console.warn('Advice fetch failed, keeping previous:', e.message);
        return previous.advice || '';
      }),
    fetchArtwork()
      .then((v) => {
        console.log('Artwork:', v.title);
        return v;
      })
      .catch((e) => {
        console.warn('Artwork fetch failed, keeping previous:', e.message);
        return previous.artwork || { title: '', artist: '', imageId: '' };
      }),
  ]);

  const output = {
    updated: new Date().toISOString().split('T')[0],
    quote,
    advice,
    artwork,
  };

  // count = how many of the three widgets have real content
  const filled = (d) =>
    d
      ? [d.quote?.text, d.advice, d.artwork?.imageId].filter((v) => v && String(v).trim()).length
      : 0;

  writeData(OUT, output, {
    count: filled(output),
    previousCount: filled,
    label: 'daily content fields',
  });
}

main().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
