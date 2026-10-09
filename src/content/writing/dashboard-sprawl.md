---
title: "A dashboard for every mistake"
summary: "Every problem spawns a tracker and nobody takes one away. How the trackers pile up in spreadsheets and shared docs, what the busywork costs, and how to replace thirty of them with one screen."
date: 2026-10-09T18:00:00Z
related:
  - label: "Technology consulting"
    href: "/services/technology-consulting/"
  - label: "AI integration"
    href: "/services/ai-integration/"
sources: []
---

Every process in a company is a scar. Something went wrong once, it hurt, and someone built a tracker so it would never happen again. That is reasonable. The trouble is that nobody ever takes a tracker away, so the company ends up carrying every scar it ever had.

## How it accumulates

Year one: a shipment goes out late. Now there is a weekly shipping report.

Year two: a customer is overbilled. Now every invoice over a threshold gets a second signature and a line in a spreadsheet.

Year three: a lead is lost because nobody followed up. Now sales fills in a daily activity log, and there is a dashboard for it.

Year four: a project overruns. Now there are status meetings, a RAG report, and a tool to feed the RAG report.

Year five: the new operations manager wants visibility. Now there is a dashboard of the dashboards.

Each of these was a sensible answer to a real problem. Together they are a second job for everyone in the building. The shipping report still runs even though the shipping problem was fixed by a new carrier in year two. The invoice sign-off still happens even though billing moved to software that cannot overbill. Nobody cancels a control, because cancelling one means owning the next mistake.

## What it costs

The costs are easy to miss because they are spread thin across everyone. Here is the rough arithmetic I walk clients through.

| Item | Typical figure | Per year for a 30-person company |
| --- | --- | --- |
| Time spent updating trackers, logs and status tools | 3 to 5 hours per person per week | 4,700 to 7,800 hours |
| Loaded cost of that time | $45 to $75 an hour | $210,000 to $585,000 |
| Meetings that exist to review the trackers | 2 to 4 hours per person per week | another $140,000 to $470,000 |
| Software licences for the trackers themselves | $10 to $60 per person per month per tool, three to eight tools | $11,000 to $170,000 |
| Fixing broken spreadsheets, chasing the one person who knows the formula, re-entering lost data | 1 to 2 hours per person per week | $70,000 to $230,000 |
| Attrition driven by busywork and burnout | one to three extra departures a year, at half to a full salary each to replace | $40,000 to $250,000 |

Use your own numbers. Whatever the total comes to, it is a six-figure line nobody budgets for, and it buys almost no insight, because thirty trackers do not add up to a picture. They add up to thirty places to look.

## Where the trackers actually live

Look at where these things are kept and it gets worse. The shipping report is a spreadsheet with eleven tabs, four of which are dead, and a VLOOKUP that only one person understands. The invoice sign-off is a shared document with a table that somebody has to resize every month. The sales log is a form that writes to another spreadsheet, which a third spreadsheet reads with a formula that breaks when a column is added. The project RAG report is a slide that gets rebuilt by hand every Friday from three other places.

None of this was designed. It was improvised under pressure and never revisited, and it is now the real operating system of the company. It is unversioned, unbacked up, owned by whoever happened to make it, locked when two people open it at once, and silently wrong in ways nobody will discover until a number matters. That is technical debt as surely as any bad codebase, except nobody calls it that, so nobody budgets to pay it down. The interest is paid in hours, every week, by people whose job was supposed to be something else.

## Spreadsheets are for accounting

I will give the spreadsheet its due. There was a time when it was a reasonable tool for one hard job: getting data out of an old system and into a new one. If you were a layperson with a few thousand customer records in a dead CRM and a new schema to fit them into, a spreadsheet was the only place you could see the whole thing, fix the obvious junk by hand, move the columns around and hand it to whoever was importing it. I used that method myself, for clients who could not afford anything better, and it worked. On the condition that the data was small, and on the condition that it was reasonably clean.

Those conditions almost never hold now. The databases are a few hundred thousand rows, with records going back well over a decade that nobody ever audited, duplicated three ways, with addresses in the notes field and notes in the address field. A spreadsheet does not help with that. It hides it. You scroll past the problem, the import "succeeds", and the new system is poisoned on day one with the same mess the old one had, now with a fresh coat of paint. A migration like that needs code: scripts that find the duplicates, flag the ambiguous rows, log every decision, and run again from scratch when you change your mind. That is cheap to write today and it is the only honest way to do it.

So here is where I land. Spreadsheets are for accounting. Ledgers, budgets, the model your bookkeeper builds, the thing finance people were trained on and are good at. That is what the tool is for and it is excellent at it. Using one as a tracker, a CRM, a project board, an inventory system, a reporting layer or a database is madness, and it is madness that most companies are committing in a dozen places at once without noticing, because the file is right there and it is free.

## Why none of it gives you the bigger picture

A tracker answers one question, the question that was asked when it was built. It does not know about the other trackers. The shipping report cannot tell you that late shipments are correlated with the orders that went through the extra invoice sign-off, because those live in different spreadsheets owned by different people and refreshed on different days.

So the owner ends up with a wall of green and amber tiles and no idea how the business is actually doing. The people feeding the tiles know the real story, but they are too busy feeding the tiles to tell it. I have watched good operations managers leave over exactly this. The work was fine. The reporting about the work drove them out.

## The fix is subtraction

Start by listing every recurring report, log, tracker and status meeting. All of them. Then, for each one, three questions. What mistake was this built to prevent? Is that mistake still possible? Who reads this, and what did they decide last time they read it?

In my experience somewhere between a third and half of the list fails those questions. Cancel them. Nothing bad happens, which is itself informative.

For what remains, stop asking people to type things that the systems already know. An order's status lives in the order system. A project's hours live in the time log. A lead's last touch lives in the mail server. The reason people hand-update trackers is that nobody connected the systems, so the spreadsheet became the connection, and connecting them properly used to be expensive. It is not anymore. With AI handling the plumbing, pulling the real numbers out of the systems you already run and putting them on one screen is a few weeks of work, and then nobody updates anything by hand.

That one screen is the bigger picture. It shows the handful of numbers that actually run the business, pulled live, with the detail one click down for the day something looks wrong. Everything else gets deleted or runs by itself.

## Where I come in

This is the data and dashboard side of what I do. I look at where the numbers really live, build the connections, and put the result on a page that the owner and the managers can read in two minutes on a Monday. Half the value is the page. The other half is the list of trackers you no longer need, and the hours that come back when they go.
