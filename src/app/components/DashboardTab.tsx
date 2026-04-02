"use client";

import { useState } from "react";
import type { Answers, AnswerType } from "./types";
import { calcScore } from "./scoring";
import { Card, Hl, Tag } from "./ui";

/* ─── step meta ─── */
const STEPS = [
  { id: 1, label: "산업 구조" },
  { id: 2, label: "기술 파괴력" },
  { id: 3, label: "현재 하락" },
  { id: 4, label: "자금 배분" },
  { id: 5, label: "논리 점검" },
  { id: 6, label: "결과" },
];

/* ─── choice button ─── */
function ChoiceBtn({
  label,
  state,
  onClick,
}: {
  label: string;
  state: "idle" | "good" | "ok" | "bad";
  onClick: () => void;
}) {
  const stateClass =
    state === "good" ? "choice-btn-selected" :
    state === "ok" ? "choice-btn-warn" :
    state === "bad" ? "choice-btn-danger" : "";
  return (
    <button
      onClick={onClick}
      className={`choice-btn ${stateClass}`}
      style={{ fontFamily: "inherit" }}
    >
      {label}
    </button>
  );
}

/* ─── question card ─── */
function QuestionCard({
  step,
  qid,
  question,
  hint,
  options,
  answers,
  onSelect,
}: {
  step: number;
  qid: string;
  question: string;
  hint: string;
  options: { label: string; type: AnswerType }[];
  answers: Answers;
  onSelect: (qid: string, idx: number, type: AnswerType) => void;
}) {
  return (
    <div className="rounded-[14px] p-5 mb-3.5" style={{ background: "#111526", border: "1px solid #1e2740" }}>
      <p className="text-[11px] font-bold tracking-[0.1em] uppercase mb-2" style={{ color: "#4a5580", fontFamily: "'IBM Plex Mono', monospace" }}>
        Step {step} · {["산업 구조 분석", "기술 파괴력 평가", "현재 하락 성격 분석", "자금 배분 점검", "핵심 논리 점검"][step - 1]}
      </p>
      <p className="text-[14px] font-medium mb-3.5 leading-snug" style={{ color: "#c8d4ff" }}>{question}</p>
      <p className="text-[12px] mb-3.5 leading-relaxed" style={{ color: "#4a5580" }}>{hint}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => (
          <ChoiceBtn
            key={i}
            label={opt.label}
            state={answers[qid]?.idx === i ? answers[qid].type : "idle"}
            onClick={() => onSelect(qid, i, opt.type)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── result view ─── */
function ResultView({ answers, understanding, allocPct, onReset }: {
  answers: Answers;
  understanding: number;
  allocPct: number;
  onReset: () => void;
}) {
  const r = calcScore(answers, understanding, allocPct);

  const verdictBg: Record<string, string> = {
    BUY: "rgba(108,232,138,0.1)",
    PARTIAL: "rgba(143,179,255,0.1)",
    WAIT: "rgba(255,204,92,0.1)",
    STOP: "rgba(255,123,123,0.1)",
  };
  const verdictBorder: Record<string, string> = {
    BUY: "rgba(108,232,138,0.3)",
    PARTIAL: "rgba(143,179,255,0.3)",
    WAIT: "rgba(255,204,92,0.3)",
    STOP: "rgba(255,123,123,0.3)",
  };
  const verdictColor: Record<string, string> = {
    BUY: "#6ce88a", PARTIAL: "#8fb3ff", WAIT: "#ffcc5c", STOP: "#ff7b7b",
  };

  return (
    <div>
      {/* verdict card */}
      <div className="rounded-2xl p-6 mb-4 text-center" style={{ background: verdictBg[r.verdictClass], border: `1px solid ${verdictBorder[r.verdictClass]}` }}>
        <div className="text-[28px] font-bold mb-1.5 tracking-wide" style={{ color: verdictColor[r.verdictClass] }}>
          {r.verdict}
        </div>
        <p className="text-[13px] leading-7" style={{ color: "#9aa3c8" }}>{r.verdictDesc}</p>
      </div>

      {/* score bar */}
      <div className="rounded-[14px] p-5 mb-3" style={{ background: "#111526", border: "1px solid #1e2740" }}>
        <p className="text-[11px] font-bold tracking-[0.1em] uppercase mb-3" style={{ color: "#4a5580", fontFamily: "'IBM Plex Mono', monospace" }}>종합 점수</p>
        <div className="flex justify-between text-[12px] mb-1.5" style={{ color: "#5a6490" }}>
          <span>투자 확신 지수</span>
          <span style={{ color: r.barColor }}>{r.pct}점</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1e2740" }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${r.pct}%`, background: r.barColor }} />
        </div>
        {r.flags.length > 0 && (
          <div className="mt-3 p-3 rounded-[10px]" style={{ background: "#1a1026", border: "1px solid rgba(255,123,123,0.2)" }}>
            <p className="text-[11px] font-bold mb-1.5" style={{ color: "#ff7b7b" }}>주의 요소</p>
            <div>{r.flags.map((f) => <Tag key={f} variant="red">{f}</Tag>)}</div>
          </div>
        )}
      </div>

      {/* action grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {[
          { label: "지금 행동", value: r.allocAction },
          { label: "자금 배분 상태", value: r.allocAdvice },
          { label: "종목 이해도", value: `${understanding}/10 — ${r.understandingLabel}`, color: r.understandingColor },
          { label: "핵심 원칙 리마인더", value: r.principleReminder, muted: true },
        ].map((item) => (
          <div key={item.label} className="rounded-[10px] p-3.5" style={{ background: "#111526", border: "1px solid #1e2740" }}>
            <p className="text-[11px] uppercase tracking-[0.08em] mb-1.5" style={{ color: "#4a5580", fontFamily: "'IBM Plex Mono', monospace" }}>{item.label}</p>
            <p className="text-[13px] font-medium leading-relaxed" style={{ color: item.color ?? (item.muted ? "#8a93b8" : "#c8d4ff"), fontSize: item.muted ? "12px" : undefined }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center mt-5">
        <button onClick={onReset} className="db-btn" style={{ fontFamily: "inherit" }}>↺ 처음부터 다시 평가하기</button>
      </div>
    </div>
  );
}

/* ─── alloc slider card ─── */
function AllocSliderCard({ allocPct, onChange }: { allocPct: number; onChange: (v: number) => void }) {
  const msgs = [
    [16, "아직 진입 전 — 초기 진입 구간 검토 타이밍"],
    [50, "초기 20~30% 투입 완료 — 비관 구간 탄환 준비"],
    [80, "비관 구간까지 투입 — 패닉 구간 마지막 탄환 보존"],
    [101, "거의 풀투자 — 추가 기회 대응 어려움"],
  ] as [number, string][];
  const msg = msgs.find((m) => allocPct < m[0])![1];
  const rem = 100 - allocPct;

  return (
    <div className="rounded-[8px] p-3" style={{ background: "#161c34" }}>
      <div className="flex items-center gap-3">
        <span className="text-[12px]" style={{ color: "#5a6490" }}>0%</span>
        <input
          type="range" min={0} max={100} step={5} value={allocPct}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-[12px]" style={{ color: "#5a6490" }}>100%</span>
        <span className="text-[14px] font-medium min-w-[42px] text-right" style={{ color: "#8fb3ff", fontFamily: "'IBM Plex Mono', monospace" }}>{allocPct}%</span>
      </div>
      <div className="flex rounded-lg overflow-hidden h-7 my-3">
        <div className="flex items-center justify-center text-[10px] font-bold transition-all duration-500" style={{ width: `${allocPct}%`, background: "#8fb3ff", color: "#0c0f1a", minWidth: allocPct > 8 ? undefined : "0" }}>
          {allocPct > 8 ? `${allocPct}%` : ""}
        </div>
        <div className="flex items-center justify-center text-[10px] transition-all duration-500" style={{ width: `${rem}%`, background: "#1e2740", color: "#5a6490" }}>
          {rem > 10 ? `남은 ${rem}%` : ""}
        </div>
      </div>
      <p className="text-[12px]" style={{ color: "#8fb3ff" }}>{msg}</p>
    </div>
  );
}

/* ─── step nav ─── */
function StepNav({ current, maxReached }: { current: number; maxReached: number }) {
  return (
    <div className="flex items-center overflow-x-auto mb-6 gap-0">
      {STEPS.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;
        return (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg">
              <div
                className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{
                  background: done ? "#6ce88a" : active ? "#8fb3ff" : "#1e2740",
                  color: done || active ? "#0c0f1a" : "#5a6490",
                }}
              >
                {done ? "✓" : step.id}
              </div>
              <span className="text-[12px] whitespace-nowrap" style={{ color: done ? "#6ce88a" : active ? "#8fb3ff" : "#5a6490", fontWeight: active ? 500 : 400 }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="text-[12px] mx-0.5" style={{ color: "#2a3254" }}>›</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── main component ─── */
export default function DashboardTab() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [understanding, setUnderstanding] = useState(5);
  const [allocPct, setAllocPct] = useState(30);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (qid: string, idx: number, type: AnswerType) => {
    setAnswers((prev) => ({ ...prev, [qid]: { idx, type } }));
  };

  const reset = () => {
    setStep(1);
    setAnswers({});
    setUnderstanding(5);
    setAllocPct(30);
    setShowResult(false);
  };

  const NavButtons = ({ prev, onNext, nextLabel = "다음 단계 →" }: { prev?: number; onNext?: () => void; nextLabel?: string }) => (
    <div className="flex justify-end gap-2.5 mt-5">
      {prev !== undefined && (
        <button onClick={() => setStep(prev)} className="db-btn" style={{ fontFamily: "inherit" }}>← 이전</button>
      )}
      <button
        onClick={onNext ?? (() => setStep(step + 1))}
        className="db-btn db-btn-primary"
        style={{ fontFamily: "inherit" }}
      >
        {nextLabel}
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <p className="text-[18px] font-bold mb-1" style={{ color: "#c8d4ff" }}>투자 판단 평가 도구</p>
        <p className="text-[12px]" style={{ color: "#4a5580" }}>지금 상황을 내 투자 기준 프레임 안에서 스스로 평가해보세요</p>
      </div>

      <StepNav current={step} maxReached={step} />

      {/* ── Step 1 ── */}
      {step === 1 && (
        <div>
          <QuestionCard step={1} qid="q1" question="지금 이 산업의 방향성은?" hint="단기 뉴스가 아니라 3~5년 시야로 봤을 때 구조적으로 성장하고 있는가" answers={answers} onSelect={handleSelect}
            options={[
              { label: "✅ 명확히 성장 중 — 패러다임 전환이 일어나고 있다", type: "good" },
              { label: "🟡 성장하긴 하는데 속도나 방향이 불확실하다", type: "ok" },
              { label: "🔴 산업 자체가 정체되거나 역풍을 맞고 있다", type: "bad" },
            ]}
          />
          <QuestionCard step={1} qid="q2" question="이 산업의 성장이 수요 폭발형인가, 공급 제약인가?" hint="AI → GPU 수요처럼 '수요가 공급을 압도'하는 구조가 가장 강력한 투자 근거다" answers={answers} onSelect={handleSelect}
            options={[
              { label: "✅ 수요가 구조적으로 폭발 중 — 공급이 따라가지 못한다", type: "good" },
              { label: "🟡 수요와 공급이 균형을 맞춰가는 상황", type: "ok" },
              { label: "🔴 공급 과잉 또는 수요 둔화가 보인다", type: "bad" },
            ]}
          />
          <NavButtons onNext={() => setStep(2)} />
        </div>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && (
        <div>
          <QuestionCard step={2} qid="q3" question="이 기업의 기술이 시장을 바꾸는 수준인가?" hint="이 기업이 없으면 산업이 제대로 작동하지 않는가?" answers={answers} onSelect={handleSelect}
            options={[
              { label: "✅ 대체 불가능한 핵심 인프라 / 공급망 장악", type: "good" },
              { label: "🟡 좋은 기업이지만 강력한 경쟁자가 있다", type: "ok" },
              { label: "🔴 기술 우위가 불명확하거나 빠르게 추격당하고 있다", type: "bad" },
            ]}
          />
          <div className="rounded-[14px] p-5 mb-3.5" style={{ background: "#111526", border: "1px solid #1e2740" }}>
            <p className="text-[11px] font-bold tracking-[0.1em] uppercase mb-2" style={{ color: "#4a5580", fontFamily: "'IBM Plex Mono', monospace" }}>Step 2 · 기술 파괴력 평가</p>
            <p className="text-[14px] font-medium mb-2 leading-snug" style={{ color: "#c8d4ff" }}>이 기업의 성장 스토리를 나는 얼마나 이해하는가?</p>
            <p className="text-[12px] mb-3 leading-relaxed" style={{ color: "#4a5580" }}>"내가 이해한 기술과 산업 흐름을 믿고 기다린다" — 이해 못 하면 하락 때 버티지 못한다</p>
            <div className="rounded-[8px] p-3" style={{ background: "#161c34" }}>
              <div className="flex items-center gap-3">
                <span className="text-[12px]" style={{ color: "#5a6490" }}>전혀 모름</span>
                <input type="range" min={0} max={10} step={1} value={understanding} onChange={(e) => setUnderstanding(Number(e.target.value))} className="flex-1" />
                <span className="text-[12px]" style={{ color: "#5a6490" }}>완벽히 이해</span>
                <span className="text-[14px] font-medium min-w-[36px] text-right" style={{ color: "#8fb3ff", fontFamily: "'IBM Plex Mono', monospace" }}>{understanding}/10</span>
              </div>
            </div>
          </div>
          <NavButtons prev={1} />
        </div>
      )}

      {/* ── Step 3 ── */}
      {step === 3 && (
        <div>
          <QuestionCard step={3} qid="q4" question="지금 하락의 원인은 무엇인가?" hint="하락의 성격을 정확히 구분하는 것이 매수 여부를 결정한다" answers={answers} onSelect={handleSelect}
            options={[
              { label: "✅ 단기 수급 문제 / 시장 전체 조정 / 과열 해소", type: "good" },
              { label: "🟡 실적 쇼크나 일시적 이슈 — 구조는 안 바뀜", type: "ok" },
              { label: "🔴 산업 자체나 기업 기술력에 구조적 문제 발생", type: "bad" },
            ]}
          />
          <QuestionCard step={3} qid="q5" question="현재 시장 분위기는?" hint="패닉 국면일수록 계층형 전략에서 더 큰 비중을 집행할 신호다" answers={answers} onSelect={handleSelect}
            options={[
              { label: "✅ 극도의 공포 / 거래량 폭증 / 개인들 패닉 셀", type: "good" },
              { label: "🟡 어느 정도 조정 — 부정적이지만 극단은 아님", type: "ok" },
              { label: "🔴 여전히 낙관적 / 아직 고통스럽지 않음", type: "bad" },
            ]}
          />
          <NavButtons prev={2} />
        </div>
      )}

      {/* ── Step 4 ── */}
      {step === 4 && (
        <div>
          <div className="rounded-[14px] p-5 mb-3.5" style={{ background: "#111526", border: "1px solid #1e2740" }}>
            <p className="text-[11px] font-bold tracking-[0.1em] uppercase mb-2" style={{ color: "#4a5580", fontFamily: "'IBM Plex Mono', monospace" }}>Step 4 · 자금 배분 점검</p>
            <p className="text-[14px] font-medium mb-2 leading-snug" style={{ color: "#c8d4ff" }}>지금까지 이 종목에 투입한 자금은 전체의 몇 %인가?</p>
            <p className="text-[12px] mb-3 leading-relaxed" style={{ color: "#4a5580" }}>계층형 전략: 초기 20~30% → 비관 구간 30~40% → 패닉 구간 30~40%</p>
            <AllocSliderCard allocPct={allocPct} onChange={setAllocPct} />
          </div>
          <QuestionCard step={4} qid="q6" question="추가 투자할 여유 자금이 있는가?" hint="계층형 전략에서 패닉 구간 탄환이 남아있는지가 핵심이다" answers={answers} onSelect={handleSelect}
            options={[
              { label: "✅ 충분하다 — 패닉 구간에서 크게 태울 수 있다", type: "good" },
              { label: "🟡 약간 있다 — 소량 추가는 가능하다", type: "ok" },
              { label: "🔴 거의 없다 — 이미 총알을 많이 썼다", type: "bad" },
            ]}
          />
          <NavButtons prev={3} />
        </div>
      )}

      {/* ── Step 5 ── */}
      {step === 5 && (
        <div>
          <QuestionCard step={5} qid="q7" question="처음 이 종목에 투자한 핵심 논리가 지금도 유효한가?" hint='"논리가 살아있으면 버텨라. 논리가 깨지면 즉시 멈춰라"' answers={answers} onSelect={handleSelect}
            options={[
              { label: "✅ 완전히 유효 — 투자 논리가 전혀 흔들리지 않는다", type: "good" },
              { label: "🟡 대체로 유효하지만 일부 우려 요소가 생겼다", type: "ok" },
              { label: "🔴 논리가 흔들리거나 처음 예상과 다른 방향으로 가고 있다", type: "bad" },
            ]}
          />
          <QuestionCard step={5} qid="q8" question='지금 내 판단이 "확신 기반"인가, "공포/탐욕 기반"인가?' hint="뉴스에 반응하고 있다면 공포/탐욕 기반일 가능성이 높다" answers={answers} onSelect={handleSelect}
            options={[
              { label: "✅ 확신 기반 — 내 분석으로 판단하고 있다", type: "good" },
              { label: "🟡 반반 — 분석과 시장 분위기를 섞어서 보고 있다", type: "ok" },
              { label: "🔴 공포/탐욕 기반 — 뉴스와 감정에 반응하고 있다", type: "bad" },
            ]}
          />
          <NavButtons prev={4} onNext={() => { setStep(6); setShowResult(true); }} nextLabel="판단 결과 보기 →" />
        </div>
      )}

      {/* ── Step 6: Result ── */}
      {step === 6 && showResult && (
        <ResultView answers={answers} understanding={understanding} allocPct={allocPct} onReset={reset} />
      )}
    </div>
  );
}
