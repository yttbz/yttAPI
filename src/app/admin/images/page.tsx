"use client";

import * as React from "react";
import {
  Upload,
  Trash2,
  RefreshCw,
  Loader2,
  Monitor,
  Smartphone,
  UserCircle,
  Image as ImageIcon,
  ExternalLink,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Kind = "pc" | "phon" | "pp" | "bg";
type ImgItem = { name: string; size: number; url: string };

const KINDS: { key: Kind; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "pc", label: "电脑端", icon: Monitor, desc: "横屏壁纸 (pc 目录)" },
  { key: "phon", label: "手机端", icon: Smartphone, desc: "竖屏壁纸 (phon 目录)" },
  { key: "pp", label: "头像", icon: UserCircle, desc: "随机头像 (pp 目录)" },
  { key: "bg", label: "背景图", icon: ImageIcon, desc: "背景图 (bg 目录)" },
];

function fmtSize(n: number): string {
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / 1024 / 1024).toFixed(2) + " MB";
}

export default function AdminImagesPage() {
  const [kind, setKind] = React.useState<Kind>("pc");
  const [images, setImages] = React.useState<ImgItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const fileRef = React.useRef<HTMLInputElement>(null);

  const load = React.useCallback(async (k: Kind) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/yttbz/images?kind=${k}`);
      const data = await res.json();
      if (res.ok) {
        setImages(data.images || []);
      } else {
        toast.error(data.error || "加载失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCounts = React.useCallback(async () => {
    try {
      const res = await fetch("/api/yttbz/stats");
      const data = await res.json();
      if (res.ok) setCounts(data.images || {});
    } catch {}
  }, []);

  React.useEffect(() => {
    load(kind);
  }, [kind, load]);

  React.useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("kind", kind);
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch("/api/yttbz/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "上传成功");
        await load(kind);
        await loadCounts();
      } else {
        toast.error(data.error || "上传失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onDelete = async (name: string) => {
    if (!confirm(`确定删除图片「${name}」吗？此操作不可恢复。`)) return;
    try {
      const res = await fetch(
        `/api/yttbz/images?kind=${kind}&file=${encodeURIComponent(name)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("已删除");
        setImages((prev) => prev.filter((i) => i.name !== name));
        await loadCounts();
      } else {
        toast.error(data.error || "删除失败");
      }
    } catch {
      toast.error("网络错误");
    }
  };

  const filtered = images.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">图片管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            上传、删除各分类图片，实时生效
          </p>
        </div>
        <Button onClick={() => load(kind)} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          刷新
        </Button>
      </div>

      {/* 分类切换 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KINDS.map((k) => {
          const Icon = k.icon;
          const active = kind === k.key;
          return (
            <button
              key={k.key}
              onClick={() => setKind(k.key)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 text-left transition",
                active
                  ? "border-primary bg-accent shadow-sm"
                  : "border-border bg-background hover:border-primary/40"
              )}
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg",
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{k.label}</div>
                <div className="text-xs text-muted-foreground truncate">{k.desc}</div>
                <div className="mt-0.5 text-xs font-semibold text-primary">
                  {counts[k.key] ?? 0} 张
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 上传区 */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-medium">上传图片到「{KINDS.find((k) => k.key === kind)?.label}」</div>
            <div className="text-sm text-muted-foreground">
              支持 jpg / png / webp / gif / bmp / avif，可多选
            </div>
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onUpload(e.target.files)}
            />
            <Button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {uploading ? "上传中..." : "选择图片上传"}
            </Button>
          </div>
        </div>
      </Card>

      {/* 图片列表 */}
      <Card className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="font-medium">
            图片列表 <span className="text-muted-foreground">（{filtered.length} 张）</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索文件名..."
              className="h-9 w-48 rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ImageIcon className="size-10 mb-2 opacity-40" />
            <p>暂无图片</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((img) => (
              <div
                key={img.name}
                className="group overflow-hidden rounded-lg border border-border bg-muted/30"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex size-8 items-center justify-center rounded-md bg-white/20 text-white hover:bg-white/30"
                      title="新窗口打开"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                    <button
                      onClick={() => onDelete(img.name)}
                      className="flex size-8 items-center justify-center rounded-md bg-red-500/80 text-white hover:bg-red-500"
                      title="删除"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <div className="truncate text-xs font-medium" title={img.name}>
                    {img.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{fmtSize(img.size)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
