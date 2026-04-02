"use client";

import { useState } from "react";
import { useStock } from "@/app/hooks/useStock";
import { CandleChart, RSIChart, MACDChart } from "./Charts";
import type { StockData } from "@/app/lib/finnhub.types";
import { useTheme, THEME } from "@/app/context/ThemeContext";

const PRESETS = ["NVDA","TSLA","AAPL","TQQQ","MSFT","META"];

function rsiStatus(rsi: number | null, c: any) {
  if (rsi === null) return { label: "—", color: c.textDim };
  if (rsi >= 70) return { label: `RSI ${rsi.toFixed(1)} 과매수`, color: c.red };
  if (rsi <= 30) return { label: `RSI ${rsi.toFixed(1)} 과매도`, color: c.green };
  return { label: `RSI ${rsi.toFixed(1)} 중립`, color: c.yellow };
}

function macdStatus(macd: number | null, signal: number | null, c: any) {
  if (macd === null || signal === null) return { label: "—", color: c.textDim };
  return macd > signal
    ? { label: "MACD 골든크로스 (상승)", color: c.green }
    : { label: "MACD 데드크로스 (하락)", color: c.red };
}

export default function StockPanel() {
  const { theme } = useTheme();
  const c = THEME[theme];
  const [input, setInput] = useState("");
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);
  const { state, refresh } = useStock(activeSymbol);

  const search = () => { const s = input.trim().toUpperCase(); if (s) setActiveSymbol(s); };
  const lastInd = state.status === "success"
    ? state.data.indicators.filter((p) => p.rsi !== null || p.macd !== null).at(-1) ?? null : null;
  const rsi = rsiStatus(lastInd?.rsi ?? null, c);
  const macd = macdStatus(lastInd?.macd ?? null, lastInd?.signal ?? null, c);

  const inputStyle = { flex: 1, background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "9px", padding: "10px 14px", color: c.text, fontSize: "13px", outline: "none", fontFamily: "inherit" };

  return (
    <div>
      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: "12px", color: c.textFaint }}>실시간 시세 · Finnhub</p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <input type="text" placeholder="종목 코드 입력  예: NVDA" value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && search()}
          style={inputStyle} />
        <button onClick={search} style={{ padding: "10px 18px", borderRadius: "9px", background: c.accent, color: c.bg, fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit" }}>조회</button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px", marginBottom: "20px" }}>
        {PRESETS.map((sym) => (
          <button key={sym} onClick={() => { setInput(sym); setActiveSymbol(sym); }} style={{
            padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 500, cursor: "pointer",
            fontFamily: "'IBM Plex Mono',monospace", transition: "all 0.15s",
            background: activeSymbol === sym ? (theme === "dark" ? "rgba(143,179,255,0.2)" : "rgba(36,97,204,0.12)") : c.panel2,
            border: activeSymbol === sym ? `1px solid ${c.accent}` : `1px solid ${c.line}`,
            color: activeSymbol === sym ? c.accent : c.textDim,
          }}>{sym}</button>
        ))}
      </div>

      {state.status === "idle" && <div style={{ textAlign: "center" as const, padding: "64px 0", color: c.textFaint, fontSize: "13px" }}>종목 코드를 입력하거나 위에서 선택하세요</div>}
      {state.status === "loading" && <div style={{ textAlign: "center" as const, padding: "64px 0", color: c.textDim, fontSize: "13px" }}><span style={{ color: c.accent }}>⟳</span> 데이터 불러오는 중...</div>}
      {state.status === "error" && (
        <div style={{ borderRadius: "10px", padding: "16px", textAlign: "center" as const, background: theme === "dark" ? "rgba(255,123,123,0.07)" : "rgba(184,28,28,0.05)", border: `1px solid ${c.red}33` }}>
          <p style={{ color: c.red, fontSize: "13px" }}>⚠ {state.message}</p>
          <p style={{ color: c.textFaint, fontSize: "12px", marginTop: "6px" }}>API 키가 설정됐는지, 종목 코드가 올바른지 확인하세요</p>
        </div>
      )}
      {state.status === "success" && <StockView data={state.data} rsi={rsi} macd={macd} onRefresh={refresh} />}
    </div>
  );
}

