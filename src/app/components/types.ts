export type AnswerType = "good" | "ok" | "bad";

export interface Answer {
  idx: number;
  type: AnswerType;
}

export type Answers = Record<string, Answer>;

export type VerdictClass = "BUY" | "PARTIAL" | "WAIT" | "STOP";

export interface VerdictResult {
  verdict: string;
  verdictClass: VerdictClass;
  verdictDesc: string;
  allocAction: string;
  pct: number;
  flags: string[];
  barColor: string;
  allocAdvice: string;
  understandingLabel: string;
  understandingColor: string;
  principleReminder: string;
  logicBroken: boolean;
}
