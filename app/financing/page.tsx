import type { Metadata } from "next";
import { RayBurst } from "@/components/Brand";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { Checklist, FaqList, PhotoCta } from "@/components/Sections";
import { Tiers } from "@/components/Tiers";
import { Button, Container, Kicker } from "@/components/ui";
import { pagePhotos, projects } from "@/lib/site";

export const metadata: Metadata = {
  title: "Payment Plans & Value",
  description:
    "Reliable solar power, within reach. Outright purchase or flexible payment plans, plus the honest math on how solar pays for itself against what you spend on fuel and generator servicing.",
  alternates: { canonical: "/financing" },
};

// The two real ways to pay. Edit these to reflect your own terms.
const options = [
  {
    name: "Outright purchase",
    tagline: "Best overall value",
    body: "Pay once and own the system fully from day one — the lowest total cost, and the fastest way to stop spending on fuel.",
    points: [
      "Lowest total cost of ownership",
      "You own everything outright",
      "No payments after handover",
    ],
  },
  {
    name: "Staged & instalment plans",
    tagline: "Spread the cost",
    body: "Reliable power shouldn't wait on one big payment. Spread it across the installation, or over an agreed period, and start saving on fuel sooner.",
    points: [
      "Staged payments across the installation",
      "Instalments over an agreed period",
      "Plans worked out around your budget",
    ],
  },
];

const faqs = [
  {
    q: "How much does a solar system cost?",
    a: "It depends on how much power you need — the appliances you want to run and for how long. Rather than quote a one-size-fits-all figure, we assess your usage and give you an honest, itemised quote for a system sized to your home or business.",
  },
  {
    q: "Can I pay in instalments?",
    a: "Yes. A full system is a significant investment, so we offer staged and instalment options over an agreed period. Tell us your budget and we'll work out a plan that fits.",
  },
  {
    q: "How soon does it pay for itself?",
    a: "Start from what you spend today on petrol or diesel, plus generator servicing and repairs. Once solar takes over, most of that spending stops. How quickly that covers the system depends on your own numbers — our generator cost check works it out with them in about a minute.",
  },
  {
    q: "How long will the equipment last?",
    a: "Because we only supply genuine, warranty-backed equipment, it lasts. Quality lithium batteries are rated for thousands of charge cycles, and solar panels are built to perform for two decades or more. Cheap, counterfeit gear is exactly what we help you avoid.",
  },
  {
    q: "What happens after installation?",
    a: "That's where a lot of companies vanish — and where we're different. Every system comes with after-sales support: scheduled servicing, quick repairs, and a team that answers when you call.",
  },
];

/** What replaces the generator — beside "the real math". */
const plantPhoto = {
  ...projects.find((p) => p.slug === "lekki-smart-home")!.gallery[1],
  alt: "A plant room with four wall-mounted inverters above a bank of batteries.",
};

export default function FinancingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="grain relative overflow-hidden border-b border-ink/10">
        <RayBurst className="pointer-events-none absolute -right-24 -top-16 h-80 w-80 text-accent/10" />
        <Container className="relative py-20 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7">
          <Reveal>
            <Kicker>Payment &amp; value</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Reliable power, within reach.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg text-slate">
              A quality solar system is an investment — but between flexible
              payment plans and the money you&apos;ll stop spending on fuel, it&apos;s
              more attainable than most people expect. Here&apos;s the honest
              picture.
            </p>
          </Reveal>
            </div>
            <figure className="md:col-span-5">
              <Photo
                photo={pagePhotos.pricing}
                preload
                sizes="(min-width: 1152px) 440px, (min-width: 768px) 40vw, 92vw"
                className="aspect-[4/3] shadow-2xl shadow-ink/15 md:aspect-[4/5]"
              />
            </figure>
          </div>
        </Container>
      </section>

      {/* Packages */}
      <Tiers />

      {/* ----------------------------- WAYS TO PAY ---------------------------- */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <Kicker>Ways to pay</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 max-w-2xl text-3xl text-ink md:text-4xl">
              All at once, or in stages.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {options.map((o, i) => (
              <Reveal key={o.name} delay={i * 90}>
                <div className="flex h-full flex-col rounded-3xl border border-ink/10 bg-cream-200/40 p-7 md:p-8">
                  <span className="kicker text-accent">{o.tagline}</span>
                  <h3 className="font-display mt-3 text-2xl text-ink">{o.name}</h3>
                  <p className="mt-3 text-slate">{o.body}</p>
                  <Checklist
                    items={o.points}
                    className="mt-6 border-t border-ink/10 pt-5 text-sm"
                  />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <p className="mt-6 text-sm text-slate">
              Either way, every quote is itemised and sized to what you
              actually need — no overselling, no hidden charges.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------- THE REAL MATH --------------------------- */}
      <section className="bg-ever text-cream">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-12 md:gap-12 md:py-24">
          <div className="md:col-span-7">
            <Reveal>
              <Kicker className="text-accent-300">The real math</Kicker>
              <h2 className="font-display mt-5 text-3xl md:text-4xl">
                Your generator is the expensive option.
              </h2>
              <p className="mt-5 max-w-xl text-lg text-cream/75">
                Add up a year of petrol or diesel, servicing, oil changes, and
                the repairs when the generator finally gives out. For most homes
                and businesses, that ongoing cost quietly dwarfs the price of a
                solar system — and it buys you nothing you own.
              </p>
              <div className="mt-8">
                <Button href="/generator-cost" variant="light">
                  Work out what yours costs
                </Button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={120} className="md:col-span-5">
            <figure>
              <Photo
                photo={plantPhoto}
                sizes="(min-width: 1152px) 430px, (min-width: 768px) 38vw, 92vw"
                className="aspect-[4/5] border-cream/10"
              />
              <figcaption className="mt-3 text-sm text-cream/60">
                What replaces it: inverters and a battery bank you own outright.
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      {/* --------------------------------- FAQ -------------------------------- */}
      <FaqList
        faqs={faqs}
        kicker="Common questions"
        title="Your questions, answered honestly."
        note="This page is general guidance. Exact prices, plans and payback depend on your needs — ask us for a quote tailored to you."
      />

      <PhotoCta
        title="Get a free quote."
        body="Tell us what you need to power. We'll size it honestly, show you the payment options, and put real numbers next to what your generator costs you today."
      />
    </>
  );
}
