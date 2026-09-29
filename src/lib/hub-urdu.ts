/**
 * Urdu resources: poetry, dictionaries, fonts and news.
 *
 * Extracted verbatim from the old /hub/* route by scripts/extract-hub-data.mjs.
 * These entries were never in src/lib/resources.ts, which is why they had to be
 * moved into a module before the hub routes could be redirected into SlashBar
 * categories. Do not hand-edit; re-run the extractor instead.
 */

export interface UrduResource {
  name: string;
  desc: string;
  url: string;
  emoji: string;
  category: string;
}

export const URDU_RESOURCES: UrduResource[] = [
  {
    name: "Rekhta",
    desc: "World's largest free Urdu poetry collection",
    url: "https://rekhta.org",
    emoji: "📖",
    category: "Poetry",
  },
  {
    name: "Urdu Word",
    desc: "Online Urdu-English dictionary with word meanings",
    url: "https://www.urduword.com",
    emoji: "📕",
    category: "Dictionary",
  },
  {
    name: "Google Noto Nastaliq",
    desc: "Free Urdu font - best for Nastaliq script",
    url: "https://fonts.google.com/noto/specimen/Noto+Nastaliq+Urdu",
    emoji: "🔤",
    category: "Fonts",
  },
  {
    name: "Google Input Tools - Urdu",
    desc: "Type Urdu in your browser without an Urdu keyboard",
    url: "https://www.google.com/inputtools/try/",
    emoji: "⌨️",
    category: "Tools",
  },
  {
    name: "Rekhta Aamozish",
    desc: "Learn the Urdu script and poetry online, free",
    url: "https://www.rekhta.org/aamozish",
    emoji: "🎓",
    category: "Learning",
  },
  {
    name: "BBC Urdu",
    desc: "News and features in Urdu",
    url: "https://www.bbc.com/urdu",
    emoji: "📰",
    category: "News",
  },
  {
    name: "Voice of America - Urdu",
    desc: "Urdu news and current affairs",
    url: "https://www.voanews.com/urdu",
    emoji: "📻",
    category: "News",
  },
  {
    name: "HamariWeb Urdu",
    desc: "Urdu literature and resources",
    url: "https://hamariweb.com/urdu",
    emoji: "📚",
    category: "Literature",
  },
];
