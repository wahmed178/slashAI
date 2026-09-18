/**
 * SlashAI Blog Articles — authentic, evergreen technical guides and copy-ready prompt collections.
 * Client-side rendered, zero external APIs, zero placeholders.
 */

export interface BlogBlock {
  type: "p" | "h" | "list" | "code" | "callout" | "prompts";
  text?: string;
  items?: string[];
  lang?: string;
  tone?: "tip" | "warn";
  promptIds?: string[];
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
    metaDesc: "10 free copy-ready AI prompts for Indian professionals: emails, meeting notes, reports, resumes and appraisals. Works in free ChatGPT, Gemini and Claude. No account needed.",
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
    metaDesc: "Master prompt chaining: learn why single-shot prompts hallucinate, how to pipe JSON schemas between steps, and how to implement automated error-correction loops.",
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
    metaDesc: "How senior developers use AI in 2026: zero-leak local tools, context packing techniques, test-driven validation, and avoiding hallucinated dependencies.",
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
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
