import type { HubResource } from "./hub-founders";

export const FINANCE_RESOURCES: HubResource[] = [
  // ── Stock & Crypto Tools
  { id: "fn1", name: "Zerodha Varsity", url: "https://zerodha.com/varsity", description: "Free stock market education — technical analysis, fundamental analysis, trading strategies.", type: "Course", category: "Stock & Crypto Tools", pricing: "Completely Free", tags: ["stocks", "trading", "education"], lastVerified: "2026-08-27" },
  { id: "fn2", name: "Screener.in", url: "https://www.screener.in", description: "Indian stock screener — financial data, ratios and charts for NSE/BSE stocks.", type: "Website", category: "Stock & Crypto Tools", pricing: "Free Tier", tags: ["stocks", "screener", "india"], lastVerified: "2026-08-27" },
  { id: "fn3", name: "CoinGecko", url: "https://www.coingecko.com", description: "Free crypto data — prices, market cap, charts for 10,000+ coins.", type: "API", category: "Stock & Crypto Tools", pricing: "Completely Free", tags: ["crypto", "prices", "data"], lastVerified: "2026-08-27" },
  { id: "fn4", name: "TradingView Free", url: "https://www.tradingview.com", description: "Free charting platform — stocks, crypto, forex with community scripts.", type: "Software", category: "Stock & Crypto Tools", pricing: "Freemium", tags: ["charts", "trading", "stocks"], lastVerified: "2026-08-27" },
  { id: "fn5", name: "Yahoo Finance", url: "https://finance.yahoo.com", description: "Free market data, news and portfolio tracking for global markets.", type: "Website", category: "Stock & Crypto Tools", pricing: "Completely Free", tags: ["markets", "news", "portfolio"], lastVerified: "2026-08-27" },
  { id: "fn6", name: "Groww", url: "https://groww.in", description: "Free Indian investment platform — mutual funds, stocks, gold and US stocks.", type: "Website", category: "Stock & Crypto Tools", pricing: "Freemium", tags: ["india", "investing", "mutual-funds"], lastVerified: "2026-08-27" },
  { id: "fn7", name: "Tickertape", url: "https://www.tickertape.in", description: "Free Indian stock analysis — screeners, forecasts and financial data.", type: "Website", category: "Stock & Crypto Tools", pricing: "Free Tier", tags: ["india", "analysis", "stocks"], lastVerified: "2026-08-27" },

  // ── AI Finance Tools
  { id: "fn8", name: "ChatGPT", url: "https://chat.openai.com", description: "AI for financial analysis, portfolio review and investment research.", type: "AI Tool", category: "AI Finance Tools", pricing: "Freemium", tags: ["ai", "analysis", "research"], lastVerified: "2026-08-27" },
  { id: "fn9", name: "Perplexity", url: "https://www.perplexity.ai", description: "AI search with sources — ideal for market research and financial news.", type: "AI Tool", category: "AI Finance Tools", pricing: "Freemium", tags: ["ai", "search", "finance"], lastVerified: "2026-08-27" },

  // ── Finance APIs
  { id: "fn10", name: "CoinGecko API", url: "https://www.coingecko.com/en/api", description: "Free crypto API — prices, market data, historical charts.", type: "API", category: "Finance APIs", pricing: "Free Tier", tags: ["api", "crypto", "prices"], lastVerified: "2026-08-27" },
  { id: "fn11", name: "Frankfurter API", url: "https://www.frankfurter.app", description: "Free forex exchange rates — EUR-based, updated daily.", type: "API", category: "Finance APIs", pricing: "Completely Free", tags: ["api", "forex", "exchange"], lastVerified: "2026-08-27" },
  { id: "fn12", name: "Alpha Vantage", url: "https://www.alphavantage.co", description: "Free stock, forex and crypto API with 25 free calls/day.", type: "API", category: "Finance APIs", pricing: "Free Tier", tags: ["api", "stocks", "forex"], lastVerified: "2026-08-27" },
  { id: "fn13", name: "AMFI NAV India", url: "https://www.amfiindia.com", description: "Free mutual fund NAV data for all Indian schemes.", type: "API", category: "Finance APIs", pricing: "Completely Free", tags: ["api", "india", "mutual-funds"], lastVerified: "2026-08-27" },

  // ── Financial Learning
  { id: "fn14", name: "Khan Academy Finance", url: "https://www.khanacademy.org/economics-finance-domain", description: "Free courses on stocks, bonds, interest, banking and financial crises.", type: "Course", category: "Financial Learning", pricing: "Completely Free", tags: ["course", "basics", "free"], lastVerified: "2026-08-27" },
  { id: "fn15", name: "Coursera Finance (audit)", url: "https://www.coursera.org", description: "Yale and Wharton finance courses — free to audit without certificate.", type: "Course", category: "Financial Learning", pricing: "Completely Free", tags: ["course", "yale", "wharton"], lastVerified: "2026-08-27" },
  { id: "fn16", name: "Investopedia", url: "https://www.investopedia.com", description: "Financial encyclopedia — every term, strategy and instrument explained.", type: "Wiki", category: "Financial Learning", pricing: "Completely Free", tags: ["wiki", "terms", "education"], lastVerified: "2026-08-27" },

  // ── YouTube (Finance)
  { id: "fn17", name: "Pranjal Kamra", url: "https://www.youtube.com/@PranjalKamra", description: "Hindi investing education — stocks, mutual funds and personal finance.", type: "YouTube", category: "YouTube (Finance)", pricing: "Completely Free", tags: ["youtube", "india", "investing"], lastVerified: "2026-08-27" },
  { id: "fn18", name: "Labour Law Advisor", url: "https://www.youtube.com/@LabourLawAdvisor", description: "Indian financial literacy — EPF, tax, salary and money management in Hindi.", type: "YouTube", category: "YouTube (Finance)", pricing: "Completely Free", tags: ["youtube", "india", "finance"], lastVerified: "2026-08-27" },
  { id: "fn19", name: "Rachana Ranade", url: "https://www.youtube.com/@RachanaRanade", description: "Stock market basics and investing strategies explained simply in Hindi.", type: "YouTube", category: "YouTube (Finance)", pricing: "Completely Free", tags: ["youtube", "india", "stocks"], lastVerified: "2026-08-27" },
  { id: "fn20", name: "Andrei Jikh", url: "https://www.youtube.com/@Andreijikh", description: "Personal finance, investing and passive income strategies.", type: "YouTube", category: "YouTube (Finance)", pricing: "Completely Free", tags: ["youtube", "investing", "passive-income"], lastVerified: "2026-08-27" },
  { id: "fn21", name: "Graham Stephan", url: "https://www.youtube.com/@GrahamStephan", description: "Real estate, credit cards, saving and investing advice.", type: "YouTube", category: "YouTube (Finance)", pricing: "Completely Free", tags: ["youtube", "saving", "investing"], lastVerified: "2026-08-27" },
];
