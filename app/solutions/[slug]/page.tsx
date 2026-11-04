import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LoadIcon } from "@/components/LoadIcon";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { FaqList, PhotoCta } from "@/components/Sections";
import { TradeIcon } from "@/components/TradeIcon";
import { Button, CallButton, Container, Kicker } from "@/components/ui";
import {
  packages,
  projects,
  segments,
  site,
  type ProjectCase,
  type ProjectPhoto,
  type Segment,
} from "@/lib/site";

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
      // A real installation photo — this is what shows when the page is
      // shared on WhatsApp, Instagram or Facebook.
      images: [
        {
          url: segment.hero.src,
          width: segment.hero.width,
          height: segment.hero.height,
          alt: segment.hero.alt,
        },
      ],
    },
  };
}

type Block = "pains" | "trades" | "keeps" | "work" | "packages" | "proof" | "faq";

/**
 * Each audience reads in its own order. A family starts from what stays on
 * and what a finished home looks like; a business starts from what outages
 * cost it and its own trade; a commercial site wants the engineering.
 */
const ORDER: Record<string, Block[]> = {
  residential: ["keeps", "work", "pains", "packages", "proof", "faq"],
  business: ["pains", "trades", "keeps", "work", "packages", "proof", "faq"],
  commercial: ["pains", "keeps", "work", "packages", "proof", "faq"],
};

/** The case study a photo comes from, read from its path. */
const projectOf = (photo: ProjectPhoto) =>
  projects.find((p) => photo.src.startsWith(`/projects/${p.slug}/`));

export default async function SegmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const segment = segments.find((s) => s.slug === slug);
  if (!segment) notFound();

  const tiers = packages.filter((p) => segment.packages.includes(p.slug));

  // Every photo already placed on this page, so the proof cards can each
  // take the first photo of their project that hasn't been shown yet.
  const used = new Set(
    [segment.hero, ...segment.heroSide, segment.plant, ...segment.work, segment.ctaPhoto].map(
      (p) => p.src,
    ),
  );
  const proof = segment.proof
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is ProjectCase => p !== undefined)
    .map((p) => {
      const photo = p.gallery.find((g) => !used.has(g.src)) ?? p.gallery[0];
      used.add(photo.src);
      return { project: p, photo };
    });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: segment.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const blocks: Record<Block, React.ReactNode> = {
    pains: <Pains key="pains" segment={segment} />,
    trades: segment.trades ? <Trades key="trades" segment={segment} /> : null,
    keeps: <Keeps key="keeps" segment={segment} />,
    work: <Work key="work" segment={segment} />,
    packages: <Packages key="packages" tiers={tiers} />,
    proof: <Proof key="proof" proof={proof} />,
    faq: <FaqList key="faq" faqs={segment.faqs} />,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero segment={segment} />
      {(ORDER[segment.slug] ?? ORDER.business).map((b) => blocks[b])}
      <PhotoCta
        photo={segment.ctaPhoto}
        title="Find out exactly what you need."
        body="Answer a few questions about what you run and what power costs you today. You'll get an estimated system size, the package that fits, an estimated cost, and a payment option — free."
        note={
          segment.areas &&
          `We install across ${segment.areas.join(", ")} — and nationwide.`
        }
      />
    </>
  );
}

/* -------------------------------- HERO --------------------------------- */
/* Three photos, not one: a tall portrait at exactly 3:4 beside two 4:3
   shots. The 17:12 frame with 9:8 columns gives those shapes, so nothing is
   cropped hard and no watermark is sliced. */
