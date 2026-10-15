"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
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
import { LeadFallback } from "./LeadFallback";
import { trackEvent, trackLead } from "@/lib/track";

type Status = "idle" | "submitting" | "sent" | "error" | "undelivered";

/** Names this form in analytics events. */
const FORM = "assessment";

/**
 * The four steps, in the order an engineer would ask on a survey call. `fields`
 * lists what is checked before the visitor may move on — only fields with a
 * rule in VALIDATE can actually block them.
 */
const STEPS = [
  {
    title: "Where you are",
    description:
      "So we know where the system would go, and what kind of building it is.",
    fields: ["location", "propertyType"],
  },
  {
    title: "What must stay on",
    description:
      "Tick what matters to you. Rough numbers help, but nothing here is required.",
    fields: ["equipmentNotes", "backupDuration"],
  },
  {
    title: "What power costs you today",
    description: "A ballpark is fine — “Not sure” is a perfectly good answer.",
    fields: ["generatorUse", "fuelSpend", "electricityBill"],
  },
  {
    title: "Where to send it",
    description:
      "An engineer prepares your assessment and calls you back with it.",
    fields: ["name", "phone", "email"],
  },
] as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Field rules. A field without an entry is optional. Each returns the message
 * to show, or null when the value is fine. The API repeats the essentials —
 * this is for the visitor, not the only line of defence.
 */
const VALIDATE: Record<string, (value: string) => string | null> = {
  location: (v) =>
    v.trim().length < 2
      ? "Tell us your area and city — e.g. Lekki Phase 1, Lagos."
      : null,
  name: (v) => (v.trim().length < 2 ? "Please tell us your name." : null),
  phone: (v) => {
    const value = v.trim();
    if (!value) return "We need a number to call you back on.";
    const digits = value.replace(/\D/g, "").length;
    if (!/^[+\d\s().-]+$/.test(value) || digits < 10 || digits > 15) {
      return "That number doesn't look complete — e.g. 0805 077 7800 or +234 805 077 7800.";
    }
    return null;
  },
  email: (v) =>
    v.trim() && !EMAIL.test(v.trim())
      ? "That email address doesn't look right — check for a typo, or leave it blank."
      : null,
};

// Fields draw their own focus ring (red when invalid), so the site-wide
// focus outline is switched off here rather than doubled up.
const fieldBase =
  "mt-2 w-full rounded-xl border bg-cream px-4 py-3 text-ink transition-colors placeholder:text-mute/60 focus:outline-none focus-visible:outline-none focus:ring-2";
const fieldOk = "border-ink/15 focus:border-accent focus:ring-accent/30";
const fieldBad = "border-red-600/70 focus:border-red-600 focus:ring-red-600/25";
const label = "text-sm font-medium text-ink";

/**
 * The free power assessment, as four short cards instead of one long form.
 * It asks what an engineer would ask on a survey call — loads, generator
 * hours, fuel spend, backup wanted — so the visitor gets back a real
 * recommendation rather than a brochure.
 *
 * Every step stays mounted (inactive ones are `hidden`), so answers survive
 * moving back and forth and the final FormData holds all four steps.
 */
