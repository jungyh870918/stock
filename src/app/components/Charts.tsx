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
  const ref    = useRef<HTMLDivElement>(null);
  const ctlRef = useRef<HTMLDivElement>(null);

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
          timeScale: {
            ...TIME_SCALE,
            // 줌/스크롤 완전 활성화
            rightOffset: 5,
            barSpacing: 8,
            minBarSpacing: 1,
          },
          rightPriceScale: { borderColor: "#1e2740" },
          // 마우스 휠 줌, 드래그 스크롤 모두 허용
          handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: false },
          handleScale:  { mouseWheel: true, pinch: true, axisPressedMouseMove: true },
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

        /* 기본 뷰: 최근 1년 (약 252 거래일) — 데이터가 1년 미만이면 전체 표시 */
        const oneYearBars = 252;
        if (candles.length > oneYearBars) {
          const from = candles[candles.length - oneYearBars].time;
          const to   = candles[candles.length - 1].time;
          chart.timeScale().setVisibleRange({ from, to });
        } else {
          chart.timeScale().fitContent();
        }

        /* 버튼 이벤트: 전체 / 1년 / 6개월 / 3개월 */
        const ctl = ctlRef.current;
        if (ctl) {
          const handler = (e: Event) => {
            const btn = (e.target as HTMLElement).closest("button");
            if (!btn || !chart) return;
            const range = btn.dataset.range;
            if (range === "all") { chart.timeScale().fitContent(); return; }
            const bars = parseInt(range ?? "252");
            const available = candles.length;
            const idx = Math.max(0, available - bars);
            chart.timeScale().setVisibleRange({
              from: candles[idx].time,
              to:   candles[available - 1].time,
            });
          };
          ctl.addEventListener("click", handler);
        }

        sizeRo = new ResizeObserver(() => { chart?.applyOptions({ width: el.clientWidth }); });
        sizeRo.observe(el);
      });

      return () => { sizeRo?.disconnect(); chart?.remove(); };
    });
  }, [candles]);

  const btnStyle = (active?: boolean): React.CSSProperties => ({
    padding: "3px 9px", fontSize: "11px", borderRadius: "5px", cursor: "pointer",
    border: "1px solid #1e2740", fontFamily: "'IBM Plex Mono',monospace",
    background: active ? "#8fb3ff22" : "transparent",
    color: active ? "#8fb3ff" : "#5a6490",
    transition: "all 0.15s",
  });

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      {/* 기간 버튼 */}
      <div ref={ctlRef} style={{ display: "flex", gap: "4px", padding: "0 2px 6px", flexShrink: 0 }}>
        {[
          { label: "3M",  range: "63"  },
          { label: "6M",  range: "126" },
          { label: "1Y",  range: "252" },
          { label: "2Y",  range: "504" },
          { label: "5Y",  range: "1260"},
          { label: "전체", range: "all" },
        ].map(({ label, range }) => (
          <button key={range} data-range={range} style={btnStyle(range === "252")}>{label}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "10px", color: "#4a5580", alignSelf: "center", fontFamily: "'IBM Plex Mono',monospace" }}>
          {candles.length}일 · 마우스 휠로 줌
        </span>
      </div>
      {/* 차트 */}
      <div ref={ref} style={{ flex: 1, minHeight: 0 }} />
    </div>
  );
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
