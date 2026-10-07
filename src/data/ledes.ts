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
    h1: "Websites, stores, apps and AI, built by one person.",
    lede: "Find the kind of work you need help with below. Most projects mix two or three of these, and I do all of them myself.",
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
    h1: "WooCommerce engineering for stores that need to convert and scale.",
    lede: "Is checkout slow, tax a guess, or are orders missing from your ERP? I fix those problems and build what is missing.",
  },
  "web-app-saas-development": {
    h1: "Web products you can run after launch.",
    lede: "You have a product idea or a prototype that has outgrown itself. I build the real version, with accounts and payments, and I already run two products of my own.",
  },
  "ai-integration": {
    h1: "AI features with a human in control.",
    lede: "AI can write, sort and answer for you, but it should not change anything on its own. I build features where the model suggests and a person decides.",
  },
  "ai-assisted-engineering": {
    h1: "AI writes the syntax. Experience decides what ships.",
    lede: "Yes, I use AI to build your site. It does the typing and I read every line. You pay for the result, not for a team's hours.",
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
    lede: "Every project follows the same thirteen steps, and nothing moves forward without your okay at six of them. Design comes first, before any code.",
  },
  contact: {
    h1: "Tell me what you're building.",
    lede: "Email me, call me or find me on LinkedIn. I answer those myself, and you can also book a call or write the project down below.",
  },
};
