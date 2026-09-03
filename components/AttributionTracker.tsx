"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";

/**
 * Stamps every visit with where it came from. Runs on each route change too,
 * so a UTM'd link landing anywhere on the site is still recorded.
 */
export function AttributionTracker() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
  }, [pathname]);

  return null;
}
