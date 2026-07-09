import { serveRandomImage } from "@/lib/serve";
import { increment } from "@/lib/stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 随机二次元头像
export async function GET(request: Request) {
  increment("pp");
  return serveRandomImage("pp", request);
}
