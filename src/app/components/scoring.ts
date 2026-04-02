import type { Answers, VerdictResult, VerdictClass } from "./types";

const Q_LABELS: Record<string, string> = {
  q1: "산업 방향",
  q2: "수요 구조",
  q3: "기술 파괴력",
  q4: "하락 성격",
  q5: "시장 분위기",
  q6: "자금 여력",
  q7: "핵심 논리",
  q8: "판단 기반",
};

export function calcScore(answers: Answers, understanding: number, allocPct: number): VerdictResult {
  let score = 0;
  const flags: string[] = [];

  Object.entries(answers).forEach(([qid, { type }]) => {
    if (type === "good") score += 2;
    else if (type === "ok") score += 1;
    else { score -= 1; flags.push(Q_LABELS[qid] ?? qid); }
  });

  if (understanding >= 8) score += 2;
  else if (understanding >= 5) score += 1;
  else { score -= 1; flags.push("종목 이해도"); }

  if (allocPct <= 30) score += 1;
  else if (allocPct > 60) { score -= 2; flags.push("자금 과다 투입"); }

  const logicBroken = answers["q7"]?.type === "bad";
  const pct = Math.max(0, Math.min(100, Math.round((score / 20) * 100)));

  let verdict: string;
  let verdictClass: VerdictClass;
  let verdictDesc: string;
  let allocAction: string;

  if (logicBroken) {
    verdict = "⛔ 매수 중단";
    verdictClass = "STOP";
    verdictDesc = "핵심 논리가 흔들리고 있습니다. 추가 매수를 중단하고 기존 포지션의 논리를 다시 점검하세요. \"확신이 깨지면 미련 없이 멈춰라\"";
    allocAction = "추가 매수 금지 / 손절 라인 재검토";
  } else if (score >= 12) {
    verdict = "🚀 강하게 진입";
    verdictClass = "BUY";
    verdictDesc = "모든 조건이 우호적입니다. 산업 흐름, 기술 파괴력, 하락 성격, 논리 모두 살아있습니다. 지금이 계층형 전략에서 공격적으로 비중을 태울 타이밍입니다.";
    allocAction = allocPct <= 30 ? "패닉 구간 탄환 남기고 비관 구간 비중 투입" : allocPct <= 60 ? "패닉 구간 탄환 보존, 소량 추가 가능" : "이미 고비중 — 추가 매수 신중";
  } else if (score >= 7) {
    verdict = "🟡 분할 매수 유지";
    verdictClass = "PARTIAL";
    verdictDesc = "전반적으로 우호적이지만 일부 불확실 요소가 있습니다. 계획된 구간별 분할 매수를 유지하되 단번에 큰 비중은 집행하지 마세요.";
    allocAction = "계획된 구간 분할 매수 유지 / 단발성 과잉 투입 금지";
  } else if (score >= 3) {
    verdict = "⏸ 관망 후 재평가";
    verdictClass = "WAIT";
    verdictDesc = "불확실 요소가 여러 개 겹칩니다. 핵심 논리를 재점검하고 시장 상황이 더 명확해진 뒤 결정하는 게 낫습니다.";
    allocAction = "신규 매수 보류 / 논리 재점검 선행";
  } else {
    verdict = "🔴 진입 재고";
    verdictClass = "STOP";
    verdictDesc = "여러 지표가 부정적입니다. 지금 진입은 \"맞는 방향인데 돈이 먼저 죽는 전략\"이 될 수 있습니다.";
    allocAction = "진입 재고 / 더 명확한 확신 생길 때까지 대기";
  }

  const barColor =
    verdictClass === "BUY" ? "#6ce88a" :
    verdictClass === "PARTIAL" ? "#8fb3ff" :
    verdictClass === "WAIT" ? "#ffcc5c" : "#ff7b7b";

  const rem = 100 - allocPct;
  const allocAdvice =
    allocPct <= 30 ? `초기 진입 구간. ${rem}%의 탄환이 남아있습니다. 계획대로 보존하세요.` :
    allocPct <= 60 ? `${rem}%를 패닉 구간을 위해 반드시 지키세요.` :
    allocPct <= 80 ? `${rem}%만 남았습니다. 추가 매수는 극도로 신중하게.` :
    "총알이 거의 없습니다. 지금 가장 중요한 건 보존입니다.";

  const understandingColor =
    understanding >= 7 ? "#6ce88a" : understanding >= 5 ? "#ffcc5c" : "#ff7b7b";
  const understandingLabel =
    understanding >= 7 ? "버틸 수 있는 수준" :
    understanding >= 5 ? "조금 더 공부 필요" :
    "이해 부족 → 흔들릴 가능성";

  const principleReminder = logicBroken
    ? '"논리가 깨지면 미련 없이 멈춰라"'
    : '"확신이 있다면 계획대로, 흔들리지 않는다"';

  return {
    verdict, verdictClass, verdictDesc, allocAction,
    pct, flags, barColor, allocAdvice,
    understandingColor, understandingLabel,
    principleReminder, logicBroken,
  };
}
