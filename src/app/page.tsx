"use client";

import { useState } from "react";
import StrategyTab from "./components/StrategyTab";
import DashboardTab from "./components/DashboardTab";

type TabId = "strategy" | "dashboard";

const TABS: { id: TabId; label: string }[] = [
  { id: "strategy", label: "📋 투자 전략 정리" },
  { id: "dashboard", label: "⚡ 투자 판단 도구" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("strategy");

  return (
    <div className="min-h-screen" style={{ background: "#0c0f1a", color: "#e8eaf6" }}>
      <nav
        className="flex sticky top-0 z-50 px-5"
        style={{ background: "#0c0f1a", borderBottom: "1px solid #1e2540" }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "16px 22px",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
                color: isActive ? "#8fb3ff" : "#5a6490",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: isActive ? "2px solid #8fb3ff" : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
      <main className="px-5 pt-6 pb-20">
        {activeTab === "strategy" ? <StrategyTab /> : <DashboardTab />}
      </main>
    </div>
  );
}
