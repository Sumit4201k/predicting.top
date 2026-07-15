export const dynamic = 'force-dynamic'
import { getLiveRecentTrades } from "@/lib/live-api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getLiveRecentTrades(100, 100);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Recent Trades API Error]:", error.message);
    return NextResponse.json({ error: "Failed to fetch live trades", details: error.message }, { status: 502 });
  }
}
