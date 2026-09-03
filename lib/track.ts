/**
 * Conversion events. Every call is a no-op until the matching ID is set in the
 * environment, so nothing here breaks in dev or before the ad accounts exist.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;

/** A named step in the funnel — used for the softer, mid-funnel actions. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  window.fbq?.("trackCustom", name, params);
}

/**
 * The one that matters: a completed power assessment. Fires GA4, the Google Ads
 * conversion (when a label is configured), and the Meta standard Lead event so
 * retargeting audiences and ad optimisation both have something to learn from.
 */
export function trackLead(params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "generate_lead", { currency: "NGN", ...params });
  if (ADS_ID && LEAD_LABEL) {
    window.gtag?.("event", "conversion", {
      send_to: `${ADS_ID}/${LEAD_LABEL}`,
    });
  }
  window.fbq?.("track", "Lead", params);
}
