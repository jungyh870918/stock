import type {
  FinnhubQuote,
  FinnhubCandle,
  FinnhubCompanyProfile,
  FinnhubNewsItem,
  StockData,
  CandlePoint,
} from "./finnhub.types";
import { buildIndicators } from "./indicators";
import { isTwelveDataEnabled, fetchCandlesTwelveData } from "./twelvedata";

const BASE = "https://finnhub.io/api/v1";
const KEY = process.env.FINNHUB_API_KEY ?? "";

if (!KEY) console.warn("[finnhub] FINNHUB_API_KEY is not set");

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("token", KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Finnhub ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

function unixNow() { return Math.floor(Date.now() / 1000); }
function daysAgo(n: number) { return unixNow() - 60 * 60 * 24 * n; }

/** Finnhub 무료 플랜은 일봉 캔들을 제공하지 않음.
 *  → Twelve Data API 키가 있으면 그쪽에서 가져오고
 *  → 없으면 빈 배열 반환 (차트 미표시 + 안내 메시지)
 */
async function fetchCandles(symbol: string): Promise<CandlePoint[]> {
  // 1순위: Twelve Data (무료 800 calls/day)
  if (isTwelveDataEnabled()) {
    const candles = await fetchCandlesTwelveData(symbol, 150);
    if (candles.length > 0) return candles;
  }

  // 2순위: Finnhub (유료 플랜이면 동작, 무료면 빈 배열)
  try {
    const c = await get<FinnhubCandle>("/stock/candle", {
      symbol,
      resolution: "D",
      from: String(daysAgo(150)),
      to: String(unixNow()),
    });
    if (c.s === "ok") {
      return c.t.map((time, i) => ({
        time,
        open: c.o[i],
        high: c.h[i],
        low: c.l[i],
        close: c.c[i],
        volume: c.v[i],
      }));
    }
  } catch {
    // 무료 플랜 제한 → 무시
  }

  return [];
}

export async function fetchStockData(symbol: string): Promise<StockData> {
  const sym = symbol.toUpperCase();

  const [quote, profile, candles, news] = await Promise.allSettled([
    get<FinnhubQuote>("/quote", { symbol: sym }),
    get<FinnhubCompanyProfile>("/stock/profile2", { symbol: sym }),
    fetchCandles(sym),
    get<FinnhubNewsItem[]>("/company-news", {
      symbol: sym,
      from: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
      to: new Date().toISOString().slice(0, 10),
    }),
  ]);

  if (quote.status === "rejected") throw new Error(`종목 조회 실패: ${sym}`);

  const q = quote.value;
  const p = profile.status === "fulfilled" ? profile.value : null;
  const candlePoints = candles.status === "fulfilled" ? candles.value : [];
  const n = news.status === "fulfilled" ? news.value : [];
  const indicators = buildIndicators(candlePoints);

  return {
    symbol: sym,
    name: p?.name ?? sym,
    exchange: p?.exchange ?? "",
    industry: p?.finnhubIndustry ?? "",
    logo: p?.logo ?? "",
    quote: {
      price: q.c,
      change: q.d,
      changePct: q.dp,
      high: q.h,
      low: q.l,
      open: q.o,
      prevClose: q.pc,
      updatedAt: q.t,
    },
    candles: candlePoints,
    indicators,
    news: n.slice(0, 5).map((item) => ({
      headline: item.headline,
      source: item.source,
      url: item.url,
      datetime: item.datetime,
    })),
    fetchedAt: Date.now(),
  };
}
