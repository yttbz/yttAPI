import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "欢迎使用 yttAPI | yttAPI 图片 API 文档",
  description:
    "yttAPI 是一个免费、稳定、快速的随机图片 API 服务，提供双端自适应、电脑端、移动端随机图片及随机头像、背景图等接口。",
  keywords: [
    "yttAPI",
    "图片API",
    "随机图片",
    "二次元API",
    "壁纸API",
    "头像API",
    "免费API",
  ],
  authors: [{ name: "yttAPI" }],
  icons: {
    icon: "https://m1f.cn/y.jpg",
  },
  openGraph: {
    title: "yttAPI 图片 API 文档",
    description: "免费、稳定、快速的随机图片 API 服务",
    siteName: "yttAPI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "yttAPI 图片 API 文档",
    description: "免费、稳定、快速的随机图片 API 服务",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
