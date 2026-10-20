import type { NextConfig } from "next";

// The ZIP contained no Next.js configuration to override.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
  },
  allowedDevOrigins: ["*.e2b.app"],
  poweredByHeader: false,
  devIndicators: false,
  async headers() {
    return [{ source: "/api/:path*", headers: [
      { key: "Cache-Control", value: "no-store" },
      { key: "X-Content-Type-Options", value: "nosniff" },
    ] }];
  },
};
export default nextConfig;
