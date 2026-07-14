import { site } from "@/lib/site";

/** Minimal sun/aperture mark — the Kayglo logo glyph. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label={`${site.name} logo`}
      fill="none"
    >
      <circle cx="16" cy="16" r="7" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        const x1 = 16 + Math.cos(a) * 11;
        const y1 = 16 + Math.sin(a) * 11;
        const x2 = 16 + Math.cos(a) * 14.5;
        const y2 = 16 + Math.sin(a) * 14.5;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/** Wordmark: glyph + serif name. */
export function Logo({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className={`h-6 w-6 ${onDark ? "text-gold-300" : "text-gold"}`} />
      <span
        className={`font-display text-[1.35rem] font-medium tracking-tight ${
          onDark ? "text-cream" : "text-ink"
        }`}
      >
        {site.name}
      </span>
    </span>
  );
}

/**
 * Fine-line solar-panel array — used as bespoke hero/section artwork.
 * Draws a subtly-angled grid of cells with a warm gradient wash.
 */
export function PanelArt({
  className = "",
  cols = 6,
  rows = 4,
}: {
  className?: string;
  cols?: number;
  rows?: number;
}) {
  const cells: React.ReactNode[] = [];
  const w = 100 / cols;
  const h = 100 / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c * w + 0.6}
          y={r * h + 0.6}
          width={w - 1.2}
          height={h - 1.2}
          rx="0.8"
          fill="url(#cell)"
          stroke="rgba(236,192,121,0.28)"
          strokeWidth="0.25"
        />,
      );
    }
  }
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#243c31" />
          <stop offset="0.55" stopColor="#182a22" />
          <stop offset="1" stopColor="#0f1c17" />
        </linearGradient>
        <radialGradient id="glow" cx="0.8" cy="0.1" r="0.9">
          <stop offset="0" stopColor="rgba(236,192,121,0.5)" />
          <stop offset="1" stopColor="rgba(236,192,121,0)" />
        </radialGradient>
      </defs>
      <g transform="rotate(-8 50 50) scale(1.25) translate(-10 -8)">{cells}</g>
      <rect width="100" height="100" fill="url(#glow)" />
    </svg>
  );
}

/** Large decorative sun-ray burst for section corners. */
export function RayBurst({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" fill="none">
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * Math.PI) / 12;
        return (
          <line
            key={i}
            x1={100 + Math.cos(a) * 34}
            y1={100 + Math.sin(a) * 34}
            x2={100 + Math.cos(a) * 96}
            y2={100 + Math.sin(a) * 96}
            stroke="currentColor"
            strokeWidth="0.75"
          />
        );
      })}
      <circle cx="100" cy="100" r="26" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}
