import type { Metadata } from "next";
import { PanelArt } from "@/components/Brand";
import { Reveal } from "@/components/Reveal";
import { Button, Container, Kicker } from "@/components/ui";
import { projects } from "@/lib/site";

export const metadata: Metadata = {
  title: "Solar Projects & Case Studies",
  description:
    "A selection of Kayglo residential solar and battery installations — from cliffside modern homes to off-grid-capable vineyard estates. See the systems, savings, and results.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <Container className="py-20 md:py-28">
          <Reveal>
            <Kicker>Selected work</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Systems as considered as the homes they power.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg text-slate">
              Every project is engineered from scratch. Here are a few we&apos;re
              proud of — with the real numbers behind them.
            </p>
          </Reveal>
        </Container>
      </section>

      {projects.map((p, i) => (
        <section
          key={p.slug}
          id={p.slug}
          className={`scroll-mt-24 ${i % 2 === 1 ? "bg-cream-200/50" : ""}`}
        >
          <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:py-24">
            <Reveal className={i % 2 === 1 ? "md:order-2" : ""}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink/10 shadow-xl shadow-ink/10">
                <PanelArt className="absolute inset-0 h-full w-full" cols={8} rows={6} />
                <div
                  className="absolute inset-0 opacity-55 mix-blend-multiply"
                  style={{ background: p.hue }}
                />
              </div>
            </Reveal>
            <Reveal delay={100} className={i % 2 === 1 ? "md:order-1" : ""}>
              <p className="text-sm text-mute">{p.location}</p>
              <h2 className="font-display mt-1 text-3xl text-ink md:text-4xl">
                {p.name}
              </h2>
              <p className="mt-3 font-medium text-gold">{p.system}</p>
              <p className="mt-5 text-lg text-slate">{p.summary}</p>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-ink/10 pt-6">
                {p.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="text-xs text-mute">{m.label}</dt>
                    <dd className="font-display mt-1 text-2xl text-ink">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </Container>
        </section>
      ))}

      <section className="bg-ink py-20 text-center text-cream md:py-28">
        <Container>
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl">
              Your home could be next.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-cream/70">
              Tell us about your home and we&apos;ll show you exactly what it
              could produce.
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
