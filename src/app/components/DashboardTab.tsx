"use client";

import { useState } from "react";
import StagedBuyCalculator from "./StagedBuyCalculator";
import PortfolioTracker    from "./PortfolioTracker";
import LayeredCalc         from "./LayeredCalc";
import type { Answers, AnswerType } from "./types";
import { calcScore } from "./scoring";
import { Card, Hl, Tag } from "./ui";
import { useTheme, THEME } from "@/app/context/ThemeContext";
import type { Lang } from "@/app/context/ThemeContext";

/* ── i18n helpers ── */
const L = (ko: string, en: string, lang: Lang) => lang === "ko" ? ko : en;

const STEPS_LABELS = {
  ko: ["산업 구조","기술 파괴력","현재 하락","자금 배분","논리 점검","결과"],
  en: ["Industry","Tech Edge","Drawdown","Allocation","Thesis Check","Result"],
};

function ChoiceBtn({ label, state, onClick }: { label: string; state: "idle"|"good"|"ok"|"bad"; onClick: () => void }) {
  const { theme } = useTheme();
  const c = THEME[theme];
  const base = { padding: "10px 14px", borderRadius: "9px", fontSize: "13px", cursor: "pointer", textAlign: "left" as const, lineHeight: 1.5, fontFamily: "inherit", width: "100%", transition: "all 0.18s" };
  const states = {
    idle: { background: c.panel2, border: `1px solid ${c.line}`,  color: c.textMuted },
    good: { background: theme==="dark" ? "rgba(108,232,138,0.12)" : "rgba(26,122,64,0.1)", border:`1px solid ${c.green}`, color: c.green },
    ok:   { background: theme==="dark" ? "rgba(255,204,92,0.1)"  : "rgba(138,88,0,0.08)", border:`1px solid ${c.yellow}`,color: c.yellow },
    bad:  { background: theme==="dark" ? "rgba(255,123,123,0.1)" : "rgba(184,28,28,0.08)",border:`1px solid ${c.red}`,  color: c.red },
  };
  return <button onClick={onClick} style={{ ...base, ...states[state] }}>{label}</button>;
}

function QCard({ stepN, qid, question, hint, options, answers, onSelect }: {
  stepN: number; qid: string; question: string; hint: string;
  options: { label: string; type: AnswerType }[];
  answers: Answers;
  onSelect: (qid: string, idx: number, type: AnswerType) => void;
}) {
  const { theme } = useTheme();
  const c = THEME[theme];
  return (
    <div style={{ background: c.panel, border:`1px solid ${c.line}`, borderRadius:"14px", padding:"20px", marginBottom:"14px" }}>
      <p style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, marginBottom:"8px", color:c.textFaint }}>Step {stepN}</p>
      <p style={{ fontSize:"15px", fontWeight:600, marginBottom:"8px", color:c.accentText }}>{question}</p>
      <p style={{ fontSize:"12px", marginBottom:"14px", color:c.textFaint }}>{hint}</p>
      <div style={{ display:"flex", flexDirection:"column" as const, gap:"8px" }}>
        {options.map((opt, i) => (
          <ChoiceBtn key={i} label={opt.label}
            state={answers[qid]?.idx === i ? opt.type : "idle"}
            onClick={() => onSelect(qid, i, opt.type)} />
        ))}
      </div>
    </div>
  );
}

function AllocSlider({ allocPct, onChange }: { allocPct: number; onChange: (v: number) => void }) {
  const { theme } = useTheme();
  const c = THEME[theme];
  const stage = allocPct <= 30 ? { label:"초기 단계", color:c.green } : allocPct <= 60 ? { label:"중간 단계", color:c.yellow } : { label:"고비중 단계", color:c.red };
  return (
    <div style={{ background:c.panel2, borderRadius:"8px", padding:"12px", marginTop:"8px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
        <span style={{ fontSize:"12px", color:c.textDim }}>0%</span>
        <input type="range" min={0} max={100} step={5} value={allocPct} onChange={e => onChange(Number(e.target.value))} style={{ flex:1, accentColor:stage.color }} />
        <span style={{ fontSize:"12px", color:c.textDim }}>100%</span>
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"14px", fontWeight:500, minWidth:"36px", textAlign:"right" as const, color:stage.color }}>{allocPct}%</span>
      </div>
      <p style={{ fontSize:"12px", color:stage.color, marginTop:"6px", textAlign:"right" as const }}>{stage.label}</p>
    </div>
  );
}

