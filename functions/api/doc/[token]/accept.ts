// POST /api/doc/:token/accept { name }  the client accepts the document. Records who, when, from where; emails both sides.
import { json } from "../../../lib/session";
import { addEvent, now, type DbEnv, type Lead } from "../../../lib/db";

interface Env extends DbEnv { RESEND_API_KEY?: string; CONTACT_TO?: string; CONTACT_FROM?: string }
interface Doc { id: string; lead_id: string; type: string; title: string; body_md: string; status: string; accepted_at: string | null }

export const onRequestPost = async ({ request, env, params }: { request: Request; env: Env; params: { token: string } }) => {
  if (!env.DB || !/^[A-Za-z0-9_-]{20,64}$/.test(params.token)) return json({ error: "Not found." }, 404);
  const doc = await env.DB.prepare("SELECT * FROM documents WHERE token = ?").bind(params.token).first<Doc>();
  if (!doc || doc.status === "draft") return json({ error: "Not found." }, 404);
  if (doc.accepted_at) return json({ error: "This document was already accepted." }, 409);
  const b = (await request.json().catch(() => ({}))) as { name?: string };
  const name = String(b.name ?? "").trim().slice(0, 120);
  if (name.length < 2) return json({ error: "Please type your full name." }, 422);
  const t = now(), ip = request.headers.get("cf-connecting-ip") ?? "", ua = (request.headers.get("user-agent") ?? "").slice(0, 300);
  await env.DB.prepare("UPDATE documents SET status='accepted', accepted_at=?, accepted_name=?, accepted_ip=?, accepted_ua=?, updated_at=? WHERE id=?").bind(t, name, ip, ua, t, doc.id).run();
  await addEvent(env.DB, doc.lead_id, "accepted", `"${doc.title}" accepted by ${name}`);
  const lead = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(doc.lead_id).first<Lead>();
  if (lead && !["agreed", "in_progress", "launched", "care"].includes(lead.stage)) {
    await env.DB.prepare("UPDATE leads SET stage='agreed', updated_at=? WHERE id=?").bind(t, lead.id).run();
  }
  if (env.RESEND_API_KEY && env.CONTACT_FROM && env.CONTACT_TO && lead) {
    const record = `Accepted by ${name} on ${new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short", timeZone: "America/Chicago" }).format(new Date(t))} (Central)${ip ? ` from ${ip}` : ""}.`;
    const text = `${doc.title}\n\n${record}\n\n${"-".repeat(60)}\n\n${doc.body_md}`;
    await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: env.CONTACT_FROM, to: [lead.email], bcc: [env.CONTACT_TO], reply_to: env.CONTACT_TO, subject: `Accepted: ${doc.title}`, text: `Hi ${name},\n\nThank you. Here is the document you accepted, with the acceptance record, for your files.\n\n${text}` }),
    }).catch((e) => console.error("accept email:", (e as Error).message));
  }
  return json({ ok: true, accepted_at: t, accepted_name: name });
};
