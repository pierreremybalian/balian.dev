# balian.dev

Marketing site for Pierre Balian's freelance web engineering business. Astro, static output, deployed to Cloudflare Pages.

## Run it

Node 20+ (Node 24 is fine).

```bash
npm install
npm run dev
```

Dev server: http://localhost:4322

```bash
npm run build
npm run preview
```

`npm run pages:dev` builds and serves the site with Wrangler, including the `/api/contact` Pages Function.

## Deploy

The site is live at https://balian.dev. Preflight is done: lints, type check, build, and a local Pages run (`npm run pages:dev`) that checked the headers, CSP, 404, trailing-slash redirects and the contact function.

`npm run build` runs the copy lint, the SEO lint, `astro build`, then `scripts/headers.mjs`, which writes `dist/_headers` (security headers, a Content-Security-Policy with script hashes computed from the built HTML, and immutable caching for `/_astro/*`).

One-time setup:

```bash
npx wrangler pages project create balian-dev --production-branch main
npx wrangler pages secret put RESEND_API_KEY --project-name balian-dev
npx wrangler pages secret put CONTACT_TO --project-name balian-dev
npx wrangler pages secret put CONTACT_FROM --project-name balian-dev
```

`CONTACT_FROM` must be on a domain verified in Resend.

Deploy:

```bash
PUBLIC_BOOKING_URL="https://your-booking-link" npm run deploy
```

`PUBLIC_BOOKING_URL` is read at build time. Leave it unset and the call-to-action buttons go to `/contact/`.

Then add the custom domain in the Cloudflare dashboard (Workers & Pages, balian-dev, Custom domains): `balian.dev`, and `www.balian.dev` if wanted. The zone is already on Cloudflare. To deploy on every push instead, connect the GitHub repo to the Pages project with build command `npm run build`, output `dist`, and `NODE_VERSION=22`.

## Structure

- `src/pages/` routes: home, services (hub plus six pages from `src/data/services.ts`), work (hub plus two case studies), process, about, contact, 404
- `src/data/` all copy and structured content: services, case studies, process stages, skills, FAQ, nav
- `src/components/` rail, footer, FAQ, timeline, CTA band, service body
- `src/scripts/network.ts` the home hero: a three.js skills network that morphs and regroups by discipline. Lazy loaded.
- `src/scripts/ui.ts` mobile menu, soft reveals, scroll progress. No scroll hijacking.
- `src/styles/global.css` design tokens and styles (direction B, dark rail)
- `src/lib/schema.ts` JSON-LD helpers (ProfessionalService, Person, Service, FAQPage, BreadcrumbList)
- `functions/api/contact.ts` contact form endpoint (Resend)

## To finish before launch

- **Booking link.** Set `PUBLIC_BOOKING_URL` in the Pages project settings (and in a local env file for dev). Until then, call-to-action buttons go to `/contact/`.
- **Contact form email (Resend).** In the Pages project, set the secret `RESEND_API_KEY` and the variables `CONTACT_TO` and `CONTACT_FROM`. `CONTACT_FROM` must be on a domain verified in Resend. Until then the form answers that it is not connected.
- **Contact details.** Email, phone and LinkedIn are in `src/data/site.ts`, taken from resume v5. Confirm the LinkedIn URL (the portfolio uses a different one) and that this is the email and number you want public.
- **Social image.** No Open Graph image yet.
- **Legal pages.** No privacy or terms page yet.
- **Copy review.** All copy is a first draft in `src/data/*` and the page files.
- **Keyword check.** Page titles use keyword tiers that have not been validated with a keyword tool.

## Content rules

Calm, precise, first person singular. No figures, client names or tools from past agency work. No invented statistics. Outcomes for commerce stay in plain words.

## Booking

"Book a 30-minute call" on the contact page is backed by Google Calendar through two Pages Functions, `GET /api/slots` and `POST /api/book`. Nothing from Google runs in the browser.

- **Availability** is whatever events exist on the Google calendar named **Balian.dev availability** (pierre@baliandesign.com). Put an event on it, any title, and that window becomes bookable in 30-minute slots on :00 and :30. Delete the event to close the window. All-day events are ignored.
- **Busy time** on the primary calendar is subtracted, so existing calls and meetings never double-book. Booked calls are created on the primary calendar with a Google Meet link and the visitor as a guest; Google sends the invite, and Resend sends Pierre a note.
- **Rules** (lead time 24 h, horizon 21 days, slot length) live in `functions/lib/config.ts`. Slot arithmetic is in `functions/lib/slots.ts` and tested by `npm run test:slots`, which the build runs.
- **Secrets** on the Pages project and in `.dev.vars`: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `BOOKING_AVAILABILITY_CALENDAR_ID`, `BOOKING_CALENDAR_ID`.
- **Setup scripts** (macOS Keychain holds the OAuth client and refresh token; nothing is printed):
  - `node scripts/google-auth.mjs` opens the Google consent screen and stores the refresh token.
  - `node scripts/booking-setup.mjs --dev-vars --secrets` finds or creates the availability calendar, writes `.dev.vars` and pushes the Pages secrets. `--open 2026-10-09T10:00 2026-10-09T12:00` adds a window (Central time); `--list` shows windows and booked calls.
- The Calendar API must be enabled on the Google Cloud project that owns the OAuth client.

## Admin

`/admin/` is a private area behind GitHub sign-in (only the GitHub ids in `ADMIN_GITHUB_IDS`). It shows the pipeline (leads by stage), every submission, each lead's pre-scan, timeline, emails, documents and invoices.

- **Data** lives in the D1 database `balian-dev` (binding `DB`). Migrations are in `db/migrations`; apply with `npm run db:migrate` (remote) or `npm run db:migrate:local`.
- **Leads** are created automatically by the contact form, the booking form and the questionnaire, matched on email. Stages move forward on their own (new, contacted, call booked, questionnaire in, proposal sent, agreed) and can be set by hand.
- **Emails** are the templates in `src/data/emailTemplates.ts`, filled from the lead, editable before sending through Resend; each send is logged on the lead.
- **Documents** (proposal, agreement, statement of work) come from `src/data/docTemplates.ts`. Create a draft from a lead, edit the Markdown, press Send: the client gets a private link (`/d/?t=...`), the first view and the acceptance (name, time, IP) are recorded, both parties are emailed the accepted text, and the lead moves to Agreed.
- **Invoices** are simple records (number `BD-YYYY-NNN`, amount, due date, link, status); overdue is computed.
- **Sign-in**: a GitHub OAuth App with callback `https://balian.dev/api/admin/callback`. Secrets `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ADMIN_SESSION_SECRET`, `ADMIN_GITHUB_IDS`, pushed with `node scripts/admin-setup.mjs --secrets` after pasting the GitHub pair into `.dev.vars`. Locally, `ADMIN_DEV_LOGIN=1` in `.dev.vars` enables `/api/admin/dev-login` on localhost only.
