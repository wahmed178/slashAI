/**
 * Central SEO layer.
 *
 * The root route's head() calls `seoForPath(pathname)` for every navigation
 * (SSR + client), so every page gets a canonical URL, Open Graph / Twitter
 * metadata and, where a child route doesn't define its own, a title and
 * description. Child-route head() entries always win over the values here
 * (TanStack Start keeps the deepest match's meta), so per-route catalogue
 * titles (commands, hubs, collections...) override the generic ones.
 *
 * Deliberately imports NO catalogues (commands/slashkits/slashplay are huge)
 * to keep them out of the root/entry bundle. Tool, game and SlashBar titles
 * are derived from the URL slug with a small acronym-aware humanizer.
 */

export const SITE_URL = "https://slashai.in";
export const SITE_NAME = "SlashAI";
export const OG_IMAGE = "/og-image.png";

export interface SeoPage {
  title: string;
  description: string;
  /** pages that must stay out of the index (utility / per-user pages) */
  noindex?: boolean;
}

/* ────────────────────────── helpers ────────────────────────── */

/** Tokens that should keep a fixed casing in humanized titles. */
const ACRONYMS: Record<string, string> = {
  ai: "AI", api: "API", apis: "APIs", ascii: "ASCII", bmi: "BMI", csv: "CSV",
  cv: "CV", emi: "EMI", gst: "GST", hijri: "Hijri", html: "HTML", http: "HTTP",
  ip: "IP", json: "JSON", jwt: "JWT", ocr: "OCR", pdf: "PDF", qr: "QR",
  sip: "SIP", slug: "Slug", upi: "UPI", url: "URL", urls: "URLs", utf: "UTF",
  uuid: "UUID", seo: "SEO", tts: "TTS", stt: "STT", xp: "XP", tts2: "TTS",
};

export function humanizeSlug(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => ACRONYMS[word.toLowerCase()] ?? word[0]!.toUpperCase() + word.slice(1))
    .join(" ");
}

