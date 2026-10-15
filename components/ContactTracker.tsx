"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/track";

/** Which channel a link opens, judged from its href. */
function channelOf(href: string) {
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return "whatsapp";
  return null;
}

/**
 * Counts taps on every call, WhatsApp and email link on the site, in one
 * listener — so a link added next month is measured without anyone
 * remembering to wire it. For many visitors a phone call *is* the
 * conversion; without this, those leads are invisible in GA4.
 */
export function ContactTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const method = channelOf(link.getAttribute("href") ?? "");
      if (!method) return;
      trackEvent("contact_click", {
        method,
        page: window.location.pathname,
        link_text: link.textContent?.trim().slice(0, 60) ?? "",
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
