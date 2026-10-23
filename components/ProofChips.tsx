"use client";

import { useState } from "react";

type Proof = { value: string; label: string; chip?: string };

/**
 * The homepage proof points, for phones: one row of compact chips instead of
 * a 2×2 grid of big numbers. Tapping a chip shows what it means in the line
 * underneath — the only thing they do, so they never pretend to be links.
 * Desktop keeps the full band (see app/page.tsx).
 */
export function ProofChips({ items }: { items: Proof[] }) {
  const [active, setActive] = useState(0);
  // Bumped on every tap so the highlight sweep replays even on the same chip.
  const [tap, setTap] = useState(0);

  return (
    <div>
      <div
        className="flex flex-wrap justify-center gap-1.5"
        role="group"
        aria-label="Why Kayglo — tap one to see what it means"
      >
        {items.map((item, i) => {
          const on = i === active;
          return (
            <button
              key={item.label}
              type="button"
              aria-pressed={on}
              aria-controls="proof-detail"
              onClick={() => {
                setActive(i);
                setTap((t) => t + 1);
              }}
              className={`proof-chip relative overflow-hidden rounded-full border px-2.5 py-3 text-[0.8125rem] leading-none font-medium transition-[background-color,color,border-color,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.94] motion-reduce:transition-none ${
                on
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/15 bg-cream text-slate"
              }`}
            >
              {item.chip ?? item.value}
              {/* One sweep of light across the chip just chosen. */}
              {on && tap > 0 && (
                <span
                  key={tap}
                  aria-hidden="true"
                  className="proof-sweep pointer-events-none absolute inset-0"
                />
              )}
            </button>
          );
        })}
      </div>
      {/* Two lines reserved, so a longer line never pushes the page. */}
      <p
        id="proof-detail"
        aria-live="polite"
        className="mx-auto mt-3 min-h-10 max-w-xs text-center text-sm leading-5 text-mute"
      >
        {items[active].label}
      </p>
    </div>
  );
}
