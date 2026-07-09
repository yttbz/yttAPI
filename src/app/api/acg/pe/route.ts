import { serveRandomImage } from "@/lib/serve";
import { increment } from "@/lib/stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 移动端随机图片（phon 目录）
export async function GET(request: Request) {
  increment("pe");
  return serveRandomImage("phon", request);
}
