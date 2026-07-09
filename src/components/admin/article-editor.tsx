"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string;
  cover: string | null;
  published: boolean;
};

export function ArticleEditor({ article }: { article: Article | null }) {
  const router = useRouter();
  const [title, setTitle] = React.useState(article?.title || "");
  const [slug, setSlug] = React.useState(article?.slug || "");
  const [category, setCategory] = React.useState(article?.category || "公告");
  const [content, setContent] = React.useState(article?.content || "");
  const [excerpt, setExcerpt] = React.useState(article?.excerpt || "");
  const [cover, setCover] = React.useState(article?.cover || "");
  const [published, setPublished] = React.useState(article?.published ?? true);
  const [saving, setSaving] = React.useState(false);
  const [preview, setPreview] = React.useState(false);

  const isEdit = !!article;

  const onSave = async () => {
    if (!title.trim()) {
      toast.error("请输入标题");
      return;
    }
    if (!content.trim()) {
      toast.error("请输入内容");
      return;
    }
    setSaving(true);
    try {
      const body = { title, slug, category, content, excerpt, cover, published };
      const url = isEdit
        ? `/api/admin/articles/${article!.id}`
        : "/api/admin/articles";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isEdit ? "已保存" : "已创建");
        router.push("/yttbz/articles");
        router.refresh();
      } else {
        toast.error(data.error || "保存失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isEdit ? "编辑文章" : "写新文章"}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isEdit ? "修改文章内容与发布状态" : "创建一篇新的文章"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPublished((p) => !p)}
          >
            {published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            {published ? "发布" : "草稿"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setPreview((p) => !p)}
          >
            {preview ? "编辑" : "预览"}
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "保存中..." : "保存"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 主编辑区 */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题..."
              className="w-full border-0 bg-transparent text-2xl font-bold outline-none placeholder:text-muted-foreground/50"
            />
          </Card>

          <Card className="p-5">
            {preview ? (
              <article className="docs-prose min-h-[400px]">
                <MarkdownPreview content={content} />
              </article>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="支持 Markdown 语法编写正文..."
                className="min-h-[400px] w-full resize-y border-0 bg-transparent font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
              />
            )}
          </Card>
        </div>

        {/* 侧边设置 */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-3 font-medium">文章设置</div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">分类</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                >
                  <option value="公告">公告</option>
                  <option value="教程">教程</option>
                  <option value="更新日志">更新日志</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">URL 别名 (slug)</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="留空自动生成"
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
                <p className="text-xs text-muted-foreground">
                  访问路径：/articles/{slug || "auto-generated"}
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">封面图 URL</label>
                <input
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  placeholder="可选，文章封面图地址"
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">摘要</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="留空自动截取正文前 120 字"
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40 resize-y"
                />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-2 font-medium">发布状态</div>
            <button
              onClick={() => setPublished((p) => !p)}
              className="flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <span>{published ? "已发布（前台可见）" : "草稿（前台不可见）"}</span>
              <span
                className={`relative h-5 w-9 rounded-full transition ${
                  published ? "bg-emerald-500" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 size-4 rounded-full bg-white transition ${
                    published ? "left-4" : "left-0.5"
                  }`}
                />
              </span>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

/** 极简 Markdown 渲染（标题、加粗、列表、代码、链接、图片、引用、分隔线）。 */
function MarkdownPreview({ content }: { content: string }) {
  const html = React.useMemo(() => renderMarkdown(content), [content]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderMarkdown(src: string): string {
  const lines = src.split("\n");
  let html = "";
  let inCode = false;
  let inList = false;
  let codeBuf: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        html += `<pre class="rounded-lg bg-muted p-3 my-3 overflow-x-auto"><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`;
        codeBuf = [];
        inCode = false;
      } else {
        if (inList) { html += "</ul>"; inList = false; }
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    if (/^#{1,6}\s/.test(line)) {
      if (inList) { html += "</ul>"; inList = false; }
      const m = line.match(/^(#{1,6})\s+(.*)$/)!;
      const level = m[1].length;
      html += `<h${level}>${inline(m[2])}</h${level}>`;
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inline(line.replace(/^[-*]\s/, ""))}</li>`;
      continue;
    }
    if (line.trim() === "") {
      if (inList) { html += "</ul>"; inList = false; }
      html += "";
      continue;
    }
    if (inList) { html += "</ul>"; inList = false; }
    if (/^>\s/.test(line)) {
      html += `<blockquote>${inline(line.replace(/^>\s/, ""))}</blockquote>`;
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      html += "<hr />";
      continue;
    }
    html += `<p>${inline(line)}</p>`;
  }
  if (inList) html += "</ul>";
  if (inCode) html += `<pre class="rounded-lg bg-muted p-3 my-3 overflow-x-auto"><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`;
  return html;

  function inline(s: string): string {
    let t = escapeHtml(s);
    t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" class="rounded-lg my-2 max-w-full" />');
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5">$1</code>');
    return t;
  }
}
