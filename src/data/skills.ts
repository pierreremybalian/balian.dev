// Skills shown in the home page network, grouped by discipline.
// Every entry comes from the resume, the project folders, or was added by Pierre.
const groups = {
  "Languages": ["TypeScript", "JavaScript", "PHP", "Python", "SQL", "Bash", "HTML / CSS", "SCSS", "Swift"],
  "Frameworks": ["Next.js", "React", "Astro", "Node", "Express", "Bootstrap", "Tailwind", "Foundation", "Underscores", "jQuery", "Vite", "GSAP", "Three.js"],
  "WordPress and commerce": ["WordPress", "WooCommerce", "Gutenberg", "ACF", "WP-CLI", "Multisite", "Shopify", "BigCommerce"],
  "Payments and tax": ["Stripe", "PayPal", "Authorize.net", "Avalara", "TaxJar"],
  "Email and marketing": ["Mailgun", "Mandrill", "SendGrid", "Resend", "Mailchimp", "Klaviyo", "MJML", "GA4", "GTM", "SPF / DKIM / DMARC"],
  "CRM and ERP": ["Salesforce", "Pardot", "Sage 100", "QuickBooks", "TrueCommerce", "EDI"],
  "Cloud and edge": ["Workers", "D1", "KV", "R2", "Queues", "Pages", "WAF", "DNS"],
  "Servers and hosting": ["CloudLinux", "CentOS", "AlmaLinux", "Ubuntu", "Linux", "Nginx", "Apache", "LiteSpeed", "PHP-FPM", "OPcache", "Redis", "cPanel / WHM", "Caddy", "systemd", "cron", "SSH", "TLS"],
  "DevOps": ["Git", "GitHub Actions", "CI/CD", "PM2", "Wrangler", "pnpm", "Turborepo", "Local WP"],
  "Data and APIs": ["MySQL", "MariaDB", "SQLite", "Drizzle", "Zod", "REST", "GraphQL", "Webhooks"],
  "Quality": ["Playwright", "Lighthouse", "Core Web Vitals", "Cross-browser testing"],
  "Security and compliance": ["HIPAA", "GDPR", "CCPA / CPRA", "Global Privacy Control", "Consent Mode v2", "PCI DSS", "CAN-SPAM", "WCAG AA", "ADA", "Section 508", "CSP", "HSTS"],
  "AI": ["Claude API", "Claude Code", "Agents", "Evals"],
} as const;

export const categories = Object.keys(groups) as (keyof typeof groups)[];

export const skills: [name: string, category: number][] = categories.flatMap((c, i) =>
  (groups[c] as readonly string[]).map((name): [string, number] => [name, i])
);

// Plain list for the stacks strip.
export const stacks = [
  "TypeScript", "Next.js", "Node", "PHP and WordPress", "Python", "SQL", "Astro",
  "Cloudflare Workers, D1, KV, R2", "Playwright", "Stripe", "Claude API",
];
