"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme, THEME, type Lang } from "@/app/context/ThemeContext";

function useC() {
  const { theme, lang } = useTheme();
  return { c: THEME[theme], theme, lang };
}

const L = (ko: string, en: string, lang: Lang) => lang === "ko" ? ko : en;

interface Position {
  id: string;
  symbol: string;
  name: string;
  amount: number;   // 투자 금액 (USD)
  color: string;
}

const COLORS = [
  "#8fb3ff","#6ce88a","#ffcc5c","#ff7b7b","#c084fc",
  "#38bdf8","#fb923c","#34d399","#f472b6","#a78bfa",
];

const STORAGE_KEY = "portfolio_tracker_v1";

function genId() { return Math.random().toString(36).slice(2, 9); }

/* ── 파이 차트 SVG ── */
function PieChart({ positions }: { positions: Position[] }) {
  const { c } = useC();
  const total = positions.reduce((s, p) => s + p.amount, 0);
  if (total === 0 || positions.length === 0) return null;

  const size = 200;
  const cx = size / 2, cy = size / 2, r = 80, inner = 48;
  let angle = -Math.PI / 2;

  const slices = positions.map(p => {
    const pct   = p.amount / total;
    const start = angle;
    angle += pct * 2 * Math.PI;
    return { ...p, pct, start, end: angle };
  });

  const arc = (sa: number, ea: number, R: number, ri: number) => {
    const x1 = cx + R * Math.cos(sa), y1 = cy + R * Math.sin(sa);
    const x2 = cx + R * Math.cos(ea), y2 = cy + R * Math.sin(ea);
    const ix1 = cx + ri * Math.cos(ea), iy1 = cy + ri * Math.sin(ea);
    const ix2 = cx + ri * Math.cos(sa), iy2 = cy + ri * Math.sin(sa);
    const lg = ea - sa > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${ri} ${ri} 0 ${lg} 0 ${ix2} ${iy2} Z`;
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: "200px" }}>
      {slices.map((s, i) => (
        <path key={s.id} d={arc(s.start, s.end, r, inner)}
          fill={s.color} stroke={c.panel} strokeWidth="1.5">
          <title>{s.symbol}: {(s.pct * 100).toFixed(1)}%</title>
        </path>
      ))}
      {/* 중앙 합계 */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill={c.textFaint}>Total</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="13" fontWeight="700" fill={c.text}>
        ${total.toLocaleString("en-US", { maximumFractionDigits: 0 })}
      </text>
    </svg>
  );
}

export default function PortfolioTracker() {
  const { c, theme, lang } = useC();
  const lbl = (ko: string, en: string) => L(ko, en, lang);
  const [positions, setPositions] = useState<Position[]>([]);
  const [sym, setSym]     = useState("");
  const [name, setName]   = useState("");
  const [amount, setAmount] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPositions(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(positions)); } catch {}
  }, [positions]);

  const total = positions.reduce((s, p) => s + p.amount, 0);

  const addOrUpdate = () => {
    const a = parseFloat(amount);
    if (!sym.trim() || isNaN(a) || a <= 0) return;
    if (editId) {
      setPositions(ps => ps.map(p => p.id === editId ? { ...p, symbol: sym.toUpperCase(), name, amount: a } : p));
      setEditId(null);
    } else {
      const usedColors = positions.map(p => p.color);
      const color = COLORS.find(c => !usedColors.includes(c)) ?? COLORS[positions.length % COLORS.length];
      setPositions(ps => [...ps, { id: genId(), symbol: sym.toUpperCase(), name, amount: a, color }]);
    }
    setSym(""); setName(""); setAmount("");
  };

  const startEdit = (p: Position) => {
    setEditId(p.id); setSym(p.symbol); setName(p.name); setAmount(String(p.amount));
  };

  const remove = (id: string) => setPositions(ps => ps.filter(p => p.id !== id));

  // 비중 경고
  const topPosition = positions.length > 0
    ? positions.reduce((a, b) => a.amount > b.amount ? a : b)
    : null;
  const topPct = topPosition && total > 0 ? (topPosition.amount / total) * 100 : 0;

  const inputSt: React.CSSProperties = {
    background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "8px",
    padding: "8px 12px", fontSize: "13px", color: c.text,
    fontFamily: "'IBM Plex Mono',monospace", outline: "none",
    boxSizing: "border-box", width: "100%",
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: c.accent, marginBottom: "5px" }}>Portfolio Tracker</p>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: c.text, margin: "0 0 4px" }}>
          {lbl("포트폴리오 비중 트래커", "Portfolio Weight Tracker")}
        </h2>
        <p style={{ fontSize: "13px", color: c.textFaint, margin: 0 }}>
          {lbl("종목별 투자금액을 입력하면 비중을 시각화합니다", "Enter invested amounts to visualize your portfolio weights")}
        </p>
      </div>

      {/* 입력 폼 */}
      <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <div>
            <p style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: c.textFaint, marginBottom: "5px" }}>
              {lbl("종목코드", "Ticker")}
            </p>
            <input value={sym} onChange={e => setSym(e.target.value.toUpperCase())}
              placeholder="NVDA" onKeyDown={e => e.key === "Enter" && addOrUpdate()}
              style={{ ...inputSt, fontWeight: 700, letterSpacing: "0.05em" }} />
          </div>
          <div>
            <p style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: c.textFaint, marginBottom: "5px" }}>
              {lbl("종목명 (선택)", "Name (optional)")}
            </p>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder={lbl("NVIDIA Corp", "NVIDIA Corp")} onKeyDown={e => e.key === "Enter" && addOrUpdate()}
              style={inputSt} />
          </div>
          <div>
            <p style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: c.textFaint, marginBottom: "5px" }}>
              {lbl("투자금액 ($)", "Amount ($)")}
            </p>
            <div style={{ position: "relative" as const }}>
              <span style={{ position: "absolute" as const, left: "10px", top: "50%", transform: "translateY(-50%)", color: c.textDim, fontSize: "12px" }}>$</span>
              <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="0" onKeyDown={e => e.key === "Enter" && addOrUpdate()}
                style={{ ...inputSt, paddingLeft: "22px" }} />
            </div>
          </div>
        </div>
        <button onClick={addOrUpdate} style={{
          padding: "8px 18px", borderRadius: "8px", background: c.accent, color: c.bg,
          border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px", fontFamily: "inherit",
        }}>
          {editId ? lbl("수정 완료", "Update") : `+ ${lbl("추가", "Add")}`}
        </button>
        {editId && (
          <button onClick={() => { setEditId(null); setSym(""); setName(""); setAmount(""); }}
            style={{ marginLeft: "8px", padding: "8px 14px", borderRadius: "8px", background: "transparent", border: `1px solid ${c.line}`, color: c.textDim, cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>
            {lbl("취소", "Cancel")}
          </button>
        )}
      </div>

      {/* 빈 상태 */}
      {positions.length === 0 && (
        <div style={{ textAlign: "center" as const, padding: "48px 0", color: c.textFaint, fontSize: "13px" }}>
          <p style={{ fontSize: "28px", marginBottom: "8px" }}>📊</p>
          {lbl("종목을 추가하면 포트폴리오 비중이 표시됩니다", "Add positions to visualize your portfolio")}
        </div>
      )}

      {positions.length > 0 && (
        <>
          {/* 파이 + 요약 */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "20px", marginBottom: "16px", alignItems: "center" }}>
            <PieChart positions={positions} />
            <div>
              {/* 집중도 경고 */}
              {topPct > 40 && (
                <div style={{ background: c.hlYellowBg, border: `1px solid ${c.yellow}44`, borderRadius: "8px", padding: "10px 12px", marginBottom: "12px" }}>
                  <p style={{ fontSize: "12px", color: c.yellow, margin: 0 }}>
                    ⚠ {topPosition?.symbol} {lbl("비중이", "weight")} {topPct.toFixed(1)}%{lbl(" — 집중 투자 상태입니다", " — high concentration")}
                  </p>
                </div>
              )}
              {/* 요약 3개 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[
                  { label: lbl("총 포트폴리오", "Total Portfolio"), val: `$${total.toLocaleString("en-US", { maximumFractionDigits: 0 })}` },
                  { label: lbl("종목 수", "Positions"), val: `${positions.length}${lbl("개", "")}` },
                  { label: lbl("최대 비중", "Largest Weight"), val: topPosition ? `${topPosition.symbol} ${topPct.toFixed(1)}%` : "—" },
                  { label: lbl("평균 비중", "Avg Weight"), val: `${(100 / positions.length).toFixed(1)}%` },
                ].map(s => (
                  <div key={s.label} style={{ background: c.panel2, borderRadius: "8px", padding: "10px 12px" }}>
                    <p style={{ fontSize: "10px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: c.textFaint, marginBottom: "3px" }}>{s.label}</p>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: c.accentText, margin: 0, fontFamily: "'IBM Plex Mono',monospace" }}>{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 종목 목록 */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
            {[...positions].sort((a, b) => b.amount - a.amount).map(p => {
              const pct = total > 0 ? (p.amount / total) * 100 : 0;
              return (
                <div key={p.id} style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "10px", padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: p.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", fontWeight: 700, color: c.accentText, minWidth: "60px" }}>{p.symbol}</span>
                    <span style={{ fontSize: "12px", color: c.textDim, flex: 1 }}>{p.name}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", color: p.color, fontWeight: 600, minWidth: "48px", textAlign: "right" as const }}>{pct.toFixed(1)}%</span>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", color: c.accentText, minWidth: "80px", textAlign: "right" as const }}>${p.amount.toLocaleString()}</span>
                    <button onClick={() => startEdit(p)} style={{ background: "none", border: `1px solid ${c.line}`, borderRadius: "5px", padding: "3px 8px", color: c.textDim, cursor: "pointer", fontSize: "11px", fontFamily: "inherit" }}>
                      {lbl("수정", "Edit")}
                    </button>
                    <button onClick={() => remove(p.id)} style={{ background: "none", border: `1px solid ${c.red}55`, borderRadius: "5px", padding: "3px 8px", color: c.red, cursor: "pointer", fontSize: "11px", fontFamily: "inherit" }}>×</button>
                  </div>
                  {/* 비중 바 */}
                  <div style={{ marginTop: "8px", height: "4px", borderRadius: "2px", background: c.line }}>
                    <div style={{ height: "100%", borderRadius: "2px", width: `${pct}%`, background: p.color, transition: "width 0.4s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div style={{ height: "20px" }} />
    </div>
  );
}
