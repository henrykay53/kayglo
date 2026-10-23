import Link from "next/link";
import { servedPlaces } from "@/lib/places";
import { segments, services, site } from "@/lib/site";
import { Logo, RayBurst } from "./Brand";

/** The states we actually service, named from the same data the map uses. */
const servicedStates = servedPlaces().map((p) => p.name);

const company = [
  { href: "/projects", label: "Projects & case studies" },
  { href: "/financing", label: "Packages & pricing" },
  { href: "/generator-cost", label: "Generator cost check" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About us" },
  { href: "/partners", label: "Partner programme" },
];

export function Footer() {
  const { contact } = site;

  return (
    <footer className="relative overflow-hidden bg-ink text-cream/80">
      <RayBurst className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 text-accent/10" />

      {/* A last chance to convert, before the small print */}
      <div className="relative border-b border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-2xl text-cream md:text-3xl">
              Not sure what system you need?
            </p>
            <p className="mt-2 text-sm text-cream/60">
              Free power assessment — system size, cost and payment options, no
              obligation.
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-cream px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent hover:text-cream md:self-auto"
          >
            Get my free assessment
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-12 md:gap-8 md:py-16">
        <div className="md:col-span-4">
          <Logo onDark />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/60">
            {site.tagline}
          </p>
          <address className="mt-6 not-italic text-sm leading-relaxed text-cream/60">
            {contact.address.street}
            <br />
            {contact.address.locality}, {contact.address.city},{" "}
            {contact.address.countryName}
          </address>
          <a
            href={site.social.instagram}
            className="mt-6 inline-flex items-center gap-2 text-sm text-cream/60 transition-colors hover:text-accent-300"
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="3.8" />
              <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
            </svg>
            Instagram
          </a>
        </div>

        <div className="md:col-span-3">
          <h2 className="kicker text-cream/40">Solutions</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {segments.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/solutions/${s.slug}`}
                  className="text-cream/70 transition-colors hover:text-accent-300"
                >
                  {s.name}
                </Link>
              </li>
            ))}
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services#${s.slug}`}
                  className="text-cream/70 transition-colors hover:text-accent-300"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="kicker text-cream/40">Company</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {company.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-cream/70 transition-colors hover:text-accent-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="kicker text-cream/40">Talk to us</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a
                href={`tel:${contact.phoneHref}`}
                className="font-display text-xl text-cream transition-colors hover:text-accent-300"
              >
                {contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="text-cream/70 transition-colors hover:text-accent-300"
              >
                {contact.email}
              </a>
            </li>
            <li className="text-cream/50">{contact.hours}</li>
          </ul>
        </div>
      </div>

      {/* Where the work actually is — the same states lit on the map */}
      {servicedStates.length > 0 && (
        <div className="relative border-t border-cream/10">
          <div className="mx-auto max-w-6xl px-6 py-6 sm:px-8">
            <p className="text-xs leading-relaxed text-cream/45">
              <span className="text-cream/70">Installing &amp; servicing in </span>
              {servicedStates.join(" · ")}
              <span className="text-cream/70"> — and supplying nationwide.</span>
            </p>
          </div>
        </div>
      )}

      <div className="relative border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Genuine solar,
            expert installation &amp; trusted after-sales across Nigeria.
          </p>
        </div>
      </div>
    </footer>
  );
}
