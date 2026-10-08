// Pre-scan of a prospect's website, run from a Pages Function: one HTML fetch, a few HEADs and DNS over HTTPS.
// Findings pre-fill the questionnaire and go to Pierre with every contact, booking and questionnaire email.
// Nothing here logs in, crawls deep or stores anything. Treat results as hints, not facts.

export interface Prescan {
  url: string;
  finalUrl: string;
  status: number;
  ttfbMs: number;
  htmlBytes: number;
  platform: string[];
  builders: string[];
  theme?: string;
  plugins: string[];
  hosting: string[];
  server?: string;
  poweredBy?: string;
  registrar?: string;
  registered?: string;
  expires?: string;
  cloudflare: boolean;
  nameservers: string[];
  dnsProvider?: string;
  mailProvider?: string;
  spf: boolean;
  dmarc: boolean;
  securityHeaders: Record<string, boolean>;
  trackers: string[];
  cookieBanner?: string;
  title?: string;
  description?: string;
  h1Count: number;
  imagesWithoutAlt: number;
  lang?: string;
  viewport: boolean;
  schema: boolean;
  sitemapUrls?: number;
  robots: boolean;
  wpJson?: boolean;
  summary: string[];
  error?: string;
}

const UA = "BalianDevPreScan/1.0 (+https://balian.dev/contact/)";
const LIMIT = 1_500_000;

const withTimeout = (ms: number) => {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  return { signal: c.signal, done: () => clearTimeout(t) };
};

async function get(url: string, ms = 8000, method = "GET", accept = "text/html,*/*"): Promise<{ res: Response; text: string; ms: number } | null> {
  const t = withTimeout(ms);
  const start = Date.now();
  try {
    const res = await fetch(url, { method, redirect: "follow", signal: t.signal, headers: { "user-agent": UA, accept } });
    const ttfb = Date.now() - start;
    let text = "";
    if (method === "GET") {
      const buf = await res.arrayBuffer();
      text = new TextDecoder().decode(buf.slice(0, LIMIT));
    }
    return { res, text, ms: ttfb };
  } catch {
    return null;
  } finally {
    t.done();
  }
}

async function dns(name: string, type: string): Promise<string[]> {
  const r = await get(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, 4000, "GET", "application/dns-json").catch(() => null);
  if (!r) return [];
  try {
    const j = JSON.parse(r.text) as { Answer?: { data: string }[] };
    return (j.Answer ?? []).map((a) => a.data.replace(/"/g, "").toLowerCase());
  } catch { return []; }
}

const pick = <T extends string>(hay: string, rules: [RegExp, T][]): T[] => rules.filter(([re]) => re.test(hay)).map(([, name]) => name);

export function normalizeUrl(input: string): string | null {
  let s = input.trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(u.hostname) || /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(u.hostname)) return null;
    return u.origin + (u.pathname === "/" ? "/" : u.pathname);
  } catch { return null; }
}

