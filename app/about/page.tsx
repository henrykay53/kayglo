import type { Metadata } from "next";
import { RayBurst } from "@/components/Brand";
import { Credentials } from "@/components/Credentials";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { Button, Container, Kicker } from "@/components/ui";
import { aboutPhotos, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Kayglo Citadel",
  description:
    "Kayglo Citadel is a Nigerian solar company built by people who live the same power struggles you do — genuine products, honest advice, and after-sales support that treats you like family.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${site.name}`,
    url: "/about",
    images: [
      {
        url: aboutPhotos.crew[0].src,
        width: aboutPhotos.crew[0].width,
        height: aboutPhotos.crew[0].height,
        alt: aboutPhotos.crew[0].alt,
      },
    ],
  },
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
          <Reveal delay={140}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate">
              A Lagos solar company that supplies genuine equipment, installs it
              with our own crew, and keeps servicing it long after — one team
              from the first conversation onwards.
            </p>
          </Reveal>

          {/* The crew, at work. Who you are actually letting into the building. */}
          {/* Columns 3:5:3 give the landscape shot its own shape between two
              4:5 portraits, so nothing is cropped hard. */}
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-[3fr_5fr_3fr] md:gap-4">
            {aboutPhotos.crew.map((photo, i) => (
              <Photo
                key={photo.src}
                photo={photo}
                preload={i === 0}
                sizes={
                  i === 0
                    ? "(min-width: 1152px) 470px, (min-width: 768px) 42vw, 92vw"
                    : "(min-width: 1152px) 280px, (min-width: 768px) 26vw, 46vw"
                }
                className={
                  i === 0
                    ? "col-span-2 aspect-[4/3] md:order-2 md:col-span-1 md:aspect-auto"
                    : `aspect-[4/5] ${i === 1 ? "md:order-1" : "md:order-3"}`
                }
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-mute">
            Our crew on site. Every photo here is a Kayglo job.
          </p>
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
            <Photo
              photo={aboutPhotos.story}
              sizes="(min-width: 1152px) 360px, (min-width: 768px) 32vw, 92vw"
              className="aspect-[4/5]"
            />
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

      {/* ------------------------- WORKMANSHIP ------------------------- */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <Kicker>Judge us on the details</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 max-w-2xl text-3xl text-ink md:text-4xl">
              You can tell a lot about an installer from what they leave
              behind.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {aboutPhotos.workmanship.map((w, i) => (
              <Reveal key={w.title} delay={i * 90}>
                <figure>
                  <Photo
                    photo={w.photo}
                    sizes="(min-width: 1152px) 360px, (min-width: 768px) 30vw, 92vw"
                    className="aspect-[4/5]"
                  />
                  <figcaption>
                    <h3 className="font-display mt-6 text-xl text-ink">
                      {w.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-slate">{w.body}</p>
                  </figcaption>
                </figure>
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
              Start with a free power assessment — an engineer sizes the system
              to what you actually run, with no obligation to buy.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
              <Button href="/contact">Get a free power assessment</Button>
              <a
                href={`tel:${site.contact.phoneHref}`}
                className="link-underline inline-block text-accent"
              >
                Or call {site.contact.phone}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
