import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { Button, Container, Kicker } from "@/components/ui";
import { ProjectStack } from "@/components/ProjectStack";
import { packages, projects, segments, site } from "@/lib/site";

export function generateStaticParams() {
  return segments.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const segment = segments.find((s) => s.slug === slug);
  if (!segment) return {};
  return {
    title: segment.metaTitle,
    description: segment.metaDescription,
    alternates: { canonical: `/solutions/${segment.slug}` },
    openGraph: {
      title: `${segment.metaTitle} · ${site.name}`,
      description: segment.metaDescription,
      url: `/solutions/${segment.slug}`,
    },
  };
}

export default async function SegmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const segment = segments.find((s) => s.slug === slug);
  if (!segment) notFound();

  const tiers = packages.filter((p) => segment.packages.includes(p.slug));
  const proof = projects.filter((p) => segment.proof.includes(p.slug));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: segment.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ------------------------------ HERO ------------------------------ */}
      <section className="grain relative overflow-hidden border-b border-ink/10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-32 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
        </div>
        <Container className="py-16 md:py-24">
          <Reveal>
            <Kicker>{segment.kicker}</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-4xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              {segment.headline}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate">
              {segment.intro}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button href="/contact">Get a free power assessment</Button>
              <Link
                href="/generator-cost"
                className="link-underline inline-block self-center text-accent"
              >
                Work out what your generator costs
              </Link>
            </div>
          </Reveal>

          {segment.areas && (
            <Reveal delay={260}>
              <div className="mt-12 border-t border-ink/10 pt-8">
                <p className="kicker text-mute">Where we install</p>
                <p className="mt-3 max-w-3xl text-slate">
                  {segment.areas.join(" · ")}
                  <span className="text-mute"> — and nationwide.</span>
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {/* ------------------------------ PAINS ----------------------------- */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <Kicker>What you&apos;re living with</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 max-w-2xl text-3xl text-ink md:text-4xl">
              We know the situation, because we&apos;re in it too.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {segment.pains.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <h3 className="font-display text-xl text-ink">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-slate">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------------------- TRADES ------------------------------ */}
      {segment.trades && (
        <section className="border-y border-ink/10 bg-ink py-16 text-cream md:py-24">
          <Container>
            <Reveal>
              <Kicker className="text-accent-300">By what you do</Kicker>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display mt-5 max-w-2xl text-3xl md:text-4xl">
                A pharmacy and a barbershop don&apos;t buy power for the same
                reason.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 max-w-xl text-cream/60">
                So we don&apos;t design for them the same way. Find your trade —
                the argument that matters to you is the one we build around.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-3">
              {segment.trades.map((t) => (
                <div key={t.type} className="bg-ink p-6 md:p-7">
                  <h3 className="font-display text-lg text-cream">{t.type}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-cream/60">
                    {t.argument}
                  </p>
                </div>
              ))}
            </div>
            <Reveal delay={120}>
              <p className="mt-8 text-sm text-cream/50">
                Not listed? It only means we haven&apos;t written yours down —
                tell us what you run and we&apos;ll size for it.
              </p>
            </Reveal>
          </Container>
        </section>
      )}

      {/* ----------------------------- KEEPS ------------------------------ */}
      <section className="py-16 md:py-24">
        <Container className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <Kicker>What stays on</Kicker>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display mt-5 text-3xl text-ink md:text-4xl">
                Tell us what must never go off.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 text-slate">
                The system is designed backwards from this list — not from a kVA
                number on a price list. The exact configuration comes out of
                your assessment.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={100}>
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {segment.keeps.map((k) => (
                  <li key={k} className="flex items-start gap-3 py-3.5">
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
                    <span className="text-slate">{k}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------- PACKAGES ---------------------------- */}
      <section className="border-t border-ink/10 bg-cream-200/40 py-16 md:py-24">
        <Container>
          <Reveal>
            <Kicker>Where you&apos;ll probably land</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 max-w-2xl text-3xl text-ink md:text-4xl">
              The package that usually fits.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {tiers.map((t, i) => (
              <Reveal key={t.slug} delay={i * 90}>
                <div className="flex h-full flex-col rounded-2xl border border-ink/10 bg-cream p-8">
                  <span className="kicker text-mute">{t.audience}</span>
                  <h3 className="font-display mt-5 text-2xl text-ink">
                    {t.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate">
                    {t.tagline}
                  </p>
                  <p className="mt-6 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-mute">
                    {t.builtOn ? `Everything in ${t.builtOn}, plus` : t.listLabel}
                  </p>
                  <ul className="mt-3 flex-1 space-y-2 text-sm text-slate">
                    {t.covers.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div className="mt-10">
              <Link
                href="/financing#packages"
                className="link-underline inline-block text-accent"
              >
                Compare all four packages and payment options
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------ PROOF ----------------------------- */}
      {proof.length > 0 && (
        <section className="py-16 md:py-24">
          <Container>
            <Reveal>
              <Kicker>Proof</Kicker>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display mt-5 max-w-2xl text-3xl text-ink md:text-4xl">
                Systems we&apos;ve built for people like you.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:gap-14">
              {proof.slice(0, 2).map((p, i) => (
                <Reveal key={p.slug} delay={i * 100}>
                  <ProjectStack
                    photos={p.gallery}
                    label={p.name}
                    sizes="(min-width: 768px) 44vw, 90vw"
                  />
                  <p className="mt-6 text-sm text-mute">{p.location}</p>
                  <h3 className="font-display mt-1 text-2xl text-ink">
                    {p.name}
                  </h3>
                  <p className="mt-2 font-medium text-accent">{p.system}</p>
                  <p className="mt-4 text-slate">{p.summary}</p>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="link-underline mt-5 inline-block text-accent"
                  >
                    Read the case study
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ------------------------------ FAQ ------------------------------- */}
      <section className="border-t border-ink/10 py-16 md:py-24">
        <Container>
          <Reveal>
            <Kicker>Straight answers</Kicker>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-14">
            {segment.faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 70}>
                <h3 className="font-display text-xl text-ink">{f.q}</h3>
                <p className="mt-3 leading-relaxed text-slate">{f.a}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------ CTA ------------------------------- */}
      <section className="bg-ink py-20 text-center text-cream md:py-28">
        <Container>
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl">
              Find out exactly what you need.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-cream/70">
              Answer a few questions about what you run and what power costs you
              today. You&apos;ll get an estimated system size, the package that
              fits, an estimated cost, and a payment option — free.
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
