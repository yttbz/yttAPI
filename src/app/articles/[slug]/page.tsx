"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, Eye, ArrowLeft, FileText } from "lucide-react";

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string;
  cover: string | null;
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};

function fmtDate(s: string): string {
  const d = new Date(s);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let inList = false;
  let inCode = false;
  const codeBuf: string[] = [];
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        html += `<pre class="rounded-lg bg-muted p-4 my-3 overflow-x-auto"><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`;
        codeBuf.length = 0;
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }
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
      continue;
    }
    if (inList) { html += "</ul>"; inList = false; }
    if (/^>\s/.test(line)) {
      html += `<blockquote class="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-3">${inline(line.replace(/^>\s/, ""))}</blockquote>`;
      continue;
    }
    if (/^---+$/.test(line.trim())) { html += "<hr class='my-4 border-border' />"; continue; }
    html += `<p>${inline(line)}</p>`;
  }
  if (inList) html += "</ul>";
  if (inCode) html += `<pre class="rounded-lg bg-muted p-4 my-3 overflow-x-auto"><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`;
  return html;

  function inline(s: string): string {
    let t = escapeHtml(s);
    t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" class="rounded-lg my-2 max-w-full" />');
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-primary underline-offset-4 hover:underline">$1</a>');
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5">$1</code>');
    return t;
  }
}
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function ArticleDetailPage() {
  const params = useParams<{ slug: string }>();
  const [article, setArticle] = React.useState<Article | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/articles/${params.slug}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => setArticle(d.article))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">加载中...</div>
      </div>
    );
  }
  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">文章不存在</h1>
          <Link href="/articles" className="text-primary hover:underline">← 返回文章列表</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <Link href="/articles" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> 返回列表
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-accent-foreground">{article.category}</span>
          <span className="flex items-center gap-1"><Calendar className="size-3.5" />{fmtDate(article.createdAt)}</span>
          <span className="flex items-center gap-1"><Eye className="size-3.5" />{article.viewCount}</span>
        </div>
        <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl">{article.title}</h1>
        {article.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.cover} alt={article.title} className="mb-8 w-full rounded-xl object-cover" />
        )}
        <div
          className="docs-prose"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
        />
      </article>
    </div>
  );
}
