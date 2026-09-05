import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { h as cn } from "./slashkits-CB7bx4DD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { En as Check, Ot as Lightbulb, U as RotateCcw, Un as ArrowRight, Z as Play, dt as MicOff, i as X, on as Download, ut as Mic } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as E } from "../_libs/jspdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.interview-g-ptcCu5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ALL = [
	"junior",
	"mid",
	"senior"
];
var GENERAL_BEHAVIORAL = [
	{
		q: "Tell me about yourself and your background.",
		tips: "Give a 90-second arc: past, present, why this role. End on what you want next.",
		k: "background,experience,career,role,past,present"
	},
	{
		q: "Why do you want to work here?",
		tips: "Mention the company's product/work, plus one specific thing you can contribute.",
		k: "company,mission,product,contribution,research"
	},
	{
		q: "Describe a time you overcame a difficult challenge at work.",
		tips: "STAR: set the situation, your task, concrete actions, and a measurable result.",
		k: "challenge,problem,deadline,pressure,result,overcame"
	},
	{
		q: "Tell me about a mistake you made and what you learned.",
		tips: "Own the mistake fully, then show the system or habit you changed because of it.",
		k: "mistake,learned,failure,responsibility,improvement"
	},
	{
		q: "Describe a time you disagreed with a teammate or manager.",
		tips: "Show respect, evidence-based reasoning, and how you reached alignment.",
		k: "disagreement,feedback,conflict,compromise,alignment"
	},
	{
		q: "Tell me about a time you worked under a tight deadline.",
		tips: "Pick a real deadline, describe prioritisation and trade-offs, and state the outcome.",
		k: "deadline,priority,pressure,planning,tradeoff"
	},
	{
		q: "Give an example of when you took initiative beyond your job description.",
		tips: "Choose something visible: an improvement others now use, not just extra hours.",
		k: "initiative,ownership,improvement,impact,proactive"
	},
	{
		q: "Tell me about a time you received difficult feedback.",
		tips: "Show you listen without defensiveness and that you acted on it.",
		k: "feedback,criticism,listening,growth,action"
	},
	{
		q: "Describe a project you are most proud of.",
		tips: "Focus on your specific contribution, the obstacles, and the outcome with numbers.",
		k: "proud,project,achievement,contribution,result"
	},
	{
		q: "Tell me about a time you helped a struggling teammate.",
		tips: "Show empathy, concrete help, and that you did not take credit away from them.",
		k: "team,help,mentor,support,collaboration"
	},
	{
		q: "Describe a time you had to learn something quickly.",
		tips: "Show your learning method: what you did, how long it took, and the result.",
		k: "learn,quickly,skill,self-study,result"
	},
	{
		q: "Tell me about a time you persuaded someone to change their mind.",
		tips: "Explain the data or story you used and the eventual outcome.",
		k: "persuade,influence,stakeholder,data,outcome"
	},
	{
		q: "Describe a time you missed a goal or deadline.",
		tips: "Be honest about cause, then the fix you put in place so it did not recur.",
		k: "missed,deadline,goal,honest,recovery,process"
	},
	{
		q: "Tell me about a time you had to deal with ambiguity.",
		tips: "Show how you reduced uncertainty: questions asked, options compared, decision made.",
		k: "ambiguity,uncertainty,decision,analysis,clarity"
	},
	{
		q: "Describe a time you went above and beyond for a customer or user.",
		tips: "Use a concrete story with the user's need, your action, and their reaction.",
		k: "customer,user,service,empathy,outcome"
	},
	{
		q: "Tell me about a time you worked with a difficult stakeholder.",
		tips: "Stay professional: describe their need, your communication approach, resolution.",
		k: "stakeholder,difficult,communication,relationship,resolution"
	},
	{
		q: "Describe a time you prioritised multiple competing demands.",
		tips: "Show your framework: impact vs urgency, what you deferred, and why it worked.",
		k: "priority,competing,impact,urgency,framework"
	},
	{
		q: "Tell me about a time you led a team through change.",
		tips: "Explain the change, how you communicated, resistance you handled, and adoption.",
		k: "change,leadership,communication,resistance,adoption"
	},
	{
		q: "Describe a time you turned a vague idea into a working result.",
		tips: "Cover scope definition, first version, iteration, and final impact.",
		k: "idea,scope,vague,iteration,delivery"
	},
	{
		q: "Tell me about your greatest strength and one weakness.",
		tips: "Pick a real strength with evidence, and a weakness you are actively improving.",
		k: "strength,weakness,self-awareness,improvement,evidence"
	},
	{
		q: "Describe how you stay organised across a busy week.",
		tips: "Name the actual tools or routines you use and a result they produced.",
		k: "organisation,tools,routine,calendar,focus"
	},
	{
		q: "Tell me about a time you represented your team to leadership.",
		tips: "Show synthesis: turning team detail into a clear recommendation leadership acted on.",
		k: "presentation,leadership,representation,summary,decision"
	},
	{
		q: "Describe a time your first approach failed and you had to change direction.",
		tips: "Show resilience and judgment: when you knew to pivot and what the pivot was.",
		k: "failure,pivot,resilience,adapt,iteration"
	},
	{
		q: "Tell me about a time you spotted a problem nobody else had noticed.",
		tips: "Show your observation, how you raised it, and the impact of fixing it.",
		k: "problem,observation,initiative,impact,detail"
	},
	{
		q: "Describe a time you had to say no to a request.",
		tips: "Show respectful prioritisation: what you protected and what you offered instead.",
		k: "no,priority,scope,respect,alternative"
	},
	{
		q: "Tell me about a time you achieved something through teamwork.",
		tips: "Credit the team but make your own role specific and the shared result measurable.",
		k: "teamwork,collaboration,shared,result,role"
	}
];
var GENERAL_SITUATIONAL = [
	{
		q: "Your launch is delayed and the stakeholder is angry. What do you do?",
		tips: "Acknowledge first, then give facts, a revised plan, and what you are doing to prevent recurrence.",
		k: "delay,stakeholder,communication,plan,recovery"
	},
	{
		q: "Two seniors give you conflicting instructions for the same task. How do you proceed?",
		tips: "Do not guess: surface the conflict to both with the trade-offs and ask for a single decision.",
		k: "conflict,instructions,clarify,decision,tradeoff"
	},
	{
		q: "A teammate is about to ship something you believe is broken. What do you do?",
		tips: "Raise it privately with evidence first; escalate only if the risk stays unaddressed.",
		k: "quality,feedback,team,risk,evidence"
	},
	{
		q: "You discover you will not finish your work on time. What is your first move?",
		tips: "Tell the owner early, show options (scope, help, time), and let them choose.",
		k: "deadline,early,communication,scope,options"
	},
	{
		q: "A customer asks for a feature that contradicts the product roadmap. How do you respond?",
		tips: "Understand the underlying need, explain trade-offs honestly, and route it to the right owner.",
		k: "customer,roadmap,need,honesty,product"
	},
	{
		q: "Your manager is out sick on the day of a big decision you must make. What do you do?",
		tips: "Use the data you have, note assumptions, decide, and document for a quick review when they return.",
		k: "decision,ownership,assumption,documentation,manager"
	},
	{
		q: "You join a project that is already behind and morale is low. What is your approach?",
		tips: "Listen first, find one quick win, rebuild trust with small reliable deliveries.",
		k: "project,behind,morale,quickwin,trust"
	},
	{
		q: "Someone takes credit for your work in a meeting. What do you do?",
		tips: "Address privately, restate facts calmly, and let your output keep speaking in public forums.",
		k: "credit,conflict,professional,private,evidence"
	},
	{
		q: "The team argues in a meeting about the right approach. How do you help?",
		tips: "Reframe to shared goals, capture both options with criteria, and push for a decision with an owner.",
		k: "conflict,meeting,goals,decision,facilitation"
	},
	{
		q: "You realise a decision you made last week was wrong. What now?",
		tips: "Say so early, quantify impact, propose the correction, and capture the lesson.",
		k: "mistake,early,correction,impact,lesson"
	},
	{
		q: "A new hire asks you for help but you are overloaded. What do you do?",
		tips: "Help in a bounded way, set expectations, and point them to resources that build independence.",
		k: "mentor,help,overload,expectation,independence"
	},
	{
		q: "Your work gets a poor review from a peer you respect. How do you react?",
		tips: "Ask for specifics, separate signal from noise, thank them, and act on the top item.",
		k: "review,feedback,listen,specifics,growth"
	},
	{
		q: "The company changes direction and your current project becomes low priority. What do you do?",
		tips: "Accept quickly, hand over cleanly, and ask where your skills fit best next.",
		k: "change,pivot,handover,adapt,priorities"
	},
	{
		q: "You find a security or compliance issue in something you shipped. What do you do?",
		tips: "Do not hide it: flag immediately with facts, contain, and coordinate the fix.",
		k: "security,compliance,flag,contain,integrity"
	},
	{
		q: "Your best idea is rejected in a review. What is your next step?",
		tips: "Separate ego from outcome, learn the real objection, improve the idea or drop it with grace.",
		k: "rejection,feedback,improve,ego,iterate"
	},
	{
		q: "A key teammate leaves mid-project. How do you keep things moving?",
		tips: "Assess knowledge gaps, redistribute, simplify scope, and protect the team from overwork.",
		k: "attrition,knowledge,redistribute,scope,team"
	}
];
var GENERAL_HR = [
	{
		q: "Why are you leaving your current role?",
		tips: "Stay positive about the past; frame it as moving toward growth, not away from problems.",
		k: "leaving,positive,growth,career,future"
	},
	{
		q: "Where do you see yourself in five years?",
		tips: "Link ambition to this company's trajectory and the skills you want to build here.",
		k: "five-years,ambition,career,company,growth"
	},
	{
		q: "What are your salary expectations?",
		tips: "Give a researched range and note you value the role's scope, not just the number.",
		k: "salary,range,research,expectations,negotiation"
	},
	{
		q: "Why should we hire you over other candidates?",
		tips: "Pick two differentiators with evidence and connect them to this role's top need.",
		k: "differentiator,evidence,role,value,strengths"
	},
	{
		q: "Tell me about your ideal manager.",
		tips: "Describe what helps you do your best work — feedback style, trust, clarity — not a wish list.",
		k: "manager,feedback,trust,clarity,workstyle"
	},
	{
		q: "How do you handle working under pressure?",
		tips: "Show a system (prioritise, communicate, breathe) plus one real pressured moment.",
		k: "pressure,system,prioritise,communication,example"
	},
	{
		q: "Are you comfortable with remote or hybrid work?",
		tips: "State your preference honestly and prove you stay connected and visible either way.",
		k: "remote,hybrid,communication,discipline,visibility"
	},
	{
		q: "What do you do when you do not know the answer?",
		tips: "Show research skills first, then asking well-scoped questions — with a real example.",
		k: "unknown,research,questions,resourceful,example"
	},
	{
		q: "What motivates you to do great work?",
		tips: "Name one intrinsic driver and prove it with a past moment of sustained effort.",
		k: "motivation,effort,passion,ownership,evidence"
	},
	{
		q: "Do you prefer working alone or in a team?",
		tips: "Both, with nuance: deep work alone, decisions and reviews with the team.",
		k: "alone,team,balance,focus,collaboration"
	},
	{
		q: "What questions do you have for us?",
		tips: "Ask about outcomes, team, and growth — never just perks.",
		k: "questions,outcomes,team,growth,role"
	},
	{
		q: "Describe your ideal work environment.",
		tips: "Focus on conditions that produce your best work: clarity, trust, feedback loops.",
		k: "environment,clarity,trust,feedback,productivity"
	},
	{
		q: "How do you keep your skills up to date?",
		tips: "Name specific habits: projects, courses, communities, reading — with one recent example.",
		k: "learning,habits,courses,community,example"
	},
	{
		q: "What would make you reject an offer?",
		tips: "Honest deal-breakers framed as values (impact, growth, trust) rather than demands.",
		k: "offer,values,impact,growth,decision"
	},
	{
		q: "Tell me about a time you were not happy in a role.",
		tips: "Choose a fit or growth issue, own your part, and show what you did about it.",
		k: "unhappy,fit,growth,ownership,resolution"
	},
	{
		q: "How do you handle constructive criticism?",
		tips: "Show a feedback loop: listen, clarify, thank, act, and check back.",
		k: "criticism,feedback,listen,act,followup"
	},
	{
		q: "What do you know about our company and products?",
		tips: "Give proof of research: a product detail, a recent move, and why it interests you.",
		k: "company,research,products,recent,interest"
	},
	{
		q: "What is your notice period and availability?",
		tips: "Be direct and concise; mention flexibility without overpromising.",
		k: "notice,availability,startdate,direct,flexible"
	},
	{
		q: "How would your colleagues describe you?",
		tips: "Use two traits with a short story each from real coworkers' words.",
		k: "colleagues,traits,evidence,team,reputation"
	},
	{
		q: "What accomplishment are you most proud of outside work?",
		tips: "Pick something that reveals transferable traits — consistency, learning, leadership.",
		k: "outside,achievement,consistency,learning,character"
	}
];
var ROLE_BEHAVIORAL = {
	developer: [
		{
			q: "Tell me about the most complex bug you ever fixed.",
			tips: "STAR with the system, your diagnosis method, the fix, and the regression guard you added.",
			k: "bug,debugging,production,diagnosis,root-cause"
		},
		{
			q: "Describe a time you improved a slow or flaky system.",
			tips: "Show how you measured first, found the bottleneck, and proved the improvement with numbers.",
			k: "performance,optimisation,measure,benchmark,improvement"
		},
		{
			q: "Tell me about a time you had to refactor legacy code.",
			tips: "Explain how you kept behaviour safe (tests/feature flags) while reducing debt.",
			k: "refactor,legacy,tests,technical-debt,safety"
		},
		{
			q: "Describe a code review that changed how you write code.",
			tips: "Show you welcome critique and can name a concrete habit it created.",
			k: "code-review,feedback,quality,habit,learning"
		},
		{
			q: "Tell me about a production incident you helped resolve.",
			tips: "Cover detection, triage, mitigation, and the postmortem follow-ups.",
			k: "incident,production,oncall,postmortem,mitigation"
		}
	],
	designer: [
		{
			q: "Tell me about a design you shipped that did not work as expected.",
			tips: "Show how you measured, what you learned, and how you iterated.",
			k: "design,shipped,metrics,iterate,learning"
		},
		{
			q: "Describe a time you used user research to change a decision.",
			tips: "Name the method, the insight, and how the design changed because of it.",
			k: "research,usertesting,insight,decision,iteration"
		},
		{
			q: "Tell me about a time stakeholders rejected your design.",
			tips: "Show how you separated feedback signal from noise and found the real constraint.",
			k: "stakeholder,feedback,constraint,iteration,communication"
		},
		{
			q: "Describe how you handled a tight timeline for a full design system or key screen.",
			tips: "Show scope discipline: what you shipped, what you cut, and how you communicated it.",
			k: "deadline,scope,designsystem,tradeoff,delivery"
		},
		{
			q: "Tell me about a time accessibility changed your design.",
			tips: "Show a concrete a11y win and the process you now follow by default.",
			k: "accessibility,contrast,inclusive,process,win"
		}
	],
	manager: [
		{
			q: "Tell me about a direct report you helped turn around.",
			tips: "Show diagnosis, coaching plan, honest feedback, and the outcome for them and the team.",
			k: "coaching,feedback,development,turnaround,outcome"
		},
		{
			q: "Describe a time you had to let someone go.",
			tips: "Show fairness, documentation, respect, and how you protected the team through it.",
			k: "termination,respect,fairness,communication,team"
		},
		{
			q: "Tell me about a time you resolved a conflict between two team members.",
			tips: "Show mediation: separate meetings, shared interests, and a workable agreement.",
			k: "conflict,mediation,team,resolution,listening"
		},
		{
			q: "Describe how you set goals with your team.",
			tips: "Show the framework (OKRs or similar), how you make goals measurable, and review cadence.",
			k: "goals,okr,measurement,alignment,review"
		},
		{
			q: "Tell me about a time you had to deliver bad news upward.",
			tips: "Show honesty with data, options you brought, and how you kept trust.",
			k: "badnews,leadership,honesty,data,options"
		}
	],
	marketing: [
		{
			q: "Tell me about a campaign that underperformed and what you changed.",
			tips: "Show the metrics, the hypothesis, the diagnosis, and the improved result.",
			k: "campaign,metrics,underperform,optimise,result"
		},
		{
			q: "Describe a time you grew an audience or channel significantly.",
			tips: "Name the channel, the content/strategy, and the numbers that prove growth.",
			k: "growth,channel,content,strategy,metrics"
		},
		{
			q: "Tell me about a time brand and performance goals conflicted.",
			tips: "Show how you balanced long-term brand building with short-term targets.",
			k: "brand,performance,balance,targets,strategy"
		},
		{
			q: "Describe a successful launch you helped run.",
			tips: "Cover positioning, channel mix, coordination, and the launch metrics.",
			k: "launch,positioning,channels,coordination,metrics"
		},
		{
			q: "Tell me about a time you turned negative feedback into a marketing win.",
			tips: "Show listening, response strategy, and the measurable shift in sentiment.",
			k: "feedback,sentiment,response,listening,win"
		}
	],
	sales: [
		{
			q: "Tell me about your biggest deal and how you closed it.",
			tips: "Show qualification, stakeholders mapped, objection handling, and the final close.",
			k: "deal,close,qualification,stakeholders,objections"
		},
		{
			q: "Describe a deal you lost and what you learned.",
			tips: "Show honest analysis, what the loss revealed, and the change in your process.",
			k: "lost,deal,analysis,learning,process"
		},
		{
			q: "Tell me about a time you turned around an unhappy customer.",
			tips: "Show listening, a concrete fix, and how you rebuilt trust.",
			k: "customer,retention,turnaround,trust,fix"
		},
		{
			q: "Describe how you build pipeline in a new territory.",
			tips: "Show outreach mix, targeting, and measurable pipeline results.",
			k: "pipeline,outreach,territory,targeting,results"
		},
		{
			q: "Tell me about a time you negotiated against a tough procurement team.",
			tips: "Show preparation, value framing, concessions traded, and the outcome.",
			k: "negotiation,procurement,value,concessions,outcome"
		}
	],
	data: [
		{
			q: "Tell me about an analysis that changed a business decision.",
			tips: "Show the question, data, method, and the decision your insight drove.",
			k: "analysis,decision,insight,impact,business"
		},
		{
			q: "Describe a time your data disagreed with everyone's intuition.",
			tips: "Show how you validated the data and communicated an unpopular finding.",
			k: "data,disagreement,validation,communication,findings"
		},
		{
			q: "Tell me about a messy dataset you cleaned and what you found.",
			tips: "Cover the quality issues, your cleaning rules, and downstream impact.",
			k: "data-quality,cleaning,transformation,impact,rules"
		},
		{
			q: "Describe a dashboard or report people actually use.",
			tips: "Show you designed for decisions, not just metrics, with evidence of usage.",
			k: "dashboard,report,usage,decisions,design"
		},
		{
			q: "Tell me about a time a model or analysis failed in production.",
			tips: "Show monitoring, root cause, retraining or correction, and prevention.",
			k: "model,failure,monitoring,rootcause,prevention"
		}
	],
	product: [
		{
			q: "Tell me about a feature you shipped that users ignored.",
			tips: "Show the metric, the diagnosis (usage, discoverability, need), and what you changed.",
			k: "feature,usage,metrics,diagnosis,iteration"
		},
		{
			q: "Describe a time you killed a project you had championed.",
			tips: "Show objective criteria, stakeholder honesty, and a clean decision.",
			k: "kill,project,decision,criteria,honesty"
		},
		{
			q: "Tell me about a time customer feedback changed your roadmap.",
			tips: "Show how you prioritised one voice against the plan and the result.",
			k: "customer,roadmap,feedback,prioritise,result"
		},
		{
			q: "Describe a launch where everything went wrong.",
			tips: "Cover what broke, how you recovered, and what you changed for next time.",
			k: "launch,failure,recovery,lessons,process"
		},
		{
			q: "Tell me about a time you had to say no to a big stakeholder request.",
			tips: "Show data-based prioritisation and the alternative you offered.",
			k: "no,stakeholder,prioritisation,data,alternative"
		}
	],
	general: []
};
var ROLE_SITUATIONAL = {
	developer: [
		{
			q: "A critical bug ships to production on a Friday evening. Walk me through your response.",
			tips: "Triage first: severity, users affected, rollback vs hotfix, then postmortem discipline.",
			k: "production,bug,triage,rollback,postmortem"
		},
		{
			q: "A teammate writes code that works but is hard to maintain. What do you do?",
			tips: "Review with concrete suggestions, agree on standards, and share ownership of the fix.",
			k: "maintainability,review,standards,feedback,team"
		},
		{
			q: "You estimate a task will take two days but it is clearly going to take five. What now?",
			tips: "Surface early with options — scope cut, help, or time — and document the drift reason.",
			k: "estimate,deadline,scope,communication,options"
		},
		{
			q: "A legacy system has no tests and you must change it. How do you proceed?",
			tips: "Add characterisation tests around the behaviour you touch before changing it.",
			k: "legacy,tests,safety,refactor,risk"
		},
		{
			q: "Your team disagrees on the architecture for a new service. How do you help decide?",
			tips: "Turn opinions into criteria — scale, team skill, ops cost — and drive a decision with an owner.",
			k: "architecture,decision,criteria,team,ownership"
		}
	],
	designer: [
		{
			q: "You have one hour to present a solution for a problem you have never seen. What do you do?",
			tips: "Clarify the user and goal first, sketch three directions, recommend one with rationale.",
			k: "timebox,clarity,sketch,directions,recommendation"
		},
		{
			q: "Engineering says your design is too expensive to build. How do you respond?",
			tips: "Ask what is expensive, explore a tiered build (v1 vs ideal), and protect the core experience.",
			k: "engineering,constraints,iteration,v1,tradeoff"
		},
		{
			q: "Two executives want different designs for the same page. How do you proceed?",
			tips: "Bring them together around user goals and data, and propose a decision framework.",
			k: "executives,alignment,goals,data,facilitation"
		},
		{
			q: "A usability test shows users failing at your newest flow. What do you do?",
			tips: "Thank the testers, find the pattern in failures, redesign the smallest piece first.",
			k: "usability,testing,failure,redesign,iterate"
		},
		{
			q: "You inherit a design system with inconsistent components. Where do you start?",
			tips: "Audit usage, standardise the highest-traffic components first, and document tokens.",
			k: "designsystem,audit,standardisation,tokens,priorities"
		}
	],
	manager: [
		{
			q: "Two of your best engineers want to leave. What is your first move?",
			tips: "Listen individually without selling, find the real drivers, and act on what you can control.",
			k: "retention,listening,drivers,action,career"
		},
		{
			q: "Your team misses a sprint commitment. How do you handle it?",
			tips: "Blame the plan not the people, find the systemic cause, and adjust the commitment process.",
			k: "sprint,planning,commitment,systemic,process"
		},
		{
			q: "A senior leader asks you to cut your team by 20%. How do you respond?",
			tips: "Ask about priorities and timeline, propose options with impact, and protect the team's dignity.",
			k: "cut,layoffs,priorities,options,communication"
		},
		{
			q: "Two teams keep blaming each other for a shared failure. What do you do?",
			tips: "Create one shared problem statement, a joint postmortem, and co-owned action items.",
			k: "conflict,teams,postmortem,ownership,alignment"
		},
		{
			q: "Your best performer starts coasting. How do you approach them?",
			tips: "Have an honest conversation about motivation, then adjust goals or challenges accordingly.",
			k: "performance,motivation,feedback,challenge,conversation"
		}
	],
	marketing: [
		{
			q: "A campaign goes viral for the wrong reason. What do you do first?",
			tips: "Assess tone and risk, pause if needed, respond authentically, and align with leadership.",
			k: "viral,crisis,response,authenticity,leadership"
		},
		{
			q: "Your budget is cut 30% mid-quarter. How do you keep delivering?",
			tips: "Rank channels by ROI, protect proven performers, and renegotiate what success looks like.",
			k: "budget,roi,channels,priorities,negotiate"
		},
		{
			q: "The CEO wants a campaign that conflicts with the brand voice. How do you handle it?",
			tips: "Understand the goal behind the request, propose on-brand alternatives, and give a recommendation.",
			k: "ceo,brand,voice,alternative,recommendation"
		},
		{
			q: "Organic reach drops suddenly on your main channel. What do you check?",
			tips: "Algorithm change, content performance, and audience feedback — then adapt the mix.",
			k: "reach,algorithm,analysis,adapt,content"
		},
		{
			q: "Sales says leads from marketing are low quality. How do you respond?",
			tips: "Agree on a definition of quality first, review handoff data, and fix the funnel together.",
			k: "leads,quality,sales,alignment,funnel"
		}
	],
	sales: [
		{
			q: "A prospect goes silent after three strong meetings. What do you do?",
			tips: "Re-engage with value, not pressure; uncover the real blocker or decision change.",
			k: "prospect,silence,value,blocker,followup"
		},
		{
			q: "Your biggest customer threatens to churn. What is your plan?",
			tips: "Listen without defending, find the root dissatisfaction, and build a joint recovery plan.",
			k: "churn,retention,listening,recovery,customer"
		},
		{
			q: "The product demo breaks during a key call. What do you do?",
			tips: "Stay calm, pivot to value discussion, own the issue, and follow up with a recorded demo.",
			k: "demo,breakdown,calm,value,followup"
		},
		{
			q: "A competitor undercuts you on price at the last stage. How do you respond?",
			tips: "Re-anchor on ROI and risk, avoid a price war, and involve the champion internally.",
			k: "competitor,price,value,roi,champion"
		},
		{
			q: "Your quota changed upward mid-quarter. How do you react?",
			tips: "Rebuild the plan fast: pipeline gaps, focus segments, and what support you need.",
			k: "quota,plan,pipeline,focus,support"
		}
	],
	data: [
		{
			q: "An executive asks for a number you know is misleading. What do you do?",
			tips: "Provide the honest answer, explain the caveat simply, and offer the better metric.",
			k: "executive,honesty,metrics,communication,alternative"
		},
		{
			q: "Your pipeline breaks the night before a big report. What now?",
			tips: "Run a cached or manual version, communicate the limitation, then fix root cause.",
			k: "pipeline,breakdown,fallback,communication,rootcause"
		},
		{
			q: "Two teams interpret the same metric differently. How do you resolve it?",
			tips: "Define the metric's purpose together and write one shared definition with edge cases.",
			k: "metric,definition,alignment,teams,standards"
		},
		{
			q: "You find a data quality issue in a report leadership already used. What do you do?",
			tips: "Flag it immediately, quantify impact, correct it, and add a guardrail.",
			k: "data-quality,report,flag,correction,guardrail"
		},
		{
			q: "Someone asks for an analysis in two hours that needs two days. How do you handle it?",
			tips: "Scope an 80/20 version, state assumptions, deliver on time, and offer the full analysis after.",
			k: "timebox,scope,assumptions,delivery,followup"
		}
	],
	product: [
		{
			q: "Two customers request opposite things. How do you decide what to build?",
			tips: "Look at segments and frequency, and find the underlying jobs both want done.",
			k: "conflict,customers,segments,decision,jobs"
		},
		{
			q: "Engineering says a key feature will take three times longer than planned. What do you do?",
			tips: "Explore scope cuts that keep the core value, then reset expectations with stakeholders.",
			k: "scope,engineering,timeline,value,expectations"
		},
		{
			q: "A competitor ships a feature you planned for next quarter. How do you respond?",
			tips: "Assess real demand, avoid reacting blindly, and reposition your differentiator.",
			k: "competitor,roadmap,demand,positioning,strategy"
		},
		{
			q: "Your research contradicts what leadership wants to build. How do you proceed?",
			tips: "Present the evidence respectfully, propose a cheap experiment to settle it, and stay open.",
			k: "research,leadership,evidence,experiment,openness"
		},
		{
			q: "An urgent bug requires pausing your feature work. How do you manage it?",
			tips: "Protect the user impact, communicate the slip early, and keep the pause short and bounded.",
			k: "bug,priority,communication,scope,users"
		}
	],
	general: [
		{
			q: "You are given a task with no clear owner or process. How do you start?",
			tips: "Define done, find the closest stakeholders, and move forward with small checkpoints.",
			k: "ownership,ambiguity,definition,done,checkpoints"
		},
		{
			q: "Your idea is implemented differently from what you imagined. How do you react?",
			tips: "Judge the outcome against the goal, not your original sketch, and give specific feedback.",
			k: "implementation,outcome,goals,feedback,adapt"
		},
		{
			q: "A new tool is introduced that everyone struggles with. What do you do?",
			tips: "Learn it properly first, then help others with docs and quick tips you discovered.",
			k: "tool,learning,help,adoption,documentation"
		},
		{
			q: "You accidentally copied a colleague on a sensitive email. What do you do?",
			tips: "Acknowledge immediately, apologise briefly, and take steps to prevent recurrence.",
			k: "mistake,email,privacy,apology,prevention"
		},
		{
			q: "A meeting you organised is running late and off-topic. How do you handle it?",
			tips: "Park the tangent, restate remaining agenda items, and offer to follow up separately.",
			k: "meeting,agenda,time,decision,facilitation"
		},
		{
			q: "You are asked to train a new colleague during a busy week. What do you do?",
			tips: "Structure the handover, protect focus time, and make the colleague independent fast.",
			k: "training,handover,focus,independence,structure"
		}
	]
};
var TECHNICAL = {
	developer: [
		{
			q: "Explain the difference between REST and GraphQL.",
			tips: "Cover the data-fetching trade-offs, caching, and when each fits — with a short example.",
			k: "rest,graphql,api,overfetch,caching,example"
		},
		{
			q: "How does the event loop work in JavaScript?",
			tips: "Talk through the call stack, task queue, and microtasks, then a setTimeout/Promise example.",
			k: "eventloop,javascript,callstack,microtask,promise"
		},
		{
			q: "Explain closures and give a real use case.",
			tips: "Define the mechanism precisely and show a practical example like memoisation or privacy.",
			k: "closure,javascript,scope,memoisation,example"
		},
		{
			q: "What happens when you type a URL and press Enter?",
			tips: "Walk DNS, TCP/TLS, HTTP request, server, response, and rendering — keep it structured.",
			k: "dns,tcp,tls,http,rendering,request"
		},
		{
			q: "Explain how you would design a URL shortener.",
			tips: "Cover encoding, storage, redirects, collisions, analytics, and scale assumptions.",
			k: "system-design,url,shortener,storage,scale,redirect"
		},
		{
			q: "What is the difference between process and thread?",
			tips: "Define memory isolation, context switching, and where concurrency actually helps.",
			k: "process,thread,memory,concurrency,scheduling"
		},
		{
			q: "Explain indexes in a database. When do they hurt?",
			tips: "Cover B-tree basics, covering indexes, write amplification, and cardinality.",
			k: "index,database,query,write-amplification,performance"
		},
		{
			q: "What does 'idempotent' mean and why does it matter for APIs?",
			tips: "Define the property and show retry-safe payment or webhook examples.",
			k: "idempotency,api,retry,webhook,payments"
		},
		{
			q: "Explain how you would make an API fast.",
			tips: "Cover caching layers, query optimisation, pagination, and profiling first.",
			k: "performance,api,caching,profiling,pagination"
		},
		{
			q: "What is the difference between == and === in JavaScript?",
			tips: "Explain type coercion and give the trap examples that justify strict equality.",
			k: "javascript,equality,coercion,strict,comparison"
		},
		{
			q: "Explain prototypal inheritance in JavaScript.",
			tips: "Describe the prototype chain with a small example and Object.create/class comparison.",
			k: "prototype,inheritance,javascript,object,chain"
		},
		{
			q: "What is a deadlock and how do you avoid one?",
			tips: "Define the four conditions and show lock ordering or timeout strategies.",
			k: "deadlock,lock,concurrency,threads,ordering"
		},
		{
			q: "Explain the CAP theorem.",
			tips: "Describe consistency, availability, partition tolerance and when each trade-off is right.",
			k: "cap,consistency,availability,partition,distributed"
		},
		{
			q: "How would you debug a memory leak in a Node.js app?",
			tips: "Show heap snapshots, comparing snapshots, and common leak causes like globals and listeners.",
			k: "memory,leak,node,heap,snapshot"
		},
		{
			q: "What is a race condition? Give an example.",
			tips: "Show a concrete increment example and the fix (atomicity, locks, or single-threaded model).",
			k: "race,concurrency,atomicity,locks,example"
		},
		{
			q: "Explain ACID in databases.",
			tips: "Define atomicity, consistency, isolation, durability and give one practical isolation story.",
			k: "acid,transaction,database,isolation,durability"
		},
		{
			q: "How does HTTPS work at a high level?",
			tips: "Explain the TLS handshake, certificates, symmetric vs asymmetric keys, and trust.",
			k: "https,tls,certificate,handshake,encryption"
		},
		{
			q: "What is the difference between SQL and NoSQL?",
			tips: "Compare schemas, scaling models, consistency, and the right use cases for each.",
			k: "sql,nosql,schema,scale,consistency"
		},
		{
			q: "Explain how DNS works.",
			tips: "Walk recursion, TLD servers, caching, and TTLs from browser to IP.",
			k: "dns,recursion,ttl,cache,resolution"
		},
		{
			q: "What is load balancing and what strategies exist?",
			tips: "Cover round robin, least connections, sticky sessions, and health checks.",
			k: "loadbalancing,roundrobin,healthchecks,sticky,scaling"
		},
		{
			q: "Explain the difference between authentication and authorization.",
			tips: "Define both and map them to login flows, tokens, roles, and scopes.",
			k: "authentication,authorization,token,roles,scopes"
		},
		{
			q: "How would you store passwords securely?",
			tips: "Explain salted, slow hashing (bcrypt/argon2) and why plain hashing is not enough.",
			k: "password,hashing,bcrypt,salt,security"
		},
		{
			q: "What is the difference between horizontal and vertical scaling?",
			tips: "Define both, their limits, and when each is the right move with examples.",
			k: "scaling,horizontal,vertical,limits,examples"
		},
		{
			q: "Explain how git merge and git rebase differ.",
			tips: "Cover history shape, conflict handling, and when rebase is and is not safe.",
			k: "git,merge,rebase,history,conflict"
		},
		{
			q: "What is a CDN and why use one?",
			tips: "Cover edge caching, latency, origin offload, and cache invalidation basics.",
			k: "cdn,edge,caching,latency,origin"
		},
		{
			q: "Explain the concept of immutability in programming.",
			tips: "Define it, show a mutable bug, and discuss where immutability simplifies state.",
			k: "immutability,state,functions,pure,example"
		},
		{
			q: "How do you test a feature end to end?",
			tips: "Describe the test pyramid, a real e2e scenario, and how you keep tests from being flaky.",
			k: "testing,e2e,pyramid,flakiness,automation"
		},
		{
			q: "What is the difference between a library and a framework?",
			tips: "Discuss inversion of control with concrete examples like React vs Next.js.",
			k: "library,framework,ioc,react,nextjs"
		},
		{
			q: "Explain what happens during a React re-render.",
			tips: "Cover state changes, reconciliation, keys, memoisation, and when re-renders are wasteful.",
			k: "react,rerender,reconciliation,keys,memo"
		},
		{
			q: "What is the virtual DOM?",
			tips: "Explain the diffing abstraction and why it is a performance technique, not magic.",
			k: "virtual-dom,react,diffing,performance,abstraction"
		},
		{
			q: "How would you secure a public API?",
			tips: "Cover rate limiting, auth, input validation, CORS, and least-privilege keys.",
			k: "api,security,ratelimiting,cors,validation"
		},
		{
			q: "Explain webhooks versus polling.",
			tips: "Compare latency, reliability, and complexity, and when each is the right pattern.",
			k: "webhook,polling,latency,reliability,pattern"
		},
		{
			q: "What is a monolith and what is microservices? When would you choose each?",
			tips: "Be honest about operational cost; discuss team size and failure isolation.",
			k: "monolith,microservices,architecture,team,ops"
		},
		{
			q: "Explain how you would approach adding a feature to an unfamiliar codebase.",
			tips: "Show a method: read entry points, trace data flow, write a failing test, then change.",
			k: "codebase,onboarding,tracing,tests,method"
		},
		{
			q: "What is the difference between TCP and UDP?",
			tips: "Cover reliability, ordering, handshake, and streaming/gaming use cases.",
			k: "tcp,udp,protocol,reliability,streaming"
		},
		{
			q: "Explain caching strategies: write-through, write-back, cache-aside.",
			tips: "Define each, plus invalidation and when to use which.",
			k: "caching,write-through,write-back,cache-aside,invalid"
		},
		{
			q: "How does a hash table work?",
			tips: "Explain hashing, collision handling, load factor, and amortised complexity.",
			k: "hashtable,hashing,collisions,complexity,data"
		},
		{
			q: "What is the time complexity of common sorting algorithms?",
			tips: "Compare quick, merge, and insertion sort with best/worst cases and stability notes.",
			k: "sorting,complexity,quicksort,mergesort,stability"
		},
		{
			q: "Explain what a reverse proxy does.",
			tips: "Cover load balancing, TLS termination, caching, and security benefits.",
			k: "reverse-proxy,nginx,tls,caching,security"
		},
		{
			q: "How would you design a chat application?",
			tips: "Cover messaging flow, presence, offline delivery, and scaling reads vs writes.",
			k: "chat,system-design,presence,websocket,scaling"
		}
	],
	data: [
		{
			q: "Explain the difference between correlation and causation.",
			tips: "Give a real example and the techniques used to establish causation.",
			k: "correlation,causation,example,experiment,analysis"
		},
		{
			q: "What is a p-value and how do you interpret it?",
			tips: "Define it under the null hypothesis and warn about common misinterpretations.",
			k: "pvalue,statistics,hypothesis,interpretation,testing"
		},
		{
			q: "Explain overfitting and how you avoid it.",
			tips: "Describe variance vs bias, cross-validation, regularisation, and more data.",
			k: "overfitting,bias,variance,crossvalidation,regularisation"
		},
		{
			q: "What is the difference between supervised and unsupervised learning?",
			tips: "Define both with examples: classification/regression vs clustering/dimensionality.",
			k: "supervised,unsupervised,classification,clustering,examples"
		},
		{
			q: "Explain what a SQL JOIN does with examples.",
			tips: "Walk inner, left, and full joins against two sample tables.",
			k: "sql,join,inner,left,example"
		},
		{
			q: "How would you handle missing data?",
			tips: "Discuss deletion vs imputation options and when each is defensible.",
			k: "missingdata,imputation,deletion,analysis,bias"
		},
		{
			q: "What is a/b testing and how do you run one properly?",
			tips: "Cover hypothesis, sample size, randomisation, significance, and guardrail metrics.",
			k: "abtesting,experiment,samplesize,randomisation,significance"
		},
		{
			q: "Explain precision and recall.",
			tips: "Use a concrete search or fraud example and discuss the precision-recall trade-off.",
			k: "precision,recall,f1,example,tradeoff"
		},
		{
			q: "What is the difference between a primary key and a unique key?",
			tips: "Cover nullability, purpose, and how each is used in relational design.",
			k: "primarykey,uniquekey,relational,null,database"
		},
		{
			q: "Explain how you would measure the impact of a feature.",
			tips: "Propose an experiment design, the metric, the counterfactual, and caveats.",
			k: "impact,metrics,experiment,counterfactual,caveats"
		},
		{
			q: "What is the difference between ETL and ELT?",
			tips: "Discuss transformation timing, storage evolution, and modern warehouse practice.",
			k: "etl,elt,pipeline,warehouse,transformation"
		},
		{
			q: "Explain what a cohort analysis is.",
			tips: "Describe grouping users by acquisition period and comparing behaviour over time.",
			k: "cohort,retention,analysis,acquisition,behaviour"
		},
		{
			q: "What is a normal distribution and why does it matter?",
			tips: "Cover the shape, standard deviations, central limit theorem, and when it misleads.",
			k: "normal,distribution,clt,standarddeviation,stats"
		},
		{
			q: "How would you detect anomalies in time-series data?",
			tips: "Discuss baselines, seasonality, statistical methods, and alert thresholds.",
			k: "anomaly,timeseries,seasonality,detection,thresholds"
		},
		{
			q: "What is the difference between a star and snowflake schema?",
			tips: "Describe dimension modelling and when each suits reporting needs.",
			k: "star,snowflake,schema,dimension,modelling"
		},
		{
			q: "Explain how you choose metrics for a new product.",
			tips: "Start with the user job, the input metric, and the one number that tells success.",
			k: "metrics,product,success,definition,users"
		},
		{
			q: "What is a moving average and when would you use one?",
			tips: "Explain smoothing, lag trade-offs, and use in trend analysis.",
			k: "movingaverage,smoothing,lag,trend,timeseries"
		},
		{
			q: "Explain the concept of a funnel and how to analyse drop-offs.",
			tips: "Describe step definition, segmenting drop-offs, and prioritising the biggest leak.",
			k: "funnel,conversion,dropoff,analysis,segments"
		},
		{
			q: "What is the difference between bagging and boosting?",
			tips: "Explain variance reduction vs bias reduction with random forests and gradient boosting.",
			k: "bagging,boosting,randomforest,gradientboosting,bias"
		},
		{
			q: "How would you estimate the number of active users from raw logs?",
			tips: "Show how you define active, deduplicate, handle timezones, and validate the count.",
			k: "metrics,logs,deduplication,timezone,definition"
		},
		{
			q: "What is a Pareto chart and when is it useful?",
			tips: "Explain the 80/20 rule visualisation for prioritising problem areas.",
			k: "pareto,8020,prioritisation,visualisation,quality"
		},
		{
			q: "Explain clustering with k-means and its limitations.",
			tips: "Describe the algorithm, choosing k, sensitivity to scale, and when it fails.",
			k: "kmeans,clustering,scale,sensitivity,algorithm"
		},
		{
			q: "What is the difference between structured and unstructured data?",
			tips: "Give examples of each and the tooling differences for processing them.",
			k: "structured,unstructured,examples,sql,processing"
		},
		{
			q: "How do you decide if a metric movement is real or noise?",
			tips: "Discuss variance, sample size, significance testing, and business context.",
			k: "noise,metrics,variance,significance,context"
		},
		{
			q: "Explain what a data warehouse is versus a data lake.",
			tips: "Contrast schema-on-write with schema-on-read and governance trade-offs.",
			k: "warehouse,lake,schema,governance,storage"
		},
		{
			q: "What is regression to the mean and why does it matter?",
			tips: "Explain with an example and how it can fake experiment results.",
			k: "regression,mean,experiment,example,bias"
		}
	],
	designer: [
		{
			q: "Walk me through your design process from brief to handoff.",
			tips: "Show research, ideation, iteration, and the deliverables engineering needs.",
			k: "process,brief,research,iteration,handoff"
		},
		{
			q: "How do you choose a colour palette for a product?",
			tips: "Discuss brand, accessibility contrast, hierarchy, and systematic tokens.",
			k: "colour,palette,accessibility,contrast,tokens"
		},
		{
			q: "Explain when you would use a modal versus a full page.",
			tips: "Focus on context, task interruption, and mobile ergonomics.",
			k: "modal,page,pattern,context,mobile"
		},
		{
			q: "What is the difference between UX and UI?",
			tips: "Define experience architecture vs visual surface with a concrete example.",
			k: "ux,ui,definition,example,experience"
		},
		{
			q: "How do you make a complex form easy to use?",
			tips: "Cover chunking, defaults, inline validation, and progressive disclosure.",
			k: "form,ux,validation,progressive,usability"
		},
		{
			q: "Explain the importance of whitespace in design.",
			tips: "Talk about hierarchy, readability, and rhythm with an example.",
			k: "whitespace,hierarchy,readability,rhythm,layout"
		},
		{
			q: "What is the difference between a wireframe and a prototype?",
			tips: "Define fidelity levels and what each is used to test.",
			k: "wireframe,prototype,fidelity,testing,definition"
		},
		{
			q: "How do you design for accessibility from the start?",
			tips: "Name the WCAG pillars you build in: contrast, targets, keyboard, screen readers.",
			k: "accessibility,wcag,contrast,keyboard,screenreader"
		},
		{
			q: "Explain how you would improve an onboarding flow.",
			tips: "Show how you find drop-off, reduce steps, set expectations, and measure activation.",
			k: "onboarding,activation,dropoff,metrics,flow"
		},
		{
			q: "How do you handle icon design consistency?",
			tips: "Discuss grid systems, stroke weight, optical alignment, and naming.",
			k: "icons,grid,consistency,stroke,alignment"
		},
		{
			q: "What is visual hierarchy and how do you create it?",
			tips: "Cover size, contrast, spacing, and typography weight with an example.",
			k: "hierarchy,contrast,typography,spacing,example"
		},
		{
			q: "Explain the difference between responsive and adaptive design.",
			tips: "Describe fluid layouts vs breakpoint-specific compositions.",
			k: "responsive,adaptive,breakpoints,fluid,layout"
		},
		{
			q: "How do you test designs with users on a small budget?",
			tips: "Suggest moderated hallway tests, remote sessions, and quick prototypes.",
			k: "testing,budget,usability,remote,prototype"
		},
		{
			q: "What is design debt and how do you manage it?",
			tips: "Define it like technical debt and show a triage process for paying it down.",
			k: "design-debt,triage,consistency,components,priorities"
		},
		{
			q: "How would you redesign an existing app without breaking it?",
			tips: "Use an audit, phased rollout, and measurable before/after checks.",
			k: "redesign,audit,rollout,phased,measurement"
		},
		{
			q: "Explain how typography affects readability.",
			tips: "Cover scale, line height, measure, and pairing with a real example.",
			k: "typography,readability,scale,lineheight,example"
		},
		{
			q: "What is the difference between a design system and a style guide?",
			tips: "Define systems as living product infrastructure vs static documentation.",
			k: "designsystem,styleguide,components,tokens,documentation"
		},
		{
			q: "How do you decide what goes on a landing page above the fold?",
			tips: "Prioritise the user's job, one clear message, and the primary action.",
			k: "landing,abovefold,message,cta,conversion"
		},
		{
			q: "Explain the F-pattern and when to use it.",
			tips: "Describe scanning behaviour and how layout follows reading gravity.",
			k: "fpattern,reading,layout,scanning,webdesign"
		},
		{
			q: "What makes a button feel tappable on mobile?",
			tips: "Discuss size, padding, visual affordance, and thumb reach.",
			k: "button,mobile,touch,affordance,size"
		},
		{
			q: "How do you approach motion and animation in UI?",
			tips: "Use motion for meaning — state, spatial memory — not decoration, with easing discipline.",
			k: "motion,animation,easing,state,performance"
		},
		{
			q: "What is the difference between a persona and a user journey?",
			tips: "Define audience archetypes vs experience steps and when each is used.",
			k: "persona,journey,user,research,archetype"
		},
		{
			q: "How would you improve search on an e-commerce site?",
			tips: "Discuss filters, autocomplete, result relevance signals, and empty states.",
			k: "search,ecommerce,filters,autocomplete,results"
		},
		{
			q: "Explain how you would design a dashboard for executives.",
			tips: "Lead with decisions and outliers, keep one screen, and avoid chart junk.",
			k: "dashboard,executives,decisions,charts,simplicity"
		}
	],
	manager: [
		{
			q: "How do you structure a one-on-one with a direct report?",
			tips: "Make it their agenda, use it for coaching and blockers, and keep notes.",
			k: "oneonone,coaching,agenda,feedback,notes"
		},
		{
			q: "How do you measure a team's health?",
			tips: "Cover delivery, satisfaction signals, churn risk, and burnout markers — not just output.",
			k: "teamhealth,metrics,engagement,churn,delivery"
		},
		{
			q: "Explain how you handle performance reviews.",
			tips: "Use continuous evidence, clear ratings, development focus, and no surprises.",
			k: "performance,review,feedback,development,evidence"
		},
		{
			q: "How do you decide what to delegate?",
			tips: "Match tasks to growth needs and capacity; delegate outcomes, not just tasks.",
			k: "delegation,ownership,growth,capacity,outcomes"
		},
		{
			q: "What does a good sprint or planning ritual look like to you?",
			tips: "Describe goal clarity, realistic scope, and a review loop that improves the next plan.",
			k: "planning,sprint,goals,scope,review"
		},
		{
			q: "How do you build trust with a new team?",
			tips: "Listen first, be consistent, make small reliable commitments, and be transparent.",
			k: "trust,listening,consistency,transparency,commitments"
		},
		{
			q: "Explain how you give feedback that changes behaviour.",
			tips: "Use specific, timely, behaviour-focused feedback with a clear impact statement.",
			k: "feedback,specific,timely,behaviour,impact"
		},
		{
			q: "How do you promote someone on your team?",
			tips: "Show the criteria, the evidence trail, and the stretch assignment that prepared them.",
			k: "promotion,criteria,evidence,development,recognition"
		},
		{
			q: "How do you handle a team member in denial about their performance?",
			tips: "Use concrete examples, listen for root causes, agree on a plan, and document honestly.",
			k: "performance,denial,feedback,plan,documentation"
		},
		{
			q: "What is your approach to hiring?",
			tips: "Describe role definition, structured interviews, diverse panels, and a clear bar.",
			k: "hiring,interviews,structured,bar,onboarding"
		},
		{
			q: "How do you balance shipping speed and quality?",
			tips: "Define quality in user terms, use staged rollout, and protect the release process.",
			k: "quality,speed,release,rollout,definition"
		},
		{
			q: "How do you manage a remote team?",
			tips: "Discuss async communication, written decisions, overlap hours, and trust over surveillance.",
			k: "remote,async,communication,trust,team"
		},
		{
			q: "How would you reorganise a team that is struggling?",
			tips: "Diagnose structure vs people issues first, then change scope deliberately with communication.",
			k: "reorganisation,structure,diagnosis,communication,change"
		},
		{
			q: "Explain how you would cut scope on a project.",
			tips: "Protect the core user promise, use a decision framework, and communicate trade-offs early.",
			k: "scope,project,tradeoff,priorities,communication"
		},
		{
			q: "What do you do when you inherit an underperforming team?",
			tips: "Assess quickly, fix systemic blockers first, set clear expectations, and celebrate early wins.",
			k: "underperformance,assessment,blockers,expectations,quickwins"
		},
		{
			q: "How do you create a culture of learning?",
			tips: "Model feedback seeking, budget for experiments, and review failures without blame.",
			k: "learning,culture,feedback,experiments,blameless"
		}
	],
	marketing: [
		{
			q: "Explain how you would launch a new product with no budget.",
			tips: "Leverage owned channels, community, founders' networks, and earned PR.",
			k: "launch,zerobudget,owned,community,pr"
		},
		{
			q: "How do you measure the ROI of a content campaign?",
			tips: "Attach each piece to funnel stage, use UTM discipline, and track assisted conversions.",
			k: "roi,content,utm,conversion,attribution"
		},
		{
			q: "What makes a headline effective?",
			tips: "Discuss clarity, curiosity gap, audience match, and A/B testing.",
			k: "headline,clarity,curiosity,copywriting,abtesting"
		},
		{
			q: "Explain the difference between SEO and SEM.",
			tips: "Define organic vs paid search, cost models, and when each wins.",
			k: "seo,sem,organic,paid,search"
		},
		{
			q: "How do you build a brand from zero?",
			tips: "Start with positioning, audience insight, a consistent voice, and proof points.",
			k: "brand,positioning,audience,voice,consistency"
		},
		{
			q: "What metrics would you watch for a subscription product?",
			tips: "Cover acquisition cost, activation, retention, churn, and lifetime value.",
			k: "subscription,cac,retention,churn,ltv"
		},
		{
			q: "How do you write copy that converts?",
			tips: "Focus on one outcome, benefits over features, proof, and a clear next step.",
			k: "copywriting,conversion,benefits,proof,cta"
		},
		{
			q: "Explain how you would grow an email list ethically.",
			tips: "Use lead magnets aligned to the offer and always make the value exchange clear.",
			k: "email,listbuilding,leadmagnet,permission,value"
		},
		{
			q: "How do you stay on top of platform algorithm changes?",
			tips: "Follow official announcements, run controlled tests, and diversify channels.",
			k: "algorithm,platform,testing,diversification,updates"
		},
		{
			q: "What is your process for a social media content calendar?",
			tips: "Balance pillars and formats, batch create, and review by performance.",
			k: "content,calendar,social,planning,performance"
		},
		{
			q: "How would you measure brand awareness?",
			tips: "Discuss aided/unaided recall, search volume, share of voice, and site-direct traffic.",
			k: "awareness,recall,shareofvoice,search,metrics"
		},
		{
			q: "Explain the marketing funnel and how you optimise each stage.",
			tips: "Define awareness to advocacy, then pick the stage with the biggest leak first.",
			k: "funnel,awareness,conversion,optimisation,leak"
		},
		{
			q: "How do you handle a PR crisis on social media?",
			tips: "Pause scheduled posts, align with leadership, respond authentically once, and monitor.",
			k: "crisis,pr,social,response,leadership"
		},
		{
			q: "What is A/B testing in marketing and how do you set one up?",
			tips: "Pick one variable, define the metric, reach significance, and implement the winner.",
			k: "abtesting,variation,metric,significance,experiment"
		},
		{
			q: "How do you segment an email list for better results?",
			tips: "Segment by behaviour and lifecycle stage, then tailor content to each group.",
			k: "segmentation,email,behaviour,lifecycle,personalisation"
		},
		{
			q: "How would you market to a technical audience?",
			tips: "Lead with substance: docs, benchmarks, code samples, and developer advocates.",
			k: "technical,audience,docs,benchmarks,developers"
		}
	],
	sales: [
		{
			q: "Explain your sales process from lead to close.",
			tips: "Show qualification, discovery, demo, proposal, objection handling, and close steps.",
			k: "sales,process,qualification,discovery,close"
		},
		{
			q: "How do you find and prioritise prospects?",
			tips: "Describe ICP fit, intent signals, and scoring by deal size and likelihood.",
			k: "prospecting,icp,intent,scoring,prioritisation"
		},
		{
			q: "What is the most important part of a discovery call?",
			tips: "Listening for the problem, budget, decision process, and what success looks like.",
			k: "discovery,listening,problem,budget,decision"
		},
		{
			q: "How do you handle the price objection?",
			tips: "Re-anchor on value and ROI, explore the real budget constraint, and trade concessions.",
			k: "price,objection,value,roi,budget"
		},
		{
			q: "Explain how you would sell a product that is more expensive than competitors.",
			tips: "Sell outcomes and risk reduction, not features; quantify the difference in money terms.",
			k: "expensive,value,outcomes,risk,quantify"
		},
		{
			q: "What is the difference between inbound and outbound sales?",
			tips: "Describe buyer-initiated vs seller-initiated motions and how the messaging differs.",
			k: "inbound,outbound,leads,messaging,process"
		},
		{
			q: "How do you use CRM data in your day to day?",
			tips: "Show pipeline hygiene, follow-up discipline, and using history to personalise outreach.",
			k: "crm,pipeline,followup,data,personalisation"
		},
		{
			q: "How would you sell to a committee of five stakeholders?",
			tips: "Map each person's gain, arm your champion, and tailor proof per role.",
			k: "committee,stakeholders,champion,proof,roles"
		},
		{
			q: "How do you keep your pipeline full while closing?",
			tips: "Protect dedicated prospecting blocks and always end calls with a next step.",
			k: "pipeline,prospecting,timeblocking,nextsteps,balance"
		},
		{
			q: "What is your approach to follow-ups?",
			tips: "Always add value, vary the channel, and know when persistence becomes pressure.",
			k: "followup,value,persistence,channel,balance"
		},
		{
			q: "How do you prepare for a demo?",
			tips: "Research the account, map features to their pains, and plan for decision-makers in the room.",
			k: "demo,preparation,research,discovery,pains"
		},
		{
			q: "How do you forecast your numbers?",
			tips: "Use weighted pipeline by stage, review deal risk with sales leaders, and stay honest.",
			k: "forecast,pipeline,weighting,accuracy,review"
		},
		{
			q: "What would you do if you were hitting quota but the deals were small?",
			tips: "Shift focus to larger accounts, revisit ICP fit, and work with marketing on pipeline quality.",
			k: "quota,dealsize,icp,strategy,quality"
		},
		{
			q: "How do you handle a prospect who will not return calls?",
			tips: "Change the value proposition or the channel, then make a clear exit-or-advance ask.",
			k: "prospect,noresponse,channel,value,decision"
		}
	],
	product: [
		{
			q: "How do you decide what to build next?",
			tips: "Combine strategy, user evidence, and effort — with explicit criteria and a no-go option.",
			k: "prioritisation,roadmap,evidence,criteria,decision"
		},
		{
			q: "Explain the difference between a problem statement and a solution.",
			tips: "Define the user job and pain first; solutions are hypotheses to test.",
			k: "problemstatement,solution,hypothesis,users,pain"
		},
		{
			q: "How would you discover unmet user needs?",
			tips: "Combine interviews, support data, usage analytics, and watching real sessions.",
			k: "discovery,research,interviews,analytics,needs"
		},
		{
			q: "What metrics matter for a new feature's success?",
			tips: "Define activation and retention for that feature plus guardrails on the core experience.",
			k: "metrics,activation,retention,guardrails,success"
		},
		{
			q: "How do you write a good user story?",
			tips: "Use the job, the motivation, and acceptance criteria — keep it small enough to ship.",
			k: "userstory,acceptance,scope,job,criteria"
		},
		{
			q: "Explain how you would run a discovery interview.",
			tips: "Ask about past behaviour, not opinions; follow up on stories; record and synthesise.",
			k: "interview,discovery,questions,behaviour,synthesis"
		},
		{
			q: "How do you prioritise bugs versus features?",
			tips: "Use severity and user impact for bugs, value and effort for features — and a shared queue.",
			k: "bugs,features,prioritisation,severity,impact"
		},
		{
			q: "What is product-market fit and how would you measure it?",
			tips: "Discuss retention curves, willingness to pay, and word-of-mouth as signals.",
			k: "productmarketfit,retention,pmf,signals,metrics"
		},
		{
			q: "How do you run a successful beta?",
			tips: "Recruit engaged users, define success metrics, create feedback loops, and act visibly.",
			k: "beta,feedback,metrics,users,iteration"
		},
		{
			q: "Explain how you would sunset a product.",
			tips: "Plan migration, communicate early, define the off-ramp, and learn from the shutdown.",
			k: "sunset,product,migration,communication,learn"
		},
		{
			q: "What is the difference between a roadmap and a backlog?",
			tips: "Roadmaps communicate strategic themes and intent; backlogs hold candidate work.",
			k: "roadmap,backlog,themes,strategy,intent"
		},
		{
			q: "How do you make a case for killing a beloved feature?",
			tips: "Use usage data, maintenance cost, and strategic fit — and share the reasoning transparently.",
			k: "kill,feature,data,cost,strategy"
		},
		{
			q: "How do you collaborate with engineering during planning?",
			tips: "Bring problem context and success metrics; let engineers own the how and estimate honestly.",
			k: "engineering,collaboration,planning,metrics,context"
		},
		{
			q: "What is your definition of a successful launch?",
			tips: "Align on one primary outcome, the audience, and the review date before launch day.",
			k: "launch,success,definition,outcome,review"
		},
		{
			q: "How do you know when to stop adding features to an MVP?",
			tips: "Stop when the core job is done and real users can validate value — then iterate on evidence.",
			k: "mvp,scope,validation,iteration,value"
		},
		{
			q: "Explain how you would handle a product with declining usage.",
			tips: "Diagnose retention vs acquisition first, talk to churned users, then fix the top cause.",
			k: "decline,usage,retention,diagnosis,churn"
		},
		{
			q: "What tools would you use to track product analytics?",
			tips: "Name a stack for events, funnels, and retention, and explain what you'd instrument first.",
			k: "analytics,tools,funnels,retention,instrumentation"
		},
		{
			q: "How do you balance customer requests with the product vision?",
			tips: "Use a decision framework that weighs evidence, strategy, and effort — and communicate why.",
			k: "vision,requests,balance,framework,communication"
		}
	]
};
var TYPE_META = {
	behavioral: { id: "behavioral" },
	technical: { id: "technical" },
	situational: { id: "situational" },
	hr: { id: "hr" }
};
var ROLES = [
	"developer",
	"designer",
	"manager",
	"marketing",
	"sales",
	"data",
	"product",
	"general"
];
function build() {
	const out = [];
	const push = (role, type, items, levelOverride) => {
		let n = 0;
		for (const it of items) {
			n += 1;
			out.push({
				id: `${role}-${TYPE_META[type].id}-${String(n).padStart(3, "0")}`,
				question: it.q,
				role: [role],
				type,
				level: it.l ?? levelOverride ?? ALL,
				tips: it.tips,
				keywords: it.k.split(",").map((x) => x.trim()).filter(Boolean)
			});
		}
	};
	for (const role of ROLES) {
		const behavioral = [...GENERAL_BEHAVIORAL, ...ROLE_BEHAVIORAL[role] ?? []];
		const situational = [...GENERAL_SITUATIONAL, ...ROLE_SITUATIONAL[role] ?? []];
		push(role, "behavioral", behavioral);
		push(role, "situational", situational);
		push(role, "hr", GENERAL_HR);
		if (role !== "general") push(role, "technical", TECHNICAL[role]);
	}
	return out;
}
var INTERVIEW_QUESTIONS = build();
/** Guaranteed minimum — composition above yields well past this. */
var INTERVIEW_QUESTION_COUNT = INTERVIEW_QUESTIONS.length;
var ROLES_META = [
	{
		id: "developer",
		label: "Developer"
	},
	{
		id: "designer",
		label: "Designer"
	},
	{
		id: "manager",
		label: "Engineering / Team Manager"
	},
	{
		id: "marketing",
		label: "Marketing"
	},
	{
		id: "sales",
		label: "Sales"
	},
	{
		id: "data",
		label: "Data / Analytics"
	},
	{
		id: "product",
		label: "Product Manager"
	},
	{
		id: "general",
		label: "General"
	}
];
function pickInterviewQuestions(opts) {
	const { role, type, level, count } = opts;
	let pool = INTERVIEW_QUESTIONS.filter((q) => q.role.includes(role) && q.level.includes(level) && (type === "mixed" || q.type === type));
	if (type === "mixed") {
		const ordered = [
			"behavioral",
			"situational",
			"technical",
			"hr"
		];
		const picked = [];
		for (let i = 0; i < count; i++) {
			const t = ordered[i % ordered.length];
			const idx = pool.findIndex((q) => q.type === t && !picked.includes(q));
			if (idx >= 0) picked.push(pool[idx]);
			else {
				const alt = pool.find((q) => !picked.includes(q));
				if (alt) picked.push(alt);
			}
		}
		pool = picked;
	} else {
		pool = [...pool];
		for (let i = pool.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[pool[i], pool[j]] = [pool[j], pool[i]];
		}
	}
	return pool.slice(0, Math.min(count, pool.length));
}
var FILLER_WORDS = [
	"um",
	"uh",
	"like",
	"you know",
	"basically",
	"literally"
];
var STAR = {
	S: [
		"when",
		"during",
		"at my",
		"at the",
		"i was",
		"in my previous",
		"at [company]"
	],
	T: [
		"i had to",
		"needed to",
		"responsible for",
		"was asked to",
		"my task"
	],
	A: [
		"i did",
		"i created",
		"i implemented",
		"i spoke",
		"i built",
		"i wrote",
		"i designed",
		"i introduced",
		"i led"
	],
	R: [
		"resulted in",
		"increased",
		"reduced",
		"improved",
		"successfully",
		"outcome was",
		"led to",
		"as a result"
	]
};
function analyseAnswer(q, text, seconds, voice) {
	const lower = ` ${text.toLowerCase()} `;
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	const fillers = {};
	let fillerCount = 0;
	for (const f of FILLER_WORDS) {
		const re = new RegExp(`\\b${f.replace(" ", "\\s+")}\\b`, "g");
		const m = lower.match(re);
		const n = m ? m.length : 0;
		if (n > 0) {
			fillers[f] = n;
			fillerCount += n;
		}
	}
	const mentioned = [];
	const missing = [];
	for (const k of q.keywords) if (lower.includes(k.toLowerCase())) mentioned.push(k);
	else missing.push(k);
	let star;
	if (q.type === "behavioral") star = {
		S: STAR.S.some((p) => lower.includes(p)),
		T: STAR.T.some((p) => lower.includes(p)),
		A: STAR.A.some((p) => lower.includes(p)),
		R: STAR.R.some((p) => lower.includes(p))
	};
	const wpm = voice && seconds > 5 ? Math.round(words / seconds * 60) : null;
	let score = 100;
	if (words < 50) score -= 10;
	else if (words > 300) score -= 12;
	score -= Math.min(20, fillerCount * 2);
	if (star) {
		for (const v of Object.values(star)) if (!v) score -= 5;
	}
	score -= Math.min(12, missing.length * 2);
	if (wpm !== null && (wpm < 100 || wpm > 180)) score -= 6;
	score = Math.max(0, Math.min(100, score));
	const fb = {
		words,
		fillers,
		fillerCount,
		mentioned,
		missing,
		wpm,
		score
	};
	if (star) fb.star = star;
	return fb;
}
function speechSupported() {
	if (typeof window === "undefined") return false;
	const w = window;
	return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}
