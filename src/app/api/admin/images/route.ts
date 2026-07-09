import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { listImages, type ImageKind } from "@/lib/images";

export const dynamic = "force-dynamic";

// 列出某分类下的所有图片（带文件名、大小、URL）
export async function GET(request: Request) {
  const url = new URL(request.url);
  const kind = (url.searchParams.get("kind") || "pc") as ImageKind;
  const validKinds: ImageKind[] = ["pc", "phon", "pp", "bg"];
  if (!validKinds.includes(kind)) {
    return NextResponse.json({ code: 400, error: "无效的分类" }, { status: 400 });
  }
  const files = listImages(kind);
  const origin = url.origin;
  const items = files.map((f) => {
    const name = path.basename(f);
    let size = 0;
    try {
      size = fs.statSync(f).size;
    } catch {}
    return {
      name,
      size,
      url: `${origin}/api/img/${kind}/${encodeURIComponent(name)}`,
    };
  });
  return NextResponse.json({ code: 200, kind, total: items.length, images: items });
}

// 删除某张图片
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const kind = (url.searchParams.get("kind") || "") as ImageKind;
  const file = url.searchParams.get("file") || "";
  const validKinds: ImageKind[] = ["pc", "phon", "pp", "bg"];
  if (!validKinds.includes(kind) || !file) {
    return NextResponse.json({ code: 400, error: "参数缺失" }, { status: 400 });
  }
  const safeName = path.basename(decodeURIComponent(file));
  const files = listImages(kind);
  const target = files.find((f) => path.basename(f) === safeName);
  if (!target) {
    return NextResponse.json({ code: 404, error: "图片不存在" }, { status: 404 });
  }
  try {
    fs.unlinkSync(target);
    return NextResponse.json({ code: 200, message: "已删除" });
  } catch {
    return NextResponse.json({ code: 500, error: "删除失败" }, { status: 500 });
  }
}
