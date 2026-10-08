// POST /api/admin/documents { lead_id, template, fields }: generate a document from a template for a lead.
import { json } from "../../lib/session";
import { addEvent, id, now, type DbEnv, type Lead } from "../../lib/db";
import { docTemplates, fill, asList, leadVars } from "../../lib/templates";

const token = () => { const b = new Uint8Array(24); crypto.getRandomValues(b); return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };

export const onRequestPost = async ({ request, env }: { request: Request; env: DbEnv }) => {
  if (!env.DB) return json({ error: "No database bound." }, 503);
  const b = (await request.json().catch(() => ({}))) as { lead_id?: string; template?: string; fields?: Record<string, string> };
  const lead = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(b.lead_id ?? "").first<Lead>();
  if (!lead) return json({ error: "No such lead." }, 404);
  const tpl = docTemplates.find((t) => t.id === b.template);
  if (!tpl) return json({ error: "No such template." }, 422);
  const f = b.fields ?? {};
  const vars = { ...leadVars(lead), ...Object.fromEntries(Object.entries(f).map(([k, v]) => [k, String(v ?? "").slice(0, 8000)])) };
  for (const k of ["deliverables", "out_of_scope"]) vars[k + "_list"] = asList(vars[k]);
  const doc = { id: id(), lead_id: lead.id, created_at: now(), updated_at: now(), type: tpl.id, title: fill(tpl.title, vars), body_md: fill(tpl.body, vars), status: "draft", token: token() };
  await env.DB.prepare("INSERT INTO documents (id, lead_id, created_at, updated_at, type, title, body_md, status, token) VALUES (?,?,?,?,?,?,?,?,?)")
    .bind(doc.id, doc.lead_id, doc.created_at, doc.updated_at, doc.type, doc.title, doc.body_md, doc.status, doc.token).run();
  await addEvent(env.DB, lead.id, "document", `Created ${tpl.name.toLowerCase()} "${doc.title}"`);
  return json({ document: doc });
};
