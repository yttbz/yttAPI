import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ArticleEditor } from "@/components/admin/article-editor";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    notFound();
  }
  return <ArticleEditor article={article} />;
}
