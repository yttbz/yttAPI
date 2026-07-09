import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, checkToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const ok = await checkToken(token);

  // 后台页面: /admin 和 /yttbz
  const isAdminPage =
    (pathname.startsWith("/admin") || pathname.startsWith("/yttbz")) &&
    !pathname.endsWith("/login");

  if (isAdminPage) {
    if (!ok) {
      const url = request.nextUrl.clone();
      // 统一重定向到 /yttbz/login
      url.pathname = "/yttbz/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 后台 API
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
    if (!ok) {
      return NextResponse.json({ code: 401, error: "未登录或登录已过期" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/yttbz/:path*", "/api/admin/:path*"],
};
