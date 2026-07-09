import { serveRandomImage } from "@/lib/serve";
import { detectDevice } from "@/lib/ua";
import { increment } from "@/lib/stats";
import type { ImageKind } from "@/lib/images";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 双端自适应：根据 User-Agent 自动选择 pc / phon
export async function GET(request: Request) {
  increment("acg");
  const device = detectDevice(request.headers.get("user-agent"));
  const kind: ImageKind = device === "phon" ? "phon" : "pc";
  const resp = await serveRandomImage(kind, request);
  resp.headers.set("x-device", device);
  return resp;
}
