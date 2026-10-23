"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/site";

/** Pages that already put WhatsApp front and centre, or where the button would
 *  sit on the form's full-width buttons. */
const HIDDEN_ON = ["/contact", "/thank-you"];

/** How far down the page before it appears — clears the hero and its CTAs. */
const SHOW_AFTER = 420;

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

/**
 * Floating click-to-chat. It supports the main call to action rather than
 * competing with it: it stays out of the hero, steps aside over the footer
 * (which has its own contact details), and never shows on the contact pages.
 * Taps are counted by ContactTracker as contact_click / whatsapp.
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

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

  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;
  const shown = scrolled && !footerInView;

  return (
    <a
      href={whatsappLink(messageFor(pathname))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Kayglo on WhatsApp (opens WhatsApp)"
      inert={!shown}
      // z-30: below the header (z-50) and the open menu's backdrop (z-40),
      // so the mobile menu always covers it.
      className={`group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 flex items-center rounded-full bg-ever p-1.5 text-cream shadow-lg shadow-ink/25 ring-1 ring-cream/15 transition-[opacity,transform,background-color] duration-300 ease-out hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent active:scale-95 motion-reduce:transition-none sm:right-6 md:bottom-6 md:pr-5 ${
        shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0 motion-reduce:translate-y-0"
      }`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white">
        <WhatsAppMark />
      </span>
      <span className="ml-3 hidden text-sm font-medium md:inline">
        Chat on WhatsApp
      </span>
    </a>
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
