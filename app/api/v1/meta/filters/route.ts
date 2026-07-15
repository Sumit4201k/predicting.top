export const dynamic = 'force-dynamic'
import { getFilterMeta } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(getFilterMeta());
}
