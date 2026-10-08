// PATCH /api/admin/invoice/:id { status?, amount?, due_date?, link?, notes? }
import { json } from "../../../lib/session";
import { addEvent, now, type DbEnv } from "../../../lib/db";

const STATUSES = ["draft", "sent", "paid", "void"];

export const onRequestPatch = async ({ request, env, params }: { request: Request; env: DbEnv; params: { id: string } }) => {
  if (!env.DB) return json({ error: "No database bound." }, 503);
  const inv = await env.DB.prepare("SELECT * FROM invoices WHERE id = ?").bind(params.id).first<{ id: string; lead_id: string; number: string; status: string }>();
  if (!inv) return json({ error: "No such invoice." }, 404);
  const b = (await request.json().catch(() => ({}))) as Record<string, string>;
  const sets: string[] = [], bind: unknown[] = [];
  if (typeof b.amount === "string") { const c = Math.round(Number(b.amount.replace(/[^0-9.]/g, "")) * 100); if (Number.isFinite(c) && c > 0) { sets.push("amount_cents = ?"); bind.push(c); } }
  if (typeof b.due_date === "string") { sets.push("due_date = ?"); bind.push(b.due_date.slice(0, 10) || null); }
  if (typeof b.link === "string") { sets.push("link = ?"); bind.push(b.link.slice(0, 500)); }
  if (typeof b.notes === "string") { sets.push("notes = ?"); bind.push(b.notes.slice(0, 2000)); }
  if (typeof b.status === "string" && STATUSES.includes(b.status) && b.status !== inv.status) {
    sets.push("status = ?"); bind.push(b.status);
    if (b.status === "paid") { sets.push("paid_at = ?"); bind.push(now()); }
    await addEvent(env.DB, inv.lead_id, "invoice", `${inv.number} marked ${b.status}`);
  }
  if (!sets.length) return json({ ok: true });
  bind.push(inv.id);
  await env.DB.prepare(`UPDATE invoices SET ${sets.join(", ")} WHERE id = ?`).bind(...bind).run();
  return json({ ok: true });
};
