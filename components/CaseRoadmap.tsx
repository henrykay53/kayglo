"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A case study told as milestones on one path — Before through After, in
 * order. Pass <Milestone> children; this draws the spine through their nodes
 * and lights it as the visitor scrolls.
 *
 * Nothing is hard-coded to a card height: the spine runs from the first
 * node's measured centre to the last one's, re-measured whenever anything
 * resizes. Scroll work is one rAF per frame that writes two CSS variables
 * and a data attribute per card — no React re-renders.
 */
export function CaseRoadmap({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = [...el.querySelectorAll<HTMLElement>("[data-milestone]")];
    const nodes = items.map((li) => li.querySelector<HTMLElement>("[data-node]"));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let top = 0; // spine start, relative to the roadmap
    let len = 0; // spine length
    let frame = 0;

    const measure = () => {
      const box = el.getBoundingClientRect();
      const centres = nodes.map((n) => {
        const r = n!.getBoundingClientRect();
        return r.top + r.height / 2 - box.top;
      });
      top = Math.min(...centres);
      len = Math.max(...centres) - top;
      el.style.setProperty("--spine-top", `${top}px`);
      el.style.setProperty("--spine-len", `${len}px`);
    };

    const paint = () => {
      frame = 0;
      // The light's leading edge sits a little past mid-screen.
      const anchor = window.innerHeight * 0.55;
      const start = el.getBoundingClientRect().top + top;
      const p = motion.matches
        ? 1
        : Math.min(1, Math.max(0, len ? (anchor - start) / len : 0));
      el.style.setProperty("--p", p.toFixed(4));
      el.dataset.done = p >= 1 ? "true" : "false";
      nodes.forEach((n, i) => {
        const r = n!.getBoundingClientRect();
        items[i].dataset.lit = String(motion.matches || r.top + r.height / 2 <= anchor + 1);
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const remeasure = () => {
      measure();
      schedule();
    };

    remeasure();
    const ro = new ResizeObserver(remeasure);
    ro.observe(el);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    motion.addEventListener("change", remeasure);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      motion.removeEventListener("change", remeasure);
    };
  }, []);

  return (
    <div ref={root} className="group/road relative [--p:0]">
      {/* The path: a faint track, the lit length over it, and a soft head
          of light at the leading edge. Mobile: down the left edge. Desktop:
          down the centre, between the two columns. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[15px] top-[var(--spine-top,0px)] h-[var(--spine-len,100%)] w-0.5 -translate-x-1/2 md:left-1/2"
      >
        <div className="absolute inset-0 rounded-full bg-ink/10" />
        <div className="absolute inset-0 origin-top scale-y-[var(--p)] rounded-full bg-gradient-to-b from-accent/60 to-accent" />
        <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 translate-y-[calc(var(--p)*var(--spine-len,0px)-50%)] rounded-full bg-accent shadow-[0_0_14px_4px_rgb(20_107_74/0.35)] transition-opacity duration-300 group-data-[done=true]/road:opacity-0 motion-reduce:hidden" />
      </div>

      <ol className="relative grid gap-y-12 md:grid-cols-2 md:gap-x-24 md:gap-y-16">
        {children}
      </ol>
    </div>
  );
}

/**
 * One stop on the roadmap: the branch to the spine, the numbered node, and
 * the card. Odd stops sit left of the spine on desktop, even stops right and
 * dropped by `stagger`, so the path zig-zags in reading order. On phones every
 * card sits right of a rail down the left edge.
 */
export function Milestone({
  index,
  stagger = "md:mt-24",
  id,
  children,
}: {
  /** 0-based position on the path; shown as index + 1 in the node. */
  index: number;
  /** How far right-hand cards drop on desktop. */
  stagger?: string;
  id?: string;
  children: ReactNode;
}) {
  const right = index % 2 === 1;
  return (
    <li
      id={id}
      data-milestone
      className={`group/m relative scroll-mt-24 pl-12 md:pl-0 ${right ? stagger : ""}`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-[15px] top-[calc(3rem-1px)] h-0.5 w-[33px] bg-ink/10 transition-colors duration-500 group-data-[lit=true]/m:bg-accent/50 md:w-12 ${
          right ? "md:-left-12" : "md:left-full"
        }`}
      />
      <span
        data-node
        aria-hidden="true"
        className={`absolute left-[15px] top-12 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream font-display text-sm text-mute ring-1 ring-ink/15 transition-[background-color,color,box-shadow,transform] duration-500 group-hover/m:scale-110 group-focus-within/m:scale-110 group-data-[lit=true]/m:bg-accent group-data-[lit=true]/m:text-cream group-data-[lit=true]/m:ring-accent group-data-[lit=true]/m:shadow-[0_0_0_6px_rgb(20_107_74/0.12)] motion-reduce:transition-none ${
          right ? "md:-left-12" : "md:left-[calc(100%+3rem)]"
        }`}
      >
        {index + 1}
      </span>
      <article className="rounded-3xl border border-ink/10 bg-cream p-6 shadow-sm transition-[border-color,box-shadow] duration-500 group-hover/m:border-accent/40 group-hover/m:shadow-lg group-hover/m:shadow-ink/5 group-focus-within/m:border-accent/40 group-data-[lit=true]/m:border-accent/25 md:p-7">
        {children}
      </article>
    </li>
  );
}
