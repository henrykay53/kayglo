import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Lead capture endpoint.
 *
 * Delivery is automatic once configured:
 *   • Set RESEND_API_KEY and LEAD_INBOX in your environment → leads are emailed.
 *   • If those aren't set, leads are logged to the server console (dev-safe),
 *     so nothing breaks and nothing is lost while you set things up.
 *
 * Get a free key at https://resend.com, verify your sending domain, then add:
 *   RESEND_API_KEY=re_...          (your Resend key)
 *   LEAD_INBOX=you@kayglo.com      (where leads should land)
 *   LEAD_FROM=leads@kayglo.com     (a verified sender on your domain; optional)
 */

export const runtime = "nodejs";

type Lead = {
  name?: string;
  email?: string;
  phone?: string;
  /** Power assessment answers */
  location?: string;
  propertyType?: string;
  appliances?: string;
  equipmentNotes?: string;
  backupDuration?: string;
  generatorUse?: string;
  fuelSpend?: string;
  electricityBill?: string;
  /** Acquisition attribution — see lib/attribution.ts */
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  gclid?: string;
  fbclid?: string;
  landingPage?: string;
  referrer?: string;
  firstSource?: string;
  firstMedium?: string;
  firstCampaign?: string;
  firstSeen?: string;
  visits?: string;
  /** Partner programme applications (§21) */
  enquiryType?: string;
  businessName?: string;
  partnerType?: string;
  /** Kept for any older form still posting here */
  postal?: string;
  service?: string;
  message?: string;
  company?: string; // honeypot
};

/** Field order and labels for the notification email. */
const FIELDS: [keyof Lead, string][] = [
  ["enquiryType", "Enquiry"],
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["businessName", "Business"],
  ["partnerType", "Line of work"],
  ["location", "Location"],
  ["propertyType", "Property type"],
  ["appliances", "Must stay on"],
  ["equipmentNotes", "Equipment notes"],
  ["backupDuration", "Backup wanted"],
  ["generatorUse", "Generator use"],
  ["fuelSpend", "Monthly fuel spend"],
  ["electricityBill", "Monthly electricity bill"],
  ["postal", "Area / city"],
  ["service", "Interested in"],
  ["message", "Message"],
];

/** Kept apart in the email so the channel is readable at a glance. */
const ATTRIBUTION_FIELDS: [keyof Lead, string][] = [
  ["source", "Source"],
  ["medium", "Medium"],
  ["campaign", "Campaign"],
  ["term", "Keyword"],
  ["content", "Ad content"],
  ["landingPage", "Landed on"],
  ["referrer", "Referrer"],
  ["gclid", "Google click id"],
  ["fbclid", "Meta click id"],
  ["firstSource", "First touch — source"],
  ["firstMedium", "First touch — medium"],
  ["firstCampaign", "First touch — campaign"],
  ["firstSeen", "First seen"],
  ["visits", "Visits before enquiry"],
];

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function deliver(lead: Record<string, string>) {
  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.LEAD_INBOX || site.contact.email;
  const from = process.env.LEAD_FROM || "Kayglo Leads <onboarding@resend.dev>";

  if (!apiKey) {
    console.log("[kayglo] New lead (email not configured):", lead);
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const entries = FIELDS.map(([key, heading]) => [heading, lead[key] ?? ""])
    .concat([["Received", lead.receivedAt ?? ""]])
    .filter(([, v]) => v);

  const attribution = ATTRIBUTION_FIELDS.map(([key, heading]) => [
    heading,
    lead[key] ?? "",
  ]).filter(([, v]) => v);

  const toRows = (pairs: string[][]) =>
    pairs
      .map(
      ([k, v]) =>
          `<tr><td style="padding:6px 14px 6px 0;color:#6b6f66;vertical-align:top;white-space:nowrap">${esc(
            k,
          )}</td><td style="padding:6px 0;color:#10130f">${esc(v)}</td></tr>`,
      )
      .join("");

  const channel = lead.source
    ? `${lead.source}${lead.medium ? ` / ${lead.medium}` : ""}${
        lead.campaign ? ` — ${lead.campaign}` : ""
      }`
    : "unknown";

  await resend.emails.send({
    from,
    to: inbox,
    replyTo: lead.email || undefined,
    subject: lead.enquiryType
      ? `${lead.enquiryType} — ${lead.name}${lead.businessName ? `, ${lead.businessName}` : ""} [${channel}]`
      : `Power assessment — ${lead.name}, ${lead.location || "location not given"} [${channel}]`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px">
        <h2 style="color:#10130f">${esc(lead.enquiryType || "New power assessment request")}</h2>
        ${
          lead.enquiryType
            ? ""
            : `<p style="color:#6b6f66;font-size:14px">Send back: estimated system size, recommended package, estimated cost, and payment option.</p>`
        }
        <table style="border-collapse:collapse;font-size:15px">${toRows(entries)}</table>
        ${
          attribution.length
            ? `<h3 style="color:#10130f;margin-top:28px;font-size:15px">Where this lead came from</h3>
        <table style="border-collapse:collapse;font-size:14px;color:#3d443a">${toRows(attribution)}</table>`
            : ""
        }
      </div>`,
    text: [...entries, ...attribution].map(([k, v]) => `${k}: ${v}`).join("\n"),
  });
}

export async function POST(request: Request) {
  let body: Lead;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Silently accept honeypot hits so bots think they succeeded.
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const email = body.email?.trim();

  if (!name || (!phone && !email)) {
    return NextResponse.json(
      { error: "A name and a phone number are required." },
      { status: 422 },
    );
  }

  if (email && !isEmail(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 422 },
    );
  }

  const text = (v?: string) => v?.trim() ?? "";

  const lead: Record<string, string> = {
    name,
    phone: text(phone),
    email: text(email),
    enquiryType: text(body.enquiryType),
    businessName: text(body.businessName),
    partnerType: text(body.partnerType),
    location: text(body.location),
    propertyType: text(body.propertyType),
    appliances: text(body.appliances),
    equipmentNotes: text(body.equipmentNotes),
    backupDuration: text(body.backupDuration),
    generatorUse: text(body.generatorUse),
    fuelSpend: text(body.fuelSpend),
    electricityBill: text(body.electricityBill),
    source: text(body.source),
    medium: text(body.medium),
    campaign: text(body.campaign),
    term: text(body.term),
    content: text(body.content),
    gclid: text(body.gclid),
    fbclid: text(body.fbclid),
    landingPage: text(body.landingPage),
    referrer: text(body.referrer),
    firstSource: text(body.firstSource),
    firstMedium: text(body.firstMedium),
    firstCampaign: text(body.firstCampaign),
    firstSeen: text(body.firstSeen),
    visits: text(body.visits),
    postal: text(body.postal),
    service: text(body.service),
    message: text(body.message),
    receivedAt: new Date().toISOString(),
  };

  try {
    await deliver(lead);
  } catch (err) {
    // Don't lose the lead if the email provider hiccups — log it and still
    // report success to the visitor so they aren't asked to resubmit.
    console.error("[kayglo] Lead delivery failed:", err);
    console.log("[kayglo] Lead (fallback):", lead);
  }

  return NextResponse.json({ ok: true });
}
