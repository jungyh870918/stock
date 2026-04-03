"use client";

import { useState } from "react";
import { useTheme, THEME } from "@/app/context/ThemeContext";
import type { Lang } from "@/app/context/ThemeContext";

function useC() {
  const { theme, lang } = useTheme();
  return { c: THEME[theme], theme, lang };
}
const Lf = (ko: string, en: string, lang: Lang) => lang === "ko" ? ko : en;

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  const { c } = useC();
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ color: c.accent, textDecoration: "none", borderBottom: `1px solid ${c.accent}55`, paddingBottom: "1px", fontSize: "inherit" }}>
      {children}
    </a>
  );
}
function Rule() {
  const { c } = useC();
  return <hr style={{ border: "none", borderTop: `1px solid ${c.line}`, margin: "40px 0" }} />;
}
function Pullquote({ children }: { children: React.ReactNode }) {
  const { c } = useC();
  return (
    <blockquote style={{ margin: "28px 0", padding: "20px 24px", borderLeft: `4px solid ${c.accent}`, background: c.panel2, borderRadius: "0 12px 12px 0" }}>
      <p style={{ fontSize: "16px", fontWeight: 500, lineHeight: 1.75, color: c.accentText, margin: 0 }}>{children}</p>
    </blockquote>
  );
}
function AlertBox({ variant, children }: { variant: "info"|"warn"|"danger"|"success"; children: React.ReactNode }) {
  const { c } = useC();
  const s = { info: { bg: c.hlBlueBg, border: c.accent, color: c.accentText }, warn: { bg: c.hlYellowBg, border: c.yellow, color: c.yellowLight }, danger: { bg: c.hlRedBg, border: c.red, color: c.redLight }, success: { bg: c.hlGreenBg, border: c.green, color: c.greenLight } }[variant];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}44`, borderRadius: "10px", padding: "14px 18px", margin: "16px 0" }}>
      <p style={{ fontSize: "13px", lineHeight: 1.7, color: s.color, margin: 0 }}>{children}</p>
    </div>
  );
}
function H2({ children }: { children: React.ReactNode }) {
  const { c } = useC();
  return <h2 style={{ fontSize: "20px", fontWeight: 700, color: c.accentText, marginTop: "32px", marginBottom: "12px", letterSpacing: "-0.02em" }}>{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  const { c } = useC();
  return <h3 style={{ fontSize: "15px", fontWeight: 600, color: c.accentText, marginTop: "24px", marginBottom: "8px" }}>{children}</h3>;
}
function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const { c } = useC();
  return <p style={{ fontSize: "14px", lineHeight: 1.85, color: c.textSub, marginBottom: "14px", ...style }}>{children}</p>;
}
function Scene({ label, children }: { label: string; children: React.ReactNode }) {
  const { c } = useC();
  return (
    <div style={{ background: c.sceneBg, border: `1px solid ${c.sceneBorder}`, borderLeft: `4px solid ${c.accent}`, borderRadius: "0 10px 10px 0", padding: "14px 18px", margin: "16px 0" }}>
      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: c.accent, marginBottom: "8px" }}>{label}</p>
      <p style={{ fontSize: "13px", lineHeight: 1.75, color: c.textSub, margin: 0 }}>{children}</p>
    </div>
  );
}

/* ══ 간소화 카드 ══ */
function SummaryCard({ icon, title, points, color }: { icon: string; title: string; points: string[]; color: string }) {
  const { c } = useC();
  return (
    <div style={{ background: c.panel, border: `1px solid ${color}33`, borderRadius: "14px", padding: "18px", marginBottom: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <span style={{ fontSize: "20px" }}>{icon}</span>
        <p style={{ fontSize: "15px", fontWeight: 700, color: color, margin: 0 }}>{title}</p>
      </div>
      <ul style={{ margin: 0, paddingLeft: "18px" }}>
        {points.map((pt, i) => (
          <li key={i} style={{ fontSize: "13px", color: c.textSub, lineHeight: 1.75, marginBottom: "4px" }}>{pt}</li>
        ))}
      </ul>
    </div>
  );
}

/* ══ 간소화 전용 서브컴포넌트 ══ */
function BriefCard({ icon, color, title, children }: { icon: string; color: string; title: string; children: React.ReactNode }) {
  const { c } = useC();
  return (
    <div style={{ background: c.panel, border: `1px solid ${color}33`, borderRadius: "14px", padding: "18px 20px", marginBottom: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <span style={{ fontSize: "18px" }}>{icon}</span>
        <p style={{ fontSize: "14px", fontWeight: 700, color: color, margin: 0 }}>{title}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>{children}</div>
    </div>
  );
}

function BriefRow({ label, desc, accent }: { label: string; desc: string; accent?: boolean }) {
  const { c } = useC();
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
      <span style={{ color: c.accent, fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>▸</span>
      <p style={{ fontSize: "13px", lineHeight: 1.7, color: c.textSub, margin: 0 }}>
        {accent ? <strong style={{ color: c.accentText }}>{label}</strong> : <strong style={{ color: c.accentText }}>{label}</strong>}
        {desc && <span style={{ color: c.textSub }}>{desc}</span>}
      </p>
    </div>
  );
}

function BriefExample({ children }: { children: React.ReactNode }) {
  const { c } = useC();
  return (
    <div style={{ background: c.panel2, borderRadius: "8px", padding: "10px 14px", borderLeft: `3px solid ${c.accent}55` }}>
      <p style={{ fontSize: "12px", lineHeight: 1.7, color: c.textFaint, margin: 0, fontStyle: "italic" }}>{children}</p>
    </div>
  );
}

function ZoneRow({ n, pct, color, title, desc, example }: { n: string; pct: string; color: string; title: string; desc: string; example: string }) {
  const { c } = useC();
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "10px 12px", borderRadius: "8px", background: c.panel2 }}>
      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: color + "22", border: `1px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 700, color: color }}>{n}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "3px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: color }}>{pct}</span>
          <span style={{ fontSize: "12px", fontWeight: 600, color: color + "cc" }}>{title}</span>
        </div>
        <p style={{ fontSize: "12px", color: c.textSub, margin: "0 0 4px", lineHeight: 1.6 }}>{desc}</p>
        <p style={{ fontSize: "11px", color: c.textFaint, margin: 0, fontStyle: "italic" }}>{example}</p>
      </div>
    </div>
  );
}

