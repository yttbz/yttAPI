import { NextResponse } from "next/server";
import { login } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ code: 400, error: "请输入密码" }, { status: 400 });
    }
    const ok = await login(password);
    if (!ok) {
      return NextResponse.json({ code: 401, error: "密码错误" }, { status: 401 });
    }
    return NextResponse.json({ code: 200, message: "登录成功" });
  } catch {
    return NextResponse.json({ code: 500, error: "服务器错误" }, { status: 500 });
  }
}
