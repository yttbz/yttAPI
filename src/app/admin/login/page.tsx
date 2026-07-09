"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("请输入密码");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("登录成功");
        const from = params.get("from") || "/yttbz";
        router.push(from);
        router.refresh();
      } else {
        toast.error(data.error || "登录失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center hero-gradient p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
            <ImageIcon className="size-7" />
          </div>
          <h1 className="text-2xl font-bold">yttAPI 管理后台</h1>
          <p className="mt-1 text-sm text-muted-foreground">请输入管理密码登录</p>
        </div>
        <form
          onSubmit={onSubmit}
          className="rounded-lg border border-border bg-card p-6 shadow-sm"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">管理密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                autoFocus
                className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none ring-ring transition focus:ring-2 focus:ring-ring/40"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "登录中..." : "登 录"}
          </button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            默认密码：<code className="rounded bg-muted px-1.5 py-0.5 font-mono">admin123</code>
            <br />
            部署后请通过环境变量 <code className="font-mono">ADMIN_PASSWORD</code> 修改
          </p>
        </form>
      </div>
    </div>
  );
}
