import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { AssessmentForm } from "@/components/AssessmentForm";
import { Reveal } from "@/components/Reveal";
import { Container, Kicker } from "@/components/ui";
import { nigeriaStates } from "@/lib/nigeria-map";
import {
  addressLine,
  credentials,
  presenceStates,
  site,
  whatsappLink,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us & Free Solar Power Assessment",
  description:
    "Talk to Kayglo Citadel by phone, WhatsApp or email — for a quote, a question, or support with a system you already have. Or request a free solar power assessment: estimated system size, package, cost and payment option, with no obligation.",
  alternates: { canonical: "/contact" },
};

/** What the visitor gets back — the whole reason to fill the form in. */
const deliverables = [
  {
    title: "Estimated system size",
    body: "The kVA of inverter and kWh of storage your real load calls for.",
  },
  {
    title: "Recommended solution",
    body: "Which package fits — Essential, Comfort, Business, or Business Plus.",
  },
  {
    title: "Estimated cost",
    body: "An honest range for that system, with nothing padded in.",
  },
  {
    title: "Payment option",
    body: "Outright or a staged plan — whichever gets you powered soonest.",
  },
];

const servedStates = nigeriaStates
  .filter((s) => presenceStates.includes(s.id))
  .map((s) => s.name.replace(" (FCT)", ""));

/** Answered from what the site already commits to — nothing new promised. */
const faqs = [
  {
    q: "Is the assessment really free?",
    a: "Yes. There is no charge and no obligation to buy. You get an estimated system size, the package that fits, an estimated cost and a payment option — then you decide.",
  },
  {
    q: "Do you work outside Lagos?",
    a: `Yes. Our crews install in ${servedStates.length} states — ${servedStates.join(", ")} — and we supply equipment nationwide.`,
  },
  {
    q: "I already have a system. Can you help?",
    a: "If we installed it, contact after-sales support for servicing, a fault, or battery and inverter work. If someone else installed it, tell us what you have — we supply genuine replacement batteries and inverters, and upgrades to existing setups.",
  },
  {
    q: "How can I pay?",
    a: `${credentials.payment.join(", ")}. The assessment recommends the option that fits your system.`,
  },
];

