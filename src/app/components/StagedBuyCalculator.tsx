"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme, THEME } from "@/app/context/ThemeContext";
import { CandleChart } from "./Charts";
import SymbolSearch from "./SymbolSearch";
import type { CandlePoint } from "@/app/lib/finnhub.types";

function useC() {
  const { theme, lang } = useTheme();
  return { c: THEME[theme], theme, lang };
}

/* ── 계층형 구간 3단계 설정 ── */
const DEFAULT_LAYERS = [
  { label: "1구간", pct: 25, desc: "초기 진입 — 확신이 선 첫 매수" },
  { label: "2구간", pct: 37, desc: "비관 구간 — 시장이 과하게 반응할 때" },
  { label: "3구간", pct: 38, desc: "패닉 구간 — 거래량 폭증, 개인 투매" },
];

/* ── Fibonacci 되돌림 비율 ── */
const FIB_LEVELS = [
  { ratio: 0.236, label: "23.6%" },
  { ratio: 0.382, label: "38.2%" },
  { ratio: 0.500, label: "50.0%" },
  { ratio: 0.618, label: "61.8%" },
  { ratio: 0.786, label: "78.6%" },
];

/* ── 캔들 데이터에서 지지선 자동 탐지 ── */
function detectSupportLevels(candles: CandlePoint[], currentPrice: number): { price: number; label: string; strength: "strong" | "medium" | "weak" }[] {
  if (candles.length < 20) return [];

  // 최근 120일 이내 데이터만 사용
  const recent = candles.slice(-120);
  const closes = recent.map(c => c.close);
  const highs  = recent.map(c => c.high);
  const lows   = recent.map(c => c.low);

  const maxHigh = Math.max(...highs);
  const minLow  = Math.min(...lows);
  const range   = maxHigh - minLow;

  // 1. Fibonacci 되돌림 레벨 계산
  const fibLevels = FIB_LEVELS.map(f => ({
    price: maxHigh - f.ratio * range,
    label: `피보나치 ${f.label} 되돌림`,
    strength: f.ratio === 0.618 || f.ratio === 0.382 ? "strong" : "medium" as "strong" | "medium" | "weak",
  }));

  // 2. 최근 저점 클러스터 탐지 (로컬 최솟값)
  const localLows: number[] = [];
  for (let i = 3; i < recent.length - 3; i++) {
    const w = [lows[i-3], lows[i-2], lows[i-1], lows[i], lows[i+1], lows[i+2], lows[i+3]];
    if (lows[i] === Math.min(...w)) {
      localLows.push(lows[i]);
    }
  }

  // 유사한 가격대 클러스터링 (±2% 이내)
  const clusters: { price: number; count: number }[] = [];
  for (const low of localLows) {
    const existing = clusters.find(c => Math.abs(c.price - low) / low < 0.02);
    if (existing) {
      existing.price = (existing.price * existing.count + low) / (existing.count + 1);
      existing.count++;
    } else {
      clusters.push({ price: low, count: 1 });
    }
  }

  const supportLines = clusters
    .filter(c => c.count >= 1 && c.price < currentPrice)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(c => ({
      price: c.price,
      label: `지지선 (${c.count}회 반등)`,
      strength: (c.count >= 2 ? "strong" : c.count >= 1 ? "medium" : "weak") as "strong" | "medium" | "weak",
    }));

  // 3. 52주 최저가
  const yearLow = Math.min(...lows);
  const yearHigh = Math.max(...highs);

  const all = [
    ...fibLevels,
    ...supportLines,
    { price: yearLow, label: "52주 최저가", strength: "strong" as const },
    { price: yearLow * 1.1, label: "52주 최저가 +10%", strength: "medium" as const },
  ];

  // 현재가보다 낮은 것만, 중복 제거 (±1.5% 이내), 정렬
  const filtered: typeof all = [];
  for (const lvl of all.sort((a, b) => b.price - a.price)) {
    if (lvl.price >= currentPrice) continue;
    if (filtered.some(f => Math.abs(f.price - lvl.price) / lvl.price < 0.015)) continue;
    filtered.push(lvl);
  }

  return filtered.slice(0, 6);
}

