/**
 * 캔들 데이터로 RSI / MACD / EMA를 직접 계산
 * Finnhub /indicator 엔드포인트 없이 동작
 */

import type { CandlePoint, IndicatorPoint } from "./finnhub.types";

/* ── EMA ── */
function ema(data: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const result: number[] = [];
  let prev = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  result.push(...new Array(period - 1).fill(NaN));
  result.push(prev);
  for (let i = period; i < data.length; i++) {
    prev = data[i] * k + prev * (1 - k);
    result.push(prev);
  }
  return result;
}

/* ── RSI (Wilder's smoothing) ── */
export function calcRSI(candles: CandlePoint[], period = 14): number[] {
  const closes = candles.map((c) => c.close);
  const result: number[] = new Array(closes.length).fill(NaN);
  if (closes.length < period + 1) return result;

  const changes = closes.slice(1).map((v, i) => v - closes[i]);
  let avgGain = changes.slice(0, period).filter((v) => v > 0).reduce((a, b) => a + b, 0) / period;
  let avgLoss = Math.abs(changes.slice(0, period).filter((v) => v < 0).reduce((a, b) => a + b, 0)) / period;

  const rsiAt = (ag: number, al: number) => (al === 0 ? 100 : 100 - 100 / (1 + ag / al));
  result[period] = rsiAt(avgGain, avgLoss);

  for (let i = period; i < changes.length; i++) {
    const g = changes[i] > 0 ? changes[i] : 0;
    const l = changes[i] < 0 ? -changes[i] : 0;
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
    result[i + 1] = rsiAt(avgGain, avgLoss);
  }

  return result;
}

/* ── MACD ── */
export function calcMACD(
  candles: CandlePoint[],
  fast = 12,
  slow = 26,
  signal = 9
): { macd: number[]; signal: number[]; hist: number[] } {
  const closes = candles.map((c) => c.close);
  const n = closes.length;
  const empty = new Array(n).fill(NaN);

  if (n < slow + signal) return { macd: empty, signal: empty, hist: empty };

  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);

  const macdLine = emaFast.map((v, i) =>
    isNaN(v) || isNaN(emaSlow[i]) ? NaN : v - emaSlow[i]
  );

  // Signal: EMA of MACD line (only valid points)
  const validMacd = macdLine.filter((v) => !isNaN(v));
  const signalRaw = ema(validMacd, signal);

  // Realign signal back to full length
  const firstValid = macdLine.findIndex((v) => !isNaN(v));
  const signalLine = new Array(n).fill(NaN);
  signalRaw.forEach((v, i) => {
    if (firstValid + i < n) signalLine[firstValid + i] = v;
  });

  const histLine = macdLine.map((v, i) =>
    isNaN(v) || isNaN(signalLine[i]) ? NaN : v - signalLine[i]
  );

  return { macd: macdLine, signal: signalLine, hist: histLine };
}

/* ── 통합: CandlePoint[] → IndicatorPoint[] ── */
export function buildIndicators(candles: CandlePoint[]): IndicatorPoint[] {
  const rsi = calcRSI(candles);
  const { macd, signal, hist } = calcMACD(candles);

  return candles.map((c, i) => ({
    time: c.time,
    rsi: isNaN(rsi[i]) ? null : parseFloat(rsi[i].toFixed(2)),
    macd: isNaN(macd[i]) ? null : parseFloat(macd[i].toFixed(4)),
    signal: isNaN(signal[i]) ? null : parseFloat(signal[i].toFixed(4)),
    hist: isNaN(hist[i]) ? null : parseFloat(hist[i].toFixed(4)),
  }));
}
