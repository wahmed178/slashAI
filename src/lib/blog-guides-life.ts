/**
 * SlashAI Blog — career, money, design, devices and everyday life guides.
 *
 * Composed into `ALL_BLOG_POSTS` by `lib/blog-guides`. Every slug in a `tools`
 * block is a real SlashKits or declarative tool.
 */

import type { BlogPost } from "@/lib/blogs";

export const LIFE_GUIDES: BlogPost[] = [
  {
    slug: "how-to-write-a-resume-people-actually-read",
    title: "How to Write a Resume People Actually Read",
    emoji: "🧾",
    desc: "What actually gets a resume read, the six-second scan it is judged on, and the honest mistakes that end it early.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Career",
    metaTitle: "How to Write a Resume People Actually Read | SlashAI",
    metaDesc:
      "What gets a resume read in six seconds, the honest mistakes that end it early, and how to write bullet points that show impact.",
    summary:
      "Most resumes are rejected in the first six seconds, and the reading is not a careful one. This guide covers what a screener is actually looking for during that scan, how to write bullet points that show impact rather than duties, and the specific mistakes that end a strong application early.",
    sections: [
      {
        id: "scan",
        heading: "The six seconds are real",
        blocks: [
          {
            type: "p",
            text: "For most roles, a person spends about six seconds on a resume before deciding whether it is worth a longer look. That is not carelessness — it is volume. The scan looks for: current title, years of experience, whether the skills match, and evidence of scale. If those are not visible in the first third of the page, the careful read never happens.",
          },
          {
            type: "list",
            items: [
              "Put your name, current role and total years of experience at the top, plainly.",
              "Match the job title wording where it is honest. It is not gaming, it is making you findable.",
              "Front-load the most relevant skills, not all of them.",
              "One page for under ten years' experience. Two pages are fine beyond that; three never is.",
              "Use a format that survives being read on a phone, because a surprising number are.",
            ],
          },
        ],
      },
      {
        id: "bullets",
        heading: "Bullets that show impact",
        blocks: [
          {
            type: "p",
            text: "The most common weakness is describing duties. 'Responsible for the sales team' tells a reader nothing. Impact is scale, speed, money, or a problem that was genuinely solved.",
          },
          {
            type: "list",
            items: [
              "Weak: 'Managed customer support'. Strong: 'Cut average first-response time from 9 hours to 40 minutes by moving to a ticketing system.'",
              "Weak: 'Worked on the website'. Strong: 'Rebuilt the checkout flow; conversion rose 18% over two months.'",
              "Weak: 'Helped with reports'. Strong: 'Automated the weekly report, saving about six hours per week across the team.'",
              "Include a number wherever one honestly exists. 'Improved performance' is not a claim; 'cut load time from 4s to 1.2s' is.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Use past tense for roles you have left and present for the current one. It is a small signal that you know where you are in time.",
          },
        ],
      },
      {
        id: "mistakes",
        heading: "What ends it early",
        blocks: [
          {
            type: "list",
            items: [
              "A photo, date of birth, gender, marital status or nationality — not expected in most markets and a reason for rejection where they are.",
              "Skills listed at a level you cannot defend in an interview.",
              "Filler. 'Hard worker', 'team player' and 'detail oriented' appear on every resume, so they carry no information at all.",
              "Design that sacrifices legibility. If the reader has to hunt for the dates, they will not.",
              "Typos in the first line. It reads as carelessness about everything else.",
              "Every bullet from the job description restated. Say what you did, not what you were asked to do.",
            ],
          },
        ],
      },
      {
        id: "tools",
        heading: "Tools for the final pass",
        blocks: [
          {
            type: "tools",
            toolSlugs: ["cv", "spelling", "text-stats", "readability", "word-counter", "font"],
            text: "Build the structure, then measure it. The word-frequency view shows repeated filler, and the readability check catches a document that has quietly become unreadable.",
          },
        ],
      },
      {
        id: "prompts",
        heading: "Commands to review it properly",
        blocks: [
          {
            type: "prompts",
            promptIds: ["critiquepitch", "analyzepitch", "scorepitch", "swotpitch", "rewriteessay"],
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-negotiate-your-salary",
    title: "How to Negotiate Your Salary (Without a Script)",
    emoji: "💰",
    desc: "Why most people accept the first number, how to research properly, the exact words that work, and what to do when they say no.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Career",
    metaTitle: "How to Negotiate Your Salary Without a Script | SlashAI",
    metaDesc:
      "How to research and negotiate salary: why people accept the first number, the words that work, and what to do when the offer is final.",
    summary:
      "The gap between offer and final number is usually small in absolute terms and large relative to a raise, which is why people give it up for free. This guide covers preparing with real numbers, the specific sentences that work, the three mistakes that cost people money, and what to do when they genuinely cannot move.",
    sections: [
      {
        id: "why",
        heading: "Why people accept the first number",
        blocks: [
          {
            type: "p",
            text: "Not because they are weak. Because the offer is flattering, the process has been long, they are unsure what to ask for, and asking feels like risking something they already have. The most effective preparation is not courage, it is having a specific number and a specific reason — which removes most of the awkwardness.",
          },
        ],
      },
      {
        id: "research",
        heading: "Arrive with numbers",
        blocks: [
          {
            type: "list",
            items: [
              "Know the market range for your role, level and city. Levels, not titles — 'senior' means different things at different companies.",
              "Anchor on total compensation, not base salary. Bonus, equity, remote days and insurance all count, and companies know it.",
              "Have a specific ask with a reason: 'Based on the market range for this role and my experience in X, I was expecting closer to Y.'",
              "Decide your real walk-away number before the call, and do not negotiate against yourself.",
              "Know what the role is worth to them. A role they cannot fill has a cost, and that is information they do not have.",
            ],
          },
        ],
      },
      {
        id: "words",
        heading: "Sentences that work",
        blocks: [
          {
            type: "list",
            items: [
              "Ask for time: 'I'd like to think about the offer and come back to you tomorrow' — very normal, and it stops an immediate yes becoming an immediate anchor.",
              "State the number without apology. No 'I know this is a lot, but…' weakens the ask before you finish it.",
              "Give a reason, then stop talking. Most people negotiate themselves downward by filling the silence.",
              "Ask what flexibility exists in the budget rather than whether they can raise it. Different question, same options.",
              "If they cannot move on base, trade other things: start date, remote days, title, review timing, training budget.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Get any final figure in writing before you accept. Verbal commitments about bonuses and review dates are worth nothing in practice.",
          },
        ],
      },
      {
        id: "mistakes",
        heading: "Mistakes that cost real money",
        blocks: [
          {
            type: "list",
            items: [
              "Naming a number with no reason attached — it reads as a guess, and it usually is one.",
              "Negotiating against yourself by mentioning what you would settle for.",
              "Citing your current salary as your justification. Many employers anchor to it, which works against you.",
              "Lying about other offers. It is checkable, and it makes everything else you say suspect.",
              "Treating a 'no' as a rejection of you rather than a constraint on their budget, and accepting it immediately.",
            ],
          },
        ],
      },
      {
        id: "tools",
        heading: "Do the numbers properly",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "negotiate-raise",
              "hourly-to-salary",
              "percentage",
              "budget",
              "emi-calculator",
              "interest-calculator",
            ],
            text: "Convert between hourly and salaried, work out the real annual value of an offer including bonus, and check what a competing offer is genuinely worth after tax before you compare them.",
          },
        ],
      },
      {
        id: "prompts",
        heading: "Commands to prepare",
        blocks: [
          {
            type: "prompts",
            promptIds: [
              "negotiatestartup",
              "negotiateresume",
              "negotiateproduct",
              "compareoptions",
              "analyzepitch",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-for-job-applications",
    title: "Using AI for Job Applications Without Getting Flagged",
    emoji: "📄",
    desc: "Where AI legitimately speeds up applications, where it gets you caught, and how to sound like a person at scale.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Career",
    metaTitle: "Using AI for Job Applications Without Getting Flagged | SlashAI",
    metaDesc:
      "Where AI legitimately speeds up job applications, how applicant tracking systems spot generic writing, and how to sound like a person at scale.",
    summary:
      "AI can genuinely help with job applications, mostly by removing the tedium rather than by writing for you. The risk is generic, unedited prose that reads as machine-written to both the screening software and the human behind it. This guide covers what to delegate, what to write yourself, and how to check your work before you submit.",
    sections: [
      {
        id: "reality",
        heading: "What screening actually does",
        blocks: [
          {
            type: "p",
            text: "Most large applications pass through an applicant tracking system that parses your resume into structured fields and filters on keywords. It is not primarily judging prose — which is good news, and means the emphasis belongs on clear formatting and honest keyword use rather than on writing beautifully.",
          },
          {
            type: "list",
            items: [
              "Use the job description's own terminology where it is accurate to your experience. This is not dishonest; it is how people describe the same work differently.",
              "Keep formatting simple and conventional. Fancy layouts and multi-column designs frequently break parsers.",
              "Put the keyword-rich content in the top third, where both the parser and the human look first.",
            ],
          },
        ],
      },
      {
        id: "delegate",
        heading: "Where it legitimately helps",
        blocks: [
          {
            type: "list",
            items: [
              "Tailoring bullets to a specific job description — genuinely useful, as long as you edit the result.",
              "Reformatting one strong master resume into a different layout each time.",
              "Anticipating the likely questions, so you are not drafting answers at midnight.",
              "Practising interview answers out loud, which is where most people are weakest.",
              "Checking your spelling and consistency, which is mechanical and never a bad use.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Never let it write something you cannot defend in an interview. Every claim in your application is likely to be probed, and fabricated experience is a far bigger cost than a rejected application.",
          },
        ],
      },
      {
        id: "voice",
        heading: "Sounding like a person",
        blocks: [
          {
            type: "list",
            items: [
              "Read the cover letter aloud. If you would not say it out loud, rewrite it — generated text reads slightly off precisely because nobody would say it that way.",
              "Include one specific, concrete, true detail that no template could have produced.",
              "Be willing to write the first draft badly yourself and then edit. It is faster than you think and always sounds better.",
              "Keep sentence lengths varied. Uniformly polished paragraphs are the clearest signal of generated text.",
            ],
          },
        ],
      },
      {
        id: "volume",
        heading: "The application-volume trap",
        blocks: [
          {
            type: "p",
            text: "Sending fifty near-identical applications is not a strategy; it is a way of feeling busy while your hit rate drops. Fewer, tailored applications consistently outperform more generic ones, and the total time is often the same because a generic application takes longer to write from scratch anyway.",
          },
          {
            type: "tools",
            toolSlugs: ["cv", "interview", "bio", "spelling", "readability", "text-stats"],
            text: "Build a master resume once, prepare honestly, then practise answering out loud — the mock interview is the part most people skip and the part that decides the result.",
          },
        ],
      },
      {
        id: "prompts",
        heading: "Commands to use",
        blocks: [
          {
            type: "prompts",
            promptIds: [
              "critiquepitch",
              "analyzepitch",
              "assumptionspitch",
              "rewriteessay",
              "toneessay",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-for-freelancers-guide",
    title: "Running a Freelance Business Without an Account",
    emoji: "💼",
    desc: "Pricing, contracts, invoices and getting paid — the unglamorous admin that decides whether freelancing works.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Freelance",
    metaTitle: "Running a Freelance Business Without an Account | SlashAI",
    metaDesc:
      "Pricing, contracts, invoices and getting paid: the unglamorous admin that decides whether freelancing actually works.",
    summary:
      "Freelancing rarely fails on skill. It fails on the admin around the skill: underpricing, no written scope, and awkward payment conversations. This guide covers pricing without a formula, the three clauses a contract actually needs, the invoice details that determine when you get paid, and how to raise rates without losing every client.",
    sections: [
      {
        id: "pricing",
        heading: "Pricing without a formula",
        blocks: [
          {
            type: "p",
            text: "There is no correct rate; there is only a rate that reflects what the work is worth to the buyer and the hours you actually spend. The common error is pricing on hours alone, which silently rewards you for being slow and punishes you for getting better at the job.",
          },
          {
            type: "list",
            items: [
              "Start higher than feels comfortable. You can lower a price; you cannot raise one mid-project.",
              "Price the outcome, then sanity-check the hours. If it takes three times the estimate, the scope is wrong, not your rate.",
              "Charge for the boring parts too — revisions, meetings, file organisation, and handover all take real time.",
              "Three tiers is a useful tool: most people pick the middle, which is the point.",
              "Raise rates every few projects until you start losing some. That is the signal you have found the edge.",
            ],
          },
        ],
      },
      {
        id: "contract",
        heading: "The contract clauses that matter",
        blocks: [
          {
            type: "list",
            items: [
              "Scope, in writing, listing what is included — and, importantly, what is not.",
              "Number of revision rounds. Unlimited revisions is a real and common way to lose money.",
              "Payment terms: amount, currency, due date, and what happens if it is late. A late fee stated up front is not aggressive; it is professional.",
              "Kill fee, if the client cancels. Half the remaining fee is a common and fair position.",
              "Ownership of the work, and when it transfers — usually on final payment.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "A short written agreement protects both sides, and clients respect it more than they expect. The disputes that happen are almost always about scope that was never written down.",
          },
        ],
      },
      {
        id: "invoices",
        heading: "Invoicing and getting paid",
        blocks: [
          {
            type: "list",
            items: [
              "Send an invoice for every project, and a deposit up front — 30–50% is normal and not an insult to ask for.",
              "Put everything on the invoice: a unique reference, both parties' details, the due date, and bank or payment details.",
              "Chase on the day after the due date, not three weeks later. A short, factual, unembarrassed reminder is the whole technique.",
              "Send the final handover and the final invoice together, so payment is attached to something already delivered.",
              "Keep a simple ledger of who owes what and when. Most freelance cash-flow problems are record-keeping problems.",
            ],
          },
        ],
      },
      {
        id: "clients",
        heading: "Getting better clients",
        blocks: [
          {
            type: "list",
            items: [
              "Write proposals that restate the client's problem in their words before proposing anything. It is the highest-converting opening there is.",
              "Say no to clients who are a poor fit, however much you need the work. One bad client can cost more than three good ones.",
              "Ask for a testimonial at the end of a project, while you are still their favourite person.",
              "Raise rates for new clients only. Existing clients are usually grandfathered and that is fine.",
            ],
          },
          {
            type: "tools",
            toolSlugs: [
              "contract",
              "invoice",
              "cv",
              "negotiate-raise",
              "bio",
              "table-generator",
              "gst-calculator",
            ],
            text: "Draft a contract, generate a proper invoice, and work out the tax on what you are charging — all offline, with nothing about your clients' details sent to a server.",
          },
        ],
      },
    ],
  },
  {
    slug: "ai-for-small-business",
    title: "Running a Small Business With Free Tools",
    emoji: "🏪",
    desc: "The paperwork, the money and the customer bits that a small business actually needs — and which are free to do properly.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Business",
    metaTitle: "Running a Small Business With Free Tools | SlashAI",
    metaDesc:
      "The paperwork, money and customer tasks a small business actually needs, and which are genuinely free to do properly with browser tools.",
    summary:
      "Small businesses do not fail for lack of ideas. They fail on the boring operational things — an invoice that is not issued, a price set by guessing, no record of who owes what. This guide covers the handful of things that genuinely matter in the first year, and how to do each of them with free tools and no subscriptions.",
    sections: [
      {
        id: "priorities",
        heading: "What actually matters in year one",
        blocks: [
          {
            type: "list",
            items: [
              "Know your numbers. What you sell, for how much, what it costs you, and what is left. Most owners cannot answer the last one from memory.",
              "Invoice immediately, every time. Money you have not asked for is money you will not see.",
              "Get a deposit before starting work. It filters out clients who were never going to pay.",
              "One written price list. Deciding per customer is how businesses end up working below cost without noticing.",
              "Record every transaction, even small ones, from day one. Bookkeeping is trivial weekly and impossible retroactively.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Undercharging is the most common way small businesses fail, and it almost always happens gradually — one discount at a time, each of which felt reasonable on its own.",
          },
        ],
      },
      {
        id: "money",
        heading: "Pricing and tax",
        blocks: [
          {
            type: "list",
            items: [
              "Work out your true hourly rate: divide your revenue by the hours you actually work, including admin. Most owners discover they are far below what they assumed.",
              "Add tax on top, not out of. A quote that does not mention tax is a quote that will be renegotiated later.",
              "Separate the money. A second account for business costs makes the real number obvious and takes minutes a month.",
              "Set aside for tax as money comes in, not when the notice arrives.",
            ],
          },
        ],
      },
      {
        id: "customers",
        heading: "The customer-facing bits",
        blocks: [
          {
            type: "list",
            items: [
              "A payment link or QR code removes the single most common reason a customer does not buy — the difficulty of paying.",
              "Invoices should look consistent and professional even when they are one line long. It signals reliability.",
              "A simple price list you can send as an image beats a long paragraph describing your services.",
              "Ask every happy customer how they found you. It takes ten seconds and is the cheapest marketing research available.",
            ],
          },
        ],
      },
      {
        id: "tools",
        heading: "Free tools for the paperwork",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "invoice",
              "contract",
              "upi",
              "gst-calculator",
              "budget",
              "kharch",
              "qr-code",
              "namecard",
            ],
            text: "Invoices, contracts, payment links and daily bookkeeping — all in the browser, so your figures and your customers' details stay on your own machine.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-manage-your-money",
    title: "How to Manage Your Money Without Feeling Like an Adult",
    emoji: "💰",
    desc: "A simple system that works on any income: what to track, what to automate, and the three accounts most people actually need.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Money",
    metaTitle: "How to Manage Your Money Without Feeling Like an Adult | SlashAI",
    metaDesc:
      "A money system that works on any income: what to track, what to automate, the three accounts you need, and the debts worth clearing first.",
    summary:
      "Personal finance advice is usually written for people earning more than they do. This guide is the version that works on a normal income: three accounts, an automatic transfer on payday, a spending figure you can survive, and a clear order for paying down debt. Nothing here requires a spreadsheet to be a genius.",
    sections: [
      {
        id: "system",
        heading: "Three accounts is enough",
        blocks: [
          {
            type: "p",
            text: "You do not need a budget app, an envelope system, or a spreadsheet maintained daily. You need somewhere for the money that is spoken for, somewhere for the money you live on, and somewhere for money that has not arrived yet.",
          },
          {
            type: "list",
            items: [
              "Bills — rent, EMIs, subscriptions, anything with a fixed date. This account is never spent from casually.",
              "Living — what you actually spend on. The balance here is the only number that matters day to day.",
              "Future — savings, emergency fund, and tax set aside. Money not yet earned for.",
              "Move to these automatically on payday. A transfer that happens on its own is the whole trick — you are deciding once, not every month.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Start with the bills account and the future account. Most people who struggle to save are not short of discipline, they are short of a system that moves the money before they can spend it.",
          },
        ],
      },
      {
        id: "emergency",
        heading: "The emergency fund comes first",
        blocks: [
          {
            type: "p",
            text: "One month of expenses is a start; three is comfortable. Its only job is to stop a single bad month — a broken phone, a medical bill, a lost month of work — from becoming debt. Without it, every unexpected cost goes on a card at 30–40% interest, which is the actual financial emergency.",
          },
        ],
      },
      {
        id: "debt",
        heading: "The order for debt",
        blocks: [
          {
            type: "list",
            items: [
              "List everything with the rate and the minimum payment. Seeing the full number is worth more than any advice.",
              "Pay the minimum on everything, so nothing gets worse.",
              "Put every spare amount at the highest interest rate you have. That is mathematically optimal and almost nobody does it, because the highest-rate debt is usually the least emotionally comfortable.",
              "When one is cleared, roll that payment into the next. This is the step that makes it fast.",
              "Cards at 30–40% are the priority, above everything except keeping a roof over your head.",
            ],
          },
        ],
      },
      {
        id: "spend",
        heading: "Spending without guilt",
        blocks: [
          {
            type: "list",
            items: [
              "Set one weekly figure rather than tracking every purchase. One number is sustainable; a spreadsheet is not.",
              "Give the discretionary budget a real line in the plan. Money with no assigned job gets spent without being noticed.",
              "Do not cancel every subscription, and do not keep the ones you forgot you had. Write the list down once a year.",
              "The biggest wins are rarely small purchases. Housing, transport and debt interest dominate everything else combined.",
            ],
          },
          {
            type: "tools",
            toolSlugs: [
              "budget",
              "kharch",
              "emi-calculator",
              "sip-calculator",
              "interest-calculator",
              "expense",
              "vat-calculator",
              "contribution-split",
            ],
            text: "Track daily spending, work out what a loan really costs, and split shared costs fairly with people who will actually see the number.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-plan-a-trip-for-less",
    title: "How to Plan a Trip for Less",
    emoji: "🧳",
    desc: "Planning that actually saves money — the booking windows, the mistakes, and the things people forget until it is too late.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Travel",
    metaTitle: "How to Plan a Trip for Less | SlashAI",
    metaDesc:
      "Trip planning that saves money: booking windows, the mistakes that cost most, and the details people forget until it is too late.",
    summary:
      "The cheapest trip is planned differently from the most fun one, and the savings come from a handful of decisions rather than from being miserable. This guide covers when to book, the mistakes that cost the most, the details that are easy to forget, and a simple way to split and track shared costs without arguing.",
    sections: [
      {
        id: "flights",
        heading: "Flights, where the money actually is",
        blocks: [
          {
            type: "list",
            items: [
              "Book domestic flights roughly two to eight weeks ahead; long-haul usually six to twelve. There is no perfect rule, but the expensive mistake is always booking at the last minute.",
              "Tuesday to Thursday departures and mid-week returns are consistently cheaper than Friday and Sunday, for boring and reliable reasons.",
              "Layover cities and nearby airports are the single biggest lever available, and they cost you comfort rather than money.",
              "Suitcase costs more than you think if you need one. Pack light for a week of normal clothes; you will have laundry.",
              "Check whether a self-transfer needs you to collect and re-check a bag. If it does, it is a connection, not a layover, and it can take six hours.",
            ],
          },
        ],
      },
      {
        id: "where",
        heading: "Where you stay and what you do",
        blocks: [
          {
            type: "list",
            items: [
              "Stay slightly outside the most expensive centre. The saving is large and the commute is short.",
              "Look at a map, not a listing. Proximity to a metro line matters far more than the description.",
              "Alternatives to hotels: guesthouses, hostels with private rooms, and serviced apartments for stays over a week.",
              "Buy city cards only if you will genuinely use most of what is on them. They are a good deal or a waste with nothing in between.",
              "Free things are consistently the best things. Walking tours, markets, parks and a good bakery beat a paid attraction most days.",
            ],
          },
        ],
      },
      {
        id: "forgot",
        heading: "Things people forget",
        blocks: [
          {
            type: "list",
            items: [
              "Travel insurance that covers the activity you are actually doing, not just the flight.",
              "Data roaming, or a local SIM. This is a real and sudden expense.",
              "Power adapters and the voltage, which is not the same everywhere.",
              "Cash. Card acceptance is better than it used to be, but some places still do not take it.",
              "Copies of your documents, stored somewhere you can reach if the phone is gone.",
              "Any medication you need, in the original packaging, with the prescription — checked against the destination's rules.",
            ],
          },
        ],
      },
      {
        id: "shared",
        heading: "Travelling with other people",
        blocks: [
          {
            type: "p",
            text: "The most common source of travel conflict is not the destination, it is money. Agreeing in advance who is paying for what — and using the same numbers — removes almost all of it.",
          },
          {
            type: "tools",
            toolSlugs: [
              "expense",
              "money-splitter",
              "world-clock",
              "time-zone-meeting",
              "days-between",
              "countdown",
              "random-picker",
            ],
            text: "Split costs fairly without a spreadsheet, and check the time difference before booking a call home.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-keep-your-data-safe",
    title: "How to Keep Your Data Safe (Without Becoming Obsessive)",
    emoji: "🔐",
    desc: "Passwords, two-factor, phishing, backups and the small habits that stop almost all real data loss.",
    date: "27 Sep 2026",
    readTime: "8 min read",
    tag: "Security",
    metaTitle: "How to Keep Your Data Safe Without Becoming Obsessive | SlashAI",
    metaDesc:
      "Data security without the paranoia: password managers, two-factor, spotting phishing, and the small habits that stop almost all real data loss.",
    summary:
      "Most data loss is boring: a reused password, a fake invoice attachment, a lost phone. You do not need to become cautious to be safe — you need about six habits. This guide covers them honestly, including why a password manager is the single highest-value change almost anyone can make.",
    sections: [
      {
        id: "passwords",
        heading: "Passwords, the one thing that matters most",
        blocks: [
          {
            type: "p",
            text: "Reusing one strong password across everything is the actual problem. A single site breach exposes every other account, and attackers absolutely try the leaked email and password everywhere else first. This is not theoretical — automated credential stuffing is one of the most common attacks there is.",
          },
          {
            type: "list",
            items: [
              "Use a password manager. It generates and remembers unique strong passwords, and it is the only approach that scales past a handful of accounts.",
              "Make sure your email password is unique and strong. Your email is the reset mechanism for everything else.",
              "Long beats complex. A multi-word passphrase is easier to remember and far harder to crack than P@ssw0rd!.",
              "Never store passwords in a note file, a spreadsheet, or a chat with yourself.",
              "Change a password immediately if a service reports a breach, and change it everywhere else if you had reused it.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Turn on two-factor authentication everywhere it is offered, and prefer an authenticator app or a hardware key over SMS, which is vulnerable to SIM swapping.",
          },
        ],
      },
      {
        id: "phishing",
        heading: "Spotting phishing",
        blocks: [
          {
            type: "list",
            items: [
              "Check the actual domain, not the display name. 'PayPal' in the sender name proves nothing.",
              "Urgency and threats are the tell. 'Your account will be closed in 24 hours' exists to stop you thinking.",
              "Hover before you click and read where the link actually goes.",
              "Attachments from anyone, including people you know — accounts get compromised. This is the most common real-world infection route.",
              "If it is unexpected, verify through a channel you chose: type the site address yourself, or phone the number on your card.",
              "Never be asked for your password, PIN or OTP by anyone. No legitimate organisation ever asks.",
            ],
          },
        ],
      },
      {
        id: "habits",
        heading: "The remaining habits",
        blocks: [
          {
            type: "list",
            items: [
              "Update your phone and browser. Most exploited vulnerabilities are patched in the very next release.",
              "Lock your screen. A logged-in session is the most common consequence of a stolen device.",
              "Review what apps have camera and microphone access, and revoke anything you do not use.",
              "Check login activity on your main accounts once a quarter, and revoke sessions you do not recognise.",
              "Minimise what you share publicly. Every detail is a password-recovery answer to someone patient.",
            ],
          },
          {
            type: "tools",
            toolSlugs: [
              "password-gen",
              "password",
              "hash-generator",
              "base64",
              "uuid-generator",
              "fake-email",
              "ip",
              "link-shortener",
            ],
            text: "Generate strong passwords, check what a hash or encoding does, and get a throwaway email address for a form you are not sure about.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-back-up-your-data",
    title: "Backups: The Only Thing You Cannot Do in Advance",
    emoji: "💾",
    desc: "The 3-2-1 rule, what actually counts as a backup, and how to check yours works before you need it.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Security",
    metaTitle: "Backups - The 3-2-1 Rule and How to Verify Yours | SlashAI",
    metaDesc:
      "The 3-2-1 backup rule, what actually counts as a backup versus a sync, and how to test a restore before you need one.",
    summary:
      "A backup you have never restored from is a hope, not a backup. This guide covers the 3-2-1 rule, the crucial difference between syncing and backing up, what actually threatens your data, and how to verify a restore — which takes twenty minutes and is the step everyone skips.",
    sections: [
      {
        id: "rule",
        heading: "The rule, and why it is the rule",
        blocks: [
          {
            type: "p",
            text: "Three copies of your data, on two different kinds of media, one of which is somewhere else. It is unglamorous and it works against every realistic threat at once — accidental deletion, device failure, theft, ransomware, and the fire.",
          },
          {
            type: "list",
            items: [
              "Three copies: the original plus two backups.",
              "Two media types: a drive and a cloud service are genuinely different failure modes.",
              "One offsite: fire, flood and theft do not respect your filing cabinet.",
            ],
          },
        ],
      },
      {
        id: "sync-vs-backup",
        heading: "Sync is not backup",
        blocks: [
          {
            type: "p",
            text: "This distinction matters more than anything else on this page. Syncing propagates changes — including deletions, and including ones made by malware or by you at 2am. A synced folder mirrors whatever happened, including the disaster. A backup keeps previous versions, which is the entire point.",
          },
          {
            type: "list",
            items: [
              "If you deleted it and it is gone from every device, you were syncing, not backing up.",
              "Look for version history specifically. That is the feature that makes a cloud service a backup.",
              "Photos deserve special attention: deleting a photo from a synced phone can delete it everywhere, and it is a leading cause of permanent family-photo loss.",
            ],
          },
        ],
      },
      {
        id: "threats",
        heading: "What actually threatens your data",
        blocks: [
          {
            type: "list",
            items: [
              "Accidental deletion — by far the most common, and the easiest to survive with version history.",
              "Device failure — phones and laptops die, usually without warning.",
              "Ransomware — encrypts your files and demands payment, often via a synced folder.",
              "Theft and fire — the reason for the offsite copy.",
              "The quiet one: a failing drive that has already started losing data without telling you.",
            ],
          },
        ],
      },
      {
        id: "verify",
        heading: "Verify it, properly",
        blocks: [
          {
            type: "list",
            items: [
              "Restore a few files to a different device or location. If you cannot restore, you do not have a backup.",
              "Check that the backup is running. Backups fail silently, and a failed one looks identical to a successful one until you need it.",
              "Confirm the schedule is one you would actually keep — a daily backup you switch off in week two is worse than a weekly one you keep.",
              "Test a full restore once a year with a laptop you do not mind losing.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Twenty minutes of verifying now is worth more than a new backup tool. The problem is never the tool — it is the copy you never tested.",
          },
          {
            type: "tools",
            toolSlugs: [
              "pdf-merge",
              "images-to-pdf",
              "json-formatter",
              "json-yaml",
              "base64",
              "hash-generator",
            ],
            text: "Useful for getting files into sane, portable formats before you archive them, and for checking an integrity hash when you need to confirm a file has not changed.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-build-a-personal-brand",
    title: "Building a Personal Brand Without Becoming Annoying",
    emoji: "🌟",
    desc: "What a personal brand actually is, how to start with what you already have, and how to stay useful rather than constant.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Personal Brand",
    metaTitle: "Building a Personal Brand Without Becoming Annoying | SlashAI",
    metaDesc:
      "What a personal brand actually is, how to start with what you have, and how to stay useful rather than constant online.",
    summary:
      "A personal brand is not a logo or a posting schedule. It is a reliable association between a topic and your name, built by publishing things that are useful to a specific group. This guide covers how to start with work you have already done, why niche beats broad, and how to be findable without being everywhere.",
    sections: [
      {
        id: "what",
        heading: "What it actually is",
        blocks: [
          {
            type: "p",
            text: "A personal brand is a shortcut other people use when deciding whether to trust you or hire you. It comes from being consistently useful about a narrow thing, so that anyone who encounters your work forms an accurate impression. Everything else — the bio, the colours, the logo — is decoration on top of that.",
          },
        ],
      },
      {
        id: "start",
        heading: "Start with what exists",
        blocks: [
          {
            type: "list",
            items: [
              "Write up something you already know how to do. A guide, an explanation, a postmortem of a problem you solved.",
              "Narrow beats broad. 'Helps small businesses with VAT' beats 'writes about business'. Narrow is findable; broad is interchangeable.",
              "Publish where your audience already is, rather than trying to be everywhere.",
              "Write about problems you have actually solved. First-hand experience is the only genuinely scarce input.",
              "Reply to people with useful answers. It is the highest-return activity available and almost nobody does it consistently.",
            ],
          },
        ],
      },
      {
        id: "consistency",
        heading: "Consistency over volume",
        blocks: [
          {
            type: "list",
            items: [
              "One substantial thing a month beats daily low-effort posting, because the first builds something and the second builds nothing.",
              "It is fine to be quiet for a while. A brand that only appears when it has something to say is more respected than one that posts daily.",
              "Reuse your best ideas. A strong answer becomes a post, and the post becomes a talk.",
              "Own the boring parts too — the process, the failures, the numbers. It is what makes the wins credible.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Do not build a brand on claims you cannot show. The cost of being found out is not the account, it is everything you would have built on it.",
          },
        ],
      },
      {
        id: "tools",
        heading: "The kit",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "linktree",
              "namecard",
              "bio",
              "signature-maker",
              "fancy-font",
              "qr-code",
              "meta",
            ],
            text: "One link that leads to everything, a card that looks like you, and a bio that says what you do in one line. Ten minutes of setup, and it makes everything else you publish easier to act on.",
          },
        ],
      },
    ],
  },
  {
    slug: "social-media-without-burning-out",
    title: "Using Social Media Without It Using You",
    emoji: "📵",
    desc: "How to use social media deliberately, take control of the feed, and step back without losing contact with people.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Social",
    metaTitle: "Using Social Media Without It Using You | SlashAI",
    metaDesc:
      "Take control of the feed, use social media deliberately, and step back without losing contact with people. Plus the honest cost of quitting cold turkey.",
    summary:
      "Most social media use is not a choice being made moment to moment — it is a recommendation engine deciding what to show you. This guide covers the settings that actually change what you see, how to use platforms deliberately, and why the common advice to delete everything usually makes people feel worse rather than better.",
    sections: [
      {
        id: "not-choice",
        heading: "It is not a series of choices",
        blocks: [
          {
            type: "p",
            text: "The design of these platforms is to be used, and the evidence is that the average person spends hours a day on them and reports afterwards that they did not enjoy it. That is not a willpower failure on your part; it is what the system is built to produce. Anything that only works by resisting a design is not a strategy.",
          },
        ],
      },
      {
        id: "controls",
        heading: "Change the defaults first",
        blocks: [
          {
            type: "list",
            items: [
              "Turn off every non-human notification. Leave direct messages from actual people. This one change is most of the benefit.",
              "Remove the apps from your home screen. Reopening deliberately beats being notified.",
              "Set a time limit in your device settings, and put the app in a folder on the last screen rather than deleting it.",
              "Unfollow without guilt, including mutuals. The feed is a product of who you follow, and that is fully under your control.",
              "Follow people, not trends. Following specific people is what makes a feed worth reading.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Set the time limit first and remove the badge second. Notifications are the mechanism; the red number is what pulls you in.",
          },
        ],
      },
      {
        id: "deliberate",
        heading: "Using it on purpose",
        blocks: [
          {
            type: "list",
            items: [
              "Decide before you open what you are there for — talking to people, or publishing. Both are fine; drifting between them is what eats the time.",
              "Posting works better when it is batched. One session of drafting beats six interruptions.",
              "For a business account, schedule posts, and reply to comments once a day rather than continuously.",
              "Anything that makes you feel worse after twenty minutes is not a use of time, whatever the metric says.",
            ],
          },
        ],
      },
      {
        id: "quitting",
        heading: "If you actually want to step back",
        blocks: [
          {
            type: "p",
            text: "Deleting everything cold is the most common advice and usually the worst version of it — you lose the people, and keep the craving. A gentler version works better: keep the accounts, unfollow aggressively, move the apps away, remove notifications, and check in after a month.",
          },
          {
            type: "callout",
            tone: "warn",
            text: "The weeks after quitting are genuinely uncomfortable, and that discomfort is the point at which most people go back. Decide in advance what you will do at that moment, rather than deciding in it.",
          },
          {
            type: "tools",
            toolSlugs: [
              "social-resize",
              "thread-maker",
              "poll",
              "standup",
              "screen-recorder",
              "meme",
              "linktree",
            ],
            text: "Batch your content in one sitting, size it correctly for each platform, and put every link you would otherwise chase in one place.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-make-a-website-look-professional",
    title: "How to Make a Website Look Professional",
    emoji: "🎨",
    desc: "The handful of design decisions that do most of the work — type, spacing, colour and images — without hiring anyone.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Design",
    metaTitle: "How to Make a Website Look Professional | SlashAI",
    metaDesc:
      "The handful of design decisions that do most of the work: type, spacing, colour, images and contrast, without hiring a designer.",
    summary:
      "Professional-looking design is not expensive or complex. It comes from a small number of decisions most people skip: two fonts instead of five, consistent spacing rather than arbitrary values, a limited palette, and real images. This guide covers the changes with the highest ratio of improvement to effort.",
    sections: [
      {
        id: "not-rule",
        heading: "What actually makes it look designed",
        blocks: [
          {
            type: "p",
            text: "The gap between a site that looks professional and one that does not is rarely about the quality of the ideas. It is almost always consistency, restraint, and spacing. Five small decisions, done properly, will outperform any amount of decoration.",
          },
        ],
      },
      {
        id: "decisions",
        heading: "Five decisions",
        blocks: [
          {
            type: "list",
            items: [
              "Two fonts. One for headings, one for body, with a real contrast between them. Three or more is the most common amateur tell.",
              "A limited palette: one strong colour, one neutral, and two greys. Everything else should come from your content.",
              "Consistent spacing from a small scale — 4, 8, 12, 16, 24, 32, 48. Arbitrary values are what make a page feel accidental.",
              "Real images rather than grey placeholders. A genuine photo changes the perceived quality of a page more than any other single change.",
              "Generous whitespace. The most common beginner mistake is crowding things in, when space is what makes the content easy to read.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "If you only do one thing: double the whitespace. Almost every amateur page becomes professional with more space and nothing else changed.",
          },
        ],
      },
      {
        id: "checklist",
        heading: "The check before you ship",
        blocks: [
          {
            type: "list",
            items: [
              "Read the text and see whether you can tell what the page is for within five seconds.",
              "Zoom to 200% and check nothing breaks or overlaps.",
              "View it on a real phone, on mobile data, not a fast wifi preview.",
              "Check every image loads, and that the page still makes sense if images fail.",
              "Check the contrast of text against its background, not just the colours individually.",
            ],
          },
        ],
      },
      {
        id: "tools",
        heading: "Free tools for the whole job",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "color-picker",
              "color-palette",
              "contrast-checker",
              "font",
              "gradient",
              "code-screenshot",
              "image-compress",
            ],
            text: "Build a palette from an existing image, check contrast for accessibility, pair fonts properly, and shrink your images — which matters more for how a page feels than almost any visual choice.",
          },
        ],
      },
    ],
  },
  {
    slug: "accessibility-for-everyone",
    title: "Accessibility: The Checks That Take Ten Minutes",
    emoji: "♿",
    desc: "The practical accessibility checks worth doing — contrast, reading level, alt text, keyboard use — and why they improve things for everyone.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Design",
    metaTitle: "Accessibility - The Checks That Take Ten Minutes | SlashAI",
    metaDesc:
      "Practical accessibility checks worth doing: contrast, reading level, alt text, keyboard navigation, and why they help everyone.",
    summary:
      "Accessibility is usually treated as a compliance exercise, which is why it tends to be done badly. Most of the real benefit comes from about ten minutes of checking: contrast, whether people can read your text, whether a keyboard works, and whether a screen reader gets anything useful. None of it requires special tools or expertise.",
    sections: [
      {
        id: "who",
        heading: "Who this affects",
        blocks: [
          {
            type: "p",
            text: "Around one in six people has a disability that affects how they use the web. But the fixes are not special accommodations — bright text, clear contrast and sensible heading structure help everyone, and they are exactly the same things that make a page pleasant on a small screen in bad light. Accessibility work and good design are the same work.",
          },
        ],
      },
      {
        id: "checks",
        heading: "The checks worth doing",
        blocks: [
          {
            type: "list",
            items: [
              "Contrast. If body text does not have a strong contrast ratio against its background, it is hard for everyone, especially outdoors on a phone.",
              "Readable text. Avoid long stretches of small, low-contrast body copy. If it is hard to read, it is hard for everybody.",
              "Alt text on meaningful images. Describe the information in the image, not its appearance — and leave decorative images empty so screen readers skip them.",
              "Keyboard operation. If you cannot tab through a page and use it without a mouse, neither can many people. Focus indicators must be visible.",
              "Real heading structure. Screen readers navigate by headings. Skipping levels, or using bold text as a heading, makes a page very hard to navigate.",
              "Labels on form inputs. A placeholder disappears the moment someone starts typing, which makes the field unlabeled for anyone still filling it in.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Turn on your screen reader for five minutes and try to use your own site. It is the fastest way to find problems that no automated checker will ever report.",
          },
        ],
      },
      {
        id: "content",
        heading: "Content is part of it",
        blocks: [
          {
            type: "list",
            items: [
              "Do not convey meaning by colour alone — add a label, an icon or a pattern as well.",
              "Link text should say where it goes. 'Click here' is unusable out of context, especially on a screen reader.",
              "Captions and transcripts for audio and video. Most people watch video without sound.",
              "Plain language helps everyone, and disproportionately helps people reading in a second language or under stress.",
            ],
          },
          {
            type: "tools",
            toolSlugs: [
              "contrast-checker",
              "readability",
              "word-counter",
              "reading-time",
              "text-to-speech",
              "extract-links",
            ],
            text: "Check contrast for every colour pair before you ship, and measure readability when the audience is broad or the text is dense.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-to-use-your-phone-better",
    title: "How to Use Your Phone Better",
    emoji: "📱",
    desc: "Taking the phone back — settings that genuinely help, what to put on the home screen, and how to stop it running your day.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Devices",
    metaTitle: "How to Use Your Phone Better | SlashAI",
    metaDesc:
      "Take the phone back: settings that genuinely help, what belongs on the home screen, and how to stop it running your day.",
    summary:
      "The phone is the most capable device most people own and the one they understand least, configured by default rather than by choice. This guide covers the settings that make a real difference, what belongs on the home screen, how to reclaim attention, and how to turn the device into something that helps rather than interrupts.",
    sections: [
      {
        id: "home",
        heading: "The home screen",
        blocks: [
          {
            type: "p",
            text: "The fastest way to cut phone use is to make the things you do not want easy to reach. If an app is on the home screen it will be opened, usually without deciding to. Almost every phone is better with one dock row, a small number of folders, and social apps moved off the first screen entirely.",
          },
          {
            type: "list",
            items: [
              "Keep the home screen for tools you chose, not defaults you accepted.",
              "Turn off every badge. The red number is a mechanism for pulling you in, not a fact you need.",
              "Use one home screen. Swiping between pages you built for a week you do not remember is friction, not organisation.",
              "Put the most-used three in the dock so they open without searching, and everything else into folders by function.",
            ],
          },
        ],
      },
      {
        id: "settings",
        heading: "Settings that actually matter",
        blocks: [
          {
            type: "list",
            items: [
              "Notifications: allow only from actual people. Everything else goes off, and the world will not end.",
              "Set app limits for the two or three that take the most. The limit works, and you can override it when it is genuinely needed.",
              "Turn off background refresh for apps you do not check constantly. It saves battery and reduces interruptions.",
              "Use Do Not Disturb or Focus during the parts of the day you want to be unreachable.",
              "Check battery usage monthly and disable the worst offender. This is usually a single app using most of it.",
            ],
          },
        ],
      },
      {
        id: "use",
        heading: "Turn it into a tool",
        blocks: [
          {
            type: "list",
            items: [
              "Use the built-in screenshot markup for quick, annotated notes instead of opening an editor.",
              "Save voice memos for anything you would otherwise forget. Speaking is faster than typing and leaves your hands free.",
              "Use a timer or focus mode for anything that requires you to stop scrolling and start one thing.",
              "Set a deliberate 'down time' schedule so the last twenty minutes of the day is not spent in a feed.",
              "Charge it somewhere other than the bedside if it is waking you up.",
            ],
          },
        ],
      },
      {
        id: "tools",
        heading: "A few things worth having",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "phone-reality",
              "water-tracker",
              "health-tracker",
              "plant",
              "pet-log",
              "focus-screen",
              "new-tab",
              "pomodoro",
            ],
            text: "A reality check on how much you use the device, plus the small things — water, plants, pets, focus — that are far easier to maintain on a phone than on paper.",
          },
        ],
      },
    ],
  },
  {
    slug: "a-daily-routine-that-lasts",
    title: "How to Build a Routine That Actually Lasts",
    emoji: "🔄",
    desc: "Why routines fail in week two, how to make the first step tiny, and how to use stacking so it sticks.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Productivity",
    metaTitle: "How to Build a Daily Routine That Actually Lasts | SlashAI",
    metaDesc:
      "Why routines fail in week two, how to make the first step tiny, habit stacking, and how to restart without treating a slip as failure.",
    summary:
      "Almost nobody fails at routines because of willpower. They fail because the first step is too big, the habit is attached to nothing specific, and a single missed day is treated as total collapse. This guide covers how to fix each of those, and why a routine that survives a bad week beats one that is perfect for ten days.",
    sections: [
      {
        id: "why",
        heading: "Why routines collapse in week two",
        blocks: [
          {
            type: "list",
            items: [
              "The first step is too big. A 45-minute morning routine is a single enormous change, and motivation is not a renewable resource.",
              "It is not attached to anything. 'I will read more' has no trigger; 'after I make coffee, I read two pages' does.",
              "One missed day becomes a break in the chain, and the chain is a story you tell yourself rather than a physical fact.",
              "It was designed for an ideal day, so the first normal day ends it.",
            ],
          },
        ],
      },
      {
        id: "method",
        heading: "Making it stick",
        blocks: [
          {
            type: "list",
            items: [
              "Make it so small it is embarrassing. Two minutes. The goal is to establish the habit, not to accomplish something on day one.",
              "Stack it onto an existing routine. Existing routines are the most reliable triggers there are, because they already happen.",
              "Decide the minimum version in advance. 'On a bad day I will do five minutes.' Then five minutes is still a success.",
              "Attach it to a place, not just a time. Habits tied to a location are stronger than habits tied to a clock.",
              "Track it visibly. A streak feels good and a gap feels like losing, so the visible version is optional — not every system needs to be a scoreboard.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Never miss twice. One missed day is noise. Two is the start of quitting, and that is the only number worth acting on.",
          },
        ],
      },
      {
        id: "time",
        heading: "Design for your real day",
        blocks: [
          {
            type: "p",
            text: "A routine built for a life with no interruptions will not survive contact with one. Plan for the version of the day where you are tired, delayed, and interrupted, because that is the day that decides whether it survives. If the routine only works when everything goes right, it is a plan, not a routine.",
          },
        ],
      },
      {
        id: "tools",
        heading: "Tools for holding it together",
        blocks: [
          {
            type: "tools",
            toolSlugs: [
              "habits",
              "habit-stack",
              "pomodoro",
              "focus",
              "multi-timer",
              "time-left",
              "deadline-honesty",
            ],
            text: "Stack a habit onto an existing one, timebox the work, and — if deadlines are the problem — get an honest read on whether you can actually make them.",
          },
        ],
      },
    ],
  },
  {
    slug: "data-and-spreadsheets-without-pain",
    title: "Spreadsheets and Data Without the Pain",
    emoji: "📊",
    desc: "Cleaning messy data, structure that survives contact with reality, and the mistakes that quietly corrupt every report.",
    date: "27 Sep 2026",
    readTime: "7 min read",
    tag: "Data",
    metaTitle: "Spreadsheets and Data Without the Pain | SlashAI",
    metaDesc:
      "Cleaning messy data, spreadsheet structure that survives reality, the mistakes that quietly corrupt reports, and CSV to JSON in one step.",
    summary:
      "Most spreadsheet problems are not exotic. They are inconsistent dates, numbers stored as text, merged cells, and a column called 'notes' that is now load-bearing. This guide covers the structure that survives real use, the cleaning steps that fix most problems, and the mistakes that quietly corrupt everything downstream.",
    sections: [
      {
        id: "structure",
        heading: "Structure that survives",
        blocks: [
          {
            type: "list",
            items: [
              "One row per thing, one column per attribute. No merged cells anywhere — they break every filter, sort and pivot.",
              "One value per cell. A column of 'Mon, Tue, Wed' in one cell cannot be sorted or grouped, ever.",
              "Never leave a blank cell where a value belongs. Use an explicit 'unknown' or 'N/A', so blanks mean something.",
              "Keep dates as real dates, in one format, not as text in four formats.",
              "Do not merge data into a presentation sheet. Keep the raw data on its own and summarise separately.",
              "Keep a lookup sheet for repeated lists, so 'Design' is never typed as 'design' in one row and 'Design ' in another.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            text: "Numbers stored as text are the quiet one. They look right, they total wrong, and charts based on them quietly ignore them.",
          },
        ],
      },
      {
        id: "cleaning",
        heading: "Cleaning most messy data",
        blocks: [
          {
            type: "list",
            items: [
              "Find duplicates before anything else. They inflate every total and skew every average.",
              "Standardise the text: trim the spaces, fix the capitalisation, decide how missing values are written.",
              "Convert the date formats to one, and check whether any are ambiguous — 01/02/2026 is not a date in most of the world.",
              "Check the types. Anything summing to zero is usually text pretending to be a number.",
              "Decide what to do with blanks before you start, and write it down, rather than improvising per row.",
            ],
          },
        ],
      },
      {
        id: "format",
        heading: "When the format stops fitting",
        blocks: [
          {
            type: "p",
            text: "The moment you start writing the same formula with a small change in twelve rows, you have outgrown the spreadsheet. That is the signal to move the data into JSON and work with it properly — and most of that work is now one copy and paste away.",
          },
          {
            type: "tools",
            toolSlugs: [
              "csv-to-json",
              "json-to-csv",
              "table",
              "table-generator",
              "json-diff",
              "csv-to-markdown",
              "word-frequency",
            ],
            text: "Convert a CSV to JSON and back in one step, check the structure, and turn a table into Markdown for a document. All of it happens in your browser, so an export of real data never leaves the machine.",
          },
        ],
      },
    ],
  },
];
