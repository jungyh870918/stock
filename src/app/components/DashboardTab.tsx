"use client";

import { useState } from "react";
import type { Answers, AnswerType } from "./types";
import { calcScore } from "./scoring";
import { Card, Hl, Tag } from "./ui";
import { useTheme, THEME } from "@/app/context/ThemeContext";

const STEPS = [
  { id: 1, label: "산업 구조" },
  { id: 2, label: "기술 파괴력" },
  { id: 3, label: "현재 하락" },
  { id: 4, label: "자금 배분" },
  { id: 5, label: "논리 점검" },
  { id: 6, label: "결과" },
];

function ChoiceBtn({ label, state, onClick }: { label: string; state: "idle" | "good" | "ok" | "bad"; onClick: () => void }) {
  const { theme } = useTheme();
  const c = THEME[theme];
  const base = { padding: "10px 14px", borderRadius: "9px", fontSize: "13px", cursor: "pointer", textAlign: "left" as const, lineHeight: 1.5, fontFamily: "inherit", width: "100%", transition: "all 0.18s" };
  const states = {
    idle: { background: c.panel2, border: `1px solid ${c.line}`, color: c.textMuted },
    good: { background: theme === "dark" ? "rgba(108,232,138,0.12)" : "rgba(26,122,64,0.1)", border: `1px solid ${c.green}`, color: c.green },
    ok: { background: theme === "dark" ? "rgba(255,204,92,0.1)" : "rgba(138,88,0,0.08)", border: `1px solid ${c.yellow}`, color: c.yellow },
    bad: { background: theme === "dark" ? "rgba(255,123,123,0.1)" : "rgba(184,28,28,0.08)", border: `1px solid ${c.red}`, color: c.red },
  };
  return <button onClick={onClick} style={{ ...base, ...states[state] }}>{label}</button>;
}

function QCard({ stepN, qid, question, hint, options, answers, onSelect }: {
  stepN: number; qid: string; question: string; hint: string;
  options: { label: string; type: AnswerType }[];
  answers: Answers; onSelect: (qid: string, idx: number, type: AnswerType) => void;
}) {
  const { theme } = useTheme();
  const c = THEME[theme];
  const stepLabels = ["산업 구조 분석","기술 파괴력 평가","현재 하락 성격 분석","자금 배분 점검","핵심 논리 점검"];
  return (
    <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "20px", marginBottom: "14px" }}>
      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "8px", color: c.textFaint }}>
        Step {stepN} · {stepLabels[stepN - 1]}
      </p>
      <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "14px", lineHeight: 1.6, color: c.accentText }}>{question}</p>
      <p style={{ fontSize: "12px", marginBottom: "14px", lineHeight: 1.6, color: c.textFaint }}>{hint}</p>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
        {options.map((opt, i) => (
          <ChoiceBtn key={i} label={opt.label}
            state={answers[qid]?.idx === i ? answers[qid].type : "idle"}
            onClick={() => onSelect(qid, i, opt.type)} />
        ))}
      </div>
    </div>
  );
}

