"use client";

import { useSyncExternalStore } from "react";
import { site, whatsappLink } from "@/lib/site";
import type { LeadKind } from "@/lib/lead-message";
import { trackEvent } from "@/lib/track";
import { CallButton } from "./ui";
import { WhatsAppMark } from "./WhatsAppButton";

/**
 * Hands a finished form to WhatsApp, where the team prepares the quotation.
 *
 * A wa.me link only opens WhatsApp with the message written — the customer
 * still has to press Send. So the wording never says "sent", and the
 * submission is kept on this device until they have at least opened
 * WhatsApp with it, so closing the window loses nothing.
 */

export type Handoff = {
  kind: LeadKind;
  reference: string;
  message: string;
  /** Did the email copy reach the team's inbox? */
  delivered: boolean;
  createdAt: number;
  /** The customer opened WhatsApp with it (we can't know if they sent it). */
  opened?: boolean;
};

const KEY = "kayglo:handoff";
const EVENT = "kayglo:handoff";

// ---- device storage ---------------------------------------------------------
// localStorage can throw (private mode, blocked storage) — never let that
// break the form; the handoff still works, it just isn't remembered.

export function saveHandoff(h: Handoff) {
  try {
    localStorage.setItem(KEY, JSON.stringify(h));
    window.dispatchEvent(new Event(EVENT));
  } catch {}
}

function readRaw() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function update(patch: Partial<Handoff>) {
  const raw = readRaw();
  if (!raw) return;
  try {
    saveHandoff({ ...(JSON.parse(raw) as Handoff), ...patch });
  } catch {}
}

export function clearHandoff() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {}
}

const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

/** The saved handoff, or null. Null on the server, so hydration matches. */
export function useStoredHandoff(): Handoff | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Handoff;
  } catch {
    return null;
  }
}

// ---- the panel --------------------------------------------------------------

const NOUN: Record<LeadKind, string> = {
  assessment: "assessment",
  partner: "application",
};

export function WhatsAppHandoff({
  handoff,
  onRetry,
}: {
  handoff: Handoff;
  /** Offered when the email copy failed — try the website route again. */
  onRetry?: () => void;
}) {
  const noun = NOUN[handoff.kind];
  const email = `mailto:${site.contact.salesEmail}?subject=${encodeURIComponent(
    `Website ${noun} ${handoff.reference}`,
  )}&body=${encodeURIComponent(handoff.message)}`;

  return (
    <div
      role={handoff.delivered ? undefined : "alert"}
      className="rounded-2xl border border-accent/30 bg-accent/5 p-5 sm:p-6"
    >
      <p className="text-xs text-mute">Reference {handoff.reference}</p>
      <p className="font-display mt-1 text-xl text-ink">
        {handoff.delivered
          ? `Your ${noun} is with our team — now send it on WhatsApp.`
          : `Your ${noun} is ready to send on WhatsApp.`}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate">
        {handoff.delivered
          ? "That's where an engineer picks it up and prepares your quotation. Everything you answered is already written into the message — just press Send."
          : "It hasn't reached us from the website, so send it from WhatsApp instead. Everything you answered is already written into the message — just press Send. Your answers stay in the form in case you need them."}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={whatsappLink(handoff.message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            update({ opened: true });
            trackEvent("whatsapp_handoff", {
              form: handoff.kind,
              email_delivered: handoff.delivered,
            });
          }}
          className="inline-flex items-center gap-2.5 rounded-full bg-ever py-1.5 pl-1.5 pr-5 text-sm font-medium text-cream shadow-sm transition-[background-color,transform] duration-200 hover:bg-ink active:scale-[0.97] motion-reduce:transition-none"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white">
            <WhatsAppMark className="h-5 w-5" />
          </span>
          Send {noun} via WhatsApp
        </a>
        <CallButton size="sm" />
        <a
          href={email}
          className="px-2 text-sm font-medium text-accent underline-offset-4 hover:text-ink hover:underline"
        >
          Email it instead
        </a>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-2 text-sm font-medium text-slate underline-offset-4 hover:text-ink hover:underline"
          >
            Try the website again
          </button>
        )}
      </div>

      <details className="group mt-5 rounded-xl border border-ink/10 bg-cream">
        <summary className="cursor-pointer select-none px-4 py-2.5 text-sm text-slate marker:text-mute hover:text-ink">
          See the message
        </summary>
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words border-t border-ink/10 px-4 py-3 font-sans text-sm leading-relaxed text-ink">
          {handoff.message}
        </pre>
      </details>
    </div>
  );
}

/**
 * Shown above the assessment when a previous one on this device was never
 * taken to WhatsApp and never reached the inbox — so an abandoned handoff
 * is a reminder, not a loss.
 */
export function PendingHandoff({ kind }: { kind: LeadKind }) {
  const saved = useStoredHandoff();
  if (!saved || saved.kind !== kind || saved.delivered || saved.opened) return null;
  const when = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(saved.createdAt);
  return (
    <div className="mb-6 space-y-3">
      <p className="text-sm text-slate">
        You filled in an {NOUN[kind]} on {when} that hasn&apos;t reached us yet.{" "}
        <button
          type="button"
          onClick={clearHandoff}
          className="text-mute underline underline-offset-4 hover:text-ink"
        >
          Dismiss
        </button>
      </p>
      <WhatsAppHandoff handoff={saved} />
    </div>
  );
}

/**
 * The thank-you page's version: the latest submission on this device. Every
 * submission overwrites the saved one before redirecting here, so arriving
 * from a form always shows the one just made. With nothing saved it renders
 * nothing, and the page's general WhatsApp link stands in.
 */
export function RecentHandoff() {
  const saved = useStoredHandoff();
  if (!saved) return null;
  return <WhatsAppHandoff handoff={saved} />;
}
