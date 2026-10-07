import type { Faq } from "./faq";
import { copy } from "./ledes";

export interface ServiceGroup {
  id: string;
  name: string;
  short: string;
  href: string;
  icon: string; // inline svg inner markup, 34x34 viewBox
}

export const serviceGroups: ServiceGroup[] = [
  { id: "websites", name: "Websites and content platforms", href: "/services/websites-and-cms/",
    short: "WordPress, Astro or headless, picked for how your team edits and what the site has to do.",
    icon: '<rect x="3" y="6" width="28" height="22" rx="2"/><path d="M3 12h28M8 9h.01M12 9h.01"/>' },
  { id: "commerce", name: "Commerce", href: "/services/woocommerce-development/",
    short: "WooCommerce stores with checkout, payments, tax and ERP sync that hold up under real orders.",
    icon: '<path d="M4 6h4l3 15h15l3-11H10"/><circle cx="14" cy="27" r="1.6"/><circle cx="25" cy="27" r="1.6"/>' },
  { id: "apps", name: "Web apps and SaaS", href: "/services/web-app-saas-development/",
    short: "Multi-tenant products with accounts, billing and a release process you can run.",
    icon: '<path d="M17 4l12 6v14l-12 6-12-6V10z"/><path d="M17 16l12-6M17 16L5 10M17 16v14"/>' },
  { id: "ai", name: "AI features and agents", href: "/services/ai-integration/",
    short: "Data processing, dashboards and system integrations where AI does the tedious part and a person checks what matters.",
    icon: '<circle cx="17" cy="17" r="5"/><path d="M17 3v6M17 25v6M3 17h6M25 17h6M7 7l4 4M23 23l4 4M27 7l-4 4M11 23l-4 4"/>' },
  { id: "integrations", name: "Integrations and automation", href: "/services/#integrations-and-automation",
    short: "Store, ERP, accounting and CRM connected, plus internal tools for the manual jobs.",
    icon: '<path d="M4 12h10M20 12h10M4 22h10M20 22h10"/><circle cx="17" cy="12" r="3"/><circle cx="17" cy="22" r="3"/>' },
  { id: "quality", name: "Security, performance, accessibility", href: "/services/#security-performance-accessibility",
    short: "Hardening, cleanup after a breach, Core Web Vitals and WCAG AA, on new builds and existing sites.",
    icon: '<path d="M17 3l11 4v9c0 7-5 12-11 15C11 28 6 23 6 16V7z"/><path d="M12 17l4 4 7-8"/>' },
];

export interface Block {
  h2: string;
  paras?: string[];
  items?: { title: string; text: string }[];
  bullets?: string[];
}

export interface ServicePage {
  slug: string;
  parent?: { label: string; href: string };
  h1: string;
  lede: string;
  blocks: Block[];
  faq: Faq[];
  related: { label: string; href: string }[];
  serviceName: string;
}