/* ════════════════════════════════════════
   메인 컴포넌트
════════════════════════════════════════ */
export default function StagedBuyCalculator() {
  const { c, theme, lang } = useC();
  const lbl = (ko: string, en: string) => lang === "ko" ? ko : en;

  const [symbol, setSymbol]         = useState("");
  const [activeSymbol, setActive]   = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [candles, setCandles]       = useState<CandlePoint[]>([]);

  // 사용자 입력
  const [bottomPrice, setBottomPrice] = useState(""); // 예상 저점
  const [topPrice, setTopPrice]       = useState(""); // 현재가 기준 자동
  const [budget, setBudget]           = useState("");  // 총 예산
  const [layers, setLayers]           = useState(DEFAULT_LAYERS);

  // 자동 지지선
  const [autoLevels, setAutoLevels]   = useState<ReturnType<typeof detectSupportLevels>>([]);
  const [showAutoLevels, setShowAutoLevels] = useState(false);

  const fetchStockFor = async (sym?: string) => {
    const s = (sym ?? symbol).trim().toUpperCase();
    if (!s) return;
    setActive(s);
    const sym2 = s;
    setLoading(true);
    setError("");
    setAutoLevels([]);
    try {
      const res = await fetch(`/api/stock/${sym2}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || "조회 실패"); return; }
      const price = data.quote?.price ?? 0;
      setCurrentPrice(price);
      setCandles(data.candles ?? []);
      setTopPrice(price.toFixed(2));
      // 자동 지지선 계산
      if (data.candles?.length > 0) {
        setAutoLevels(detectSupportLevels(data.candles, price));
      }
    } catch { setError("네트워크 오류"); }
    finally { setLoading(false); }
  };

  const applyAutoLevel = (price: number) => {
    setBottomPrice(price.toFixed(2));
    setShowAutoLevels(false);
  };

  // 계산
  const top    = parseFloat(topPrice);
  const bottom = parseFloat(bottomPrice);
  const total  = parseFloat(budget);
  const valid  = top > 0 && bottom > 0 && bottom < top;

  // 각 구간 진입 가격 (top → bottom 사이를 레이어 비율로 나눔)
  const stagePrices = valid ? layers.map((_, i) => {
    const t = i / (layers.length - 1);
    return top - t * (top - bottom);
  }) : [];

  // 각 구간 예산
  const stageBudgets = valid && total > 0 ? layers.map(l => total * l.pct / 100) : [];

  // 각 구간 수량
  const stageQtys = stagePrices.map((p, i) =>
    stageBudgets[i] ? stageBudgets[i] / p : 0
  );

  // 가중 평균 매입가 (모든 구간 매수 시)
  const totalBudgetUsed = stageBudgets.reduce((s, v) => s + v, 0);
  const totalQty        = stageQtys.reduce((s, v) => s + v, 0);
  const avgCost         = totalQty > 0 ? totalBudgetUsed / totalQty : 0;

  // 현재가 기준 가상 수익률 (if 전체 매수 완료 후 현재가에 팔면)
  const virtualPnl = currentPrice && avgCost > 0
    ? ((currentPrice - avgCost) / avgCost) * 100 : null;

  const LAYER_COLORS = [c.green, c.yellow, c.red];

  const inputSt: React.CSSProperties = {
    background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "8px",
    padding: "9px 12px", fontSize: "13px", color: c.text,
    fontFamily: "'IBM Plex Mono',monospace", outline: "none",
    width: "100%", boxSizing: "border-box",
  };

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: c.accent, marginBottom: "5px" }}>
          Staged Buy Calculator
        </p>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: c.text, margin: "0 0 4px" }}>
          {lbl("분할 매수 가격 구간 계산기", "Staged Buy Zone Calculator")}
        </h2>
        <p style={{ fontSize: "13px", color: c.textFaint, margin: 0 }}>
          {lbl("예상 저점을 입력하면 계층형 매수 구간과 수량을 자동 계산합니다", "Enter your estimated bottom to get layered buy zones and quantities")}
        </p>
      </div>

      {/* 종목 검색 */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px", position: "relative" }}>
        <SymbolSearch
          value={symbol}
          onChange={setSymbol}
          onSelect={(sym) => { setSymbol(sym); setActive(sym); fetchStockFor(sym); }}
          placeholder={lbl("종목 코드 또는 회사명  예: NVDA, Tesla", "Ticker or company name  e.g. NVDA, Tesla")}
        />
      </div>

      {error && <p style={{ fontSize: "13px", color: c.red, marginBottom: "12px" }}>⚠ {error}</p>}

      {/* 현재가 표시 */}
      {currentPrice !== null && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", padding: "12px 14px", background: c.panel2, borderRadius: "10px", border: `1px solid ${c.line}` }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: c.textFaint, textTransform: "uppercase" as const }}>
            {activeSymbol} {lbl("현재가", "Current")}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "20px", fontWeight: 700, color: c.accentText }}>
            ${currentPrice.toFixed(2)}
          </span>
          {autoLevels.length > 0 && (
            <button onClick={() => setShowAutoLevels(v => !v)} style={{
              marginLeft: "auto", padding: "5px 12px", borderRadius: "6px", fontSize: "12px",
              background: showAutoLevels ? c.accent + "22" : c.panel,
              border: `1px solid ${showAutoLevels ? c.accent : c.line}`,
              color: showAutoLevels ? c.accent : c.textDim, cursor: "pointer", fontFamily: "inherit",
            }}>
              {lbl("🔍 자동 지지선 보기", "🔍 Auto Support Levels")} {showAutoLevels ? "▲" : "▼"}
            </button>
          )}
        </div>
      )}

      {/* 자동 지지선 드롭다운 */}
      {showAutoLevels && autoLevels.length > 0 && (
        <div style={{ background: c.panel, border: `1px solid ${c.accent}33`, borderRadius: "12px", padding: "14px", marginBottom: "14px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: c.accent, marginBottom: "10px" }}>
            {lbl("📊 차트 분석 기반 지지 레벨 — 클릭하면 예상 저점으로 설정됩니다", "📊 Chart-Based Support Levels — Click to set as bottom")}
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
            {autoLevels.map((lvl, i) => (
              <button key={i} onClick={() => applyAutoLevel(lvl.price)} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 14px", borderRadius: "8px", cursor: "pointer", textAlign: "left" as const,
                background: lvl.strength === "strong"
                  ? (theme === "dark" ? "rgba(108,232,138,0.06)" : "rgba(26,122,64,0.05)")
                  : c.panel2,
                border: `1px solid ${lvl.strength === "strong" ? c.green + "44" : c.line}`,
                fontFamily: "inherit",
              }}>
                <div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: c.accentText, fontFamily: "'IBM Plex Mono',monospace" }}>
                    ${lvl.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: "12px", color: c.textFaint, marginLeft: "10px" }}>{lvl.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {currentPrice && (
                    <span style={{ fontSize: "11px", color: c.textDim }}>
                      ({(((lvl.price - currentPrice) / currentPrice) * 100).toFixed(1)}%)
                    </span>
                  )}
                  <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "4px",
                    background: lvl.strength === "strong" ? c.green + "22" : lvl.strength === "medium" ? c.yellow + "22" : c.line,
                    color: lvl.strength === "strong" ? c.green : lvl.strength === "medium" ? c.yellow : c.textDim,
                  }}>
                    {lbl(
                      lvl.strength === "strong" ? "강" : lvl.strength === "medium" ? "중" : "약",
                      lvl.strength === "strong" ? "Strong" : lvl.strength === "medium" ? "Medium" : "Weak"
                    )}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력 폼 */}
      <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "18px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: 700, color: c.textFaint, textTransform: "uppercase" as const, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: "0.1em", marginBottom: "14px" }}>
          {lbl("매수 구간 설정", "Configure Buy Zones")}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {[
            { label: lbl("매수 시작 가격 (상단)", "Top Entry Price"), key: "top", val: topPrice, set: setTopPrice, prefix: "$" },
            { label: lbl("예상 저점 (하단)", "Estimated Bottom"), key: "bot", val: bottomPrice, set: setBottomPrice, prefix: "$" },
            { label: lbl("총 투자 예산", "Total Budget"), key: "bud", val: budget, set: setBudget, prefix: "$" },
          ].map(f => (
            <div key={f.key}>
              <p style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.06em", color: c.textFaint, marginBottom: "5px" }}>{f.label}</p>
              <div style={{ position: "relative" as const }}>
                <span style={{ position: "absolute" as const, left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", color: c.textDim }}>{f.prefix}</span>
                <input type="number" min="0" step="0.01" value={f.val} onChange={e => f.set(e.target.value)} placeholder="0.00"
                  style={{ ...inputSt, paddingLeft: "22px" }} />
              </div>
            </div>
          ))}
        </div>

        {/* 구간 비율 조정 */}
        <div style={{ marginTop: "14px" }}>
          <p style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.06em", color: c.textFaint, marginBottom: "8px" }}>
            {lbl("구간별 예산 비율 (합계 100%)", "Layer Allocation (must = 100%)")}
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
            {layers.map((layer, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: LAYER_COLORS[i], flexShrink: 0 }} />
                <span style={{ fontSize: "12px", color: c.textSub, minWidth: "60px" }}>{layer.label}</span>
                <input type="range" min={5} max={70} step={1} value={layer.pct}
                  onChange={e => {
                    const newPct = Number(e.target.value);
                    setLayers(prev => {
                      const updated = [...prev];
                      updated[i] = { ...updated[i], pct: newPct };
                      return updated;
                    });
                  }}
                  style={{ flex: 1, accentColor: LAYER_COLORS[i] }} />
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, color: LAYER_COLORS[i], minWidth: "36px", textAlign: "right" as const }}>
                  {layer.pct}%
                </span>
              </div>
            ))}
            <p style={{ fontSize: "11px", color: layers.reduce((s, l) => s + l.pct, 0) === 100 ? c.green : c.red, textAlign: "right" as const }}>
              {lbl("합계", "Total")}: {layers.reduce((s, l) => s + l.pct, 0)}%
            </p>
          </div>
        </div>
      </div>

      {/* 결과 테이블 */}
      {valid && (
        <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "18px", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: c.textFaint, textTransform: "uppercase" as const, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: "0.1em", marginBottom: "14px" }}>
            {lbl("구간별 매수 계획", "Buy Zone Breakdown")}
          </p>

          {/* 시각적 가격 바 */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ position: "relative" as const, height: "40px", borderRadius: "8px", overflow: "hidden", background: c.panel2 }}>
              {stagePrices.map((price, i) => {
                const leftPct = ((top - price) / (top - bottom)) * 100;
                return (
                  <div key={i} title={`${layers[i].label}: $${price.toFixed(2)}`}
                    style={{ position: "absolute" as const, left: `${leftPct}%`, top: 0, bottom: 0, width: "3px", background: LAYER_COLORS[i], transform: "translateX(-50%)" }}>
                    <div style={{ position: "absolute" as const, top: "2px", left: "6px", fontSize: "10px", color: LAYER_COLORS[i], fontFamily: "'IBM Plex Mono',monospace", whiteSpace: "nowrap" as const }}>
                      ${price.toFixed(0)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ fontSize: "11px", color: c.textFaint, fontFamily: "'IBM Plex Mono',monospace" }}>${top.toFixed(2)} {lbl("(상단)", "(top)")}</span>
              <span style={{ fontSize: "11px", color: c.textFaint, fontFamily: "'IBM Plex Mono',monospace" }}>${bottom.toFixed(2)} {lbl("(예상 저점)", "(est. bottom)")}</span>
            </div>
          </div>

          {/* 구간 카드 */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
            {stagePrices.map((price, i) => {
              const dropPct = ((price - top) / top) * 100;
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "10px", background: c.panel2, border: `1px solid ${LAYER_COLORS[i]}33` }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: LAYER_COLORS[i] }} />
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: c.textSub, margin: 0 }}>
                      {layers[i].label} <span style={{ color: LAYER_COLORS[i] }}>{layers[i].pct}%</span>
                    </p>
                    <p style={{ fontSize: "11px", color: c.textFaint, margin: 0 }}>{layers[i].desc}</p>
                  </div>
                  <div style={{ textAlign: "right" as const }}>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: LAYER_COLORS[i], margin: 0, fontFamily: "'IBM Plex Mono',monospace" }}>
                      ${price.toFixed(2)}
                    </p>
                    <p style={{ fontSize: "11px", color: c.textFaint, margin: 0 }}>
                      {dropPct.toFixed(1)}% {lbl("하락 시", "from top")}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" as const }}>
                    {total > 0 && (
                      <>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: c.accentText, margin: 0, fontFamily: "'IBM Plex Mono',monospace" }}>
                          ${stageBudgets[i].toFixed(0)}
                        </p>
                        <p style={{ fontSize: "11px", color: c.textFaint, margin: 0 }}>
                          ≈ {stageQtys[i].toFixed(2)} {lbl("주", "sh")}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 요약 */}
          {total > 0 && (
            <div style={{ marginTop: "14px", padding: "14px", borderRadius: "10px", background: theme === "dark" ? "rgba(143,179,255,0.07)" : "rgba(36,97,204,0.05)", border: `1px solid ${c.accent}33` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                {[
                  { label: lbl("가중 평균 단가", "Avg Cost (if all filled)"), val: `$${avgCost.toFixed(2)}` },
                  { label: lbl("총 수량 (전구간)", "Total Shares"),           val: `${totalQty.toFixed(2)}${lbl("주", " sh")}` },
                  {
                    label: lbl("현재가 기준 손익", "P&L vs Current"),
                    val: virtualPnl !== null ? `${virtualPnl >= 0 ? "+" : ""}${virtualPnl.toFixed(1)}%` : "—",
                    color: virtualPnl !== null ? (virtualPnl >= 0 ? c.green : c.red) : c.textDim,
                  },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center" as const }}>
                    <p style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: c.textFaint, marginBottom: "4px" }}>{s.label}</p>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: (s as any).color ?? c.accentText, margin: 0, fontFamily: "'IBM Plex Mono',monospace" }}>{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 장기 차트 */}
      {candles.length > 0 && (
        <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "18px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.12em", color: c.textFaint, margin: 0 }}>
              {activeSymbol} {lbl("캔들 차트 — 지지선 확인용", "Candle Chart — For Support Level Reference")}
            </p>
            <span style={{ fontSize: "11px", color: c.textDim }}>{candles.length}{lbl("일 데이터", "d data")}</span>
          </div>
          <div style={{ height: 420, minHeight: 420, position: "relative" as const }}>
            <CandleChart candles={candles} />
          </div>
          {valid && stagePrices.length > 0 && (
            <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
              {stagePrices.map((price, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "12px", height: "3px", background: LAYER_COLORS[i], borderRadius: "2px" }} />
                  <span style={{ fontSize: "11px", color: c.textDim, fontFamily: "'IBM Plex Mono',monospace" }}>
                    {layers[i].label} ${price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 안내 */}
      {candles.length === 0 && activeSymbol && !loading && (
        <div style={{ borderRadius: "10px", padding: "14px", textAlign: "center" as const, background: c.panel2, border: `1px solid ${c.line}`, marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", color: c.textFaint }}>
            {lbl(
              "차트 데이터가 없어 지지선 자동 탐지가 제한됩니다. Twelve Data API 키를 설정하면 활성화됩니다.",
              "Chart data unavailable — auto support detection is limited. Add a Twelve Data API key to enable it."
            )}
          </p>
          <a href="https://twelvedata.com" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "12px", color: c.accent }}>
            {lbl("Twelve Data 무료 키 발급 →", "Get free Twelve Data key →")}
          </a>
        </div>
      )}

      <div style={{ height: "20px" }} />
    </div>
  );
}
