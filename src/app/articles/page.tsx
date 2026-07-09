"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Eye, ArrowRight, FileText } from "lucide-react";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  cover: string | null;
  viewCount: number;
  createdAt: string;
};

function fmtDate(s: string): string {
  const d = new Date(s);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function ArticlesListPage() {
  const [items, setItems] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const pageSize = 9;

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/articles?page=${page}&pageSize=${pageSize}`)
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setTotal(d.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-pink-400 to-rose-500 text-white">
              <FileText className="size-4" />
            </div>
            yttAPI · 文章
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← 返回文档
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">文章列表</h1>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl border border-border bg-muted/40" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
            暂无文章
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/40 hover:shadow-lg"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  {a.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.cover} alt={a.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-950/30 dark:to-rose-950/30">
                      <FileText className="size-10 text-pink-400/60" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">{a.category}</span>
                    <span className="flex items-center gap-1"><Calendar className="size-3" />{fmtDate(a.createdAt)}</span>
                  </div>
                  <h2 className="mb-2 line-clamp-2 font-semibold group-hover:text-primary">{a.title}</h2>
                  <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{a.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="size-3" />{a.viewCount} 次浏览</span>
                    <span className="flex items-center gap-1 text-primary opacity-0 transition group-hover:opacity-100">
                      阅读 <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-3 text-sm text-muted-foreground">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
