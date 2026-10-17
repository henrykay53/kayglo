"use client";

/**
 * How the visitor arrived on the current page, and where they were on the
 * pages behind them — so Back and Forward return them to the same spot,
 * already drawn, instead of replaying the page like a first visit.
 *
 * Module state on purpose: it has to survive client-side navigation, and it
 * means nothing on the server or across a full reload.
 */

/** Scroll position per URL (path + query), for Back / Forward. */
const positions = new Map<string, number>();

let historyNav = false; // true while showing a page reached by Back / Forward
let frozen = false; // true between leaving a page and the next one settling
let currentKey = "";

const keyOf = () => window.location.pathname + window.location.search;

if (typeof window !== "undefined") {
  // We restore positions ourselves. Left on "auto", the browser restores the
  // old offset on popstate *before* the old page has rendered, and lands
  // short of it.
  window.history.scrollRestoration = "manual";
  currentKey = keyOf();

  window.addEventListener(
    "scroll",
    () => {
      // While pages swap, the document height jumps and the browser clamps
      // scrollY — those readings belong to no page, so ignore them.
      if (!frozen) positions.set(currentKey, window.scrollY);
    },
    { passive: true },
  );

  window.addEventListener("popstate", () => {
    historyNav = true;
    frozen = true;
  });

  // Any in-site link starts a fresh visit: top of page, animations on.
  document.addEventListener(
    "click",
    (e) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link || link.getAttribute("target") === "_blank") return;
      const url = new URL((link as HTMLAnchorElement).href, window.location.href);
      if (url.origin !== window.location.origin) return;
      historyNav = false;
      frozen = true;
    },
    { capture: true },
  );
}

/** Was this page reached with Back / Forward? Read during render. */
export const isHistoryNavigation = () => historyNav;

/**
 * Called once the new page has rendered. Restores the saved position for a
 * Back / Forward visit; otherwise goes to the top (or leaves an #anchor jump
 * to the browser). Waits a few frames if the page is not yet tall enough.
 */
export function settleScroll() {
  const key = keyOf();
  const target = historyNav ? (positions.get(key) ?? 0) : 0;
  const skip = !historyNav && window.location.hash;

  const finish = () => {
    currentKey = key;
    frozen = false;
  };

  if (skip) return finish();

  let frames = 0;
  const go = () => {
    const room = document.documentElement.scrollHeight - window.innerHeight;
    // "instant" beats the site-wide `scroll-behavior: smooth`.
    window.scrollTo({ top: Math.min(target, room), behavior: "instant" });
    if (room < target && frames++ < 30) requestAnimationFrame(go);
    else finish();
  };
  go();
}
