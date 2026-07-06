import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  env: {
    API_URL: process.env.API_URL || "http://localhost:5001",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.API_URL || "http://localhost:5001"
        }/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
