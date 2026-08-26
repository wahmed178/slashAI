import type { Roadmap } from "./roadmaps";

export const EXTRA_ROADMAPS: Roadmap[] = [
  {
    id: "no-code-saas-21",
    title: "Build a No-Code SaaS in 21 Days",
    tagline: "Bubble/Glide/Softr + Supabase + Stripe — idea to paying users.",
    audience: "Founders, Non-technical",
    duration: "3 weeks",
    phases: [
      { name: "Week 1 · Validate & design", steps: [
        { title: "Validate the idea in 3 days", detail: "Post in 3 communities (Reddit, Twitter, IndieHackers). Get 10 people to say 'I'd pay for this'. If <5 interested, pivot the angle." },
        { title: "Map the data model", detail: "List every entity: users, projects, items. Draw the relationships on paper. Decide what's a table and what's a column." },
        { title: "Pick your stack", detail: "Bubble for complex UIs, Glide for mobile-like apps, Softr for Airtable-powered portals. Supabase for auth + database. Stripe for payments." },
        { title: "Design 3 core screens", detail: "Landing page, main dashboard, settings. Use a template and customize — do not start from scratch." },
      ]},
      { name: "Week 2 · Build the MVP", steps: [
        { title: "Set up auth + database", detail: "Supabase gives you auth, database and storage in 10 minutes. Connect it to your no-code tool with the REST API." },
        { title: "Build the core workflow", detail: "One thing the product does. Not ten things. Ship the single action that solves the main problem." },
        { title: "Add Stripe payments", detail: "Lemon Squeezy or Stripe — one-time or subscription. Gate the core feature behind the paywall." },
        { title: "Test with 5 real users", detail: "Share the link. Watch them use it. Fix the 3 biggest friction points." },
      ]},
      { name: "Week 3 · Launch & iterate", steps: [
        { title: "Polish the landing page", detail: "Headline, 3 benefits, social proof (even if fake testimonials from testers), pricing, FAQ." },
        { title: "Launch on Product Hunt + Twitter", detail: "Prepare your PH listing 3 days early. Schedule tweets. Ask friends to support on launch day." },
        { title: "Collect feedback religiously", detail: "Add a feedback widget or a simple Typeform. Every response is gold for the next iteration." },
        { title: "Ship 2 improvements in week 1 post-launch", detail: "Show you're listening. Public changelog or tweets about what you fixed." },
      ]},
    ],
  },
  {
    id: "freelance-client-10",
    title: "Get Your First Freelance Client in 10 Days",
    tagline: "Cold outreach, portfolio, pricing — from zero to first invoice.",
    audience: "Freelancers, Students",
    duration: "10 days",
    phases: [
      { name: "Days 1–3 · Setup", steps: [
        { title: "Pick one service", detail: "Web design, writing, video editing — pick ONE. Specialists get hired faster than generalists." },
        { title: "Build a 3-project portfolio", detail: "If you have no client work, create 3 fictional projects. Show the problem, process and result." },
        { title: "Set your rate", detail: "Research competitors on Upwork/Fiverr. Price 20% below market to start. You'll raise after 3 testimonials." },
      ]},
      { name: "Days 4–7 · Outreach", steps: [
        { title: "Find 30 potential clients", detail: "Small businesses on Instagram, local restaurants, startups on Twitter. Anyone who needs your skill but isn't great at it." },
        { title: "Write 5 personalized DMs per day", detail: "Not 'Hi, I'm a freelancer'. Instead: 'I noticed your website loads slowly — here's how I'd fix it'." },
        { title: "Follow up once after 3 days", detail: "Most people are busy, not uninterested. 'Just bumping this — happy to help whenever.' One follow-up, then move on." },
      ]},
      { name: "Days 8–10 · Close", steps: [
        { title: "Offer a small paid test project", detail: "$50–200 for a defined task. Low risk for them, proof for you. Upsell from there." },
        { title: "Send a simple proposal", detail: "What you'll do, timeline, price, payment terms. Use the /Proposal command in SlashAI." },
        { title: "Deliver early, ask for a testimonial", detail: "Finish before the deadline. Ask: 'Would you recommend me to others?' Get it in writing." },
      ]},
    ],
  },
  {
    id: "personal-brand-zero",
    title: "Build a Personal Brand from Zero",
    tagline: "LinkedIn + Twitter + Content + SEO — become known for something.",
    audience: "Founders, Creators",
    duration: "3 months",
    phases: [
      { name: "Month 1 · Define & show up", steps: [
        { title: "Pick your topic", detail: "What do people ask you for help with? What do you know better than 90% of people? That's your brand topic." },
        { title: "Optimize your profiles", detail: "Photo, bio, banner — all consistent. Bio formula: 'I help [who] do [what] through [how]'. Add a link." },
        { title: "Post 3x per week", detail: "LinkedIn or Twitter (pick one first). Short posts with a hook, value, and CTA. Do not perfectionism yourself into silence." },
        { title: "Comment on 10 posts daily", detail: "Thoughtful comments on bigger accounts get you seen. This is the fastest growth hack in 2026." },
      ]},
      { name: "Month 2 · Build depth", steps: [
        { title: "Write 4 long-form pieces", detail: "Blog posts, Twitter threads, or LinkedIn articles. Deep content builds credibility faster than shallow posts." },
        { title: "Start a newsletter", detail: "Beehiiv or Substack — weekly email with one insight. Your newsletter becomes your professional moat." },
        { title: "Collaborate with 2 creators", detail: "Co-write something, appear on a podcast, do a Twitter Space. Cross-pollination grows both audiences." },
      ]},
      { name: "Month 3 · Compound & monetize", steps: [
        { title: "Repurpose your best content", detail: "One long post → 5 short ones → a newsletter issue → a video script. Maximum output, minimum effort." },
        { title: "Create a lead magnet", detail: "Free template, checklist, or mini-course. Collect emails in exchange for something genuinely useful." },
        { title: "Pitch yourself for 3 opportunities", detail: "Speaking, guest posts, consulting. Your brand is now your proof — leverage it." },
      ]},
    ],
  },
  {
    id: "python-data-analysis-45",
    title: "Learn Python for Data Analysis in 45 Days",
    tagline: "Pandas, matplotlib, SQL — from zero to real projects.",
    audience: "Students, Professionals",
    duration: "45 days",
    phases: [
      { name: "Days 1–10 · Python basics", steps: [
        { title: "Learn variables, loops, functions", detail: "FreeCodeCamp Python course (YouTube, 4 hours). Code along, don't just watch." },
        { title: "Install Jupyter + pandas", detail: "pip install jupyter pandas matplotlib. Set up in VS Code. You'll live here for the next 35 days." },
        { title: "Complete 20 small exercises", detail: "LeetCode Easy or HackerRank Python. 2 per day. Builds muscle memory fast." },
      ]},
      { name: "Days 11–30 · Data skills", steps: [
        { title: "Pandas: filter, group, merge", detail: " Kaggle's Pandas course (free, 5 hours). Then apply it to a real CSV dataset." },
        { title: "Matplotlib + seaborn charts", detail: "Bar, line, scatter, heatmap. Make 10 charts from real data. Focus on labeling clearly." },
        { title: "SQL basics", detail: "SELECT, WHERE, JOIN, GROUP BY. Use SQLBolt (free interactive). Do all 37 exercises." },
        { title: "Build 3 mini projects", detail: "Sales dashboard, weather analysis, survey results. Each one: question → data → insight → chart." },
      ]},
      { name: "Days 31–45 · Portfolio", steps: [
        { title: "Kaggle competition or dataset", detail: "Pick a beginner competition. Clean data, explore, model, submit. Even a simple approach counts." },
        { title: "Write up your projects on GitHub", detail: "README for each project: what, why, how, result. Clean notebooks with comments." },
        { title: "Build a simple dashboard", detail: "Streamlit or Gradio — one app that loads data and shows 3 charts. Deploy on Streamlit Cloud (free)." },
        { title: "Share your work publicly", detail: "LinkedIn post with charts + link to GitHub. Tag data communities. This gets you noticed." },
      ]},
    ],
  },
  {
    id: "newsletter-60",
    title: "Build and Monetize a Newsletter in 60 Days",
    tagline: "Beehiiv/Substack — grow to 500 subscribers and land your first sponsor.",
    audience: "Creators, Founders",
    duration: "60 days",
    phases: [
      { name: "Days 1–14 · Launch", steps: [
        { title: "Pick your niche", detail: "The narrower the better. 'AI tools for teachers' beats 'AI news'. Specific audiences are easier to find and monetize." },
        { title: "Set up on Beehiiv or Substack", detail: "Free tiers are generous. Customize the landing page with a clear value prop and sample issue." },
        { title: "Write 3 issues before promoting", detail: "Publish 3 issues so new subscribers see a backlog. Quality > frequency. One good insight per issue." },
        { title: "Create a referral program", detail: "Beehiiv has built-in referrals. Offer a bonus (template, checklist) at 3 and 10 referrals." },
      ]},
      { name: "Days 15–30 · Grow", steps: [
        { title: "Cross-promote in 5 communities", detail: "Reddit, Slack groups, Discord servers, Twitter threads. Share your best issue, not 'subscribe to my newsletter'." },
        { title: "Guest post on 2 platforms", detail: "Write for someone else's newsletter or blog. End with a CTA to yours. This is the #1 growth channel." },
        { title: "Consistent schedule", detail: "Same day, same time, every week. Your audience should know when to expect it." },
        { title: "Add a lead magnet", detail: "Free PDF, template, or resource list. Gate it behind subscription. This converts casual readers into subscribers." },
      ]},
      { name: "Days 31–60 · Monetize", steps: [
        { title: "Reach 500 subscribers", detail: "This is the minimum for sponsorship interest. Focus on quality subscribers, not vanity numbers." },
        { title: "Apply to ad networks", detail: "Beehiiv Ad Network, Swapstack, Paved. Or cold-email brands directly with your audience stats." },
        { title: "Create a paid tier", detail: "One premium article per month or exclusive content. $5–10/month. Even 10 paying readers is validation." },
        { title: "Track your metrics", detail: "Open rate, CTR, growth rate, revenue per subscriber. These numbers help you pitch sponsors confidently." },
      ]},
    ],
  },
  {
    id: "remote-tech-job-90",
    title: "Land a Remote Tech Job in 90 Days",
    tagline: "Skills, portfolio, applications, interviews — the full playbook.",
    audience: "Students, Job Seekers",
    duration: "90 days",
    phases: [
      { name: "Days 1–30 · Skill up", steps: [
        { title: "Pick one stack and go deep", detail: "React+Node, Python+Django, or Go+Kubernetes. breadth is the enemy. Be dangerous in one thing." },
        { title: "Build 3 portfolio projects", detail: "One full-stack app, one API, one open-source contribution. GitHub with clean READMEs is your resume." },
        { title: "Complete 1 certification", detail: "AWS Cloud Practitioner, Google Analytics, or a freeCodeCamp cert. One is enough — don't collect them all." },
      ]},
      { name: "Days 31–60 · Apply", steps: [
        { title: "Optimize LinkedIn + resume", detail: "Headline: role you want. Summary: what you've built. Links: GitHub, portfolio, live projects." },
        { title: "Apply to 5 jobs per day", detail: "Quality applications only. Tailor your cover letter using the /ColdEmail command. Track everything in a spreadsheet." },
        { title: "Network intentionally", detail: "Comment on hiring managers' posts. DM engineers at target companies. Ask for a 15-min chat, not a job." },
        { title: "Practice coding challenges", detail: "LeetCode medium, 2 per day. Focus on arrays, strings, trees, graphs. Time yourself at 30 min." },
      ]},
      { name: "Days 61–90 · Interview", steps: [
        { title: "Mock interviews weekly", detail: "Pramp (free), or practice with a friend. Behavioral + technical. Record yourself and review." },
        { title: "Prepare your story", detail: "STAR method for every project. 'Situation, Task, Action, Result' — practice until it's natural." },
        { title: "Follow up after every interview", detail: "Thank-you email within 24 hours. Reference something specific from the conversation." },
        { title: "Negotiate your offer", detail: "Always negotiate. Use levels.fyi for benchmarks. Even 5% more compounds over your career." },
      ]},
    ],
  },
  {
    id: "micro-saas-profitable",
    title: "Build a Profitable Micro-SaaS Alone",
    tagline: "Idea, build, launch, first $1k MRR — the solo founder path.",
    audience: "Founders, Developers",
    duration: "3 months",
    phases: [
      { name: "Week 1–2 · Find the idea", steps: [
        { title: "Solve your own problem", detail: "The best micro-SaaS ideas come from personal frustration. What tool do you wish existed?" },
        { title: "Validate with 20 conversations", detail: "DM people in your target audience. 'Would you pay $X/month for this?' Get real commitments, not polite nods." },
        { title: "Scope ruthlessly", detail: "One feature that solves one problem for one audience. You can add more later. Ship the smallest thing possible." },
      ]},
      { name: "Week 3–8 · Build", steps: [
        { title: "Choose your stack", detail: "Next.js + Supabase + Vercel + Stripe. Or Laravel + SQLite. Speed of shipping > architectural elegance." },
        { title: "Build the core loop", detail: "Sign up → use the feature → get value → pay. This is the entire product. Perfect this first." },
        { title: "Add authentication + payments", detail: "Clerk or Supabase Auth for login. Stripe or Lemon Squeezy for payments. Gate features behind the paywall." },
        { title: "Ship to beta testers", detail: "Give 5–10 people free access. Watch them use it. Fix what confuses them. Listen more than you code." },
      ]},
      { name: "Week 9–12 · Launch & grow", steps: [
        { title: "Launch publicly", detail: "Product Hunt, Hacker News, Twitter, Reddit. Launch in 3 places minimum on the same day." },
        { title: "SEO landing pages", detail: "One page per use case. 'Best [tool] for [audience]' — this compounds over months." },
        { title: "Reach first $1k MRR", detail: "At $29/month you need ~35 customers. At $9/month you need ~112. Price for value, not cheapness." },
        { title: "Automate support", detail: "FAQ page, chatbot, email templates. Your time should go to building, not answering the same 5 questions." },
      ]},
    ],
  },
  {
    id: "digital-products",
    title: "Start a Digital Product Business",
    tagline: "eBooks, templates, courses — the Gumroad model.",
    audience: "Creators, Freelancers",
    duration: "30 days",
    phases: [
      { name: "Week 1 · Pick your product", steps: [
        { title: "Choose a format", detail: "Templates (Notion, Figma, spreadsheets) sell fastest. eBooks take longer but command higher prices. Courses take the longest but scale infinitely." },
        { title: "Research what's selling", detail: "Gumroad Discover, Etsy digital, Product Hunt. What are the top 10 sellers in your niche?" },
        { title: "Scope the first product", detail: "A Notion template pack, a Figma UI kit, a 30-page guide. Small enough to finish in a week, valuable enough to charge for." },
      ]},
      { name: "Week 2 · Create", steps: [
        { title: "Build the product", detail: "Set a 5-day deadline. Perfectionism kills more products than competition. Ship good, not perfect." },
        { title: "Create a sales page", detail: "Gumroad or Lemon Squeezy handles this. Include: what it is, who it's for, preview images, testimonials, price." },
        { title: "Set up payment + delivery", detail: "Instant digital delivery. Gumroad, Lemon Squeezy, or Payhip — they handle everything." },
      ]},
      { name: "Week 3–4 · Sell", steps: [
        { title: "Launch with a discount", detail: "20% off for the first 50 buyers. Creates urgency and gets your first reviews." },
        { title: "Post about it everywhere", detail: "Twitter thread, LinkedIn post, Reddit communities, IndieHackers. Show the creation process." },
        { title: "Collect testimonials", detail: "DM your first 10 buyers: 'How did this help you?' Screenshot their replies for social proof." },
        { title: "Iterate based on feedback", detail: "Version 2 should include the top 3 requests. Announce updates publicly." },
      ]},
    ],
  },
  {
    id: "content-marketing-1k",
    title: "Scale from 0 to 1,000 Users with Content Marketing",
    tagline: "No ads, no partnerships — just strategic content that compounds.",
    audience: "Founders, Creators",
    duration: "3 months",
    phases: [
      { name: "Month 1 · Foundation", steps: [
        { title: "Audit your SEO basics", detail: "Google Search Console setup, sitemap, meta titles on every page. These free basics matter more than people think." },
        { title: "Map 50 keywords", detail: "Use Ubersuggest free tier or Google autocomplete. Find questions your audience is Googling. Long-tail = less competition." },
        { title: "Create a content calendar", detail: "4 pieces per week: 1 blog post, 2 social posts, 1 newsletter. Batch create to stay ahead." },
        { title: "Write your 10 cornerstone articles", detail: "The definitive guides for your niche. 2000+ words, original data or examples, genuinely useful." },
      ]},
      { name: "Month 2 · Distribution", steps: [
        { title: "Repurpose every piece", detail: "Blog → Twitter thread → LinkedIn post → Newsletter section → Short video. 5x the reach from 1x the work." },
        { title: "Guest post on 3 sites", detail: "Medium, Dev.to, Hashnode, or niche blogs. Include a link back to your product." },
        { title: "Engage in communities daily", detail: "Reddit, Twitter, Discord. Answer questions genuinely. Link your content when it's relevant, never spam." },
      ]},
      { name: "Month 3 · Optimize", steps: [
        { title: "Analyze what's working", detail: "Google Analytics shows which posts drive traffic. Double down on what converts." },
        { title: "Build email capture", detail: "ConvertKit or Beehiiv. Every blog post should have a CTA to subscribe. Email converts 10x better than social." },
        { title: "Create lead magnets", detail: "Templates, checklists, calculators. Gate behind email. This builds your owned audience." },
        { title: "Set up automated sequences", detail: "Welcome email, 5-email nurture, product pitch. Set it once, let it run." },
      ]},
    ],
  },
  {
    id: "ai-wrapper-7",
    title: "Build an AI Wrapper Product in 7 Days",
    tagline: "Claude/OpenAI API + Lovable/Cursor — ship fast, validate faster.",
    audience: "Developers, Founders",
    duration: "7 days",
    phases: [
      { name: "Day 1–2 · Idea & design", steps: [
        { title: "Find a specific AI use case", detail: "Legal docs for landlords, meal plans for diabetics, SEO audits for Shopify stores. Niche wins." },
        { title: "Design the UI", detail: "One input, one output, one page. Keep it dead simple. Use v0.dev for quick prototyping." },
        { title: "Set up the project", detail: "Next.js on Vercel. Supabase for auth + storage. One API route for the AI call." },
      ]},
      { name: "Day 3–5 · Build", steps: [
        { title: "Implement the AI prompt", detail: "Write a system prompt that gets great results. Test with 10 different inputs before shipping." },
        { title: "Add auth + rate limiting", detail: "Clerk or Supabase Auth. Track usage per user. Free tier: 5 uses/day. Paid: unlimited." },
        { title: "Build the frontend", detail: "Input form → loading state → output display → copy/download. Add Stripe for paid tier." },
        { title: "Add error handling", detail: "API errors, rate limits, empty responses. Graceful degradation, not crashes." },
      ]},
      { name: "Day 6–7 · Launch", steps: [
        { title: "Write a landing page", detail: "Problem → solution → demo → pricing → CTA. Use the /LandingCopy command from SlashAI." },
        { title: "Launch on Twitter + Product Hunt", detail: "Show the build process. 'I built this in 7 days' threads get massive engagement." },
        { title: "Iterate based on first users", detail: "The first 20 users will show you what's broken and what's missing. Ship fixes fast." },
      ]},
    ],
  },
  {
    id: "competitive-analysis",
    title: "Do a Proper Competitive Analysis",
    tagline: "Research, positioning, differentiation — know your market before building.",
    audience: "Founders, PMs",
    duration: "2 weeks",
    phases: [
      { name: "Week 1 · Research", steps: [
        { title: "List 10 direct competitors", detail: "Google your product idea + 'alternatives'. Check G2, Capterra, Product Hunt. Include both big players and small startups." },
        { title: "Map competitor features", detail: "Spreadsheet: rows = features, columns = competitors. Color-code: strong/weak/missing." },
        { title: "Read their reviews", detail: "G2 reviews, App Store reviews, Reddit threads. The complaints are your opportunities." },
        { title: "Analyze pricing", detail: "Price points, tiers, free trials, freemium. What's the market willing to pay?" },
      ]},
      { name: "Week 2 · Position", steps: [
        { title: "Find your positioning", detail: "You can be cheaper, simpler, more niche, better designed, or more honest. Pick ONE angle." },
        { title: "Create a competitive matrix", detail: "Visual chart showing you vs competitors on 2 key axes. Use this on your landing page." },
        { title: "Write your differentiation statement", detail: "'Unlike [competitor], we [unique advantage] for [specific audience]' — one sentence, crystal clear." },
        { title: "Test with 5 potential users", detail: "Show them your positioning + 2 competitors. Ask which they'd choose and why." },
      ]},
    ],
  },
  {
    id: "prompt-engineering-pro",
    title: "Learn Prompt Engineering Professionally",
    tagline: "Beginner to advanced — with a portfolio of real prompts.",
    audience: "Everyone",
    duration: "30 days",
    phases: [
      { name: "Week 1 · Foundations", steps: [
        { title: "Learn the core techniques", detail: "Zero-shot, few-shot, chain-of-thought, role prompting. Anthropic's guide (free) is the best starting point." },
        { title: "Master system prompts", detail: "Write 5 system prompts for different personas. Test how changing tone and constraints changes output." },
        { title: "Understand context windows", detail: "How much fits in Claude vs GPT-4o vs Gemini. Token counting matters for complex prompts." },
      ]},
      { name: "Week 2–3 · Intermediate", steps: [
        { title: "Structured output prompts", detail: "JSON, markdown, tables, code. Practice forcing specific formats consistently across 20 tries." },
        { title: "Chain prompting", detail: "Break complex tasks into 3+ sequential prompts. Each step feeds the next. Build a 5-step research workflow." },
        { title: "Build a prompt library", detail: "Organize by category. Include: prompt, model, version, success rate, notes. This becomes your professional asset." },
      ]},
      { name: "Week 4 · Advanced", steps: [
        { title: "Meta-prompting", detail: "Write prompts that evaluate and improve other prompts. Use one LLM to grade another's output." },
        { title: "Multi-modal prompting", detail: "Images + text in Claude/Gemini. Chart analysis, document parsing, visual Q&A." },
        { title: "Create 3 production prompts", detail: "Real-world use case with production-quality output. Document in a portfolio. Share publicly." },
        { title: "Write a blog post or thread", detail: "Teach what you learned. Teaching cements knowledge and builds your reputation." },
      ]},
    ],
  },
  {
    id: "portfolio-hired",
    title: "Build a Portfolio That Gets You Hired",
    tagline: "From empty GitHub to interview-ready — the developer portfolio playbook.",
    audience: "Developers, Job Seekers",
    duration: "6 weeks",
    phases: [
      { name: "Week 1–2 · Foundation", steps: [
        { title: "Clean up your GitHub", detail: "Pin 6 best repos. Write READMEs for each: what it does, how to run it, what you learned. Green squares matter less than clean code." },
        { title: "Build a personal website", detail: "Simple Next.js or Astro site. Hero, projects, about, contact. Deploy on Vercel. It's your digital business card." },
        { title: "Write a README.md for yourself", detail: "Who you are, what you know, what you're looking for. Put it at the top of your GitHub." },
      ]},
      { name: "Week 3–4 · Projects", steps: [
        { title: "Build a flagship project", detail: "Full-stack, production-ready, with tests and CI/CD. Something you can talk about for 30 minutes in an interview." },
        { title: "Contribute to open source", detail: "Fix a bug, add a feature, improve docs. Even small PRs show you can work in a team codebase." },
        { title: "Write technical blog posts", detail: "2 posts about what you built and why. Dev.to or Hashnode. Shows communication skills." },
      ]},
      { name: "Week 5–6 · Visibility", steps: [
        { title: "Optimize LinkedIn", detail: "Headline: 'Software Engineer | React, Node.js, PostgreSQL'. Featured section: your best projects." },
        { title: "Share your work on Twitter", detail: "Screenshot your dashboard, tweet about a bug you solved. Developers hire people they see building." },
        { title: "Apply to 50 jobs", detail: "Tailored applications only. Use the /Resume command, then /CoverLetter. Track in a spreadsheet." },
        { title: "Practice system design", detail: "Read 'System Design Interview' by Alex Xu. Practice whiteboarding. This separates junior from senior." },
      ]},
    ],
  },
  {
    id: "youtube-10k",
    title: "Grow a YouTube Channel from 0 to 10K Subscribers",
    tagline: "Niche, content, SEO, consistency — the creator growth playbook.",
    audience: "Creators",
    duration: "6 months",
    phases: [
      { name: "Month 1 · Foundation", steps: [
        { title: "Pick a narrow niche", detail: "'Build in public tutorials' beats 'tech videos'. The narrower, the faster you grow. You can broaden later." },
        { title: "Set up your channel", detail: "Channel art, profile pic, About section, links. Consistent branding across YouTube, Twitter, and newsletter." },
        { title: "Plan 12 videos (3 months)", detail: "4 per month: 2 searchable (tutorials), 1 trending (news/reaction), 1 personality (story/vlog)." },
        { title: "Film your first 4 videos", detail: "Screen recordings are easiest to start. OBS + your voice is enough. Don't wait for a fancy setup." },
      ]},
      { name: "Month 2–3 · Optimize", steps: [
        { title: "Master YouTube SEO", detail: "TubeBuddy or vidIQ (free tier). Keyword research in title, description, tags. Searchable content is the growth engine." },
        { title: "Improve thumbnails", detail: "CTR > everything. High contrast, 3 words max, readable at phone size. Study what works in your niche." },
        { title: "Study retention graphs", detail: "YouTube Studio shows where viewers drop off. Fix the boring parts. Front-load value in the first 30 seconds." },
        { title: "Post consistently", detail: "Same day, same time, every week. The algorithm rewards consistency. Don't disappear for 2 weeks." },
      ]},
      { name: "Month 4–6 · Scale", steps: [
        { title: "Collaborate with similar channels", detail: "2 channels at your level = mutual growth. Joint videos, shoutouts, podcast appearances." },
        { title: "Build an email list", detail: "Link in every video description. Your email list is algorithm-proof. Beehiiv or ConvertKit (free tier)." },
        { title: "Repurpose content", detail: "YouTube → Shorts → TikTok → Twitter clips → Newsletter. 1 video = 5 pieces of content." },
        { title: "Analyze what works", detail: "YouTube Analytics: best-performing topics, audience demographics, watch time. Double down on winners." },
      ]},
    ],
  },
];
