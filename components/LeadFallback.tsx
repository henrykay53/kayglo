import { site, whatsappLink } from "@/lib/site";

/** Readable labels for the answers a visitor might have typed. */
const LABELS: Record<string, string> = {
  enquiryType: "Enquiry",
  name: "Name",
  phone: "Phone",
  email: "Email",
  businessName: "Business",
  partnerType: "Line of work",
  location: "Location",
  propertyType: "Property type",
  appliances: "Must stay on",
  equipmentNotes: "Equipment notes",
  backupDuration: "Backup wanted",
  generatorUse: "Generator use",
  fuelSpend: "Monthly fuel spend",
  electricityBill: "Monthly electricity bill",
  message: "Message",
};

/** The visitor's answers as plain lines, ready for a WhatsApp or email body. */
export function summariseLead(answers: Record<string, unknown>) {
  return Object.entries(LABELS)
    .map(([key, heading]) => {
      const value = String(answers[key] ?? "").trim();
      return value ? `${heading}: ${value}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

/**
 * Shown when an enquiry could not be delivered. The visitor has already done
 * the work of filling the form in — so instead of asking them to start again,
 * we hand their answers to the channels that cannot fail on our side.
 */
export function LeadFallback({
  answers,
  intro,
}: {
  answers: Record<string, unknown>;
  /** First line of the message, e.g. "I'd like a free power assessment." */
  intro: string;
}) {
  const { contact } = site;
  const body = `Hello Kayglo, ${intro}\n\n${summariseLead(answers)}`;
  const whatsapp = whatsappLink(body);
  const email = `mailto:${contact.salesEmail}?subject=${encodeURIComponent(
    "Website enquiry",
  )}&body=${encodeURIComponent(body)}`;

  return (
    <div
      role="alert"
      className="rounded-2xl border border-accent/40 bg-accent/5 p-5 sm:p-6"
    >
      <p className="font-display text-lg text-ink">
        That didn&apos;t send from here — your answers are still in the form.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate">
        Send them straight to the team in one tap. Everything you typed is
        already written into the message.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ever px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink"
        >
          Send on WhatsApp
        </a>
        <a
          href={`tel:${contact.phoneHref}`}
          className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
        >
          Call {contact.phone}
        </a>
        <a
          href={email}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium text-accent hover:text-ink"
        >
          Email instead
        </a>
      </div>
    </div>
  );
}
