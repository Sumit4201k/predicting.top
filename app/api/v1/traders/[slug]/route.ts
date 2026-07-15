export const dynamic = 'force-dynamic';
import { getLiveTraderProfile } from "@/lib/live-api";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const profile = await getLiveTraderProfile(slug);

    if (!profile) {
      return NextResponse.json({ error: "Trader not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("[Trader Profile API Error]:", error.message);
    return NextResponse.json({ error: "Failed to fetch trader profile", details: error.message }, { status: 502 });
  }
}
