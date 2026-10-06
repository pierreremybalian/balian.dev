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

## Deploy (not done yet)

```bash
npm run deploy
```

Creates or updates the `balian-dev` Cloudflare Pages project from `dist/`. Nothing has been deployed or pushed.

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
