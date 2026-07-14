import type { Metadata } from "next";
import { RayBurst } from "@/components/Brand";
import { Reveal } from "@/components/Reveal";
import { Button, Container, Kicker } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Kayglo",
  description:
    "Kayglo is a premium solar company built on in-house engineering, meticulous installation, and lifetime accountability. Meet the standard behind every system.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Right-sized, never oversold",
    body: "We only recommend the system your home actually needs. If a smaller array is the honest answer, that's the one you'll get.",
  },
  {
    title: "Engineered in-house",
    body: "Structural and electrical engineering happen under our own roof — not outsourced to the lowest bidder. Accountability stays with us.",
  },
  {
    title: "Installed like it's ours",
    body: "Concealed conduit, all-black hardware, meticulous cleanup. Craftsmanship you'd expect from a fine builder, not a solar crew.",
  },
  {
    title: "Accountable for 25 years",
    body: "A workmanship warranty means nothing without a team that answers the phone. Ours does — for the life of the system.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="grain relative overflow-hidden border-b border-ink/10">
        <RayBurst className="pointer-events-none absolute -left-24 -top-16 h-80 w-80 text-gold/10" />
        <Container className="relative py-20 md:py-28">
          <Reveal>
            <Kicker>About Kayglo</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-4xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              We started Kayglo because good solar shouldn&apos;t be rare.
            </h1>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-7 md:col-start-1">
            <div className="space-y-6 text-lg leading-relaxed text-slate">
              <p>
                Too many homeowners get the same story: a hard sell, a rushed
                install, and a company that disappears the moment the panels are
                on the roof. We thought the highest end of the market deserved
                better — and so did the planet.
              </p>
              <p>
                Kayglo brings the discipline of fine homebuilding to solar. We
                treat every roof as a design problem, every install as a
                craftsman&apos;s job, and every client as someone we&apos;ll
                still be answering to in twenty years.
              </p>
              <p>
                The result is solar you don&apos;t have to think about — quiet,
                clean, and producing for decades. That&apos;s the whole idea.
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
            <Kicker className="text-gold-300">What we stand for</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 max-w-2xl text-4xl md:text-5xl">
              Four commitments we don&apos;t bend on
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className="h-full bg-ink p-8 md:p-10">
                  <span className="font-display text-sm text-gold-300">
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

      <section className="py-20 text-center md:py-28">
        <Container>
          <Reveal>
            <h2 className="font-display text-4xl text-ink md:text-5xl">
              Come see the difference.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-slate">
              Serving {site.areasServed.join(", ")}.
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="/contact">Request a consultation</Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
