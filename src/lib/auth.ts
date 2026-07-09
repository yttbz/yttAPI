/**
 * 简单的后台认证：基于环境变量 ADMIN_PASSWORD 的 cookie 方案。
 *
 * 本文件会被 Edge Middleware 引入，因此签名函数使用 Web Crypto API
 * (SubtleCrypto)，它在 Edge 和 Node 运行时都可用。
 */

const COOKIE_NAME = "yttapi_admin";
const SECRET = process.env.ADMIN_SECRET || "yttapi-default-secret-2024";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

// 缓存 HMAC key，避免每次都 importKey
let cachedKey: Promise<CryptoKey> | null = null;
async function getKey(): Promise<CryptoKey> {
  if (!cachedKey) {
    cachedKey = crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
  }
  return cachedKey;
}

async function sign(value: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** 校验 token 是否合法（Edge 兼容）。 */
export async function checkToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const expected = await sign(getAdminPassword());
  return token === expected;
}

export { COOKIE_NAME };

// ===== 以下为 Node 运行时专用（Route Handler 中使用）=====

export async function login(password: string): Promise<boolean> {
  const expected = getAdminPassword();
  if (password !== expected) return false;
  const { cookies } = await import("next/headers");
  const token = await sign(expected);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return true;
}

export async function logout(): Promise<void> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return checkToken(token);
}
