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
      month: profile.monthLabel,
      pnlUsd: profile.monthlyPnlUsd,
      wins: profile.wins,
      losses: profile.losses,
      dayResults: profile.dayResults
    });
  } catch (error: any) {
    console.error("[Trader Monthly Summary API Error]:", error.message);
    return NextResponse.json({ error: "Failed to fetch monthly summary", details: error.message }, { status: 502 });
  }
}
