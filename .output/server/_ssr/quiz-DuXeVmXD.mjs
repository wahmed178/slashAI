import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as Share2, Qt as Flame, Sn as CircleCheck, U as RotateCcw, wn as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5HnqCEQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz-DuXeVmXD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORY_EMOJIS = {
	9: "🌍",
	10: "📚",
	11: "🎬",
	12: "🎵",
	13: "🎭",
	14: "📺",
	15: "🎮",
	16: "🕹️",
	17: "🔬",
	18: "💻",
	19: "🔢",
	20: "⚡",
	21: "⚽",
	22: "🗺️",
	23: "🏛️",
	24: "🏛️",
	25: "🎨",
	26: "⭐",
	27: "🐾",
	28: "🚗",
	29: "💥",
	30: "📱",
	31: "🇯🇵",
	32: "🎠"
};
var FALLBACK_CATEGORIES = [
	{
		id: 9,
		name: "General Knowledge"
	},
	{
		id: 17,
		name: "Science & Nature"
	},
	{
		id: 18,
		name: "Science: Computers"
	},
	{
		id: 23,
		name: "History"
	},
	{
		id: 22,
		name: "Geography"
	},
	{
		id: 21,
		name: "Sports"
	}
];
var DIFFICULTY_TIME = {
	easy: 25,
	medium: 20,
	hard: 15
};
function decodeHTML(str) {
	const txt = document.createElement("textarea");
	txt.innerHTML = str;
	return txt.value;
}
function todayStr() {
	return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function shuffleArray(arr) {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
function getCacheKey(categoryId, difficulty) {
	return `quiz-cache-${categoryId}-${difficulty}`;
}
function getCachedQuestions(categoryId, difficulty) {
	try {
		const raw = localStorage.getItem(getCacheKey(categoryId, difficulty));
		if (!raw) return null;
		const cached = JSON.parse(raw);
		if (cached.date === todayStr()) return cached.questions;
		return null;
	} catch {
		return null;
	}
}
function setCachedQuestions(categoryId, difficulty, questions) {
	try {
		localStorage.setItem(getCacheKey(categoryId, difficulty), JSON.stringify({
			questions,
			date: todayStr()
		}));
	} catch {}
}
function getSessionToken() {
	return localStorage.getItem("quiz-session-token");
}
function setSessionToken(token) {
	try {
		localStorage.setItem("quiz-session-token", token);
	} catch {}
}
function getStreak() {
	try {
		return {
			count: parseInt(localStorage.getItem("quiz-streak") || "0", 10),
			best: parseInt(localStorage.getItem("quiz-best-streak") || "0", 10),
			lastDate: localStorage.getItem("quiz-last-date") || ""
		};
	} catch {
		return {
			count: 0,
			best: 0,
			lastDate: ""
		};
	}
}
function updateStreak(score) {
	const today = todayStr();
	const s = getStreak();
	if (s.lastDate === today) return {
		count: s.count,
		best: s.best,
		isNew: false
	};
	const newCount = score > 0 ? s.count + 1 : 0;
	const newBest = Math.max(newCount, s.best);
	try {
		localStorage.setItem("quiz-streak", String(newCount));
		localStorage.setItem("quiz-best-streak", String(newBest));
		localStorage.setItem("quiz-last-date", today);
	} catch {}
	return {
		count: newCount,
		best: newBest,
		isNew: true
	};
}
function todayCompletedCategories() {
	try {
		const raw = localStorage.getItem("quiz-completed-today");
		if (!raw) return /* @__PURE__ */ new Set();
		const parsed = JSON.parse(raw);
		if (parsed.date === todayStr()) return new Set(parsed.ids);
		return /* @__PURE__ */ new Set();
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function markCategoryCompleted(categoryId) {
	try {
		const today = todayStr();
		const existing = todayCompletedCategories();
		existing.add(categoryId);
		localStorage.setItem("quiz-completed-today", JSON.stringify({
			date: today,
			ids: [...existing]
		}));
	} catch {}
}
var FETCH_TIMEOUT_MS = 1e4;
async function fetchWithTimeout(url, timeoutMs = FETCH_TIMEOUT_MS) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return await fetch(url, { signal: controller.signal });
	} finally {
		clearTimeout(timer);
	}
}
var TRIVIA_CATEGORY_MAP = {
	9: "General Knowledge",
	10: "Arts & Literature",
	11: "Film & TV",
	12: "Music",
	15: "Video Games",
	17: "Science",
	18: "Technology",
	19: "Mathematics",
	21: "Sports",
	22: "Geography",
	23: "History"
};
async function fetchFromFallbackAPI(categoryId, difficulty) {
	const categoryName = TRIVIA_CATEGORY_MAP[categoryId];
	if (!categoryName) return {
		questions: [],
		responseCode: 3
	};
	const url = `https://the-trivia-api.com/v2/questions?limit=10&categories=${encodeURIComponent(categoryName)}&difficulties=${difficulty}`;
	try {
		const res = await fetchWithTimeout(url);
		if (!res.ok) return {
			questions: [],
			responseCode: -1
		};
		const data = await res.json();
		if (!data.length) return {
			questions: [],
			responseCode: 1
		};
		return {
			questions: data.map((q) => ({
				question: q.question.text,
				correctAnswer: q.correctAnswer,
				answers: shuffleArray([q.correctAnswer, ...q.incorrectAnswers]),
				category: categoryName,
				difficulty: q.difficulty
			})),
			responseCode: 0
		};
	} catch {
		return {
			questions: [],
			responseCode: -1
		};
	}
}
async function ensureToken() {
	let token = getSessionToken();
	if (token) return token;
	try {
		token = (await (await fetchWithTimeout("https://opentdb.com/api_token.php?command=request")).json()).token;
		if (token) setSessionToken(token);
	} catch {}
	return token || "";
}
async function fetchQuestions(categoryId, difficulty, _retryCount = 0) {
	const token = await ensureToken();
	const url = `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=multiple${token ? `&token=${token}` : ""}`;
	try {
		const data = await (await fetchWithTimeout(url)).json();
		if (data.response_code === 4 && token && _retryCount < 1) {
			try {
				await fetchWithTimeout(`https://opentdb.com/api_token.php?command=reset&token=${token}`);
			} catch {}
			localStorage.removeItem("quiz-session-token");
			return fetchQuestions(categoryId, difficulty, _retryCount + 1);
		}
		if (data.response_code === 5 && _retryCount < 1) {
			await new Promise((r) => setTimeout(r, 5e3));
			return fetchQuestions(categoryId, difficulty, _retryCount + 1);
		}
		if (data.response_code === 0 && data.results?.length) return {
			questions: data.results.map(parseQuestion),
			responseCode: 0
		};
		return {
			questions: [],
			responseCode: data.response_code
		};
	} catch {
		return fetchFromFallbackAPI(categoryId, difficulty);
	}
}
function parseQuestion(raw) {
	const allAnswers = [...raw.incorrect_answers, raw.correct_answer];
	return {
		question: decodeHTML(raw.question),
		correctAnswer: decodeHTML(raw.correct_answer),
		answers: shuffleArray(allAnswers.map(decodeHTML)),
		category: decodeHTML(raw.category),
		difficulty: raw.difficulty
	};
}
async function fetchCategories() {
	try {
		const data = await (await fetchWithTimeout("https://opentdb.com/api_category.php")).json();
		if (data.trivia_categories?.length) return data.trivia_categories;
	} catch {}
	return FALLBACK_CATEGORIES;
}
function QuizPage() {
	const [view, setView] = (0, import_react.useState)("picker");
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [difficulty, setDifficulty] = (0, import_react.useState)(() => {
		try {
			return localStorage.getItem("quiz-difficulty") || "medium";
		} catch {
			return "medium";
		}
	});
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)(null);
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [currentQ, setCurrentQ] = (0, import_react.useState)(0);
	const [score, setScore] = (0, import_react.useState)(0);
	const [selectedAnswer, setSelectedAnswer] = (0, import_react.useState)(null);
	const [isCorrect, setIsCorrect] = (0, import_react.useState)(null);
	const [answers, setAnswers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(DIFFICULTY_TIME[difficulty] || 20);
	const [showReview, setShowReview] = (0, import_react.useState)(false);
	const [quizCompleted, setQuizCompleted] = (0, import_react.useState)(false);
	const [completedCategories, setCompletedCategories] = (0, import_react.useState)(() => todayCompletedCategories());
	const timerRef = (0, import_react.useRef)(null);
	const autoAdvanceRef = (0, import_react.useRef)(null);
	const currentQRef = (0, import_react.useRef)(currentQ);
	const questionsRef = (0, import_react.useRef)(questions);
	currentQRef.current = currentQ;
	questionsRef.current = questions;
	const featuredId = (0, import_react.useMemo)(() => {
		return Math.floor((Date.now() - new Date((/* @__PURE__ */ new Date()).getFullYear(), 0, 0).getTime()) / 864e5) % 24 + 9;
	}, []);
	(0, import_react.useEffect)(() => {
		fetchCategories().then(setCategories);
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("quiz-difficulty", difficulty);
		} catch {}
	}, [difficulty]);
	const featuredCategory = (0, import_react.useMemo)(() => {
		const cats = categories.length ? categories : FALLBACK_CATEGORIES;
		return cats.find((c) => c.id === featuredId) || cats[0];
	}, [categories, featuredId]);
	const streak = (0, import_react.useMemo)(() => getStreak(), [view]);
	const startQuiz = (0, import_react.useCallback)(async (catId, catName) => {
		setSelectedCategory({
			id: catId,
			name: catName
		});
		setLoading(true);
		setError(null);
		setView("quiz");
		setCurrentQ(0);
		setScore(0);
		setSelectedAnswer(null);
		setIsCorrect(null);
		setAnswers([]);
		setShowReview(false);
		setQuizCompleted(false);
		setTimeLeft(DIFFICULTY_TIME[difficulty] || 20);
		const cached = getCachedQuestions(catId, difficulty);
		if (cached && cached.length === 10) {
			setQuestions(cached);
			setLoading(false);
			return;
		}
		const { questions: fetched, responseCode } = await fetchQuestions(catId, difficulty);
		if (responseCode === 1) {
			if (difficulty !== "medium") {
				const retry = await fetchQuestions(catId, "medium");
				if (retry.questions.length) {
					setQuestions(retry.questions);
					setCachedQuestions(catId, difficulty, retry.questions);
					setLoading(false);
					return;
				}
			}
			setError("No questions available for this category and difficulty. Try another category or change the difficulty.");
			setLoading(false);
			return;
		}
		if (!fetched.length) {
			setError("Could not load questions. Check your connection and try again.");
			setLoading(false);
			return;
		}
		setCachedQuestions(catId, difficulty, fetched);
		setQuestions(fetched);
		setLoading(false);
	}, [difficulty]);
	const maxTime = DIFFICULTY_TIME[difficulty] || 20;
	(0, import_react.useEffect)(() => {
		if (view !== "quiz" || !questions.length || quizCompleted || selectedAnswer) return;
		const handleVisibility = () => {
			if (document.hidden) {
				if (timerRef.current) clearInterval(timerRef.current);
			} else startTimer();
		};
		const startTimer = () => {
			if (timerRef.current) clearInterval(timerRef.current);
			timerRef.current = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						clearInterval(timerRef.current);
						handleTimeout();
						return 0;
					}
					return prev - 1;
				});
			}, 1e3);
		};
		const handleTimeout = () => {
			const qIdx = currentQRef.current;
			const qData = questionsRef.current[qIdx];
			if (!qData) return;
			setSelectedAnswer("\0");
			setIsCorrect(false);
			setAnswers((prev) => [...prev, {
				question: qData.question,
				correct: qData.correctAnswer,
				userAnswer: "Timed out",
				wasCorrect: false
			}]);
			autoAdvanceRef.current = setTimeout(() => advanceQuestion(), 1500);
		};
		startTimer();
		document.addEventListener("visibilitychange", handleVisibility);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
			if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
			document.removeEventListener("visibilitychange", handleVisibility);
		};
	}, [
		view,
		questions,
		currentQ,
		quizCompleted,
		selectedAnswer,
		difficulty
	]);
	(0, import_react.useEffect)(() => {
		setTimeLeft(maxTime);
	}, [currentQ, maxTime]);
	const handleAnswer = (0, import_react.useCallback)((answer) => {
		if (selectedAnswer !== null) return;
		if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
		setSelectedAnswer(answer);
		const correct = answer === questions[currentQ].correctAnswer;
		setIsCorrect(correct);
		if (correct) setScore((s) => s + 1);
		setAnswers((prev) => [...prev, {
			question: questions[currentQ].question,
			correct: questions[currentQ].correctAnswer,
			userAnswer: answer,
			wasCorrect: correct
		}]);
		autoAdvanceRef.current = setTimeout(() => advanceQuestion(), 1500);
	}, [
		selectedAnswer,
		questions,
		currentQ
	]);
	const advanceQuestion = (0, import_react.useCallback)(() => {
		if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
		if (currentQ + 1 >= questions.length) {
			setQuizCompleted(true);
			if (selectedCategory) {
				markCategoryCompleted(selectedCategory.id);
				setCompletedCategories(todayCompletedCategories());
			}
			updateStreak(score);
			setView("results");
		} else {
			setCurrentQ((c) => c + 1);
			setSelectedAnswer(null);
			setIsCorrect(null);
			setTimeLeft(maxTime);
		}
	}, [
		currentQ,
		questions.length,
		selectedCategory,
		score,
		maxTime
	]);
	const manualNext = (0, import_react.useCallback)(() => {
		if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
		advanceQuestion();
	}, [advanceQuestion]);
	const playAgain = (0, import_react.useCallback)(() => {
		if (selectedCategory) {
			localStorage.removeItem(getCacheKey(selectedCategory.id, difficulty));
			startQuiz(selectedCategory.id, selectedCategory.name);
		}
	}, [
		selectedCategory,
		difficulty,
		startQuiz
	]);
	const goBackToPicker = (0, import_react.useCallback)(() => {
		setView("picker");
		setSelectedCategory(null);
		setQuestions([]);
		setCurrentQ(0);
		setScore(0);
		setSelectedAnswer(null);
		setIsCorrect(null);
		setAnswers([]);
		setShowReview(false);
		setQuizCompleted(false);
		setError(null);
	}, []);
	const shareScore = (0, import_react.useCallback)(async () => {
		const text = `I scored ${score}/${questions.length} on the ${selectedCategory?.name} quiz! \u{1F9E0} Try it free at slashai.app`;
		if (navigator.share) try {
			await navigator.share({
				title: "SlashAI Daily Quiz",
				text,
				url: "https://slashai-nu.vercel.app/quiz"
			});
		} catch {}
		else try {
			await navigator.clipboard.writeText(text + "\nhttps://slashai-nu.vercel.app/quiz");
		} catch {}
	}, [
		score,
		questions.length,
		selectedCategory
	]);
	const timerPct = timeLeft / maxTime * 100;
	const timerColor = timeLeft > 10 ? "#3fb950" : timeLeft > 5 ? "#d29922" : "#f85149";
	const circumference = 2 * Math.PI * 26;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Daily Quiz",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-enter",
			children: [
				view === "picker" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryPicker, {
					categories,
					featuredCategory,
					featuredId,
					difficulty,
					setDifficulty,
					completedCategories,
					streak,
					onSelect: (id, name) => startQuiz(id, name)
				}),
				view === "quiz" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1.5",
							children: [
								0,
								1,
								2
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-3 rounded-full bg-primary",
								style: { animation: `pulse 1.4s ease-in-out ${i * .2}s infinite` }
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: "Loading questions…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes pulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }` })
					]
				}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: error
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: goBackToPicker,
						className: "mt-4 min-h-[44px] rounded-lg border border-border bg-surface px-6 text-sm font-medium text-foreground transition-colors hover:text-primary",
						children: "Back to categories"
					})]
				}) : questions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizInProgress, {
					questions,
					currentQ,
					score,
					selectedAnswer,
					isCorrect,
					timeLeft,
					maxTime,
					timerPct,
					timerColor,
					circumference,
					onAnswer: handleAnswer,
					onNext: manualNext,
					selectedCategory,
					difficulty
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No questions available right now."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground/70",
							children: "Try a different category or difficulty."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: goBackToPicker,
							className: "mt-4 min-h-[44px] rounded-lg border border-border bg-surface px-6 text-sm font-medium text-foreground transition-colors hover:text-primary",
							children: "Back to categories"
						})
					]
				}) }),
				view === "results" && selectedCategory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsScreen, {
					score,
					total: questions.length,
					answers,
					selectedCategory,
					difficulty,
					showReview,
					onToggleReview: () => setShowReview(!showReview),
					onPlayAgain: playAgain,
					onBackToPicker: goBackToPicker,
					onShare: shareScore
				})
			]
		})
	});
}
function CategoryPicker({ categories, featuredCategory, featuredId, difficulty, setDifficulty, completedCategories, streak, onSelect }) {
	const displayCategories = categories.length ? categories : FALLBACK_CATEGORIES;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pt-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
					children: "Daily Quiz"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[15px] text-muted-foreground",
					children: "Pick a category — fresh questions every day."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-2 inline-flex items-center rounded border border-border bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground",
					children: "Questions reset daily at midnight"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex items-center gap-3",
			children: [streak.count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5 text-sm font-medium text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
						className: "size-4 text-yellow",
						"aria-hidden": true
					}),
					streak.count,
					" day streak"
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-muted-foreground",
				children: "Start your streak today →"
			}), streak.best > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[11px] text-muted-foreground",
				children: [
					"Best: ",
					streak.best,
					" days"
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/quiz",
			onClick: (e) => {
				e.preventDefault();
				onSelect(featuredCategory.id, featuredCategory.name);
			},
			className: "mt-5 flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[48px]",
					"aria-hidden": true,
					children: CATEGORY_EMOJIS[featuredCategory.id] || "🧠"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-medium text-primary",
							children: "Featured today"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[18px] font-bold text-foreground",
							children: featuredCategory.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] text-muted-foreground",
							children: "10 questions"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 min-h-[40px] flex items-center gap-1.5 rounded-lg border border-primary bg-accent px-4 text-sm font-medium text-foreground",
					children: ["Play today's quiz ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
						className: "size-4",
						"aria-hidden": true
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 flex gap-2",
			children: [
				"easy",
				"medium",
				"hard"
			].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setDifficulty(d),
				className: "min-h-[40px] flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
				style: {
					background: difficulty === d ? "var(--primary)" : "var(--surface-elevated)",
					borderColor: difficulty === d ? "transparent" : "var(--border)",
					color: difficulty === d ? "var(--background)" : "var(--muted-foreground)"
				},
				children: d
			}, d))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-6 text-sm font-semibold tracking-wide text-muted-foreground uppercase",
			children: "All categories"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4",
			children: displayCategories.map((cat) => {
				const completed = completedCategories.has(cat.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onSelect(cat.id, cat.name),
					className: "group relative rounded-[10px] border bg-surface p-4 text-left transition-all duration-150 hover:-translate-y-0.5",
					style: { borderColor: completed ? "rgba(63,185,80,0.3)" : "var(--border)" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[28px]",
								"aria-hidden": true,
								children: CATEGORY_EMOJIS[cat.id] || "🧠"
							}), completed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[11px] font-medium text-green",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									className: "size-3.5",
									"aria-hidden": true
								}), " Done"]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[14px] font-semibold text-foreground line-clamp-2",
							children: cat.name
						}),
						!completed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: "10 questions"
						})
					]
				}, cat.id);
			})
		})
	] });
}
function QuizInProgress({ questions, currentQ, score, selectedAnswer, isCorrect, timeLeft, maxTime, timerPct, timerColor, circumference, onAnswer, onNext, selectedCategory, difficulty }) {
	const q = questions[currentQ];
	if (!q) return null;
	currentQ - score + (isCorrect === false && selectedAnswer ? 1 : 0);
	const answered = currentQ + (selectedAnswer !== null ? 1 : 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sticky top-0 z-10 -mx-4 -mt-5 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[13px] text-muted-foreground",
						children: [
							CATEGORY_EMOJIS[selectedCategory?.id || 0] || "🧠",
							" ",
							selectedCategory?.name
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[13px] font-medium text-foreground",
						children: [
							"Question ",
							currentQ + 1,
							" of ",
							questions.length
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative size-[50px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "size-full -rotate-90",
							viewBox: "0 0 60 60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "30",
								cy: "30",
								r: "26",
								fill: "none",
								stroke: "var(--surface-elevated)",
								strokeWidth: "3"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "30",
								cy: "30",
								r: "26",
								fill: "none",
								stroke: timerColor,
								strokeWidth: "3",
								strokeDasharray: circumference,
								strokeDashoffset: circumference * (1 - timerPct / 100),
								strokeLinecap: "round",
								style: { transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-0 flex items-center justify-center text-[14px] font-bold",
							style: { color: timerColor },
							children: timeLeft
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2.5 h-1 rounded-full bg-surface-elevated",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-primary",
					style: {
						width: `${(currentQ + (selectedAnswer !== null ? 1 : 0)) / questions.length * 100}%`,
						transition: "width 300ms ease"
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1.5 flex justify-between text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-green",
					children: [
						"✓ ",
						score,
						" correct"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-red",
					children: [
						"✗ ",
						answered - score,
						" wrong"
					]
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 rounded-xl border border-border bg-surface p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[17px] font-medium leading-relaxed text-foreground sm:text-[18px]",
					children: q.question
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 rounded px-2 py-0.5 text-[10px] font-medium capitalize",
					style: {
						background: q.difficulty === "easy" ? "rgba(63,185,80,0.1)" : q.difficulty === "hard" ? "rgba(248,81,73,0.1)" : "rgba(88,166,255,0.1)",
						color: q.difficulty === "easy" ? "#3fb950" : q.difficulty === "hard" ? "#f85149" : "var(--primary)"
					},
					children: q.difficulty
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-col gap-2.5",
				children: q.answers.map((answer) => {
					const isSelected = selectedAnswer === answer;
					const isCorrectAnswer = answer === q.correctAnswer;
					const showCorrect = selectedAnswer !== null && isCorrectAnswer;
					const showWrong = selectedAnswer !== null && isSelected && !isCorrectAnswer;
					let bg = "var(--surface-elevated)";
					let borderColor = "var(--border)";
					let textColor = "var(--foreground)";
					if (showCorrect) {
						bg = "rgba(63,185,80,0.15)";
						borderColor = "rgba(63,185,80,0.5)";
						textColor = "#3fb950";
					} else if (showWrong) {
						bg = "rgba(248,81,73,0.15)";
						borderColor = "rgba(248,81,73,0.5)";
						textColor = "#f85149";
					}
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: selectedAnswer !== null,
						onClick: () => onAnswer(answer),
						className: "min-h-[52px] w-full rounded-lg border px-4 py-3.5 text-left text-[15px] transition-all duration-150 disabled:cursor-default",
						style: {
							background: bg,
							borderColor,
							color: textColor
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "line-clamp-3",
							children: answer
						})
					}, answer);
				})
			}),
			selectedAnswer !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13px] font-medium",
					style: { color: isCorrect ? "#3fb950" : "#f85149" },
					children: isCorrect ? "✓ Correct!" : "✗ Wrong"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onNext,
					className: "min-h-[36px] rounded-lg border border-border bg-surface-elevated px-4 text-sm font-medium text-foreground transition-colors hover:text-primary",
					children: currentQ + 1 >= questions.length ? "See results" : "Next →"
				})]
			})
		]
	})] });
}
function ResultsScreen({ score, total, answers, selectedCategory, difficulty, showReview, onToggleReview, onPlayAgain, onBackToPicker, onShare }) {
	const pct = Math.round(score / total * 100);
	let emoji;
	let color;
	if (pct >= 90) {
		emoji = "🏆";
		color = "#d29922";
	} else if (pct >= 70) {
		emoji = "🎉";
		color = "#3fb950";
	} else if (pct >= 50) {
		emoji = "💪";
		color = "var(--primary)";
	} else {
		emoji = "📚";
		color = "var(--muted-foreground)";
	}
	const circumference = 2 * Math.PI * 52;
	const pctOffset = circumference * (1 - pct / 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative size-[120px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					className: "size-full -rotate-90",
					viewBox: "0 0 120 120",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "60",
						cy: "60",
						r: "52",
						fill: "none",
						stroke: "var(--surface-elevated)",
						strokeWidth: "6"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "60",
						cy: "60",
						r: "52",
						fill: "none",
						stroke: color,
						strokeWidth: "6",
						strokeDasharray: circumference,
						strokeDashoffset: pctOffset,
						strokeLinecap: "round",
						style: { transition: "stroke-dashoffset 1s ease" }
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 flex flex-col items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[28px]",
						children: emoji
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[20px] font-black",
						style: { color },
						children: [pct, "%"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-[20px] font-bold text-foreground",
				children: [
					score,
					" out of ",
					total,
					" correct"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-[13px] text-muted-foreground",
				children: [
					selectedCategory.name,
					" • ",
					difficulty
				]
			}),
			(() => {
				const s = getStreak();
				if (s.count > 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm font-medium text-yellow",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
							className: "mr-1 inline size-4",
							"aria-hidden": true
						}),
						s.count,
						" day streak!"
					]
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Streak started!"
				});
			})(),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onToggleReview,
				className: "mt-5 min-h-[44px] rounded-lg border border-border bg-surface px-5 text-sm font-medium text-foreground transition-colors hover:text-primary",
				children: showReview ? "Hide review" : "Review your answers"
			}),
			showReview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 w-full max-w-lg",
				children: answers.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[13px] text-muted-foreground",
							children: [
								i + 1,
								". ",
								a.question
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[13px] font-medium",
							style: { color: a.wasCorrect ? "#3fb950" : "#f85149" },
							children: [
								a.wasCorrect ? "✓" : "✗",
								" ",
								a.userAnswer
							]
						}),
						!a.wasCorrect && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-[12px] text-green",
							children: ["Correct: ", a.correct]
						})
					]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex w-full max-w-sm flex-col gap-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onPlayAgain,
						className: "min-h-[44px] rounded-lg border border-primary bg-accent px-5 text-sm font-medium text-foreground transition-colors hover:text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
							className: "mr-1.5 inline size-4",
							"aria-hidden": true
						}), "Play again — same category"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onBackToPicker,
						className: "min-h-[44px] rounded-lg border border-border bg-surface px-5 text-sm font-medium text-foreground transition-colors hover:text-primary",
						children: "Try a different category"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onShare,
						className: "min-h-[44px] rounded-lg border border-border bg-surface px-5 text-sm font-medium text-foreground transition-colors hover:text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {
							className: "mr-1.5 inline size-4",
							"aria-hidden": true
						}), "Share your score"]
					})
				]
			})
		]
	});
}
//#endregion
export { QuizPage as component };
