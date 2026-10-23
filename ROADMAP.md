# Kayglo Citadel — Growth Roadmap

Living document. Updated as milestones are crossed — every session that moves
something forward updates this file and the log at the bottom.

**Last updated:** 2026-10-09
**Strategy source:** the 43-point marketing plan (referenced below as §n)

| Legend | |
|---|---|
| `[ ]` | Open |
| `[~]` | In progress |
| `[x]` | Done |
| `[-]` | Dropped — decision recorded, not an oversight |
| **K** | Kayglo's to do (business, accounts, content, sales) |
| **C** | Claude's to do (code, site, structure) |

---

## Where we are

**Site:** 14 routes live on `staging`. Positioning (§2), segmentation (§3),
packages (§4), the free assessment offer (§5), the conversion site (§6),
the generator campaign (§24–25) and measurement plumbing (§31) are built.

**The bottleneck is no longer the website.** It is the off-site machinery —
Google Business Profile, CRM, WhatsApp, ad accounts — plus the real business
facts the site is still carrying placeholders for.

**Measurement is live.** GA4 `G-FF2M4ZVBJ6` is firing on production.

**Google Business Profile is created but not yet verified** — approval is
stuck. The site already carries the real NAP (phone, emails, Ajah address);
keep the profile identical to it, character for character, or local SEO
reads them as two businesses (§10).

**Still blocking a launch:** lead email delivery — `RESEND_API_KEY` and
`LEAD_INBOX` are empty locally and unconfirmed in Vercel (see Phase 0). The
invented stats are now gated off the site; real testimonials still missing.

---

## Phase 0 — Make it safe to send traffic

Nothing else on this roadmap matters until this is clear. The site currently
publishes claims that are not true, and no amount of traffic should reach it
in that state.

- [x] **C** Remove the hardcoded `aggregateRating` (4.9, 214 reviews) from the
      LocalBusiness schema — fabricated review markup is a Google spam-policy
      manual action, and false to customers
- [x] **C** Rewire rating markup so it only appears when real review data exists
      (`site.reviews`, null until real)
- [x] **C** Gate the three placeholder testimonials — they were invented copy
      published as real customer quotes. Now hidden until `verified: true`
- [ ] **K** **Lead delivery** — create the Resend key, verify the
      kayglocitadel.com domain, set `RESEND_API_KEY`, `LEAD_INBOX` and
      `LEAD_FROM` in Vercel, redeploy, then submit one real test on the live
      form. Until then production shows visitors the WhatsApp/call fallback
- [ ] **K** Case-study locations — photo GPS puts the "Maitama, Abuja" office
      job in Ajah, Lagos, and the "Ikoyi" home in the Lekki–Chevron corridor.
      Confirm the real locations and correct `lib/site.ts`
- [x] **C** Gate the four invented stats (`verified` flag) — homepage band
      shows promises instead; About no longer shows them ✅ 2026-10-09
- [ ] **K** Get 3+ real testimonials with permission, then flip `verified`
- [ ] **K** Decide the four homepage stats: supply true numbers or cut the band
      (currently "4.9/5", "25 yr", "500+", "38 MWh" — all invented)
- [x] **K** Real NAP — phone, emails, address ✅ in `lib/site.ts` 2026-10-01
- [ ] **K** Remaining NAP details — exact map coordinates (copy the GBP pin),
      real Instagram / LinkedIn URLs, postal code if the profile lists one
- [ ] **K** Verify the four case studies against job notes
- [ ] **K** Surulere project — real name, location, metrics
- [ ] **K** Servicing-cost figures for the generator calculator
- [-] **K** Privacy policy to name GA4 and the Meta pixel — dropped 2026-10-17: privacy & terms pages removed by decision. Revisit before running Google Ads / Meta ads, whose policies expect one

---

## Week 1 — Integrity and measurement

**Milestone:** the site tells only the truth, and every visit is attributed.

| Day | Owner | Task |
|---|---|---|
| 1 | K | Gather real business facts: phone, email, address, coordinates, socials, warranty terms, registration number |
| 1 | C | Strip the fake rating schema; make rating data-driven |
| 2 | K | Decide the stats band — true numbers or remove |
| 2 | C | Apply real facts to `lib/site.ts`; ~~update privacy policy~~ — privacy & terms pages removed 2026-10-17 by decision |
| 3 | K | ~~Create GA4 property → `G-` ID~~ ✅ `G-FF2M4ZVBJ6`, verified firing locally |
| 3 | K | Google Ads conversion action → `AW-` ID + label — **deferred**, account exists (262-501-4405), not needed until campaigns run in Week 4 |
| 3 | K | Create Meta pixel → ID — **deferred**, needed before retargeting |
| 4 | K | ~~`NEXT_PUBLIC_GA_ID` into Vercel → redeploy~~ ✅ verified live on production 2026-09-14 |
| 4 | K | Mark `generate_lead` as a key event — waiting on GA4's events table to populate |
| 5 | K | Verify case studies; correct the Surulere entry; set servicing figures |
| 5 | K | Write the tagging convention into a note the whole team can see |
| 5 | K | Tag every link already in the wild — Instagram bio, WhatsApp profile, email signatures |

