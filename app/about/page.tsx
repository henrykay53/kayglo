import type { Metadata } from "next";
import { RayBurst } from "@/components/Brand";
import { Credentials } from "@/components/Credentials";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { Container, Kicker } from "@/components/ui";
import { PhotoCta } from "@/components/Sections";
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

      {/* -------------------------------- STORY ------------------------------- */}
      <section className="py-16 md:py-24">
        <Container className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
          <Reveal className="md:col-span-7">
            <Kicker>Our story</Kicker>
            <h2 className="font-display mt-5 text-3xl text-ink md:text-4xl">
              Why Kayglo Citadel exists.
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate">
              <p>
                If you live in Nigeria, you know the routine: the lights go, the
                generator roars, and another jerry can of fuel disappears. Maybe
                you&apos;ve bought an inverter or battery that failed within a
                year. We&apos;ve lived that same frustration — it&apos;s why we
                started.
              </p>
              <p>
                So we do things differently: we listen first, supply only genuine
                equipment, size every system honestly — and we stay. Servicing,
                repairs, advice: we answer the phone long after the lights come
                on.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} className="md:col-span-5">
            <Photo
              photo={aboutPhotos.story}
              sizes="(min-width: 1152px) 430px, (min-width: 768px) 38vw, 92vw"
              className="aspect-[4/5]"
            />
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------ PROMISES ------------------------------ */}
      {/* Four promises, not four steps — so no numbers. Same dark card style
          as the trade cards on the Business page. */}
      <section className="bg-ink py-16 text-cream md:py-24">
        <Container>
          <Reveal>
            <Kicker className="text-accent-300">What we stand for</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 max-w-2xl text-3xl md:text-4xl">
              Four promises we keep.
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 70}>
                <div className="h-full rounded-2xl border border-cream/10 bg-cream/[0.03] p-6 md:p-7">
                  <h3 className="font-display text-xl">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-cream/60">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
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

      <PhotoCta
        title="Let's solve it together."
        body="Start with a free power assessment — an engineer sizes the system to what you actually run, with no obligation to buy."
      />
    </>
  );
}
