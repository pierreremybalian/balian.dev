// Cloudflare Pages Function: POST /api/contact
// Sends the brief by email through Resend. Configure these in the Pages project (Settings > Variables and Secrets):
//   RESEND_API_KEY   secret
//   CONTACT_TO       where briefs are delivered
//   CONTACT_FROM     a sender on a domain verified in Resend, e.g. "balian.dev <contact@balian.dev>"
// Until they are set, the function answers 503 and the page tells the visitor to book a call instead.

import { prescan, normalizeUrl } from "../lib/prescan";
import { record, upsertLead, addSubmission, addEvent, setPrescan, type DbEnv } from "../lib/db";

interface Env extends DbEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

/** A second email with the pre-scan of the prospect's site, sent after the reply so the form never waits on it. */
export async function sendPrescan(env: Env, site: string, who: string, leadId?: string) {
  try {
    const scan = await prescan(site);
    if (leadId) await record(env, (db) => setPrescan(db, leadId, scan));
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: env.CONTACT_FROM, to: [env.CONTACT_TO],
        subject: `Pre-scan: ${new URL(site).hostname} for ${who}`,
        text: `Pre-scan of ${site}\n\n${scan.summary.map((l) => `  ${l}`).join("\n")}${scan.error ? `\n\n  ${scan.error}` : ""}`,
      }),
    });
  } catch (e) { console.error("prescan email:", (e as Error).message); }
}

export const onRequestPost = async ({ request, env, waitUntil }: { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "That request could not be read." }, 400);
  }
  // Honeypot: bots fill the hidden field. Pretend success.
  if (clean(form.get("website"), 200)) return json({ ok: true });

  const name = clean(form.get("name"), 120);
  const email = clean(form.get("email"), 200);
  const kind = clean(form.get("kind"), 120);
  const message = clean(form.get("message"), 5000);
  const site = normalizeUrl(clean(form.get("site"), 200));
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length < 10) {
    return json({ error: "Please add your name, a valid email and a few lines about the project." }, 422);
  }
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return json({ error: "The form is not connected yet. Please book a call above or email me." }, 503);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: `${name} <${email}>`,
      subject: `New brief: ${kind || "project"} from ${name}`,
      text: `Name: ${name}\nEmail: ${email}${site ? `\nWebsite: ${site}` : ""}\nLooking for: ${kind}\n\n${message}`,
    }),
  });
  if (!res.ok) return json({ error: "That did not send. Please try again, or book a call above." }, 502);
  let leadId: string | undefined;
  await record(env, async (db) => {
    const lead = await upsertLead(db, { email, name, website: site ?? "", kind, source: "contact", stage: "new" });
    leadId = lead.id;
    await addSubmission(db, lead.id, "contact", { name, email, kind, message, site }, `Looking for: ${kind}\n\n${message}`);
    await addEvent(db, lead.id, "submission", "Sent a brief from the contact form");
  });
  if (site) waitUntil(sendPrescan(env, site, `${name} (${kind || "brief"})`, leadId));
  return json({ ok: true });
};
