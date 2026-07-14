import Link from "next/link";
import { nav, services, site } from "@/lib/site";
import { Logo, RayBurst } from "./Brand";

export function Footer() {
  const { contact } = site;
  return (
    <footer className="relative overflow-hidden bg-ink text-cream/80">
      <RayBurst className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-gold/10" />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-8 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Logo onDark />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/60">
            {site.tagline}
          </p>
          <address className="mt-6 not-italic text-sm leading-relaxed text-cream/60">
            {contact.address.street}
            <br />
            {contact.address.city}, {contact.address.region}{" "}
            {contact.address.postalCode}
          </address>
        </div>

        <div className="md:col-span-2">
          <h2 className="kicker text-cream/40">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-cream/70 transition-colors hover:text-gold-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="kicker text-cream/40">Services</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services#${s.slug}`}
                  className="text-cream/70 transition-colors hover:text-gold-300"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="kicker text-cream/40">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={`tel:${contact.phoneHref}`}
                className="text-cream/70 transition-colors hover:text-gold-300"
              >
                {contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="text-cream/70 transition-colors hover:text-gold-300"
              >
                {contact.email}
              </a>
            </li>
            <li className="text-cream/50">{contact.hours}</li>
          </ul>
          <div className="mt-5 flex gap-4 text-sm">
            <a
              href={site.social.instagram}
              className="text-cream/60 hover:text-gold-300"
              rel="noopener noreferrer"
              target="_blank"
            >
              Instagram
            </a>
            <a
              href={site.social.linkedin}
              className="text-cream/60 hover:text-gold-300"
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Genuine solar,
            expert installation &amp; trusted after-sales across Nigeria.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-cream/70">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-cream/70">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
