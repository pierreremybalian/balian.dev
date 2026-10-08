// GET /api/admin/document/:id      full document
// PATCH /api/admin/document/:id    { title?, body_md?, status? }  status "sent" stamps sent_at and moves the lead forward
import { json } from "../../../lib/session";
import { addEvent, now, type DbEnv, type Lead } from "../../../lib/db";

type Ctx = { request: Request; env: DbEnv; params: { id: string } };
interface Doc { id: string; lead_id: string; type: string; title: string; body_md: string; status: string; token: string }

export const onRequestGet = async ({ env, params }: Ctx) => {
  if (!env.DB) return json({ error: "No database bound." }, 503);
  const doc = await env.DB.prepare("SELECT * FROM documents WHERE id = ?").bind(params.id).first();
  return doc ? json({ document: doc }) : json({ error: "No such document." }, 404);
};

export const onRequestPatch = async ({ request, env, params }: Ctx) => {
  if (!env.DB) return json({ error: "No database bound." }, 503);
  const doc = await env.DB.prepare("SELECT * FROM documents WHERE id = ?").bind(params.id).first<Doc>();
  if (!doc) return json({ error: "No such document." }, 404);
  if (doc.status === "accepted") return json({ error: "An accepted document cannot be changed." }, 409);
  const b = (await request.json().catch(() => ({}))) as Partial<Record<"title" | "body_md" | "status", string>>;
  const sets: string[] = [], bind: unknown[] = [];
  if (typeof b.title === "string") { sets.push("title = ?"); bind.push(b.title.trim().slice(0, 300)); }
  if (typeof b.body_md === "string") { sets.push("body_md = ?"); bind.push(b.body_md.slice(0, 200_000)); }
  if (b.status === "sent" && doc.status !== "sent") {
    sets.push("status = ?", "sent_at = ?"); bind.push("sent", now());
    await addEvent(env.DB, doc.lead_id, "document", `Sent "${doc.title}"`);
    const lead = await env.DB.prepare("SELECT stage FROM leads WHERE id = ?").bind(doc.lead_id).first<Pick<Lead, "stage">>();
    if (doc.type === "proposal" && lead && ["new", "contacted", "call_booked", "questionnaire"].includes(lead.stage)) {
      await env.DB.prepare("UPDATE leads SET stage='proposal_sent', updated_at=? WHERE id=?").bind(now(), doc.lead_id).run();
    }
  } else if (b.status === "draft" && doc.status !== "draft") { sets.push("status = ?"); bind.push("draft"); }
  if (!sets.length) return json({ ok: true });
  sets.push("updated_at = ?"); bind.push(now(), doc.id);
  await env.DB.prepare(`UPDATE documents SET ${sets.join(", ")} WHERE id = ?`).bind(...bind).run();
  return json({ ok: true });
};
