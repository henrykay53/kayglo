"use client";

import { saveHandoff, type Handoff } from "@/components/WhatsAppHandoff";
import { formatLeadMessage, type LeadKind } from "@/lib/lead-message";
import { whatsappLink } from "@/lib/site";

/**
 * The two ways a form reaches the team. WhatsApp is the default; email
 * (through /api/lead) is the alternative the customer can choose.
 * Both forms use these, so the behaviour can't drift between them.
 */

type Lead = {
  kind: LeadKind;
  reference: string;
  /** Everything the form sends to the API, attribution included. */
  payload: Record<string, unknown>;
};

/**
 * Opens WhatsApp with the message written. MUST run synchronously inside
 * the click/submit handler, before any await — browsers only allow a new
 * window from a direct user action.
 *
 * WhatsApp can't tell us whether the customer pressed Send, so the result
 * only says whether WhatsApp opened. A backup copy goes to the team's
 * inbox in the background (marked "Sent on WhatsApp"), so an assessment
 * whose WhatsApp message is never sent still isn't lost.
 */
export function sendViaWhatsApp({ kind, reference, payload }: Lead) {
  const message = formatLeadMessage(kind, payload, { reference });
  const win = window.open(whatsappLink(message), "_blank");
  if (win) win.opener = null;

  // keepalive: the page navigates away straight after this.
  fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, reference, channel: "whatsapp" }),
    keepalive: true,
  }).catch(() => {});

  const handoff: Handoff = {
    kind,
    reference,
    message,
    channel: "whatsapp",
    delivered: false,
    createdAt: Date.now(),
    // Blocked pop-up? Then the thank-you page leads with "Open WhatsApp".
    opened: Boolean(win),
  };
  saveHandoff(handoff);
  return handoff;
}

export type EmailResult =
  | { ok: true; handoff: Handoff }
  /** Inbox or network failed — `handoff` offers WhatsApp instead. */
  | { ok: false; handoff: Handoff }
  /** The server rejected an answer. */
  | { ok: false; error: string };

/** Sends through the website's email (/api/lead) and waits for the answer. */
export async function sendViaEmail({ kind, reference, payload }: Lead): Promise<EmailResult> {
  const make = (ref: string, delivered: boolean): Handoff => {
    const h: Handoff = {
      kind,
      reference: ref,
      message: formatLeadMessage(kind, payload, { reference: ref }),
      channel: "email",
      delivered,
      createdAt: Date.now(),
    };
    saveHandoff(h);
    return h;
  };

  let res: Response;
  try {
    res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, reference, channel: "email" }),
    });
  } catch {
    return { ok: false, handoff: make(reference, false) };
  }
  const reply = await res.json().catch(() => ({}));
  const ref = typeof reply.reference === "string" ? reply.reference : reference;
  if (res.ok) return { ok: true, handoff: make(ref, true) };
  if (reply.undelivered) return { ok: false, handoff: make(ref, false) };
  return {
    ok: false,
    error:
      reply.error ||
      "Your request didn't go through. Your answers are all still here — please try again.",
  };
}
