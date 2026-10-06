// Skills shown in the home page network. Every entry comes from work in the project folders and the resume.
export const categories = [
  "Languages",
  "Frameworks",
  "WordPress and commerce",
  "Cloud and edge",
  "Data",
  "Quality",
  "AI",
] as const;

export const skills: [name: string, category: number][] = [
  ["TypeScript", 0], ["JavaScript", 0], ["PHP", 0], ["Python", 0], ["SQL", 0], ["Bash", 0], ["HTML / CSS", 0],
  ["Next.js", 1], ["React", 1], ["Astro", 1], ["Node", 1], ["Express", 1], ["Bootstrap", 1], ["GSAP", 1], ["Three.js", 1],
  ["WordPress", 2], ["WooCommerce", 2], ["Gutenberg", 2], ["ACF", 2], ["Stripe", 2], ["PayPal", 2],
  ["Workers", 3], ["D1", 3], ["KV", 3], ["R2", 3], ["Queues", 3], ["Pages", 3], ["WAF", 3], ["Nginx", 3], ["Linux", 3],
  ["MySQL", 4], ["SQLite", 4], ["Drizzle", 4], ["Zod", 4],
  ["Playwright", 5], ["WCAG AA", 5], ["Core Web Vitals", 5], ["GitHub Actions", 5], ["Lighthouse", 5],
  ["Claude API", 6], ["Claude Code", 6], ["Agents", 6], ["Evals", 6],
];

// Plain list for the stacks strip.
export const stacks = [
  "TypeScript", "Next.js", "Node", "PHP and WordPress", "Python", "SQL", "Astro",
  "Cloudflare Workers, D1, KV, R2", "Playwright", "Stripe", "Claude API",
];
