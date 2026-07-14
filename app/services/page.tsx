import type { Metadata } from "next";
import { RayBurst } from "@/components/Brand";
import { Reveal } from "@/components/Reveal";
import { Button, Container, Kicker } from "@/components/ui";
import { processSteps, services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Solar Products, Installation & After-Sales",
  description:
    "Genuine solar panels, inverters, and batteries, plus expert home and commercial installation and dependable after-sales servicing across Nigeria — from Kayglo Citadel.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="grain relative overflow-hidden border-b border-ink/10">
        <RayBurst className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 text-gold/10" />
        <Container className="relative py-20 md:py-28">
          <Reveal>
            <Kicker>Services</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Your one true source for reliable power.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg text-slate">
              From genuine products to installation, servicing, and after-sales —
              everything you need under one roof, from one team you can build a
              relationship with. No middlemen, no finger-pointing, no
              disappearing act.
            </p>
          </Reveal>
        </Container>
      </section>

      {services.map((s, i) => (
        <section
          key={s.slug}
          id={s.slug}
          className={`scroll-mt-24 ${i % 2 === 1 ? "bg-cream-200/50" : ""}`}
        >
          <Container className="grid gap-10 py-16 md:grid-cols-12 md:gap-12 md:py-24">
            <div className="md:col-span-5">
              <Reveal>
                <span className="font-display text-6xl text-sand">
                  0{i + 1}
                </span>
                <h2 className="font-display mt-4 text-3xl text-ink md:text-4xl">
                  {s.title}
                </h2>
                <p className="mt-4 text-lg text-slate">{s.detail}</p>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={100}>
                <ul className="space-y-4">
                  {s.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-4 border-b border-ink/10 pb-4"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1 text-gold"
                      >
                        ✦
                      </span>
                      <span className="text-ink">{point}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>
      ))}

      {/* Process recap */}
      <section className="bg-ink text-cream">
        <Container className="py-20 md:py-28">
          <Reveal>
            <Kicker className="text-gold-300">The process</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 max-w-2xl text-4xl md:text-5xl">
              What working with us looks like
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal key={step.n} delay={i * 80}>
                <span className="font-display text-4xl text-gold-300">
                  {step.n}
                </span>
                <h3 className="font-display mt-3 text-xl">{step.title}</h3>
                <p className="mt-2 text-cream/60">{step.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div className="mt-14">
              <Button href="/contact" variant="gold">
                Get a free quote
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 text-center">
        <Container>
          <Reveal>
            <p className="font-display text-2xl text-ink md:text-3xl">
              Not sure where to start? Call us at{" "}
              <a
                href={`tel:${site.contact.phoneHref}`}
                className="text-gold underline-offset-4 hover:underline"
              >
                {site.contact.phone}
              </a>
              .
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
