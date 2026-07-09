import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { allStats } from "@/lib/images";
import { getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

// 后台仪表盘统计
export async function GET() {
  const [articleCount, publishedCount] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { published: true } }),
  ]);
  const img = allStats();
  const calls = getStats();
  return NextResponse.json({
    code: 200,
    articles: { total: articleCount, published: publishedCount },
    images: img,
    calls,
  });
}
