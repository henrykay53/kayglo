# Kayglo Citadel — Growth Roadmap

Living document. Updated as milestones are crossed — every session that moves
something forward updates this file and the log at the bottom.

**Last updated:** 2026-09-09
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

**Blocking everything:** fabricated proof still published (see Phase 0), and
measurement not switched on.

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
- [ ] **K** Get 3+ real testimonials with permission, then flip `verified`
- [ ] **K** Decide the four homepage stats: supply true numbers or cut the band
      (currently "4.9/5", "25 yr", "500+", "38 MWh" — all invented)
- [ ] **K** Real NAP — phone, email, address, coordinates, socials. Must match
      the Google Business Profile character for character (§10)
- [ ] **K** Verify the four case studies against job notes
- [ ] **K** Surulere project — real name, location, metrics
- [ ] **K** Servicing-cost figures for the generator calculator
- [ ] **K** Privacy policy to name GA4 and the Meta pixel

---

## Week 1 — Integrity and measurement

**Milestone:** the site tells only the truth, and every visit is attributed.

| Day | Owner | Task |
|---|---|---|
| 1 | K | Gather real business facts: phone, email, address, coordinates, socials, warranty terms, registration number |
| 1 | C | Strip the fake rating schema; make rating data-driven |
| 2 | K | Decide the stats band — true numbers or remove |
| 2 | C | Apply real facts to `lib/site.ts`; update privacy policy |
| 3 | K | Create GA4 property → `G-` ID |
| 3 | K | Create Google Ads conversion action → `AW-` ID + label |
| 3 | K | Create Meta pixel → ID |
| 4 | K | Four env vars into Vercel → **redeploy** → run the 5-step verification |
| 4 | K | Mark `generate_lead` as a key event in GA4 |
| 5 | K | Verify case studies; correct the Surulere entry; set servicing figures |
| 5 | K | Write the tagging convention into a note the whole team can see |
| 5 | K | Tag every link already in the wild — Instagram bio, WhatsApp profile, email signatures |

---

## Week 2 — Trust and proof (§7, §10, §26, §28)

**Milestone:** a stranger can verify Kayglo is a real engineering business.

| Day | Owner | Task |
|---|---|---|
| 6 | K | Create the Google Business Profile |
| 7 | K | Complete it aggressively — photos, services, service areas, hours, WhatsApp link |
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
- [ ] New case studies as jobs complete (§7)
- [ ] Wire real reviews into the schema once the GBP has them
- [-] Persistent WhatsApp (§13) — dropped 2026-09-09, not in the final product
- [-] Dedicated location pages (§10) — dropped 2026-09-09; the projects page
      already carries installation locations and covers the same search intent

---

## Log

- **2026-09-09** — Roadmap created. WhatsApp and location pages dropped by
  decision. Shipped: partner programme page, video-first testimonials,
  credentials section, and data-driven rating markup. **Removed two published
  fabrications** — the fake 4.9/214 review schema and three invented customer
  testimonials, both now gated behind real data.
- **2026-09-03** — Segment landing pages (§3), case study pages (§7),
  measurement layer (§31), generator calculator (§24–25), package tiers (§4)
  and the free assessment offer (§5) shipped to `staging`. Measurement reference
  PDF delivered.
