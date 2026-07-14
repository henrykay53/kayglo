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
  postal?: string;
  service?: string;
  message?: string;
  company?: string; // honeypot
};

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

  const rows = Object.entries(lead)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#6b6f66;text-transform:capitalize">${esc(
          k,
        )}</td><td style="padding:6px 0;color:#10130f">${esc(v)}</td></tr>`,
    )
    .join("");

  await resend.emails.send({
    from,
    to: inbox,
    replyTo: lead.email,
    subject: `New consultation request — ${lead.name}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px">
        <h2 style="color:#10130f">New consultation request</h2>
        <table style="border-collapse:collapse;font-size:15px">${rows}</table>
      </div>`,
    text: Object.entries(lead)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n"),
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
  const email = body.email?.trim();

  if (!name || !email || !isEmail(email)) {
    return NextResponse.json(
      { error: "A valid name and email are required." },
      { status: 422 },
    );
  }

  const lead = {
    name,
    email,
    phone: body.phone?.trim() ?? "",
    postal: body.postal?.trim() ?? "",
    service: body.service?.trim() ?? "",
    message: body.message?.trim() ?? "",
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
