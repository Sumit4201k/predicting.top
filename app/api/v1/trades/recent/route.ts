export const dynamic = 'force-dynamic'
import { getLiveRecentTrades } from "@/lib/live-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "100", 10);
    const minAmount = parseInt(request.nextUrl.searchParams.get("minAmount") || "100", 10);
    const data = await getLiveRecentTrades(limit, minAmount);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Recent Trades API Error]:", error.message);
    return NextResponse.json({ error: "Failed to fetch live trades", details: error.message }, { status: 502 });
  }
}
