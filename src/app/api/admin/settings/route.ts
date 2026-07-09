import { NextResponse } from "next/server";
import { getAllSettings, setSetting, SETTING_KEYS } from "@/lib/settings";

export const dynamic = "force-dynamic";

// 获取站点设置
export async function GET() {
  const all = await getAllSettings();
  return NextResponse.json({
    code: 200,
    settings: {
      site_base_url: all[SETTING_KEYS.SITE_BASE_URL] || "",
      api_base_url: all[SETTING_KEYS.API_BASE_URL] || "",
    },
  });
}

// 更新站点设置
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const siteBaseUrl = (body.site_base_url || "").trim().replace(/\/+$/, "");
    const apiBaseUrl = (body.api_base_url || "").trim().replace(/\/+$/, "");

    await setSetting(SETTING_KEYS.SITE_BASE_URL, siteBaseUrl);
    await setSetting(SETTING_KEYS.API_BASE_URL, apiBaseUrl);

    return NextResponse.json({
      code: 200,
      message: "设置已保存",
      settings: { site_base_url: siteBaseUrl, api_base_url: apiBaseUrl },
    });
  } catch (e) {
    return NextResponse.json(
      { code: 500, error: e instanceof Error ? e.message : "保存失败" },
      { status: 500 }
    );
  }
}
