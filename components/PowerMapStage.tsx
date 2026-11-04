"use client";

import Link from "next/link";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

/** What the readout may say about a state — all of it from lib/site.ts. */
export type GridState = {
  id: string;
  /** Display name, with a city in brackets where one is named. */
  name: string;
  /** Kayglo's crews install here (presenceStates). */
  served: boolean;
  /** Geopolitical zone. */
  zone: string;
  /** Published case studies located in this state. */
  cases: number;
};

/** A served state breathes every so often: a random gap in this range (ms).
 *  Pulses may overlap — each one always runs to the end of its fade. */
const PULSE_GAP: [number, number] = [1800, 3400];

const subscribeMotion = (onChange: () => void) => {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

const subscribeVisibility = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};

const FLOW = ["tail", "halo", "core"] as const;
const TRICKLE = ["halo", "core"] as const;

/** A list separator that wraps after the dot, never before it. */
const SEP = "\u00a0· ";

const stateAt = (target: EventTarget) =>
  (target as Element).closest?.("[data-state]")?.getAttribute("data-state") ??
  null;

/**
 * The live half of the power map (components/PowerMap.tsx renders the
 * geometry on the server and hands it in as `land` and `paths`).
 * Handles the lean toward the pointer, the served states breathing in turn,
 * hover and tap selection, and pausing the current when nobody can see it.
 */
