---
title: "What actually happens when someone submits your form"
summary: "Most forms send an email and forget everything else. Where the submission should go, what to capture on the way (UTM, GTM, referrer, consent), and why a healthcare form is a HIPAA pipeline the moment a name sits next to a symptom."
date: 2026-10-09T20:00:00Z
related:
  - label: "Marketing systems"
    href: "/services/#marketing-systems"
  - label: "AI integration and data"
    href: "/services/ai-integration/"
  - label: "Compliance and remediation"
    href: "/services/compliance-and-remediation/"
sources: []
---

Ask most business owners what happens when someone fills in the contact form and the answer is "it emails Sarah". Ask what happens after Sarah is on holiday, or where the lead came from, or how many of last quarter's enquiries turned into customers, and the answer is a shrug. The form is the single most valuable thing on the site and it is wired like a doorbell.

Here is what should happen, in order, and what you should be capturing on the way through.

## The journey of one submission

Someone clicks send. In a well-built site the next second looks like this:

1. The browser checks the obvious things first: required fields, an email that looks like an email, a phone number with digits in it. Errors appear next to the field, in words.
2. The request goes to your server, which checks everything again, because the browser can be lied to. The honeypot field that only bots fill in is empty. The submission is not the fortieth from the same address this minute.
3. The submission is written to a database. Yours. Before any email is sent, before any third party sees it, a record exists with a timestamp and everything the visitor typed and everything the site knew about them.
4. The lead is created or updated in your CRM, matched on email so the same person twice is one record with two events.
5. Notifications go out: to the person who handles enquiries, and a confirmation to the visitor that says what happens next and when.
6. The visitor sees a thank-you page or message. That page is where your analytics records the conversion.

Six steps, maybe a hundred lines of code. The reason most sites stop at step five with the email to Sarah is that nobody told the developer what the form was for.

## What to capture

The visitor types perhaps five fields. The site knows a lot more, and all of it is useful later. This is the list I use.

| What | Why you want it | How it gets there |
| --- | --- | --- |
| Name, email, company, phone, message | The enquiry itself | Typed by the visitor |
| Website address | Lets you look at their business before you reply. My form runs a scan of it the moment the lead arrives | One optional field |
| Submitted at, with timezone | Response-time reporting, and knowing which enquiries arrived at 2am | Set by the server |
| Landing page | The first page they saw on this visit, which tells you what brought them | Stored when they arrive, sent as a hidden field |
| Referrer | The site that sent them, if any | Same |
| UTM source, medium, campaign, term, content | Which ad, email or post the lead came from, so you can stop paying for the ones that produce nothing | Read from the URL on first visit, kept for the session, sent as hidden fields |
| Click IDs (gclid, fbclid, msclkid) | Lets you report the conversion back to the ad platform so it optimises toward people who enquire instead of people who click | Same |
| Pages viewed this visit | What they were interested in before they wrote | A short list kept in the browser and sent along |
| Device and browser | Debugging, and knowing whether the mobile form is where things fail | Server reads it from the request |
| Consent state | Which cookie categories they allowed, so you know what you are permitted to do with the record | Read from your consent tool at submit time |
| Form and page the submission came from | A site has more than one form, and the quote form and the newsletter form mean different things | A hidden field per form |

First-touch versus last-touch matters here. Someone finds you through a search ad on Monday, comes back from a LinkedIn post on Thursday and submits. If you only record Thursday, the ad looks useless and the post looks like a genius. Store the first set of parameters when they arrive and never overwrite it, store the latest separately, and send both.

## Where GTM comes in

Google Tag Manager is the right place to tell analytics and ad platforms that a conversion happened. It is the wrong place to do the capture. GTM runs in the browser, it is blocked by a quarter of visitors, and it depends on consent. Your own server sees every submission.

So the split is: the server captures everything and writes the record. The thank-you page pushes one event to the data layer, with the form name and a submission id, and GTM fans that out to GA4, Google Ads and whatever else. If you also send the gclid back through the Ads API from the server, you get conversion data that does not depend on anyone's cookie settings.

The thing to avoid is the GTM form-submit trigger that fires when any button is clicked, which counts every failed submit as a lead and makes the ad platform optimise toward people who abandon forms.

## Where the CRM comes in

