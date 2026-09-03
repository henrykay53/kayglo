"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { NIGERIA_VIEWBOX, nigeriaStates } from "@/lib/nigeria-map";
import { presenceStates } from "@/lib/site";

/** How long between one state lighting up and the next. */
const STEP_MS = 2000;
/** How many roaming states glow at once before the oldest fades out. */
const TRAIL = 2;

/** Depth of field, and how far the map leans toward the pointer. */
const PERSPECTIVE = 1400;
const TILT_X = 4;
const TILT_Y = 6;

const PRESENT = new Set(presenceStates);
const served = nigeriaStates.filter((s) => PRESENT.has(s.id));
/** The FCT is a territory, not a state — count it separately in the legend. */
const statesServed = served.filter((s) => s.id !== "NG-FC").length;
const roamable = nigeriaStates.filter((s) => !PRESENT.has(s.id));

/**
 * A fixed shuffle of the roaming states. Deterministic on purpose: the server
 * and the client must agree, and a seeded order looks just as arbitrary as a
 * random one while never lighting the same neighbourhood twice running.
 */
const roamOrder = (() => {
  const ids = roamable.map((s) => s.id);
  let seed = 20260810;
  for (let i = ids.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
})();

const subscribeMotion = (onChange: () => void) => {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

const subscribeVisibility = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};

/** One line per border, no doubling — a state's whole look in one place. */
function look(state: "base" | "lit" | "present" | "hover") {
  switch (state) {
    case "hover":
      return { stroke: "rgba(20,107,74,1)", width: 2, fill: "url(#ng-hover)" };
    case "present":
      return {
        stroke: "rgba(20,107,74,0.95)",
        width: 1.7,
        fill: "url(#ng-served)",
      };
    case "lit":
      return {
        stroke: "rgba(20,107,74,0.62)",
        width: 1.4,
        fill: "rgba(20,107,74,0.13)",
      };
    default:
      return {
        stroke: "rgba(31,58,46,0.34)",
        width: 1,
        fill: "url(#ng-base)",
      };
  }
}

/**
 * Nigeria, all 36 states and the FCT. The states Kayglo services stay lit and
 * marked, the rest take their turn, and the country leans gently toward the
 * pointer. Sits in the page as a normal block — size it with the parent.
 */
export function PowerMap({ className = "" }: { className?: string }) {
  const reduced = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const hidden = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "hidden",
    () => false,
  );

  const [lit, setLit] = useState<string[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [onScreen, setOnScreen] = useState(true);
  const cursor = useRef(0);
  const host = useRef<HTMLDivElement | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = !reduced && !hidden && onScreen;

  // Deal the next state.
  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => {
      setLit((prev) => {
        const next = [...prev, roamOrder[cursor.current % roamOrder.length]];
        cursor.current += 1;
        return next.slice(-TRAIL);
      });
    }, STEP_MS);
    return () => clearInterval(tick);
  }, [running]);

  // Lean toward the pointer. A chase loop eases toward the target so the map
  // trails the cursor rather than snapping to it — one transform, one element,
  // per frame, and nothing re-renders.
  useEffect(() => {
    const el = stage.current;
    const area = host.current;
    if (!el || !area || reduced || !onScreen) return;

    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const loop = () => {
      eased.x += (target.x - eased.x) * 0.06;
      eased.y += (target.y - eased.y) * 0.06;
      el.style.transform =
        `perspective(${PERSPECTIVE}px) ` +
        `rotateX(${(-eased.y * TILT_X).toFixed(2)}deg) ` +
        `rotateY(${(eased.x * TILT_Y).toFixed(2)}deg)`;
      frame = requestAnimationFrame(loop);
    };

    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [reduced, onScreen]);

  const glowing = new Set(lit);
  const servedNames = served.map((s) => s.name);
  const hoveredState = nigeriaStates.find((s) => s.id === hovered);

  // The hovered state paints last so its outline is never clipped by a
  // neighbour drawn over it.
  const ordered = hovered
    ? [
        ...nigeriaStates.filter((s) => s.id !== hovered),
        ...nigeriaStates.filter((s) => s.id === hovered),
      ]
    : nigeriaStates;

  return (
    <div ref={host} className={className}>
      <div style={{ perspective: `${PERSPECTIVE}px` }}>
        <div ref={stage} className="map-float relative">
          {/* Light pooling under the country */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(58% 54% at 50% 50%, rgba(20,107,74,0.15), transparent 70%)",
            }}
          />

          <svg
            viewBox={NIGERIA_VIEWBOX}
            preserveAspectRatio="xMidYMid meet"
            className="map-breathe h-auto w-full overflow-visible"
            role="img"
            aria-label={`Map of Nigeria showing all 36 states and the Federal Capital Territory. Kayglo services ${servedNames.join(", ")}, and supplies and installs nationwide.`}
          >
            <defs>
              {/* Light falls from the top-left, so the country is never flat */}
              <linearGradient id="ng-base" x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0%" stopColor="rgba(31,58,46,0.12)" />
                <stop offset="100%" stopColor="rgba(31,58,46,0.05)" />
              </linearGradient>
              <linearGradient id="ng-served" x1="0" y1="0" x2="0.6" y2="1">
                <stop offset="0%" stopColor="rgba(20,107,74,0.42)" />
                <stop offset="100%" stopColor="rgba(20,107,74,0.2)" />
              </linearGradient>
              <linearGradient id="ng-hover" x1="0" y1="0" x2="0.6" y2="1">
                <stop offset="0%" stopColor="rgba(20,107,74,0.3)" />
                <stop offset="100%" stopColor="rgba(20,107,74,0.14)" />
              </linearGradient>
            </defs>

            <g strokeLinejoin="round">
              {ordered.map((s) => {
                const l = look(
                  hovered === s.id
                    ? "hover"
                    : PRESENT.has(s.id)
                      ? "present"
                      : glowing.has(s.id)
                        ? "lit"
                        : "base",
                );
                return (
                  <path
                    key={s.id}
                    d={s.d}
                    onPointerEnter={() => setHovered(s.id)}
                    onPointerLeave={() =>
                      setHovered((h) => (h === s.id ? null : h))
                    }
                    className="transition-[fill,stroke,stroke-width] duration-700 ease-out"
                    fill={l.fill}
                    stroke={l.stroke}
                    strokeWidth={l.width}
                  />
                );
              })}
            </g>

            {/* Where we service — a slow sonar, staggered so it reads as a
                heartbeat crossing the country rather than one flash */}
            <g className="pointer-events-none">
              {served.map((s, i) => (
                <g key={s.id}>
                  <circle
                    cx={s.c[0]}
                    cy={s.c[1]}
                    r="6"
                    fill="none"
                    stroke="#146b4a"
                    strokeWidth="1.4"
                    className="map-pulse"
                    style={{ animationDelay: `${i * 0.42}s` }}
                  />
                  <circle
                    cx={s.c[0]}
                    cy={s.c[1]}
                    r="5.5"
                    fill="#f7f4ec"
                    opacity="0.9"
                  />
                  <circle cx={s.c[0]} cy={s.c[1]} r="3.6" fill="#146b4a" />
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Legend — answers the map rather than labelling it */}
      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-ink/10 pt-4">
        <p className="flex items-center gap-2.5 text-xs text-mute">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(20,107,74,0.45)]"
          />
          <span>{`Servicing ${statesServed} states & the FCT — installing nationwide`}</span>
        </p>
        <p
          key={hoveredState?.id ?? "idle"}
          className="stack-caption font-display shrink-0 text-base text-ink/80"
          aria-live="polite"
        >
          {hoveredState?.name ?? ""}
        </p>
      </div>
    </div>
  );
}
