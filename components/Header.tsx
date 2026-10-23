"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { Logo } from "./Brand";
import { CallButton } from "./ui";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the menu on navigation — adjusted during render, not in an effect.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // While the menu is open: the page behind it stays put (otherwise a swipe
  // inside a full-height menu scrolls the page instead), and Escape closes it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-500 ${
          // Solid while the menu is open, or the dimmed backdrop shows through
          // a transparent header and greys the bar out.
          open
            ? "border-b border-ink/10 bg-cream"
            : scrolled
              ? "border-b border-ink/10 bg-cream/85 backdrop-blur-md"
              : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <Link href="/" aria-label={`${site.name} home`}>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex" aria-label="Primary">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`link-underline text-sm font-medium transition-colors ${
                    active ? "text-accent" : "text-slate hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-accent"
            >
              Get a free quote
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 lg:hidden">
            {/* On a phone the call is the conversion — keep it one tap away. */}
            <CallButton size="sm" tooltip="bottom" />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3.5 w-6">
                <span
                  className={`absolute left-0 h-0.5 w-6 bg-ink transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-0.5 w-6 bg-ink transition-opacity duration-300 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-6 bg-ink transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu.
            It lives inside the sticky header, so it can never be taller than the
            screen below that header: anything past the bottom edge of a sticky
            element cannot be scrolled to. The cap is therefore the dynamic
            viewport (dvh — the part not covered by the phone's browser bars)
            minus the 4.5rem header, and the menu scrolls inside itself when the
            links need more room than that. A fixed cap (it was 24rem) is what
            sliced the last link in half. */}
        <div
          id="mobile-menu"
          inert={!open}
          className={`border-t border-ink/10 bg-cream lg:hidden ${
            open
              ? "max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain"
              : "max-h-0 overflow-hidden border-transparent"
          } transition-[max-height] duration-500 ease-out motion-reduce:transition-none`}
        >
          <nav
            className="flex flex-col gap-1 px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            aria-label="Mobile"
          >
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-2 py-3 text-lg hover:bg-cream-200 hover:text-ink ${
                    active ? "text-accent" : "text-slate"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="mt-2 rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-cream"
            >
              Get a free quote
            </Link>
          </nav>
        </div>
      </header>

      {/* Behind the open menu: dims the page and closes the menu when the page
          is tapped. It sits under the sticky header (z-50), so the menu and the
          toggle stay on top. Closes on click, not pointerdown — closing on
          pointerdown would let the same tap land on whatever is underneath.
          A swipe on it closes too, since the page behind is locked. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        onTouchMove={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-ink/25 transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    </>
  );
}
