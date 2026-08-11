"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { NIGERIA_VIEWBOX, nigeriaStates } from "@/lib/nigeria-map";
import { presenceStates } from "@/lib/site";

/** How long between one state lighting up and the next. */
const STEP_MS = 1700;
/** How many roaming states glow at once before the oldest fades out. */
const TRAIL = 3;

/** Depth of field, and how far the map leans toward the pointer. */
const PERSPECTIVE = 1600;
const TILT_X = 3.5;
const TILT_Y = 5.5;
/** How far the whole map drifts as the hero scrolls past. */
const SCROLL_DRIFT = 46;

const PRESENT = new Set(presenceStates);
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
function strokeFor(state: "base" | "lit" | "present" | "hover") {
  switch (state) {
    case "hover":
      return { stroke: "rgba(20,107,74,1)", width: 2, fill: "rgba(20,107,74,0.14)" };
    case "present":
      return { stroke: "rgba(20,107,74,0.95)", width: 1.7, fill: "rgba(20,107,74,0.3)" };
    case "lit":
      return { stroke: "rgba(20,107,74,0.7)", width: 1.4, fill: "rgba(20,107,74,0.12)" };
    default:
      return { stroke: "rgba(31,58,46,0.26)", width: 1, fill: "rgba(31,58,46,0.055)" };
  }
}

/**
 * Nigeria, all 36 states and the FCT, laid into the page like light on paper —
 * no frame, no panel. The states Kayglo has installed in stay lit, the rest
 * take their turn, and the country leans gently toward the pointer.
 */
export function PowerMap({
  className = "",
}: {
  /** Must position the map — e.g. `absolute inset-0` over a `relative` parent. */
  className?: string;
}) {
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

  // Lean and drift. The pointer sets a target and a chase loop eases toward it,
  // so the map trails the cursor rather than snapping to it. One transform on
  // one element per frame — nothing re-renders.
  useEffect(() => {
    const band = host.current?.parentElement;
    const el = stage.current;
    if (!band || !el || reduced || !onScreen) return;

    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let drift = 0;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      const r = band.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const loop = () => {
      eased.x += (target.x - eased.x) * 0.05;
      eased.y += (target.y - eased.y) * 0.05;

      const r = band.getBoundingClientRect();
      // 0 while the hero sits in place, 1 once it has scrolled away.
      const progress = Math.min(Math.max(-r.top / (r.height || 1), 0), 1);
      drift += (progress * SCROLL_DRIFT - drift) * 0.12;

      el.style.transform =
        `perspective(${PERSPECTIVE}px) translate3d(0, ${(-drift).toFixed(2)}px, 0) ` +
        `rotateX(${(-eased.y * TILT_X).toFixed(2)}deg) ` +
        `rotateY(${(eased.x * TILT_Y).toFixed(2)}deg)`;

      frame = requestAnimationFrame(loop);
    };

    band.addEventListener("pointermove", onMove);
    band.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);
    return () => {
      band.removeEventListener("pointermove", onMove);
      band.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [reduced, onScreen]);

  const glowing = new Set(lit);
  const present = nigeriaStates.filter((s) => PRESENT.has(s.id));
  const presentNames = present.map((s) => s.name);
  const hoveredName = nigeriaStates.find((s) => s.id === hovered)?.name;

  // The hovered state paints last so its thick outline is never clipped by a
  // neighbour drawn over it.
  const ordered = hovered
    ? [
        ...nigeriaStates.filter((s) => s.id !== hovered),
        ...nigeriaStates.filter((s) => s.id === hovered),
      ]
    : nigeriaStates;

  return (
    <div ref={host} className={className}>
      <div
        className="absolute inset-5 md:inset-y-4 md:left-[39%] md:right-4"
        style={{ perspective: `${PERSPECTIVE}px` }}
      >
        <div
          ref={stage}
          className="map-float relative h-full w-full opacity-40 md:opacity-100"
        >
          {/* Light pooling under the country */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(52% 50% at 50% 48%, rgba(20,107,74,0.16), transparent 72%)",
            }}
          />

          <svg
            viewBox={NIGERIA_VIEWBOX}
            preserveAspectRatio="xMidYMid meet"
            className="map-breathe absolute inset-0 h-full w-full"
            role="img"
            aria-label={`Map of Nigeria showing all 36 states and the Federal Capital Territory. Kayglo has installed and services systems in ${presentNames.join(" and ")}, and supplies and installs nationwide.`}
          >
            <g strokeLinejoin="round">
              {ordered.map((s) => {
                const look = strokeFor(
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
                    className="pointer-events-auto transition-[fill,stroke,stroke-width] duration-[900ms] ease-out"
                    fill={look.fill}
                    stroke={look.stroke}
                    strokeWidth={look.width}
                  />
                );
              })}
            </g>

            {/* Where we are */}
            <g className="pointer-events-none">
              {present.map((s) => (
                <g key={s.id}>
                  <circle
                    cx={s.c[0]}
                    cy={s.c[1]}
                    r="7"
                    fill="none"
                    stroke="#146b4a"
                    strokeWidth="1.6"
                    className="map-pulse"
                  />
                  <circle cx={s.c[0]} cy={s.c[1]} r="4.5" fill="#146b4a" />
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* A quiet caption — it answers the map rather than labelling it */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 hidden justify-end px-6 sm:px-8 md:flex">
        <div className="max-w-xs text-right">
          <p
            key={hoveredName ?? "idle"}
            className="stack-caption font-display text-lg text-ink/85"
          >
            {hoveredName ?? "Powering Nigeria, state by state"}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-mute">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle shadow-[0_0_8px_2px_rgba(20,107,74,0.5)]" />
            Installed &amp; serviced in {presentNames.join(" & ")} · nationwide
            supply and installation
          </p>
        </div>
      </div>
    </div>
  );
}
