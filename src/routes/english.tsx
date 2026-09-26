import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Check, RotateCcw, Sparkles, Volume2 } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { getGameBest } from "@/lib/ux";
import { useUxTick } from "@/hooks/use-ux";

export const Route = createFileRoute("/english")({
  head: () => ({
    meta: [
      { title: "Slash English - Learn English Free, End to End | SlashAI" },
      {
        name: "description",
        content:
          "Learn English free end to end: vocabulary trainer, grammar clinic, spelling bee and reading practice, plus every English tool on SlashAI in one place. No sign-up, works offline.",
      },
    ],
  }),
  component: SlashEnglish,
});

/* ══════════════════════════════════════════════════════════════════════
 * Vocabulary data — 120 words that cause real trouble for learners.
 * Kept local so the whole academy works offline with no API key.
 * ══════════════════════════════════════════════════════════════════════ */

interface Word {
  w: string;
  pos: string;
  def: string;
}

const VOCAB: Word[] = [
  { w: "abandon", pos: "verb", def: "to leave something or someone completely" },
  { w: "abstract", pos: "adjective", def: "existing as an idea, not as a physical thing" },
  { w: "accurate", pos: "adjective", def: "correct in every detail" },
  { w: "achieve", pos: "verb", def: "to reach by trying hard enough" },
  { w: "acquire", pos: "verb", def: "to get or learn something you did not have" },
  { w: "adapt", pos: "verb", def: "to change so you can cope with something new" },
  { w: "adequate", pos: "adjective", def: "just enough — no more, no less" },
  { w: "admire", pos: "verb", def: "to respect or like something very much" },
  { w: "advantage", pos: "noun", def: "something that puts you in a better position" },
  { w: "affect", pos: "verb", def: "to change or influence something" },
  { w: "afford", pos: "verb", def: "to have enough money or time for it" },
  { w: "aggressive", pos: "adjective", def: "ready to attack, argue or push hard" },
  { w: "alternative", pos: "noun", def: "a different option you can choose instead" },
  { w: "ambiguous", pos: "adjective", def: "open to more than one meaning" },
  { w: "annual", pos: "adjective", def: "happening once every year" },
  { w: "apparent", pos: "adjective", def: "easy to see or understand" },
  { w: "appreciate", pos: "verb", def: "to value something, or to understand it well" },
  { w: "approach", pos: "noun", def: "a way of dealing with something; also, to move nearer" },
  { w: "appropriate", pos: "adjective", def: "suitable for the situation" },
  { w: "arbitrary", pos: "adjective", def: "decided by chance, with no reason behind it" },
  { w: "assess", pos: "verb", def: "to judge the quality or value of something" },
  { w: "assign", pos: "verb", def: "to give a task or a piece of work to someone" },
  { w: "assist", pos: "verb", def: "to help someone do something" },
  { w: "assume", pos: "verb", def: "to accept something as true without checking it" },
  { w: "attach", pos: "verb", def: "to fasten one thing to another" },
  { w: "attitude", pos: "noun", def: "the way you think and feel about something" },
  { w: "attract", pos: "verb", def: "to draw attention or interest towards something" },
  { w: "authority", pos: "noun", def: "the power to give orders and make decisions" },
  { w: "automatic", pos: "adjective", def: "happening by itself, without you doing anything" },
  { w: "barrier", pos: "noun", def: "something that blocks your way forward" },
  { w: "benefit", pos: "noun", def: "a good result you gain from something" },
  { w: "bias", pos: "noun", def: "an unfair preference for or against something" },
  { w: "capable", pos: "adjective", def: "able to do something well" },
  { w: "capacity", pos: "noun", def: "the amount something can hold or produce" },
  { w: "cease", pos: "verb", def: "to stop happening or doing something" },
  { w: "circumstance", pos: "noun", def: "a condition or situation affecting what happens" },
  { w: "commission", pos: "noun", def: "an official request to do a piece of work" },
  { w: "commit", pos: "verb", def: "to promise to do something, or to put something in" },
  { w: "compensate", pos: "verb", def: "to make up for something that caused a loss" },
  { w: "competent", pos: "adjective", def: "having enough skill to do a job well" },
  { w: "complex", pos: "adjective", def: "made of many connected parts" },
  { w: "comprehensive", pos: "adjective", def: "including everything that is needed" },
  { w: "conclude", pos: "verb", def: "to reach a decision, or to finish" },
  { w: "confirm", pos: "verb", def: "to state that something is definitely true" },
  { w: "conform", pos: "verb", def: "to behave according to an accepted rule" },
  { w: "consequence", pos: "noun", def: "a result that happens because of an action" },
  { w: "considerable", pos: "adjective", def: "large in size or importance" },
  { w: "constitute", pos: "verb", def: "to be the parts that make up a whole" },
  { w: "contemporary", pos: "adjective", def: "belonging to the present time" },
  { w: "contradict", pos: "verb", def: "to say the opposite of what someone said" },
  { w: "controversial", pos: "adjective", def: "causing strong and opposing opinions" },
  { w: "convey", pos: "verb", def: "to communicate an idea or a feeling" },
  { w: "convince", pos: "verb", def: "to make someone believe something" },
  { w: "corporate", pos: "adjective", def: "relating to a whole company" },
  { w: "criterion", pos: "noun", def: "a standard used to judge quality" },
  { w: "crucial", pos: "adjective", def: "extremely important" },
  { w: "cultivate", pos: "verb", def: "to develop a skill or a relationship over time" },
  { w: "deliberate", pos: "adjective", def: "done on purpose, not by accident" },
  { w: "demonstrate", pos: "verb", def: "to show clearly that something is true" },
  { w: "derive", pos: "verb", def: "to get something from a source" },
  { w: "deteriorate", pos: "verb", def: "to become steadily worse" },
  { w: "diminish", pos: "verb", def: "to become smaller or less important" },
  { w: "discriminate", pos: "verb", def: "to treat some people unfairly" },
  { w: "distinguish", pos: "verb", def: "to tell two things apart" },
  { w: "dominate", pos: "verb", def: "to control or be the most important part" },
  { w: "eliminate", pos: "verb", def: "to remove something completely" },
  { w: "emphasise", pos: "verb", def: "to give something extra importance" },
  { w: "enhance", pos: "verb", def: "to improve the quality of something" },
  { w: "ensure", pos: "verb", def: "to make certain that something happens" },
  { w: "equivalent", pos: "adjective", def: "equal in value, amount or meaning" },
  { w: "evaluate", pos: "verb", def: "to judge how good or useful something is" },
  { w: "exaggerate", pos: "verb", def: "to make something sound bigger than it is" },
  { w: "exceed", pos: "verb", def: "to be more than a stated amount" },
  { w: "exclude", pos: "verb", def: "to deliberately leave something out" },
  { w: "facilitate", pos: "verb", def: "to make an action easier to carry out" },
  { w: "fluctuate", pos: "verb", def: "to rise and fall repeatedly in small amounts" },
  { w: "formulate", pos: "verb", def: "to express an idea carefully and clearly" },
  { w: "framework", pos: "noun", def: "a structure of rules or ideas that supports work" },
  { w: "fundamental", pos: "adjective", def: "forming the base of everything else" },
  { w: "generate", pos: "verb", def: "to produce something, especially in large amounts" },
  { w: "guarantee", pos: "verb", def: "to promise that something will definitely happen" },
  { w: "hierarchy", pos: "noun", def: "a system in which people or things are ranked" },
  { w: "implement", pos: "verb", def: "to put a plan into real action" },
  { w: "impose", pos: "verb", def: "to force a rule or a decision on someone" },
  { w: "incentive", pos: "noun", def: "a reward that encourages you to act" },
  { w: "inevitable", pos: "adjective", def: "certain to happen; impossible to avoid" },
  { w: "initiative", pos: "noun", def: "a new plan started before anyone asks for it" },
  { w: "innovative", pos: "adjective", def: "using new ideas and methods" },
  { w: "integrate", pos: "verb", def: "to combine things so they work as one" },
  { w: "intervene", pos: "verb", def: "to step in and change what is happening" },
  { w: "justify", pos: "verb", def: "to give good reasons for something you did" },
  { w: "maintain", pos: "verb", def: "to keep something in the state it should be" },
  { w: "manipulate", pos: "verb", def: "to handle or control something skilfully" },
  { w: "mechanism", pos: "noun", def: "the part of a system that actually makes it work" },
  { w: "modify", pos: "verb", def: "to change something slightly" },
  { w: "objective", pos: "noun", def: "a result you are deliberately aiming for" },
  { w: "obtain", pos: "verb", def: "to get something you wanted" },
  { w: "occupy", pos: "verb", def: "to fill a space, time or a role" },
  { w: "overcome", pos: "verb", def: "to succeed in dealing with a difficulty" },
  { w: "perceive", pos: "verb", def: "to notice or understand something in a certain way" },
  { w: "persist", pos: "verb", def: "to continue firmly, despite difficulty" },
  { w: "phenomenon", pos: "noun", def: "something observed that can be studied" },
  { w: "potential", pos: "adjective", def: "existing as a possibility, not yet realised" },
  { w: "precise", pos: "adjective", def: "exact and accurate" },
  { w: "preliminary", pos: "adjective", def: "happening before the main part" },
  { w: "prevail", pos: "verb", def: "to be common or to win out in the end" },
  { w: "priority", pos: "noun", def: "something that must be dealt with first" },
  { w: "prominent", pos: "adjective", def: "important and easily noticed" },
  { w: "propose", pos: "verb", def: "to suggest an idea or a plan" },
  { w: "pursue", pos: "verb", def: "to follow a course of action to the end" },
  { w: "reasonable", pos: "adjective", def: "fair, sensible and not too much" },
  { w: "reinforce", pos: "verb", def: "to make something stronger" },
  { w: "reluctant", pos: "adjective", def: "unwilling and slow to agree" },
  { w: "reside", pos: "verb", def: "to live in a particular place" },
  { w: "resolve", pos: "verb", def: "to find a solution to a problem" },
  { w: "restrict", pos: "verb", def: "to keep something within limits" },
  { w: "retain", pos: "verb", def: "to keep something instead of losing it" },
  { w: "reveal", pos: "verb", def: "to show something that was hidden" },
  { w: "sequence", pos: "noun", def: "a series of things in a fixed order" },
  { w: "significant", pos: "adjective", def: "large or important enough to matter" },
  { w: "strategy", pos: "noun", def: "a long-term plan for reaching a goal" },
  { w: "submit", pos: "verb", def: "to hand in work for consideration" },
  { w: "substitute", pos: "noun", def: "a thing or person used in place of another" },
  { w: "sufficient", pos: "adjective", def: "as much as is needed, no more" },
  { w: "sustain", pos: "verb", def: "to keep something going over time" },
  { w: "technique", pos: "noun", def: "a practical method of doing something well" },
  { w: "tendency", pos: "noun", def: "a habit or likelihood that keeps repeating" },
  { w: "terminate", pos: "verb", def: "to bring something to an end" },
  { w: "threshold", pos: "noun", def: "the exact point where something starts" },
  { w: "transfer", pos: "verb", def: "to move something or someone from one place to another" },
  { w: "transition", pos: "noun", def: "the process of changing from one state to another" },
  { w: "transmit", pos: "verb", def: "to send a signal or a message onwards" },
  { w: "utilise", pos: "verb", def: "to use something effectively" },
  { w: "valid", pos: "adjective", def: "based on good reasoning; legally acceptable" },
  { w: "withdraw", pos: "verb", def: "to take back, or to move away" },
  { w: "yield", pos: "verb", def: "to give way, or to produce a result" },
];

