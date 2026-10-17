"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { isHistoryNavigation } from "@/lib/navigation";

/**
 * Fades content up as it enters the viewport. Progressive enhancement:
 * if JS is off or reduced-motion is set, content stays fully visible,
 * so crawlers and accessibility are never affected.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: keyof HTMLElementTagNameMap;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  // Back / Forward: the visitor has already seen this page, so it appears as
  // they left it instead of animating in again. Always false on the first
  // load, so server and client markup still match.
  const [shown, setShown] = useState(isHistoryNavigation);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (typeof IntersectionObserver === "undefined") {
      // No observer to wait for — show it on the next frame.
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  const Component = Tag as "div";
  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
