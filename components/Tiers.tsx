import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Container, Kicker } from "@/components/ui";
import { packages } from "@/lib/site";

/** Four rising bars, filled to the tier's level — scale at a glance. */
function LoadMeter({ level }: { level: number }) {
  return (
    <span
      className="flex items-end gap-[3px]"
      role="img"
      aria-label={`Tier ${level} of 4`}
    >
      {[1, 2, 3, 4].map((step) => (
        <span
          key={step}
          className={`w-[3px] rounded-full transition-all duration-500 ${
            step <= level
              ? "bg-accent"
              : "bg-ink/12 group-hover:bg-ink/20"
          }`}
          style={{ height: `${7 + step * 3}px` }}
        />
      ))}
    </span>
  );
}

/**
 * Solution tiers rather than a spec sheet. Customers choose by what they need
 * kept alive; the kVA and kWh are settled later, by the power audit.
 */
export function Tiers() {
  return (
    <section
      id="packages"
      className="relative scroll-mt-24 overflow-hidden bg-ink py-20 text-cream md:py-28"
    >
      {/* A low pool of light behind the deck */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(20,107,74,0.22), transparent 70%)",
        }}
      />

      <Container className="relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <Kicker className="text-accent-300">Packages</Kicker>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display mt-5 max-w-xl text-4xl text-cream md:text-5xl">
                Tell us what stays on. We&apos;ll size the rest.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <p className="max-w-sm text-cream/60">
              You shouldn&apos;t have to become a solar engineer to buy a
              system. Pick the loads that matter to you — we work out what it
              takes to carry them.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80} className="h-full">
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream/12 bg-ink-800 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/45 hover:bg-ink-700 hover:shadow-2xl hover:shadow-black/40">
                {/* Hairline that lights across the top on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent via-accent-300 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                />

                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-cream/15 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-cream/55 transition-colors duration-500 group-hover:border-accent/40 group-hover:text-accent-300">
                    {p.audience}
                  </span>
                  <LoadMeter level={p.level} />
                </div>

                <p className="font-display mt-7 text-sm text-cream/25">
                  0{i + 1}
                </p>
                <h3 className="font-display mt-2 text-[1.7rem] leading-none text-cream">
                  {p.name}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-cream/60">
                  {p.tagline}
                </p>

                <p className="mt-8 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-accent-300">
                  {p.builtOn ? `Everything in ${p.builtOn}, plus` : p.listLabel}
                </p>

                <ul className="mt-4 flex-1 divide-y divide-cream/8 border-y border-cream/8">
                  {p.covers.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 py-2.5 text-sm text-cream/85"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        className="mt-[3px] h-3.5 w-3.5 shrink-0 text-accent-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m3 8.5 3.2 3.2L13 5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-cream transition-colors duration-300 hover:text-accent-300"
                >
                  Size this for me
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-10 flex items-start gap-3 text-sm text-cream/50">
            <span
              aria-hidden="true"
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(20,107,74,0.7)]"
            />
            <span className="max-w-2xl">
              The exact kVA and kWh come out of your free power assessment — not
              off a price list. We survey the property, measure the real load,
              and only then put numbers to the system.
            </span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
