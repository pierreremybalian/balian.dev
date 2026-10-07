import { copy } from "./ledes";

export interface CaseStudy {
  slug: string;
  name: string;
  status: string;
  short: string;
  h1: string;
  lede: string;
  external?: { label: string; href: string };
  facts: { k: string; v: string }[];
  sections: { h2: string; paras?: string[]; bullets?: string[] }[];
  related: { label: string; href: string }[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "zonesteward",
    name: "ZoneSteward",
    status: "Public beta",
    short:
      "Cloudflare operations for teams that manage many sites. Plain-language analytics, and AI-proposed rule changes that a person approves before anything is applied.",
    h1: copy["zonesteward"].h1,
    lede: copy["zonesteward"].lede,
    external: { label: "Visit zonesteward.com", href: "https://www.zonesteward.com" },
    facts: [
      { k: "Role", v: "Product, architecture, design and engineering" },
      { k: "Status", v: "Public beta" },
      { k: "Stack", v: "Next.js, React, TypeScript, Node, Claude API, SQLite" },
      { k: "Platform", v: "Cloudflare APIs, one VPS behind Caddy" },
    ],
    sections: [
      {
        h2: "The problem",
        paras: [
          "Managing Cloudflare across many sites means a lot of dashboards, a lot of rules and a lot of risk. A wrong rule can take a site down, and an attack does not wait for someone to find the right page.",
        ],
      },
      {
        h2: "What it does",
        bullets: [
          "Answers questions about traffic and attacks in plain language",
          "Shows live activity on a globe and helps investigate incidents",
          "Proposes WAF, rate-limit and cache rule changes",
          "Gives read-only share links for stakeholders",
        ],
      },
      {
        h2: "The design decision that matters",
        paras: [
          "Every write needs human approval, an impact preview, read-back verification and a one-click revert. The model has no direct write path. It proposes, the server enforces approval, and the system checks the live ruleset afterward. This is the same pattern I recommend for any AI feature that can change something real.",
        ],
      },
      {
        h2: "How it runs",
        paras: [
          "A single Node process on a server behind Caddy, supervised by PM2, with the origin sealed by Cloudflare Authenticated Origin Pulls. It is deliberately simple to operate.",
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
      "Consent management for GDPR and CCPA/CPRA, with Global Privacy Control and Google Consent Mode v2. A banner runtime small enough to stay out of the way of performance.",
    h1: copy["cookiesteward"].h1,
    lede: copy["cookiesteward"].lede,
    facts: [
      { k: "Role", v: "Product, architecture, design and engineering" },
      { k: "Status", v: "Alpha" },
      { k: "Stack", v: "TypeScript, Next.js, Drizzle, Zod, Playwright" },
      { k: "Platform", v: "Cloudflare Workers, KV, D1 and Queues" },
    ],
    sections: [
      {
        h2: "The problem",
        paras: [
          "Consent banners are usually heavy, slow and bolted on. They hurt performance, and they are hard to prove correct across regions and browsers.",
        ],
      },
      {
        h2: "What it does",
        bullets: [
          "Opt-in under GDPR and opt-out under CCPA/CPRA, including Global Privacy Control",
          "Google Consent Mode v2 and a Google Tag Manager bridge",
          "A scanner that crawls a site and classifies the trackers it finds",
          "A WordPress plugin and a dashboard for managing sites",
        ],
      },
      {
        h2: "How it is built",
        bullets: [
          "A zero-dependency banner runtime in vanilla TypeScript, about 7 KB gzipped",
          "An edge Worker that serves site configuration from KV",
          "Consent receipts written through a queue to D1, with a dead-letter queue for failures",
          "Shared Zod schemas, a Drizzle data layer and a Playwright crawler",
          "A cross-browser test matrix that exercises the whole consent path",
        ],
      },
      {
        h2: "The design decision that matters",
        paras: [
          "Consent has to be fast, correct and provable. The runtime is small enough to ignore in a performance budget, the receipts are written reliably even when something fails, and the behaviour is tested in real browsers.",
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
