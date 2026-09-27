/**
 * The longer-form SlashAI Blog guides.
 *
 * Split out of `lib/blogs` purely for file size — the schema and the original
 * three posts still live there, and both are re-exported through
 * `ALL_BLOG_POSTS` / `getBlogPost` below so the routes only import one place.
 *
 * Same rules as `lib/blogs`: real, specific, evergreen content. No filler
 * sections, no invented statistics, no "in today's fast-paced world".
 */

import { BLOG_POSTS, type BlogPost } from "@/lib/blogs";

export const GUIDE_POSTS: BlogPost[] = [
  {
    slug: "when-is-ai-actually-useful",
    title: "When Is AI Actually Useful? (And When It Isn't)",
    emoji: "⚖️",
    desc: "A five-question test for whether AI is the right tool, the four ways it reliably fails you, and how to match a model to the job.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "AI Basics",
    metaTitle: "When Is AI Actually Useful - And When It Is Not | SlashAI",
    metaDesc:
      "A practical framework for when AI helps and when it hurts: a five-question test, four failure modes, and how to choose a model for the task.",
    summary:
      "AI is not a universal upgrade. Used well it removes the most tedious part of a task; used badly it hands you a confident, plausible answer you now have to check. This guide gives you a quick test for whether AI is the right tool at all, the four ways it reliably fails, and how to match capability to task difficulty instead of using the biggest model for everything.",
    sections: [
      {
        id: "the-test",
        heading: "A five-question test",
        blocks: [
          {
            type: "list",
            items: [
              "Can I fully describe the input in text? If not, AI probably can't help yet.",
              "Can I quickly check the output for correctness? If you can't verify it, be careful with it.",
              "Is a good-enough first draft genuinely useful? Drafting, summarising, reformatting — yes. Sign-offs, diagnoses, final calls — no.",
              "Is the cost of being wrong low? Embarrassing but recoverable is fine. Legal, medical or financial needs a human.",
              "Do I have context only I have? If you can supply the real constraints, the answer will be far better than a generic one.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "If you answer 'no' to two or more, the bottleneck is not the model. It's missing information, an unmade decision, or work that genuinely needs a person.",
          },
        ],
      },
      {
        id: "failures",
        heading: "The four ways it fails you",
        blocks: [
          {
            type: "list",
            items: [
              "Confident fabrication. It produces a plausible citation, API name or statistic that does not exist, in exactly the same tone as a true one. There is no tell.",
              "Recent events. Anything after its training data, and anything specific to your situation, gets invented rather than acknowledged as unknown.",
              "Quiet degradation on long input. Put a critical instruction in the middle of a long document and it may simply stop attending to it.",
              "Sycophancy. Asked to check your work, it tends to agree. Ask instead for the three strongest objections to your position.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Fabricated citations are the most expensive failure, because they survive a casual check. Verify anything with a reference in it before it leaves your hands.",
          },
        ],
      },
      {
        id: "choose",
        heading: "Match the model to the task",
        blocks: [
          {
            type: "p",
            text: "Most people reach for the largest model available for everything, which is slower, costs more, and is often worse on simple tasks. Use the smallest model that does the job well.",
          },
          {
            type: "list",
            items: [
              "Small and fast: classification, extraction, reformatting, short rewrites, autocomplete. Bigger models add latency for no gain.",
              "Mid-tier: drafting, summarising, standard coding help, everyday work. Most of your usage should live here.",
              "Largest and slowest: multi-step reasoning, long documents, difficult maths, code that has to be correct.",
              "Search-grounded tools: for anything needing current facts, use a tool that actually retrieves sources rather than recalling them.",
              "Local models: for private data, high volume, or when the connection is unreliable.",
            ],
          },
        ],
      },
      {
        id: "when-not",
        heading: "When not to use it at all",
        blocks: [
          {
            type: "list",
            items: [
              "When you already know the answer and are avoiding it. No tool can make the decision for you.",
              "When the relationship is the point. Difficult conversations, apologies, saying no — those have to be yours.",
              "When you need to be the one who understands. Delegate the thinking and you can no longer review the work.",
              "When it's a small task with a large prompt. Writing the prompt takes longer than doing the job.",
              "When the data is sensitive and you haven't decided your policy. Decide that first, not after you've uploaded it.",
            ],
          },
        ],
      },
      {
        id: "better",
        heading: "How to get more out of it",
        blocks: [
          {
            type: "list",
            items: [
              "Give it a role and a real constraint — 'be a sceptical reviewer' produces different work than 'help me with'.",
              "Show an example of the output you want rather than describing it.",
              "Iterate on the answer instead of rewriting the prompt; you keep the parts that already worked.",
              "Ask for the sources or the reasoning, not just the conclusion.",
              "Ask what information would make its answer better, then supply it.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "keywords-explained-how-to-pick-the-right-ones",
    title: "Keywords Explained: How to Pick the Right Ones",
    emoji: "🏷️",
    desc: "Search intent, long-tail vs head terms, free keyword research, and what has genuinely changed about keywords in 2026.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "SEO",
    metaTitle: "Keywords Explained - How to Pick the Right Ones (2026) | SlashAI",
    metaDesc:
      "How to research and pick keywords: search intent, long-tail vs head terms, free research methods, and where keywords still matter in 2026.",
    summary:
      "Keywords still decide what your content is *for*, but the tactics around them have moved on. This guide covers search intent — the most useful concept in the whole field — why long-tail terms are almost always the better bet, how to research keywords using nothing but free tools, and what has genuinely changed in the last few years.",
    sections: [
      {
        id: "what-they-are",
        heading: "What keywords are actually for",
        blocks: [
          {
            type: "p",
            text: "A keyword is the phrase someone types. Its job is to tell a search engine — and you — what a page is about. It is not a ranking trick; it is a statement of intent. A page that clearly satisfies one specific intent will beat a page stuffed with ten loosely related ones, every time.",
          },
        ],
      },
      {
        id: "intent",
        heading: "Search intent: the most useful concept here",
        blocks: [
          {
            type: "p",
            text: "Behind every query is what the person actually wants. Getting this wrong is the most common reason a page ranks and still brings nobody in.",
          },
          {
            type: "list",
            items: [
              "Informational — 'how does X work'. Wants an explanation, not a product.",
              "Commercial — 'best X for Y'. Wants a comparison before deciding.",
              "Transactional — 'buy X', 'X pricing'. Wants to act now.",
              "Navigational — 'X login'. Wants a specific site, and no amount of good content beats the real thing.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Run the query yourself and look at what ranks. If the top ten are all comparison posts, that is what a page targeting that term needs to be — a comparison post.",
          },
        ],
      },
      {
        id: "long-tail",
        heading: "Long-tail vs head terms",
        blocks: [
          {
            type: "list",
            items: [
              "Head term: 'budgeting'. Enormous volume, brutal competition, and mostly useless traffic.",
              "Long-tail: 'how to budget on a first salary in India'. Tiny volume, almost no competition, and the person searching it is ready to act.",
              "A hundred long-tail terms will generally beat one head term for almost any site that isn't a major publication.",
              "Long-tail terms are also easier to write honestly. Specific questions have specific answers, so you never have to pad.",
            ],
          },
        ],
      },
      {
        id: "research",
        heading: "How to research keywords for free",
        blocks: [
          {
            type: "list",
            items: [
              "Google autocomplete — start typing, note every suggestion. This is a live list of real queries, free.",
              "People Also Ask — the questions Google attaches to a result. Each one is a section heading you can write.",
              "Related searches — the block at the bottom of the results page.",
              "Your own inbox and support questions. The best keyword source has never been a tool.",
              "Competitor page titles and headings — what they think matters is a strong clue.",
              "Forums and Reddit — the exact phrasings real people use, already phrased as questions.",
            ],
          },
          {
            type: "p",
            text: "Free tools will show volume and difficulty numbers, but those are model estimates. Use them to compare terms against each other, never as absolute figures.",
          },
        ],
      },
      {
        id: "changed",
        heading: "What actually changed",
        blocks: [
          {
            type: "list",
            items: [
              "Keywords still decide relevance. The 'keywords are dead' claim was about one specific kind of gaming, not about the underlying idea.",
              "Chasing the exact phrase is obsolete. Writing for the intent and covering the topic properly is what ranks.",
              "Bulk AI-generated content does not hold up. Search systems are good at spotting text written to rank rather than to inform, and readers bounce instantly.",
              "Being genuinely specific is now the strategy: real numbers, real examples, honest limitations.",
              "Clean headings and structured data help a page be understood. That is legibility, not gaming.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "The fastest way to lose a page is to publish generic content that restates what already exists. No keyword makes that work.",
          },
        ],
      },
      {
        id: "use",
        heading: "Putting a keyword to work",
        blocks: [
          {
            type: "p",
            text: "Keywords should shape a piece of writing, not decorate it. Pick one primary term and two to four supporting ones, then:",
          },
          {
            type: "list",
            items: [
              "Answer the question in the opening paragraph, clearly and completely.",
              "Use the phrase where it reads naturally — title, one subheading, first hundred words. Not everywhere.",
              "Turn the 'People Also Ask' questions into their own sections.",
              "Include something specific: a number, an example, a screenshot. This is what earns the rest of the page.",
              "Write the title for a human first. It appears in the results long before any model reads it.",
            ],
          },
          {
            type: "prompts",
            promptIds: ["seolanding", "seofeature", "seobrand", "seocreator", "factchecktopic"],
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-use-llms-a-beginners-guide",
    title: "How to Use LLMs: A Beginner's Guide",
    emoji: "🧠",
    desc: "What a large language model actually is, what it does well, how a chat window works — explained without the maths.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "LLMs",
    metaTitle: "How to Use LLMs - A Beginner's Guide | SlashAI",
    metaDesc:
      "What a large language model is, how prediction and context windows work, what makes a good prompt, and how to choose between models.",
    summary:
      "You do not need to understand transformers to use them well, but understanding three things changes how you prompt: the model predicts plausible continuations rather than looking things up, it only sees what is in the context window, and it has no memory between your chats. This guide explains those three, what LLMs are genuinely good at, and how to choose between them.",
    sections: [
      {
        id: "what-is",
        heading: "What a large language model actually is",
        blocks: [
          {
            type: "p",
            text: "A large language model is trained on an enormous amount of text to do one thing: predict what comes next. That single ability, at enough scale, produces summarising, translating, explaining, coding, reasoning and conversation as side effects. It is not a database and it is not a search engine — it has no list of facts it looks things up in.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Almost every confusing behaviour follows from this one fact. It generates what would plausibly come next, which is usually right and occasionally confidently wrong.",
          },
        ],
      },
      {
        id: "no-memory",
        heading: "It has no memory of you",
        blocks: [
          {
            type: "p",
            text: "Within one conversation, everything you type is in context and the model can use it. Between conversations, it remembers nothing unless the product explicitly stores it. So when it 'forgets' something important from yesterday, that isn't a bug you can prompt your way around — you have to re-supply the context.",
          },
          {
            type: "list",
            items: [
              "Open with the context, not the question. Give the situation before the ask.",
              "If the answer is wrong about your setup, restate the setup — it genuinely doesn't have it.",
              "In a long chat, earlier turns can fall out of the effective context. Re-state the key constraint rather than saying 'as I mentioned'.",
            ],
          },
        ],
      },
      {
        id: "context",
        heading: "The context window is your working memory",
        blocks: [
          {
            type: "p",
            text: "Everything the model can 'see' at once is the context window: your messages, any attached files, and its replies. It is finite, and quality degrades near the edges — most noticeably in the middle, where details get lost in a long document.",
          },
          {
            type: "list",
            items: [
              "Put the most important instruction at the end. Attention is strongest there.",
              "For long documents, work in sections rather than pasting everything at once.",
              "Start fresh when the topic changes. A clean context beats a long messy one.",
              "For repeated work, keep a short reusable preamble with your role, constraints and preferences.",
            ],
          },
        ],
      },
      {
        id: "good-at",
        heading: "What they're genuinely good at",
        blocks: [
          {
            type: "list",
            items: [
              "Transforming text: reformat, shorten, expand, change tone, translate, restructure.",
              "Explaining something at whatever level you need, including analogies you wouldn't have thought of.",
              "Drafting from an outline you provide.",
              "Code that follows a pattern you show it, especially when you include the types and the test cases.",
              "Brainstorming breadth — many options fast, which you then filter yourself.",
              "Being a tireless sparring partner for arguing, practising or rehearsing.",
            ],
          },
        ],
      },
      {
        id: "bad-at",
        heading: "What they're bad at",
        blocks: [
          {
            type: "list",
            items: [
              "Facts about anything after their training data, and anything specific to your organisation.",
              "Arithmetic and precise counting without a tool attached.",
              "Knowing what they don't know. Confidence is uniform, whether right or wrong.",
              "Consistency over a long piece without being told to check its own earlier claims.",
              "Anything where you need it to have seen your private data — it hasn't.",
            ],
          },
        ],
      },
      {
        id: "choose",
        heading: "Choosing between models",
        blocks: [
          {
            type: "list",
            items: [
              "For drafting, rewriting and everyday work, a mid-tier model is the sweet spot.",
              "For hard reasoning, long documents and tricky maths, use the strongest model available and budget more time to verify.",
              "For current events, use a model with search or retrieval attached. Recall alone will invent.",
              "For volume, speed or privacy, a smaller or local model is usually the right trade.",
            ],
          },
          {
            type: "p",
            text: "The practical advice: stop reading model comparisons and pick two — one fast everyday one, one strong one — and learn those well. Switching constantly costs more than any quality difference.",
          },
        ],
      },
    ],
  },
  {
    slug: "offline-llms-run-ai-on-your-own-machine",
    title: "Offline LLMs: Running AI on Your Own Machine",
    emoji: "📴",
    desc: "What you gain by running a model locally, what your hardware can actually handle, and the honest trade-offs.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "LLMs",
    metaTitle: "Offline LLMs - Running AI on Your Own Machine | SlashAI",
    metaDesc:
      "How to run large language models locally: what offline LLMs are good for, roughly what hardware each model size needs, and the honest trade-offs.",
    summary:
      "Running a language model on your own machine is now genuinely practical — no key, no subscription, no data leaving the device. The catch is hardware. This guide covers what local models are actually better at than cloud ones, roughly what each model size needs in RAM, and the situations where local is the wrong answer.",
    sections: [
      {
        id: "why",
        heading: "What you actually gain",
        blocks: [
          {
            type: "list",
            items: [
              "Privacy, genuinely. Nothing leaves the machine — which matters for client data, medical notes, anything under an NDA, and anything you simply don't want logged.",
              "No cost, no rate limit, no quota. Use it as much as you like.",
              "Works with no connection. Airplane mode, a train, a field site, a secure facility.",
              "Offline-capable tools built on top of it — transcription, translation, summarisation of your own files.",
              "Predictable latency, in the sense that it never queues behind a busy server.",
            ],
          },
        ],
      },
      {
        id: "hardware",
        heading: "What your hardware can handle",
        blocks: [
          {
            type: "p",
            text: "Model size in parameters, and the quantisation used to shrink it, determine what fits. The number that actually matters is memory — system RAM if you're loading from disk, or VRAM if you have a GPU.",
          },
          {
            type: "list",
            items: [
              "1–3B parameters: 8GB RAM is comfortable. Fast on CPU. Fine for classification, extraction, short rewrites, simple questions.",
              "7–8B: 16GB RAM, or any modern GPU with 8GB+ VRAM. This is the sweet spot for general quality.",
              "13–14B: 32GB RAM, or 12–16GB VRAM. Noticeably better reasoning and longer context.",
              "30B+: 64GB RAM or a serious GPU. Diminishing returns per GB, and it will be slow on CPU.",
              "Quantisation (running the model at reduced precision) roughly halves the memory needed with a modest quality cost — 4-bit is the common default for a reason.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Most laptops today can run a 7–8B model at 4-bit comfortably. The bottleneck on a PC without a dedicated GPU is memory bandwidth, so expect tokens per second in the teens rather than the dozens.",
          },
        ],
      },
      {
        id: "how",
        heading: "How to actually run one",
        blocks: [
          {
            type: "p",
            text: "You do not need to install Python, learn a framework, or write any code. Pick a desktop application, download a model, and start chatting.",
          },
          {
            type: "code",
            lang: "the shape of it",
            text: "1. install a local runner (a desktop app, not a library)\n2. download a model file in GGUF format, sized to your RAM\n3. run it, and use it exactly like any other chat window\n\nFor developers, the same models are served over a local\nAPI and anything that speaks that API works unchanged.",
          },
          {
            type: "p",
            text: "Once it's running, treat it like any other model: the prompting advice in the LLMs guide applies identically, and the failure modes are the same ones.",
          },
        ],
      },
      {
        id: "tradeoffs",
        heading: "The honest trade-offs",
        blocks: [
          {
            type: "list",
            items: [
              "Weaker than the best cloud models, especially on hard reasoning, long context and anything current. A 2024-era small local model will not match a frontier model.",
              "No current information, and no browsing. It knows only what it was trained on, frozen at download time.",
              "Slower. On a CPU, a long answer can take minutes.",
              "You own the hardware cost, the disk space (tens of gigabytes) and the setup time.",
              "Model choice is on you — a bad small model is much worse than a good large one, and the download is long.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Local is not automatically private. If you install something that phones home, or a web UI that proxies your prompts, the privacy benefit is gone. Check what the app actually does before you paste anything sensitive.",
          },
        ],
      },
      {
        id: "when",
        heading: "When local is the right answer",
        blocks: [
          {
            type: "list",
            items: [
              "Anything confidential: client material, health notes, source code under NDA, unreleased work.",
              "High-volume, repetitive work where a per-token bill adds up.",
              "Environments with poor or no connectivity, or where cloud services are not permitted.",
              "A base layer for your own tools — local transcription, tagging, and search over your own files.",
              "When you simply want an experiment you fully control, with no account and no telemetry.",
            ],
          },
          {
            type: "p",
            text: "For general research, long documents and current events, a cloud model with search is still better. The two are complements: local for the private and repetitive, cloud for the hard and current.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-gain-views",
    title: "How to Gain Views (Without Clickbait)",
    emoji: "📈",
    desc: "What actually earns reach, how to package a video so people finish it, and the difference between views and an audience.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "Social",
    metaTitle: "How to Gain Views Without Clickbait | SlashAI",
    metaDesc:
      "What actually earns reach on video platforms: retention, packaging, thumbnails and titles, and how to build an audience rather than chasing view counts.",
    summary:
      "Views are a symptom, not a goal — a million views from the wrong audience is worth less than ten thousand of the right one. This guide covers what actually earns distribution, how to package a video so people finish it, and how to convert a spike into people who come back.",
    sections: [
      {
        id: "views-are-not",
        heading: "Views are not the goal",
        blocks: [
          {
            type: "p",
            text: "Platforms can no longer distinguish a real viewer from a bot, and audiences can. Chasing a number that does not convert is a very comfortable way to waste a year. Decide what a view is *for* — subscribers, customers, portfolio enquiries, practice — and let the number follow from that.",
          },
        ],
      },
      {
        id: "retention",
        heading: "Retention is the whole game",
        blocks: [
          {
            type: "p",
            text: "Every recommendation system measures the same thing: did people keep watching. Views are downstream of that. A video that holds attention for its full length gets pushed to people who watch similar things; one that loses people in the first ten seconds does not, regardless of how good the rest is.",
          },
          {
            type: "list",
            items: [
              "Earn the first ten seconds with something concrete — a result, a promise, or a question worth answering.",
              "Cut every second that isn't carrying information. Silence, setup and throat-clearing are where retention dies.",
              "Change something visually every few seconds: a cut, a zoom, a new shot, text on screen.",
              "Promise exactly what you deliver. Overpromising buys one view and loses every later one.",
              "End at a natural point. A video that stops mid-sentence teaches the algorithm that your content is not satisfying.",
            ],
          },
        ],
      },
      {
        id: "packaging",
        heading: "Packaging is half the click",
        blocks: [
          {
            type: "p",
            text: "The title and thumbnail are seen far more than the first three seconds, and most creators spend a fraction of the effort on them that they spend on the edit.",
          },
          {
            type: "list",
            items: [
              "Title: specific and concrete, not clever. 'How I fixed blurry night photos' beats 'You won't believe this trick'.",
              "Thumbnail: one subject, large, high contrast, readable at phone size. Three elements maximum.",
              "Don't duplicate the thumbnail text into the title — they work as a pair, not a repetition.",
              "Show the outcome in the thumbnail when the outcome is the point.",
              "Test a few against each other if the platform offers it, rather than guessing once.",
            ],
          },
        ],
      },
      {
        id: "consistency",
        heading: "Consistency beats intensity",
        blocks: [
          {
            type: "list",
            items: [
              "One good video a week for a year beats a daily grind that stops in month two.",
              "Publish on a schedule you can hold, so people learn when to come back.",
              "A series format is more valuable than a one-off hit: it teaches people to expect the next one.",
              "Reply to comments in the first hour. It extends the life of the post and is genuinely the cheapest distribution available.",
            ],
          },
        ],
      },
      {
        id: "convert",
        heading: "Turning views into an audience",
        blocks: [
          {
            type: "list",
            items: [
              "One clear call to action, and the same one every time. 'Subscribe if you want part two' beats three different asks.",
              "A reason to come back: a series, a build in progress, a problem you'll solve next week.",
              "Reply to every substantive comment. The first twenty replies are the community.",
              "Bring your best-viewing viewers to somewhere else you own. A platform can change its algorithm overnight; an email list cannot.",
            ],
          },
          {
            type: "p",
            text: "Before publishing, use these to build the assets: the hook, the script, the caption and the storyboard.",
          },
          {
            type: "prompts",
            promptIds: [
              "hooksreel",
              "scriptreel",
              "captionreel",
              "thumbnailreel",
              "writeyoutubescript",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-publish-a-website-free",
    title: "How to Publish a Website for Free",
    emoji: "🌐",
    desc: "Static site generators, free hosting and GitHub Pages, custom domains, and the trade-offs that actually matter.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "Web",
    metaTitle: "How to Publish a Website for Free (2026) | SlashAI",
    metaDesc:
      "Publish a website free: static site generators, free hosting tiers, GitHub Pages, custom domains, HTTPS and what each option really costs.",
    summary:
      "Publishing a real website costs nothing now — not a hosting bill, not a domain, not a build tool. This guide walks through the three paths (a hosted platform, a static generator on free hosting, or GitHub Pages), how to get a custom domain and HTTPS on the free tier, and the trade-offs that actually matter.",
    sections: [
      {
        id: "three-paths",
        heading: "Three ways to do it",
        blocks: [
          {
            type: "list",
            items: [
              "Hosted platform — build visually, publish with a button. Fastest to launch, least control, and you are tied to their pricing when you outgrow the free tier.",
              "Static site generator + free hosting — you write Markdown, a tool builds plain HTML, and it uploads to a CDN. Fast, portable, free forever, and nothing runs on a server so there is nothing to patch.",
              "GitHub Pages — one folder of HTML and you're live. Ideal for a single page, documentation, or a project site; you push and it rebuilds automatically.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "For anything you'd still be happy with in two years, the static approach wins. Your content is plain files you can move to any host in an afternoon.",
          },
        ],
      },
      {
        id: "path",
        heading: "The path of least resistance",
        blocks: [
          {
            type: "list",
            items: [
              "1. Write two or three pages. If you can't fill three, you don't need a site yet — you need a page.",
              "2. Pick a template or a minimal generator. Don't customise the design yet; nobody is looking at your CSS.",
              "3. Publish to a free host and get a working URL before you make it pretty.",
              "4. Add a custom domain and turn on HTTPS — both are free and both take an afternoon.",
              "5. Add the essentials: a title, a description, a favicon, a way to be contacted, and a privacy statement if you collect anything.",
              "6. Submit the sitemap and tell search engines the site exists.",
            ],
          },
        ],
      },
      {
        id: "domain",
        heading: "Domains and HTTPS",
        blocks: [
          {
            type: "p",
            text: "A subdomain is genuinely fine to start — free hosts all provide one, and it can be replaced later without losing anything. A real domain costs roughly the price of a coffee a year, and gets you a memorable address and a stronger impression when you write to anyone about it.",
          },
          {
            type: "list",
            items: [
              "HTTPS is free and automatic on every reputable host. Never ship a site without it.",
              "Point the domain at the host, then add it in the host's dashboard — the reverse of what most guides say, and the step that trips everyone up.",
              "Choose a domain once. Changing it later means starting your search history over.",
              "Prefer a .com if it exists and is unpriced reasonably; the newer extensions are fine but read oddly in print and in email.",
            ],
          },
        ],
      },
      {
        id: "speed",
        heading: "Make it fast and it will work",
        blocks: [
          {
            type: "list",
            items: [
              "Compress every image. It is almost always the single biggest win available and takes two minutes.",
              "Use modern formats where they're supported, and never ship an image far larger than the space it displays in.",
              "Serve static files over HTTPS with caching headers so returning visitors get instant loads.",
              "Ship as little JavaScript as possible. Most sites need far less than a template assumes.",
              "Test on a real phone over mobile data. That is where most of your visitors are.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Search systems weight mobile speed heavily, and visitors bounce in about three seconds. A beautiful slow site ranks and converts worse than a plain fast one.",
          },
        ],
      },
      {
        id: "maintenance",
        heading: "The part nobody mentions",
        blocks: [
          {
            type: "p",
            text: "A static site needs almost no maintenance, which is the real argument for it. A site with a database, a login or a build plugin needs updating whether or not anyone visits it.",
          },
          {
            type: "list",
            items: [
              "If you use a generator, update it every few months — the dependencies underneath it will age regardless.",
              "Back up your source. If you wrote in Markdown, that folder *is* your backup, and it is the most valuable thing on the site.",
              "Check your renewal dates for domains and hosting. An unnoticed expiry is the most common way a working site disappears.",
              "Keep a copy of anything that only exists in the database of a hosted platform.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-write-summaries-that-work",
    title: "How to Write Summaries That Actually Work",
    emoji: "📝",
    desc: "The four summary types, what to keep and cut, how to check for lost meaning, and how to get a usable summary out of any AI tool.",
    date: "26 Sep 2026",
    readTime: "7 min read",
    tag: "Writing",
    metaTitle: "How to Write Summaries That Actually Work | SlashAI",
    metaDesc:
      "How to write summaries that keep their meaning: the four types, what to cut, how to check for lost detail, and prompts that produce usable summaries.",
    summary:
      "Most bad summaries are bad in one of two ways: too long to be a summary, or so compressed that the caveats and the numbers disappear. This guide covers the four types of summary and when each is right, what can and cannot be cut, a reliability check for lost meaning, and how to get a genuinely useful summary out of an AI tool without taking its word for it.",
    sections: [
      {
        id: "four-types",
        heading: "Four kinds of summary, and when each is right",
        blocks: [
          {
            type: "list",
            items: [
              "Executive — the decision, the recommendation, the cost, the risk, and what happens next. For someone who will act on it and not read more.",
              "Abstract — the problem, the approach, the key result. For someone deciding whether to read the whole thing.",
              "Descriptive — what the document covers, section by section, without judging it. When the reader needs orientation, not conclusions.",
              "Critical — the above plus an assessment of quality, method and limitations. The only honest version for anything academic or technical.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Most 'summaries' that disappoint are the wrong type. A paper's abstract cannot double as an executive summary, and a critical summary cannot double as a neutral one.",
          },
        ],
      },
      {
        id: "what-to-cut",
        heading: "What to cut and what never to cut",
        blocks: [
          {
            type: "p",
            text: "Compressing means choosing. The failure is cutting at random rather than by decision.",
          },
          {
            type: "list",
            items: [
              "Cut: repetition, throat-clearing, background everyone in the audience knows, method narration, and hedging.",
              "Keep: the conclusion, the specific numbers, the caveats and limitations, the conditions under which it holds, and anything that would change the reader's decision.",
              "Keep: disagreements and unresolved questions. A summary that presents a contested topic as settled is actively misleading.",
              "Keep: who did the work, if it affects credibility.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "The single most damaging thing you can cut is a limitation. It is the least interesting sentence in a paper and the reason two studies that look identical aren't.",
          },
        ],
      },
      {
        id: "length",
        heading: "Length that fits the purpose",
        blocks: [
          {
            type: "list",
            items: [
              "One sentence: only for a headline claim. Fine for 'X reduces Y by Z%' and nothing more.",
              "Three to five sentences: a proper abstract. The most useful single format.",
              "A paragraph: for a report someone will skim before deciding to read it.",
              "Bullet points: when the source is a list anyway — a spec, a meeting, a set of findings. Never convert prose into bullets; the structure is the information.",
            ],
          },
        ],
      },
      {
        id: "check",
        heading: "Check for lost meaning",
        blocks: [
          {
            type: "p",
            text: "Compression fails quietly. A summary can be accurate sentence by sentence and still misrepresent the source, because the caveats travelled separately from the claims.",
          },
          {
            type: "list",
            items: [
              "Read the summary, then the conclusion of the source. Do they agree, including the hedging?",
              "Check every number in the summary against the source. Numbers are where compression goes wrong most often.",
              "Ask: could this summary be used to mislead someone without contradicting any sentence in it? If yes, it's too compressed.",
              "Check that qualifiers travelled with their claims: 'in some cases', 'up to', 'in the tested range'.",
            ],
          },
        ],
      },
      {
        id: "ai",
        heading: "Getting a summary out of an AI tool",
        blocks: [
          {
            type: "p",
            text: "AI summarisation is fast and usually good on structure, and it reliably flattens uncertainty — 'may', 'is associated with' and 'in this sample' come out as flat assertions. So specify the type and check the qualifiers.",
          },
          {
            type: "p",
            text: "These commands produce the summary and, just as importantly, the material to check it against.",
          },
          {
            type: "prompts",
            promptIds: [
              "summarize",
              "summarizepdf",
              "summarizeslides",
              "summarizeinterview",
              "factchecktopic",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Never paste anything confidential into a cloud AI tool to summarise it. If the content can't leave your machine, use a local model or summarise it by hand.",
          },
        ],
      },
    ],
  },
];

/** Every blog post on SlashAI — the originals plus the longer guides. */
export const ALL_BLOG_POSTS: BlogPost[] = [...BLOG_POSTS, ...GUIDE_POSTS];

/** Every tag in use, in first-seen order, for the listing filters. */
export const BLOG_TAGS: string[] = Array.from(new Set(ALL_BLOG_POSTS.map((p) => p.tag))).sort(
  (a, b) => a.localeCompare(b),
);

export function getBlogPost(slug: string): BlogPost | undefined {
  return ALL_BLOG_POSTS.find((p) => p.slug === slug);
}
