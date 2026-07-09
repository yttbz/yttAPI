import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// 公开文章列表（仅已发布）
export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const pageSize = Math.max(1, Math.min(50, parseInt(url.searchParams.get("pageSize") || "10")));
  const category = url.searchParams.get("category") || "";

  const where: Record<string, unknown> = { published: true };
  if (category) where.category = category;

  const [total, items] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        cover: true,
        viewCount: true,
        createdAt: true,
      },
    }),
  ]);

  return NextResponse.json({ code: 200, total, page, pageSize, items });
}
