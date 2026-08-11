import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.legalName} collects, uses, and protects your information.`,
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <article className="py-16 md:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl text-ink md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-mute">
          This is placeholder copy. Replace it with your reviewed policy before
          launch.
        </p>
        <div className="mt-10 space-y-6 leading-relaxed text-slate">
          <p>
            {site.legalName} (&ldquo;we&rdquo;) collects the information you
            provide through our consultation form — such as your name, email,
            phone number, and property details — solely to prepare and deliver
            your solar consultation.
          </p>
          <h2 className="font-display text-2xl text-ink">Information we collect</h2>
          <p>
            Contact details and property information you submit voluntarily, and
            standard analytics data (pages visited, device type) used to improve
            the site.
          </p>
          <h2 className="font-display text-2xl text-ink">How we use it</h2>
          <p>
            To respond to your inquiry, prepare proposals, and communicate about
            our services. We do not sell your personal information.
          </p>
          <h2 className="font-display text-2xl text-ink">Contact</h2>
          <p>
            Questions? Email{" "}
            <a href={`mailto:${site.contact.email}`} className="text-accent">
              {site.contact.email}
            </a>
            .
          </p>
        </div>
      </Container>
    </article>
  );
}
