export default [
  {
    category: "Learning & Education",
    type: "learning",
    icon: "GraduationCap",
    groups: [
      {
        variants: ["chatgpt", "gemini", "claude", "perplexity", "copilot", "deepseek"],
        verbs: [
          ["StudyPlan", "Planning", "draft a week-by-week study plan for", "State the exam date, hours you can honestly give per day and your weakest topics.", "a dated plan with revision buffers and a catch-up rule"],
          ["NotesFrom", "Notes", "compress lecture notes into layered recall notes for", "Paste the notes; say whether you want Cornell, Q/A or mind-map style.", "layered notes: 1-line summary, key points, deep details"],
          ["RecallQuiz", "Quizzing", "generate an active-recall quiz with answers hidden until you try for", "Paste the material and pick question count and mix (MCQ, short, long).", "a quiz with a scoring key and a re-try list"],
          ["ExplainLike", "Explainers", "explain a concept at three depths for", "Name the concept and one thing you already understand.", "ELI5, exam-level and expert-level explanations"],
          ["PastPaper", "Practice", "simulate a past-paper drill for", "Say the subject, the board/university and the year range.", "a timed paper with marking-scheme style answers"],
          ["DoubtSolver", "Doubts", " untangle one specific doubt step by step for", "Paste the exact question and where your brain got stuck.", "a step-by-step resolution plus the misconception it fixes"],
          ["FormulaSheet", "Formulas", "build a one-page formula sheet for", "List the chapters. Say whether derivations should be included.", "a printable sheet grouped by chapter with memory hooks"],
          ["RevisionSprint", "Revision", "run a 3-day revision sprint for", "State the test date, what you already revised and what you avoid.", "hour-by-hour sprint with spaced-repeats on day 3"],
          ["ProjectReport", "Projects", "structure a science or class project report for", "Describe the project and the format your school demands.", "a section-by-section skeleton with sample phrasing"],
          ["PresentationPrep", "Vivas", "prep for a viva or presentation on", "Name the topic, the panel type and the time limit.", "likely questions with model answers and a 60-second opener"],
        ],
        objects: [
          ["Boards", "board exams", "boards, class-12, exam", "CBSE Physics, 9 weeks out, weak on rotational motion"],
          ["JEE", "JEE prep", "jee, entrance, engineering", "Mains in 14 weeks, maths lagging"],
          ["Neet", "NEET prep", "neet, entrance, medical", "Biology strong, physics numericals weak"],
          ["Semester", "semester finals", "semester, university, finals", "5 papers in 3 weeks, one backlog"],
          ["Backlog", "backlog papers", "backlog, supplementary, exam", "one backlog paper, first attempt failed at 38%"],
          ["Upskill", "upskilling", "upskill, career, course", "a support agent moving to QA, 6 hours a week"],
          ["Certification", "a certification", "certification, exam, prep", "AWS CCP in 3 weekends"],
          ["LanguageTest", "a language test", "ielts, toefl, language", "IELTS band 7.5 target, writing stuck at 6.5"],
          ["InterviewPrep", "placement season", "placement, campus, interview", "tier-3 college, DSA from scratch, 4 months"],
          ["Scholarship", "a scholarship application", "scholarship, essay, application", "need-based, 500-word essay, deadline in 10 days"],
        ],
      },
    ],
  },
];
