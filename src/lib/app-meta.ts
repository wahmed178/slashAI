import { VERIFIED_TOTAL, CATEGORY_TREE } from "./commands";

/** Bump this whenever you ship something users should be told about. */
export const APP_VERSION = "1.2.0";

export interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

/** Newest first. The top entry drives the "What's new" popup. */
export const CHANGELOG: ReleaseNote[] = [
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
