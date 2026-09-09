import { Reveal } from "@/components/Reveal";
import { Container, Kicker } from "@/components/ui";
import { credentials, site } from "@/lib/site";

/**
 * The verifiable facts (§28). Solar is a high-trust purchase — a stranger is
 * handing over millions and letting a crew wire their building. Each block only
 * renders once the fact behind it exists, so the section grows as the record
 * does and never claims anything unsupplied.
 */
export function Credentials() {
  const { registration, founded, warranty, brands, standards, team, payment } =
    credentials;

  const facts = [
    registration && { label: "Registered company", value: registration },
    founded && { label: "Trading since", value: String(founded) },
    { label: "Office", value: `${site.contact.address.street}, ${site.contact.address.city}` },
    { label: "Hours", value: site.contact.hours },
  ].filter(Boolean) as { label: string; value: string }[];

  const hasBlocks =
    warranty.length > 0 || brands.length > 0 || standards.length > 0;

  return (
    <section className="border-t border-ink/10 py-16 md:py-24">
      <Container>
        <Reveal>
          <Kicker>The details you can check</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display mt-5 max-w-2xl text-3xl text-ink md:text-4xl">
            You&apos;re trusting us with your building. Here&apos;s who
            you&apos;re dealing with.
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-cream p-6">
                <dt className="kicker text-mute">{f.label}</dt>
                <dd className="mt-2 text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {hasBlocks && (
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {warranty.length > 0 && (
              <Reveal>
                <h3 className="font-display text-xl text-ink">What&apos;s warranted</h3>
                <dl className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                  {warranty.map((w) => (
                    <div key={w.item} className="flex justify-between gap-4 py-3">
                      <dt className="text-slate">{w.item}</dt>
                      <dd className="whitespace-nowrap font-medium text-ink">
                        {w.term}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}

            {brands.length > 0 && (
              <Reveal delay={90}>
                <h3 className="font-display text-xl text-ink">
                  Equipment we supply
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {brands.map((b) => (
                    <li
                      key={b}
                      className="rounded-full border border-ink/15 px-3.5 py-1.5 text-sm text-slate"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-mute">
                  Genuine, warranty-backed stock only — never counterfeit.
                </p>
              </Reveal>
            )}

            {standards.length > 0 && (
              <Reveal delay={180}>
                <h3 className="font-display text-xl text-ink">
                  How we install
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {standards.map((st) => (
                    <li key={st} className="flex items-start gap-2.5 text-slate">
                      <svg
                        viewBox="0 0 16 16"
                        className="mt-[6px] h-3.5 w-3.5 shrink-0 text-accent"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m3 8.5 3.2 3.2L13 5" />
                      </svg>
                      {st}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        )}

        {team.length > 0 && (
          <div className="mt-16">
            <Reveal>
              <h3 className="font-display text-xl text-ink">
                The people who do the work
              </h3>
            </Reveal>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((person, i) => (
                <Reveal key={person.name} delay={i * 80}>
                  <p className="font-display text-lg text-ink">{person.name}</p>
                  <p className="mt-0.5 text-sm text-accent">{person.role}</p>
                  {person.note && (
                    <p className="mt-2 text-sm text-slate">{person.note}</p>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <Reveal delay={120}>
          <div className="mt-16 border-t border-ink/10 pt-8">
            <h3 className="font-display text-xl text-ink">Ways to pay</h3>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
              {payment.map((option) => (
                <li key={option} className="text-slate">
                  {option}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
