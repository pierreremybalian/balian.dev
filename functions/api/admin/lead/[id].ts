// GET /api/admin/lead/:id     everything about one lead
// PATCH /api/admin/lead/:id   stage, notes, contact fields
import { json } from "../../../lib/session";
import { STAGES, STAGE_LABEL, addEvent, now, type DbEnv, type Lead, type Stage } from "../../../lib/db";

type Ctx = { request: Request; env: DbEnv; params: { id: string } };

export const onRequestGet = async ({ env, params }: Ctx) => {
  if (!env.DB) return json({ error: "No database bound." }, 503);
  const lead = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(params.id).first<Lead>();
  if (!lead) return json({ error: "No such lead." }, 404);
  const q = (sql: string) => env.DB!.prepare(sql).bind(params.id).all();
  const [submissions, events, emails, documents, invoices] = await Promise.all([
    q("SELECT * FROM submissions WHERE lead_id = ? ORDER BY created_at DESC"),
    q("SELECT * FROM events WHERE lead_id = ? ORDER BY created_at DESC LIMIT 200"),
    q("SELECT * FROM emails WHERE lead_id = ? ORDER BY created_at DESC"),
    q("SELECT id, lead_id, created_at, updated_at, type, title, status, token, sent_at, viewed_at, accepted_at, accepted_name FROM documents WHERE lead_id = ? ORDER BY created_at DESC"),
    q("SELECT * FROM invoices WHERE lead_id = ? ORDER BY created_at DESC"),
  ]);
  return json({ lead: { ...lead, prescan: lead.prescan_json ? JSON.parse(lead.prescan_json) : null, prescan_json: undefined }, submissions: submissions.results, events: events.results, emails: emails.results, documents: documents.results, invoices: invoices.results, stages: STAGES, stageLabel: STAGE_LABEL });
};

export const onRequestPatch = async ({ request, env, params }: Ctx) => {
  if (!env.DB) return json({ error: "No database bound." }, 503);
  const lead = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(params.id).first<Lead>();
  if (!lead) return json({ error: "No such lead." }, 404);
  const b = (await request.json().catch(() => ({}))) as Partial<Record<"stage" | "notes" | "name" | "company" | "phone" | "website" | "kind", string>>;
  const sets: string[] = [], bind: unknown[] = [];
  for (const k of ["notes", "name", "company", "phone", "website", "kind"] as const) if (typeof b[k] === "string") { sets.push(`${k} = ?`); bind.push(b[k]!.trim().slice(0, 5000)); }
  if (typeof b.stage === "string" && (STAGES as readonly string[]).includes(b.stage) && b.stage !== lead.stage) {
    sets.push("stage = ?"); bind.push(b.stage);
    await addEvent(env.DB, lead.id, "stage", `${STAGE_LABEL[lead.stage]} to ${STAGE_LABEL[b.stage as Stage]}`);
  }
  if (!sets.length) return json({ ok: true });
  sets.push("updated_at = ?"); bind.push(now(), lead.id);
  await env.DB.prepare(`UPDATE leads SET ${sets.join(", ")} WHERE id = ?`).bind(...bind).run();
  return json({ ok: true });
};
