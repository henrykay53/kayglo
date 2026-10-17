"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { settleScroll } from "@/lib/navigation";

/**
 * Puts the window in the right place after every route change:
 *   • a new page (link click) opens at the top;
 *   • Back / Forward returns to where the visitor was on that page;
 *   • an #anchor link is left to the browser.
 *
 * It used to force the top on every change, Back included — which threw the
 * visitor off their place and made returning to a page feel like a reload.
 * The logic lives in lib/navigation.ts.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  // Layout effect: settle before the browser paints the new page, so there
  // is no flash of the wrong scroll position.
  useLayoutEffect(() => {
    settleScroll();
  }, [pathname]);

  return null;
}
