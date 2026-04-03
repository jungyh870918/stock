"use client";
import { useState } from "react";
import StrategyTab  from "./components/StrategyTab";
import DashboardTab from "./components/DashboardTab";
import StockPanel   from "./components/StockPanel";
import LearnTab     from "./components/LearnTab";
import JournalTab   from "./components/JournalTab";
import { useTheme, THEME } from "./context/ThemeContext";

type TabId = "strategy" | "dashboard" | "stock" | "learn" | "journal";

const TAB_LABELS = {
  ko: [
    { id: "strategy",  label: "📋 투자 전략 정리" },
    { id: "dashboard", label: "⚡ 투자 판단 도구" },
    { id: "stock",     label: "📈 실시간 시세" },
    { id: "learn",     label: "📚 추가 학습" },
    { id: "journal",   label: "📒 투자 일지" },
  ],
  en: [
    { id: "strategy",  label: "📋 Strategy" },
    { id: "dashboard", label: "⚡ Decision Tool" },
    { id: "stock",     label: "📈 Live Quotes" },
    { id: "learn",     label: "📚 Resources" },
    { id: "journal",   label: "📒 Journal" },
  ],
} as const;

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("strategy");
  const { theme, lang, toggleTheme, toggleLang } = useTheme();
  const c    = THEME[theme];
  const tabs = TAB_LABELS[lang];

  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.text, transition: "background 0.25s, color 0.25s" }}>
      <nav className="flex sticky top-0 z-50 overflow-x-auto"
        style={{ background: c.bg, borderBottom: `1px solid ${c.line}`, paddingLeft: "16px" }}>
        {tabs.map((tab) => {
          const isActive = activeTab === (tab.id as TabId);
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as TabId)} style={{
              padding: "15px 18px", fontSize: "13px", fontWeight: 500,
              letterSpacing: "0.02em", whiteSpace: "nowrap", flexShrink: 0,
              color: isActive ? c.accent : c.textDim,
              borderTop: "none", borderLeft: "none", borderRight: "none",
              borderBottom: isActive ? `2px solid ${c.accent}` : "2px solid transparent",
              background: "transparent", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
            }}>{tab.label}</button>
          );
        })}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", marginRight: "12px", flexShrink: 0 }}>
          <button onClick={toggleLang} style={{ padding: "5px 11px", borderRadius: "8px", border: `1px solid ${c.line}`, background: c.panel2, color: c.textDim, cursor: "pointer", fontSize: "12px", fontFamily: "'IBM Plex Mono',monospace", transition: "all 0.2s", letterSpacing: "0.05em" }}>
            {lang === "ko" ? "EN" : "한국어"}
          </button>
          <button onClick={toggleTheme} style={{ padding: "5px 11px", borderRadius: "8px", border: `1px solid ${c.line}`, background: c.panel2, color: c.textDim, cursor: "pointer", fontSize: "12px", fontFamily: "inherit", transition: "all 0.2s" }}>
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </nav>
      <main style={{ padding: "24px 20px 80px" }}>
        {activeTab === "strategy"  && <StrategyTab />}
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "stock"     && <StockPanel />}
        {activeTab === "learn"     && <LearnTab />}
        {activeTab === "journal"   && <JournalTab />}
      </main>
    </div>
  );
}
