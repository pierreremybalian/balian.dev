// POST /api/admin/email { lead_id, template, subject, body, to? }: send through Resend and log it on the lead.
import { json } from "../../lib/session";
import { addEvent, id, now, type DbEnv, type Lead } from "../../lib/db";
import { sendMail } from "../../lib/mail";

interface Env extends DbEnv { RESEND_API_KEY?: string; CONTACT_TO?: string; CONTACT_FROM?: string }

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.DB) return json({ error: "No database bound." }, 503);
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO) return json({ error: "Resend is not configured." }, 503);
  const b = (await request.json().catch(() => ({}))) as Record<string, string>;
  const lead = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(b.lead_id ?? "").first<Lead>();
  if (!lead) return json({ error: "No such lead." }, 404);
  const to = (b.to || lead.email).trim(), subject = (b.subject ?? "").trim().slice(0, 300), body = (b.body ?? "").trim().slice(0, 20000);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to) || !subject || !body) return json({ error: "To, subject and body are required." }, 422);
  const r = await sendMail(env, { to, replyTo: env.CONTACT_TO, bcc: env.CONTACT_TO, subject, text: body });
  const rj = { id: r.id };
  if (!r.ok) return json({ error: "Resend refused it: " + r.error }, 502);
  await env.DB.prepare("INSERT INTO emails (id, lead_id, created_at, template, to_email, subject, body, resend_id) VALUES (?,?,?,?,?,?,?,?)")
    .bind(id(), lead.id, now(), b.template ?? "", to, subject, body, rj.id ?? null).run();
  await addEvent(env.DB, lead.id, "email", `Sent "${subject}" to ${to}`);
  if (lead.stage === "new") await env.DB.prepare("UPDATE leads SET stage='contacted', updated_at=? WHERE id=?").bind(now(), lead.id).run();
  return json({ ok: true, id: rj.id });
};
