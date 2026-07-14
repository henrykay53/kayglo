import Link from "next/link";
import { PanelArt, RayBurst } from "@/components/Brand";
import { Reveal } from "@/components/Reveal";
import { Button, Container, Kicker } from "@/components/ui";
import {
  processSteps,
  projects,
  services,
  site,
  testimonials,
} from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* ============================== HERO ============================== */}
      <section className="grain relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-24 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute -left-32 top-40 h-96 w-96 rounded-full bg-ever/10 blur-3xl" />
        </div>

        <Container className="relative grid gap-12 pb-16 pt-16 md:grid-cols-12 md:gap-8 md:pb-24 md:pt-24">
          <div className="md:col-span-7 md:pr-6">
            <Reveal>
              <Kicker>Premium residential solar</Kicker>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-display mt-6 text-[2.7rem] font-medium leading-[1.02] text-ink sm:text-6xl md:text-[4.2rem]">
                Power your home
                <br />
                with quiet
                <span className="text-gold"> confidence.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate">
                Kayglo designs and installs solar and battery systems that look
                as considered as the homes they sit on — engineered in-house,
                installed with obsessive care, and backed for 25 years.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button href="/contact">Request a consultation</Button>
                <Button href="/projects" variant="outline">
                  View our work
                </Button>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <p className="mt-8 text-sm text-mute">
                Serving {site.areasServed.slice(0, 3).join(", ")} &amp; beyond.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <Reveal delay={200} className="h-full">
              <div className="relative h-72 overflow-hidden rounded-3xl border border-ink/10 shadow-2xl shadow-ink/10 sm:h-96 md:h-full">
                <PanelArt className="absolute inset-0 h-full w-full" cols={7} rows={5} />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-6 pt-16">
                  <p className="font-display text-xl text-cream">
                    Hillside Residence
                  </p>
                  <p className="text-sm text-cream/70">
                    14.2 kW · 104% offset · Sausalito
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>

        {/* Stat bar */}
        <div className="border-y border-ink/10 bg-cream-200/50">
          <Container>
            <dl className="grid grid-cols-2 divide-ink/10 py-8 md:grid-cols-4 md:divide-x">
              {site.stats.map((s, i) => (
                <Reveal
                  key={s.label}
                  delay={i * 80}
                  className="px-2 py-3 text-center md:px-6"
                >
                  <dt className="font-display text-3xl font-medium text-ink md:text-4xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-sm text-mute">{s.label}</dd>
                </Reveal>
              ))}
            </dl>
          </Container>
        </div>
      </section>

      {/* ============================ MANIFESTO =========================== */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <Kicker>Our standard</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <p className="font-display mt-6 max-w-4xl text-3xl leading-snug text-ink sm:text-4xl md:text-[2.9rem]">
              Most solar is sold on price. We build it like architecture —
              sized to your life, hidden where it should be, and finished to a
              standard you&apos;ll be glad you insisted on.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <Link
              href="/about"
              className="link-underline mt-8 inline-block text-gold"
            >
              The Kayglo approach
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* ============================ SERVICES =========================== */}
      <section className="bg-ink text-cream">
        <Container className="py-20 md:py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <Kicker className="text-gold-300">What we do</Kicker>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="font-display mt-5 text-4xl text-cream md:text-5xl">
                  A complete home energy system
                </h2>
              </Reveal>
            </div>
            <Reveal delay={140}>
              <p className="max-w-sm text-cream/60">
                Panels, storage, and charging designed to work as one — by a
                single team that owns the result end to end.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60}>
                <Link
                  href={`/services#${s.slug}`}
                  className="group flex h-full flex-col bg-ink p-8 transition-colors duration-300 hover:bg-ink-800 md:p-10"
                >
                  <span className="font-display text-sm text-gold-300">
                    0{i + 1}
                  </span>
                  <h3 className="font-display mt-4 text-2xl text-cream">
                    {s.title}
                  </h3>
                  <p className="mt-3 flex-1 text-cream/60">{s.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-gold-300 transition-transform duration-300 group-hover:translate-x-1">
                    Learn more →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================= PROCESS =========================== */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <RayBurst className="pointer-events-none absolute -left-24 top-10 h-80 w-80 text-gold/10" />
        <Container className="relative">
          <Reveal>
            <Kicker>How it works</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 max-w-2xl text-4xl text-ink md:text-5xl">
              Four steps, one dedicated team
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal key={step.n} delay={i * 80}>
                <div className="relative">
                  <span className="font-display text-5xl text-sand">
                    {step.n}
                  </span>
                  <h3 className="font-display mt-4 text-xl text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-slate">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================ PROJECTS =========================== */}
      <section className="bg-cream-200/50 py-20 md:py-28">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <Kicker>Selected work</Kicker>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="font-display mt-5 text-4xl text-ink md:text-5xl">
                  Homes we&apos;ve powered
                </h2>
              </Reveal>
            </div>
            <Reveal delay={140}>
              <Button href="/projects" variant="ghost">
                All projects
              </Button>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <Link
                  href={`/projects#${p.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/10"
                >
                  <div className="relative h-52 overflow-hidden">
                    <PanelArt className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
                    <div
                      className="absolute inset-0 opacity-60 mix-blend-multiply"
                      style={{ background: p.hue }}
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-mute">{p.location}</p>
                    <h3 className="font-display mt-1 text-xl text-ink">
                      {p.name}
                    </h3>
                    <p className="mt-3 text-sm text-slate">{p.system}</p>
                    <div className="mt-4 flex gap-5 border-t border-ink/10 pt-4">
                      {p.metrics.slice(0, 2).map((m) => (
                        <div key={m.label}>
                          <p className="font-display text-lg text-gold">
                            {m.value}
                          </p>
                          <p className="text-xs text-mute">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================== TESTIMONIALS ========================= */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <Kicker>In their words</Kicker>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.author} delay={i * 90}>
                <figure className="flex h-full flex-col rounded-2xl border border-ink/10 bg-cream p-8">
                  <div className="text-gold" aria-hidden="true">
                    ★★★★★
                  </div>
                  <blockquote className="font-display mt-5 flex-1 text-lg leading-snug text-ink">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="font-medium text-ink">{t.author}</span>
                    <span className="text-mute"> · {t.location}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="pb-24">
        <Container>
          <div className="grain relative overflow-hidden rounded-3xl bg-ever px-8 py-16 text-cream md:px-16 md:py-20">
            <RayBurst className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-gold-300/20" />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl">
                Let&apos;s design your system.
              </h2>
              <p className="mt-5 text-lg text-cream/70">
                A no-pressure consultation and a photo-accurate proposal —
                usually within a week. See exactly what your home could produce.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button href="/contact">Request a consultation</Button>
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-cream hover:text-ink"
                >
                  Call {site.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
