/**
 * Islamic resources: ${items.length} hand-checked links across ${sections.length} sections.
 *
 * Extracted verbatim from the old /hub/* route by scripts/extract-hub-data.mjs.
 * These entries were never in src/lib/resources.ts, which is why they had to be
 * moved into a module before the hub routes could be redirected into SlashBar
 * categories. Do not hand-edit; re-run the extractor instead.
 */

export interface IslamResource {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  pricing: "Completely Free" | "Free Tier" | "Open Source";
  lastVerified: string;
}

export interface IslamSection {
  icon: string;
  title: string;
  items: IslamResource[];
}

export const ISLAM_SECTIONS: IslamSection[] = [
  {
    icon: "📖",
    title: "Quran - Read, Listen & Study",
    items: [
      {
        id: "quran-com",
        name: "Quran.com",
        url: "https://quran.com",
        description:
          "Complete Quran with Arabic text, transliteration, word-by-word translation in 90+ languages, verse-by-verse audio from 50+ reciters, and tafsir from Ibn Kathir, Al-Jalalayn, and others. No account needed.",
        category: "Quran",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "alquran-cloud-api",
        name: "Al-Quran Cloud API",
        url: "https://alquran.cloud/api",
        description:
          "Keyless REST API returning the full Quran in Arabic, translations, transliterations, Juz, Surah, and individual ayah data. Used to build Quran apps and widgets with no auth required.",
        category: "API · Quran",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "quran-foundation-gh",
        name: "Quran Foundation GitHub",
        url: "https://github.com/quran",
        description:
          "Open-source repositories behind Quran.com - the Quran API, audio files, translations dataset, and mobile apps. All freely available for developers building Islamic apps.",
        category: "GitHub · Quran",
        pricing: "Open Source",
        lastVerified: "2026-08-27",
      },
      {
        id: "tanzil-net",
        name: "Tanzil.net",
        url: "https://tanzil.net",
        description:
          "Verified Quran text in Unicode Arabic, downloadable in multiple formats (XML, text, SQL). Widely used as the source for Quran apps. Also has a simple online reader.",
        category: "Quran",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "iqra-app",
        name: "iQra (Quran word-by-word)",
        url: "https://iqra.app",
        description:
          "Learn to read the Quran word by word with color-coded grammar, vocabulary, and root analysis. Helps beginners understand Arabic directly from the Quran text.",
        category: "Quran Learning",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "quran-companion",
        name: "Quran Companion",
        url: "https://qurancompanion.org",
        description:
          "Daily Quran reading tracker with audio recitation, memorization tools, and translation. Clean, distraction-free interface. No account required for basic reading.",
        category: "Quran",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "mp3quran-net",
        name: "MP3Quran.net",
        url: "https://mp3quran.net/eng",
        description:
          "Free MP3 downloads of the complete Quran recited by 100+ reciters including Mishary Rashid Alafasy, Abdul Rahman Al-Sudais, Saad Al-Ghamdi, and Maher Al-Muaiqly. No signup required.",
        category: "Quran Audio",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
    ],
  },
  {
    icon: "📚",
    title: "Hadith - Collections & Search",
    items: [
      {
        id: "sunnah-com",
        name: "Sunnah.com",
        url: "https://sunnah.com",
        description:
          "The most complete free Hadith database online - Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah, Malik's Muwatta, Riyadh al-Salihin, and more. Searchable in Arabic and English.",
        category: "Hadith",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "hadithapi-com",
        name: "HadithAPI",
        url: "https://hadithapi.com",
        description:
          "RESTful API for all major Hadith collections in Arabic and English. Free account gives access to Bukhari, Muslim, Tirmidhi, and more. Useful for developers building Islamic apps.",
        category: "API · Hadith",
        pricing: "Free Tier",
        lastVerified: "2026-08-27",
      },
      {
        id: "hadith-api-gh",
        name: "hadith-api (GitHub, open source)",
        url: "https://github.com/fawazahmed0/hadith-api",
        description:
          "Completely free, open-source Hadith API hosted on GitHub CDN. No authentication, no rate limit. Covers Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah in multiple languages including Urdu and Bengali.",
        category: "GitHub · Hadith",
        pricing: "Open Source",
        lastVerified: "2026-08-27",
      },
      {
        id: "quran-api-gh",
        name: "hadith-translation (fawazahmed0 GitHub)",
        url: "https://github.com/fawazahmed0/quran-api",
        description:
          "Free Quran and Hadith data as static JSON files hosted on GitHub CDN - 90+ languages, word meanings, and translations. No key, no server needed. Just fetch the URL.",
        category: "GitHub · Quran & Hadith",
        pricing: "Open Source",
        lastVerified: "2026-08-27",
      },
    ],
  },
  {
    icon: "🕌",
    title: "Prayer Times & Daily Tools",
    items: [
      {
        id: "aladhan-api",
        name: "Aladhan API",
        url: "https://aladhan.com/prayer-times-api",
        description:
          "Keyless REST API for prayer times worldwide - by city, coordinates, or country. Returns Fajr, Dhuhr, Asr, Maghrib, Isha, Qibla direction, and Hijri date. Supports all major calculation methods.",
        category: "API · Prayer Times",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "muslim-pro",
        name: "Muslim Pro (free web)",
        url: "https://www.muslimpro.com",
        description:
          "Prayer times, Qibla direction, Quran, Hijri calendar, and mosque finder. Free on web. One of the most used Islamic apps globally with 100M+ downloads.",
        category: "Prayer & Daily Tools",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "athan-com",
        name: "Athan.com",
        url: "https://athan.com",
        description:
          "Accurate prayer times for any city, Qibla direction, Quran reader, and Hijri calendar. Clean and fast, no account needed.",
        category: "Prayer Times",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "islamicfinder-org",
        name: "IslamicFinder",
        url: "https://www.islamicfinder.org",
        description:
          "Prayer times, Ramadan calendar, Hijri date converter, mosque finder, Zakat calculator, and Islamic events for any location.",
        category: "Prayer & Calendar",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "qibla-connect",
        name: "Qibla Connect (web)",
        url: "https://qiblaconnect.com",
        description:
          "Browser-based Qibla direction finder using device geolocation. Works on mobile without any app install.",
        category: "Qibla",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "hijri-calendar-api",
        name: "Hijri Calendar API (aladhan)",
        url: "https://aladhan.com/islamic-calendar-api",
        description:
          "Convert between Gregorian and Hijri dates, get full monthly Hijri calendar, and fetch upcoming Islamic events - all free, no key, REST API.",
        category: "API · Hijri Calendar",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
    ],
  },
  {
    icon: "🎓",
    title: "Islamic Learning - Courses & Education",
    items: [
      {
        id: "seekersguidance",
        name: "SeekersGuidance",
        url: "https://seekersguidance.org",
        description:
          "Completely free structured Islamic courses taught by qualified scholars - Fiqh, Aqeedah, Quran, Hadith, Arabic, Seerah, and personal development. 100+ courses available with no fees ever.",
        category: "Islamic Courses",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "bayyinah-podcast",
        name: "Bayyinah TV (free content)",
        url: "https://bayyinah.com/podcast",
        description:
          "Ustadh Nouman Ali Khan's free podcast content - Quran tafsir, Arabic language, and Islamic reflection. The Dream Arabic podcast alone is one of the most popular free Arabic resources.",
        category: "Arabic & Quran",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "iou-edu-gm",
        name: "Islamic Online University (free diploma)",
        url: "https://iou.edu.gm",
        description:
          "Dr. Bilal Philips' Islamic Online University offers a free diploma in Islamic studies covering Quran, Hadith, Fiqh, Arabic, Aqeedah, and Seerah. Certificates available at low cost.",
        category: "Islamic Courses",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "yaqeen-institute",
        name: "Yaqeen Institute (free research)",
        url: "https://yaqeeninstitute.org",
        description:
          "Free papers, podcasts, infographics, and videos addressing contemporary questions on Islam, faith, and identity. Academically referenced and freely downloadable.",
        category: "Islamic Research",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "muslim-central",
        name: "Muslim Central (podcasts & lectures)",
        url: "https://muslimcentral.com",
        description:
          "Free audio lectures and podcasts from 400+ scholars - Mufti Menk, Nouman Ali Khan, Omar Suleiman, and more. Searchable by scholar, topic, or lecture series.",
        category: "Islamic Lectures",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "al-mawrid",
        name: "Al-Mawrid Institute (free content)",
        url: "https://al-mawrid.org",
        description:
          "Free articles, books, and audio on Islamic jurisprudence, Quran commentary, and contemporary Islamic thought from Javed Ahmad Ghamidi. Available in Urdu and English.",
        category: "Islamic Knowledge",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "quran-academy",
        name: "Quran Academy (free reading)",
        url: "https://quranacademy.io",
        description:
          "Learn to read, memorize, and understand the Quran with tajweed rules. Free tier covers the basics of Makharij and beginner recitation lessons.",
        category: "Quran Learning",
        pricing: "Free Tier",
        lastVerified: "2026-08-27",
      },
    ],
  },
  {
    icon: "🎬",
    title: "Scholars & YouTube Channels",
    items: [
      {
        id: "yt-bayyinah",
        name: "Nouman Ali Khan - Bayyinah",
        url: "https://www.youtube.com/@bayyinah",
        description:
          "Deep Quranic tafsir and Arabic language lessons from one of the most accessible contemporary scholars. Millions of free lectures on YouTube covering the full Quran and Arabic grammar.",
        category: "YouTube · Quran & Arabic",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "yt-mufti-menk",
        name: "Mufti Menk",
        url: "https://www.youtube.com/@MuftiMenk",
        description:
          "Daily Islamic reminders and lectures from Zimbabwe's Grand Mufti. Calm, practical, and grounded in everyday life. One of the most followed Muslim scholars on social media.",
        category: "YouTube · Islamic Lectures",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "yt-yaqeen",
        name: "Omar Suleiman - Yaqeen Institute",
        url: "https://www.youtube.com/@YaqeenInstitute",
        description:
          "Faith-based content with academic depth - Ramadan series, Seerah, and contemporary Islamic issues. Produced by the Yaqeen Institute with high production quality.",
        category: "YouTube · Islamic Research",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "yt-yasir-qadhi",
        name: "IslamQA (Dr. Yasir Qadhi - AlMaghrib)",
        url: "https://www.youtube.com/@YasirQadhi",
        description:
          "Detailed scholarly content on Islamic theology, contemporary Fiqh questions, and Seerah from Dr. Yasir Qadhi. Extensive free library covering Aqeedah Al-Tahawiyyah and more.",
        category: "YouTube · Fiqh & Aqeedah",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "yt-merciful-servant",
        name: "Merciful Servant",
        url: "https://www.youtube.com/@MercifulServant",
        description:
          "Beautiful short-form Islamic reminder videos covering stories of the Prophets, Sahaba, and Quranic reflections. Very accessible for new Muslims and young audiences.",
        category: "YouTube · Islamic Reminders",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "yt-tim-humble",
        name: "Muhammad Tim Humble",
        url: "https://www.youtube.com/@MuhammadTimHumble",
        description:
          "Detailed explanations of classical Islamic texts - Aqeedah, Tafsir, and Hadith sciences. Particularly strong on Ibn Taymiyyah and scholarly classical works.",
        category: "YouTube · Aqeedah & Fiqh",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "yt-abu-layth",
        name: "Mufti Abu Layth",
        url: "https://www.youtube.com/@MuftiAbuLayth",
        description:
          "Contemporary Islamic jurisprudence, usul al-fiqh, and Arabic language content. Known for nuanced scholarly depth and approachable style for advanced learners.",
        category: "YouTube · Fiqh & Arabic",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "yt-islamic-guidance",
        name: "Islamic Guidance",
        url: "https://www.youtube.com/@IslamicGuidance",
        description:
          "Short, powerful reminders on Islamic ethics, spirituality, and the afterlife. High quality narration over scenic visuals. Widely shared for dawah purposes.",
        category: "YouTube · Islamic Reminders",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "yt-one-islam",
        name: "One Islam Productions",
        url: "https://www.youtube.com/@OneIslamProductions",
        description:
          "Compilation lectures from multiple major scholars on a wide range of Islamic topics. Useful for discovering different scholarly perspectives in one channel.",
        category: "YouTube · Islamic Lectures",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "yt-sandala",
        name: "Hamza Yusuf - Sandala",
        url: "https://www.youtube.com/@sandalaproductions",
        description:
          "Traditional Islamic scholarship from Sheikh Hamza Yusuf - logic, theology, Arabic, and classical Islamic thought. Dense, intellectually rich content for serious students of Islam.",
        category: "YouTube · Islamic Studies",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
    ],
  },
  {
    icon: "📕",
    title: "Islamic Books & Texts (Free)",
    items: [
      {
        id: "archive-islamic",
        name: "Internet Archive - Islamic Books",
        url: "https://archive.org/search?query=islamic+books&mediatype=texts",
        description:
          "Thousands of free Islamic books scanned and uploaded to the Internet Archive - classical fiqh texts, tafsir, hadith collections, and contemporary Islamic literature in many languages.",
        category: "Books",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "dar-al-iftaa",
        name: "Dar al-Iftaa (Egypt) - free fatwas",
        url: "https://www.dar-alifta.org/en",
        description:
          "Official fatwa database from Egypt's Dar al-Iftaa - searchable library of Islamic rulings on contemporary and classical questions. In Arabic and English.",
        category: "Fatwa & Fiqh",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "islamqa-info",
        name: "IslamQA.info",
        url: "https://islamqa.info/en",
        description:
          "Supervised by Sheikh Muhammad Saalih al-Munajjid - one of the largest Islamic Q&A databases online. 200,000+ questions and answers on Fiqh, Aqeedah, worship, and daily life in 11 languages.",
        category: "Fatwa & Fiqh",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "seerah-project",
        name: "Seerah of the Prophet (free e-book)",
        url: "https://archive.org/details/SiratIbnHisham",
        description:
          "Ibn Hisham's classic Seerah (biography of the Prophet ﷺ) - free to read and borrow on the Internet Archive. A companion to formal Seerah study courses.",
        category: "Seerah",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "al-islam-org",
        name: "Al-Islam.org",
        url: "https://www.al-islam.org",
        description:
          "Digital library of free Islamic books covering theology, philosophy, ethics, and history. Multilingual. Well organized for academic and personal study.",
        category: "Books & Texts",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
    ],
  },
  {
    icon: "🌙",
    title: "Ramadan & Islamic Calendar Tools",
    items: [
      {
        id: "ramadan-legacy",
        name: "Ramadan Legacy",
        url: "https://ramadanlegacy.com",
        description:
          "Free Ramadan planner with daily Quran reading schedule, duaa tracker, charity log, and Seerah reminders. Designed to help make the most of every day of Ramadan.",
        category: "Ramadan",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "islamic-calendar-if",
        name: "Islamic Calendar (IslamicFinder)",
        url: "https://www.islamicfinder.org/islamic-calendar",
        description:
          "Full Hijri calendar with all Islamic months, key dates (Eid ul-Fitr, Eid ul-Adha, Laylat al-Qadr, Muharram), and Gregorian cross-reference. Downloadable as PDF.",
        category: "Hijri Calendar",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "zakat-nzf",
        name: "Zakat Calculator (NZF)",
        url: "https://www.nzf.org.uk/zakat/zakat-calculator",
        description:
          "Free Zakat calculator from the National Zakat Foundation. Enter assets, liabilities, gold, silver, and savings to calculate the exact Zakat amount owed.",
        category: "Zakat",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
    ],
  },
  {
    icon: "🕋",
    title: "Hajj & Umrah Resources",
    items: [
      {
        id: "nusuk-sa",
        name: "Nusuk (Official Saudi Portal)",
        url: "https://www.nusuk.sa/en",
        description:
          "Official Saudi government portal for Umrah and Hajj registration, visa, packages, and service information. Free to use for planning and registration guidance.",
        category: "Hajj & Umrah",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "hajj-guide-if",
        name: "Hajj Guide (IslamicFinder)",
        url: "https://www.islamicfinder.org/hajj-guide",
        description:
          "Step-by-step free Hajj guide covering all rituals - Tawaf, Sa'i, Mina, Arafat, Muzdalifah, and the days of Tashreeq. With maps, duaas for each step, and common mistakes to avoid.",
        category: "Hajj",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
    ],
  },
  {
    icon: "📿",
    title: "Dhikr, Duaa & Spiritual Tools",
    items: [
      {
        id: "duas-org",
        name: "Duas.org",
        url: "https://duas.org",
        description:
          "Large free collection of authentic supplications from the Quran and Sunnah - daily duas, Ramadan and special-occasion duas, with Arabic, transliteration and translation.",
        category: "Duaa",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "dua-api-gh",
        name: "Daily Duaa API (GitHub)",
        url: "https://github.com/AAChemistry/DuaAPI",
        description:
          "Open-source API returning authenticated duas from Hisnul Muslim in Arabic and English. Free for developers to integrate into apps, widgets, or daily reminder systems.",
        category: "GitHub · Duaa API",
        pricing: "Open Source",
        lastVerified: "2026-08-27",
      },
      {
        id: "muslim-co",
        name: "Muslim.co",
        url: "https://muslim.co",
        description:
          "Prayer times, Quran, Qibla, Tasbeeh counter, Asmaul Husna (99 Names of Allah), and daily Duaa - all in one clean free website. Works offline as a PWA.",
        category: "Daily Tools",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "99-names",
        name: "99 Names of Allah",
        url: "https://www.99namesofallah.name",
        description:
          "All 99 Names of Allah in Arabic with transliteration, meaning in English, and short explanation of each name. Clean, ad-free, no signup.",
        category: "Asmaul Husna",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
    ],
  },
  {
    icon: "🌍",
    title: "Subreddit & Community Resources",
    items: [
      {
        id: "reddit-islam",
        name: "r/islam",
        url: "https://reddit.com/r/islam",
        description:
          "800k+ member Muslim community on Reddit - Q&A, news, resources, and discussion on Islamic topics. Moderated to maintain respectful discourse.",
        category: "Reddit · Community",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "reddit-learnquran",
        name: "r/learnquran",
        url: "https://reddit.com/r/learnquran",
        description:
          "Community dedicated to learning Quran recitation, tajweed, and memorization. Resources, tips, and encouragement from learners at all levels.",
        category: "Reddit · Quran Learning",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "reddit-islamichistory",
        name: "r/islamichistory",
        url: "https://reddit.com/r/islamichistory",
        description:
          "Islamic history posts, articles, and discussion. Maps, timelines, biographical profiles of historical figures, and primary sources shared by the community.",
        category: "Reddit · Islamic History",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
      {
        id: "reddit-muslimlounge",
        name: "r/MuslimLounge",
        url: "https://reddit.com/r/MuslimLounge",
        description:
          "Casual Muslim community subreddit - lifestyle, culture, humor, and everyday Muslim life discussion. Welcoming to new Muslims and those exploring Islam.",
        category: "Reddit · Community",
        pricing: "Completely Free",
        lastVerified: "2026-08-27",
      },
    ],
  },
];

/** Flat view, for the SlashBar category index. */
export const ISLAM_RESOURCES: IslamResource[] = ISLAM_SECTIONS.flatMap((s) => s.items);