---

## Week 2 — Trust and proof (§7, §10, §26, §28)

**Milestone:** a stranger can verify Kayglo is a real engineering business.

| Day | Owner | Task |
|---|---|---|
| 6 | K | ~~Create the Google Business Profile~~ ✅ created 2026-10-01 — **verification still pending** ← **blocking** |
| 7 | K | Complete it aggressively — photos, services, service areas, hours, WhatsApp link. **Tag the website link**: `?utm_source=gbp&utm_medium=profile&utm_campaign=maps` (after verification) |
| 8 | K | Call 5 past customers: ask for a testimonial and permission to use it |
| 8 | C | ~~Build the trust page structure~~ ✅ done early — credentials section on `/about` |
| 9 | K | Film 2 video testimonials — specific numbers, not "great service" |
| 9 | C | ~~Video-first testimonial support~~ ✅ done early — video or YouTube, gated on `verified` |
| 10 | K | Supply trust facts into `credentials` in `lib/site.ts`: registration number, warranty terms, brands used, installation standards, team |
| 10 | C | ~~Partner programme page (§21)~~ ✅ done early — `/partners` with application form |

---

## Week 3 — Sales machinery (§13–§18)

**Milestone:** a lead cannot be lost, and no one quotes before diagnosing.

| Day | Owner | Task |
|---|---|---|
| 11 | K | Choose the CRM; build the 12-stage pipeline (§14) |
| 12 | K | WhatsApp Business — greeting, quick replies, catalog, qualification questions (§13) |
| 13 | K | Write the sales script — diagnose first, never price on first contact (§17, §18) |
| 14 | K | Adopt the 5-minute speed-to-lead policy; separate the sales roles (§15, §16) |
| 15 | K | Set `partnerProgramme.rate` and `.terms` in `lib/site.ts`; open 5 partner conversations (§20, §21) |

---

## Week 4 — Launch acquisition (§11, §12)

**Milestone:** two paid channels running, each measurable to the naira.

| Day | Owner | Task |
|---|---|---|
| 16 | K | ⚠️ **First:** write the privacy policy & terms copy — removed 2026-10-17, but Google Ads, Meta lead ads, GA4 and the NDPA 2023 expect them once you collect leads from ads. Claude rebuilds the pages and lifts the redirects in `next.config.ts` |
| 16 | K | Build 6 intent-based Google Search campaigns (§11) |
| 17 | K | Write ad copy; map each campaign to its landing page |
| 18 | K | Meta lead ads + click-to-WhatsApp ads (§12) |
| 19 | K | Build retargeting audiences from pixel traffic |
| 20 | K | Launch. Stand up the weekly dashboard (§31) |

Before spending: establish maximum allowable CAC from gross profit per job (§32).

---

## Days 30–60 — Find the winners (§35)

- [ ] **K** Measure leads → qualified → surveys → proposals → sales, by channel
- [ ] **K** Interview 10–20 past customers; feed their words back into the copy (§34)
- [ ] **K** Document every new installation: 1 video, 5 photos, 1 testimonial, 1 case study (§27)
- [ ] **K** Free on-site power audits in business clusters (§23)
- [ ] **K** Estate and resident-association activations (§22)
- [ ] **K** Sign a finance partner (§19)
- [ ] **C** New case studies as installations complete

---

## Days 60–90 — Scale (§36)

- [ ] **K** Increase spend on channels producing profitable customers
- [ ] **K** Cut or fix channels producing cheap but unqualified leads
- [ ] **K** Upload closed deals to Google Ads as offline conversions, so it
      optimises for signed jobs rather than form fills
- [ ] **K** Launch maintenance contracts as recurring revenue (§38)
- [ ] **K** Formal customer referral programme (§21)

---

## Claude's queue

- [x] Partner programme page (§21) — `/partners`, per-partner tracked links,
      application form routed to the lead inbox with its own subject line
- [x] Video-first testimonials (§26) — video or YouTube, featured layout,
      gated behind `verified`
- [x] Trust page (§28) — credentials section on `/about`; every block hides
      until the fact behind it is supplied
- [x] Rating markup driven by real reviews (§10, §28)
- [x] Lead capture fails honestly + pre-filled WhatsApp/call/email fallback ✅ 2026-10-09
- [x] Photos: GPS stripped, resized, watermarked (`npm run photos`) ✅ 2026-10-09
- [x] Homes / Business / Commercial / About rebuilt around real photography ✅ 2026-10-09
- [x] `contact_click` + `lead_delivery_failed` events; schema type fixed ✅ 2026-10-09
- [ ] Mark `contact_click` as a key event in GA4 (K — in the GA4 admin)
- [ ] New case studies as jobs complete (§7)
- [ ] Wire real reviews into the schema once the GBP has them
- [x] Persistent WhatsApp (§13) — dropped 2026-09-09, **reinstated 2026-10-23 on request**: floating button (`components/WhatsAppButton.tsx`), number in `site.contact.whatsapp`
- [-] Dedicated location pages (§10) — dropped 2026-09-09; the projects page
      already carries installation locations and covers the same search intent