export default function ContactPage() {
  const { contact } = site;
  const whatsapp = whatsappLink("Hello Kayglo, I have a question about solar.");
  const supportWhatsapp = whatsappLink(
    "Hello Kayglo, I'm an existing customer and need help with my system.",
  );
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    addressLine(),
  )}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
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
      <section className="grain relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-32 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
        </div>
        <Container className="pb-12 pt-16 md:pb-16 md:pt-24">
          <Reveal>
            <Kicker>Contact &amp; support</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Questions, quotes or support — talk to us directly.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate">
              Pricing a new system, comparing options, or need help with one you
              already have — you reach the Kayglo team in {contact.address.locality},{" "}
              {contact.address.city} directly. For a price, the free power
              assessment below is the quickest route.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
              <a
                href="#assessment"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-accent px-6 py-3 text-sm font-medium text-cream shadow-sm transition-colors hover:bg-ink sm:w-auto"
              >
                Start the free assessment
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
              <a
                href={`tel:${contact.phoneHref}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/25 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream sm:w-auto"
              >
                <PhoneIcon /> Call {contact.phone}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------- CHANNELS ---------------------------- */}
      <section aria-labelledby="channels-title" className="pb-16 md:pb-24">
        <Container>
          <h2 id="channels-title" className="sr-only">
            Ways to reach us
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Channel
              icon={<PhoneIcon className="h-5 w-5" />}
              title="Call us"
              best="Talking it through, or anything urgent."
              href={`tel:${contact.phoneHref}`}
              action={contact.phone}
              note={contact.hours}
            />
            <Channel
              icon={<ChatIcon />}
              title="WhatsApp"
              best="Quick questions — and photos of your current inverter, batteries or generator."
              href={whatsapp}
              action="Start a chat"
              external
            />
            <Channel
              icon={<MailIcon />}
              title="Email"
              best="Detailed requirements, documents, or a quote in writing."
              href={`mailto:${contact.salesEmail}`}
              action={contact.salesEmail}
              note={
                <>
                  General enquiries:{" "}
                  <a
                    href={`mailto:${contact.email}`}
                    className="underline decoration-ink/25 underline-offset-4 hover:text-accent"
                  >
                    {contact.email}
                  </a>
                </>
              }
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-5">
            {/* Existing customers get their own route — support, not sales. */}
            <div className="rounded-3xl bg-ever p-7 text-cream md:col-span-3 md:p-9">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-accent-300">
                <SupportIcon />
              </span>
              <h3 className="font-display mt-5 text-2xl">
                Already a Kayglo customer?
              </h3>
              <p className="mt-2 max-w-md text-cream/70">
                For servicing, a fault, or a question about your system, go
                straight to after-sales support. Tell us where the system is and
                what it&apos;s doing — a photo of the inverter screen helps.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`mailto:${contact.supportEmail}?subject=${encodeURIComponent("Support request")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-cream px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent hover:text-cream"
                >
                  <MailIcon className="h-4 w-4" /> {contact.supportEmail}
                </a>
                <a
                  href={supportWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/25 px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-cream hover:text-ink"
                >
                  <ChatIcon className="h-4 w-4" /> WhatsApp support
                </a>
              </div>
            </div>

            <div className="flex flex-col rounded-3xl border border-ink/10 bg-cream-200/50 p-7 md:col-span-2 md:p-9">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                <PinIcon />
              </span>
              <h3 className="font-display mt-5 text-2xl text-ink">The office</h3>
              <address className="mt-2 not-italic leading-relaxed text-slate">
                {contact.address.street}
                <br />
                {contact.address.locality}, {contact.address.city},{" "}
                {contact.address.countryName}
              </address>
              <p className="mt-2 text-sm text-mute">{contact.hours}</p>
              <a
                href={maps}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-auto inline-block self-start pt-6 text-sm font-medium text-accent"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* --------------------------- ASSESSMENT --------------------------- */}
      <section
        id="assessment"
        aria-labelledby="assessment-title"
        className="scroll-mt-20 border-t border-ink/10 bg-cream-200/40 py-16 md:py-24"
      >
        <Container className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Kicker>Free · no obligation</Kicker>
              <h2
                id="assessment-title"
                className="font-display mt-5 text-3xl leading-tight text-ink md:text-4xl"
              >
                Free {contact.address.city} solar power assessment
              </h2>
              <p className="mt-4 text-slate">
                Four short steps about what you run and what power costs you
                today. An engineer does the rest — outside {contact.address.city}{" "}
                too.
              </p>
              <p className="kicker mt-8 text-mute">What you get back</p>
              <ul className="mt-4 space-y-4">
                {deliverables.map((d) => (
                  <li key={d.title} className="flex gap-3">
                    <svg
                      viewBox="0 0 16 16"
                      className="mt-1 h-3.5 w-3.5 shrink-0 text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m3 8.5 3.2 3.2L13 5" />
                    </svg>
                    <span>
                      <span className="font-medium text-ink">{d.title}</span>
                      <span className="block text-sm text-slate">{d.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-8">
            <Suspense
              // Same footprint as the form, so nothing jumps while it loads.
              fallback={
                <div
                  aria-hidden="true"
                  className="h-[34rem] rounded-3xl border border-ink/10 bg-cream"
                />
              }
            >
              <AssessmentForm />
            </Suspense>
          </div>
        </Container>
      </section>

      {/* ------------------------------ FAQ ------------------------------- */}
      <section className="py-16 md:py-24">
        <Container className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Kicker>Before you get in touch</Kicker>
            <h2 className="font-display mt-5 text-3xl text-ink">
              Common questions
            </h2>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                { href: "/generator-cost", label: "What is my generator really costing me?" },
                { href: "/financing", label: "Packages and payment plans" },
                { href: "/projects", label: "Installations we've completed" },
                { href: "/blog/how-to-spot-fake-solar-equipment", label: "How to spot fake solar equipment" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline text-accent">
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2 md:col-span-8">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-display text-lg text-ink">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-slate">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}

/** One way to reach us: what it's best for, and the action that opens it. */
function Channel({
  icon,
  title,
  best,
  href,
  action,
  note,
  external = false,
}: {
  icon: ReactNode;
  title: string;
  best: string;
  href: string;
  action: string;
  note?: ReactNode;
  external?: boolean;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-ink/10 bg-cream p-7 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
        {icon}
      </span>
      <h3 className="font-display mt-5 text-xl text-ink">{title}</h3>
      <p className="mt-1.5 text-sm text-slate">
        <span className="text-mute">Best for: </span>
        {best}
      </p>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="mt-auto inline-flex items-center gap-1.5 self-start break-all pt-6 font-medium text-ink transition-colors hover:text-accent"
      >
        {action}
        <span aria-hidden="true">{external ? "↗" : "→"}</span>
      </a>
      {note && <p className="mt-1 text-sm text-mute">{note}</p>}
    </div>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

function ChatIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.4A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  );
}

function MailIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function SupportIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" />
    </svg>
  );
}
