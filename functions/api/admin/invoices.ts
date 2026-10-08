// POST /api/admin/invoices { lead_id, amount, due_date, link, notes }: a simple invoice record, numbered BD-YYYY-NNN.
import { json } from "../../lib/session";
import { addEvent, id, now, type DbEnv, type Lead } from "../../lib/db";

export const onRequestPost = async ({ request, env }: { request: Request; env: DbEnv }) => {
  if (!env.DB) return json({ error: "No database bound." }, 503);
  const b = (await request.json().catch(() => ({}))) as Record<string, string>;
  const lead = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(b.lead_id ?? "").first<Lead>();
  if (!lead) return json({ error: "No such lead." }, 404);
  const cents = Math.round(Number(String(b.amount ?? "").replace(/[^0-9.]/g, "")) * 100);
  if (!Number.isFinite(cents) || cents <= 0) return json({ error: "Amount must be a number." }, 422);
  const year = new Date().getFullYear();
  const last = await env.DB.prepare("SELECT number FROM invoices WHERE number LIKE ? ORDER BY number DESC LIMIT 1").bind(`BD-${year}-%`).first<{ number: string }>();
  const seq = last ? Number(last.number.split("-")[2]) + 1 : 1;
  const inv = { id: id(), lead_id: lead.id, number: `BD-${year}-${String(seq).padStart(3, "0")}`, created_at: now(), amount_cents: cents, currency: "USD", due_date: (b.due_date ?? "").slice(0, 10) || null, status: "draft", link: (b.link ?? "").slice(0, 500), notes: (b.notes ?? "").slice(0, 2000) };
  await env.DB.prepare("INSERT INTO invoices (id, lead_id, number, created_at, amount_cents, currency, due_date, status, link, notes) VALUES (?,?,?,?,?,?,?,?,?,?)")
    .bind(inv.id, inv.lead_id, inv.number, inv.created_at, inv.amount_cents, inv.currency, inv.due_date, inv.status, inv.link, inv.notes).run();
  await addEvent(env.DB, lead.id, "invoice", `Created ${inv.number} for $${(cents / 100).toFixed(2)}`);
  return json({ invoice: inv });
};