export function PowerMapStage({
  className = "",
  viewBox,
  ariaLabel,
  states,
  summary,
  distribution,
  land,
  paths,
}: {
  className?: string;
  viewBox: string;
  ariaLabel: string;
  states: GridState[];
  summary: string;
  distribution: { zone: string; count: number }[];
  land: ReactNode;
  /** Path data for the border layers and the current along them. */
  paths: {
    mesh: string;
    outline: string;
    meshLit: string;
    frontier: string;
    internal: string;
  };
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

  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  // The served states breathing right now. Each is removed only when its own
  // animation ends, so a fade is never cut short.
  const [pulses, setPulses] = useState<{ id: string; n: number }[]>([]);
  const [onScreen, setOnScreen] = useState(true);
  const host = useRef<HTMLDivElement | null>(null);
  const base = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Line weights are set in screen pixels, whatever size the map is drawn
  // at: --k is map units per CSS pixel, kept current without a re-render.
  useEffect(() => {
    const svg = base.current;
    const el = host.current;
    if (!svg || !el || typeof ResizeObserver === "undefined") return;
    const units = Number(viewBox.split(/\s+/)[2]) || 1000;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w <= 0) return;
      el.style.setProperty("--k", (units / w).toFixed(3));
    });
    ro.observe(svg);
    return () => ro.disconnect();
  }, [viewBox]);

  const running = !reduced && !hidden && onScreen;

  // Every so often, one of the states we install in pulses softly — picked at
  // random, never the same one twice running.
  useEffect(() => {
    if (!running) return;
    const served = states.filter((s) => s.served);
    let timer: ReturnType<typeof setTimeout>;
    let last = "";
    let n = 0;
    const next = () => {
      setPulses((now) => {
        const busy = new Set(now.map((p) => p.id));
        const pool = served.filter((s) => s.id !== last && !busy.has(s.id));
        if (!pool.length) return now;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        last = pick.id;
        return [...now, { id: pick.id, n: n++ }];
      });
      const [lo, hi] = PULSE_GAP;
      timer = setTimeout(next, lo + Math.random() * (hi - lo));
    };
    timer = setTimeout(next, 900);
    return () => {
      clearTimeout(timer);
      setPulses([]);
    };
  }, [running, states]);

  // A pinned (tapped or clicked) state lets go on Escape or a tap elsewhere.
  useEffect(() => {
    if (!pinned) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPinned(null);
    const onDown = (e: PointerEvent) => {
      if (!host.current?.contains(e.target as Node)) setPinned(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [pinned]);

  const onOver = (e: ReactPointerEvent) => {
    if (e.pointerType === "touch") return;
    const id = stateAt(e.target);
    if (id) setHovered(id);
  };

  const active = hovered ?? pinned;
  const activeState = states.find((s) => s.id === active);

  return (
    <div
      ref={host}
      className={`map-host ${className}`}
      data-paused={running ? undefined : ""}
      // Hover holds until the pointer leaves the map *and* its readout, so
      // the case-study link under it can be reached.
      onPointerLeave={() => setHovered(null)}
    >
      <div>
        <div className="relative">

          <svg
            ref={base}
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            className="map-base relative block h-auto w-full overflow-visible"
            role="img"
            aria-label={ariaLabel}
            onPointerOver={onOver}
            onClick={(e) => {
              const id = stateAt(e.target);
              setPinned((p) => (id && p !== id ? id : null));
            }}
          >

            {land}

            {/* Where we install — one state at a time glows a little
                brighter, then settles, like a light coming on there */}
            <g pointerEvents="none">
              {pulses.map((p) => (
                <use
                  key={p.n}
                  href={`#ngmap-${p.id}`}
                  className="map-state-pulse"
                  fill="#4fbf8f"
                  onAnimationEnd={() =>
                    setPulses((now) => now.filter((q) => q.n !== p.n))
                  }
                />
              ))}
            </g>

            {/* Solid colours throughout: every internal border is drawn by both
                of its states, and a solid line drawn twice looks like one. */}
            <g fill="none" strokeLinejoin="round" strokeLinecap="round" pointerEvents="none">
              <path className="map-mesh" d={paths.mesh} />
              <path className="map-outline" d={paths.outline} />
              <path className="map-mesh-lit" d={paths.meshLit} />
              <path className="map-edge" d={paths.frontier} />
            </g>
          </svg>

          {/* The current, on its own layer so the map under it never repaints */}
          <svg
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            className="map-current pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            {/* The current. Flat strokes sharing one dash rhythm — a pale
                tail, a solid head and a short warm-white tip — with their
                leading edges aligned, so each pulse is a line segment
                travelling clockwise (.map-flow-*, .map-trickle-* in
                app/globals.css). */}
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              {FLOW.map((layer) => (
                <path
                  key={layer}
                  className={`map-anim map-flow map-flow-${layer}`}
                  d={paths.frontier}
                />
              ))}
              {paths.internal &&
                TRICKLE.map((layer) => (
                  <path
                    key={layer}
                    className={`map-anim map-trickle map-trickle-${layer}`}
                    d={paths.internal}
                  />
                ))}
            </g>
            {activeState && (
              <g
                key={activeState.id}
                className="map-focus"
                data-served={activeState.served ? "" : undefined}
                fill="none"
              >
                <use
                  href={`#ngmap-${activeState.id}`}
                  className={
                    activeState.served ? "map-focus-lit" : "map-focus-muted"
                  }
                />
                <use
                  href={`#ngmap-${activeState.id}`}
                  className="map-anim map-ring map-ring-halo"
                />
                <use
                  href={`#ngmap-${activeState.id}`}
                  className="map-anim map-ring map-ring-core"
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Legend and readout — they answer the map rather than label it */}
      <div className="mt-5 border-t border-ink/10 pt-4">
        <p className="flex items-start gap-2.5 text-xs leading-4 text-mute">
          <span aria-hidden="true" className="map-key mt-[7px]" />
          <span>{summary}</span>
        </p>
        {distribution.length > 0 && (
          <p className="mt-1.5 pl-[1.625rem] text-[11px] leading-relaxed tracking-wide text-mute/80">
            {distribution.map((z, i) => (
              <Fragment key={z.zone}>
                {i > 0 && SEP}
                <span className="whitespace-nowrap">
                  {z.zone}{" "}
                  <span className="tabular-nums text-ink/70">{z.count}</span>
                </span>
              </Fragment>
            ))}
          </p>
        )}

        <div
          aria-live="polite"
          className="mt-3 min-h-[2.875rem] pl-[1.625rem]"
        >
          {activeState ? (
            <div key={activeState.id} className="stack-caption">
              <p className="font-display text-base leading-tight text-ink">
                {activeState.name}
              </p>
              <p className="mt-1 text-xs text-mute">
                <span className={activeState.served ? "text-accent" : ""}>
                  {activeState.served
                    ? "Our crews install here"
                    : "Outside our regular service areas"}
                </span>
                {activeState.zone && (
                  <>
                    {SEP}
                    <span className="whitespace-nowrap">{activeState.zone}</span>
                  </>
                )}
                {activeState.cases > 0 && (
                  <>
                    {SEP}
                    <Link
                      href="/projects"
                      className="whitespace-nowrap text-ink underline decoration-ink/25 underline-offset-2 hover:decoration-accent"
                    >
                      {activeState.cases}{" "}
                      {activeState.cases === 1 ? "case study" : "case studies"}
                    </Link>
                  </>
                )}
              </p>
            </div>
          ) : (
            <p className="text-xs text-mute/70">
              <span className="[@media(hover:none)]:hidden">Hover</span>
              <span className="hidden [@media(hover:none)]:inline">Tap</span>
              {" a state for details"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
