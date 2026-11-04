import Image from "next/image";
import type { ReactNode } from "react";
import { heroGallery, type ProjectPhoto } from "@/lib/site";
import { Reveal } from "./Reveal";
import { Button, CallButton, Container, Kicker } from "./ui";

/**
 * The site's shared section patterns. Pages use these rather than restyling
 * the same thing each time, so the whole site reads as one product:
 * one way to close a page, one way to answer questions, one kind of tick.
 */

/* ------------------------------ PhotoCta -------------------------------- */
/**
 * How every page that has its own close ends: the ask, on a darkened job
 * photo (the same one everywhere unless a page has reason to differ), with
 * the assessment as the action and the call beside it. Marked data-own-cta,
 * which hides the footer's own call-to-action band so the ask appears once.
 */
export function PhotoCta({
  title,
  body,
  photo = heroGallery[2],
  note,
}: {
  title: string;
  body: string;
  photo?: ProjectPhoto;
  /** A small line under the buttons, e.g. the areas a page serves. */
  note?: ReactNode;
}) {
  return (
    <section
      data-own-cta
      className="relative isolate overflow-hidden py-24 text-center text-cream md:py-32"
    >
      <Image src={photo.src} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/75" />
      <Container>
        <Reveal>
          <h2 className="font-display mx-auto max-w-3xl text-4xl md:text-5xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-lg text-cream/75">{body}</p>
          <div className="mt-9 flex items-center justify-center gap-3">
            <Button href="/contact">Get a free power assessment</Button>
            <CallButton onDark />
          </div>
          {note && <p className="mx-auto mt-10 max-w-2xl text-sm text-cream/60">{note}</p>}
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------- FaqList -------------------------------- */
/**
 * Questions on the left, answers that open on tap on the right — there for
 * whoever needs them, not in everyone's way. The first is open. Pages add
 * their own FAQPage JSON-LD; this is only the visible part.
 */
export function FaqList({
  faqs,
  kicker = "Straight answers",
  title = "Questions people ask us.",
  note,
  aside,
  tinted = true,
}: {
  faqs: { q: string; a: string }[];
  kicker?: string;
  title?: string;
  /** Extra content under the title, e.g. helpful links. */
  aside?: ReactNode;
  /** Small print under the list. */
  note?: ReactNode;
  /** Tinted band (default) — off when the section above is already tinted. */
  tinted?: boolean;
}) {
  return (
    <section
      className={`border-t border-ink/10 py-16 md:py-24 ${tinted ? "bg-cream-200/40" : ""}`}
    >
      <Container className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal>
            <Kicker>{kicker}</Kicker>
            <h2 className="font-display mt-5 text-3xl text-ink">{title}</h2>
          </Reveal>
          {aside}
        </div>
        <div className="md:col-span-8">
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink/20 text-sm text-slate transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-slate">{f.a}</p>
              </details>
            ))}
          </div>
          {note && <p className="mt-6 text-sm text-mute">{note}</p>}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------ Checklist ------------------------------- */
/** The site's one list style: a green tick per line. */
export function Checklist({
  items,
  className = "",
  onDark = false,
}: {
  items: string[];
  className?: string;
  onDark?: boolean;
}) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-start gap-3 ${onDark ? "text-cream/85" : "text-ink"}`}
        >
          <svg
            viewBox="0 0 16 16"
            className={`mt-[5px] h-3.5 w-3.5 shrink-0 ${onDark ? "text-accent-300" : "text-accent"}`}
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
  );
}
