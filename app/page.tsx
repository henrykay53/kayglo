import Image from "next/image";
import Link from "next/link";
import { RayBurst } from "@/components/Brand";
import { PowerMap } from "@/components/PowerMap";
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
          <div className="absolute -right-24 -top-24 h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -left-32 top-40 h-96 w-96 rounded-full bg-ever/10 blur-3xl" />
        </div>

        <Container className="relative grid items-center gap-14 pb-16 pt-16 md:grid-cols-12 md:gap-10 md:pb-24 md:pt-24">
          <div className="md:col-span-7 md:pr-6">
            <Reveal>
              <Kicker>Your power partner in Nigeria</Kicker>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-display mt-6 text-[2.7rem] font-medium leading-[1.02] text-ink sm:text-6xl md:text-[4.2rem]">
                End the blackouts.
                <br />
                Silence the
                <span className="text-accent"> generator.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate">
                We know the drone of the generator, the scramble for fuel, and
                the plans undone by &ldquo;up NEPA.&rdquo; Kayglo Citadel supplies
                genuine solar, inverters, and batteries — then installs and
                services them — so your home simply has power, day and night.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button href="/contact">Get a free quote</Button>
                <Button href="/projects" variant="outline">
                  View our work
                </Button>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <p className="mt-8 text-sm text-mute">
                Genuine products. Expert installation. After-sales you can trust
                — for homes and businesses nationwide.
              </p>
            </Reveal>
          </div>

          <PowerMap className="mx-auto w-full max-w-md md:col-span-5 md:mx-0 md:w-auto md:max-w-none md:-mr-6 lg:-mr-16" />
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
            <Kicker>Why Kayglo</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <p className="font-display mt-6 max-w-4xl text-3xl leading-snug text-ink sm:text-4xl md:text-[2.9rem]">
              We&apos;re Nigerians too. We know what it means to plan your day
              around the grid, to feed a hungry generator, to buy equipment that
              dies in months. We built Kayglo to be the one partner you can
              trust to solve it — for good.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <Link
              href="/about"
              className="link-underline mt-8 inline-block text-accent"
            >
              Our story
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
                <Kicker className="text-accent-300">What we do</Kicker>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="font-display mt-5 text-4xl text-cream md:text-5xl">
                  Everything you need for reliable power
                </h2>
              </Reveal>
            </div>
            <Reveal delay={140}>
              <p className="max-w-sm text-cream/60">
                Genuine panels, inverters, and batteries — supplied, installed,
                and serviced by one team that stays with you long after the
                lights come on.
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
                  <span className="font-display text-sm text-accent-300">
                    0{i + 1}
                  </span>
                  <h3 className="font-display mt-4 text-2xl text-cream">
                    {s.title}
                  </h3>
                  <p className="mt-3 flex-1 text-cream/60">{s.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-accent-300 transition-transform duration-300 group-hover:translate-x-1">
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
        <RayBurst className="pointer-events-none absolute -left-24 top-10 h-80 w-80 text-accent/10" />
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

      {/* ========================= GENERATOR COST ======================== */}
      <section className="border-y border-ink/10 bg-ever text-cream">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-12 md:py-20">
          <Reveal className="md:col-span-7">
            <Kicker className="text-accent-300">The real cost</Kicker>
            <h2 className="font-display mt-5 text-3xl leading-tight md:text-4xl">
              How much is your generator really costing you?
            </h2>
            <p className="mt-5 max-w-lg text-cream/70">
              Fuel, servicing, oil, repairs — most people never add up the year.
              Put your numbers in and see the figure you&apos;re already
              spending, before you spend a naira with us.
            </p>
          </Reveal>
          <Reveal delay={120} className="md:col-span-5 md:justify-self-end">
            <Button href="/generator-cost" variant="light">
              Work out my generator cost
            </Button>
            <p className="mt-4 text-sm text-cream/50">
              Takes about a minute. No details required.
            </p>
          </Reveal>
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
            {projects.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <Link
                  href={`/projects#${p.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/10"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={p.gallery[0].src}
                      alt={p.gallery[0].alt}
                      fill
                      sizes="(min-width: 768px) 30vw, 92vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
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
                          <p className="font-display text-lg text-accent">
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
                  <div className="text-accent" aria-hidden="true">
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
            <RayBurst className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-accent-300/20" />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl">
                Let&apos;s solve your power problem.
              </h2>
              <p className="mt-5 text-lg text-cream/70">
                Tell us what you&apos;re dealing with — the blackouts, the
                generator, the bills. We&apos;ll recommend exactly what you need,
                nothing you don&apos;t, and stand by it long after.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button href="/contact">Get a free quote</Button>
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
