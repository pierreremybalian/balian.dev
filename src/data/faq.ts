export interface Faq { q: string; a: string }

export const generalFaq: Faq[] = [
  { q: "Is the work AI-generated?",
    a: "AI is part of how I build, the way a compiler or a framework is. Every line that ships is read and judged by a person with two decades of experience, and tested." },
  { q: "What if you are unavailable?",
    a: "You own the code, the repositories and the accounts. Everything is documented and tested, so another engineer can pick it up without me." },
  { q: "Do you only work with WordPress?",
    a: "No. WordPress is right for many sites. Others need Astro, Next.js, Cloudflare or a custom application. I will tell you which fits, even when it is the simpler option." },
  { q: "Do you work with agencies?",
    a: "Yes. I take overflow work, plugins and hardening under your brand or mine, with clear communication and handoff." },
];
