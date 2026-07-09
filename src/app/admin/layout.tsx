import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 登录页不需要鉴权（middleware 已放行 /admin/login）
  // 这里再做一次服务端校验，用于侧边栏显示
  const authed = await isAuthenticated();
  return (
    <AdminShell authed={authed}>
      {children}
    </AdminShell>
  );
}