export const servicePages: ServicePage[] = [
  {
    slug: "websites-and-cms",
    h1: copy["websites-and-cms"].h1,
    lede: copy["websites-and-cms"].lede,
    serviceName: "Website and content platform development",
    blocks: [
      {
        h2: "Choosing the platform",
        paras: ["The platform is a decision about people. Who edits the site, how often, and what else it has to do all point toward one answer."],
        items: [
          { title: "WordPress", text: "When editors need flexibility, plugins, forms or commerce, and a familiar admin. Built custom, with blocks designed to your brand, and no page builder." },
          { title: "Astro on Cloudflare", text: "When speed and simplicity matter more than a heavy CMS. Static pages, edge delivery, and content in plain files or a light editor." },
          { title: "Headless", text: "When the same content feeds more than one place, such as a website and an app. More moving parts, so only when it earns them." },
        ],
      },
      {
        h2: "What every site gets",
        items: [
          { title: "Speed", text: "Core Web Vitals treated as a budget from the first commit." },
          { title: "Accessibility", text: "Built and checked to WCAG AA." },
          { title: "Search foundations", text: "Clean URLs, structured data, redirects from the old site, and metadata written by hand." },
          { title: "Security", text: "Hardened configuration, security headers, and least-privilege access." },
          { title: "An editing experience", text: "Designed with your team, with documentation and a walkthrough." },
        ],
      },
      {
        h2: "Work I have done",
        bullets: [
          "Dozens of accessibility remediations to verified WCAG AA, for B2C and healthcare clients",
          "Site SEO rebuilt from scratch after a re-platform, with redirect maps for every URL that changed",
          "Custom WordPress platforms for manufacturers, retailers and HIPAA-scoped organisations",
          "This site, on Astro and Cloudflare Pages, with its own content and SEO linters",
        ],
      },
      {
        h2: "What is included",
        bullets: [
          "Information architecture and content structure",
          "Design and build, following the full process",
          "Migration from an existing site, with a redirect map",
          "Editor training and documentation",
          "A launch checklist and a support period",
        ],
      },
    ],
    faq: [
      { q: "Should I use WordPress or something else?", a: "If your team edits often or needs plugins, forms or commerce, WordPress is usually right. If the site is mostly fixed pages and speed matters most, Astro is simpler and faster. I will recommend the one that fits, even when it is less work for me." },
      { q: "Can you rebuild my existing site without losing search traffic?", a: "Yes. I map every existing URL, redirect what changes, carry over the metadata that matters, and check rankings afterward." },
      { q: "Will my team be able to edit it?", a: "Yes, and it is a design requirement from the start. I build the editing experience with the people who will use it, and hand over documentation." },
    ],
    related: [
      { label: "WordPress development", href: "/services/wordpress-development/" },
      { label: "How a project runs", href: "/process/" },
      { label: "AI-assisted engineering", href: "/services/ai-assisted-engineering/" },
    ],
  },
  {
    slug: "wordpress-development",
    parent: { label: "Websites and CMS", href: "/services/websites-and-cms/" },
    h1: copy["wordpress-development"].h1,
    lede: copy["wordpress-development"].lede,
    serviceName: "WordPress development",
    blocks: [
      {
        h2: "What I build",
        items: [
          { title: "Custom themes and blocks", text: "Every block built to the design, so editors assemble pages from pieces that already follow the brand and cannot drift from it." },
          { title: "Plugins and integrations", text: "Custom features, admin tools and connections to the other systems you run." },
          { title: "Multisite", text: "Networks of related sites that share a codebase and stay manageable." },
          { title: "Migrations and rebuilds", text: "Moving to WordPress, or rebuilding an aging site, without losing what already works." },
          { title: "Hardening and performance", text: "Security configuration, caching and speed work on existing sites." },
        ],
      },
      {
        h2: "How it is built",
        bullets: [
          "Modern PHP with coding standards the next developer will recognise",
          "Version control and a staging site for every project",
          "Automated tests where they pay off, and browser tests on what matters most",
          "Documentation written for the person who inherits the site",
          "No page builders. If a site runs on one, my recommendation is a rebuild",
        ],
      },
      {
        h2: "Work I have done",
        bullets: [
          "Built the starter framework a web team used on every WordPress build, with the coding standards to go with it",
          "Custom blocks built to each design with ACF, so editors cannot stray from the brand guidelines",
          "A maintenance hub that watches every installed plugin for known vulnerabilities, alerts, and applies updates across many sites",
          "Multisite networks, HIPAA-scoped sites, and takeovers of sites other developers built",
        ],
      },
      {
        h2: "When WordPress is the right choice",
        paras: [
          "WordPress fits when editors need flexibility, when you want a large plugin ecosystem, or when commerce through WooCommerce is part of the picture. It is not always the answer. For fast, mostly fixed marketing sites, Astro is often simpler and quicker, and I will say so.",
        ],
      },
    ],
    faq: [
      { q: "Do you use page builders?", a: "No. I build custom blocks to the design, so editors work from pieces that already follow the brand and cannot drift from it. Page builders are slow, fragile and lock you in. If your site runs on one, my recommendation is a rebuild." },
      { q: "Can you take over a site someone else built?", a: "Yes. I start with an audit of the code, security and performance, tell you what I find, and then decide what to keep." },
      { q: "Do you write custom plugins?", a: "Yes, with coding standards, security review, tests, documentation and an upgrade path, so you can maintain them without me." },
      { q: "Can WordPress be fast?", a: "Yes. Most slow WordPress sites are slow because of their plugins and themes. A lean custom build can be very fast." },
    ],
    related: [
      { label: "Websites and CMS", href: "/services/websites-and-cms/" },
      { label: "WooCommerce", href: "/services/woocommerce-development/" },
      { label: "How a project runs", href: "/process/" },
    ],
  },
  {
    slug: "woocommerce-development",
    h1: copy["woocommerce-development"].h1,
    lede: copy["woocommerce-development"].lede,
    serviceName: "WooCommerce development",
    blocks: [
      {
        h2: "What good looks like",
        items: [
          { title: "A fast, trustworthy checkout", text: "Few steps, clear totals, and nothing that makes a buyer hesitate." },
          { title: "Reliable payments", text: "Payment flows that handle failures, retries and edge cases without losing orders." },
          { title: "Accurate tax", text: "Rates calculated correctly for where you sell, with a path that survives audits." },
          { title: "Clean back-office sync", text: "Orders, stock and customers flowing to the systems you already run." },
          { title: "Pages that load on a phone", text: "Most buyers arrive on mobile. The catalog has to be quick there." },
        ],
      },
      {
        h2: "What I work on",
        bullets: [
          "Custom WooCommerce builds and extensions",
          "Payments: Stripe, PayPal and Authorize.net",
          "Tax: Avalara and TaxJar",
          "ERP, accounting, point-of-sale and EDI integration",
          "Performance and caching for catalogs of any size",
          "Security and PCI-conscious configuration",
          "Migration from BigCommerce, Shopify and other platforms",
        ],
      },
      {
        h2: "Work I have done",
        bullets: [
          "Re-platformed a manufacturer's store from an aging proprietary SaaS to a custom WooCommerce build with a Sage 100 ERP integration",
          "Migrated a specialty retailer from BigCommerce to WooCommerce, normalised a large and inconsistent catalog, and added QuickBooks and point-of-sale sync",
          "Owned the commerce stack across many stores: Stripe, PayPal and Authorize.net, PCI-compliant checkout, fraud prevention, abandoned-cart recovery, Avalara and TaxJar, and EDI sync to client ERPs",
          "Checkout and product-page changes made for conversion, measured after launch",
        ],
      },
      {
        h2: "Moving platforms without losing search traffic",
        paras: [
          "Most of the risk in a migration is search visibility. I map every product and category URL, carry over the metadata that matters, set up redirects before launch, and check the results afterward. Orders, customers and catalog data are validated in both directions.",
        ],
      },
    ],
    faq: [
      { q: "Can WooCommerce connect to my ERP or accounting system?", a: "Usually yes, through an API, a file exchange or EDI, depending on what your system supports. I start by mapping the data both ways and deciding what the source of truth is." },
      { q: "Can you move my store from BigCommerce or Shopify?", a: "Yes. I migrate products, customers and order history, keep your URLs working with redirects, and test the checkout and integrations before the switch." },
      { q: "Will my store be slow on WordPress?", a: "Not if it is built carefully. Speed comes from lean themes, sensible plugins, caching and a good host, and I treat it as a budget from the start." },
      { q: "Who owns the store afterward?", a: "You do: the code, the hosting and payment accounts, and the documentation." },
    ],
    related: [
      { label: "WordPress development", href: "/services/wordpress-development/" },
      { label: "AI integration", href: "/services/ai-integration/" },
      { label: "How a project runs", href: "/process/" },
    ],
  },
  {
    slug: "web-app-saas-development",
    h1: copy["web-app-saas-development"].h1,
    lede: copy["web-app-saas-development"].lede,
    serviceName: "Web application and SaaS development",
    blocks: [
      {
        h2: "What a product build includes",
        items: [
          { title: "Architecture and data model", text: "The decisions that are expensive to change later, made early and written down." },
          { title: "Authentication and tenancy", text: "Accounts, roles and data separation between customers." },
          { title: "Billing and payments", text: "Subscriptions and payments through Stripe, with the failure cases handled." },
          { title: "Deployment and monitoring", text: "A repeatable release process and enough visibility to run the product." },
          { title: "Testing", text: "Automated tests and browser tests on the paths that matter." },
        ],
      },
      {
        h2: "How I pick a stack",
        paras: [
          "I do not sell a framework. TypeScript across the app where it makes sense, Next.js and Node for the application, Cloudflare Workers, D1, KV, R2 and Queues for edge work, and a SQL database for the data. When a different tool is a better fit, I use that.",
          "I design the architecture and the data model, make the security decisions and read every line. AI fills in framework idiom and API detail, which is where the typing used to go.",
        ],
      },
      {
        h2: "How design and build work for a product",
        paras: [
          "The same gates apply. You see three visual directions, choose one and refine it before building. Then the product is built in working increments you can see on staging, with your approval at the points that matter.",
        ],
      },
      {
        h2: "Work I have done",
        bullets: [
          "ZoneSteward, a multi-tenant Cloudflare operations platform with an AI assistant whose every change a person approves",
          "CookieSteward, a consent management platform on Cloudflare Workers, D1, KV and Queues, with a tiny edge-delivered banner",
          "Scoped and architected an agency's larger engagements from feasibility through system design",
          "Internal platforms in PHP and MySQL that run maintenance and monitoring across a large portfolio of sites",
        ],
      },
    ],
    faq: [
      { q: "Can you work with an existing codebase?", a: "Yes. I start by reading it and writing up what I find, then decide with you whether to extend, refactor or replace parts." },
      { q: "Which stack will you pick?", a: "The one that fits the product and your team. I am comfortable across several, and I will explain the choice in plain terms." },
      { q: "Do you build MVPs?", a: "Yes. A good MVP is a deliberately small product on a foundation that will not need rewriting when it works." },
    ],
    related: [
      { label: "ZoneSteward", href: "/work/zonesteward/" },
      { label: "CookieSteward", href: "/work/cookiesteward/" },
      { label: "AI-assisted engineering", href: "/services/ai-assisted-engineering/" },
    ],
  },
  {
    slug: "ai-integration",
    h1: copy["ai-integration"].h1,
    lede: copy["ai-integration"].lede,
    serviceName: "AI integration",
    blocks: [
      {
        h2: "Where AI pays off",
        paras: ["The best candidates are jobs that are tedious for people, have a clear right answer, and happen often. The model does the reading and matching. Code does the validation and the writes. A person checks the cases that matter."],
        items: [
          { title: "Data processing", text: "Orders, invoices, product feeds, spreadsheets and PDFs that arrive in the wrong shape. The model extracts and normalises them and flags what it is unsure of. Clean records go into your system through a validated path." },
          { title: "CRM, ERP and EDI integrations", text: "Connections where the field mapping is messy and the exceptions pile up. AI handles the fuzzy matching and the exception notes. Code handles every write, with a record of what happened." },
          { title: "Dashboards and analytics", text: "Ask a question in plain English and get a chart. The model writes the query, code computes the numbers, and every figure in the answer traces back to the data." },
          { title: "Classification and triage", text: "Support requests, leads, documents, products. The model proposes a category with a confidence score, and a person approves the ones that matter." },
          { title: "Content from your data", text: "Alt text, product descriptions, summaries and first drafts generated from records you already hold, reviewed before they ship." },
          { title: "Internal tools and agents", text: "Small tools that take a recurring job off someone's plate, with a defined scope, a log of what they did, and an off switch." },
        ],
      },
      {
        h2: "How I keep it reliable",
        bullets: [
          "Structured outputs validated against a schema before anything downstream sees them",
          "Numbers computed by code; the model writes the query and explains the result, and any figure that cannot be traced is flagged",
          "Confidence thresholds, with low-confidence cases routed to a review queue instead of guessed",
          "An evaluation set with known answers, run before launch and after every model change",
          "Untrusted input, such as third-party text or uploaded documents, wrapped so it cannot steer the model",
          "A model chosen per task, cost logged per feature, and a way to switch the feature off",
        ],
      },
      {
        h2: "What to avoid",
        bullets: [
          "Models that change production systems with nobody approving",
          "A chatbot with no defined scope or knowledge boundary",
          "Sending sensitive data to a service without a plan for it",
          "Features that cannot be switched off if they misbehave",
        ],
      },
      {
        h2: "The approval-gate pattern",
        paras: [
          "For any AI feature that can change something real, the model proposes, a person approves, and the system verifies the result. The model has no direct write path. This is the pattern ZoneSteward uses, where every change is approved on the server and checked against the live system afterward.",
        ],
      },
      {
        h2: "Work I have done",
        bullets: [
          "ZoneSteward: the model writes Cloudflare analytics queries, the server computes the figures, and every number in an answer is traced; alert rules drafted from a sentence and dry-run before they are armed; AI incident investigation with a suggested fix behind an approval card",
          "CookieSteward: unknown trackers classified by AI with structured output and a confidence score, hardened against prompt injection, with a person approving each verdict",
          "An alt-text plugin on the Claude API, deployed across an agency's whole client portfolio",
          "AI-assisted development adopted across a web team, with standards and review to match",
          "Years of the plumbing these features sit on: Sage 100 and QuickBooks sync, TrueCommerce EDI, point-of-sale and CRM integrations for stores and B2B businesses",
        ],
      },
      {
        h2: "Cost and data handling",
        paras: [
          "AI features have running costs and data implications, and both should be decided up front. I scope usage costs, choose which model fits each task, decide what data leaves your systems, and make sure there is a way to monitor and limit all of it.",
        ],
      },
      {
        h2: "A fixed-scope AI audit",
        paras: [
          "If you are not sure where AI would help, I can run a short audit. I look at your processes, data and systems, identify the jobs where AI would pay off, describe how each would work with a person in control, and estimate effort and risk. You leave with a plan whether or not we build it together.",
        ],
      },
    ],
    faq: [
      { q: "Can AI really handle our order and product data?", a: "Yes, for the parts that are pattern work: reading, matching, normalising and flagging. The write into your ERP or CRM is ordinary validated code, and anything below a confidence threshold goes to a person." },
      { q: "Which models do you use?", a: "Mostly Claude through its API, and I pick the model per task. The right choice depends on quality needed, speed, cost and data requirements." },
      { q: "Will it make things up?", a: "Models can be wrong. That is why numbers are computed by code, outputs are checked against a schema, and a person sits in the approval step for anything consequential." },
      { q: "Can you add AI to my existing WordPress site or store?", a: "Yes, as a plugin or a connected service, with the same approval pattern and clear limits on what it may do." },
      { q: "What happens to my data?", a: "We decide it together before building: what is sent, to which provider, under what terms, and what is stored. Nothing is sent that you have not agreed to." },
    ],
    related: [
      { label: "ZoneSteward", href: "/work/zonesteward/" },
      { label: "Integrations and automation", href: "/services/#integrations-and-automation" },
      { label: "Web apps and SaaS", href: "/services/web-app-saas-development/" },
    ],
  },
  {
    slug: "ai-assisted-engineering",
    h1: copy["ai-assisted-engineering"].h1,
    lede: copy["ai-assisted-engineering"].lede,
    serviceName: "AI-assisted web development",
    blocks: [
      {
        h2: "How AI is used on a project",
        items: [
          { title: "Research and drafting", text: "Gathering context, drafting content and documentation, exploring options." },
          { title: "Scaffolding and boilerplate", text: "The repetitive code that used to take hours of typing." },
          { title: "Tests", text: "First drafts of tests that I then review and extend." },
          { title: "Review support", text: "A second pair of eyes that points to things worth checking." },
        ],
      },
      {
        h2: "What is never delegated",
        bullets: [
          "Architecture and trade-offs",
          "Security-sensitive code, without line-by-line review",
          "The decision about what ships",
          "Conversations with you",
        ],
      },
      {
        h2: "Why experience matters",
        paras: [
          "Every language I have worked in shares the same bones: control flow, data structures, state, input and output, and the same ways of failing. That is why a senior engineer can read an unfamiliar codebase in an afternoon, and why AI output is easy to judge once you know what correct looks like. AI is fast and fluent and sometimes confidently wrong. Knowing the difference takes years of watching software fail. For example, a draft might apply a change before checking that a person approved it. Catching that is the job.",
        ],
      },
      {
        h2: "Stack-agnostic by design",
        paras: [
          "After twenty years across PHP, JavaScript, TypeScript, Python and SQL, a new framework is a dialect, and reading what code does is the easy part. AI's job is the dialect: the exact signature, the idiom, the boilerplate. Mine is the system: how it is built, where it will fail and what it should do. So I work across TypeScript, Next.js, Node, PHP and WordPress, Python, SQL, Astro and Cloudflare, and pick the tool that fits the problem.",
        ],
      },
      {
        h2: "Where this comes from",
        paras: [
          "I led the adoption of AI-assisted development across an agency web team: the tooling, the standards, and the review that keeps it honest. This site, ZoneSteward and CookieSteward are all built this way.",
        ],
      },
      {
        h2: "Why it costs less and moves faster",
        paras: [
          "An agency bills for a team: strategists, designers, developers, project managers and account managers, each adding hours and handoffs. Here, one engineer covers the chain, with AI removing the typing and lookup that used to fill a developer's day. There are fewer handoffs, no team overhead and no relay of messages, and I give direct attention to every decision.",
        ],
      },
    ],
    faq: [
      { q: "Is this just copy and paste from a chatbot?", a: "No. AI is one tool inside a process with design gates, staging, tests and review. The output is read and judged by a person, and the architecture decisions are mine." },
      { q: "Does it lower quality?", a: "It should not, and the process is built to prevent it: tests, review, accessibility and security checks run on every project." },
      { q: "Who is responsible when something is wrong?", a: "I am. Nothing ships that I have not reviewed, and you have one accountable person to talk to." },
    ],
    related: [
      { label: "AI integration", href: "/services/ai-integration/" },
      { label: "How a project runs", href: "/process/" },
      { label: "About", href: "/about/" },
    ],
  },
];

export const hubSections: { id: string; name: string; text: string; bullets: string[] }[] = [
  {
    id: "integrations-and-automation",
    name: "Integrations and automation",
    text: "Most businesses run on several systems that do not talk to each other, and people fill the gaps by hand. I connect the systems and build small internal tools that remove that manual work. I have connected WooCommerce to Sage 100, QuickBooks, point-of-sale systems and EDI partners, and built tools that watch a whole portfolio of sites for vulnerable plugins.",
    bullets: [
      "API integrations between your store, ERP, accounting and CRM",
      "Data sync with proper error handling and a record of what happened",
      "Internal tools for the repetitive jobs your team does every week",
      "Webhooks, scheduled jobs and queues, built to recover from failure",
    ],
  },
  {
    id: "security-performance-accessibility",
    name: "Security, performance and accessibility",
    text: "Every build is held to the same standard, and I also work on existing sites that need to catch up. I have led incident response for compromised sites, run cyber-insurance audit remediation, and administered Cloudflare WAF and DNS for a large portfolio.",
    bullets: [
      "Security headers, firewall configuration and least-privilege access",
      "Hardening and cleanup for sites that have been compromised",
      "Core Web Vitals improvements and caching",
      "WCAG AA review and remediation",
    ],
  },
];