/* ══════════════════════════════════════════════════════════════════════
 * Grammar rules — a small, honest, deterministic checker.
 * It does not claim to be AI. It catches the mistakes that actually
 * show up in learner writing, and it explains each one.
 * ══════════════════════════════════════════════════════════════════════ */

interface Rule {
  id: string;
  label: string;
  /** returns the fixed text, or null when the rule does not apply */
  fix: (s: string) => string | null;
  note: string;
}

/** Words that take “an” despite starting with a consonant letter. */
const AN_EXCEPTIONS = ["hour", "honest", "honour", "honor", "heir"];
/** Words that take “a” despite starting with a vowel letter (a /j/ or /w/ sound). */
const A_EXCEPTIONS = [
  "university",
  "unique",
  "user",
  "useful",
  "uniform",
  "union",
  "unit",
  "universal",
  "universe",
  "usage",
  "utensil",
  "utility",
  "european",
  "eulogy",
  "ubiquitous",
  "unicorn",
  "ukulele",
  "one",
  "once",
  "ewe",
];

/** “a” or “an” for the word that follows an article. */
function articleFor(word: string): "a" | "an" {
  const w = word.toLowerCase();
  if (A_EXCEPTIONS.some((x) => w === x || w.startsWith(x))) return "a";
  if (AN_EXCEPTIONS.some((x) => w === x || w.startsWith(x))) return "an";
  return /^[aeiou]/.test(w) ? "an" : "a";
}

