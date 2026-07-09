"use client";

import * as React from "react";
import { Save, Loader2, Globe, Server, RotateCcw, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [siteBaseUrl, setSiteBaseUrl] = React.useState("");
  const [apiBaseUrl, setApiBaseUrl] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/yttbz/settings")
      .then((r) => r.json())
      .then((d) => {
        setSiteBaseUrl(d.settings?.site_base_url || "");
        setApiBaseUrl(d.settings?.api_base_url || "");
      })
      .finally(() => setLoading(false));
  }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/yttbz/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_base_url: siteBaseUrl, api_base_url: apiBaseUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("设置已保存，API 跳转与前端展示地址已更新");
      } else {
        toast.error(data.error || "保存失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    setSiteBaseUrl("");
    setApiBaseUrl("");
    toast.info("已清空，保存后将回退到当前访问地址");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">站点设置</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          配置站点对外访问的域名或 IP。修改后，API 跳转地址与文档页展示的接口地址都会切换到新地址。
        </p>
      </div>

      <Card className="p-6 space-y-5">
        {/* 站点地址 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Globe className="size-4 text-muted-foreground" />
            站点地址（Site Base URL）
          </label>
          <input
            type="text"
            value={siteBaseUrl}
            onChange={(e) => setSiteBaseUrl(e.target.value)}
            placeholder="https://api.m1f.cn"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-ring transition focus:ring-2 focus:ring-ring/40"
          />
          <p className="text-xs text-muted-foreground">
            文档页展示的接口地址前缀。留空则使用当前访问地址。
          </p>
        </div>

        {/* API 地址 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Server className="size-4 text-muted-foreground" />
            API 跳转地址（API Base URL）
          </label>
          <input
            type="text"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            placeholder="https://api.m1f.cn  （留空则复用站点地址）"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-ring transition focus:ring-2 focus:ring-ring/40"
          />
          <p className="text-xs text-muted-foreground">
            图片接口 302 跳转的目标地址前缀。可单独配置为 CDN 或图片服务器地址。留空则复用站点地址。
          </p>
        </div>

        {/* 示例 */}
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs space-y-1.5">
          <div className="font-medium text-foreground">配置效果预览</div>
          <div className="text-muted-foreground">
            接口地址展示：<code className="rounded bg-background px-1.5 py-0.5 font-mono">{siteBaseUrl || "（当前地址）"}/api/acg</code>
          </div>
          <div className="text-muted-foreground">
            图片跳转目标：<code className="rounded bg-background px-1.5 py-0.5 font-mono">{apiBaseUrl || siteBaseUrl || "（当前地址）"}/api/img/pc/xxx.jpg</code>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-3 pt-2">
          <Button onClick={onSave} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            保存设置
          </Button>
          <Button variant="outline" onClick={onReset} disabled={saving}>
            <RotateCcw className="size-4" />
            清空（回退默认）
          </Button>
        </div>
      </Card>

      {/* 说明 */}
      <Card className="p-5 bg-muted/30">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Check className="size-4 text-emerald-500" />
          使用说明
        </h3>
        <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-5">
          <li>填写完整地址，含协议（http/https）和端口（如有），例如 <code className="font-mono">https://api.m1f.cn</code> 或 <code className="font-mono">http://1.2.3.4:3000</code></li>
          <li>末尾不要加斜杠，系统会自动处理</li>
          <li>修改后立即生效，无需重启服务</li>
          <li>若配置错误导致接口无法访问，可直接访问 <code className="font-mono">/yttbz/settings</code> 重新修改</li>
        </ul>
      </Card>
    </div>
  );
}
