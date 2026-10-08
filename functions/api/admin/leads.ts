// GET /api/admin/leads?stage=&q=   list leads with per-stage counts
// POST /api/admin/leads           create a lead by hand
import { json } from "../../lib/session";
import { STAGES, upsertLead, addEvent, type DbEnv, type Stage } from "../../lib/db";

export const onRequestGet = async ({ request, env }: { request: Request; env: DbEnv }) => {
  if (!env.DB) return json({ error: "No database bound." }, 503);
  const u = new URL(request.url);
  const stage = u.searchParams.get("stage") ?? "", q = (u.searchParams.get("q") ?? "").trim().toLowerCase();
  const where: string[] = [], bind: unknown[] = [];
  if (stage && (STAGES as readonly string[]).includes(stage)) { where.push("stage = ?"); bind.push(stage); }
  if (q) { where.push("(lower(name) LIKE ? OR lower(email) LIKE ? OR lower(company) LIKE ? OR lower(website) LIKE ?)"); bind.push(...Array(4).fill(`%${q}%`)); }
  const sql = `SELECT id, created_at, updated_at, name, email, company, website, kind, source, stage FROM leads${where.length ? " WHERE " + where.join(" AND ") : ""} ORDER BY updated_at DESC LIMIT 500`;
  const [rows, counts] = await Promise.all([
    env.DB.prepare(sql).bind(...bind).all(),
    env.DB.prepare("SELECT stage, COUNT(*) AS n FROM leads GROUP BY stage").all<{ stage: string; n: number }>(),
  ]);
  const byStage: Record<string, number> = {};
  for (const r of counts.results ?? []) byStage[r.stage] = r.n;
  return json({ leads: rows.results, counts: byStage, stages: STAGES });
};

export const onRequestPost = async ({ request, env }: { request: Request; env: DbEnv }) => {
  if (!env.DB) return json({ error: "No database bound." }, 503);
  const b = (await request.json().catch(() => ({}))) as Record<string, string>;
  const email = (b.email ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "A valid email is required." }, 422);
  const lead = await upsertLead(env.DB, { email, name: b.name ?? "", company: b.company ?? "", phone: b.phone ?? "", website: b.website ?? "", kind: b.kind ?? "", source: "manual", stage: ((b.stage as Stage) || "new") });
  await addEvent(env.DB, lead.id, "created", "Added by hand in the admin.");
  return json({ lead });
};
