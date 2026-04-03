import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({
    finnhub:    process.env.FINNHUB_API_KEY ? "✅ SET (" + process.env.FINNHUB_API_KEY.slice(0,4) + "...)" : "❌ NOT SET",
    twelvedata: process.env.TWELVEDATA_API_KEY ? "✅ SET (" + process.env.TWELVEDATA_API_KEY.slice(0,4) + "...)" : "❌ NOT SET",
  });
}