export async function prescan(input: string): Promise<Prescan> {
  const url = normalizeUrl(input);
  const out: Prescan = {
    url: input, finalUrl: "", status: 0, ttfbMs: 0, htmlBytes: 0, platform: [], builders: [], plugins: [], hosting: [], nameservers: [],
    cloudflare: false, spf: false, dmarc: false, securityHeaders: {}, trackers: [], h1Count: 0, imagesWithoutAlt: 0, viewport: false, schema: false, robots: false, summary: [],
  };
  if (!url) { out.error = "That does not look like a public website address."; return out; }
  const host = new URL(url).hostname;
  const apex = host.replace(/^www\./, "");

  const [page, ns, mx, txt, dmarc, robots, sitemap, rdap] = await Promise.all([
    get(url),
    dns(apex, "NS"), dns(apex, "MX"), dns(apex, "TXT"), dns("_dmarc." + apex, "TXT"),
    get(`https://${host}/robots.txt`, 4000), get(`https://${host}/sitemap.xml`, 5000),
    get(`https://rdap.org/domain/${apex}`, 6000, "GET", "application/rdap+json, application/json"),
  ]);

  // whois, via RDAP (the registries' JSON replacement for whois)
  if (rdap && rdap.res.status === 200) {
    try {
      const j = JSON.parse(rdap.text) as { entities?: { roles?: string[]; vcardArray?: unknown[]; publicIds?: { identifier: string }[] }[]; events?: { eventAction: string; eventDate: string }[] };
      const reg = (j.entities ?? []).find((e) => e.roles?.includes("registrar"));
      const vcard = (reg?.vcardArray?.[1] as unknown[][] | undefined) ?? [];
      const fn = vcard.find((v) => v[0] === "fn")?.[3];
      out.registrar = typeof fn === "string" ? fn : undefined;
      const ev = (a: string) => j.events?.find((e) => e.eventAction === a)?.eventDate?.slice(0, 10);
      out.registered = ev("registration"); out.expires = ev("expiration");
    } catch { /* leave blank */ }
  }

  out.nameservers = ns.map((n) => n.replace(/\.$/, ""));
  const nsStr = out.nameservers.join(" ");
  out.dnsProvider = pick(nsStr, [
    [/cloudflare/, "Cloudflare"], [/domaincontrol/, "GoDaddy"], [/awsdns/, "AWS Route 53"], [/registrar-servers/, "Namecheap"], [/googledomains|google\.com/, "Google"],
    [/wixdns/, "Wix"], [/squarespacedns|nsone/, "Squarespace or NS1"], [/wpengine/, "WP Engine"], [/siteground/, "SiteGround"], [/bluehost|hostgator|hostmonster/, "Bluehost or HostGator"],
    [/digitalocean/, "DigitalOcean"], [/dnsmadeeasy/, "DNS Made Easy"], [/ultradns/, "UltraDNS"], [/azure-dns/, "Azure"], [/hover/, "Hover"], [/networksolutions|worldnic/, "Network Solutions"],
  ])[0];
  out.mailProvider = pick(mx.join(" "), [
    [/mx\.cloudflare\.net/, "Cloudflare Email Routing (forwarding)"], [/google|googlemail/, "Google Workspace"], [/outlook|office365|microsoft/, "Microsoft 365"], [/proofpoint|pphosted/, "Proofpoint"], [/mimecast/, "Mimecast"], [/zoho/, "Zoho"],
    [/secureserver/, "GoDaddy email"], [/barracuda/, "Barracuda"], [/messagelabs|symantec/, "Symantec"], [/mailgun/, "Mailgun"], [/protonmail/, "Proton"],
  ])[0] ?? (mx.length ? "Other (" + mx[0].split(" ").pop() + ")" : undefined);
  out.spf = txt.some((t) => t.startsWith("v=spf1"));
  out.dmarc = dmarc.some((t) => t.startsWith("v=dmarc1"));
  out.robots = Boolean(robots && robots.res.status === 200 && /user-agent/i.test(robots.text));
  if (sitemap && sitemap.res.status === 200 && /<urlset|<sitemapindex/i.test(sitemap.text)) {
    out.sitemapUrls = (sitemap.text.match(/<loc>/g) ?? []).length;
  }

  if (!page) { out.error = "The site did not respond within eight seconds."; out.summary.push("Site did not respond to a fetch."); return out; }
  const { res, text: html, ms } = page;
  out.finalUrl = res.url; out.status = res.status; out.ttfbMs = ms; out.htmlBytes = html.length;
  const h = (k: string) => res.headers.get(k) ?? "";
  out.server = h("server") || undefined;
  out.cloudflare = res.headers.has("cf-ray") || /cloudflare/i.test(out.server ?? "") || /cloudflare/.test(out.nameservers.join(" "));
  out.poweredBy = h("x-powered-by") || undefined;
  const headerBlob = [...res.headers.entries()].map(([k, v]) => `${k}: ${v}`).join("\n").toLowerCase();
  // Detection reads markup only: asset URLs, the generator meta, body classes and inline scripts. Never the page's prose,
  // or a site that merely mentions Shopify would be "built on Shopify".
  const lower = [
    ...[...html.matchAll(/\b(?:src|href|data-src|action)=["']([^"']{1,500})/gi)].map((m) => m[1]),
    ...[...html.matchAll(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']{1,200})/gi)].map((m) => "generator: " + m[1]),
    ...[...html.matchAll(/<(?:body|html)[^>]+class=["']([^"']{1,2000})/gi)].map((m) => m[1]),
    ...[...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]{0,20000}?)<\/script>/gi)].map((m) => m[1]),
    ...[...html.matchAll(/<(?:astro-island|[a-z]+-[a-z-]+)\b/gi)].map((m) => m[0]),
  ].join("\n").toLowerCase();

  out.platform = pick(lower + "\n" + headerBlob, [
    [/wp-content\/|wp-includes\/|\/wp-json/, "WordPress"], [/\/plugins\/woocommerce\/|woocommerce-page|class=.*\bwoocommerce\b/, "WooCommerce"], [/cdn\.shopify\.com|shopify\.theme|x-shopify/, "Shopify"],
    [/cdn\d*\.bigcommerce\.com|stencil-utils/, "BigCommerce"], [/static1\.squarespace\.com|generator.*squarespace/, "Squarespace"], [/wixstatic\.com|parastorage\.com|x-wix/, "Wix"], [/assets\.website-files\.com|data-wf-page/, "Webflow"],
    [/\/static\/version\d+\/|\/static\/frontend\/|mage\/requirejs|magento_/, "Magento"], [/hs-sites\.com|hubspotusercontent|hubspot.*cms/, "HubSpot CMS"], [/\/sites\/default\/files|generator.*drupal/, "Drupal"], [/__next_data__|\/_next\//, "Next.js"],
    [/astro-island|generator.*astro|\/_astro\//, "Astro"], [/\/_nuxt\//, "Nuxt"], [/\/page-data\/|gatsby-/, "Gatsby"], [/\/media\/jui\/|generator.*joomla/, "Joomla"], [/prestashop/, "PrestaShop"], [/catalog\/view\/theme/, "OpenCart"],
    [/dudamobile|dudaone|cdn-cms\.f-static/, "Duda"], [/img1\.wsimg\.com|websitebuilder\.godaddy/, "GoDaddy Website Builder"], [/weebly\.com/, "Weebly"], [/leadpages|clickfunnels/, "Funnel builder"],
  ]);
  out.builders = pick(lower, [
    [/\/plugins\/elementor/, "Elementor"], [/js_composer|\bvc_row/, "WPBakery"], [/\bet_pb_|\/themes\/divi/, "Divi"], [/fl-builder/, "Beaver Builder"], [/\/plugins\/oxygen/, "Oxygen"], [/\/themes\/bricks/, "Bricks"],
    [/wp-block-library|\bwp-block-/, "Gutenberg blocks"], [/\/themes\/enfold/, "Enfold"], [/\/themes\/avada|fusion-builder/, "Avada"],
  ]);
  out.theme = lower.match(/\/wp-content\/themes\/([a-z0-9_-]+)\//)?.[1];
  out.plugins = [...new Set([...lower.matchAll(/\/wp-content\/plugins\/([a-z0-9_-]+)\//g)].map((m) => m[1]))].slice(0, 25);
  out.hosting = pick(headerBlob, [
    [/cf-ray|server: cloudflare/, "Cloudflare in front"], [/x-kinsta/, "Kinsta"], [/x-wpe|wpengine/, "WP Engine"], [/x-flywheel|flywheel/, "Flywheel"], [/x-sucuri/, "Sucuri"],
    [/litespeed/, "LiteSpeed"], [/x-amz-cf-id|cloudfront/, "CloudFront"], [/x-served-by: cache-|fastly/, "Fastly"], [/x-vercel/, "Vercel"], [/x-nf-request-id|netlify/, "Netlify"],
    [/x-github-request-id/, "GitHub Pages"], [/x-pantheon/, "Pantheon"], [/x-acquia|x-ah-/, "Acquia"], [/x-shopify/, "Shopify hosting"], [/x-wix/, "Wix hosting"], [/x-squarespace|squarespace/, "Squarespace hosting"],
    [/x-powered-by: express/, "Node (Express)"], [/x-powered-by: php/, "PHP"], [/server: nginx/, "Nginx"], [/server: apache/, "Apache"], [/x-cache: hit|x-cache: miss/, "Caching proxy"], [/x-hcdn|sg-optimizer/, "SiteGround"],
    [/x-page-speed|x-mod-pagespeed/, "mod_pagespeed"], [/x-bluehost|x-endurance/, "Bluehost or Endurance"], [/x-nananana/, "Nexcess"],
  ]);
  for (const k of ["strict-transport-security", "content-security-policy", "x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy"]) out.securityHeaders[k] = res.headers.has(k);
  out.trackers = pick(lower, [
    [/googletagmanager\.com\/gtm\.js|['"]gtm-[a-z0-9]{4,}['"]/, "Google Tag Manager"], [/gtag\/js\?id=g-|['"]g-[a-z0-9]{6,}['"]/, "GA4"], [/['"]ua-\d{4,}-\d+['"]/, "Universal Analytics (retired)"],
    [/connect\.facebook\.net|fbq\(/, "Meta Pixel"], [/static\.hotjar\.com|hj\(/, "Hotjar"], [/clarity\.ms/, "Microsoft Clarity"], [/snap\.licdn\.com/, "LinkedIn Insight"], [/analytics\.tiktok\.com/, "TikTok Pixel"],
    [/js\.hs-scripts\.com|js\.hs-analytics\.net/, "HubSpot tracking"], [/static\.klaviyo\.com|klaviyo\.js/, "Klaviyo"], [/chimpstatic\.com|list-manage\.com/, "Mailchimp"], [/fullstory\.com/, "FullStory"], [/mouseflow\.com/, "Mouseflow"], [/luckyorange\.com/, "Lucky Orange"],
    [/bat\.bing\.com/, "Microsoft Ads"], [/pinimg\.com\/ct|pintrk\(/, "Pinterest tag"], [/doubleclick\.net|googleadservices\.com/, "Google Ads"], [/widget\.intercom\.io/, "Intercom"], [/js\.driftt\.com/, "Drift"], [/embed\.tawk\.to/, "Tawk chat"],
    [/assets\.calendly\.com/, "Calendly embed"], [/google\.com\/recaptcha|gstatic\.com\/recaptcha/, "reCAPTCHA"], [/cdn\.callrail\.com/, "CallRail"], [/js\.stripe\.com/, "Stripe"], [/paypal\.com\/sdk/, "PayPal"],
    [/typekit\.net|use\.typekit/, "Adobe Fonts"], [/fonts\.googleapis\.com/, "Google Fonts"], [/youtube\.com\/embed|youtube-nocookie/, "YouTube embeds"], [/maps\.googleapis\.com|google\.com\/maps\/embed/, "Google Maps"],
  ]);
  out.cookieBanner = pick(lower, [
    [/consent\.cookiebot\.com/, "Cookiebot"], [/cdn\.cookielaw\.org|optanon/, "OneTrust"], [/cdn-cookieyes\.com/, "CookieYes"], [/consent\.cookiefirst\.com/, "CookieFirst"], [/app\.termly\.io/, "Termly"], [/cdn\.iubenda\.com/, "iubenda"],
    [/\/plugins\/complianz/, "Complianz"], [/cookiesteward\.com\/s\//, "CookieSteward"], [/\/plugins\/cookie-law-info/, "CookieYes (plugin)"], [/usercentrics\.eu/, "Usercentrics"], [/osano\.com/, "Osano"], [/quantcast\.mgr\.consensu/, "Quantcast Choice"],
  ])[0];
  out.title = html.match(/<title[^>]*>([^<]{0,200})/i)?.[1]?.trim();
  out.description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{0,400})/i)?.[1]?.trim() ?? html.match(/<meta[^>]+content=["']([^"']{0,400})["'][^>]+name=["']description["']/i)?.[1]?.trim();
  out.h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  out.imagesWithoutAlt = (html.match(/<img\b(?![^>]*\balt=)[^>]*>/gi) ?? []).length;
  out.lang = html.match(/<html[^>]+lang=["']([a-z-]+)/i)?.[1];
  out.viewport = /<meta[^>]+name=["']viewport/i.test(html);
  out.schema = /application\/ld\+json/i.test(html);
  if (out.platform.includes("WordPress")) {
    const wj = await get(`https://${host}/wp-json/`, 4000, "HEAD");
    out.wpJson = Boolean(wj && wj.res.status === 200);
  }

  /* human summary, for the email and the questionnaire card */
  const s = out.summary;
  s.push(`Responded ${out.status} in ${out.ttfbMs} ms${out.finalUrl && out.finalUrl !== url ? `, landing on ${out.finalUrl}` : ""}.`);
  if (out.registrar || out.registered) s.push(`Domain: registrar ${out.registrar ?? "unknown"}${out.registered ? `, registered ${out.registered}` : ""}${out.expires ? `, expires ${out.expires}` : ""}.`);
  s.push(out.cloudflare ? "Cloudflare: yes." : "Cloudflare: no.");
  s.push(out.platform.length ? `Platform: ${out.platform.join(", ")}${out.theme ? ` (theme "${out.theme}")` : ""}.` : "Platform: not recognised from the HTML.");
  if (out.builders.length) s.push(`Page builder: ${out.builders.join(", ")}.`);
  if (out.plugins.length) s.push(`WordPress plugins seen: ${out.plugins.join(", ")}.`);
  const hostBits = [...out.hosting, out.server && `server "${out.server}"`, out.poweredBy && `powered by "${out.poweredBy}"`].filter(Boolean);
  s.push(hostBits.length ? `Hosting signals: ${hostBits.join("; ")}.` : "Hosting: no identifying headers.");
  s.push(`DNS: ${out.dnsProvider ?? "unknown provider"}${out.nameservers.length ? ` (${out.nameservers.join(", ")})` : ""}.`);
  s.push(`Email: ${out.mailProvider ?? "no MX found"}. SPF ${out.spf ? "present" : "missing"}, DMARC ${out.dmarc ? "present" : "missing"}.`);
  const missing = Object.entries(out.securityHeaders).filter(([, v]) => !v).map(([k]) => k);
  s.push(missing.length ? `Security headers missing: ${missing.join(", ")}.` : "All common security headers present.");
  s.push(out.trackers.length ? `Tracking and third parties: ${out.trackers.join(", ")}.` : "No common trackers detected.");
  s.push(out.cookieBanner ? `Cookie banner: ${out.cookieBanner}.` : "No cookie consent tool detected.");
  s.push(`Sitemap: ${out.sitemapUrls !== undefined ? `${out.sitemapUrls} URLs` : "none found"}. robots.txt ${out.robots ? "present" : "missing"}.`);
  s.push(`On the home page: ${out.h1Count} h1, ${out.imagesWithoutAlt} images without alt text, lang ${out.lang ?? "not set"}, viewport ${out.viewport ? "set" : "missing"}, structured data ${out.schema ? "present" : "absent"}, HTML ${Math.round(out.htmlBytes / 1024)} KB.`);
  if (out.wpJson) s.push("WordPress REST API is publicly reachable.");
  return out;
}
