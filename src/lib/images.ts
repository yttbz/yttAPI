import fs from "fs";
import path from "path";

/**
 * 图片目录配置
 *
 * 在用户的服务器上，可通过环境变量指向真实图片目录：
 *   IMAGE_PC_DIR=/home/ytt/photo/pc
 *   IMAGE_PHON_DIR=/home/ytt/photo/phon
 *   IMAGE_PP_DIR=/home/ytt/photo/pp   (可选，头像目录，默认复用 phon)
 *   IMAGE_BG_DIR=/home/ytt/photo/bg   (可选，背景目录，默认复用 pc)
 *
 * 在当前预览环境中，默认使用 public/sample 下的示例图片。
 */

const SAMPLE = path.join(process.cwd(), "public", "sample");

export type ImageKind = "pc" | "phon" | "pp" | "bg";

function resolveDir(kind: ImageKind): string {
  const envMap: Record<ImageKind, string | undefined> = {
    pc: process.env.IMAGE_PC_DIR,
    phon: process.env.IMAGE_PHON_DIR,
    pp: process.env.IMAGE_PP_DIR,
    bg: process.env.IMAGE_BG_DIR,
  };
  const env = envMap[kind];
  if (env && fs.existsSync(env)) return env;
  // fallback to sample
  return path.join(SAMPLE, kind);
}

// 导出供上传等场景使用
export { resolveDir };

const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".avif"];

const cache = new Map<ImageKind, { files: string[]; mtime: number }>();

/** 列出某个分类下的所有图片（绝对路径），带简易缓存。 */
export function listImages(kind: ImageKind): string[] {
  const dir = resolveDir(kind);
  try {
    const stat = fs.statSync(dir);
    const key = kind;
    const cached = cache.get(key);
    if (cached && cached.mtime === stat.mtimeMs) return cached.files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && IMG_EXT.includes(path.extname(e.name).toLowerCase()))
      .map((e) => path.join(dir, e.name))
      .sort();
    cache.set(key, { files, mtime: stat.mtimeMs });
    return files;
  } catch {
    return [];
  }
}

/** 随机选取一张图片的绝对路径。 */
export function randomImage(kind: ImageKind): string | null {
  const files = listImages(kind);
  if (files.length === 0) return null;
  return files[Math.floor(Math.random() * files.length)];
}

/** 获取某个分类的图片数量。 */
export function countImages(kind: ImageKind): number {
  return listImages(kind).length;
}

/** 读取图片为 Buffer。 */
export function readImage(filePath: string): Buffer {
  return fs.readFileSync(filePath);
}

/** 推断 Content-Type。 */
export function contentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".bmp":
      return "image/bmp";
    case ".avif":
      return "image/avif";
    default:
      return "application/octet-stream";
  }
}

/** 所有分类的统计信息。 */
export function allStats() {
  return {
    pc: countImages("pc"),
    phon: countImages("phon"),
    pp: countImages("pp"),
    bg: countImages("bg"),
    total: countImages("pc") + countImages("phon") + countImages("pp") + countImages("bg"),
  };
}
