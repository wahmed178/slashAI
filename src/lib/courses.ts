/**
 * Slash Courses — real, structured courses with lessons and tests.
 *
 * Inspired by roadmap.sh: a course is modules → lessons, and each module ends
 * with a graded test. Everything runs on-device: progress, lesson completion
 * and test scores persist in localStorage (key "slashai-courses-v1").
 *
 * Content rules:
 * - Lessons are written to teach (not placeholder text) and stay evergreen.
 * - Tests only ask questions the lessons actually answered.
 * - Slugs are unique across courses.
 */

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  /** body is an array of blocks rendered in order */
  body: LessonBlock[];
}

export type LessonBlock =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "list"; items: string[] }
  | { t: "code"; lang?: string; text: string }
  | { t: "callout"; tone: "tip" | "warn"; text: string }
  | { t: "practice"; text: string };

export interface TestQuestion {
  q: string;
  options: string[];
  /** index of the correct option */
  a: number;
  /** shown after answering, win or lose */
  why: string;
}

export interface CourseModule {
  title: string;
  lessons: Lesson[];
  test: {
    passScore: number; // e.g. 0.7 → 70%
    questions: TestQuestion[];
  };
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  tint: string; // hex
  level: "Beginner" | "Intermediate" | "Advanced";
  audience: string;
  outcome: string[]; // what you can do after finishing
  modules: CourseModule[];
}

