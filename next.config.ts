
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: Do NOT set ignoreBuildErrors to true in production.
  // Fix your TypeScript errors instead of hiding them.
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "blob.v0.dev",
      },
    ],
  },
  // output: "standalone", // Only needed for Docker/self-hosted; Vercel handles this automatically
  // Optional: Configure headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
