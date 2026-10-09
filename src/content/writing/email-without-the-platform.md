---
title: "Email marketing's false tiers, and how to stop paying them"
summary: "Klaviyo, Mailchimp, HubSpot and Pardot charge by the size of your list, and the price has nothing to do with what email costs. What each tier buys, what still needs a platform, and what I build instead."
date: 2026-10-09T15:00:00Z
related:
  - label: "Marketing systems"
    href: "/services/#marketing-systems"
  - label: "AI integration"
    href: "/services/ai-integration/"
sources:
  - label: "Klaviyo pricing"
    href: "https://www.omnisend.com/blog/klaviyo-pricing/"
  - label: "Mailchimp pricing"
    href: "https://www.emailtooltester.com/en/reviews/mailchimp/pricing/"
  - label: "HubSpot Marketing Hub pricing"
    href: "https://www.docket.io/resources/research/hubspot-marketing-hub-pricing"
  - label: "Salesforce Account Engagement pricing"
    href: "https://tech.co/crm-software/salesforce-pardot-marketing-automation"
  - label: "Resend pricing"
    href: "https://nuntly.com/resend-pricing"
---

Email marketing platforms do not charge you for sending email. Sending email is nearly free and has been for twenty years. They charge you for the size of your list, and they charge you again every time the list grows, whether or not you send anything.

Here is what the list tax looks like.

| Platform | 1,000 contacts | 10,000 contacts | 50,000 contacts | What you are paying for |
| --- | --- | --- | --- | --- |
| Klaviyo (email only) | $30/mo | $150/mo | $720/mo | A visual flow builder, store integration, and the right to keep your own list |
| Mailchimp Standard | about $45/mo | $135/mo | $450/mo | Templates, a drag-and-drop editor, and a send cap of twelve emails per contact per month |
| HubSpot Marketing Hub Professional | $890/mo | about $1,300/mo | about $2,500/mo | Everything, plus $3,000 to be shown how to use it |
| Salesforce Account Engagement (Pardot) | from $1,250/mo | $1,250 to $2,500/mo | $2,500 to $4,000/mo | A B2B automation suite sized for enterprise marketing departments |

Compare that with what the email itself costs. Resend, the transactional service I use, sends 3,000 emails a month for nothing and 50,000 a month for $20. Amazon SES is cheaper still. A 50,000-contact list that hears from you weekly is about 200,000 emails a month. On Resend's scale tier that is under $200. Klaviyo wants $720 for the privilege of holding the same list, and the sends are extra once you pass their cap.

## The tiers are the trick

Look at the tier boundaries. Every platform prices on contacts, and every platform counts contacts generously: unsubscribed, bounced and "cleaned" addresses sit on your bill at Mailchimp unless you archive them by hand. The jump from one tier to the next is where the margin lives. Grow from 9,900 contacts to 10,100 and you are suddenly in the next band, paying for a feature set you did not ask for, because the one feature you wanted, a second automation or a better segment, was gated behind it.

That is the false tier. The capability you need is small. The price you pay for it is set by the size of your audience, which has nothing to do with the cost of providing it.

## What the platforms were actually solving

In fairness, there were real problems:

1. Deliverability. Getting into the inbox meant warmed-up IPs, authentication, bounce handling and a reputation you could not buy. The platforms had it; you did not.
2. Templates. Email HTML is 2003 technology. Making a message render in Outlook took a specialist.
3. Lists and segments. Someone had to store the list, honour unsubscribes, and slice it by behaviour.
4. Automation. "If they bought, wait three days, then send this" needed a workflow engine.

Here is the honest state of each in 2026.

Deliverability is now a set of DNS records and a sending service. SPF, DKIM and DMARC take an afternoon to set up correctly, and services like Resend and SES carry the IP reputation. I set this up for client domains that had been landing in spam for years; the fix was never the platform, it was the records.

Templates deserve a longer answer, because building email was the single most miserable job in this industry and I want that on the record. HTML email is a table layout from 2003 rendered by thirty clients that each disagree about what CSS is. Outlook used the Word rendering engine. Gmail stripped your styles. Apple Mail did one thing, the Gmail app on Android did another, and the Outlook app on iOS did a third. Frameworks like MJML and Foundation for Emails helped, and I used both for years, and they still left you chasing a two-pixel gap that only appeared in one client on one platform. I once spent fifty hours on a single email, for a company that wanted pixel accuracy in every client and tested in all of them, and that was not the worst week I had with it. Agencies kept a person whose whole value was knowing which hacks still worked this quarter.

That job is gone. I describe the email, AI writes the table-based HTML with every style inlined and every known quirk accounted for, and it renders in Gmail, Apple Mail and Outlook on the first or second try. The fifty hours became an afternoon. I keep one branded layout and feed it plain text. The templates on my own site are written the way you would write an email to a person, and the code turns them into something that looks designed.

Lists and segments are a database table. Unsubscribe handling is one endpoint. Behaviour segments ("ordered twice, nothing in ninety days") are a query, and AI writes the query.

Automation is a scheduled job that runs the query and sends the template. It is less code than the platform's workflow builder takes to explain.

Take the one everybody buys Klaviyo for: abandoned carts. Shopify and WooCommerce both know when a cart was created, what is in it and whether it checked out; they fire a webhook or expose it through the API. The flow is: a cart with an email and no order after an hour goes on a list, a job sends the first nudge, a second one goes out a day later if there is still no order, and the sequence stops the moment an order appears. That is one table, one scheduled job and two templates. The product images and the cart link come straight from the store. I build this for clients in a few days, and it does the same thing the $720-a-month version does, with the one difference that it stops costing money when the list grows.

## Where the platforms still win

I will not pretend the whole category is useless. Klaviyo's store integration is deep, and if you want product recommendations, predictive segments and a dozen pre-built flows switched on by Friday, that is what you are paying for. If you have a marketing person who lives in the visual builder and ships three campaigns a week, the platform is their instrument and the fee is their tooling cost. HubSpot earns its price when sales and marketing genuinely share one database and a team runs it. Agencies managing twenty client lists need the multi-account tooling.

And there is a trap on the build side: a hand-built system with nobody maintaining it rots. If you build it, someone has to own it, and that means a care plan with a name on it.

## What I build instead

For a business that sends a newsletter, a few automated sequences and transactional email, and wants to stop paying by the head:

- A sending domain with SPF, DKIM and DMARC done properly, on Resend or SES
- A contacts table you own, with consent and unsubscribe handled the way the law requires
- A branded layout and a set of templates written as text, rendered to HTML automatically
- The automations you actually use, abandoned cart included, as scheduled jobs you can read
- Reporting from the sending service's events: delivered, opened, clicked, bounced

Cost: tens of dollars a month in services, plus the build. For a list of 20,000 that is a few months of Klaviyo fees, and then it is yours.

Ask your platform one question: what am I paying per month for the part I use? If the answer makes you wince, you already know.
