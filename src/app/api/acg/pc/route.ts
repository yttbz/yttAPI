import { serveRandomImage } from "@/lib/serve";
import { increment } from "@/lib/stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 电脑端随机图片
export async function GET(request: Request) {
  increment("pc");
  return serveRandomImage("pc", request);
}
