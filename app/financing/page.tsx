import type { Metadata } from "next";
import { RayBurst } from "@/components/Brand";
import { Reveal } from "@/components/Reveal";
import { Tiers } from "@/components/Tiers";
import { Button, Container, Kicker } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Payment Plans & Value",
  description:
    "Reliable solar power, within reach. Outright purchase or flexible payment plans, plus the honest math on how solar pays for itself against what you spend on fuel and generator servicing.",
  alternates: { canonical: "/financing" },
};

// Edit these to reflect your own terms.
const options = [
  {
    name: "Outright purchase",
    tagline: "Best overall value",
    body: "Pay once and own your system fully from day one. It's the lowest total cost and the fastest way to stop bleeding money on fuel — most clients recover the cost within a few years.",
    points: [
      "Lowest total cost of ownership",
      "You own everything outright",
      "Fastest return on your money",
    ],
  },
  {
    name: "Flexible payment plans",
    tagline: "Spread the cost",
    body: "Reliable power shouldn't be out of reach because of one big payment. Ask us about staged and installment options that let you spread the cost over an agreed period, so you can start saving on fuel sooner.",
    points: [
      "Staged or installment payments",
      "Plans tailored to your budget",
      "Start saving on fuel from day one",
    ],
  },
  {
    name: "Honest guidance",
    tagline: "No overselling",
    body: "We never inflate a system to inflate a price. We size to what you truly need and give you a clear, itemised quote — so you know exactly what you're paying for and why.",
    points: [
      "Right-sized to your real needs",
      "Clear, itemised quotes",
      "No pressure, no hidden charges",
    ],
  },
];

const faqs = [
  {
    q: "How much does a solar system cost?",
    a: "It depends on how much power you need — the appliances you want to run and for how long. Rather than quote a one-size-fits-all figure, we assess your usage and give you an honest, itemised quote for a system sized to your home or business. Reach out and we'll prepare one for you.",
  },
  {
    q: "Can I pay in installments?",
    a: "Yes. We understand that a full system is a significant investment, so we offer flexible, staged payment options over an agreed period. Talk to us about your budget and we'll work out a plan that fits.",
  },
  {
    q: "How soon does it pay for itself?",
    a: "Look at what you currently spend on petrol or diesel, plus generator servicing and repairs — it adds up fast. Once solar takes over, that spending largely stops. Many of our clients recover their investment within a few years, after which their power is essentially free.",
  },
  {
    q: "How long will the equipment last?",
    a: "Because we only supply genuine, warranty-backed equipment, it lasts. Quality lithium batteries deliver thousands of charge cycles over many years, and solar panels are built to perform for two decades or more. Cheap, counterfeit gear is exactly what we help you avoid.",
  },
  {
    q: "What happens after installation?",
    a: "That's where a lot of companies vanish — and where we're different. Every system comes with dependable after-sales support: scheduled servicing, quick repairs, and a team that actually answers when you call. The sale is the start of the relationship, not the end.",
  },
];

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
        </Container>
      </section>

      {/* Solution tiers */}
      <Tiers />

      {/* Ways to pay */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Ways to pay
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {options.map((o, i) => (
              <Reveal key={o.name} delay={i * 90}>
                <div className="flex h-full flex-col rounded-2xl border border-ink/10 bg-cream p-8">
                  <span className="kicker text-accent">{o.tagline}</span>
                  <h3 className="font-display mt-3 text-2xl text-ink">
                    {o.name}
                  </h3>
                  <p className="mt-3 flex-1 text-slate">{o.body}</p>
                  <ul className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm">
                    {o.points.map((p) => (
                      <li key={p} className="flex gap-3 text-ink">
                        <span aria-hidden="true" className="text-accent">
                          ✦
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* The real math band */}
      <section className="bg-ever text-cream">
        <Container className="py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal>
              <Kicker className="text-accent-300">The real math</Kicker>
              <h2 className="font-display mt-5 text-3xl md:text-4xl">
                Your generator is the expensive option
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-lg text-cream/75">
                Add up a year of petrol or diesel, servicing, oil changes, and
                the repairs when the generator finally gives out. For most homes
                and businesses, that ongoing cost quietly dwarfs the price of a
                solar system. Solar simply moves that money from a bottomless
                pit into an asset that pays you back — quietly, and for years.
              </p>
              <div className="mt-7">
                <Button href="/generator-cost" variant="light">
                  Work out what yours costs
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <Kicker>Common questions</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 text-3xl text-ink md:text-4xl">
              Your questions, answered honestly
            </h2>
          </Reveal>
          <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <div className="py-7">
                  <dt className="font-display text-xl text-ink">{f.q}</dt>
                  <dd className="mt-3 leading-relaxed text-slate">{f.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
          <p className="mt-6 text-sm text-mute">
            This page is general guidance. Exact prices, plans, and payback
            depend on your specific needs — ask us for a quote tailored to you.
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="grain relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center text-cream md:px-16 md:py-20">
            <h2 className="font-display text-3xl md:text-4xl">
              Get a free quote.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-cream/70">
              Tell us what you need to power. We&apos;ll size it honestly, show
              you the payment options, and put real numbers next to what your
              generator is costing you today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact">Request a free quote</Button>
              <a
                href={`tel:${site.contact.phoneHref}`}
                className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-cream hover:text-ink"
              >
                Call {site.contact.phone}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
