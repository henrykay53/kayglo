import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms governing use of the ${site.legalName} website.`,
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <article className="py-16 md:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl text-ink md:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-mute">
          This is placeholder copy. Replace it with your reviewed terms before
          launch.
        </p>
        <div className="mt-10 space-y-6 leading-relaxed text-slate">
          <p>
            By using the {site.legalName} website, you agree to these terms. The
            content here is provided for general information and does not
            constitute a binding proposal or warranty until set out in a signed
            agreement.
          </p>
          <h2 className="font-display text-2xl text-ink">Use of the site</h2>
          <p>
            You agree to use this site lawfully and not to misuse the
            consultation form or attempt to disrupt the service.
          </p>
          <h2 className="font-display text-2xl text-ink">Estimates</h2>
          <p>
            Savings figures, offsets, and payback periods shown are illustrative
            and depend on your home, usage, and local utility rates. Your actual
            proposal will contain figures specific to your property.
          </p>
          <h2 className="font-display text-2xl text-ink">Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href={`mailto:${site.contact.email}`} className="text-gold">
              {site.contact.email}
            </a>
            .
          </p>
        </div>
      </Container>
    </article>
  );
}
