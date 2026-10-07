import { copy } from "./ledes";

export interface Figure { src: string; alt: string; caption: string; width: number; height: number }

export interface CaseStudy {
  slug: string;
  name: string;
  status: string;
  short: string;
  h1: string;
  lede: string;
  external?: { label: string; href: string };
  facts: { k: string; v: string }[];
  // Real product media. A video or a still after the facts, and an optional figure per section.
  media?: Figure & { webm?: string; mp4?: string };
  sections: { h2: string; paras?: string[]; bullets?: string[]; figure?: Figure }[];
  related: { label: string; href: string }[];
}

// These pages are proof of work, so they describe what each product actually does, checked against the code.
export const caseStudies: CaseStudy[] = [
  {
    slug: "zonesteward",
    name: "ZoneSteward",
    status: "Private beta",
    short:
      "A console for teams that run many Cloudflare zones. Ask questions in plain English, watch live traffic on a globe, get alerts from real traffic, and approve every change the AI proposes before it is applied.",
    h1: copy["zonesteward"].h1,
    lede: copy["zonesteward"].lede,
    external: { label: "Visit zonesteward.com", href: "https://www.zonesteward.com" },
    facts: [
      { k: "Role", v: "Product, architecture, design and engineering. Built alone." },
      { k: "Status", v: "Private beta, twenty seats, free until general availability" },
      { k: "Stack", v: "Next.js, React, TypeScript, Node, SQLite, three.js, Claude API" },
      { k: "Platform", v: "Cloudflare GraphQL Analytics and REST APIs, self-hosted behind Cloudflare" },
      { k: "Scale", v: "Tens of thousands of lines of TypeScript, a large automated test suite and an evaluation harness with known answers" },
    ],
    media: {
      src: "/work/zonesteward/globe-modes-poster.webp", webm: "/work/zonesteward/globe-modes.webm", mp4: "/work/zonesteward/globe-modes.mp4",
      width: 1160, height: 1032,
      alt: "The live globe showing a fleet's request traffic as arcs to Cloudflare data centres, cycling through its display modes: Flow, Bundle, Heat, Trace, Pulse and Bars",
      caption: "The live globe, cycling through its six display modes. Real traffic from my own fleet.",
    },
    sections: [
      {
        h2: "What it is",
        paras: [
          "ZoneSteward is a web console for agencies and teams responsible for many Cloudflare zones across client accounts, usually ten or more they did not all build themselves. You connect your own Cloudflare API token and your own AI key. From there you can ask what is happening in plain English, watch traffic live, get alerted when something goes wrong, and fix it through an approval card instead of a dozen dashboards.",
          "I run my own fleet through it every day. It started as the tool I wanted at work and became a multi-tenant product.",
        ],
      },
      {
        h2: "See what is happening",
        bullets: [
          "A live 3D globe draws requests from where visitors are to the Cloudflare data centre that served them, over a rolling window, with a replay of the last day and a fleet view across every zone",
          "Live filters by country, user agent, path, status or host, with a side log of the actual requests",
          "A saved dashboard wall with about 27 widget types: requests, bandwidth, status split, top countries and ASNs, firewall events, bot traffic, attack feed, origin monitor, cache hit ratio, latency, incidents and more",
          "A library of flat and 3D chart types that the AI can suggest and you can save",
          "Google Analytics 4 read in beside the Cloudflare data, plus read-only panels for certificates, DNSSEC, Logpush, health checks, load balancers, waiting rooms, Turnstile, Workers routes and Access",
        ],
        figure: { src: "/work/zonesteward/see-live.webp", width: 1600, height: 1257, alt: "The Live view: a globe with request arcs, filters for country, user agent, path and status, a requests-per-minute counter and a replay scrubber", caption: "Live view with filters and the 24-hour replay scrubber." },
      },
      {
        h2: "Ask questions and get numbers you can trace",
        paras: [
          "The chat has a large set of read tools. For a question like \"who is attacking us?\" or \"why is this site slow in Germany?\", the model writes a Cloudflare GraphQL query and the server computes the figures. The model is told to quote only server-computed numbers, and any figure in an answer that cannot be traced to one is flagged under the answer. On the last evaluation run every question was answered and nearly every figure traced back to the data.",
        ],
        bullets: [
          "Attacker profiling into nine categories, from login brute force and CMS probing to SQL injection and credential stuffing, with a severity score and known crawlers cleared with a reason",
          "Per-attacker investigation that checks whether the same source is hitting your other zones",
          "A blast-radius preview that runs a proposed firewall rule against the last 24 hours of real traffic and warns when it would hit traffic that was being served, or good crawlers, or more than a fifth of all requests",
          "A question library of presets and saved questions",
        ],
        figure: { src: "/work/zonesteward/tour-ask.webp", width: 1600, height: 889, alt: "A chat answer about firewall activity beside an AI-suggested stacked bar chart of blocks and challenges by source", caption: "An answer with its figures, and the chart the AI suggested for it. The cost of the answer is printed under it." },
      },
      {
        h2: "Alerts from real traffic",
        paras: [
          "Alerts read the same analytics data the globe does. A shared poller keeps a recent buffer per workspace and built-in detectors run over it continuously, whether or not anyone is watching. Preset and custom rules run on their own schedule.",
        ],
        bullets: [
          "Built-in detectors: 5xx error-rate spike, origin down, traffic drop or spike, 404 surge, geographic anomaly, and one ASN sending a flood of failed requests",
          "Presets: firewall block surge, cache hit ratio drop, origin p95 latency, and likely-bot surge on plans with Bot Management",
          "Custom rules written from a sentence: the model drafts the query, metric, threshold and window, dry-runs it against the live zone, and refuses to arm anything that does not reduce to a number",
          "Each incident gets an AI investigation before notifications go out, so the message arrives with a classification and a suggested fix that can become an approval card in one click",
          "Delivery to email, Slack, Microsoft Teams, SMS, PagerDuty and signed webhooks, each with a minimum severity, retries and a delivery record; plus an in-app stream and alert bell",
          "Incidents can be acknowledged, resolved or marked false positive, with cooldowns so one problem does not page you ten times",
        ],
        figure: { src: "/work/zonesteward/tour-alerts.webp", width: 1600, height: 1134, alt: "Alert rules screen: a box to describe a rule in plain English, and two armed rules for 5xx error rate and origin down with their thresholds and channels", caption: "Alert rules. Describe one in a sentence and review the query and threshold before it arms." },
      },
      {
        h2: "Changes with a gate in front",
        paras: [
          "The model has no write tool. It can only propose. A proposal becomes a card that shows the impact and a preview; a person approves; the server re-reads the current state and refuses if anything moved; the change is applied and read back from Cloudflare; an audit row is written with the data needed to revert it in one click. The single automatic action, a managed challenge on one IP when a severe attack is detected, is off by default, opt-in per zone and capped.",
        ],
        bullets: [
          "WAF custom rules, rate limits, cache rules and purges, redirects, rewrites, header rules, IP and country access rules, zone lockdowns, managed rulesets, zone settings such as SSL mode and minimum TLS, DNS records, health checks and waiting rooms",
          "Bulk apply across a zone group, with a separate acknowledgement once the change touches many zones",
          "High-impact changes such as a whole-site lockdown or an apex DNS deletion need an explicit acknowledgement; DNS and bulk changes are admin only",
          "Per-class write rate limits with an audited break-glass override",
        ],
        figure: { src: "/work/zonesteward/gate-card.webp", width: 1600, height: 1322, alt: "An approval card for a WAF rule showing how many requests it would have matched in the last 24 hours, broken down by path, network, country and user agent, with a map and Approve and Reject buttons", caption: "The approval card, with the blast-radius preview run against the last 24 hours of real traffic." },
      },
      {
        h2: "Governance and sharing",
        bullets: [
          "Workspaces with owner, admin, user and viewer roles; sign-in by magic link, Google, Microsoft Entra ID or GitHub",
          "An audit log of every mutation attempt with actor, payload, Cloudflare's response and revert data",
          "Read-only share links for clients, pinned to one zone, revocable and time-limited; the link secret is never stored",
          "Printable zone and incident reports with CSV export, and a presentation mode that swaps real names for aliases so a workspace can be screenshotted",
          "Per-token capability model learned from real responses, never by writing; an AI spend log by feature and model; an email delivery log",
        ],
      },
      {
        h2: "How it is built",
        bullets: [
          "Next.js and React on Node, with each workspace isolated in its own database and its own encryption key",
          "The globe runs on the GPU through three.js and react-three-fiber, light enough to stay smooth on a laptop",
          "The Cloudflare layer degrades by plan: denied fields are dropped and retried, time spans clamped, sampling reversed, free zones fall back to coarser data",
          "Any model provider: Anthropic, OpenAI or an OpenAI-compatible endpoint, with the customer's own key billed at cost",
          "Self-hosted behind Cloudflare with the origin sealed; encrypted off-site backups that are test-restored before the job reports success",
        ],
      },
    ],
    related: [
      { label: "AI integration", href: "/services/ai-integration/" },
      { label: "Web apps and SaaS", href: "/services/web-app-saas-development/" },
      { label: "CookieSteward", href: "/work/cookiesteward/" },
    ],
  },
  {
    slug: "cookiesteward",
    name: "CookieSteward",
    status: "Alpha",
    short:
      "Cookie consent that checks its own work. Opt-in or opt-out by the visitor's law, Google Consent Mode v2, a scanner that verifies blocking after every publish, and a HIPAA mode that keeps tracking pixels off healthcare sites.",
    h1: copy["cookiesteward"].h1,
    lede: copy["cookiesteward"].lede,
    external: { label: "Visit cookiesteward.com", href: "https://cookiesteward.com" },
    facts: [
      { k: "Role", v: "Product, architecture, design and engineering. Built alone." },
      { k: "Status", v: "Alpha, hosted, with the edge in production" },
      { k: "Stack", v: "TypeScript, Next.js, Drizzle, Zod, Playwright, Hono" },
      { k: "Platform", v: "Cloudflare Workers, KV, D1 and Queues for the edge; a hosted Next.js dashboard" },
      { k: "Tests", v: "Banner tests in real Chromium, Firefox and WebKit, plus scan, full-stack and unit suites" },
    ],
    media: {
      src: "/work/cookiesteward/banner-eu.webp", width: 1600, height: 1000,
      alt: "A clinic website with the CookieSteward banner in the corner: We value your privacy, with Accept all, Reject all and Preferences buttons",
      caption: "The banner on a demo clinic site under the EU regime. Accept all and Reject all have equal prominence, enforced at publish.",
    },
    sections: [
      {
        h2: "What it is",
        paras: [
          "CookieSteward is a hosted consent manager for agencies and site owners. One script tag goes first in the head. Cloudflare's edge serves a small banner that blocks third-party scripts and iframes until the visitor consents, applies opt-in or opt-out depending on where the visitor is, sets Google Consent Mode v2 before any Google tag loads, and writes a receipt for every choice.",
          "Most consent tools show a banner and hope. This one scans the site afterward, with and without consent, and reports whether the blocking held.",
        ],
      },
      {
        h2: "HIPAA mode for healthcare sites",
        paras: [
          "In December 2022 the HHS Office for Civil Rights published guidance on tracking technologies on healthcare websites, naming Google Analytics and the Meta Pixel. Under HIPAA, a visitor clicking Accept all is not the authorisation the rules ask for. So HIPAA mode does not ask. It blocks.",
          "Switched on per site, it compiles a curated and growing ruleset of tracking vendors into hard-block rules on every publish: ad platforms such as Google Ads, Meta, TikTok, Microsoft and LinkedIn; session-replay tools such as Hotjar, Clarity and FullStory; social widgets; and Google Analytics. No consent path can release them, which is covered by a browser test. The post-publish scan fails if any of those hosts fires anyway, and regression alerts label the hit as a health-data risk.",
          "Receipts for HIPAA-mode sites never compute an IP hash, because a salted hash of an IP is still linkable. Every classified cookie also carries a HIPAA risk rating, and the banner editor lists trackers seen on the site that are rated high risk and not yet covered. A Business Associate Agreement is available as an add-on. The product is clear about limits: it does not make an organisation HIPAA compliant, it does not detect health information, and server-side integrations are outside its reach.",
        ],
      },
      {
        h2: "Consent that matches the visitor's law",
        bullets: [
          "Opt-in for the EU, EEA, UK, Switzerland and unknown locations; opt-out for the United States, applying the California model to every state",
          "Global Privacy Control honoured from the browser signal or the Sec-GPC header, with an automatic opt-out receipt for US visitors",
          "A persistent Your Privacy Choices link with the official California icon, and an opt-out that stays sticky across config versions",
          "Four categories, Accept all and Reject all with equal prominence enforced at publish, a preferences layer with per-category toggles and a cookie declaration table rebuilt from the site's classified cookies",
          "Re-consent when the configuration changes or consent expires, a withdraw action, and a reopen widget",
          "Blocked-embed placeholders that name the provider, for YouTube, Vimeo, Google Maps, Calendly, HubSpot and others, sized to the embed so accepting does not shift the page",
        ],
        figure: { src: "/work/cookiesteward/banner-us.webp", width: 1600, height: 1000, alt: "The same clinic site for a US visitor: no banner, a persistent Your Privacy Choices link with the California opt-out icon, and a cookie reopen widget", caption: "A US visitor gets the opt-out model: no gate, a persistent Your Privacy Choices link with the California icon, and the reopen widget." },
      },
      {
        h2: "A scanner that checks its own work",
        paras: [
          "After every publish, on demand, and on a schedule, a real browser loads a representative sample of pages chosen from the sitemap: the homepage, one page per URL pattern, then pages that look like checkout, booking, contact, login or donate. With the banner installed it runs two passes, before and after consent, and reports per rule whether blocking held and which third parties received data before consent.",
        ],
        bullets: [
          "Cookies, local storage and third-party requests collected with attribution to the script that set them; raw values never stored",
          "Leak detection that watches outbound requests for email addresses, page URLs, device fingerprints, forwarded cookie values and an ever-growing library of advertising and analytics identifiers",
          "Classification against a large, maintained pattern library and a curated vendor map; unknown cookies get an AI investigation using the customer's own key, wrapped against prompt injection, and a person approves the verdict, which then applies fleet-wide",
          "An install check that confirms the script is present and mounted, loads before Google Tag Manager, and sets the Consent Mode default before any Google tag reads it",
          "A diff against the previous scan, screenshots per page, and regression emails when something got worse",
        ],
      },
      {
        h2: "Signals and integrations",
        bullets: [
          "Google Consent Mode v2 default fired synchronously at boot before Google Tag Manager, mapped across ad_storage, ad_user_data, ad_personalization, analytics_storage and functionality_storage, with ads data redaction while advertising is denied",
          "A Google Tag Manager bridge with dataLayer events for initialised, given, updated and loaded consent, each carrying per-category booleans",
          "A window.CMP API and events for single-page apps, and a CookieFirst compatibility shim for migrations",
          "A WordPress plugin with three placement methods and a check that warns if a Google, Meta, Clarity or Hotjar tag loads before the script",
        ],
      },
      {
        h2: "Records you can hand to an auditor",
        bullets: [
          "One receipt per choice: visitor id, regime, action, categories, config version, GPC flag, country, browser family and timestamp; no page URL",
          "Written through a queue with retries, so a receipt is kept even when something downstream fails",
          "The config version maps to the exact published banner configuration, including compiled HIPAA rules, so you can show what the visitor was served",
          "Per-visitor lookup, daily statistics by regime and action, and streamed CSV export per site and date range, formula-safe, available to client-role users",
          "Multi-year retention enforced automatically, with deletion on request",
        ],
      },
      {
        h2: "Performance and delivery",
        bullets: [
          "A zero-dependency runtime in vanilla TypeScript, small enough to ignore in a performance budget, with a size limit enforced in CI",
          "A single-request embed: the edge returns the visitor's regime, GPC state and the site configuration together with the runtime in one cached response",
          "Everything renders in a shadow DOM as fixed overlays, so the page does not move; theme presets, several layouts and custom CSS",
          "Dialog roles, focus management, a Tab trap in the preferences layer, a polite live region, reduced-motion support and touch-sized targets",
        ],
        figure: { src: "/work/cookiesteward/banner-prefs.webp", width: 1600, height: 1000, alt: "The preferences dialog with toggles for strictly necessary, functional, analytics and advertising, each with a cookie count, and Save preferences, Accept all and Reject all buttons", caption: "The preferences layer: per-category toggles, the cookie declaration under each, and a focus trap while it is open." },
      },
      {
        h2: "How it is built",
        bullets: [
          "The edge runs on Cloudflare Workers with KV for configuration, D1 for receipts and Queues for writes; Zod schemas are shared between the dashboard and the edge",
          "The dashboard is Next.js with each workspace isolated in its own database, roles for owner, admin, staff and read-only client, passwordless and OAuth sign-in, and AI keys encrypted at rest",
          "Workspaces, sites and clients as the tenancy model; Stripe for annual billing with grace, frozen and stopped states",
          "Playwright drives the banner tests across Chromium, Firefox and WebKit against a fixture site with real trackers, and the same engine powers the scanner",
        ],
      },
    ],
    related: [
      { label: "Web apps and SaaS", href: "/services/web-app-saas-development/" },
      { label: "Security, performance, accessibility", href: "/services/#security-performance-accessibility" },
      { label: "ZoneSteward", href: "/work/zonesteward/" },
    ],
  },
];
