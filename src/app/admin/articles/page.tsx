"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  published: boolean;
  viewCount: number;
  createdAt: string;
};

function fmtDate(s: string): string {
  const d = new Date(s);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function AdminArticlesPage() {
  const [items, setItems] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const pageSize = 15;

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      const res = await fetch(`/api/admin/articles?${params}`);
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setTotal(data.total || 0);
      } else {
        toast.error(data.error || "加载失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  React.useEffect(() => {
    load();
  }, [load]);

  const onDelete = async (id: string, title: string) => {
    if (!confirm(`确定删除文章「${title}」吗？`)) return;
    try {
      const res = await fetch(`/api/yttbz/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("已删除");
        load();
      } else {
        toast.error(data.error || "删除失败");
      }
    } catch {
      toast.error("网络错误");
    }
  };

  const togglePublish = async (a: Article) => {
    try {
      const res = await fetch(`/api/yttbz/articles/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !a.published }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(a.published ? "已下架" : "已发布");
        load();
      } else {
        toast.error(data.error || "操作失败");
      }
    } catch {
      toast.error("网络错误");
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">文章管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理站点公告、使用教程等文章（共 {total} 篇）
          </p>
        </div>
        <Link href="/yttbz/articles/new">
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90">
            <Plus className="size-4" />
            写新文章
          </Button>
        </Link>
      </div>

      {/* 筛选 */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="搜索标题或内容..."
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          >
            <option value="">全部分类</option>
            <option value="公告">公告</option>
            <option value="教程">教程</option>
            <option value="更新日志">更新日志</option>
            <option value="其他">其他</option>
          </select>
        </div>
      </Card>

      {/* 列表 */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileText className="size-10 mb-2 opacity-40" />
            <p>暂无文章</p>
            <Link href="/yttbz/articles/new" className="mt-3 text-sm text-primary hover:underline">
              去写第一篇 →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">标题</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">分类</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">浏览</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">创建时间</th>
                  <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium line-clamp-1">{a.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{a.excerpt}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="secondary">{a.category}</Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {a.published ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15">已发布</Badge>
                      ) : (
                        <Badge variant="outline">草稿</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{a.viewCount}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{fmtDate(a.createdAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => togglePublish(a)}
                          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                          title={a.published ? "下架" : "发布"}
                        >
                          {a.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                        <Link
                          href={`/yttbz/articles/${a.id}/edit`}
                          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                          title="编辑"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <button
                          onClick={() => onDelete(a.id, a.title)}
                          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                          title="删除"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <div className="text-sm text-muted-foreground">
              第 {page} / {totalPages} 页，共 {total} 篇
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
