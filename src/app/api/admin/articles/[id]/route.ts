import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// 获取单篇文章
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return NextResponse.json({ code: 404, error: "文章不存在" }, { status: 404 });
  }
  return NextResponse.json({ code: 200, article });
}

// 更新文章
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { title, content, excerpt, category, cover, published, slug } = body;
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ code: 404, error: "文章不存在" }, { status: 404 });
    }
    // 若改了 slug，确保唯一
    let finalSlug = existing.slug;
    if (slug && slug !== existing.slug) {
      const dup = await prisma.article.findFirst({ where: { slug, NOT: { id } } });
      if (dup) {
        return NextResponse.json({ code: 400, error: "slug 已被占用" }, { status: 400 });
      }
      finalSlug = slug;
    }
    const article = await prisma.article.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        slug: finalSlug,
        content: content ?? existing.content,
        excerpt: excerpt ?? existing.excerpt,
        category: category ?? existing.category,
        cover: cover ?? existing.cover,
        published: published ?? existing.published,
      },
    });
    return NextResponse.json({ code: 200, article });
  } catch (e) {
    return NextResponse.json(
      { code: 500, error: e instanceof Error ? e.message : "更新失败" },
      { status: 500 }
    );
  }
}

// 删除文章
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ code: 200, message: "已删除" });
  } catch {
    return NextResponse.json({ code: 404, error: "文章不存在" }, { status: 404 });
  }
}
