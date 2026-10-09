---
title: "Your CRM is a cathedral and you need a shed"
summary: "Most businesses use a sliver of the ERP or CRM they pay for. What the big systems cost, why they are overbuilt on purpose, and what a system built for one business looks like now."
date: 2026-10-05T15:00:00Z
related:
  - label: "Technology consulting"
    href: "/services/technology-consulting/"
  - label: "AI integration"
    href: "/services/ai-integration/"
sources:
  - label: "Salesforce Sales Cloud pricing"
    href: "https://marketbetter.ai/blog/salesforce-sales-cloud-pricing-breakdown-2026/"
  - label: "HubSpot Marketing Hub pricing"
    href: "https://www.docket.io/resources/research/hubspot-marketing-hub-pricing"
  - label: "NetSuite pricing"
    href: "https://www.erpresearch.com/pricing/oracle-netsuite"
  - label: "NetSuite implementation cost"
    href: "https://www.appseconnect.com/blog/netsuite-implementation-cost"
  - label: "Dynamics 365 Business Central pricing"
    href: "https://msdynamicsworld.com/blog/microsoft-dynamics-365-business-central-pricing-usa-2026-guide-smbs"
  - label: "Cloudflare Workers pricing"
    href: "https://developers.cloudflare.com/workers/platform/pricing/"
---

A good share of my twenty years has gone into wiring stores and websites into ERPs and CRMs. Sage 100, QuickBooks, Salesforce, HubSpot, the EDI pipes between a manufacturer and its distributors. I know how they work from the inside, which is why I will say this plainly: most of the businesses paying for them are using about four percent of what they bought, and paying for the other ninety-six.

Here is what the big ones cost before anyone has done a day of configuration.

| System | What you pay | Who it was built for |
| --- | --- | --- |
| Salesforce Sales Cloud | $25 to $350 per user per month, up to $550 with the AI tier, billed annually on the real editions | Sales organisations with a RevOps team to run it |
| HubSpot Marketing Hub Professional | $890 per month for 2,000 contacts, plus $3,000 onboarding, plus $250 per extra 5,000 contacts | Marketing teams with a full-time HubSpot admin |
| HubSpot Marketing Hub Enterprise | $3,600 per month, plus $7,000 onboarding | Same, bigger |
| NetSuite | About $999 per month base, plus $125 to $199 per user, ten-user minimum, plus $25,000 to $250,000 to implement | Companies with subsidiaries and a finance department |
| Dynamics 365 Business Central | $80 to $110 per user per month, plus $15,000 to $75,000 to implement for a small business | Companies already living in Microsoft |

For a twelve-person company that just wants to know who called, what they ordered and whether they paid, that table is a bad joke. NetSuite for ten users is somewhere between $12,000 and $60,000 a year. HubSpot Professional with 10,000 contacts is over $15,000 a year before the onboarding fee. Salesforce Enterprise for twelve people is $25,000 a year, and nobody runs Salesforce without a consultant.

## The bloat is the product

These systems are not overbuilt by accident. They are sold to the largest buyer in the room, and every feature that buyer asked for stays in the product forever. You inherit all of it. Every screen has forty fields because some enterprise customer needed forty fields in 2014. Your staff learn to ignore thirty-six of them, data goes into the wrong four, and within a year the CRM is a graveyard of half-filled records that nobody trusts.

Then the real cost arrives: the admin. Someone has to own the thing. Workflows, permissions, the integration that broke when the API changed, the report the owner wants that the report builder cannot make. In a big company that is a job title. In a small one it is the operations manager's evenings.

## What most businesses actually need

Strip the marketing away and a working sales and operations system for a small or mid-sized business is a short list:

- A record of every customer, with the people, the history and the notes in one place
- The pipeline: what is in motion, what stage it is at, who owns it, when it was last touched
- Orders and invoices flowing to accounting without anyone retyping them
- A handful of automations: a follow-up when a quote goes quiet, a notification when an order ships, a monthly report that arrives without being asked for
- Search that works

That is a few tables and some plumbing. It has always been a few tables and some plumbing. What changed is what it costs to build it.

## What changed

Building custom used to lose on price. A bespoke CRM meant a developer for months, and then the same developer forever, because nobody else understood it. The platform was the safe choice because at least it existed.

That math has flipped. With AI doing the typing, the few-tables-and-plumbing system takes weeks instead of months. It runs on infrastructure that costs almost nothing: the whole stack I use, Cloudflare Workers and a D1 database, starts at $5 a month. The code is readable because it is small and built for one business instead of every business. And the integrations that used to be the expensive part, QuickBooks, Sage, Stripe, shipping, your email, are the part AI is best at, because they are pattern work with documentation.

I run my own practice this way. The pipeline, the questionnaire, the proposals, the invoices, the email templates: a database with six tables, a dashboard, and a mail layer. It cost me a week. A HubSpot seat would have cost more by Christmas and done less of what I need.

## Where I would still buy the platform

I am not telling a 400-person company to leave Salesforce. If you have a sales team with managers who live in forecasts, a marketing team running campaigns across a dozen channels, or compliance requirements that a vendor's audit stamp satisfies, the platform earns its fee. The same goes for anyone who honestly uses the deep features: territory management, revenue recognition, multi-entity consolidation.

The test is simple. Open your CRM and count the fields your team actually fills in. If it is under a dozen, you are renting a cathedral to park a bike.

## What a sensible version looks like

Start with an audit. The build comes later, if it comes at all. I look at what your team does by hand, which systems hold which truth, and what the platform invoice buys you that you use. Sometimes the answer is "keep the platform, fix the three integrations that are costing you the time". Often it is a small system built around your actual process, with your accounting and your store plugged in, that your staff can learn in an afternoon and that you own outright.

Either way you leave with a number: what you pay now, what you would pay instead, and what the gap is worth per year. For most of the businesses I have looked at, that gap is somebody's salary.
