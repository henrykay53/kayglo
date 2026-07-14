import Link from "next/link";
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
    <span className={`kicker inline-flex items-center gap-2 text-gold ${className}`}>
      <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
      {children}
    </span>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "gold" | "outline" | "dark" | "ghost";
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href">;

export function Button({
  href,
  children,
  variant = "gold",
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline-2";
  const variants: Record<string, string> = {
    gold: "bg-gold text-cream hover:bg-ink hover:text-cream shadow-sm",
    dark: "bg-ink text-cream hover:bg-ever-400",
    outline:
      "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream",
    ghost: "text-ink hover:text-gold",
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
