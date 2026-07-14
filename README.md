# Kayglo — Premium Solar Website

A fast, SEO-optimized marketing site with lead capture for a high-end solar company. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Every page is statically rendered for speed and crawlability.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Where to edit things

**One file controls all your business content:** [`lib/site.ts`](lib/site.ts).
Company name, phone, email, address, service areas, services, projects, testimonials, and trust stats all live here. Fields marked `// TODO` are premium-looking placeholders — swap them for your real details. Because the footer, every page, and all SEO/structured data read from this file, you change facts in exactly one place.

| I want to change…            | Edit                                            |
| ---------------------------- | ----------------------------------------------- |
| Company name, contact, NAP   | `lib/site.ts` → `site`                          |
| Services offered             | `lib/site.ts` → `services`                      |
| Project case studies         | `lib/site.ts` → `projects`                      |
| Testimonials                 | `lib/site.ts` → `testimonials`                  |
| Colors / fonts               | `app/globals.css` (`@theme` block)              |
| Page copy & layout           | `app/<page>/page.tsx`                            |
| Logo / brand artwork         | `components/Brand.tsx`, `app/icon.svg`          |

## SEO — what's already done

- **Per-page metadata** (titles, descriptions, canonical URLs, OpenGraph, Twitter cards) via the Next.js Metadata API.
- **JSON-LD structured data** (`SolarInstallation` / LocalBusiness) in `app/layout.tsx` → drives Google rich results and the local pack.
- **`sitemap.xml`** and **`robots.txt`** generated automatically (`app/sitemap.ts`, `app/robots.ts`).
- **Dynamic OpenGraph image** at `/opengraph-image` for rich link previews.
- **Web manifest** + branded SVG favicon.
- Semantic HTML, one `<h1>` per page, accessible focus states, skip-to-content link, and static rendering for fast Core Web Vitals.

### Before you launch (SEO checklist)

1. Set your real domain in `lib/site.ts` → `site.url` (used for canonical, sitemap, OG).
2. Fill in every `// TODO` in `lib/site.ts` — **your NAP must match your Google Business Profile exactly** for local SEO.
3. Create a [Google Business Profile](https://business.google.com) and verify it.
4. Submit your sitemap in [Google Search Console](https://search.google.com/search-console).
5. Validate structured data with the [Rich Results Test](https://search.google.com/test/rich-results).

## Lead capture (email is wired — just add a key)

The consultation form posts to [`app/api/lead/route.ts`](app/api/lead/route.ts), which validates the submission (with a honeypot for spam) and **emails you the lead via [Resend](https://resend.com)**. It's already coded — you only need to supply credentials:

1. Create a free account at [resend.com](https://resend.com) and verify your sending domain.
2. Copy `.env.example` to `.env.local` and fill in:
   ```bash
   RESEND_API_KEY=re_...            # your Resend key
   LEAD_INBOX=you@kayglo.com        # where leads land
   # LEAD_FROM=Kayglo Leads <leads@kayglo.com>   # optional verified sender
   ```
3. Add the same variables to your production host (e.g. Vercel project settings).

**Until a key is set, leads are safely logged to the server console** — so the form works in development and never loses a submission. Delivery failures also fall back to a log, so a visitor is never asked to resubmit.

## Writing blog posts (Insights)

Articles live as Markdown in [`content/blog/`](content/blog). To publish a new post, add a `.md` file with frontmatter:

```markdown
---
title: "Your headline"
description: "One-sentence summary used for SEO and the card."
date: "2026-07-01"
author: "Kayglo"
category: "Buying Guide"
---

Your article body in Markdown. Use ## and ### for headings,
- bullet lists, and > blockquotes.
```

That's it — the post is automatically added to the `/blog` index, gets its own page with `BlogPosting` structured data, and appears in the sitemap. Three starter posts are included as templates.

## Financing page

[`app/financing/page.tsx`](app/financing/page.tsx) covers ways to pay, incentives, and a FAQ with `FAQPage` structured data (eligible for Google rich snippets). Edit the `options` and `faqs` arrays near the top of that file to match your current programs and terms. It intentionally avoids specific percentages/dollar promises and points users to a tax professional — keep it that way to stay compliant.

## Deploy

The site deploys with zero config on [Vercel](https://vercel.com) (the makers of Next.js):

1. Push this folder to a GitHub repo.
2. Import it in Vercel → it auto-detects Next.js.
3. Add your environment variables and custom domain.

Any Node host that runs `npm run build && npm run start` also works.

## Design notes

- **Type:** Fraunces (serif display) + Inter (body) via `next/font` — self-hosted, no layout shift.
- **Palette:** warm cream, deep slate ink, solar gold, evergreen. Defined as tokens in `app/globals.css`.
- **Imagery:** custom SVG artwork (panel grids, sun marks) instead of generic stock — intentional, on-brand, and near-zero weight. Swap in real project photography when you have it (use `next/image` for automatic optimization).
