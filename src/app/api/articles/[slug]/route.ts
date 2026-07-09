import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// 获取单篇已发布文章（并增加浏览量）
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || !article.published) {
    return NextResponse.json({ code: 404, error: "文章不存在" }, { status: 404 });
  }
  // 浏览量 +1
  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  });
  return NextResponse.json({ code: 200, article: { ...article, viewCount: article.viewCount + 1 } });
}
