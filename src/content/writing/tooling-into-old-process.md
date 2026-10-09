---
title: "The entropy of bad systems"
summary: "Companies spend fortunes bending new software to fit old processes. Why that happens, what it costs, and the order to do it in: map the process, redesign it, then pick the tool."
date: 2026-10-09T17:00:00Z
related:
  - label: "Technology consulting"
    href: "/services/technology-consulting/"
  - label: "AI integration"
    href: "/services/ai-integration/"
sources: []
---

Here is a pattern I have watched for twenty years, from inside agencies and from the other side of the table. A company has a process. The process grew up around whatever software and whatever people it had at the time. Then the company buys new software and spends a fortune making the new software behave like the old process.

They do not change the process. They bend the tool until it fits the shape of the old one, and they pay for every bend.

## What it looks like

A distributor runs orders through a spreadsheet that was built by someone who left in 2019. They buy an ERP. The implementer asks how orders work, and the answer is the spreadsheet, so the ERP is configured to reproduce the spreadsheet: the same columns, the same approval step that exists because of a mistake in 2014, the same export to a second spreadsheet that one person in accounting likes. Eighteen months and a six-figure invoice later, the company has the old process running on more expensive software, with a consultant on retainer to keep the bends from springing back.

A marketing team adopts a CRM and immediately builds a custom object to mirror the paper form the sales team used to fill in. The form had twelve fields because the form was a piece of paper and twelve fit. The CRM now has twelve required fields, and the sales team hates the CRM.

A warehouse buys a scanning system and configures it to print the same paper pick list it replaced, because the pickers want paper. So now the warehouse has scanners and paper.

I have been in the room for versions of all three. Nobody in the room was stupid. Everyone was protecting something that worked once.

## Why it happens

The process is invisible to the people who run it. It feels like "how things are done" when it is really a set of decisions someone made under conditions that no longer apply. When a new tool shows up, the natural question is "how do we make this do what we do", and the vendor is happy to answer, because customisation is billable.

The second reason is fear. Changing the process means changing what people do all day, and that is a harder conversation than a purchase order. Buying software looks like progress. Rewriting how the business works looks like risk.

So the company pays twice: once for the tool, and then forever for the gap between what the tool wants to do and what the company insists on doing.

## Entropy

Systems decay toward their worst configuration unless someone spends energy keeping them clean. Every workaround is a bit of disorder that never gets removed. Every exception becomes a rule. Every "just for now" becomes permanent the moment the person who added it moves on. A decade of this and the process is a fossil record of every emergency the company ever had, and the new ERP is a very expensive display case for it.

The cost does not show up as a line item. It shows up as the three hours a week your bookkeeper spends reconciling two systems that should be one. The order that goes out wrong because a field was filled in the way the old form wanted. The hire you make to run a process that should not exist. Add those up for a year and it is usually more than the software cost.

## What to do instead

Before the tool, map the process as it is. Honestly. Every step, who does it, why it exists. Most companies have never done this and are surprised by what they find: steps nobody can explain, approvals that approve nothing, reports nobody reads.

Then design the process you would build today if you were starting the company with the tools that exist now. Usually it is shorter. Usually some roles change. That is the conversation to have, and it is a conversation about the business. Software comes up last.

Only then pick the tool, and pick the one that fits the new process with the least bending. Often it is smaller and cheaper than the one on the shortlist. Sometimes, with AI making custom software cheap, it is a small system built for exactly that process, which is a sentence that would have been foolish five years ago.

I do this work as [technology consulting](https://balian.dev/services/technology-consulting/). It starts with a few days of looking at how things actually move through your company, and it ends with a plan that says which steps go, which tool fits, and what it is worth to you per year. Sometimes the answer is to keep what you have and stop bending it.
