"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  FUEL_SPEND,
  GENERATOR_USE,
  fuelBandFor,
  generatorBandFor,
  naira,
} from "@/lib/assessment";
import { generatorSizes } from "@/lib/site";
import { trackEvent } from "@/lib/track";

const YEARS = 5;

const grouped = (n: number) => n.toLocaleString("en-NG");
const digitsOnly = (v: string) => Math.max(0, Number(v.replace(/\D/g, "")) || 0);

const field =
  "mt-2 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-ink transition-colors placeholder:text-mute/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
const label = "text-sm font-medium text-ink";

/**
 * The generator, priced honestly.
 *
 * It deliberately does not quote a solar system — the point is to make the
 * running cost of the status quo visible, then hand the visitor into the free
 * assessment with their own numbers already filled in.
 */
export function GeneratorCalculator() {
  const [sizeIndex, setSizeIndex] = useState(3); // 10 kVA
  const [fuel, setFuel] = useState(250_000);
  const [hours, setHours] = useState(8);
  const [servicing, setServicing] = useState(generatorSizes[3].servicing);
  /** True once the visitor edits servicing, so changing size stops overwriting it. */
  const servicingTouched = useRef(false);
  const engaged = useRef(false);

  function engage() {
    if (engaged.current) return;
    engaged.current = true;
    trackEvent("calculator_started");
  }

  function pickSize(index: number) {
    engage();
    setSizeIndex(index);
    if (!servicingTouched.current) setServicing(generatorSizes[index].servicing);
  }

  const totals = useMemo(() => {
    const fuelYear = fuel * 12;
    const serviceYear = servicing * 12;
    const year = fuelYear + serviceYear;
    return {
      fuelYear,
      serviceYear,
      year,
      span: year * YEARS,
      hoursYear: Math.round(hours * 365),
      perHour: hours > 0 ? year / (hours * 365) : 0,
    };
  }, [fuel, servicing, hours]);

  const handoff = `/contact?fuel=${fuelBandFor(fuel)}&gen=${generatorBandFor(hours)}`;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* ---------------- inputs ---------------- */}
      <div className="lg:col-span-5">
        <div className="space-y-6 rounded-3xl border border-ink/10 bg-cream-200/40 p-6 sm:p-8">
          <div>
            <label htmlFor="genSize" className={label}>
              Generator size
            </label>
            <select
              id="genSize"
              className={field}
              value={sizeIndex}
              onChange={(e) => pickSize(Number(e.target.value))}
            >
              {generatorSizes.map((g, i) => (
                <option key={g.kva} value={i}>
                  {g.kva}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fuel" className={label}>
              What you spend on fuel each month
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 pt-[2px] text-ink/50">
                ₦
              </span>
              <input
                id="fuel"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={grouped(fuel)}
                onChange={(e) => {
                  engage();
                  setFuel(digitsOnly(e.target.value));
                }}
                className={`${field} pl-9`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="hours" className={label}>
              Hours it runs on a typical day
              <span className="ml-2 font-normal text-mute">{hours} hrs</span>
            </label>
            <input
              id="hours"
              type="range"
              min={1}
              max={24}
              step={1}
              value={hours}
              onChange={(e) => {
                engage();
                setHours(Number(e.target.value));
              }}
              className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink/15 accent-accent"
            />
            <div className="mt-2 flex justify-between text-xs text-mute">
              <span>1 hr</span>
              <span>24 hrs</span>
            </div>
          </div>

          <div>
            <label htmlFor="servicing" className={label}>
              Servicing, oil &amp; repairs each month
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 pt-[2px] text-ink/50">
                ₦
              </span>
              <input
                id="servicing"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={grouped(servicing)}
                onChange={(e) => {
                  engage();
                  servicingTouched.current = true;
                  setServicing(digitsOnly(e.target.value));
                }}
                className={`${field} pl-9`}
              />
            </div>
            <p className="mt-2 text-xs text-mute">
              Estimated from the size you picked — change it to what you
              actually pay.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- results ---------------- */}
      <div className="lg:col-span-7">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-8 text-cream sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 60% at 80% 0%, rgba(20,107,74,0.28), transparent 70%)",
            }}
          />
          <div className="relative">
            <p className="kicker text-accent-300">Your generator costs you</p>

            <p
              className="font-display mt-5 text-5xl leading-none text-cream md:text-6xl"
              aria-live="polite"
            >
              {naira(totals.year)}
            </p>
            <p className="mt-3 text-cream/60">every year, before it breaks down</p>

            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 sm:grid-cols-2">
              {[
                { label: "Fuel a year", value: naira(totals.fuelYear) },
                {
                  label: "Servicing & repairs a year",
                  value: naira(totals.serviceYear),
                },
                {
                  label: `Over ${YEARS} years`,
                  value: naira(totals.span),
                  strong: true,
                },
                {
                  label: "Hours it runs a year",
                  value: `${totals.hoursYear.toLocaleString("en-NG")} hrs`,
                },
              ].map((row) => (
                <div key={row.label} className="bg-ink p-5">
                  <dt className="text-xs text-cream/50">{row.label}</dt>
                  <dd
                    className={`font-display mt-1.5 ${
                      row.strong ? "text-2xl text-accent-300" : "text-xl text-cream"
                    }`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-sm leading-relaxed text-cream/60">
              And that is only what leaves your pocket. It doesn&apos;t count the
              noise, the fumes, the fuel queues, the hours lost when it
              won&apos;t start, or what it costs to replace the machine itself.
            </p>

            <div className="mt-9 border-t border-cream/10 pt-8">
              <p className="font-display text-2xl text-cream">
                That money is already being spent. The only question is what
                it&apos;s buying.
              </p>
              <p className="mt-3 text-sm text-cream/60">
                Solar is a one-time cost that replaces most of it. Tell us what
                you need to keep running and we&apos;ll size the system, price
                it honestly, and show you the payment options — free.
              </p>
              <Link
                href={handoff}
                onClick={() =>
                  trackEvent("calculator_to_assessment", {
                    annual_cost: totals.year,
                    fuel_band: FUEL_SPEND[fuelBandFor(fuel)],
                    generator_band: GENERATOR_USE[generatorBandFor(hours)],
                  })
                }
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-cream hover:text-ink"
              >
                Get my free power assessment
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <p className="mt-4 text-xs text-cream/40">
                Your numbers carry over — we won&apos;t ask twice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