function StockView({ data, rsi, macd, onRefresh }: {
  data: StockData;
  rsi: { label: string; color: string };
  macd: { label: string; color: string };
  onRefresh: () => void;
}) {
  const { theme } = useTheme();
  const c = THEME[theme];
  const q = {
    price: data.quote.price ?? 0,
    change: data.quote.change ?? 0,
    changePct: data.quote.changePct ?? 0,
    high: data.quote.high ?? 0,
    low: data.quote.low ?? 0,
    open: data.quote.open ?? 0,
    prevClose: data.quote.prevClose ?? 0,
    updatedAt: data.quote.updatedAt ?? 0,
  };
  const isUp = q.changePct >= 0;
  const priceColor = isUp ? c.green : c.red;
  const updatedAt = q.updatedAt
    ? new Date(q.updatedAt * 1000).toLocaleTimeString("ko-KR")
    : "시간 미확인";

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
        <p style={{ fontSize: "32px", fontWeight: 700, color: priceColor, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.1 }}>${q.price.toFixed(2)}</p>
        <p style={{ fontSize: "13px", color: priceColor, marginTop: "2px" }}>
          {isUp ? "▲" : "▼"} {Math.abs(q.change).toFixed(2)} ({isUp ? "+" : ""}{q.changePct.toFixed(2)}%)
          <span style={{ color: c.textFaint, marginLeft: "10px", fontSize: "11px" }}>{updatedAt} 기준</span>
        </p>
      </div>

      {/* 지표 4개 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[["고가", `$${q.high.toFixed(2)}`], ["저가", `$${q.low.toFixed(2)}`], ["시가", `$${q.open.toFixed(2)}`], ["전일종가", `$${q.prevClose.toFixed(2)}`]].map(([l, v]) => metricCard(l, v))}
      </div>

      {/* RSI / MACD 해석 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[{ label: "RSI (14)", val: rsi }, { label: "MACD (12,26,9)", val: macd }].map(({ label, val }) => (
          <div key={label} style={{ background: c.panel2, border: `1px solid ${val.color}44`, borderRadius: "10px", padding: "12px" }}>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: "4px", color: c.textFaint }}>{label}</p>
            <p style={{ fontSize: "13px", fontWeight: 500, color: val.color }}>{val.label}</p>
          </div>
        ))}
      </div>

      {/* 차트 */}
      {data.candles.length > 0 ? <>
        {chartSection("캔들스틱 + 거래량 (90일)", 280, <CandleChart candles={data.candles} />)}
        {chartSection("RSI (14) — 70 과매수 · 30 과매도", 130, <RSIChart indicators={data.indicators} />)}
        {chartSection("MACD (12, 26, 9)", 130, <MACDChart indicators={data.indicators} />)}
      </> : (
        <div style={{ borderRadius: "12px", padding: "24px 20px", marginBottom: "16px", textAlign: "center", background: c.panel2, border: `1px solid ${c.line}` }}>
          <p style={{ fontSize: "20px", marginBottom: "8px" }}>📊</p>
          <p style={{ fontSize: "13px", fontWeight: 500, color: c.accentText, marginBottom: "6px" }}>차트 데이터를 불러올 수 없습니다</p>
          <p style={{ fontSize: "12px", color: c.textFaint, lineHeight: 1.7, marginBottom: "12px" }}>
            Finnhub 무료 플랜은 <strong style={{ color: c.yellow }}>일봉(캔들) 데이터를 지원하지 않습니다.</strong><br />
            현재가·뉴스·지표 해석은 정상 동작 중입니다.
          </p>
          <div style={{ display: "inline-flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
            <p style={{ fontSize: "11px", color: c.textDim }}>📌 차트를 보려면 아래 중 하나를 선택하세요:</p>
            <a href="https://finnhub.io/pricing" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: c.accent }}>① Finnhub 유료 플랜 업그레이드 →</a>
            <a href="https://twelvedata.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: c.accent }}>② Twelve Data 무료 API 키 발급 (800 calls/day) →</a>
          </div>
        </div>
      )}

      {/* 뉴스 */}
      {data.news.length > 0 && (
        <div>
          <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: "8px", color: c.textFaint }}>최근 뉴스 (7일)</p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
            {data.news.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", borderRadius: "10px", padding: "12px", background: c.panel2, border: `1px solid ${c.line}`, textDecoration: "none" }}>
                <p style={{ fontSize: "12px", color: c.accentText, lineHeight: 1.5, marginBottom: "4px" }}>{item.headline}</p>
                <p style={{ fontSize: "11px", color: c.textFaint }}>{item.source} · {new Date(item.datetime * 1000).toLocaleDateString("ko-KR")}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      <p style={{ textAlign: "center" as const, marginTop: "16px", fontSize: "11px", color: c.line }}>60초마다 자동 갱신 · Finnhub 무료 플랜 (15분 지연 없음)</p>
    </div>
  );
}
