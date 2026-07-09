import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { listImages, contentType, type ImageKind } from "@/lib/images";

export const dynamic = "force-dynamic";

// 直接访问某分类下的某张图片：/api/img/pc/pc_01.jpg
export function GET(
  _request: Request,
  { params }: { params: Promise<{ kind: string; file: string }> }
) {
  return (async () => {
    const { kind, file } = await params;
    const validKinds: ImageKind[] = ["pc", "phon", "pp", "bg"];
    if (!validKinds.includes(kind as ImageKind)) {
      return new NextResponse("Not found", { status: 404 });
    }
    const safeName = path.basename(decodeURIComponent(file));
    const files = listImages(kind as ImageKind);
    const target = files.find((f) => path.basename(f) === safeName);
    if (!target || !fs.existsSync(target)) {
      return new NextResponse("Not found", { status: 404 });
    }
    const buf = fs.readFileSync(target);
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "content-type": contentType(target),
        "cache-control": "public, max-age=86400, immutable",
        "access-control-allow-origin": "*",
      },
    });
  })();
}
