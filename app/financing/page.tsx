import type { Metadata } from "next";
import { RayBurst } from "@/components/Brand";
import { Reveal } from "@/components/Reveal";
import { Button, Container, Kicker } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Solar Financing & Incentives",
  description:
    "Understand your options for paying for solar — cash, solar loans, and the federal tax credit and local incentives that lower your net cost. Transparent, no-pressure guidance from Kayglo.",
  alternates: { canonical: "/financing" },
};

// Edit these to reflect current programs and your own terms.
const options = [
  {
    name: "Cash purchase",
    tagline: "The lowest lifetime cost",
    body: "Own your system outright from day one. You capture every incentive directly and see the fastest payback — typically the strongest long-term return.",
    points: ["Highest lifetime savings", "You claim all incentives", "Adds value to your home"],
  },
  {
    name: "Solar loan",
    tagline: "Own it, spread the cost",
    body: "Finance the system with little or nothing down and own it just as you would with cash. Many homeowners choose a loan whose payment is at or below their old utility bill.",
    points: ["Little to no money down", "You still own the system & incentives", "Fixed, predictable payments"],
  },
  {
    name: "Guidance, not a sales quota",
    tagline: "The right fit for you",
    body: "We don't push a single financing product. We'll walk through the real numbers of each path against your goals and tax situation so you choose with clear eyes.",
    points: ["No pressure, no gimmicks", "Numbers specific to your home", "Honest trade-offs"],
  },
];

const faqs = [
  {
    q: "What is the federal solar tax credit?",
    a: "The federal residential clean energy credit lets eligible homeowners claim a percentage of their solar (and battery) system cost against their federal taxes. Because it depends on your tax liability and current law, we'll always point you to a tax professional for your specific situation.",
  },
  {
    q: "Are there state or local incentives too?",
    a: "Often, yes — many states, utilities, and municipalities offer additional rebates, credits, or performance incentives that stack on top of the federal credit. Available programs change over time and vary by location, so we confirm what applies to your address as part of your proposal.",
  },
  {
    q: "How long until solar pays for itself?",
    a: "Payback depends on your system size, your utility rates, and how you pay. For many of the homes we work with it lands in the range of six to eight years, after which the energy is effectively free for the remaining decades of the system's life. Your proposal will show a payback specific to your home.",
  },
  {
    q: "Does solar add value to my home?",
    a: "Owned solar systems are generally viewed as a home improvement that can increase resale value, particularly when installed cleanly and backed by a transferable warranty. Leased systems are more complicated at sale, which is one reason we favor ownership.",
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
        <RayBurst className="pointer-events-none absolute -right-24 -top-16 h-80 w-80 text-gold/10" />
        <Container className="relative py-20 md:py-28">
          <Reveal>
            <Kicker>Financing &amp; incentives</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Solar should pay for itself. We&apos;ll show you how.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg text-slate">
              Between ownership options and available incentives, most homeowners
              are surprised how attainable a premium system is. Here&apos;s the
              honest picture.
            </p>
          </Reveal>
        </Container>
      </section>

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
                  <span className="kicker text-gold">{o.tagline}</span>
                  <h3 className="font-display mt-3 text-2xl text-ink">
                    {o.name}
                  </h3>
                  <p className="mt-3 flex-1 text-slate">{o.body}</p>
                  <ul className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm">
                    {o.points.map((p) => (
                      <li key={p} className="flex gap-3 text-ink">
                        <span aria-hidden="true" className="text-gold">
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

      {/* Incentives band */}
      <section className="bg-ever text-cream">
        <Container className="py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal>
              <Kicker className="text-gold-300">The biggest lever</Kicker>
              <h2 className="font-display mt-5 text-3xl md:text-4xl">
                Incentives can meaningfully cut your net cost
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-lg text-cream/75">
                The federal clean energy credit is the largest for most
                homeowners, and state or utility programs often stack on top.
                Because these depend on your tax situation and change over time,
                we verify exactly what applies to your address — and we&apos;ll
                always steer you to a tax professional rather than make promises
                we can&apos;t keep.
              </p>
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
              Financing, answered
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
            This page is general information, not tax or financial advice. Figures
            vary by home, usage, and current programs.
          </p>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="grain relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center text-cream md:px-16 md:py-20">
            <h2 className="font-display text-3xl md:text-4xl">
              See your numbers.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-cream/70">
              We&apos;ll prepare a transparent proposal with your system size,
              net cost after incentives, and projected payback.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact">Request a consultation</Button>
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
