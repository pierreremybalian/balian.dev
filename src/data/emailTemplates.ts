// Emails Pierre sends from the admin. Placeholders are filled from the lead and the context (slot, document link, invoice).
// Plain TypeScript, no imports: functions/lib/templates.ts loads this too.
export interface EmailTemplate { id: string; name: string; when: string; subject: string; body: string }

export const PLACEHOLDERS = ["name", "first", "company", "website", "slot", "meet", "doc_link", "doc_title", "invoice_number", "amount", "due", "questionnaire_link"] as const;

export const emailTemplates: EmailTemplate[] = [
  {
    id: "reply-brief", name: "Reply to a brief", when: "Within a day of a contact form or email.",
    subject: "Your note about {{company}}",
    body: `Hi {{first}},

Thanks for writing. I read your note and had a look at {{website}} before replying, so I have a rough picture already.

The quickest next step is a call. You can pick a time here: https://balian.dev/contact/#book. Before we talk, this questionnaire takes about twenty minutes and saves us a week: {{questionnaire_link}}

If a call is premature, reply with a couple of lines about what is going on and I will tell you honestly whether I am the right person.

Pierre`,
  },
  {
    id: "questionnaire-nudge", name: "Questionnaire nudge", when: "A few days after sending the questionnaire link with no answers back.",
    subject: "The questionnaire for {{company}}",
    body: `Hi {{first}},

No pressure, just making sure the link did not get buried: {{questionnaire_link}}

It saves as you go, so ten minutes now and ten later is fine. The parts that matter most are the first two steps and the goals. Skip anything you do not know.

Pierre`,
  },
  {
    id: "call-confirmation", name: "Call confirmation", when: "After a call is booked, if you want a personal note beside the calendar invite.",
    subject: "Our call on {{slot}}",
    body: `Hi {{first}},

Looking forward to talking on {{slot}}. The Meet link is in the calendar invite: {{meet}}

Bring whatever is on your mind about the business as well as the website. The useful projects usually come from the problems behind it.

Pierre`,
  },
  {
    id: "after-call", name: "After-call recap", when: "The same day as the discovery call.",
    subject: "What I heard today",
    body: `Hi {{first}},

Thanks for the time today. Here is what I heard, so you can correct me before I go further:

-
-
-

Next from me: a short research pass on {{website}} and your market, then a content strategy and a proposal for you to approve. You will hear from me within a week.

Pierre`,
  },
  {
    id: "proposal-sent", name: "Proposal sent", when: "With the proposal link.",
    subject: "Proposal: {{doc_title}}",
    body: `Hi {{first}},

The proposal is here: {{doc_link}}

It covers what we agreed, what it costs, how payment follows the approval gates, and what is deliberately out of scope so there are no surprises later. Read it when you have a quiet half hour and send me every question at once.

If it looks right, there is an Accept button at the bottom. If something is off, tell me and I will revise it.

Pierre`,
  },
  {
    id: "agreement-sent", name: "Agreement sent", when: "With the agreement link, after the proposal is accepted.",
    subject: "Agreement: {{doc_title}}",
    body: `Hi {{first}},

The agreement is here: {{doc_link}}

It is short and in plain English: you own the code and the accounts, payment follows the approval gates, two revision rounds, and anything new goes on the Phase 2 list. Accept at the bottom when you are ready and I will send the first invoice and book the discovery call.

Pierre`,
  },
  {
    id: "kickoff", name: "Kickoff", when: "After the agreement is accepted and the first invoice is paid.",
    subject: "We are on. Here is what happens next.",
    body: `Hi {{first}},

Thanks, we are on. Here is the sequence so you know what is coming:

1. Discovery call, recorded, so I can write the content from it.
2. Research and a content strategy for you to approve.
3. Three styleframes, you pick a direction, then the design system and blocks.
4. A first draft of the whole site on staging, then two revision rounds.
5. Quality checks, launch, two weeks of support.

The one thing I need from you now is a named approver on your side, and the materials you already have: logo, brochures, old copy, photos. Send what you have; rough is fine.

Pierre`,
  },
  {
    id: "first-draft", name: "First draft ready", when: "When the staging site is up with real content.",
    subject: "Your first draft is up",
    body: `Hi {{first}},

The first draft of the whole site is on staging:

Go through it the way a customer would, on your phone as well as your laptop. Then send me one list from your approver with everything at once. That is revision round one of two.

A fix is anything that does not match what we approved, including wrong facts or names. A new idea is welcome and goes on the Phase 2 list for after launch.

Pierre`,
  },
  {
    id: "launch", name: "Launch", when: "The day the site goes live.",
    subject: "{{company}} is live",
    body: `Hi {{first}},

It is live. Documentation, logins and the handover notes are in your shared folder, and everything is in your name.

Two weeks of fixes and questions are included from today. After that, the Phase 2 list is ready to quote whenever you are, and I will send a care plan option separately.

Thank you for the trust. It was a good one.

Pierre`,
  },
  {
    id: "phase2", name: "Phase 2 quote", when: "After the launch invoice is paid.",
    subject: "Phase 2 for {{company}}",
    body: `Hi {{first}},

Now that the site has been live for a bit, here is the Phase 2 list we kept during the build, with a rough price against each item:

-
-

None of it is urgent. Pick the ones worth doing, or none, and I will put a proposal together for those.

Pierre`,
  },
  {
    id: "care-plan", name: "Care plan offer", when: "At the end of the support period.",
    subject: "Keeping {{company}} running",
    body: `Hi {{first}},

Your two weeks of included support end soon. If you want me to keep an eye on the site after that, here is what a care plan looks like: updates applied on a schedule, uptime and vulnerability monitoring, a set number of hours a month for small changes, and a named engineer to call when something breaks.

The monthly number is in the attached quote. No long contract; stop when you no longer need it.

Pierre`,
  },
  {
    id: "invoice-sent", name: "Invoice sent", when: "With each milestone invoice.",
    subject: "Invoice {{invoice_number}} from Balian.dev",
    body: `Hi {{first}},

Invoice {{invoice_number}} for {{amount}} is attached, due {{due}}. It covers the milestone we just approved.

Thanks,
Pierre`,
  },
  {
    id: "invoice-reminder", name: "Invoice reminder", when: "A week after the due date.",
    subject: "Invoice {{invoice_number}} is past due",
    body: `Hi {{first}},

A quick nudge: invoice {{invoice_number}} for {{amount}} was due {{due}}. If it has already gone out, ignore this. If something is holding it up, tell me and we will sort it.

Pierre`,
  },
];
