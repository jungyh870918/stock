/**
 * Twelve Data API — 무료 플랜: 800 calls/day, 일봉 지원
 * https://twelvedata.com → 무료 API 키 발급
 * .env.local 에 TWELVEDATA_API_KEY=your_key 추가
 */

import type { CandlePoint } from "./finnhub.types";

const BASE = "https://api.twelvedata.com";
const KEY = process.env.TWELVEDATA_API_KEY ?? "";

export function isTwelveDataEnabled() {
  return KEY.length > 0;
}

interface TDBar {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export async function fetchCandlesTwelveData(
  symbol: string,
  outputsize = 5000   // 무료 플랜 최대치 — 약 13년치 일봉
): Promise<CandlePoint[]> {
  if (!KEY) return [];

  const url = new URL(`${BASE}/time_series`);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", "1day");
  url.searchParams.set("outputsize", String(outputsize));
  url.searchParams.set("apikey", KEY);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) return [];

  const json = await res.json();
  if (json.status === "error" || !Array.isArray(json.values)) return [];

  // Twelve Data는 최신순 → 오래된 순으로 정렬
  const bars: TDBar[] = [...json.values].reverse();

  return bars.map((b) => ({
    time: Math.floor(new Date(b.datetime).getTime() / 1000),
    open: parseFloat(b.open),
    high: parseFloat(b.high),
    low: parseFloat(b.low),
    close: parseFloat(b.close),
    volume: parseFloat(b.volume),
  }));
}
