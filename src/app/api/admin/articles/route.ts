import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// 文章列表（支持分页、搜索、分类筛选）
export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const pageSize = Math.max(1, Math.min(100, parseInt(url.searchParams.get("pageSize") || "20")));
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
    ];
  }
  if (category) {
    where.category = category;
  }

  const [total, items] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    code: 200,
    total,
    page,
    pageSize,
    items,
  });
}

// 新建文章
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, excerpt, category, cover, published } = body;
    if (!title || !content) {
      return NextResponse.json({ code: 400, error: "标题和内容不能为空" }, { status: 400 });
    }
    // 生成 slug
    let slug = body.slug || generateSlug(title);
    // 确保唯一
    let n = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${generateSlug(title)}-${n++}`;
    }
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.slice(0, 120),
        category: category || "公告",
        cover: cover || null,
        published: published !== false,
      },
    });
    return NextResponse.json({ code: 200, article });
  } catch (e) {
    return NextResponse.json(
      { code: 500, error: e instanceof Error ? e.message : "创建失败" },
      { status: 500 }
    );
  }
}

function generateSlug(title: string): string {
  const ts = Date.now().toString(36);
  // 中文标题用时间戳，英文标题保留
  const en = title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 20);
  return en ? `${en}-${ts}` : ts;
}
