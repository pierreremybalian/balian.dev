export interface Stage {
  n: number;
  name: string;
  text: string;
  group: string;
  gate?: boolean;
  key?: boolean;
  detail: string;
  youGet: string;
}

export const stages: Stage[] = [
  { n: 1, name: "Discovery", group: "Understand", text: "Intake call, fact gathering, one named approver.",
    detail: "We talk about the business, the problem and the constraints. I review the current site if there is one, list what I find, and ask the questions only you can answer. One person on your side is named as the approver, so feedback does not arrive from five directions.",
    youGet: "A fact sheet and a short list of questions." },
  { n: 2, name: "Research", group: "Understand", text: "Goals, competitors and SEO investigation.",
    detail: "I look at what success means for this project, who else is in the space, and what people actually search for. This keeps the later decisions grounded in evidence instead of taste.",
    youGet: "A short research summary." },
  { n: 3, name: "Strategy", group: "Strategy", text: "Content strategy, keyword plan, site architecture.", gate: true,
    detail: "The plan for what the site says, to whom, and how pages connect. It covers the sitemap, the keywords each page targets, and what content needs to exist before design starts.",
    youGet: "A content strategy and sitemap for you to approve." },
  { n: 4, name: "Proposal", group: "Strategy", text: "Scope, timeline, price, payment milestones.", gate: true,
    detail: "A written scope with a timeline, a price and payment milestones tied to the approval gates. Nothing is built until you agree to it. Anything that is not in the scope is a separate quote, and I say that up front so it never comes as a surprise.",
    youGet: "A proposal for you to approve." },
  { n: 5, name: "Styleframes", group: "Design", text: "Three distinct directions for the same content.", key: true,
    detail: "I design three visual directions using your real content. They differ in mood, type and layout, so you are choosing between real options instead of three tints of one idea.",
    youGet: "Three styleframes to react to." },
  { n: 6, name: "Direction approval", group: "Design", text: "You choose one, or a mix, and say what to change.", gate: true, key: true,
    detail: "You pick a direction, or combine pieces of several, and tell me what is wrong with it. That feedback is applied to the design system, so the fix shows up everywhere it applies.",
    youGet: "A chosen direction with your notes applied." },
  { n: 7, name: "Design system and blocks", group: "Design", text: "The system and the blocks pages are built from.", gate: true, key: true,
    detail: "The chosen direction becomes a design system: type, colour, spacing and the blocks every page is assembled from. I do not mock up every page. You approve the system and the block designs, and that approval locks the look of the site.",
    youGet: "A design system and block designs, approved." },
  { n: 8, name: "Build plan", group: "Build", text: "A brief per page: which blocks, what content.",
    detail: "Each page gets a brief that says which blocks it uses and what goes in them, with the content planned against the business goals from the strategy. The build is broken into pieces that can be checked one at a time.",
    youGet: "A build plan." },
  { n: 9, name: "First draft", group: "Build", text: "The whole site on staging, with your content.",
    detail: "AI executes the build plan and I read every line. You get a first draft of the whole site on a staging link, with your real content in it, usually sooner than you expect. Tests are written alongside the code.",
    youGet: "A complete first draft on staging." },
  { n: 10, name: "Two revision rounds", group: "Build", text: "Two rounds of fixes. New ideas go on the Phase 2 list.", gate: true, key: true,
    detail: "You go through the staging site and your approver sends me one consolidated list. I fix it and send it back. That happens twice. A fix is anything that does not match what we approved. A new idea is welcome, and it goes on the Phase 2 list to be quoted after launch. After round two the design is set and you sign off.",
    youGet: "A finished site, your sign-off, and a Phase 2 list." },
  { n: 11, name: "Quality checks", group: "Launch", text: "Accessibility, speed, security, SEO.",
    detail: "Accessibility against WCAG AA, performance against Core Web Vitals, security headers and configuration, structured data, redirects, and testing across browsers and devices.",
    youGet: "A QA report." },
  { n: 12, name: "Launch", group: "Launch", text: "Checklist, release, monitoring.", gate: true,
    detail: "A pre-launch checklist, the release itself, and monitoring while the site settles. You approve before it goes live.",
    youGet: "A live site and its documentation." },
  { n: 13, name: "Support and Phase 2", group: "Launch", text: "Two weeks of fixes, then the Phase 2 list gets quoted.",
    detail: "Two weeks of fixes and questions after launch are included. Once the launch invoice is paid, I quote the Phase 2 list and we do the items worth doing. Ongoing care is optional and agreed separately.",
    youGet: "A support period, and a quote for Phase 2." },
];

export const groups = ["Understand", "Strategy", "Design", "Build", "Launch"] as const;
