import type { Metadata } from "next";
import { GeneratorCalculator } from "@/components/GeneratorCalculator";
import { Reveal } from "@/components/Reveal";
import { Button, Container, Kicker } from "@/components/ui";

export const metadata: Metadata = {
  title: "How much is your generator really costing you?",
  description:
    "Add up the fuel, servicing, oil and repairs your generator eats every year — then see what that money could buy instead. Free generator-to-solar cost check from Kayglo Citadel.",
  alternates: { canonical: "/generator-cost" },
  openGraph: {
    title: "How much is your generator really costing you?",
    description:
      "Fuel, servicing, oil, repairs — the real yearly cost of running a generator in Nigeria, and what it could buy instead.",
    url: "/generator-cost",
  },
};

const hidden = [
  {
    title: "The fuel queue",
    body: "Hours spent buying diesel, and the jerry cans, drums and pumps that come with storing it.",
  },
  {
    title: "The downtime",
    body: "The morning it won't start. The orders you couldn't take. The staff standing around waiting.",
  },
  {
    title: "The machine itself",
    body: "A generator is a wearing part. Every hour it runs is depreciation on something you'll replace.",
  },
  {
    title: "The noise and fumes",
    body: "The drone through every conversation, every night's sleep, every neighbour's complaint.",
  },
];

export default function GeneratorCostPage() {
  return (
    <>
      <section className="grain relative overflow-hidden border-b border-ink/10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-32 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
        </div>
        <Container className="py-16 md:py-24">
          <Reveal>
            <Kicker>Generator cost check</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              How much is your generator really costing you?
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-lg text-slate">
              Most people know what a tank of fuel costs. Almost nobody adds up
              the year. Put your numbers in and see the figure you&apos;re
              already spending — then decide what it should be buying.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <GeneratorCalculator />
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-cream-200/40 py-16 md:py-24">
        <Container>
          <Reveal>
            <Kicker>What the number leaves out</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 max-w-2xl text-3xl text-ink md:text-4xl">
              The costs that never show up on a receipt.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {hidden.map((h, i) => (
              <Reveal key={h.title} delay={i * 80}>
                <h3 className="font-display text-xl text-ink">{h.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate">
                  {h.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-20 text-center text-cream md:py-28">
        <Container>
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl">
              Stop renting your electricity from a fuel pump.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-cream/70">
              Tell us what you need to keep running. We&apos;ll size the system,
              price it honestly, and show you how to pay for it.
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="/contact">Get a free power assessment</Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
