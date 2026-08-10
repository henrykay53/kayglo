"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ProjectPhoto } from "@/lib/site";

/** How long the front card takes to fly out before it tucks in at the back. */
const FLY_MS = 560;

type Deck = {
  /** Photo indices, front of the stack first. */
  order: number[];
  /** Photo currently flying off the front, if any. */
  flying: number | null;
  /** Photo that just landed at the back — re-seated without animating. */
  snapping: number | null;
};

const rotate = (order: number[]) => [...order.slice(1), order[0]];

const subscribeMotion = (onChange: () => void) => {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

const subscribeVisibility = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};

function useDocumentHidden() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "hidden",
    () => false,
  );
}

/**
 * A deck of site photos stacked like cards. Every interaction flings the top
 * card away and deals the next one — the order simply cycles, so the shuffle
 * never runs out no matter how many times someone taps it.
 *
 * With `autoMs` it also deals itself, pausing on hover, on focus, off-screen,
 * on a hidden tab, and whenever the visitor prefers reduced motion.
 */
export function ProjectStack({
  photos,
  label,
  className = "",
  frameClassName = "aspect-[5/4]",
  sizes = "(min-width: 768px) 44vw, 90vw",
  autoMs,
  captions = false,
  kenBurns = false,
  preload = false,
}: {
  photos: ProjectPhoto[];
  /** Project or section name, used for the control's accessible label. */
  label: string;
  className?: string;
  /** Sizing for the card frame — an aspect ratio or explicit heights. */
  frameClassName?: string;
  sizes?: string;
  /** Deal the next card automatically every N ms. */
  autoMs?: number;
  /** Show each photo's title and note over the front card. */
  captions?: boolean;
  /** Slowly drift the front photo while it is on show. */
  kenBurns?: boolean;
  /** Preload the first photo — only for an above-the-fold hero. */
  preload?: boolean;
}) {
  const total = photos.length;
  const interactive = total > 1;

  const [deck, setDeck] = useState<Deck>(() => ({
    order: photos.map((_, i) => i),
    flying: null,
    snapping: null,
  }));

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const clearSnap = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    // Two frames: one to paint the card at the back with transitions off,
    // one to switch them back on before anything else moves.
    frame.current = requestAnimationFrame(() => {
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        setDeck((d) => (d.snapping === null ? d : { ...d, snapping: null }));
      });
    });
  }, []);

  const shuffle = useCallback(() => {
    if (!interactive) return;
    if (timer.current) clearTimeout(timer.current);

    if (reduced) {
      timer.current = null;
      setDeck((d) => ({ order: rotate(d.order), flying: null, snapping: null }));
      return;
    }

    setDeck((d) => {
      // A rapid second tap lands the in-flight card early, then deals again.
      if (d.flying !== null) {
        const next = rotate(d.order);
        return { order: next, flying: next[0], snapping: d.flying };
      }
      return { ...d, flying: d.order[0], snapping: null };
    });
    clearSnap();

    timer.current = setTimeout(() => {
      timer.current = null;
      setDeck((d) =>
        d.flying === null
          ? d
          : { order: rotate(d.order), flying: null, snapping: d.flying },
      );
      clearSnap();
    }, FLY_MS);
  }, [interactive, reduced, clearSnap]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  // ---- autoplay -----------------------------------------------------------
  const auto = Boolean(autoMs) && interactive && !reduced;
  const [stopped, setStopped] = useState(false); // visitor pressed pause
  const [held, setHold] = useState(false); // pointer or keyboard focus is on it
  const [onScreen, setOnScreen] = useState(true);
  const hidden = useDocumentHidden();
  const frameEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = frameEl.current;
    if (!el || !auto || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [auto]);

  const running = auto && !stopped && !held && onScreen && !hidden;
  const front = deck.flying === null ? deck.order[0] : deck.order[1];

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(shuffle, autoMs);
    return () => clearTimeout(id);
    // `front` restarts the countdown each time a new card lands.
  }, [running, autoMs, shuffle, front]);

  // ---- layout -------------------------------------------------------------
  // While a card is in flight it has already vacated the front slot, so
  // everything behind it slides forward one place.
  const slotOf = (id: number) =>
    deck.order.indexOf(id) - (deck.flying === null ? 0 : 1);

  const current = photos[front];
  const paused = auto && !running;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={frameEl}
        onClick={shuffle}
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={() => setHold(false)}
        className={`relative w-full ${frameClassName} ${
          interactive ? "cursor-pointer" : ""
        }`}
      >
        {photos.map((photo, id) => {
          const isFlying = id === deck.flying;
          const slot = slotOf(id);
          const dir = slot % 2 === 1 ? -1 : 1;

          return (
            <div
              key={photo.src}
              aria-hidden={!isFlying && slot !== 0}
              className={`absolute inset-0 origin-bottom overflow-hidden rounded-3xl border border-ink/10 bg-cream-200 shadow-2xl shadow-ink/20 ${
                isFlying ? "pointer-events-none" : ""
              } ${
                deck.snapping === id
                  ? "transition-none"
                  : "transition-[transform,opacity] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              }`}
              style={{
                zIndex: isFlying ? total + 1 : total - slot,
                opacity: isFlying ? 0 : 1,
                transform: isFlying
                  ? "translate3d(58%, -8%, 0) rotate(10deg) scale(0.93)"
                  : `translate3d(${dir * slot * 2.2}%, ${slot * 2.8}%, 0) rotate(${
                      dir * slot * 3
                    }deg) scale(${1 - slot * 0.05})`,
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={sizes}
                preload={preload && id === 0}
                // The class is only on the front card, so the drift restarts
                // by itself each time a card is dealt.
                className={`object-cover select-none ${
                  kenBurns && (isFlying || slot === 0) ? "stack-drift" : ""
                }`}
                draggable={false}
              />
              {/* Cards further back sit deeper in shadow. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-ink transition-opacity duration-[560ms]"
                style={{ opacity: isFlying ? 0 : Math.min(slot, 3) * 0.14 }}
              />
              {/* A warm hairline keeps the front card feeling lit. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-gold/25"
              />
            </div>
          );
        })}

        {interactive && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-3xl bg-gradient-to-t from-ink/80 via-ink/35 to-transparent p-5 pt-16 md:p-6 md:pt-20"
            style={{ zIndex: total + 2 }}
          >
            {captions && current?.title && (
              <div key={front} className="stack-caption">
                <p className="font-display text-xl text-cream md:text-2xl">
                  {current.title}
                </p>
                {current.note && (
                  <p className="mt-1 text-sm text-cream/70">{current.note}</p>
                )}
              </div>
            )}

            <div
              className={`flex items-center justify-between gap-3 ${
                captions && current?.title ? "mt-5" : ""
              }`}
            >
              <span className="kicker text-cream/90">
                {String(front + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>

              {auto ? (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5" aria-hidden="true">
                    {photos.map((photo, id) => (
                      <span
                        key={photo.src}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          id === front ? "w-6 bg-gold" : "w-1.5 bg-cream/40"
                        }`}
                      />
                    ))}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStopped((s) => !s);
                    }}
                    aria-label={
                      stopped
                        ? `Resume the ${label} slideshow`
                        : `Pause the ${label} slideshow`
                    }
                    className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-cream/25 bg-ink/40 text-cream backdrop-blur-sm transition-colors duration-300 hover:border-gold hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                  >
                    {stopped ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="ml-0.5 h-3.5 w-3.5"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M6 4l14 8-14 8z" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    shuffle();
                  }}
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-cream/30 bg-ink/40 px-4 py-2 text-xs font-medium text-cream backdrop-blur-sm transition-colors duration-300 hover:border-gold hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                  aria-label={`${label} — show next photo (${front + 1} of ${total})`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M16 3h5v5" />
                    <path d="M4 20 21 3" />
                    <path d="M21 16v5h-5" />
                    <path d="m15 15 6 6M4 4l5 5" />
                  </svg>
                  Shuffle
                </button>
              )}
            </div>
          </div>
        )}

        {/* Countdown to the next card. */}
        {auto && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] overflow-hidden rounded-b-3xl bg-cream/15"
            style={{ zIndex: total + 3 }}
          >
            <span
              key={front}
              className="block h-full w-full origin-left bg-gold"
              style={{
                animation: `stack-countdown ${autoMs}ms linear forwards`,
                animationPlayState: paused ? "paused" : "running",
              }}
            />
          </div>
        )}
      </div>

      <span className="sr-only" aria-live="polite">
        {current?.alt}
      </span>
    </div>
  );
}
