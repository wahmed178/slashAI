/**
 * SlashAI Blog Articles — authentic, evergreen technical guides and copy-ready prompt collections.
 * Client-side rendered, zero external APIs, zero placeholders.
 */

export interface BlogBlock {
  type: "p" | "h" | "list" | "code" | "callout" | "prompts" | "tools";
  text?: string;
  items?: string[];
  lang?: string;
  tone?: "tip" | "warn";
  promptIds?: string[];
  /**
   * SlashKits (or declarative) tool slugs to surface as cards inline in the
   * article. Unknown slugs are skipped at render time, so a renamed tool
   * degrades to a smaller row rather than a broken link.
   */
  toolSlugs?: string[];
}

export interface BlogSection {
  id: string;
  heading: string;
  intro?: string;
  blocks: BlogBlock[];
}

export interface BlogPost {
  slug: string;
  title: string;
  emoji: string;
  desc: string;
  date: string;
  readTime: string;
  tag: string;
  metaTitle: string;
  metaDesc: string;
  summary: string;
  sections: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "best-free-ai-prompts-for-professionals-in-india-2026",
    title: "Best Free AI Prompts for Professionals in India (2026)",
    emoji: "🇮🇳",
    desc: "10 copy-ready prompts for email, reports, meetings and career growth — built for Indian workplaces and free AI tools.",
    date: "16 Sep 2026",
    readTime: "7 min read",
    tag: "Workplace",
    metaTitle: "Best Free AI Prompts for Professionals in India (2026) | SlashAI",
    metaDesc:
      "10 free copy-ready AI prompts for Indian professionals: emails, meeting notes, reports, resumes and appraisals. Works in free ChatGPT, Gemini and Claude. No account needed.",
    summary:
      "AI tools are free. Knowing what to type into them is the real skill — and it's the part nobody teaches. This guide fixes that with ten copy-ready prompts built for the realities of Indian work life: the polite email to your manager, the meeting that needed to be an email, the weekly report nobody reads, and the resume stuck in 2022.",
    sections: [
      {
        id: "email",
        heading: "Email prompts that get replies",
        intro:
          "Indian workplace email is a genre of its own: polite, hierarchical, and often written at 11pm. These three prompts draft, soften and shrink emails so you send better ones faster.",
        blocks: [
          {
            type: "prompts",
            promptIds: ["draftemail", "rewriteemail", "shortenemail"],
          },
        ],
      },
      {
        id: "meetings",
        heading: "Meeting prompts that save an hour a week",
        intro:
          "Meetings multiply in Indian offices — and so do the notes nobody reads. Use AI to summarise, prioritise and plan instead of typing minutes by hand.",
        blocks: [
          {
            type: "prompts",
            promptIds: ["meetingrecap", "prioritizemeeting", "planmeeting"],
          },
        ],
      },
      {
        id: "reports",
        heading: "Report prompts for the weekly grind",
        intro:
          "Whether it's a status update to your manager or a monthly review, these prompts turn rough points into a structured draft you can defend in the meeting.",
        blocks: [
          {
            type: "prompts",
            promptIds: ["draftreport", "rewritereport"],
          },
        ],
      },
      {
        id: "career",
        heading: "Career prompts for the next move",
        intro:
          "From tailoring your resume for an ATS to practising tough interview answers — the highest-leverage AI use for your career is preparation.",
        blocks: [
          {
            type: "prompts",
            promptIds: ["tailorresume", "reviewresume"],
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-chain-ai-prompts-like-a-senior-engineer",
    title: "How to Chain AI Prompts Like a Senior Engineer",
    emoji: "⛓️",
    desc: "Why megaprompts fail in production, and how to build deterministic, piped multi-step AI pipelines with schema validation.",
    date: "18 Sep 2026",
    readTime: "9 min read",
    tag: "Engineering",
    metaTitle: "How to Chain AI Prompts Like a Senior Engineer | SlashAI Guide",
    metaDesc:
      "Master prompt chaining: learn why single-shot prompts hallucinate, how to pipe JSON schemas between steps, and how to implement automated error-correction loops.",
    summary:
      "When developers first experiment with LLMs, their instinct is to create a 'megaprompt' — a 2,000-word wall of text demanding research, synthesis, tone adjustment, and formatted code in a single prompt. It almost always degrades. Senior engineers treat LLMs like Unix utilities: small, composable stages linked by deterministic schemas.",
    sections: [
      {
        id: "why-megaprompts-fail",
        heading: "1. The Cognitive Load of the Megaprompt",
        blocks: [
          {
            type: "p",
            text: "Autoregressive transformers attend to tokens sequentially. When you ask a model to simultaneously analyze 5 pages of unstructured text, categorize sentiment, extract key entities, and produce a perfectly formatted TypeScript schema, you are maximizing the probability of constraint decay.",
          },
          {
            type: "callout",
            tone: "warn",
            text: "Constraint Decay: As prompt length and task complexity increase, models reliably drop instructions placed in the middle third of the prompt context.",
          },
          {
            type: "p",
            text: "Instead of asking the model to do everything in one shot, split the task into discrete sequential transforms. Each step has one clear objective, zero distraction, and a concise output contract.",
          },
        ],
      },
      {
        id: "unix-philosophy",
        heading: "2. The Unix Pipeline for LLMs",
        blocks: [
          {
            type: "p",
            text: "Consider how Unix tools work: cat access.log | grep 404 | awk '{print $7}' | sort | uniq -c. Each command does one job cleanly. Your AI pipeline should follow the exact same architecture:",
          },
          {
            type: "list",
            items: [
              "Stage 1 (Extract): Parse raw input and extract raw facts/claims into a clean JSON array.",
              "Stage 2 (Verify): Cross-examine the extracted facts against ground truth or codebase references.",
              "Stage 3 (Transform): Apply formatting, tone, or code generation strictly to the verified facts.",
              "Stage 4 (Validate): Validate the final output against a rigid JSON schema or compiler test.",
            ],
          },
          {
            type: "code",
            lang: "typescript",
            text: `// Example: Clean prompt pipeline with typed schema intermediate
const rawNotes = await fetchMeetingNotes();

// Step 1: Extract action items (Zero conversational fluff)
const actions = await llm.generate({
  prompt: "Extract all commitments, assignees, and deadlines as a JSON array.",
  input: rawNotes,
  responseFormat: { type: "json_object" }
});

// Step 2: Categorize by department and risk
const prioritized = await llm.generate({
  prompt: "Assign priority (P0-P3) and department to each item based on impact.",
  input: actions
});`,
          },
        ],
      },
      {
        id: "schema-boundaries",
        heading: "3. Enforcing Rigid Schema Boundaries",
        blocks: [
          {
            type: "p",
            text: "The greatest failure point between prompt stages is conversational drift — the model outputting 'Sure! Here is the JSON you requested:' before the JSON object. This breaks downstream parsers instantly.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Never let conversational banter pass between stages. Set temperature to 0.0 or 0.2, enforce json_object mode or Zod schemas, and strip markdown code fences before piping to the next step.",
          },
          {
            type: "p",
            text: "Here are four production-grade commands from the SlashAI library designed specifically for multi-step prompt engineering and evaluation:",
          },
          {
            type: "prompts",
            promptIds: ["chaintask", "chainagent", "promptimprove", "auditprompt"],
          },
        ],
      },
      {
        id: "self-repair",
        heading: "4. The Self-Correction Loop",
        blocks: [
          {
            type: "p",
            text: "What happens when Stage 4 schema validation fails? Novice workflows crash or discard the result. Production systems catch the validation error and send the exact error back to the model in an automated repair turn:",
          },
          {
            type: "code",
            lang: "typescript",
            text: `try {
  const verified = TaskSchema.parse(JSON.parse(output));
  return verified;
} catch (err) {
  // Feed the parser error directly back to the model
  return await llm.generate({
    prompt: "Your previous JSON response violated our schema. Fix the errors listed below without altering correct fields.",
    input: { previousOutput: output, schemaErrors: err.issues }
  });
}`,
          },
          {
            type: "p",
            text: "This single feedback mechanism increases task success rates across complex technical extractions from ~72% to over 96%.",
          },
        ],
      },
    ],
  },
  {
    slug: "developer-ai-workflow-playbook-2026",
    title: "The Developer's AI Workflow Playbook (2026 Edition)",
    emoji: "⚡",
    desc: "Practical strategies for integrating offline-first AI, local LLMs, and compiler verification into daily engineering.",
    date: "17 Sep 2026",
    readTime: "8 min read",
    tag: "Workflow",
    metaTitle: "The Developer's AI Workflow Playbook (2026 Edition) | SlashAI",
    metaDesc:
      "How senior developers use AI in 2026: zero-leak local tools, context packing techniques, test-driven validation, and avoiding hallucinated dependencies.",
    summary:
      "The honeymoon phase of AI coding is officially over. Developers have realized that raw code volume is not the goal — reliability, maintainability, and privacy are. Here is the pragmatic playbook used by senior engineers to get maximum leverage from AI without drowning in subtle regressions.",
    sections: [
      {
        id: "offline-first-privacy",
        heading: "1. The Shift to Offline-First & Client-Side Tools",
        blocks: [
          {
            type: "p",
            text: "In 2026, engineering security teams are clamping down on arbitrary cloud copy-pasting. Sending proprietary codebase architecture, API schemas, or customer data into third-party cloud wrappers creates massive compliance liabilities.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Use offline, zero-network tools (like SlashAI's browser utilities) for JSON transformations, regex testing, hash generation, and AST inspections. Nothing leaves your device.",
          },
          {
            type: "p",
            text: "For prompts and code generation, run local quantization models (via Ollama or vLLM) for proprietary internal code, reserving cloud models strictly for public documentation or sanitized abstractions.",
          },
        ],
      },
      {
        id: "three-strike-rule",
        heading: "2. The Three-Strike Rule for AI-Generated Code",
        blocks: [
          {
            type: "p",
            text: "One of the most dangerous developer time-sinks is prompting back and forth with an AI for 45 minutes on a bug that could have been resolved manually in 5 minutes with a debugger. Senior engineers follow the Three-Strike Rule:",
          },
          {
            type: "list",
            items: [
              "Strike 1: Ask the AI to write or refactor the function given clear types and test cases.",
              "Strike 2: If the test fails, feed the compiler/runtime error message back once for a surgical fix.",
              "Strike 3: If the second attempt fails or hallucinates an imaginary API, drop the AI. Open the debugger, write the test by hand, and fix it yourself.",
            ],
          },
          {
            type: "p",
            text: "Adhering to this rule prevents 'prompt sunk cost fallacy' and keeps velocity high.",
          },
        ],
      },
      {
        id: "context-packing",
        heading: "3. Precise Context Packing Over Whole-Repo Ingestion",
        blocks: [
          {
            type: "p",
            text: "Passing 50 files into an LLM context window doesn't make it smarter — it introduces needle-in-a-haystack retrieval noise. Top developers pack context surgically:",
          },
          {
            type: "list",
            items: [
              "Always include TypeScript types, interfaces, and function signatures — never the 1,000-line implementation details of unrelated callers.",
              "Include existing test cases: models write vastly better implementations when they can see the exact assertion assertions they must satisfy.",
              "Specify library versions explicitly: 'Using Tailwind CSS v4 and TanStack Router v1' eliminates suggestions based on outdated v3 syntax.",
            ],
          },
          {
            type: "prompts",
            promptIds: ["codereview", "refactorfunction", "testfunction", "refactorcomponent"],
          },
        ],
      },
      {
        id: "compiler-guardrails",
        heading: "4. Test-Driven Verification Loops",
        blocks: [
          {
            type: "p",
            text: "Never merge AI-generated code without automated compilation and test execution. If you don't have tests, use AI to write the tests first (TDD), verify that the tests fail against empty functions, and only then prompt for the implementation.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "SlashAI includes zero-install tools like JSON-to-TypeScript, Markdown Table Generator, and Hash Generators to help you quickly assemble test fixtures and mocks without third-party dependencies.",
          },
        ],
      },
    ],
  },
  {
    slug: "speak-english-confidently-beginners-guide",
    title: "How to Speak English Confidently: A Beginner's Guide",
    emoji: "🗣️",
    desc: "A 90-minute daily system for real spoken English — vocabulary that matters, shadowing, sentence frames, and how to use AI as a speaking partner.",
    date: "26 Sep 2026",
    readTime: "9 min read",
    tag: "English",
    metaTitle: "How to Speak English Confidently - A Beginner's Guide | SlashAI",
    metaDesc:
      "A practical daily system to speak English confidently: 1,000 high-frequency words, shadowing drills, sentence frames and free AI speaking practice. No accent required.",
    summary:
      "Most people don't have an English problem. They have a volume problem — too little spoken practice, spread too thinly over too long. This guide replaces vague advice like 'just practice more' with a 90-minute daily system you can start tonight: the words that actually carry a conversation, how to shadow native speech, five sentence frames that keep you talking when the words run out, and how to turn any free AI chat into a patient, endlessly available speaking partner.",
    sections: [
      {
        id: "the-real-problem",
        heading: "The problem is volume, not talent",
        intro:
          "You already know more English than you think. The gap between what you understand and what you say is almost entirely a practice gap — and it closes with repetition, not with talent.",
        blocks: [
          {
            type: "p",
            text: "Adult second-language speakers typically recognise 2,000–3,000 words but actively use fewer than 1,000 of them in conversation. The gap exists because the words you studied in school were chosen for reading books, not for arguing, apologising, or ordering food. English conversation runs on a much smaller and much more repetitive core.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Aim for active use of 1,000 high-frequency words before you try to 'speak more fluently'. It feels slow for about two weeks, then it changes completely.",
          },
        ],
      },
      {
        id: "daily-system",
        heading: "The 90-minute daily system",
        intro:
          "Do these three blocks every day. Ninety focused minutes beats five scattered hours across a week, every time.",
        blocks: [
          {
            type: "list",
            items: [
              "30 min — Input: read or listen to English you actually understand (85–95% is the sweet spot). Read aloud while you do it.",
              "30 min — Output: speak on your own. Narrate your day, argue a side, retell something you read. Out loud, timed, recorded on your phone.",
              "30 min — Feedback: replay the recording, note the three words you reached for and failed on, and drill those three.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Recording yourself is the single highest-return habit in this list. What sounds wrong to you inside your head sounds fine to a listener — you cannot fix a problem you cannot hear.",
          },
        ],
      },
      {
        id: "shadowing",
        heading: "Shadowing: the cheapest fluency upgrade",
        intro:
          "Shadowing means speaking along with a native recording in real time, matching their speed, rhythm and stress. It trains your mouth and ear at the same time.",
        blocks: [
          {
            type: "list",
            items: [
              "Pick a 60–90 second clip from a video or podcast you would enjoy anyway. News, interviews and explainer videos work best.",
              "Listen once without speaking. Understand roughly 85% of it.",
              "Play it again and speak along, in sync. Miss words are fine — keep going.",
              "Record yourself shadowing the same clip. Compare. The gap closes in a few weeks.",
            ],
          },
          {
            type: "p",
            text: "Shadowing works because it forces your mouth into the target rhythm. Grammar drills teach you rules; shadowing teaches your ear and lips to move together, which is what actually sounds like fluency.",
          },
        ],
      },
      {
        id: "sentence-frames",
        heading: "Five frames that keep you talking",
        intro:
          "The moment your vocabulary runs out is the moment most conversations die. These five frames keep the conversation moving while you search for the right word.",
        blocks: [
          {
            type: "list",
            items: [
              "To put it another way: … — lets you restate and keep the floor.",
              "I'm not sure I follow — could you rephrase that? — buys you thinking time without admitting defeat.",
              "What I mean is … — repairs a sentence that came out badly.",
              "I'm just thinking out loud, but … — lets you try something risky and back out.",
              "How would you do that? — hands the problem back and keeps you learning.",
            ],
          },
          {
            type: "code",
            lang: "example",
            text: "— Do you want to meet on Friday?\n\n  Sorry, do you mean this Friday? It's a bit tight for me. What about the Monday after — say 10am?",
          },
        ],
      },
      {
        id: "ai-partner",
        heading: "Turn any free AI chat into a speaking partner",
        intro:
          "Free tiers of ChatGPT, Gemini and Claude all handle voice or text role-play. The trick is giving the AI a role, a level and a correction rule up front — otherwise you get a generic conversation partner who never corrects you.",
        blocks: [
          {
            type: "p",
            text: "Use these commands from the SlashAI library to generate the drill, the vocabulary list and the correction pass. Paste your own recorded transcript in as input.",
          },
          {
            type: "prompts",
            promptIds: [
              "teachlanguage",
              "flashcardslanguage",
              "analogylanguage",
              "practicecourse",
              "mistakescourse",
            ],
          },
        ],
      },
      {
        id: "mistakes",
        heading: "What actually holds people back",
        blocks: [
          {
            type: "list",
            items: [
              "Waiting until you feel ready. You never feel ready. You become ready at roughly the point where you're already comfortable being uncomfortable.",
              "Learning vocabulary in isolation. Learn words inside the sentence you'd actually use.",
              "Translating sentence by sentence. Think in your language, then say it in English — thinking in English too early slows you down.",
              "Avoiding mistakes so hard that you avoid speaking. Mistakes are the fee you pay for fluency.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Nobody assesses your accent. They assess whether you communicated. A heavily accented but clear message lands; a grammatically perfect but mumbled one does not.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-use-ai-prompts-that-work",
    title: "How to Use AI Prompts That Actually Work",
    emoji: "🎯",
    desc: "The four-part prompt frame, why examples beat instructions, and how to iterate instead of restarting — with copy-ready commands for every step.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "Prompting",
    metaTitle: "How to Use AI Prompts That Actually Work | SlashAI",
    metaDesc:
      "A four-part prompt frame, why showing beats telling, and how to iterate instead of restarting. Free copy-ready prompts included.",
    summary:
      "The difference between a weak prompt and a strong one is almost never model choice — it's structure. A good prompt tells the model what it is, what it's given, what a great answer looks like, and what it must not do. This guide gives you that frame, shows why an example outperforms an instruction, and explains why iterating beats rewriting from scratch.",
    sections: [
      {
        id: "the-frame",
        heading: "The four-part frame",
        intro:
          "Every good prompt answers four questions. If yours answers all four, you rarely need to change it.",
        blocks: [
          {
            type: "code",
            lang: "frame",
            text: "# 1. ROLE        - who should the model be?\n# 2. INPUT       - what material does it get?\n# 3. GOAL        - what does a great result look like?\n# 4. CONSTRAINTS - tone, length, format, and what to avoid",
          },
          {
            type: "code",
            lang: "filled in",
            text: "You are a senior technical editor. Below is a rough draft of a blog post.\n\nGoal: a 600-word post a smart non-expert would finish, with one concrete example per section.\nConstraints: plain English, no jargon, no hype words, end with a single question.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "You don't need all four every time. A summarisation task rarely needs a role. A writing task almost always does.",
          },
        ],
      },
      {
        id: "show-dont-tell",
        heading: "Show, don't just tell",
        intro:
          "Models imitate patterns far more reliably than they obey abstract instructions. One concrete example is usually worth a paragraph of description.",
        blocks: [
          {
            type: "list",
            items: [
              "Weak: 'Write headlines that are punchy.'  Strong: 'Write headlines under 60 characters, no clickbait, like these: \"The 4-minute fix for a slow morning\"'.",
              "Weak: 'Be concise.'  Strong: 'Answer in exactly three sentences, then stop.'",
              "Weak: 'Use a friendly tone.'  Strong: paste one paragraph that already sounds like you and say 'match this'.",
            ],
          },
          {
            type: "p",
            text: "This is why a saved, reusable prompt beats a freshly typed one every time. Store the version that worked — that's exactly what the SlashAI command vault is for.",
          },
        ],
      },
      {
        id: "iterate",
        heading: "Iterate, don't restart",
        intro:
          "The most common waste in AI use is throwing away a mediocre answer and typing the whole request again. You lose the good parts.",
        blocks: [
          {
            type: "list",
            items: [
              "Keep it and cut: 'Keep paragraph 1 and 4, delete 2 and 3, tighten the ending.'",
              "Keep it and expand: 'Expand section 3 with a real example and a number.'",
              "Change the angle: 'Rewrite this for a 12-year-old, same length.'",
              "Change the format: 'Turn this into a 6-slide outline with one bullet per slide.'",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Restarting from scratch every time is why 'AI gives generic output' is such a common complaint. It usually gave a good output, and you asked for a new one.",
          },
        ],
      },
      {
        id: "commands",
        heading: "Commands for each step",
        blocks: [
          {
            type: "p",
            text: "Use these to generate the prompt, refine the answer, and check it before you ship it.",
          },
          {
            type: "prompts",
            promptIds: [
              "explain",
              "simplifytext",
              "rewriteessay",
              "factchecktopic",
              "compareoptions",
            ],
          },
        ],
      },
      {
        id: "prompt-antipatterns",
        heading: "Five prompt mistakes",
        blocks: [
          {
            type: "list",
            items: [
              "Asking a question the model has no data on (today's live prices, your internal metrics). It will guess — confidently.",
              "Dumping everything at once. Long undifferentiated context buries the instruction. Put the instruction last, where attention is strongest.",
              "Never correcting. When it's wrong, say what's wrong and what you expected. The next answer will be measurably better.",
              "Asking for certainty. Ask for confidence and sources instead: 'how confident are you, and what would I verify?'",
              "Using one prompt for ten different jobs. Separate the extraction from the analysis from the writing.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "free-resources-to-learn-anything-2026",
    title: "Free Resources to Learn Anything in 2026",
    emoji: "🎓",
    desc: "Where to learn for free — universities, YouTube, practice sites, and how to pick a course that is actually worth your time.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "Free Resources",
    metaTitle: "Free Resources to Learn Anything in 2026 | SlashAI",
    metaDesc:
      "The best genuinely free learning resources in 2026: free university courses, YouTube channels, practice platforms, and how to choose one that works.",
    summary:
      "There has never been this much free, high-quality learning material — and never been this much bad material mixed in with it. This guide points you at the sources that are genuinely free and worth your time, and gives you a simple test for whether a course deserves your Saturday.",
    sections: [
      {
        id: "university",
        heading: "Free university courses, with real courseware",
        intro:
          "These release actual lecture recordings, assignments and reading lists — not just promotional summaries.",
        blocks: [
          {
            type: "list",
            items: [
              "edX — university-run courses, often free to audit; certificates cost money but nobody needs the certificate to learn.",
              "Coursera — free 'audit' track on most courses from universities and large companies.",
              "MIT OpenCourseWare — complete course materials, assignments and exams, free forever, no signup.",
              "Khan Academy — the standard for school-level maths, science, computing and economics, and genuinely excellent.",
              "The Open University (UK) and IGNOU (India) — full degree-level material if you want a structured, credit-bearing path at low cost.",
            ],
          },
        ],
      },
      {
        id: "practice",
        heading: "Free practice, not just free theory",
        intro:
          "Watching is not learning. These give you somewhere to apply what you watched, which is where the actual learning happens.",
        blocks: [
          {
            type: "list",
            items: [
              "Exercism — free mentoring and review on code exercises in dozens of languages.",
              "LeetCode — hundreds of free problems, and the interview signal is real.",
              "Kaggle — datasets, notebooks and free-tier compute for data work.",
              "HackerRank — structured skill tracks with free tiers and certificates.",
              "For languages: Anki (free desktop) and Language Reactor or LWT for spaced repetition on real web pages.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "The rule that works: spend at least as much time doing as watching. A 40-minute video that produces 40 minutes of practice is a 40-minute lesson. A 40-minute video that produces nothing is entertainment.",
          },
        ],
      },
      {
        id: "choose",
        heading: "How to tell if a course is worth your time",
        blocks: [
          {
            type: "list",
            items: [
              "Does it show the syllabus before you commit? A course that won't show its structure is hiding something.",
              "Is it older than three years? Fine for maths, physics and fundamentals. Check the date on anything software, medical, financial or legal.",
              "Does it end in a project? Courses that end in a build teach you; courses that end in a quiz teach you to recognise.",
              "Has someone finished it and shown their work? Look for the projects, not the reviews.",
              "Is it too long? A beginner course should be 8–20 hours. If it's 80 hours, it's a degree, not a course.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Free is not automatically good. There is a huge volume of abandoned, auto-generated and recycled material now. The syllabus test above filters most of it out in ten seconds.",
          },
        ],
      },
      {
        id: "plan",
        heading: "Turn a resource into an actual plan",
        blocks: [
          {
            type: "p",
            text: "A saved course is not progress. A schedule is. Give every resource a start date, a weekly hour budget and an end date, and turn it into concrete output.",
          },
          {
            type: "prompts",
            promptIds: [
              "teachcourse",
              "roadmapcourse",
              "teachskill",
              "flashcardscourse",
              "plangoal",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "best-free-browser-tools-2026",
    title: "The Best Free Browser Tools Worth Bookmarking",
    emoji: "🧰",
    desc: "Tools that run entirely in your browser — nothing uploads, no account, no subscription. What each one is actually good for.",
    date: "26 Sep 2026",
    readTime: "7 min read",
    tag: "Tools",
    metaTitle: "The Best Free Browser Tools Worth Bookmarking (2026) | SlashAI",
    metaDesc:
      "Genuinely free browser tools that need no account and upload nothing: image, document, developer, finance, focus and design tools, with honest limits.",
    summary:
      "Most 'free online tools' are free because you're the product — your file gets uploaded, your data gets retained, and you find out later. The tools on this page run entirely in your browser tab: the work happens on your own machine, nothing leaves it, and no account is required. Here is what each one is genuinely good at, and where its limits are.",
    sections: [
      {
        id: "why",
        heading: "What 'runs in your browser' actually means",
        blocks: [
          {
            type: "p",
            text: "A browser tool either processes your data on a server or inside your own tab. Server-side tools can be genuinely free, but your file has left your device, and that is a real tradeoff — especially for anything personal.",
          },
          {
            type: "list",
            items: [
              "Client-side: your file never leaves the machine. Works offline after first load, and keeps working when your connection doesn't.",
              "Server-side: better for huge files and heavy processing, but your data crosses the network and may be logged.",
              "Hybrid: the page is free, the heavy lifting is metered. Fine — just know which one you're in.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "The quick test: disconnect your Wi-Fi and try the tool. If it still works, your data never left the device.",
          },
        ],
      },
      {
        id: "categories",
        heading: "The categories that are genuinely covered for free",
        blocks: [
          {
            type: "list",
            items: [
              "Images — resize, crop, convert, compress, and remove backgrounds. Compression is the one you'll use weekly.",
              "Documents — PDF merge and split, image-to-PDF, Markdown to PDF, and QR codes. All work offline.",
              "Text and data — word and character counts, case conversion, JSON and TypeScript conversion, hashing, diffing.",
              "Developers — JWT decoding, regex testing, timestamp conversion, formatting helpers, API testers.",
              "Calculators and finance — loan and SIP maths, percentage, date arithmetic, BMI and unit conversion.",
              "Focus and time — Pomodoro timers, stopwatches, and plain-text scratchpads. Boring, and that is why they work.",
              "Colour and design — palette extraction from images, contrast checkers, gradient and shadow generators.",
            ],
          },
        ],
      },
      {
        id: "limits",
        heading: "Honest limits of free browser tools",
        blocks: [
          {
            type: "list",
            items: [
              "Very large files. In-browser processing is bounded by your device's memory. A 2GB video will not compress in a tab, and pretending otherwise wastes your time.",
              "Cross-device sync. No account means no history. If you need your work on two devices, use a real product.",
              "Collaboration. Almost every free browser tool is single-user by design.",
              "Permanent records. Clear your local storage and the tool forgets everything. That is a feature until it isn't.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Free and no-account usually means no data recovery. If a tool does real work for you, save the output before you close the tab.",
          },
        ],
      },
      {
        id: "how-to-pick",
        heading: "How to pick one instead of bookmarking forty",
        blocks: [
          {
            type: "p",
            text: "The failure mode is having sixty half-used bookmarks. Bookmark by trigger, not by category: 'I'm about to compress an image' should pull up exactly one tool.",
          },
          {
            type: "list",
            items: [
              "Test it in under 30 seconds with real, boring input before you keep it.",
              "If it asks for an account to do something the browser could do alone, skip it.",
              "Check the tool works at the sizes you actually use, not the demo size.",
              "Favour tools that show what they did, so you can undo or redo.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "github-uses-you-should-know",
    title: "What GitHub Is Actually For: 12 Uses Most People Miss",
    emoji: "🐙",
    desc: "GitHub is not just for code. Issues, Gist, Pages, Actions, releases, wikis and a free portfolio — the parts non-programmers actually use.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "GitHub",
    metaTitle: "What GitHub Is Actually For - 12 Uses Most People Miss | SlashAI",
    metaDesc:
      "Beyond pushing code: 12 practical uses of GitHub including Gist, Pages, Issues, Projects, Actions, releases, wikis, archiving and a free portfolio.",
    summary:
      "Most people think of GitHub as a place developers store code. That is roughly 5% of what it does. The other 95% — free file storage with version history, a project issue tracker, a free website host, a note-taking system, a build pipeline and a public portfolio — is available to anyone with a free account and no coding required.",
    sections: [
      {
        id: "what-it-is",
        heading: "What GitHub actually is",
        blocks: [
          {
            type: "p",
            text: "GitHub is a hosted version-control system. The core idea is that every change is a saved, reversible snapshot with an author and a message. Once you have that, an enormous number of useful things fall out of it — most of them unrelated to software.",
          },
          {
            type: "list",
            items: [
              "Free, unlimited public repositories — with full version history, issues, and a browser-based editor.",
              "A per-file history that shows exactly what changed, when, and who changed it.",
              "Nothing to install or configure to start. Create a repo in a browser and you are editing files immediately.",
            ],
          },
        ],
      },
      {
        id: "uses",
        heading: "The uses that have nothing to do with code",
        blocks: [
          {
            type: "list",
            items: [
              "Gist — paste any text, get a permanent link. Ideal for config files, snippets you share constantly, and text you're too lazy to keep in a notes app.",
              "Free version history for documents — upload a Markdown or text file to a repo and you get unlimited undo, branching and diffs forever.",
              "GitHub Pages — publish a free static website from a repo, automatically rebuilt on every push. Free hosting with HTTPS.",
              "Issues — a genuinely good task and bug tracker, with labels, assignees, milestones and search. Works fine for a to-do list.",
              "Projects — a kanban board attached to a repo. Useful for anything with stages.",
              "Releases — attach binaries, installers, PDFs or datasets to a versioned tag, with a permanent download URL that never changes.",
              "Actions — free automation: rebuild the site, run a script on a schedule, or post a message somewhere when a repo changes.",
              "Wikis — a simple per-repo wiki. Still a legitimate place for meeting notes and SOPs.",
              "Archive and backup — a private repo is a versioned, encrypted-at-rest backup of your documents, with a full audit trail.",
              "Star and follow — bookmark tools and people, and subscribe to a repo's releases for updates.",
              "Fork — one-click copy of someone else's project to modify safely, without asking.",
              "Profile as portfolio — your profile README, pinned repos and contribution graph are a live record of what you build.",
            ],
          },
        ],
      },
      {
        id: "avoid-mistakes",
        heading: "Don't do this",
        blocks: [
          {
            type: "callout",
            tone: "warn",
            text: "Never commit passwords, API keys, .env files or private customer data to a public repository. Once pushed, assume it is compromised — a rewrite does not un-leak it. If you must, use private repos and a .gitignore from the first commit.",
          },
          {
            type: "list",
            items: [
              "Add a .gitignore before your first commit, not after your first leak.",
              "Keep secrets out of the history entirely — rotate anything that was ever pushed by accident.",
              "Write commit messages for your future self, six months from now, who has no memory of today.",
            ],
          },
        ],
      },
      {
        id: "start",
        heading: "Start in five minutes",
        blocks: [
          {
            type: "code",
            lang: "bash",
            text: '# 1. create a free account at github.com\n# 2. make a repo called notes\n# 3. in your terminal:\ngit init\ngit remote add origin https://github.com/<you>/notes.git\ngit add .\ngit commit -m "first notes"\ngit push -u origin main',
          },
          {
            type: "p",
            text: "The GitHub documentation has a ten-minute 'Hello World' guide that assumes nothing. Do that first; the mental model clicks much faster than it sounds like it should.",
          },
        ],
      },
    ],
  },
  {
    slug: "find-free-youtube-channels-to-learn-from",
    title: "How to Find Free YouTube Channels Worth Learning From",
    emoji: "📺",
    desc: "How to vet a channel in two minutes, build a small curriculum instead of an endless feed, and use playlists like a course.",
    date: "26 Sep 2026",
    readTime: "7 min read",
    tag: "Learning",
    metaTitle: "How to Find Free YouTube Channels Worth Learning From | SlashAI",
    metaDesc:
      "Vet a YouTube channel in two minutes, build a real curriculum from playlists, and stop falling into the algorithm trap of endless scrolling.",
    summary:
      "YouTube has more free structured teaching than any institution ever built, and a search box is the worst possible way to find it. This guide covers the two-minute channel test, how to assemble a real curriculum out of playlists, and how to tell the difference from a channel that will waste your evening.",
    sections: [
      {
        id: "vet",
        heading: "The two-minute channel test",
        intro:
          "Before you subscribe to anything, spend two minutes. Look at three specific things, not at the subscriber count.",
        blocks: [
          {
            type: "list",
            items: [
              "The oldest videos. Watch one from two years ago. If it still holds up, the channel teaches — not just trends.",
              "The comments on a mid-tier video. Serious practitioners argue in the comments; engagement bait does not.",
              "Whether there's a structured playlist for your exact level. A channel with a 'beginner to confident' playlist is a course wearing a video platform's clothes.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Subscriber count measures popularity, not teaching quality. A 40,000-subscriber channel with no playlists is usually worse for learning than a 6,000-subscriber channel that publishes a syllabus.",
          },
        ],
      },
      {
        id: "curriculum",
        heading: "Build a curriculum, not a feed",
        intro:
          "The single biggest mistake is treating YouTube like a discovery engine. It is a library that happens to be sorted by engagement.",
        blocks: [
          {
            type: "list",
            items: [
              "Write down the one skill and the level. 'Intermediate Spanish' is searchable. 'Spanish' is not.",
              "Find one channel that covers the whole arc, not fifty channels covering five minutes each.",
              "Take their playlist and put it in order. Watch sequentially. The later videos assume the earlier ones.",
              "After every three videos, stop and do the thing without the video. This is the part everyone skips and it's the only part that works.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "A playlist you finish beats a subscription you never watch. Optimise for completion, not for discovery.",
          },
        ],
      },
      {
        id: "trap",
        heading: "Getting the algorithm to work for you",
        blocks: [
          {
            type: "list",
            items: [
              "Turn off autoplay. It is engineered to keep you on the platform, not to keep you learning.",
              "Watch at 1.5–2x. Most educational content is paced far below necessary.",
              "Search with intent: 'how to', not 'fun'. 'how to fix a bike derailleur' and 'bike derailleur' give completely different results.",
              "Use playlists from the channel you're already on rather than the autoplay suggestions — the algorithm drifts, the playlist does not.",
              "When a video tells you to subscribe mid-way, skip to the end. The mid-roll is where the retention bait lives.",
            ],
          },
        ],
      },
      {
        id: "verify",
        heading: "Know when to stop trusting a video",
        blocks: [
          {
            type: "list",
            items: [
              "Software, hardware, medical, financial or legal content older than about two years — verify against the official docs.",
              "Anything promising a specific income, guaranteed rank or fixed result in a fixed time.",
              "Channels that never show a failure case. Real expertise includes what does not work.",
            ],
          },
          {
            type: "p",
            text: "Use these commands to turn a video's ideas into something you can actually keep — summaries, study material, and practice questions.",
          },
          {
            type: "prompts",
            promptIds: [
              "writeyoutubescript",
              "summarize",
              "flashcardsconcept",
              "teachconcept",
              "quizcourse",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "learn-a-new-skill-fast",
    title: "How to Learn a New Skill Fast (Without Burning Out)",
    emoji: "🧠",
    desc: "The 20% that gets you 80% of the way, deliberate practice, spaced repetition, and why most people quit at week three.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "Learning",
    metaTitle: "How to Learn a New Skill Fast Without Burning Out | SlashAI",
    metaDesc:
      "A realistic framework for learning a new skill fast: 20% fundamentals, deliberate practice, spaced repetition, feedback loops, and surviving the plateau.",
    summary:
      "Learning fast is not about more hours — it's about cutting the material that doesn't matter, practising in the way experts actually do, and surviving the motivation collapse that hits everyone around week three. This is the framework that makes the difference: what to skip, how to practise, how to know you're improving, and what to do when you plateau.",
    sections: [
      {
        id: "twenty-percent",
        heading: "Find the 20% first",
        intro:
          "Most skills are front-loaded with material you do not need yet. Find the core before you start, or you will spend a month on theory you never use.",
        blocks: [
          {
            type: "list",
            items: [
              "Find three to five people who are genuinely good at it and ask them: what do you wish you'd known on day one?",
              "Search for a 'roadmap' or 'curriculum' for the skill, then ruthlessly cut it to the first 20%.",
              "Identify the single smallest thing you can build or do. Do that in week one. Motivation is a function of evidence.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "The fastest learners are not the ones who study more. They are the ones who start producing sooner, because producing forces the gaps to become obvious.",
          },
        ],
      },
      {
        id: "deliberate",
        heading: "Practise the way experts do",
        blocks: [
          {
            type: "p",
            text: "Re-reading and re-watching feel like practice and are not. They create familiarity, which feels like progress and isn't. Deliberate practice has three properties:",
          },
          {
            type: "list",
            items: [
              "Specific — you are working on one identified weakness, not 'getting better at the whole thing'.",
              "At the edge of your ability — hard enough that you fail sometimes. If you never fail, you're reviewing, not practising.",
              "Feedback-driven — you find out immediately whether you were right, and you correct before moving on.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Endless highlighters and re-reading feel productive because they're low effort. They're the main reason people think they're bad at learning when they're just using the wrong method.",
          },
        ],
      },
      {
        id: "spaced",
        heading: "Space it, don't cram it",
        blocks: [
          {
            type: "p",
            text: "Memory consolidates over time. Reviewing something shortly before you would have forgotten it is far more efficient than reviewing it five times in one evening.",
          },
          {
            type: "list",
            items: [
              "Review a new item after 1 day, then 3 days, 7 days, 14, then monthly.",
              "Keep the deck small. Fifty cards you actually review beats five hundred you abandon.",
              "Write cards that ask you to produce an answer, not to recognise one. 'Define X' is weak; 'when would you use X?' is strong.",
              "Use a spaced-repetition app rather than re-reading. Free options work fine.",
            ],
          },
        ],
      },
      {
        id: "plateau",
        heading: "Surviving week three",
        blocks: [
          {
            type: "p",
            text: "Every skill has a plateau where effort stops translating into visible progress. This is normal and it is where most people quit — usually right before the payoff.",
          },
          {
            type: "list",
            items: [
              "Shrink the session, don't skip it. Fifteen minutes a day beats two hours once a week.",
              "Change the kind of work: if grinding exercises has stalled, build something small instead.",
              "Get external feedback. A person, a test, or a published output. Solo practice has no error correction.",
              "Track proof, not time. Finished chapters, minutes of audio, repos pushed, meals cooked.",
            ],
          },
        ],
      },
      {
        id: "commands",
        heading: "Commands to build your learning system",
        blocks: [
          {
            type: "p",
            text: "Generate a curriculum, practice material and a feedback rubric with these, then paste your own attempts in for review.",
          },
          {
            type: "prompts",
            promptIds: [
              "teachskill",
              "teachcourse",
              "flashcardsskill",
              "practicecourse",
              "mistakescourse",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "find-unique-websites-worth-bookmarking",
    title: "How to Find New Unique Websites Worth Bookmarking",
    emoji: "🌐",
    desc: "Escape the same twenty websites everyone uses — search operators, curated directories, and how to spot the good ones early.",
    date: "26 Sep 2026",
    readTime: "7 min read",
    tag: "Web",
    metaTitle: "How to Find New Unique Websites Worth Bookmarking | SlashAI",
    metaDesc:
      "Search operators, curated directories and discovery habits that surface genuinely interesting websites beyond the same twenty everyone uses.",
    summary:
      "Most people's web diet is about twenty sites they found in 2014. Getting out of that loop is a skill: knowing the search operators that surface unusual results, where curated directories still work, and how to evaluate a site in thirty seconds before you trust it with your time.",
    sections: [
      {
        id: "why-loop",
        heading: "Why the loop happens",
        blocks: [
          {
            type: "p",
            text: "Search engines optimise for what most people click, so they show you what most people already use. Recommendations optimise for engagement, so they show you more of the same. Both are optimised for staying, not for discovery. Getting out requires using tools that don't have that incentive.",
          },
        ],
      },
      {
        id: "operators",
        heading: "Search operators that break the loop",
        blocks: [
          {
            type: "list",
            items: [
              "site:example.com — restrict to one domain, so you can go deep on a site you like instead of wide across sites you've seen.",
              '"exact phrase" — forces a literal match and surfaces pages that actually use the wording, not paraphrases of it.',
              "-exclude — remove the sites you already know: 'best free design tools -pinterest -dribbble'.",
              "filetype: — pull specific document types, e.g. filetype:pdf for primary sources rather than blog posts about them.",
              "inurl: — find pages whose URL contains a word; often uncovers old, unlinked but genuinely useful directories.",
              "related: and link: — walk outward from a good page to pages connected to it but not obviously similar.",
            ],
          },
          {
            type: "code",
            lang: "search",
            text: '"beginner guide" -reddit -pinterest filetype:pdf\nsite:*.edu "machine learning" syllabus\ninurl:resources "offline" "free"',
          },
        ],
      },
      {
        id: "directories",
        heading: "Curated directories still work",
        blocks: [
          {
            type: "list",
            items: [
              "Awesome lists — huge curated collections on GitHub, organised by topic, mostly free and mostly maintained. Search GitHub itself for 'awesome <topic>'.",
              "Hacker News Show HN and Reddit r/webdev, r/InternetIsBeautiful — new projects, still small.",
              "Niche forums and Discords for the specific thing you care about. Smaller audience, far better signal.",
              "Newsletter recommendations and 'sites I like' lists from people whose taste you already trust.",
              "Wayback Machine — to see what a site looked like years ago, which is often more interesting than what it looks like now.",
            ],
          },
        ],
      },
      {
        id: "evaluate",
        heading: "The thirty-second site test",
        blocks: [
          {
            type: "list",
            items: [
              "Is it maintained? Check the newest date on the page. A 2019 tutorial is a liability, not a resource.",
              "Does it want your email before showing you anything? Careful, but not automatically a scam.",
              "How many ads? If you cannot see the content, leave.",
              "Does it link out, with real URLs, to primary sources? Linking out is the strongest trust signal there is.",
              "Does it work on a phone? Half the web's best material is still desktop-only and that is fine — just know.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Beware sites that exist entirely to sell you the thing they review, and 'top 10 X' listicles with no author, no date and no methodology. Those exist to harvest a click.",
          },
        ],
      },
      {
        id: "system",
        heading: "Make it a system, not an accident",
        blocks: [
          {
            type: "p",
            text: "Discovery is a habit, not an event. Two minutes a week of deliberately looking for one unfamiliar site, and saving the ones worth keeping, is enough to keep your web diet from calcifying.",
          },
          {
            type: "list",
            items: [
              "Keep one folder — not fifty — for saved sites, and review it monthly. Unused saves are just noise.",
              "Follow two or three people who curate rather than create. Their taste is the whole product.",
              "When you find something good, look at what they link to. That is where the next good site is.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "go-viral-on-instagram-in-2026",
    title: "How to Actually Go Viral on Instagram in 2026",
    emoji: "📸",
    desc: "No secret algorithm. What the format, hook, retention and sharing mechanics that make Reels spread — and the posting habits that compound.",
    date: "26 Sep 2026",
    readTime: "9 min read",
    tag: "Social",
    metaTitle: "How to Actually Go Viral on Instagram in 2026 | SlashAI",
    metaDesc:
      "The real mechanics behind Instagram reach: hook retention, shareable formats, watch time, posting consistency and why most accounts stall.",
    summary:
      "There is no viral button. What there is, is a set of well-understood mechanics: the first second, watch time, saves and shares, and a format people would actually send to a friend. This guide breaks down what each signal rewards, what the common formats are, and why the biggest accounts grow slowly while small ones occasionally explode.",
    sections: [
      {
        id: "reality",
        heading: "The honest part first",
        blocks: [
          {
            type: "p",
            text: "Viral is rare and mostly luck. What is not luck is distribution — whether any given post gets shown to a wide audience or stays inside your followers. Distribution is a mechanic, and mechanics can be improved. If you want predictable growth, target consistency first and virality second; a consistent mediocre account outgrows a brilliant one that posts twice.",
          },
          {
            type: "callout",
            tone: "warn",
            text: "Buying followers, using engagement pods, or posting with misleading hooks will all get you reach once and suppress you afterwards. The algorithm is not moral, it is just good at detecting a mismatch between the promise and the content.",
          },
        ],
      },
      {
        id: "signals",
        heading: "What the algorithm actually rewards",
        blocks: [
          {
            type: "list",
            items: [
              "Watch time and completion rate — did people watch to the end, and did they rewatch? Rewatching is the strongest positive signal there is.",
              "Shares — the most valued action. Would someone send this to a friend? Almost nothing else compares.",
              "Saves — a signal of lasting value: tutorials, references, anything someone wants to come back to.",
              "Watch-through before the first swipe — decided in one to two seconds, before the content is even understood.",
              "Consistency of a theme — a recognisable format makes people watch *because* it's the last one they liked.",
            ],
          },
          {
            type: "p",
            text: "Likes are the weakest signal. Optimising for likes produces content that is pleasant and forgettable, which is exactly what gets scrolled past.",
          },
        ],
      },
      {
        id: "hook",
        heading: "The first two seconds decide everything",
        blocks: [
          {
            type: "list",
            items: [
              "Say the payoff first, then deliver it. 'Three settings that fix blurry photos' beats 'so I was messing with my camera settings the other day'.",
              "Show the result, then explain how. The image of the finished thing is the hook.",
              "No logo intro, no slow fade, no 'hey guys welcome back'. Every frame before the hook is a frame lost.",
              "Put text on screen. Most people watch with sound off, in a room where they cannot look away.",
              "Pattern-break in the first frame. Movement, an unusual angle, or an unexpected opening shot.",
            ],
          },
          {
            type: "code",
            lang: "hook structure",
            text: "0-2s   the promise or the result (visual + text)\n2-8s   establish why it's worth staying\n8-20s  deliver the substance, in steps\n20-30s the payoff, revealed\n30s+   one clear reason to share, save or follow",
          },
        ],
      },
      {
        id: "formats",
        heading: "Formats that spread",
        blocks: [
          {
            type: "list",
            items: [
              "Problem / fix — the most reliably shared format. Teach one specific thing.",
              "Before / after — transformation is inherently worth showing to someone else.",
              "List with a countdown — '5 apps that...' gives a reason to stay to the end.",
              "Myth-busting — 'Stop doing X' creates a comment argument, and comments feed the algorithm.",
              "Story-driven — a single person, one situation, a real outcome. Slow to build trust, extremely sticky once you have it.",
              "Duets and stitches and remixes — riding someone else's larger audience is the fastest route to distribution.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "One account, one theme, one tone. The accounts that grow fastest are the ones a stranger can describe after three posts.",
          },
        ],
      },
      {
        id: "habits",
        heading: "The habits that compound",
        blocks: [
          {
            type: "list",
            items: [
              "Post on a schedule you can sustain — three a week for a year beats thirty in one month.",
              "Reply to every comment in the first hour. It extends the life of the post and signals a real community.",
              "Study your own analytics, not other people's. Watch where the first second loses people, and fix only that.",
              "Keep a swipe file: save the posts that work in your niche so you can analyse the structure, not just admire it.",
              "Batch the work. A month of ideas filmed in one afternoon is sustainable; daily filming is not.",
            ],
          },
          {
            type: "p",
            text: "Use these to build the assets each post needs — a hook, a script, a caption and a storyboard — before you open the camera.",
          },
          {
            type: "prompts",
            promptIds: [
              "hooksreel",
              "scriptreel",
              "captionreel",
              "storyboardreel",
              "thumbnailreel",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-actually-do-things",
    title: "How to Actually Do Things: A Framework for Getting Anything Done",
    emoji: "🛠️",
    desc: "Why 'I need to do X' never becomes done — and the six-step framework that turns any vague intention into an actual finished thing.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "Productivity",
    metaTitle: "How to Actually Do Things - A Framework for Getting Anything Done | SlashAI",
    metaDesc:
      "A six-step framework that turns 'I need to do X' into a finished thing: define done, find the next action, timebox, remove friction, and close the loop.",
    summary:
      "The gap between 'I should do that' and 'it's done' is not discipline — it is that the first is a wish and the second is a plan. This guide gives you the six steps that close the gap for almost anything: writing a report, learning a tool, clearing a backlog, or starting a project you've been avoiding.",
    sections: [
      {
        id: "why-stuck",
        heading: "Why things don't get done",
        blocks: [
          {
            type: "p",
            text: "Almost every stalled task is stalled for the same three reasons, and none of them is laziness:",
          },
          {
            type: "list",
            items: [
              "It isn't defined. 'Work on the presentation' is a category, not an action — your brain can't start.",
              "The next physical step is unclear. You know what the finished thing looks like but not what to type first.",
              "It's too big to hold in your head, so you avoid thinking about it — and avoiding is free.",
            ],
          },
        ],
      },
      {
        id: "framework",
        heading: "The six steps",
        blocks: [
          {
            type: "list",
            items: [
              "1. Define done, in one sentence. If you can't finish the sentence, you don't understand the task yet.",
              "2. Find the next physical action — something you can do in under five minutes, with no thinking required. 'Open the file and paste the template'.",
              "3. Timebox it. Twenty-five minutes, then stop even if unfinished. A stopped session gets restarted; an open-ended one gets abandoned.",
              "4. Remove friction for the next time. Lay the files out. Close the tabs. Set the timer before you stop, not after.",
              "5. Do it badly first. A terrible first draft that exists beats a perfect one you're still planning.",
              "6. Close the loop. Finish, file it, send it, or explicitly abandon it. An open loop costs attention forever.",
            ],
          },
          {
            type: "code",
            lang: "example",
            text: 'Vague:     "Write the project proposal."\nDone:      "A 3-page proposal that the client can approve, in Google Docs."\nNext step: "Open Docs, title the file, paste the template from my Drive."\nFirst 25m: headings only. Body can be garbage.',
          },
        ],
      },
      {
        id: "obstacles",
        heading: "When it still doesn't happen",
        blocks: [
          {
            type: "list",
            items: [
              "'I don't have time.' Usually means the next action is too big, or the deadline isn't real. Shrink it until it fits in a gap you actually have.",
              "'I don't know how to start.' Write down the three possible first steps. One of them will be obvious in hindsight.",
              "'I'll do it when things calm down.' Things never calm down. Schedule it like an appointment with a time and an end.",
              "It keeps getting interrupted. Put the phone in another room, not face-down on the desk. Face-down still draws attention.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "If a task has survived three reschedules, it is not a scheduling problem. Ask whether you actually want to do it, or whether someone else's 'should' is running your calendar.",
          },
        ],
      },
      {
        id: "system",
        heading: "Build a system that survives a bad week",
        blocks: [
          {
            type: "list",
            items: [
              "Capture everything into one inbox so nothing lives only in your head.",
              "Review it once a week and pick three things. Three is a real week; twelve is a wish.",
              "Timebox each to a fixed slot rather than a duration. 'Thursday 10–11' beats 'sometime this week'.",
              "Keep a shutdown list: what you will do first tomorrow. The next morning should need no decisions.",
            ],
          },
          {
            type: "p",
            text: "Use these to turn a list of intentions into scheduled, owned actions.",
          },
          {
            type: "prompts",
            promptIds: [
              "checklistinbox",
              "planinbox",
              "planday",
              "prioritizeproject",
              "timeboxgoal",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-boost-your-brain",
    title: "How to Boost Your Brain: What Actually Moves the Needle",
    emoji: "🧠",
    desc: "Sleep, exercise, memory technique and food — the boring, well-evidenced things that improve thinking, separated from the supplements that do not.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "Brain",
    metaTitle: "How to Boost Your Brain - What Actually Moves the Needle | SlashAI",
    metaDesc:
      "The evidence-backed ways to improve memory and thinking: sleep, exercise, spaced repetition, focused attention, and the supplements that do not work.",
    summary:
      "Almost every 'brain hack' you have read is unproven. The things that reliably improve memory, attention and judgement are unglamorous: sleep, movement, spaced retrieval, and protecting the hours where you think hardest. This guide covers what works, what is probably a waste of money, and how to build a system that holds up on a normal week.",
    sections: [
      {
        id: "sleep-first",
        heading: "Sleep is the whole foundation",
        blocks: [
          {
            type: "p",
            text: "There is no supplement, app or technique that compensates for chronic short sleep. Sleep is when memory consolidation happens — the day you encode is not the day you learn. On a restricted sleep, everything below works about half as well.",
          },
          {
            type: "list",
            items: [
              "Keep a consistent wake time, including weekends. The wake time anchors everything more than the bedtime does.",
              "Aim for seven to nine hours. If you're consistently getting six, that is the first thing to fix.",
              "Get daylight within an hour of waking — it sets the circadian clock better than any evening routine.",
              "If you nap, keep it under 30 minutes and before mid-afternoon.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "The belief that you can train yourself to function on five hours is a productivity myth that costs people years. It is not a skill; it is accumulated sleep debt.",
          },
        ],
      },
      {
        id: "movement",
        heading: "Movement",
        blocks: [
          {
            type: "p",
            text: "Aerobic exercise has one of the clearest and most consistent effects of anything in this guide. It is not about becoming fit; it is about blood flow, growth factors and the structure of the hippocampus, which is where new memory is formed.",
          },
          {
            type: "list",
            items: [
              "150 minutes a week of moderate activity — about 30 minutes, five days — is where the evidence sits.",
              "Resistance training twice a week helps independently and supports the aerobic work.",
              "The most common finding is that a single session improves cognition for hours afterwards. Walk before you work, not after.",
              "Breaking up long sitting matters more than the total. Standing every 30–60 minutes genuinely helps.",
            ],
          },
        ],
      },
      {
        id: "memory",
        heading: "Memory is a technique, not a talent",
        blocks: [
          {
            type: "p",
            text: "People with 'good memory' almost always have the same habit: they retrieve information instead of re-reading it. Re-reading feels like learning and produces almost nothing.",
          },
          {
            type: "list",
            items: [
              "Active recall: close the book and write down everything you remember. The gap is your actual knowledge; the gap is what to study.",
              "Spaced repetition: review at 1 day, 3, 7, 14, then monthly. Timing matters more than volume.",
              "Interleaving: mix topics instead of blocking them. It feels harder and it is measurably better for long-term retention.",
              "Elaborate: connect new material to something you already know. Unconnected facts stay unconnected.",
            ],
          },
        ],
      },
      {
        id: "attention",
        heading: "Protect attention, because attention is the bottleneck",
        blocks: [
          {
            type: "list",
            items: [
              "Every notification switch fragments attention, and recovery after a switch takes minutes, not seconds.",
              "One task, one screen. If a second screen is genuinely needed, close the first one.",
              "Do the hardest thinking when your energy peaks, not when you get to it. Most people do it at 4pm because that's when they were free.",
              "Protect two uninterrupted blocks a day. Two is genuinely achievable; six is a fantasy that produces none.",
              "Write things down immediately. An unfinished thought in your head keeps chewing at working memory all day.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Attention is not a personality trait, it is a muscle that fatigues and recovers. The most important thing you can do for your thinking is decide when you are allowed to think.",
          },
        ],
      },
      {
        id: "myths",
        heading: "What's probably a waste of money",
        blocks: [
          {
            type: "list",
            items: [
              "Most nootropic supplements have evidence for a fraction of what the marketing implies. Effects are usually smaller than the placebo effect that measures them.",
              "'Brain food' marketing attaches familiar nutrients to generic pills. Eating the food works better and costs less.",
              "Memory palace techniques genuinely work — but so does plain spaced repetition, which requires no imagery gymnastics.",
              "Subliminal anything, and most '10% of your brain' claims.",
            ],
          },
          {
            type: "p",
            text: "A better question than 'what supplement should I take' is 'which of the four foundations am I actually failing at' — sleep, movement, spaced retrieval, or attention. Fix the one that's broken before spending on anything.",
          },
        ],
      },
    ],
  },
  {
    slug: "sharpen-your-thinking-critical-thinking-guide",
    title: "How to Sharpen Your Thinking: A Practical Guide",
    emoji: "🧩",
    desc: "Separate signal from noise, check your own reasoning, spot bad arguments, and make better decisions with less information.",
    date: "26 Sep 2026",
    readTime: "8 min read",
    tag: "Brain",
    metaTitle: "How to Sharpen Your Thinking - A Practical Guide | SlashAI",
    metaDesc:
      "Practical critical thinking: check your own reasoning, spot weak arguments, separate correlation from causation, and decide with incomplete information.",
    summary:
      "Thinking clearly is a set of checkable habits, not an intelligence trait. This guide covers the moves that reliably improve judgement: steelmanning the other side, looking for disconfirming evidence, separating correlation from causation, knowing when the base rate matters more than the story, and how to actually make a decision when you will never have complete information.",
    sections: [
      {
        id: "first-move",
        heading: "The first move: state it in one sentence",
        blocks: [
          {
            type: "p",
            text: "Most bad thinking starts as a vague cloud. Before analysing anything, write down in one plain sentence what you actually believe and why. If you cannot, you do not yet have a position — you have a mood.",
          },
          {
            type: "code",
            lang: "example",
            text: 'Vague:     "AI is taking over everything."\nSpecific:  "I think AI will reduce entry-level writing and\n            design work by more than half within five years,\n            because the entry tasks are the most automatable."\n\nNow it can be argued with. The vague version could not.',
          },
        ],
      },
      {
        id: "steelman",
        heading: "Argue the other side properly",
        blocks: [
          {
            type: "p",
            text: "The fastest way to a bad decision is a private debate where you play both parts badly — a weak case for the other side is not a test, it is a formality.",
          },
          {
            type: "list",
            items: [
              "State the opposing view in its strongest, most sympathetic form. Not a strawman.",
              "Then ask: what is the best explanation for why someone smart holds it?",
              "If you cannot state it well, you have not understood the disagreement, and your confidence is unjustified.",
              "Change your mind cheaply. If new evidence flips you, that is a sign you were thinking, not that you were weak.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "The people with the worst calibrated thinking are usually the most confident, not the least. Confidence is not a measure of correctness — it is a measure of how quickly the words come out.",
          },
        ],
      },
      {
        id: "evidence",
        heading: "Check the evidence before the conclusion",
        blocks: [
          {
            type: "list",
            items: [
              "Correlation is not cause. Ice cream sales and drownings move together because summer moves both.",
              "Check the base rate. '90% success rate' from 10 trials means something very different from 10,000.",
              "Look for the comparison group. If the claim only reports the good case, there is no finding.",
              "Who benefits if this is true? Follow the incentive when the evidence is thin.",
              "A dramatic single example is almost always less informative than a boring dataset.",
            ],
          },
        ],
      },
      {
        id: "bias",
        heading: "The biases that actually cost you",
        blocks: [
          {
            type: "list",
            items: [
              "Confirmation bias: you notice evidence for what you already believe and dismiss evidence against it. The fix is to actively look for the strongest case against your position.",
              "Anchoring: the first number or option you see sticks. Ask what the alternative reference point would be.",
              "Sunk cost: continuing because you've already invested, not because the future is good. Ask: if I were starting now, would I do this?",
              "Loss aversion: a 100-point loss feels worse than a 100-point gain feels good, so you take bad trades to avoid admitting one.",
              "Recency: the last thing that happened feels like the pattern. Five data points from last month is not a trend.",
              "Survivorship bias: you only see the people who made it. The thousands who tried the same thing and failed are invisible.",
            ],
          },
        ],
      },
      {
        id: "decide",
        heading: "How to decide without complete information",
        blocks: [
          {
            type: "p",
            text: "You will almost never have enough information, and waiting for it is usually the more expensive error. These are the moves that help under uncertainty.",
          },
          {
            type: "list",
            items: [
              "Separate the reversible from the irreversible. Test cheaply where you can; deliberate where you can't undo.",
              "Ask what you'd need to be true for this to work, then check whether it is. Often the assumption is the whole decision.",
              "Set a decision date in advance. New information is always available and is the most common reason a decision is never made.",
              "Write down the expected outcome before you commit. Comparing it to reality afterwards is the only way your judgement calibrates.",
              "If two options are close, they're close. Pick one, and stop relitigating.",
            ],
          },
        ],
      },
      {
        id: "commands",
        heading: "Commands that pressure-test a thought",
        blocks: [
          {
            type: "prompts",
            promptIds: [
              "compareoptions",
              "critiquepitch",
              "rootcausepitch",
              "factchecktopic",
              "swotpitch",
            ],
          },
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