export function AssessmentForm() {
  const router = useRouter();
  const params = useSearchParams();
  // Handed over from the generator calculator — see /generator-cost
  const prefill = {
    fuelSpend: bandFromParam(params.get("fuel"), FUEL_SPEND),
    generatorUse: bandFromParam(params.get("gen"), GENERATOR_USE),
  };

  const formRef = useRef<HTMLFormElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sending = useRef(false); // blocks a double submit before React re-renders
  const moved = useRef(false); // no focus jump on first render

  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  // Kept so an undelivered enquiry can be re-sent by WhatsApp or email.
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [started, setStarted] = useState(false);
  // Whether the current card's rules all pass — drives the Next button's
  // colour. Computed silently: errors only appear once someone tries to move on.
  const [ready, setReady] = useState(false);

  const last = STEPS.length - 1;
  const busy = status === "submitting" || status === "sent";

  // ---- validation -----------------------------------------------------------
  const valueOf = (name: string) => {
    const el = formRef.current?.elements.namedItem(name);
    return el && "value" in el ? String(el.value) : "";
  };

  /** Checks one step and shows its errors. Returns the first bad field, if any. */
  function checkStep(index: number) {
    const found: Record<string, string> = {};
    for (const name of STEPS[index].fields) {
      const message = VALIDATE[name]?.(valueOf(name));
      if (message) found[name] = message;
    }
    setErrors((prev) => {
      const next = { ...prev };
      for (const name of STEPS[index].fields) delete next[name];
      return { ...next, ...found };
    });
    return Object.keys(found)[0] ?? null;
  }

  /** True when every rule on a step passes. Shows nothing. */
  const stepPasses = (index: number) =>
    STEPS[index].fields.every((name) => !VALIDATE[name]?.(valueOf(name)));

  function focusField(name: string) {
    // After React has un-hidden the step, or focus() lands on nothing.
    requestAnimationFrame(() => {
      const el = formRef.current?.elements.namedItem(name);
      if (el instanceof HTMLElement) el.focus();
    });
  }

  /** Re-checks a field as it is corrected, so its error clears straight away. */
  function handleInput(e: FormEvent<HTMLFormElement>) {
    if (!started) {
      setStarted(true);
      trackEvent("assessment_started");
    }
    setReady(stepPasses(step));
    const target = e.target as HTMLInputElement;
    if (!target.name || !errors[target.name]) return;
    const message = VALIDATE[target.name]?.(target.value) ?? null;
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[target.name] = message;
      else delete next[target.name];
      return next;
    });
  }

  // ---- moving between steps -------------------------------------------------
  function show(index: number) {
    if (index === step) return;
    moved.current = true;
    setDirection(index > step ? "forward" : "back");
    setStep(index);
    // The values are already in the DOM, so the new card's state is known now.
    setReady(stepPasses(index));
    if (index > furthest) {
      setFurthest(index);
      trackEvent("assessment_step", { step: index + 1 });
    }
  }

  /**
   * Back is always allowed. Forward only when every step in between passes —
   * so jumping ahead from the progress bar cannot skip a required field.
   */
  function goTo(target: number) {
    if (target === step || busy) return;
    if (target > step) {
      for (let i = step; i < target; i++) {
        const bad = checkStep(i);
        if (bad) {
          show(i);
          focusField(bad);
          return;
        }
      }
    }
    show(target);
  }

  // On each step change: focus the new card's heading, so keyboard and
  // screen-reader users start at the top of it, and bring the card back into
  // view if the visitor scrolled down to reach the Next button.
  useEffect(() => {
    if (!moved.current) return;
    const card = cardRef.current;
    const errored = card?.querySelector("[aria-invalid=true]");
    if (!errored) {
      document
        .getElementById(`step-${step}-title`)
        ?.focus({ preventScroll: true });
    }
    if (card && card.getBoundingClientRect().top < 72) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [step]);

  /**
   * Enter in a field moves on a step. Browsers only submit on Enter when the
   * form shows a submit button — steps 1–3 have "Next" (a plain button), so
   * without this Enter would do nothing until the last step.
   */
  function handleKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    const el = e.target as HTMLElement;
    if (
      e.key !== "Enter" ||
      step === last ||
      e.nativeEvent.isComposing ||
      !(el instanceof HTMLInputElement) ||
      el.type === "checkbox"
    ) {
      return;
    }
    e.preventDefault();
    goTo(step + 1);
  }

  // ---- submit ---------------------------------------------------------------
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || sending.current) return;

    // Enter in a field before the last step means "Next", not "send".
    if (step < last) {
      goTo(step + 1);
      return;
    }

    // The whole form is checked again here — the step buttons are a
    // convenience, not the guard. Go back to the first step that fails.
    for (let i = 0; i <= last; i++) {
      const bad = checkStep(i);
      if (bad) {
        show(i);
        focusField(bad);
        return;
      }
    }

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — bots fill hidden fields; humans don't. Fail quietly so they
    // think it worked, without polluting the conversion page's numbers.
    if (data.get("company")) {
      form.reset();
      setStep(0);
      return;
    }

    const payload = {
      ...Object.fromEntries(data.entries()),
      appliances: data.getAll("appliances").join(", "),
      // Which channel earned this lead — see lib/attribution.ts
      ...getAttribution(),
    };

    sending.current = true;
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const reply = await res.json().catch(() => ({}));
        if (reply.undelivered) {
          // Our side failed, not theirs — keep the answers and offer a route
          // that cannot fail. Counted, so a broken inbox shows up in GA4.
          setAnswers(payload);
          setStatus("undelivered");
          trackEvent("lead_delivery_failed", { form: FORM });
          return;
        }
        throw new Error(reply.error || "Request failed");
      }
      trackLead({
        property_type: String(data.get("propertyType") ?? ""),
        fuel_spend: String(data.get("fuelSpend") ?? ""),
      });
      setStatus("sent");
      // A real URL for the conversion, so Google Ads and Meta can both count it.
      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error && err.message !== "Request failed"
          ? err.message
          : "Your request didn't go through. Your answers are all still here — please try again, or call us.",
      );
    } finally {
      sending.current = false;
    }
  }

  // ---- field helpers --------------------------------------------------------
  const invalid = (name: string) =>
    errors[name]
      ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` }
      : {};
  const fieldClass = (name: string) =>
    `${fieldBase} ${errors[name] ? fieldBad : fieldOk}`;

  const remaining = last - step;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      noValidate
      aria-busy={busy}
      aria-label="Free power assessment"
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

      <div
        ref={cardRef}
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-ink/10 bg-cream shadow-xl shadow-ink/5"
      >
        {/* ---------------------------- progress ----------------------------
            Deliberately quiet: a thin bar and "2 of 4". Visited segments can
            be tapped to go back; the full wording is there for screen readers. */}
        <div className="flex items-center gap-4 px-5 pt-5 sm:px-8 sm:pt-6">
          <ol className="flex flex-1 gap-1.5" aria-label="Form progress">
            {STEPS.map((s, i) => {
              const current = i === step;
              const done = !current && i <= furthest;
              return (
                <li key={s.title} className="flex-1">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    disabled={current || i > furthest || busy}
                    aria-current={current ? "step" : undefined}
                    // Tall hit area, thin visible bar.
                    className="group block w-full py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default"
                  >
                    <span
                      aria-hidden="true"
                      className={`block h-1 rounded-full transition-colors duration-300 ${
                        current
                          ? "bg-accent"
                          : done
                            ? "bg-accent/35 group-enabled:group-hover:bg-accent/60"
                            : "bg-ink/10"
                      }`}
                    />
                    <span className="sr-only">
                      {`Step ${i + 1}, ${s.title}: ${
                        current ? "current step" : done ? "completed" : "not started"
                      }`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p
            aria-hidden="true"
            className="shrink-0 text-xs tabular-nums text-mute"
            data-step-count
          >
            {step + 1} of {STEPS.length}
          </p>
        </div>

        {/* Announces each move for screen readers. */}
        <p className="sr-only" aria-live="polite">
          {`Step ${step + 1} of ${STEPS.length}: ${STEPS[step].title}. ${
            remaining === 0 ? "Last step." : `${remaining} to go.`
          }`}
        </p>

        {/* ------------------------------ steps ------------------------------ */}
        <div className="px-5 pb-7 pt-4 sm:px-8 sm:pb-8 sm:pt-5">
          <Panel index={0} step={step} direction={direction}>
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
                  className={fieldClass("location")}
                  {...invalid("location")}
                />
                <FieldError name="location" errors={errors} />
              </div>
              <div>
                <label htmlFor="propertyType" className={label}>
                  Property type <Optional />
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  className={fieldClass("propertyType")}
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
          </Panel>

          <Panel index={1} step={step} direction={direction}>
            <fieldset>
              <legend className={`${label} mb-3`}>
                Tick everything that must stay on
              </legend>
              <div className="flex flex-wrap gap-2">
                {APPLIANCES.map((item) => (
                  <label key={item} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="appliances"
                      value={item}
                      className="peer sr-only"
                    />
                    <span className="inline-flex items-center rounded-full border border-ink/15 bg-cream px-3.5 py-2 text-sm text-slate transition-all duration-200 hover:border-ink/30 peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="equipmentNotes" className={label}>
                Anything else, or numbers that matter <Optional />
              </label>
              <textarea
                id="equipmentNotes"
                name="equipmentNotes"
                rows={2}
                className={fieldClass("equipmentNotes")}
                placeholder="e.g. 3 ACs (1.5hp), 2 fridges, a borehole pump, 12 workstations…"
              />
            </div>
            <div>
              <label htmlFor="backupDuration" className={label}>
                How long should it carry you without sun or grid? <Optional />
              </label>
              <select
                id="backupDuration"
                name="backupDuration"
                className={fieldClass("backupDuration")}
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
          </Panel>

          <Panel index={2} step={step} direction={direction}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="generatorUse" className={label}>
                  Generator use <Optional />
                </label>
                <select
                  id="generatorUse"
                  name="generatorUse"
                  className={fieldClass("generatorUse")}
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
                  Monthly fuel spend <Optional />
                </label>
                <select
                  id="fuelSpend"
                  name="fuelSpend"
                  className={fieldClass("fuelSpend")}
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
              <div className="sm:col-span-2">
                <label htmlFor="electricityBill" className={label}>
                  Monthly electricity bill <Optional />
                </label>
                <select
                  id="electricityBill"
                  name="electricityBill"
                  className={fieldClass("electricityBill")}
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
          </Panel>

          <Panel index={3} step={step} direction={direction}>
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
                  className={fieldClass("name")}
                  {...invalid("name")}
                />
                <FieldError name="name" errors={errors} />
              </div>
              <div>
                <label htmlFor="phone" className={label}>
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  required
                  autoComplete="tel"
                  placeholder="0805 077 7800"
                  className={fieldClass("phone")}
                  {...invalid("phone")}
                />
                <FieldError name="phone" errors={errors} />
              </div>
              <div className="sm:col-span-2">
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
                  inputMode="email"
                  autoComplete="email"
                  className={fieldClass("email")}
                  {...invalid("email")}
                />
                <FieldError name="email" errors={errors} />
              </div>
            </div>

            {status === "error" && (
              <p
                role="alert"
                className="rounded-xl border border-red-600/30 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {error}
              </p>
            )}
            {status === "undelivered" && (
              <LeadFallback
                answers={answers}
                intro="I'd like a free power assessment."
              />
            )}
          </Panel>
        </div>

        {/* --------------------------- navigation --------------------------- */}
        <div className="flex flex-col-reverse gap-3 border-t border-ink/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/25 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream disabled:opacity-50 sm:w-auto"
            >
              <span aria-hidden="true">←</span> Back
            </button>
          ) : (
            <p className="text-center text-xs text-mute sm:text-left">
              Free, with no obligation to buy.
            </p>
          )}

          {step < last ? (
            // Muted until the card is complete, then the brand colour — a
            // quiet "you can go on". Never disabled: pressing it early is
            // how the visitor finds out what's missing.
            //
            // The keys matter. Without them React reuses this <button> for
            // the submit button, flips its type to "submit" mid-click, and
            // the browser then submits the form from step 3.
            <button
              key="next"
              type="button"
              onClick={() => goTo(step + 1)}
              className={`group inline-flex w-full items-center justify-center gap-2 rounded-full border border-transparent px-7 py-3 text-sm font-medium transition-colors duration-300 sm:w-auto ${
                ready
                  ? "bg-accent text-cream shadow-sm hover:bg-ink"
                  : "bg-ink/10 text-ink/55 hover:bg-ink/15 hover:text-ink/75"
              }`}
            >
              Next
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </button>
          ) : (
            <button
              key="submit"
              type="submit"
              disabled={busy}
              className={`group inline-flex w-full items-center justify-center gap-2 rounded-full border border-transparent px-7 py-3 text-sm font-medium transition-colors duration-300 disabled:cursor-wait sm:w-auto ${
                ready || busy
                  ? "bg-accent text-cream shadow-sm hover:bg-ink disabled:opacity-80"
                  : "bg-ink/10 text-ink/55 hover:bg-ink/15 hover:text-ink/75"
              }`}
            >
              {status === "submitting" && (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream motion-reduce:animate-none"
                />
              )}
              {status === "submitting"
                ? "Sending your assessment…"
                : status === "sent"
                  ? "Sent — opening your confirmation…"
                  : "Get my free assessment"}
              {!busy && (
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-mute">
        Your details are only used to prepare your assessment — never sold.
      </p>
    </form>
  );
}

/** One step's card body. Inactive steps stay mounted — hidden, never reset. */
function Panel({
  index,
  step,
  direction,
  children,
}: {
  index: number;
  step: number;
  direction: "forward" | "back";
  children: ReactNode;
}) {
  const { title, description } = STEPS[index];
  const active = index === step;
  return (
    <section
      hidden={!active}
      aria-labelledby={`step-${index}-title`}
      className={`space-y-6 ${
        active ? (direction === "forward" ? "step-in-forward" : "step-in-back") : ""
      }`}
    >
      <div>
        <h3
          id={`step-${index}-title`}
          tabIndex={-1}
          className="font-display text-2xl text-ink focus:outline-none"
        >
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-slate">{description}</p>
      </div>
      {children}
    </section>
  );
}

function FieldError({
  name,
  errors,
}: {
  name: string;
  errors: Record<string, string>;
}) {
  if (!errors[name]) return null;
  return (
    <p id={`${name}-error`} className="mt-1.5 text-sm text-red-700">
      {errors[name]}
    </p>
  );
}

function Optional() {
  return <span className="font-normal text-mute">(optional)</span>;
}
