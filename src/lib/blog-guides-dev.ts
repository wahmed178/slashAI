/**
 * SlashAI Blog — developer, AI and tooling guides.
 *
 * Composed into `ALL_BLOG_POSTS` by `lib/blog-guides`. Each post is real,
 * evergreen and specific; every slug in a `tools` block is a real SlashKits
 * or declarative tool (resolved in `routes/blog.$slug.tsx`).
 */

import type { BlogPost } from "@/lib/blogs";

export const DEV_GUIDES: BlogPost[] = [
  {
    slug: "git-and-github-explained",
    title: "Git and GitHub, Explained for People Who Aren't Developers",
    emoji: "🐙",
    desc: "What version control actually is, the six commands you need, and what to do when you break something — without the jargon.",
    date: "27 Sep 2026",
    readTime: "9 min read",
    tag: "GitHub",
    metaTitle: "Git and GitHub Explained for Non-Developers | SlashAI",
    metaDesc:
      "What version control is, the six Git commands you actually need, how to fix a mistake, and how GitHub differs from Git. Plain English, no jargon.",
    summary:
      "Git is not a backup tool and it is not GitHub. It is a system for recording changes so you can undo anything, try something risky, and work on two things at once. This guide explains the mental model in ten minutes, then gives you the six commands that cover almost everything, plus what to do when something goes wrong.",
    sections: [
      {
        id: "the-model",
        heading: "The whole idea in one paragraph",
        blocks: [
          {
            type: "p",
            text: "Your project is a folder of files. Git keeps a complete history of that folder — not just the current version, but every version you have ever committed, with who made the change, when, and why. That single property is what gives you undo, safe experimentation, blame, and collaboration. GitHub is a website that hosts those histories and adds review tools on top. You can use Git without GitHub; you almost certainly want both.",
          },
          {
            type: "list",
            items: [
              "Repository (repo) — one project folder plus its entire history.",
              "Commit — a saved snapshot with a message explaining what changed and why.",
              "Branch — a safe copy of the project to experiment on, so your working version stays clean.",
              "Merge — taking the finished work from a branch back into the main one.",
              "Remote — the copy of your history living on GitHub.",
            ],
          },
        ],
      },
      {
        id: "cycle",
        heading: "The loop you will use every day",
        blocks: [
          {
            type: "p",
            text: "Nearly all Git work is the same four steps: check what changed, stage the files you want, commit them with a message, and push them to GitHub.",
          },
          {
            type: "code",
            lang: "bash",
            text: 'git status              # what has changed?\ngit add .                 # stage everything\ngit commit -m "why I changed it"\ngit push                  # send it to GitHub',
          },
          {
            type: "callout",
            tone: "tip",
            text: "The commit message matters more than you think. Six months from now, 'fixed it' is useless; 'stop crash when config is missing' tells you exactly what happened.",
          },
        ],
      },
      {
        id: "safe",
        heading: "Branches: the reason Git is worth learning",
        blocks: [
          {
            type: "p",
            text: "A branch is a parallel timeline. Create one before touching anything, do the work, and merge it back when it works. If it goes wrong you delete the branch and nothing happened. This is what removes the fear of experimenting, and it is genuinely the feature worth learning first.",
          },
          {
            type: "code",
            lang: "bash",
            text: "git switch -c my-change   # create and move to a branch\ngit switch main            # go back to main\ngit switch -d my-change    # delete it when you're done",
          },
        ],
      },
      {
        id: "undo",
        heading: "Fixing mistakes",
        blocks: [
          {
            type: "list",
            items: [
              "Uncommitted changes you want to discard — `git restore .` (throws the edits away; there is no undo).",
              "A commit you want to change — `git commit --amend` to fix the message or add a forgotten file.",
              "A commit already pushed — don't rewrite shared history. Add a new commit that reverses it.",
              "A file you deleted by accident — `git restore <file>` brings it straight back.",
              "Anything you are not sure about — stop. `git status` is always safe and always tells you where you are.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "There is one genuinely unrecoverable Git mistake: `git push --force` over a shared branch, which can delete other people's commits. Use `--force-with-lease` instead, which refuses if someone else has pushed since you last checked.",
          },
        ],
      },
      {
        id: "tools",
        heading: "Tools that pair well with this",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "diff",
              "regex",
              "base64",
              "hash-generator",
              "json-formatter",
              "api-tester",
            ],
            text: "GitHub workflows, webhooks and CI configs are mostly text. These make working with that text far easier — the diff checker is genuinely the one you will use most.",
          },
        ],
      },
    ],
  },
  {
    slug: "termux-turn-your-phone-into-a-dev-machine",
    title: "Termux: Turning an Android Phone Into a Real Dev Machine",
    emoji: "📱",
    desc: "Install, package management, SSH, git and a practical daily setup — plus the limits worth knowing before you start.",
    date: "27 Sep 2026",
    readTime: "9 min read",
    tag: "Termux",
    metaTitle: "Termux - Turn Your Android Phone Into a Dev Machine | SlashAI",
    metaDesc:
      "A practical Termux setup guide: install, package management, SSH, git, a real terminal workflow, and the limits to know about first.",
    summary:
      "Termux turns an Android phone into a genuine Linux terminal with a package manager, an editor, SSH and git. It is free, open source, and genuinely useful — as a learning environment, a rescue kit for a server, and a way to script things when you have no laptop. This guide covers the correct install (the Play Store version is abandoned and will not update), a realistic setup, and the limits you should know before you start.",
    sections: [
      {
        id: "before",
        heading: "Know the limits first",
        blocks: [
          {
            type: "p",
            text: "Termux gives you a real Linux userland, but it runs on Android rather than inside a virtual machine. That means some things work exactly as on a desktop, and some things are blocked or awkward. Know these before you invest an evening.",
          },
          {
            type: "list",
            items: [
              "Storage is scoped. Since Android 11 you cannot read files outside your own Termux folder without a special setup or a file manager that requests access.",
              "No root, no system access. You cannot modify Android itself. This is a feature, not a limitation.",
              "Background processes get killed. Aggressive battery optimisation closes long-running things; exempt Termux from battery optimisation in Android settings.",
              "Termux:API is a separate app if you want to reach the camera, clipboard or SMS from the shell.",
              "Hardware acceleration is absent — no GPU compute, and CPU-heavy builds will be slow, though still faster than people expect.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Install Termux from F-Droid or the Termux GitHub releases. The version on the Play Store has been unmaintained since 2020 and its package repository no longer resolves, so `pkg update` will fail on it.",
          },
        ],
      },
      {
        id: "install",
        heading: "Install and first steps",
        blocks: [
          {
            type: "p",
            text: "Install from F-Droid, open it once, and let it finish bootstrapping. Then update everything before installing anything else — the base image ships months behind.",
          },
          {
            type: "code",
            lang: "bash",
            text: "pkg update && pkg upgrade\npkg install git openssh python nodejs-lts vim\ntermux-setup-storage        # grant access to your shared folders",
          },
          {
            type: "list",
            items: [
              "Termux:API from F-Droid as well — install it before you try to use any of the API commands.",
              "Use the on-screen keyboard's Ctrl key for things like Ctrl+C. On a soft keyboard, a long-press on the key row usually reveals it.",
              "Consider a Bluetooth or USB keyboard. Above roughly 80 columns you will not be able to see your own commands, which makes reading errors genuinely painful.",
              "Use a monospace font in the terminal settings, or nothing lines up and errors become unreadable.",
            ],
          },
        ],
      },
      {
        id: "ssh",
        heading: "The genuinely useful part: SSH into your own machines",
        blocks: [
          {
            type: "p",
            text: "This is where Termux stops being a toy. With SSH you can keep a real server as the machine that matters and use the phone as a proper terminal — which means you can fix a server from a train.",
          },
          {
            type: "code",
            lang: "bash",
            text: '# generate a key, then copy the public half to your server\nssh-keygen -t ed25519 -C "phone"\ncat ~/.ssh/id_ed25519.pub\n# on the server, paste it into ~/.ssh/authorized_keys\nssh user@your-server',
          },
          {
            type: "p",
            text: "Add a host alias in ~/.ssh/config so you do not have to type the full address, and set up key forwarding so git over SSH works from the phone too.",
          },
        ],
      },
      {
        id: "daily",
        heading: "A setup that holds up",
        blocks: [
          {
            type: "list",
            items: [
              "Put your dotfiles in a git repo. Every Termux reinstall otherwise means redoing everything from memory.",
              "Sync a password manager so you are never typing long passwords on a phone keyboard.",
              "Keep a notes file with the exact commands you run often — typing them on a phone is slow and error-prone.",
              "Set up a QR code for your Wi-Fi so the phone can rejoin a network without typing a long password.",
              "Exclude Termux from battery optimisation, or long scripts die halfway through.",
            ],
          },
          {
            type: "tools",
            toolSlugs: [
              "notes",
              "wifi-qr",
              "qr-code",
              "hash-generator",
              "password-gen",
              "timestamp",
            ],
            text: "These all run in your browser, so they work on the same phone without needing a server or an account — handy when you are setting Termux up over mobile data.",
          },
        ],
      },
      {
        id: "limits",
        heading: "What it is genuinely good for",
        blocks: [
          {
            type: "list",
            items: [
              "Learning the shell and Linux properly, with real consequences for your mistakes.",
              "Emergency access to your own servers when a laptop is not available.",
              "Scripting, cron jobs and scheduled tasks that do not need a laptop awake.",
              "Running lightweight bots, scrapers and webhooks on a machine already in your pocket.",
              "Reading logs and restarting services without a second device.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "It is a poor substitute for a laptop for heavy builds, large IDEs or anything needing a real keyboard. Use it as the always-available small machine, not the only one.",
          },
        ],
      },
    ],
  },
  {
    slug: "openai-codex-coding-agent-guide",
    title: "Using Codex and AI Coding Agents Without Losing Control",
    emoji: "🧑‍💻",
    desc: "How terminal coding agents like Codex actually work, how to set them up safely, and the review habits that keep you in charge of the code.",
    date: "27 Sep 2026",
    readTime: "9 min read",
    tag: "Codex",
    metaTitle: "Using Codex and AI Coding Agents Without Losing Control | SlashAI",
    metaDesc:
      "How terminal coding agents like OpenAI Codex work: setup, sandboxing, the review loop that keeps you in charge, and when to reach for one.",
    summary:
      "An AI coding agent is not autocomplete. It reads your repository, plans a change, edits files, runs commands and reports back — on its own, in a loop. That is a genuinely different thing from asking a chatbot for a function, and it needs a different set of habits. This guide covers what these agents actually do, how to set one up safely, and the review discipline that keeps you responsible for every line it writes.",
    sections: [
      {
        id: "what",
        heading: "What makes it an agent, not a chatbot",
        blocks: [
          {
            type: "p",
            text: "OpenAI's Codex is a coding agent you run in your terminal; there are equivalents from several vendors. The defining difference is not the model — it is the loop. The agent can read files, write files, run shell commands, observe the results, and try again. It is given a goal and it works until it either succeeds or gets stuck.",
          },
          {
            type: "list",
            items: [
              "It reads your actual repository rather than a snippet you pasted.",
              "It runs your tests, sees them fail, and fixes the failure itself.",
              "It executes commands — which is exactly why sandboxing matters.",
              "It works in a diff you can read before it goes anywhere near your main branch.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Treat the agent as a capable new hire who is very fast, very literal, and has never seen your codebase before. That metaphor gets the review habits right.",
          },
        ],
      },
      {
        id: "setup",
        heading: "Setting one up, safely",
        blocks: [
          {
            type: "list",
            items: [
              "Always work on a branch. The agent should never be pointed at main.",
              "Keep sandboxing on. These tools run shell commands; network and filesystem restrictions are a real safety net, not ceremony.",
              "Start with a scoped task — one function, one file, one bug — not 'refactor the project'.",
              "Review the diff line by line before merging. The agent will be confident and occasionally wrong.",
              "Keep your own tests. The agent that can see assertions writes dramatically better code, and it catches itself when they fail.",
            ],
          },
        ],
      },
      {
        id: "prompting",
        heading: "How to brief it well",
        blocks: [
          {
            type: "p",
            text: "An agent has your repository but not your intent. The brief carries the intent, so vagueness costs iterations.",
          },
          {
            type: "list",
            items: [
              "State the goal and the acceptance criteria. 'Tests pass and the function returns sorted results' beats 'fix the sorting'.",
              "Point it at the types and interfaces, not just the function. Types are the contract.",
              "Name the constraints: framework version, the libraries you are allowed to use, the style already in the file.",
              "Ask for a plan first on anything non-trivial, then approve before it writes code.",
              "Tell it not to touch unrelated files. Scope drift is the most common failure mode.",
            ],
          },
          {
            type: "code",
            lang: "brief",
            text: "Goal: the parseDate function in src/lib/dates.ts fails on \"2026-13-01\".\nAccept: it returns null instead of NaN, and there's a test for it.\nConstraints: TypeScript, no new dependencies, match the file's existing style.\nDo not modify any file other than src/lib/dates.ts and its test.",
          },
        ],
      },
      {
        id: "limits",
        heading: "Where it genuinely helps, and where it does not",
        blocks: [
          {
            type: "list",
            items: [
              "Boilerplate, tests, type definitions, and migrations — it is excellent at work that is tedious but well-specified.",
              "Bugs with a clear reproduction and an obvious failing case.",
              "Getting oriented in an unfamiliar codebase: 'explain what this module does and where the entry point is'.",
              "Mechanical refactors across many files with a consistent pattern.",
              "Architecture, security review, and anything where the right answer is a judgement about your specific constraints. It will produce a confident guess.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "It is confidently wrong about APIs it does not know and about anything in your codebase it has not read. Verify anything that touches security, money, or data deletion.",
          },
        ],
      },
      {
        id: "prompts",
        heading: "Commands for the non-coding half of the job",
        blocks: [
          {
            type: "tools",
            toolSlugs: ["code-screenshot", "json-formatter", "regex", "api-tester", "diff"],
            text: "Reading and checking code is half the work: format the JSON payloads it complains about, test the regex it proposed, and capture the result as an image for a PR or a bug report.",
          },
          {
            type: "prompts",
            promptIds: ["codereview", "refactorfunction", "testfunction", "refactorcomponent"],
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-contribute-to-open-source",
    title: "How to Contribute to Open Source (Even If You've Never Done It)",
    emoji: "🐧",
    desc: "Finding a real first issue, making a contribution that gets merged, and the etiquette that makes maintainers want your PR.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Open Source",
    metaTitle: "How to Contribute to Open Source - A First Contribution Guide | SlashAI",
    metaDesc:
      "Find a real first issue, write a contribution that gets merged, and the etiquette that makes maintainers want your pull request.",
    summary:
      "The gap between 'I want to contribute to open source' and an actual merged pull request is almost always one small, specific thing nobody was willing to do. This guide covers how to find that thing, how to make a change that fits the project rather than fighting it, and the handful of courtesies that decide whether a maintainer merges you in ten seconds or ignores you.",
    sections: [
      {
        id: "reality",
        heading: "The reality of contributing",
        blocks: [
          {
            type: "p",
            text: "Maintainers are usually volunteers, usually busy, and usually reviewing more pull requests than they can accept. Your contribution needs to be small, obviously correct, and easy to verify. The people who get merged are not the cleverest — they are the ones who made the maintainer's job smallest.",
          },
        ],
      },
      {
        id: "find",
        heading: "Finding a real first issue",
        blocks: [
          {
            type: "list",
            items: [
              "Start with `good first issue` or `help wanted` labels — they exist precisely to be an on-ramp.",
              "Pick a project you actually use. You will understand the problem better and your report will be more credible.",
              "Read the contributing guide before anything else. It usually states the exact expectations.",
              "Check recent commits to match the project's commit-message and formatting conventions.",
              "Prefer a small bug over a feature. A maintainer can verify a bug fix in seconds; a feature needs design review.",
              "A reproduction is the single highest-value thing you can contribute. Confirming an unfixed bug report is a real contribution even before you write code.",
            ],
          },
        ],
      },
      {
        id: "making",
        heading: "Making a contribution that lands",
        blocks: [
          {
            type: "list",
            items: [
              "One issue, one branch, one concern. Bundled changes get held.",
              "Match the surrounding code style even if you would write it differently.",
              "Include a test for a bug fix. Maintainers trust changes that prove themselves.",
              "Write a pull request description that says what changed, why, and how you verified it.",
              "Never include formatting-only changes alongside a logic change. It makes the diff unreadable.",
              "Never open a pull request against a project that has been archived or unmaintained for years.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Ask before you write. A one-line comment — 'I'd like to fix this, is it welcome?' — takes thirty seconds and avoids the most common reason a good contribution gets closed.",
          },
        ],
      },
      {
        id: "if-ignored",
        heading: "If nobody responds",
        blocks: [
          {
            type: "p",
            text: "Silence usually means no, not 'not yet'. Check the project on GitHub for maintainer activity, and read its issue tracker for a pattern of closed-without-reply. If a project has had no commits in over a year, the respectful answer is to spend your effort elsewhere. Do not open repeated pull requests to get attention — it is the fastest way to be permanently unwelcome.",
          },
        ],
      },
      {
        id: "tools",
        heading: "Tools for the work",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "markdown-editor",
              "table-generator",
              "text-case",
              "camel-case",
              "json-formatter",
              "diff",
            ],
            text: "Most of open source work is text: a README change, a changelog entry, a config file. These handle the tedious parts, and the diff checker is exactly what you want before submitting.",
          },
        ],
      },
    ],
  },
  {
    slug: "openai-api-guide-for-beginners",
    title: "The OpenAI API, From First Call to Something Useful",
    emoji: "🟢",
    desc: "Authentication, the request shape, streaming, costs and the mistakes beginners make — explained with copy-paste examples.",
    date: "27 Sep 2026",
    readTime: "9 min read",
    tag: "OpenAI",
    metaTitle: "The OpenAI API - A Beginner's Guide | SlashAI",
    metaDesc:
      "How to call the OpenAI API: authentication, request shape, streaming, token costs, error handling and the mistakes beginners make first.",
    summary:
      "The gap between 'I want to use the OpenAI API' and a working feature is about forty lines of code and one concept: tokens. This guide walks through authentication, the shape of a request and response, streaming, how the pieces fit for tools and structured output, how pricing actually works, and the errors everyone hits first.",
    sections: [
      {
        id: "first",
        heading: "The two things to understand first",
        blocks: [
          {
            type: "list",
            items: [
              "Tokens, not words. Input and output are measured and billed in tokens, roughly 3/4 of an English word. Longer prompts cost more; repeated context costs more every single call.",
              "It is stateless. The model remembers nothing between calls. Whatever context the next call needs, you send again — which is why apps keep a conversation array and resend it.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Never put an API key in browser or mobile code. Anything shipped to a client is readable by anyone who opens devtools. Keys belong on a server, and a proxy should be what your browser talks to.",
          },
        ],
      },
      {
        id: "call",
        heading: "Your first call",
        blocks: [
          {
            type: "code",
            lang: "bash",
            text: 'curl https://api.openai.com/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -d \'{\n    "model": "<a model id>",\n    "messages": [\n      {"role": "system", "content": "You are terse."},\n      {"role": "user", "content": "Explain what a hash table is."}\n    ]\n  }\'',
          },
          {
            type: "p",
            text: "Three things to notice. The model id goes in the body. Roles matter: system sets behaviour, user is the request. And the response nests the useful text a couple of levels down, which trips up almost everyone the first time.",
          },
        ],
      },
      {
        id: "params",
        heading: "Parameters worth knowing",
        blocks: [
          {
            type: "list",
            items: [
              "temperature — higher is more varied. Keep it low for anything factual, extraction or code; raise it for brainstorming.",
              "max tokens — caps the reply length. Useful as a cost ceiling and as a guard against runaway output.",
              "stop sequences — text that ends generation. A cheap way to make the model output exactly one line.",
              "tools / functions — let the model ask your code to do something, such as look something up. This is how you get grounded answers instead of confident guesses.",
              "response_format — requests structured output like a JSON object, which removes almost all parsing pain.",
            ],
          },
        ],
      },
      {
        id: "costs",
        heading: "What it actually costs",
        blocks: [
          {
            type: "p",
            text: "You are billed per token, separately for input and output, and output is priced higher. Two consequences matter more than the exact numbers: a large system prompt is a recurring cost on every single call, and sending a whole conversation history grows the bill on every turn.",
          },
          {
            type: "list",
            items: [
              "Set a hard spending limit on the account before you build anything. It is a real setting, not a suggestion.",
              "Summarise long history instead of resending it verbatim.",
              "Use the cheapest model that does the job; reserve the strongest one for genuinely hard requests.",
              "Cache what does not change between calls.",
            ],
          },
        ],
      },
      {
        id: "mistakes",
        heading: "Mistakes everyone makes first",
        blocks: [
          {
            type: "list",
            items: [
              "Exposing the key client-side. The single most common serious mistake.",
              "Sending the whole conversation on every turn and wondering why the bill jumped.",
              "No error handling, so a rate limit looks like a broken app.",
              "Retrying non-retryable errors like a 400, which never succeeds and wastes your quota.",
              "Trusting output without validating it. Parse it; do not assume the shape.",
            ],
          },
          {
            type: "tools",
            toolSlugs: [
              "api-tester",
              "json-formatter",
              "jwt-decoder",
              "json-to-ts",
              "base64",
              "url-encoder",
            ],
            text: "You can debug almost any API integration in the browser before writing a line of framework code. Build the request, inspect the response, and turn that JSON into a TypeScript type for free.",
          },
        ],
      },
    ],
  },
  {
    slug: "anthropic-claude-api-guide",
    title: "Using the Anthropic Claude API: A Practical Guide",
    emoji: "🟠",
    desc: "Messages, system prompts, long context, prompt caching, tool use and streaming — the patterns that make Claude APIs work well.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Anthropic",
    metaTitle: "Using the Anthropic Claude API - A Practical Guide | SlashAI",
    metaDesc:
      "How to use the Anthropic Claude API: messages, system prompts, long context, prompt caching, tool use and streaming, with honest error handling.",
    summary:
      "The Claude API has a small surface area and a few genuinely powerful features that are easy to miss. This guide covers the message format, the separate system prompt, long documents, prompt caching, tool use and streaming — and the practical details, like token limits and error handling, that decide whether an integration survives contact with real users.",
    sections: [
      {
        id: "shape",
        heading: "The shape of a request",
        blocks: [
          {
            type: "p",
            text: "Claude's API takes a list of messages that alternate between user and assistant turns, and the response's useful text is under content. The system prompt is a separate top-level field rather than a message, which is the first thing that trips people moving from other APIs.",
          },
          {
            type: "code",
            lang: "bash",
            text: 'curl https://api.anthropic.com/v1/messages \\\n  -H "x-api-key: $ANTHROPIC_API_KEY" \\\n  -H "anthropic-version: 2023-06-01" \\\n  -H "content-type: application/json" \\\n  -d \'{\n    "model": "<a model id>",\n    "max_tokens": 1024,\n    "system": "You are a precise technical editor.",\n    "messages": [\n      {"role": "user", "content": "Tighten this paragraph."}\n    ]\n  }\'',
          },
          {
            type: "list",
            items: [
              "max_tokens is required. There is no default, and omitting it is an error rather than a default.",
              "The version header pins behaviour; send it explicitly so an update does not silently change your responses.",
              "The key goes in a header, not a query string — query strings end up in logs and history.",
            ],
          },
        ],
      },
      {
        id: "long",
        heading: "Long context, and what it costs",
        blocks: [
          {
            type: "p",
            text: "A very large context window means you can send whole documents, but it is not free and it is not magic. Position matters: material placed in the middle of a very long prompt is attended to less reliably than the same material at the beginning or end. Put the instructions after the document, not before it.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "If you send the same large document on every call, use prompt caching. You pay far less for the repeated portion, and it is a one-line change with a large effect on cost.",
          },
        ],
      },
      {
        id: "tools",
        heading: "Tool use, which is the real feature",
        blocks: [
          {
            type: "p",
            text: "Tool use is how you stop the model inventing facts. You describe your functions, the model decides when to call one, your code actually performs the action, and you return the result. Search, database lookups and calculations all go through this, which is what makes answers verifiable instead of confident.",
          },
          {
            type: "list",
            items: [
              "Describe each tool in plain language, including what it is for and what it is not for.",
              "Return real data as the tool result, and say plainly when a lookup found nothing.",
              "Keep the tool set small. Fifteen near-identical tools produce worse selection than four clear ones.",
              "Do your own validation on the arguments before executing anything with a side effect.",
            ],
          },
        ],
      },
      {
        id: "streaming",
        heading: "Streaming, and being a good API citizen",
        blocks: [
          {
            type: "list",
            items: [
              "Stream for anything a person reads; a long non-streaming response feels broken even when it is fast.",
              "Set a timeout and a retry policy. Retry 429s and 5xx with backoff; do not retry a 400.",
              "Cap max_tokens so a runaway generation cannot cost more than you intended.",
              "Log token usage per request from day one. It is the only way to find a cost problem before your invoice does.",
              "Use a prompt as a constant so a tuning change is one edit, not a hunt through your codebase.",
            ],
          },
          {
            type: "tools",
            toolSlugs: [
              "api-tester",
              "json-formatter",
              "json-yaml",
              "base64",
              "regex",
              "json-diff",
            ],
            text: "The API tester is the fastest way to see the real response shape, and turning that JSON into a TypeScript type means the rest of the integration is typechecked from the start.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-learn-to-code-in-2026",
    title: "How to Learn to Code in 2026 (Without the Fluff)",
    emoji: "🧑‍🎓",
    desc: "Which language to start with, why you must build things, how to get unstuck, and how AI changes the learning path.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Coding",
    metaTitle: "How to Learn to Code in 2026 - Without the Fluff | SlashAI",
    metaDesc:
      "Which language to start with, why building beats watching, how to get unstuck without an answer key, and what AI changes about learning.",
    summary:
      "Most people quit programming in the first three months, and almost always for the same reason: they spent a long time consuming and never built anything. This guide covers which language to start with, why the first project matters more than the first course, how to get genuinely unstuck, and what to do about AI while you are still learning.",
    sections: [
      {
        id: "language",
        heading: "Which language, and why it barely matters",
        blocks: [
          {
            type: "p",
            text: "The first language teaches you the fundamentals, and the fundamentals transfer. The exception worth knowing: if your goal is a specific job in a specific stack, learn that one first, because it shortens the distance to a first contribution and a first job. Otherwise pick one with fast feedback and a forgiving ecosystem.",
          },
          {
            type: "list",
            items: [
              "Python — the gentlest start, huge job of teaching you clear syntax quickly.",
              "JavaScript — if you want to build things visible in a browser, and already use the web every day.",
              "Go or Rust — stricter, faster, and closer to systems work. Steeper first three weeks.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Do not spend a month choosing. Every one of these is a fine first language, and the time spent deciding is time not spent building.",
          },
        ],
      },
      {
        id: "build",
        heading: "Build things from week one",
        blocks: [
          {
            type: "p",
            text: "Reading about programming teaches you almost nothing. You learn by writing code that does not work, diagnosing why, and fixing it. The gap between 'I understand the tutorial' and 'I could write this' is exactly the gap that projects close.",
          },
          {
            type: "list",
            items: [
              "Week one: something trivial that runs. A to-do list. A unit converter. It does not matter what, as long as you made it work.",
              "Then add one thing you do not know how to do. That is where the learning is — at the edge of what you can do alone.",
              "Read other people's code. A project you depend on, in a language you read. It teaches conventions no tutorial does.",
              "Finish something and let someone use it. Being slightly embarrassed by other people's reactions is the fastest teacher there is.",
            ],
          },
        ],
      },
      {
        id: "stuck",
        heading: "Getting unstuck, in the right order",
        blocks: [
          {
            type: "list",
            items: [
              "Read the error message. All of it. The specific line and column in the trace is the actual answer, and beginners skip it consistently.",
              "Print the values. Most bugs are a variable not being what you assumed, and one print statement proves it.",
              "Shrink the problem. Comment out half the code until the bug disappears, then add it back in halves. This is how professionals debug.",
              "Explain the problem out loud, line by line, as if to a beginner. The step where you cannot explain is the bug.",
              "Only then search, and search for the exact error text rather than a paraphrase.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Do not skip the debugging practice. Being unable to diagnose your own errors is the single biggest difference between a programmer and someone who has memorised tutorials.",
          },
        ],
      },
      {
        id: "ai",
        heading: "Where AI fits while you are learning",
        blocks: [
          {
            type: "p",
            text: "Used as a replacement for thinking, AI will stop you ever learning to debug. Used as a tutor, it is the most patient one available. The distinction is whether you attempted first.",
          },
          {
            type: "list",
            items: [
              "Good: ask for three different explanations of a concept, or for your working code to be criticised.",
              "Good: ask what a specific error message means, then go and read the documentation it points at.",
              "Bad: asking for the solution before writing any code yourself.",
              "Bad: accepting generated code you do not understand. You will not be able to debug it later, and that is the real cost.",
            ],
          },
          {
            type: "tools",
            toolSlugs: [
              "regex-tester",
              "regex",
              "code-screenshot",
              "json-formatter",
              "json-to-ts",
              "color-picker",
            ],
            text: "The regex tester removes the single most frustrating beginner moment — not knowing whether your pattern or your mental model is wrong. The JSON-to-TypeScript converter does the same for a whole class of data-shaped problems.",
          },
        ],
      },
    ],
  },
  {
    slug: "debugging-code-when-you-are-completely-stuck",
    title: "Debugging: A Method That Works When Nothing Makes Sense",
    emoji: "🐛",
    desc: "The systematic order that finds bugs: reproduce, isolate, inspect data, then bisect. Plus what to do when you are truly stuck.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Coding",
    metaTitle: "Debugging - A Method for When Nothing Makes Sense | SlashAI",
    metaDesc:
      "A systematic debugging order: reproduce, isolate, inspect the data, bisect. Plus what to do when you are completely stuck.",
    summary:
      "Being stuck on a bug for three hours is a process failure, not a talent failure — the method almost always works, and skipping steps is what wastes the time. This guide gives the order that actually finds bugs, the techniques that sound absurd and work, and what to do when you have genuinely exhausted them.",
    sections: [
      {
        id: "order",
        heading: "Do these in order",
        blocks: [
          {
            type: "list",
            items: [
              "1. Reproduce it reliably. A bug you cannot trigger on demand cannot be confirmed as fixed either.",
              "2. Read the whole error, including the stack trace. The line and column are the actual location of the problem.",
              "3. Isolate it. Cut the code down until the bug survives on its own — a minimal reproduction is often half the work.",
              "4. Inspect the real data. Log the actual values. Most bugs are a value not being what you assumed.",
              "5. Check the boring causes first: wrong variable used, off-by-one, null or empty, wrong key, stale state, wrong input type.",
              "6. Change one thing at a time. Two changes at once and you have learned nothing from the result.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Bisect is the technique people skip and it works on anything: comment out half the input, or use git to check out an older version that worked. Halving repeatedly finds the exact change that broke it in a handful of steps.",
          },
        ],
      },
      {
        id: "lies",
        heading: "The debugging lies",
        blocks: [
          {
            type: "list",
            items: [
              "'It's probably the browser.' It is almost always your code.",
              "'It works on my machine.' Usually an undeclared dependency or a version difference.",
              "'I changed something unrelated.' Which means the bug was already there and you have now lost the trail.",
              "'Caching is caching.' Genuinely possible, but it is the third most common diagnosis and the first two are typos and stale state.",
              "'It must be a framework bug.' Much more likely a misuse of the framework.",
            ],
          },
        ],
      },
      {
        id: "stuck",
        heading: "When you are truly stuck",
        blocks: [
          {
            type: "list",
            items: [
              "Explain it out loud from the top, including what you expected. Narrating surfaces the step you skipped.",
              "Write down what you have tried. It looks absurd and frequently reveals that you never actually tried one of them.",
              "Rubber-duck it, or tell a coworker, or ask an AI tool — but paste the code, the error and what you already ruled out, or you will get the first suggestion you already rejected.",
              "Walk away for twenty minutes. Genuinely effective, and not a joke — the change of context is what helps.",
              "Sleep on it. Real bugs that survive a night of correct-by-inspection are often the obvious ones you stopped seeing.",
            ],
          },
        ],
      },
      {
        id: "tools",
        heading: "Tools that shorten the hunt",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "json-formatter",
              "json-diff",
              "diff",
              "regex-tester",
              "base64",
              "hash-generator",
              "jwt-decoder",
            ],
            text: "Formatting malformed JSON and diffing two payloads finds a surprising share of data bugs in seconds. The JWT decoder settles token problems without a round trip to the server.",
          },
        ],
      },
    ],
  },
  {
    slug: "shell-and-terminal-basics",
    title: "The Shell: The Twenty Commands That Cover Almost Everything",
    emoji: "⌨️",
    desc: "How the shell actually works, the commands that matter, pipes and redirection, and a safe path to scripting.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Coding",
    metaTitle: "The Shell - Twenty Commands That Cover Almost Everything | SlashAI",
    metaDesc:
      "How the shell works, the commands that cover almost everything, pipes and redirection, and a safe way into scripting.",
    summary:
      "The shell is the most useful thing on your machine, and the least taught. You do not need to memorise it — you need about twenty commands and three ideas: how programs chain together, how output goes somewhere other than the screen, and how to write a small script safely. This guide covers exactly that.",
    sections: [
      {
        id: "ideas",
        heading: "Three ideas that make the rest obvious",
        blocks: [
          {
            type: "list",
            items: [
              "Everything is a program, and a program reads input and writes output. The shell just connects them.",
              "Pipes (`|`) send one command's output to the next as input. This is why small tools compose into something powerful.",
              "Redirection (`>`, `>>`, `<`) changes where input comes from and where output goes.",
            ],
          },
          {
            type: "code",
            lang: "bash",
            text: "cat access.log | grep ' 500 ' | sort | uniq -c | sort -rn | head",
          },
          {
            type: "p",
            text: "That one line counts the most common server errors, sorted, top ten. None of those tools knows what it is part of. That is the whole idea.",
          },
        ],
      },
      {
        id: "commands",
        heading: "The ones worth memorising",
        blocks: [
          {
            type: "list",
            items: [
              "ls, cd, pwd — move around.",
              "cp, mv, rm — copy, move, delete. Learn the flags before you use rm on anything large.",
              "cat, head, tail, less — look at things. `tail -f` on a log file is the one you will use daily.",
              "grep — search inside files. The most used command on any machine.",
              "find — search for files by name, size or date.",
              "chmod — permissions. 644 for files and 755 for scripts is a reasonable default.",
              "ps, kill, top — see what is running and stop it.",
              "curl — make HTTP requests. This is how you test an API.",
              "ssh, scp — remote machines.",
              "tar, zip — archive and extract.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "There is no undo for `rm`. Before running any recursive delete, print the path first and read it. This is the one genuinely irreversible command in daily use.",
          },
        ],
      },
      {
        id: "scripts",
        heading: "Writing small scripts safely",
        blocks: [
          {
            type: "list",
            items: [
              "Start with `#!/usr/bin/env bash` and a shebang, then make it executable with chmod +x.",
              "Add `set -euo pipefail` at the top. It stops the script on the first error instead of ploughing on and corrupting something.",
              'Quote every variable: "$var" not $var. This alone prevents a large class of nasty bugs.',
              "Run it with bash -x for a trace of every command, which is the fastest way to see where it went wrong.",
              "Add an echo of what it is about to do before anything destructive.",
            ],
          },
          {
            type: "code",
            lang: "bash",
            text: '#!/usr/bin/env bash\nset -euo pipefail\n\ntarget="${1:?usage: clean.sh <dir>}"\necho "about to remove old logs in $target"\nfind "$target" -name \'*.log\' -mtime +30 -print -delete',
          },
        ],
      },
      {
        id: "tools",
        heading: "Tools for the same job in a browser",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "cron",
              "base64",
              "hash-generator",
              "uuid-generator",
              "password-gen",
              "timestamp",
              "url-encoder",
            ],
            text: "You can build and understand the same pieces without a terminal: schedule expressions, encodings, hashes, identifiers and time conversion, all offline.",
          },
        ],
      },
    ],
  },
  {
    slug: "rest-apis-and-how-to-call-one",
    title: "REST APIs and How to Call One",
    emoji: "🔌",
    desc: "Methods, status codes, headers, auth and error handling — explained well enough to debug an integration without a tutorial.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Coding",
    metaTitle: "REST APIs and How to Call One | SlashAI",
    metaDesc:
      "REST explained: methods, status codes, headers, authentication, pagination and error handling, with free tools to debug calls in the browser.",
    summary:
      "REST is a set of conventions rather than a specification, which is why it feels vague until you know the handful of things that actually matter. This guide covers the methods, the status codes worth memorising, what the headers are for, how authentication really works, and the error handling that separates a working integration from a flaky one.",
    sections: [
      {
        id: "methods",
        heading: "The methods, and what they mean",
        blocks: [
          {
            type: "list",
            items: [
              "GET — read something. Must not change anything, and a correct server enforces that.",
              "POST — create something, or do something that does not map to another method.",
              "PUT — replace a resource wholesale. The same request twice should leave the same result.",
              "PATCH — partially update a resource.",
              "DELETE — remove a resource.",
            ],
          },
          {
            type: "code",
            lang: "bash",
            text: 'curl -s https://api.example.com/v1/notes/42 \\\n  -H "Authorization: Bearer $API_KEY"\n\ncurl -s -X POST https://api.example.com/v1/notes \\\n  -H "Authorization: Bearer $API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"title":"Ship it","done":false}\'',
          },
        ],
      },
      {
        id: "status",
        heading: "Status codes worth memorising",
        blocks: [
          {
            type: "list",
            items: [
              "200 OK, 201 Created, 204 No Content — it worked.",
              "400 Bad Request — your request is malformed. Fix your code, not the server.",
              "401 Unauthorized — you are not authenticated. Missing, malformed or expired credentials.",
              "403 Forbidden — authenticated, but not allowed. The API will not change its mind.",
              "404 Not Found — the resource does not exist, or you are not allowed to know that it does.",
              "409 Conflict — the state does not allow this. Usually a duplicate or a stale version.",
              "429 Too Many Requests — rate limited. Back off and retry; do not hammer it.",
              "500 Server Error — their fault. Retry with backoff, and log the request id if there is one.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "401 means 'who are you', 403 means 'I know who you are and the answer is no'. Confusing the two is a classic sign you are looking in the wrong place.",
          },
        ],
      },
      {
        id: "auth",
        heading: "Authentication and headers",
        blocks: [
          {
            type: "list",
            items: [
              "API keys — a long string the server checks. Usually sent as a Bearer token in the Authorization header.",
              "OAuth — a token with a scope and an expiry. Store it, check the expiry, and refresh before it fails rather than after.",
              "Headers carry metadata: Content-Type, Accept, Authorization, and request-id for support.",
              "Never put a secret in a query string. Query strings end up in server logs, proxies and browser history.",
            ],
          },
        ],
      },
      {
        id: "practical",
        heading: "What separates a working integration from a flaky one",
        blocks: [
          {
            type: "list",
            items: [
              "Set a timeout on every request. A hanging request will eventually take your app down with it.",
              "Retry only 429 and 5xx, with exponential backoff and jitter. Retrying a 400 never succeeds and wastes your quota.",
              "Handle pagination properly. Assuming one page is the most common reason data mysteriously goes missing.",
              "Validate and parse responses rather than assuming the shape.",
              "Log the status and a request id, never the full body if it may contain personal data.",
            ],
          },
          {
            type: "tools",
            toolSlugs: [
              "api-tester",
              "jwt-decoder",
              "json-to-ts",
              "url-encoder",
              "json-formatter",
              "json-yaml",
            ],
            text: "Debug the call in the browser before writing any framework code: build it, inspect the real response, then turn that JSON into a TypeScript type so the rest of the integration is typechecked from the start.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-read-code-faster",
    title: "How to Read Code Faster",
    emoji: "🔍",
    desc: "Reading strategies for unfamiliar code: entry points, naming as documentation, and the three questions that orient you fastest.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Coding",
    metaTitle: "How to Read Code Faster | SlashAI",
    metaDesc:
      "How to read unfamiliar code quickly: find the entry point, use naming as documentation, and ask the three questions that orient you fastest.",
    summary:
      "Reading other people's code is a learnable skill, and almost everyone does it badly — by opening the first file and reading top to bottom. Real code is read from the outside in: entry point, data flow, then detail. This guide gives you the method, the signals that carry the most information, and what to skip entirely.",
    sections: [
      {
        id: "wrong",
        heading: "Why it feels so slow",
        blocks: [
          {
            type: "p",
            text: "Opening a file and reading down it is the wrong method, because a codebase is not a document. It has entry points, a data flow, and a lot of code that exists to handle cases you care nothing about yet. Reading in that order means spending most of your time in the least important parts.",
          },
        ],
      },
      {
        id: "method",
        heading: "Read from the outside in",
        blocks: [
          {
            type: "list",
            items: [
              "Find the entry point first. The main file, the CLI command, the route handler, the exported function. Everything else is downstream of it.",
              "Follow one concrete input all the way through. Pick a single test case or one URL and trace it. This is far faster than reading everything and gives you the shape of the whole system.",
              "Only then read the parts you would have to change.",
              "Use the tests as documentation. They show the intended behaviour in executable form, which is more reliable than comments because they cannot go stale.",
              "Read the changelog or recent commits first. The area you are about to touch may have just changed.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Ask an AI tool to explain what a module does and where its entry point is. For orientation it is fast and accurate; do not ask it to then write the code for you.",
          },
        ],
      },
      {
        id: "signals",
        heading: "High-signal things to look for",
        blocks: [
          {
            type: "list",
            items: [
              "Names are the best documentation. Good names mean you can skip the function body; bad names mean you cannot.",
              "The public API — exported functions, their parameters and return types. The rest is implementation detail you can ignore until you need it.",
              "Type definitions. A well-typed codebase tells you the entire shape of the data without reading a line of logic.",
              "Comments that explain *why*, not *what*. The code already says what.",
              "Error handling. It reveals what the author was genuinely worried about.",
            ],
          },
        ],
      },
      {
        id: "skip",
        heading: "What to skip without guilt",
        blocks: [
          {
            type: "list",
            items: [
              "Edge cases you will never hit.",
              "Legacy compatibility shims.",
              "Verbose validation and error-wrapping layers.",
              "Anything you can call instead of reading — the type signature, the test, the docs.",
            ],
          },
          {
            type: "tools",
            toolSlugs: [
              "code-screenshot",
              "text-stats",
              "word-counter",
              "reading-time",
              "diff",
              "json-formatter",
            ],
            text: "When you do need to read a long file, measure it first to know what you are in for, and use the diff checker to see what actually changed between two versions of a file.",
          },
        ],
      },
    ],
  },
];
