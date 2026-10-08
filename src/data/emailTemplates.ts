// Emails Pierre sends from the admin. Placeholders are filled from the lead and the context (slot, document link, invoice).
// Plain text with light Markdown (**bold**, lists, links); the mail layer renders it into the branded HTML layout.
// Plain TypeScript, no imports: functions/lib/templates.ts loads this too.
export interface EmailTemplate { id: string; name: string; when: string; subject: string; body: string }

export const PLACEHOLDERS = ["name", "first", "company", "website", "slot", "meet", "doc_link", "doc_title", "invoice_number", "amount", "due", "questionnaire_link"] as const;

export const emailTemplates: EmailTemplate[] = [
  {
    id: "reply-brief", name: "Reply to a brief", when: "Within a business day of a contact form or an email.",
    subject: "Your note about {{company}}",
    body: `Hi {{first}},

Thanks for writing. I read your note and had a look at {{website}} before replying, so I already have a rough picture. A few things stood out:

-
-

The quickest next step is a call. Pick a time that suits you: https://balian.dev/contact/#book

Before we talk, this questionnaire takes about twenty minutes and saves us a week: {{questionnaire_link}}

If a call is premature, reply with a couple of lines about what is going on and I will tell you honestly whether I am the right person for it.

Pierre`,
  },
  {
    id: "questionnaire-nudge", name: "Questionnaire nudge", when: "Three or four days after sending the questionnaire link with nothing back.",
    subject: "The questionnaire for {{company}}",
    body: `Hi {{first}},

No pressure, just making sure the link did not get buried: {{questionnaire_link}}

It saves as you go, so ten minutes now and ten later is fine. The parts that matter most are the first two steps and the goals. Skip anything you do not know.

If you would rather just talk, book a slot and we will cover it on the call: https://balian.dev/contact/#book

Pierre`,
  },
  {
    id: "call-confirmation", name: "Call confirmation", when: "A personal note beside the calendar invite, if you want one.",
    subject: "Our call on {{slot}}",
    body: `Hi {{first}},

Looking forward to talking on {{slot}}. The Meet link is in the calendar invite, and here it is again: {{meet}}

Bring whatever is on your mind about the business as well as the website. The useful projects usually come from the problems behind it.

Pierre`,
  },
  {
    id: "after-call", name: "After-call recap", when: "The same day as the discovery call.",
    subject: "What I heard today",
    body: `Hi {{first}},

Thanks for the time today. Here is what I heard, so you can correct me before I go further:

**What the business needs**
-

**What the website has to do**
-

**What is in the way right now**
-

Next from me: a research pass on {{website}} and your market, then a content strategy and a proposal for you to approve. You will hear from me within a week. If I have misread anything above, reply and set me straight.

Pierre`,
  },
  {
    id: "proposal-sent", name: "Proposal sent", when: "With the proposal link, after the research is done.",
    subject: "Proposal: {{doc_title}}",
    body: `Hi {{first}},

The proposal is here: {{doc_link}}

It covers what we agreed, what it costs, how payment follows the approval gates, and what is deliberately out of scope so there are no surprises later. Read it when you have a quiet half hour and send me every question in one go.

If it looks right, there is an Accept button at the bottom. If something is off, tell me and I will revise it. It is valid for 30 days.

Pierre`,
  },
  {
    id: "agreement-sent", name: "Agreement sent", when: "With the agreement link, after the proposal is accepted.",
    subject: "Agreement: {{doc_title}}",
    body: `Hi {{first}},

Thanks for accepting the proposal. The agreement is here: {{doc_link}}

It is short and in plain English: you own the code and the accounts, payment follows the approval gates, two revision rounds, and anything new goes on the Phase 2 list. Accept at the bottom when you are ready and I will send the first invoice and we will book the discovery call.

Pierre`,
  },
  {
    id: "kickoff", name: "Kickoff", when: "After the agreement is accepted and the first invoice is paid.",
    subject: "We are on. Here is what happens next.",
    body: `Hi {{first}},

Thanks, we are on. Here is the sequence so you know what is coming:

1. **Discovery call**, recorded, so I can write the content from it.
2. **Research and a content strategy** for you to approve.
3. **Three styleframes.** You pick a direction, then approve the design system and the blocks pages are built from.
4. **A first draft of the whole site** on staging, with your real content in it, then two revision rounds.
5. **Quality checks, launch, and two weeks of support.**

Two things I need from you now:

- One named approver on your side, so feedback arrives from one direction.
- The materials you already have: logo, brand guidelines, brochures, old copy, photos. Send what exists; rough is fine.

Book the discovery call here when you are ready: https://balian.dev/contact/#book

Pierre`,
  },
  {
    id: "first-draft", name: "First draft ready", when: "When the staging site is up with real content.",
    subject: "Your first draft is up",
    body: `Hi {{first}},

The first draft of the whole site is on staging:

Go through it the way a customer would, on your phone as well as your laptop. Then send me one list from your approver with everything at once. That is revision round one of two.

A reminder on how rounds work: a fix is anything that does not match what we approved, including a wrong fact or name, and those are included. A new idea is welcome and goes on the Phase 2 list for after launch.

Pierre`,
  },
  {
    id: "launch", name: "Launch", when: "The day the site goes live.",
    subject: "{{company}} is live",
    body: `Hi {{first}},

It is live: {{website}}

Documentation, logins and the handover notes are in your shared folder, and everything is in your name: the code, the hosting, the domain and the analytics.

Two weeks of fixes and questions are included from today. After that, the Phase 2 list is ready to quote whenever you are, and I will send a care plan option separately.

Thank you for the trust. It was a good one.

Pierre`,
  },
  {
    id: "phase2", name: "Phase 2 quote", when: "After the launch invoice is paid and the site has settled.",
    subject: "Phase 2 for {{company}}",
    body: `Hi {{first}},

Now that the site has been live for a bit, here is the Phase 2 list we kept during the build, with a rough price against each item:

-
-

None of it is urgent. Pick the ones worth doing, or none, and I will put a proposal together for those.

Pierre`,
  },
  {
    id: "care-plan", name: "Care plan offer", when: "At the end of the two-week support period.",
    subject: "Keeping {{company}} running",
    body: `Hi {{first}},

Your two weeks of included support end soon. If you want me to keep an eye on the site after that, a care plan covers:

- Updates applied on a schedule, with a check that nothing broke
- Uptime and vulnerability monitoring
- A set number of hours a month for small changes
- A named engineer to call when something breaks

The monthly number is in the quote attached. No long contract; stop when you no longer need it.

Pierre`,
  },
  {
    id: "invoice-sent", name: "Invoice sent", when: "With each milestone invoice.",
    subject: "Invoice {{invoice_number}} from Balian.dev",
    body: `Hi {{first}},

Invoice {{invoice_number}} for **{{amount}}** is attached, due **{{due}}**. It covers the milestone we just approved.

Thanks,
Pierre`,
  },
  {
    id: "invoice-reminder", name: "Invoice reminder", when: "A week after the due date.",
    subject: "Invoice {{invoice_number}} is past due",
    body: `Hi {{first}},

A quick nudge: invoice {{invoice_number}} for **{{amount}}** was due {{due}}. If it has already gone out, ignore this. If something is holding it up, tell me and we will sort it.

Pierre`,
  },
];
