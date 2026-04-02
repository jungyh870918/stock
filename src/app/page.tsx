"use client";
import { useState } from "react";
import StrategyTab from "./components/StrategyTab";
import DashboardTab from "./components/DashboardTab";
import StockPanel from "./components/StockPanel";
import { useTheme, THEME } from "./context/ThemeContext";

type TabId = "strategy" | "dashboard" | "stock";
const TABS: { id: TabId; label: string }[] = [
  { id: "strategy", label: "📋 투자 전략 정리" },
  { id: "dashboard", label: "⚡ 투자 판단 도구" },
  { id: "stock", label: "📈 실시간 시세" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("strategy");
  const { theme, toggle } = useTheme();
  const c = THEME[theme];

  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.text, transition: "background 0.25s, color 0.25s" }}>
      <nav
        className="flex sticky top-0 z-50 overflow-x-auto"
        style={{ background: c.bg, borderBottom: `1px solid ${c.line}`, paddingLeft: "16px" }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "15px 18px", fontSize: "13px", fontWeight: 500,
              letterSpacing: "0.02em", whiteSpace: "nowrap", flexShrink: 0,
              color: isActive ? c.accent : c.textDim,
              borderTop: "none", borderLeft: "none", borderRight: "none",
              borderBottom: isActive ? `2px solid ${c.accent}` : "2px solid transparent",
              background: "transparent", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
            }}>{tab.label}</button>
          );
        })}
        {/* 테마 토글 */}
        <button onClick={toggle} style={{
          marginLeft: "auto", marginRight: "12px", padding: "6px 12px",
          borderRadius: "8px", border: `1px solid ${c.line}`,
          background: c.panel2, color: c.textDim, cursor: "pointer",
          fontSize: "13px", alignSelf: "center", flexShrink: 0, fontFamily: "inherit",
          transition: "all 0.2s",
        }}>
          {theme === "dark" ? "☀ 라이트" : "☾ 다크"}
        </button>
      </nav>
      <main style={{ padding: "24px 20px 80px" }}>
        {activeTab === "strategy" && <StrategyTab />}
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "stock" && <StockPanel />}
      </main>
    </div>
  );
}
