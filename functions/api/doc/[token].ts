// GET /api/doc/:token  the document behind a private link, for the client. Records the first view.
import { json } from "../../lib/session";
import { addEvent, now, type DbEnv } from "../../lib/db";

interface Doc { id: string; lead_id: string; type: string; title: string; body_md: string; status: string; viewed_at: string | null; accepted_at: string | null; accepted_name: string | null }

export const onRequestGet = async ({ env, params }: { env: DbEnv; params: { token: string } }) => {
  if (!env.DB || !/^[A-Za-z0-9_-]{20,64}$/.test(params.token)) return json({ error: "Not found." }, 404);
  const doc = await env.DB.prepare("SELECT d.*, l.company FROM documents d JOIN leads l ON l.id = d.lead_id WHERE d.token = ?").bind(params.token).first<Doc & { company: string }>();
  if (!doc || doc.status === "draft") return json({ error: "Not found." }, 404);
  if (!doc.viewed_at) {
    await env.DB.prepare("UPDATE documents SET viewed_at = ?, status = CASE WHEN status = 'sent' THEN 'viewed' ELSE status END WHERE id = ?").bind(now(), doc.id).run();
    await addEvent(env.DB, doc.lead_id, "document", `Viewed "${doc.title}"`);
  }
  return json({ title: doc.title, type: doc.type, body_md: doc.body_md, status: doc.accepted_at ? "accepted" : "open", accepted_at: doc.accepted_at, accepted_name: doc.accepted_name, company: doc.company });
};
