import type { Metadata } from "next";
import { RayBurst } from "@/components/Brand";
import { Credentials } from "@/components/Credentials";
import { Reveal } from "@/components/Reveal";
import { Button, Container, Kicker } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Kayglo Citadel",
  description:
    "Kayglo Citadel is a Nigerian solar company built by people who live the same power struggles you do — genuine products, honest advice, and after-sales support that treats you like family.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "We live it too",
    body: "We're Nigerians dealing with the same blackouts and fuel queues. We don't sell you theory — we solve a problem we understand personally.",
  },
  {
    title: "Genuine, always",
    body: "In a market flooded with fakes, we supply only authentic, warranty-backed equipment. Your system is built to last, not to fail after the rains.",
  },
  {
    title: "Honest advice, fair price",
    body: "We recommend only what your home or business truly needs. No inflated systems, no pressure — just the right solution for your budget.",
  },
  {
    title: "Here for the long run",
    body: "The sale is the start of the relationship, not the end. Servicing, repairs, advice — we pick up when you call, for years to come.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="grain relative overflow-hidden border-b border-ink/10">
        <RayBurst className="pointer-events-none absolute -left-24 -top-16 h-80 w-80 text-accent/10" />
        <Container className="relative py-20 md:py-28">
          <Reveal>
            <Kicker>Who we are</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-4xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Real people who understand your power struggle — because we live it
              too.
            </h1>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-7 md:col-start-1">
            <div className="space-y-6 text-lg leading-relaxed text-slate">
              <p>
                If you live in Nigeria, you know the routine: the lights go, the
                generator roars, and another jerry can of fuel disappears. You&apos;ve
                probably bought an inverter or battery that promised the world
                and failed within a year. We&apos;ve lived that same frustration
                — and it&apos;s exactly why Kayglo Citadel exists.
              </p>
              <p>
                We&apos;re not a faceless company. We&apos;re real people who
                understand what dependable power means for your family, your
                comfort, and your business — and we take it personally. So we do
                things differently: we listen first, we supply only genuine
                equipment, and we size every system honestly.
              </p>
              <p>
                Most of all, we stay. Choosing Kayglo isn&apos;t buying a product
                and waving goodbye — it&apos;s gaining a partner who answers the
                phone, shows up to service your system, and grows with your
                needs. That&apos;s what being your one true source for power
                really means.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} className="md:col-span-4 md:col-start-9">
            <div className="rounded-2xl border border-ink/10 bg-cream-200/60 p-8">
              <dl className="space-y-6">
                {site.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="font-display text-3xl text-ink">
                      {s.value}
                    </dt>
                    <dd className="text-sm text-mute">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ink text-cream">
        <Container className="py-20 md:py-28">
          <Reveal>
            <Kicker className="text-accent-300">What we stand for</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 max-w-2xl text-4xl md:text-5xl">
              Four promises we keep
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className="h-full bg-ink p-8 md:p-10">
                  <span className="font-display text-sm text-accent-300">
                    0{i + 1}
                  </span>
                  <h3 className="font-display mt-3 text-2xl">{v.title}</h3>
                  <p className="mt-3 text-cream/60">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Credentials />

      <section className="py-20 text-center md:py-28">
        <Container>
          <Reveal>
            <h2 className="font-display text-4xl text-ink md:text-5xl">
              Let&apos;s solve it together.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-slate">
              Real people, real support — wherever you are in Nigeria.
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="/contact">Talk to us</Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
