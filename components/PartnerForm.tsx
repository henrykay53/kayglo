"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { getAttribution } from "@/lib/attribution";
import { makeReference } from "@/lib/lead-message";
import { sendViaEmail, sendViaWhatsApp } from "@/lib/send-lead";
import { WhatsAppMark } from "./WhatsAppButton";
import { WhatsAppHandoff, type Handoff } from "./WhatsAppHandoff";
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
  const emailButton = useRef<HTMLButtonElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current) return;
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
    const lead = { kind: FORM, reference, payload };
    const partner_type = String(data.get("partnerType") ?? "");

    // Which button sent it. Enter, and the main button, mean WhatsApp.
    const via =
      (e.nativeEvent as SubmitEvent).submitter?.getAttribute("data-via") === "email"
        ? "email"
        : "whatsapp";

    if (via === "whatsapp") {
      // Synchronous, inside the submit — or the browser blocks WhatsApp.
      sendViaWhatsApp(lead);
      trackEvent("partner_application", { partner_type, method: "whatsapp" });
      trackEvent("whatsapp_handoff", { form: FORM });
      router.push("/thank-you");
      return;
    }

    sending.current = true;
    setStatus("submitting");
    const result = await sendViaEmail(lead);
    sending.current = false;
    if (result.ok) {
      trackEvent("partner_application", { partner_type, method: "email" });
      router.push("/thank-you");
    } else if ("handoff" in result) {
      // The email didn't reach us — offer WhatsApp, answers kept.
      setHandoff(result.handoff);
      setStatus("undelivered");
      trackEvent("lead_delivery_failed", { form: FORM });
    } else {
      setStatus("error");
      setError(result.error);
    }
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
          onRetry={() => formRef.current?.requestSubmit(emailButton.current)}
        />
      )}

      <div>
        {/* WhatsApp is the default (first, so Enter picks it); email is
            the quiet alternative beside it. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="submit"
            data-via="whatsapp"
            disabled={status === "submitting"}
            className="inline-flex items-center gap-2.5 rounded-full bg-ever py-1.5 pl-1.5 pr-6 text-sm font-medium text-cream shadow-sm transition-colors hover:bg-ink disabled:opacity-60"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white">
              <WhatsAppMark className="h-5 w-5" />
            </span>
            Apply via WhatsApp
          </button>
          <button
            ref={emailButton}
            type="submit"
            data-via="email"
            disabled={status === "submitting"}
            className="px-1 py-1.5 text-sm text-slate underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink disabled:cursor-wait"
          >
            {status === "submitting" ? "Sending by email…" : "Apply by email instead"}
          </button>
        </div>
        <p className="mt-4 text-xs text-mute">
          We&apos;ll come back to you with the terms in writing, and your own
          tracked link.
        </p>
      </div>
    </form>
  );
}
