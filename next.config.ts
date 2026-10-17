import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: noticeably smaller than WebP for photographs, which matters
    // on Nigerian mobile data. Browsers without it fall back to WebP.
    formats: ["image/avif", "image/webp"],
  },

  // The privacy and terms pages were removed (2026-10-17). Old tabs, bookmarks
  // and search results still point at them — send those visitors home rather
  // than to a 404. Temporary (307), not permanent: browsers cache a 308
  // forever, which would get in the way if a privacy page is brought back.
  async redirects() {
    return [
      { source: "/privacy", destination: "/", permanent: false },
      { source: "/terms", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
