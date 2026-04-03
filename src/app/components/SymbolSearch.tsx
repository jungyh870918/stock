"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme, THEME } from "@/app/context/ThemeContext";

interface SearchResult {
  symbol: string;
  description: string;
  type: string;
  displaySymbol: string;
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSelect: (symbol: string) => void;
  placeholder?: string;
  inputStyle?: React.CSSProperties;
}

export default function SymbolSearch({ value, onChange, onSelect, placeholder, inputStyle }: Props) {
  const { theme } = useTheme();
  const c = THEME[theme];
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 1) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.result ?? []);
      setOpen((data.result ?? []).length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (val: string) => {
    onChange(val.toUpperCase());
    setActiveIdx(-1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(val), 280);
  };

  const handleSelect = (sym: string) => {
    onChange(sym);
    setOpen(false);
    setResults([]);
    onSelect(sym);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) {
      if (e.key === "Enter") onSelect(value);
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) handleSelect(results[activeIdx].symbol);
      else { setOpen(false); onSelect(value); }
    }
    if (e.key === "Escape") { setOpen(false); }
  };

  const base: React.CSSProperties = {
    width: "100%", background: c.panel2,
    border: `1px solid ${open ? c.accent : c.line}`,
    borderRadius: open ? "9px 9px 0 0" : "9px",
    padding: "10px 14px", color: c.text, fontSize: "13px",
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
    transition: "border-color 0.15s",
    ...inputStyle,
  };

  return (
    <div ref={containerRef} style={{ position: "relative", flex: 1 }}>
      <input
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={placeholder ?? "종목 코드 또는 회사명"}
        style={base}
        autoComplete="off"
        spellCheck={false}
      />

      {/* 로딩 스피너 */}
      {loading && (
        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: c.accent }}>⟳</span>
      )}

      {/* 드롭다운 */}
      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
          background: c.panel, border: `1px solid ${c.accent}`,
          borderTop: `1px solid ${c.line2}`,
          borderRadius: "0 0 10px 10px",
          boxShadow: theme === "dark" ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}>
          {results.map((r, i) => (
            <div key={r.symbol}
              onMouseDown={e => { e.preventDefault(); handleSelect(r.symbol); }}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 14px", cursor: "pointer",
                background: i === activeIdx
                  ? (theme === "dark" ? "rgba(143,179,255,0.1)" : "rgba(36,97,204,0.08)")
                  : "transparent",
                borderBottom: i < results.length - 1 ? `1px solid ${c.line}` : "none",
                transition: "background 0.1s",
              }}>
              {/* 종목 코드 */}
              <span style={{
                fontFamily: "'IBM Plex Mono',monospace",
                fontSize: "13px", fontWeight: 700, color: c.accent,
                minWidth: "64px",
              }}>{r.symbol}</span>
              {/* 회사명 */}
              <span style={{
                fontSize: "12px", color: c.textSub,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                flex: 1,
              }}>{r.description}</span>
              {/* 엔터 힌트 */}
              {i === activeIdx && (
                <span style={{ fontSize: "10px", color: c.textFaint, flexShrink: 0 }}>↵</span>
              )}
            </div>
          ))}
          <div style={{ padding: "6px 14px", borderTop: `1px solid ${c.line}`, background: c.panel2 }}>
            <span style={{ fontSize: "10px", color: c.textFaint, fontFamily: "'IBM Plex Mono',monospace" }}>
              ↑↓ 탐색  ↵ 선택  Esc 닫기
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
