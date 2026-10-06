export const site = {
  name: "Pierre Balian",
  brand: "Balian.dev",
  url: "https://balian.dev",
  tagline: "Agency-level web engineering, without the agency.",
  description:
    "Agency-level web engineering from one senior engineer. Websites, commerce, web apps and AI, built faster and more affordably, with a clear process and your sign-off at every gate.",
  location: "Minneapolis, MN",
  locality: "Minneapolis",
  region: "MN",
  // Direct contact details, from resume v5. Confirm the LinkedIn URL: the portfolio uses /in/pierre-balian instead.
  contact: {
    email: "pierre@baliandesign.com",
    phone: "(612) 469-5535",
    phoneHref: "+16124695535",
    linkedin: "https://www.linkedin.com/in/pierre-remy-balian",
    linkedinLabel: "linkedin.com/in/pierre-remy-balian",
  },
  // Replace with the real scheduling link. Falls back to the contact page.
  bookingUrl: import.meta.env.PUBLIC_BOOKING_URL || "/contact/",
};

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services/",
    children: [
      { label: "Websites and CMS", href: "/services/websites-and-cms/" },
      { label: "WordPress", href: "/services/wordpress-development/" },
      { label: "WooCommerce", href: "/services/woocommerce-development/" },
      { label: "Web apps and SaaS", href: "/services/web-app-saas-development/" },
      { label: "AI integration", href: "/services/ai-integration/" },
      { label: "AI-assisted engineering", href: "/services/ai-assisted-engineering/" },
    ],
  },
  { label: "Work", href: "/work/" },
  { label: "Process", href: "/process/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];
