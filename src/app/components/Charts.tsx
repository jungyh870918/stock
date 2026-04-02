"use client";

import { useEffect, useRef } from "react";
import type { CandlePoint, IndicatorPoint } from "@/app/lib/finnhub.types";

/* ── 공통 테마 ── */
const LAYOUT = { background: { color: "#0e1220" }, textColor: "#4a5580" };
const GRID = {
  vertLines: { color: "rgba(30,39,64,0.5)" },
  horzLines: { color: "rgba(30,39,64,0.5)" },
};
const CROSSHAIR = {
  vertLine: { color: "rgba(143,179,255,0.4)", labelBackgroundColor: "#161c34" },
  horzLine: { color: "rgba(143,179,255,0.4)", labelBackgroundColor: "#161c34" },
};
const TIME_SCALE = { borderColor: "#1e2740", timeVisible: true, secondsVisible: false };

/* ── 차트가 실제 크기를 가질 때만 초기화 ── */
function whenSized(el: HTMLDivElement, cb: (w: number, h: number) => () => void) {
  let cleanup: (() => void) | null = null;
  let done = false;

  const ro = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    if (width > 0 && height > 0 && !done) {
      done = true;
      ro.disconnect();
      cleanup = cb(width, height);
    }
  });
  ro.observe(el);

  return () => { ro.disconnect(); cleanup?.(); };
}

/* ────────────────────────────────────
   1. 캔들스틱 + 거래량 (v5 API)
──────────────────────────────────── */
export function CandleChart({ candles }: { candles: CandlePoint[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || candles.length < 2) return;

    return whenSized(el, (w, h) => {
      let chart: any = null;
      let sizeRo: ResizeObserver | null = null;

      import("lightweight-charts").then((lwc) => {
        const { createChart, CandlestickSeries, HistogramSeries } = lwc;

        chart = createChart(el, {
          width: w, height: h,
          layout: LAYOUT, grid: GRID, crosshair: CROSSHAIR,
          timeScale: TIME_SCALE,
          rightPriceScale: { borderColor: "#1e2740" },
        });

        /* 캔들스틱 */
        const candleSeries = chart.addSeries(CandlestickSeries, {
          upColor: "#6ce88a", downColor: "#ff7b7b",
          borderUpColor: "#6ce88a", borderDownColor: "#ff7b7b",
          wickUpColor: "#6ce88a", wickDownColor: "#ff7b7b",
        });
        candleSeries.setData(candles.map((c) => ({
          time: c.time as any,
          open: c.open, high: c.high, low: c.low, close: c.close,
        })));

        /* 거래량 */
        const volSeries = chart.addSeries(HistogramSeries, {
          priceFormat: { type: "volume" },
          priceScaleId: "vol",
          lastValueVisible: false,
          priceLineVisible: false,
        });
        chart.priceScale("vol").applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
        volSeries.setData(candles.map((c) => ({
          time: c.time as any,
          value: c.volume,
          color: c.close >= c.open ? "rgba(108,232,138,0.4)" : "rgba(255,123,123,0.4)",
        })));

        chart.timeScale().fitContent();

        sizeRo = new ResizeObserver(() => { chart?.applyOptions({ width: el.clientWidth }); });
        sizeRo.observe(el);
      });

      return () => { sizeRo?.disconnect(); chart?.remove(); };
    });
  }, [candles]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}

/* ────────────────────────────────────
   2. RSI
──────────────────────────────────── */
export function RSIChart({ indicators }: { indicators: IndicatorPoint[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pts = indicators.filter((p) => p.rsi !== null);
    if (pts.length < 2) return;

    return whenSized(el, (w, h) => {
      let chart: any = null;
      let sizeRo: ResizeObserver | null = null;

      import("lightweight-charts").then((lwc) => {
        const { createChart, LineSeries } = lwc;

        chart = createChart(el, {
          width: w, height: h,
          layout: LAYOUT, grid: GRID, crosshair: CROSSHAIR,
          timeScale: { ...TIME_SCALE, visible: false },
          rightPriceScale: { borderColor: "#1e2740", scaleMargins: { top: 0.05, bottom: 0.05 } },
        });

        const rsiSeries = chart.addSeries(LineSeries, {
          color: "#ffcc5c", lineWidth: 2,
          priceLineVisible: false, lastValueVisible: true,
        });
        rsiSeries.setData(pts.map((p) => ({ time: p.time as any, value: p.rsi! })));

        rsiSeries.createPriceLine({ price: 70, color: "rgba(255,123,123,0.7)", lineWidth: 1, lineStyle: 1, axisLabelVisible: true, title: "과매수 70" });
        rsiSeries.createPriceLine({ price: 50, color: "rgba(90,100,144,0.4)", lineWidth: 1, lineStyle: 2, axisLabelVisible: false, title: "" });
        rsiSeries.createPriceLine({ price: 30, color: "rgba(108,232,138,0.7)", lineWidth: 1, lineStyle: 1, axisLabelVisible: true, title: "과매도 30" });

        chart.timeScale().fitContent();

        sizeRo = new ResizeObserver(() => { chart?.applyOptions({ width: el.clientWidth }); });
        sizeRo.observe(el);
      });

      return () => { sizeRo?.disconnect(); chart?.remove(); };
    });
  }, [indicators]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}

/* ────────────────────────────────────
   3. MACD
──────────────────────────────────── */
export function MACDChart({ indicators }: { indicators: IndicatorPoint[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pts = indicators.filter((p) => p.macd !== null && p.signal !== null);
    if (pts.length < 2) return;

    return whenSized(el, (w, h) => {
      let chart: any = null;
      let sizeRo: ResizeObserver | null = null;

      import("lightweight-charts").then((lwc) => {
        const { createChart, LineSeries, HistogramSeries } = lwc;

        chart = createChart(el, {
          width: w, height: h,
          layout: LAYOUT, grid: GRID, crosshair: CROSSHAIR,
          timeScale: { ...TIME_SCALE, visible: false },
          rightPriceScale: { borderColor: "#1e2740" },
        });

        /* 히스토그램 */
        const histSeries = chart.addSeries(HistogramSeries, {
          priceLineVisible: false, lastValueVisible: false,
        });
        histSeries.setData(pts.map((p) => ({
          time: p.time as any,
          value: p.hist ?? 0,
          color: (p.hist ?? 0) >= 0 ? "rgba(108,232,138,0.5)" : "rgba(255,123,123,0.5)",
        })));

        /* MACD 라인 */
        const macdSeries = chart.addSeries(LineSeries, {
          color: "#8fb3ff", lineWidth: 2,
          priceLineVisible: false, lastValueVisible: true, title: "MACD",
        });
        macdSeries.setData(pts.map((p) => ({ time: p.time as any, value: p.macd! })));

        /* Signal 라인 */
        const sigSeries = chart.addSeries(LineSeries, {
          color: "#ff9f9f", lineWidth: 1, lineStyle: 1,
          priceLineVisible: false, lastValueVisible: true, title: "Signal",
        });
        sigSeries.setData(pts.map((p) => ({ time: p.time as any, value: p.signal! })));

        chart.timeScale().fitContent();

        sizeRo = new ResizeObserver(() => { chart?.applyOptions({ width: el.clientWidth }); });
        sizeRo.observe(el);
      });

      return () => { sizeRo?.disconnect(); chart?.remove(); };
    });
  }, [indicators]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}

export { CandleChart as PriceChart };
