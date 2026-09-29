/**
 * Curated quotes, attributed to the people who said them.
 *
 * Extracted verbatim from the old /hub/* route by scripts/extract-hub-data.mjs.
 * These entries were never in src/lib/resources.ts, which is why they had to be
 * moved into a module before the hub routes could be redirected into SlashBar
 * categories. Do not hand-edit; re-run the extractor instead.
 */

export interface SlashQuote {
  text: string;
  author: string;
  source?: string;
  category: string;
}

export const QUOTES: SlashQuote[] = [
  {
    text: "The greatest leader is not the one who does the greatest things, but the one who gets people to do the greatest things.",
    author: "Ronald Reagan",
    category: "Leadership",
  },
  {
    text: "A leader is one who knows the way, goes the way, and shows the way.",
    author: "John C. Maxwell",
    category: "Leadership",
  },
  {
    text: "The measure of intelligence is the ability to change.",
    author: "Albert Einstein",
    category: "Leadership",
  },
  {
    text: "It is not the strongest of the species that survives, nor the most intelligent. It is the one most adaptable to change.",
    author: "Charles Darwin",
    category: "Leadership",
  },
  {
    text: "Before you are a leader, success is all about growing yourself. When you become a leader, success is all about growing others.",
    author: "Jack Welch",
    category: "Leadership",
  },
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: "Stoicism",
  },
  {
    text: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    category: "Stoicism",
  },
  {
    text: "No man is free who is not master of himself.",
    author: "Epictetus",
    category: "Stoicism",
  },
  {
    text: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: "Stoicism",
  },
  {
    text: "He who fears death will never do anything worthy of a man who is alive.",
    author: "Seneca",
    category: "Stoicism",
  },
  {
    text: "Seek knowledge from the cradle to the grave.",
    author: "Prophet Muhammad ﷺ",
    category: "Islam",
  },
  {
    text: "The seeking of knowledge is obligatory for every Muslim.",
    author: "Prophet Muhammad ﷺ",
    source: "Ibn Majah",
    category: "Islam",
  },
  {
    text: "Verily, with hardship comes ease.",
    author: "Quran 94:6",
    category: "Islam",
  },
  {
    text: "The best among you are those who learn the Quran and teach it.",
    author: "Prophet Muhammad ﷺ",
    source: "Bukhari",
    category: "Islam",
  },
  {
    text: "Trust in Allah, but tie your camel.",
    author: "Prophet Muhammad ﷺ",
    category: "Islam",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "Productivity",
  },
  {
    text: "It's not that I'm so smart, it's just that I stay with problems longer.",
    author: "Albert Einstein",
    category: "Productivity",
  },
  {
    text: "Done is better than perfect.",
    author: "Sheryl Sandberg",
    category: "Productivity",
  },
  {
    text: "You don't have to see the whole staircase, just take the first step.",
    author: "Martin Luther King Jr.",
    category: "Productivity",
  },
  {
    text: "Focus is saying no to the hundred other good ideas.",
    author: "Steve Jobs",
    category: "Productivity",
  },
  {
    text: "Move fast and break things.",
    author: "Mark Zuckerberg",
    category: "Startup",
  },
  {
    text: "If you're not embarrassed by the first version of your product, you've launched too late.",
    author: "Reid Hoffman",
    category: "Startup",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "Startup",
  },
  {
    text: "Ideas are worthless. Execution is everything.",
    author: "Steve Case",
    category: "Startup",
  },
  {
    text: "Your most unhappy customers are your greatest source of learning.",
    author: "Bill Gates",
    category: "Startup",
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: "Coding",
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    category: "Coding",
  },
  {
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    category: "Coding",
  },
  {
    text: "Premature optimization is the root of all evil.",
    author: "Donald Knuth",
    category: "Coding",
  },
  {
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman",
    category: "Coding",
  },
  {
    text: "In three words I can sum up life: it goes on.",
    author: "Robert Frost",
    category: "Life",
  },
  {
    text: "Be the change you wish to see in the world.",
    author: "Mahatma Gandhi",
    category: "Life",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "Life",
  },
  {
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    category: "Life",
  },
  {
    text: "You only live once, but if you do it right, once is enough.",
    author: "Mae West",
    category: "Life",
  },
  {
    text: "Happiness is not something ready made. It comes from your own actions.",
    author: "Dalai Lama",
    category: "Life",
  },
  {
    text: "In the end, it's not the years in your life that count. It's the life in your years.",
    author: "Abraham Lincoln",
    category: "Life",
  },
  {
    text: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
    category: "Creativity",
  },
  {
    text: "The chief enemy of creativity is good sense.",
    author: "Pablo Picasso",
    category: "Creativity",
  },
  {
    text: "Every artist was first an amateur.",
    author: "Ralph Waldo Emerson",
    category: "Creativity",
  },
  {
    text: "Imagination is everything. It is the preview of life's coming attractions.",
    author: "Albert Einstein",
    category: "Creativity",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Success",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "Success",
  },
  {
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
    category: "Success",
  },
  {
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "Success",
  },
];

export const QUOTE_CATEGORIES: string[] = [
  "All",
  ...Array.from(new Set(QUOTES.map((q) => q.category))),
];
