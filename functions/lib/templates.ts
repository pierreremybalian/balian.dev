// Fill {{placeholders}} in email and document templates.
import { emailTemplates, type EmailTemplate } from "../../src/data/emailTemplates";
import { docTemplates, type DocTemplate } from "../../src/data/docTemplates";
export { emailTemplates, docTemplates };
export type { EmailTemplate, DocTemplate };

export type Vars = Record<string, string | undefined>;

export function fill(text: string, vars: Vars): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => vars[k] ?? "");
}

/** "a\nb\nc" becomes a Markdown list; blank lines are dropped. */
export const asList = (s: string | undefined) => (s ?? "").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => `- ${l}`).join("\n") || "- (none listed)";

export const longDate = (d = new Date()) => new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "America/Chicago" }).format(d);

export function leadVars(lead: { name: string; company: string; website: string; email: string }): Vars {
  return { name: lead.name, first: lead.name.split(/\s+/)[0] || "there", company: lead.company || lead.name, website: lead.website || "your site", email: lead.email, date: longDate(), questionnaire_link: `https://balian.dev/intake/?site=${encodeURIComponent(lead.website.replace(/^https?:\/\//, ""))}` };
}