function ResultView({ answers, understanding, allocPct, onReset }: { answers: Answers; understanding: number; allocPct: number; onReset: () => void }) {
  const { theme } = useTheme();
  const c = THEME[theme];
  const r = calcScore(answers, understanding, allocPct);

  const verdictBg: Record<string, string> = {
    BUY: theme === "dark" ? "rgba(108,232,138,0.1)" : "rgba(26,122,64,0.08)",
    PARTIAL: theme === "dark" ? "rgba(143,179,255,0.1)" : "rgba(36,97,204,0.08)",
    WAIT: theme === "dark" ? "rgba(255,204,92,0.1)" : "rgba(138,88,0,0.08)",
    STOP: theme === "dark" ? "rgba(255,123,123,0.1)" : "rgba(184,28,28,0.08)",
  };
  const verdictBorder: Record<string, string> = {
    BUY: theme === "dark" ? "rgba(108,232,138,0.3)" : "rgba(26,122,64,0.3)",
    PARTIAL: theme === "dark" ? "rgba(143,179,255,0.3)" : "rgba(36,97,204,0.3)",
    WAIT: theme === "dark" ? "rgba(255,204,92,0.3)" : "rgba(138,88,0,0.3)",
    STOP: theme === "dark" ? "rgba(255,123,123,0.3)" : "rgba(184,28,28,0.3)",
  };
  const verdictColor: Record<string, string> = { BUY: c.green, PARTIAL: c.accent, WAIT: c.yellow, STOP: c.red };

  return (
    <div>
      <div style={{ borderRadius: "16px", padding: "24px", marginBottom: "16px", textAlign: "center" as const, background: verdictBg[r.verdictClass], border: `1px solid ${verdictBorder[r.verdictClass]}` }}>
        <div style={{ fontSize: "28px", fontWeight: 700, marginBottom: "6px", color: verdictColor[r.verdictClass] }}>{r.verdict}</div>
        <p style={{ fontSize: "13px", lineHeight: 1.7, color: c.textSub }}>{r.verdictDesc}</p>
      </div>

      <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "20px", marginBottom: "12px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "12px", color: c.textFaint }}>종합 점수</p>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px", color: c.textDim }}>
          <span>투자 확신 지수</span><span style={{ color: r.barColor }}>{r.pct}점</span>
        </div>
        <div style={{ height: "6px", borderRadius: "3px", background: c.line, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: "3px", width: `${r.pct}%`, background: r.barColor, transition: "width 0.5s ease" }} />
        </div>
        {r.flags.length > 0 && (
          <div style={{ marginTop: "12px", padding: "12px 14px", borderRadius: "10px", background: theme === "dark" ? "#1a1026" : "#fff0f0", border: `1px solid ${c.red}33` }}>
            <p style={{ fontSize: "11px", fontWeight: 700, marginBottom: "6px", color: c.red }}>주의 요소</p>
            <div>{r.flags.map((f) => <Tag key={f} variant="red">{f}</Tag>)}</div>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[
          { label: "지금 행동", value: r.allocAction },
          { label: "자금 배분 상태", value: r.allocAdvice },
          { label: "종목 이해도", value: `${understanding}/10 — ${r.understandingLabel}`, color: r.understandingColor },
          { label: "핵심 원칙 리마인더", value: r.principleReminder, muted: true },
        ].map((item) => (
          <div key={item.label} style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "10px", padding: "14px" }}>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: "6px", color: c.textFaint }}>{item.label}</p>
            <p style={{ fontSize: item.muted ? "12px" : "13px", fontWeight: 500, lineHeight: 1.5, color: item.color ?? (item.muted ? c.textMuted : c.accentText) }}>{item.value}</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center" as const, marginTop: "20px" }}>
        <button onClick={onReset} style={{ padding: "10px 20px", borderRadius: "8px", border: `1px solid ${c.line}`, background: "transparent", color: c.textMuted, cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>↺ 처음부터 다시 평가하기</button>
      </div>
    </div>
  );
}

function AllocSlider({ allocPct, onChange }: { allocPct: number; onChange: (v: number) => void }) {
  const { theme } = useTheme();
  const c = THEME[theme];
  const msgs = [[16, "아직 진입 전 — 초기 진입 구간 검토 타이밍"], [50, "초기 20~30% 투입 완료 — 비관 구간 탄환 준비"], [80, "비관 구간까지 투입 — 패닉 구간 마지막 탄환 보존"], [101, "거의 풀투자 — 추가 기회 대응 어려움"]] as [number, string][];
  const msg = msgs.find((m) => allocPct < m[0])![1];
  const rem = 100 - allocPct;
  return (
    <div style={{ background: c.panel2, borderRadius: "8px", padding: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "12px", color: c.textDim }}>0%</span>
        <input type="range" min={0} max={100} step={5} value={allocPct} onChange={(e) => onChange(Number(e.target.value))} style={{ flex: 1, accentColor: c.accent }} />
        <span style={{ fontSize: "12px", color: c.textDim }}>100%</span>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "14px", fontWeight: 500, minWidth: "42px", textAlign: "right" as const, color: c.accent }}>{allocPct}%</span>
      </div>
      <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", height: "28px", margin: "12px 0" }}>
        <div style={{ width: `${allocPct}%`, background: c.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: allocPct > 8 ? c.bg : "transparent", transition: "width 0.3s" }}>
          {allocPct > 8 ? `${allocPct}%` : ""}
        </div>
        <div style={{ flex: 1, background: c.line, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: c.textDim }}>
          {rem > 10 ? `남은 ${rem}%` : ""}
        </div>
      </div>
      <p style={{ fontSize: "12px", color: c.accent }}>{msg}</p>
    </div>
  );
}