function ExitRow({ trigger, action, why }: { trigger: string; action: string; why: string }) {
  const { c } = useC();
  return (
    <div style={{ padding: "10px 12px", borderRadius: "8px", background: c.panel2, borderLeft: `3px solid ${c.red}55` }}>
      <p style={{ fontSize: "12px", fontWeight: 700, color: c.accentText, margin: "0 0 3px" }}>{trigger}</p>
      <p style={{ fontSize: "12px", color: c.red, margin: "0 0 2px" }}>→ {action}</p>
      <p style={{ fontSize: "11px", color: c.textFaint, margin: 0, fontStyle: "italic" }}>{why}</p>
    </div>
  );
}

/* ══════ 간소화 모드 ══════ */
function BriefView({ lang }: { lang: Lang }) {
  const { c } = useC();
  const L = (ko: string, en: string) => Lf(ko, en, lang);
  const isKo = lang === "ko";

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: c.accent, marginBottom: "6px" }}>
          {L("핵심 요약", "Key Summary")}
        </p>
        <p style={{ fontSize: "13px", color: c.textFaint, margin: 0 }}>
          {L("긴 글 없이, 핵심 논리와 실전 적용법만 — 자세한 내용은 '전체 보기'로",
             "No long reads — just the core logic and how to apply it. Switch to 'Full' for details.")}
        </p>
      </div>

      {/* ── 카드 1: 산업 흐름 ── */}
      <BriefCard icon="🔬" color={c.accent} title={L("1. 산업 흐름 먼저 — 뉴스는 나중", "1. Industry Structure First, News Later")}>
        {isKo ? (
          <>
            <BriefRow label="뉴스로는 돈을 못 번다. " desc="뉴스가 나올 때는 이미 기관이 포지션을 잡은 뒤다. 개인이 뉴스를 보고 산다는 건, 스마트머니의 매도 상대방이 된다는 뜻이다." />
            <BriefRow label="대신 '논리'를 먼저 찾는다. " desc="ChatGPT가 뜨기 전에 이미 'AI 모델 학습 = 대규모 GPU 필요'라는 구조는 존재했다. ChatGPT 관련 기사나 단기 상승 이유를 검색하는 게 아니라, AI 학습 인프라가 어디에 병목이 있는지를 먼저 파악하는 것이다. NVIDIA가 CUDA 생태계를 10년간 구축해 왔고 대체재가 없다는 사실 — 그게 먼저였다." />
            <BriefExample>→ NVIDIA를 2022년 말에 산 사람은 '엔비디아 기사'를 읽어서가 아니라, AI 학습에 GPU가 반드시 필요하다는 구조를 이해했기 때문에 샀다.</BriefExample>
            <BriefRow label="LNG 선박도 같은 논리. " desc="뉴스에 '조선주 급등' 기사가 나오기 전에, LNG 운반선 발주 사이클이 돌아오고 있다는 구조가 먼저였다. 한국 조선사만이 건조할 수 있는 기술 독점, 중국 업체를 배제하려는 글로벌 흐름 — 이게 먼저 읽혀야 했다." />
            <BriefExample>→ 핵심 질문: "이 산업의 성장은 3~5년 지속될 구조인가? 지금의 상승이 일회성 이벤트인가, 사이클의 시작인가?"</BriefExample>
          </>
        ) : (
          <>
            <BriefRow label="You can't profit from news. " desc="By the time news is published, institutions have already positioned. Buying on news means becoming the exit liquidity for smart money." />
            <BriefRow label="Find the logic first. " desc="Before ChatGPT launched, the structure already existed: 'training AI = massive GPU demand.' The key is not searching for ChatGPT news or short-term reasons — it's identifying where the bottleneck in AI training infrastructure is. NVIDIA had built the CUDA ecosystem for a decade with no real substitute. That fact came first." />
            <BriefExample>→ People who bought NVDA in late 2022 didn't do it by reading NVIDIA headlines. They understood that GPU was structurally non-negotiable for AI training.</BriefExample>
            <BriefRow label="LNG ships follow the same logic. " desc="Before 'shipbuilding stocks surge' headlines appeared, the LNG carrier order cycle had already begun turning. Korean yards hold a technical monopoly on LNG vessels, and global pressure to exclude Chinese builders was already forming — that structure needed to be read first." />
            <BriefExample>→ Key question: "Will this industry's growth last 3–5 years structurally? Is this a one-time event or the start of a cycle?"</BriefExample>
          </>
        )}
      </BriefCard>

      {/* ── 카드 2: 구조적 상승 ── */}
      <BriefCard icon="📈" color={c.green} title={L("2. '이미 올랐다'는 착각", "2. The 'Already Too High' Trap")}>
        {isKo ? (
          <>
            <BriefRow label="구조적 상승은 초입이 가장 어렵다. " desc="'30% 올랐으니 늦었다'는 생각이 가장 큰 실수다. 테슬라 2020년 초, 50% 오른 시점이 전체 상승의 1/10도 안 되는 출발선이었다. NVIDIA도 마찬가지였다." />
            <BriefRow label="올랐어도 사야 하는 기준 3가지: " desc="① 수요가 공급을 여전히 압도하는가 ② 기술 독점이 깨지지 않았는가 ③ 시장이 이 성장을 아직 과소평가하고 있는가" />
            <BriefExample>→ NVIDIA는 ChatGPT 출시 후 6개월이 지나도 '너무 올랐다'는 말이 나왔다. 하지만 GPU 수요 대비 공급 부족은 그 뒤로 2년 더 심화됐다.</BriefExample>
          </>
        ) : (
          <>
            <BriefRow label="Structural rises are hardest to enter early. " desc="'It already went up 30%, I'm late' is the most costly mistake. Tesla in early 2020 had already risen 50% — and that was less than 1/10 of the total move. NVIDIA was identical." />
            <BriefRow label="3 criteria for buying despite the rally: " desc="① Does demand still overwhelm supply? ② Is the tech moat still intact? ③ Does the market still underestimate this growth?" />
            <BriefExample>→ Even 6 months after ChatGPT launched, 'NVIDIA is too expensive' was everywhere. But GPU demand vs. supply tightness deepened for 2 more years after that.</BriefExample>
          </>
        )}
      </BriefCard>

      {/* ── 카드 3: 계층형 매수 ── */}
      <BriefCard icon="🎯" color={c.yellow} title={L("3. 계층형 분할 매수 — 어떻게 나눠 사는가", "3. Layered Buying — How to Split Your Entry")}>
        {isKo ? (
          <>
            <BriefRow label="한 번에 몰빵하지 않는다. " desc="아무리 확신이 있어도 타이밍을 완벽히 맞추는 건 불가능하다. 3개 구간으로 나눠서, 하락할수록 더 크게 사는 구조를 미리 만들어 둔다." />
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
              <ZoneRow n="1" pct="25%" color={c.green}
                title={L("초기 진입", "Initial Entry")}
                desc={L("확신이 생겼을 때 전체 예산의 1/4만 먼저 산다. 여기서 더 오르면 좋고, 더 내려가면 기회다.", "Buy 1/4 of budget once conviction forms. If it rises, great. If it falls, that's the plan.")}
                example={L("예: $10,000 예산 → $2,500 먼저 진입. NVDA $150일 때 약 16주.", "e.g. $10,000 budget → $2,500 first. At $150/share ≈ 16 shares.")} />
              <ZoneRow n="2" pct="37%" color={c.yellow}
                title={L("비관 구간", "Pessimism Zone")}
                desc={L("미디어가 '이 산업 끝났다'는 논조를 쏟아낼 때. 단, 내 논리가 여전히 살아있는지 먼저 확인한다. 무너진 게 없다면 1구간보다 더 크게 산다.", "When media says 'this industry is done.' First verify your thesis still holds. If nothing changed, buy more than Zone 1.")}
                example={L("예: NVDA $120으로 -20% 하락 시 $3,700 추가 매수 → 약 30주.", "e.g. NVDA drops to $120 (-20%) → $3,700 more ≈ 30 shares.")} />
              <ZoneRow n="3" pct="38%" color={c.red}
                title={L("패닉 구간", "Panic Zone")}
                desc={L("거래량이 터지고, 커뮤니티에 공포 글이 넘치고, 유튜브 제목에 '폭락'이 등장할 때. 이게 진짜 저점 신호다. 남은 탄환을 가장 크게 쏜다.", "Volume spikes, forums fill with fear, 'crash' appears in YouTube thumbnails. This is the real bottom signal. Deploy the biggest tranche.")}
                example={L("예: NVDA $90까지 추가 하락 시 $3,800 전부 투입 → 약 42주. 평균단가 약 $115.", "e.g. NVDA drops to $90 → deploy $3,800 → ≈42 shares. Blended avg ≈ $115.")} />
            </div>
            <BriefExample>→ 결과: 전체 평균 매입가 $115. NVDA가 $180 회복 시 +56% 수익. 같은 돈을 $150에 한 번에 몰빵했다면 +20%에 그쳤을 것이다.</BriefExample>
          </>
        ) : (
          <>
            <BriefRow label="Never go all-in at once. " desc="No matter how confident, perfect timing is impossible. Set up 3 zones in advance — the lower it goes, the more you buy." />
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
              <ZoneRow n="1" pct="25%" color={c.green}
                title="Initial Entry"
                desc="Buy 1/4 of budget once conviction forms. If it rises, great. If it falls, that's the plan."
                example="e.g. $10,000 budget → $2,500 first. At NVDA $150/share ≈ 16 shares." />
              <ZoneRow n="2" pct="37%" color={c.yellow}
                title="Pessimism Zone"
                desc="When media says 'this industry is done.' First verify thesis still holds. If nothing changed, buy more than Zone 1."
                example="e.g. NVDA drops to $120 (-20%) → $3,700 more ≈ 30 shares." />
              <ZoneRow n="3" pct="38%" color={c.red}
                title="Panic Zone"
                desc="Volume spikes, forums fill with fear, 'crash' in headlines. This is the real bottom signal. Deploy your biggest tranche."
                example="e.g. NVDA drops to $90 → $3,800 all in → ≈42 shares. Blended avg ≈ $115." />
            </div>
            <BriefExample>→ Result: Blended avg $115. If NVDA recovers to $180 → +56% gain. Going all-in at $150 would have been just +20%.</BriefExample>
          </>
        )}
      </BriefCard>

      {/* ── 카드 4: 출구 규칙 ── */}
      <BriefCard icon="🚪" color={c.red} title={L("4. 출구 규칙 — 언제, 얼마나 파는가", "4. Exit Rules — When and How Much to Sell")}>
        {isKo ? (
          <>
            <BriefRow label="파는 기준은 가격이 아니라 '논리'다. " desc="-30% 떨어졌다고 팔면 안 된다. 처음에 산 이유가 깨졌는지를 먼저 묻는다." />
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
              <ExitRow
                trigger={L("논리가 깨졌다", "Thesis is broken")}
                action={L("즉시 전량 매도 (가격 무관)", "Sell everything immediately (price doesn't matter)")}
                why={L("예: NVIDIA의 경쟁자가 CUDA를 대체하는 기술을 실제로 출시했다. 이때는 -50%여도 판다.", "e.g. A competitor actually ships CUDA-replacing technology. Sell even at -50%.")} />
              <ExitRow
                trigger={L("목표 수익률 도달 (+50~100%)", "Target return reached (+50–100%)")}
                action={L("25~30%씩 분할 매도, 나머지는 홀드", "Sell 25–30% in tranches, hold the rest")}
                why={L("예: $115에 산 NVDA가 $180 도달 → 전체의 30%만 매도. 나머지는 산업 구조가 살아있으면 계속 보유.", "e.g. NVDA bought at $115 reaches $180 → sell 30% only. Hold rest while structure lives.")} />
              <ExitRow
                trigger={L("상승 이유가 바뀌었다", "Rally driver has changed")}
                action={L("비중 축소 시작", "Begin reducing position")}
                why={L("예: 실적·수주 기반 상승 → 유명인 언급·테마 붐으로 바뀌면 팔 준비. '왜 오르는지'를 항상 확인한다.", "e.g. Earnings-driven rally → celebrity mention / theme boom. Always ask 'why is it rising.'")} />
              <ExitRow
                trigger={L("하락 중 공포에 팔고 싶다", "Urge to sell during a drop")}
                action={L("아무것도 하지 않는다 (논리 먼저 확인)", "Do nothing — check thesis first")}
                why={L("예: NVDA -15% 하락, 뉴스는 '반도체 겨울'. 하지만 AI 수요 구조가 그대로라면 이건 매수 신호다.", "e.g. NVDA -15%, headlines say 'semiconductor winter.' If AI demand structure is unchanged, this is a buy signal.")} />
            </div>
          </>
        ) : (
          <>
            <BriefRow label="Exit trigger is logic, not price. " desc="Don't sell because it dropped -30%. First ask: has my original buy reason broken?" />
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
              <ExitRow
                trigger="Thesis is broken"
                action="Sell everything immediately (price doesn't matter)"
                why="e.g. A real CUDA-replacing chip is actually shipping from a competitor. Sell even at -50%." />
              <ExitRow
                trigger="Target return reached (+50–100%)"
                action="Sell 25–30% in tranches, hold the rest"
                why="e.g. NVDA bought at $115 reaches $180 → sell just 30%. Hold rest while AI demand structure stays intact." />
              <ExitRow
                trigger="Rally driver has changed"
                action="Begin reducing position"
                why="e.g. Move shifts from earnings/orders-driven to celebrity mentions or theme hype. Always ask 'why is it rising.'" />
              <ExitRow
                trigger="Panic urge during a drop"
                action="Do nothing — check thesis first"
                why="e.g. NVDA -15%, headlines scream 'chip winter.' If the AI demand structure is unchanged, this is a buy signal." />
            </div>
          </>
        )}
      </BriefCard>

      {/* ── 카드 5: 원칙 ── */}
      <BriefCard icon="🧠" color={c.accent} title={L("5. 한 줄 원칙", "5. One-Line Principles")}>
        {isKo ? (
          <>
            <BriefRow label="이해한 기업에만 투자한다. " desc="이해 못 하면 -30%에 팔게 된다. 이해하면 -30%에 더 산다." />
            <BriefRow label="뉴스가 아니라 구조를 본다. " desc="'좋은 뉴스가 나왔다' → 이미 늦다. '구조가 바뀌고 있다' → 지금이 기회다." />
            <BriefRow label="하락은 기회다 — 논리가 살아있을 때만. " desc="논리가 깨지면 기회가 아니라 함정이다." />
            <BriefRow label="계획은 미리, 집행은 기계적으로. " desc="감정이 개입하는 순간 잘못된 결정이 나온다. 이미 정해놓은 가격이 트리거다." />
          </>
        ) : (
          <>
            <BriefRow label="Only invest in what you understand. " desc="Without understanding, you sell at -30%. With it, you buy more at -30%." />
            <BriefRow label="Read structure, not news. " desc="'Good news out' → already late. 'Structure is changing' → this is the opportunity." />
            <BriefRow label="Drops are opportunities — only when thesis holds. " desc="If the thesis is broken, a drop is a trap, not an opportunity." />
            <BriefRow label="Plan in advance, execute mechanically. " desc="The moment emotions enter, bad decisions follow. Pre-set price zones are the only trigger." />
          </>
        )}
      </BriefCard>
    </div>
  );
}

