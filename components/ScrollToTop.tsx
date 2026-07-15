"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Forces the window to the top on every route change.
 *
 * Next.js normally scrolls to top on navigation, but our global
 * `scroll-behavior: smooth` (in globals.css) interferes with that reset —
 * leaving you partway down the new page. We override it here with an
 * explicit `behavior: "instant"` scroll, which wins over the CSS.
 *
 * In-page anchor navigation (e.g. /services#products from the footer) is
 * left alone: if the URL has a hash, we let the browser jump to that element.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Respect anchor links — don't yank the user to the top of the page.
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
