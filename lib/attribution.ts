/**
 * Where every lead came from.
 *
 * The site is the one asset Kayglo owns outright, so it — not Google or Meta —
 * has to be the thing that remembers how someone arrived. We keep two records:
 *
 *   first touch  the campaign that introduced them (survives across visits)
 *   last touch   the campaign that brought them back to convert
 *
 * Both ride along with the lead, so "revenue by acquisition channel" is a
 * question the CRM can actually answer.
 */

export type Touch = {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  /** Google Ads / Meta click identifiers, for offline conversion import. */
  gclid: string;
  fbclid: string;
  landingPage: string;
  referrer: string;
  at: string;
};

const FIRST_KEY = "kayglo:attr:first";
const LAST_KEY = "kayglo:attr:last";
const VISITS_KEY = "kayglo:attr:visits";

const empty = (): Touch => ({
  source: "",
  medium: "",
  campaign: "",
  term: "",
  content: "",
  gclid: "",
  fbclid: "",
  landingPage: "",
  referrer: "",
  at: "",
});

/** Search engines we should read as organic rather than as a plain referral. */
const SEARCH = ["google.", "bing.", "duckduckgo.", "yahoo.", "ecosia.", "yandex."];
const SOCIAL: [string, string][] = [
  ["instagram.", "instagram"],
  ["facebook.", "facebook"],
  ["fb.", "facebook"],
  ["l.facebook", "facebook"],
  ["whatsapp", "whatsapp"],
  ["wa.me", "whatsapp"],
  ["linkedin.", "linkedin"],
  ["t.co", "twitter"],
  ["x.com", "twitter"],
  ["tiktok.", "tiktok"],
  ["youtube.", "youtube"],
];

function classify(params: URLSearchParams, referrer: string): Touch {
  const t = empty();
  t.at = new Date().toISOString();
  t.landingPage = window.location.pathname + window.location.search;
  t.referrer = referrer;
  t.gclid = params.get("gclid") ?? "";
  t.fbclid = params.get("fbclid") ?? "";
  t.campaign = params.get("utm_campaign") ?? "";
  t.term = params.get("utm_term") ?? "";
  t.content = params.get("utm_content") ?? "";

  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");

  if (utmSource || utmMedium) {
    t.source = utmSource ?? "";
    t.medium = utmMedium ?? "";
    return t;
  }
  // A click id with no UTMs still tells us the channel.
  if (t.gclid) return { ...t, source: "google", medium: "cpc" };
  if (t.fbclid) return { ...t, source: "facebook", medium: "paid-social" };

  if (!referrer) return { ...t, source: "direct", medium: "none" };

  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    host = "";
  }
  if (!host || host === window.location.hostname) {
    return { ...t, source: "direct", medium: "none" };
  }
  if (SEARCH.some((s) => host.includes(s))) {
    return { ...t, source: host.split(".")[0], medium: "organic" };
  }
  const social = SOCIAL.find(([needle]) => host.includes(needle));
  if (social) return { ...t, source: social[1], medium: "social" };

  return { ...t, source: host, medium: "referral" };
}

function read(key: string, store: Storage): Touch | null {
  try {
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as Touch) : null;
  } catch {
    return null;
  }
}

/** True when the visitor arrived from somewhere identifiable, not an internal click. */
function isNewTouch(t: Touch, previous: Touch | null) {
  if (!previous) return true;
  if (t.medium === "none" && previous.source) return false;
  return (
    t.source !== previous.source ||
    t.medium !== previous.medium ||
    t.campaign !== previous.campaign
  );
}

/** Records the visit. Safe to call on every page load. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const touch = classify(params, document.referrer);

    const first = read(FIRST_KEY, window.localStorage);
    if (!first) window.localStorage.setItem(FIRST_KEY, JSON.stringify(touch));

    const last = read(LAST_KEY, window.sessionStorage);
    if (isNewTouch(touch, last)) {
      window.sessionStorage.setItem(LAST_KEY, JSON.stringify(touch));
      const visits = Number(window.localStorage.getItem(VISITS_KEY) ?? "0") + 1;
      window.localStorage.setItem(VISITS_KEY, String(visits));
    }
  } catch {
    // Private browsing, blocked storage — attribution is a nice-to-have, never
    // a reason to break the page.
  }
}

/** Flattened for the lead payload — one line per fact, ready for a CRM field. */
export function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const first = read(FIRST_KEY, window.localStorage);
  const last = read(LAST_KEY, window.sessionStorage) ?? first;
  if (!first && !last) return {};

  return {
    source: last?.source ?? "",
    medium: last?.medium ?? "",
    campaign: last?.campaign ?? "",
    term: last?.term ?? "",
    content: last?.content ?? "",
    gclid: last?.gclid ?? "",
    fbclid: last?.fbclid ?? "",
    landingPage: last?.landingPage ?? "",
    referrer: last?.referrer ?? "",
    firstSource: first?.source ?? "",
    firstMedium: first?.medium ?? "",
    firstCampaign: first?.campaign ?? "",
    firstSeen: first?.at ?? "",
    visits: window.localStorage.getItem(VISITS_KEY) ?? "1",
  };
}
