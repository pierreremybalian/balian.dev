// Documents Pierre generates for a lead: proposal, agreement, statement of work. Markdown with placeholders.
// Plain TypeScript, no imports: functions/lib/templates.ts loads this too.
export interface DocTemplate {
  id: "proposal" | "agreement" | "sow";
  name: string;
  title: string; // document title, with placeholders
  fields: { id: string; label: string; help?: string; multiline?: boolean }[]; // asked in the admin when generating
  body: string;
}

export const docTemplates: DocTemplate[] = [
  {
    id: "proposal",
    name: "Proposal",
    title: "Proposal for {{company}}",
    fields: [
      { id: "summary", label: "What this project is, in two or three sentences", multiline: true },
      { id: "deliverables", label: "Deliverables, one per line", multiline: true },
      { id: "price", label: "Price", help: "For example $18,000" },
      { id: "timeline", label: "Timeline", help: "For example eight weeks from the discovery call" },
      { id: "out_of_scope", label: "Out of scope, one per line", help: "Things that were discussed and are deliberately not included", multiline: true },
    ],
    body: `# Proposal for {{company}}

Prepared for {{name}} by Pierre Balian, Balian.dev. {{date}}

## What this is

{{summary}}

## What you get

{{deliverables_list}}

Every build also includes: content written from our recorded interview and your existing materials, accessibility to WCAG AA, performance against Core Web Vitals, security headers and hardening, structured data and redirects, documentation and a walkthrough for your team, and two weeks of support after launch.

## How the project runs

The work follows the thirteen stages described at https://balian.dev/process/, with your approval at six gates: strategy, proposal, design direction, design system and blocks, the final revision round, and launch. Design comes before build. You will see three styleframes, choose a direction, approve the design system and the blocks pages are built from, then get a first draft of the whole site on staging.

## Revisions

Two revision rounds on the staging site, each one a single consolidated list from your approver. A fix is anything that does not match what we approved, including a wrong fact or name. A new idea is welcome and goes on the Phase 2 list, to be quoted after launch. After round two the design is set and you sign off.

## Price and payment

**{{price}}**, fixed for the scope above. Payment follows the approval gates:

| Milestone | Share |
| --- | --- |
| On acceptance of this proposal | 40% |
| On approval of the design system and blocks | 30% |
| On final sign-off, before launch | 30% |

Invoices are due within 14 days. Launch follows the final payment.

## Timeline

{{timeline}}. The timeline depends on your approvals arriving within five business days of each gate; delays on either side move the dates by the same amount.

## Out of scope

{{out_of_scope_list}}

Anything not listed under "What you get" is out of scope and quoted separately. New requests during the build go on the Phase 2 list and stay out of the build.

## What I need from you

A single named approver, the recorded discovery interview, your existing materials (logo, brand guidelines, brochures, old copy, photos), and access to the current site, hosting, domain and analytics.

## Accepting

Accepting this proposal is an agreement to the scope, price and payment terms above. The engagement agreement that follows covers ownership, confidentiality and the legal terms. This proposal is valid for 30 days from {{date}}.
`,
  },
  {
    id: "agreement",
    name: "Agreement",
    title: "Engagement agreement: {{company}} and Balian.dev",
    fields: [
      { id: "project", label: "Project, in one line", help: "For example: design and build of a new WooCommerce store" },
      { id: "price", label: "Price" },
      { id: "proposal_date", label: "Date of the accepted proposal" },
    ],
    body: `# Engagement agreement

Between **{{company}}** ("you", "the client") and **Pierre Balian, doing business as Balian.dev**, Minneapolis, Minnesota ("I", "me"). {{date}}

## 1. The work

I will carry out **{{project}}** as described in the proposal accepted on {{proposal_date}} (the "Proposal"), which is part of this agreement. Where this agreement and the Proposal disagree, this agreement applies.

## 2. Price and payment

The price is **{{price}}**, payable in the milestones set out in the Proposal. Invoices are due within 14 days. Work on the next stage starts when the invoice for the previous gate is paid. If an invoice is more than 30 days late I may pause the work and the timeline moves accordingly.

## 3. Approvals and revisions

You name one person as the approver. Approvals at each gate are given in writing (email is fine). Two revision rounds are included on the staging site, as described in the Proposal. Fixes to approved work are included. Changes and new requests are quoted separately and scheduled after launch unless we agree otherwise in writing.

## 4. What you provide

The materials, access and approvals listed in the Proposal, within five business days of each request. You confirm you have the right to use any content, images and trademarks you give me.

## 5. Ownership

On full payment, you own the website, its code, its content and the accounts it runs on (hosting, domain, analytics, payments), and I will hand over logins and documentation. I keep the right to reuse general techniques, components and know-how that are not specific to you, and to show the work in my portfolio unless you ask me not to. Third-party software (WordPress, plugins, themes, fonts, services) stays under its own licence.

## 6. Confidentiality

I keep what I learn about your business confidential and use it only for the work. You do the same for my pricing and methods. This survives the end of the agreement.

## 7. Warranty and support

Two weeks of fixes and questions after launch are included. After that, support is by a separate care plan or by the hour. I do not warrant that the site will achieve any particular business result, ranking or revenue.

## 8. Limitation of liability

My total liability under this agreement is limited to the amount you have paid me for the work. Neither of us is liable to the other for indirect or consequential loss, including lost profit or data, except where the law does not allow that limit.

## 9. Ending the agreement

Either of us can end this agreement with 14 days' written notice. You pay for work completed and in progress to that date, and I hand over what exists at that point. Sections 5, 6 and 8 survive.

## 10. General

This is the whole agreement between us about the work and replaces earlier discussions. Changes must be in writing. Minnesota law applies, and any dispute goes to the courts of Hennepin County, Minnesota, after a good-faith attempt to resolve it directly.

## Acceptance

By accepting below you confirm that you are authorised to enter into this agreement for {{company}} and that you agree to its terms.
`,
  },
  {
    id: "sow",
    name: "Statement of work",
    title: "Statement of work: {{company}}",
    fields: [
      { id: "summary", label: "What this piece of work is", multiline: true },
      { id: "deliverables", label: "Deliverables, one per line", multiline: true },
      { id: "acceptance", label: "How we will know it is done", multiline: true },
      { id: "price", label: "Price" },
      { id: "timeline", label: "Timeline" },
    ],
    body: `# Statement of work for {{company}}

Under the engagement agreement between {{company}} and Balian.dev. {{date}}

## Scope

{{summary}}

## Deliverables

{{deliverables_list}}

## Acceptance

{{acceptance}}

## Price and timeline

**{{price}}**, invoiced on acceptance of this statement of work and on delivery, half each. {{timeline}}.

Anything not listed above is out of scope and quoted separately.
`,
  },
];
