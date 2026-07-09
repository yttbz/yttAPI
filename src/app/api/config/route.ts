import { NextResponse } from "next/server";
import { getAllSettings, SETTING_KEYS } from "@/lib/settings";

export const dynamic = "force-dynamic";

// 公开配置接口：前端用来获取站点对外地址（用于展示接口地址、图片跳转）
// 不返回敏感信息，只返回 site_base_url / api_base_url
export async function GET(request: Request) {
  const all = await getAllSettings();
  const fallback = new URL(request.url).origin;
  const siteBase = all[SETTING_KEYS.SITE_BASE_URL]?.trim().replace(/\/+$/, "") || fallback;
  const apiBase = all[SETTING_KEYS.API_BASE_URL]?.trim().replace(/\/+$/, "") || siteBase;
  return NextResponse.json({
    code: 200,
    site_base_url: siteBase,
    api_base_url: apiBase,
  });
}
