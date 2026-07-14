import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { Container, Kicker } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Consultation",
  description:
    "Book a no-pressure solar consultation with Kayglo. Tell us about your home and receive a photo-accurate proposal, usually within a week.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { contact } = site;
  return (
    <section className="py-16 md:py-24">
      <Container className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <Kicker>Get started</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 text-4xl leading-tight text-ink sm:text-5xl">
              Request a consultation.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 text-lg text-slate">
              No hard sell, no obligation. Just an honest conversation and a
              clear picture of what solar could do for your home.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <dl className="mt-10 space-y-6 border-t border-ink/10 pt-8">
              <div>
                <dt className="kicker text-mute">Call</dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${contact.phoneHref}`}
                    className="font-display text-2xl text-ink hover:text-gold"
                  >
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="kicker text-mute">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-lg text-ink hover:text-gold"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="kicker text-mute">Studio</dt>
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

        <div className="md:col-span-6 md:col-start-7">
          <Reveal delay={120}>
            <div className="rounded-3xl border border-ink/10 bg-cream-200/40 p-6 shadow-sm sm:p-9">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
