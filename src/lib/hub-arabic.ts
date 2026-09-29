/**
 * Arabic resources, the full alphabet, and starter phrases.
 *
 * Extracted verbatim from the old /hub/* route by scripts/extract-hub-data.mjs.
 * These entries were never in src/lib/resources.ts, which is why they had to be
 * moved into a module before the hub routes could be redirected into SlashBar
 * categories. Do not hand-edit; re-run the extractor instead.
 */

export interface ArabicResource {
  title: string;
  desc: string;
  url: string;
  icon: string;
}

export interface ArabicLetter {
  letter: string;
  name: string;
  sound: string;
}

export interface ArabicPhrase {
  arabic: string;
  english: string;
}

export const ARABIC_RESOURCES: ArabicResource[] = [
  {
    title: "Madinah Arabic Books",
    desc: "Free PDF textbooks - the gold standard for learning Arabic",
    url: "https://www.madinaharabic.com/",
    icon: "📚",
  },
  {
    title: "Bayyinah Dream Program",
    desc: "Free podcast content by Nouman Ali Khan - understand the Quran in Arabic",
    url: "https://dream.bayyinah.com/",
    icon: "🎧",
  },
  {
    title: "Duolingo Arabic",
    desc: "Free interactive Arabic course - Modern Standard Arabic",
    url: "https://www.duolingo.com/course/ar/en",
    icon: "🦉",
  },
  {
    title: "Google Fonts - Arabic",
    desc: "Free Arabic web fonts: Amiri, Noto Naskh, Tajawal, Cairo",
    url: "https://fonts.google.com/?subset=arabic",
    icon: "🔤",
  },
];

export const ARABIC_ALPHABET: ArabicLetter[] = [
  {
    letter: "ا",
    name: "Alif",
    sound: "a",
  },
  {
    letter: "ب",
    name: "Baa",
    sound: "b",
  },
  {
    letter: "ت",
    name: "Taa",
    sound: "t",
  },
  {
    letter: "ث",
    name: "Thaa",
    sound: "th",
  },
  {
    letter: "ج",
    name: "Jeem",
    sound: "j",
  },
  {
    letter: "ح",
    name: "Haa",
    sound: "h",
  },
  {
    letter: "خ",
    name: "Khaa",
    sound: "kh",
  },
  {
    letter: "د",
    name: "Dal",
    sound: "d",
  },
  {
    letter: "ذ",
    name: "Dhal",
    sound: "dh",
  },
  {
    letter: "ر",
    name: "Raa",
    sound: "r",
  },
  {
    letter: "ز",
    name: "Zay",
    sound: "z",
  },
  {
    letter: "س",
    name: "Seen",
    sound: "s",
  },
  {
    letter: "ش",
    name: "Sheen",
    sound: "sh",
  },
  {
    letter: "ص",
    name: "Saad",
    sound: "s'",
  },
  {
    letter: "ض",
    name: "Daad",
    sound: "d'",
  },
  {
    letter: "ط",
    name: "Taa",
    sound: "t'",
  },
  {
    letter: "ظ",
    name: "Dhaa",
    sound: "z'",
  },
  {
    letter: "ع",
    name: "Ayn",
    sound: "3",
  },
  {
    letter: "غ",
    name: "Ghayn",
    sound: "gh",
  },
  {
    letter: "ف",
    name: "Faa",
    sound: "f",
  },
  {
    letter: "ق",
    name: "Qaf",
    sound: "q",
  },
  {
    letter: "ك",
    name: "Kaaf",
    sound: "k",
  },
  {
    letter: "ل",
    name: "Laam",
    sound: "l",
  },
  {
    letter: "م",
    name: "Meem",
    sound: "m",
  },
  {
    letter: "ن",
    name: "Noon",
    sound: "n",
  },
  {
    letter: "ه",
    name: "Haa",
    sound: "h",
  },
  {
    letter: "و",
    name: "Waaw",
    sound: "w",
  },
  {
    letter: "ي",
    name: "Yaa",
    sound: "y",
  },
];

export const ARABIC_PHRASES: ArabicPhrase[] = [
  {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    english: "In the name of Allah, the Most Gracious, the Most Merciful",
  },
  {
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    english: "All praise is due to Allah, Lord of the worlds",
  },
  {
    arabic: "سُبْحَانَ اللَّه",
    english: "Glory be to Allah",
  },
  {
    arabic: "اللَّهُ أَكْبَر",
    english: "Allah is the Greatest",
  },
  {
    arabic: "أَسْتَغْفِرُ اللَّه",
    english: "I seek forgiveness from Allah",
  },
  {
    arabic: "لَا إِلَهَ إِلَّا اللَّه",
    english: "There is no god but Allah",
  },
  {
    arabic: "جَزَاكَ اللَّهُ خَيْرًا",
    english: "May Allah reward you with goodness",
  },
  {
    arabic: "إِنْ شَاءَ اللَّه",
    english: "If Allah wills",
  },
  {
    arabic: "مَا شَاءَ اللَّه",
    english: "What Allah has willed",
  },
  {
    arabic: "صَبَاحَ الْخَيْر",
    english: "Good morning",
  },
];
