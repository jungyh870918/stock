import {
  SectionLabel,
  GroupHeading,
  Card,
  CardTitle,
  BodyText,
  Hl,
  SceneBox,
  MiniCard,
  Split2,
  Divider,
  Tag,
} from "./ui";

export default function StrategyTab() {
  return (
    <div>
      {/* ── 정리 1 ── */}
      <SectionLabel>정리 1 · 기술 기반 장기 투자 전략</SectionLabel>

      <GroupHeading>1. 핵심 전제 — 뉴스는 결과다</GroupHeading>
      <Card>
        <CardTitle>주가는 무엇이 만드는가</CardTitle>
        <BodyText>
          주가가 오르는 날, 사람들은 그날의 뉴스를 이유로 든다. 금리가 어떻다, 실적이 어떻다,
          누군가의 발언이 어땠다고. 하지만 그것은 인과관계가 뒤집힌 설명이다.{" "}
          <strong className="font-medium" style={{ color: "#c8d4ff" }}>
            뉴스는 주가 변동의 원인이 아니라 변동에 붙는 설명이다.
          </strong>{" "}
          진짜 원인은 이미 그 종목 안에 내재되어 있다.
        </BodyText>
        <BodyText>
          실제로 강하게 오르는 종목을 거슬러 올라가보면 공통점이 있다. 산업의 방향이 이미
          바뀌고 있었고, 그 흐름 위에 기술적 파괴력을 가진 기업이 놓여 있었다는 것. 뉴스는
          시장이 그것을 뒤늦게 인식하는 순간에 터지는 것뿐이다.
        </BodyText>
        <Split2>
          <MiniCard>
            <p className="text-[12px] font-bold mb-1.5" style={{ color: "#8fb3ff" }}>
              산업의 구조적 변화
            </p>
            <ul className="list-disc pl-3.5 space-y-1 text-[12px]" style={{ color: "#8a93b8" }}>
              <li>3~5년 시야에서 이 산업이 커지는가</li>
              <li>사회와 기술의 패러다임이 전환 중인가</li>
              <li>수요가 공급을 압도하는 구조인가</li>
            </ul>
          </MiniCard>
          <MiniCard>
            <p className="text-[12px] font-bold mb-1.5" style={{ color: "#8fb3ff" }}>
              기업의 기술적 파괴력 ★
            </p>
            <ul className="list-disc pl-3.5 space-y-1 text-[12px]" style={{ color: "#8a93b8" }}>
              <li>이 기업이 없으면 산업이 작동 안 하는가</li>
              <li>공급망·인프라의 핵심 노드를 장악했는가</li>
              <li>경쟁자가 쉽게 따라올 수 없는가</li>
            </ul>
          </MiniCard>
        </Split2>
        <SceneBox label="실제 사례 — NVIDIA / AI 사이클">
          2022년 말 ChatGPT가 등장했을 때, 주가에 민감한 사람들 대부분은 "OpenAI 관련 주"를
          찾거나 그날그날의 AI 뉴스를 추적했다. 하지만 진짜 수혜 구조를 본 투자자들은 다른 곳을
          봤다.{" "}
          <em style={{ color: "#c8d4ff", fontStyle: "normal", fontWeight: 500 }}>
            AI 모델이 커질수록 학습에 필요한 GPU의 수요가 기하급수적으로 늘어난다
          </em>
          는 것. 그리고 그 GPU를 사실상 독점 공급하는 기업이 NVIDIA라는 것. 뉴스는 이후에
          따라왔다. "NVIDIA 실적 서프라이즈", "AI 칩 공급 부족". 그 뉴스들은 이미 구조적으로
          예정된 결과였다. 트렌드는 이후 2~3년간 쉬지 않고 이어졌다.
        </SceneBox>
        <Hl>결론: 뉴스를 보는 게 아니라 뉴스가 왜 나올 수밖에 없는지를 먼저 보는 것이 투자다</Hl>
      </Card>

      <GroupHeading>2. 투자 철학</GroupHeading>
      <Card>
        <BodyText>
          하루하루 시세를 보면서 흔들리는 건 방향이 없기 때문이다. 방향이 명확하면 오히려
          하락이 반갑다. 더 싸게 살 수 있는 시간이 생기기 때문이다. 이 전략의 핵심은{" "}
          <strong className="font-medium" style={{ color: "#c8d4ff" }}>
            내가 분석한 논리를 믿고 시장보다 먼저 포지션을 잡는 것
          </strong>
          이다. 시장이 그것을 인식하는 순간, 상승은 저절로 따라온다.
        </BodyText>
        <div className="my-2">
          <Tag variant="blue">뉴스 = 결과</Tag>
          <Tag variant="blue">산업 흐름 = 원인</Tag>
          <Tag variant="blue">기술 파괴력 = 트리거</Tag>
        </div>
        <Hl>"내가 이해한 기술과 산업 흐름을 믿고 기다린다 — 예측이 맞으면 시간이 증명해준다"</Hl>
      </Card>

      <GroupHeading>3. 투자 스타일 A — 저점 매수 (구조적 저평가 종목)</GroupHeading>
      <Card>
        <CardTitle>성장 동력은 살아있는데 주가만 가혹하게 눌렸을 때</CardTitle>
        <BodyText>
          이 전략이 적용되는 종목은 단순히 떨어진 게 아니다. 산업 흐름과 기술력은 여전히
          유효한데, 시장이 과도하게 비관적으로 반응한 상태다.
        </BodyText>
        <SceneBox label="저점을 다진다는 것이 실제로 어떤 모습인가">
          차트를 보면 하락이 끝난 자리에서 특징적인 패턴이 나타난다. 전저점 근처에서 몇 번을 더
          찌르지만 그때마다{" "}
          <em style={{ color: "#c8d4ff", fontStyle: "normal", fontWeight: 500 }}>
            거래량이 줄어들면서
          </em>{" "}
          반등이 나온다. 즉, 팔 사람이 다 팔았고, 추가 하락을 기대하고 공매도를 친 세력도 더
          이상 힘을 쓰지 못하는 상태다. 주가가 일정 밴드 안에서 좁게 횡보하기 시작하고, 악재
          뉴스가 나와도 크게 빠지지 않는다.{" "}
          <em style={{ color: "#c8d4ff", fontStyle: "normal", fontWeight: 500 }}>
            그 둔감해지는 순간이 저점이 다져지는 신호다.
          </em>
        </SceneBox>
        <SceneBox label="실제 사례 — 조선주 저점 구간">
          한국 조선주들은 2010년대 후반 수년간 수주 부진, 구조조정, 재무 악화로 장기 하락을
          겪었다. 그 과정에서 주가는 역사적 저점 근처에서 장기간 횡보했다. 뉴스는 연일 부정적이었다.
          하지만 구조는 바뀌고 있었다.{" "}
          <em style={{ color: "#c8d4ff", fontStyle: "normal", fontWeight: 500 }}>
            LNG선과 컨테이너선 발주 사이클이 돌아오기 시작했고, 한국 조선사만 지을 수 있는
            고부가가치 선박의 수요가 살아나고 있었다.
          </em>{" "}
          뉴스가 이를 인식한 건 주가가 이미 수백 퍼센트 오른 이후였다.
        </SceneBox>
        <Divider />
        <CardTitle>진입 이후 — 버티는 것이 전략이다</CardTitle>
        <BodyText>
          저점에서 충분히 기다리며 들어갔다면, 올라가는 과정에서의 조정은 당연한 것으로
          받아들인다. 상승 중 -10%, -15% 조정은 차익실현의 신호가 아니다.{" "}
          <strong className="font-medium" style={{ color: "#c8d4ff" }}>
            상승 동력이 둔화됐는가, 산업의 기대감이 소진됐는가
          </strong>
          를 봐야 한다. 그 전까지는 자리를 지킨다.
        </BodyText>
        <Hl variant="green">
          저점에서 들어갔다는 확신이 있을수록, 중간 조정에서 팔고 싶은 충동을 이길 수 있다
        </Hl>
      </Card>

      <GroupHeading>4. 투자 스타일 B — 사이클 매수 (강한 종목의 눌림목)</GroupHeading>
      <Card>
        <CardTitle>오르고 빠지고, 또 오르고 — 이 패턴 자체가 종목의 특성이다</CardTitle>
        <BodyText>
          일부 종목은 장기 우상향을 하면서도 중간에 극도로 격렬한 등락을 반복한다. 빅테크,
          반도체 주요 종목, 레버리지 ETF가 그렇다. 이 종목들은 "저점을 탄탄히 다지는" 형태가
          아니라{" "}
          <strong className="font-medium" style={{ color: "#c8d4ff" }}>
            급등 후 급락이 짧고 강하게 온다.
          </strong>{" "}
          바닥 구간이 뾰족하고 체류 시간이 짧다.
        </BodyText>
        <SceneBox label="사이클이 강한 종목 — 실제로 어떤 상황인가">
          예를 들어 NVDA나 TSLA 같은 종목을 보면, 실적 발표 후{" "}
          <em style={{ color: "#c8d4ff", fontStyle: "normal", fontWeight: 500 }}>
            하루에 -10~15%가 빠지는 날이 있다.
          </em>{" "}
          그날 뉴스는 "예상치 하회", "가이던스 실망" 같은 표현으로 가득 찬다. 주변에서는 이제
          끝났다는 말이 나온다. 하지만 이런 종목에서 이 정도 하락은 역사적으로 반복된 패턴이었다.
          실적 발표 후 단기 차익실현이 쏟아지고, 고점 대비 -20~30%까지 빠졌다가 수 주 안에 다시
          전고점을 돌파하는 사이클. 이것이{" "}
          <em style={{ color: "#c8d4ff", fontStyle: "normal", fontWeight: 500 }}>
            "이 종목 특유의 사이클 저점"
          </em>
          이다.
        </SceneBox>
        <SceneBox label="레버리지 ETF에서 이 전략이 작동하는 이유">
          TQQQ(나스닥 3배 레버리지)는 장이 -3% 빠지는 날 -9% 이상 떨어진다. 그런데 장기적으로
          나스닥이 우상향한다는 전제가 살아있다면,{" "}
          <em style={{ color: "#c8d4ff", fontStyle: "normal", fontWeight: 500 }}>
            이 -9% 구간은 매수 기회다.
          </em>{" "}
          핵심은 기초 지수의 방향성이 바뀌지 않았는지를 보는 것이지, 레버리지 ETF 자체의 일별
          등락에 놀라지 않는 것이다.
        </SceneBox>
        <Hl>
          핵심: 이 종목이 "원래 이렇게 빠지는 종목"이라는 걸 알고 있으면, 하락이 공포가 아니라
          타이밍이 된다
        </Hl>
      </Card>

      <GroupHeading>5. 피해야 할 것 — 출발이 급하면 끝도 급하다</GroupHeading>
      <Card>
        <CardTitle>함정 1 — 뉴스 하락에 반응하는 추격 매수</CardTitle>
        <BodyText>
          어떤 종목이 하루에 -8% 빠졌다. 뉴스가 퍼진다. 주변에서 "지금이 기회다"라는 말이 나온다.
          이 상황에서 급히 진입하면 대체로 다음 이틀을 더 버텨야 한다.
        </BodyText>
        <SceneBox label="왜 뉴스 하락 직후 진입이 위험한가">
          악재 뉴스가 터진 직후에는 반드시{" "}
          <em style={{ color: "#c8d4ff", fontStyle: "normal", fontWeight: 500 }}>
            가짜 반등
          </em>
          이 온다. 단기 매도 세력이 차익실현하고 빠지면서 하루이틀 반등처럼 보인다. 이 구간에서
          "바닥 잡았다"고 생각하고 들어가면, 이후 이틀~사흘 뒤에 진짜 하락이 한 번 더 온다.{" "}
          <em style={{ color: "#c8d4ff", fontStyle: "normal", fontWeight: 500 }}>
            중간에 나타난 +3~4% 반등은 탈출 기회를 주는 함정이다.
          </em>{" "}
          급하게 들어갔기 때문에 이 반등에서 본전 심리로 팔고 나오게 된다. 결국 저점보다 비싸게
          사서 중간 반등에 팔아버리는 최악의 패턴이 완성된다.
        </SceneBox>
        <Hl variant="danger">
          출발이 급하면 수익실현도 급해진다 — 더 먹을 걸 못 먹는 이유가 여기 있다
        </Hl>

        <Divider />
        <CardTitle>함정 2 — 상승 초입에서의 지나친 신중함</CardTitle>
        <BodyText>
          반대 방향의 실수도 있다. 오르기 시작한 종목을 보며 "지금 오른 거 보니 늦은 것 같다"고
          생각하는 것.
        </BodyText>
        <SceneBox label="30% 올랐어도 아직 초입일 수 있다">
          전기차 섹터가 본격적으로 주목받기 시작한 2020년 초, 테슬라는 이미 1월에 50% 가까이
          올라있었다. 그 시점에 "이미 너무 올랐다"고 판단한 사람들은 이후 5~10배의 상승을 모두
          놓쳤다.{" "}
          <em style={{ color: "#c8d4ff", fontStyle: "normal", fontWeight: 500 }}>
            구조적인 상승 트렌드가 막 인식되기 시작하는 시점이라면, 이미 올라있는 30%는 이후
            올라갈 300%에 비해 아무것도 아닌 숫자다.
          </em>
        </SceneBox>
        <Hl>확신이 있다면 "이미 30% 올랐다"는 사실이 망설임의 이유가 아니라 확인의 신호다</Hl>
      </Card>

      <GroupHeading>6. 전략 강점 & 보완 과제</GroupHeading>
      <Card>
        <Split2>
          <MiniCard>
            <p className="text-[12px] font-bold mb-1.5" style={{ color: "#6ce88a" }}>
              이 전략의 강점
            </p>
            <ul className="list-disc pl-3.5 space-y-1 text-[12px]" style={{ color: "#8a93b8" }}>
              <li>본질(기술+산업)을 보기 때문에 장기 트렌드에 올라탄다</li>
              <li>뉴스에 흔들리지 않으므로 충분한 수익을 끌어낼 수 있다</li>
              <li>저점을 기다리기 때문에 리스크 대비 수익 구조가 유리하다</li>
            </ul>
          </MiniCard>
          <MiniCard>
            <p className="text-[12px] font-bold mb-1.5" style={{ color: "#ff7b7b" }}>
              반드시 보완해야 할 것
            </p>
            <ul className="list-disc pl-3.5 space-y-1 text-[12px]" style={{ color: "#8a93b8" }}>
              <li>저점 판단은 사후적으로만 확인된다 — 분할 진입이 필수</li>
              <li>확신이 클수록 과집중 투자 위험이 커진다</li>
              <li style={{ color: "#ffb3b3" }}>
                "논리가 깨졌을 때 어떻게 나올 것인가" 규칙이 없으면 전략은 절반짜리다
              </li>
            </ul>
          </MiniCard>
        </Split2>
        <Hl variant="warn" className="mt-3.5">
          한 줄 결론: 방향 예측은 맞다. 완성된 전략이 되려면 "틀렸을 때의 출구 규칙"이 추가돼야 한다
        </Hl>
      </Card>

      {/* ── 정리 2 ── */}
      <SectionLabel className="mt-9">정리 2 · 자금 배분과 계층형 분할 전략</SectionLabel>

      <GroupHeading>7. 두 전략의 본질 비교</GroupHeading>
      <Card>
        <BodyText>
          방향이 맞아도 자금 배분이 틀리면 실패한다. "-60%를 찍고 2년 후 회복" — 예측은 맞았지만
          그 과정을 버티지 못했다면 실패한 투자다. 문제는 타이밍이 아니라 자금 배분이다.
        </BodyText>
        <Split2>
          <MiniCard>
            <p className="text-[12px] font-bold mb-1.5" style={{ color: "#8fb3ff" }}>
              (A) 계속 물타기
            </p>
            <p className="text-[12px] my-1" style={{ color: "#6ce88a" }}>
              장점: 평균단가 하락, 초입 포착
            </p>
            <p className="text-[12px] my-1" style={{ color: "#ff9f9f" }}>
              단점: 진짜 저점 전에 총알 소진
            </p>
            <Hl variant="danger" className="text-[11px] mt-2">
              맞는 방향인데 돈이 먼저 죽는다
            </Hl>
          </MiniCard>
          <MiniCard>
            <p className="text-[12px] font-bold mb-1.5" style={{ color: "#8fb3ff" }}>
              (B) 저점만 대기
            </p>
            <p className="text-[12px] my-1" style={{ color: "#6ce88a" }}>
              장점: 자금 보존, 한방 크게
            </p>
            <p className="text-[12px] my-1" style={{ color: "#ff9f9f" }}>
              단점: 저점은 지나야만 보인다
            </p>
            <Hl className="text-[11px] mt-2">안전하지만 기회를 놓칠 수 있다</Hl>
          </MiniCard>
        </Split2>
      </Card>

      <GroupHeading>8. 계층형 분할 전략 (정답)</GroupHeading>
      <Card>
        <CardTitle>총 투자금 = 100 기준 · 구간 기준으로 나눈다</CardTitle>
        <div className="my-3.5 space-y-3">
          {[
            { color: "#8fb3ff", pct: "28%", label: "20~30% · 초기 진입", desc: '상승 초입을 놓치지 않기 위한 포지션. "싸다"는 판단이 선 첫 구간에 집행.' },
            { color: "#ffcc5c", pct: "38%", label: "30~40% · 비관 구간", desc: "시장이 공포로 반응할 때. 핵심 논리가 아직 살아있는가를 먼저 확인하고 집행." },
            { color: "#6ce88a", pct: "38%", label: "30~40% · 패닉 구간", desc: "거래량 폭증, 뉴스 최악, 개인 투자자 손절 쏟아지는 구간. 여기서 가장 크게 태운다." },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <div className="mt-1.5 shrink-0 h-2 rounded" style={{ width: row.pct, background: row.color, minWidth: "60px" }} />
              <div>
                <p className="text-[12px] font-medium mb-0.5" style={{ color: row.color }}>
                  {row.label}
                </p>
                <p className="text-[12px]" style={{ color: "#5a6490" }}>
                  {row.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <SceneBox label="패닉 구간이 실제로 어떤 분위기인가">
          패닉 구간에서는 커뮤니티에 손절 인증이 쏟아진다. "더 떨어질 것 같아서 팔았다", "이 종목
          이제 끝난 것 같다"는 글들이 넘친다. 반대로 거래량은 폭증한다. 평소보다 2~3배 이상의
          거래량이 터지면서 주가는 장중에 -7~10%씩 출렁인다. 이것이{" "}
          <em style={{ color: "#c8d4ff", fontStyle: "normal", fontWeight: 500 }}>
            공급이 수요를 압도하는 마지막 구간의 신호
          </em>
          다. 여기서 가장 크게 들어갈 수 있는 사람이 결국 가장 큰 수익을 가져간다.
        </SceneBox>
        <Hl>"처음부터 자금을 나눠놓고 계획대로만 들어가라 — 감정이 아니라 구간이 트리거다"</Hl>
      </Card>

      <GroupHeading>9. 멈춰야 할 때 vs. 계속 살 때</GroupHeading>
      <Card>
        <Split2>
          <MiniCard>
            <p className="text-[12px] font-bold mb-1.5" style={{ color: "#6ce88a" }}>
              계속 사도 되는 하락
            </p>
            <ul className="list-disc pl-3.5 space-y-1 text-[12px]" style={{ color: "#8a93b8" }}>
              <li>산업 성장 방향이 바뀌지 않았다</li>
              <li>기업 경쟁력·기술력 그대로다</li>
              <li>단기 수급·차익실현·시장 전체 조정이다</li>
            </ul>
            <p className="text-[11px] mt-1.5" style={{ color: "#5a6490" }}>
              예: AI 과열 조정, 금리 이슈로 인한 나스닥 전체 하락
            </p>
          </MiniCard>
          <MiniCard>
            <p className="text-[12px] font-bold mb-1.5" style={{ color: "#ff7b7b" }}>
              반드시 멈춰야 하는 하락
            </p>
            <ul className="list-disc pl-3.5 space-y-1 text-[12px]" style={{ color: "#8a93b8" }}>
              <li>기술 자체의 유효성이 흔들렸다</li>
              <li>구조적으로 더 강한 경쟁자가 나타났다</li>
              <li>산업의 방향 자체가 바뀌고 있다</li>
            </ul>
            <p className="text-[11px] mt-1.5" style={{ color: "#5a6490" }}>
              예: 기반 기술이 대체됨, 핵심 수요가 구조적으로 감소
            </p>
          </MiniCard>
        </Split2>
        <Hl variant="danger" className="mt-3.5">
          핵심 원칙: "확신이 있으면 분할로 싸우고, 확신이 깨지면 미련 없이 멈춰라"
        </Hl>
      </Card>
    </div>
  );
}