const RULES: Rule[] = [
  {
    id: "contractions",
    label: "Missing apostrophes",
    note: "Contractions need the apostrophe. “dont”, “cant” and “isnt” are misspellings — write “don't”, “can't”, “isn't”.",
    fix: (s) => {
      const map: Record<string, string> = {
        dont: "don't",
        doesnt: "doesn't",
        didnt: "didn't",
        cant: "can't",
        couldnt: "couldn't",
        shouldnt: "shouldn't",
        wouldnt: "wouldn't",
        wont: "won't",
        isnt: "isn't",
        arent: "aren't",
        wasnt: "wasn't",
        werent: "weren't",
        hasnt: "hasn't",
        havent: "haven't",
        hadnt: "hadn't",
        mustnt: "mustn't",
        neednt: "needn't",
        shant: "shan't",
        im: "I'm",
        ive: "I've",
        ill: "I'll",
        youre: "you're",
        theyre: "they're",
        weve: "we've",
        youve: "you've",
        theyve: "they've",
      };
      return s.replace(/\b[a-z]+\b/gi, (w) => map[w.toLowerCase()] ?? w);
    },
  },
  {
    id: "a-an-vowel",
    label: "Article before a vowel sound",
    note: "Use “an” before a vowel *sound*, not before a vowel letter — so “an hour” but “a university”, and “an honest mistake” but “a hotel”.",
    fix: (s) =>
      s.replace(/\b(a|A|an|An)\s+([A-Za-z]+)\b/g, (_m, art: string, word: string) => {
        const wants = articleFor(word);
        const lower = art.toLowerCase() === "a" ? "a" : "an";
        if (lower === wants) return `${art} ${word}`;
        // keep the author's capitalisation of the article
        const cased =
          art[0] === art[0]!.toUpperCase() ? wants[0]!.toUpperCase() + wants.slice(1) : wants;
        return `${cased} ${word}`;
      }),
  },
  {
    id: "i-am",
    label: "The pronoun “I”",
    note: "“I” always takes “am” and “have”. “I” is always capitalised, even in the middle of a sentence.",
    fix: (s) =>
      s
        .replace(
          /\bi (is|are|was|has|do)\b/g,
          (_m, v: string) =>
            `I ${({ is: "am", are: "am", was: "was", has: "have", do: "do" } as Record<string, string>)[v]!}`,
        )
        .replace(/\bi\b/g, "I"),
  },
  {
    id: "singular-plural",
    label: "Subject and verb agreement",
    note: "Singular subjects take singular verbs. “Everyone”, “each”, “nobody” and company names are all singular.",
    fix: (s) =>
      s
        .replace(/\b(everyone|everybody|someone|nobody|each|neither)\s+are\b/gi, "$1 is")
        .replace(/\b(people|they|we|you)\s+is\b/gi, "$1 are")
        .replace(/\b(he|she|it|this|that)\s+are\b/gi, "$1 is"),
  },
  {
    id: "double-negative",
    label: "Double negative",
    note: "Standard English does not stack negatives. Use one negative word, not two.",
    fix: (s) =>
      s
        .replace(
          /\b(don't|doesn't|didn't|can't|won't|couldn't|shouldn't|wouldn't|isn't|aren't|wasn't|weren't)\s+(\w+)\s+nothing\b/gi,
          "$1 $2 anything",
        )
        .replace(/\bno\s+one\b/gi, "nobody")
        .replace(/\bnobody\s+(\w+)\b/gi, "nobody $1"),
  },
  {
    id: "could-of",
    label: "“Could of” is not a thing",
    note: "These are modal verbs plus “have”, which contracts to ’ve. Write “could have”, never “could of”.",
    fix: (s) => s.replace(/\b(could|should|would|must|might)\s+of\b/gi, "$1 have"),
  },
  {
    id: "less-fewer",
    label: "“Less” vs “fewer”",
    note: "“Fewer” counts separate items you can number. “Less” measures something uncountable, like mass or time.",
    fix: (s) =>
      s.replace(
        /\bless\s+(people|items|words|errors|options|people's|times|problems|ways|cases|files|mistakes)\b/gi,
        "fewer $1",
      ),
  },
  {
    id: "there-are",
    label: "“There are” vs “it is”",
    note: "Use “there is/are” to introduce existence. Use “it is” for something already identified.",
    fix: (s) =>
      s.replace(
        /\bit is\s+(a\s+)?(important|clear|true|obvious|possible|likely|necessary)\s+to\s+note\s+that\s+there\s+(is|are)\b/gi,
        "note that it is $2",
      ),
  },
  {
    id: "irregardless",
    label: "Non-words",
    note: "“Irregardless” is not a word — use “regardless”. “Alot” is two words.",
    fix: (s) => s.replace(/\birregardless\b/gi, "regardless").replace(/\balot\b/gi, "a lot"),
  },
  {
    id: "your-youre",
    label: "“Your” vs “you’re”",
    note: "“Your” shows possession. “You’re” means “you are”.",
    fix: (s) =>
      s
        .replace(
          /\byour\s+(welcome|right|wrong|late|early|correct|being|the\s+one|not\s+going)\b/gi,
          "you're $1",
        )
        .replace(
          /\byou'?re\s+(car|house|book|name|friend|idea|job|team|problem|team's)\b/gi,
          "your $1",
        ),
  },
  {
    id: "then-than",
    label: "“Then” vs “than”",
    note: "“Than” compares. “Then” tells you what happened next in time.",
    fix: (s) =>
      s
        .replace(
          /\b(more|less|lesser|greater|better|worse|fewer|other|another|twice|half)\b((?:\s+[A-Za-z]+){0,2}\s+)then\b/gi,
          "$1$2than",
        )
        .replace(
          /\bthen\s+(i|we|you|he|she|it|they)\s+(was|were|can|could|should|will|would)\b/gi,
          "than $2 $3",
        ),
  },
  {
    id: "spelling",
    label: "Common misspellings",
    note: "These are the spellings that slip through most often. Fix them once and they stop coming back.",
    fix: (s) => {
      const map: Record<string, string> = {
        definately: "definitely",
        seperate: "separate",
        recieve: "receive",
        occured: "occurred",
        acheive: "achieve",
        beleive: "believe",
        goverment: "government",
        enviroment: "environment",
        neccessary: "necessary",
        accomodate: "accommodate",
        embarass: "embarrass",
        existant: "existent",
        existance: "existence",
        independance: "independence",
        maintainance: "maintenance",
        occassion: "occasion",
        priviledge: "privilege",
        publically: "publicly",
        recomend: "recommend",
        refered: "referred",
        succesful: "successful",
        tommorow: "tomorrow",
        untill: "until",
        writting: "writing",
        usefull: "useful",
        carefull: "careful",
        alot: "a lot",
        teh: "the",
        freind: "friend",
        wich: "which",
        becuase: "because",
        thier: "their",
        adress: "address",
        concious: "conscious",
        greatful: "grateful",
        independant: "independent",
        succes: "success",
      };
      return s.replace(/\b\w+\b/g, (w) => map[w.toLowerCase()] ?? w);
    },
  },
  {
    id: "spacing",
    label: "Spacing and capitalisation",
    note: "Sentences start with a capital and end with punctuation, with no space before the full stop or comma.",
    fix: (s) =>
      s
        .replace(/[ \t]{2,}/g, " ")
        .replace(/\s+([,.;:!?])/g, "$1")
        .replace(/(^|[.!?]\s+)([a-z])/g, (_m, p: string, c: string) => p + c.toUpperCase()),
  },
];

