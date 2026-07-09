"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Image as ImageIcon,
  TrendingUp,
  Eye,
  Plus,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";

type Stats = {
  articles: { total: number; published: number };
  images: { pc: number; phon: number; pp: number; bg: number; total: number };
  calls: { total: number; today: number; uptimeDays: number; detail: Record<string, number> };
};

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}


function useClock() {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function useSync() {
  const [synced, setSynced] = React.useState(null);
  const [syncTime, setSyncTime] = React.useState("");
  React.useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(() => {
        setSynced(true);
        setSyncTime(new Date().toLocaleTimeString("zh-CN", { hour12: false }));
      })
      .catch(() => setSynced(false));
  }, []);
  return { synced, syncTime };
}

function TimeDisplay() {
  const now = useClock();
  const pad = (n) => String(n).padStart(2, "0");
  const s = now.getFullYear() + "-" + pad(now.getMonth()+1) + "-" + pad(now.getDate()) + " " + pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
  return React.createElement("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2" },
    React.createElement(Clock, { className: "size-4 text-muted-foreground" }),
    React.createElement("span", { className: "font-mono tabular-nums" }, s)
  );
}

function SyncStatus() {
  const { synced, syncTime } = useSync();
  let icon, text, cls;
  if (synced === null) {
    icon = React.createElement(Loader2, { className: "size-4 animate-spin text-muted-foreground" });
    text = "检测中...";
    cls = "text-muted-foreground";
  } else if (synced) {
    icon = React.createElement(CheckCircle2, { className: "size-4 text-emerald-500" });
    text = "已同步 " + syncTime;
    cls = "text-emerald-600";
  } else {
    icon = React.createElement(XCircle, { className: "size-4 text-red-500" });
    text = "同步失败";
    cls = "text-red-500";
  }
  return React.createElement("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2" },
    icon,
    React.createElement("span", { className: cls }, text)
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<Stats | null>(null);

  React.useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "文章总数",
      value: stats ? fmt(stats.articles.total) : "—",
      sub: stats ? `已发布 ${stats.articles.published} 篇` : "",
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/yttbz/articles",
    },
    {
      label: "图片总数",
      value: stats ? fmt(stats.images.total) : "—",
      sub: stats
        ? `PC ${stats.images.pc} · 手机 ${stats.images.phon} · 头像 ${stats.images.pp} · 背景 ${stats.images.bg}`
        : "",
      icon: ImageIcon,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
      href: "/yttbz/images",
    },
    {
      label: "累计调用",
      value: stats ? fmt(stats.calls.total) : "—",
      sub: stats ? `今日 ${fmt(stats.calls.today)} 次` : "",
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "#",
    },
    {
      label: "运行天数",
      value: stats ? fmt(stats.calls.uptimeDays) : "—",
      sub: "天",
      icon: Eye,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "#",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <div className="flex items-center gap-4 text-sm ml-auto">
          <TimeDisplay />
          <SyncStatus />
        </div>
        <p className="text-sm text-muted-foreground mt-1">站点数据概览与快捷操作</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{c.label}</div>
                  <div className="mt-2 text-3xl font-bold tracking-tight">{c.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.sub}</div>
                </div>
                <div className={`flex size-10 items-center justify-center rounded-md ${c.bg} ${c.color}`}>
                  <Icon className="size-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 快捷操作 */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">快捷操作</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/yttbz/images"
            className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition hover:border-primary/40"
          >
            <div className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Upload className="size-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">上传图片</div>
              <div className="text-sm text-muted-foreground">向 pc / phon / pp / bg 分类添加图片</div>
            </div>
          </Link>
          <Link
            href="/yttbz/articles/new"
            className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition hover:border-primary/40"
          >
            <div className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Plus className="size-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">写新文章</div>
              <div className="text-sm text-muted-foreground">发布站点公告、使用教程等</div>
            </div>
          </Link>
        </div>
      </div>

      {/* 各接口调用量 */}
      {stats && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">接口调用量明细</h2>
          <Card className="p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(stats.calls.detail).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded-md bg-muted/40 px-4 py-3">
                  <span className="font-mono text-sm text-muted-foreground">/api/{k}</span>
                  <span className="font-semibold">{fmt(v)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
