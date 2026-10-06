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
    lede: "I have twenty years of experience and use AI for the heavy lifting. You get an agency team's work faster and cheaper, and you deal with me directly.",
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
    h1: "Web products built to be run, not just shipped.",
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
    lede: "For ten years I was an employee, so most of my best work belongs to other people. Here are two products I built on my own time. They show how I work.",
  },
  zonesteward: {
    h1: "ZoneSteward: Cloudflare operations with a gate in front.",
    lede: "If you run many Cloudflare sites, you can ask questions in plain English and fix problems safely. The AI proposes changes, and a person approves each one.",
  },
  cookiesteward: {
    h1: "CookieSteward: consent management that stays out of the way.",
    lede: "A cookie banner that does not slow your site down. It handles GDPR and California rules, and the banner is small enough that you will not notice it loading.",
  },
  about: {
    h1: "What an agency of one actually means.",
    lede: "I am one engineer doing work that usually takes a team. Here is how that works, where it does not, and what happens if I am ever unavailable.",
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
