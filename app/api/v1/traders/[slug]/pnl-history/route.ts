import { getLiveTraderProfile } from "@/lib/live-api";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const profile = await getLiveTraderProfile(slug);

    if (!profile) {
      return NextResponse.json({ error: "Trader not found" }, { status: 404 });
    }

    return NextResponse.json({
      slug: profile.slug,
      range: "YTD",
      bucket: "day",
      points: profile.pnlHistory
    });
  } catch (error: any) {
    console.error("[Trader PnL History API Error]:", error.message);
    return NextResponse.json({ error: "Failed to fetch PnL history", details: error.message }, { status: 502 });
  }
}
