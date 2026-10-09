// The shorter sequences for jobs that are not a new site. The new-site sequence itself is src/data/process.ts.
// Each one is shown as a tab on /process/. Keep the steps honest: these are what actually happens, in order.

export interface Step {
  name: string;
  text: string;
  gate?: boolean; // the client approves before the next step
  youGet?: string;
}

export interface Playbook {
  id: string;
  tab: string; // the tab label, in the client's words
  title: string;
  lede: string;
  pace: string; // how fast it usually moves, stated without invented numbers
  steps: Step[];
  related: { label: string; href: string }[];
  faq: { q: string; a: string }[];
}

export const playbooks: Playbook[] = [
  {
    id: "feature",
    tab: "Add a feature to our site",
    title: "A new feature on a site that already exists.",
    lede: "A booking form, a member area, a product configurator, a new section. The site is live and people are using it, so the job is to add the thing without breaking what works.",
    pace: "Small features ship in days. Larger ones get a staging link within the first week or two.",
    steps: [
      { name: "Read the codebase and the request", text: "I read the code the feature has to live in, note what it touches and what could break, and ask the questions only you can answer.", youGet: "A short note on what the feature touches and any risks." },
      { name: "Scope and quote", text: "A fixed price for a written scope, with what is out of scope named so it never surprises anyone.", gate: true, youGet: "A proposal to approve." },
      { name: "Design, if it has a face", text: "Anything a visitor sees is designed inside your existing design system first, so it looks like it was always there.", gate: true, youGet: "A design to approve." },
      { name: "Build on staging, with tests", text: "AI executes the plan, I read every line, and tests cover the behaviour that matters. You get a staging link, never a surprise on the live site.", youGet: "The feature on staging." },
      { name: "One review round", text: "Your approver sends one consolidated list. Anything that does not match the scope or the design is fixed. New ideas are quoted separately.", gate: true, youGet: "Your sign-off." },
      { name: "Release and watch", text: "Released at a quiet hour, behind a switch where that makes sense, with monitoring on for the first days.", youGet: "The feature live, and documentation for whoever maintains it." },
      { name: "Two weeks of fixes", text: "Anything that turns up in the first two weeks is fixed as part of the job.", youGet: "A support period." },
    ],
    related: [
      { label: "Websites and CMS", href: "/services/websites-and-cms/" },
      { label: "Web apps and SaaS", href: "/services/web-app-saas-development/" },
    ],
    faq: [
      { q: "Can you work on a site someone else built?", a: "Yes, and most of this work is. I read the code first and tell you what I found before quoting, so you know whether the feature is a day or a month before anyone commits." },
      { q: "What if the codebase is a mess?", a: "I say so, with specifics, and give you two prices: the feature on top of what is there, and the cleanup that would make the next feature cheaper. You choose." },
      { q: "Do I get the same gates as a new site?", a: "The ones that matter: you approve the scope, the design if it has one, and the staging build before release. The rest compress because the site already exists." },
    ],
  },
  {
    id: "cyber-insurance",
    tab: "Remediate our cyber-insurance audit",
    title: "The insurer sent a questionnaire, or a list of findings.",
    lede: "MFA, patching, backups, headers, a WAF, logging, and proof of all of it. The underwriter wants evidence, and the renewal has a date on it.",
    pace: "Most portfolios are remediated and evidenced within a few weeks. Deadlines are respected.",
    steps: [
      { name: "Translate the questionnaire", text: "I turn the insurer's questions into a list of actual controls on your actual systems, and mark which ones already pass.", youGet: "A plain-English control list with pass, fail and unknown." },
      { name: "Inventory", text: "Hosting, DNS, WAF, who has access to what, how patches happen, whether backups exist and whether anyone has ever restored one.", youGet: "An inventory of what the insurer is asking about." },
      { name: "Plan by what underwriters check", text: "A ranked plan with the deadline in view. I have run this across a whole client portfolio and I know which items carry weight.", gate: true, youGet: "A remediation plan and price to approve." },
      { name: "Fix", text: "MFA everywhere, patching, backups tested by restoring them, security headers, WAF rules, access reviews, logging. On live systems, with your approval at each step that could affect users.", youGet: "The controls in place." },
      { name: "Evidence pack", text: "Screenshots, configuration exports and short policy statements, written for the person at the insurer who reads them.", youGet: "A pack you can attach to the questionnaire." },
      { name: "Keep it true", text: "Monitoring and a scheduled check, so next year's questionnaire is a formality instead of a scramble.", youGet: "A care plan, if you want one." },
    ],
    related: [
      { label: "Compliance and remediation", href: "/services/compliance-and-remediation/" },
      { label: "Technology consulting", href: "/services/technology-consulting/" },
    ],
    faq: [
      { q: "Can you fill in the questionnaire for us?", a: "I draft the technical answers and the evidence behind each one. You sign it, because the insurer is asking you, and you should understand every answer before you do." },
      { q: "We answered yes to things that are not true. Now what?", a: "We make them true before renewal, in order of what the underwriter would check first. That is most of this work, and it is better done now than during a claim." },
      { q: "Will this disrupt the business?", a: "MFA rollouts and access reviews touch people, so those are scheduled with you. The rest is infrastructure and happens without anyone noticing." },
    ],
  },
  {
    id: "accessibility",
    tab: "Remediate our accessibility audit",
    title: "An ADA demand letter, a WCAG audit, or a customer who could not use the site.",
    lede: "The letter names pages and failures. The real list is usually longer, and the fix has to hold up to a lawyer as well as a screen reader.",
    pace: "The highest-risk fixes go live within days of the plan. Full remediation of a large site runs a few weeks.",
    steps: [
      { name: "Read the complaint and confirm the standard", text: "Which pages, which failures, which version of WCAG. Most letters cite 2.1 or 2.2 AA. I scope the templates behind the pages, because one template fix covers many pages.", youGet: "A scoped list of what the letter actually requires." },
      { name: "My own audit", text: "Automated checks, then manual testing with a keyboard and a screen reader. Complaint lists are rarely complete, and the next letter will find what this one missed.", youGet: "A full findings report, ranked by risk." },
      { name: "Plan", text: "Fixes ordered by legal risk and by how many pages each one clears. Anything that changes how the site looks is called out before it happens.", gate: true, youGet: "A remediation plan and price to approve." },
      { name: "Fix on staging", text: "Structure and headings, contrast, keyboard access, focus, forms and errors, images and media, PDFs and documents. Checked page by page against the standard.", youGet: "The fixes on staging to review." },
      { name: "Verify", text: "Re-tested with assistive technology and re-run against the standard, with the results recorded.", youGet: "Before and after evidence." },
      { name: "Statement and evidence for your lawyer", text: "An accessibility statement for the site, a record of what changed, and a dated note of anything that remains and when it will be done.", youGet: "What your lawyer asked for." },
      { name: "Keep it that way", text: "Accessibility checks in the deploy process, and a care plan if the site changes often.", youGet: "A way to stay compliant." },
    ],
    related: [
      { label: "Compliance and remediation", href: "/services/compliance-and-remediation/" },
      { label: "CookieSteward", href: "/work/cookiesteward/" },
    ],
    faq: [
      { q: "Can you make the site fully compliant?", a: "Nobody can certify a site as compliant, and anyone who promises it is selling something. What I deliver is work done against WCAG AA, evidence of it, and a statement your lawyer can use. That is what courts and plaintiffs' firms actually look at." },
      { q: "Will an overlay widget fix this?", a: "No. Overlays are named in a growing number of these lawsuits as the problem, and they do nothing for the structure of the page. I remove them." },
      { q: "How fast can the first fixes go live?", a: "Within days of the plan. Letters have deadlines, so the highest-risk items are fixed first and documented as they go." },
    ],
  },
  {
    id: "hacked",
    tab: "Help, we have been hacked",
    title: "The site is defaced, redirecting, sending spam, or someone is in your systems.",
    lede: "This one does not wait for a proposal. Containment comes first, the paperwork comes after, and I have done this more times than I would like.",
    pace: "Containment the same day. Cleanup and hardening over the following days. The report when it is over.",
    steps: [
      { name: "Contain", text: "Take the site offline or behind Cloudflare, rotate every credential, preserve the logs and a copy of the compromised system for forensics before anything is cleaned.", youGet: "The bleeding stopped, with evidence preserved." },
      { name: "Find out what happened", text: "The entry point, what was touched, how long they were in, and whether any data left. This decides what you are obliged to tell people.", youGet: "A plain-English account of the incident so far." },
      { name: "Clean and rebuild from known good", text: "A fresh install, verified files, the backdoors closed, the malware gone. A compromised site is rebuilt, never patched over.", youGet: "A clean site, ready to go back." },
      { name: "Harden", text: "Patching, MFA, WAF rules, least-privilege access, security headers, monitoring. The hole that let them in, and the next three.", youGet: "A site that is harder to get into than the one they found." },
      { name: "Tell the people who need to know", text: "Your customers, your insurer, your lawyer, and anyone the law says you must notify. I help you write it so it is honest and calm.", gate: true, youGet: "A notification draft you approve before it goes out." },
      { name: "Return to service", text: "Back online with monitoring and alerts, and a watch on it for the first weeks.", youGet: "A live site with someone watching." },
      { name: "Post-incident report", text: "What happened, what was done, and the list of changes that keep it from happening twice. Written for you and for the insurer.", youGet: "The report, and a plan for what comes next." },
    ],
    related: [
      { label: "Compliance and remediation", href: "/services/compliance-and-remediation/" },
      { label: "Hosting and care", href: "/services/#hosting-and-care" },
    ],
    faq: [
      { q: "What should we do right now, before you answer?", a: "Change the passwords you can reach, especially hosting and email. Do not delete anything, do not restore a backup yet, and write down the time you noticed. Then call." },
      { q: "Do we have to tell our customers?", a: "It depends on what was taken and where your customers live. Finding that out is step two, and I help you write the notice if one is required. Saying nothing when the law requires notice is the expensive option." },
      { q: "Can we just restore a backup?", a: "Only once we know when the break-in happened. A backup from after it just restores the attacker. Containment and forensics come first, then a clean rebuild." },
    ],
  },
  {
    id: "migration",
    tab: "Move our store to a new platform",
    title: "A store or site that has to move without losing orders, customers or rankings.",
    lede: "Off a proprietary cart, off BigCommerce, between WooCommerce and Shopify, or off a platform that is about to be switched off. The data comes with you and the URLs keep working.",
    pace: "Weeks for most stores. Catalog size and the number of integrations set the pace, and the cutover is one quiet hour.",
    steps: [
      { name: "Inventory the risk", text: "Catalog, customers, order history, URLs, integrations, search rankings. What has to come across exactly, and what the old platform is hiding.", youGet: "A migration inventory with the risks named." },
      { name: "Plan and quote", text: "The target platform, the data mapping, the integrations to rebuild, the redirect approach and a cutover plan.", gate: true, youGet: "A proposal to approve." },
      { name: "Test migration on staging", text: "The data moved by script, reconciled against the source, and the mismatches fixed in the script so the real run is a repeat of a rehearsal.", youGet: "Your store on staging with your real data." },
      { name: "Rebuild the integrations", text: "Payments, tax, shipping, accounting, ERP and EDI connected to the new platform and tested against real transactions.", youGet: "Integrations that work before launch." },
      { name: "Redirects and search", text: "Every product and category URL mapped, metadata carried over, redirects tested, so search engines follow you to the new address.", youGet: "A redirect map and a search checklist." },
      { name: "Your review", text: "You and your team work the staging store like customers and like staff. One consolidated list, fixed and re-checked.", gate: true, youGet: "Your sign-off for cutover." },
      { name: "Cutover and watch", text: "Final data sync, DNS switch at a quiet hour, the first orders verified by hand, and search traffic watched for weeks after.", youGet: "A live store and its documentation." },
    ],
    related: [
      { label: "WooCommerce and Shopify", href: "/services/woocommerce-development/" },
      { label: "WordPress", href: "/services/wordpress-development/" },
    ],
    faq: [
      { q: "Will we lose our search rankings?", a: "Rankings move when URLs change and nobody maps them. Every product and category URL is redirected and the metadata carried over, and I watch Search Console for weeks after. A dip in the first days is normal; a cliff is a migration done wrong." },
      { q: "Does the old store stay up during the move?", a: "Yes. The new store is built and tested on staging while the old one keeps selling. The cutover is one quiet hour with a final data sync." },
      { q: "What about orders placed during the cutover?", a: "The final sync happens after the old store is put into maintenance, so nothing falls between the two. The first orders on the new store are checked by hand." },
    ],
  },
  {
    id: "integration",
    tab: "Connect two systems",
    title: "Two systems that should talk, and a person retyping between them.",
    lede: "Orders into accounting, customers into the CRM, inventory out of the ERP, EDI to a distributor. The integration has to be right, and it has to tell you when it is not.",
    pace: "Simple syncs in days. ERP and EDI work in weeks, most of it testing against real data.",
    steps: [
      { name: "Map the data and who owns the truth", text: "Which system is the source for each field, what each side calls things, and where the records disagree today.", youGet: "A data map." },
      { name: "Decide the rules", text: "What syncs, in which direction, how often, and what happens when the two sides conflict. Decided with you, written down.", gate: true, youGet: "Sync rules and a price to approve." },
      { name: "Build with validation and a review queue", text: "Every record validated before it moves, every move logged, retries on failure, and ambiguous records held for a person instead of guessed.", youGet: "The integration on staging." },
      { name: "Test against real data", text: "Run against a copy of your real records and reconciled line by line until the numbers match.", youGet: "A reconciliation report." },
      { name: "Go live and watch", text: "Switched on with alerts, watched closely for the first week.", youGet: "A working integration." },
      { name: "Handover", text: "Documentation, the alerts and what they mean, and what to do when a record is held for review.", youGet: "Something your team can run." },
    ],
    related: [
      { label: "AI integration and data", href: "/services/ai-integration/" },
      { label: "WooCommerce and Shopify", href: "/services/woocommerce-development/" },
    ],
    faq: [
      { q: "Should we buy a connector instead?", a: "Sometimes. If a well-kept connector exists for your exact pair of systems and your rules are standard, buy it and I will configure it. Custom work is for when the rules are yours, the systems are older, or the connector costs more per year than building." },
      { q: "What happens when it fails?", a: "It tells you. Failed records are retried, ambiguous ones are held for a person, and an alert says what is waiting. Silent failure is the one outcome I design against." },
      { q: "Can it start small?", a: "Yes, and it should. One direction, one record type, watched for a week, then the next. Big-bang integrations are how data gets corrupted on both sides at once." },
    ],
  },
  {
    id: "audit",
    tab: "Give us a second opinion",
    title: "A technical audit, a vendor review, or a straight answer about what you are paying for.",
    lede: "Someone quoted you a number, a platform is up for renewal, or the site has a smell you cannot name. You want an engineer with no stake in the answer.",
    pace: "A focused audit takes a week or two. The findings are the deliverable, whether or not I do the work after.",
    steps: [
      { name: "Scoping call", text: "What decision you are trying to make, what you suspect, and what you need to be able to say to your board, partner or vendor afterward.", youGet: "A scope and a fixed price." },
      { name: "Read everything", text: "Code, hosting, DNS, the vendor contracts, the invoices, the analytics, and the process behind them.", youGet: "Nothing yet. This is the quiet part." },
      { name: "Talk to the people who do the work", text: "Short interviews with the people who use the systems every day. They know where the time goes.", youGet: "Their side of the story, in the findings." },
      { name: "Findings, ranked by risk and money", text: "Written in plain English, with what each item costs you now and what fixing it would cost. No jargon and no padding.", youGet: "The findings report. This is the deliverable." },
      { name: "A plan with options", text: "Keep, fix or replace, with numbers against each, and my recommendation stated plainly.", gate: true, youGet: "A plan you can act on with anyone." },
      { name: "Then your call", text: "Hand it to your team or your vendor, or have me run it. The report is written so either works.", youGet: "A quote for the work, if you want one." },
    ],
    related: [
      { label: "Technology consulting", href: "/services/technology-consulting/" },
      { label: "The blog", href: "/blog/" },
    ],
    faq: [
      { q: "Will you just recommend yourself for the work?", a: "The findings are priced on their own and written so your team or any vendor can act on them. If I think I am the right person for what follows I will say so, with a price, and you can take it elsewhere." },
      { q: "Can you review a vendor's proposal?", a: "Yes. I read it the way the vendor hopes you will not: what is actually included, what the hourly rate works out to, what happens at renewal, and what you own at the end." },
      { q: "How honest is honest?", a: "If your site is fine, the report says so and the engagement is short. If the problem is a decision you made, the report says that too, politely." },
    ],
  },
  {
    id: "care",
    tab: "Keep our site healthy",
    title: "A site that is live and needs someone to own it.",
    lede: "Updates, backups, monitoring, the occasional fix, and a person to call when something is wrong. The agency is gone or the developer moved on.",
    pace: "Onboarding takes a week. After that it runs every month without you thinking about it.",
    steps: [
      { name: "Take stock", text: "Access to everything, a read of the code and hosting, and a list of what is out of date, unmonitored or one incident away from a bad week.", youGet: "A health report." },
      { name: "Fix the urgent items", text: "Patches, backups that have been tested, monitoring switched on, the obvious holes closed.", gate: true, youGet: "A stable baseline and a quote for the plan." },
      { name: "Monthly care", text: "Updates applied on staging first, backups verified, uptime and security monitored, performance checked, and a short report of what was done.", youGet: "A monthly report." },
      { name: "A person to call", text: "Small fixes and questions handled inside the plan. Larger work quoted separately, so the plan stays predictable.", youGet: "Someone who knows your site." },
      { name: "A yearly review", text: "What changed, what is aging, what the next year should include.", youGet: "A plan for the year." },
    ],
    related: [
      { label: "Hosting and care", href: "/services/#hosting-and-care" },
      { label: "WordPress", href: "/services/wordpress-development/" },
    ],
    faq: [
      { q: "Can you take over a site you did not build?", a: "That is most of them. The health report in the first week tells you what you inherited, and anything urgent is fixed before the monthly plan starts." },
      { q: "What does the plan include?", a: "Updates, backups, monitoring, performance checks, small fixes and questions, and a monthly report. Larger work is quoted separately so the plan stays the same price every month." },
      { q: "What if I want to leave?", a: "You own everything, you have the documentation, and the plan ends at the end of the month. No lock-in, because lock-in is a reason to stay for the wrong reason." },
    ],
  },
];
