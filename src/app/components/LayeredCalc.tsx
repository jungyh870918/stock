"use client";

import { useState } from "react";
import { useTheme, THEME, type Lang } from "@/app/context/ThemeContext";

function useC() {
  const { theme, lang } = useTheme();
  return { c: THEME[theme], theme, lang };
}
const L = (ko: string, en: string, lang: Lang) => lang === "ko" ? ko : en;

const LAYER_COLORS = ["#6ce88a", "#ffcc5c", "#ff7b7b"] as const;
const DEFAULT_RATIOS = [25, 37, 38];
const LAYER_LABELS_KO = ["1구간 — 초기 진입", "2구간 — 비관 구간", "3구간 — 패닉 구간"];
const LAYER_LABELS_EN = ["Zone 1 — Initial Entry", "Zone 2 — Pessimism Zone", "Zone 3 — Panic Zone"];
const LAYER_DESC_KO   = ["확신이 선 첫 매수. 상승 초입을 놓치지 않기 위한 포지션", "시장이 과도하게 비관적일 때. 논리가 살아있는지 먼저 확인", "거래량 폭증, 뉴스 최악. 여기서 가장 크게 태운다"];
const LAYER_DESC_EN   = ["First buy with conviction. Position to not miss the early move", "When market overreacts negatively. Verify thesis still holds", "Volume surge, worst news. This is where you load up most"];