---

## Log

- **2026-10-23 (c)** — Forms now hand off to WhatsApp. Both lead forms
  (free power assessment on /contact, partner application on /partners) build
  a sectioned message with every answer, a reference (`KC-YYMMDD-XXXX`, also
  in the email subject) and a Lagos timestamp, and open it addressed to
  `site.contact.whatsapp` — the customer still presses Send. Email via
  /api/lead still runs first; if it fails (it does today: no Resend key), the
  customer stays on the form with the WhatsApp button and every answer kept,
  and an unsent assessment is remembered on the device. New GA4 event:
  `whatsapp_handoff`. Formatter: `lib/lead-message.ts`; panel:
  `components/WhatsAppHandoff.tsx` (replaces LeadFallback).

- **2026-10-23 (b)** — Each case study page (/projects/[slug]) now tells its
  story as a connected roadmap: the seven chapters, Before → After, are
  numbered milestones on one spine (zig-zag on desktop, left rail on mobile)
  that lights as you scroll; static and fully lit under reduced motion.
  /projects keeps its layout; its meta description was fixed (it still
  described US "vineyard estates").
  Phone CTAs are now one icon-only `CallButton` in the header's ink — the
  written number is kept where it is contact info (footer NAP, contact card,
  thank-you, in-sentence mentions).

- **2026-10-23** — Mobile hero 1,523px → 1,080px tall (375px wide): proof
  points became one row of tappable chips on phones (desktop band unchanged),
  copy cut from 76 to 50 words, footnote removed. Floating WhatsApp button
  added. Service areas now 13 states + FCT: added Bayelsa, Anambra, Abia,
  Akwa Ibom (Uyo, as a city) and Cross River; Oyo, Kwara and Rivers were
  already listed. **K: confirm +234 805 077 7800 is on WhatsApp.**

- **2026-10-09 (c)** — Less talk, more work. Homepage below the hero now goes
  straight to four photo service cards (swipe row on phones), "Solar for"
  pathways, and a photo grid of the four installations linking to their case
  studies; process cut to one-liners; the manifesto paragraph removed.
  Unverified savings figures no longer appear on the homepage (still on the
  case-study pages, pending verification). Business trade cards got a
  trade-specific icon set (`components/TradeIcon.tsx`).

- **2026-10-09 (b)** — Mobile + contact pass. Mobile menu root cause: a fixed
  24rem cap with overflow hidden sliced "About" and hid the CTA; now capped to
  the dynamic viewport below the sticky header, scrolls inside itself, inert
  when closed, Escape closes. Assessment form rebuilt as four validated steps
  (same fields, payload and endpoint); new `assessment_step` event shows where
  people drop off. Contact page rebuilt around channels + after-sales route.
  Hero CTAs full-width on phones.

- **2026-10-09** — Marketing pass. Found the lead route ignored Resend errors
  (the SDK returns them, it does not throw) and logged leads to the console
  when unconfigured — visitors saw "thank you" either way. Now a 502 plus a
  pre-filled WhatsApp/call/email fallback. Found 9 public photos carrying
  customers' GPS positions; all photos now re-exported clean, watermarked,
  8.2 MB → 2.9 MB. Invented stats gated. Homes/Business/Commercial/About got
  real photography; mobile header got a Call button; mobile menu CTA was
  clipped and is fixed; Proof stacks no longer overlap their captions.
  LocalBusiness schema type was invalid ("SolarInstallation") — now
  Electrician + Store. Future data plan: `docs/data-architecture.md`.

- **2026-10-06** — Correction: the Google Business Profile is **not** yet
  verified; approval is stuck. Reviews and the rating schema wait on it.

- **2026-10-01** — Google Business Profile created. Real NAP applied
  site-wide the same day: +234 805 077 7800, info@/sales@/support@kayglocitadel.com,
  House 1, Kelly John Avenue Infinity Estate, Ajah, Lagos.

- **2026-09-14** — GA4 live: `G-FF2M4ZVBJ6` in `.env.local`, tag verified
  loading and the full funnel confirmed firing (`page_view`, `form_start`,
  `generate_lead`). Ads and Meta deferred by decision — the site degrades
  gracefully without them. Footer rebuilt (LinkedIn removed, serviced states
  added, assessment CTA band); homepage CTA card centred.

- **2026-09-09** — Roadmap created. WhatsApp and location pages dropped by
  decision. Shipped: partner programme page, video-first testimonials,
  credentials section, and data-driven rating markup. **Removed two published
  fabrications** — the fake 4.9/214 review schema and three invented customer
  testimonials, both now gated behind real data.
- **2026-09-03** — Segment landing pages (§3), case study pages (§7),
  measurement layer (§31), generator calculator (§24–25), package tiers (§4)
  and the free assessment offer (§5) shipped to `staging`. Measurement reference
  PDF delivered.


