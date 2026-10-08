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
}

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
      { id: "years", label: "How long has it been around?", type: "select", options: ["Under 2 years", "2 to 5 years", "5 to 15 years", "More than 15 years"] },
      { id: "team", label: "How many people work there?", type: "select", options: ["Just me", "2 to 10", "11 to 50", "51 to 200", "More than 200"] },
      { id: "reach", label: "Where are your customers?", type: "radio", options: ["Local or regional", "National", "International"] },
      { id: "revenue_model", label: "How does the business make money?", help: "One-time sales, repeat orders, contracts, subscriptions, retainers, referrals from partners. Be specific.", type: "textarea" },
      { id: "competitors", label: "Who do you lose deals to, and who do you win them from?", help: "Two or three names, and a line on why.", type: "textarea" },
      { id: "different", label: "When a customer picks you over them, what reason do they give?", type: "textarea" },
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
