"use client";

import { useState } from "react";
import { useStock } from "@/app/hooks/useStock";
import { CandleChart, RSIChart, MACDChart } from "./Charts";
import type { StockData } from "@/app/lib/finnhub.types";
import { useTheme, THEME } from "@/app/context/ThemeContext";
import SymbolSearch from "./SymbolSearch";

const PRESETS = ["NVDA","TSLA","AAPL","TQQQ","MSFT","META"];

function rsiStatus(rsi: number | null, c: any, lang: string) {
  if (rsi === null) return { label: "—", color: c.textDim };
  if (lang === "en") {
    if (rsi >= 70) return { label: `RSI ${rsi.toFixed(1)} Overbought`, color: c.red };
    if (rsi <= 30) return { label: `RSI ${rsi.toFixed(1)} Oversold`, color: c.green };
    return { label: `RSI ${rsi.toFixed(1)} Neutral`, color: c.yellow };
  }
  if (rsi >= 70) return { label: `RSI ${rsi.toFixed(1)} 과매수`, color: c.red };
  if (rsi <= 30) return { label: `RSI ${rsi.toFixed(1)} 과매도`, color: c.green };
  return { label: `RSI ${rsi.toFixed(1)} 중립`, color: c.yellow };
}

function macdStatus(macd: number | null, signal: number | null, c: any, lang: string) {
  if (macd === null || signal === null) return { label: "—", color: c.textDim };
  if (lang === "en") {
    return macd > signal
      ? { label: "MACD Golden Cross (Bullish)", color: c.green }
      : { label: "MACD Death Cross (Bearish)", color: c.red };
  }
  return macd > signal
    ? { label: "MACD 골든크로스 (상승)", color: c.green }
    : { label: "MACD 데드크로스 (하락)", color: c.red };
}

