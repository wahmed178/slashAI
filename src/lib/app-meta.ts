import { VERIFIED_TOTAL, CATEGORY_TREE } from "./commands";

/** Bump this whenever you ship something users should be told about. */
export const APP_VERSION = "2.16.0";

export interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

/** Newest first. The top entry drives the "What's new" popup. */
export const CHANGELOG: ReleaseNote[] = [
  {
    version: "2.16.0",
    date: "2026-09-03",
    title: "Document scanner, mock interviews, knowledge graph + analyser",
    changes: [
      "Document Scanner at /tools/scanner — capture pages with your camera (or upload on desktop), enhance and export multi-page PDF",
      "Mock Interview Simulator at /tools/interview — 500+ real questions with voice or typed answers and instant feedback on length, fillers, STAR and pace",
      "Website Analyser at /tools/analyze — free PageSpeed, security headers, SEO and social-meta audit of any URL",
      "Personal Knowledge Graph at /graph — saved commands, resources, collections and notes as an interactive force graph",
      "Install prompt: add SlashAI to your home screen after a few visits; full offline banner when your connection drops",
    ],
  },
  {
    version: "2.15.0",
    date: "2026-09-03",
    title: "Smart search, voice + AI Workflows",
    changes: [
      "Command Intelligence Engine — SlashAI learns the commands you copy, open and save (on-device only)",
      "Personalised search: usage-weighted results and a 'Based on your usage' section once you have history",
      "'Your most used' on the homepage after 10+ interactions",
      "Voice search in the homepage and search bars — English, Hindi, Arabic, Urdu",
      "AI Workflows at /workflow — chain commands into one copy-ready multi-step prompt",
      "Reorder steps by drag or arrows and mark a step to use the previous step's output",
    ],
  },
  {
    version: "2.9.0",
    date: "2026-08-29",
    title: "Free Tools — 22 browser utilities",
    changes: [
      "22 browser-based tools at /tools — all run in your browser, nothing uploaded",
      "File tools: Image Compressor, Image Converter, Images to PDF, HTML to PDF, Markdown to HTML, CSV to JSON",
      "Calculators: SIP, EMI, GST, BMI, Percentage, Age — with charts and live results",
      "Time tools: World Clock (12 cities), Pomodoro Timer, Countdown Timer",
      "Screens: Flip Clock, Focus Screen, Rain Screen, Starfield, New Tab, Quote of the Day",
      "Tools added to bottom nav bar, homepage grid, and sidebar",
    ],
  },
  {
    version: "2.8.0",
    date: "2026-08-28",
    title: "Daily Quiz",
    changes: [
      "Daily Quiz launched at /quiz with 24 trivia categories",
      "Fresh questions every calendar day per category (Open Trivia Database)",
      "Timer, streaks, score review, and share your score",
      "Open Trivia DB and The Trivia API added to Discover",
    ],
  },
  {
    version: "2.7.0",
    date: "2026-08-27",
    title: "Navigation, live ticker, version popup and polish",
    changes: [
      "Bottom navigation updated to 5 tabs: Home, Commands, Discover, Hubs, Saved",
      "Live ticker added to homepage top with markets, crypto, forex, prayer and weather data",
      "What's New popup shows on first visit after each update",
      "Loading tagline skipped on return visits for faster startup",
      "Theme toggle consolidated to desktop header only (Sun/Moon icon)",
      "FOUC prevention: inline theme script in <head> eliminates flash",
      "Scroll position resets to top on every route change",
      "Global smooth scroll with 80px scroll-margin-top on anchor targets",
      "Skeleton shimmer loading on all async content sections",
      "Page enter animation: 200ms fade+slide on route changes",
      "Homepage Hubs section redesigned as visual icon cards",
      "Homepage quick tool links replaced with clean 3×3 icon grid",
      "About page simplified and decluttered",
    ],
  },
  {
    version: "1.4.0",
    date: "2026-08-24",
    title: "Build Ideas Library",
    changes: [
      "New Build Ideas library: 150 researched product ideas with the problem, target users, MVP scope, tech stack, pricing and a first-10-customers plan.",
      "Search and filter ideas by category, difficulty, business model, build type and who they suit.",
      "'Build this' generates a full product spec plus a paste-ready Lovable prompt, cached on your device so it opens instantly and works offline.",
      "Idea validator: describe your own idea and get scores for problem clarity, competition, monetization, build and acquisition difficulty.",
      "My projects tracks saved ideas from Idea to Launch with auto-saving notes — all on-device, no account needed.",
      "Sidebar sections for Discover and Build Ideas now collapse and expand with a toggle.",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-08-23",
    title: "Free AI, Reddit and themes",
    changes: [
      "New Free AI section: Andi, Duck.ai, HuggingChat, Eye2, LMArena, Le Chat, DeepSeek, Groq, local model apps and more.",
      "New Reddit section — the subreddits and wikis that actually hold free resources, from r/freebies to the r/learnprogramming wiki.",
      "New Free Time section: legal free movies and TV, public-domain books, radio, games and good blogs.",
      "New Websites section for single-purpose sites that do one thing properly.",
      "Four new themes — Batman, Ocean, Moonlight and Warm — alongside Dark, Light and AMOLED.",
      "'I want to…' shortcuts on the home screen for when you don't know what to search.",
      "Every command now shows where to run it, with a tip for ChatGPT, Claude, Gemini, Grok, Perplexity, DeepSeek and Duck.ai.",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-08-22",
    title: "More than commands",
    changes: [
      "New Discover hub: curated AI tools, free utilities, GitHub gems, courses, YouTube channels and practical tricks.",
      "Free Radar collects new free tools, student offers and free courses — with the conditions and a last-checked date on every entry.",
      "Free alternatives to popular paid software, grouped by what they replace.",
      "Student, Professional, Developer and Creator hubs.",
      "What's New page with weekly finds, monthly drops and yearly guides.",
      "Calmer home and simpler navigation: four items on mobile, nested Discover in the sidebar, endless feed removed.",
      "Search now returns curated resources alongside commands.",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-08-22",
    title: "Cleaner, faster, more yours",
    changes: [
      `Catalog grown to ${VERIFIED_TOTAL.toLocaleString()} commands across ${CATEGORY_TREE.length} categories — money, health, travel, social and home added.`,
      "Simpler home screen: less text, bigger tap targets, filters tucked into one button.",
      "Smarter search — type several words in any order and it still finds the right command.",
      "Six accent colours to pick from in Settings.",
      "Backup and restore your favourites, history and settings as a single file.",
      "Smoother 120Hz-friendly animations and a proper launch screen instead of a black flash.",
      "This update popup, plus a full changelog in Settings.",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-08-01",
    title: "SlashAI launch",
    changes: [
      "Searchable library of AI slash commands with copy-ready prompts.",
      "Favourites, recently used and shareable command links.",
      "Works offline and installs as an app.",
    ],
  },
];

export const LATEST_RELEASE = CHANGELOG[0]!;

export const APP_DETAILS = {
  name: "SlashAI",
  tagline: "A pocket library of AI slash commands.",
  version: APP_VERSION,
  creator: "Waseem Ahmed",
  website: "https://slashai.lovable.app",
  storage: "Everything stays on this device — no account, no tracking.",
};
