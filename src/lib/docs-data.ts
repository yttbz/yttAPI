/**
 * 文档站点的内容定义：导航树 + 各端点元信息。
 */

export type NavItem = {
  id: string;
  title: string;
  icon?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV: NavGroup[] = [
  {
    label: "开始",
    items: [
      { id: "welcome", title: "欢迎使用 yttAPI" },
      { id: "intro", title: "简介" },
      { id: "contact", title: "联系邮箱" },
    ],
  },
  {
    label: "API 使用文档",
    items: [
      { id: "acg", title: "双端自适应随机图片" },
      { id: "pc", title: "电脑端随机图片" },
      { id: "pe", title: "手机端随机图片" },
      { id: "pp", title: "随机二次元头像" },
      { id: "bg", title: "随机背景图" },
      { id: "getip", title: "获取当前 IP" },
      { id: "stats", title: "统计信息" },
    ],
  },
  {
    label: "更多",
    items: [
      { id: "deploy", title: "部署与配置" },
      { id: "faq", title: "常见问题" },
    ],
  },
];

export type EndpointMeta = {
  id: string;
  path: string; // 接口路径，如 /api/acg
  method: "GET";
  title: string;
  desc: string;
  device?: "pc" | "phon" | "auto";
  previewKind: "pc" | "phon" | "pp" | "bg";
  previewAspect: "video" | "portrait" | "square";
  params?: { name: string; type: string; default: string; desc: string }[];
  examples: { lang: string; label: string; code: string }[];
  response: string;
};

const ORIGIN = ""; // 使用相对路径，运行时由前端拼接

export const ENDPOINTS: Record<string, EndpointMeta> = {
  acg: {
    id: "acg",
    path: "/api/acg",
    method: "GET",
    title: "双端自适应随机图片",
    desc:
      "根据请求的 User-Agent 自动判断设备类型：电脑端访问返回横屏壁纸（来自 pc 目录），手机端访问返回竖屏壁纸（来自 phon 目录）。一个链接即可同时适配电脑与手机，是最常用的接口。",
    device: "auto",
    previewKind: "pc",
    previewAspect: "video",
    params: [
      { name: "redirect", type: "0/1", default: "1", desc: "是否 302 重定向到图片。默认 1；设为 0 则直接返回图片字节流。" },
      { name: "type", type: "string", default: "-", desc: "设为 json 时返回 JSON（含图片 URL）。" },
      { name: "list", type: "0/1", default: "0", desc: "设为 1 时返回该分类下全部图片列表。" },
    ],
    examples: [
      { lang: "html", label: "HTML", code: `<img src="${ORIGIN}/api/acg" alt="随机图片" />` },
      { lang: "css", label: "CSS 背景", code: `body {\n  background-image: url("${ORIGIN}/api/acg");\n  background-size: cover;\n}` },
      { lang: "markdown", label: "Markdown", code: `![随机图片](${ORIGIN}/api/acg)` },
      { lang: "json", label: "JSON 模式", code: `${ORIGIN}/api/acg?type=json` },
    ],
    response: `{
  "code": 200,
  "url": "https://your-domain.com/api/img/pc/pc_03.jpg",
  "filename": "pc_03.jpg"
}`,
  },
  pc: {
    id: "pc",
    path: "/api/acg/pc",
    method: "GET",
    title: "电脑端随机图片",
    desc:
      "始终返回横屏壁纸（来自 pc 目录），适合用作电脑桌面壁纸、网页横幅背景等宽屏场景。无论访问设备是电脑还是手机，都返回横屏图片。",
    device: "pc",
    previewKind: "pc",
    previewAspect: "video",
    params: [
      { name: "redirect", type: "0/1", default: "1", desc: "是否 302 重定向到图片。" },
      { name: "type", type: "string", default: "-", desc: "设为 json 时返回 JSON。" },
      { name: "list", type: "0/1", default: "0", desc: "设为 1 时返回全部图片列表。" },
    ],
    examples: [
      { lang: "html", label: "HTML", code: `<img src="${ORIGIN}/api/acg/pc" alt="电脑端随机图片" />` },
      { lang: "css", label: "CSS 背景", code: `body {\n  background: url("${ORIGIN}/api/acg/pc") center/cover no-repeat;\n}` },
      { lang: "markdown", label: "Markdown", code: `![电脑壁纸](${ORIGIN}/api/acg/pc)` },
    ],
    response: `{
  "code": 200,
  "url": "https://your-domain.com/api/img/pc/pc_07.jpg",
  "filename": "pc_07.jpg"
}`,
  },
  pe: {
    id: "pe",
    path: "/api/acg/pe",
    method: "GET",
    title: "手机端随机图片",
    desc:
      "始终返回竖屏壁纸（来自 phon 目录），适合用作手机锁屏、手机壁纸等竖屏场景。无论访问设备是电脑还是手机，都返回竖屏图片。",
    device: "phon",
    previewKind: "phon",
    previewAspect: "portrait",
    params: [
      { name: "redirect", type: "0/1", default: "1", desc: "是否 302 重定向到图片。" },
      { name: "type", type: "string", default: "-", desc: "设为 json 时返回 JSON。" },
      { name: "list", type: "0/1", default: "0", desc: "设为 1 时返回全部图片列表。" },
    ],
    examples: [
      { lang: "html", label: "HTML", code: `<img src="${ORIGIN}/api/acg/pe" alt="手机端随机图片" />` },
      { lang: "css", label: "CSS 背景", code: `.phone-screen {\n  background: url("${ORIGIN}/api/acg/pe") center/cover;\n}` },
      { lang: "markdown", label: "Markdown", code: `![手机壁纸](${ORIGIN}/api/acg/pe)` },
    ],
    response: `{
  "code": 200,
  "url": "https://your-domain.com/api/img/phon/phon_02.jpg",
  "filename": "phon_02.jpg"
}`,
  },
  pp: {
    id: "pp",
    path: "/api/acg/pp",
    method: "GET",
    title: "随机二次元头像",
    desc:
      "返回正方形头像图片（来自 pp 目录），适合用作论坛、博客、社交平台的随机头像。图片为 1:1 正方形比例。",
    previewKind: "pp",
    previewAspect: "square",
    params: [
      { name: "redirect", type: "0/1", default: "1", desc: "是否 302 重定向到图片。" },
      { name: "type", type: "string", default: "-", desc: "设为 json 时返回 JSON。" },
    ],
    examples: [
      { lang: "html", label: "HTML", code: `<img src="${ORIGIN}/api/acg/pp" alt="随机头像" width="128" height="128" />` },
      { lang: "css", label: "CSS 头像", code: `.avatar {\n  background: url("${ORIGIN}/api/acg/pp") center/cover;\n  border-radius: 50%;\n}` },
      { lang: "markdown", label: "Markdown", code: `![头像](${ORIGIN}/api/acg/pp)` },
    ],
    response: `{
  "code": 200,
  "url": "https://your-domain.com/api/img/pp/pp_05.jpg",
  "filename": "pp_05.jpg"
}`,
  },
  bg: {
    id: "bg",
    path: "/api/bg",
    method: "GET",
    title: "随机背景图",
    desc:
      "返回随机背景图（来自 bg 目录），适合用作网页背景、卡片封面等装饰性场景。默认为横屏比例。",
    previewKind: "bg",
    previewAspect: "video",
    params: [
      { name: "redirect", type: "0/1", default: "1", desc: "是否 302 重定向到图片。" },
      { name: "type", type: "string", default: "-", desc: "设为 json 时返回 JSON。" },
    ],
    examples: [
      { lang: "html", label: "HTML", code: `<img src="${ORIGIN}/api/bg" alt="随机背景" />` },
      { lang: "css", label: "CSS 背景", code: `body {\n  background: url("${ORIGIN}/api/bg") center/cover fixed;\n}` },
      { lang: "markdown", label: "Markdown", code: `![背景](${ORIGIN}/api/bg)` },
    ],
    response: `{
  "code": 200,
  "url": "https://your-domain.com/api/img/bg/bg_01.jpg",
  "filename": "bg_01.jpg"
}`,
  },
  getip: {
    id: "getip",
    path: "/api/getip",
    method: "GET",
    title: "获取当前 IP",
    desc:
      "返回请求者的真实 IP 地址（已考虑 X-Forwarded-For 与 X-Real-IP 反向代理头）。常用于网络调试、IP 归属展示等场景。",
    examples: [
      { lang: "bash", label: "curl", code: `curl ${ORIGIN}/api/getip` },
      { lang: "javascript", label: "fetch", code: `fetch("${ORIGIN}/api/getip")\n  .then(r => r.json())\n  .then(d => console.log(d.ip));` },
    ],
    response: `{
  "code": 200,
  "ip": "123.45.67.89"
}`,
  },
  stats: {
    id: "stats",
    path: "/api/stats",
    method: "GET",
    title: "统计信息",
    desc:
      "返回站点的调用统计与图片库数量信息，包括各接口的累计调用量、今日调用量、运行天数以及各分类图片数量。",
    examples: [
      { lang: "bash", label: "curl", code: `curl ${ORIGIN}/api/stats` },
      { lang: "javascript", label: "fetch", code: `fetch("${ORIGIN}/api/stats")\n  .then(r => r.json())\n  .then(d => console.log(d));` },
    ],
    response: `{
  "code": 200,
  "total_calls": 434080074,
  "today_calls": 447904,
  "uptime_days": 2111,
  "calls": { "acg": 283607356, "pc": 12170309, ... },
  "images": { "pc": 10, "phon": 10, "pp": 10, "bg": 6, "total": 36 }
}`,
  },
};
