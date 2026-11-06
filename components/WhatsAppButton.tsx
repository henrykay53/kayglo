"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { whatsappLink } from "@/lib/site";
import { trackEvent } from "@/lib/track";

/** Pages that already put WhatsApp front and centre, or where the button would
 *  sit on the form's full-width buttons. */
const HIDDEN_ON = ["/contact", "/thank-you"];

/** How far down the page before it appears — clears the hero and its CTAs. */
const SHOW_AFTER = 420;

/** The chat bubble: how long after the button appears, and how long it stays. */
const TEASER_DELAY_MS = 3500;
const TEASER_FOR_MS = 12000;
/** Once per visit — not on every page. */
const TEASER_KEY = "kayglo:wa-teaser";

/** A first line that matches what the visitor was reading. */
function messageFor(pathname: string) {
  if (pathname.startsWith("/solutions/residential")) {
    return "Hello Kayglo, I'd like to ask about solar for my home.";
  }
  if (
    pathname.startsWith("/solutions/business") ||
    pathname.startsWith("/solutions/commercial")
  ) {
    return "Hello Kayglo, I'd like to ask about solar for my business.";
  }
  return "Hello Kayglo, I have a question about solar.";
}

const seenTeaser = () => {
  try {
    return sessionStorage.getItem(TEASER_KEY) === "1";
  } catch {
    return true; // storage blocked: don't risk showing it on every page
  }
};
const markTeaserSeen = () => {
  try {
    sessionStorage.setItem(TEASER_KEY, "1");
  } catch {}
};

/**
 * Floating click-to-chat, built to be noticed without nagging:
 *   • a green disc that charges with Kayglo green on hover (see EnergyCell
 *     below);
 *   • once per visit, a small bubble asks the question for them.
 * It stays out of the hero, steps aside over the footer, never shows on the
 * contact pages, and sits under the mobile menu. All motion is off under
 * reduced motion. Taps are counted by ContactTracker (contact_click).
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const [teaser, setTeaser] = useState(false);
  // The bubble's timer starts on the button's first appearance only.
  const started = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) =>
      setFooterInView(entry.isIntersecting),
    );
    io.observe(footer);
    return () => io.disconnect();
  }, [pathname]);

  const hidden = HIDDEN_ON.some((p) => pathname.startsWith(p));
  const shown = !hidden && scrolled && !footerInView;

  // First appearance: (once per visit) the bubble. Guarded by a ref so a
  // re-run of this effect can never cancel the bubble's timer.
  useEffect(() => {
    if (!shown || started.current) return;
    started.current = true;
    const list = timers.current;
    if (!seenTeaser()) {
      list.push(
        setTimeout(() => {
          markTeaserSeen();
          setTeaser(true);
          list.push(setTimeout(() => setTeaser(false), TEASER_FOR_MS));
        }, TEASER_DELAY_MS),
      );
    }
  }, [shown]);

  // Timers only stop when the button goes away for good.
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  if (hidden) return null;

  const href = whatsappLink(messageFor(pathname));
  const open = () => {
    setTeaser(false);
    markTeaserSeen();
  };

  return (
    <div
      inert={!shown}
      // z-30: below the header (z-50) and the open menu's backdrop (z-40),
      // so the mobile menu always covers it.
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 flex flex-col items-end gap-3 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none sm:right-6 md:bottom-6 ${
        shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0 motion-reduce:translate-y-0"
      }`}
    >
      {/* The bubble — a message waiting for them, not an ad. */}
      {teaser && shown && (
        <div className="wa-teaser relative w-[15.5rem] rounded-2xl rounded-br-md bg-cream p-4 pr-9 text-ink shadow-xl shadow-ink/20 ring-1 ring-ink/10">
          <a href={href} target="_blank" rel="noopener noreferrer" onClick={open} className="block">
            <p className="text-sm font-medium leading-snug">
              Questions about solar?
            </p>
            <p className="mt-0.5 text-sm leading-snug text-slate">
              Chat with us on WhatsApp — the message is already written.
            </p>
          </a>
          <button
            type="button"
            onClick={() => setTeaser(false)}
            aria-label="Dismiss"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-mute transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
      )}

      <EnergyCell
        href={href}
        paused={!shown}
        onActivate={() => {
          open();
          trackEvent("whatsapp_float_click", { page: pathname, with_teaser: teaser });
        }}
      />
    </div>
  );
}

/** The WhatsApp glyph (Simple Icons, CC0). */
export function WhatsAppMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/**
 * The button itself: a WhatsApp-green disc with the glyph in white. At rest
 * two soft rings breathe out from it, half a cycle apart. Hover, keyboard
 * focus or a touch charges it: Kayglo green fills the disc from the bottom
 * up, and drains when you leave. A click flashes it once. Navigation is a plain link — nothing here
 * ever delays it. Under reduced motion the change happens without moving.
 */
function EnergyCell({
  href,
  paused,
  onActivate,
}: {
  href: string;
  paused: boolean;
  onActivate: () => void;
}) {
  const [charged, setCharged] = useState(false);
  const flash = useRef<HTMLSpanElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const touchOff = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    timers.current.push(setTimeout(() => setCharged(false), 2200));
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        flash.current?.animate(
          [{ opacity: 0 }, { opacity: 0.6, offset: 0.25 }, { opacity: 0 }],
          { duration: 480, easing: "ease-out" },
        );
        onActivate();
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setCharged(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setCharged(false)}
      onPointerDown={(e) => e.pointerType !== "mouse" && setCharged(true)}
      onPointerUp={touchOff}
      onPointerCancel={touchOff}
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && setCharged(true)}
      onBlur={() => setCharged(false)}
      // Hidden: the charge lets go.
      data-charged={charged && !paused}
      data-paused={paused}
      aria-label="Chat with Kayglo on WhatsApp (opens WhatsApp)"
      title="Chat with us on WhatsApp"
      className="wa-cell"
    >
      <span aria-hidden="true" className="wa-pulses">
        <span className="wa-pulse" />
        <span className="wa-pulse wa-pulse-2" />
      </span>
      <span aria-hidden="true" className="wa-core">
        <span className="wa-fill" />
        <span ref={flash} className="wa-flash" />
      </span>
      <WhatsAppMark className="wa-glyph" />
    </a>
  );
}
