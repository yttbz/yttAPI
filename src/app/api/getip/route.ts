import { NextResponse } from "next/server";
import { getClientIP } from "@/lib/ua";
import { increment } from "@/lib/stats";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  increment("getip");
  const ip = getClientIP(request);

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
  const timeStr = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
  const logDir = "/home/ytt/photo/ip";
  const logFile = path.join(logDir, dateStr + ".log");
  const logLine = "[" + dateStr + " " + timeStr + "] " + ip + "\n";

  try {
    await fs.mkdir(logDir, { recursive: true });
    await fs.appendFile(logFile, logLine);
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error("[getip] log write error:", errMsg);
  }

  return NextResponse.json(
    { code: 200, ip },
    {
      headers: {
        "access-control-allow-origin": "*",
        "cache-control": "no-cache",
      },
    }
  );
}
