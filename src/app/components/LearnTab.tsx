"use client";

import { useState } from "react";
import { useTheme, THEME, type Lang } from "@/app/context/ThemeContext";

function useC() {
  const { theme, lang } = useTheme();
  return { c: THEME[theme], theme, lang };
}

/* ── i18n 헬퍼 ── */
type T2<T> = { ko: T; en: T };
function t<T>(obj: T2<T>, lang: Lang): T { return obj[lang]; }

/* ── 외부 링크 ── */
function A({ href, children }: { href: string; children: React.ReactNode }) {
  const { c } = useC();
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ color: c.accent, textDecoration: "none", borderBottom: `1px solid ${c.accent}44`, paddingBottom: "1px" }}>
      {children}
    </a>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  const { c } = useC();
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
        <span style={{ fontSize: "20px" }}>{icon}</span>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: c.text, margin: 0 }}>{title}</h2>
      </div>
      {subtitle && <p style={{ fontSize: "13px", color: c.textFaint, margin: "0 0 0 30px" }}>{subtitle}</p>}
    </div>
  );
}

function BookCard({ rank, title, author, reason, link }: {
  rank: number; title: string; author: string; reason: string; link?: string;
}) {
  const { c, theme } = useC();
  return (
    <div style={{
      display: "flex", gap: "14px", alignItems: "flex-start",
      background: c.panel, border: `1px solid ${c.line}`,
      borderRadius: "14px", padding: "16px 18px", marginBottom: "10px",
    }}>
      <div style={{
        width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", fontWeight: 700,
        background: theme === "dark" ? "rgba(143,179,255,0.12)" : "rgba(36,97,204,0.1)",
        color: c.accent,
      }}>
        {String(rank).padStart(2, "0")}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "14px", fontWeight: 700, color: c.accentText, margin: "0 0 2px", lineHeight: 1.4 }}>
          {link ? <A href={link}>{title}</A> : title}
        </p>
        <p style={{ fontSize: "12px", color: c.textFaint, margin: "0 0 8px", fontStyle: "italic" }}>{author}</p>
        <p style={{ fontSize: "13px", color: c.textSub, margin: 0, lineHeight: 1.7 }}>{reason}</p>
      </div>
    </div>
  );
}

function YoutubeGroup({ icon, title, keywords }: { icon: string; title: string; keywords: string[] }) {
  const { c, theme } = useC();
  const query = (kw: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(kw)}`;
  return (
    <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "16px 18px", marginBottom: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "15px" }}>{icon}</span>
        <p style={{ fontSize: "13px", fontWeight: 700, color: c.accentText, margin: 0 }}>{title}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
        {keywords.map((kw) => (
          <a key={kw} href={query(kw)} target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px",
              borderRadius: "8px", textDecoration: "none",
              background: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
              border: `1px solid ${c.line}`,
            }}>
            <span style={{ fontSize: "12px", color: c.red, flexShrink: 0 }}>▶</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: c.textSub, lineHeight: 1.4 }}>{kw}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ArticleCard({ title, source, url, desc }: { title: string; source: string; url: string; desc: string }) {
  const { c } = useC();
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{ display: "block", textDecoration: "none", background: c.panel, border: `1px solid ${c.line}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "6px" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: c.accentText, margin: 0, lineHeight: 1.4 }}>{title}</p>
        <span style={{ fontSize: "11px", color: c.textFaint, flexShrink: 0, marginTop: "2px" }}>{source}</span>
      </div>
      <p style={{ fontSize: "12px", color: c.textSub, margin: 0, lineHeight: 1.6 }}>{desc}</p>
    </a>
  );
}

