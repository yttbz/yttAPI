import { NextResponse } from "next/server";
import { allStats } from "@/lib/images";
import { getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 站点统计
export function GET() {
  const s = getStats();
  const img = allStats();
  return NextResponse.json({
    code: 200,
    total_calls: s.total,
    today_calls: s.today,
    uptime_days: s.uptimeDays,
    calls: s.detail,
    images: img,
  });
}
