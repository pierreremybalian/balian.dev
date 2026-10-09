---
title: "I moved everything to Astro and Cloudflare, and I am not going back"
summary: "Why this site, its booking system and its admin run on Astro and Cloudflare: what Cloudflare is, why serving from the edge matters, what it costs, and where it is the wrong call."
date: 2026-10-07T15:00:00Z
related:
  - label: "Websites and CMS"
    href: "/services/websites-and-cms/"
  - label: "Web apps and SaaS"
    href: "/services/web-app-saas-development/"
  - label: "ZoneSteward"
    href: "/work/zonesteward/"
sources:
  - label: "Cloudflare network"
    href: "https://www.cloudflare.com/network/"
  - label: "Cloudflare Workers pricing"
    href: "https://developers.cloudflare.com/workers/platform/pricing/"
  - label: "Cloudflare Pages pricing"
    href: "https://nayankyada.com/blog/cloudflare-pages-pricing-2026-free-tier-limits-workers-costs-when-to-upgrade"
  - label: "Resend pricing"
    href: "https://nuntly.com/resend-pricing"
---

Twenty years of building for the web teaches you to distrust enthusiasm. Every few years a framework arrives, everyone rewrites everything, and three years later the maintainers have moved on and you are holding a codebase nobody wants. So take this with that in mind: the stack I have settled on for the last two years is the first one in a long while that made my work simpler instead of more interesting.

The site you are reading is Astro on Cloudflare Pages. So is the admin behind it, the booking system, the questionnaire, the proposals and the email. Here is why, and what it costs.

## Astro: HTML first, JavaScript when you mean it

Most of the web is pages. Text, images, a form, a menu. For a decade the industry built those pages with tools designed for applications, shipped a few hundred kilobytes of JavaScript to render a paragraph, and then invented more tools to make the paragraph appear faster.

Astro's idea is embarrassingly simple: render to HTML at build time, ship zero JavaScript by default, and add a script only where a component needs one. A marketing page becomes what it should have been all along, a document. My home page has one interactive element, a 3D skills network, and that is the only script on it. Everything else is HTML and CSS, which is why it scores where it scores on Core Web Vitals without tuning.

What I like about it in practice is that content is data. Every lede, every service blurb and every FAQ on my site lives in TypeScript files, which means I can lint them. A script checks every headline against my own copy rules before the site builds. Try that in a page builder.

It is also boring in the right places. Components look like HTML. The build is a build. A junior developer can read it, and so can I at two in the morning. Forms post to real endpoints, links are links, and when I need server code it is a function sitting beside the page.

Where it is wrong: a real application with a lot of client state, the kind where the screen changes constantly without a page load. I use other tools for that. Astro is for the ninety percent of sites that are pages.

## What Cloudflare is

Most people know Cloudflare, if they know it at all, as the company behind the "checking your browser" page. That is one small part of it. Cloudflare runs a network of data centres in more than 300 cities, and roughly a fifth of all websites route their traffic through it. It started as a shield: your DNS points at Cloudflare, Cloudflare sits between your visitors and your server, and it absorbs the attacks, caches the pages and hides your origin. Over the last several years it added something bigger. You can now run code and store data on that same network, in every one of those cities at once, with no server of your own anywhere.

## Why the edge matters

A traditional site lives in one place. Your server is in Virginia or Frankfurt, and every visitor, wherever they are, makes the round trip to it. For someone in Minneapolis talking to a server in Virginia that is maybe 30 milliseconds each way. For someone in Sydney it is 200. Every page, every image, every form submit pays that toll, and a page that makes a dozen requests pays it a dozen times. Then the server itself has to be big enough for your busiest hour, which means it is oversized for every other hour, and if it fills up or falls over there is no second copy.

Serving from the edge flips this. Your site is copied to every data centre in the network, so the visitor in Sydney is served from Sydney and the one in Minneapolis from Minneapolis, both in a few milliseconds. The code behind the site, the form handler or the booking endpoint, runs in the same place, next to the visitor, instead of across an ocean. There is no origin to overload, because there is no origin; a spike in traffic is spread over hundreds of locations that were built to absorb far worse. The attack that would have taken down a single server is the thing the network was designed for in the first place.

For a business site this means three concrete things. The site is fast everywhere without anyone tuning it. It stays up on the day it matters, the product launch or the press mention, without anyone scaling anything. And the security that used to be a separate product and a separate bill, the firewall, the bot filtering, the DDoS protection, is already there, because it is the network.

## Cloudflare: the infrastructure is the free tier

The other half of the stack is where it runs. For years the honest answer to "where should a small business host its site" was a shrug: a shared PHP host that goes down on Black Friday, or a cloud account that needs a person to run it. Cloudflare's developer platform is the first thing I have used where the sensible default is also the cheap one, and the free tier is not a trial. It is the product, sized for most small businesses.

| Need | What I use | Cost |
| --- | --- | --- |
| Hosting a static site | Cloudflare Pages | Free, unlimited bandwidth |
| Server code (forms, booking, admin APIs) | Pages Functions / Workers | Free to 100,000 requests a day; $5 a month for 10 million |
| A database | D1 (SQLite at the edge) | Free to 5 GB and 5 million row reads a day |
| Key-value config, queues, file storage | KV, Queues, R2 | Free tiers that cover a small business; R2 has no egress fees |
| DNS, CDN, DDoS protection, firewall, bot rules | The zone itself | Free |
| Email forwarding for a domain | Email Routing | Free |
| Transactional email | Resend | Free to 3,000 a month, $20 for 50,000 |

My entire practice, the public site, the booking system, the client questionnaire with its site scanner, the admin with leads and proposals and invoices, costs me the $5 Workers plan and a Resend account I have not paid for yet. A comparable setup on a traditional host, with a managed database and an email service, would be a few hundred a month before anyone did any work.

The price is the smaller half of it. The bigger half is the absence of a server. Nothing to patch, nothing that fills up, no 3am page because a disk died. I spent years as the person who owned the servers for a hundred client sites, and I know exactly what that costs in attention. Cloudflare took that line off my list.

## Where Cloudflare is not the answer

Two places, and I say so to clients. First, heavy applications: long-running jobs, big relational databases with complex joins, anything that wants a real Postgres and a lot of RAM. D1 is SQLite; wonderful for the shape of data most businesses have, wrong for a data warehouse. Second, anyone who needs to leave quickly. Workers are standard JavaScript and the data is yours, but the bindings are Cloudflare's, and moving a Worker to another host means rewriting the plumbing. I accept that trade because the plumbing is small. You should know you are making it.

Also, WordPress. If your team needs a familiar editor, plugins and an ecosystem that has been growing since 2003, WordPress is still the right call and I build it well. Astro and Cloudflare are what I reach for when the site is content and speed matters more than a heavy admin, or when the thing is an application that should have been small.

## The actual argument

Every tool in this stack does one thing and gets out of the way. Astro makes pages. Cloudflare serves them, runs the small amount of code behind them, and absorbs the traffic and the attacks. The result is a site that is fast because there is nothing in the way, cheap because there is nothing to rent, and maintainable because there is not much of it.

For a one-person practice that is the whole game. For a client it means the hosting bill stops being a line item and the site stops being a thing that breaks.
