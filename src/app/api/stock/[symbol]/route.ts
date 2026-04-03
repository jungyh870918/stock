import { NextRequest, NextResponse } from "next/server";
import { fetchStockData } from "@/app/lib/finnhub";
import type { ApiError } from "@/app/lib/finnhub.types";

export const dynamic = "force-dynamic"; // Next.js 캐시 완전 비활성화

export async function GET(
  _req: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol?.toUpperCase();

  if (!symbol || !/^[A-Z0-9.\-]{1,10}$/.test(symbol)) {
    return NextResponse.json<ApiError>(
      { error: "유효하지 않은 종목 코드입니다." },
      { status: 400 }
    );
  }

  try {
    const data = await fetchStockData(symbol);
    return NextResponse.json(data, {
      headers: {
        // 브라우저·프록시 캐시 완전 비활성화
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json<ApiError>({ error: message }, { status: 500 });
  }
}
