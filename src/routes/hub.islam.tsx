import { useState, useEffect, useMemo, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { ResourceCardEnhanced } from "@/components/library/ResourceCardEnhanced";

/* ──────────── types ──────────── */
interface IslamResource {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  pricing: "Completely Free" | "Free Tier" | "Open Source";
  lastVerified: string;
}

interface HubSection {
  icon: string;
  title: string;
  items: IslamResource[];
}

/* ──────────── 53 resources across 10 sections ──────────── */
const SECTIONS: HubSection[] = [
  {
    icon: "\u{1F4D6}",
    title: "Quran — Read, Listen & Study",
    items: [
      { id: "quran-com", name: "Quran.com", url: "https://quran.com", description: "Complete Quran with Arabic text, transliteration, word-by-word translation in 90+ languages, verse-by-verse audio from 50+ reciters, and tafsir from Ibn Kathir, Al-Jalalayn, and others. No account needed.", category: "Quran", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "alquran-cloud-api", name: "Al-Quran Cloud API", url: "https://alquran.cloud/api", description: "Keyless REST API returning the full Quran in Arabic, translations, transliterations, Juz, Surah, and individual ayah data. Used to build Quran apps and widgets with no auth required.", category: "API · Quran", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "quran-foundation-gh", name: "Quran Foundation GitHub", url: "https://github.com/quran", description: "Open-source repositories behind Quran.com — the Quran API, audio files, translations dataset, and mobile apps. All freely available for developers building Islamic apps.", category: "GitHub · Quran", pricing: "Open Source", lastVerified: "2026-08-27" },
      { id: "tanzil-net", name: "Tanzil.net", url: "https://tanzil.net", description: "Verified Quran text in Unicode Arabic, downloadable in multiple formats (XML, text, SQL). Widely used as the source for Quran apps. Also has a simple online reader.", category: "Quran", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "iqra-app", name: "iQra (Quran word-by-word)", url: "https://iqra.app", description: "Learn to read the Quran word by word with color-coded grammar, vocabulary, and root analysis. Helps beginners understand Arabic directly from the Quran text.", category: "Quran Learning", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "quran-companion", name: "Quran Companion", url: "https://qurancompanion.org", description: "Daily Quran reading tracker with audio recitation, memorization tools, and translation. Clean, distraction-free interface. No account required for basic reading.", category: "Quran", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "mp3quran-net", name: "MP3Quran.net", url: "https://mp3quran.net/eng", description: "Free MP3 downloads of the complete Quran recited by 100+ reciters including Mishary Rashid Alafasy, Abdul Rahman Al-Sudais, Saad Al-Ghamdi, and Maher Al-Muaiqly. No signup required.", category: "Quran Audio", pricing: "Completely Free", lastVerified: "2026-08-27" },
    ],
  },
  {
    icon: "\u{1F4DA}",
    title: "Hadith — Collections & Search",
    items: [
      { id: "sunnah-com", name: "Sunnah.com", url: "https://sunnah.com", description: "The most complete free Hadith database online — Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah, Malik's Muwatta, Riyadh al-Salihin, and more. Searchable in Arabic and English.", category: "Hadith", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "hadithapi-com", name: "HadithAPI", url: "https://hadithapi.com", description: "RESTful API for all major Hadith collections in Arabic and English. Free account gives access to Bukhari, Muslim, Tirmidhi, and more. Useful for developers building Islamic apps.", category: "API · Hadith", pricing: "Free Tier", lastVerified: "2026-08-27" },
      { id: "hadith-api-gh", name: "hadith-api (GitHub, open source)", url: "https://github.com/fawazahmed0/hadith-api", description: "Completely free, open-source Hadith API hosted on GitHub CDN. No authentication, no rate limit. Covers Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah in multiple languages including Urdu and Bengali.", category: "GitHub · Hadith", pricing: "Open Source", lastVerified: "2026-08-27" },
      { id: "quran-api-gh", name: "hadith-translation (fawazahmed0 GitHub)", url: "https://github.com/fawazahmed0/quran-api", description: "Free Quran and Hadith data as static JSON files hosted on GitHub CDN — 90+ languages, word meanings, and translations. No key, no server needed. Just fetch the URL.", category: "GitHub · Quran & Hadith", pricing: "Open Source", lastVerified: "2026-08-27" },
    ],
  },
  {
    icon: "\u{1F54C}",
    title: "Prayer Times & Daily Tools",
    items: [
      { id: "aladhan-api", name: "Aladhan API", url: "https://aladhan.com/prayer-times-api", description: "Keyless REST API for prayer times worldwide — by city, coordinates, or country. Returns Fajr, Dhuhr, Asr, Maghrib, Isha, Qibla direction, and Hijri date. Supports all major calculation methods.", category: "API · Prayer Times", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "muslim-pro", name: "Muslim Pro (free web)", url: "https://www.muslimpro.com", description: "Prayer times, Qibla direction, Quran, Hijri calendar, and mosque finder. Free on web. One of the most used Islamic apps globally with 100M+ downloads.", category: "Prayer & Daily Tools", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "athan-com", name: "Athan.com", url: "https://athan.com", description: "Accurate prayer times for any city, Qibla direction, Quran reader, and Hijri calendar. Clean and fast, no account needed.", category: "Prayer Times", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "islamicfinder-org", name: "IslamicFinder", url: "https://www.islamicfinder.org", description: "Prayer times, Ramadan calendar, Hijri date converter, mosque finder, Zakat calculator, and Islamic events for any location.", category: "Prayer & Calendar", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "qibla-connect", name: "Qibla Connect (web)", url: "https://qiblaconnect.com", description: "Browser-based Qibla direction finder using device geolocation. Works on mobile without any app install.", category: "Qibla", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "hijri-calendar-api", name: "Hijri Calendar API (aladhan)", url: "https://aladhan.com/islamic-calendar-api", description: "Convert between Gregorian and Hijri dates, get full monthly Hijri calendar, and fetch upcoming Islamic events — all free, no key, REST API.", category: "API · Hijri Calendar", pricing: "Completely Free", lastVerified: "2026-08-27" },
    ],
  },
  {
    icon: "\u{1F393}",
    title: "Islamic Learning — Courses & Education",
    items: [
      { id: "seekersguidance", name: "SeekersGuidance", url: "https://seekersguidance.org", description: "Completely free structured Islamic courses taught by qualified scholars — Fiqh, Aqeedah, Quran, Hadith, Arabic, Seerah, and personal development. 100+ courses available with no fees ever.", category: "Islamic Courses", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "bayyinah-podcast", name: "Bayyinah TV (free content)", url: "https://bayyinah.com/podcast", description: "Ustadh Nouman Ali Khan's free podcast content — Quran tafsir, Arabic language, and Islamic reflection. The Dream Arabic podcast alone is one of the most popular free Arabic resources.", category: "Arabic & Quran", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "iou-edu-gm", name: "Islamic Online University (free diploma)", url: "https://iou.edu.gm", description: "Dr. Bilal Philips' Islamic Online University offers a free diploma in Islamic studies covering Quran, Hadith, Fiqh, Arabic, Aqeedah, and Seerah. Certificates available at low cost.", category: "Islamic Courses", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "yaqeen-institute", name: "Yaqeen Institute (free research)", url: "https://yaqeeninstitute.org", description: "Free papers, podcasts, infographics, and videos addressing contemporary questions on Islam, faith, and identity. Academically referenced and freely downloadable.", category: "Islamic Research", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "muslim-central", name: "Muslim Central (podcasts & lectures)", url: "https://muslimcentral.com", description: "Free audio lectures and podcasts from 400+ scholars — Mufti Menk, Nouman Ali Khan, Omar Suleiman, and more. Searchable by scholar, topic, or lecture series.", category: "Islamic Lectures", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "al-mawrid", name: "Al-Mawrid Institute (free content)", url: "https://al-mawrid.org", description: "Free articles, books, and audio on Islamic jurisprudence, Quran commentary, and contemporary Islamic thought from Javed Ahmad Ghamidi. Available in Urdu and English.", category: "Islamic Knowledge", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "quran-academy", name: "Quran Academy (free reading)", url: "https://quranacademy.io", description: "Learn to read, memorize, and understand the Quran with tajweed rules. Free tier covers the basics of Makharij and beginner recitation lessons.", category: "Quran Learning", pricing: "Free Tier", lastVerified: "2026-08-27" },
    ],
  },
  {
    icon: "\u{1F3AC}",
    title: "Scholars & YouTube Channels",
    items: [
      { id: "yt-bayyinah", name: "Nouman Ali Khan — Bayyinah", url: "https://www.youtube.com/@bayyinah", description: "Deep Quranic tafsir and Arabic language lessons from one of the most accessible contemporary scholars. Millions of free lectures on YouTube covering the full Quran and Arabic grammar.", category: "YouTube · Quran & Arabic", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "yt-mufti-menk", name: "Mufti Menk", url: "https://www.youtube.com/@MuftiMenk", description: "Daily Islamic reminders and lectures from Zimbabwe's Grand Mufti. Calm, practical, and grounded in everyday life. One of the most followed Muslim scholars on social media.", category: "YouTube · Islamic Lectures", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "yt-yaqeen", name: "Omar Suleiman — Yaqeen Institute", url: "https://www.youtube.com/@YaqeenInstitute", description: "Faith-based content with academic depth — Ramadan series, Seerah, and contemporary Islamic issues. Produced by the Yaqeen Institute with high production quality.", category: "YouTube · Islamic Research", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "yt-yasir-qadhi", name: "IslamQA (Dr. Yasir Qadhi — AlMaghrib)", url: "https://www.youtube.com/@YasirQadhi", description: "Detailed scholarly content on Islamic theology, contemporary Fiqh questions, and Seerah from Dr. Yasir Qadhi. Extensive free library covering Aqeedah Al-Tahawiyyah and more.", category: "YouTube · Fiqh & Aqeedah", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "yt-merciful-servant", name: "Merciful Servant", url: "https://www.youtube.com/@MercifulServant", description: "Beautiful short-form Islamic reminder videos covering stories of the Prophets, Sahaba, and Quranic reflections. Very accessible for new Muslims and young audiences.", category: "YouTube · Islamic Reminders", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "yt-tim-humble", name: "Muhammad Tim Humble", url: "https://www.youtube.com/@MuhammadTimHumble", description: "Detailed explanations of classical Islamic texts — Aqeedah, Tafsir, and Hadith sciences. Particularly strong on Ibn Taymiyyah and scholarly classical works.", category: "YouTube · Aqeedah & Fiqh", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "yt-abu-layth", name: "Mufti Abu Layth", url: "https://www.youtube.com/@MuftiAbuLayth", description: "Contemporary Islamic jurisprudence, usul al-fiqh, and Arabic language content. Known for nuanced scholarly depth and approachable style for advanced learners.", category: "YouTube · Fiqh & Arabic", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "yt-islamic-guidance", name: "Islamic Guidance", url: "https://www.youtube.com/@IslamicGuidance", description: "Short, powerful reminders on Islamic ethics, spirituality, and the afterlife. High quality narration over scenic visuals. Widely shared for dawah purposes.", category: "YouTube · Islamic Reminders", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "yt-one-islam", name: "One Islam Productions", url: "https://www.youtube.com/@OneIslamProductions", description: "Compilation lectures from multiple major scholars on a wide range of Islamic topics. Useful for discovering different scholarly perspectives in one channel.", category: "YouTube · Islamic Lectures", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "yt-sandala", name: "Hamza Yusuf — Sandala", url: "https://www.youtube.com/@sandalaproductions", description: "Traditional Islamic scholarship from Sheikh Hamza Yusuf — logic, theology, Arabic, and classical Islamic thought. Dense, intellectually rich content for serious students of Islam.", category: "YouTube · Islamic Studies", pricing: "Completely Free", lastVerified: "2026-08-27" },
    ],
  },
  {
    icon: "\u{1F4D5}",
    title: "Islamic Books & Texts (Free)",
    items: [
      { id: "archive-islamic", name: "Internet Archive — Islamic Books", url: "https://archive.org/search?query=islamic+books&mediatype=texts", description: "Thousands of free Islamic books scanned and uploaded to the Internet Archive — classical fiqh texts, tafsir, hadith collections, and contemporary Islamic literature in many languages.", category: "Books", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "dar-al-iftaa", name: "Dar al-Iftaa (Egypt) — free fatwas", url: "https://www.dar-alifta.org/en", description: "Official fatwa database from Egypt's Dar al-Iftaa — searchable library of Islamic rulings on contemporary and classical questions. In Arabic and English.", category: "Fatwa & Fiqh", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "islamqa-info", name: "IslamQA.info", url: "https://islamqa.info/en", description: "Supervised by Sheikh Muhammad Saalih al-Munajjid — one of the largest Islamic Q&A databases online. 200,000+ questions and answers on Fiqh, Aqeedah, worship, and daily life in 11 languages.", category: "Fatwa & Fiqh", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "seerah-project", name: "Seerah Project (free e-books)", url: "https://seerahproject.com", description: "Free Seerah (biography of the Prophet ﷺ) resources including lecture notes, timelines, and reading guides. Good companion to formal Seerah study courses.", category: "Seerah", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "al-islam-org", name: "Al-Islam.org", url: "https://www.al-islam.org", description: "Digital library of free Islamic books covering theology, philosophy, ethics, and history. Multilingual. Well organized for academic and personal study.", category: "Books & Texts", pricing: "Completely Free", lastVerified: "2026-08-27" },
    ],
  },
  {
    icon: "\u{1F319}",
    title: "Ramadan & Islamic Calendar Tools",
    items: [
      { id: "ramadan-legacy", name: "Ramadan Legacy", url: "https://ramadanlegacy.com", description: "Free Ramadan planner with daily Quran reading schedule, duaa tracker, charity log, and Seerah reminders. Designed to help make the most of every day of Ramadan.", category: "Ramadan", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "30days-app", name: "30Days.app", url: "https://30days.app", description: "Simple free Ramadan tracker — prayer logs, fasting tracker, Quran progress, and daily Seerah. Offline-capable with no signup.", category: "Ramadan", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "islamic-calendar-if", name: "Islamic Calendar (IslamicFinder)", url: "https://www.islamicfinder.org/islamic-calendar", description: "Full Hijri calendar with all Islamic months, key dates (Eid ul-Fitr, Eid ul-Adha, Laylat al-Qadr, Muharram), and Gregorian cross-reference. Downloadable as PDF.", category: "Hijri Calendar", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "zakat-nzf", name: "Zakat Calculator (NZF)", url: "https://www.nzf.org.uk/zakat/zakat-calculator", description: "Free Zakat calculator from the National Zakat Foundation. Enter assets, liabilities, gold, silver, and savings to calculate the exact Zakat amount owed.", category: "Zakat", pricing: "Completely Free", lastVerified: "2026-08-27" },
    ],
  },
  {
    icon: "\u{1F54B}",
    title: "Hajj & Umrah Resources",
    items: [
      { id: "nusuk-sa", name: "Nusuk (Official Saudi Portal)", url: "https://www.nusuk.sa/en", description: "Official Saudi government portal for Umrah and Hajj registration, visa, packages, and service information. Free to use for planning and registration guidance.", category: "Hajj & Umrah", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "hajj-guide-if", name: "Hajj Guide (IslamicFinder)", url: "https://www.islamicfinder.org/hajj-guide", description: "Step-by-step free Hajj guide covering all rituals — Tawaf, Sa'i, Mina, Arafat, Muzdalifah, and the days of Tashreeq. With maps, duaas for each step, and common mistakes to avoid.", category: "Hajj", pricing: "Completely Free", lastVerified: "2026-08-27" },
    ],
  },
  {
    icon: "\u{1F4FF}",
    title: "Dhikr, Duaa & Spiritual Tools",
    items: [
      { id: "hisnulmuslim", name: "Duaa & Dhikr (Hisnul Muslim)", url: "https://hisnulmuslim.com", description: "Complete free digital version of Hisnul Muslim (Fortress of the Muslim) — the most popular collection of authentic daily supplications from the Quran and Sunnah. In Arabic with English translation.", category: "Duaa", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "dua-api-gh", name: "Daily Duaa API (GitHub)", url: "https://github.com/AAChemistry/DuaAPI", description: "Open-source API returning authenticated duas from Hisnul Muslim in Arabic and English. Free for developers to integrate into apps, widgets, or daily reminder systems.", category: "GitHub · Duaa API", pricing: "Open Source", lastVerified: "2026-08-27" },
      { id: "muslim-co", name: "Muslim.co", url: "https://muslim.co", description: "Prayer times, Quran, Qibla, Tasbeeh counter, Asmaul Husna (99 Names of Allah), and daily Duaa — all in one clean free website. Works offline as a PWA.", category: "Daily Tools", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "99-names", name: "99 Names of Allah", url: "https://www.99namesofallah.name", description: "All 99 Names of Allah in Arabic with transliteration, meaning in English, and short explanation of each name. Clean, ad-free, no signup.", category: "Asmaul Husna", pricing: "Completely Free", lastVerified: "2026-08-27" },
    ],
  },
  {
    icon: "\u{1F30D}",
    title: "Subreddit & Community Resources",
    items: [
      { id: "reddit-islam", name: "r/islam", url: "https://reddit.com/r/islam", description: "800k+ member Muslim community on Reddit — Q&A, news, resources, and discussion on Islamic topics. Moderated to maintain respectful discourse.", category: "Reddit · Community", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "reddit-learnquran", name: "r/learnquran", url: "https://reddit.com/r/learnquran", description: "Community dedicated to learning Quran recitation, tajweed, and memorization. Resources, tips, and encouragement from learners at all levels.", category: "Reddit · Quran Learning", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "reddit-islamichistory", name: "r/islamichistory", url: "https://reddit.com/r/islamichistory", description: "Islamic history posts, articles, and discussion. Maps, timelines, biographical profiles of historical figures, and primary sources shared by the community.", category: "Reddit · Islamic History", pricing: "Completely Free", lastVerified: "2026-08-27" },
      { id: "reddit-muslimlounge", name: "r/MuslimLounge", url: "https://reddit.com/r/MuslimLounge", description: "Casual Muslim community subreddit — lifestyle, culture, humor, and everyday Muslim life discussion. Welcoming to new Muslims and those exploring Islam.", category: "Reddit · Community", pricing: "Completely Free", lastVerified: "2026-08-27" },
    ],
  },
];

/* ──────────── live widget types ──────────── */
interface PrayerData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface HijriData {
  data: { hijri: { day: string; month: { en: string }; year: string } };
}

interface QuranVerse {
  data: {
    numberInSurah: number;
    text: string;
    edition: { name: string };
  };
}

/* ──────────── constants ──────────── */
const TOTAL_RESOURCES = SECTIONS.reduce((sum, s) => sum + s.items.length, 0);

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return ""; }
}

