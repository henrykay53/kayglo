import type { Metadata } from "next";
import { PartnerForm } from "@/components/PartnerForm";
import { Reveal } from "@/components/Reveal";
import { Container, Kicker } from "@/components/ui";
import { partnerProgramme, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner Programme",
  description:
    "Estate agents, facility managers, developers, architects and contractors: refer power work to Kayglo Citadel and earn on every installation. Your clients get genuine solar; you get a partner who answers the phone.",
  alternates: { canonical: "/partners" },
};

const steps = [
  {
    n: "01",
    title: "You introduce us",
    body: "A name and a number, a WhatsApp intro, or your own tracked link. That is the whole ask — you don't have to explain solar to anyone.",
  },
  {
    n: "02",
    title: "We assess, free",
    body: "We survey the property, measure the real load and come back with a sized system, an honest cost and payment options. No pressure on your client, and nothing that reflects badly on you.",
  },
  {
    n: "03",
    title: "We install and service it",
    body: "Genuine equipment, a tidy install, and after-sales that answers the phone. Your reputation is attached to this referral — we treat it that way.",
  },
  {
    n: "04",
    title: "You get paid",
    body: "On every installation that completes. Agreed in writing before you refer anybody, so there is never a conversation about it afterwards.",
  },
];

export default function PartnersPage() {
  const { rate, terms, types } = partnerProgramme;

  return (
    <>
      <section className="grain relative overflow-hidden border-b border-ink/10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-32 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
        </div>
        <Container className="py-16 md:py-24">
          <Reveal>
            <Kicker>Partner programme</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Your clients ask about power. Have an answer worth giving.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate">
              Every estate agent, facility manager and contractor in this
              country fields the same question: &ldquo;what do I do about
              power?&rdquo; Refer it to us and you get a straight answer for
              your client, and a share of the work.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <Kicker>Who this is for</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 max-w-2xl text-3xl text-ink md:text-4xl">
              If power comes up in your work, it&apos;s for you.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {types.map((t) => (
              <div key={t.role} className="bg-cream p-6">
                <h3 className="font-display text-lg text-ink">{t.role}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate">
                  {t.why}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-ink/10 bg-ink py-16 text-cream md:py-24">
        <Container>
          <Reveal>
            <Kicker className="text-accent-300">How it works</Kicker>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <p className="font-display text-5xl text-cream/15">{s.n}</p>
                <h3 className="font-display mt-4 text-xl text-cream">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/60">
                  {s.body}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140}>
            <div className="mt-14 grid gap-8 border-t border-cream/10 pt-10 md:grid-cols-2">
              <div>
                <p className="kicker text-accent-300">What you earn</p>
                <p className="font-display mt-3 text-2xl text-cream">
                  {rate ?? "Agreed with you, in writing, before you refer anyone."}
                </p>
                {terms && <p className="mt-3 text-cream/60">{terms}</p>}
              </div>
              <div>
                <p className="kicker text-accent-300">Your own tracked link</p>
                <p className="mt-3 text-cream/70">
                  Every partner gets a personal link. When someone you sent
                  books an assessment, it arrives tagged with your name — so
                  there is never a dispute about who introduced whom, and you
                  can see your own referrals land.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <Kicker>Apply</Kicker>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display mt-5 text-3xl text-ink md:text-4xl">
                Let&apos;s talk terms.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 text-slate">
                Tell us what you do and who you look after. We&apos;ll come back
                with the rate, the terms in writing, and your tracked link —
                usually within a business day.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 border-t border-ink/10 pt-6 text-slate">
                Prefer to talk first?{" "}
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className="link-underline text-accent"
                >
                  {site.contact.phone}
                </a>
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={120}>
              <div className="rounded-3xl border border-ink/10 bg-cream-200/40 p-6 shadow-sm sm:p-9">
                <PartnerForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
