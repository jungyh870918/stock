"use client";

import { useTheme, THEME } from "@/app/context/ThemeContext";

/* ── 공통 스타일 헬퍼 ── */
function useC() {
  const { theme } = useTheme();
  return { c: THEME[theme], theme };
}

/* ── 외부 링크 ── */
function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  const { c } = useC();
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ color: c.accent, textDecoration: "none", borderBottom: `1px solid ${c.accent}55`, paddingBottom: "1px", fontSize: "inherit" }}>
      {children}
    </a>
  );
}

/* ── 섹션 구분선 ── */
function Rule() {
  const { c } = useC();
  return <hr style={{ border: "none", borderTop: `1px solid ${c.line}`, margin: "40px 0" }} />;
}

/* ── 큰 인용 블록 ── */
function Pullquote({ children }: { children: React.ReactNode }) {
  const { c } = useC();
  return (
    <blockquote style={{
      margin: "28px 0", padding: "20px 24px",
      borderLeft: `4px solid ${c.accent}`,
      background: c.panel2,
      borderRadius: "0 12px 12px 0",
    }}>
      <p style={{ fontSize: "16px", fontWeight: 500, lineHeight: 1.75, color: c.accentText, margin: 0 }}>
        {children}
      </p>
    </blockquote>
  );
}

/* ── 경고/강조 박스 ── */
function AlertBox({ variant, children }: { variant: "info" | "warn" | "danger" | "success"; children: React.ReactNode }) {
  const { c } = useC();
  const styles = {
    info:    { bg: c.hlBlueBg,   border: c.accent,  color: c.accentText },
    warn:    { bg: c.hlYellowBg, border: c.yellow,  color: c.yellowLight },
    danger:  { bg: c.hlRedBg,    border: c.red,     color: c.redLight },
    success: { bg: c.hlGreenBg,  border: c.green,   color: c.greenLight },
  }[variant];
  return (
    <div style={{ background: styles.bg, border: `1px solid ${styles.border}44`, borderLeft: `3px solid ${styles.border}`, borderRadius: "0 10px 10px 0", padding: "14px 18px", margin: "16px 0" }}>
      <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.75, color: styles.color }}>{children}</p>
    </div>
  );
}

/* ── 씬 박스 (예시/사례) ── */
function Scene({ label, children }: { label: string; children: React.ReactNode }) {
  const { c } = useC();
  return (
    <div style={{ background: c.sceneBg, border: `1px solid ${c.sceneBorder}`, borderRadius: "12px", padding: "18px 20px", margin: "16px 0" }}>
      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: c.textFaint, marginBottom: "10px", margin: "0 0 10px" }}>{label}</p>
      <p style={{ fontSize: "13px", lineHeight: 1.85, color: c.textMuted, margin: 0 }}>{children}</p>
    </div>
  );
}

