/**
 * Turns a submitted form into the WhatsApp message the team works from.
 *
 * One formatter, one layout per kind of form — an assessment reads as a
 * survey sheet (property → loads → costs), a partner application as an
 * introduction. Only what the visitor typed or picked goes in: no attribution,
 * click ids or other internal data. Empty optional answers are left out.
 *
 * WhatsApp renders *text* as bold; the rest is plain lines, so it reads the
 * same in the app, on WhatsApp Web and in a notification preview.
 */

export type LeadKind = "assessment" | "partner";

type Field = { key: string; label: string; list?: boolean };
type Section = { title: string; fields: Field[] };

const LAYOUTS: Record<LeadKind, { heading: string; intro: string; sections: Section[] }> = {
  assessment: {
    heading: "New power assessment",
    intro: "I've just completed the free power assessment on your website. My answers:",
    sections: [
      {
        title: "Contact",
        fields: [
          { key: "name", label: "Name" },
          { key: "phone", label: "Phone" },
          { key: "email", label: "Email" },
        ],
      },
      {
        title: "Property",
        fields: [
          { key: "location", label: "Area & city" },
          { key: "propertyType", label: "Property type" },
        ],
      },
      {
        title: "What must stay on",
        fields: [
          { key: "appliances", label: "Appliances", list: true },
          { key: "equipmentNotes", label: "Notes" },
          { key: "backupDuration", label: "Backup wanted" },
        ],
      },
      {
        title: "What power costs today",
        fields: [
          { key: "generatorUse", label: "Generator use" },
          { key: "fuelSpend", label: "Monthly fuel spend" },
          { key: "electricityBill", label: "Monthly electricity bill" },
        ],
      },
    ],
  },
  partner: {
    heading: "New partner application",
    intro: "I've just applied to the partner programme on your website:",
    sections: [
      {
        title: "Contact",
        fields: [
          { key: "name", label: "Name" },
          { key: "phone", label: "Phone" },
          { key: "email", label: "Email" },
        ],
      },
      {
        title: "About them",
        fields: [
          { key: "businessName", label: "Business" },
          { key: "partnerType", label: "Line of work" },
          { key: "message", label: "Who they look after" },
        ],
      },
    ],
  },
};

/**
 * A short reference the customer and the team can both quote: KC-YYMMDD-XXXX.
 * Made in the browser so it exists even if the server can't be reached; the
 * API accepts it, or replaces one that isn't in this shape.
 */
export function makeReference(now = new Date()) {
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .split("/")
    .reverse()
    .join("");
  // No 0/O or 1/I, so it can be read out over the phone.
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const code = [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
  return `KC-${date}-${code}`;
}

export const REFERENCE_PATTERN = /^KC-\d{6}-[2-9A-HJ-NP-Z]{4}$/;

/** "Fri 23 Oct 2026, 14:05 WAT" — always Lagos time, whoever sends it. */
function lagosTime(when: Date) {
  return `${new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(when)} WAT`;
}

/** The full WhatsApp message for one submission. */
export function formatLeadMessage(
  kind: LeadKind,
  answers: Record<string, unknown>,
  { reference, submittedAt = new Date() }: { reference: string; submittedAt?: Date },
) {
  const layout = LAYOUTS[kind];
  const text = (key: string) => String(answers[key] ?? "").trim();

  const blocks = layout.sections
    .map((section) => {
      const lines = section.fields.flatMap(({ key, label, list }) => {
        const value = text(key);
        if (!value) return [];
        if (list) {
          return [`${label}:`, ...value.split(/\s*,\s*/).filter(Boolean).map((v) => `• ${v}`)];
        }
        // Multi-line notes stay readable: continuation lines are indented.
        return [`${label}: ${value.replace(/\s*\n\s*/g, "\n   ")}`];
      });
      return lines.length ? [`*${section.title}*`, ...lines].join("\n") : "";
    })
    .filter(Boolean);

  return [
    `Hello Kayglo, ${layout.intro}`,
    "",
    `*${layout.heading}* — Ref ${reference}`,
    `Submitted: ${lagosTime(submittedAt)}`,
    "",
    blocks.join("\n\n"),
  ].join("\n");
}
