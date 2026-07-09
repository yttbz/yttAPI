import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/yttbz/:path*",
        destination: "/admin/:path*",
      },
    ];
  },
};

export default nextConfig;