function Hero({ segment }: { segment: Segment }) {
  return (
    <section className="grain relative overflow-hidden border-b border-ink/10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-32 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
      </div>
      <Container className="grid items-center gap-10 py-12 md:grid-cols-12 md:gap-12 md:py-20">
        <div className="md:col-span-6">
          <Reveal>
            <Kicker>{segment.kicker}</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 text-4xl leading-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              {segment.headline}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
              {segment.intro}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex items-center gap-3">
              <Button href="/contact">Get a free power assessment</Button>
              <CallButton />
            </div>
            <p className="mt-5 text-sm text-mute">
              Not ready to talk?{" "}
              <Link
                href="/generator-cost"
                className="text-ink underline decoration-ink/30 underline-offset-4 hover:text-accent"
              >
                Work out what your generator really costs
              </Link>
              .
            </p>
          </Reveal>
        </div>

        {/* Not wrapped in Reveal: the tall photo is the LCP. */}
        <figure className="md:col-span-6">
          <div className="grid aspect-[17/12] grid-cols-[9fr_8fr] grid-rows-2 gap-3">
            <Photo
              photo={segment.hero}
              preload
              sizes="(min-width: 1152px) 290px, (min-width: 768px) 26vw, 50vw"
              className="row-span-2 h-full shadow-xl shadow-ink/10"
            />
            {segment.heroSide.map((p) => (
              <Photo
                key={p.src}
                photo={p}
                eager
                sizes="(min-width: 1152px) 260px, (min-width: 768px) 23vw, 45vw"
                className="h-full"
              />
            ))}
          </div>
          <figcaption className="mt-3 text-xs text-mute">
            Kayglo installations — every photo on this site is our own work.
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}

/* ------------------------------- PAINS ---------------------------------- */
function Pains({ segment }: { segment: Segment }) {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <Reveal>
          <Kicker>Sound familiar?</Kicker>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {segment.pains.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="h-full rounded-3xl border border-ink/10 bg-cream-200/50 p-6 md:p-7">
                <h2 className="font-display text-xl text-ink">{p.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------- TRADES --------------------------------- */
function Trades({ segment }: { segment: Segment }) {
  if (!segment.trades) return null;
  return (
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
        {/* Icon beside the name so a visitor can scan for their trade;
            the argument underneath is the one reason that trade buys. */}
        {/* Phones: two to a row, icon above — twelve full-width cards made
            a 2,300px column. From sm up: icon beside the name. */}
        <ul className="mt-12 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
          {segment.trades.map((t) => (
            <li
              key={t.type}
              className="flex flex-col gap-3 rounded-2xl border border-cream/10 bg-cream/[0.03] p-4 sm:flex-row sm:gap-4 sm:p-5 md:p-6"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-300/10 text-accent-300 ring-1 ring-inset ring-accent-300/20 sm:h-11 sm:w-11">
                <TradeIcon name={t.icon} />
              </span>
              <div>
                <h3 className="font-display text-base leading-snug text-cream sm:text-lg">
                  {t.type}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-cream/60 sm:text-sm">
                  {t.argument}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <Reveal delay={120}>
          <p className="mt-8 text-sm text-cream/50">
            Not listed? It only means we haven&apos;t written yours down — tell
            us what you run and we&apos;ll size for it.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------- KEEPS ---------------------------------- */
/* What stays on, as icon tiles beside the plant that carries it. */
function Keeps({ segment }: { segment: Segment }) {
  return (
    <section className="py-16 md:py-24">
      <Container className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <Reveal>
            <Kicker>What stays on</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 text-3xl text-ink md:text-4xl">
              Tell us what must never go off.
            </h2>
            <p className="mt-4 max-w-lg text-slate">
              The system is designed backwards from this — not from a kVA
              number on a price list.
            </p>
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {segment.keeps.map((k, i) => (
              <Reveal as="li" key={k.label} delay={i * 50}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-ink/10 bg-cream p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <LoadIcon name={k.icon} />
                  </span>
                  <span className="text-sm leading-snug text-ink">{k.label}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={120} className="md:col-span-5">
          <figure>
            <Photo
              photo={segment.plant}
              sizes="(min-width: 1152px) 430px, (min-width: 768px) 38vw, 92vw"
              className="aspect-[4/5]"
            />
            <figcaption className="mt-3 text-sm text-mute">
              {segment.plant.caption}
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------- WORK ---------------------------------- */
/* A strip of job photos. One from a case study links straight to it under
   the project's name; any other is captioned with its own title. */
function Work({ segment }: { segment: Segment }) {
  return (
    <section className="bg-cream-200/50 py-16 md:py-24">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <Kicker>Our work</Kicker>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display mt-5 text-3xl text-ink md:text-4xl">
                {segment.slug === "residential"
                  ? "Homes we've already taken off the generator."
                  : "Installed, cabled and commissioned by our own crew."}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <Link href="/projects" className="link-underline text-accent">
              All projects
            </Link>
          </Reveal>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {segment.work.map((photo, i) => {
            const project = projectOf(photo);
            const frame = (
              <Photo
                photo={photo}
                sizes="(min-width: 1152px) 270px, (min-width: 768px) 23vw, 46vw"
                className="aspect-[4/3]"
              />
            );
            return (
              <Reveal key={photo.src} delay={i * 60}>
                {project ? (
                  <Link href={`/projects/${project.slug}`} className="group block">
                    {frame}
                    <p className="mt-2 text-sm text-slate transition-colors group-hover:text-accent">
                      {project.name} →
                    </p>
                  </Link>
                ) : (
                  // Not from a case study: caption with the photo's own title
                  // (no link — there's no case study to open).
                  <>
                    {frame}
                    {photo.title && (
                      <p className="mt-2 text-sm text-slate">{photo.title}</p>
                    )}
                  </>
                )}
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------ PACKAGES -------------------------------- */
function Packages({ tiers }: { tiers: typeof packages }) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <Kicker>Where you&apos;ll probably land</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mt-5 max-w-2xl text-3xl text-ink md:text-4xl">
            The package that usually fits.
          </h2>
        </Reveal>
        <div className={`mt-10 grid gap-5 ${tiers.length > 1 ? "md:grid-cols-2" : "max-w-xl"}`}>
          {tiers.map((t, i) => (
            <Reveal key={t.slug} delay={i * 90}>
              <div className="flex h-full flex-col rounded-3xl border border-ink/10 bg-cream-200/40 p-7">
                <span className="kicker text-mute">{t.audience}</span>
                <h3 className="font-display mt-4 text-2xl text-ink">{t.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{t.tagline}</p>
                <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-mute">
                  {t.builtOn ? `Everything in ${t.builtOn}, plus` : t.listLabel}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {t.covers.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-ink/10 bg-cream px-3 py-1 text-xs text-slate"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <Link
            href="/financing#packages"
            className="link-underline mt-8 inline-block text-accent"
          >
            Compare all four packages and payment options
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------- PROOF --------------------------------- */
function Proof({
  proof,
}: {
  proof: { project: ProjectCase; photo: ProjectPhoto }[];
}) {
  if (proof.length === 0) return null;
  return (
    <section className="border-t border-ink/10 py-16 md:py-24">
      <Container>
        <Reveal>
          <Kicker>Proof</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mt-5 max-w-2xl text-3xl text-ink md:text-4xl">
            Systems we&apos;ve built for people like you.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {proof.map(({ project, photo }, i) => (
            <Reveal key={project.slug} delay={i * 90}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <Photo
                  photo={photo}
                  sizes="(min-width: 1152px) 360px, (min-width: 768px) 31vw, 92vw"
                  className="aspect-[4/3] transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-ink/10"
                />
                <p className="mt-4 text-sm text-mute">{project.location}</p>
                <h3 className="font-display mt-1 text-xl text-ink transition-colors group-hover:text-accent">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-accent">{project.system}</p>
                <span className="mt-3 inline-block text-sm text-ink underline decoration-ink/25 underline-offset-4 group-hover:text-accent">
                  Read the case study
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
