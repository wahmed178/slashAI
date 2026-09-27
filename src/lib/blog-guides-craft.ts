/**
 * SlashAI Blog — guides on AI craft: commands, prompting, notes, study and images.
 *
 * Composed into `ALL_BLOG_POSTS` by `lib/blog-guides`. Every slug in a `tools`
 * block is a real SlashKits or declarative tool.
 */

import type { BlogPost } from "@/lib/blogs";

export const CRAFT_GUIDES: BlogPost[] = [
  {
    slug: "what-are-slash-commands-and-why-they-work",
    title: "What Are Slash Commands, and Why Do They Work So Well?",
    emoji: "⚡",
    desc: "The idea behind reusable AI commands, why a named prompt beats a blank box, and how a small personal library compounds.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Slash Commands",
    metaTitle: "What Are Slash Commands and Why Do They Work? | SlashAI",
    metaDesc:
      "Why reusable named AI commands beat retyping prompts, how a personal command library compounds, and what makes a command worth saving.",
    summary:
      "A slash command is just a saved prompt with a name. That sounds trivial, and the reason it works is exactly that it is trivial — it removes the blank page, which is where most prompting effort is actually lost. This guide explains why naming and storing prompts beats retyping them, what makes a command worth saving, and how a personal library compounds over a few months.",
    sections: [
      {
        id: "idea",
        heading: "The idea, stripped down",
        blocks: [
          {
            type: "p",
            text: "You write a prompt that works. A week later you need it again and you cannot remember how you phrased it, so you rebuild it from scratch and get a worse result. A slash command is that prompt, saved under a stable name you can recall. That is the whole mechanism — and it works because the expensive part of using AI is not typing, it is deciding what to type.",
          },
          {
            type: "list",
            items: [
              "You stop rewriting the same structure. The scaffolding is already written.",
              "Results become consistent, because the input is consistent.",
              "You can improve a command once and every future use benefits.",
              "You can share it, so a teammate gets your version rather than approximating it.",
            ],
          },
        ],
      },
      {
        id: "worth-saving",
        heading: "What is worth saving",
        blocks: [
          {
            type: "list",
            items: [
              "Anything you have typed more than twice. That is the whole threshold.",
              "Anything that took several attempts to get right — the working version is the valuable artefact, not the idea.",
              "Anything with a fixed structure: a report format, a review checklist, a meeting template.",
              "Anything you explain to other people repeatedly.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Do not save one-off questions. A library of thousands of near-identical entries is worse than a library of ten, because searching it costs more than it saves.",
          },
        ],
      },
      {
        id: "design",
        heading: "What makes a good command",
        blocks: [
          {
            type: "list",
            items: [
              "Named after the job, not the tool. 'Weekly report' rather than 'prompt 14'.",
              "Starts with the role and goal, so it works without extra framing.",
              "Has explicit placeholders for the parts that change, so you fill rather than rewrite.",
              "States length and format, because 'summarise' alone is where vague output comes from.",
              "Includes what to avoid, which is often more effective than what to do.",
            ],
          },
          {
            type: "code",
            lang: "command shape",
            text: "/Weekly report\n\nYou are writing a status report for a manager who was not\nin the meetings.\n\nInput: <paste your rough notes>\nInclude: what shipped, what is blocked, what needs a decision\nConstraints: under 200 words, no jargon, plain sentences\nAvoid: padding, restating the org chart, vague future plans",
          },
        ],
      },
      {
        id: "compounds",
        heading: "Why a library compounds",
        blocks: [
          {
            type: "p",
            text: "The value of a command library is not linear. The first ten save a little time. The next fifty save the thinking as well as the typing, because you are choosing from a decision rather than inventing one. And because the commands get better as you refine them, the library quietly becomes a record of how you like work done — which is a genuinely valuable artefact.",
          },
          {
            type: "tools",
            toolSlugs: ["smart-paste", "notes", "one-liner", "quote-maker", "markdown-editor"],
            text: "A paste bin and a scratch notepad are enough to run a whole command workflow in the browser, with no account and nothing sent anywhere.",
          },
        ],
      },
      {
        id: "prompts",
        heading: "Get started with real ones",
        blocks: [
          {
            type: "p",
            text: "These are the most-copied patterns in the SlashAI library — copy one, replace the placeholders, and save it as your own.",
          },
          {
            type: "prompts",
            promptIds: ["summarize", "rewriteemail", "draftemail", "planproject", "checklistday"],
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-write-your-own-ai-commands",
    title: "How to Write Your Own AI Commands",
    emoji: "✍️",
    desc: "A repeatable method for turning a task you do often into a command that works the first time — with a before-and-after example.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Slash Commands",
    metaTitle: "How to Write Your Own AI Commands | SlashAI",
    metaDesc:
      "A repeatable method for turning a repeated task into a reliable AI command: extract the shape, write the four parts, test and refine.",
    summary:
      "You do not need prompt-engineering theory to write a command that works. You need a method: take a task you already do, strip it to its fixed shape, and write four things — role, input, goal, constraints. This guide walks through that method on a real example, and covers the two failure modes that make saved commands feel disappointing.",
    sections: [
      {
        id: "start",
        heading: "Start from a task you already do",
        blocks: [
          {
            type: "p",
            text: "The best command to write is one that already exists in your week. Do not invent a hypothetical. Pick something you did twice this month, and write down what you typed both times — the overlap between the two versions is the command.",
          },
        ],
      },
      {
        id: "method",
        heading: "The four parts",
        blocks: [
          {
            type: "list",
            items: [
              "Role — who the model should be. 'You are a technical editor' changes the output more than any other single line.",
              "Input — where the material comes from, and where the placeholders are.",
              "Goal — what a great result looks like, in enough detail to be checked.",
              "Constraints — length, format, tone, and what to avoid.",
            ],
          },
        ],
      },
      {
        id: "example",
        heading: "A worked before-and-after",
        blocks: [
          {
            type: "code",
            lang: "what people actually type",
            text: "summarise this",
          },
          {
            type: "code",
            lang: "the command",
            text: "/Standup\n\nYou are writing a standup update that a manager reads\nin fifteen seconds.\n\nInput: <paste yesterday's notes and today's blockers>\nOutput exactly three lines, one per line below:\n  Done: <what shipped>\n  Doing: <what is in progress>\n  Blocked: <what is stuck, and on whom — or 'nothing'>\nConstraints: one sentence per line, no preamble, past tense for Done\nAvoid: hedging, filler, anything that would need a follow-up question",
          },
          {
            type: "p",
            text: "The important move is the fixed output shape. 'Three lines, this exact format' removes the most common source of disappointing output, which is the model giving you a well-written paragraph when you needed something you can paste into a box.",
          },
        ],
      },
      {
        id: "failures",
        heading: "The two failure modes",
        blocks: [
          {
            type: "list",
            items: [
              "Too vague, so the model fills the gap with its own idea of what you wanted. Fix it by naming the audience and the format.",
              "Too rigid, so every output is identical and useless. Fix it by stating what should vary and what must not.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "If the result is close but not right, do not rewrite — change one line and re-run. Learning which single line controls which behaviour is the actual skill.",
          },
        ],
      },
      {
        id: "store",
        heading: "Storing them",
        blocks: [
          {
            type: "tools",
            toolSlugs: ["smart-paste", "markdown-editor", "table-generator", "text-stats", "notes"],
            text: "Keep a paste bin for commands you use constantly, and a note for the ones you are still refining. The Markdown editor is a good home for a library, because plain text survives every tool you might move to next.",
          },
        ],
      },
    ],
  },
  {
    slug: "one-word-prompts-and-why-less-is-more",
    title: "One-Word Prompts: What a Single Word Can Trigger",
    emoji: "1️⃣",
    desc: "Why minimal input often works better than a paragraph — the four legitimate uses of one word, and when short prompts fail.",
    date: "27 Sep 2026",
    readTime: "6 min read",
    tag: "Prompts",
    metaTitle: "One-Word Prompts - What a Single Word Can Trigger | SlashAI",
    metaDesc:
      "Why one-word prompts work for continuations, modes, transforms and triggers, and the two cases where minimal input always fails.",
    summary:
      "A single word is not a clever trick — it is a different category of request. 'Continue', 'Rewrite', 'Contrast', 'Shorter' are control words that operate on what is already in the conversation, and they are often more reliable than a long paragraph because they leave the context to do the work. This guide covers the four uses that genuinely work, and the two situations where short prompts always underperform.",
    sections: [
      {
        id: "why",
        heading: "Why one word can be enough",
        blocks: [
          {
            type: "p",
            text: "When you send one word to a model that already has a lot of context, you are not giving it less information — you are giving the same information a different, very clear shape. The model already has the text, the audience, the tone and the topic from the previous turn. The single word is a control instruction, not the whole request.",
          },
        ],
      },
      {
        id: "uses",
        heading: "The four uses that genuinely work",
        blocks: [
          {
            type: "list",
            items: [
              "Continuation — Continue, More, Again. Extends whatever was last produced, preserving voice and format exactly.",
              "Transform — Rewrite, Shorter, Formal, Bullets, Slower. Operates on the last output without restating it.",
              "Contrast — Contrast, But, Counter. Gets the opposing view, which is the fastest way to test your own thinking.",
              "Commit — Ship, Final, Done. The model stops revising and treats the current version as finished.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "This is why keeping a good answer matters more than getting the first one right. The best AI workflows are long conversations with single-word control, not a queue of separate long prompts.",
          },
        ],
      },
      {
        id: "fails",
        heading: "When one word always fails",
        blocks: [
          {
            type: "list",
            items: [
              "Cold start. A bare 'Improve' with nothing before it has nothing to operate on. The first prompt always has to be a sentence.",
              "Ambiguous single nouns. 'Brief' or 'Deck' alone will produce whatever the model assumes, and the assumption is rarely yours.",
              "Anything where the missing context is the hard part. If you have not supplied the audience, the format, or the constraint, no short word can recover it.",
            ],
          },
        ],
      },
      {
        id: "one-word-commands",
        heading: "Named triggers you can build",
        blocks: [
          {
            type: "p",
            text: "The practical version of this idea is a personal vocabulary of trigger words with agreed meanings. Once 'Tighten' always means cut 20% and drop hedges, and 'Steelman' always means argue the other side, you can run a whole session in single words and it stays consistent.",
          },
          {
            type: "tools",
            toolSlugs: ["notes", "smart-paste", "word-frequency", "one-liner", "word-cloud"],
            text: "Keep the trigger list in a note so it is identical every session — the consistency is what makes single words worth using at all.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-take-smart-notes-that-you-actually-read",
    title: "How to Take Notes You Will Actually Read Again",
    emoji: "🗒️",
    desc: "Why most note-taking fails, and a capture-to-review system that produces notes worth keeping — with free browser tools for each step.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Notes",
    metaTitle: "How to Take Notes You Will Actually Read Again | SlashAI",
    metaDesc:
      "A working note-taking system: capture fast, structure once, review on a schedule, and the free tools that do each step.",
    summary:
      "The problem with most notes is not the tool, it is that notes are treated as a destination rather than a step. You write them during the meeting, feel productive, and never open them again. This guide describes a system that ends with notes being used: capture without thinking, structure once afterwards, and a review loop that forces them back in front of you.",
    sections: [
      {
        id: "why-fail",
        heading: "Why most notes fail",
        blocks: [
          {
            type: "p",
            text: "Transcription is not note-taking. A wall of text written during a meeting preserves the sequence of what was said and almost none of why it mattered. The notes you will actually reuse are the ones you wrote after the meeting, when you knew what the important part was.",
          },
          {
            type: "list",
            items: [
              "Capturing during the meeting slows the meeting and captures the wrong things — logistics, not decisions.",
              "Never revisiting means the notes are a record of a moment, not a resource.",
              "Organising as you capture is the classic trap: it turns a five-minute job into a thirty-minute job and you stop doing it.",
            ],
          },
        ],
      },
      {
        id: "system",
        heading: "A system that survives a real week",
        blocks: [
          {
            type: "list",
            items: [
              "Capture raw and fast. One note per thing, no formatting, no filing. Friction at this step kills the habit.",
              "Process once, in a batch, later in the day. Highlight the two or three things that would matter if you were asked a month from now.",
              "Write those up in your own words. If you cannot restate it, you did not understand it — that is the real test of a note.",
              "Attach a next action to anything with a task in it. An un-actioned note is a guilt item.",
              "Review on a schedule. Weekly, ten minutes, and the only question is: which of these is now actionable or now wrong?",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "The single highest-value question when reviewing is 'what would I do differently knowing this?'. It converts a record into a lesson.",
          },
        ],
      },
      {
        id: "shapes",
        heading: "Shapes worth having",
        blocks: [
          {
            type: "list",
            items: [
              "Outline — hierarchical, best for anything with structure: a book, a course, a project.",
              "Cornell — notes in one column, questions in another, summary at the bottom. Best for lectures and reading.",
              "Zettelkasten — one idea per note, linked. Overkill for most people, excellent once you have thousands of notes.",
              "Plain dated log — chronological, no structure. Surprisingly effective, because it never has an organisation problem.",
            ],
          },
        ],
      },
      {
        id: "tools",
        heading: "Tools for each step",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "notes",
              "smart-paste",
              "mind-map",
              "flashcard-maker",
              "speech-to-text",
              "screenshot",
            ],
            text: "Capture, structure, review and turn into something you can actually test yourself on — all in the browser, none of it needing an account.",
          },
        ],
      },
      {
        id: "prompts",
        heading: "Commands for the processing step",
        blocks: [
          {
            type: "prompts",
            promptIds: [
              "summarize",
              "compareoptions",
              "checklistproject",
              "planproject",
              "flashcardsconcept",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "handwritten-notes-that-people-can-read",
    title: "Handwritten Notes: How to Write Them, Scan Them and Send Them",
    emoji: "✍️",
    desc: "How to write notes people can actually read, turn paper into clean digital files, and send handwritten-looking notes without a scanner.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Notes",
    metaTitle: "Handwritten Notes - Write, Scan and Send Them | SlashAI",
    metaDesc:
      "How to write legible handwritten notes, scan paper into clean PDFs, and send handwritten notes digitally. Free browser tools inside.",
    summary:
      "Handwriting still carries more authority and warmth than a typed message, which is why people keep paying for handwriting tools. This guide covers the two practical problems — writing notes people can read, and getting paper into a clean digital file — and shows how to do both, including sending handwritten notes to someone who is nowhere near a printer.",
    sections: [
      {
        id: "why",
        heading: "Why handwriting still matters",
        blocks: [
          {
            type: "p",
            text: "A handwritten note reads as effort, which reads as care. That is why a physical thank-you note works differently from a typed one, and why a signed page is treated as more committed than a printout. None of that is sentimentality — it is a real signal that survives in a digital inbox.",
          },
        ],
      },
      {
        id: "legible",
        heading: "Writing notes people can read",
        blocks: [
          {
            type: "list",
            items: [
              "Size beats elegance. If your handwriting is small to fit more in, halve the amount you write instead.",
              "Leave a margin. Notes without space for annotations become unusable the moment someone has a question.",
              "Headings and white space cost nothing and do more for readability than neater letters.",
              "One idea per line or per block. Long unbroken paragraphs are the main reason handwriting looks messy.",
              "Underline sparingly — the moment everything is underlined, nothing is.",
              "Write dates and names. Undated handwriting is unsortable, which is a quiet way of losing it.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "If you want genuinely neat handwriting without practice, generating it digitally is usually the faster answer — the tool below produces a real handwritten look you can send to anyone.",
          },
        ],
      },
      {
        id: "scanning",
        heading: "Turning paper into something usable",
        blocks: [
          {
            type: "list",
            items: [
              "Photograph straight down, in even light. A raking angle is the reason scans look crooked.",
              "Crop before you enhance. Deskewing a crooked photo wastes the enhancement step.",
              "Photograph against a plain background if the paper is thin, or the reverse side shows through.",
              "Combine multiple pages into one PDF rather than sending eleven attachments.",
              "Keep the original photo. Enhancement tools are lossy and you may want to start again.",
            ],
          },
        ],
      },
      {
        id: "tools",
        heading: "Do all of it in your browser",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "text-to-handwriting",
              "scanner",
              "whiteboard",
              "notes",
              "images-to-pdf",
              "pdf-merge",
              "image-compress",
            ],
            text: "Write it, scan it, merge it and shrink it — without uploading a page of someone's handwriting to a server you did not choose.",
          },
        ],
      },
      {
        id: "prompts",
        heading: "Commands that pair with it",
        blocks: [
          {
            type: "prompts",
            promptIds: [
              "summarizehandwritten",
              "ocrhandwritten",
              "extracthandwritten",
              "tabulatehandwritten",
              "redacthandwritten",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-for-students-that-actually-helps",
    title: "Using AI as a Student (Without Learning Nothing)",
    emoji: "🎓",
    desc: "Where AI genuinely helps with studying, where it quietly prevents learning, and a study loop that keeps you honest.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Learning",
    metaTitle: "Using AI as a Student Without Learning Nothing | SlashAI",
    metaDesc:
      "Where AI genuinely helps with revision, where it prevents learning, and a study loop that keeps you honest. Free tools inside.",
    summary:
      "Used badly, AI is a machine for avoiding the hard part of studying — retrieving facts feels like learning and isn't. Used well, it is the most patient tutor available: unlimited questions at any hour, instant feedback, and exercises generated to your weak spot. This guide separates the two, and gives you a study loop that keeps the productive version.",
    sections: [
      {
        id: "honest",
        heading: "The honest part",
        blocks: [
          {
            type: "p",
            text: "Reading a summary someone else wrote feels exactly like understanding, and the feeling is not the thing. If you can read a clean explanation and never had to struggle, you have not learned the material — you have recognised it. Recognition is a trap, and it is the reason students can read about a topic for hours and still fail the exam.",
          },
          {
            type: "callout",
            tone: "warn",
            text: "The single reliable test: close everything and explain it out loud from memory. Whatever you cannot explain is what you have not learned, regardless of how much you have read or asked.",
          },
        ],
      },
      {
        id: "helps",
        heading: "Where it genuinely helps",
        blocks: [
          {
            type: "list",
            items: [
              "Explaining the same thing five different ways until one lands. This is the single best use and it is available at 2am.",
              "Generating practice questions on your weakest topic, which is exactly what a textbook cannot do for you.",
              "Feedback on work you have already attempted. Submit your answer first, then compare — never the other way round.",
              "Flashcards, summaries and self-tests generated from your own notes, which is far more effective than generic decks.",
              "Checking understanding by having it quiz you, then arguing back when it is wrong.",
              "Working out why you got a question wrong, rather than just being told the answer.",
            ],
          },
        ],
      },
      {
        id: "loop",
        heading: "A study loop that works",
        blocks: [
          {
            type: "list",
            items: [
              "Attempt first. Always. Before you ask anything, write your own answer.",
              "Then ask the specific question your attempt raised. 'Why does the equilibrium shift here' rather than 'explain this chapter'.",
              "Close it and redo the problem from scratch. If you cannot, you have not learned it yet.",
              "Space the review: day 1, day 3, day 7, day 14. Cramming produces familiarity, not retention.",
              "Test yourself on a blank page every few sessions. It feels awful and it is the only reliable check.",
            ],
          },
        ],
      },
      {
        id: "tools",
        heading: "Free tools for the loop",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "flashcard-maker",
              "quiz-maker",
              "spelling",
              "word-frequency",
              "table",
              "text-to-speech",
              "readability",
            ],
            text: "Build the deck, generate the test, check the writing, and hear it read back — all offline in the browser, so nothing about your coursework leaves the device.",
          },
        ],
      },
      {
        id: "prompts",
        heading: "Commands for study",
        blocks: [
          {
            type: "prompts",
            promptIds: [
              "teachexam",
              "flashcardsexam",
              "quizcourse",
              "practicecourse",
              "mistakescourse",
              "eli5course",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-for-images-and-photos",
    title: "Using AI and Free Tools on Images and Photos",
    emoji: "🖼️",
    desc: "What AI is genuinely useful for in images, and the free browser tools for compression, conversion, palettes, watermarks and resizing.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Images",
    metaTitle: "Using AI and Free Tools on Images and Photos | SlashAI",
    metaDesc:
      "What AI is actually useful for in images, plus free in-browser tools for compression, conversion, colour palettes, watermarks and social resizing.",
    summary:
      "For most people's image work, the useful AI features are generation and editing, but the everyday needs are unglamorous: make it smaller, change its format, get a matching colour palette, put your name on it, and size it for each platform. This guide covers both — what AI is genuinely good at, and the free tools that handle the repetitive half.",
    sections: [
      {
        id: "ai-good",
        heading: "What AI is actually good at with images",
        blocks: [
          {
            type: "list",
            items: [
              "Generating images from a description, when you need something that does not exist yet.",
              "Editing by instruction: remove an object, change the background, alter the lighting.",
              "Upscaling a small or degraded image. The invented detail will not match the original exactly — treat it as a plausible reconstruction, not a recovery.",
              "Turning a rough sketch or text description into a real image.",
              "Generating variations to explore a direction cheaply before committing to one.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Check the licensing terms of whatever generator you use, especially for anything commercial. 'Free to make' and 'free to sell' are not the same, and this catches people out after publication rather than before.",
          },
        ],
      },
      {
        id: "everyday",
        heading: "The unglamorous half, which is most of the work",
        blocks: [
          {
            type: "list",
            items: [
              "Compression — the single highest-value action for page speed, and most images are 3–5× larger than they need to be.",
              "Format conversion, when a platform rejects a file for the wrong format or size.",
              "Resizing per platform, so you are not uploading a 4000px photo to a feed that crops it.",
              "Palette extraction from an existing image, so your brand colours match the thing you designed.",
              "Watermarking, before you post anything publicly.",
              "Capturing code and designs as clean images for documentation or social posts.",
            ],
          },
        ],
      },
      {
        id: "workflow",
        heading: "A sensible order of operations",
        blocks: [
          {
            type: "list",
            items: [
              "Generate or edit first, at full quality. Every subsequent step is lossy.",
              "Then crop and resize to the destination.",
              "Then compress. Compressing before resizing wastes the effort on pixels you are about to delete.",
              "Add the watermark last, after all resizing, so it is not itself compressed into mush.",
              "Check the total file size before uploading; most upload failures are size, not format.",
            ],
          },
          {
            type: "tools",
            toolSlugs: [
              "image-compress",
              "image-convert",
              "color-palette",
              "watermark",
              "social-resize",
              "code-screenshot",
              "aspect",
            ],
            text: "Every one of these runs in your browser, so a client photo or an unreleased design never gets uploaded to a server you did not choose.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-write-better-anyone-can-check",
    title: "How to Write Better: Seven Checks Anyone Can Do",
    emoji: "🖊️",
    desc: "Concrete, mechanical ways to write more clearly — cutting hedges, testing readability, and the edits that make text land.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Writing",
    metaTitle: "How to Write Better - Seven Concrete Checks | SlashAI",
    metaDesc:
      "Mechanical, checkable ways to write more clearly: cutting hedges, measuring readability, and the specific edits that make writing land.",
    summary:
      "'Write better' is useless advice, because it is not actionable. But most of what makes writing clear is mechanical and measurable: how often you hedge, how long your sentences run, how many words sit between commas, and whether the first sentence says anything. This guide gives you seven checks you can run in minutes on anything you have written.",
    sections: [
      {
        id: "premise",
        heading: "Start with the one thing you want them to know",
        blocks: [
          {
            type: "p",
            text: "Most unclear writing is unclear because the writer is not sure what the point is, and the reader can tell. Before editing anything, write the single sentence you want someone to remember. If you cannot, the draft is not ready to edit — it needs a decision first. Then check the first paragraph actually contains that sentence, ideally in the first line.",
          },
        ],
      },
      {
        id: "checks",
        heading: "Seven checks",
        blocks: [
          {
            type: "list",
            items: [
              "Cut the hedges. 'It could potentially be argued that perhaps' says nothing. Replace with the real claim or delete it.",
              "One idea per sentence. If a sentence has two 'and's, split it and see whether the reader is faster.",
              "Prefer the concrete noun and the real verb. 'Made a decision' is weaker than 'chose'.",
              "Delete 'very', 'really', 'quite', 'basically' and 'actually'. They cost words and add nothing.",
              "Move the qualifier to the front. 'The meeting, which ran long, ended at four' becomes 'The four-hour meeting ended at four'.",
              "Read the first sentence of every paragraph alone. If it says nothing, the paragraph may not need to exist.",
              "Read it out loud. Your ear catches run-ons and repeated words that your eye slides over.",
            ],
          },
        ],
      },
      {
        id: "measure",
        heading: "What you can measure",
        blocks: [
          {
            type: "p",
            text: "Some things about writing are checkable rather than matters of taste, which makes them easy to improve. Sentence length, word frequency, reading level and total count are all measurable, and all of them correlate with whether a piece gets finished.",
          },
          {
            type: "list",
            items: [
              "Average sentence length: 15–20 words is a reasonable target for general writing. Above 25, readers start dropping clauses.",
              "Hedge frequency: count 'might', 'could', 'perhaps', 'somewhat'. More than one per paragraph and the writing sounds unconfident.",
              "Passive voice: fine occasionally, but a paragraph of it hides who did what.",
              "Reading level: for most audiences, plain is better. Complexity is only a virtue when the content genuinely requires it.",
            ],
          },
          {
            type: "tools",
            toolSlugs: [
              "readability",
              "word-frequency",
              "text-stats",
              "spelling",
              "word-counter",
              "reading-time",
              "text-case",
            ],
            text: "Measure the draft before you send it. The word-frequency view in particular makes repeated vocabulary obvious in a way your eye misses.",
          },
        ],
      },
      {
        id: "prompts",
        heading: "Commands for a revision pass",
        blocks: [
          {
            type: "prompts",
            promptIds: [
              "proofreadessay",
              "simplifyessay",
              "rewriteessay",
              "toneessay",
              "headlineessay",
            ],
          },
        ],
      },
    ],
  },
];