const PRICING_STYLE: Record<string, { text: string; bg: string; border: string }> = {
  "Completely Free": { text: "#3fb950", bg: "rgba(63,185,80,0.1)", border: "rgba(63,185,80,0.3)" },
  "Free Tier": { text: "#58a6ff", bg: "rgba(88,166,255,0.1)", border: "rgba(88,166,255,0.3)" },
  "Open Source": { text: "#d29922", bg: "rgba(210,153,34,0.1)", border: "rgba(210,153,34,0.3)" },
};

/* ──────────── resource card (inline, matching project style) ──────────── */
function IslamResourceCard({ resource }: { resource: IslamResource }) {
  const [saved, setSaved] = useState(() => {
    try { const s = localStorage.getItem("slashai-saved-resources"); return s ? JSON.parse(s) as string[] : []; } catch { return []; }
  });
  const domain = getDomain(resource.url);
  const isSaved = saved.includes(resource.id);
  const ps = PRICING_STYLE[resource.pricing] ?? PRICING_STYLE["Completely Free"]!;

  const toggleSave = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setSaved((prev) => {
      const next = isSaved ? prev.filter((id) => id !== resource.id) : [...prev, resource.id];
      localStorage.setItem("slashai-saved-resources", JSON.stringify(next));
      return next;
    });
  }, [isSaved, resource.id]);

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="resource-card-enhanced group"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg text-[18px] font-bold" style={{ background: "var(--surface-elevated)", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
        {domain ? (
          <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" className="size-6 rounded" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; const p = e.currentTarget.parentElement; if (p && !p.querySelector(".fallback-letter")) { const s = document.createElement("span"); s.className = "fallback-letter"; s.textContent = resource.name.charAt(0).toUpperCase(); p.appendChild(s); } }} />
        ) : (
          <span>{resource.name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-foreground">{resource.name}</p>
        <p className="mt-0.5 line-clamp-2 text-[13px] text-muted-foreground">{resource.description}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px]" style={{ background: "var(--surface-elevated)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>{resource.category}</span>
          <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px]" style={{ background: ps.bg, borderColor: ps.border, color: ps.text }}>{resource.pricing}</span>
          <span className="text-[10px] text-muted-foreground">Last checked {resource.lastVerified}</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <span className="flex h-8 items-center gap-1 rounded-md border px-2.5 text-[10px] font-medium transition-all duration-150" style={{ background: "var(--surface-elevated)", borderColor: "var(--border)", color: "var(--primary)" }}>Visit →</span>
        <button type="button" onClick={toggleSave} className="rounded p-1 transition-colors duration-150" style={{ color: isSaved ? "#58a6ff" : "#8b949e" }} aria-label={isSaved ? "Unsave" : "Save"}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "#58a6ff" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>
    </a>
  );
}

