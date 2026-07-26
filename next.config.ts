import type { NextConfig } from "next";

const API_URL = process.env.API_URL || "http://localhost:5001";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  env: {
    API_URL: API_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