A lead that lives only in an inbox is a lead that gets lost. The CRM, whether that is HubSpot, Salesforce, a well-kept spreadsheet or something built for you, is where the record goes with every field from the table above attached. Match on email. Create the contact if it is new, add an activity if it is not. Set the stage to "new enquiry" and let the follow-ups be driven by that, so the nudge after three days of silence goes out whether or not Sarah is back.

If you do not have a CRM, you do not need to buy one to do this. A table and a small admin page is enough for most businesses, and I have written about why the big systems are the wrong purchase for the size of company that usually asks me this.

## What not to capture

The rule is to capture what you will use and nothing you cannot protect. Do not record IP addresses or full browsing histories without a reason you could explain to a regulator. Do not send the record to a marketing platform the visitor has not consented to. Do not collect payment details through a general form. And write down, somewhere a lawyer can find it, what you collect and why.

The consent state in the table is the key to the marketing side of this. If they declined marketing cookies, the UTM capture still works, because your server did it, but the data layer push to the ad platform should not happen. The record says which.

## If you are a healthcare business, read this twice

I have been a HIPAA compliance officer, and the forms on healthcare websites are where I have seen the most expensive mistakes made by people who thought they were being careful.

Here is the thing nobody tells the marketing team. A form on a covered entity's website that collects a name and anything that suggests a health condition, an appointment, a service line or a provider is collecting protected health information. "Request an appointment with Dr. Alvarez for a knee consultation" is PHI the moment it has a name attached. So is "contact us" when the message says what is wrong. The form does not have to ask for a diagnosis. It only has to let someone type one, next to who they are.

Once that is true, every step in the journey above becomes a place PHI can leak, and most of them do by default:

- The form plugin or SaaS that receives the submission needs a business associate agreement. Most free form tools will not sign one, which means they cannot legally hold the data, which means you cannot use them.
- The notification email is the worst offender. "New appointment request from Jane Smith: knee pain, Tuesday" sent to the front desk's Gmail is a disclosure, every time, to a mail provider that has no agreement with you. The email should say that a submission arrived and link to a secure place to read it, nothing more.
- The CRM is a business associate too. HubSpot and Salesforce will sign for the right tier and the right price. The spreadsheet in a shared drive will not, and the shared drive may not be covered either.
- Analytics and tags on the form page are the one regulators have been loudest about. Google Analytics, the Meta Pixel, a session-replay tool or a chat widget running on an appointment page can see the URL, the form fields and the button clicks. The HHS guidance on tracking technologies made this explicit, a court trimmed part of it back in 2024, and the lawsuits over pixels on hospital sites kept coming anyway. The safe reading is simple: no third-party tracking on any page where PHI is entered or displayed, and consent does not change that, because a visitor cannot consent on your behalf to a disclosure you are not allowed to make.
- The hosting, the database and the backups all need to be covered, encrypted and access-logged, with a retention rule that says when the record is deleted.

So the healthcare version of the journey is the same six steps with different plumbing. Validation and spam checks stay. The record is written to a database you control under a BAA. The CRM is one that signed. The notification carries no content. The thank-you page records a conversion with no PHI in the event, which means no form field values in the data layer and no pixel on the page at all, or the whole thing goes through server-side tagging with the PHI stripped before it leaves. And the UTM capture, which is perfectly fine, is done by your server, never by a tag.

There is also a distinction worth drawing on the site itself. A general "contact us" form on the marketing pages can be kept out of scope if it genuinely does not invite health information and the message field says so. The appointment request, the patient portal link, the symptom checker and the prescription refill form cannot, and they should live on pages with nothing on them but your own code. I have built sites both ways and the separation is cheap if you decide it at the start. It is expensive after the letter arrives.

If you run a clinic, a practice, a lab or anything that bills insurance, this is the audit to do first. It takes a day to find out what your forms are leaking, and the fix is usually a week.

## What my own form does

The contact form on this site writes the submission to a database, creates or updates the lead, runs a scan of the website they gave me (platform, hosting, DNS, mail setup, integrations) and attaches it to the record, sends me a branded email with all of it, and sends the visitor a confirmation that says what happens next. Booking a call does the same and adds the calendar event. The client questionnaire does the same again with forty more fields. All of it lands in one admin screen, with a pipeline, so I can see every enquiry and where it stands.

It is a small system that took days to build instead of a procurement cycle, and it means that when I reply to you, I already know what you run and roughly what is wrong with it, which is the whole point of asking.

If your form emails Sarah and nothing else, that is a few days of work to fix, and the ad spend it saves usually covers it.
