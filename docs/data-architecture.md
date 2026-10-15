# Leads, data and the road to a database

Written 2026-10-09. Deliberately **not built yet** — this records what exists,
where it breaks, and the order to add things when the business needs them.

## What exists today

| Piece | Where | Notes |
|---|---|---|
| Lead capture | `app/api/lead/route.ts` | One endpoint for the assessment and partner forms. Validates, then emails via Resend. |
| Delivery | Resend (email) | Needs `RESEND_API_KEY` + `LEAD_INBOX` in Vercel. **Without them, production now refuses the lead** and the form offers WhatsApp / call / email with the answers pre-filled. |
| Attribution | `lib/attribution.ts` | First + last touch, UTMs, gclid/fbclid, landing page, visit count — sent with every lead and shown in the email. |
| Measurement | GA4 `G-FF2M4ZVBJ6` (`components/Analytics.tsx`, `lib/track.ts`) | Events: `assessment_started`, `generate_lead`, `partner_application`, `contact_click` (phone / WhatsApp / email taps), `lead_delivery_failed`. Google Ads + Meta switch on by env var. |
| Content | `lib/site.ts`, `content/blog/*.md` | All business facts, case studies and segments in code. Changes need a commit + deploy. |
| Photos | `images/` originals → `npm run photos` → `public/` | Stripped of GPS, resized, watermarked. |

No database, no CMS, no CRM integration.

## The limits that matter

1. **Email is the only record of a lead.** If the inbox misses it, deletes it or
   nobody actions it, there is no second copy and no status.
2. **No pipeline.** Nothing tracks lead → surveyed → quoted → won, so cost per
   *sale* by channel (ROADMAP §31–32) cannot be measured.
3. **Every content change is a code change.** Fine at four case studies; painful
   at forty.

## Recommended order — add each only when its trigger is hit

**Step 1 — CRM as the lead store (trigger: more leads than one person can track
in an inbox, or the moment paid ads start).** This is the database, for now.
Post each lead from `deliver()` to the CRM's API *in addition to* the email
(email stays as the alert). Good fits for a Nigerian SME: HubSpot Free, Zoho
CRM (free tier), or Pipedrive. Pick whichever the sales team will actually
open daily — that matters more than features. Map the attribution fields to
CRM properties so channel → sale reporting works. ~half a day of code.

**Step 2 — offline conversions (trigger: Google Ads spend is meaningful).**
Every lead already carries `gclid`. When a deal is marked won in the CRM,
upload it to Google Ads so bidding optimises for signed jobs, not form fills
(ROADMAP, days 60–90). Most CRMs do this natively.

**Step 3 — a small database (trigger: you need something the CRM can't do,
e.g. a customer portal, service-visit history per installation, warranty
lookup).** Use Vercel Postgres/Neon or Supabase (free tiers suffice). Tables:
`leads`, `customers`, `installations`, `service_visits`. Write the lead row
first, then email, so a failed email never loses data.

**Step 4 — a headless CMS (trigger: non-developers need to publish case
studies or posts weekly).** Sanity or Payload. Move `projects`, `segments` and
blog posts out of `lib/site.ts` / `content/`; pages keep their current shape.

## What not to do yet

- Don't add a database just to store leads — a CRM does that and gives the
  sales team a pipeline at the same time.
- Don't build a customer portal before there is a servicing contract product
  (ROADMAP §38) to put in it.