function SearchKeywords({ keywords, engine }: { keywords: string[]; engine: "google" | "naver" }) {
  const { c, theme } = useC();
  const url = (kw: string) =>
    engine === "google"
      ? `https://www.google.com/search?q=${encodeURIComponent(kw)}`
      : `https://search.naver.com/search.naver?query=${encodeURIComponent(kw)}`;
  const icon  = engine === "google" ? "🔍" : "🔎";
  const label = engine === "google" ? "Google" : "Naver";
  const engColor = engine === "google"
    ? (theme === "dark" ? "#8fb3ff" : "#2461cc")
    : (theme === "dark" ? "#6ce88a" : "#1a7a40");
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
      {keywords.map((kw) => (
        <a key={kw} href={url(kw)} target="_blank" rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px",
            borderRadius: "8px", textDecoration: "none",
            background: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${c.line}`,
          }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: engColor, flexShrink: 0, minWidth: "44px" }}>
            {icon} {label}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: c.textSub, lineHeight: 1.4 }}>{kw}</span>
        </a>
      ))}
    </div>
  );
}

function SubTabs({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  const { c } = useC();
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "24px", flexWrap: "wrap" as const }}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button key={tab.id} onClick={() => onChange(tab.id)} style={{
            padding: "7px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 500,
            cursor: "pointer", border: `1px solid ${isActive ? c.accent : c.line}`,
            background: isActive ? (c.accent + "22") : "transparent",
            color: isActive ? c.accent : c.textDim, fontFamily: "inherit", transition: "all 0.15s",
          }}>{tab.label}</button>
        );
      })}
    </div>
  );
}

function Rule() {
  const { c } = useC();
  return <hr style={{ border: "none", borderTop: `1px solid ${c.line}`, margin: "32px 0" }} />;
}

function Quote({ children, from }: { children: React.ReactNode; from: string }) {
  const { c } = useC();
  return (
    <div style={{ margin: "16px 0", padding: "16px 20px", borderLeft: `4px solid ${c.accent}`, background: c.panel2, borderRadius: "0 10px 10px 0" }}>
      <p style={{ fontSize: "14px", fontWeight: 500, lineHeight: 1.75, color: c.accentText, margin: "0 0 6px" }}>"{children}"</p>
      <p style={{ fontSize: "11px", color: c.textFaint, margin: 0 }}>— {from}</p>
    </div>
  );
}

/* ════════════════════════════════════════
   i18n 데이터
════════════════════════════════════════ */

const UI = {
  header: {
    eyebrow: { ko: "Additional Resources", en: "Additional Resources" },
    title:   { ko: "추가 학습 자료",         en: "Learning Resources" },
    desc:    { ko: "이 투자 전략을 더 깊게 이해하고 싶다면 — 도서, 유튜브, 특집 기사, 공식 리포트까지",
               en: "Go deeper — books, YouTube keywords, feature articles, and official reports." },
  },
  subTabs: {
    ko: [
      { id: "books",    label: "📚 추천 도서" },
      { id: "youtube",  label: "🎥 유튜브" },
      { id: "articles", label: "📰 심화 기사" },
      { id: "reports",  label: "📊 보고서 & 리포트" },
    ],
    en: [
      { id: "books",    label: "📚 Books" },
      { id: "youtube",  label: "🎥 YouTube" },
      { id: "articles", label: "📰 Articles" },
      { id: "reports",  label: "📊 Reports" },
    ],
  },
};

const BOOKS = [
  {
    rank: 1, title: "One Up on Wall Street", author: "Peter Lynch",
    reason: { ko: "'아는 것에 투자하라.' 일상에서 기술 파괴와 산업 변화를 먼저 발견하는 개인 투자자의 강점을 설명한다. 텐배거(10배 종목)의 개념적 기원.", en: "'Invest in what you know.' Explains the retail investor's edge — spotting technological disruption before the market does. The conceptual origin of the 'tenbagger.'" },
    link: "https://www.amazon.com/One-Up-Wall-Street-Already/dp/0743200403",
  },
  {
    rank: 2, title: "The Innovator's Dilemma", author: "Clayton M. Christensen",
    reason: { ko: "왜 잘 나가던 기업들이 파괴적 기술에 의해 무너지는가. AI가 기존 산업을 어떻게 해체할지, NVIDIA 같은 기업이 '파괴자' 위치에 서는 이유의 이론적 프레임.", en: "Why successful companies fail in the face of disruptive technology. The theoretical framework for understanding how AI dismantles industries and why companies like NVIDIA occupy the 'disruptor' position." },
    link: "https://www.amazon.com/Innovators-Dilemma-Technologies-Management-Innovation/dp/1633691780",
  },
  {
    rank: 3, title: "Zero to One", author: "Peter Thiel",
    reason: { ko: "독점 기업이 왜 좋은 투자처인지를 설명한다. NVIDIA의 CUDA 생태계, 플랫폼 독점의 의미. '경쟁은 패자들을 위한 것이다'라는 통찰.", en: "Explains why monopoly businesses are the best investments. Directly applicable to understanding NVIDIA's CUDA moat and platform lock-in. 'Competition is for losers.'" },
    link: "https://www.amazon.com/Zero-One-Notes-Startups-Future/dp/0804139296",
  },
  {
    rank: 4, title: "Common Stocks and Uncommon Profits", author: "Philip A. Fisher",
    reason: { ko: "워런 버핏이 영향을 받았다고 밝힌 책. '스커틀버트 기법'과 15가지 체크리스트. 이 전략에서 말하는 기업 기술력 직접 검증의 방법론적 기원.", en: "Buffett's acknowledged influence. The 'Scuttlebutt Method' and 15-point checklist — the methodological origin of the direct technology verification approach in this strategy." },
    link: "https://www.amazon.com/Common-Stocks-Uncommon-Profits-Writings/dp/0471445509",
  },
  {
    rank: 5, title: "The Most Important Thing", author: "Howard Marks",
    reason: { ko: "리스크를 재정의한다. '리스크는 손실 가능성이 아니라, 우리가 그것을 인식하지 못하는 것'이라는 통찰. 출구 규칙의 사상적 근거.", en: "Redefines risk: 'Risk is not the possibility of loss — it's the failure to recognize it.' The philosophical foundation for the exit rule in this strategy." },
    link: "https://www.amazon.com/Most-Important-Thing-Thoughtful-Publishing/dp/0231153686",
  },
  {
    rank: 6, title: "The Psychology of Money", author: "Morgan Housel",
    reason: { ko: "시간이 복리보다 강력하다는 논리. '충분히 오래 버티는 것'이 투자에서 가장 중요한 능력임을 설득력 있게 보여준다. 계층형 분할 전략과 맞닿아 있다.", en: "Time is more powerful than compound interest. Shows convincingly that 'staying in long enough' is the most important skill in investing — directly connected to the layered buying strategy." },
    link: "https://www.amazon.com/Psychology-Money-Timeless-lessons-happiness/dp/0857197681",
  },
  {
    rank: 7, title: "Thinking, Fast and Slow", author: "Daniel Kahneman",
    reason: { ko: "왜 인간이 패닉 구간에서 팔고 고점에서 사는지를 심리학적으로 설명한다. 감정이 아니라 구간이 트리거여야 하는 이유의 과학적 근거.", en: "Explains psychologically why humans sell at the bottom and buy at the top. The scientific basis for why a price zone — not emotions — must be the trigger." },
    link: "https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374533555",
  },
  {
    rank: 8, title: "The Alchemy of Finance", author: "George Soros",
    reason: { ko: "'재귀 이론' — 시장의 기대가 실제 현실을 만들어낸다. AI 투자 붐이 실제 AI 인프라 투자를 촉진하는 구조를 이해하는 데 도움.", en: "'Reflexivity' — market expectations create reality. Helps understand how the AI investment boom actively accelerates real AI infrastructure spending." },
    link: "https://www.amazon.com/Alchemy-Finance-George-Soros/dp/0471445495",
  },
];

const YOUTUBE_GROUPS = {
  ko: [
    { icon: "🤖", title: "AI / NVIDIA / 산업 구조", keywords: ["Nvidia AI infrastructure explained Jensen Huang keynote", "AI data center growth Nvidia analysis", "why Nvidia is dominating AI chips", "AI infrastructure investment thesis explained", "Jensen Huang GTC 2025 keynote full"] },
    { icon: "📈", title: "성장주 / 장기 투자 / 뉴스 무시", keywords: ["growth investing long term thesis Peter Lynch", "why ignoring news is important in investing", "long term investing strategy explained Howard Marks", "how to find multi bagger stocks fundamentals", "Peter Lynch One Up on Wall Street summary"] },
    { icon: "💥", title: "기술 파괴 / 산업 변화", keywords: ["disruptive innovation explained Clayton Christensen", "how technology changes industries investing", "why dominant companies win markets monopoly tech", "innovators dilemma explained 2024", "Zero to One Peter Thiel monopoly explained"] },
    { icon: "🚢", title: "조선 / LNG / K-조선 사이클", keywords: ["한국 조선업 LNG 수주 사이클 분석", "Korea shipbuilding industry LNG cycle investment", "HD현대중공업 삼성중공업 한화오션 조선주 분석", "LNG carrier shipping market outlook 2025"] },
    { icon: "📊", title: "계층형 매수 / 심리 / 자금 배분", keywords: ["dollar cost averaging strategy explained", "position sizing portfolio management investing", "how to buy stocks during market crash strategy", "psychology of investing panic selling explained", "Howard Marks risk management investor memo"] },
  ],
  en: [
    { icon: "🤖", title: "AI / NVIDIA / Industry Structure", keywords: ["Nvidia AI infrastructure explained Jensen Huang keynote", "AI data center growth Nvidia analysis 2025", "why Nvidia is dominating AI chips explained", "AI infrastructure investment thesis deep dive", "Jensen Huang GTC 2025 keynote full"] },
    { icon: "📈", title: "Growth Stocks / Long-Term Investing", keywords: ["growth investing long term thesis Peter Lynch", "why ignoring news is important in investing", "long term investing strategy explained Howard Marks", "how to find multi bagger stocks fundamentals", "Peter Lynch One Up on Wall Street summary"] },
    { icon: "💥", title: "Disruptive Technology / Industry Shifts", keywords: ["disruptive innovation explained Clayton Christensen", "how technology changes industries investing", "why dominant companies win markets monopoly tech", "innovators dilemma explained 2024 2025", "Zero to One Peter Thiel monopoly explained"] },
    { icon: "🚢", title: "Shipbuilding / LNG / Korea Cycle", keywords: ["Korea shipbuilding industry LNG supercycle investment", "LNG carrier shipping market outlook 2025 2026", "HD Hyundai Heavy Industries Samsung Heavy stock analysis", "Korean shipbuilders competitive advantage LNG vessels"] },
    { icon: "📊", title: "Position Sizing / Psychology / Capital Allocation", keywords: ["dollar cost averaging strategy explained", "position sizing portfolio management investing", "how to buy stocks during market crash strategy", "psychology of investing panic selling explained", "Howard Marks risk management investor memo"] },
  ],
};

const ARTICLES = {
  nvidia: [
    { title: "챗GPT 출현 3년, 엔비디아 주가 10배 증가", titleEn: "3 Years After ChatGPT: Nvidia Stock Up 10x", source: "전자신문", url: "https://www.etnews.com/20251201000349", desc: { ko: "ChatGPT 등장 이후 NVIDIA 주가가 10배 상승하기까지의 AI 수요 구조적 변화를 수치로 정리.", en: "Data-backed analysis of how structural AI demand drove NVIDIA's 10x stock gain after ChatGPT's launch." } },
    { title: "[엔비디아 성장 비밀] GPU는 어떻게 AI의 심장 됐나", titleEn: "NVIDIA's Growth Secret: How GPU Became the Heart of AI", source: "더스쿠프", url: "https://www.thescoop.co.kr/news/articleView.html?idxno=58106", desc: { ko: "NVIDIA가 게임 GPU에서 AI 인프라 독점 기업으로 전환한 기술적 역사와 CUDA 생태계의 해자.", en: "The technical history of NVIDIA's transformation from gaming GPUs to AI infrastructure monopoly — and the CUDA moat." } },
    { title: "NVIDIA AI Accelerator Market Share 2024–2026", titleEn: "NVIDIA AI Accelerator Market Share 2024–2026", source: "Silicon Analysts", url: "https://siliconanalysts.com/analysis/nvidia-ai-accelerator-market-share-2024-2026", desc: { ko: "H100 제조원가 $3,320 vs 판매가 $28,000, 2026년 75% 점유율 유지 전망 등 정량 데이터 집약.", en: "H100 manufacturing cost $3,320 vs. selling price $28,000. Projects 75% revenue share through 2026. Dense quantitative analysis." } },
    { title: "Nvidia CEO Predicts AI Spending Will Increase 300%+", titleEn: "Nvidia CEO Predicts AI Spending Will Increase 300%+ in 3 Years", source: "io-fund", url: "https://io-fund.com/semiconductors/data-center/nvidia-ceo-predicts-ai-spending-will-increase-300-percent-in-3-years", desc: { ko: "젠슨 황의 데이터센터 지출 2028년 1조 달러 전망. Blackwell 칩 수요가 Hopper 피크를 3배 초과.", en: "Jensen Huang's projection: $1T data center spend by 2028. Blackwell orders already 3x Hopper's peak — with concrete figures." } },
  ],
  shipbuilding: [
    { title: "조선주 슈퍼사이클 바람 분다", titleEn: "Shipbuilding Supercycle Begins", source: "머니투데이", url: "https://www.mt.co.kr/stock/2023/05/25/2023052422474498368", desc: { ko: "LNG 운반선 발주 사이클이 돌아오던 2023년 시점의 분석. 한국이 전체 LNG선 주문의 70% 독점.", en: "2023 analysis as the LNG carrier order cycle turned. Korea dominates 70% of global LNG vessel orders." } },
    { title: "K조선 빅3, 영업이익 6조원 시대", titleEn: "Korea's Shipbuilding Big 3 Hit ₩6T Operating Profit", source: "더퍼블릭", url: "https://www.thepublic.kr/news/articleView.html?idxno=292979", desc: { ko: "2025년 HD현대중공업·삼성중공업·한화오션 합산 영업이익 6조원 돌파. 고선가 LNG 운반선 인도 본격화 결과.", en: "2025 combined operating profit of Korea's Big 3 exceeds ₩6T — result of high-margin LNG carrier deliveries ramping up." } },
    { title: "K-조선, LNG운반선 수주 호황 이어지나", titleEn: "Will Korea's LNG Carrier Order Boom Continue?", source: "뉴스톱", url: "https://www.newstof.com/news/articleView.html?idxno=27451", desc: { ko: "중국에서 한국으로의 수주 이동 구조, 미국의 중국산 선박 제재 반사이익 등 현재진행형 트렌드.", en: "The structural shift of orders from China to Korea, and the windfall from US sanctions on Chinese-built vessels." } },
  ],
  etf: [
    { title: "TQQQ 장투, 위험 최소화하려면?", titleEn: "TQQQ Long-Term: How to Minimize the Risk?", source: "블로터 넘버스", url: "https://v.daum.net/v/GmoJ0bC2T7", desc: { ko: "코로나 저점 매수 시 5.6배 수익 vs 고점 매수 후 장기 보유의 함정. 분할 매수 전략이 유효한 이유를 데이터로 증명.", en: "5.6x return for COVID-bottom buyers vs the trap of holding from the peak. Data-backed case for staged buying over lump-sum." } },
    { title: "TQQQ 장기투자 실투자 후기 (20개월)", titleEn: "TQQQ 20-Month Real Investment Diary", source: "마일모아", url: "https://www.milemoa.com/bbs/board/10149033", desc: { ko: "-76% MDD를 실제로 경험한 투자자의 생생한 기록. 계획 없이는 레버리지에 접근해선 안 된다는 것을 몸으로 증명.", en: "A real investor's account of surviving -76% MDD. The lived proof that leveraged ETFs require a written plan before entry." } },
    { title: "나스닥 투자 후 보유땐 QQQ가 TQQQ보다 적합", titleEn: "For Long-Term Nasdaq Exposure, QQQ Beats TQQQ", source: "한국경제", url: "https://www.hankyung.com/article/2024040362751", desc: { ko: "레버리지 ETF의 구조적 위험(변동성 손실, 트래킹 에러)과 분할 매수 전략의 우위를 비교 분석.", en: "Compares the structural dangers of leveraged ETFs (volatility decay, tracking error) against the case for staged buying." } },
    { title: "TQQQ 실전 분할 매수 후기", titleEn: "TQQQ Staged Buying — Personal Account", source: "브런치", url: "https://brunch.co.kr/@djlee118/4", desc: { ko: "4차 산업혁명에 대한 확신을 갖고 하락할 때마다 분할 매수한 개인 투자자의 전략과 심리 기록.", en: "A personal investor's strategy and mindset record — buying every dip with conviction in the 4th Industrial Revolution thesis." } },
  ],
};

const SECTION_LABELS = {
  books: {
    core:     { ko: "핵심 5권",           en: "Core 5 Books" },
    coreSub:  { ko: "이 투자 전략의 사상적 토대가 되는 책들",    en: "The philosophical foundation of this investment strategy" },
    extra:    { ko: "같이 읽으면 좋은 책들", en: "Further Reading" },
    extraSub: { ko: "산업 분석과 사이클 이해를 위한 심화 독서",  en: "For deeper understanding of industry analysis and market cycles" },
  },
  youtube: {
    title:  { ko: "유튜브 검색 키워드",          en: "YouTube Search Keywords" },
    sub:    { ko: "각 키워드를 클릭하면 유튜브 검색 결과로 바로 이동합니다", en: "Click any keyword to jump directly to YouTube search results" },
    tip:    { ko: "💡 유튜브 활용 팁",             en: "💡 YouTube Tips" },
    tipBody:{ ko: "영어 키워드로 검색하면 훨씬 양질의 분석 영상이 많습니다. 자막 설정에서 자동 번역(한국어)을 활성화하면 충분히 이해 가능합니다. Jensen Huang의 GTC 키노트는 NVIDIA 기술 로드맵을 직접 보여주는 최고의 1차 자료입니다.", en: "English-language searches return significantly higher-quality analysis videos. Jensen Huang's GTC keynotes are the best primary source for NVIDIA's technology roadmap." },
  },
  articles: {
    title: { ko: "심화 특집 기사",          en: "Feature Articles" },
    sub:   { ko: "각 주제별로 가장 깊은 분석을 담은 기사들", en: "The deepest analysis for each topic" },
    nv:    { ko: "▸ NVIDIA & AI 산업 구조", en: "▸ NVIDIA & AI Industry Structure" },
    ship:  { ko: "▸ K-조선 & LNG 사이클",  en: "▸ K-Shipbuilding & LNG Cycle" },
    etf:   { ko: "▸ 레버리지 ETF & TQQQ 전략", en: "▸ Leveraged ETF & TQQQ Strategy" },
  },
  reports: {
    title:   { ko: "검색 키워드로 찾는 보고서",            en: "Reports via Search" },
    sub:     { ko: "클릭하면 Google 또는 Naver 검색 결과로 바로 이동합니다", en: "Click to jump directly to Google or Naver search results" },
    quote:   { ko: "1차 자료를 읽어라. 뉴스는 1차 자료를 요약·해석한 2차 자료다. 직접 보고서를 읽는 투자자와 뉴스만 읽는 투자자 사이에는 시간 차이가 있다.", en: "Read primary sources. News is a secondary interpretation of primary data. There is a time gap between investors who read reports directly and those who only read the news." },
    quoteBy: { ko: "투자 조언", en: "Investment Principle" },
    ai:      { ko: "🤖 AI 인프라 & 시장 전망 리포트",   en: "🤖 AI Infrastructure & Market Reports" },
    ship:    { ko: "🚢 조선·LNG 산업 리포트",           en: "🚢 Shipbuilding & LNG Industry Reports" },
    growth:  { ko: "📈 성장주 & 기술주 투자 리포트",     en: "📈 Growth & Tech Stock Investment Reports" },
    psych:   { ko: "🧠 심리 & 리스크 관리",             en: "🧠 Psychology & Risk Management" },
    primary: { ko: "📌 1차 자료를 직접 보는 방법",       en: "📌 Accessing Primary Sources Directly" },
  },
};

const PRIMARY_LINKS = [
  { label: { ko: "NVIDIA 투자자 관계 (실적·가이던스 원문)", en: "NVIDIA Investor Relations (earnings & guidance)" }, url: "https://investor.nvidia.com/", tag: "investor.nvidia.com" },
  { label: { ko: "NVIDIA GTC 키노트 전체 영상",              en: "NVIDIA GTC Keynote (full videos)" }, url: "https://www.nvidia.com/en-us/gtc/", tag: "nvidia.com/gtc" },
  { label: { ko: "McKinsey AI 리포트 아카이브",               en: "McKinsey State of AI Report Archive" }, url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai", tag: "mckinsey.com" },
  { label: { ko: "Sequoia Capital AI 투자 관점",              en: "Sequoia Capital AI Investment Perspectives" }, url: "https://www.sequoiacap.com/article/ai-powered-products-perspectives/", tag: "sequoiacap.com" },
  { label: { ko: "Howard Marks 투자 메모 아카이브",            en: "Howard Marks Investment Memo Archive" }, url: "https://www.oaktreecapital.com/insights/memos", tag: "oaktreecapital.com" },
  { label: { ko: "한국 증권사 무료 리서치 (네이버)",            en: "Korean Broker Research Reports (Naver)" }, url: "https://finance.naver.com/research/", tag: "finance.naver.com" },
];

/* ════════════════════════════════════════
   메인 컴포넌트
════════════════════════════════════════ */
export default function LearnTab() {
  const { c, lang } = useC();
  const [sub, setSub] = useState("books");
  const L = (obj: T2<string>) => t(obj, lang);
  const subTabs = t(UI.subTabs, lang);

  return (
    <article style={{ maxWidth: "720px", margin: "0 auto" }}>
      <div style={{ marginBottom: "28px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: c.accent, marginBottom: "6px" }}>
          {L(UI.header.eyebrow)}
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: c.text, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          {L(UI.header.title)}
        </h1>
        <p style={{ fontSize: "13px", color: c.textFaint, margin: 0, lineHeight: 1.6 }}>
          {L(UI.header.desc)}
        </p>
      </div>

      <SubTabs tabs={subTabs as { id: string; label: string }[]} active={sub} onChange={setSub} />

      {/* ── 도서 ── */}
      {sub === "books" && (
        <div>
          <SectionTitle icon="📚" title={L(SECTION_LABELS.books.core)} subtitle={L(SECTION_LABELS.books.coreSub)} />
          {BOOKS.slice(0, 5).map((b) => (
            <BookCard key={b.rank} rank={b.rank} title={b.title} author={b.author} reason={L(b.reason)} link={b.link} />
          ))}
          <Rule />
          <SectionTitle icon="📖" title={L(SECTION_LABELS.books.extra)} subtitle={L(SECTION_LABELS.books.extraSub)} />
          {BOOKS.slice(5).map((b) => (
            <BookCard key={b.rank} rank={b.rank} title={b.title} author={b.author} reason={L(b.reason)} link={b.link} />
          ))}
        </div>
      )}

      {/* ── 유튜브 ── */}
      {sub === "youtube" && (
        <div>
          <SectionTitle icon="🎥" title={L(SECTION_LABELS.youtube.title)} subtitle={L(SECTION_LABELS.youtube.sub)} />
          {t(YOUTUBE_GROUPS, lang).map((g) => (
            <YoutubeGroup key={g.title} icon={g.icon} title={g.title} keywords={g.keywords} />
          ))}
          <Rule />
          <div style={{ background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "12px", padding: "16px 18px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: c.accent, marginBottom: "8px" }}>{L(SECTION_LABELS.youtube.tip)}</p>
            <p style={{ fontSize: "13px", color: c.textSub, lineHeight: 1.7, margin: 0 }}>{L(SECTION_LABELS.youtube.tipBody)}</p>
          </div>
        </div>
      )}

      {/* ── 기사 ── */}
      {sub === "articles" && (
        <div>
          <SectionTitle icon="📰" title={L(SECTION_LABELS.articles.title)} subtitle={L(SECTION_LABELS.articles.sub)} />

          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: c.accent, marginBottom: "10px" }}>
              {L(SECTION_LABELS.articles.nv)}
            </p>
            {ARTICLES.nvidia.map((a) => <ArticleCard key={a.url} title={lang === "ko" ? a.title : a.titleEn} source={a.source} url={a.url} desc={L(a.desc)} />)}
          </div>
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: c.green, marginBottom: "10px" }}>
              {L(SECTION_LABELS.articles.ship)}
            </p>
            {ARTICLES.shipbuilding.map((a) => <ArticleCard key={a.url} title={lang === "ko" ? a.title : a.titleEn} source={a.source} url={a.url} desc={L(a.desc)} />)}
          </div>
          <div>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: c.yellow, marginBottom: "10px" }}>
              {L(SECTION_LABELS.articles.etf)}
            </p>
            {ARTICLES.etf.map((a) => <ArticleCard key={a.url} title={lang === "ko" ? a.title : a.titleEn} source={a.source} url={a.url} desc={L(a.desc)} />)}
          </div>
        </div>
      )}

      {/* ── 보고서 ── */}
      {sub === "reports" && (
        <div>
          <SectionTitle icon="📊" title={L(SECTION_LABELS.reports.title)} subtitle={L(SECTION_LABELS.reports.sub)} />
          <Quote from={L(SECTION_LABELS.reports.quoteBy)}>{L(SECTION_LABELS.reports.quote)}</Quote>

          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: c.accentText, marginBottom: "10px" }}>{L(SECTION_LABELS.reports.ai)}</p>
            <SearchKeywords engine="google" keywords={["AI infrastructure investment thesis deep dive 2025", "McKinsey artificial intelligence report 2024 2025", "Goldman Sachs AI data center demand report", "Sequoia AI investment thesis 2024", "Nvidia business model analysis long term investment"]} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: c.accentText, marginBottom: "10px" }}>{L(SECTION_LABELS.reports.ship)}</p>
            <SearchKeywords engine="naver" keywords={["한국 조선업 LNG 수주 사이클 증권사 리포트 2025", "HD한국조선해양 삼성중공업 한화오션 애널리스트 리포트", "조선주 투자 전략 2026 리서치", "LNG 운반선 발주 전망 클락슨 리서치"]} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: c.accentText, marginBottom: "10px" }}>{L(SECTION_LABELS.reports.growth)}</p>
            <SearchKeywords engine="google" keywords={["disruptive technology investing framework report", "how to identify platform monopoly business model", "growth stock valuation framework 2024", "Peter Lynch GARP investing methodology explained"]} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: c.accentText, marginBottom: "10px" }}>{L(SECTION_LABELS.reports.psych)}</p>
            <SearchKeywords engine="google" keywords={["Howard Marks memo risk and uncertainty investing", "behavioral finance investing mistakes research", "position sizing Kelly criterion investing", "market cycle investing framework Howard Marks"]} />
          </div>

          <Rule />
          <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "18px 20px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: c.accent, marginBottom: "12px" }}>{L(SECTION_LABELS.reports.primary)}</p>
            {PRIMARY_LINKS.map((item) => (
              <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "9px 0", borderBottom: `1px solid ${c.line}`, textDecoration: "none" }}>
                <span style={{ fontSize: "13px", color: c.textSub }}>{L(item.label)}</span>
                <span style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono',monospace", color: c.accent, flexShrink: 0 }}>{item.tag} →</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: "40px" }} />
    </article>
  );
}
