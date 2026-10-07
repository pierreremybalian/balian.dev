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
  { n: 4, name: "Proposal", group: "Strategy", text: "Written scope, timeline and price.", gate: true,
    detail: "A written scope with a timeline and a price, based on the approved strategy. Nothing is built until you agree to it.",
    youGet: "A proposal for you to approve." },
  { n: 5, name: "Styleframes", group: "Design", text: "Three distinct directions for the same content.", key: true,
    detail: "I design three visual directions using your real content. They differ in mood, type and layout, so you are choosing between real options instead of three tints of one idea.",
    youGet: "Three styleframes to react to." },
  { n: 6, name: "Direction approval", group: "Design", text: "You choose one, or a mix, and say what to change.", gate: true, key: true,
    detail: "You pick a direction, or combine pieces of several, and tell me what is wrong with it. That feedback is applied to the design system, so the fix shows up everywhere it applies.",
    youGet: "A chosen direction with your notes applied." },
  { n: 7, name: "Refinement", group: "Design", text: "Full-page designs, revised until it is right.", gate: true, key: true,
    detail: "The chosen direction becomes full-page designs for the pages that matter. We go through as many revision rounds as it takes to be right before any production code is written.",
    youGet: "Full-page designs, approved." },
  { n: 8, name: "Build plan", group: "Build", text: "Briefs, design system, components.",
    detail: "Each page gets a brief, the design system gets written down as tokens and components, and the build is broken into pieces that can be checked one at a time.",
    youGet: "A build plan." },
  { n: 9, name: "Build", group: "Build", text: "Staging, regular demos, tests.",
    detail: "Development happens on a staging site you can open at any time. You see working software regularly, and tests are written alongside the code.",
    youGet: "A working site on staging." },
  { n: 10, name: "Content and review", group: "Build", text: "Reviewed in the real site.", gate: true,
    detail: "Copy and images go into the real site and you review them there, where they actually appear. It catches problems that never show up in a document.",
    youGet: "A review link, and your approval." },
  { n: 11, name: "Quality checks", group: "Launch", text: "Accessibility, speed, security, SEO.",
    detail: "Accessibility against WCAG AA, performance against Core Web Vitals, security headers and configuration, structured data, redirects, and testing across browsers and devices.",
    youGet: "A QA report." },
  { n: 12, name: "Launch", group: "Launch", text: "Checklist, release, monitoring.", gate: true,
    detail: "A pre-launch checklist, the release itself, and monitoring while the site settles. You approve before it goes live.",
    youGet: "A live site and its documentation." },
  { n: 13, name: "Support", group: "Launch", text: "Two weeks, then optional care.",
    detail: "Two weeks of fixes and questions after launch are included. After that, ongoing care is optional and agreed separately.",
    youGet: "A support period." },
];

export const groups = ["Understand", "Strategy", "Design", "Build", "Launch"] as const;
