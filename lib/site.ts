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

export type ProjectPhoto = {
  src: string;
  alt: string;
  /** Intrinsic pixel size — keeps next/image free of layout shift. */
  width: number;
  height: number;
  /** Optional overlay caption, used by the hero stack. */
  title?: string;
  note?: string;
};

/**
 * States Kayglo currently services — lit permanently on the homepage map.
 * Cities map to their state: Port Harcourt → Rivers, Benin City → Edo.
 * Codes come from lib/nigeria-map.ts.
 */
export const presenceStates = [
  "NG-LA", // Lagos
  "NG-FC", // Abuja (FCT)
  "NG-OG", // Ogun
  "NG-OY", // Oyo
  "NG-KW", // Kwara
  "NG-ED", // Edo — Benin City
  "NG-DE", // Delta
  "NG-RI", // Rivers — Port Harcourt
  "NG-IM", // Imo
];

/** The auto-shuffling stack of site photography in the homepage hero. */
export const heroGallery: ProjectPhoto[] = [
  {
    src: "/hero/01.jpg",
    alt: "A Kayglo solar array installed across a tiled roof at dusk.",
    width: 1152,
    height: 864,
    title: "Rooftop array, Lagos",
    note: "Genuine panels · clean install · silent power",
  },
  {
    src: "/hero/02.jpg",
    alt: "Panels flush-mounted along the pitch of a tiled roof above a Lagos street.",
    width: 864,
    height: 1152,
    title: "Flush-mounted on pitch",
    note: "Weather-sealed rails · no leaks, no rattle",
  },
  {
    src: "/hero/03.jpg",
    alt: "A full rooftop array on a flat estate roof after rain, city skyline behind.",
    width: 1280,
    height: 960,
    title: "Sized for the whole home",
    note: "Enough array to carry the load, not just the lights",
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
  /** Shot on site. Rendered as a shuffleable card stack — first one is the hero. */
  gallery: ProjectPhoto[];
  /**
   * The case study, in the order a buyer actually asks the questions.
   * Solar is a high-trust purchase — someone is handing over millions and
   * letting a stranger wire their building. Evidence is what closes that gap.
   */
  study?: {
    /** The situation before we arrived. */
    before: string;
    /** What it was costing them — money, time, sleep, trade. */
    problem: string;
    /** The setup they already had. */
    existing: string;
    /** What the system had to carry. */
    needs: string[];
    /** What we installed. Only list what is genuinely on site. */
    installed: string[];
    /** How the installation went. */
    install: string;
    /** Life after commissioning. */
    after: string;
    /**
     * A real customer quote, in their own words, with their permission.
     * Leave this out entirely until you have one — an invented testimonial is
     * worse than no testimonial.
     */
    quote?: { text: string; name: string; role?: string };
  };
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
    study: {
      // TODO — verify these details against your own job notes before launch.
      before:
        "A large family home in Ikoyi running two diesel generators on rotation. The compound was never quiet, and the fuel run had become part of somebody's job description.",
      problem:
        "Two generators meant two servicing schedules, two sets of repairs and a fuel bill that moved with the pump price. The noise carried into every room at the back of the house, and an outage still meant a gap while somebody went out to start a machine.",
      existing:
        "Grid supply with two diesel generators as the working power source, switched by hand.",
      needs: [
        "The whole house through the evening peak, not just the lights",
        "Air conditioning in the bedrooms overnight",
        "Fridges and freezers with no interruption at changeover",
        "Silence — the generators to become an emergency-only backup",
      ],
      installed: [
        "Solar array mounted on a purpose-built carport structure over the forecourt",
        "Hybrid inverter and lithium battery bank in a dedicated plant room",
        "Automatic changeover between solar, battery, grid and generator",
      ],
      install:
        "The array is carried on a steel carport built over the parking forecourt rather than the roof — it shades the cars, keeps the panels reachable for cleaning, and avoided touching the roof covering. The crew set the structure, mounted and cabled the array, and commissioned the plant room in one continuous visit.",
      after:
        "The generators now sit as emergency backup and are started a handful of times a year rather than every evening. The house runs silently through the changeover, and the fuel run is no longer anybody's job.",
    },
    gallery: [
      {
        src: "/projects/ikoyi-residence/01.jpg",
        alt: "Kayglo crew fitting solar panels onto the carport array at the Ikoyi family residence.",
        width: 2048,
        height: 1536,
      },
      {
        src: "/projects/ikoyi-residence/02.jpg",
        alt: "The steel carport frame going up in the compound before the panels are laid.",
        width: 2048,
        height: 1536,
      },
      {
        src: "/projects/ikoyi-residence/03.jpg",
        alt: "Inverter, changeover panel and stacked battery rack in the glazed plant room.",
        width: 1536,
        height: 2048,
      },
    ],
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
    study: {
      // TODO — verify these details against your own job notes before launch.
      before:
        "A corporate head office carrying its entire working day on diesel whenever the grid failed, which was most days.",
      problem:
        "Generator fuel had become one of the largest controllable costs in the building, and every outage put a gap in the working day while systems came back up. For a business selling professional hours, that gap is the product.",
      existing:
        "Grid supply with a diesel generator carrying the working day and no storage of any kind.",
      needs: [
        "Workstations, servers and networking with no interruption",
        "Lighting and selected cooling across the working floors",
        "CCTV and access control at all hours",
        "A measurable reduction in diesel spend, not a vague one",
      ],
      installed: [
        "Rooftop solar array laid across the building's metal roof on weather-sealed rails",
        "Hybrid inverter with a wall-mounted lithium battery bank",
        "Protected distribution board with surge protection on the PV and grid sides",
      ],
      install:
        "The array was set out row by row across the roof sheets, clamped to purpose-made rails rather than drilled through the covering, and cabled back to a plant wall carrying the inverter, batteries and a new protected board. Work was staged so trading floors were never without power.",
      after:
        "Solar and storage now carry the working day, with the grid and a single generator held as fallback rather than run as the primary source. The diesel bill dropped immediately and the day no longer stops when the grid does.",
    },
    gallery: [
      {
        src: "/projects/maitama-office/01.jpg",
        alt: "A Kayglo installer torquing down a rooftop panel array above the office complex.",
        width: 1536,
        height: 2048,
      },
      {
        src: "/projects/maitama-office/02.jpg",
        alt: "Setting out the first rows of panels across the building's metal roof.",
        width: 1536,
        height: 2048,
      },
      {
        src: "/projects/maitama-office/03.jpg",
        alt: "The finished rooftop array, clamped and cabled, with a Kayglo hard hat resting on it.",
        width: 1536,
        height: 2048,
      },
      {
        src: "/projects/maitama-office/04.jpg",
        alt: "Wall-mounted hybrid inverter, distribution board and lithium battery bank.",
        width: 1536,
        height: 2048,
      },
    ],
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
    study: {
      // TODO — verify these details against your own job notes before launch.
      before:
        "A modern Lekki home where the owners wanted power to be a non-event — no changeover, no noise, no thinking about it.",
      problem:
        "The generator was reliable enough, but it announced every outage: the drop, the pause, the start-up, then the drone for the rest of the evening. In a house designed around quiet, it was the loudest thing in it.",
      existing:
        "Grid supply with a generator started manually at each outage.",
      needs: [
        "Round-the-clock power with an unnoticeable changeover",
        "Air conditioning and refrigeration carried through the night",
        "Enough storage to ride out a bad grid week",
        "A system nobody in the house has to operate",
      ],
      installed: [
        "Solar array on a steel canopy over the parking court",
        "Hybrid inverters and a lithium battery bank in a dedicated plant room",
        "Automatic changeover with grid and generator as fallback",
      ],
      install:
        "The canopy structure was set first, then the array mounted and cabled back to the plant room, where the inverter wall and battery bank were built out and commissioned. Cable runs were kept in trunking and the board relabelled so a future engineer can read the system at a glance.",
      after:
        "The home now runs 24/7 on solar and storage. The changeover happens in milliseconds and nobody in the house notices it — which was the entire brief.",
    },
    gallery: [
      {
        src: "/projects/lekki-smart-home/01.jpg",
        alt: "Completed solar carport shading the parking court, seen from an upper floor.",
        width: 1536,
        height: 2048,
      },
      {
        src: "/projects/lekki-smart-home/02.jpg",
        alt: "Inverter wall and lithium battery bank feeding the property's changeover panel.",
        width: 1536,
        height: 2048,
      },
    ],
  },
  {
    slug: "surulere-residence",
    name: "Surulere Family Home",
    location: "Surulere, Lagos",
    system: "10 kW solar · 20 kWh storage",
    summary:
      "A busy family home on a tight urban plot, tired of fuel queues and a generator that woke the whole street. We built the array over the outbuilding roof and put the inverters and batteries in a dedicated plant room.",
    metrics: [
      { label: "Generator use", value: "−92%" },
      { label: "Monthly saving", value: "₦380k" },
      { label: "Payback", value: "3.6 yrs" },
    ],
    hue: "#2f5343",
    study: {
      // TODO — verify these details against your own job notes before launch.
      before:
        "A busy family home on a tight urban plot, hemmed in by neighbours, with a generator that woke the whole street.",
      problem:
        "Fuel queues, a machine that ran most evenings, and no roof space where the obvious answer would fit. The plot made a straightforward rooftop install impossible.",
      existing:
        "Grid supply with a petrol generator run through the evening peak.",
      needs: [
        "Lighting, fans and entertainment through the evening",
        "Refrigeration overnight",
        "Enough headroom to add cooling later",
        "An end to the generator noise in a dense residential street",
      ],
      installed: [
        "Solar array laid across the outbuilding roof beside the main house",
        "Twin hybrid inverters with a lithium battery bank in a dedicated plant room",
        "New changeover panel wired into the existing house board",
      ],
      install:
        "With no usable roof on the main house, the array went onto the outbuilding — panels hoisted up from the balcony by hand, one at a time, and set out across the flat roof. The plant room was built out with twin inverters and batteries, then tied into the house board through a new changeover panel.",
      after:
        "The generator now sits idle for weeks at a time. The array is sized with headroom, so cooling can be added later without replacing the inverters or the battery bank.",
    },
    gallery: [
      {
        src: "/projects/surulere-residence/01.jpg",
        alt: "The Kayglo crew hoisting a panel up to the roof from the balcony below.",
        width: 960,
        height: 1280,
      },
      {
        src: "/projects/surulere-residence/02.jpg",
        alt: "The completed array laid out across the outbuilding roof beside the main house.",
        width: 1152,
        height: 864,
      },
    ],
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
  { href: "/solutions/residential", label: "Homes" },
  { href: "/solutions/business", label: "Business" },
  { href: "/services", label: "Services" },
  { href: "/financing", label: "Pricing" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About" },
];

export type PowerPackage = {
  slug: string;
  name: string;
  /** Who the tier is for — homes or business. */
  audience: string;
  tagline: string;
  /** Relative size of the system, 1–4. Drives the little load meter. */
  level: number;
  /** Heading above the list, e.g. "Keeps running" or "Adds". */
  listLabel: string;
  /** Named when a tier builds on the one before it. */
  builtOn?: string;
  covers: string[];
};

/**
 * Solution tiers, not equipment lists. Customers shouldn't have to become
 * solar engineers to buy — they pick the loads they need to keep alive, and
 * the power audit decides the kVA and kWh behind it.
 */
export const packages: PowerPackage[] = [
  {
    slug: "essential",
    name: "Essential",
    audience: "For homes",
    tagline:
      "The things you notice the second they go off — lights, fans, the router, phones on charge.",
    level: 1,
    listLabel: "Keeps running",
    covers: [
      "Lighting",
      "Fans",
      "TV",
      "WiFi",
      "Phones",
      "Small appliances",
    ],
  },
  {
    slug: "comfort",
    name: "Comfort",
    audience: "For homes",
    tagline:
      "The whole home carries on: food stays cold, and the rooms you use stay cool.",
    level: 2,
    listLabel: "Adds",
    builtOn: "Essential",
    covers: ["Refrigeration & freezers", "Selected AC loads"],
  },
  {
    slug: "business",
    name: "Business",
    audience: "For business",
    tagline:
      "The office keeps working through the outage — no restart, no lost hour, no generator.",
    level: 3,
    listLabel: "Keeps running",
    covers: [
      "Office equipment",
      "Networking",
      "CCTV",
      "Computers",
      "Printers",
      "Lighting",
      "Selected cooling",
    ],
  },
  {
    slug: "business-plus",
    name: "Business Plus",
    audience: "For business",
    tagline:
      "Heavier loads, longer backup, and a system you can see, measure, and grow.",
    level: 4,
    listLabel: "Adds",
    builtOn: "Business",
    covers: [
      "Higher loads",
      "Longer backup",
      "Solar generation",
      "Energy monitoring",
      "Scalable battery storage",
    ],
  },
];

/**
 * Generator sizes for the cost calculator, with a starting estimate for what
 * each costs to keep alive per month — servicing, oil, filters and the repairs
 * that come with them.
 *
 * NOTE: the servicing figures are  // TODO  placeholders. Replace them with
 * your own field experience — you know these numbers better than any average
 * does. Visitors can edit the figure themselves, so it is only a starting point.
 */
export const generatorSizes = [
  { kva: "2.5 kVA", servicing: 8_000 },
  { kva: "5 kVA", servicing: 12_000 },
  { kva: "7.5 kVA", servicing: 18_000 },
  { kva: "10 kVA", servicing: 25_000 },
  { kva: "15 kVA", servicing: 35_000 },
  { kva: "20 kVA", servicing: 45_000 },
  { kva: "30 kVA", servicing: 60_000 },
  { kva: "60 kVA", servicing: 100_000 },
  { kva: "100 kVA and above", servicing: 150_000 },
];

export type Segment = {
  slug: string;
  /** Short label for navigation and cards. */
  name: string;
  /** Who this page is written for, in one line. */
  audience: string;
  kicker: string;
  headline: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  /** Where these customers tend to be — used as a plain-language service list. */
  areas?: string[];
  /** The situation they are actually living with, in their words. */
  pains: { title: string; body: string }[];
  /** What the system has to carry. */
  keeps: string[];
  /**
   * For business segments: the specific trade, and the single argument that
   * matters to it. A pharmacy and a barbershop do not buy for the same reason.
   */
  trades?: { type: string; argument: string }[];
  /** Package slugs that usually fit this segment. */
  packages: string[];
  /** Project slugs to show as proof. */
  proof: string[];
  faqs: { q: string; a: string }[];
};

/**
 * Audience landing pages. Search ads and social campaigns point here rather
 * than at the homepage — someone searching "solar for my restaurant" should
 * land on a page about restaurants, not a page about us.
 */
export const segments: Segment[] = [
  {
    slug: "residential",
    name: "Homes",
    audience: "For homes and families",
    kicker: "Residential solar",
    headline: "Reliable electricity for your home, without depending on your generator.",
    intro:
      "No more listening for the grid to go. No more sending someone out for fuel at 9pm. The lights stay on, the fridge stays cold, the ACs keep running, and the house stays quiet — because the changeover happens without anyone noticing.",
    metaTitle: "Home Solar & Inverter Systems",
    metaDescription:
      "Silent, round-the-clock power for Nigerian homes. Kayglo Citadel designs, supplies and installs genuine solar and battery systems — so your home simply has power, day and night. Free power assessment.",
    areas: [
      "Lekki",
      "Ikoyi",
      "Victoria Island",
      "Ajah",
      "Chevron",
      "Osapa",
      "Yaba",
      "Surulere",
      "Ikeja",
      "Gbagada",
      "Magodo",
      "Maitama & Abuja",
    ],
    pains: [
      {
        title: "The generator runs your evenings",
        body: "It goes on at dusk and off at bedtime, and everything in between happens over the noise of it. The fuel bill is now a fixed monthly cost you never agreed to.",
      },
      {
        title: "Nobody sleeps through a changeover",
        body: "The grid drops, the house goes dark, someone goes downstairs. Every night. A properly designed system switches over in milliseconds and nobody wakes up.",
      },
      {
        title: "You've already bought equipment that died",
        body: "A battery that lasted eight months. An inverter that trips under load. Nigeria's market is full of counterfeits, and the price of the cheap option is buying it twice.",
      },
    ],
    keeps: [
      "Lighting throughout the house",
      "Fans and air conditioning",
      "Fridges and freezers",
      "WiFi, TV and entertainment",
      "Water pump and borehole",
      "Security lighting and CCTV",
    ],
    packages: ["essential", "comfort"],
    proof: ["ikoyi-residence", "lekki-smart-home", "surulere-residence"],
    faqs: [
      {
        q: "Can solar really run my air conditioners?",
        a: "Yes — but it has to be designed for it. ACs are the heaviest load in most homes, and a system sized for lights and fans will trip the moment one starts. That is exactly what the power assessment establishes: which ACs, how many hours, and what that means for the inverter and battery. Then we size for it honestly, rather than selling you a system that disappoints in week one.",
      },
      {
        q: "Do I have to get rid of my generator?",
        a: "Not on day one. Most of our residential clients keep the generator as a rarely-used backup and simply stop running it — from every evening, to a handful of times a year. Once you have lived with the system through a rainy season, plenty of people sell the generator.",
      },
      {
        q: "Will it work through the rainy season?",
        a: "This is where sizing matters most. We design around your worst week, not your best — enough panel area and enough storage that a run of overcast days does not leave you in the dark. If your site cannot support that, we will tell you before you spend anything.",
      },
      {
        q: "How long does the installation take?",
        a: "Most homes are a two to four day job on site, once the equipment is on the ground. We work in one visit rather than dragging it out, and we leave the cabling, mounting and distribution board tidy — you can judge a lot about an installer from what the inverter wall looks like when they leave.",
      },
    ],
  },
  {
    slug: "business",
    name: "Business & SME",
    audience: "For shops, offices, clinics and small businesses",
    kicker: "Business solar",
    headline: "Keep your business running when the grid goes off.",
    intro:
      "An outage is not an inconvenience for a business — it is lost stock, lost hours, lost customers and a diesel bill that eats the margin. We design systems around the equipment that must never stop, so trading carries on whether or not the grid does.",
    metaTitle: "Solar for Business & SMEs",
    metaDescription:
      "Stop losing hours, stock and diesel money to outages. Kayglo Citadel designs and installs solar and battery systems for Nigerian shops, offices, clinics, salons and small businesses. Free power assessment.",
    pains: [
      {
        title: "Diesel is now a line item you can't control",
        body: "The price moves, the queue costs a staff member half a day, and none of it produces anything. It is the one large cost in the business with no asset at the end of it.",
      },
      {
        title: "Every outage costs you twice",
        body: "Once in lost trading, once in the restart — systems rebooting, stock at risk, staff standing around, customers walking out to somewhere with lights on.",
      },
      {
        title: "The generator is a single point of failure",
        body: "When it will not start on a Monday morning, the business does not open. A battery system has no starting motor, no fuel and no warm-up.",
      },
    ],
    keeps: [
      "POS terminals and card machines",
      "Refrigeration and cold storage",
      "Computers, servers and networking",
      "CCTV and access control",
      "Lighting and selected cooling",
      "Printers and workshop equipment",
    ],
    trades: [
      {
        type: "Restaurants & bars",
        argument: "Refrigeration and POS never go down, so service never stops and stock never spoils.",
      },
      {
        type: "Pharmacies",
        argument: "Temperature-sensitive stock stays inside its range through every outage — no losses, no compliance risk.",
      },
      {
        type: "Clinics & labs",
        argument: "Power that does not interrupt a procedure, a fridge of vaccines, or a piece of diagnostic equipment mid-run.",
      },
      {
        type: "Salons & barbershops",
        argument: "Dryers, clippers and ACs running all day — and clients who can hear the conversation instead of the generator.",
      },
      {
        type: "Hotels & short-lets",
        argument: "Guests who never hear a changeover, and reviews that stop mentioning the power.",
      },
      {
        type: "Supermarkets & cold rooms",
        argument: "An unbroken cold chain, and freezer stock that survives a bad grid week.",
      },
      {
        type: "Offices & professional firms",
        argument: "The team keeps working through outages instead of waiting for the generator to warm up.",
      },
      {
        type: "Schools",
        argument: "Classes, labs and admin that carry on, without the noise or fumes of a generator near the classrooms.",
      },
      {
        type: "Churches",
        argument: "Sound, lighting and cooling that hold up through a full service, without a generator behind the building.",
      },
      {
        type: "Laundries & printing",
        argument: "Machines that finish the job they started — no half-done loads or ruined print runs.",
      },
      {
        type: "Cyber cafés & tech",
        argument: "Uninterrupted workstations and networking, with clean power that protects the equipment itself.",
      },
      {
        type: "Small factories & workshops",
        argument: "Production hours that no longer depend on when the diesel arrives.",
      },
    ],
    packages: ["business", "business-plus"],
    proof: ["maitama-office", "surulere-residence"],
    faqs: [
      {
        q: "How do I know it will pay for itself?",
        a: "Start from what you already spend. Add a year of diesel, servicing, oil and repairs, then compare it with a system sized to displace most of that. For businesses running a generator daily, the ongoing cost usually dwarfs the one-time cost of solar. Our generator cost check does that arithmetic with your own numbers in about a minute.",
      },
      {
        q: "Can we start small and grow?",
        a: "Yes, and for most businesses that is the sensible route. We design the system so storage and panel capacity can be added later without replacing what you have already bought — which means the first phase can be sized to your current budget rather than your eventual need.",
      },
      {
        q: "Do you work outside business hours?",
        a: "Where the work would interrupt trading, yes. Restaurants, clinics and retail usually need the noisy and disruptive parts done outside opening hours, and we plan the installation around that rather than around our own convenience.",
      },
      {
        q: "What happens if something fails while we're trading?",
        a: "You call us and we come. Every system is backed by scheduled servicing and fault response, and the design keeps the grid and, if you still have one, the generator available as fallback — so a fault is an inconvenience rather than a shutdown.",
      },
    ],
  },
  {
    slug: "commercial",
    name: "Commercial",
    audience: "For larger buildings, estates and industrial sites",
    kicker: "Commercial solar",
    headline: "Displace the diesel. Keep the operation running.",
    intro:
      "For office complexes, estates, hotels, cold stores and light industry, power is an operating cost with a spreadsheet behind it. We engineer commercial solar and storage around your load profile and uptime requirement, then show you the payback before you commit.",
    metaTitle: "Commercial & Industrial Solar",
    metaDescription:
      "Commercial-grade solar and storage for Nigerian offices, estates, hotels and light industry. Displace diesel spend, protect uptime, and see the payback before you commit. Kayglo Citadel.",
    pains: [
      {
        title: "Diesel spend that scales with your success",
        body: "The busier you are, the more you burn. Energy becomes the cost that grows fastest and returns least, and it is almost never on anyone's improvement list.",
      },
      {
        title: "Uptime you have to guarantee to someone else",
        body: "Tenants, guests, patients, a production line. When power is part of what you sell, the backup strategy is not an internal matter.",
      },
      {
        title: "No visibility into where the energy goes",
        body: "Without monitoring, nobody can say which loads are expensive, which are wasteful, or whether last month was better or worse. Metering turns arguments into numbers.",
      },
    ],
    keeps: [
      "Whole-building lighting and small power",
      "HVAC and selected heavy cooling",
      "Lifts, pumps and plant",
      "Servers, networking and security",
      "Cold storage and process equipment",
      "Metering and remote monitoring",
    ],
    packages: ["business-plus"],
    proof: ["maitama-office", "lekki-smart-home"],
    faqs: [
      {
        q: "Can solar carry our whole load?",
        a: "Sometimes, but that is rarely the right question. For most commercial sites the economics are strongest when solar and storage carry the working day and the predictable base load, with the grid and a single backup generator covering the extremes. We model that split rather than selling you the largest possible system.",
      },
      {
        q: "How do you handle a site that's still growing?",
        a: "We design in phases with headroom — inverter capacity, cable sizing and mounting planned for the eventual system, even when only the first phase is installed. Adding capacity later then costs what it should, rather than requiring a rebuild.",
      },
      {
        q: "What does the assessment involve for a commercial site?",
        a: "More than a form. We review your bills and generator logs, look at the load profile across a working week, survey the roof or ground area and the electrical room, then come back with a sized design, a cost, and the payback arithmetic. That work is free and there is no obligation attached to it.",
      },
      {
        q: "Do you provide monitoring and maintenance contracts?",
        a: "Yes. Commercial systems are specified with monitoring as standard, and we offer scheduled maintenance covering performance checks, battery health, inverter servicing and cleaning. An unmonitored commercial array quietly under-performs for months before anyone notices.",
      },
    ],
  },
];
