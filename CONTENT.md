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
- No past-employer names, clients, results or internal tools. Years of experience may be stated generally.

## Agency experience

More than fifteen years of professional work in agency environments, across many industries and clients, is the lead credential on About. Say it generally; no client or employer names, no industries or results that cannot be shown.

## The ten employed years

For about ten years I worked as an employee at an agency. Most of what I built there belongs to the clients and the company, so it does not appear here, and I do not claim it as mine. The site says this plainly (About, Work, Home) instead of hiding it. What can be shown: my own products, my process, how I work, and the stacks I know.

## Banned words and patterns

The linter fails on: rather than, whatever the problem, I choose, accountable (in ledes), end-to-end, leverage, robust, seamless, cutting-edge, solutions, tailored, world-class, passionate, synergy, holistic, elevate, unlock, empower, streamline, delve, "in today's". It also fails on a number-plus-nouns opener ("Six areas", "Three ways"), em dashes, and a lede that mostly repeats its H1.

## Checklist before shipping a lede

- Could this sentence sit on any other agency's page? If yes, rewrite it.
- Does it say who it is for or what they get in the first sentence?
- Is there one idea?
- Would I say it out loud to someone across a table?
