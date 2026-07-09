import { NextResponse } from "next/server";
import { randomImage, readImage, contentType, listImages, type ImageKind } from "@/lib/images";
import { getApiBaseUrl } from "@/lib/settings";

/**
 * 随机图片响应器：
 * - 默认 302 重定向到图片（适合用作 <img src>、背景图等，浏览器会跟随重定向）
 * - ?redirect=0 时直接返回图片字节流
 * - ?type=json 时返回 JSON（含 url 与文件名）
 * - ?list=1 时返回该分类下所有图片的相对路径列表
 *
 * 跳转/返回的 URL 使用后台配置的 API 基础地址（可在后台「站点设置」切换域名/IP）。
 */
export async function serveRandomImage(kind: ImageKind, request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("type") ?? url.searchParams.get("return");
  const redirect = url.searchParams.get("redirect");
  const list = url.searchParams.get("list");

  const fallback = url.origin;
  const apiBase = await getApiBaseUrl(fallback);

  // 列出全部
  if (list === "1") {
    const dir = listImages(kind);
    const items = dir.map((p) => `${apiBase}/api/img/${kind}/${encodeURIComponent(p.split("/").pop()!)}`);
    return NextResponse.json({ code: 200, total: items.length, images: items });
  }

  const file = randomImage(kind);
  if (!file) {
    return new NextResponse("No images available in this category.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const filename = file.split("/").pop()!;

  // JSON 模式
  if (mode === "json") {
    return NextResponse.json({
      code: 200,
      url: `${apiBase}/api/img/${kind}/${encodeURIComponent(filename)}`,
      filename,
      width: null,
      height: null,
    });
  }

  // 直接返回字节流
  if (redirect === "0") {
    const buf = readImage(file);
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "content-type": contentType(file),
        "cache-control": "no-cache, no-store, must-revalidate",
        "access-control-allow-origin": "*",
        "x-image-filename": encodeURIComponent(filename),
      },
    });
  }

  // 默认 302 重定向（使用配置的域名）
  const target = `${apiBase}/api/img/${kind}/${encodeURIComponent(filename)}`;
  return NextResponse.redirect(target, {
    status: 302,
    headers: {
      "cache-control": "no-cache, no-store, must-revalidate",
      "access-control-allow-origin": "*",
      "x-image-filename": encodeURIComponent(filename),
    },
  });
}