/* ══════════════════════════════════════
   손익 계산기
══════════════════════════════════════ */
function PnlCalculator({ currentPrice }: { currentPrice: number }) {
  const { theme, lang } = useTheme();
  const c = THEME[theme];

  const [avgPrice, setAvgPrice]   = useState("");
  const [qty, setQty]             = useState("");
  const [targetPct, setTargetPct] = useState("");

  const avg = parseFloat(avgPrice);
  const shares = parseFloat(qty);
  const tgt = parseFloat(targetPct);

  const hasInputs = avg > 0 && shares > 0 && currentPrice > 0;
  const pnlPct    = hasInputs ? ((currentPrice - avg) / avg) * 100 : null;
  const pnlUsd    = hasInputs ? (currentPrice - avg) * shares : null;
  const costBasis = hasInputs ? avg * shares : null;
  const curValue  = hasInputs ? currentPrice * shares : null;
  const targetPrice = avg > 0 && tgt ? avg * (1 + tgt / 100) : null;

  const isProfit = pnlPct !== null && pnlPct >= 0;
  const pnlColor = pnlPct === null ? c.textDim : pnlPct > 0 ? c.green : pnlPct < 0 ? c.red : c.textDim;

  // 미실현 구간 바 (손익률 ±100% 범위로 정규화, 중앙=0%)
  const MAX_BAR = 100; // ±100% 까지 표시
  const barFillPct = pnlPct !== null ? Math.min(Math.abs(pnlPct), MAX_BAR) / MAX_BAR * 50 : 0;
  const barPct = barFillPct; // alias for backward compat

  const inputSt: React.CSSProperties = {
    background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "8px",
    padding: "8px 12px", fontSize: "13px", color: c.text, fontFamily: "'IBM Plex Mono',monospace",
    outline: "none", width: "100%", boxSizing: "border-box",
  };

  const lbl = (ko: string, en: string) => lang === "ko" ? ko : en;

  return (
    <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "18px", marginBottom: "16px" }}>
      {/* 섹션 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <span style={{ fontSize: "14px" }}>🧮</span>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: c.accent, margin: 0 }}>
          {lbl("손익 계산기", "P&L Calculator")}
        </p>
      </div>

      {/* 입력 3개 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        <div>
          <p style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: c.textFaint, marginBottom: "5px" }}>
            {lbl("평균 매입가", "Avg Cost")}
          </p>
          <div style={{ position: "relative" as const }}>
            <span style={{ position: "absolute" as const, left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: c.textDim }}>$</span>
            <input type="number" min="0" step="0.01" value={avgPrice}
              onChange={e => setAvgPrice(e.target.value)}
              placeholder="0.00"
              style={{ ...inputSt, paddingLeft: "22px" }} />
          </div>
        </div>
        <div>
          <p style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: c.textFaint, marginBottom: "5px" }}>
            {lbl("보유 수량", "Shares")}
          </p>
          <input type="number" min="0" step="0.01" value={qty}
            onChange={e => setQty(e.target.value)}
            placeholder="0"
            style={inputSt} />
        </div>
        <div>
          <p style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: c.textFaint, marginBottom: "5px" }}>
            {lbl("목표 수익률", "Target %")}
          </p>
          <div style={{ position: "relative" as const }}>
            <input type="number" step="0.1" value={targetPct}
              onChange={e => setTargetPct(e.target.value)}
              placeholder="0"
              style={{ ...inputSt, paddingRight: "24px" }} />
            <span style={{ position: "absolute" as const, right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: c.textDim }}>%</span>
          </div>
        </div>
      </div>

      {/* 결과 */}
      {hasInputs ? (
        <>
          {/* 손익률 큰 숫자 */}
          <div style={{
            background: theme === "dark"
              ? (isProfit ? "rgba(108,232,138,0.07)" : "rgba(255,123,123,0.07)")
              : (isProfit ? "rgba(26,122,64,0.06)"   : "rgba(184,28,28,0.06)"),
            border: `1px solid ${pnlColor}33`,
            borderRadius: "12px", padding: "16px", marginBottom: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "4px" }}>
              <span style={{ fontSize: "28px", fontWeight: 700, color: pnlColor, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1 }}>
                {pnlPct! >= 0 ? "+" : ""}{pnlPct!.toFixed(2)}%
              </span>
              <span style={{ fontSize: "16px", fontWeight: 600, color: pnlColor, fontFamily: "'IBM Plex Mono',monospace" }}>
                {pnlUsd! >= 0 ? "+" : ""}${pnlUsd!.toFixed(2)}
              </span>
            </div>
            <p style={{ fontSize: "12px", color: c.textFaint, margin: 0 }}>
              {lbl("미실현 손익", "Unrealized P&L")} · {lbl("현재가", "Current")} ${currentPrice.toFixed(2)}
            </p>

            {/* 손익률 게이지 바 */}
            <div style={{ marginTop: "12px", height: "4px", borderRadius: "2px", background: c.line, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "2px",
                width: `${barFillPct}%`,
                background: pnlColor,
                marginLeft: isProfit ? "50%" : `${50 - barFillPct}%`,
                transition: "width 0.4s ease",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ fontSize: "10px", color: c.textFaint }}>-50%</span>
              <span style={{ fontSize: "10px", color: c.textFaint, fontWeight: 500 }}>0%</span>
              <span style={{ fontSize: "10px", color: c.textFaint }}>+50%</span>
            </div>
          </div>

          {/* 세부 수치 4개 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: targetPrice ? "12px" : 0 }}>
            {[
              { label: lbl("평균 매입가", "Avg Cost"),     val: `$${avg.toFixed(2)}` },
              { label: lbl("현재가", "Current Price"),     val: `$${currentPrice.toFixed(2)}` },
              { label: lbl("매입 원가", "Cost Basis"),     val: `$${costBasis!.toFixed(2)}` },
              { label: lbl("현재 평가액", "Market Value"), val: `$${curValue!.toFixed(2)}` },
            ].map(item => (
              <div key={item.label} style={{ background: c.panel2, borderRadius: "8px", padding: "10px 12px" }}>
                <p style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: c.textFaint, marginBottom: "3px" }}>{item.label}</p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: c.accentText, margin: 0, fontFamily: "'IBM Plex Mono',monospace" }}>{item.val}</p>
              </div>
            ))}
          </div>

          {/* 목표가 역산 */}
          {targetPrice && (
            <div style={{
              background: theme === "dark" ? "rgba(143,179,255,0.08)" : "rgba(36,97,204,0.06)",
              border: `1px solid ${c.accent}33`,
              borderRadius: "10px", padding: "12px 14px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <p style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: c.accent, marginBottom: "4px" }}>
                  {lbl(`목표가 (+${tgt}%)`, `Target Price (+${tgt}%)`)}
                </p>
                <p style={{ fontSize: "11px", color: c.textFaint, margin: 0 }}>
                  {lbl("달성 시 수익", "Profit if reached")}: +${((targetPrice - avg) * shares).toFixed(2)}
                </p>
              </div>
              <p style={{ fontSize: "22px", fontWeight: 700, color: c.accent, fontFamily: "'IBM Plex Mono',monospace", margin: 0 }}>
                ${targetPrice.toFixed(2)}
              </p>
            </div>
          )}
        </>
      ) : (
        /* 입력 전 안내 */
        <div style={{ textAlign: "center" as const, padding: "12px 0", color: c.textFaint, fontSize: "13px" }}>
          {lbl(
            "평균 매입가와 보유 수량을 입력하면 현재 시세 기준 손익이 계산됩니다",
            "Enter your average cost and shares to see real-time P&L"
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   메인 패널
══════════════════════════════════════ */
export default function StockPanel() {
  const { theme, lang } = useTheme();
  const c = THEME[theme];
  const [input, setInput] = useState("");
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);
  const { state, refresh } = useStock(activeSymbol);

  const search = () => { const s = input.trim().toUpperCase(); if (s) setActiveSymbol(s); };
  const lastInd = state.status === "success"
    ? state.data.indicators.filter((p) => p.rsi !== null || p.macd !== null).at(-1) ?? null : null;
  const rsi  = rsiStatus(lastInd?.rsi ?? null, c, lang);
  const macd = macdStatus(lastInd?.macd ?? null, lastInd?.signal ?? null, c, lang);

  const lbl = (ko: string, en: string) => lang === "ko" ? ko : en;
  const inputStyle = { flex: 1, background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "9px", padding: "10px 14px", color: c.text, fontSize: "13px", outline: "none", fontFamily: "inherit" };

  return (
    <div>
      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: "12px", color: c.textFaint }}>
        {lbl("실시간 시세 · Finnhub", "Live Quotes · Finnhub")}
      </p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", position: "relative" }}>
        <SymbolSearch
          value={input}
          onChange={setInput}
          onSelect={(sym) => { setInput(sym); setActiveSymbol(sym); }}
          placeholder={lbl("종목 코드 또는 회사명  예: NVDA, Tesla", "Ticker or company name  e.g. NVDA, Tesla")}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px", marginBottom: "20px" }}>
        {PRESETS.map(sym => (
          <button key={sym} onClick={() => { setInput(sym); setActiveSymbol(sym); }} style={{
            padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 500, cursor: "pointer",
            fontFamily: "'IBM Plex Mono',monospace", transition: "all 0.15s",
            background: activeSymbol === sym ? (theme === "dark" ? "rgba(143,179,255,0.2)" : "rgba(36,97,204,0.12)") : c.panel2,
            border: activeSymbol === sym ? `1px solid ${c.accent}` : `1px solid ${c.line}`,
            color: activeSymbol === sym ? c.accent : c.textDim,
          }}>{sym}</button>
        ))}
      </div>

      {state.status === "idle" && (
        <div style={{ textAlign: "center" as const, padding: "64px 0", color: c.textFaint, fontSize: "13px" }}>
          {lbl("종목 코드를 입력하거나 위에서 선택하세요", "Enter a ticker or select one above")}
        </div>
      )}
      {state.status === "loading" && (
        <div style={{ textAlign: "center" as const, padding: "64px 0", color: c.textDim, fontSize: "13px" }}>
          <span style={{ color: c.accent }}>⟳</span> {lbl("데이터 불러오는 중...", "Loading...")}
        </div>
      )}
      {state.status === "error" && (
        <div style={{ borderRadius: "10px", padding: "16px", textAlign: "center" as const, background: theme === "dark" ? "rgba(255,123,123,0.07)" : "rgba(184,28,28,0.05)", border: `1px solid ${c.red}33` }}>
          <p style={{ color: c.red, fontSize: "13px" }}>⚠ {state.message}</p>
          <p style={{ color: c.textFaint, fontSize: "12px", marginTop: "6px" }}>
            {lbl("API 키가 설정됐는지, 종목 코드가 올바른지 확인하세요", "Check your API key and ticker symbol")}
          </p>
        </div>
      )}
      {state.status === "success" && (
        <StockView data={state.data} rsi={rsi} macd={macd} onRefresh={refresh} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   StockView
══════════════════════════════════════ */
function StockView({ data, rsi, macd, onRefresh }: {
  data: StockData;
  rsi: { label: string; color: string };
  macd: { label: string; color: string };
  onRefresh: () => void;
}) {
  const { theme, lang } = useTheme();
  const c = THEME[theme];
  const lbl = (ko: string, en: string) => lang === "ko" ? ko : en;

  const q = {
    price:     data.quote.price     ?? 0,
    change:    data.quote.change    ?? 0,
    changePct: data.quote.changePct ?? 0,
    high:      data.quote.high      ?? 0,
    low:       data.quote.low       ?? 0,
    open:      data.quote.open      ?? 0,
    prevClose: data.quote.prevClose ?? 0,
    updatedAt: data.quote.updatedAt ?? 0,
  };
  const isUp = q.changePct >= 0;
  const priceColor = isUp ? c.green : c.red;
  const updatedAt  = q.updatedAt
    ? new Date(q.updatedAt * 1000).toLocaleTimeString(lang === "ko" ? "ko-KR" : "en-US")
    : lbl("시간 미확인", "unknown time");

  const metricCard = (label: string, value: string) => (
    <div key={label} style={{ background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "10px", padding: "12px" }}>
      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: "4px", color: c.textFaint }}>{label}</p>
      <p style={{ fontSize: "15px", fontWeight: 700, color: c.accentText }}>{value}</p>
    </div>
  );

  const chartSection = (label: string, height: number, children: React.ReactNode) => (
    <div style={{ marginBottom: "12px" }}>
      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: "6px", color: c.textFaint }}>{label}</p>
      <div style={{ height, minHeight: height, position: "relative" as const }}>{children}</div>
    </div>
  );

  return (
    <div>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {data.logo && <img src={data.logo} alt={data.name} style={{ width: 28, height: 28, borderRadius: "6px", objectFit: "contain" as const, background: "#fff" }} />}
          <div>
            <p style={{ fontSize: "16px", fontWeight: 700, color: c.accentText }}>{data.symbol}</p>
            <p style={{ fontSize: "11px", color: c.textDim }}>{data.name}</p>
          </div>
        </div>
        <button onClick={onRefresh} style={{ background: "none", border: `1px solid ${c.line}`, borderRadius: "6px", padding: "4px 8px", color: c.textDim, cursor: "pointer", fontSize: "13px" }}>↺</button>
      </div>

      {/* 현재가 */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "32px", fontWeight: 700, color: priceColor, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.1 }}>
          ${q.price.toFixed(2)}
        </p>
        <p style={{ fontSize: "13px", color: priceColor, marginTop: "2px" }}>
          {isUp ? "▲" : "▼"} {Math.abs(q.change).toFixed(2)} ({isUp ? "+" : ""}{q.changePct.toFixed(2)}%)
          <span style={{ color: c.textFaint, marginLeft: "10px", fontSize: "11px" }}>
            {updatedAt} {lbl("기준", "as of")}
          </span>
        </p>
      </div>

      {/* 손익 계산기 — 현재가 전달 */}
      <PnlCalculator currentPrice={q.price} />

      {/* OHLC */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[
          [lbl("고가", "High"),     `$${q.high.toFixed(2)}`],
          [lbl("저가", "Low"),      `$${q.low.toFixed(2)}`],
          [lbl("시가", "Open"),     `$${q.open.toFixed(2)}`],
          [lbl("전일종가", "Prev Close"), `$${q.prevClose.toFixed(2)}`],
        ].map(([l, v]) => metricCard(l, v))}
      </div>

      {/* RSI / MACD */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[{ label: "RSI (14)", val: rsi }, { label: "MACD (12,26,9)", val: macd }].map(({ label, val }) => (
          <div key={label} style={{ background: c.panel2, border: `1px solid ${val.color}44`, borderRadius: "10px", padding: "12px" }}>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: "4px", color: c.textFaint }}>{label}</p>
            <p style={{ fontSize: "13px", fontWeight: 500, color: val.color }}>{val.label}</p>
          </div>
        ))}
      </div>

      {/* 차트 */}
      {data.candles.length > 0 ? (
        <>
          {chartSection(lbl("캔들스틱 + 거래량", "Candlestick + Volume"), 420, <CandleChart candles={data.candles} />)}
          {chartSection(lbl("RSI (14) — 70 과매수 · 30 과매도", "RSI (14) — 70 Overbought · 30 Oversold"), 130, <RSIChart indicators={data.indicators} />)}
          {chartSection("MACD (12, 26, 9)", 130, <MACDChart indicators={data.indicators} />)}
        </>
      ) : (
        <div style={{ borderRadius: "12px", padding: "24px 20px", marginBottom: "16px", textAlign: "center" as const, background: c.panel2, border: `1px solid ${c.line}` }}>
          <p style={{ fontSize: "20px", marginBottom: "8px" }}>📊</p>
          <p style={{ fontSize: "13px", fontWeight: 500, color: c.accentText, marginBottom: "6px" }}>
            {lbl("차트 데이터를 불러올 수 없습니다", "Chart data unavailable")}
          </p>
          <p style={{ fontSize: "12px", color: c.textFaint, lineHeight: 1.7, marginBottom: "12px" }}>
            {lang === "ko"
              ? <>Finnhub 무료 플랜은 <strong style={{ color: c.yellow }}>일봉(캔들) 데이터를 지원하지 않습니다.</strong><br />현재가·뉴스·지표 해석은 정상 동작 중입니다.</>
              : <>Finnhub free plan does <strong style={{ color: c.yellow }}>not include daily candle data.</strong><br />Quotes, news, and indicator signals work normally.</>
            }
          </p>
          <div style={{ display: "inline-flex", flexDirection: "column" as const, gap: "6px", textAlign: "left" as const }}>
            <p style={{ fontSize: "11px", color: c.textDim }}>
              {lbl("📌 차트를 보려면 아래 중 하나를 선택하세요:", "📌 To enable charts, choose one:")}
            </p>
            <a href="https://finnhub.io/pricing" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: c.accent }}>
              {lbl("① Finnhub 유료 플랜 업그레이드 →", "① Upgrade to Finnhub paid plan →")}
            </a>
            <a href="https://twelvedata.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: c.accent }}>
              {lbl("② Twelve Data 무료 API 키 발급 (800 calls/day) →", "② Get a free Twelve Data API key (800 calls/day) →")}
            </a>
          </div>
        </div>
      )}

      {/* 뉴스 */}
      {data.news.length > 0 && (
        <div>
          <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: "8px", color: c.textFaint }}>
            {lbl("최근 뉴스 (7일)", "Recent News (7d)")}
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
            {data.news.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", borderRadius: "10px", padding: "12px", background: c.panel2, border: `1px solid ${c.line}`, textDecoration: "none" }}>
                <p style={{ fontSize: "12px", color: c.accentText, lineHeight: 1.5, marginBottom: "4px" }}>{item.headline}</p>
                <p style={{ fontSize: "11px", color: c.textFaint }}>
                  {item.source} · {new Date(item.datetime * 1000).toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US")}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      <p style={{ textAlign: "center" as const, marginTop: "16px", fontSize: "11px", color: c.line }}>
        {lbl("60초마다 자동 갱신 · Finnhub 무료 플랜", "Auto-refresh every 60s · Finnhub free plan")}
      </p>
    </div>
  );
}
