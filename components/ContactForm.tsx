"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const services = [
  "Residential Solar",
  "Battery Storage",
  "EV Charging",
  "Not sure yet",
];

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot — bots fill hidden fields; humans don't.
    if (data.company) {
      setStatus("success");
      form.reset();
      return;
    }

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong. Please call us or try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-ever/30 bg-ever/5 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ever text-2xl text-cream">
          ✓
        </div>
        <h3 className="font-display mt-5 text-2xl text-ink">
          Thank you — we&apos;ll be in touch.
        </h3>
        <p className="mt-3 text-slate">
          A member of our team will reach out within one business day to arrange
          your consultation.
        </p>
      </div>
    );
  }

  const field =
    "mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-ink transition-colors placeholder:text-mute/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";
  const label = "text-sm font-medium text-ink";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot */}
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
            Full name
          </label>
          <input id="name" name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={label}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="postal" className={label}>
            Property ZIP code
          </label>
          <input
            id="postal"
            name="postal"
            autoComplete="postal-code"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className={label}>
          I&apos;m interested in
        </label>
        <select id="service" name="service" className={field} defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          Tell us about your home
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={field}
          placeholder="Roof type, average monthly bill, goals (savings, backup, EV)…"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-gold disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Request my consultation"}
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          →
        </span>
      </button>
      <p className="text-xs text-mute">
        We respect your privacy. Your details are only used to prepare your
        consultation — never sold.
      </p>
    </form>
  );
}