export default function LayeredCalc() {
  const { c, theme, lang } = useC();
  const lbl = (ko: string, en: string) => L(ko, en, lang);

  const [budget, setBudget]   = useState("");
  const [filled, setFilled]   = useState(["", "", ""]);  // 이미 투입한 금액
  const [ratios, setRatios]   = useState([...DEFAULT_RATIOS]);
  const [avgCostInputs, setAvgCostInputs] = useState(["", "", ""]); // 각 구간 평균 매입가

  const total     = parseFloat(budget) || 0;
  const ratioSum  = ratios.reduce((s, r) => s + r, 0);
  const valid     = ratioSum === 100;

  // 각 구간 할당 금액
  const allocated = ratios.map(r => total * r / 100);
  // 이미 투입한 금액
  const filledAmt = filled.map(f => parseFloat(f) || 0);
  // 남은 탄환
  const remaining = allocated.map((a, i) => Math.max(0, a - filledAmt[i]));
  // 전체 투입
  const totalFilled    = filledAmt.reduce((s, v) => s + v, 0);
  const totalRemaining = remaining.reduce((s, v) => s + v, 0);
  const progressPct    = total > 0 ? (totalFilled / total) * 100 : 0;

  // 가중 평균 단가 계산 (평균 매입가 × 투입금액으로 가중)
  const weightedNumer = filledAmt.reduce((s, f, i) => {
    const avg = parseFloat(avgCostInputs[i]) || 0;
    return s + (avg > 0 ? f : 0);
  }, 0);
  const weightedDenom = filledAmt.reduce((s, f, i) => {
    const avg = parseFloat(avgCostInputs[i]) || 0;
    return s + (avg > 0 && f > 0 ? f / avg : 0); // 수량 합산
  }, 0);
  const avgCost = weightedDenom > 0
    ? filledAmt.reduce((s, f, i) => {
        const avg = parseFloat(avgCostInputs[i]) || 0;
        return s + (avg > 0 ? f : 0);
      }, 0) / filledAmt.reduce((s, f, i) => {
        const avg = parseFloat(avgCostInputs[i]) || 0;
        return s + (avg > 0 && f > 0 ? f / avg : 0);
      }, 0)
    : 0;

  const inputSt: React.CSSProperties = {
    background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "8px",
    padding: "8px 10px", fontSize: "13px", color: c.text,
    fontFamily: "'IBM Plex Mono',monospace", outline: "none",
    boxSizing: "border-box", width: "100%",
  };

  // 현재 진행 단계 판별
  const currentZone = filledAmt.findIndex((f, i) => f < allocated[i]);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: c.accent, marginBottom: "5px" }}>Layered Strategy Calculator</p>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: c.text, margin: "0 0 4px" }}>
          {lbl("계층형 전략 계산기", "Layered Buy Strategy Calculator")}
        </h2>
        <p style={{ fontSize: "13px", color: c.textFaint, margin: 0 }}>
          {lbl("총 예산을 3구간으로 나눠 계획하고, 현재 진행 상황을 추적합니다", "Split your budget into 3 zones and track your execution progress")}
        </p>
      </div>

      {/* 총 예산 + 비율 설정 */}
      <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "16px", marginBottom: "14px" }}>
        <p style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.1em", color: c.textFaint, marginBottom: "12px" }}>
          {lbl("총 투자 예산 설정", "Total Budget")}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span style={{ fontSize: "16px", color: c.textDim }}>$</span>
          <input type="number" min="0" value={budget} onChange={e => setBudget(e.target.value)}
            placeholder="10000"
            style={{ ...inputSt, fontSize: "20px", fontWeight: 700, flex: 1 }} />
        </div>

        {/* 비율 슬라이더 */}
        <p style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: c.textFaint, marginBottom: "10px" }}>
          {lbl("구간별 비율 (합계 100%)", "Zone Allocation (must = 100%)")}
        </p>
        {ratios.map((ratio, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: LAYER_COLORS[i], flexShrink: 0 }} />
            <span style={{ fontSize: "12px", color: c.textSub, minWidth: "80px" }}>
              {lang === "ko" ? `${i+1}구간` : `Zone ${i+1}`}
            </span>
            <input type="range" min={5} max={70} step={1} value={ratio}
              onChange={e => setRatios(prev => { const n = [...prev]; n[i] = Number(e.target.value); return n; })}
              style={{ flex: 1, accentColor: LAYER_COLORS[i] }} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", fontWeight: 700, color: LAYER_COLORS[i], minWidth: "40px", textAlign: "right" as const }}>
              {ratio}%
            </span>
            {total > 0 && (
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: c.textDim, minWidth: "72px", textAlign: "right" as const }}>
                ${allocated[i].toFixed(0)}
              </span>
            )}
          </div>
        ))}
        <p style={{ fontSize: "11px", color: ratioSum === 100 ? c.green : c.red, textAlign: "right" as const, margin: "4px 0 0" }}>
          {lbl("합계", "Total")}: {ratioSum}% {ratioSum !== 100 && `(${100 - ratioSum > 0 ? "+" : ""}${100 - ratioSum}%)`}
        </p>
      </div>

      {/* 구간별 진행 현황 */}
      {total > 0 && (
        <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "16px", marginBottom: "14px" }}>
          <p style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.1em", color: c.textFaint, marginBottom: "12px" }}>
            {lbl("구간별 집행 현황", "Zone Execution Status")}
          </p>

          {[0, 1, 2].map(i => {
            const isActive   = i === currentZone;
            const isDone     = filledAmt[i] >= allocated[i] && allocated[i] > 0;
            const fillRatio  = allocated[i] > 0 ? Math.min(filledAmt[i] / allocated[i], 1) * 100 : 0;
            const statusColor = isDone ? c.green : isActive ? LAYER_COLORS[i] : c.textFaint;

            return (
              <div key={i} style={{
                background: isActive
                  ? (theme === "dark" ? `${LAYER_COLORS[i]}0f` : `${LAYER_COLORS[i]}0a`)
                  : c.panel2,
                border: `1px solid ${isActive ? LAYER_COLORS[i] + "44" : c.line}`,
                borderRadius: "10px", padding: "14px", marginBottom: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
                  {/* 상태 배지 */}
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, background: isDone ? c.green + "22" : isActive ? LAYER_COLORS[i] + "22" : c.line, color: statusColor }}>
                    {isDone ? "✓" : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: statusColor, margin: "0 0 2px" }}>
                      {lang === "ko" ? LAYER_LABELS_KO[i] : LAYER_LABELS_EN[i]}
                    </p>
                    <p style={{ fontSize: "11px", color: c.textFaint, margin: 0 }}>
                      {lang === "ko" ? LAYER_DESC_KO[i] : LAYER_DESC_EN[i]}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" as const }}>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: LAYER_COLORS[i], margin: 0, fontFamily: "'IBM Plex Mono',monospace" }}>
                      ${allocated[i].toFixed(0)}
                    </p>
                    <p style={{ fontSize: "11px", color: c.textFaint, margin: 0 }}>{ratios[i]}%</p>
                  </div>
                </div>

                {/* 집행 입력 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                  <div>
                    <p style={{ fontSize: "10px", color: c.textFaint, marginBottom: "4px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
                      {lbl("투입 금액 ($)", "Amount Filled ($)")}
                    </p>
                    <div style={{ position: "relative" as const }}>
                      <span style={{ position: "absolute" as const, left: "8px", top: "50%", transform: "translateY(-50%)", color: c.textDim, fontSize: "12px" }}>$</span>
                      <input type="number" min="0" value={filled[i]}
                        onChange={e => setFilled(prev => { const n = [...prev]; n[i] = e.target.value; return n; })}
                        placeholder="0"
                        style={{ ...inputSt, paddingLeft: "20px", fontSize: "12px" }} />
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: "10px", color: c.textFaint, marginBottom: "4px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
                      {lbl("평균 매입가 ($)", "Avg Buy Price ($)")}
                    </p>
                    <div style={{ position: "relative" as const }}>
                      <span style={{ position: "absolute" as const, left: "8px", top: "50%", transform: "translateY(-50%)", color: c.textDim, fontSize: "12px" }}>$</span>
                      <input type="number" min="0" step="0.01" value={avgCostInputs[i]}
                        onChange={e => setAvgCostInputs(prev => { const n = [...prev]; n[i] = e.target.value; return n; })}
                        placeholder="0.00"
                        style={{ ...inputSt, paddingLeft: "20px", fontSize: "12px" }} />
                    </div>
                  </div>
                </div>

                {/* 진행 바 */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1, height: "5px", borderRadius: "3px", background: c.line, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: "3px", width: `${fillRatio}%`, background: LAYER_COLORS[i], transition: "width 0.4s" }} />
                  </div>
                  <span style={{ fontSize: "11px", color: LAYER_COLORS[i], fontFamily: "'IBM Plex Mono',monospace", minWidth: "36px", textAlign: "right" as const }}>
                    {fillRatio.toFixed(0)}%
                  </span>
                  <span style={{ fontSize: "11px", color: c.textFaint, fontFamily: "'IBM Plex Mono',monospace" }}>
                    {lbl("남은 탄환", "Remaining")}: ${remaining[i].toFixed(0)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 종합 요약 */}
      {total > 0 && (
        <div style={{ background: theme === "dark" ? "rgba(143,179,255,0.07)" : "rgba(36,97,204,0.05)", border: `1px solid ${c.accent}33`, borderRadius: "14px", padding: "16px" }}>
          <p style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.1em", color: c.accent, marginBottom: "12px" }}>
            {lbl("종합 현황", "Summary")}
          </p>

          {/* 전체 진행 바 */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: c.textDim, marginBottom: "6px" }}>
              <span>{lbl("전체 집행률", "Total Execution")}</span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: c.accent }}>{progressPct.toFixed(1)}%</span>
            </div>
            <div style={{ height: "8px", borderRadius: "4px", background: c.line, overflow: "hidden", display: "flex" }}>
              {[0,1,2].map(i => {
                const w = total > 0 ? (filledAmt[i] / total) * 100 : 0;
                return <div key={i} style={{ height: "100%", width: `${w}%`, background: LAYER_COLORS[i], transition: "width 0.4s" }} />;
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {[
              { label: lbl("총 예산", "Total Budget"),           val: `$${total.toFixed(0)}`,             color: c.accentText },
              { label: lbl("총 투입금", "Total Filled"),          val: `$${totalFilled.toFixed(0)}`,        color: c.green },
              { label: lbl("남은 탄환", "Remaining Ammo"),        val: `$${totalRemaining.toFixed(0)}`,     color: c.yellow },
              { label: lbl("집행률", "Execution"),               val: `${progressPct.toFixed(1)}%`,        color: c.accent },
              { label: lbl("가중 평균 단가", "Weighted Avg Cost"), val: avgCost > 0 ? `$${avgCost.toFixed(2)}` : "—", color: c.accentText },
              { label: lbl("현재 단계", "Current Zone"),          val: currentZone < 0 ? lbl("완료", "Done") : `${lbl("구간", "Zone")} ${currentZone + 1}`, color: currentZone < 0 ? c.green : LAYER_COLORS[currentZone] },
            ].map(s => (
              <div key={s.label} style={{ background: c.panel, borderRadius: "8px", padding: "10px 12px" }}>
                <p style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.06em", color: c.textFaint, marginBottom: "3px" }}>{s.label}</p>
                <p style={{ fontSize: "14px", fontWeight: 700, color: s.color, margin: 0, fontFamily: "'IBM Plex Mono',monospace" }}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ height: "20px" }} />
    </div>
  );
}
