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
              {
                t: "p",
                text: "Most people type a question and hope. A prompt is not a question — it is a brief you hand to a very fast, very literal assistant. Every strong prompt answers four things: who the model is, what to produce, what context it has, and what shape the output takes.",
              },
              { t: "h", text: "1. Role" },
              {
                t: "p",
                text: "Tell the model who it should be. 'You are a senior financial analyst' changes vocabulary, assumptions and depth compared to no role at all. One sentence is enough.",
              },
              { t: "h", text: "2. Task" },
              {
                t: "p",
                text: "One clear deliverable. 'Write a product description for a £12 phone stand, maximum 60 words' beats 'help me with product descriptions' every single time.",
              },
              { t: "h", text: "3. Context" },
              {
                t: "p",
                text: "The specifics only you know: audience, tone, constraints, what to avoid. Context is where generic output becomes useful output.",
              },
              { t: "h", text: "4. Format" },
              {
                t: "p",
                text: "Say what the answer should look like: a table, three bullet points, JSON with exact keys, a 120-word paragraph. Without a format, the model picks one at random.",
              },
              {
                t: "code",
                lang: "text",
                text: "You are a senior product copywriter.\nTask: write a product description for a £12 aluminium phone stand.\nContext: buyers are desk-setup enthusiasts on Instagram; avoid superlatives; mention stability.\nFormat: maximum 60 words, one paragraph, end with the benefit.",
              },
              {
                t: "callout",
                tone: "tip",
                text: "Copy that structure — role, task, context, format — into a note. It is the skeleton of 90% of prompts you will ever need.",
              },
              {
                t: "practice",
                text: "Rewrite one prompt you used this week with all four parts. Compare the outputs side by side.",
              },
            ],
          },
          {
            id: "pe-vague",
            title: "Why vague prompts produce vague answers",
            minutes: 5,
            body: [
              {
                t: "p",
                text: "The model predicts what a good answer usually looks like. When your prompt is vague, 'usually' means the statistical middle — generic, hedged, everyone-shaped. Every specific you add moves the answer away from the middle and toward your situation.",
              },
              { t: "h", text: "The three most expensive missing pieces" },
              {
                t: "list",
                items: [
                  "Missing audience — the model writes for everyone, which means no one.",
                  "Missing length — you get a wall of text when you wanted a paragraph, or vice versa.",
                  "Missing example — one example of the style you want is worth ten lines of description.",
                ],
              },
              {
                t: "p",
                text: "Show, don't only tell: paste one example of the output you like (even a rough one) and ask for 'the same style'. Models are extremely good at mimicry and merely okay at guessing.",
              },
              {
                t: "practice",
                text: "Take a vague prompt from your history, add audience + length + one example, and rerun it.",
              },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "What are the four parts of a well-structured prompt?",
              options: [
                "Greeting, task, politeness, sign-off",
                "Role, task, context, format",
                "Question, answer, example, summary",
                "Title, body, tags, length",
              ],
              a: 1,
              why: "Role, task, context and format — every strong prompt answers all four.",
            },
            {
              q: "A prompt without a specified length or format will usually produce…",
              options: [
                "Exactly what you pictured",
                "A statistically average, generic answer",
                "An error message",
                "A shorter answer",
              ],
              a: 1,
              why: "Vague in, vague out: the model defaults to the statistical middle of all answers.",
            },
            {
              q: "What is the fastest way to control writing style?",
              options: [
                "Describe the style in ten adjectives",
                "Paste one example of the style and ask for 'the same'",
                "Ask twice",
                "Use ALL CAPS",
              ],
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
              {
                t: "p",
                text: "When an answer is wrong, most people retype the whole prompt. Don't. The conversation already contains useful context — steer instead of restarting.",
              },
              { t: "h", text: "The four steering moves" },
              {
                t: "list",
                items: [
                  '"Too long — cut it to 80 words, keep the statistics." (correction + constraint)',
                  '"You assumed I sell B2B. I sell to hobbyists. Rewrite for them." (correct the context)',
                  '"Give me three versions: one formal, one friendly, one blunt." (diverge, then pick)',
                  '"What information would make this answer better?" (flip the interview)',
                ],
              },
              { t: "h", text: "When to restart instead" },
              {
                t: "p",
                text: "If the model misunderstood the task itself (not the details), a clean start with a sharper prompt wins. Patching a misunderstood task piles patches on patches.",
              },
              {
                t: "practice",
                text: "Deliberately ask for something badly, then rescue the output with two steering moves.",
              },
            ],
          },
          {
            id: "pe-chain",
            title: "Chaining prompts for big jobs",
            minutes: 7,
            body: [
              {
                t: "p",
                text: "Big tasks ('plan my product launch') produce big, shallow answers. Split the job into a chain where each prompt feeds the next, and each step stays reviewable.",
              },
              { t: "h", text: "A reliable 4-step chain" },
              {
                t: "list",
                items: [
                  "Step 1 — Research: 'List the 8 decisions I must make to launch a paid newsletter. One line each.'",
                  "Step 2 — Options: 'For each decision, give the two most common choices with one trade-off.'",
                  "Step 3 — Draft: 'Given my answers below [paste], write the one-page launch plan.'",
                  "Step 4 — Critique: 'Review this plan as a skeptical editor. List the three weakest points and how to fix each.'",
                ],
              },
              {
                t: "p",
                text: "The critique step is the one almost everyone skips — and the one that most improves quality. Asking the model to attack its own draft surfaces problems you'd otherwise find after shipping.",
              },
              {
                t: "callout",
                tone: "warn",
                text: "Keep each step's output short enough to actually read. A chain you skim is a chain you can't steer.",
              },
              {
                t: "practice",
                text: "Turn one of your big, vague prompts into a 3-step chain and run it end to end.",
              },
            ],
          },
          {
            id: "pe-json",
            title: "Getting structured output you can paste into code",
            minutes: 6,
            body: [
              {
                t: "p",
                text: "To use AI output in a spreadsheet, an app or automation, you need structure — usually JSON. Three rules make JSON output nearly reliable.",
              },
              {
                t: "list",
                items: [
                  "Show the exact schema: give the keys, the types, and one filled example.",
                  "Say 'Return ONLY the JSON, no prose, no code fences.' — then the response is paste-ready.",
                  "Name what to do with missing data: 'If a field is unknown, use null — never invent values.'",
                ],
              },
              {
                t: "code",
                lang: "text",
                text: 'Return ONLY valid JSON, no prose, matching:\n{"items":[{"name":string,"price_gbp":number,"in_stock":boolean}]}\nFrom the text below. Unknown values → null.\n\n<paste product listing text>',
              },
              {
                t: "callout",
                tone: "tip",
                text: "Validate on your side anyway: even a 95%-reliable format needs a try/parse in code. Trust, then verify.",
              },
              {
                t: "practice",
                text: "Ask for JSON extraction from any messy text you have — an email, a listing, a form — and paste the result into a JSON formatter to check it.",
              },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "An output is mostly right but too long and B2B-flavoured. Best move?",
              options: [
                "Retype the whole prompt",
                "Steer: give the correction plus the new constraints",
                "Ask it to try harder",
                "Start a new chat with a different model",
              ],
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
              options: [
                "Say 'give me JSON'",
                "Show the exact schema, ban prose, define missing-value behaviour",
                "Ask for a table instead",
                "Never use JSON with AI",
              ],
              a: 1,
              why: "Exact schema + 'ONLY the JSON' + null-handling rules is what makes structured output paste-ready.",
            },
            {
              q: "When should you restart the conversation instead of steering?",
              options: [
                "Never",
                "When the model misunderstood the task itself",
                "After every answer",
                "When output is too long",
              ],
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
              {
                t: "p",
                text: "Type a URL and hit Enter. In the next few hundred milliseconds, a precise sequence plays out — and knowing it turns the web from magic into machinery.",
              },
              {
                t: "list",
                items: [
                  "1. DNS — the browser asks: what IP address is example.com? (a global phone book, cached everywhere)",
                  "2. TCP/TLS — the browser opens a connection to that server and secures it (the padlock: HTTPS).",
                  "3. HTTP request — the browser asks for the page: 'GET /' plus headers describing itself.",
                  "4. HTTP response — the server replies with a status code and the HTML document.",
                  "5. Parse — the browser reads HTML top to bottom, building the page's map (the DOM).",
                  "6. Fetch subresources — CSS, JavaScript and images discovered in the HTML are each fetched the same way.",
                  "7. Render — styles are applied, layout is computed, JavaScript runs, pixels appear.",
                ],
              },
              { t: "h", text: "Status codes, the useful five" },
              {
                t: "list",
                items: [
                  "200 OK — here's the content you asked for.",
                  "301 / 308 — moved permanently; browsers and search engines update their links.",
                  "404 Not Found — the path exists in the URL scheme but no page lives there.",
                  "500 Internal Server Error — the server itself failed while producing the page.",
                  "429 Too Many Requests — you (or everyone) hit a rate limit; slow down.",
                ],
              },
              {
                t: "callout",
                tone: "tip",
                text: "Open DevTools → Network tab, reload, and watch steps 3–6 happen by name. One minute of watching beats an hour of reading.",
              },
              {
                t: "practice",
                text: "Visit any site with DevTools open. Find the main HTML document and one image; note their status codes and sizes.",
              },
            ],
          },
          {
            id: "wf-trio",
            title: "HTML, CSS and JS: who owns what",
            minutes: 6,
            body: [
              {
                t: "p",
                text: "Every web page is three languages with a strict division of labour. Confusing their jobs is the root of most beginner bugs.",
              },
              { t: "h", text: "HTML — structure and meaning" },
              {
                t: "p",
                text: "HTML says what things ARE: a heading, a navigation, a button, an image. Semantic HTML (nav, main, button) is what screen readers and search engines read.",
              },
              { t: "h", text: "CSS — appearance" },
              {
                t: "p",
                text: "CSS says how things LOOK: colour, spacing, layout, what happens on hover. If a page looks wrong, the bug is almost always CSS — not HTML.",
              },
              { t: "h", text: "JavaScript — behaviour" },
              {
                t: "p",
                text: "JS makes things DO: respond to clicks, fetch data, update the page. If a button does nothing, the bug is in JS.",
              },
              {
                t: "code",
                lang: "html",
                text: '<!-- HTML: what -->\n<button class="save">Save</button>\n\n/* CSS: how it looks */\n.save { background: #2dd4bf; padding: 8px 16px; }\n\n// JS: what it does\nsaveBtn.addEventListener("click", () => save());',
              },
              {
                t: "callout",
                tone: "warn",
                text: "If content is missing, check HTML. If it's ugly, check CSS. If it's inert, check JS. That triage alone fixes half of all beginner debugging.",
              },
              {
                t: "practice",
                text: "Open any page in DevTools, delete a node in the Elements panel (HTML), then change a colour in Styles (CSS). Reload to restore.",
              },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "What is the correct order after pressing Enter on a URL?",
              options: [
                "Render → DNS → HTTP",
                "DNS → TCP/TLS → HTTP request/response → parse → render",
                "HTTP → DNS → TLS",
                "Parse → DNS → render",
              ],
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
              {
                t: "p",
                text: "Most of the web's speed comes from copying things closer to you — and most 'my update isn't live' panic comes from those copies not being thrown away.",
              },
              { t: "h", text: "The four caches, near to far" },
              {
                t: "list",
                items: [
                  "Browser cache — files your browser stored on disk with the response (often for a year, for hashed assets).",
                  "Service worker — a script that can serve your whole app offline (this is how PWAs work).",
                  "CDN edge — servers worldwide holding copies of the site's static files.",
                  "Server-side cache — pre-computed pages the backend reuses instead of rebuilding.",
                ],
              },
              {
                t: "p",
                text: "That's why asset files get hashed names (app-Dx8f2.js): change the file, the name changes, every cache treats it as brand new. When a site update 'doesn't show', a stale cache somewhere is the usual suspect — a hard refresh or cache-busting deploy fixes it.",
              },
              {
                t: "practice",
                text: "Hard-refresh any site (Ctrl/Cmd+Shift+R) and compare the Network tab before and after.",
              },
            ],
          },
          {
            id: "wf-client-server",
            title: "Client, server, and where the code runs",
            minutes: 6,
            body: [
              {
                t: "p",
                text: "'Front-end' and 'back-end' name where code runs: in the user's browser, or on the developer's server. The split decides what each side can see, trust and do.",
              },
              { t: "h", text: "Client-side (your browser)" },
              {
                t: "list",
                items: [
                  "Runs on the visitor's device — you can read all of it in DevTools.",
                  "Great for instant interaction: animations, form validation, offline tools.",
                  "Never trust it with secrets: anything in browser code or localStorage is public.",
                ],
              },
              { t: "h", text: "Server-side (the site's server)" },
              {
                t: "list",
                items: [
                  "Runs where the developer controls the machine — visitors can't see the code.",
                  "Owns the database, secrets and anything that must be enforced (payments, permissions).",
                  "Responds over HTTP with data (JSON) or whole pages (HTML).",
                ],
              },
              {
                t: "callout",
                tone: "warn",
                text: "Rule of thumb: enforce every rule that matters on the server. Anything checked only in the browser can be bypassed by the user.",
              },
              {
                t: "practice",
                text: "Open DevTools on any site and read 30 seconds of its client-side code. Then imagine trying to hide an API key there — that's why it must live server-side.",
              },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "Why do asset files get hashed names like app-Dx8f2.js?",
              options: [
                "Style",
                "So caches treat a changed file as a brand-new one",
                "Compression",
                "It's required by HTML",
              ],
              a: 1,
              why: "Changed name → every cache (browser, CDN) refetches → updates always reach users.",
            },
            {
              q: "Where must a rule that really matters (like payments) be enforced?",
              options: [
                "In the browser's JavaScript",
                "In localStorage",
                "On the server",
                "In CSS",
              ],
              a: 2,
              why: "Browser code is fully visible and modifiable by the user — only the server can be trusted to enforce.",
            },
            {
              q: "What does a service worker do?",
              options: [
                "Speeds up DNS",
                "Can serve a whole app offline from a local cache",
                "Renders CSS faster",
                "Encrypts passwords",
              ],
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
              {
                t: "p",
                text: "The graveyard of side projects is the feature list. The fix is brutal scoping: version 1 gets ONE screen and ONE job.",
              },
              { t: "h", text: "The one-sentence scope" },
              {
                t: "p",
                text: "'A user does [action] and gets [result].' If your app needs two sentences, it's two apps. Write it at the top of your README and measure every feature idea against it.",
              },
              { t: "h", text: "The cut list for v1" },
              {
                t: "list",
                items: [
                  "No accounts — store data on-device (localStorage) or make it a single-player tool.",
                  "No admin panel — you are the admin; edit the data file.",
                  "No settings page — hardcode the defaults.",
                  "One input, one output — a calculator, a generator, a converter. Polish beats breadth.",
                ],
              },
              {
                t: "callout",
                tone: "tip",
                text: "Pick a stack you already know over the trending one. The goal in v1 is a shipped URL, not a résumé of technologies.",
              },
              {
                t: "practice",
                text: "Write your one-sentence scope. Then delete every feature that doesn't serve it — including the ones you love.",
              },
            ],
          },
          {
            id: "swa-stack",
            title: "Picking a boring stack (and what each piece does)",
            minutes: 7,
            body: [
              {
                t: "p",
                text: "A 'boring' stack is one with a decade of Stack Overflow answers. For a first app that means: a JavaScript framework, a host, and at most one backend service.",
              },
              { t: "h", text: "The three pieces" },
              {
                t: "list",
                items: [
                  "Framework (React, Vue, Svelte) — builds the UI from components. Pick one; they all ship real apps.",
                  "Host (Netlify, Vercel, Cloudflare Pages) — turns 'npm run build' into a public HTTPS URL, free for static sites.",
                  "Backend service (Supabase, Firebase) — only when you need accounts or shared data. Skip it for v1 if you can.",
                ],
              },
              {
                t: "p",
                text: "Static-first is the honest default: if your v1 needs no database, ship a static site. It's faster, un-hackable, and free at every meaningful scale.",
              },
              {
                t: "callout",
                tone: "warn",
                text: "Don't choose the database before the screen. Data model follows UI, never the reverse, in v1.",
              },
              {
                t: "practice",
                text: "Write down your framework + host. If either line is blank or trendy-new, swap it for what you already know.",
              },
            ],
          },
          {
            id: "swa-build-loop",
            title: "The daily build loop that finishes projects",
            minutes: 5,
            body: [
              {
                t: "p",
                text: "Projects die in the middle, not the start. Survive the middle with a loop that always leaves the app working.",
              },
              {
                t: "list",
                items: [
                  "Pick the smallest next thing that moves the screen forward (a button, a saved field).",
                  "Build it until it works end-to-end — ugly is fine, broken is not.",
                  "Ship it: commit and deploy. A live URL that's 30% done beats a local app that's 80% done.",
                  "Stop while you know the next step. (This is the trick — finishing a sentence is easier than starting one.)",
                ],
              },
              {
                t: "p",
                text: "'Stop while you know the next step' is Hemingway's mid-sentence trick for code. You remove the cold-start friction that kills evening motivation.",
              },
              {
                t: "practice",
                text: "Deploy something — anything — today. A 'hello world' on a real URL rewires what 'shipping' means.",
              },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "The one-sentence scope is…",
              options: [
                "A marketing slogan",
                "'A user does [action] and gets [result]'",
                "The pitch deck intro",
                "The privacy policy",
              ],
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
              options: [
                "It saves battery",
                "It removes the cold-start friction that kills the next session's motivation",
                "It impresses git history",
                "It prevents bugs",
              ],
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
              {
                t: "p",
                text: "Users can't articulate it, but three 'boring' features separate a demo from an app: persistence, feedback and failure states.",
              },
              { t: "h", text: "1. Persistence" },
              {
                t: "p",
                text: "Data survives reload. On-device storage (localStorage) covers single-user apps in ten lines. The test: reload the page — is everything still there?",
              },
              { t: "h", text: "2. Feedback" },
              {
                t: "p",
                text: "Every tap does something visible within 100ms: a spinner, a toast, a state change. Silence feels broken, even when code is running fine.",
              },
              { t: "h", text: "3. Failure states" },
              {
                t: "p",
                text: "What happens offline, on empty input, on a failed fetch? Ship a designed empty state, an error message with a retry, and graceful offline behaviour. Apps are judged by their worst moments, not their best.",
              },
              {
                t: "callout",
                tone: "tip",
                text: "Add them in that order. Persistence without feedback still feels broken; feedback without persistence feels fake.",
              },
              {
                t: "practice",
                text: "Audit your project against the three. Whichever fails the reload-tap-fail test is your next task.",
              },
            ],
          },
          {
            id: "swa-launch",
            title: "Domain, HTTPS and the pre-launch check",
            minutes: 6,
            body: [
              {
                t: "p",
                text: "Your app is one deploy from real. Here's the launch checklist that catches 95% of first-launch embarrassment.",
              },
              { t: "h", text: "Domain + HTTPS" },
              {
                t: "p",
                text: "Buy the domain (any registrar), point it at your host's dashboard, and HTTPS cert comes free and automatic on all modern hosts. the-app-name.com beats the-app-name.netlify.app for trust and memory.",
              },
              { t: "h", text: "The 5-point pre-launch check" },
              {
                t: "list",
                items: [
                  "Mobile: use it on a real phone, not just a resized window.",
                  "Fresh visitor: incognito window, cold cache — signup/first action works in under 2 minutes.",
                  "Empty states: first-run screens look intentional, not broken.",
                  "Title + favicon: browser tab says who you are (the two cheapest trust signals).",
                  "One link out: a way to contact you — a mailto is fine.",
                ],
              },
              {
                t: "callout",
                tone: "warn",
                text: "Test the PWA/offline path if you promise it: airplane-mode the phone and open the app. 'Works offline' that doesn't is worse than not claiming it.",
              },
              {
                t: "practice",
                text: "Run the 5-point check on your project. Fix the first failure before touching anything else.",
              },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "The three 'real app' features, in order, are…",
              options: [
                "Auth, payments, analytics",
                "Persistence, feedback, failure states",
                "Dark mode, i18n, PWA",
                "SEO, ads, social login",
              ],
              a: 1,
              why: "Data survives reload, every tap reacts, and failures are designed — that's the demo-to-app line.",
            },
            {
              q: "Cheapest two trust signals in the browser tab?",
              options: [
                "A real title and a favicon",
                "Analytics",
                "A cookie banner",
                "A loading screen",
              ],
              a: 0,
              why: "Users read the tab before the page — a named tab with a favicon reads as 'real' instantly.",
            },
            {
              q: "You promised 'works offline'. The test is…",
              options: [
                "Trust the build log",
                "Airplane-mode a real phone and open the app",
                "Check Lighthouse once",
                "Ask a friend later",
              ],
              a: 1,
              why: "Offline claims are only true if a real device with no connection proves it.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "ai-study",
    title: "AI for Study & Research",
    tagline: "Learn anything faster — without fooling yourself.",
    emoji: "📚",
    tint: "#a78bfa",
    level: "Beginner",
    audience: "Students, self-learners and anyone researching a new topic",
    outcome: [
      "Turn any topic into a personal study plan in minutes",
      "Get explanations pitched at exactly your level",
      "Use AI to quiz you instead of just re-reading notes",
      "Spot AI summaries that look right but are wrong",
    ],
    modules: [
      {
        title: "Module 1 · Asking questions that teach you",
        lessons: [
          {
            id: "as-ladder",
            title: "The topic → question → prompt ladder",
            minutes: 5,
            body: [
              {
                t: "p",
                text: "'Teach me biology' gets you a textbook summary. 'Explain photosynthesis to a 10-year-old, then quiz me on it' gets you a lesson. The difference is a ladder: raw topic, then a real question, then a prompt with a deliverable.",
              },
              { t: "h", text: "Turn the topic into four kinds of questions" },
              {
                t: "list",
                items: [
                  "Define — what exactly is X, in plain words?",
                  "Compare — how does X differ from the thing it gets confused with?",
                  "Why/How — why does X happen, or how does it work step by step?",
                  "Decide — when would I use X instead of the alternative?",
                ],
              },
              {
                t: "p",
                text: "Most study sessions fail because people ask only the first kind. A topic you understand can answer all four. Ask one at a time — stacked questions get blended, shallow answers.",
              },
              {
                t: "code",
                lang: "text",
                text: "I have one week to learn the basics of the Indian legal system.\nMake me a 5-day study plan, 45 minutes a day.\nFor each day: 3 key concepts, one question I should be able to\nanswer by the end of the day, and one real case or example to look up.\nAssume I am a complete beginner.",
              },
              {
                t: "callout",
                tone: "tip",
                text: "Plans like this are a starting point, not a contract. After day one, tell the model what felt too fast or too slow and have it rebuild the rest.",
              },
              {
                t: "practice",
                text: "Pick a topic you avoided because it felt too big. Run the study-plan prompt, then start day one today.",
              },
            ],
          },
          {
            id: "as-levels",
            title: "Explanations at your level: three dials",
            minutes: 6,
            body: [
              {
                t: "p",
                text: "The same model can explain like a teacher, a friend, or an examiner. You choose with one sentence. When an explanation sails over your head, do not give up — turn a dial and ask again.",
              },
              { t: "h", text: "The three dials" },
              {
                t: "list",
                items: [
                  "Simplicity — 'explain like I am 12' or 'assume I know nothing about this field'.",
                  "Length — 'in three sentences' or 'step by step with an example each'.",
                  "Anchor — 'use a cricket analogy' or 'compare it to how UPI works'.",
                ],
              },
              {
                t: "p",
                text: "Anchoring to something you already understand is the strongest dial. New ideas stick to old ones; they rarely stick to a blank page.",
              },
              {
                t: "code",
                lang: "text",
                text: "You just explained recursion, but I am lost.\nExplain it again: like I am 12, in at most 5 sentences,\nusing the idea of Russian nesting dolls.\nThen give me one tiny example I can trace by hand.",
              },
              {
                t: "callout",
                tone: "tip",
                text: "When you finally get it, say what clicked: 'the doll analogy worked — now explain it again without the analogy'. That locks the real understanding in.",
              },
              {
                t: "practice",
                text: "Take a concept you gave up on. Apply all three dials in one retry prompt and notice which one did the work.",
              },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "What is the 'ladder' from topic to prompt?",
              options: [
                "Topic → search engine → book",
                "Topic → real question → prompt with a deliverable",
                "Topic → textbook → exam",
                "Question → answer → summary",
              ],
              a: 1,
              why: "A raw topic becomes a real question, and the prompt states what you want back.",
            },
            {
              q: "Which dial is strongest for making a hard idea stick?",
              options: [
                "Making it longer",
                "Anchoring it to something you already understand",
                "Adding more jargon",
                "Asking in a different language",
              ],
              a: 1,
              why: "New ideas attach to old ones — the anchor dial does most of the work.",
            },
            {
              q: "Why ask one question at a time?",
              options: [
                "To use fewer tokens",
                "Stacked questions get blended, shallow answers",
                "Models cannot count questions",
                "It makes the model faster",
              ],
              a: 1,
              why: "Multiple questions in one prompt produce an answer that covers none of them well.",
            },
          ],
        },
      },
      {
        title: "Module 2 · Study systems that stick",
        lessons: [
          {
            id: "as-recall",
            title: "Notes, flashcards and the AI quiz master",
            minutes: 6,
            body: [
              {
                t: "p",
                text: "Re-reading notes feels productive and barely works. Recalling material — answering questions before looking — is what moves it into memory. AI is the fastest quiz generator you will ever have.",
              },
              { t: "h", text: "The loop" },
              {
                t: "list",
                items: [
                  "Paste your notes into the chat.",
                  "Ask for 10 questions, hardest first — do not peek at answers.",
                  "Write your answers before revealing anything.",
                  "For every miss: 'explain only this concept, with a new example', then re-test just those.",
                ],
              },
              {
                t: "code",
                lang: "text",
                text: "Here are my notes on the French Revolution:\n[paste notes]\nGenerate 10 exam-style questions, hardest first.\nDo not show answers until I reply.\nThen mark me strictly and tell me the one concept\nI should revise before anything else.",
              },
              {
                t: "p",
                text: "The marking step matters more than the questions. 'Which concepts am I weakest on, ranked' turns a quiz into a diagnosis.",
              },
              {
                t: "callout",
                tone: "tip",
                text: "Short on notes? Paste the syllabus or chapter headings instead — the quiz comes from the structure, not the prose.",
              },
              {
                t: "practice",
                text: "Run the loop on your most recent chapter. Compare how much you recall tomorrow versus last week's re-read.",
              },
            ],
          },
          {
            id: "as-summaries",
            title: "Summaries that aren't lies",
            minutes: 5,
            body: [
              {
                t: "p",
                text: "AI summaries are confident even when wrong. The failure mode is not nonsense — it is a fluent sentence that slightly misstates the source, which is more dangerous because you will not question it.",
              },
              { t: "h", text: "The summary checklist" },
              {
                t: "list",
                items: [
                  "Ask for bullets tied to the source: 'cite the section or page each point came from'.",
                  "Ask what is missing: 'what does this document NOT cover about the topic?'.",
                  "Spot-check two claims yourself — the two you would repeat out loud.",
                ],
              },
              {
                t: "p",
                text: "The second bullet is the underrated one. Knowing the edges of a summary tells you where it is safe to trust and where you must read the original.",
              },
              {
                t: "callout",
                tone: "warn",
                text: "Never trust a citation the model produced from memory. If it names a paper, book or case, assume it invented it until you have opened it. Hallucinated citations look perfectly formatted — that is the trap.",
              },
              {
                t: "practice",
                text: "Summarise one article with the checklist. Find one thing the summary missed and one claim worth checking.",
              },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "What actually moves material into memory?",
              options: [
                "Re-reading notes until they look familiar",
                "Recalling answers before looking",
                "Highlighting in three colours",
                "Reading faster",
              ],
              a: 1,
              why: "Active recall — answering before checking — beats recognition every time.",
            },
            {
              q: "A citation generated from memory should be…",
              options: [
                "Trusted if the format looks correct",
                "Assumed invented until you open it",
                "Used if the author sounds real",
                "Kept if the year matches",
              ],
              a: 1,
              why: "Hallucinated citations are formatted perfectly. Only opening the source counts.",
            },
            {
              q: "Why ask what a summary does NOT cover?",
              options: [
                "To make the answer longer",
                "To find where the summary is safe to trust",
                "To confuse the model",
                "To check its spelling",
              ],
              a: 1,
              why: "Knowing the edges tells you when to read the original instead.",
            },
          ],
        },
      },
      {
        title: "Module 3 · Integrity and trust",
        lessons: [
          {
            id: "as-integrity",
            title: "Using AI without cheating yourself (or the rules)",
            minutes: 6,
            body: [
              {
                t: "p",
                text: "Institutions draw different lines — some ban AI outright, some expect it. But there is a line that does not depend on policy: the difference between AI that helped you learn and AI that replaced your thinking. Submit the second and you have paid for a course and skipped it.",
              },
              { t: "h", text: "Four uses almost no school objects to" },
              {
                t: "list",
                items: [
                  "Explain — unpack a concept or a marked-down answer.",
                  "Quiz — generate practice questions from your notes.",
                  "Feedback — 'here is my draft outline; where is the argument weakest?'.",
                  "Polish — fix grammar in text you wrote yourself.",
                ],
              },
              {
                t: "p",
                text: "The final sentences you submit should be written by you. Not for honour alone — because the exam hall has no chat window, and the skill has to live in your head.",
              },
              {
                t: "callout",
                tone: "warn",
                text: "Check your institution's actual policy before submission season, not after. 'I did not know' has never worked once.",
              },
              {
                t: "practice",
                text: "Write out your own two-line rule for AI use this term, and follow it for one assignment.",
              },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "Which use is on the 'helped you learn' side of the line?",
              options: [
                "Submitting AI text as your essay",
                "Asking AI to mark your practice answers",
                "Having AI write the conclusion you never drafted",
                "Copying AI output with light edits",
              ],
              a: 1,
              why: "Quizzes and feedback train your thinking; ghost-writing replaces it.",
            },
            {
              q: "Why should your final submission be your own sentences?",
              options: [
                "Because AI is expensive",
                "Because detection tools are perfect",
                "Because the skill must exist in your head on exam day",
                "Because teachers can always tell",
              ],
              a: 2,
              why: "The exam hall has no chat window — the understanding has to be yours.",
            },
            {
              q: "When should you check the AI policy?",
              options: [
                "After being accused",
                "Only if you get caught",
                "Before submission season",
                "Policies never change",
              ],
              a: 2,
              why: "Policies vary and change — check before you rely on any use.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "build-a-website",
    title: "Build a Real Website",
    tagline: "One evening, one page, one live URL.",
    emoji: "🧱",
    tint: "#f59e0b",
    level: "Beginner",
    audience: "Absolute beginners who want a site they can actually ship",
    outcome: [
      "Write clean HTML with headings, links and images",
      "Use flexbox to lay a page out without fighting it",
      "Publish your site free on the internet with a real URL",
    ],
    modules: [
      {
        title: "Module 1 · HTML: the skeleton",
        lessons: [
          {
            id: "bw-tags",
            title: "Tags, elements and the shape of a page",
            minutes: 6,
            body: [
              {
                t: "p",
                text: "HTML is not a programming language — it is labelling. You wrap content in tags that say what it is: this is a heading, this is a paragraph, this is a link. The browser does the rest.",
              },
              { t: "h", text: "The four tags you will use constantly" },
              {
                t: "list",
                items: [
                  "<h1> to <h3> — headings, biggest to smaller. One <h1> per page.",
                  "<p> — a paragraph of text.",
                  "<a href=...> — a link somewhere else.",
                  "<img src=... alt=...> — an image, with a text description.",
                ],
              },
              {
                t: "code",
                lang: "html",
                text: '<!doctype html>\n<html>\n  <head>\n    <title>Waseem\'s Tea Stall</title>\n  </head>\n  <body>\n    <h1>Waseem\'s Tea Stall</h1>\n    <p>Irani chai in Hyderabad since 2026.</p>\n    <img src="tea.jpg" alt="A glass of cutting chai">\n    <a href="menu.html">See the menu</a>\n  </body>\n</html>',
              },
              {
                t: "callout",
                tone: "tip",
                text: "That is a complete, valid page. Save it as index.html and open it in a browser — you are officially a website owner.",
              },
              {
                t: "practice",
                text: "Type the example by hand (do not paste), changing the name, drink and image alt text to your own.",
              },
            ],
          },
          {
            id: "bw-semantic",
            title: "Structure that means something",
            minutes: 6,
            body: [
              {
                t: "p",
                text: "You could build an entire site from <div> boxes, and many people do — it is called div soup, and it works until you must style it, read it, or be found by a search engine. Semantic tags name the parts of a page instead.",
              },
              { t: "h", text: "The five that cover most pages" },
              {
                t: "list",
                items: [
                  "<header> — the top strip: logo, site name.",
                  "<nav> — the main links.",
                  "<main> — the one main content area of the page.",
                  "<section> — a themed chunk inside main.",
                  "<footer> — the bottom strip: contact, copyright.",
                ],
              },
              {
                t: "code",
                lang: "html",
                text: '<body>\n  <header>\n    <h1>Waseem\'s Tea Stall</h1>\n    <nav>\n      <a href="menu.html">Menu</a>\n      <a href="location.html">Find us</a>\n    </nav>\n  </header>\n  <main>\n    <section>\n      <h2>Today\'s special</h2>\n      <p>Dum ki chai, 20 rupees.</p>\n    </section>\n  </main>\n  <footer>\n    <p>© 2026 Waseem\'s Tea Stall</p>\n  </footer>\n</body>',
              },
              {
                t: "callout",
                tone: "warn",
                text: "Rule of thumb: if you cannot say what a <div> is for out loud, it probably wanted to be a <section> or <main>.",
              },
              {
                t: "practice",
                text: "Reshape your page from lesson 1 with header, nav, main, section and footer.",
              },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "How many <h1> elements should a page have?",
              options: ["As many as you like", "Exactly one", "One per section", "None — use divs"],
              a: 1,
              why: "One h1 names the page; h2/h3 handle everything under it.",
            },
            {
              q: "What is 'div soup'?",
              options: [
                "A salad metaphor",
                "Building pages only from meaningless div boxes",
                "A CSS bug",
                "Too many images",
              ],
              a: 1,
              why: "Meaningless divs work until styling, accessibility and SEO all get harder.",
            },
            {
              q: "Which tag wraps the one main content area?",
              options: ["<header>", "<nav>", "<main>", "<footer>"],
              a: 2,
              why: "main holds the unique content; header, nav and footer repeat across pages.",
            },
          ],
        },
      },
      {
        title: "Module 2 · CSS: the paint and layout",
        lessons: [
          {
            id: "bw-box",
            title: "Selectors and the box model",
            minutes: 7,
            body: [
              {
                t: "p",
                text: "CSS answers one question: which elements, and what about them? The 'which' is the selector, the 'what' is the declarations.",
              },
              {
                t: "code",
                lang: "css",
                text: "p {\n  color: #333;\n  font-size: 16px;\n}\n\n.card {\n  background: white;\n  padding: 16px;      /* space INSIDE the box */\n  margin: 24px 0;     /* space OUTSIDE the box */\n  border: 1px solid #ddd;\n  border-radius: 10px;\n}",
              },
              { t: "h", text: "Every element is a box" },
              {
                t: "list",
                items: [
                  "content — the text or image itself.",
                  "padding — breathing room inside the border.",
                  "border — the edge line.",
                  "margin — pushing other boxes away.",
                ],
              },
              {
                t: "p",
                text: "Eighty percent of 'why is there a weird gap?' is padding and margin being confused. Padding is inside the box; margin is outside it.",
              },
              {
                t: "callout",
                tone: "tip",
                text: "Right-click anything in a browser, choose Inspect, and open the box-model diagram. It shows you exactly which rule produced every pixel.",
              },
              {
                t: "practice",
                text: "Style your page: a padded card with a border, and comfortable margins between sections.",
              },
            ],
          },
          {
            id: "bw-flex",
            title: "Flexbox: layout without tears",
            minutes: 7,
            body: [
              {
                t: "p",
                text: "Before flexbox, centring a box took folklore and prayer. Flexbox lets a parent element arrange its children in a row or column, and it is three lines for most layouts.",
              },
              {
                t: "code",
                lang: "css",
                text: "nav {\n  display: flex;\n  justify-content: space-between; /* push apart */\n  align-items: center;            /* centre vertically */\n  gap: 16px;                      /* space between items */\n}\n\n.cards {\n  display: flex;\n  flex-wrap: wrap;   /* drop to a new row when needed */\n  gap: 16px;\n}",
              },
              { t: "h", text: "The three lines that do 80% of layout" },
              {
                t: "list",
                items: [
                  "display: flex — start arranging children.",
                  "gap — the space between them (no more margin hacks).",
                  "flex-wrap: wrap — let rows wrap on small screens instead of squashing.",
                ],
              },
              {
                t: "p",
                text: "On phones, a flex row with wrap becomes a stacked column automatically when items run out of width. That is responsive design before you have written a media query.",
              },
              {
                t: "callout",
                tone: "tip",
                text: "justify-content works along the row, align-items across it. Say that sentence when confused and the right property usually picks itself.",
              },
              {
                t: "practice",
                text: "Lay out your nav with flexbox and make a two-card row that wraps to one column on a phone width.",
              },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "Which is INSIDE the border?",
              options: ["margin", "padding", "gap", "outline"],
              a: 1,
              why: "Padding is inside the box, margin pushes other boxes away from it.",
            },
            {
              q: "What replaces margin hacks between flex children?",
              options: ["the gap property", "justify-content", "flex-wrap", "display: block"],
              a: 0,
              why: "gap sets the spacing between items directly.",
            },
            {
              q: "flex-wrap: wrap on a phone does what?",
              options: [
                "Hides overflowing items",
                "Wraps items to a new row instead of squashing",
                "Scales the text",
                "Forces one column always",
              ],
              a: 1,
              why: "Items drop to the next row when they run out of width — free responsiveness.",
            },
          ],
        },
      },
      {
        title: "Module 3 · Ship it",
        lessons: [
          {
            id: "bw-ship",
            title: "From folder to free URL",
            minutes: 6,
            body: [
              {
                t: "p",
                text: "A static site is just files: HTML, CSS, images. No server code, no database. That makes publishing it free on several hosts — drag the folder, get a URL.",
              },
              { t: "h", text: "The checklist" },
              {
                t: "list",
                items: [
                  "Your home page must be named index.html — hosts serve it by default.",
                  'Keep everything relative: src="tea.jpg", not C:/Users/... — relative paths survive the upload.',
                  "Drag the folder onto a static host (Netlify Drop and GitHub Pages are the classics).",
                  "Open the link on your phone. Whatever looks broken there is what everyone will see.",
                ],
              },
              {
                t: "p",
                text: "Resize quirks you find on the phone are usually a fixed width or an image without max-width: 100%. Fix, re-drag, re-check — the loop is seconds long.",
              },
              {
                t: "callout",
                tone: "tip",
                text: "No files yet? Build and preview the page in the SlashAI HTML Compiler first (Tools → HTML Compiler) — it has starter projects you can export and then host.",
              },
              {
                t: "practice",
                text: "Ship your page today. A rough site online beats a perfect one on your desktop.",
              },
            ],
          },
        ],
        test: {
          passScore: 0.7,
          questions: [
            {
              q: "What must your home page be named?",
              options: ["home.html", "main.html", "index.html", "default.page"],
              a: 2,
              why: "index.html is the default file static hosts serve.",
            },
            {
              q: 'Why relative paths like src="tea.jpg"?',
              options: [
                "They look cleaner",
                "They are shorter to type",
                "They keep working after you upload the folder",
                "Browsers require lowercase",
              ],
              a: 2,
              why: "Absolute local paths point at your machine and break the moment the site is hosted.",
            },
            {
              q: "The most important device to test on is…",
              options: ["A 4K monitor", "Your own phone", "A tablet", "Any desktop browser"],
              a: 1,
              why: "Most of your visitors will be on a phone — check there first.",
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
export const courseByIdSafe = (id: string | undefined) => (id ? courseById.get(id) : undefined);

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
