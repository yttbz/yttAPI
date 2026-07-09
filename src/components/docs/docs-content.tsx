"use client";

import * as React from "react";
import {
  Sparkles,
  Zap,
  Shield,
  Smartphone,
  Monitor,
  Image as ImageIcon,
  Globe,
  Server,
  FolderTree,
  Settings,
  HelpCircle,
  Mail,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { ENDPOINTS } from "@/lib/docs-data";
import { EndpointDetail } from "./endpoint-detail";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Stats = {
  total_calls: number;
  today_calls: number;
  uptime_days: number;
  calls: Record<string, number>;
  images: { pc: number; phon: number; pp: number; bg: number; total: number };
};

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

export function DocsContent({
  active,
  origin,
}: {
  active: string;
  origin: string;
}) {
  const [stats, setStats] = React.useState<Stats | null>(null);

  React.useEffect(() => {
    fetch(`${origin}/api/stats`)
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, [origin]);

  // 端点类章节
  if (ENDPOINTS[active]) {
    return (
      <div className="px-5 py-8 lg:px-10 lg:py-10 max-w-3xl mx-auto">
        <EndpointDetail ep={ENDPOINTS[active]} origin={origin} />
        <PrevNext active={active} />
      </div>
    );
  }

  switch (active) {
    case "welcome":
      return <Welcome stats={stats} origin={origin} />;
    case "intro":
      return <Intro />;
    case "contact":
      return <Contact />;
    case "deploy":
      return <Deploy origin={origin} />;
    case "faq":
      return <Faq />;
    default:
      return <Welcome stats={stats} origin={origin} />;
  }
}

/* ---------------- Welcome ---------------- */
function Welcome({ stats, origin }: { stats: Stats | null; origin: string }) {
  return (
    <div className="px-5 py-8 lg:px-10 lg:py-10 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="hero-gradient -mx-5 px-5 py-10 lg:-mx-10 lg:px-10 rounded-b-2xl mb-8 border-b border-border">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 border-primary/20">
          <Sparkles className="size-3.5 mr-1" />
          免费 · 稳定 · 快速
        </Badge>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          欢迎使用 <span className="text-primary">yttAPI</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          yttAPI 是一个免费、稳定、快速的随机图片 API 服务。提供双端自适应、电脑端、移动端随机图片，
          以及随机头像、背景图等接口，一个链接即可为你的网站、博客、应用注入随机美图。
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href={`${origin}/api/acg`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Zap className="size-4" />
            立即体验
          </a>
          <a
            href="#intro"
            onClick={(e) => { e.preventDefault(); document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            查看文档
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <StatCard
          icon={<TrendingUp className="size-5" />}
          label="总调用量"
          value={stats ? fmt(stats.total_calls) : "—"}
          color="text-primary"
        />
        <StatCard
          icon={<Zap className="size-5" />}
          label="今日调用"
          value={stats ? fmt(stats.today_calls) : "—"}
          color="text-amber-500"
        />
        <StatCard
          icon={<Server className="size-5" />}
          label="运行天数"
          value={stats ? `${stats.uptime_days} 天` : "—"}
          color="text-emerald-500"
        />
        <StatCard
          icon={<ImageIcon className="size-5" />}
          label="图片总数"
          value={stats ? `${stats.images.total} 张` : "—"}
          color="text-sky-500"
        />
      </div>

      {/* 接口速览 */}
      <h2 className="text-2xl font-semibold tracking-tight mb-4 border-b border-border pb-2">接口速览</h2>
      <p className="text-muted-foreground mb-5">
        以下是 yttAPI 提供的全部接口，点击卡片可查看详细文档与实时预览。
      </p>
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        {Object.values(ENDPOINTS).map((ep) => (
          <a
            key={ep.id}
            href={`#${ep.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.dispatchEvent(
                new CustomEvent("docs:navigate", { detail: ep.id })
              );
            }}
            className="gh-card group p-4 hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <EndpointIcon id={ep.id} />
                <span className="font-semibold">{ep.title}</span>
              </div>
              <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{ep.desc}</p>
            <code className="text-xs font-mono text-primary mt-2 inline-block">{ep.path}</code>
          </a>
        ))}
      </div>

      {/* 特性 */}
      <h2 className="text-2xl font-semibold tracking-tight mb-4 border-b border-border pb-2">特性</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Feature icon={<Zap className="size-5" />} title="极速响应" desc="302 重定向直出，CDN 友好，毫秒级返回随机图片。" />
        <Feature icon={<Smartphone className="size-5" />} title="双端自适应" desc="一个接口自动识别电脑/手机，返回对应比例壁纸。" />
        <Feature icon={<Shield className="size-5" />} title="稳定可靠" desc="支持自定义图片目录，本地化部署，数据自主可控。" />
        <Feature icon={<Globe className="size-5" />} title="跨域支持" desc="所有接口默认开启 CORS，可直接用于前端项目。" />
        <Feature icon={<ImageIcon className="size-5" />} title="多格式兼容" desc="支持 jpg / png / webp / gif / avif 等常见图片格式。" />
        <Feature icon={<Settings className="size-5" />} title="灵活参数" desc="支持重定向、JSON、列表等多种返回模式。" />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="gh-card p-4">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="gh-card p-4">
      <div className="flex items-center gap-2 mb-2 text-primary">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function EndpointIcon({ id }: { id: string }) {
  const map: Record<string, React.ReactNode> = {
    acg: <Smartphone className="size-4 text-primary" />,
    pc: <Monitor className="size-4 text-primary" />,
    pe: <Smartphone className="size-4 text-primary" />,
    pp: <ImageIcon className="size-4 text-primary" />,
    bg: <ImageIcon className="size-4 text-primary" />,
    getip: <Globe className="size-4 text-primary" />,
    stats: <TrendingUp className="size-4 text-primary" />,
  };
  return <>{map[id] ?? <ImageIcon className="size-4 text-primary" />}</>;
}

/* ---------------- Intro ---------------- */
function Intro() {
  return (
    <div className="docs-prose px-5 py-8 lg:px-10 lg:py-10 max-w-3xl mx-auto">
      <h1>简介</h1>
      <p>
        yttAPI 是一个轻量级的随机图片 API 服务，灵感来源于 LoliApi 等知名随机图床 API。
        它通过读取本地图片目录，随机返回一张图片，可用于网站背景、博客封面、随机头像、
        占位图等多种场景。整个服务基于 Next.js 构建，部署简单，响应迅速。
      </p>
      <p>
        与直接托管静态图片不同，yttAPI 提供的是「随机」能力——每次请求都会从图片库中
        随机抽取一张返回。这意味着你只需在 HTML 里写一个固定的 <code>&lt;img src&gt;</code>，
        每次刷新页面就能看到不同的图片，非常适合用作博客背景、登录页装饰、随机头像等。
      </p>

      <h2>核心能力</h2>
      <ul>
        <li>
          <strong>双端自适应</strong>：根据 User-Agent 自动判断设备类型，电脑端返回横屏壁纸，
          手机端返回竖屏壁纸，一个接口搞定两端适配。
        </li>
        <li>
          <strong>分类接口</strong>：提供电脑端（<code>/api/acg/pc</code>）、手机端
          （<code>/api/acg/pe</code>）、头像（<code>/api/acg/pp</code>）、背景图
          （<code>/api/bg</code>）等独立接口，按需调用。
        </li>
        <li>
          <strong>多种返回模式</strong>：默认 302 重定向到图片（适合 <code>&lt;img&gt;</code> 与 CSS 背景），
          也支持直接返回图片字节流（<code>?redirect=0</code>）与 JSON 元数据（<code>?type=json</code>）。
        </li>
        <li>
          <strong>本地图片库</strong>：图片存放在服务器本地目录，无需依赖第三方图床，
          数据完全自主可控，可随时增删图片。
        </li>
        <li>
          <strong>跨域友好</strong>：所有接口默认返回 <code>Access-Control-Allow-Origin: *</code>，
          可直接在前端项目中跨域调用。
        </li>
      </ul>

      <h2>适用场景</h2>
      <ul>
        <li>个人博客、主页的随机背景图</li>
        <li>登录页、注册页的装饰性壁纸</li>
        <li>论坛、社区用户的随机默认头像</li>
        <li>网页 Demo、原型设计的占位图</li>
        <li>聊天机器人、Telegram Bot 的随机配图</li>
        <li>任何需要「每次刷新都不同」的图片展示场景</li>
      </ul>

      <h2>技术栈</h2>
      <p>
        yttAPI 基于 <strong>Next.js 16</strong>（App Router）构建，使用 TypeScript 保证类型安全，
        Tailwind CSS 4 实现响应式布局，shadcn/ui 提供组件库支持。图片读取使用 Node.js 原生
        <code>fs</code> 模块，无需数据库，部署后开箱即用。
      </p>
      <PrevNext active="intro" />
    </div>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  return (
    <div className="docs-prose px-5 py-8 lg:px-10 lg:py-10 max-w-3xl mx-auto">
      <h1>联系邮箱</h1>
      <p>
        如果你在使用 yttAPI 的过程中遇到任何问题，或者有功能建议、合作意向，
        欢迎通过以下方式与作者取得联系。作者会在看到邮件后尽快回复。
      </p>

      <div className="rounded-xl border border-border p-5 my-5 bg-muted/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="size-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">联系邮箱</div>
            <a
              href="mailto:y@m1f.cn"
              className="text-lg font-semibold hover:text-primary transition-colors"
            >
              y@m1f.cn
            </a>
          </div>
        </div>
      </div>

      <h2>反馈前请准备</h2>
      <p>为了能更快地定位问题，建议在邮件中包含以下信息：</p>
      <ul>
        <li>出现问题的接口地址（例如 <code>/api/acg/pc</code>）</li>
        <li>请求方式与参数（例如 <code>?type=json</code>）</li>
        <li>完整的错误信息或返回内容</li>
        <li>你的使用场景（浏览器、服务端、Bot 等）</li>
        <li>访问时间与你的公网 IP（便于排查限流问题）</li>
      </ul>

      <h2>其他渠道</h2>
      <p>
        除了邮件，你也可以通过 GitHub Issues 提交问题，或在相关技术社区发帖讨论。
        欢迎提交 Pull Request 共同完善本项目。
      </p>
      <PrevNext active="contact" />
    </div>
  );
}

/* ---------------- Deploy ---------------- */
function Deploy({ origin }: { origin: string }) {
  return (
    <div className="docs-prose px-5 py-8 lg:px-10 lg:py-10 max-w-3xl mx-auto">
      <h1>部署与配置</h1>
      <p>
        yttAPI 采用本地图片目录作为图片源。默认情况下，服务会读取项目内的示例图片；
        在生产环境中，你可以通过环境变量将图片目录指向任意本地路径，例如你的
        <code>/home/ytt/photo/pc</code> 与 <code>/home/ytt/photo/phon</code> 目录。
      </p>

      <h2>目录结构</h2>
      <p>推荐按以下结构组织图片目录：</p>
      <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden my-3">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <FolderTree className="size-3.5 text-white/50" />
          <span className="text-xs text-white/50 font-mono">目录结构</span>
        </div>
        <pre className="overflow-x-auto scrollbar-thin p-4 text-[13px] leading-relaxed">
          <code className="font-mono text-white/90">{`/home/ytt/photo/
├── pc/          # 电脑端横屏壁纸 (1920×1080)
│   ├── 001.jpg
│   ├── 002.jpg
│   └── ...
├── phon/        # 手机端竖屏壁纸 (1080×1920)
│   ├── 001.jpg
│   ├── 002.jpg
│   └── ...
├── pp/          # 正方形头像 (可选, 默认复用 phon)
│   └── ...
└── bg/          # 背景图 (可选, 默认复用 pc)
    └── ...`}</code>
        </pre>
      </div>
      <p>
        其中 <code>pc</code> 与 <code>phon</code> 是必需的两个目录，分别对应电脑端与手机端图片；
        <code>pp</code>（头像）与 <code>bg</code>（背景图）为可选目录，若未配置则分别复用
        <code>phon</code> 与 <code>pc</code> 的图片。支持的图片格式包括 jpg、jpeg、png、webp、gif、bmp、avif。
      </p>

      <h2>环境变量配置</h2>
      <p>
        通过以下环境变量将图片目录指向你的真实路径。在当前预览环境中，未设置这些变量时会自动
        回退到项目内置的示例图片，确保接口始终可用。
      </p>
      <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden my-3">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <Settings className="size-3.5 text-white/50" />
          <span className="text-xs text-white/50 font-mono">.env</span>
        </div>
        <pre className="overflow-x-auto scrollbar-thin p-4 text-[13px] leading-relaxed">
          <code className="font-mono text-emerald-300/90">{`# 电脑端图片目录
IMAGE_PC_DIR=/home/ytt/photo/pc

# 手机端图片目录
IMAGE_PHON_DIR=/home/ytt/photo/phon

# 头像图片目录（可选）
IMAGE_PP_DIR=/home/ytt/photo/pp

# 背景图目录（可选）
IMAGE_BG_DIR=/home/ytt/photo/bg`}</code>
        </pre>
      </div>

      <h2>部署步骤</h2>
      <ol>
        <li>
          克隆项目代码到服务器：<code>git clone https://github.com/yttbz/yttAPI.git yttapi &amp;&amp; cd yttapi</code>
        </li>
        <li>
          安装依赖：<code>bun install</code>（或 <code>npm install</code>）
        </li>
        <li>
          配置环境变量：在项目根目录创建 <code>.env</code> 文件，填入上文的图片目录路径
        </li>
        <li>
          构建生产版本：<code>bun run build</code>
        </li>
        <li>
          启动服务：<code>bun run start</code>，默认监听 3000 端口
        </li>
        <li>
          （可选）使用 Nginx / Caddy 反向代理到 3000 端口，并配置 HTTPS
        </li>
      </ol>

      <h2>添加新图片</h2>
      <p>
        直接将图片文件放入对应目录即可，无需重启服务。yttAPI 会在每次请求时重新读取目录
        （带文件 mtime 缓存，目录内容变化后自动刷新），新增的图片会立即参与随机抽取。
        建议图片文件名使用英文与数字，避免特殊字符导致 URL 编码问题。
      </p>

      <h2>反向代理示例</h2>
      <p>如果使用 Nginx 反向代理，建议保留真实 IP 头，以便 <code>/api/getip</code> 接口正常工作：</p>
      <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden my-3">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <Server className="size-3.5 text-white/50" />
          <span className="text-xs text-white/50 font-mono">nginx.conf</span>
        </div>
        <pre className="overflow-x-auto scrollbar-thin p-4 text-[13px] leading-relaxed">
          <code className="font-mono text-white/90">{`server {
  listen 80;
  server_name api.m1f.cn;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}`}</code>
        </pre>
      </div>
      <PrevNext active="deploy" />
    </div>
  );
}

/* ---------------- FAQ ---------------- */
function Faq() {
  const faqs = [
    {
      q: "接口返回的图片是随机的吗？",
      a: "是的。每次请求都会从对应分类的图片目录中随机抽取一张返回。由于使用 302 重定向，浏览器会自动跟随到真实图片地址，因此每次刷新页面都会看到不同的图片。",
    },
    {
      q: "为什么我刷新页面图片没变？",
      a: "可能是浏览器或 CDN 缓存了重定向结果。yttAPI 已在响应头设置 no-cache，但部分浏览器仍可能缓存。可尝试强制刷新（Ctrl+F5），或在 URL 后追加随机参数（如 ?_=时间戳）绕过缓存。",
    },
    {
      q: "支持哪些图片格式？",
      a: "支持 jpg、jpeg、png、webp、gif、bmp、avif 等常见格式。只要文件扩展名匹配，就会被纳入随机池。建议统一使用 jpg 或 webp 以获得更小的体积。",
    },
    {
      q: "如何添加自己的图片？",
      a: "将图片文件放入对应的图片目录（如 /home/ytt/photo/pc）即可，无需重启服务。服务会自动检测目录变化并刷新图片列表。详见「部署与配置」章节。",
    },
    {
      q: "双端自适应是怎么判断设备的？",
      a: "通过解析请求的 User-Agent 头判断。如果 UA 中包含 Android、iPhone、iPad、Windows Phone 等移动设备标识，则返回手机端竖屏图片；否则返回电脑端横屏图片。",
    },
    {
      q: "接口支持跨域调用吗？",
      a: "支持。所有接口默认返回 Access-Control-Allow-Origin: *，可以直接在前端项目中通过 <img>、fetch、CSS 背景等方式跨域调用，无需额外配置。",
    },
    {
      q: "可以直接返回图片字节流而不是重定向吗？",
      a: "可以。在接口 URL 后追加 ?redirect=0 参数，接口会直接返回图片的字节流（Content-Type 为 image/jpeg 等），而不是 302 重定向。适合需要直接代理图片内容的场景。",
    },
    {
      q: "如何获取图片的真实 URL 而不是直接显示？",
      a: "在接口 URL 后追加 ?type=json 参数，接口会返回 JSON 格式的响应，包含图片的真实 URL、文件名等信息，便于在程序中进一步处理。",
    },
  ];
  return (
    <div className="docs-prose px-5 py-8 lg:px-10 lg:py-10 max-w-3xl mx-auto">
      <h1>常见问题</h1>
      <p>
        以下是使用 yttAPI 时最常遇到的问题与解答。如果你的问题不在此列表中，
        请参考「联系邮箱」章节与作者取得联系。
      </p>
      <div className="space-y-3 my-6">
        {faqs.map((f, i) => (
          <div key={i} className="rounded-xl border border-border p-4">
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle className="size-5 text-primary shrink-0 mt-0.5" />
              <h3 className="text-base font-semibold mt-0">{f.q}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-7">{f.a}</p>
          </div>
        ))}
      </div>
      <PrevNext active="faq" />
    </div>
  );
}

/* ---------------- Prev/Next 导航 ---------------- */
const ORDER = [
  "welcome",
  "intro",
  "contact",
  "acg",
  "pc",
  "pe",
  "pp",
  "bg",
  "getip",
  "stats",
  "deploy",
  "faq",
];
const TITLES: Record<string, string> = {
  welcome: "欢迎使用 yttAPI",
  intro: "简介",
  contact: "联系邮箱",
  acg: "双端自适应随机图片",
  pc: "电脑端随机图片",
  pe: "手机端随机图片",
  pp: "随机二次元头像",
  bg: "随机背景图",
  getip: "获取当前 IP",
  stats: "统计信息",
  deploy: "部署与配置",
  faq: "常见问题",
};

function PrevNext({ active }: { active: string }) {
  const idx = ORDER.indexOf(active);
  const prev = idx > 0 ? ORDER[idx - 1] : null;
  const next = idx < ORDER.length - 1 ? ORDER[idx + 1] : null;

  const go = (id: string) => {
    document.dispatchEvent(new CustomEvent("docs:navigate", { detail: id }));
  };

  return (
    <div className="flex items-center justify-between gap-3 mt-12 pt-6 border-t border-border">
      {prev ? (
        <button
          onClick={() => go(prev)}
          className="group flex-1 rounded-lg border border-border p-3 text-left hover:border-primary/40 hover:bg-accent/50 transition-colors"
        >
          <div className="text-xs text-muted-foreground mb-1">← 上一篇</div>
          <div className="text-sm font-medium">{TITLES[prev]}</div>
        </button>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <button
          onClick={() => go(next)}
          className="group flex-1 rounded-lg border border-border p-3 text-right hover:border-primary/40 hover:bg-accent/50 transition-colors"
        >
          <div className="text-xs text-muted-foreground mb-1">下一篇 →</div>
          <div className="text-sm font-medium">{TITLES[next]}</div>
        </button>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