function StepNav({ current, lang }: { current: number; lang: Lang }) {
  const { theme } = useTheme();
  const c = THEME[theme];
  const labels = STEPS_LABELS[lang];
  return (
    <div style={{ display:"flex", gap:"4px", marginBottom:"20px", overflowX:"auto" as const }}>
      {labels.map((label, i) => {
        const n = i + 1;
        const done = n < current; const active = n === current;
        return (
          <div key={n} style={{ display:"flex", alignItems:"center", gap:"4px", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"5px", padding:"5px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:active?700:400,
              background: active?(c.accent+"22"):done?(c.green+"18"):"transparent",
              border:`1px solid ${active?c.accent:done?c.green:c.line}`,
              color: active?c.accent:done?c.green:c.textFaint }}>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"10px" }}>{done?"✓":n}</span>
              <span>{label}</span>
            </div>
            {i < labels.length - 1 && <span style={{ color:c.line, fontSize:"12px" }}>›</span>}
          </div>
        );
      })}
    </div>
  );
}

function ResultView({ answers, understanding, allocPct, onReset, lang }: {
  answers: Answers; understanding: number; allocPct: number; onReset: () => void; lang: Lang;
}) {
  const { theme } = useTheme();
  const c = THEME[theme];
  const result = calcScore(answers, understanding, allocPct);
  const { verdict, verdictDesc, allocAction, allocAdvice, pct, barColor,
          understandingColor, understandingLabel, principleReminder, logicBroken, flags } = result;

  const actions = [
    { icon: logicBroken ? "⛔" : pct >= 60 ? "🚀" : pct >= 35 ? "🟡" : "⏸", text: verdictDesc },
    { icon: "💰", text: `${lang==="ko" ? "자금 배분" : "Allocation"}: ${allocAction}` },
    { icon: "📊", text: allocAdvice },
    { icon: "🧠", text: `${lang==="ko" ? "이해도" : "Understanding"}: ${understandingLabel}` },
    ...(flags.length > 0 ? [{ icon: "⚠", text: `${lang==="ko" ? "우려 항목" : "Concerns"}: ${flags.join(", ")}` }] : []),
    { icon: "💬", text: principleReminder },
  ];

  return (
    <div>
      <Card>
        <div style={{ textAlign:"center" as const, padding:"20px 0" }}>
          <p style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase" as const, color:c.textFaint, marginBottom:"8px" }}>
            {lang==="ko" ? "종합 판단 점수" : "Overall Score"}
          </p>
          <p style={{ fontSize:"56px", fontWeight:700, color:barColor, fontFamily:"'IBM Plex Mono',monospace", lineHeight:1 }}>{pct}</p>
          <p style={{ fontSize:"11px", color:c.textFaint, marginBottom:"12px" }}>/100</p>
          {/* 점수 바 */}
          <div style={{ height:"8px", borderRadius:"4px", background:c.line, margin:"0 auto 16px", maxWidth:"200px", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:barColor, borderRadius:"4px", transition:"width 0.6s ease" }} />
          </div>
          <div style={{ display:"inline-block", padding:"8px 20px", borderRadius:"20px", border:`1.5px solid ${barColor}`, background:barColor+"18" }}>
            <p style={{ fontSize:"14px", fontWeight:700, color:barColor, margin:0 }}>{verdict}</p>
          </div>
        </div>
      </Card>
      <div style={{ marginTop:"16px", display:"flex", flexDirection:"column" as const, gap:"8px" }}>
        {actions.map((a, i) => (
          <div key={i} style={{ display:"flex", gap:"10px", alignItems:"flex-start", padding:"12px 16px", borderRadius:"10px", background:c.panel, border:`1px solid ${c.line}` }}>
            <span style={{ fontSize:"14px", flexShrink:0 }}>{a.icon}</span>
            <p style={{ fontSize:"13px", color:c.textSub, lineHeight:1.6, margin:0 }}>{a.text}</p>
          </div>
        ))}
      </div>
      <button onClick={onReset} style={{ marginTop:"20px", width:"100%", padding:"12px", borderRadius:"10px", border:`1px solid ${c.line}`, background:"transparent", color:c.textDim, cursor:"pointer", fontFamily:"inherit", fontSize:"13px" }}>
        {lang==="ko" ? "← 다시 평가" : "← Evaluate Again"}
      </button>
    </div>
  );
}

/* ════════════════════════════════════ */

type SubTab = "judge" | "staged" | "portfolio" | "layered";

