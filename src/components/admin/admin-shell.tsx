"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  FileText,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/yttbz", label: "仪表盘", icon: LayoutDashboard, exact: true },
  { href: "/yttbz/images", label: "图片管理", icon: ImageIcon },
  { href: "/yttbz/articles", label: "文章管理", icon: FileText },
  { href: "/yttbz/settings", label: "站点设置", icon: Settings },
];

export function AdminShell({
  authed,
  children,
}: {
  authed: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/yttbz/login";
  const [mobileOpen, setMobileOpen] = React.useState(false);

  if (isLogin || !authed) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const onLogout = async () => {
    const res = await fetch("/api/admin/logout", { method: "POST" });
    if (res.ok) {
      toast.success("已退出登录");
      router.push("/yttbz/login");
    }
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background px-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
        <Link href="/yttbz" className="flex items-center gap-2 font-semibold">
          <div className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
            <ImageIcon className="size-4" />
          </div>
          <span className="hidden sm:inline">yttAPI 管理后台</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" target="_blank">
              <ExternalLink className="size-4" />
              <span className="hidden sm:inline">查看前台</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="size-4" />
            <span className="hidden sm:inline">退出</span>
          </Button>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden lg:block w-60 shrink-0 border-r border-border bg-background min-h-[calc(100vh-3.5rem)]">
          <SidebarNav pathname={pathname} isActive={isActive} />
        </aside>

        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-64 bg-background border-r border-border">
              <div className="flex h-14 items-center justify-between px-4 border-b border-border">
                <span className="font-semibold">导航</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="size-5" />
                </Button>
              </div>
              <SidebarNav
                pathname={pathname}
                isActive={isActive}
                onNavigate={() => setMobileOpen(false)}
              />
            </aside>
          </div>
        )}

        <main className="flex-1 min-w-0 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarNav({
  pathname,
  isActive,
  onNavigate,
}: {
  pathname: string;
  isActive: (href: string, exact?: boolean) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive(item.href, item.exact)
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
