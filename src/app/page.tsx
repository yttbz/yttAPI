"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import { DocsHeader } from "@/components/docs/docs-header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsContent } from "@/components/docs/docs-content";

export default function Home() {
  const [active, setActive] = React.useState("welcome");
  const [origin, setOrigin] = React.useState("");

  React.useEffect(() => {
    // 优先从后台配置获取站点地址，回退到当前 origin
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => setOrigin(d.site_base_url || window.location.origin))
      .catch(() => setOrigin(window.location.origin));
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setActive(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    document.addEventListener("docs:navigate", handler);
    return () => document.removeEventListener("docs:navigate", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DocsHeader active={active} onSelect={setActive} />
      <div className="flex">
        {/* 桌面端侧边栏 */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-border h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto scrollbar-thin">
          <DocsSidebar active={active} onSelect={(id) => { setActive(id); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 min-w-0">
          <DocsContent active={active} origin={origin} />
          <Footer />
        </main>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-5 py-8 lg:px-10">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-foreground text-background">
            <svg viewBox="0 0 24 24" fill="none" className="size-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <span>© {new Date().getFullYear()} yttAPI · 仅供学习交流使用</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="hover:text-foreground transition-colors">文档</a>
          <a href="https://github.com/yttbz/yttAPI" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          <a href="mailto:y@m1f.cn" className="hover:text-foreground transition-colors">联系</a>
          <a href="https://m1f.cn" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors">
            官网 m1f.cn
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