export default function DashboardTab() {
  const { theme, lang } = useTheme();
  const c = THEME[theme];
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("judge");
  const [step, setStep]           = useState(1);
  const [answers, setAnswers]     = useState<Answers>({});
  const [understanding, setU]     = useState(5);
  const [allocPct, setAllocPct]   = useState(30);
  const [showResult, setShowResult] = useState(false);

  const lbl = (ko: string, en: string) => L(ko, en, lang);

  const handleSelect = (qid: string, idx: number, type: AnswerType) => setAnswers(p => ({ ...p, [qid]: { idx, type } }));
  const reset = () => { setStep(1); setAnswers({}); setU(5); setAllocPct(30); setShowResult(false); };

  const Btns = ({ prev, onNext, nextLabel }: { prev?: number; onNext?: () => void; nextLabel?: string }) => (
    <div style={{ display:"flex", justifyContent:"flex-end", gap:"10px", marginTop:"20px" }}>
      {prev !== undefined && (
        <button onClick={() => setStep(prev)} style={{ padding:"10px 20px", borderRadius:"8px", border:`1px solid ${c.line}`, background:"transparent", color:c.textMuted, cursor:"pointer", fontFamily:"inherit", fontSize:"13px" }}>
          {lbl("← 이전", "← Back")}
        </button>
      )}
      <button onClick={onNext ?? (() => setStep(step + 1))} style={{ padding:"10px 20px", borderRadius:"8px", border:`1px solid ${c.accent}`, background:c.accent, color:c.bg, cursor:"pointer", fontFamily:"inherit", fontSize:"13px", fontWeight:500 }}>
        {nextLabel ?? lbl("다음 단계 →", "Next →")}
      </button>
    </div>
  );

  const subTabs: { id: SubTab; label: string }[] = [
    { id: "judge",     label: lbl("⚡ 투자 판단", "⚡ Decision") },
    { id: "staged",    label: lbl("🎯 분할 매수", "🎯 Staged Buy") },
    { id: "portfolio", label: lbl("📊 포트폴리오", "📊 Portfolio") },
    { id: "layered",   label: lbl("🧮 계층형 계산기", "🧮 Layered Calc") },
  ];

  const qProps = { answers, onSelect: handleSelect };

  return (
    <div>
      {/* 서브탭 */}
      <div style={{ display:"flex", gap:"6px", marginBottom:"24px", flexWrap:"wrap" as const }}>
        {subTabs.map(tab => {
          const isActive = activeSubTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} style={{
              padding:"9px 16px", borderRadius:"20px", fontSize:"13px", fontWeight:500,
              cursor:"pointer", border:`1px solid ${isActive ? c.accent : c.line}`,
              background: isActive ? c.accent + "22" : "transparent",
              color: isActive ? c.accent : c.textDim, fontFamily:"inherit", transition:"all 0.15s",
            }}>{tab.label}</button>
          );
        })}
      </div>

      {activeSubTab === "staged"    && <StagedBuyCalculator />}
      {activeSubTab === "portfolio" && <PortfolioTracker />}
      {activeSubTab === "layered"   && <LayeredCalc />}

      {activeSubTab === "judge" && (
        <div>
          <div style={{ marginBottom:"24px" }}>
            <p style={{ fontSize:"18px", fontWeight:700, marginBottom:"4px", color:c.accentText }}>
              {lbl("투자 판단 평가 도구", "Investment Decision Tool")}
            </p>
            <p style={{ fontSize:"12px", color:c.textFaint }}>
              {lbl("지금 상황을 내 투자 기준 프레임 안에서 스스로 평가해보세요", "Evaluate the current situation against your investment framework")}
            </p>
          </div>

          <StepNav current={step} lang={lang} />

          {step === 1 && (
            <div>
              <QCard stepN={1} qid="q1" {...qProps}
                question={lbl("지금 이 산업의 방향성은?", "What is the industry's trajectory?")}
                hint={lbl("단기 뉴스가 아니라 3~5년 시야로 봤을 때 구조적으로 성장하고 있는가","Looking at a 3–5 year horizon, is this structurally growing?")}
                options={[
                  { label: lbl("✅ 명확히 성장 중 — 패러다임 전환이 일어나고 있다","✅ Clearly growing — paradigm shift underway"), type:"good" },
                  { label: lbl("🟡 성장하긴 하는데 속도나 방향이 불확실하다","🟡 Growing but speed/direction uncertain"), type:"ok" },
                  { label: lbl("🔴 산업 자체가 정체되거나 역풍을 맞고 있다","🔴 Industry stagnating or facing headwinds"), type:"bad" },
                ]} />
              <QCard stepN={1} qid="q2" {...qProps}
                question={lbl("이 산업의 성장이 수요 폭발형인가, 공급 제약인가?","Is growth driven by demand explosion or supply constraint?")}
                hint={lbl("AI → GPU 수요처럼 '수요가 공급을 압도'하는 구조가 가장 강력한 투자 근거다","Like AI→GPU demand — 'demand overwhelming supply' is the strongest thesis")}
                options={[
                  { label: lbl("✅ 수요가 구조적으로 폭발 중 — 공급이 따라가지 못한다","✅ Structural demand explosion — supply can't keep up"), type:"good" },
                  { label: lbl("🟡 수요와 공급이 균형을 맞춰가는 상황","🟡 Supply and demand finding balance"), type:"ok" },
                  { label: lbl("🔴 공급 과잉 또는 수요 둔화가 보인다","🔴 Signs of oversupply or weakening demand"), type:"bad" },
                ]} />
              <Btns onNext={() => setStep(2)} />
            </div>
          )}

          {step === 2 && (
            <div>
              <QCard stepN={2} qid="q3" {...qProps}
                question={lbl("이 기업의 기술이 시장을 바꾸는 수준인가?","Is this company's technology market-defining?")}
                hint={lbl("이 기업이 없으면 산업이 제대로 작동하지 않는가?","Would the industry malfunction without this company?")}
                options={[
                  { label: lbl("✅ 대체 불가능한 핵심 인프라 / 공급망 장악","✅ Irreplaceable core infrastructure / supply chain dominance"), type:"good" },
                  { label: lbl("🟡 좋은 기업이지만 강력한 경쟁자가 있다","🟡 Good company but strong competitors exist"), type:"ok" },
                  { label: lbl("🔴 기술 우위가 불명확하거나 빠르게 추격당하고 있다","🔴 Tech edge unclear or being rapidly eroded"), type:"bad" },
                ]} />
              <div style={{ background:c.panel, border:`1px solid ${c.line}`, borderRadius:"14px", padding:"20px", marginBottom:"14px" }}>
                <p style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, marginBottom:"8px", color:c.textFaint }}>Step 2</p>
                <p style={{ fontSize:"14px", fontWeight:500, marginBottom:"8px", color:c.accentText }}>
                  {lbl("이 기업의 성장 스토리를 나는 얼마나 이해하는가?","How well do you understand this company's growth story?")}
                </p>
                <p style={{ fontSize:"12px", marginBottom:"12px", color:c.textFaint }}>
                  {lbl('"내가 이해한 기술과 산업 흐름을 믿고 기다린다" — 이해 못 하면 하락 때 버티지 못한다','"Believe in what you understand and wait" — without understanding, you\'ll sell at the bottom')}
                </p>
                <div style={{ background:c.panel2, borderRadius:"8px", padding:"12px", marginTop:"8px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                    <span style={{ fontSize:"12px", color:c.textDim }}>{lbl("전혀 모름","No idea")}</span>
                    <input type="range" min={0} max={10} step={1} value={understanding} onChange={e => setU(Number(e.target.value))} style={{ flex:1, accentColor:c.accent }} />
                    <span style={{ fontSize:"12px", color:c.textDim }}>{lbl("완벽히 이해","Expert")}</span>
                    <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"14px", fontWeight:500, minWidth:"36px", textAlign:"right" as const, color:c.accent }}>{understanding}/10</span>
                  </div>
                </div>
              </div>
              <Btns prev={1} />
            </div>
          )}

          {step === 3 && (
            <div>
              <QCard stepN={3} qid="q4" {...qProps}
                question={lbl("지금 하락의 원인은 무엇인가?","What is causing the current drawdown?")}
                hint={lbl("하락의 성격을 정확히 구분하는 것이 매수 여부를 결정한다","Correctly identifying the nature of the decline determines whether to buy")}
                options={[
                  { label: lbl("✅ 단기 수급 문제 / 시장 전체 조정 / 과열 해소","✅ Short-term flows / broad market correction / cooling off"), type:"good" },
                  { label: lbl("🟡 실적 쇼크나 일시적 이슈 — 구조는 안 바뀜","🟡 Earnings miss or temporary issue — structure unchanged"), type:"ok" },
                  { label: lbl("🔴 산업 자체나 기업 기술력에 구조적 문제 발생","🔴 Structural problem in industry or company tech"), type:"bad" },
                ]} />
              <QCard stepN={3} qid="q5" {...qProps}
                question={lbl("현재 시장 분위기는?","What is the current market sentiment?")}
                hint={lbl("패닉 국면일수록 계층형 전략에서 더 큰 비중을 집행할 신호다","The more panic, the more aggressive your layered strategy should be")}
                options={[
                  { label: lbl("✅ 극도의 공포 / 거래량 폭증 / 개인들 패닉 셀","✅ Extreme fear / volume surge / retail panic selling"), type:"good" },
                  { label: lbl("🟡 어느 정도 조정 — 부정적이지만 극단은 아님","🟡 Some correction — negative but not extreme"), type:"ok" },
                  { label: lbl("🔴 여전히 낙관적 / 아직 고통스럽지 않음","🔴 Still optimistic / no real pain yet"), type:"bad" },
                ]} />
              <Btns prev={2} />
            </div>
          )}

          {step === 4 && (
            <div>
              <div style={{ background:c.panel, border:`1px solid ${c.line}`, borderRadius:"14px", padding:"20px", marginBottom:"14px" }}>
                <p style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, marginBottom:"8px", color:c.textFaint }}>Step 4</p>
                <p style={{ fontSize:"14px", fontWeight:500, marginBottom:"8px", color:c.accentText }}>
                  {lbl("지금까지 이 종목에 투입한 자금은 전체의 몇 %인가?","What % of your planned budget is already invested?")}
                </p>
                <p style={{ fontSize:"12px", marginBottom:"12px", color:c.textFaint }}>
                  {lbl("계층형 전략: 초기 20~30% → 비관 구간 30~40% → 패닉 구간 30~40%","Layered strategy: Initial 20–30% → Pessimism 30–40% → Panic 30–40%")}
                </p>
                <AllocSlider allocPct={allocPct} onChange={setAllocPct} />
              </div>
              <QCard stepN={4} qid="q6" {...qProps}
                question={lbl("추가 투자할 여유 자금이 있는가?","Do you have remaining capital to deploy?")}
                hint={lbl("계층형 전략에서 패닉 구간 탄환이 남아있는지가 핵심이다","The key is whether you still have ammo for the panic zone")}
                options={[
                  { label: lbl("✅ 충분하다 — 패닉 구간에서 크게 태울 수 있다","✅ Plenty — can load up heavily in the panic zone"), type:"good" },
                  { label: lbl("🟡 약간 있다 — 소량 추가는 가능하다","🟡 Some — can add a small position"), type:"ok" },
                  { label: lbl("🔴 거의 없다 — 이미 총알을 많이 썼다","🔴 Almost none — already deployed too much"), type:"bad" },
                ]} />
              <Btns prev={3} />
            </div>
          )}

          {step === 5 && (
            <div>
              <QCard stepN={5} qid="q7" {...qProps}
                question={lbl("처음 이 종목에 투자한 핵심 논리가 지금도 유효한가?","Is the original investment thesis still intact?")}
                hint={lbl('"논리가 살아있으면 버텨라. 논리가 깨지면 즉시 멈춰라"','"If the thesis lives, hold. If the thesis breaks, stop immediately"')}
                options={[
                  { label: lbl("✅ 완전히 유효 — 투자 논리가 전혀 흔들리지 않는다","✅ Fully intact — thesis completely unchanged"), type:"good" },
                  { label: lbl("🟡 대체로 유효하지만 일부 우려 요소가 생겼다","🟡 Mostly intact but some new concerns"), type:"ok" },
                  { label: lbl("🔴 논리가 흔들리거나 처음 예상과 다른 방향으로 가고 있다","🔴 Thesis is shaking or moving against expectations"), type:"bad" },
                ]} />
              <QCard stepN={5} qid="q8" {...qProps}
                question={lbl('"확신 기반"인가, "공포/탐욕 기반"인가?','"Conviction-based" or "Fear/Greed-based"?')}
                hint={lbl("뉴스에 반응하고 있다면 공포/탐욕 기반일 가능성이 높다","If you're reacting to news, it's likely fear/greed-based")}
                options={[
                  { label: lbl("✅ 확신 기반 — 내 분석으로 판단하고 있다","✅ Conviction — based on my own analysis"), type:"good" },
                  { label: lbl("🟡 반반 — 분석과 시장 분위기를 섞어서 보고 있다","🟡 Mixed — combining analysis with market sentiment"), type:"ok" },
                  { label: lbl("🔴 공포/탐욕 기반 — 뉴스와 감정에 반응하고 있다","🔴 Fear/Greed — reacting to news and emotion"), type:"bad" },
                ]} />
              <Btns prev={4}
                onNext={() => { setStep(6); setShowResult(true); }}
                nextLabel={lbl("판단 결과 보기 →", "See Result →")} />
            </div>
          )}

          {step === 6 && showResult && (
            <ResultView answers={answers} understanding={understanding} allocPct={allocPct} onReset={reset} lang={lang} />
          )}
        </div>
      )}
    </div>
  );
}
