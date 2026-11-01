import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Off because this project lives on an iCloud-synced Desktop: iCloud
    // copies files inside Turbopack's on-disk dev cache ("… 2" duplicates),
    // which corrupts it, and the dev server then dies on its next restart
    // ("Failed to open database"). Dev-only — production builds are
    // unaffected. Safe to turn back on once the project is moved somewhere
    // iCloud doesn't sync.
    turbopackFileSystemCacheForDev: false,
  },
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
      // Case studies renamed 2026-11-01 when their locations were corrected
      // to Lagos. Permanent: the old addresses will never come back, and
      // search engines should move their ranking across to the new ones.
      {
        source: "/projects/ikoyi-residence",
        destination: "/projects/lagos-residence",
        permanent: true,
      },
      {
        source: "/projects/maitama-office",
        destination: "/projects/lagos-office",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
