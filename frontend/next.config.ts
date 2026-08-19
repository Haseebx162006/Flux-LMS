import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Only enable local rewrites in development to prevent Vercel serverless function crash
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: "/api/:path*",
          destination: "http://127.0.0.1:5000/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
