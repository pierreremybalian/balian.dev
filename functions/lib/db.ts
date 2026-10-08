// D1 helpers shared by the public forms (which record leads) and the admin API.
import type { D1Database } from "@cloudflare/workers-types";

export interface DbEnv { DB?: D1Database }

export const STAGES = ["new", "contacted", "call_booked", "questionnaire", "proposal_sent", "agreed", "in_progress", "launched", "care", "lost"] as const;
export type Stage = (typeof STAGES)[number];
export const STAGE_LABEL: Record<Stage, string> = {
  new: "New", contacted: "Contacted", call_booked: "Call booked", questionnaire: "Questionnaire in", proposal_sent: "Proposal sent",
  agreed: "Agreed", in_progress: "In progress", launched: "Launched", care: "On a care plan", lost: "Lost",
};

export const now = () => new Date().toISOString();
export const id = () => crypto.randomUUID();

export interface Lead {
  id: string; created_at: string; updated_at: string; name: string; email: string; company: string; phone: string; website: string;
  kind: string; source: string; stage: Stage; notes: string; prescan_json: string | null;
}

/** Find the lead by email or create it. Fills blank fields from what the new submission knows; never blanks a filled one. */
export async function upsertLead(db: D1Database, data: Partial<Lead> & { email: string }): Promise<Lead> {
  const email = data.email.trim().toLowerCase();
  const existing = await db.prepare("SELECT * FROM leads WHERE email = ?").bind(email).first<Lead>();
  const t = now();
  if (existing) {
    const merged = {
      name: existing.name || data.name || "", company: existing.company || data.company || "", phone: existing.phone || data.phone || "",
      website: existing.website || data.website || "", kind: existing.kind || data.kind || "",
      stage: advance(existing.stage, data.stage), prescan_json: data.prescan_json ?? existing.prescan_json,
    };
    await db.prepare("UPDATE leads SET updated_at=?, name=?, company=?, phone=?, website=?, kind=?, stage=?, prescan_json=? WHERE id=?")
      .bind(t, merged.name, merged.company, merged.phone, merged.website, merged.kind, merged.stage, merged.prescan_json, existing.id).run();
    return { ...existing, ...merged, updated_at: t };
  }
  const lead: Lead = {
    id: id(), created_at: t, updated_at: t, name: data.name ?? "", email, company: data.company ?? "", phone: data.phone ?? "", website: data.website ?? "",
    kind: data.kind ?? "", source: data.source ?? "", stage: data.stage ?? "new", notes: "", prescan_json: data.prescan_json ?? null,
  };
  await db.prepare("INSERT INTO leads (id, created_at, updated_at, name, email, company, phone, website, kind, source, stage, notes, prescan_json) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .bind(lead.id, t, t, lead.name, lead.email, lead.company, lead.phone, lead.website, lead.kind, lead.source, lead.stage, "", lead.prescan_json).run();
  return lead;
}

/** Automatic stage changes only move forward (and never out of a won or lost state). */
function advance(current: Stage, proposed?: Stage): Stage {
  if (!proposed) return current;
  const ci = STAGES.indexOf(current), pi = STAGES.indexOf(proposed);
  if (current === "lost" || ci >= STAGES.indexOf("agreed")) return current;
  return pi > ci ? proposed : current;
}

export async function addSubmission(db: D1Database, leadId: string, type: "contact" | "booking" | "intake", payload: unknown, summary: string) {
  await db.prepare("INSERT INTO submissions (id, lead_id, created_at, type, payload_json, summary_text) VALUES (?,?,?,?,?,?)")
    .bind(id(), leadId, now(), type, JSON.stringify(payload), summary).run();
}

export async function addEvent(db: D1Database, leadId: string, type: string, detail = "") {
  await db.prepare("INSERT INTO events (id, lead_id, created_at, type, detail) VALUES (?,?,?,?,?)").bind(id(), leadId, now(), type, detail).run();
}

export async function setPrescan(db: D1Database, leadId: string, scan: unknown) {
  await db.prepare("UPDATE leads SET prescan_json=?, updated_at=? WHERE id=?").bind(JSON.stringify(scan), now(), leadId).run();
}

/** The forms must keep working if the database is missing or down. */
export async function record(env: DbEnv, fn: (db: D1Database) => Promise<void>) {
  if (!env.DB) return;
  try { await fn(env.DB); } catch (e) { console.error("db:", (e as Error).message); }
}
