import type { TradeIcon as Name } from "@/lib/site";

/**
 * One outline icon per kind of trade, drawn on a 24px grid at the same stroke
 * weight as the site's other inline icons, so the set reads as one family.
 * Shapes follow the Lucide icon set (ISC licence, lucide.dev).
 */
const PATHS: Record<Name, React.ReactNode> = {
  // Fork and knife
  dining: (
    <>
      <path d="M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3Zm0 0v7" />
    </>
  ),
  // Capsule
  pharmacy: (
    <>
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </>
  ),
  // Stethoscope
  clinic: (
    <>
      <path d="M11 2v2M5 2v2" />
      <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
      <path d="M8 15a6 6 0 0 0 12 0v-3" />
      <circle cx="20" cy="10" r="2" />
    </>
  ),
  // Scissors
  salon: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
    </>
  ),
  // Double bed
  hotel: (
    <>
      <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
      <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <path d="M12 4v6M2 18h20" />
    </>
  ),
  // Shopping trolley
  supermarket: (
    <>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </>
  ),
  // Briefcase
  office: (
    <>
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect x="2" y="6" width="20" height="14" rx="2" />
    </>
  ),
  // Graduation cap
  school: (
    <>
      <path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0Z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </>
  ),
  // Church with a cross
  church: (
    <>
      <path d="M10 9h4M12 7v5" />
      <path d="M14 22v-4a2 2 0 0 0-4 0v4" />
      <path d="M18 22V5.62a1 1 0 0 0-.55-.9l-4.55-2.27a2 2 0 0 0-1.8 0L6.55 4.72a1 1 0 0 0-.55.9V22" />
      <path d="m18 7 3.45 1.72a1 1 0 0 1 .55.9V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9.38a1 1 0 0 1 .55-.9L6 7" />
    </>
  ),
  // Washing machine
  laundry: (
    <>
      <rect x="3" y="2" width="18" height="20" rx="2" />
      <path d="M7 6h.01M11 6h.01" />
      <circle cx="12" cy="14" r="4.5" />
      <path d="M9.5 14.5c.8-.7 1.7-.7 2.5 0s1.7.7 2.5 0" />
    </>
  ),
  // Desktop monitor
  tech: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  // Factory
  factory: (
    <>
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M17 18h1M12 18h1M7 18h1" />
    </>
  ),
};

export function TradeIcon({
  name,
  className = "h-5 w-5",
}: {
  name: Name;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
