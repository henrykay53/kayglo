"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { getAttribution } from "@/lib/attribution";
import { formatLeadMessage, makeReference } from "@/lib/lead-message";
import { WhatsAppHandoff, saveHandoff, type Handoff } from "./WhatsAppHandoff";
import { trackEvent } from "@/lib/track";
import { partnerProgramme } from "@/lib/site";

type Status = "idle" | "submitting" | "error" | "undelivered";

/** Names this form in analytics events. */
const FORM = "partner" as const;

const field =
  "mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-ink transition-colors placeholder:text-mute/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
const label = "text-sm font-medium text-ink";

export function PartnerForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  // The WhatsApp handoff for an application that didn't reach the inbox.
  const [handoff, setHandoff] = useState<Handoff | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sending = useRef(false); // blocks a double submit before React re-renders

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current) return;
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    // The browser's own checks are switched off (noValidate) so the styling
    // stays ours — run them here, before anything is sent.
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("idle");
      return;
    }
    const data = new FormData(form);
    if (data.get("company")) {
      setStatus("idle");
      form.reset();
      return;
    }

    const reference = makeReference();
    const payload = {
      ...Object.fromEntries(data.entries()),
      enquiryType: "Partner programme",
      reference,
      ...getAttribution(),
    };

    const handOff = (ref: string, delivered: boolean) => {
      const h: Handoff = {
        kind: FORM,
        reference: ref,
        message: formatLeadMessage(FORM, payload, { reference: ref }),
        delivered,
        createdAt: Date.now(),
      };
      saveHandoff(h);
      setHandoff(h);
    };

    sending.current = true;
    let res: Response;
    try {
      res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // No connection to the website — offer WhatsApp instead of a dead end.
      sending.current = false;
      handOff(reference, false);
      setStatus("undelivered");
      trackEvent("lead_delivery_failed", { form: FORM, reason: "network" });
      return;
    }
    const reply = await res.json().catch(() => ({}));
    const ref = typeof reply.reference === "string" ? reply.reference : reference;
    sending.current = false;

    if (res.ok) {
      handOff(ref, true);
      trackEvent("partner_application", {
        partner_type: String(data.get("partnerType") ?? ""),
      });
      router.push("/thank-you");
      return;
    }
    if (reply.undelivered) {
      // Our inbox failed, not them — WhatsApp becomes the route.
      handOff(ref, false);
      setStatus("undelivered");
      trackEvent("lead_delivery_failed", { form: FORM });
      return;
    }
    setStatus("error");
    setError(reply.error || "Something went wrong. Please try again, or call us.");
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Your name
          </label>
          <input id="name" name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="080…"
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="businessName" className={label}>
            Business name
          </label>
          <input
            id="businessName"
            name="businessName"
            autoComplete="organization"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="partnerType" className={label}>
            What you do
          </label>
          <select
            id="partnerType"
            name="partnerType"
            className={field}
            defaultValue=""
          >
            <option value="" disabled>
              Select your line of work
            </option>
            {partnerProgramme.types.map((t) => (
              <option key={t.role} value={t.role}>
                {t.role}
              </option>
            ))}
            <option value="Other">Something else</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="email" className={label}>
          Email{" "}
          <span className="font-normal text-mute">(optional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="message" className={label}>
          Who do you look after?
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className={field}
          placeholder="e.g. I manage 40 units across two estates in Ajah, and power comes up with every tenant."
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {status === "undelivered" && handoff && (
        <WhatsAppHandoff
          handoff={handoff}
          onRetry={() => formRef.current?.requestSubmit()}
        />
      )}

      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-accent disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Apply to partner"}
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </button>
        <p className="mt-4 text-xs text-mute">
          We&apos;ll come back to you with the terms in writing, and your own
          tracked link.
        </p>
      </div>
    </form>
  );
}
