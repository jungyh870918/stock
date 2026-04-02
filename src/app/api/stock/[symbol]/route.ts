import { NextRequest, NextResponse } from "next/server";
import { fetchStockData } from "@/app/lib/finnhub";
import type { ApiError } from "@/app/lib/finnhub.types";

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
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json<ApiError>({ error: message }, { status: 500 });
  }
}
