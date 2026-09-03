import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Button, Container, Kicker } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your assessment is on its way",
  description:
    "Thanks — your free power assessment request has reached the Kayglo Citadel team.",
  // A conversion page belongs to the ad platforms, not to search.
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

const next = [
  {
    n: "01",
    title: "We read your answers",
    body: "An engineer works through your loads, generator hours and backup target — not a salesperson with a price list.",
  },
  {
    n: "02",
    title: "We size the system",
    body: "You get the estimated kVA and kWh, the package that fits, an estimated cost, and the payment option to match.",
  },
  {
    n: "03",
    title: "We call you back",
    body: "Within one business day. If anything is unclear we'll ask — better a question now than a wrong system later.",
  },
];

export default function ThankYouPage() {
  const { contact } = site;
  const whatsapp = `https://wa.me/${contact.phoneHref.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hello Kayglo, I just submitted a power assessment on your website.",
  )}`;

  return (
    <>
      <section className="grain relative overflow-hidden border-b border-ink/10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-32 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
        </div>
        <Container className="py-20 md:py-28">
          <Reveal>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ever text-2xl text-cream">
              ✓
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Kicker className="mt-8 inline-flex">Assessment received</Kicker>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Your assessment is on its way.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-lg text-slate">
              Thank you — we have everything we need to start sizing your
              system. Here&apos;s exactly what happens next.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 border-t border-ink/10 pt-10 md:grid-cols-3">
            {next.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <p className="font-display text-sm text-accent">{s.n}</p>
                <h2 className="font-display mt-3 text-xl text-ink">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {s.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl text-ink">
              In a hurry? Start the conversation now.
            </h2>
            <p className="mt-4 text-slate">
              If your power situation is urgent — a failed inverter, a business
              down, a generator you need gone — message or call us and we&apos;ll
              pick it up straight away.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-accent"
              >
                Chat on WhatsApp
              </a>
              <a
                href={`tel:${contact.phoneHref}`}
                className="font-display text-2xl text-ink hover:text-accent"
              >
                {contact.phone}
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="font-display text-3xl text-ink">
              While you wait — see the work.
            </h2>
            <p className="mt-4 text-slate">
              Real installations, real systems, and the numbers behind them.
              It&apos;s the best way to judge whether we&apos;re the team you
              want on your roof.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/projects">See our installations</Button>
              <Link
                href="/financing"
                className="link-underline inline-block self-center text-accent"
              >
                Packages &amp; payment options
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
