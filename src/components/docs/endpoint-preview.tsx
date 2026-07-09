"use client";

import * as React from "react";
import { RefreshCw, ExternalLink, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export function EndpointPreview({
  path,
  aspect,
  origin,
}: {
  path: string;
  aspect: "video" | "portrait" | "square";
  origin: string;
}) {
  const [nonce, setNonce] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const url = `${origin}${path}?_=${nonce}`;

  const aspectClass =
    aspect === "video"
      ? "aspect-video"
      : aspect === "portrait"
      ? "aspect-[9/16] max-h-[420px] mx-auto"
      : "aspect-square max-w-[280px] mx-auto";

  const refresh = () => {
    setLoading(true);
    setNonce((n) => n + 1);
  };

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">实时预览</span>
        <div className="flex items-center gap-1">
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            换一张
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Maximize2 className="size-3.5" />
            放大
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ExternalLink className="size-3.5" />
            新窗口
          </a>
        </div>
      </div>
      <div
        className={`relative w-full ${aspectClass} overflow-hidden rounded-xl border border-border bg-muted/40`}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="size-6 animate-spin text-muted-foreground/60" />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="随机图片预览"
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            toast.error("图片加载失败");
          }}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-2">
          <DialogTitle className="sr-only">图片预览</DialogTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="随机图片大图"
            className="w-full rounded-lg object-contain max-h-[80vh]"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
