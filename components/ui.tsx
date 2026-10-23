import Link from "next/link";
import { site } from "@/lib/site";
import type { ComponentProps, ReactNode } from "react";

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Kicker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`kicker inline-flex items-center gap-2 text-accent ${className}`}>
      <span className="h-px w-6 bg-accent/60" aria-hidden="true" />
      {children}
    </span>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "accent" | "outline" | "dark" | "ghost" | "light";
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href">;

export function Button({
  href,
  children,
  variant = "accent",
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline-2";
  // Filled variants carry a transparent border so every variant is the same
  // height as the outline one — they line up when stacked or side by side.
  const variants: Record<string, string> = {
    accent:
      "border border-transparent bg-accent text-cream hover:bg-ink hover:text-cream shadow-sm",
    dark: "border border-transparent bg-ink text-cream hover:bg-ever-400",
    outline:
      "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream",
    ghost: "text-ink hover:text-accent",
    // For dark sections, where an accent-on-green button would go muddy
    light:
      "border border-transparent bg-cream text-ink hover:bg-accent hover:text-cream shadow-sm",
  };
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

/** The handset glyph used wherever the site offers a call. */
export function PhoneGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

/**
 * Icon-only call button. It sits beside a page's main call to action, so the
 * handset alone says what it does; the accessible name carries the number,
 * and pointer users get the number as a tooltip on hover or keyboard focus.
 * 48px round — a comfortable thumb target.
 */
export function CallButton({
  onDark = false,
  size = "md",
  tooltip = "top",
  className = "",
}: {
  /** On a dark card: adds a hairline so the ink circle doesn't vanish into it. */
  onDark?: boolean;
  /** md 48px for page CTAs, sm 44px for the header bar */
  size?: "md" | "sm";
  /** Side for the hover tooltip — "bottom" where there is no room above. */
  tooltip?: "top" | "bottom";
  className?: string;
}) {
  // Every call button wears the header's colours: ink, turning green on hover.
  const tone = onDark
    ? "bg-ink text-cream ring-1 ring-cream/25 hover:bg-accent hover:ring-accent"
    : "bg-ink text-cream hover:bg-accent";
  return (
    <a
      href={`tel:${site.contact.phoneHref}`}
      aria-label={`Call us on ${site.contact.phone}`}
      className={`group/call relative inline-flex shrink-0 items-center justify-center rounded-full transition-[background-color,color,border-color,transform] duration-200 active:scale-90 motion-reduce:transition-none ${
        size === "sm" ? "h-11 w-11" : "h-12 w-12"
      } ${tone} ${className}`}
    >
      <PhoneGlyph className={size === "sm" ? "h-4 w-4" : "h-[1.15rem] w-[1.15rem]"} />
      {/* Hover / focus only, and only on devices that can hover — on a phone
          the handset is the whole message, and a tap goes straight to the dialler. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-cream opacity-0 shadow-lg transition-opacity duration-150 [@media(hover:hover)]:block group-hover/call:opacity-100 group-focus-visible/call:opacity-100 ${
          tooltip === "top" ? "bottom-full mb-2" : "top-full mt-2"
        }`}
      >
        Call {site.contact.phone}
      </span>
    </a>
  );
}
