export default [
  {
    category: "Business & Management",
    type: "business",
    icon: "Briefcase",
    groups: [
      {
        variants: ["chatgpt", "gemini", "claude", "perplexity", "copilot", "deepseek"],
        verbs: [
          ["EmailPolish", "Emails", "rewrite a work email so it is clear, short and impossible to misread for", "Paste the draft and say the stakes: routine, delicate or career-defining.", "three versions: crisp, warm and firm"],
          ["MeetingMinutes", "Meetings", "turn raw meeting notes into clean minutes with owners for", "Paste your messy notes or the transcript; list who attended.", "decisions, action items with owner and date, and open risks"],
          ["DeckScaffold", "Decks", "outline a slide deck that survives being read without you for", "State the audience, the decision you want and the time slot.", "a slide-by-slide outline with headline-as-takeaway titles"],
          ["StatusUpdate", "Updates", "write a stakeholder update that leads with the headline for", "List what shipped, what slipped and what you need. Say the cadence.", "a 5-line update: shipped, slipping, risks, asks, next"],
          ["PerfSelf", "Reviews", "draft a self-review with evidence, not adjectives for", "List 3-5 things you shipped this cycle with numbers if you have them.", "a self-review in your company's format, each claim backed"],
          ["DifficultChat", "1:1s", "script a difficult conversation for", "Describe the situation, the person and the outcome you want. Note history that matters.", "an opener, three calibrated questions and a fallback line"],
          ["Prioritise", "Prioritising", "triage my task list with an impact/effort matrix for", "Dump the list. Flag anything with a real deadline today.", "a ranked list with a do-now, schedule and decline column"],
          ["SprintPlan", "Sprints", "assemble a sprint plan with capacity honesty for", "Paste the backlog and your team's real availability (holidays, on-call).", "a committed scope, a stretch list and a cut-line"],
          ["DocDraft", "Docs", "write a crisp internal doc (one-pager) proposing", "State the problem, your recommended fix and known costs.", "an RFC-style one-pager: problem, options, recommendation, risks"],
          ["InterviewLoop", "Hiring", "design an interview loop and scorecard for", "Name the role, the level and the top three failure modes you're hiring against.", "a loop plan, per-stage questions and a 1-5 scorecard"],
        ],
        objects: [
          ["Manager", "your manager", "manager, upward, comms", "quarter-end, one slipped deliverable, review season"],
          ["Client", "a client", "client, external, account", "renewal in 6 weeks, two escalations open"],
          ["ExecTeam", "the exec team", "executive, leadership, briefing", "5-minute slot, decision needed on tooling spend"],
          ["NewHire", "a new hire", "onboarding, junior, buddy", "week one, needs a 30/60/90 plan"],
          ["Vendor", "a vendor", "vendor, procurement, renewal", "renewal quote came in 40% higher"],
          ["RemoteTeam", "a remote team", "remote, async, timezone", "3 timezones, decisions stalling in chat"],
          ["HR", "HR", "hr, policy, people", "flagging a process gap without naming names"],
          ["Recruiter", "a recruiter", "recruiter, job, offer", "competing offer in hand, want one week"],
          ["Stakeholders", "cross-team stakeholders", "stakeholders, cross-functional, alignment", "launch blocked on two teams' sign-off"],
          ["BoardDeck", "the board", "board, quarterly, reporting", "quarterly review, one metric dipped"],
        ],
      },
    ],
  },
];
