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

import { SEO_COUNTS } from "./seo-counts";

export const SITE_URL = "https://slashai.in";
export const SITE_NAME = "SlashAI";
export const OG_IMAGE = "/og-image.png";

/**
 * 5704 -> "5,704". Titles and snippets carry the real catalogue totals
 * (generated from the data, never rounded up) - this project's rule is
 * "real counts only", and a search snippet is the easiest place to lie.
 */
const num = (n: number) => n.toLocaleString("en-US");

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
    title: `SlashAI - ${num(SEO_COUNTS.commands)} Free AI Slash Commands, Tools & Games`,
    description: `Search and copy ${num(SEO_COUNTS.commands)} free AI slash commands, run ${num(SEO_COUNTS.tools)} browser tools, play ${SEO_COUNTS.games} games and browse curated free resources. Free forever, no account.`,
  },
  "/explore": {
    title: "Explore AI Commands by Category - SlashAI",
    description:
      `Browse thousands of copy-ready AI slash commands across ${SEO_COUNTS.categories} categories and ${SEO_COUNTS.subcategories} subcategories - writing, coding, marketing, data, design and more.`,
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
    title: `SlashKits - ${num(SEO_COUNTS.tools)} Free Browser Tools | SlashAI`,
    description: `Run ${num(SEO_COUNTS.tools)} free browser tools with nothing uploaded - text and case utilities, JSON, CSV, regex, hashing, encoding, colour, CSS and date maths. No account, ever.`,
  },
  "/play": {
    title: `SlashPlay - ${SEO_COUNTS.games} Free Browser Games | SlashAI`,
    description: `Play ${SEO_COUNTS.games} free browser games - Sudoku, Nonogram, table tennis, darts, bowling, cricket, checkers, word search, 2048 and more. Solo, vs AI or pass-and-play.`,
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
      `${SEO_COUNTS.collections} curated AI command collections - for students, creators, professionals and entrepreneurs, plus work, study, fitness, travel and more.`,
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
    title: "Daily Quiz - Fresh Trivia Every Day | SlashAI",
    // No category count on purpose: /quiz pulls its category list from the
    // Open Trivia DB at runtime, so any fixed number here would be invented.
    description:
      "A fresh trivia quiz every day across a wide range of categories. Beat the timer, keep your streak, and share your score. Completely free, no account.",
  },
  "/roadmaps": {
    title: "Founder Roadmaps - Step-by-Step Guides | SlashAI",
    description:
      `${SEO_COUNTS.roadmaps} step-by-step roadmaps for founders - from idea validation to first customers - with progress tracking. Free, on-device, no account.`,
  },
  "/learn": {
    title: "Free Courses with Real Lessons & Tests | SlashAI",
    description:
      `${SEO_COUNTS.courses} structured free courses with ${SEO_COUNTS.lessons} real lessons and ${SEO_COUNTS.testQuestions} graded test questions. Progress is saved on your device - no account, no tracking.`,
  },
  "/glossary": {
    title: `AI, SaaS & Startup Glossary - ${SEO_COUNTS.glossaryTerms} Terms | SlashAI`,
    description: `Plain-English definitions for ${SEO_COUNTS.glossaryTerms} AI, SaaS, startup, design and data terms - searchable and grouped into ${SEO_COUNTS.glossaryCategories} categories.`,
  },
  "/ai-tools": {
    title: `AI Tools Directory - ${SEO_COUNTS.aiTools} Curated Tools | SlashAI`,
    description: `A hand-curated directory of ${SEO_COUNTS.aiTools} AI tools across ${SEO_COUNTS.aiToolCategories} categories, with pricing, free-tier limits and links to matching SlashAI commands.`,
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
    title: `Build Ideas Library - ${SEO_COUNTS.buildIdeas} Researched Product Ideas | SlashAI`,
    description: `${SEO_COUNTS.buildIdeas} researched product ideas with the problem, target users, MVP scope, tech stack, pricing and a first-10-customers plan. Validate your own idea too.`,
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
  "/prompts": {
    title: `${num(SEO_COUNTS.commands)} Free AI Prompts for ChatGPT, Claude & Gemini | SlashAI`,
    description: `A free library of ${num(SEO_COUNTS.commands)} copy-ready AI prompts for writing, coding, marketing, design, study and business - organised by category, with examples. No sign-up.`,
  },
  "/prompts/students": {
    title: "Best Free ChatGPT Prompts for Students (2026) | SlashAI",
    description:
      "Copy-ready AI prompts for students: study plans, active recall quizzes, essay outlines, exam prep and research help - free, no account, works in ChatGPT, Claude and Gemini.",
  },
  "/prompts/business": {
    title: "Free AI Prompts for Small Business & Marketing | SlashAI",
    description:
      "Free copy-ready AI prompts for small business: marketing copy, emails, business plans, customer analysis and pricing - works in free ChatGPT, Claude and Gemini.",
  },
  "/designs": {
    title: "Themes & Designs - SlashAI",
    description:
      "Hand-tuned themes - Dark, Light, AMOLED, Brutal and Glass. Preview each one and apply it instantly. Every theme is free.",
  },
  "/promo": {
    title: "About SlashAI - Your Free AI Command Vault",
    description:
      `What SlashAI is, in one page: ${num(SEO_COUNTS.commands)} free AI commands, ${num(SEO_COUNTS.tools)} browser tools, ${SEO_COUNTS.games} games, curated resources - no account, no tracking, free forever.`,
    noindex: true,
  },
  "/stores": {
    title: "SlashAI Stores - free online shops for small businesses",
    description:
      "Free hosted storefronts for small businesses, creators and local shops: your own subdomain, your products, orders straight to WhatsApp. No fees, no commission, no shopper accounts.",
  },
  "/stores/dashboard": {
    title: "Your store - SlashAI Stores",
    description: "Run your SlashAI store: products, orders and settings.",
    noindex: true,
  },
  "/about": {
    title: "About SlashAI - built by Waseem Ahmed, free forever",
    description:
      `The story behind SlashAI: Waseem Ahmed built a free, no-login library of ${num(SEO_COUNTS.commands)} AI commands, ${num(SEO_COUNTS.tools)} tools and ${SEO_COUNTS.games} games. Free forever, no account, built in India.`,
  },
  "/blog": {
    title: "Blog - plain-English AI guides | SlashAI",
    description:
      "Free, practical guides on using AI better: copy-ready prompts for work, study and business. No fluff, no jargon, no paywall.",
  },
  "/blog/best-free-ai-prompts-for-professionals-in-india-2026": {
    title: "Best Free AI Prompts for Professionals in India (2026) | SlashAI",
    description:
      "10 free copy-ready AI prompts for Indian professionals: emails, meeting notes, reports, resumes and appraisals. Works in free ChatGPT, Gemini and Claude.",
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
    description: `Search ${num(SEO_COUNTS.commands)} copy-ready AI slash commands by task, category or keyword.`,
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

/* ────────────────────────── FAQs (People Also Play) ──────────────────────────
 * Question/answer content per path. Two consumers:
 *  1. The root head emits FAQPage JSON-LD for paths listed here (rich results).
 *  2. The FaqSection component renders the same Q&As visibly on the page —
 *     Google requires visible content to match the markup.
 * Deliberately static data: no catalogue imports, stays bundle-safe.
 */

export interface FaqItem {
  q: string;
  a: string;
}

const FAQS: Record<string, FaqItem[]> = {
  "/tools/sip-calculator": [
    { q: "What is a SIP calculator?", a: "A SIP (Systematic Investment Plan) calculator estimates the future value of regular monthly investments in mutual funds. Enter your monthly amount, expected annual return and years to see the projected corpus, how much you invested and how much is estimated returns." },
    { q: "How is SIP return calculated?", a: "This calculator uses the standard future-value-of-annuity formula: FV = P × ((1+r)^n − 1) / r × (1+r), where P is your monthly investment, r is the monthly rate of return (annual ÷ 12) and n is the number of months. It compounds monthly, matching how most SIP platforms report returns." },
    { q: "Is this SIP calculator free?", a: "Yes — completely free with no ads, no sign-up and no data collection. Everything runs in your browser; your numbers never leave your device." },
    { q: "What return rate should I assume?", a: "Historically, diversified equity mutual funds in India have averaged around 10–12% annually over long periods, but past performance never guarantees future results. The calculator supports any rate from 1% to 30% so you can compare scenarios." },
  ],
  "/tools/emi-calculator": [
    { q: "What is an EMI?", a: "EMI (Equated Monthly Instalment) is the fixed amount you pay every month towards a loan, covering both principal and interest. It stays constant for fixed-rate loans across the tenure." },
    { q: "How is EMI calculated?", a: "EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the loan principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly instalments. The calculator also shows the total interest you will pay over the tenure." },
    { q: "Can I use it for home, car and personal loans?", a: "Yes. The formula is identical for all amortised loans — enter the loan amount, interest rate and tenure for a home loan, car loan, personal loan or education loan." },
    { q: "Does this calculator store my data?", a: "No. All calculations run locally in your browser. Nothing is uploaded, saved or shared." },
  ],
  "/tools/image-compress": [
    { q: "How do I compress an image online for free?", a: "Open this tool, pick or drop your image, choose a quality level and download the compressed file. Everything happens in your browser — the image is never uploaded to any server." },
    { q: "Does compressing an image reduce quality?", a: "JPEG/WebP compression trades some detail for a smaller file. At quality 80–85 the visual difference is usually imperceptible while the file shrinks 60–90%. You can preview the result before downloading." },
    { q: "What formats can I compress?", a: "JPG, PNG and WebP images up to your browser's memory limit. Converting PNG photos to JPEG or WebP typically saves the most space." },
    { q: "Is my image uploaded anywhere?", a: "No. Unlike most online compressors, this tool processes the image entirely on your device using the browser's canvas — the file never leaves your computer or phone." },
  ],
  "/tools/age-calculator": [
    { q: "How do I calculate my exact age?", a: "Enter your date of birth and the tool computes your age in years, months and days, plus your next birthday countdown. It accounts for leap years and varying month lengths automatically." },
    { q: "Can I calculate age on a specific date?", a: "Yes — change the 'age at date' field to any past or future date to see how old you were or will be on that day." },
    { q: "Does it work for dates before 1970?", a: "Yes. Any valid calendar date works, including historical dates — the calculation is pure date arithmetic." },
  ],
  "/tools/qr-code": [
    { q: "How do I create a QR code for free?", a: "Type or paste any text, link or Wi-Fi credentials, and the QR code generates instantly. Download it as a PNG image — no watermark, no expiry, no sign-up." },
    { q: "Do these QR codes expire?", a: "Never. The QR pattern encodes your content directly — there is no redirect service that can shut down, unlike 'free' QR sites that expire codes after days." },
    { q: "Can I make a QR code for a website link?", a: "Yes — paste any URL and phones scanning it will open the site. A common use is printing QR codes for menus, posters, business cards or Wi-Fi sharing." },
    { q: "Is my data sent to a server?", a: "No. The QR code is drawn in your browser from your input. Nothing you type is transmitted anywhere." },
  ],
  "/tools/bmi-calculator": [
    { q: "How is BMI calculated?", a: "BMI = weight (kg) ÷ height (m)². For imperial units the tool converts first. Enter your height and weight and the result appears instantly with the standard WHO category." },
    { q: "What is a healthy BMI?", a: "The WHO classifies 18.5–24.9 as healthy weight, 25–29.9 as overweight and 30+ as obese. Below 18.5 is considered underweight. BMI is a population screening tool, not a diagnosis — athletes with high muscle mass can read 'overweight' while being perfectly healthy." },
    { q: "Is BMI accurate for everyone?", a: "No. It does not distinguish muscle from fat and is not calibrated for children, pregnant women or the elderly. Treat it as a rough indicator and consult a professional for personal guidance." },
    { q: "Is this BMI calculator free and private?", a: "Completely free, and your height and weight never leave your device — there is no server involved." },
  ],
  "/tools/percentage-calculator": [
    { q: "How do I calculate a percentage of a number?", a: "Multiply the number by the percentage and divide by 100 — or just use this tool: enter the percentage and the number, and it shows the result instantly (e.g. 15% of 240 = 36)." },
    { q: "How do I find what percentage one number is of another?", a: "Divide the part by the whole and multiply by 100. The tool's 'X is what % of Y' mode does this for you, including increase/decrease comparisons." },
    { q: "How do I calculate percentage increase?", a: "Percentage change = (new − old) ÷ old × 100. A negative result is a decrease. The calculator has a dedicated change mode so you don't need to remember the formula." },
  ],
  "/tools/pomodoro": [
    { q: "What is the Pomodoro Technique?", a: "A focus method where you work in 25-minute sprints ('pomodoros') separated by 5-minute breaks, with a longer 15-minute break every four sprints. Named after the tomato-shaped kitchen timer its inventor used." },
    { q: "Does this pomodoro timer work offline?", a: "Yes — once the page loads, the timer runs entirely on your device. No account, no notifications permission, no server." },
    { q: "Can I change the work and break durations?", a: "The default follows the classic 25/5/15 rhythm, and the presets let you switch to common variants like 50/10 for deep work sessions." },
    { q: "Is the pomodoro timer free?", a: "Yes, like every tool in SlashKits — free forever with no ads and no sign-up." },
  ],
  "/about": [
    { q: "What is SlashAI?", a: `SlashAI is a free, no-account web app that packs the internet's useful things into one place: ${num(SEO_COUNTS.commands)} copy-ready AI slash commands, ${num(SEO_COUNTS.tools)} browser tools, ${SEO_COUNTS.games} games, structured courses with graded tests, curated resource hubs, a private meta search engine and live dashboards.` },
    { q: "Is SlashAI really free? Do I need an account?", a: "Everything on SlashAI is free and always has been. There is no account, no login, no paywall and no tracking. Everything you save (favourites, progress, notes) is stored on your own device." },
    { q: "Does SlashAI work offline?", a: "Yes — install it as an app (PWA) and the whole catalog, including tools, games and courses, keeps working with zero connection." },
    { q: "Is my data private?", a: "Yes. There is no server holding your data and no analytics profile. Tools run entirely in your browser — files you process never upload anywhere — and the meta search engine forwards nothing to SlashAI." },
  ],
  "/learn": [
    { q: "Are the courses on SlashAI really free?", a: "Yes — every course, lesson and test is free with no account and no paywall. Your progress is saved in your browser on your device." },
    { q: "Do the courses have real lessons and tests?", a: "Yes. Each course is structured into modules of written lessons (5–10 minutes each), and every module ends with a graded multiple-choice test. Score 70% or higher to pass a module; pass all module tests to complete the course." },
    { q: "Is my progress saved?", a: "Yes — lesson completion and your best test scores are stored on your device automatically. No account is created and nothing is uploaded. Clearing your browser storage clears your progress." },
    { q: "What courses can I take?", a: "SlashAI currently offers Prompt Engineering: Zero to Reliable, How the Web Actually Works, and Ship Your First Web App — with more courses added over time." },
    { q: "How is this different from the Founder Roadmaps?", a: "Roadmaps are step-by-step action plans for founder journeys (validate, ship, grow). Courses are structured lessons with graded tests that teach a skill from scratch. They work well together: take a course to learn, then follow a roadmap to apply it." },
  ],
  "/prompts": [
    { q: "What are AI prompts or slash commands?", a: "A prompt is the instruction you give an AI tool like ChatGPT, Claude or Gemini. Well-structured prompts — with a role, task, context and format — produce far better results than one-line questions. SlashAI's slash commands are battle-tested prompt templates you copy and fill in." },
    { q: "How many free prompts are on SlashAI?", a: `${num(SEO_COUNTS.commands)} curated, copy-ready prompts organised into ${SEO_COUNTS.categories} categories and ${SEO_COUNTS.subcategories} subcategories — writing, coding, marketing, design, data, business and more. Every prompt includes a description, how-to-use note and a worked example.` },
    { q: "Are the prompts free to use?", a: "Yes — every prompt is free to copy, edit and use for personal or commercial work. No account, no paywall, no attribution required." },
    { q: "Do these prompts work in ChatGPT, Claude and Gemini?", a: "Yes. The templates are model-agnostic: they rely on clear structure rather than tool-specific tricks, so they work in ChatGPT, Claude, Gemini, Copilot, Llama-based apps and most other AI assistants." },
    { q: "How do I use a prompt?", a: "Open any command page, read the example, tap Copy, paste it into your AI tool, and replace the placeholder text (shown in angle brackets) with your own details." },
  ],
  "/prompts/students": [
    { q: "What are the best ChatGPT prompts for students?", a: "The highest-value student prompts are: explain-like-I'm-new simplification, active-recall quiz generation, Feynman-technique tutoring, structured essay outlines, and spaced-repetition study plans. SlashAI's student collection includes copy-ready versions of all of them." },
    { q: "Is using AI prompts for studying cheating?", a: "Using AI to understand material, generate practice questions and get feedback is studying — like a tutor. Submitting AI output as your own work is academic dishonesty. The prompts here are built for learning, not plagiarism." },
    { q: "How do I use these prompts?", a: "Tap Copy on any prompt, paste it into ChatGPT, Claude or Gemini, and replace the bracketed placeholders with your topic or text. Each prompt page has a worked example showing exactly what to type." },
    { q: "Are these prompts free for students?", a: `Yes — all ${num(SEO_COUNTS.commands)} prompts on SlashAI are free with no account needed, including the study-specific collections on this page.` },
  ],
  "/prompts/business": [
    { q: "What AI prompts help small businesses?", a: "The most-used business prompts cover marketing copy, email sequences, business-plan drafting, customer-feedback analysis, pricing strategy and meeting summaries. This page collects the highest-impact ones from SlashAI's 5,600-prompt library." },
    { q: "Can I use these prompts for client work?", a: "Yes. Prompts are templates — whatever you produce with them is yours, with no attribution or licence needed." },
    { q: "Do the business prompts work with free ChatGPT?", a: "Yes. Every prompt is a plain-text template that works in free tiers of ChatGPT, Claude and Gemini — no plugins or paid plans required." },
    { q: "How do I get better results from AI for my business?", a: "Give the AI a role, your actual context (numbers, audience, constraints) and the exact output format you want. The prompts here bake in that structure so you get usable first drafts instead of generic filler." },
  ],
  "/blog": [
    { q: "Is the SlashAI blog free?", a: "Yes — every guide is free to read with no account and no paywall, like the rest of SlashAI." },
    { q: "What is the blog about?", a: "Practical, plain-English guides on using AI well: copy-ready prompts for professionals, students and builders, with real examples from the SlashAI library." },
  ],
  "/blog/best-free-ai-prompts-for-professionals-in-india-2026": [
    { q: "What are the best free AI prompts for professionals?", a: "The highest-leverage prompts cover everyday work: drafting and rewriting emails, summarising meeting notes, planning meetings, drafting and polishing reports, and tailoring your resume. This guide collects ten copy-ready versions from the free SlashAI library." },
    { q: "Do these prompts work in free ChatGPT, Gemini and Claude?", a: "Yes. Every prompt is plain text built on clear structure — role, task, context, format — so it works in free tiers of ChatGPT, Gemini, Claude and most other AI assistants without plugins or paid plans." },
    { q: "How do I use these prompts?", a: "Tap Copy on any prompt, paste it into your AI tool, and replace the placeholder text (shown in angle brackets) with your own details — audience, numbers, deadlines. The more context you add, the better the output." },
    { q: "Are these prompts really free?", a: `Yes — they're part of SlashAI's free library of ${num(SEO_COUNTS.commands)} AI commands. No account, no paywall, no attribution required.` },
  ],
  "/tools/pdf-merge": [
    { q: "How do I merge PDF files for free?", a: "Add two or more PDFs to this tool, drag them into the order you want, and press merge. The combined file downloads instantly — free, with no watermark and no page limits." },
    { q: "Are my files uploaded to a server?", a: "No. The merge runs entirely in your browser using JavaScript — nothing is sent to any server, unlike most online PDF mergers." },
    { q: "Is there a file size limit?", a: "Only your device's memory. Typical documents with hundreds of pages merge in a second or two." },
    { q: "Can I merge password-protected PDFs?", a: "Unlock them first — encrypted files can be read but not copied by any tool without the password." },
  ],
  "/tools/yt-thumbnail": [
    { q: "How do I download a YouTube thumbnail?", a: "Paste any YouTube link — watch, share, Shorts or embed — and every available thumbnail resolution appears with a download button. The HD size (1280×720) downloads when the channel uploaded one." },
    { q: "Why is the HD thumbnail missing for some videos?", a: "maxresdefault only exists when the channel uploaded a custom thumbnail of 1280×720 or larger. The tool probes each size and hides the ones that don't exist for that video." },
    { q: "Which URL formats does this support?", a: "youtube.com/watch?v=…, youtu.be/…, /shorts/…, /embed/…, /live/… — or just paste the 11-character video ID on its own." },
    { q: "Can I use downloaded thumbnails freely?", a: "Thumbnails are copyrighted by their creators. Use them for reference, analysis, thumbnails-in-context or fair-use commentary — not to republish as your own." },
  ],
  "/tools/social-resize": [
    { q: "What image sizes do Instagram, YouTube and WhatsApp need?", a: "Instagram posts are 1080×1080 (square) or 1080×1350 (portrait, best feed reach), Stories and Reels covers are 1080×1920, YouTube thumbnails are 1280×720 and WhatsApp display photos are 640×640. This tool has all of them as one-tap presets." },
    { q: "What is the difference between crop and fit?", a: "Crop to fill trims the image so it covers the whole canvas — edges may be cut. Fit + padding keeps the whole image visible and fills the leftover space with a colour you choose." },
    { q: "Is my photo uploaded anywhere?", a: "No. Resizing runs on a canvas inside your browser — the image never leaves your device." },
    { q: "Does resizing reduce image quality?", a: "Exports happen at each preset's full resolution. For JPG you control the quality slider; PNG is lossless but produces larger files." },
  ],
  "/tools/text-to-handwriting": [
    { q: "How do I convert text to handwriting?", a: "Paste your text, pick an ink colour and handwriting style, and the page renders it as a realistic image on ruled notebook paper — then download the PNG." },
    { q: "How much text fits on one page?", a: "About 22–26 lines depending on the font size, roughly 350–450 words — similar to a real notebook page." },
    { q: "Does it look like real handwriting?", a: "It renders in handwriting-style fonts on realistic ruled paper with a red margin line, so assignments and notes look convincingly hand-written. Four ink colours match real pens." },
    { q: "Is my text uploaded?", a: "Never. Everything renders on a canvas in your browser — nothing leaves your device." },
  ],
  "/tools/fancy-font": [
    { q: "How do I get fancy fonts on Instagram?", a: "Type your text above, tap Copy on a style you like, and paste it straight into your Instagram bio, caption or comments. The styles are Unicode characters, so they work everywhere text does." },
    { q: "Do fancy fonts work on WhatsApp and YouTube?", a: "Yes — these are real Unicode symbols, not images or webfonts. They paste into WhatsApp statuses, YouTube names, Snapchat, Twitter/X and virtually any text field." },
    { q: "Why do some letters stay plain?", a: "A few rare letters have no styled Unicode equivalent in some styles (especially Script and Fraktur); those fall back to the normal letter. Known gaps use the official alternative code points." },
    { q: "Are fancy fonts bad for accessibility?", a: "Screen readers may pronounce styled letters oddly, so use them for names and short accents rather than whole paragraphs." },
  ],
  "/tools/cgpa-percentage": [
    { q: "How do I convert CGPA to percentage?", a: "It depends on your board or university's official formula. Most Indian institutions and CBSE use CGPA × 9.5, Anna University uses × 10, VTU/JNTU use (CGPA − 0.75) × 10 and Gujarat Technological University uses (CGPA − 0.5) × 10. Pick yours in the tool and it applies the exact rule." },
    { q: "Is CGPA × 9.5 always correct?", a: "It's the official UGC conversion used by most universities, but some institutions publish their own. Always quote your institution's formula on applications — this tool matches whichever you select, including a custom scale." },
    { q: "Can I convert percentage back to CGPA?", a: "Yes — the tool converts both ways with the algebraic inverse of each formula, so 81.7% gives the same CGPA that CGPA would give 81.7%." },
  ],
  "/tools/team-generator": [
    { q: "How do I split people into random teams?", a: "Paste names (one per line or comma-separated), choose how many teams you need, and press Generate. Names are shuffled and dealt round-robin so every team differs by at most one member." },
    { q: "Can I paste names from Excel or WhatsApp?", a: "Yes — new lines and commas both split names, so a pasted spreadsheet column or a WhatsApp group list works as-is." },
    { q: "Is the team split really random?", a: "Each generate press shuffles with a Fisher–Yates pass using the browser's crypto-quality randomness, then deals evenly. The same list produces different teams every time." },
  ],
  "/tools/text-to-speech": [
    { q: "How do I convert text to speech for free?", a: "Type or paste your text, pick a voice, and press Speak — the browser reads it aloud instantly. No account, no character limits, no watermarks." },
    { q: "Which languages and voices are available?", a: "Everything your operating system has installed — usually 20+ languages including English, Hindi, Urdu, Arabic and Spanish. The dropdown groups all installed voices by language." },
    { q: "Can I download the audio as an MP3?", a: "This tool plays the speech live rather than exporting files. To save audio, play it while recording with the Voice Recorder tool — or use a dedicated TTS file service." },
    { q: "Does text to speech work offline?", a: "Most system voices run fully offline. Some cloud voices (marked Online in certain browsers) need a connection." },
  ],
  "/tools/voice-recorder": [
    { q: "How do I record my voice online?", a: "Press Start, allow microphone access, and speak. Stop to get an instant player and a download button — the clip never leaves your device." },
    { q: "Where are my recordings stored?", a: "In this page's memory only. Download any clip you want to keep — refreshing the page clears the list by design, since nothing touches a server." },
    { q: "Why is the recording a .webm file?", a: "WebM is the browser's native recording format and plays in Chrome, VLC and most players. Free converters turn it into MP3 if a platform demands that format." },
    { q: "The microphone won't turn on.", a: "Your browser needs permission: click the lock or camera icon in the address bar, set Microphone to Allow, then reload the page." },
  ],
  "/tools/screen-recorder": [
    { q: "How do I record my screen for free?", a: "Press Start, choose a tab, window or the whole screen in the browser's share picker, and record. Stop to preview and download — no install, no watermark, no time limit." },
    { q: "Can it record my voice along with the screen?", a: "Yes — tick 'Include microphone' before starting. Tab audio records automatically when you share a tab that plays sound." },
    { q: "Is there a recording length limit?", a: "Only your device's memory. Recordings encode at about 5 Mbps — roughly 37 MB per minute — so ten-minute tutorials are comfortable." },
    { q: "Why is the recording a .webm file?", a: "WebM is what browsers natively encode. It uploads directly to YouTube and plays in VLC; converters handle MP4 when a specific app requires it." },
  ],
};

/** FAQPage JSON-LD for a path, or null when the path has no FAQs. */
export function faqJsonLd(pathname: string) {
  const items = FAQS[pathname.split(/[?#]/)[0]!.replace(/\/+$/, "") || "/"];
  if (!items || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Q&As for a path, for the visible FaqSection component. */
export function faqsForPath(pathname: string): FaqItem[] {
  return FAQS[pathname.split(/[?#]/)[0]!.replace(/\/+$/, "") || "/"] ?? [];
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
      `Search and copy ${num(SEO_COUNTS.commands)} free AI slash commands, run ${num(SEO_COUNTS.tools)} browser tools, play ${SEO_COUNTS.games} browser games and browse curated free resources. Free forever, no account.`,
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
    // Deliberately no SearchAction (sitelinks searchbox). The only search route,
    // /search, is disallowed in robots.txt and carries an X-Robots-Tag noindex
    // header (vercel.json), so Google could never crawl the target and the
    // markup would be invalid. Add it back if /search is ever made crawlable.
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
