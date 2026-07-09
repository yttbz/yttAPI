import { prisma } from "@/lib/db";

/**
 * 站点设置：键值对存储。
 * 关键键名：
 *   - site_base_url : 站点对外访问的基础地址（如 https://api.m1f.cn 或 http://1.2.3.4:3000）
 *                     用于 API 跳转目标、前端展示的接口地址。
 *   - api_base_url  : 可选，API 专用基础地址（不设则复用 site_base_url）
 *
 * 当后台未配置时，回退到请求自身的 origin。
 */

const KEY_SITE_BASE = "site_base_url";
const KEY_API_BASE = "api_base_url";

// 内存缓存，避免每次请求都查库；后台修改时通过 invalidate 清除
let cache: Record<string, string> | null = null;
let cacheTs = 0;
const TTL = 5000; // 5 秒

async function loadAll(): Promise<Record<string, string>> {
  if (cache && Date.now() - cacheTs < TTL) return cache;
  const rows = await prisma.siteSetting.findMany();
  const obj: Record<string, string> = {};
  for (const r of rows) obj[r.key] = r.value;
  cache = obj;
  cacheTs = Date.now();
  return obj;
}

/** 修改后调用，清除缓存。 */
export function invalidateSettings() {
  cache = null;
}

/**
 * 获取站点基础地址。
 * @param fallback 回退地址（通常是请求自身的 origin）
 */
export async function getSiteBaseUrl(fallback: string): Promise<string> {
  const all = await loadAll();
  const v = all[KEY_SITE_BASE]?.trim();
  if (v) return v.replace(/\/+$/, "");
  return fallback.replace(/\/+$/, "");
}

/** 获取 API 基础地址（不设则复用站点地址）。 */
export async function getApiBaseUrl(fallback: string): Promise<string> {
  const all = await loadAll();
  const v = all[KEY_API_BASE]?.trim();
  if (v) return v.replace(/\/+$/, "");
  return getSiteBaseUrl(fallback);
}

/** 获取全部设置（后台用）。 */
export async function getAllSettings(): Promise<Record<string, string>> {
  return loadAll();
}

/** 写入设置项。 */
export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  invalidateSettings();
}

export const SETTING_KEYS = {
  SITE_BASE_URL: KEY_SITE_BASE,
  API_BASE_URL: KEY_API_BASE,
};