/* ══════ 전체 모드 ══════ */
function FullView({ lang }: { lang: Lang }) {
  const { c } = useC();
  const L = (ko: string, en: string) => Lf(ko, en, lang);
  const isKo = lang === "ko";

  return (
    <div>
      {/* Part 1 헤더 */}
      <div style={{ marginBottom: "8px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: c.accent, marginBottom: "6px" }}>
          {L("투자 전략 정리 · Part 1", "Investment Strategy · Part 1")}
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: c.text, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          {L("주가는 뉴스가 아니라 '논리'가 움직인다", "Price Follows Logic, Not News")}
        </h1>
        <p style={{ fontSize: "13px", color: c.textFaint, margin: 0, lineHeight: 1.6 }}>
          {L("기술 기반 성장주 투자에서 내가 반복적으로 확인한 패턴들",
             "Patterns I've repeatedly confirmed in tech-driven growth stock investing")}
        </p>
      </div>

      <Pullquote>
        {L('"뉴스는 이미 가격에 반영되어 있다. 뉴스보다 먼저 바뀐 산업의 구조를 읽어야 한다."',
           '"News is already priced in. You need to read the structural shift in the industry before the news does."')}
      </Pullquote>

      <H2>{L("1. 왜 뉴스로는 돈을 못 버는가", "1. Why You Can't Make Money on News")}</H2>
      <P>
        {L(
          "주식 투자를 처음 시작할 때 가장 자연스러운 접근은 뉴스를 보는 것이다. \"○○ 기업이 대규모 계약을 수주했다\"는 뉴스가 나오면 주가가 오를 것 같다. 하지만 현실은 다르다.",
          "The most natural approach when starting to invest is to watch news. When '○○ company wins a major contract' hits the wire, it feels like the stock should go up. But reality works differently."
        )}
      </P>
      <Scene label={L("실제 시장의 작동 방식", "How Markets Actually Work")}>
        {L(
          "뉴스가 나오는 시점은 이미 누군가가 그 사실을 알고 미리 산 이후다. 대형 기관투자자, 업계 관계자, 빠른 정보력을 가진 헤지펀드들이 먼저 포지션을 잡는다. 개인 투자자가 뉴스를 보고 '지금 사야겠다'고 생각하는 순간, 스마트머니는 이미 수익을 확정하고 있다.",
          "By the time news is published, someone who already knew has already bought. Large institutions, industry insiders, and fast-information hedge funds position first. At the moment a retail investor reads the news and thinks 'I should buy now,' smart money is already locking in profits."
        )}
      </Scene>
      <P>
        {L(
          "그렇다면 어떻게 해야 하는가. 뉴스 이전에 바뀌는 것을 봐야 한다. 산업의 구조가 바뀌고 있는지, 기업의 기술 포지션이 강화되고 있는지, 수요와 공급의 방향이 어디로 향하는지를 먼저 파악한다.",
          "So what should you do? Look for what changes before the news. Identify whether the industry structure is shifting, whether a company's tech position is strengthening, and where supply and demand are heading."
        )}
      </P>

      <H2>{L("2. 케이스 스터디 — NVIDIA", "2. Case Study — NVIDIA")}</H2>
      <P>
        {L(
          "가장 선명한 사례는 NVIDIA다. 2022년 말 ChatGPT가 등장했을 때, 주가가 오를 것이라는 '뉴스'는 없었다. 있었던 것은 구조였다.",
          "The clearest example is NVIDIA. When ChatGPT appeared in late 2022, there was no 'news' saying the stock would rise. What existed was a structure."
        )}
      </P>
      <Scene label={L("ChatGPT 등장 이전부터 존재했던 구조", "The Structure That Pre-dated ChatGPT")}>
        {L(
          "AI 모델을 학습시키려면 병렬 연산이 가능한 GPU가 필요하다. NVIDIA는 CUDA라는 소프트웨어 생태계를 10년 이상 구축해왔고, 이를 대체할 수 있는 경쟁자는 단기간에 나타날 수 없었다. ChatGPT가 폭발적으로 성장하면서 GPU 수요가 공급을 압도하기 시작했고, NVIDIA는 수요 폭발의 유일한 수혜자가 됐다.",
          "Training AI models requires GPUs capable of parallel computation. NVIDIA had been building the CUDA software ecosystem for over a decade — no competitor could realistically replace it short-term. As ChatGPT exploded, GPU demand began overwhelming supply, and NVIDIA became the sole beneficiary of that demand surge."
        )}
      </Scene>
      <P>
        {isKo
          ? <><ExternalLink href="https://www.etnews.com/20251201000349">전자신문 분석</ExternalLink>에 따르면 ChatGPT 출시 이후 3년 만에 NVIDIA 주가는 10배 이상 급증했다. 더스쿠프는 <ExternalLink href="https://www.thescoop.co.kr/news/articleView.html?idxno=58106">엔비디아 성장 비밀 특집</ExternalLink>에서 GPU가 AI의 심장이 된 기술적 근거를 상세히 분석했다.</>
          : <>According to <ExternalLink href="https://www.etnews.com/20251201000349">ETNews analysis</ExternalLink>, NVIDIA's stock rose over 10x in the three years after ChatGPT's launch. The Scoop's <ExternalLink href="https://www.thescoop.co.kr/news/articleView.html?idxno=58106">NVIDIA growth deep-dive</ExternalLink> analyzes the technical reasons GPU became the heart of AI.</>
        }
      </P>
      <AlertBox variant="info">
        {L(
          "결론: 주가를 가장 강하게 견인하는 것은 '기술 파괴력 + 산업 흐름'이다. 이 두 가지가 맞아떨어지면 뉴스는 결과로 따라오게 되어 있다.",
          "Conclusion: Stock prices are most powerfully driven by 'tech disruption + industry trajectory.' When these two align, news follows as a consequence."
        )}
      </AlertBox>

      <Rule />

      {/* Part 2 헤더 */}
      <div style={{ marginBottom: "8px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: c.accent, marginBottom: "6px" }}>
          {L("투자 전략 정리 · Part 2", "Investment Strategy · Part 2")}
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: c.text, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          {L("구조적 상승은 이미 올랐어도 초입이다", "Structural Rises Are Still Early Even After a Rally")}
        </h1>
      </div>

      <H2>{L("3. 상승 초입에서의 망설임", "3. The Hesitation at the Early Stage")}</H2>
      <P>
        {L(
          "구조적 상승 트렌드를 인식했을 때 가장 흔한 실수는 '이미 많이 올랐다'는 이유로 진입을 포기하는 것이다.",
          "The most common mistake when recognizing a structural uptrend is abandoning entry because 'it's already gone up too much.'"
        )}
      </P>
      <Scene label={L("30% 올랐어도 초입일 수 있다", "Even After +30%, It May Still Be Early")}>
        {L(
          "전기차 섹터가 본격적으로 주목받기 시작한 2020년 초, 테슬라는 이미 1월에 50% 가까이 올라있었다. 그 시점에 '이미 너무 올랐다'고 판단한 사람들은 이후 5~10배의 상승을 모두 놓쳤다. 구조적인 상승 트렌드가 막 인식되기 시작하는 시점이라면, 이미 올라있는 30%는 이후 올라갈 300%에 비해 아무것도 아닌 숫자다.",
          "In early 2020 when EV stocks began getting serious attention, Tesla had already risen nearly 50% in January. Those who decided 'it's already too high' missed the subsequent 5-10x gain. When a structural uptrend is just beginning to be recognized, the 30% already gained means nothing compared to the 300% still ahead."
        )}
      </Scene>

      <H2>{L("4. 저점 매수 전략", "4. Bottom-Buying Strategy")}</H2>
      <P style={{ color: c.textFaint, fontSize: "13px", marginTop: "-8px" }}>
        {L("성장 동력은 살아있는데 주가만 가혹하게 눌렸을 때", "When growth drivers are intact but price has been harshly compressed")}
      </P>
      <Scene label={L("저점 다지기 패턴", "Base-Building Pattern")}>
        {L(
          "전저점 근처에서 몇 번을 더 찌르지만, 그때마다 거래량이 줄어들면서 반등이 나온다. 팔 사람이 다 팔았고, 추가 하락을 기대했던 공매도 세력도 더 이상 힘을 못 쓰는 상태다. 악재 뉴스가 나와도 크게 빠지지 않는다. 그 둔감해지는 순간이 저점이 다져지는 신호다.",
          "Price probes near prior lows multiple times, but each time volume shrinks and bounces occur. Sellers are exhausted, short-sellers lose power. Even on bad news, the stock barely drops. That moment of 'not reacting' is the signal that a base is forming."
        )}
      </Scene>
      <H3>{L("케이스 — 한국 조선주", "Case — Korean Shipbuilders")}</H3>
      <P>
        {isKo
          ? <>한국 조선주들은 2010년대 후반 수년간 수주 부진, 구조조정으로 장기 하락을 겪었다. 하지만 구조는 바뀌고 있었다. <ExternalLink href="https://www.mt.co.kr/stock/2023/05/25/2023052422474498368">머니투데이 2023년 분석</ExternalLink>에 따르면 LNG 운반선은 한국 조선사들이 전체 주문의 70%를 독점한 영역이다. <ExternalLink href="https://www.thepublic.kr/news/articleView.html?idxno=292979">2025년 빅3 합산 영업이익은 6조원을 넘겼다.</ExternalLink></>
          : <>Korean shipbuilders suffered years of decline in the late 2010s from weak orders and restructuring. But the structure was changing. According to <ExternalLink href="https://www.mt.co.kr/stock/2023/05/25/2023052422474498368">Money Today's 2023 analysis</ExternalLink>, Korean shipyards monopolize 70% of LNG carrier orders. By 2025, <ExternalLink href="https://www.thepublic.kr/news/articleView.html?idxno=292979">the Big 3's combined operating profit exceeded ₩6T.</ExternalLink></>
        }
      </P>

      <Rule />

      {/* Part 3 */}
      <div style={{ marginBottom: "8px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: c.accent, marginBottom: "6px" }}>
          {L("투자 전략 정리 · Part 3", "Investment Strategy · Part 3")}
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: c.text, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          {L("사이클 매수와 자금 배분", "Cycle Buying & Capital Allocation")}
        </h1>
      </div>

      <H2>{L("5. 계층형 매수 전략", "5. Layered Buy Strategy")}</H2>
      <P>
        {L(
          "구조적으로 우상향하는 자산은 단순히 '언제 살지'보다 '어떻게 나눠 살지'가 더 중요하다.",
          "For structurally uptrending assets, 'how to spread your buys' matters more than 'when to buy.'"
        )}
      </P>
      <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "20px", margin: "16px 0" }}>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: c.textFaint, marginBottom: "12px" }}>
          {L("계층형 전략 3단계", "3-Zone Layered Strategy")}
        </p>
        {[
          { n:"1", label: L("초기 진입 — 25%", "Initial Entry — 25%"), desc: L("확신이 선 첫 매수. 상승 초입을 놓치지 않기 위한 포지션", "First buy with conviction. To not miss the early move."), color: c.green },
          { n:"2", label: L("비관 구간 — 37%", "Pessimism Zone — 37%"), desc: L("시장이 과도하게 비관적일 때. 논리가 살아있는지 먼저 확인", "When market overreacts. Verify thesis still holds first."), color: c.yellow },
          { n:"3", label: L("패닉 구간 — 38%", "Panic Zone — 38%"), desc: L("거래량 폭증, 뉴스 최악. 여기서 가장 크게 태운다", "Volume surge, worst news. Load up the most here."), color: c.red },
        ].map(row => (
          <div key={row.n} style={{ display: "flex", gap: "14px", padding: "12px 0", borderBottom: `1px solid ${c.line}` }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: row.color + "22", border: `1px solid ${row.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 700, color: row.color, flexShrink: 0 }}>{row.n}</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: row.color, margin: "0 0 3px" }}>{row.label}</p>
              <p style={{ fontSize: "12px", color: c.textFaint, margin: 0 }}>{row.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Scene label={L("레버리지 ETF — TQQQ 사례", "Leveraged ETF — TQQQ Case")}>
        {L(
          "TQQQ(나스닥 3배 레버리지)는 장이 -3% 빠지는 날 -9% 이상 떨어진다. 그런데 장기적으로 나스닥이 우상향한다는 전제가 살아있다면, 이 -9% 구간은 매수 기회다. 계획 없이는 다가가지 말아야 할 것이 레버리지 상품이다.",
          "TQQQ (3x Nasdaq leverage) drops 9%+ on a -3% market day. But if the long-term Nasdaq uptrend premise holds, that -9% is a buying opportunity. Never approach leveraged products without a written plan."
        )}
        {" "}
        {isKo
          ? <><ExternalLink href="https://v.daum.net/v/GmoJ0bC2T7">블로터 넘버스 분석</ExternalLink>에 따르면 코로나 저점에서 TQQQ를 매수한 투자자는 연말까지 5.6배 수익을 거뒀다.</>
          : <>According to <ExternalLink href="https://v.daum.net/v/GmoJ0bC2T7">Bloter Numbers analysis</ExternalLink>, investors who bought TQQQ at the COVID bottom gained 5.6x by year-end.</>
        }
      </Scene>

      <H2>{L("6. 출구 전략", "6. Exit Strategy")}</H2>
      <AlertBox variant="warn">
        {L(
          "논리가 살아있으면 버텨라. 논리가 깨지면 즉시 멈춰라. 가격이 아니라 논리가 출구 트리거다.",
          "If the thesis lives, hold. If the thesis breaks, stop immediately. Logic — not price — is the exit trigger."
        )}
      </AlertBox>
      <P>
        {L(
          "가장 큰 실수는 단순한 가격 하락에 겁먹어 파는 것이다. 논리가 바뀌지 않았다면 하락은 기회일 뿐이다. 반대로, 논리가 무너졌는데도 '본전 심리'로 버티는 것은 리스크를 무한히 키우는 행위다.",
          "The biggest mistake is selling on simple price drops. If the thesis hasn't changed, a decline is just an opportunity. Conversely, holding after the thesis breaks due to 'breakeven psychology' is unlimited risk-taking."
        )}
      </P>

      <AlertBox variant="success">
        {L(
          '"처음부터 자금을 나눠놓고 계획대로만 들어가라 — 감정이 아니라 구간이 트리거다"',
          '"Split your capital from the start and only enter by the plan — zones trigger entries, not emotions"'
        )}
      </AlertBox>
    </div>
  );
}

/* ════════════════ 메인 ════════════════ */
export default function StrategyTab() {
  const { c, lang } = useC();
  const L = (ko: string, en: string) => Lf(ko, en, lang);
  const [mode, setMode] = useState<"brief"|"full">("brief");

  return (
    <article style={{ maxWidth: "720px", margin: "0 auto" }}>
      {/* 헤더 + 모드 전환 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: c.accent, marginBottom: "6px" }}>
            {L("Investment Strategy", "Investment Strategy")}
          </p>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: c.text, margin: 0, letterSpacing: "-0.02em" }}>
            {L("투자 전략 정리", "Investment Strategy")}
          </h1>
        </div>
        {/* 모드 토글 */}
        <div style={{ display: "flex", background: c.panel2, borderRadius: "10px", padding: "3px", border: `1px solid ${c.line}`, flexShrink: 0, marginTop: "4px" }}>
          {(["brief","full"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: "7px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: mode===m ? 600 : 400,
              cursor: "pointer", border: "none", fontFamily: "inherit", transition: "all 0.15s",
              background: mode===m ? c.accent+"33" : "transparent",
              color: mode===m ? c.accent : c.textDim,
            }}>
              {m === "brief" ? L("📋 요약", "📋 Summary") : L("📖 전체", "📖 Full")}
            </button>
          ))}
        </div>
      </div>

      {mode === "brief" ? <BriefView lang={lang} /> : <FullView lang={lang} />}
      <div style={{ height: "40px" }} />
    </article>
  );
}
