import { site } from "../data/site";
import type { Faq } from "../data/faq";

const abs = (path: string) => new URL(path, site.url).toString();
const logo = abs("/icon-512.png");

export const professionalService = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.brand,
  url: site.url,
  description: site.description,
  areaServed: "US",
  address: { "@type": "PostalAddress", addressLocality: site.locality, addressRegion: site.region, addressCountry: "US" },
  logo,
  image: abs("/og.png"),
  founder: { "@type": "Person", name: site.name },
  email: site.contact.email,
  telephone: site.contact.phoneHref,
  sameAs: [site.contact.linkedin],
});

export const person = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: "Web engineer",
  email: site.contact.email,
  telephone: site.contact.phoneHref,
  sameAs: [site.contact.linkedin],
  address: { "@type": "PostalAddress", addressLocality: site.locality, addressRegion: site.region },
});

export const service = (name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  url: abs(path),
  provider: { "@type": "ProfessionalService", name: site.brand, url: site.url },
  areaServed: "US",
});

export const faqPage = (items: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: abs(t.path) })),
});

export const website = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.brand,
  url: site.url,
  inLanguage: "en-US",
  publisher: { "@type": "Person", name: site.name },
});

export const aboutPage = () => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${site.brand}`,
  url: abs("/about/"),
  mainEntity: { ...person(), "@context": undefined },
});

export const contactPage = () => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${site.brand}`,
  url: abs("/contact/"),
  mainEntity: { "@type": "ProfessionalService", name: site.brand, url: site.url, email: site.contact.email, telephone: site.contact.phoneHref },
  potentialAction: { "@type": "ReserveAction", name: "Book a 30-minute call", target: abs("/contact/#book") },
});

export const collectionPage = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Work",
  url: abs("/work/"),
  mainEntity: {
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.path) })),
  },
});

export const blog = (posts: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: `${site.brand} writing`,
  url: abs("/writing/"),
  author: { "@type": "Person", name: site.name },
  blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.name, url: abs(p.path) })),
});

export const blogPosting = (headline: string, description: string, path: string, published: Date, updated?: Date) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline,
  description,
  url: abs(path),
  mainEntityOfPage: abs(path),
  datePublished: published.toISOString().slice(0, 10),
  dateModified: (updated ?? published).toISOString().slice(0, 10),
  author: { "@type": "Person", name: site.name, url: site.url },
  publisher: { "@type": "Person", name: site.name, url: site.url },
  image: abs(`/og/${path.split("/").filter(Boolean).pop()}.png`),
  inLanguage: "en-US",
});

export const softwareApp = (name: string, description: string, path: string, external?: string) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name,
  description,
  url: external ?? abs(path),
  mainEntityOfPage: abs(path),
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  author: { "@type": "Person", name: site.name },
});