function StepNav({ current }: { current: number }) {
  const { theme } = useTheme();
  const c = THEME[theme];
  return (
    <div style={{ display: "flex", alignItems: "center", overflowX: "auto", marginBottom: "24px", gap: "0" }}>
      {STEPS.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px", borderRadius: "8px" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0, background: done ? c.green : active ? c.accent : c.line, color: done || active ? c.bg : c.textDim }}>
                {done ? "✓" : step.id}
              </div>
              <span style={{ fontSize: "12px", whiteSpace: "nowrap" as const, color: done ? c.green : active ? c.accent : c.textDim, fontWeight: active ? 500 : 400 }}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && <span style={{ fontSize: "12px", color: c.line, margin: "0 2px" }}>›</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardTab() {
  const { theme } = useTheme();
  const c = THEME[theme];
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [understanding, setUnderstanding] = useState(5);
  const [allocPct, setAllocPct] = useState(30);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (qid: string, idx: number, type: AnswerType) => setAnswers((prev) => ({ ...prev, [qid]: { idx, type } }));
  const reset = () => { setStep(1); setAnswers({}); setUnderstanding(5); setAllocPct(30); setShowResult(false); };

  const Btns = ({ prev, onNext, nextLabel = "다음 단계 →" }: { prev?: number; onNext?: () => void; nextLabel?: string }) => (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
      {prev !== undefined && <button onClick={() => setStep(prev)} style={{ padding: "10px 20px", borderRadius: "8px", border: `1px solid ${c.line}`, background: "transparent", color: c.textMuted, cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>← 이전</button>}
      <button onClick={onNext ?? (() => setStep(step + 1))} style={{ padding: "10px 20px", borderRadius: "8px", border: `1px solid ${c.accent}`, background: c.accent, color: c.bg, cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: 500 }}>{nextLabel}</button>
    </div>
  );

  const SliderCard = ({ label, value, setValue, min, max, display }: { label: string; value: number; setValue: (v: number) => void; min: number; max: number; display: string }) => (
    <div style={{ background: c.panel2, borderRadius: "8px", padding: "12px", marginTop: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "12px", color: c.textDim }}>전혀 모름</span>
        <input type="range" min={min} max={max} step={1} value={value} onChange={(e) => setValue(Number(e.target.value))} style={{ flex: 1, accentColor: c.accent }} />
        <span style={{ fontSize: "12px", color: c.textDim }}>완벽히 이해</span>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "14px", fontWeight: 500, minWidth: "36px", textAlign: "right" as const, color: c.accent }}>{display}</span>
      </div>
    </div>
  );

  const qProps = { answers, onSelect: handleSelect };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px", color: c.accentText }}>투자 판단 평가 도구</p>
        <p style={{ fontSize: "12px", color: c.textFaint }}>지금 상황을 내 투자 기준 프레임 안에서 스스로 평가해보세요</p>
      </div>

      <StepNav current={step} />

      {step === 1 && <div>
        <QCard stepN={1} qid="q1" question="지금 이 산업의 방향성은?" hint="단기 뉴스가 아니라 3~5년 시야로 봤을 때 구조적으로 성장하고 있는가" {...qProps}
          options={[{ label: "✅ 명확히 성장 중 — 패러다임 전환이 일어나고 있다", type: "good" }, { label: "🟡 성장하긴 하는데 속도나 방향이 불확실하다", type: "ok" }, { label: "🔴 산업 자체가 정체되거나 역풍을 맞고 있다", type: "bad" }]} />
        <QCard stepN={1} qid="q2" question="이 산업의 성장이 수요 폭발형인가, 공급 제약인가?" hint="AI → GPU 수요처럼 '수요가 공급을 압도'하는 구조가 가장 강력한 투자 근거다" {...qProps}
          options={[{ label: "✅ 수요가 구조적으로 폭발 중 — 공급이 따라가지 못한다", type: "good" }, { label: "🟡 수요와 공급이 균형을 맞춰가는 상황", type: "ok" }, { label: "🔴 공급 과잉 또는 수요 둔화가 보인다", type: "bad" }]} />
        <Btns onNext={() => setStep(2)} />
      </div>}

      {step === 2 && <div>
        <QCard stepN={2} qid="q3" question="이 기업의 기술이 시장을 바꾸는 수준인가?" hint="이 기업이 없으면 산업이 제대로 작동하지 않는가?" {...qProps}
          options={[{ label: "✅ 대체 불가능한 핵심 인프라 / 공급망 장악", type: "good" }, { label: "🟡 좋은 기업이지만 강력한 경쟁자가 있다", type: "ok" }, { label: "🔴 기술 우위가 불명확하거나 빠르게 추격당하고 있다", type: "bad" }]} />
        <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "20px", marginBottom: "14px" }}>
          <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "8px", color: c.textFaint }}>Step 2 · 기술 파괴력 평가</p>
          <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: c.accentText }}>이 기업의 성장 스토리를 나는 얼마나 이해하는가?</p>
          <p style={{ fontSize: "12px", marginBottom: "12px", color: c.textFaint }}>"내가 이해한 기술과 산업 흐름을 믿고 기다린다" — 이해 못 하면 하락 때 버티지 못한다</p>
          <SliderCard label="이해도" value={understanding} setValue={setUnderstanding} min={0} max={10} display={`${understanding}/10`} />
        </div>
        <Btns prev={1} />
      </div>}

      {step === 3 && <div>
        <QCard stepN={3} qid="q4" question="지금 하락의 원인은 무엇인가?" hint="하락의 성격을 정확히 구분하는 것이 매수 여부를 결정한다" {...qProps}
          options={[{ label: "✅ 단기 수급 문제 / 시장 전체 조정 / 과열 해소", type: "good" }, { label: "🟡 실적 쇼크나 일시적 이슈 — 구조는 안 바뀜", type: "ok" }, { label: "🔴 산업 자체나 기업 기술력에 구조적 문제 발생", type: "bad" }]} />
        <QCard stepN={3} qid="q5" question="현재 시장 분위기는?" hint="패닉 국면일수록 계층형 전략에서 더 큰 비중을 집행할 신호다" {...qProps}
          options={[{ label: "✅ 극도의 공포 / 거래량 폭증 / 개인들 패닉 셀", type: "good" }, { label: "🟡 어느 정도 조정 — 부정적이지만 극단은 아님", type: "ok" }, { label: "🔴 여전히 낙관적 / 아직 고통스럽지 않음", type: "bad" }]} />
        <Btns prev={2} />
      </div>}

      {step === 4 && <div>
        <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "20px", marginBottom: "14px" }}>
          <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "8px", color: c.textFaint }}>Step 4 · 자금 배분 점검</p>
          <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "8px", color: c.accentText }}>지금까지 이 종목에 투입한 자금은 전체의 몇 %인가?</p>
          <p style={{ fontSize: "12px", marginBottom: "12px", color: c.textFaint }}>계층형 전략: 초기 20~30% → 비관 구간 30~40% → 패닉 구간 30~40%</p>
          <AllocSlider allocPct={allocPct} onChange={setAllocPct} />
        </div>
        <QCard stepN={4} qid="q6" question="추가 투자할 여유 자금이 있는가?" hint="계층형 전략에서 패닉 구간 탄환이 남아있는지가 핵심이다" {...qProps}
          options={[{ label: "✅ 충분하다 — 패닉 구간에서 크게 태울 수 있다", type: "good" }, { label: "🟡 약간 있다 — 소량 추가는 가능하다", type: "ok" }, { label: "🔴 거의 없다 — 이미 총알을 많이 썼다", type: "bad" }]} />
        <Btns prev={3} />
      </div>}

      {step === 5 && <div>
        <QCard stepN={5} qid="q7" question='처음 이 종목에 투자한 핵심 논리가 지금도 유효한가?' hint='"논리가 살아있으면 버텨라. 논리가 깨지면 즉시 멈춰라"' {...qProps}
          options={[{ label: "✅ 완전히 유효 — 투자 논리가 전혀 흔들리지 않는다", type: "good" }, { label: "🟡 대체로 유효하지만 일부 우려 요소가 생겼다", type: "ok" }, { label: "🔴 논리가 흔들리거나 처음 예상과 다른 방향으로 가고 있다", type: "bad" }]} />
        <QCard stepN={5} qid="q8" question='"확신 기반"인가, "공포/탐욕 기반"인가?' hint="뉴스에 반응하고 있다면 공포/탐욕 기반일 가능성이 높다" {...qProps}
          options={[{ label: "✅ 확신 기반 — 내 분석으로 판단하고 있다", type: "good" }, { label: "🟡 반반 — 분석과 시장 분위기를 섞어서 보고 있다", type: "ok" }, { label: "🔴 공포/탐욕 기반 — 뉴스와 감정에 반응하고 있다", type: "bad" }]} />
        <Btns prev={4} onNext={() => { setStep(6); setShowResult(true); }} nextLabel="판단 결과 보기 →" />
      </div>}

      {step === 6 && showResult && <ResultView answers={answers} understanding={understanding} allocPct={allocPct} onReset={reset} />}
    </div>
  );
}
