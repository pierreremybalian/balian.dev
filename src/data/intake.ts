// The client context questionnaire at /intake/. Sent after first contact; the answers feed discovery and research.
// Plain TypeScript with no imports, because functions/api/intake.ts also loads it to format the email.
export type QuestionType = "text" | "textarea" | "select" | "checks" | "radio" | "url" | "email";

export interface Question {
  id: string;
  label: string;
  help?: string;
  type: QuestionType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  /** Only shown when the answer to question `q` includes any of these values. Hidden questions are skipped in validation and in the email. */
  showIf?: { q: string; any: string[] };
}

export const matches = (answers: Record<string, unknown>, cond?: { q: string; any: string[] }) => {
  if (!cond) return true;
  const v = answers[cond.q];
  const have = Array.isArray(v) ? v.map(String) : v ? [String(v)] : [];
  return cond.any.some((x) => have.includes(x));
};

export interface Step {
  id: string;
  title: string;
  intro: string;
  questions: Question[];
}

export const intakeSteps: Step[] = [
  {
    id: "business",
    title: "You and the business",
    intro: "The basics, and the things I cannot find out from your website.",
    questions: [
      { id: "name", label: "Your name", type: "text", required: true },
      { id: "role", label: "Your role", type: "text", placeholder: "Owner, marketing lead, operations" },
      { id: "email", label: "Your email", type: "email", required: true },
      { id: "company", label: "Company", type: "text", required: true },
      { id: "website", label: "Current website, if there is one", type: "url", placeholder: "https://" },
      { id: "what_you_do", label: "What does the business do?", help: "A sentence or two, said the way you would say it to someone at a party.", type: "textarea", required: true },
      { id: "business_type", label: "Which of these describe the business?", help: "Tick everything that applies. It decides which questions you see later.", type: "checks", required: true, options: ["We sell to other businesses", "We sell to consumers", "We sell online", "We make software", "We sell services or expertise", "We are a nonprofit or public body", "We work in healthcare"] },
      { id: "project_type", label: "What brought you here?", help: "Tick everything that applies.", type: "checks", required: true, options: ["A new website", "A rebuild of the current site", "An online store", "Software, an app or a portal", "Connecting systems or automating work", "A letter, an audit or a questionnaire", "Something is broken", "Ongoing help or a technical lead", "Not sure yet"] },
      { id: "years", label: "How long has it been around?", type: "select", options: ["Under 2 years", "2 to 5 years", "5 to 15 years", "More than 15 years"] },
      { id: "team", label: "How many people work there?", type: "select", options: ["Just me", "2 to 10", "11 to 50", "51 to 200", "More than 200"] },
      { id: "reach", label: "Where are your customers?", type: "radio", options: ["Local or regional", "National", "International"] },
      { id: "revenue_model", label: "How does the business make money?", help: "One-time sales, repeat orders, contracts, subscriptions, retainers, referrals from partners. Be specific.", type: "textarea" },
      { id: "competitors", label: "Who do you lose deals to, and who do you win them from?", help: "Two or three names, and a line on why.", type: "textarea" },
      { id: "different", label: "When a customer picks you over them, what reason do they give?", type: "textarea" },
    ],
  },
  {
    id: "closer",
    title: "A closer look",
    intro: "Based on what you ticked. If a question does not apply, skip it.",
    questions: [
      // selling to businesses
      { id: "b2b_buyers", label: "Who is involved in a purchase on the customer's side, and who signs?", help: "The person who finds you is rarely the person who pays.", type: "textarea", showIf: { q: "business_type", any: ["We sell to other businesses"] } },
      { id: "b2b_needs", label: "Does the site need any of these?", type: "checks", options: ["Quote requests", "Account or dealer pricing", "A customer or dealer portal", "Spec sheets or downloads", "Distributor or location finder", "None of these"], showIf: { q: "business_type", any: ["We sell to other businesses"] } },
      // selling to consumers
      { id: "b2c_where", label: "Where do people buy from you?", type: "checks", options: ["Online", "In person", "Over the phone", "Through retailers or marketplaces"], showIf: { q: "business_type", any: ["We sell to consumers"] } },
      { id: "b2c_reviews", label: "Where do your reviews live, and how are they?", type: "text", showIf: { q: "business_type", any: ["We sell to consumers"] } },
      // online store
      { id: "store_platform", label: "What does the store run on today?", type: "text", placeholder: "Shopify, WooCommerce, BigCommerce, Magento, something custom", showIf: { q: "business_type", any: ["We sell online"] } },
      { id: "store_size", label: "Roughly how many products, and how many orders a month?", type: "text", showIf: { q: "business_type", any: ["We sell online"] } },
      { id: "store_aov", label: "Average order value, and the margin on a typical order", type: "text", showIf: { q: "business_type", any: ["We sell online"] } },
      { id: "store_flow", label: "After someone pays, where does the order go?", help: "Accounting, ERP, a warehouse, a fulfilment partner, a spreadsheet, a person.", type: "textarea", showIf: { q: "business_type", any: ["We sell online"] } },
      { id: "store_pain", label: "What goes wrong most often with orders, shipping, tax or returns?", type: "textarea", showIf: { q: "business_type", any: ["We sell online"] } },
      // software
      { id: "saas_what", label: "What does the software do, and who uses it?", type: "textarea", showIf: { q: "business_type", any: ["We make software"] } },
      { id: "saas_stage", label: "Where is it?", type: "radio", options: ["An idea", "A prototype", "Live with users", "Live with paying customers"], showIf: { q: "business_type", any: ["We make software"] } },
      { id: "saas_stack", label: "What is it built with, who built it, and where does it run?", type: "textarea", showIf: { q: "business_type", any: ["We make software"] } },
      { id: "saas_pricing", label: "How is it priced?", type: "text", placeholder: "Subscription, per seat, usage, one-off licence, free for now", showIf: { q: "business_type", any: ["We make software"] } },
      { id: "saas_worry", label: "What is the biggest technical worry right now?", type: "textarea", showIf: { q: "business_type", any: ["We make software"] } },
      // services
      { id: "svc_pricing", label: "How is your work scoped and priced?", type: "text", placeholder: "Hourly, fixed project, retainer, a mix", showIf: { q: "business_type", any: ["We sell services or expertise"] } },
      { id: "svc_intake", label: "How does a new client get started with you today, and should the site do any of that?", help: "Booking, an intake form, a quote request, a phone call.", type: "textarea", showIf: { q: "business_type", any: ["We sell services or expertise"] } },
      { id: "svc_proof", label: "What proof can you show? Credentials, case studies, named clients, results.", type: "textarea", showIf: { q: "business_type", any: ["We sell services or expertise"] } },
      // nonprofit
      { id: "npo_needs", label: "Does the site need any of these?", type: "checks", options: ["Donations", "Volunteer sign-up", "Events or ticketing", "Membership", "Grant or impact reporting", "None of these"], showIf: { q: "business_type", any: ["We are a nonprofit or public body"] } },
      // healthcare
      { id: "hc_phi", label: "Does the website touch patient information anywhere?", help: "Appointment forms, a patient portal, intake forms, chat, anything someone types that is about their health.", type: "textarea", showIf: { q: "business_type", any: ["We work in healthcare"] } },
      { id: "hc_tracking", label: "Do you know what tracking is on the site today?", type: "radio", options: ["Yes, and it has been reviewed for HIPAA", "Yes, but it has not been reviewed", "No idea"], showIf: { q: "business_type", any: ["We work in healthcare"] } },
      // project types
      { id: "letter", label: "What arrived, who sent it, and is there a deadline?", help: "An ADA or accessibility complaint, a cyber-insurance questionnaire, a privacy complaint, an audit finding.", type: "textarea", showIf: { q: "project_type", any: ["A letter, an audit or a questionnaire"] } },
      { id: "broken", label: "What is broken, since when, and who last touched it?", type: "textarea", showIf: { q: "project_type", any: ["Something is broken"] } },
      { id: "connect", label: "Which systems need to talk, and what should flow between them?", help: "For example: orders from the store into QuickBooks, leads from the site into HubSpot, inventory from the ERP onto the site.", type: "textarea", showIf: { q: "project_type", any: ["Connecting systems or automating work"] } },
      { id: "ongoing", label: "What would you hand off first, and roughly how many hours a month do you have in mind?", type: "textarea", showIf: { q: "project_type", any: ["Ongoing help or a technical lead"] } },
      { id: "software_need", label: "What should the software, app or portal do, and for whom?", type: "textarea", showIf: { q: "project_type", any: ["Software, an app or a portal"] } },
    ],
  },
  {
    id: "customers",
    title: "Your customers",
    intro: "The site is for them, so I need to know them better than they know themselves.",
    questions: [
      { id: "buyer_types", label: "Who buys from you? Describe your two or three most common customers.", help: "Their role, the kind of company or person they are, and the situation they are in when they come to you.", type: "textarea", required: true },
      { id: "best_customer", label: "Describe your best customer. What makes them the best?", type: "textarea" },
      { id: "worst_customer", label: "And the customer you would rather not have.", type: "textarea" },
      { id: "how_find", label: "How do customers find you today?", type: "checks", options: ["Google search", "Referrals", "Social media", "Paid ads", "Trade shows or events", "Partners or resellers", "Existing customers", "I am not sure"] },
      { id: "questions_before", label: "What do they ask before they buy?", type: "textarea" },
      { id: "objections", label: "What stops them from buying, or slows it down?", type: "textarea" },
      { id: "happy_words", label: "What do happy customers say about you?", help: "Quote them if you can. The exact words matter.", type: "textarea" },
      { id: "deal", label: "Typical order or deal size, and how long a sale takes", type: "text" },
      { id: "seasonality", label: "Is there a busy season or a slow one?", type: "text" },
    ],
  },
  {
    id: "offer",
    title: "Products and services",
    intro: "What you sell, and what you would rather sell.",
    questions: [
      { id: "offerings", label: "List what you sell, most important first.", help: "Products, services, plans, packages. Rough prices help.", type: "textarea", required: true },
      { id: "margin", label: "Which of those makes you the most money?", type: "textarea" },
      { id: "grow", label: "Which do you want to sell more of?", type: "textarea" },
      { id: "stop", label: "Anything you would rather stop selling, or not promote?", type: "textarea" },
      { id: "pricing_public", label: "Are prices public?", type: "radio", options: ["Yes, on the site", "Quoted per customer", "Some of each"] },
      { id: "buying_process", label: "Walk me through what happens between someone being interested and money changing hands.", help: "Who they talk to, what they sign, how they pay, how long it takes.", type: "textarea" },
    ],
  },
  {
    id: "goals",
    title: "Goals",
    intro: "What the site has to do, and how we will know it did it.",
    questions: [
      { id: "site_job", label: "What does the website need to do for the business?", type: "checks", required: true, options: ["Bring in leads", "Sell online", "Take bookings or appointments", "Support existing customers", "Recruit staff", "Establish credibility", "Explain something complicated", "Something else"] },
      { id: "goal_12", label: "What does the business need to achieve in the next twelve months?", type: "textarea", required: true },
      { id: "success", label: "How will you know the site worked? Give me a number if you can.", help: "Leads per month, orders, bookings, phone calls, a ranking, a cost that goes away.", type: "textarea" },
      { id: "numbers_now", label: "Where are those numbers today?", help: "Visitors, leads, orders, conversion. Guesses are fine if you say they are guesses.", type: "textarea" },
      { id: "deadline", label: "Is there a date this has to be live by, and what is driving it?", type: "text" },
      { id: "budget", label: "The budget range you have in mind", type: "select", options: ["Under $10,000", "$10,000 to $25,000", "$25,000 to $50,000", "$50,000 to $100,000", "More than $100,000", "Not sure yet"] },
    ],
  },
  {
    id: "site",
    title: "The current site",
    intro: "What you have now, what works, and what does not.",
    questions: [
      { id: "platform", label: "What is it built on, and who built it?", help: "If you do not know, say so. I can find out.", type: "text" },
      { id: "hosting", label: "Where is it hosted, and who has the logins?", type: "text" },
      { id: "works", label: "What works about it?", type: "textarea" },
      { id: "fails", label: "What is wrong with it?", type: "checks", options: ["Slow", "Hard to edit", "Looks dated", "Does not work well on phones", "Does not bring in leads", "Hard to find on Google", "Breaks or goes down", "Security worries", "Nobody knows how it works", "Other"] },
      { id: "fails_detail", label: "Say more about the worst of those.", type: "textarea" },
      { id: "editing", label: "Who updates the site today, and how often?", type: "textarea" },
      { id: "integrations", label: "What other systems does it connect to, or should it?", help: "CRM, ERP, accounting, email platform, payments, booking, inventory, shipping.", type: "textarea" },
      { id: "analytics", label: "Do you have Google Analytics or Search Console, and can you give me access?", type: "radio", options: ["Yes, both", "Analytics only", "Neither", "Not sure"] },
      { id: "domain", label: "Who controls the domain and DNS?", type: "radio", options: ["We do", "Our old agency or developer", "Not sure"] },
      { id: "compliance", label: "Do any of these apply?", type: "checks", options: ["We received an ADA or accessibility complaint", "We have a cyber-insurance questionnaire or audit", "We handle health information", "We sell to EU or California customers", "We have been hacked before", "None of these"] },
    ],
  },
  {
    id: "pain",
    title: "Pain points",
    intro: "Not the website. The business. This is where the useful projects come from.",
    questions: [
      { id: "pains", label: "What are the three biggest problems in the business right now?", type: "textarea", required: true },
      { id: "manual", label: "What do people do by hand that a computer should be doing?", help: "Re-typing orders, chasing invoices, copying between spreadsheets, answering the same email.", type: "textarea" },
      { id: "silos", label: "Which systems do not talk to each other?", type: "textarea" },
      { id: "complaints_customers", label: "What do customers complain about?", type: "textarea" },
      { id: "complaints_staff", label: "What does your team complain about?", type: "textarea" },
      { id: "if_nothing", label: "If nothing changes for a year, what happens?", type: "textarea" },
    ],
  },
  {
    id: "brand",
    title: "Brand and content",
    intro: "What exists already, and how the company should sound.",
    questions: [
      { id: "brand_assets", label: "What do you have?", type: "checks", options: ["Logo files", "Brand guidelines", "Photography", "Video", "Case studies or testimonials", "Brochures or decks", "None of these"] },
      { id: "voice", label: "Three words for how the company should sound. And three for how it should not.", type: "textarea" },
      { id: "admire", label: "Two or three websites you like, and what you like about them.", help: "Any industry.", type: "textarea" },
      { id: "dislike", label: "A website you cannot stand, and why.", type: "textarea" },
      { id: "words", label: "Words or phrases to use, and ones to avoid.", type: "textarea" },
      { id: "content_source", label: "Who should I interview for the content? Name and role.", type: "text" },
      { id: "materials", label: "What can you send me?", help: "Old copy, sales emails, FAQs, product sheets, reviews. Rough is fine.", type: "textarea" },
    ],
  },
  {
    id: "decisions",
    title: "Decisions",
    intro: "Who decides, who else has to be happy, and what you are worried about.",
    questions: [
      { id: "approver", label: "Who signs off on this project? One name.", type: "text", required: true },
      { id: "stakeholders", label: "Who else has to be happy, and what do they care about?", type: "textarea" },
      { id: "past", label: "Have you worked with an agency or a developer before? What went wrong, and what went right?", type: "textarea" },
      { id: "fears", label: "What worries you about this project?", type: "textarea" },
      { id: "anything", label: "Anything I did not ask that I should know?", type: "textarea" },
      { id: "record_ok", label: "Are you fine with me recording our discovery call?", help: "The recording is the raw material for your content and stays private.", type: "radio", options: ["Yes", "I would rather not"] },
    ],
  },
];
