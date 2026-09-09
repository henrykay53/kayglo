"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/track";
import { partnerProgramme } from "@/lib/site";

type Status = "idle" | "submitting" | "error";

const field =
  "mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-ink transition-colors placeholder:text-mute/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
const label = "text-sm font-medium text-ink";

export function PartnerForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("company")) {
      setStatus("idle");
      form.reset();
      return;
    }

    const payload = {
      ...Object.fromEntries(data.entries()),
      enquiryType: "Partner programme",
      ...getAttribution(),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      trackEvent("partner_application", {
        partner_type: String(data.get("partnerType") ?? ""),
      });
      form.reset();
      router.push("/thank-you");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please call us or try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
