/* ── Finnhub REST response shapes ── */

export interface FinnhubQuote {
  c: number;   // current price
  d: number;   // change
  dp: number;  // percent change
  h: number;   // high
  l: number;   // low
  o: number;   // open
  pc: number;  // previous close
  t: number;   // timestamp (unix)
}

export interface FinnhubCandle {
  c: number[];  // close
  h: number[];  // high
  l: number[];  // low
  o: number[];  // open
  v: number[];  // volume
  t: number[];  // timestamps
  s: string;    // status "ok" | "no_data"
}

export interface FinnhubIndicator {
  rsi?: { rsi: number[] };
  macd?: { macd: number[]; signal: number[]; hist: number[] };
}

export interface FinnhubCompanyProfile {
  name: string;
  ticker: string;
  exchange: string;
  finnhubIndustry: string;
  marketCapitalization: number;
  shareOutstanding: number;
  logo: string;
  weburl: string;
}

export interface FinnhubNewsItem {
  id: number;
  headline: string;
  source: string;
  url: string;
  datetime: number;
  summary: string;
  sentiment?: "positive" | "negative" | "neutral";
}

/* ── Our unified StockData shape (what we send to the client) ── */

export interface CandlePoint {
  time: number;   // unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorPoint {
  time: number;
  rsi: number | null;
  macd: number | null;
  signal: number | null;
  hist: number | null;
}

export interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  industry: string;
  logo: string;
  quote: {
    price: number;
    change: number;
    changePct: number;
    high: number;
    low: number;
    open: number;
    prevClose: number;
    updatedAt: number;
  };
  candles: CandlePoint[];
  indicators: IndicatorPoint[];
  news: {
    headline: string;
    source: string;
    url: string;
    datetime: number;
  }[];
  fetchedAt: number;
}

export interface ApiError {
  error: string;
}
