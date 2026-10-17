import Image from "next/image";
import Link from "next/link";
import { RayBurst } from "@/components/Brand";
import { PowerMap } from "@/components/PowerMap";
import { Reveal } from "@/components/Reveal";
import { Testimonials } from "@/components/Testimonials";
import { Button, Container, Kicker } from "@/components/ui";
import {
  processSteps,
  projects,
  promises,
  publishedStats,
  segments,
  services,
  site,
} from "@/lib/site";

export default function Home() {
  // Real numbers once two are evidenced; until then, what we promise on every job.
  const verified = publishedStats();
  const band = verified.length >= 2 ? verified : promises;

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
              {/* Phones: a full-width stack, primary on top, same height.
                  From sm up they sit side by side at their natural width. */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Button
                  href="/contact"
                  className="w-full sm:w-auto"
                >
                  Get a free quote
                </Button>
                <Button
                  href="/projects"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
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

        {/* Proof bar */}
        <div className="border-y border-ink/10 bg-cream-200/50">
          <Container>
            <dl className="grid grid-cols-2 divide-ink/10 py-8 md:grid-cols-4 md:divide-x">
              {band.map((s, i) => (
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

      {/* ============================ WHAT WE DO ========================== */}
      {/* Straight out of the hero into the offer: four services, each shown
          by a photo of that kind of work, one line each. */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <Kicker>What we do</Kicker>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="font-display mt-4 text-3xl text-ink md:text-4xl">
                  Supply, install, and service — all of it.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <Link href="/services" className="link-underline text-accent">
                All services
              </Link>
            </Reveal>
          </div>

          {/* Phones: a swipeable row with the next card peeking in, so four
              services cost one screen of scroll instead of four. The row
              bleeds to the screen edge; the page itself never scrolls sideways.
              Tablet and up: a plain grid. */}
          <div className="-mx-6 mt-10 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-9 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {services.map((s, i) => (
              <Reveal
                key={s.slug}
                delay={i * 70}
                className="h-full w-[78%] shrink-0 snap-start sm:w-auto"
              >
                <Link
                  href={`/services#${s.slug}`}
                  className="group flex h-full flex-col rounded-3xl focus-visible:outline-offset-4"
                >
                  {s.image && (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink/10 bg-cream-200">
                      <Image
                        src={s.image.src}
                        alt={s.image.alt}
                        fill
                        sizes="(min-width: 1024px) 260px, (min-width: 640px) 46vw, 78vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}
                  <h3 className="font-display mt-5 text-xl text-ink transition-colors group-hover:text-accent">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">
                    {s.short}
                  </p>
                  {/* mt-auto lines these up when a title runs to two lines */}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium text-accent">
                    Learn more
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Which page is mine? Answered in one glance. */}
          <Reveal delay={120}>
            <div className="mt-14 flex flex-col gap-3 rounded-3xl border border-ink/10 bg-cream-200/50 p-4 sm:flex-row sm:items-center sm:gap-2 sm:p-3">
              <p className="px-2 text-sm text-mute sm:pl-3 sm:pr-2">Solar for</p>
              {segments.map((seg) => (
                <Link
                  key={seg.slug}
                  href={`/solutions/${seg.slug}`}
                  className="group flex flex-1 items-center gap-3 rounded-2xl bg-cream px-3 py-2.5 transition-colors hover:bg-ink hover:text-cream"
                >
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={seg.hero.src}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </span>
                  <span className="text-sm font-medium">{seg.name}</span>
                  <span
                    aria-hidden="true"
                    className="ml-auto text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent-300"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ============================== OUR WORK ========================== */}
      {/* The proof, as photographs: every tile is a real job and opens its
          case study. Landscape shots take the wide tiles, portraits the
          narrow ones, so nothing is cropped beyond recognition. */}
      <section className="bg-cream-200/50 py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <Kicker>Our work</Kicker>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="font-display mt-4 text-3xl text-ink md:text-4xl">
                  Recent installations
                </h2>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <Link href="/projects" className="link-underline text-accent">
                All projects
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-4 md:auto-rows-[13rem] md:grid-cols-4">
            {projects.slice(0, 4).map((p, i) => {
              const wide = i === 0 || i === 3;
              const photo =
                p.gallery.find((g) => g.width > g.height === wide) ??
                p.gallery[0];
              return (
                <Reveal
                  key={p.slug}
                  delay={i * 80}
                  className={
                    i === 0
                      ? "md:col-span-2 md:row-span-2"
                      : i === 3
                        ? "md:col-span-2"
                        : ""
                  }
                >
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group relative block aspect-[4/3] h-full overflow-hidden rounded-3xl border border-ink/10 bg-cream-200 md:aspect-auto"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes={
                        wide
                          ? "(min-width: 768px) 544px, 92vw"
                          : "(min-width: 768px) 272px, 92vw"
                      }
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-5 pt-16">
                      <p className="kicker text-cream/70">{p.location}</p>
                      <p className="font-display mt-1 text-xl text-cream">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-sm text-cream/75">{p.system}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ============================= PROCESS =========================== */}
      <section className="py-16 md:py-20">
        <Container>
          <Reveal>
            <Kicker>How it works</Kicker>
          </Reveal>
          <ol className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 70} className="bg-cream p-6 md:p-7">
                <span className="font-display text-sm text-accent">{step.n}</span>
                <h3 className="font-display mt-3 text-lg text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm text-slate">{step.short}</p>
              </Reveal>
            ))}
          </ol>
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

      {/* ========================== TESTIMONIALS ========================= */}
      <Testimonials />

      {/* ============================== CTA ============================== */}
      {/* Top padding keeps this card apart from the green generator band. */}
      <section className="pb-24 pt-16 md:pt-24">
        <Container>
          <div className="grain relative overflow-hidden rounded-3xl bg-ever px-8 py-16 text-cream md:px-16 md:py-20">
            <RayBurst className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-accent-300/20" />
            <RayBurst className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 text-accent-300/10" />
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="font-display text-4xl md:text-5xl">
                Let&apos;s solve your power problem.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-cream/70">
                Tell us what you&apos;re dealing with — the blackouts, the
                generator, the bills. We&apos;ll recommend exactly what you need,
                nothing you don&apos;t, and stand by it long after.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
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
