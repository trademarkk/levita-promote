import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vinext's local worker does not expose the asset binding expected by
    // Next.js image optimization. The original files are already web-sized,
    // so serve them directly in local preview and production builds.
    unoptimized: true,
  },
};

export default nextConfig;