export const COURSES: Course[] = [
  {
    id: "prompt-engineering",
    title: "Prompt Engineering: Zero to Reliable",
    tagline: "Stop hoping. Get the exact output you asked for, every time.",
    emoji: "🎯",
    tint: "#2dd4bf",
    level: "Beginner",
    audience: "Anyone using ChatGPT, Claude or Gemini for real work",
    outcome: [
      "Structure prompts with role, task, context and format",
      "Fix vague or messy outputs without starting over",
      "Chain prompts for multi-step work and force valid JSON",
      "Keep a personal library of prompts that reliably work",
    ],
    modules: [
      {
        title: "Module 1 · The anatomy of a prompt",
        lessons: [
          {
            id: "pe-anatomy",
            title: "The four parts every good prompt has",
            minutes: 6,
            body: [
              { t: "p", text: "Most people type a question and hope. A prompt is not a question — it is a brief you hand to a very fast, very literal assistant. Every strong prompt answers four things: who the model is, what to produce, what context it has, and what shape the output takes." },
              { t: "h", text: "1. Role" },
              { t: "p", text: "Tell the model who it should be. 'You are a senior financial analyst' changes vocabulary, assumptions and depth compared to no role at all. One sentence is enough." },
              { t: "h", text: "2. Task" },
              { t: "p", text: "One clear deliverable. 'Write a product description for a £12 phone stand, maximum 60 words' beats 'help me with product descriptions' every single time." },
              { t: "h", text: "3. Context" },
              { t: "p", text: "The specifics only you know: audience, tone, constraints, what to avoid. Context is where generic output becomes useful output." },
              { t: "h", text: "4. Format" },
              { t: "p", text: "Say what the answer should look like: a table, three bullet points, JSON with exact keys, a 120-word paragraph. Without a format, the model picks one at random." },
              { t: "code", lang: "text", text: "You are a senior product copywriter.\nTask: write a product description for a £12 aluminium phone stand.\nContext: buyers are desk-setup enthusiasts on Instagram; avoid superlatives; mention stability.\nFormat: maximum 60 words, one paragraph, end with the benefit." },
              { t: "callout", tone: "tip", text: "Copy that structure — role, task, context, format — into a note. It is the skeleton of 90% of prompts you will ever need." },
              { t: "practice", text: "Rewrite one prompt you used this week with all four parts. Compare the outputs side by side." },
            ],
          },
          {
            id: "pe-vague",
            title: "Why vague prompts produce vague answers",
            minutes: 5,
            body: [
              { t: "p", text: "The model predicts what a good answer usually looks like. When your prompt is vague, 'usually' means the statistical middle — generic, hedged, everyone-shaped. Every specific you add moves the answer away from the middle and toward your situation." },
              { t: "h", text: "The three most expensive missing pieces" },
              { t: "list", items: [
                "Missing audience — the model writes for everyone, which means no one.",
                "Missing length — you get a wall of text when you wanted a paragraph, or vice versa.",
                "Missing example — one example of the style you want is worth ten lines of description.",
              ] },
              { t: "p", text: "Show, don't only tell: paste one example of the output you like (even a rough one) and ask for 'the same style'. Models are extremely good at mimicry and merely okay at guessing." },
              { t: "practice", text: "Take a vague prompt from your history, add audience + length + one example, and rerun it." },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "What are the four parts of a well-structured prompt?",
              options: ["Greeting, task, politeness, sign-off", "Role, task, context, format", "Question, answer, example, summary", "Title, body, tags, length"],
              a: 1,
              why: "Role, task, context and format — every strong prompt answers all four.",
            },
            {
              q: "A prompt without a specified length or format will usually produce…",
              options: ["Exactly what you pictured", "A statistically average, generic answer", "An error message", "A shorter answer"],
              a: 1,
              why: "Vague in, vague out: the model defaults to the statistical middle of all answers.",
            },
            {
              q: "What is the fastest way to control writing style?",
              options: ["Describe the style in ten adjectives", "Paste one example of the style and ask for 'the same'", "Ask twice", "Use ALL CAPS"],
              a: 1,
              why: "Models are excellent at mimicry — one pasted example beats a paragraph of description.",
            },
          ],
        },
      },
      {
        title: "Module 2 · Getting unstuck",
        lessons: [
          {
            id: "pe-fix",
            title: "Fixing a bad output without starting over",
            minutes: 6,
            body: [
              { t: "p", text: "When an answer is wrong, most people retype the whole prompt. Don't. The conversation already contains useful context — steer instead of restarting." },
              { t: "h", text: "The four steering moves" },
              { t: "list", items: [
                "\"Too long — cut it to 80 words, keep the statistics.\" (correction + constraint)",
                "\"You assumed I sell B2B. I sell to hobbyists. Rewrite for them.\" (correct the context)",
                "\"Give me three versions: one formal, one friendly, one blunt.\" (diverge, then pick)",
                "\"What information would make this answer better?\" (flip the interview)",
              ] },
              { t: "h", text: "When to restart instead" },
              { t: "p", text: "If the model misunderstood the task itself (not the details), a clean start with a sharper prompt wins. Patching a misunderstood task piles patches on patches." },
              { t: "practice", text: "Deliberately ask for something badly, then rescue the output with two steering moves." },
            ],
          },
          {
            id: "pe-chain",
            title: "Chaining prompts for big jobs",
            minutes: 7,
            body: [
              { t: "p", text: "Big tasks ('plan my product launch') produce big, shallow answers. Split the job into a chain where each prompt feeds the next, and each step stays reviewable." },
              { t: "h", text: "A reliable 4-step chain" },
              { t: "list", items: [
                "Step 1 — Research: 'List the 8 decisions I must make to launch a paid newsletter. One line each.'",
                "Step 2 — Options: 'For each decision, give the two most common choices with one trade-off.'",
                "Step 3 — Draft: 'Given my answers below [paste], write the one-page launch plan.'",
                "Step 4 — Critique: 'Review this plan as a skeptical editor. List the three weakest points and how to fix each.'",
              ] },
              { t: "p", text: "The critique step is the one almost everyone skips — and the one that most improves quality. Asking the model to attack its own draft surfaces problems you'd otherwise find after shipping." },
              { t: "callout", tone: "warn", text: "Keep each step's output short enough to actually read. A chain you skim is a chain you can't steer." },
              { t: "practice", text: "Turn one of your big, vague prompts into a 3-step chain and run it end to end." },
            ],
          },
          {
            id: "pe-json",
            title: "Getting structured output you can paste into code",
            minutes: 6,
            body: [
              { t: "p", text: "To use AI output in a spreadsheet, an app or automation, you need structure — usually JSON. Three rules make JSON output nearly reliable." },
              { t: "list", items: [
                "Show the exact schema: give the keys, the types, and one filled example.",
                "Say 'Return ONLY the JSON, no prose, no code fences.' — then the response is paste-ready.",
                "Name what to do with missing data: 'If a field is unknown, use null — never invent values.'",
              ] },
              { t: "code", lang: "text", text: "Return ONLY valid JSON, no prose, matching:\n{\"items\":[{\"name\":string,\"price_gbp\":number,\"in_stock\":boolean}]}\nFrom the text below. Unknown values → null.\n\n<paste product listing text>" },
              { t: "callout", tone: "tip", text: "Validate on your side anyway: even a 95%-reliable format needs a try/parse in code. Trust, then verify." },
              { t: "practice", text: "Ask for JSON extraction from any messy text you have — an email, a listing, a form — and paste the result into a JSON formatter to check it." },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "An output is mostly right but too long and B2B-flavoured. Best move?",
              options: ["Retype the whole prompt", "Steer: give the correction plus the new constraints", "Ask it to try harder", "Start a new chat with a different model"],
              a: 1,
              why: "Steering keeps the good context and fixes exactly what's wrong — restart only when the task itself was misunderstood.",
            },
            {
              q: "Which chain step do most people skip that most improves quality?",
              options: ["Research", "Drafting", "The critique step", "Formatting"],
              a: 2,
              why: "Asking the model to critique its own draft surfaces the weak points before you ship.",
            },
            {
              q: "For reliable JSON output you should…",
              options: ["Say 'give me JSON'", "Show the exact schema, ban prose, define missing-value behaviour", "Ask for a table instead", "Never use JSON with AI"],
              a: 1,
              why: "Exact schema + 'ONLY the JSON' + null-handling rules is what makes structured output paste-ready.",
            },
            {
              q: "When should you restart the conversation instead of steering?",
              options: ["Never", "When the model misunderstood the task itself", "After every answer", "When output is too long"],
              a: 1,
              why: "Patching a misunderstood task stacks patches; a sharper fresh prompt wins.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "web-fundamentals",
    title: "How the Web Actually Works",
    tagline: "URLs to render: the moving parts every builder should be able to name.",
    emoji: "🌐",
    tint: "#38bdf8",
    level: "Beginner",
    audience: "New developers and the curious",
    outcome: [
      "Explain what happens between typing a URL and seeing a page",
      "Read HTTP status codes and browser DevTools without guessing",
      "Know what HTML, CSS and JS each own — and where they meet",
      "Understand what caches, CDNs and the browser store do",
    ],
    modules: [
      {
        title: "Module 1 · From URL to pixels",
        lessons: [
          {
            id: "wf-request",
            title: "What happens when you press Enter",
            minutes: 7,
            body: [
              { t: "p", text: "Type a URL and hit Enter. In the next few hundred milliseconds, a precise sequence plays out — and knowing it turns the web from magic into machinery." },
              { t: "list", items: [
                "1. DNS — the browser asks: what IP address is example.com? (a global phone book, cached everywhere)",
                "2. TCP/TLS — the browser opens a connection to that server and secures it (the padlock: HTTPS).",
                "3. HTTP request — the browser asks for the page: 'GET /' plus headers describing itself.",
                "4. HTTP response — the server replies with a status code and the HTML document.",
                "5. Parse — the browser reads HTML top to bottom, building the page's map (the DOM).",
                "6. Fetch subresources — CSS, JavaScript and images discovered in the HTML are each fetched the same way.",
                "7. Render — styles are applied, layout is computed, JavaScript runs, pixels appear.",
              ] },
              { t: "h", text: "Status codes, the useful five" },
              { t: "list", items: [
                "200 OK — here's the content you asked for.",
                "301 / 308 — moved permanently; browsers and search engines update their links.",
                "404 Not Found — the path exists in the URL scheme but no page lives there.",
                "500 Internal Server Error — the server itself failed while producing the page.",
                "429 Too Many Requests — you (or everyone) hit a rate limit; slow down.",
              ] },
              { t: "callout", tone: "tip", text: "Open DevTools → Network tab, reload, and watch steps 3–6 happen by name. One minute of watching beats an hour of reading." },
              { t: "practice", text: "Visit any site with DevTools open. Find the main HTML document and one image; note their status codes and sizes." },
            ],
          },
          {
            id: "wf-trio",
            title: "HTML, CSS and JS: who owns what",
            minutes: 6,
            body: [
              { t: "p", text: "Every web page is three languages with a strict division of labour. Confusing their jobs is the root of most beginner bugs." },
              { t: "h", text: "HTML — structure and meaning" },
              { t: "p", text: "HTML says what things ARE: a heading, a navigation, a button, an image. Semantic HTML (nav, main, button) is what screen readers and search engines read." },
              { t: "h", text: "CSS — appearance" },
              { t: "p", text: "CSS says how things LOOK: colour, spacing, layout, what happens on hover. If a page looks wrong, the bug is almost always CSS — not HTML." },
              { t: "h", text: "JavaScript — behaviour" },
              { t: "p", text: "JS makes things DO: respond to clicks, fetch data, update the page. If a button does nothing, the bug is in JS." },
              { t: "code", lang: "html", text: "<!-- HTML: what -->\n<button class=\"save\">Save</button>\n\n/* CSS: how it looks */\n.save { background: #2dd4bf; padding: 8px 16px; }\n\n// JS: what it does\nsaveBtn.addEventListener(\"click\", () => save());" },
              { t: "callout", tone: "warn", text: "If content is missing, check HTML. If it's ugly, check CSS. If it's inert, check JS. That triage alone fixes half of all beginner debugging." },
              { t: "practice", text: "Open any page in DevTools, delete a node in the Elements panel (HTML), then change a colour in Styles (CSS). Reload to restore." },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "What is the correct order after pressing Enter on a URL?",
              options: ["Render → DNS → HTTP", "DNS → TCP/TLS → HTTP request/response → parse → render", "HTTP → DNS → TLS", "Parse → DNS → render"],
              a: 1,
              why: "DNS finds the server, TLS secures it, HTTP fetches the document, the browser parses and then renders.",
            },
            {
              q: "A page loads but a button does nothing when clicked. Where is the bug most likely?",
              options: ["HTML", "CSS", "JavaScript", "DNS"],
              a: 2,
              why: "Behaviour lives in JS — appearance in CSS, structure in HTML.",
            },
            {
              q: "Which status code means the server failed while producing the page?",
              options: ["404", "301", "429", "500"],
              a: 3,
              why: "5xx codes are server errors; 500 is the generic 'the server itself failed'.",
            },
          ],
        },
      },
      {
        title: "Module 2 · The moving parts you can't see",
        lessons: [
          {
            id: "wf-cache",
            title: "Caches, CDNs and why updates 'don't show'",
            minutes: 7,
            body: [
              { t: "p", text: "Most of the web's speed comes from copying things closer to you — and most 'my update isn't live' panic comes from those copies not being thrown away." },
              { t: "h", text: "The four caches, near to far" },
              { t: "list", items: [
                "Browser cache — files your browser stored on disk with the response (often for a year, for hashed assets).",
                "Service worker — a script that can serve your whole app offline (this is how PWAs work).",
                "CDN edge — servers worldwide holding copies of the site's static files.",
                "Server-side cache — pre-computed pages the backend reuses instead of rebuilding.",
              ] },
              { t: "p", text: "That's why asset files get hashed names (app-Dx8f2.js): change the file, the name changes, every cache treats it as brand new. When a site update 'doesn't show', a stale cache somewhere is the usual suspect — a hard refresh or cache-busting deploy fixes it." },
              { t: "practice", text: "Hard-refresh any site (Ctrl/Cmd+Shift+R) and compare the Network tab before and after." },
            ],
          },
          {
            id: "wf-client-server",
            title: "Client, server, and where the code runs",
            minutes: 6,
            body: [
              { t: "p", text: "'Front-end' and 'back-end' name where code runs: in the user's browser, or on the developer's server. The split decides what each side can see, trust and do." },
              { t: "h", text: "Client-side (your browser)" },
              { t: "list", items: [
                "Runs on the visitor's device — you can read all of it in DevTools.",
                "Great for instant interaction: animations, form validation, offline tools.",
                "Never trust it with secrets: anything in browser code or localStorage is public.",
              ] },
              { t: "h", text: "Server-side (the site's server)" },
              { t: "list", items: [
                "Runs where the developer controls the machine — visitors can't see the code.",
                "Owns the database, secrets and anything that must be enforced (payments, permissions).",
                "Responds over HTTP with data (JSON) or whole pages (HTML).",
              ] },
              { t: "callout", tone: "warn", text: "Rule of thumb: enforce every rule that matters on the server. Anything checked only in the browser can be bypassed by the user." },
              { t: "practice", text: "Open DevTools on any site and read 30 seconds of its client-side code. Then imagine trying to hide an API key there — that's why it must live server-side." },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "Why do asset files get hashed names like app-Dx8f2.js?",
              options: ["Style", "So caches treat a changed file as a brand-new one", "Compression", "It's required by HTML"],
              a: 1,
              why: "Changed name → every cache (browser, CDN) refetches → updates always reach users.",
            },
            {
              q: "Where must a rule that really matters (like payments) be enforced?",
              options: ["In the browser's JavaScript", "In localStorage", "On the server", "In CSS"],
              a: 2,
              why: "Browser code is fully visible and modifiable by the user — only the server can be trusted to enforce.",
            },
            {
              q: "What does a service worker do?",
              options: ["Speeds up DNS", "Can serve a whole app offline from a local cache", "Renders CSS faster", "Encrypts passwords"],
              a: 1,
              why: "A service worker is the script that lets PWAs keep working with zero connection.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "ship-a-web-app",
    title: "Ship Your First Web App",
    tagline: "From empty folder to a real URL people can open — in seven honest steps.",
    emoji: "🚀",
    tint: "#a78bfa",
    level: "Beginner",
    audience: "Anyone with an idea and no shipped product yet",
    outcome: [
      "Scope an app to a first version you can actually finish",
      "Ship a real URL with HTTPS and a custom domain",
      "Add the three 'boring' features that make apps feel real: persistence, feedback, errors",
      "Know the 5-point pre-launch check",
    ],
    modules: [
      {
        title: "Module 1 · Scope and build",
        lessons: [
          {
            id: "swa-scope",
            title: "Scope: the one-screen first version",
            minutes: 6,
            body: [
              { t: "p", text: "The graveyard of side projects is the feature list. The fix is brutal scoping: version 1 gets ONE screen and ONE job." },
              { t: "h", text: "The one-sentence scope" },
              { t: "p", text: "'A user does [action] and gets [result].' If your app needs two sentences, it's two apps. Write it at the top of your README and measure every feature idea against it." },
              { t: "h", text: "The cut list for v1" },
              { t: "list", items: [
                "No accounts — store data on-device (localStorage) or make it a single-player tool.",
                "No admin panel — you are the admin; edit the data file.",
                "No settings page — hardcode the defaults.",
                "One input, one output — a calculator, a generator, a converter. Polish beats breadth.",
              ] },
              { t: "callout", tone: "tip", text: "Pick a stack you already know over the trending one. The goal in v1 is a shipped URL, not a résumé of technologies." },
              { t: "practice", text: "Write your one-sentence scope. Then delete every feature that doesn't serve it — including the ones you love." },
            ],
          },
          {
            id: "swa-stack",
            title: "Picking a boring stack (and what each piece does)",
            minutes: 7,
            body: [
              { t: "p", text: "A 'boring' stack is one with a decade of Stack Overflow answers. For a first app that means: a JavaScript framework, a host, and at most one backend service." },
              { t: "h", text: "The three pieces" },
              { t: "list", items: [
                "Framework (React, Vue, Svelte) — builds the UI from components. Pick one; they all ship real apps.",
                "Host (Netlify, Vercel, Cloudflare Pages) — turns 'npm run build' into a public HTTPS URL, free for static sites.",
                "Backend service (Supabase, Firebase) — only when you need accounts or shared data. Skip it for v1 if you can.",
              ] },
              { t: "p", text: "Static-first is the honest default: if your v1 needs no database, ship a static site. It's faster, un-hackable, and free at every meaningful scale." },
              { t: "callout", tone: "warn", text: "Don't choose the database before the screen. Data model follows UI, never the reverse, in v1." },
              { t: "practice", text: "Write down your framework + host. If either line is blank or trendy-new, swap it for what you already know." },
            ],
          },
          {
            id: "swa-build-loop",
            title: "The daily build loop that finishes projects",
            minutes: 5,
            body: [
              { t: "p", text: "Projects die in the middle, not the start. Survive the middle with a loop that always leaves the app working." },
              { t: "list", items: [
                "Pick the smallest next thing that moves the screen forward (a button, a saved field).",
                "Build it until it works end-to-end — ugly is fine, broken is not.",
                "Ship it: commit and deploy. A live URL that's 30% done beats a local app that's 80% done.",
                "Stop while you know the next step. (This is the trick — finishing a sentence is easier than starting one.)",
              ] },
              { t: "p", text: "'Stop while you know the next step' is Hemingway's mid-sentence trick for code. You remove the cold-start friction that kills evening motivation." },
              { t: "practice", text: "Deploy something — anything — today. A 'hello world' on a real URL rewires what 'shipping' means." },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "The one-sentence scope is…",
              options: ["A marketing slogan", "'A user does [action] and gets [result]'", "The pitch deck intro", "The privacy policy"],
              a: 1,
              why: "If your app needs two sentences, it's two apps — write the sentence and cut everything that doesn't serve it.",
            },
            {
              q: "What should v1 skip almost every time?",
              options: ["HTTPS", "Accounts and an admin panel", "A homepage", "A favicon"],
              a: 1,
              why: "Accounts and admin panels are the two biggest scope-killers; on-device storage or a manual fix covers v1.",
            },
            {
              q: "Why 'stop while you know the next step'?",
              options: ["It saves battery", "It removes the cold-start friction that kills the next session's motivation", "It impresses git history", "It prevents bugs"],
              a: 1,
              why: "Finishing a known sentence is easy; deciding what to write is the friction that kills evening motivation.",
            },
          ],
        },
      },
      {
        title: "Module 2 · Make it real",
        lessons: [
          {
            id: "swa-three",
            title: "The three features that make apps feel real",
            minutes: 7,
            body: [
              { t: "p", text: "Users can't articulate it, but three 'boring' features separate a demo from an app: persistence, feedback and failure states." },
              { t: "h", text: "1. Persistence" },
              { t: "p", text: "Data survives reload. On-device storage (localStorage) covers single-user apps in ten lines. The test: reload the page — is everything still there?" },
              { t: "h", text: "2. Feedback" },
              { t: "p", text: "Every tap does something visible within 100ms: a spinner, a toast, a state change. Silence feels broken, even when code is running fine." },
              { t: "h", text: "3. Failure states" },
              { t: "p", text: "What happens offline, on empty input, on a failed fetch? Ship a designed empty state, an error message with a retry, and graceful offline behaviour. Apps are judged by their worst moments, not their best." },
              { t: "callout", tone: "tip", text: "Add them in that order. Persistence without feedback still feels broken; feedback without persistence feels fake." },
              { t: "practice", text: "Audit your project against the three. Whichever fails the reload-tap-fail test is your next task." },
            ],
          },
          {
            id: "swa-launch",
            title: "Domain, HTTPS and the pre-launch check",
            minutes: 6,
            body: [
              { t: "p", text: "Your app is one deploy from real. Here's the launch checklist that catches 95% of first-launch embarrassment." },
              { t: "h", text: "Domain + HTTPS" },
              { t: "p", text: "Buy the domain (any registrar), point it at your host's dashboard, and HTTPS cert comes free and automatic on all modern hosts. the-app-name.com beats the-app-name.netlify.app for trust and memory." },
              { t: "h", text: "The 5-point pre-launch check" },
              { t: "list", items: [
                "Mobile: use it on a real phone, not just a resized window.",
                "Fresh visitor: incognito window, cold cache — signup/first action works in under 2 minutes.",
                "Empty states: first-run screens look intentional, not broken.",
                "Title + favicon: browser tab says who you are (the two cheapest trust signals).",
                "One link out: a way to contact you — a mailto is fine.",
              ] },
              { t: "callout", tone: "warn", text: "Test the PWA/offline path if you promise it: airplane-mode the phone and open the app. 'Works offline' that doesn't is worse than not claiming it." },
              { t: "practice", text: "Run the 5-point check on your project. Fix the first failure before touching anything else." },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "The three 'real app' features, in order, are…",
              options: ["Auth, payments, analytics", "Persistence, feedback, failure states", "Dark mode, i18n, PWA", "SEO, ads, social login"],
              a: 1,
              why: "Data survives reload, every tap reacts, and failures are designed — that's the demo-to-app line.",
            },
            {
              q: "Cheapest two trust signals in the browser tab?",
              options: ["A real title and a favicon", "Analytics", "A cookie banner", "A loading screen"],
              a: 0,
              why: "Users read the tab before the page — a named tab with a favicon reads as 'real' instantly.",
            },
            {
              q: "You promised 'works offline'. The test is…",
              options: ["Trust the build log", "Airplane-mode a real phone and open the app", "Check Lighthouse once", "Ask a friend later"],
              a: 1,
              why: "Offline claims are only true if a real device with no connection proves it.",
            },
          ],
        },
      },
    ],
  },
];

/* ────────────────────── lookups & progress ────────────────────── */

export const COURSE_COUNT = COURSES.length;

export const TOTAL_LESSONS = COURSES.reduce(
  (n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0),
  0,
);

export const TOTAL_TEST_QUESTIONS = COURSES.reduce(
  (n, c) => n + c.modules.reduce((m, mod) => m + mod.test.questions.length, 0),
  0,
);

const courseById = new Map(COURSES.map((c) => [c.id, c]));
export const courseByIdSafe = (id: string | undefined) =>
  id ? courseById.get(id) : undefined;

/** all lesson ids for a course, in order */
export function lessonIdsOf(course: Course): string[] {
  return course.modules.flatMap((m) => m.lessons.map((l) => l.id));
}

export function lessonIndexInCourse(course: Course, lessonId: string) {
  const ids = lessonIdsOf(course);
  const idx = ids.indexOf(lessonId);
  return { index: idx, total: ids.length };
}

export function moduleOfLesson(course: Course, lessonId: string) {
  return course.modules.find((m) => m.lessons.some((l) => l.id === lessonId));
}

/* ────────────────────── progress (localStorage) ────────────────────── */

const STORE_KEY = "slashai-courses-v1";

export interface CourseProgress {
  /** completed lesson ids */
  lessons: string[];
  /** moduleId → best score 0..1 */
  tests: Record<string, number>;
}

type ProgressStore = Record<string, CourseProgress>;

function readStore(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as ProgressStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: ProgressStore) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    /* storage full/blocked - progress becomes session-only */
  }
}

export function getProgress(courseId: string): CourseProgress {
  const p = readStore()[courseId];
  return p ?? { lessons: [], tests: {} };
}

export function markLessonDone(courseId: string, lessonId: string) {
  const store = readStore();
  const p = store[courseId] ?? { lessons: [], tests: {} };
  if (!p.lessons.includes(lessonId)) p.lessons.push(lessonId);
  store[courseId] = p;
  writeStore(store);
}

export function saveTestScore(courseId: string, moduleId: string, score: number) {
  const store = readStore();
  const p = store[courseId] ?? { lessons: [], tests: {} };
  const prev = p.tests[moduleId] ?? 0;
  if (score > prev) p.tests[moduleId] = score;
  store[courseId] = p;
  writeStore(store);
}

/** fraction of lessons completed (0..1) */
export function lessonProgress(course: Course): number {
  const p = getProgress(course.id);
  const total = lessonIdsOf(course).length;
  return total === 0 ? 0 : p.lessons.length / total;
}

/** true when every module's test is passed at threshold */
export function courseCompleted(course: Course): boolean {
  const p = getProgress(course.id);
  return course.modules.every((m) => (p.tests[m.title] ?? 0) >= m.test.passScore);
}

/** dispatch a same-tab refresh signal for progress-driven UI */
export const COURSES_CHANGE_EVENT = "slashai-courses-change";
export function notifyCoursesChanged() {
  try {
    window.dispatchEvent(new Event(COURSES_CHANGE_EVENT));
  } catch {
    /* non-browser safety */
  }
}
