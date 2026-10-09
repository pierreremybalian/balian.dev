// The H1 and the lede (the first text under it) for every page, in one file.
// This is the most important copy on each page after the headline, so it follows rules, and `npm run lint:copy` checks them.
// Read CONTENT.md before editing anything here. This file must stay self-contained (no imports) so the linter can load it.

export interface PageCopy {
  h1: string;
  lede: string;
}

export const copy: Record<string, PageCopy> = {
  home: {
    h1: "Agency-level web engineering, without the agency.",
    lede: "I have spent more than twenty years building websites, stores and web apps, most of it inside agencies. Now you hire me directly and I do the work myself.",
  },
  services: {
    h1: "Bring me the problem. I will bring the stack.",
    lede: "You do not need to know which platform you need. Tell me what is broken, slow or missing and I will pick the tools and do the work.",
  },
  "websites-and-cms": {
    h1: "Websites your team can edit and your customers can use.",
    lede: "Your website should be fast, easy to edit and easy to find. I build it on WordPress or Astro, whichever suits how your team works.",
  },
  "wordpress-development": {
    h1: "WordPress engineering done properly.",
    lede: "WordPress is easy to start and easy to get wrong. I build custom sites, plugins and integrations that stay fast, stay secure and make sense to the next developer.",
  },
  "woocommerce-development": {
    h1: "Stores that sell and run themselves.",
    lede: "Checkout that converts and orders that reach accounting on their own. WooCommerce or Shopify, or a move from whatever system you have now.",
  },
  "web-app-saas-development": {
    h1: "Web products you can run after launch.",
    lede: "You have a product idea or a prototype that has outgrown itself. I build the real version, with accounts and payments, and I already run two products of my own.",
  },
  "ai-integration": {
    h1: "AI for the work that eats your team's time.",
    lede: "Your team spends hours on data entry and cleanup, reporting and the gaps between systems. I build AI into those jobs so they run reliably and a person checks what matters.",
  },
  "ai-assisted-engineering": {
    h1: "Twenty years of engineering, with AI as a very fast pair of hands.",
    lede: "I use AI to build your site. I design the system, direct the work and read every line, and AI types faster than any team could. You pay for the result.",
  },
  "compliance-and-remediation": {
    h1: "Someone sent you a letter. Here is what happens next.",
    lede: "ADA demand letters, cyber-insurance questionnaires, privacy complaints and HIPAA tracking rules all land on the website. I fix the site so the answer is yes.",
  },
  "technology-consulting": {
    h1: "A technical lead for your business, by the hour or by the month.",
    lede: "You have a website, a store or a product and nobody senior to own the technical decisions. I can be that person without the hire.",
  },
  work: {
    h1: "Two products of my own, built and run in production.",
    lede: "Most of what I built in twenty years belongs to the agencies' clients, so it is not here. These two products are mine, built on my own time and running in production.",
  },
  zonesteward: {
    h1: "ZoneSteward: Cloudflare operations with a gate in front.",
    lede: "If you run many Cloudflare sites, you can ask what is happening in plain English and get alerted from real traffic. The AI proposes fixes and you approve each one.",
  },
  cookiesteward: {
    h1: "CookieSteward: consent management that stays out of the way.",
    lede: "A cookie banner that blocks trackers until you consent, then scans the site to prove it did. It handles GDPR, California rules and HIPAA healthcare sites.",
  },
  about: {
    h1: "Twenty years of building for the web, most of it inside agencies.",
    lede: "I am Pierre Balian, a web engineer in Minneapolis. I led the technical side of an agency, and now I do that work for you directly.",
  },
  process: {
    h1: "A process with your sign-off at every gate.",
    lede: "A new site follows thirteen steps and nothing moves forward without your okay at six of them. Other jobs run shorter, and design still comes before code.",
  },
  blog: {
    h1: "Ramblings",
    lede: "The same stupid mistakes I see companies make over and over again. And the cool solutions I have found over the years.",
  },
  contact: {
    h1: "Tell me what you're building.",
    lede: "Email me, call me or find me on LinkedIn. I answer those myself, and you can also book a call or write the project down below.",
  },
};
