/**
 * Central source of truth for Kayglo Solar.
 * Edit business details here — every page, the footer, and all SEO/structured
 * data read from this file, so you only change facts in one place.
 *
 * NOTE: values marked  // TODO  are premium-looking placeholders. Swap them
 * for real details before launch.
 */

export const site = {
  name: "Kayglo Citadel",
  legalName: "Kayglo Citadel",
  tagline: "Genuine solar. Reliable power. Trusted after-sales.",
  description:
    "Kayglo Citadel supplies genuine solar panels, inverters, and batteries — and designs, installs, and services complete solar systems for homes and businesses across Nigeria. Silent, reliable power, backed by honest advice and dependable after-sales support.",
  // Production URL — set to your real domain. Used for canonical + OG + sitemap.
  // Currently the live Vercel URL; change to your custom domain when you connect one.
  url: "https://kayglo.vercel.app",
  locale: "en_NG",

  // NAP — must match your Google Business Profile exactly (local SEO).
  contact: {
    phone: "08050777800", // TODO
    phoneHref: "+2348050777800", // TODO
    email: "hello@kayglo.com", // TODO
    address: {
      street: "House 1, Kelly John Close Infinity Estate", // TODO
      city: "Lagos", // TODO
      region: "LA", // TODO
      postalCode: "11001", // TODO
      country: "NG",
    },
    // For LocalBusiness geo — set to your office coordinates.
    geo: { lat: 6.5244, lng: 3.3792 }, // TODO — Lagos; set to your exact office coordinates
    hours: "Mon–Fri 8:00–18:00",
  },

  areasServed: [
    "Nigeria",
  ], // TODO

  social: {
    instagram: "https://instagram.com/kayglocitadel", // TODO
    linkedin: "https://linkedin.com/company/kayglo", // TODO
  },

  // Trust signals surfaced across the site.
  stats: [
    { value: "4.9/5", label: "Average client rating" },
    { value: "25 yr", label: "Workmanship warranty" },
    { value: "500+", label: "Homes & businesses powered" },
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
    slug: "home-solar",
    title: "Home Solar & Inverter Systems",
    summary:
      "Complete solar and inverter systems for your home — silent, round-the-clock power that ends blackouts and retires the generator.",
    detail:
      "We assess your home and daily energy use, then design and install a complete system — panels, inverter, and batteries — sized to keep your home running 24/7. Every component is genuine and installed to a standard built to last in Nigerian conditions.",
    points: [
      "Complete design & install — panels, inverter, batteries",
      "Silent, fume-free power — retire the generator",
      "Automatic switchover between solar, battery, and grid",
      "Neat, professional cabling and workmanship",
    ],
  },
  {
    slug: "products",
    title: "Genuine Products & Supply",
    summary:
      "Authentic batteries, inverters, and solar panels from trusted brands — supplied with warranty and honest guidance on what you actually need.",
    detail:
      "Nigeria's market is full of counterfeit and substandard equipment that fails within months. We supply only genuine, warranty-backed batteries, inverters, and panels — and we advise you honestly on the right capacity, whether you're building a new system or upgrading an existing one.",
    points: [
      "100% genuine, warranty-backed equipment",
      "Lithium & tubular batteries, inverters, and panels",
      "Honest sizing advice — never oversold",
      "Supply for new systems or upgrades",
    ],
  },
  {
    slug: "commercial-solar",
    title: "Commercial Solar",
    summary:
      "Cut diesel spend and power your business reliably with commercial-grade solar and storage, engineered to keep operations running.",
    detail:
      "For offices, retail, hospitality, and light industry, we design commercial systems that displace generator hours, tame runaway energy costs, and deliver clean, dependable power through grid outages. From rooftop to ground-mount, every project is engineered around your load profile, uptime requirements, and payback goals.",
    points: [
      "Diesel-generator displacement & hybrid integration",
      "Systems sized to your load profile and uptime needs",
      "Rooftop, carport, and ground-mount configurations",
      "Predictable energy costs with a clear return on investment",
    ],
  },
  {
    slug: "servicing",
    title: "Servicing & After-Sales",
    summary:
      "We don't disappear after installation. Ongoing maintenance, repairs, and responsive support keep your system performing for years.",
    detail:
      "Every client gets dependable after-sales care — scheduled servicing, fault diagnosis, battery and inverter maintenance, and a team that actually answers the phone. Your system is backed for the long term, not just the day it's switched on.",
    points: [
      "Scheduled maintenance & performance checks",
      "Fast fault diagnosis and repairs",
      "Battery & inverter servicing and replacement",
      "A team that answers — long after installation",
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
    slug: "ikoyi-residence",
    name: "Ikoyi Family Residence",
    location: "Ikoyi, Lagos",
    system: "12 kW solar · 30 kWh storage",
    summary:
      "A family home that ran two diesel generators every day. We delivered silent, round-the-clock power and cut the generators to emergency-only.",
    metrics: [
      { label: "Generator use", value: "−96%" },
      { label: "Fuel saved", value: "₦7.2m/yr" },
      { label: "Payback", value: "3.4 yrs" },
    ],
    hue: "#2f5343",
  },
  {
    slug: "maitama-office",
    name: "Corporate Head Office",
    location: "Maitama, Abuja",
    system: "80 kW solar · commercial storage",
    summary:
      "An office complex spending millions monthly on diesel. A rooftop commercial array with storage now carries the working day on solar, with grid and a single backup generator as fallback.",
    metrics: [
      { label: "Diesel cut", value: "72%" },
      { label: "Monthly saving", value: "₦4.1m" },
      { label: "Payback", value: "3.1 yrs" },
    ],
    hue: "#8a5a1f",
  },
  {
    slug: "lekki-smart-home",
    name: "Lekki Smart Home",
    location: "Lekki Phase 1, Lagos",
    system: "8 kW solar · 20 kWh storage",
    summary:
      "A modern home wanting seamless, silent power. Solar and battery now run the home 24/7 with an automatic changeover no one in the house even notices.",
    metrics: [
      { label: "Power uptime", value: "24/7" },
      { label: "Generator use", value: "Eliminated" },
      { label: "Payback", value: "3.8 yrs" },
    ],
    hue: "#1f3a2e",
  },
];

export const processSteps = [
  {
    n: "01",
    title: "Consultation & Survey",
    body: "A conversation, not a sales pitch. We assess your power needs, your space, and your budget — then recommend only what you actually need.",
  },
  {
    n: "02",
    title: "Design & Genuine Supply",
    body: "We design a system sized to your load and supply only authentic, warranty-backed panels, inverters, and batteries — no counterfeits, no shortcuts.",
  },
  {
    n: "03",
    title: "Professional Install",
    body: "A dedicated crew installs cleanly and safely, with tidy cabling and a seamless changeover between solar, battery, and the grid.",
  },
  {
    n: "04",
    title: "After-Sales Support",
    body: "We stay with you — scheduled servicing, fast repairs, and a team that answers the phone for the full life of your system.",
  },
];

export const testimonials = [
  {
    quote:
      "We haven't switched on the generator in months. The house is silent at night and our diesel bill is gone. Kayglo used genuine batteries and inverter — you can feel the quality.",
    author: "Adebayo & Ngozi O.",
    location: "Ikoyi, Lagos",
  },
  {
    quote:
      "They cut our office diesel costs by more than half and we run through every outage without a flicker. What impressed me most is the after-sales — they actually come when you call.",
    author: "Managing Director",
    location: "Maitama, Abuja",
  },
  {
    quote:
      "Kayglo sized the system to what we truly use instead of overselling us. Two years on, it still performs exactly as promised, and servicing has been faultless.",
    author: "Chidi E.",
    location: "Lekki, Lagos",
  },
];

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/financing", label: "Pricing" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About" },
];
