import type { Metadata } from "next";
import { Suspense } from "react";
import { AssessmentForm } from "@/components/AssessmentForm";
import { Reveal } from "@/components/Reveal";
import { Container, Kicker } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Solar Power Assessment",
  description:
    "Find out exactly what solar system your home or business needs. Answer a few questions and Kayglo Citadel will send your estimated system size, recommended package, estimated cost, and payment option — free, with no obligation.",
  alternates: { canonical: "/contact" },
};

/** What the visitor gets back — the whole reason to fill the form in. */
const deliverables = [
  {
    n: "01",
    title: "Estimated system size",
    body: "The kVA of inverter and kWh of storage your real load actually calls for.",
  },
  {
    n: "02",
    title: "Recommended solution",
    body: "Which package fits — Essential, Comfort, Business, or Business Plus.",
  },
  {
    n: "03",
    title: "Estimated cost",
    body: "An honest range for that system, with nothing padded in to inflate it.",
  },
  {
    n: "04",
    title: "Payment option",
    body: "Outright or a staged plan — whichever gets you powered soonest.",
  },
];

export default function ContactPage() {
  const { contact } = site;
  const city = contact.address.city;

  return (
    <>
      <section className="grain relative overflow-hidden border-b border-ink/10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-32 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
        </div>
        <Container className="py-16 md:py-24">
          <Reveal>
            <Kicker>Free · no obligation</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Free {city} Solar Power Assessment
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-lg text-slate">
              Find out exactly what solar system your home or business needs.
              Answer a few questions about what you run and what power costs you
              today — an engineer does the rest.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 text-sm text-mute">
              Outside {city}? We assess, supply, and install nationwide.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 border-t border-ink/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {deliverables.map((d, i) => (
              <Reveal key={d.n} delay={i * 80}>
                <p className="font-display text-sm text-accent">{d.n}</p>
                <h2 className="font-display mt-3 text-xl text-ink">
                  {d.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {d.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <div className="rounded-3xl border border-ink/10 bg-cream-200/40 p-6 shadow-sm sm:p-9">
                <Suspense fallback={null}>
                  <AssessmentForm />
                </Suspense>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={120}>
              <h2 className="font-display text-2xl text-ink">
                Would rather just talk?
              </h2>
              <p className="mt-3 text-slate">
                Call or send a message — real people, no call centre, no hard
                sell.
              </p>

              <dl className="mt-8 space-y-6 border-t border-ink/10 pt-8">
                <div>
                  <dt className="kicker text-mute">Call</dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${contact.phoneHref}`}
                      className="font-display text-2xl text-ink hover:text-accent"
                    >
                      {contact.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="kicker text-mute">WhatsApp</dt>
                  <dd className="mt-1">
                    <a
                      href={`https://wa.me/${contact.phoneHref.replace(/\D/g, "")}?text=${encodeURIComponent(
                        "Hello Kayglo, I'd like a free solar power assessment.",
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-ink hover:text-accent"
                    >
                      Chat with us on WhatsApp
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="kicker text-mute">Email</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-lg text-ink hover:text-accent"
                    >
                      {contact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="kicker text-mute">Office</dt>
                  <dd className="mt-1 text-ink">
                    {contact.address.street}
                    <br />
                    {contact.address.city}, {contact.address.region}{" "}
                    {contact.address.postalCode}
                  </dd>
                </div>
                <div>
                  <dt className="kicker text-mute">Hours</dt>
                  <dd className="mt-1 text-ink">{contact.hours}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
