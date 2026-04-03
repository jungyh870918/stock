import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.length < 1) return NextResponse.json({ result: [] });

  const KEY = process.env.FINNHUB_API_KEY ?? "";
  if (!KEY) return NextResponse.json({ result: [] });

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${KEY}`,
      { cache: "no-store" }
    );
    if (!res.ok) return NextResponse.json({ result: [] });
    const data = await res.json();
    const filtered = (data.result ?? [])
      .filter((r: any) => r.type === "Common Stock" && !r.symbol.includes("."))
      .slice(0, 6);
    return NextResponse.json({ result: filtered });
  } catch {
    return NextResponse.json({ result: [] });
  }
}