/* ──────────── custom hooks for widgets ──────────── */
function usePrayerData(city: string) {
  const [prayer, setPrayer] = useState<PrayerData | null>(null);

  useEffect(() => {
    fetch(`https://api.aladhan.com/v1/timingsByCity/${city}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.timings) {
          setPrayer({
            fajr: d.data.timings.Fajr,
            sunrise: d.data.timings.Sunrise,
            dhuhr: d.data.timings.Dhuhr,
            asr: d.data.timings.Asr,
            maghrib: d.data.timings.Maghrib,
            isha: d.data.timings.Isha,
          });
        }
      })
      .catch(() => {});
  }, [city]);

  return prayer;
}

function useHijriData() {
  const [hijri, setHijri] = useState<HijriData | null>(null);

  useEffect(() => {
    const today = new Date();
    fetch(`https://api.aladhan.com/v1/gToH/${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`)
      .then((r) => r.json())
      .then((d) => { if (d.data) setHijri(d); })
      .catch(() => {});
  }, []);

  return hijri;
}

function useVerseData() {
  const [verse, setVerse] = useState<{ arabic: string; english: string; ref: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const ayahNum = (dayOfYear % 6236) + 1; // 6236 total ayahs
    const cacheKey = `slashai-quran-votd-${today.toISOString().slice(0, 10)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setVerse(JSON.parse(cached));
      setLoading(false);
      return;
    }
    Promise.all([
      fetch(`https://api.alquran.cloud/v1/ayah/${ayahNum}/en.asad`).then((r) => r.json()),
      fetch(`https://api.alquran.cloud/v1/ayah/${ayahNum}/ar.alafasy`).then((r) => r.json()),
    ])
      .then(([en, ar]) => {
        if (en.data && ar.data) {
          const v = { arabic: ar.data.text, english: en.data.text, ref: `Surah ${en.data.surah.number} (${en.data.surah.englishName}), Ayah ${en.data.numberInSurah}` };
          setVerse(v);
          localStorage.setItem(cacheKey, JSON.stringify(v));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { verse, loading };
}

function useNextPrayer(prayer: PrayerData | null) {
  return useMemo(() => {
    if (!prayer) return null;
    const now = new Date();
    const prayers = [
      { name: "Fajr", time: prayer.fajr },
      { name: "Sunrise", time: prayer.sunrise },
      { name: "Dhuhr", time: prayer.dhuhr },
      { name: "Asr", time: prayer.asr },
      { name: "Maghrib", time: prayer.maghrib },
      { name: "Isha", time: prayer.isha },
    ];
    for (const p of prayers) {
      const parts = p.time.split(":");
      const h = Number(parts[0] ?? 0);
      const m = Number(parts[1] ?? 0);
      const pDate = new Date(now);
      pDate.setHours(h, m, 0, 0);
      if (pDate > now) return { name: p.name, time: p.time };
    }
    return { name: prayers[0]!.name, time: prayers[0]!.time }; // wraps to tomorrow
  }, [prayer]);
}

/* ──────────── widget components ──────────── */
function PrayerTimesWidget({
  city,
  prayer,
  nextPrayer,
}: {
  city: string;
  prayer: PrayerData | null;
  nextPrayer: { name: string; time: string } | null;
}) {
  return (
    <div className="rounded-[10px] border border-border bg-surface p-4">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Next Prayer • {city}</p>
      {nextPrayer ? (
        <p className="mt-1.5 text-[20px] font-bold text-foreground">
          {nextPrayer.name} <span className="text-[14px] font-normal text-muted-foreground">{nextPrayer.time}</span>
        </p>
      ) : (
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          <Link to="/live" className="text-primary hover:underline">Set your city on Live page →</Link>
        </p>
      )}
      <div className="mt-2 flex gap-2 text-[11px] text-muted-foreground">
        {prayer && ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((p) => (
          <span key={p} className={nextPrayer?.name === p ? "font-semibold text-primary" : ""}>
            {p}: {prayer[p.toLowerCase() as keyof PrayerData]}
          </span>
        ))}
      </div>
    </div>
  );
}

function HijriDateWidget({ hijri }: { hijri: HijriData | null }) {
  return (
    <div className="rounded-[10px] border border-border bg-surface p-4">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Hijri Date</p>
      {hijri?.data?.hijri ? (
        <p className="mt-1.5 text-[20px] font-bold text-foreground">
          {hijri.data.hijri.day} {hijri.data.hijri.month.en} {hijri.data.hijri.year} AH
        </p>
      ) : (
        <div className="mt-3 h-5 w-3/4 rounded skeleton-block" />
      )}
    </div>
  );
}

function VerseOfTheDayWidget({ verse }: { verse: { arabic: string; english: string; ref: string } | null }) {
  return (
    <div className="rounded-[10px] border border-border bg-surface p-4">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Verse of the Day</p>
      {verse ? (
        <>
          <p className="mt-1.5 text-[18px] leading-relaxed text-foreground" dir="rtl" style={{ fontFamily: "serif" }}>
            {verse.arabic}
          </p>
          <p className="mt-1.5 line-clamp-2 text-[13px] text-muted-foreground">{verse.english}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{verse.ref}</p>
        </>
      ) : (
        <div className="mt-3 space-y-2">
          <div className="h-5 w-full rounded skeleton-block" />
          <div className="h-3 w-2/3 rounded skeleton-block" />
        </div>
      )}
    </div>
  );
}

/* ──────────── live widgets ──────────── */
function LiveWidgetBar() {
  const city = localStorage.getItem("slashai-prayer-city") || "Hyderabad";
  const prayer = usePrayerData(city);
  const hijri = useHijriData();
  const { verse, loading } = useVerseData();
  const nextPrayer = useNextPrayer(prayer);

  if (loading && !prayer && !hijri && !verse) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-[10px] border border-border bg-surface p-4">
            <div className="h-3 w-1/2 rounded skeleton-block" />
            <div className="mt-3 h-5 w-3/4 rounded skeleton-block" />
            <div className="mt-2 h-3 w-full rounded skeleton-block" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <PrayerTimesWidget city={city} prayer={prayer} nextPrayer={nextPrayer} />
      <HijriDateWidget hijri={hijri} />
      <VerseOfTheDayWidget verse={verse} />
    </div>
  );
}

/* ──────────── page component ──────────── */
export const Route = createFileRoute("/hub/islam")({
  head: () => ({
    meta: [
      { title: "Islam Hub — Quran, Hadith, prayer, learning & daily tools | SlashAI" },
      { name: "description", content: "Free, authentic Islamic resources — Quran, Hadith, prayer, learning and daily tools. Everything here is completely free." },
      { property: "og:title", content: "Islam Hub — SlashAI" },
      { property: "og:description", content: "Free, authentic Islamic resources — Quran, Hadith, prayer, learning and daily tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: IslamHubPage,
});

function IslamHubPage() {
  return (
    <AppShell wide hideHeaderSearch title="Islam Hub" back={{ to: "/hub", label: "Hubs" }}>
      {/* Header */}
      <header className="page-enter pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Islam Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Free, authentic Islamic resources — Quran, Hadith, prayer, learning and daily tools. Everything here is completely free.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {TOTAL_RESOURCES} resources
        </p>
      </header>

      {/* Live Widget Bar */}
      <div className="mt-5">
        <LiveWidgetBar />
      </div>

      {/* Sections */}
      <div className="mt-6">
        {SECTIONS.map((section, i) => (
          <section key={section.title} className={i > 0 ? "mt-7" : ""}>
            <div className="hub-section-header">
              <span className="text-[20px]" aria-hidden>{section.icon}</span>
              <h2 className="min-w-0 flex-1 text-[18px] font-semibold text-foreground">{section.title}</h2>
              <span className="shrink-0 text-[12px] text-muted-foreground">{section.items.length} resources</span>
            </div>
            <div className="flex flex-col gap-2">
              {section.items.map((r) => (
                <IslamResourceCard key={r.id} resource={r} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
