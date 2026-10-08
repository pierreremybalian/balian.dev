// GET /api/admin/submissions?type=contact|booking|intake : newest first, with the lead's name and company.
import { json } from "../../lib/session";
import type { DbEnv } from "../../lib/db";

export const onRequestGet = async ({ request, env }: { request: Request; env: DbEnv }) => {
  if (!env.DB) return json({ error: "No database bound." }, 503);
  const type = new URL(request.url).searchParams.get("type") ?? "";
  const where = ["contact", "booking", "intake"].includes(type) ? "WHERE s.type = ?" : "";
  const stmt = env.DB.prepare(`SELECT s.id, s.lead_id, s.created_at, s.type, s.summary_text, l.name, l.email, l.company FROM submissions s JOIN leads l ON l.id = s.lead_id ${where} ORDER BY s.created_at DESC LIMIT 300`);
  const rows = await (where ? stmt.bind(type) : stmt).all();
  return json({ submissions: rows.results });
};
