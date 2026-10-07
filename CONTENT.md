# Copy rules

How the words on this site get written. The most important text on any page, after the H1, is the **lede**: the one or two sentences directly under it. It decides whether a visitor reads on. It has to be written by rule, not by feel.

Every H1 and lede lives in `src/data/ledes.ts`. Run `npm run lint:copy` after changing any of them. The build runs it too.

## What a lede is for

A lede answers two questions, in this order, in the visitor's own terms:

1. **Is this page for me?** Name their situation or the thing they want.
2. **What will you do about it?** One concrete sentence about what I do or what they get.

That is all. It does not introduce the site, explain the process, count the page's own sections, or defend a position.

## Rules

1. **Start from the visitor, or from a plain statement of what this is.** "Your store sells, but checkout feels slow." Not "Checkout, payments, tax and integrations, handled by someone who treats the store as a system."
2. **One idea.** If the lede needs a second idea, it belongs further down the page.
3. **12 to 34 words, 1 to 3 sentences.** Short sentences. Read it aloud once.
4. **Say "I" or "you".** The lede must contain a first or second person pronoun. A page about a person's work should sound like a person.
5. **Concrete nouns, plain verbs.** "Fix", "build", "ask", "approve". Not "leverage", "deliver", "enable", "empower".
6. **Do not restate the H1.** The lede adds something the headline did not.
7. **No meta.** Never count or describe the page itself ("Six areas, one accountable engineer", "This page explains"). Exception: a process page may count its own steps, because those are the content.
8. **No stacked claims.** One benefit per sentence. No list of three abstract nouns. At most two commas.
9. **No contrast templates.** Avoid "X, not Y", "rather than", "less X, more Y".
10. **No em dashes, no colons that set up a reveal.**
11. **No invented numbers.** Years of experience is fine. Percentages, savings and speedups are not, unless measured and public.

## Page types and starting formulas

| Page type | Formula | Example |
|---|---|---|
| Service | Their situation, then what I do about it | "Your store sells, but checkout feels slow, tax is a guess, or orders never reach your ERP. I fix those problems and build the pieces that are missing." |
| Service, objection | The question they are about to ask, answered | "Yes, I use AI to build your site. It does the typing, I read every line, and you pay for the result." |
| Hub | What to do on this page, then one useful fact | "Find the kind of work you need help with below. Most projects mix two or three of these, and I do all of them myself." |
| Case study | What it is for a stranger, then why it matters | "Teams that run many Cloudflare sites use it to ask questions in plain English and fix problems safely." |
| About / process | The doubt the visitor has, answered plainly | "I am one engineer doing work that usually takes a team. Here is how that works, where it does not, and what happens if I am ever unavailable." |

## Voice

- First person singular. One person, said plainly.
- Calm, a little dry. Contractions are fine. No exclamation marks.
- Honest about limits. Say what this model is not good for.
- Specific over impressive. A named tool beats an adjective.
- AI is the hands, Pierre is the engineer. Languages share the same fundamentals and he reads any codebase; AI fills in dialect (API signatures, framework idiom, boilerplate). Never write a sentence where AI knows something Pierre does not, or where he "does not need to know" something.
- No past-employer names, clients, results or internal tools. Years of experience may be stated generally.

## Proof policy

The lead credential is "more than twenty years building for the web, most of it inside agencies". That is the only year count on the site. Past work is described by kind, so a visitor learns what I have done without anyone else's name or numbers attached.

Say:
- More than twenty years; most of it inside agencies; "led the technical side of a Minneapolis agency"; "as director of web technology and security". The agency is never named.
- Kinds of work: re-platformed a manufacturer's store to WooCommerce with a Sage 100 integration; migrated a specialty retailer off BigCommerce with QuickBooks and point-of-sale sync; led incident response and cleanup for compromised sites; ran cyber-insurance audit remediation; administered Cloudflare WAF and DNS for a large portfolio; dozens of WCAG AA remediations; HIPAA-scoped sites; built the team's starter framework and a maintenance hub that watches plugins for vulnerabilities; an alt-text plugin on the Claude API.
- Industries as categories: manufacturers, specialty retail, grocery and regional retail brands, healthcare with HIPAA obligations, B2C brands.
- Named systems: Stripe, PayPal, Authorize.net, Avalara, TaxJar, TrueCommerce EDI, Sage 100, QuickBooks, Cloudflare.

Never:
- Employer or client names. Revenue, growth or savings figures. Counts of sites, zones, launches or team members. Engagement dollar ranges.
- Any other year count ("fifteen years", "ten years as an employee", "two decades"). The linter fails on these.
- On product case studies: exact counts that describe the implementation (pattern totals, rule counts, identifier lists, page caps, poll intervals, size figures), rate limits, cron schedules, hosting topology, process managers, encryption schemes, auth mechanics and queue internals. Say what it does and roughly how; never give a map of the infrastructure.
- Apologies for having no client case studies. Work says once, in one sentence, that agency work belongs to the clients. Nowhere else.

## Banned words and patterns

The linter fails on: rather than, whatever the problem, I choose, accountable (in ledes), end-to-end, leverage, robust, seamless, cutting-edge, solutions, tailored, world-class, passionate, synergy, holistic, elevate, unlock, empower, streamline, delve, "in today's", game-changing, best-in-class. It also fails on a number-plus-nouns opener ("Six areas", "Three ways"), em dashes, and a lede that mostly repeats its H1.

Since 2026-10-07 the linter also scans every line of copy in `src/data`, `src/pages` and `src/components` for the banned phrases, dashes, "not an afterthought", "not just", the "X, not Y" contrast template, year counts other than twenty, and employer names.

## Checklist before shipping a lede

- Could this sentence sit on any other agency's page? If yes, rewrite it.
- Does it say who it is for or what they get in the first sentence?
- Is there one idea?
- Would I say it out loud to someone across a table?
