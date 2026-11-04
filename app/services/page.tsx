import type { Metadata } from "next";
import { RayBurst } from "@/components/Brand";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { Button, Container, Kicker } from "@/components/ui";
import { processSteps, services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Solar Products, Installation & After-Sales",
  description:
    "Genuine solar panels, inverters, and batteries, plus expert home and commercial installation and dependable after-sales servicing across Nigeria — from Kayglo Citadel.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="grain relative overflow-hidden border-b border-ink/10">
        <RayBurst className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 text-accent/10" />
        <Container className="relative py-16 md:py-24">
          <Reveal>
            <Kicker>Services</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Your one true source for reliable power.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-lg text-slate">
              Genuine equipment, expert installation and servicing — from one
              team that stays with you long after the lights come on.
            </p>
          </Reveal>
          {/* Straight to the service you came for. */}
          <Reveal delay={200}>
            <nav aria-label="Services on this page" className="mt-9 flex flex-wrap gap-2">
              {services.map((s) => (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="rounded-full border border-ink/15 bg-cream px-4 py-2 text-sm text-slate transition-colors hover:border-ink hover:bg-ink hover:text-cream"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------- SERVICES ----------------------------
          One balanced row each: the photo on one side, everything about the
          service on the other, alternating sides so the page doesn't march.
          Phones: photo first, then the words. */}
      {services.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <section
            key={s.slug}
            id={s.slug}
            className={`scroll-mt-24 ${flip ? "bg-cream-200/50" : ""}`}
          >
            <Container className="grid items-center gap-8 py-14 md:grid-cols-2 md:gap-14 md:py-20">
              {s.image && (
                <Reveal className={flip ? "md:order-2" : ""}>
                  <Photo
                    photo={s.image}
                    sizes="(min-width: 1152px) 520px, (min-width: 768px) 46vw, 92vw"
                    className="aspect-[4/3]"
                  />
                </Reveal>
              )}
              <Reveal delay={80} className={flip ? "md:order-1" : ""}>
                <span className="font-display text-sm text-accent">0{i + 1}</span>
                <h2 className="font-display mt-2 text-3xl text-ink md:text-4xl">
                  {s.title}
                </h2>
                <p className="mt-4 leading-relaxed text-slate">{s.detail}</p>
                <ul className="mt-6 space-y-2.5 border-t border-ink/10 pt-6">
                  {s.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-ink">
                      <svg
                        viewBox="0 0 16 16"
                        className="mt-[5px] h-3.5 w-3.5 shrink-0 text-accent"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m3 8.5 3.2 3.2L13 5" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Container>
          </section>
        );
      })}

      {/* ----------------------------- PROCESS ---------------------------- */}
      <section className="bg-ink text-cream">
        <Container className="py-20 md:py-28">
          <Reveal>
            <Kicker className="text-accent-300">The process</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 max-w-2xl text-4xl md:text-5xl">
              What working with us looks like
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal key={step.n} delay={i * 80}>
                <span className="font-display text-4xl text-accent-300">
                  {step.n}
                </span>
                <h3 className="font-display mt-3 text-xl">{step.title}</h3>
                <p className="mt-2 text-cream/60">{step.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div className="mt-14">
              <Button href="/contact" variant="accent">
                Get a free quote
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
