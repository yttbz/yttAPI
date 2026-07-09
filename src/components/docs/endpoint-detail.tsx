"use client";

import * as React from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { toast } from "sonner";
import type { EndpointMeta } from "@/lib/docs-data";
import { CodeBlock } from "./code-block";
import { EndpointPreview } from "./endpoint-preview";
import { Badge } from "@/components/ui/badge";

export function EndpointDetail({
  ep,
  origin,
}: {
  ep: EndpointMeta;
  origin: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const fullUrl = `${origin}${ep.path}`;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("接口地址已复制");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("复制失败");
    }
  };

  return (
    <div className="docs-prose">
      <h2>{ep.title}</h2>
      <p>{ep.desc}</p>

      {/* 接口地址 */}
      <h3>接口地址</h3>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-border bg-muted/30 p-3 my-3">
        <Badge className="shrink-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20">
          {ep.method}
        </Badge>
        <code className="flex-1 text-sm font-mono break-all">{fullUrl}</code>
        <button
          onClick={copyUrl}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shrink-0"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "已复制" : "复制"}
        </button>
      </div>

      {/* 实时预览 */}
      <h3>实时预览</h3>
      <EndpointPreview path={ep.path} aspect={ep.previewAspect} origin={origin} />

      {/* 请求参数 */}
      {ep.params && ep.params.length > 0 && (
        <>
          <h3>请求参数</h3>
          <div className="overflow-x-auto rounded-xl border border-border my-3">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold">参数名</th>
                  <th className="text-left px-4 py-2.5 font-semibold">类型</th>
                  <th className="text-left px-4 py-2.5 font-semibold">默认值</th>
                  <th className="text-left px-4 py-2.5 font-semibold">说明</th>
                </tr>
              </thead>
              <tbody>
                {ep.params.map((p) => (
                  <tr key={p.name} className="border-t border-border">
                    <td className="px-4 py-2.5 font-mono text-primary">{p.name}</td>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">{p.type}</td>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">{p.default}</td>
                    <td className="px-4 py-2.5 text-foreground/80">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 调用示例 */}
      <h3>调用示例</h3>
      <CodeBlock examples={ep.examples} origin={origin} />

      {/* 响应示例 */}
      <h3>响应示例</h3>
      <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden my-3">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <Terminal className="size-3.5 text-white/50" />
          <span className="text-xs text-white/50 font-mono">response.json</span>
        </div>
        <pre className="overflow-x-auto scrollbar-thin p-4 text-[13px] leading-relaxed">
          <code className="font-mono text-emerald-300/90">{ep.response}</code>
        </pre>
      </div>
    </div>
  );
}