/* ── 2단 비교 ── */
function CompareGrid({ left, right }: {
  left: { title: string; color: string; items: string[] };
  right: { title: string; color: string; items: string[] };
}) {
  const { c } = useC();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "16px 0" }}>
      {[left, right].map((col) => (
        <div key={col.title} style={{ background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "10px", padding: "14px 16px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: col.color, marginBottom: "10px" }}>{col.title}</p>
          <ul style={{ margin: 0, paddingLeft: "16px" }}>
            {col.items.map((item, i) => (
              <li key={i} style={{ fontSize: "12px", color: c.textSub, lineHeight: 1.7, marginBottom: "4px" }}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ── 본문 p ── */
function P({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const { c } = useC();
  return <p style={{ fontSize: "14px", lineHeight: 1.85, color: c.textSub, margin: "14px 0", ...style }}>{children}</p>;
}

/* ── 소제목 ── */
function H2({ children }: { children: React.ReactNode }) {
  const { c } = useC();
  return <h2 style={{ fontSize: "20px", fontWeight: 700, color: c.text, margin: "40px 0 8px", letterSpacing: "-0.01em" }}>{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  const { c } = useC();
  return <h3 style={{ fontSize: "15px", fontWeight: 700, color: c.accentText, margin: "28px 0 8px" }}>{children}</h3>;
}

/* ── 챕터 라벨 ── */
function ChapterLabel({ part, title }: { part: string; title: string }) {
  const { c } = useC();
  return (
    <div style={{ margin: "48px 0 20px" }}>
      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: c.accent, marginBottom: "6px" }}>{part}</p>
      <h2 style={{ fontSize: "24px", fontWeight: 700, color: c.text, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{title}</h2>
    </div>
  );
}

/* ── 계층형 배분 바 ── */
function AllocBar() {
  const { c } = useC();
  const segments = [
    { color: c.accent,  pct: 25, label: "초기 진입 20~30%", desc: "싸다는 판단이 선 첫 구간. 상승 초입을 놓치지 않기 위한 포지션." },
    { color: c.yellow,  pct: 37, label: "비관 구간 30~40%", desc: "시장이 공포로 과하게 반응할 때. 논리가 살아있는지 먼저 확인." },
    { color: c.green,   pct: 38, label: "패닉 구간 30~40%", desc: "거래량 폭증, 뉴스 최악, 개인 손절 쏟아지는 구간. 여기서 가장 크게 태운다." },
  ];
  return (
    <div style={{ margin: "20px 0 8px" }}>
      <div style={{ display: "flex", height: "10px", borderRadius: "5px", overflow: "hidden", marginBottom: "16px" }}>
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} />
        ))}
      </div>
      {segments.map((s) => (
        <div key={s.label} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: s.color, marginTop: "4px", flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: s.color, margin: "0 0 2px" }}>{s.label}</p>
            <p style={{ fontSize: "12px", color: "#8a93b8", margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   메인 컴포넌트
════════════════════════════════════════ */
export default function StrategyTab() {
  const { c } = useC();

  return (
    <article style={{ maxWidth: "720px", margin: "0 auto" }}>

      {/* ── 도입 ── */}
      <ChapterLabel part="Part 1 · 기술 기반 장기 투자 전략" title="주가를 움직이는 건 뉴스가 아니다" />

      <P>
        주가가 크게 오르는 날, 사람들은 그날의 뉴스를 이유로 든다. 금리가 어떻다, 실적이 어떻다, 누군가의 발언이 어땠다고. 하지만 그것은 인과관계가 뒤집힌 설명이다.
      </P>

      <Pullquote>
        뉴스는 주가 변동의 원인이 아니라, 이미 일어난 변동에 뒤늦게 붙는 설명이다. 진짜 원인은 그 훨씬 전부터 종목 안에 내재되어 있었다.
      </Pullquote>

      <P>
        실제로 강하게 오르는 종목들을 거슬러 올라가보면 공통점이 있다. 산업의 방향이 이미 바뀌고 있었고, 그 흐름 위에 기술적 파괴력을 가진 기업이 놓여 있었다는 것. 뉴스는 시장이 그것을 <strong style={{ color: c.accentText, fontWeight: 600 }}>뒤늦게 인식하는 순간</strong>에 터지는 것뿐이다.
      </P>

      <P>
        이 전략의 출발점은 그래서 하나다. 하루하루의 뉴스에 일희일비하지 않고, 내가 판단한 산업의 흐름과 종목의 기술력을 믿고 차분히 기다리는 것.
      </P>

      <Rule />

      {/* ── NVIDIA 사례 ── */}
      <H2>케이스 스터디 — NVIDIA와 AI 사이클</H2>

      <P>
        2022년 말 ChatGPT가 공개됐을 때, 대부분의 투자자들은 "OpenAI 관련주"를 찾거나 그날그날의 AI 뉴스를 추적했다. 하지만 구조를 먼저 본 투자자들은 다른 곳을 봤다.
      </P>

      <Scene label="구조적 인과 관계">
        AI 모델이 커질수록 학습에 필요한 GPU 수요가 기하급수적으로 늘어난다. 그리고 그 GPU를 사실상 독점 공급하는 기업이 NVIDIA다. 뉴스는 이후에 따라왔다 — "NVIDIA 실적 서프라이즈", "AI 칩 공급 부족". 그 뉴스들은 이미 구조적으로 예정된 결과였다.
      </Scene>

      <P>
        <ExternalLink href="https://www.etnews.com/20251201000349">전자신문 분석</ExternalLink>에 따르면 ChatGPT 출시 이후 3년 만에 NVIDIA 주가는 10배 이상 급등했다. 실제로 <ExternalLink href="https://siliconanalysts.com/analysis/nvidia-ai-accelerator-market-share-2024-2026">NVIDIA의 AI 가속기 시장 점유율</ExternalLink>은 2024년 기준 수익 기준 80~90%에 달했고, 데이터센터 매출은 2022년 150억 달러에서 2024년 1,000억 달러를 넘어섰다. 그리고 이 트렌드는 <ExternalLink href="https://io-fund.com/semiconductors/data-center/nvidia-ceo-predicts-ai-spending-will-increase-300-percent-in-3-years">2028년까지 300% 성장이 예측</ExternalLink>되는 구조적 흐름이다. 뉴스가 만든 상승이 아니라, 오를 수밖에 없어서 뉴스가 따라온 것이다.
      </P>

      <P>
        더스쿠프는 <ExternalLink href="https://www.thescoop.co.kr/news/articleView.html?idxno=58106">엔비디아 성장 비밀 특집</ExternalLink>에서 NVIDIA가 게임용 GPU 제조사에서 AI 혁명의 심장으로 올라선 과정을 상세히 분석했다. GPU의 병렬 연산 구조가 AI 학습에 최적화된 이유, 그리고 CUDA라는 소프트웨어 생태계가 경쟁자들이 따라오기 어려운 해자(moat)가 된 배경이 핵심이다.
      </P>
      <AlertBox variant="info">
        결론: 주가를 가장 강하게 견인하는 것은 '기술 파괴력 + 산업 흐름'이다. 이 두 가지가 맞아떨어지면 뉴스는 결과로 따라오게 되어 있다.
      </AlertBox>

      <Rule />

      {/* ── 투자 철학 ── */}
      <H2>투자 철학 — 세 가지 원칙</H2>

      <P>
        방향이 명확하면 하락이 오히려 반갑다. 더 싸게 살 수 있는 시간이 생기기 때문이다. 이 전략의 핵심은 내가 분석한 논리를 믿고, 시장보다 먼저 포지션을 잡는 것이다.
      </P>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const, margin: "16px 0" }}>
        {[
          { tag: "뉴스 = 결과",       desc: "주가가 움직인 이유를 사후적으로 설명하는 것" },
          { tag: "산업 흐름 = 원인",  desc: "3~5년 시야에서 수요가 구조적으로 바뀌고 있는가" },
          { tag: "기술 파괴력 = 트리거", desc: "기존 시장을 뒤집을 수 있는 기업인가" },
        ].map((item) => (
          <div key={item.tag} style={{ background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "10px", padding: "12px 16px", flex: "1 1 180px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: c.accent, marginBottom: "4px" }}>{item.tag}</p>
            <p style={{ fontSize: "12px", color: c.textMuted, margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <Pullquote>
        "내가 이해한 기술과 산업 흐름을 믿고 기다린다. 예측이 맞으면 시간이 증명해준다."
      </Pullquote>

      <Rule />

      {/* ── 저점 매수 ── */}
      <H2>투자 스타일 A — 저점 매수</H2>
      <P style={{ color: c.textFaint, fontSize: "13px", marginTop: "-8px" }}>성장 동력은 살아있는데 주가만 가혹하게 눌렸을 때</P>

      <H3>저점이 다져진다는 것이 실제로 어떤 모습인가</H3>
      <P>
        단순히 주가가 많이 떨어진 게 아니다. 산업 흐름과 기술력은 여전히 유효한데 시장이 과도하게 비관적으로 반응한 상태다. 차트에는 특징적인 신호가 나타난다.
      </P>

      <Scene label="저점 다지기 패턴">
        전저점 근처에서 몇 번을 더 찌르지만, 그때마다 <strong style={{ color: c.accentText }}>거래량이 줄어들면서</strong> 반등이 나온다. 팔 사람이 다 팔았고, 추가 하락을 기대했던 공매도 세력도 더 이상 힘을 못 쓰는 상태다. 주가가 좁은 밴드 안에서 횡보하기 시작하고, 악재 뉴스가 나와도 크게 빠지지 않는다. 그 <strong style={{ color: c.accentText }}>둔감해지는 순간</strong>이 저점이 다져지는 신호다.
      </Scene>

      <H3>케이스 — 한국 조선주</H3>
      <P>
        한국 조선주들은 2010년대 후반 수년간 수주 부진, 구조조정, 재무 악화로 장기 하락을 겪었다. 주가는 역사적 저점 근처에서 장기간 횡보했고 뉴스는 연일 부정적이었다. 하지만 구조는 바뀌고 있었다.
      </P>

      <Scene label="뉴스가 인식하기 전에 바뀐 것들">
        LNG선과 컨테이너선 발주 사이클이 돌아오기 시작했고, 중국 업체들이 따라올 수 없는 고부가가치 선박(LNG 운반선)의 수요가 살아나고 있었다. <ExternalLink href="https://www.mt.co.kr/stock/2023/05/25/2023052422474498368">머니투데이 2023년 분석</ExternalLink>에 따르면 LNG 운반선은 한국 조선사들이 전체 주문의 70%를 독점한 영역이다. 뉴스가 이를 인식한 건 주가가 이미 수백 퍼센트 오른 이후였다. <ExternalLink href="https://www.thepublic.kr/news/articleView.html?idxno=292979">2025년 빅3 합산 영업이익은 6조원을 넘겼다.</ExternalLink> 뉴스톱은 <ExternalLink href="https://www.newstof.com/news/articleView.html?idxno=27451">K-조선의 LNG선 수주 사이클 분석</ExternalLink>에서 "중국에서 안 지으면 한국으로 몰릴 수밖에 없는 구조"가 국내 조선사들에게 가격 결정력 우위를 가져다주고 있다고 진단했다.
      </Scene>

      <H3>진입 이후 — 버티는 것이 전략이다</H3>
      <P>
        저점에서 충분히 기다리며 들어갔다면, 상승 과정에서의 -10~15% 조정은 차익실현의 신호가 아니다. 봐야 할 것은 하나다. <strong style={{ color: c.accentText }}>상승 동력이 둔화됐는가, 산업의 기대감이 소진됐는가.</strong> 그 전까지는 자리를 지킨다.
      </P>

      <AlertBox variant="success">
        저점에서 들어갔다는 확신이 있을수록, 중간 조정에서 팔고 싶은 충동을 이길 수 있다.
      </AlertBox>

      <Rule />

      {/* ── 사이클 매수 ── */}
      <H2>투자 스타일 B — 사이클 매수</H2>
      <P style={{ color: c.textFaint, fontSize: "13px", marginTop: "-8px" }}>강한 종목의 눌림목, 바닥이 뾰족하고 체류 시간이 짧다</P>

      <P>
        일부 종목은 장기 우상향을 하면서도 중간에 극도로 격렬한 등락을 반복한다. 빅테크, 반도체 주요 종목, 레버리지 ETF가 그렇다. 이 종목들은 "저점을 탄탄히 다지는" 형태가 아니라 급등 후 급락이 짧고 강하게 온다.
      </P>

      <Scene label="실적 발표 후 급락 — NVDA, TSLA 사례">
        실적 발표 후 하루에 -10~15%가 빠지는 날이 있다. 뉴스는 "예상치 하회", "가이던스 실망"으로 가득 찬다. 주변에서 이제 끝났다는 말이 나온다. 하지만 이런 종목에서 이 정도 하락은 역사적으로 반복된 패턴이었다. 고점 대비 -20~30%까지 빠졌다가 수 주 안에 다시 전고점을 돌파하는 사이클. 이것이 "이 종목 특유의 사이클 저점"이다.
      </Scene>

      <Scene label="레버리지 ETF — TQQQ 사례">
        TQQQ(나스닥 3배 레버리지)는 장이 -3% 빠지는 날 -9% 이상 떨어진다. 그런데 장기적으로 나스닥이 우상향한다는 전제가 살아있다면, 이 -9% 구간은 매수 기회다. 핵심은 기초 지수의 방향성이 바뀌지 않았는지를 보는 것이지, 레버리지 ETF 자체의 일별 등락에 놀라지 않는 것이다. 실제로 <ExternalLink href="https://v.daum.net/v/GmoJ0bC2T7">블로터 넘버스 분석</ExternalLink>에 따르면 2020년 코로나 팬데믹 저점에서 TQQQ를 매수한 투자자는 연말까지 5.6배 수익을 거뒀다. <ExternalLink href="https://brunch.co.kr/@djlee118/4">한 개인 투자자의 실전 후기</ExternalLink>는 "4차 산업혁명에 대한 확신이 있다면 떨어질 때마다 분할 매수가 유효했다"고 회고한다.
      </Scene>

      <AlertBox variant="info">
        핵심: 이 종목이 "원래 이렇게 빠지는 종목"이라는 걸 알고 있으면, 하락이 공포가 아니라 타이밍이 된다.
      </AlertBox>

      <Rule />

      {/* ── 피해야 할 것 ── */}
      <H2>피해야 할 두 가지 함정</H2>

      <H3>함정 1 — 뉴스 하락에 반응하는 추격 매수</H3>
      <P>
        어떤 종목이 하루에 -8% 빠졌다. 뉴스가 퍼진다. 주변에서 "지금이 기회다"라는 말이 나온다. 이 상황에서 급히 진입하면 대체로 이틀을 더 버텨야 한다.
      </P>

      <Scene label="가짜 반등의 구조">
        악재 뉴스가 터진 직후에는 반드시 <strong style={{ color: c.accentText }}>가짜 반등</strong>이 온다. 단기 매도 세력이 차익실현하고 빠지면서 하루이틀 반등처럼 보인다. 여기서 "바닥 잡았다"고 생각하고 들어가면, 며칠 뒤 진짜 하락이 한 번 더 온다. 중간에 나타난 +3~4% 반등은 탈출 기회를 주는 함정이다. 급하게 들어갔기 때문에 이 반등에서 본전 심리로 팔고 나오게 된다. 결국 저점보다 비싸게 사서 중간 반등에 팔아버리는 최악의 패턴이 완성된다.
      </Scene>

      <AlertBox variant="danger">
        출발이 급하면 수익실현도 급해진다. 더 먹을 걸 못 먹는 이유가 바로 여기에 있다.
      </AlertBox>

      <H3>함정 2 — 상승 초입에서의 지나친 신중함</H3>
      <P>
        반대 방향의 실수도 있다. 오르기 시작한 종목을 보며 "이미 늦은 것 같다"고 생각하는 것.
      </P>

      <Scene label="30% 올랐어도 초입일 수 있다">
        전기차 섹터가 본격적으로 주목받기 시작한 2020년 초, 테슬라는 이미 1월에 50% 가까이 올라있었다. 그 시점에 "이미 너무 올랐다"고 판단한 사람들은 이후 5~10배의 상승을 모두 놓쳤다. 구조적인 상승 트렌드가 막 인식되기 시작하는 시점이라면, 이미 올라있는 30%는 이후 올라갈 300%에 비해 아무것도 아닌 숫자다. <ExternalLink href="https://seo.goover.ai/report/202503/go-public-report-ko-a5ae1b9d-ec98-4b06-bade-08d734341110-0-0.html">테슬라 주가 분석 리포트</ExternalLink>는 "2020년 전기차 수요 증가에 따른 급등은 구조적 전환의 시작이었으며, 2021년 S&P 500 편입과 실적 개선이 상승세를 뒷받침했다"고 기록하고 있다.
      </Scene>

      <AlertBox variant="info">
        확신이 있다면 "이미 30% 올랐다"는 사실이 망설임의 이유가 아니라, 방향이 맞다는 확인의 신호다.
      </AlertBox>

      <Rule />

      {/* ── 강점과 리스크 ── */}
      <H2>이 전략의 강점과 한계</H2>

      <CompareGrid
        left={{
          title: "✓ 강점",
          color: c.green,
          items: [
            "본질(기술+산업)을 보기 때문에 장기 트렌드에 올라탄다",
            "뉴스에 흔들리지 않으므로 충분한 수익을 끌어낼 수 있다",
            "저점을 기다리기 때문에 리스크 대비 수익 구조가 유리하다",
          ],
        }}
        right={{
          title: "⚠ 반드시 보완해야 할 것",
          color: c.red,
          items: [
            "저점 판단은 사후적으로만 확인된다 — 분할 진입이 필수",
            "확신이 클수록 과집중 투자 위험이 커진다",
            '"논리가 깨졌을 때 어떻게 나올 것인가" 규칙이 없으면 절반짜리 전략이다',
          ],
        }}
      />

      <AlertBox variant="warn">
        한 줄 결론: 방향 예측은 맞다. 완성된 전략이 되려면 "틀렸을 때의 출구 규칙"이 반드시 추가돼야 한다.
      </AlertBox>

      {/* ══════════════════════════════════════ */}
      <Rule />

      {/* ── Part 2 ── */}
      <ChapterLabel part="Part 2 · 자금 배분과 계층형 분할 전략" title='"결국 오른다"는 맞아도, 버티는 건 다른 문제다' />

      <P>
        강한 기술주들은 결국 방향대로 가는 경우가 많다. 하지만 문제는 이 한 가지다.
      </P>

      <Pullquote>
        -60%를 찍고 2년 후 회복 — 예측은 맞았지만 그 과정을 버티지 못했다면 실패한 투자다. 문제는 타이밍이 아니라 자금 배분이다.
      </Pullquote>

      <Rule />

      {/* ── 두 전략 비교 ── */}
      <H2>두 전략의 본질 비교</H2>

      <CompareGrid
        left={{
          title: "(A) 계속 물타기 (분할매수)",
          color: c.accent,
          items: [
            "장점: 평균단가 빠르게 낮춤, 상승 초입 놓치지 않음",
            "치명적 단점: 진짜 저점 전에 총알 소진",
            "→ 맞는 방향인데 돈이 먼저 죽는 전략",
          ],
        }}
        right={{
          title: "(B) 저점만 대기",
          color: c.accent,
          items: [
            "장점: 자금 보존, 한방 크게 먹을 수 있음",
            "치명적 단점: 저점은 지나고 나서만 보인다",
            "→ 안전하지만 기회를 놓칠 수 있는 전략",
          ],
        }}
      />

      <P>
        계속 물을 타는 방식도 아니고, 무작정 큰 저점만 기다리는 것도 아니다. 정답은 <strong style={{ color: c.accentText }}>처음부터 자금을 나눠놓고 계획대로만 들어가는 것</strong>이다.
      </P>

      <Rule />

      {/* ── 계층형 분할 전략 ── */}
      <H2>계층형 분할 전략 — 구간 기준으로 나눈다</H2>
      <P style={{ color: c.textFaint, fontSize: "13px", marginTop: "-8px" }}>총 투자금 = 100 기준. "시간 기준 분할"이 아니라 "구간(레벨) 기준 분할"이다.</P>

      <AllocBar />

      <Scene label="패닉 구간이 실제로 어떤 분위기인가">
        커뮤니티에 손절 인증이 쏟아진다. "더 떨어질 것 같아서 팔았다", "이 종목 이제 끝난 것 같다"는 글들이 넘친다. 반대로 거래량은 폭증한다. 평소보다 2~3배 이상의 거래량이 터지면서 주가는 장중에 -7~10%씩 출렁인다. 이것이 <strong style={{ color: c.accentText }}>공급이 수요를 압도하는 마지막 구간의 신호</strong>다. 여기서 가장 크게 들어갈 수 있는 사람이 결국 가장 큰 수익을 가져간다. 그 탄환을 남겨두는 게 계층형 전략의 핵심이다.
      </Scene>

      <P>
        한국경제는 <ExternalLink href="https://www.hankyung.com/article/2024040362751">나스닥 레버리지 ETF 비교 분석</ExternalLink>에서 "레버리지 상품은 추종 지수가 조정 없이 매일 우상향해야만 장기 보유 이득을 볼 수 있다"고 경고한다. 바꿔 말하면 나스닥 방향성에 대한 확신이 있을 때, 하락 구간을 분할로 매수하는 전략이 그 위험을 상쇄하는 현실적인 접근이다.
      </P>
      <AlertBox variant="info">
        "처음부터 자금을 나눠놓고 계획대로만 들어가라 — 감정이 아니라 구간이 트리거다"
      </AlertBox>

      <Rule />

      {/* ── 멈춰야 할 때 ── */}
      <H2>계속 사도 될 때 vs. 반드시 멈춰야 할 때</H2>

      <CompareGrid
        left={{
          title: "✓ 계속 사도 되는 하락",
          color: c.green,
          items: [
            "산업 성장 방향이 바뀌지 않았다",
            "기업 경쟁력·기술력 그대로다",
            "단기 수급·차익실현·시장 전체 조정이다",
            "예: AI 과열 조정, 금리 이슈로 인한 나스닥 전체 하락",
          ],
        }}
        right={{
          title: "✗ 반드시 멈춰야 하는 하락",
          color: c.red,
          items: [
            "기술 자체의 유효성이 흔들렸다",
            "구조적으로 더 강한 경쟁자가 나타났다",
            "산업의 방향 자체가 바뀌고 있다",
            "예: 기반 기술이 대체됨, 핵심 수요가 구조적으로 감소",
          ],
        }}
      />

      <Rule />

      {/* ── 최종 ── */}
      <H2>반드시 추가해야 하는 규칙 하나</H2>

      <P>
        이 규칙이 없으면 언젠가 크게 맞는다. 아무리 좋은 진입 전략을 갖고 있어도, "틀렸을 때 행동 규칙"이 없으면 전략은 절반짜리다.
      </P>

      <div style={{ background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "12px", padding: "20px 24px", margin: "16px 0" }}>
        <p style={{ fontSize: "12px", fontWeight: 700, color: c.textFaint, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: "12px" }}>틀렸을 때 행동 규칙</p>
        {[
          "-30%에서 재검토 — 처음 논리가 아직 유효한가?",
          "논리가 깨졌으면 즉시 중단 — 미련 갖지 않는다",
          "추가 매수 금지 — 논리 없는 물타기는 도박이다",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "8px" }}>
            <span style={{ color: c.accent, fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", flexShrink: 0 }}>0{i + 1}</span>
            <p style={{ fontSize: "13px", color: c.textSub, margin: 0, lineHeight: 1.6 }}>{item}</p>
          </div>
        ))}
      </div>

      <Pullquote>
        "확신이 있으면 분할로 싸우고, 확신이 깨지면 미련 없이 멈춰라."
      </Pullquote>

      <AlertBox variant="warn">
        맞는 방향 + 잘못된 자금 배분 = 실패. 전략은 진입만이 아니라 출구까지 설계돼야 완성된다.
      </AlertBox>

      {/* 하단 여백 */}
      <div style={{ height: "40px" }} />
    </article>
  );
}
