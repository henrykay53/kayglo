import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: noticeably smaller than WebP for photographs, which matters
    // on Nigerian mobile data. Browsers without it fall back to WebP.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
