# yttAPI —— 随机图片 API + 后台管理系统

一个模仿 [loliapi.com](https://docs.loliapi.com) 的随机图片 API 服务，附带完整的后台管理系统（图片管理 + 文章管理），适配移动端和电脑端。

## ✨ 功能特性

### 图片 API（前台）
| 接口 | 路径 | 说明 |
|------|------|------|
| 双端自适应 | `/api/acg` | 根据 User-Agent 自动返回 pc/phon 图片 |
| 电脑端 | `/api/acg/pc` | 返回 `pc/` 目录随机图片 |
| 手机端 | `/api/acg/pe` | 返回 `phon/` 目录随机图片 |
| 随机头像 | `/api/acg/pp` | 返回头像目录随机图片 |
| 随机背景 | `/api/bg` | 返回背景图 |
| 获取 IP | `/api/getip` | 返回请求者真实 IP |
| 站点统计 | `/api/stats` | 调用量与图片库统计 |

图片接口支持参数：
- `?type=json` 返回 JSON
- `?redirect=0` 直接返回图片字节流
- `?list=1` 返回该分类全部图片列表

### 文档站（前台）
- GitBook 风格文档，左侧导航 + 主内容区
- 每个接口页含实时图片预览、多语言代码示例、一键复制
- 亮/暗主题切换，移动端汉堡菜单适配
- 文章列表 `/articles` + 文章详情 `/articles/[slug]`

### 后台管理 `/admin`
- **登录系统**：密码认证（默认 `admin123`，通过环境变量修改）
- **仪表盘**：文章数、图片数、调用量统计、快捷操作入口
- **图片管理**：
  - 分类切换（电脑端/手机端/头像/背景图）
  - 上传图片（支持多文件批量上传）
  - 删除图片（hover 显示删除按钮）
  - 网格缩略图预览 + 文件大小显示
- **文章管理**：
  - 文章列表（搜索、分页、状态显示）
  - 新建/编辑文章（Markdown 编辑器 + 实时预览）
  - 删除文章
  - 发布/草稿状态切换
  - 分类、封面、摘要设置

## 🚀 快速开始

### 1. 安装依赖
```bash
bun install
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 按需修改 .env 中的密码和图片目录
```

### 3. 初始化数据库
```bash
bunx prisma migrate dev --name init
```

### 4. 启动开发服务器
```bash
bun run dev
```
访问 http://localhost:3000

### 5. 生产构建
```bash
bun run build
bun run start
```

## 📁 图片目录配置

预览环境使用 `public/sample/` 下的示例图片。部署到你的服务器时，在 `.env` 中设置环境变量指向真实图片目录：

```bash
IMAGE_PC_DIR=/home/ytt/photo/pc       # 电脑端壁纸
IMAGE_PHON_DIR=/home/ytt/photo/phon   # 手机端壁纸
IMAGE_PP_DIR=/home/ytt/photo/pp       # 头像（可选）
IMAGE_BG_DIR=/home/ytt/photo/bg       # 背景图（可选）
```

支持的图片格式：`.jpg` `.jpeg` `.png` `.webp` `.gif` `.bmp` `.avif`

新增图片可直接放入对应目录，或通过后台上传。服务会自动检测目录变化并刷新缓存。

## 🔐 后台访问

- 后台地址：`/admin`
- 默认密码：`admin123`
- **部署后请务必修改**：在 `.env` 中设置 `ADMIN_PASSWORD`

## 🛠 技术栈

- **框架**：Next.js 16 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS 4 + shadcn/ui
- **数据库**：SQLite + Prisma ORM
- **认证**：Web Crypto HMAC + httpOnly Cookie
- **运行时**：Bun

## 📂 项目结构

```
src/
├── app/
│   ├── api/              # API 路由
│   │   ├── acg/          # 图片 API（pc/pe/pp）
│   │   ├── admin/        # 后台 API（login/upload/images/articles/stats）
│   │   ├── articles/     # 公开文章 API
│   │   ├── bg/           # 背景图 API
│   │   ├── getip/        # IP API
│   │   ├── img/[kind]/[file]/  # 图片静态服务
│   │   └── stats/        # 统计 API
│   ├── admin/            # 后台页面
│   │   ├── login/        # 登录
│   │   ├── images/       # 图片管理
│   │   └── articles/     # 文章管理（列表/新建/编辑）
│   ├── articles/         # 前台文章页
│   └── page.tsx          # 文档首页
├── components/
│   ├── admin/            # 后台组件
│   └── docs/             # 文档组件
└── lib/
    ├── auth.ts           # 认证
    ├── db.ts             # Prisma
    ├── images.ts         # 图片库
    ├── ua.ts             # UA 检测
    └── stats.ts          # 统计
```

## 📝 使用示例

```html
<!-- 网页背景图（自动适配 PC/手机） -->
<img src="https://your-domain.com/api/acg" alt="随机壁纸" />

<!-- 电脑端壁纸 -->
<img src="https://your-domain.com/api/acg/pc" />

<!-- Markdown 引用 -->
![随机图片](https://your-domain.com/api/acg/pc)
```

## 📄 License

MIT
