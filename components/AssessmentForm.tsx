"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  APPLIANCES,
  BACKUP_DURATION,
  ELECTRICITY_BILL,
  FUEL_SPEND,
  GENERATOR_USE,
  PROPERTY_TYPES,
  bandFromParam,
} from "@/lib/assessment";
import { getAttribution } from "@/lib/attribution";
import { trackEvent, trackLead } from "@/lib/track";

type Status = "idle" | "submitting" | "error";

const field =
  "mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-ink transition-colors placeholder:text-mute/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
const label = "text-sm font-medium text-ink";

/** A numbered step heading, so a long form still reads as a short journey. */
function Step({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-ink/10 pb-3">
      <span className="font-display text-sm text-accent">{n}</span>
      <h3 className="font-display text-lg text-ink">{title}</h3>
    </div>
  );
}

/**
 * The free power assessment. It asks what an engineer would ask on a survey
 * call — loads, generator hours, fuel spend, backup wanted — so the visitor
 * gets back a real recommendation rather than a brochure.
 */
export function AssessmentForm() {
  const router = useRouter();
  const params = useSearchParams();
  // Handed over from the generator calculator — see /generator-cost
  const prefill = {
    fuelSpend: bandFromParam(params.get("fuel"), FUEL_SPEND),
    generatorUse: bandFromParam(params.get("gen"), GENERATOR_USE),
  };
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const [started, setStarted] = useState(false);

  /** Fires once, the first time someone touches the form. */
  function handleFirstInput() {
    if (started) return;
    setStarted(true);
    trackEvent("assessment_started");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — bots fill hidden fields; humans don't. Fail quietly so they
    // think it worked, without polluting the conversion page's numbers.
    if (data.get("company")) {
      setStatus("idle");
      form.reset();
      return;
    }

    const payload = {
      ...Object.fromEntries(data.entries()),
      appliances: data.getAll("appliances").join(", "),
      // Which channel earned this lead — see lib/attribution.ts
      ...getAttribution(),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      trackLead({
        property_type: String(data.get("propertyType") ?? ""),
        fuel_spend: String(data.get("fuelSpend") ?? ""),
      });
      form.reset();
      // A real URL for the conversion, so Google Ads and Meta can both count it.
      router.push("/thank-you");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please call us or try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onInput={handleFirstInput}
      className="space-y-10"
      noValidate
    >
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {/* ---- 01 ---- */}
      <div className="space-y-5">
        <Step n="01" title="Where you are" />
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className={label}>
              Area &amp; city
            </label>
            <input
              id="location"
              name="location"
              required
              autoComplete="address-level2"
              placeholder="e.g. Lekki Phase 1, Lagos"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="propertyType" className={label}>
              Property type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              className={field}
              defaultValue=""
            >
              <option value="" disabled>
                Select a property type
              </option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ---- 02 ---- */}
      <div className="space-y-5">
        <Step n="02" title="What you need to keep running" />
        <fieldset>
          <legend className={`${label} mb-3`}>
            Tick everything that must stay on
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {APPLIANCES.map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="appliances"
                  value={item}
                  className="peer sr-only"
                />
                <span className="inline-flex items-center rounded-full border border-ink/15 bg-cream px-4 py-2 text-sm text-slate transition-all duration-200 hover:border-ink/30 peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="equipmentNotes" className={label}>
            Anything else, or numbers that matter
          </label>
          <textarea
            id="equipmentNotes"
            name="equipmentNotes"
            rows={3}
            className={field}
            placeholder="e.g. 3 ACs (1.5hp), 2 fridges, a borehole pump, 12 workstations…"
          />
        </div>

        <div>
          <label htmlFor="backupDuration" className={label}>
            How long should it carry you without sun or grid?
          </label>
          <select
            id="backupDuration"
            name="backupDuration"
            className={field}
            defaultValue=""
          >
            <option value="" disabled>
              Select a backup duration
            </option>
            {BACKUP_DURATION.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ---- 03 ---- */}
      <div className="space-y-5">
        <Step n="03" title="What power costs you today" />
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="generatorUse" className={label}>
              Generator use
            </label>
            <select
              id="generatorUse"
              name="generatorUse"
              className={field}
              defaultValue={prefill.generatorUse}
            >
              <option value="" disabled>
                Select generator use
              </option>
              {GENERATOR_USE.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fuelSpend" className={label}>
              Monthly fuel spend
            </label>
            <select
              id="fuelSpend"
              name="fuelSpend"
              className={field}
              defaultValue={prefill.fuelSpend}
            >
              <option value="" disabled>
                Select monthly fuel spend
              </option>
              {FUEL_SPEND.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="electricityBill" className={label}>
            Monthly electricity bill
          </label>
          <select
            id="electricityBill"
            name="electricityBill"
            className={field}
            defaultValue=""
          >
            <option value="" disabled>
              Select monthly electricity bill
            </option>
            {ELECTRICITY_BILL.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ---- 04 ---- */}
      <div className="space-y-5">
        <Step n="04" title="Where to send it" />
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={label}>
              Full name
            </label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              className={field}
            />
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
        <div>
          <label htmlFor="email" className={label}>
            Email{" "}
            <span className="font-normal text-mute">
              (optional — if you&apos;d like it in writing)
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={field}
          />
        </div>
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
          {status === "submitting"
            ? "Sending…"
            : "Get my free assessment"}
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </button>
        <p className="mt-4 text-xs text-mute">
          Free, with no obligation to buy. Your details are only used to prepare
          your assessment — never sold.
        </p>
      </div>
    </form>
  );
}
