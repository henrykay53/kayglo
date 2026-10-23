import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Analytics } from "@/components/Analytics";
import { AttributionTracker } from "@/components/AttributionTracker";
import { ContactTracker } from "@/components/ContactTracker";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { heroGallery, presenceCities, presenceStates, site } from "@/lib/site";
import { nigeriaStates } from "@/lib/nigeria-map";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.legalName,
  keywords: [
    "solar installation Nigeria",
    "solar inverter",
    "inverter battery",
    "solar panels Nigeria",
    "home solar system",
    "commercial solar",
    "genuine solar products",
    "solar company Lagos",
    "after-sales solar service",
    ...site.areasServed.map((a) => `solar ${a}`),
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.legalName,
    title: `${site.legalName} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.legalName} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "Solar Energy",
};

function StructuredData() {
  const { contact } = site;
  const json = {
    "@context": "https://schema.org",
    // "SolarInstallation" is not a schema.org type, so Google could not
    // classify the business. Electrician covers the installation and
    // servicing; Store covers the equipment sales.
    "@type": ["Electrician", "Store"],
    "@id": `${site.url}/#business`,
    name: site.legalName,
    description: site.description,
    url: site.url,
    telephone: contact.phone,
    email: contact.email,
    priceRange: "₦₦₦",
    // Real installation photography, not the generated text card.
    image: heroGallery.map((p) => `${site.url}${p.src}`),
    logo: `${site.url}/icon.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.locality,
      addressRegion: contact.address.region,
      addressCountry: contact.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: contact.geo.lat,
      longitude: contact.geo.lng,
    },
    areaServed: [
      { "@type": "Country", name: "Nigeria" },
      ...nigeriaStates
        .filter((s) => presenceStates.includes(s.id))
        .map((s) => ({ "@type": "State", name: s.name })),
      // Named cities within those states, e.g. Uyo in Akwa Ibom.
      ...Object.values(presenceCities)
        .flat()
        .map((name) => ({ "@type": "City", name })),
    ],
    openingHours: "Mo-Fr 08:00-18:00",
    // Only profiles confirmed as Kayglo's. Add LinkedIn, Facebook and the
    // Google Business Profile URL here once each one is live and verified.
    sameAs: [site.social.instagram],
    // Only ever published when real, countable reviews exist — see site.reviews
    ...(site.reviews
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(site.reviews.value),
            reviewCount: String(site.reviews.count),
          },
        }
      : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen antialiased">
        <StructuredData />
        <ScrollToTop />
        <AttributionTracker />
        <ContactTracker />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2 focus:text-sm focus:text-cream"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}
