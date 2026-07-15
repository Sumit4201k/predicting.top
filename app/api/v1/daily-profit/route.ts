export const dynamic = 'force-dynamic'
import { getLiveDailyProfit } from "@/lib/live-api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getLiveDailyProfit();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[Daily Profit API] error:", err);
    return NextResponse.json({ error: "Failed to load daily profit stats" }, { status: 500 });
  }
}
