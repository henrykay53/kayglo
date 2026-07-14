/**
 * Central source of truth for Kayglo Solar.
 * Edit business details here — every page, the footer, and all SEO/structured
 * data read from this file, so you only change facts in one place.
 *
 * NOTE: values marked  // TODO  are premium-looking placeholders. Swap them
 * for real details before launch.
 */

export const site = {
  name: "Kayglo",
  legalName: "Kayglo Solar",
  tagline: "Premium solar, engineered for the home you worked for.",
  description:
    "Kayglo designs, engineers, and installs high-performance residential solar and battery systems with concierge-level service. Award-winning craftsmanship, 25-year workmanship warranty.",
  // Production URL — set to your real domain. Used for canonical + OG + sitemap.
  // Currently the live Vercel URL; change to your custom domain when you connect one.
  url: "https://kayglo.vercel.app",
  locale: "en_US",

  // NAP — must match your Google Business Profile exactly (local SEO).
  contact: {
    phone: "(800) 555-0142", // TODO
    phoneHref: "+18005550142", // TODO
    email: "hello@kayglo.com", // TODO
    address: {
      street: "1200 Marina Boulevard, Suite 400", // TODO
      city: "San Francisco", // TODO
      region: "CA", // TODO
      postalCode: "94123", // TODO
      country: "US",
    },
    // For LocalBusiness geo — set to your office coordinates.
    geo: { lat: 37.8058, lng: -122.4324 }, // TODO
    hours: "Mon–Fri 8:00–18:00",
  },

  areasServed: [
    "San Francisco",
    "Marin County",
    "Silicon Valley",
    "East Bay",
    "Napa Valley",
  ], // TODO

  social: {
    instagram: "https://instagram.com/kayglo", // TODO
    linkedin: "https://linkedin.com/company/kayglo", // TODO
  },

  // Trust signals surfaced across the site.
  stats: [
    { value: "4.9/5", label: "Average client rating" },
    { value: "25 yr", label: "Workmanship warranty" },
    { value: "1,800+", label: "Homes powered" },
    { value: "38 MWh", label: "Clean energy annually" },
  ],
} as const;

export type Service = {
  slug: string;
  title: string;
  summary: string;
  detail: string;
  points: string[];
};

export const services: Service[] = [
  {
    slug: "residential-solar",
    title: "Residential Solar",
    summary:
      "Bespoke rooftop and ground-mount systems designed around your home's architecture and your energy goals.",
    detail:
      "We start with a full energy audit and a shade study, then engineer a system sized precisely to your usage — never oversold. Premium monocrystalline panels, low-profile all-black mounting, and hidden conduit keep the aesthetic clean.",
    points: [
      "Tier-1 monocrystalline panels (up to 22.8% efficiency)",
      "Concealed wiring & flush, all-black hardware",
      "Structural & electrical engineering in-house",
      "Permitting and utility interconnection handled for you",
    ],
  },
  {
    slug: "battery-storage",
    title: "Battery Storage",
    summary:
      "Keep the lights on through outages and shift energy to when it's most valuable with whole-home backup.",
    detail:
      "Pair your array with a battery to store daytime generation for evening use, protect against grid outages, and take advantage of time-of-use rates. Sized for whole-home or essential-loads backup.",
    points: [
      "Whole-home or essential-loads backup",
      "Seamless outage switchover in under a second",
      "Time-of-use arbitrage to lower bills",
      "Expandable, app-monitored capacity",
    ],
  },
  {
    slug: "ev-charging",
    title: "EV Charging",
    summary:
      "Charge from the sun. Level 2 home charging integrated cleanly with your solar and storage.",
    detail:
      "A properly installed Level 2 charger fills your vehicle overnight on solar-stored energy. We handle panel upgrades, load calculations, and a tidy, code-compliant install.",
    points: [
      "Level 2 chargers up to 48A",
      "Load management & panel upgrades",
      "Solar-prioritized charging schedules",
      "Weatherproof indoor or outdoor mounting",
    ],
  },
  {
    slug: "monitoring-service",
    title: "Monitoring & Service",
    summary:
      "Proactive monitoring and a dedicated service team keep every system performing at its peak.",
    detail:
      "Every install includes lifetime performance monitoring. If production dips, we know before you do. One point of contact, guaranteed response times, and no call-center runaround.",
    points: [
      "24/7 production monitoring & alerts",
      "Annual performance reviews",
      "Priority service dispatch",
      "25-year workmanship warranty",
    ],
  },
];

export type ProjectCase = {
  slug: string;
  name: string;
  location: string;
  system: string;
  summary: string;
  metrics: { label: string; value: string }[];
  hue: string; // brand-consistent artwork tint
};

export const projects: ProjectCase[] = [
  {
    slug: "hillside-residence",
    name: "Hillside Residence",
    location: "Sausalito, CA",
    system: "14.2 kW · 40 kWh storage",
    summary:
      "A cliffside modern home with strict HOA aesthetics. We concealed all conduit and matched the all-black array to the standing-seam roof.",
    metrics: [
      { label: "Bill offset", value: "104%" },
      { label: "Annual savings", value: "$4,380" },
      { label: "Payback", value: "6.1 yrs" },
    ],
    hue: "#2f5343",
  },
  {
    slug: "vineyard-estate",
    name: "Vineyard Estate",
    location: "Napa Valley, CA",
    system: "42 kW · 3× battery",
    summary:
      "An off-grid-capable estate blending ground-mount arrays into the landscape, powering the residence, guest house, and winery outbuildings.",
    metrics: [
      { label: "Bill offset", value: "118%" },
      { label: "Backup", value: "Whole estate" },
      { label: "CO₂ saved", value: "31 t/yr" },
    ],
    hue: "#8a5a1f",
  },
  {
    slug: "marina-townhome",
    name: "Marina Townhome",
    location: "San Francisco, CA",
    system: "8.6 kW · EV + battery",
    summary:
      "A compact urban roof engineered for maximum yield, integrated with Level 2 EV charging and evening backup.",
    metrics: [
      { label: "Bill offset", value: "96%" },
      { label: "EV miles/yr", value: "9,200 solar" },
      { label: "Payback", value: "6.8 yrs" },
    ],
    hue: "#1f3a2e",
  },
];

export const processSteps = [
  {
    n: "01",
    title: "Consultation",
    body: "A conversation, not a sales pitch. We learn how you use energy and what matters to you — aesthetics, resilience, or return.",
  },
  {
    n: "02",
    title: "Design & Engineering",
    body: "Our engineers produce a shade study, structural analysis, and a photo-accurate rendering of your system before anything is ordered.",
  },
  {
    n: "03",
    title: "Precision Install",
    body: "One dedicated crew, typically one to two days on site, with meticulous cleanup and concealed wiring throughout.",
  },
  {
    n: "04",
    title: "Lifetime Care",
    body: "We monitor performance for the life of the system and stand behind it with a 25-year workmanship warranty.",
  },
];

export const testimonials = [
  {
    quote:
      "The most professional trade experience we've had on this house — and we've renovated twice. The array is invisible from the street and our bill is essentially zero.",
    author: "Margaret & David L.",
    location: "Sausalito",
  },
  {
    quote:
      "Kayglo treated our winery like their own. Thoughtful engineering, spotless install, and they actually answer the phone.",
    author: "Estate Owner",
    location: "Napa Valley",
  },
  {
    quote:
      "They talked us out of a bigger system than we needed. That honesty is why we referred three neighbors.",
    author: "Priya S.",
    location: "San Francisco",
  },
];

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/financing", label: "Financing" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About" },
];
