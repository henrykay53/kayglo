"use client";

import { useSyncExternalStore } from "react";
import { whatsappLink } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { Kicker } from "./ui";
import { WhatsAppMark } from "./WhatsAppButton";
import { useStoredHandoff, type Handoff } from "./WhatsAppHandoff";

const noSubscribe = () => () => {};
/** False during server render and hydration, true after. */
const useHydrated = () =>
  useSyncExternalStore(noSubscribe, () => true, () => false);

type Copy = { kicker: string; title: string; body: string };

/**
 * The confirmation, worded for how the customer actually sent it. WhatsApp
 * only opens with the message written — it can't tell us they pressed
 * Send — so that version asks them to, rather than claiming it arrived.
 */
function copyFor(h: Handoff | null): Copy {
  if (!h) {
    return {
      kicker: "Assessment received",
      title: "Your assessment is on its way.",
      body: "Thank you — we have everything we need to start sizing your system. Here's exactly what happens next.",
    };
  }
  const noun = h.kind === "partner" ? "application" : "assessment";
  const after =
    h.kind === "partner"
      ? "our partnerships team picks it up there and comes back to you with the terms in writing."
      : "an engineer picks it up there and prepares your quotation.";

  if (h.channel === "whatsapp") {
    return h.opened
      ? {
          kicker: "Opened in WhatsApp",
          title: "Last step: press Send in WhatsApp.",
          body: `Your ${noun} is written into a message to our team. Once you press Send, ${after}`,
        }
      : {
          kicker: "Ready for WhatsApp",
          title: "Last step: send it on WhatsApp.",
          body: `Your browser didn't open WhatsApp, so tap the button below — your answers are already written into the message. Once you press Send, ${after}`,
        };
  }
  return h.kind === "partner"
    ? {
        kicker: "Application received",
        title: "Your application is with our team.",
        body: "It reached us by email. We'll come back to you with the terms in writing, and your own tracked link.",
      }
    : {
        kicker: "Assessment received",
        title: "Your assessment is with our team.",
        body: "It reached us by email. An engineer will size your system and get back to you within one business day. Here's exactly what happens next.",
      };
}

export function ThankYouHero() {
  const hydrated = useHydrated();
  const saved = useStoredHandoff();
  // An email that failed is handled on the form itself, never here.
  const h = saved && (saved.channel === "whatsapp" || saved.delivered) ? saved : null;
  const copy = copyFor(h);
  const noun = h?.kind === "partner" ? "application" : "assessment";

  const openWhatsApp = () =>
    trackEvent("whatsapp_handoff", { form: h?.kind, from: "thank_you" });

  return (
    // Hidden until we know which version to show, so it never flashes the
    // generic wording before the real one.
    <div className={hydrated ? "" : "invisible"}>
      <Kicker className="mt-8 inline-flex">{copy.kicker}</Kicker>
      <h1 className="font-display mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
        {copy.title}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-slate">{copy.body}</p>
      {h && <p className="mt-3 text-sm text-mute">Reference {h.reference}</p>}

      {h?.channel === "whatsapp" && (
        <div className="mt-8 max-w-2xl">
          <a
            href={whatsappLink(h.message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={openWhatsApp}
            className="inline-flex items-center gap-2.5 rounded-full bg-ever py-1.5 pl-1.5 pr-6 text-sm font-medium text-cream shadow-sm transition-[background-color,transform] duration-200 hover:bg-ink active:scale-[0.97] motion-reduce:transition-none"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white">
              <WhatsAppMark className="h-5 w-5" />
            </span>
            {h.opened ? "Open WhatsApp again" : "Open WhatsApp"}
          </a>
          <details className="mt-5 rounded-xl border border-ink/10 bg-cream">
            <summary className="cursor-pointer select-none px-4 py-2.5 text-sm text-slate marker:text-mute hover:text-ink">
              See the message
            </summary>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words border-t border-ink/10 px-4 py-3 font-sans text-sm leading-relaxed text-ink">
              {h.message}
            </pre>
          </details>
        </div>
      )}

      {h?.channel === "email" && (
        <p className="mt-6 text-sm text-slate">
          Prefer WhatsApp?{" "}
          <a
            href={whatsappLink(h.message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={openWhatsApp}
            className="font-medium text-accent underline underline-offset-4 hover:text-ink"
          >
            Send your {noun} there too
          </a>
          .
        </p>
      )}
    </div>
  );
}
