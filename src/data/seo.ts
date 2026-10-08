// Title, meta description and primary keyword for every page, in one file.
// `npm run lint:seo` checks them (and the build runs it). Keywords come from the content strategy (keyword plan v7).
// Rules: full title (with " | Balian.dev") at most 60 characters, primary keyword in the title and the description,
// description 110 to 158 characters, no two pages share a title or description.
// Keep this file self-contained (no imports) so the linter can load it.

export const TITLE_SUFFIX = " | Balian.dev";

export interface Seo {
  title: string; // without the suffix; the home page sets its own full title
  description: string;
  keyword: string;
}

export const seo: Record<string, Seo> = {
  home: {
    title: "Senior Web Developer, Without the Agency",
    description: "Senior web developer for websites, commerce, web apps and AI. Agency-level results from one engineer, with your sign-off at every step.",
    keyword: "senior web developer",
  },
  services: {
    title: "Web Development Services",
    description: "Web development services for whatever you came with: websites, stores, software, compliance letters, integrations, consulting, hosting and marketing.",
    keyword: "web development services",
  },
  "websites-and-cms": {
    title: "Custom Website Development",
    description: "Custom website development on WordPress, Astro or a headless CMS. Fast, accessible sites your team can edit, built by one senior engineer.",
    keyword: "custom website development",
  },
  "wordpress-development": {
    title: "Hire a Senior WordPress Developer",
    description: "Hire a senior WordPress developer for custom sites, plugins, multisite, integrations and migrations, built to be maintained.",
    keyword: "hire a senior wordpress developer",
  },
  "woocommerce-development": {
    title: "WooCommerce Developer for Growing Stores",
    description: "WooCommerce developer, Shopify builds and migrations from any platform: checkout, payments, tax, ERP sync and stores that run themselves.",
    keyword: "woocommerce developer",
  },
  "web-app-saas-development": {
    title: "Custom Web Application Development",
    description: "Custom web application development and SaaS builds: architecture, auth, billing and deployment from an engineer who runs his own products.",
    keyword: "custom web application development",
  },
  "ai-integration": {
    title: "AI Integration Services, Human in Control",
    description: "AI integration services for data processing, dashboards, CRM, ERP and EDI integrations and analytics. The model proposes, code validates, a person approves.",
    keyword: "ai integration services",
  },
  "ai-assisted-engineering": {
    title: "AI-Assisted Software Development, Reviewed",
    description: "AI-assisted software development where a senior engineer reads every change. Stack-agnostic, faster and more affordable than a team.",
    keyword: "ai-assisted software development",
  },
  "compliance-and-remediation": {
    title: "Website Compliance Remediation: ADA and WCAG",
    description: "Website compliance remediation for ADA and WCAG complaints, cyber-insurance questionnaires, cookie consent and HIPAA tracking rules, by one senior engineer.",
    keyword: "website compliance remediation",
  },
  "technology-consulting": {
    title: "Fractional Technical Lead for Your Business",
    description: "A fractional technical lead for businesses with a website, store or product and nobody senior to own the decisions: audits, vendor review, rescue.",
    keyword: "fractional technical lead",
  },
  work: {
    title: "SaaS Products Built and Run in Production",
    description: "Two SaaS products built and run in production: ZoneSteward for Cloudflare operations and CookieSteward for consent management.",
    keyword: "saas products",
  },
  zonesteward: {
    title: "ZoneSteward: Cloudflare Operations Platform",
    description: "ZoneSteward is a platform for Cloudflare operations across many zones: live traffic, alerts from real data, and AI-proposed changes a person approves.",
    keyword: "cloudflare operations",
  },
  cookiesteward: {
    title: "CookieSteward: Consent Management, HIPAA Mode",
    description: "CookieSteward is a consent management platform for GDPR and CCPA with Consent Mode v2, a scanner that verifies blocking and a HIPAA mode for healthcare sites.",
    keyword: "consent management",
  },
  about: {
    title: "Pierre Balian, Senior Web Engineer",
    description: "Pierre Balian is a senior web engineer in Minneapolis with more than twenty years of experience, most of it leading technical work inside agencies.",
    keyword: "senior web engineer",
  },
  process: {
    title: "Web Design Process: Design Before Build",
    description: "A 13-stage web design process with six approval gates: three styleframes, a design system you approve, a first draft on staging and two revision rounds.",
    keyword: "web design process",
  },
  contact: {
    title: "Contact a Senior Web Developer",
    description: "Contact a senior web developer by email, phone or LinkedIn, book a 30-minute call, or send a short project brief. Replies come from Pierre.",
    keyword: "contact a senior web developer",
  },
};