/** Absolute URL for a path, canonicalised: https, no query/hash, no trailing slash (except root). */
export function canonicalUrl(pathname: string): string {
  const clean = pathname.split(/[?#]/)[0]!;
  const trimmed = clean.length > 1 ? clean.replace(/\/+$/, "") : "/";
  return `${SITE_URL}${trimmed === "/" ? "" : trimmed.toLowerCase()}`;
}

/* ────────────────────────── static pages ────────────────────────── */

const STATIC_PAGES: Record<string, SeoPage> = {
  "/": {
    title: "SlashAI - 5,000+ Free AI Slash Commands, Tools & Games",
    description:
      "Search and copy 5,000+ free AI slash commands, run 150+ browser tools in SlashKits, play 50 browser games and browse 300+ curated free resources. Free forever, no account.",
  },
  "/explore": {
    title: "Explore AI Commands by Category - SlashAI",
    description:
      "Browse thousands of copy-ready AI slash commands across 25 categories and 379 subcategories - writing, coding, marketing, data, design and more.",
  },
  "/discover": {
    title: "Discover Free Tools, APIs & Learning Resources - SlashAI",
    description:
      "A curated directory of free AI tools, open APIs, GitHub gems, free courses, YouTube channels and practical websites - checked and described by hand.",
  },
  "/discover/reels": {
    title: "Prompt Reels - Swipe Through AI Commands - SlashAI",
    description:
      "A full-screen, swipeable feed of copy-ready AI prompts. Swipe up, find a prompt, tap to copy - no account needed.",
  },
  "/tools": {
    title: "SlashKits - 150+ Free Browser Tools | SlashAI",
    description:
      "Run 150+ free browser tools without uploading anything: calculators, converters, generators, PDF tools, timers, Islamic tools and more. Free forever, no account.",
  },
  "/play": {
    title: "SlashPlay - 50 Free Browser Games | SlashAI",
    description:
      "Play 50 free browser games - tic tac toe, connect four, battleship, blackjack, snake, 2048 and more. Solo, vs AI or pass-and-play. No download, works offline.",
  },
  "/slash": {
    title: "SlashBar - Every Slash App in One Rail | SlashAI",
    description:
      "SlashBar is the SlashAI app drawer: mini apps for learning, shopping, facts, romance, courses, jobs, nearby search and more - all free, all in one rail.",
  },
  "/hub": {
    title: "Hubs - Resources Curated for You - SlashAI",
    description:
      "Hand-curated resource hubs for students, developers, creators, professionals, founders and more - plus India, Finance, Islam, Urdu and Arabic hubs.",
  },
  "/collections": {
    title: "Command Collections - SlashAI",
    description:
      "16 curated AI command collections - for students, creators, professionals and entrepreneurs, plus work, study, fitness, travel and more.",
  },
  "/trending": {
    title: "Trending AI Commands & Tools - SlashAI",
    description:
      "What's hot right now: viral slash commands, trending free tools, generators, roadmaps and collections - all free, all in one place.",
  },
  "/live": {
    title: "Live Dashboard - Markets, Weather, Prayer & Space | SlashAI",
    description:
      "A free live dashboard: NIFTY & SENSEX, crypto, forex, gold, earthquakes, weather, AQI, prayer times, cricket, NASA APOD and the ISS - in one calm view.",
  },
  "/quiz": {
    title: "Daily Quiz - 24 Categories, Streaks & Timer | SlashAI",
    description:
      "A fresh trivia quiz every day across 24 categories. Beat the timer, keep your streak, and share your score. Completely free, no account.",
  },
  "/roadmaps": {
    title: "Founder Roadmaps - Step-by-Step Guides | SlashAI",
    description:
      "20 step-by-step roadmaps for founders - from idea validation to first customers - with progress tracking. Free, on-device, no account.",
  },
  "/glossary": {
    title: "AI, SaaS & Startup Glossary - 560+ Terms | SlashAI",
    description:
      "Plain-English definitions for 560+ AI, SaaS, startup, design and data terms - searchable and grouped into 8 categories.",
  },
  "/ai-tools": {
    title: "AI Tools Directory - 100+ Curated Tools | SlashAI",
    description:
      "A hand-curated directory of 100+ AI tools across 16 categories, with pricing, free-tier limits and links to matching SlashAI commands.",
  },
  "/workflow": {
    title: "AI Workflows - Chain Commands Into One Prompt | SlashAI",
    description:
      "Chain multiple AI commands into one copy-ready multi-step prompt. Reorder steps, reuse outputs, save your workflows - all on your device.",
  },
  "/web-search": {
    title: "Free Meta Search Engine - SlashAI",
    description:
      "A free, no-tracking meta search across the open web - no ads, no profile, no account required.",
    noindex: true,
  },
  "/whats-new": {
    title: "What's New - Fresh Free Finds Every Week | SlashAI",
    description:
      "The newest free tools, student offers and free courses, auto-updated weekly - with the conditions and a last-checked date on every entry.",
  },
  "/radar": {
    title: "Deals Radar - Free Offers, Checked Daily | SlashAI",
    description:
      "Free offers, student deals and limited-time freebies - each entry checked and dated so you know exactly what's still live.",
  },
  "/alternatives": {
    title: "Free Alternatives to Paid Software - SlashAI",
    description:
      "Free, legal alternatives to popular paid software - grouped by what they replace, with honest notes on what each one can and can't do.",
  },
  "/movies": {
    title: "Free Movies & TV Finder - SlashAI",
    description:
      "Find where to legally watch regional and world cinema for free - public-domain films, free-with-ads platforms and more.",
  },
  "/build-ideas": {
    title: "Build Ideas Library - 150+ Researched Product Ideas | SlashAI",
    description:
      "150+ researched product ideas with the problem, target users, MVP scope, tech stack, pricing and a first-10-customers plan. Validate your own idea too.",
  },
  "/journal": {
    title: "Build Journal - Streaks & Badges | SlashAI",
    description: "Your private build journal - daily logs, moods, streaks and achievement badges, stored on your device.",
    noindex: true,
  },
  "/everything": {
    title: "Explore Everything - All SlashAI Apps, Tools & Games",
    description:
      "Every SlashAI app, tool, game, hub and resource on one page - searchable, grouped and free.",
  },
  "/compare": {
    title: "Compare Free AI Models - GPT, Claude, Gemini & More",
    description:
      "Compare the free tiers of GPT-4o, Claude, Gemini, Grok, DeepSeek, Llama and Mistral - context, coding, reasoning, vision and speed.",
  },
  "/designs": {
    title: "Themes & Designs - SlashAI",
    description:
      "Hand-tuned themes - Dark, Light, AMOLED, Brutal and Glass. Preview each one and apply it instantly. Every theme is free.",
  },
  "/promo": {
    title: "About SlashAI - Your Free AI Command Vault",
    description:
      "What SlashAI is, in one page: 5,000+ free AI commands, 150+ browser tools, curated resources - no account, no tracking, free forever.",
  },
  "/about": {
    title: "About - SlashAI",
    description:
      "What SlashAI is, what you get free, how it works, and what it's built with.",
  },
  "/changelog": {
    title: "Changelog - SlashAI",
    description: "Every SlashAI update, newest first - new tools, games, commands and fixes.",
  },
  "/contact": {
    title: "Contact - SlashAI",
    description: "Get in touch with the SlashAI team - suggestions, bug reports and resource submissions.",
  },
  "/privacy": {
    title: "Privacy Policy - SlashAI",
    description: "SlashAI stores everything on your device. What we collect (almost nothing) and why.",
  },
  "/terms": {
    title: "Terms of Use - SlashAI",
    description: "The simple terms for using SlashAI - a free, ad-free, account-free AI command library.",
  },
  "/keyboard": {
    title: "Keyboard Shortcuts - SlashAI",
    description: "Every SlashAI keyboard shortcut - search, navigate and act without touching the mouse.",
  },
  "/me": {
    title: "Settings - SlashAI",
    description: "Your local SlashAI settings - themes, data and backups, stored on this device only.",
    noindex: true,
  },
  "/glass": {
    title: "SlashAI",
    description: "Every theme and design in SlashAI is free.",
    noindex: true,
  },
  "/graph": {
    title: "Knowledge Graph - SlashAI",
    description: "Your saved commands, resources, collections and notes as an interactive graph.",
    noindex: true,
  },
  "/favorites": {
    title: "Saved - SlashAI",
    description: "Your saved commands, tools, games and resources.",
    noindex: true,
  },
  "/recent": {
    title: "Recently Used - SlashAI",
    description: "Commands and tools you used recently on this device.",
    noindex: true,
  },
  "/random": {
    title: "Random - SlashAI",
    description: "Jump somewhere fun in SlashAI.",
    noindex: true,
  },
  "/search": {
    title: "Search AI Commands - SlashAI",
    description: "Search 5,000+ copy-ready AI slash commands by task, category or keyword.",
    noindex: true,
  },
  "/find": {
    title: "Find Anything - SlashAI",
    description: "One search across commands, tools, games and the web.",
    noindex: true,
  },
};

/* ────────────────────────── dynamic patterns ────────────────────────── */

const NOINDEX_PREFIXES = ["/settings"];

function patternPage(pathname: string): SeoPage | null {
  const segs = pathname.split("/").filter(Boolean);
  if (segs.length < 2) return null;
  const slug = decodeURIComponent(segs[1]!);
  const name = humanizeSlug(slug);

  if (segs[0] === "tools") {
    return {
      title: `${name} - Free Browser Tool | SlashAI`,
      description: `Run the ${name} free in your browser - nothing to install, nothing uploads, works offline. Part of SlashKits on SlashAI.`,
    };
  }
  if (segs[0] === "play") {
    return {
      title: `${name} - Free Browser Game | SlashAI`,
      description: `Play ${name} free in your browser - no download, no account, works offline. Part of SlashPlay on SlashAI.`,
    };
  }
  if (segs[0] === "slash") {
    return {
      title: `${name} - SlashAI Mini App`,
      description: `Open ${name} in SlashAI - a free mini app that runs right in your browser, no account needed.`,
    };
  }
  return null;
}

/* ────────────────────────── public API ────────────────────────── */

export function seoForPath(pathname: string): SeoPage {
  const clean = pathname.split(/[?#]/)[0]!;
  const trimmed = clean.length > 1 ? clean.replace(/\/+$/, "") : clean;

  const staticPage = STATIC_PAGES[trimmed] ?? STATIC_PAGES[trimmed.toLowerCase()];
  if (staticPage) return staticPage;

  const pattern = patternPage(trimmed);
  if (pattern) return pattern;

  for (const prefix of NOINDEX_PREFIXES) {
    if (trimmed.startsWith(prefix)) {
      return { title: "SlashAI", description: "SlashAI", noindex: true };
    }
  }

  // Dynamic routes (commands, hubs, collections, resources...) have their own
  // head() with real catalogue titles - the root only fills canonical/OG.
  return {
    title: "SlashAI - Free AI Commands, Tools & Resources",
    description:
      "Search and copy 5,000+ free AI slash commands, run 150+ browser tools, play browser games and browse curated free resources. Free forever, no account.",
  };
}

/** JSON-LD graphs rendered once in the root head. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL + "/",
    description: STATIC_PAGES["/"]!.description,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL + "/",
    logo: `${SITE_URL}/icons/icon-512.png`,
    founder: { "@type": "Person", name: "Waseem Ahmed" },
    sameAs: ["https://github.com/wahmed178/slashAI"],
  };
}

const SECTION_LABELS: Record<string, string> = {
  tools: "SlashKits",
  play: "SlashPlay",
  slash: "SlashBar",
  hub: "Hubs",
  discover: "Discover",
  collections: "Collections",
  explore: "Explore",
  "build-ideas": "Build Ideas",
  c: "Commands",
  r: "Resources",
};

/** BreadcrumbList built from the URL - mirrors the visible breadcrumbs. */
export function breadcrumbJsonLd(pathname: string) {
  const clean = pathname.split(/[?#]/)[0]!;
  const segs = clean.split("/").filter(Boolean);
  if (segs.length === 0) return null;

  const items: Array<{ "@type": "ListItem"; position: number; name: string; item: string }> = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
  ];
  let acc = "";
  segs.forEach((seg, i) => {
    acc += `/${seg}`;
    const label = i === segs.length - 1 ? humanizeSlug(decodeURIComponent(seg)) : SECTION_LABELS[seg] ?? humanizeSlug(decodeURIComponent(seg));
    items.push({
      "@type": "ListItem",
      position: i + 2,
      name: label,
      item: canonicalUrl(acc),
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