interface Issue {
  rule: string;
  note: string;
  before: string;
  after: string;
}

function checkGrammar(input: string): { fixed: string; issues: Issue[] } {
  let text = input;
  const issues: Issue[] = [];
  for (const rule of RULES) {
    const next = rule.fix(text);
    if (next !== null && next !== text) {
      issues.push({ rule: rule.label, note: rule.note, before: text, after: next });
      text = next;
    }
  }
  return { fixed: text, issues };
}

/* ══════════════════════════════════════════════════════════════════════
 * Reading passages
 * ══════════════════════════════════════════════════════════════════════ */

interface Passage {
  title: string;
  text: string;
  level: string;
  qs: { q: string; options: string[]; answer: number }[];
}

const PASSAGES: Passage[] = [
  {
    title: "The Habit Loop",
    level: "A2",
    text: "Most people believe motivation is a feeling. It is not. Motivation is a consequence of action, and action is a consequence of identity. If you study for twenty minutes, you are not studying for twenty minutes — you are becoming a person who studies. That identity then makes the next twenty minutes easier to begin, and the cycle repeats. This is why the first session is the hardest one. You do not need discipline for the rest of your life; you need it for the first ten minutes, and only on the days you actually start.",
    qs: [
      {
        q: "According to the text, motivation is best described as…",
        options: [
          "a feeling you are born with",
          "a result of taking action",
          "a personality trait",
          "a reward from others",
        ],
        answer: 1,
      },
      {
        q: "Why does the author call the first session 'the hardest one'?",
        options: [
          "Because the material is hardest at the start",
          "Because the identity that makes it easier has not been built yet",
          "Because twenty minutes is too long",
          "Because nobody helps beginners",
        ],
        answer: 1,
      },
      {
        q: "The word 'cycle' in line 4 refers to…",
        options: [
          "a repeating loop between identity and action",
          "a bicycle used for travel",
          "a financial year",
          "a circular argument that is wrong",
        ],
        answer: 0,
      },
    ],
  },
  {
    title: "Why Cities Are Warmer",
    level: "B1",
    text: "Cities are consistently warmer than the countryside around them, often by several degrees, and the effect is strongest on calm, clear nights. The cause is not primarily the heat given off by engines, which people often assume. It is the material of the city itself. Asphalt and brick absorb solar radiation all day and release it slowly after sunset, while trees and water, which dominate the countryside, lose heat quickly through evaporation. The dense arrangement of buildings then traps the warm air in narrow streets where it cannot escape. One practical consequence is that planting street trees does more for a city's night-time temperature than replacing the most polluting vehicles.",
    qs: [
      {
        q: "What does the text identify as the main cause of urban heat?",
        options: [
          "Vehicle exhaust",
          "The heat-retaining materials and layout of the city",
          "Global warming",
          "The number of people living there",
        ],
        answer: 1,
      },
      {
        q: "Why do people often assume a different cause?",
        options: [
          "Because engineers lie",
          "Because engines are the most visible source of heat",
          "Because cities are larger than villages",
          "Because it is written in textbooks",
        ],
        answer: 1,
      },
      {
        q: "The last sentence mainly suggests that…",
        options: [
          "vehicles should be banned entirely",
          "tree planting is an effective cooling measure",
          "asphalt is the cheapest material",
          "cities should move to the countryside",
        ],
        answer: 1,
      },
    ],
  },
  {
    title: "The Cost of Convenience",
    level: "B2",
    text: "Every convenience has a cost, but the cost is rarely paid by the person who enjoys the convenience. A delivery that arrives in an hour is paid for by the rider who spends it on a bicycle in traffic; a feed tuned to your interests is paid for by a system that must decide, on your behalf, what will hold your attention. The uncomfortable implication is not that convenience is bad, but that its price is hidden precisely because it is distributed so thinly across so many people that no single individual notices it. Once a cost is invisible, no individual has a reason to object to it, and so the system expands. What would change this is not guilt but measurement — once a cost is counted, it can be argued about.",
    qs: [
      {
        q: "The word 'distributed' in line 2 most nearly means…",
        options: ["spread across many people", "destroyed", "calculated precisely", "refused"],
        answer: 0,
      },
      {
        q: "What does the author identify as the reason costs stay hidden?",
        options: [
          "Governments conceal them",
          "They are split so thinly that no one notices",
          "They are too small to measure",
          "They are paid in a different currency",
        ],
        answer: 1,
      },
      {
        q: "The author's main attitude to convenience is…",
        options: [
          "completely opposed",
          "cautious but not dismissive",
          "indifferent",
          "enthusiastic",
        ],
        answer: 1,
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════
 * Local progress
 * ══════════════════════════════════════════════════════════════════════ */

const ENGLISH_KEY = "slashai.english.progress";

function loadMastered(): Set<string> {
  try {
    const raw = localStorage.getItem(ENGLISH_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveMastered(s: Set<string>) {
  try {
    localStorage.setItem(ENGLISH_KEY, JSON.stringify([...s]));
  } catch {
    /* private mode — progress just will not persist */
  }
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const speak = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  u.rate = 0.92;
  window.speechSynthesis.speak(u);
};

const TABS = [
  { id: "vocab", label: "Vocabulary", icon: "📚" },
  { id: "grammar", label: "Grammar", icon: "🧩" },
  { id: "spelling", label: "Spelling", icon: "✍️" },
  { id: "reading", label: "Reading", icon: "📖" },
  { id: "tools", label: "All tools", icon: "🧰" },
] as const;

type Tab = (typeof TABS)[number]["id"];

/* ── shared card styles, matching the rest of the app ── */
const card = "rounded-xl border border-border bg-surface p-4";

/* ══════════════════════════════════════════════════════════════════════
 * Vocabulary trainer
 * ══════════════════════════════════════════════════════════════════════ */

function VocabularyTrainer({
  mastered,
  setMastered,
}: {
  mastered: Set<string>;
  setMastered: (s: Set<string>) => void;
}) {
  const [current, setCurrent] = useState<Word | null>(null);
  const [options, setOptions] = useState<Word[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(0);

  const next = useCallback(() => {
    const unmastered = VOCAB.filter((v) => !mastered.has(v.w));
    const source = unmastered.length ? unmastered : VOCAB;
    const answer = source[Math.floor(Math.random() * source.length)]!;
    const others = shuffle(VOCAB.filter((v) => v.w !== answer.w)).slice(0, 3);
    setCurrent(answer);
    setOptions(shuffle([answer, ...others]));
    setPicked(null);
  }, [mastered]);

  useEffect(() => {
    next();
    // draw the first card once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (i: number) => {
    if (picked !== null || !current) return;
    const chosen = options[i]!;
    setPicked(i);
    if (chosen.w === current.w) {
      const nextSet = new Set(mastered);
      nextSet.add(current.w);
      setMastered(nextSet);
      saveMastered(nextSet);
      setStreak((s) => s + 1);
      setDone((d) => d + 1);
    } else {
      setStreak(0);
    }
  };

  const advance = () => next();

  if (!current) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const answered = picked !== null;
  const right = answered && options[picked]!.w === current.w;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { k: "Mastered", v: `${mastered.size}/${VOCAB.length}` },
          { k: "Correct", v: String(done) },
          { k: "Streak", v: String(streak) },
        ].map((s) => (
          <div key={s.k} className={card}>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.k}</p>
            <p className="text-[17px] font-bold text-foreground">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 text-center">
        <button
          onClick={() => speak(current.w)}
          className="group inline-flex items-center gap-2"
          aria-label={`Hear ${current.w}`}
        >
          <span className="text-3xl font-black tracking-tight text-foreground">{current.w}</span>
          <Volume2 className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
        </button>
        <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
          {current.pos}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => {
          const isRight = o.w === current.w;
          const chosen = picked === i;
          return (
            <button
              key={o.w}
              onClick={() => choose(i)}
              disabled={answered}
              className={`rounded-xl border p-3 text-left text-[13px] leading-snug transition-colors ${
                answered && isRight
                  ? "border-emerald-500/60 bg-emerald-500/10 text-foreground"
                  : answered && chosen
                    ? "border-red-500/60 bg-red-500/10 text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {o.def}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="space-y-3">
          <p
            className={`text-center text-[13px] font-semibold ${right ? "text-emerald-400" : "text-red-400"}`}
          >
            {right ? "Correct" : `No — it means: ${current.def}`}
          </p>
          <button
            onClick={advance}
            className="h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
          >
            Next word →
          </button>
        </div>
      )}

      <p className="text-center text-[11px] text-muted-foreground">
        Words you master drop out of the deck. Once all {VOCAB.length} are done they cycle back for
        review.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * Spelling bee
 * ══════════════════════════════════════════════════════════════════════ */

const SPELLABLE = VOCAB.filter((v) => v.w.length >= 7);

function SpellingBee() {
  const [current, setCurrent] = useState<Word | null>(null);
  const [value, setValue] = useState("");
  const [reveal, setReveal] = useState(1);
  const [state, setState] = useState<"idle" | "ok" | "no">("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);

  const next = useCallback(() => {
    setCurrent(SPELLABLE[Math.floor(Math.random() * SPELLABLE.length)]!);
    setValue("");
    setReveal(1);
    setState("idle");
  }, []);

  useEffect(() => {
    next();
  }, [next]);

  if (!current) return null;

  const letters = current.w.split("");
  const showLetter = (i: number) => i < reveal || value.length > i;

  const submit = () => {
    const ok = value.trim().toLowerCase() === current.w;
    if (ok) {
      setState("ok");
      setScore((s) => s + current.w.length);
      setStreak((s) => s + 1);
    } else {
      setState("no");
      setStreak(0);
      setLives((l) => {
        if (l <= 1) {
          window.setTimeout(() => {
            setLives(3);
            next();
          }, 1600);
          return 0;
        }
        return l - 1;
      });
      setReveal(current.w.length);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { k: "Score", v: String(score) },
          { k: "Streak", v: String(streak) },
          { k: "Lives", v: "●".repeat(lives) || "—" },
        ].map((s) => (
          <div key={s.k} className={card}>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.k}</p>
            <p className="text-[17px] font-bold text-foreground">{s.v}</p>
          </div>
        ))}
      </div>

      <div
        className={`rounded-2xl border p-6 text-center transition-colors ${
          state === "ok"
            ? "border-emerald-500/60 bg-emerald-500/10"
            : state === "no"
              ? "border-red-500/60 bg-red-500/10"
              : "border-border bg-surface"
        }`}
      >
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
          Spelled correctly as
        </p>
        <p className="mt-1 text-lg text-foreground">{current.def}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          {letters.map((ch, i) => (
            <span
              key={i}
              className={`grid size-9 place-items-center rounded-lg border font-mono text-lg font-bold ${
                showLetter(i)
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border bg-surface-elevated text-muted-foreground"
              }`}
            >
              {showLetter(i) ? ch : ""}
            </span>
          ))}
        </div>
        <button
          onClick={() => speak(current.w)}
          className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-primary"
        >
          <Volume2 className="size-3.5" /> Hear it
        </button>
      </div>

      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value.replace(/[^a-zA-Z]/g, ""));
          if (state !== "idle") setState("idle");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="Type the word…"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-center font-mono text-lg tracking-widest text-foreground placeholder:tracking-normal placeholder:font-sans placeholder:text-sm focus:border-primary/50 focus:outline-none"
      />

      <div className="flex gap-2">
        <button
          onClick={() => setReveal((r) => Math.min(current.w.length, r + 1))}
          disabled={state !== "idle"}
          className="h-11 flex-1 rounded-xl border border-border bg-surface text-[13px] font-semibold text-muted-foreground disabled:opacity-40"
        >
          Reveal a letter
        </button>
        <button
          onClick={submit}
          className="h-11 flex-1 rounded-xl bg-primary text-[13px] font-bold text-primary-foreground"
        >
          {state === "ok" ? "Next →" : "Check"}
        </button>
      </div>

      {state === "ok" && (
        <button
          onClick={next}
          className="h-11 w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-sm font-bold text-emerald-400"
        >
          Correct — keep going →
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * Reading comprehension
 * ══════════════════════════════════════════════════════════════════════ */

function ReadingLab() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [asked, setAsked] = useState(0);
  const [fontScale, setFontScale] = useState(1);

  const p = PASSAGES[idx]!;
  const words = p.text.split(" ").length;

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setAsked((a) => a + 1);
    if (i === p.qs[0]!.answer) setScore((s) => s + 1);
  };

  const nextPassage = () => {
    setPicked(null);
    setIdx((i) => (i + 1) % PASSAGES.length);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] font-semibold text-muted-foreground">
        <span>
          Passage {idx + 1} of {PASSAGES.length} · {p.level} · {words} words
        </span>
        <span className="flex items-center gap-2">
          Score {score}/{asked}
          <button
            onClick={() => setFontScale((f) => (f >= 1.3 ? 0.9 : f + 0.1))}
            className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] font-bold hover:text-foreground"
          >
            A{fontScale >= 1.3 ? "+" : fontScale <= 0.9 ? "−" : ""}
          </button>
        </span>
      </div>

      <article
        className="rounded-2xl border border-border bg-surface p-5 leading-relaxed text-foreground"
        style={{ fontSize: `${fontScale}rem` }}
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[15px] font-bold">{p.title}</h3>
          <button
            onClick={() => speak(p.text)}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-primary"
          >
            <Volume2 className="size-3.5" /> Listen
          </button>
        </div>
        <p>{p.text}</p>
      </article>

      <div className="space-y-2">
        {p.qs.map((q) => (
          <div key={q.q} className={`${card} space-y-2`}>
            <p className="text-[13px] font-semibold text-foreground">{q.q}</p>
            <div className="grid gap-1.5">
              {q.options.map((o, i) => {
                const answered = picked !== null;
                const isRight = i === q.answer;
                const chosen = picked === i;
                return (
                  <button
                    key={o}
                    onClick={() => choose(i)}
                    disabled={answered}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-[12px] leading-snug transition-colors ${
                      answered && isRight
                        ? "border-emerald-500/60 bg-emerald-500/10 text-foreground"
                        : answered && chosen
                          ? "border-red-500/60 bg-red-500/10 text-foreground"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full border border-current text-[9px] font-bold">
                      {"ABCD"[i]}
                    </span>
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {picked !== null && (
        <div className="space-y-2">
          <p
            className={`text-center text-[13px] font-semibold ${picked === p.qs[0]!.answer ? "text-emerald-400" : "text-red-400"}`}
          >
            {picked === p.qs[0]!.answer ? "Correct reading" : "Not quite — read that part again"}
          </p>
          <button
            onClick={nextPassage}
            className="h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
          >
            Next passage →
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * Grammar clinic
 * ══════════════════════════════════════════════════════════════════════ */

const SAMPLE = "i dont have alot of time, and unfortunatly definately not enough money to buy it .";

function GrammarClinic() {
  const [text, setText] = useState(SAMPLE);
  const [result, setResult] = useState<{ fixed: string; issues: Issue[] } | null>(null);

  const run = () => setResult(checkGrammar(text));

  return (
    <div className="space-y-4">
      <div className={card}>
        <label
          htmlFor="english-grammar"
          className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
        >
          Paste anything you wrote
        </label>
        <textarea
          id="english-grammar"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Type or paste your English here…"
          className="mt-2 w-full resize-y rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-[13px] leading-relaxed text-foreground placeholder-muted-foreground focus:border-primary/50 focus:outline-none"
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={run}
            className="h-10 flex-1 rounded-xl bg-primary text-[13px] font-bold text-primary-foreground"
          >
            Check my English
          </button>
          <button
            onClick={() => {
              setText(SAMPLE);
              setResult(null);
            }}
            className="h-10 rounded-xl border border-border bg-surface px-3 text-[13px] font-semibold text-muted-foreground"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {result && (
        <>
          <div
            className={`rounded-2xl border p-5 ${
              result.issues.length
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-border bg-surface"
            }`}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {result.issues.length
                ? `Cleaned up ${result.issues.length} issue${result.issues.length === 1 ? "" : "s"}`
                : "Nothing this checker could flag"}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground">{result.fixed}</p>
            <button
              onClick={() => {
                void navigator.clipboard?.writeText(result.fixed);
                setText(result.fixed);
                setResult(null);
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground"
            >
              <Check className="size-3.5" /> Use this version
            </button>
          </div>

          {result.issues.map((iss, i) => (
            <details key={i} className={`${card} group`}>
              <summary className="cursor-pointer list-none text-[13px] font-bold text-foreground">
                <span className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-amber-500/20 text-[10px] text-amber-400">
                    !
                  </span>
                  {iss.rule}
                </span>
              </summary>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{iss.note}</p>
              <p className="mt-2 font-mono text-[12px] text-foreground line-through decoration-red-500/60">
                {iss.before}
              </p>
              <p className="mt-1 font-mono text-[12px] text-emerald-400">{iss.after}</p>
            </details>
          ))}

          <p className="text-center text-[11px] leading-snug text-muted-foreground">
            This is a fixed rule set covering {RULES.length} of the mistakes that show up most in
            learner writing. It runs entirely in your browser — nothing you type leaves this page.
          </p>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * Tool directory — every English tool on SlashAI, gathered in one place
 * ══════════════════════════════════════════════════════════════════════ */

const TOOL_GROUPS: {
  title: string;
  icon: string;
  items: { to: string; name: string; desc: string; icon: string }[];
}[] = [
  {
    title: "Reading & speed",
    icon: "📖",
    items: [
      {
        to: "/tools/reading",
        name: "Speed Reading Trainer",
        desc: "RSVP — one word at a time, up to 800 wpm",
        icon: "⚡",
      },
      {
        to: "/tools/readability",
        name: "Readability Checker",
        desc: "Flesch, Gunning Fog and grade level",
        icon: "📏",
      },
      {
        to: "/english",
        name: "Comprehension Lab",
        desc: "Passages with questions, built in above",
        icon: "🎯",
      },
      {
        to: "/play/capitals",
        name: "World Capitals",
        desc: "Country-to-capital drill with streaks",
        icon: "🌍",
      },
    ],
  },
  {
    title: "Writing & spelling",
    icon: "✍️",
    items: [
      {
        to: "/tools/spelling",
        name: "Spelling Checker",
        desc: "Catch typos in a block of text",
        icon: "🔍",
      },
      {
        to: "/tools/text-stats",
        name: "Text Statistics",
        desc: "Words, sentences, reading time, word frequency",
        icon: "📊",
      },
      {
        to: "/tools/grammar",
        name: "Grammar Clinic",
        desc: "The rule-based corrector, built in above",
        icon: "🧩",
      },
    ],
  },
  {
    title: "Speaking & listening",
    icon: "🔊",
    items: [
      {
        to: "/tools/text-to-speech",
        name: "Text to Speech",
        desc: "Hear any text in every installed voice",
        icon: "🗣️",
      },
      {
        to: "/tools/speech-to-text",
        name: "Speech to Text",
        desc: "Dictate and paste it straight in",
        icon: "🎙️",
      },
      {
        to: "/tools/metronome",
        name: "Metronome",
        desc: "Speech-rate practice at 60–200 wpm",
        icon: "🎵",
      },
    ],
  },
  {
    title: "Typing & speed",
    icon: "⌨️",
    items: [
      {
        to: "/play/typing-test",
        name: "Typing Speed Test",
        desc: "60 seconds — WPM, accuracy, streaks",
        icon: "⌨️",
      },
      {
        to: "/tools/hacker-typer",
        name: "Hacker Typer",
        desc: "Practise code-style touch typing",
        icon: "💻",
      },
      {
        to: "/tools/click-speed",
        name: "Click Speed Test",
        desc: "CPS in 1/5/10/30 second rounds",
        icon: "🖱️",
      },
    ],
  },
  {
    title: "Word games",
    icon: "🎮",
    items: [
      {
        to: "/play/word-scramble",
        name: "Word Scramble",
        desc: "Unscramble common words",
        icon: "🔀",
      },
      {
        to: "/play/hangman",
        name: "Hangman",
        desc: "Guess the hidden word letter by letter",
        icon: "🔤",
      },
      {
        to: "/play/word-search",
        name: "Word Search",
        desc: "Twelve themes, eight directions",
        icon: "🔍",
      },
      {
        to: "/play/word-chain",
        name: "Word Chain",
        desc: "Shiritori against the clock",
        icon: "🔗",
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════
 * Page
 * ══════════════════════════════════════════════════════════════════════ */

function SlashEnglish() {
  const [tab, setTab] = useState<Tab>("vocab");
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  useUxTick();

  useEffect(() => {
    setMastered(loadMastered());
  }, []);

  const bestTyping = getGameBest("typing-test");

  return (
    <AppShell wide title="Slash English">
      <header className="page-enter pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid size-14 place-items-center rounded-2xl bg-sky-500/15 text-[28px]">
            🇬🇧
          </span>
          <div className="min-w-0">
            <h1 className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
              Slash English
            </h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Learn English end to end — words, grammar, spelling, reading and typing. Every trainer
              works offline and nothing needs an account.
            </p>
          </div>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { k: "Vocabulary words", v: String(VOCAB.length), icon: "📚" },
          { k: "Grammar rules", v: String(RULES.length), icon: "🧩" },
          { k: "Passages", v: String(PASSAGES.length), icon: "📖" },
          { k: "You mastered", v: `${mastered.size}`, icon: "✅" },
        ].map((s) => (
          <div
            key={s.k}
            className="rounded-xl border border-border bg-surface px-3 py-2.5 text-center"
          >
            <p className="text-[17px] font-bold text-foreground">
              {s.icon} {s.v}
            </p>
            <p className="text-[10px] text-muted-foreground">{s.k}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
              tab === t.id
                ? "bg-sky-500 text-slate-950"
                : "border border-border bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 mx-auto max-w-3xl">
        {tab === "vocab" && (
          <>
            <h2 className="flex items-center gap-2 text-[15px] font-bold text-sky-400">
              <BookOpen className="size-4" /> Vocabulary Sprint
            </h2>
            <p className="mt-0.5 mb-3 text-[12px] text-muted-foreground">
              Read the word, pick its meaning. 120 words that cause real trouble — and the ones you
              master stop coming back.
            </p>
            <VocabularyTrainer mastered={mastered} setMastered={setMastered} />
          </>
        )}

        {tab === "grammar" && (
          <>
            <h2 className="flex items-center gap-2 text-[15px] font-bold text-amber-400">
              <Sparkles className="size-4" /> Grammar Clinic
            </h2>
            <p className="mt-0.5 mb-3 text-[12px] text-muted-foreground">
              Paste your English. A fixed rule set fixes the classic mistakes and explains every
              single one — fully offline, no AI, no upload.
            </p>
            <GrammarClinic />
          </>
        )}

        {tab === "spelling" && (
          <>
            <h2 className="text-[15px] font-bold text-rose-400">✍️ Spelling Bee</h2>
            <p className="mt-0.5 mb-3 text-[12px] text-muted-foreground">
              Read the definition, spell the word. Reveal a letter whenever you are stuck — three
              wrong answers and the round resets.
            </p>
            <SpellingBee />
          </>
        )}

        {tab === "reading" && (
          <>
            <h2 className="text-[15px] font-bold text-emerald-400">📖 Comprehension Lab</h2>
            <p className="mt-0.5 mb-3 text-[12px] text-muted-foreground">
              Three real passages from A2 to B2, each with a comprehension question. Hit listen to
              hear it read aloud while you read along.
            </p>
            <ReadingLab />
          </>
        )}

        {tab === "tools" && (
          <>
            <h2 className="text-[15px] font-bold text-violet-400">
              🧰 Every English tool, in one place
            </h2>
            <p className="mt-0.5 mb-3 text-[12px] text-muted-foreground">
              All the English learning tools that already live on SlashAI, gathered here so you stop
              hunting for them.
            </p>
            <div className="space-y-5">
              {TOOL_GROUPS.map((g) => (
                <section key={g.title}>
                  <h3 className="flex items-center gap-2 text-[13px] font-bold text-foreground">
                    <span>{g.icon}</span> {g.title}
                  </h3>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {g.items.map((t) => (
                      <Link
                        key={`${g.title}-${t.to}-${t.name}`}
                        to={t.to}
                        className="flex items-start gap-2.5 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-sky-500/40 hover:bg-surface-elevated"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky-500/10 text-[16px]">
                          {t.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[12.5px] font-bold text-foreground">
                            {t.name}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                            {t.desc}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            {bestTyping !== null && (
              <p className="mt-5 text-center text-[12px] font-semibold text-amber-400">
                🏆 Your best typing score: {bestTyping}
              </p>
            )}
          </>
        )}
      </div>

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        Everything here runs in your browser and works offline. Progress is saved on this device
        only — no account, no upload, no tracking.
      </p>
    </AppShell>
  );
}