var DURATIONS = [
	{
		id: "15",
		label: "15 min",
		desc: "5 questions",
		q: 5
	},
	{
		id: "30",
		label: "30 min",
		desc: "10 questions",
		q: 10
	},
	{
		id: "full",
		label: "Full",
		desc: "20 questions",
		q: 20
	}
];
function fmt(sec) {
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}
function InterviewTool() {
	const [phase, setPhase] = (0, import_react.useState)("setup");
	const [role, setRole] = (0, import_react.useState)("developer");
	const [level, setLevel] = (0, import_react.useState)("mid");
	const [type, setType] = (0, import_react.useState)("behavioral");
	const [duration, setDuration] = (0, import_react.useState)(DURATIONS[1]);
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [qi, setQi] = (0, import_react.useState)(0);
	const [seconds, setSeconds] = (0, import_react.useState)(0);
	const [answer, setAnswer] = (0, import_react.useState)("");
	const [liveText, setLiveText] = (0, import_react.useState)("");
	const [listening, setListening] = (0, import_react.useState)(false);
	const [voiceError, setVoiceError] = (0, import_react.useState)("");
	const [showTip, setShowTip] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [results, setResults] = (0, import_react.useState)([]);
	const recognitionRef = (0, import_react.useRef)(null);
	const voiceSupported = (0, import_react.useMemo)(() => speechSupported(), []);
	const speakStartRef = (0, import_react.useRef)(null);
	const question = questions[qi];
	const stopRecognition = (0, import_react.useCallback)(() => {
		setListening(false);
		recognitionRef.current?.stop();
		recognitionRef.current = null;
	}, []);
	(0, import_react.useEffect)(() => () => {
		recognitionRef.current?.abort?.();
	}, []);
	(0, import_react.useEffect)(() => {
		if (phase !== "active") return;
		const id = window.setInterval(() => setSeconds((s) => s + 1), 1e3);
		return () => window.clearInterval(id);
	}, [phase, qi]);
	(0, import_react.useEffect)(() => {
		if (phase !== "active" || !listening) return;
		const w = window;
		const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
		if (!Ctor) {
			setVoiceError("Voice capture needs Chrome or Edge — type your answer instead.");
			setListening(false);
			return;
		}
		setVoiceError("");
		const rec = new Ctor();
		rec.continuous = true;
		rec.interimResults = true;
		rec.lang = "en-US";
		rec.onresult = (event) => {
			let interim = "";
			let final = "";
			for (let i = event.resultIndex; i < event.results.length; i++) {
				const t = event.results[i][0].transcript;
				if (event.results[i].isFinal) final += t;
				else interim += t;
			}
			if (final) setAnswer((a) => (a ? `${a} ${final}` : final).trim());
			if (interim) setLiveText(interim);
		};
		rec.onerror = (e) => {
			setListening(false);
			setVoiceError(e?.error === "not-allowed" ? "Microphone permission denied — allow mic access and try again." : "Voice capture failed — you can type your answer instead.");
		};
		rec.onend = () => {
			setListening(false);
			setLiveText("");
			recognitionRef.current = null;
		};
		recognitionRef.current = rec;
		try {
			rec.start();
		} catch {
			setVoiceError("Could not start the microphone — type your answer instead.");
			setListening(false);
		}
	}, [
		phase,
		listening,
		qi
	]);
	const startInterview = () => {
		const qs = pickInterviewQuestions({
			role,
			type,
			level,
			count: duration.q
		});
		if (qs.length === 0) {
			toast("No questions match that combination — try a different type.");
			return;
		}
		setQuestions(qs);
		setQi(0);
		setSeconds(0);
		setAnswer("");
		setLiveText("");
		setResults([]);
		setFeedback(null);
		setShowTip(false);
		setPhase("active");
	};
	const toggleListening = () => {
		if (listening) {
			stopRecognition();
			return;
		}
		setAnswer("");
		speakStartRef.current = Math.floor(Date.now() / 1e3);
		setListening(true);
	};
	const finishAnswer = () => {
		if (listening) stopRecognition();
		const text = answer.trim() || liveText.trim();
		if (!text) {
			toast("Say or type something first — even a rough draft counts.");
			return;
		}
		const voice = Boolean(speakStartRef.current) && answer.trim().length > 0;
		const spokenSecs = voice && speakStartRef.current ? Math.max(1, Math.floor(Date.now() / 1e3) - speakStartRef.current) : seconds;
		speakStartRef.current = null;
		const fb = analyseAnswer(question, text, spokenSecs, voice);
		setFeedback(fb);
		setResults((prev) => [...prev, {
			q: question,
			text,
			seconds: spokenSecs,
			voice,
			fb
		}]);
		setPhase("feedback");
	};
	const next = () => {
		setAnswer("");
		setLiveText("");
		setFeedback(null);
		setShowTip(false);
		if (qi + 1 >= questions.length) setPhase("summary");
		else {
			setQi((i) => i + 1);
			setSeconds(0);
			setPhase("active");
		}
	};
	const overallScore = (0, import_react.useMemo)(() => {
		if (results.length === 0) return 0;
		return Math.round(results.reduce((s, r) => s + r.fb.score, 0) / results.length);
	}, [results]);
	const worstArea = (0, import_react.useMemo)(() => {
		if (results.length === 0) return "—";
		const areas = {
			"answer length": 0,
			fillers: 0,
			keywords: 0,
			pace: 0,
			STAR: 0
		};
		for (const r of results) {
			if (r.fb.words < 50) areas["answer length"] = (areas["answer length"] ?? 0) + 1;
			if (r.fb.words > 300) areas["answer length"] = (areas["answer length"] ?? 0) + 1;
			if (r.fb.fillerCount > 0) areas["fillers"] = (areas["fillers"] ?? 0) + 1;
			if (r.fb.missing.length > 0) areas["keywords"] = (areas["keywords"] ?? 0) + 1;
			if (r.fb.star) {
				for (const v of Object.values(r.fb.star)) if (!v) areas["STAR"] = (areas["STAR"] ?? 0) + 1;
			}
			if (r.fb.wpm !== null && (r.fb.wpm < 100 || r.fb.wpm > 180)) areas["pace"] = (areas["pace"] ?? 0) + 1;
		}
		return (Object.entries(areas).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—").replace("STAR", "the STAR method");
	}, [results]);
	const gradeOf = (s) => s >= 85 ? "A" : s >= 70 ? "B" : s >= 55 ? "C" : s >= 40 ? "D" : "F";
	const gradeColor = (s) => s >= 85 ? "text-chart-2" : s >= 70 ? "text-chart-3" : s >= 55 ? "text-[#d29922]" : "text-[#f85149]";
	const downloadReport = () => {
		if (results.length === 0) return;
		const pdf = new E();
		pdf.setFontSize(18);
		pdf.text("Mock Interview Report", 14, 18);
		pdf.setFontSize(11);
		pdf.text(`${ROLES_META.find((r) => r.id === role)?.label} · ${level} · ${type} · ${results.length} questions`, 14, 26);
		pdf.text(`Overall score: ${overallScore} (${gradeOf(overallScore)}) — weakest area: ${worstArea}`, 14, 33);
		let y = 43;
		pdf.setFontSize(10);
		results.forEach((r, i) => {
			if (y > 275) {
				pdf.addPage();
				y = 18;
			}
			pdf.text(`${i + 1}. ${r.q.question.slice(0, 70)}`, 14, y);
			pdf.text(`   Score ${r.fb.score}/100 · ${r.fb.words} words${r.fb.wpm ? ` · ~${r.fb.wpm} wpm` : ""}`, 16, y + 5);
			y += 12;
		});
		pdf.save("interview-report.pdf");
		toast("Report downloaded");
	};
	const restart = () => {
		setPhase("setup");
		setQuestions([]);
		setResults([]);
		setQi(0);
		setAnswer("");
	};
	const timerColor = seconds > 120 ? "text-red-400" : seconds > 60 ? "text-[#d29922]" : "text-chart-2";
	if (phase === "setup") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Mock Interview",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl",
				children: "🎤 Mock Interview"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-[13px] text-muted-foreground",
				children: [
					"Practice with ",
					INTERVIEW_QUESTION_COUNT.toLocaleString(),
					" real-style questions and get instant feedback on every answer."
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel rounded-xl p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-foreground",
						children: "Set up your interview"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-4 block text-[12px] font-medium text-muted-foreground",
						children: "Role"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: role,
						onChange: (e) => setRole(e.target.value),
						className: "mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary/60",
						children: ROLES_META.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: r.id,
							children: r.label
						}, r.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-4 block text-[12px] font-medium text-muted-foreground",
						children: "Experience level"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 grid grid-cols-3 gap-2",
						children: [
							"junior",
							"mid",
							"senior"
						].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLevel(l),
							className: cn("rounded-lg border px-3 py-2 text-[13px] font-medium capitalize transition-colors", level === l ? "border-primary/50 bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
							children: l
						}, l))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-4 block text-[12px] font-medium text-muted-foreground",
						children: "Interview type"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: [
							{
								id: "behavioral",
								label: "Behavioral"
							},
							{
								id: "technical",
								label: "Technical"
							},
							{
								id: "situational",
								label: "Situational"
							},
							{
								id: "hr",
								label: "HR"
							},
							{
								id: "mixed",
								label: "Mixed"
							}
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setType(t.id),
							className: cn("rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors", type === t.id ? "border-primary/50 bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"),
							children: t.label
						}, t.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-4 block text-[12px] font-medium text-muted-foreground",
						children: "Duration"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 grid grid-cols-3 gap-2",
						children: DURATIONS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setDuration(d),
							className: cn("rounded-lg border px-3 py-2.5 text-left transition-colors", duration.id === d.id ? "border-primary/50 bg-primary/15" : "border-border bg-surface hover:border-primary/30"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[14px] font-semibold text-foreground",
								children: d.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] text-muted-foreground",
								children: d.desc
							})]
						}, d.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: startInterview,
						className: "mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[15px] font-bold text-background transition-opacity hover:opacity-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), " Start interview"]
					}),
					!voiceSupported && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[12px] text-muted-foreground",
						children: "🎙️ Voice answers work best in Chrome or Edge — typing answers works everywhere."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-foreground",
							children: "How it works"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "mt-2 space-y-2 text-[13px] leading-relaxed text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. Answer each question out loud (or by typing)." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "2. Get instant feedback — length, filler words, STAR, keywords, pace." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3. Finish with a score, your weakest area, and a PDF report." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 rounded-lg border border-border bg-surface-elevated p-2.5 text-[12px] leading-relaxed text-muted-foreground",
							children: [
								"💡 Behavioral answers land best with the ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "STAR"
								}),
								" ",
								"method: Situation → Task → Action → Result."
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-center text-[11px] text-muted-foreground",
					children: [
						"100% free, on-device.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tools",
							className: "text-primary hover:underline",
							children: "More tools →"
						})
					]
				})]
			})]
		})]
	});
	if (phase === "feedback" && feedback && question) {
		const lv = feedback.words < 50 ? {
			ok: false,
			msg: "Too brief — aim for 1–2 minutes of substance."
		} : feedback.words > 300 ? {
			ok: false,
			msg: "Too long — be more concise and structured."
		} : {
			ok: true,
			msg: "Good length."
		};
		const pace = feedback.wpm === null ? null : feedback.wpm < 100 ? {
			ok: false,
			msg: `Speaking slowly (~${feedback.wpm} wpm) — a more confident pace reads better.`
		} : feedback.wpm > 180 ? {
			ok: false,
			msg: `Speaking quickly (~${feedback.wpm} wpm) — slow down a little.`
		} : {
			ok: true,
			msg: `Good pace (~${feedback.wpm} wpm).`
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
			title: "Mock Interview",
			back: {
				to: "/tools",
				label: "SlashKits"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[12px] font-semibold tracking-wide text-muted-foreground uppercase",
					children: [
						"Feedback — question ",
						qi + 1,
						" of ",
						questions.length
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-3 rounded-xl p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[13px] text-muted-foreground",
							children: [
								question.type,
								" · ",
								question.level.join("/")
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("text-2xl font-black", gradeColor(feedback.score)),
							children: [feedback.score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-muted-foreground",
								children: "/100"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[13px] font-medium text-foreground",
						children: question.question
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 rounded-lg border border-border bg-surface-elevated/60 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("mt-0.5 size-4 shrink-0", lv.ok ? "text-chart-2" : "text-[#d29922]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[13px] text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: feedback.words }),
										" words —",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: lv.ok ? "text-chart-2" : "text-[#d29922]",
											children: lv.msg
										})
									]
								}), feedback.words >= 50 && feedback.words <= 200 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "✓ Good length for a first pass."
								})] })]
							}),
							feedback.fillerCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 rounded-lg border border-border bg-surface-elevated/60 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mt-0.5 size-4 shrink-0 text-[#d29922]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[13px] text-foreground",
									children: [
										"You used filler words",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
											feedback.fillerCount,
											" time",
											feedback.fillerCount > 1 ? "s" : ""
										] }),
										" —",
										" ",
										Object.entries(feedback.fillers).map(([w, n]) => `“${w}” ${n}×`).join(", ")
									]
								})]
							}),
							feedback.star && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-surface-elevated/60 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13px] font-semibold text-foreground",
									children: "STAR structure"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4",
									children: [
										"S",
										"T",
										"A",
										"R"
									].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("flex items-center justify-between rounded-md border px-2 py-1 text-[12px]", feedback.star[k] ? "border-chart-2/40 text-chart-2" : "border-border text-muted-foreground"),
										children: [k, feedback.star[k] ? " ✓" : " ✗"]
									}, k))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-surface-elevated/60 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[13px] font-semibold text-foreground",
										children: "Keywords from the question"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 flex flex-wrap gap-1.5 text-[12px]",
										children: question.keywords.slice(0, 8).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: cn("rounded-full border px-2 py-0.5", feedback.mentioned.includes(k) ? "border-chart-2/40 text-chart-2" : "border-border text-muted-foreground"),
											children: [
												k,
												" ",
												feedback.mentioned.includes(k) ? "✓" : "✗"
											]
										}, k))
									}),
									feedback.missing.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1.5 text-[11px] text-muted-foreground",
										children: ["Try working in: ", feedback.missing.slice(0, 5).join(", ")]
									})
								]
							}),
							pace && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 rounded-lg border border-border bg-surface-elevated/60 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-0.5 size-2 rounded-full", pace.ok ? "bg-chart-2" : "bg-[#d29922]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13px] text-foreground",
									children: pace.msg
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setShowTip((v) => !v),
							className: "flex items-center gap-1.5 text-[13px] text-[#d29922] transition-colors hover:text-[#e3b341]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "size-4" }),
								" ",
								showTip ? "Hide tip" : "Tip"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: next,
							className: "flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[14px] font-bold text-background transition-opacity hover:opacity-90",
							children: [
								qi + 1 >= questions.length ? "See results" : "Next question",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
							]
						})]
					}),
					showTip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 rounded-lg border border-[rgba(210,153,34,0.3)] bg-[rgba(210,153,34,0.08)] p-3 text-[13px] leading-relaxed text-foreground",
						children: ["💡 ", question.tips]
					})
				]
			})]
		});
	}
	if (phase === "summary") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Mock Interview",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-bold tracking-tight text-foreground sm:text-2xl",
					children: "Interview complete 🎉"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[13px] text-muted-foreground",
					children: [
						results.length,
						" answers · ",
						ROLES_META.find((r) => r.id === role)?.label,
						" · ",
						level
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-4 rounded-xl p-5 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12px] font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Overall score"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1 text-6xl font-black tracking-tight", gradeColor(overallScore)),
						children: overallScore
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-lg font-bold text-foreground",
						children: ["Grade ", gradeOf(overallScore)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground",
						children: [
							"Weakest area: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: worstArea
							}),
							" — focus your next practice session there."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: downloadReport,
							className: "flex min-h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-bold text-background transition-opacity hover:opacity-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download report (PDF)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: restart,
							className: "flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-4 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), " Start again"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-col gap-2",
				children: results.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "panel group rounded-xl p-0 open:pb-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "flex cursor-pointer list-none items-center gap-3 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("flex size-8 shrink-0 items-center justify-center rounded-lg font-bold", gradeColor(r.fb.score)),
								children: r.fb.score
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[13px] font-semibold text-foreground",
									children: r.q.question
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-[11px] text-muted-foreground",
									children: [
										r.fb.words,
										" words · ",
										r.q.type
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "▾"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[12px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "Your answer:"
								}),
								" “",
								r.text.slice(0, 240),
								r.text.length > 240 ? "…" : "",
								"”"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1.5 text-[12px] text-muted-foreground",
							children: ["💡 ", r.q.tips]
						})]
					})]
				}, r.q.id))
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Mock Interview",
		back: {
			to: "/tools",
			label: "SlashKits"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[12px] font-semibold tracking-wide text-muted-foreground uppercase",
						children: [
							"Question ",
							qi + 1,
							" of ",
							questions.length
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("font-mono text-[13px] font-bold", timerColor),
						children: fmt(seconds)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 h-1.5 overflow-hidden rounded-full bg-surface-elevated",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary transition-all duration-300",
						style: { width: `${(qi + 1) / questions.length * 100}%` }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-4 rounded-xl p-5 text-center sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mx-auto max-w-xl text-lg font-semibold leading-relaxed text-foreground sm:text-xl",
						children: question?.question
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center justify-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-[11px] capitalize text-muted-foreground",
								children: question?.type
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-[11px] text-muted-foreground",
								children: ["level: ", level]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setShowTip((v) => !v),
								className: "flex items-center gap-1 rounded-full border border-[rgba(210,153,34,0.35)] bg-[rgba(210,153,34,0.08)] px-2.5 py-0.5 text-[11px] text-[#d29922] transition-colors hover:text-[#e3b341]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "size-3" }),
									" ",
									showTip ? "Hide tip" : "Tip"
								]
							})
						]
					}),
					showTip && question && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mx-auto mt-3 max-w-lg rounded-lg border border-[rgba(210,153,34,0.3)] bg-[rgba(210,153,34,0.08)] p-3 text-left text-[13px] leading-relaxed text-muted-foreground",
						children: ["💡 ", question.tips]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-4 rounded-xl p-4",
				children: [
					voiceSupported && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: toggleListening,
								className: cn("flex min-h-11 items-center gap-2 rounded-xl px-4 text-[13px] font-bold transition-colors", listening ? "bg-[rgba(248,81,73,0.15)] text-red-400 ring-1 ring-red-500/40" : "bg-primary text-background hover:opacity-90"),
								children: [listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" }), listening ? "Stop speaking" : "Start speaking"]
							}),
							listening && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[12px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 animate-pulse rounded-full bg-red-400" }), " Listening… speak naturally"]
							}),
							voiceError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] text-red-300",
								children: voiceError
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: answer,
						onChange: (e) => setAnswer(e.target.value),
						placeholder: "Type your answer here… (or use the microphone above)",
						rows: 7,
						className: "mt-3 w-full resize-y rounded-xl border border-border bg-surface p-3 text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60"
					}),
					listening && liveText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-[13px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-red-300",
								children: "Speaking…"
							}),
							" “",
							liveText,
							"”"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12px] text-muted-foreground",
							children: answer.trim() ? `${answer.trim().split(/\s+/).length} words` : "0 words"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: finishAnswer,
							disabled: !answer.trim(),
							className: "flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[14px] font-bold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
							children: ["Finish answer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { InterviewTool as component };
