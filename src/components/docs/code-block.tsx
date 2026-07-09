"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

type Example = { lang: string; label: string; code: string };

export function CodeBlock({
  examples,
  origin,
}: {
  examples: Example[];
  origin: string;
}) {
  const [active, setActive] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  const current = examples[active] ?? examples[0];
  // 将占位 ORIGIN 替换为真实 origin
  const code = current.code.replace(/\$\{ORIGIN\}|@ORIGIN@/g, "").replace(/\/api/g, `${origin}/api`);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("已复制到剪贴板");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("复制失败");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden my-4">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {examples.map((ex, i) => (
            <button
              key={ex.label + i}
              onClick={() => setActive(i)}
              className={`whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                i === active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {ex.label}
            </button>
          ))}
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          title="复制代码"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <pre className="overflow-x-auto scrollbar-thin p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-white/90">{code}</code>
      </pre>
    </div>
  );
}
