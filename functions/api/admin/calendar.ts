// GET /api/admin/calendar?start=ISO&end=ISO
// Events on the booking calendar (real calls, placeholders, everything else) plus the open windows, with each event matched to a lead by attendee email.
import { json } from "../../lib/session";
import { accessToken, availability, configured, gcal, type GoogleEnv } from "../../lib/google";
import type { DbEnv } from "../../lib/db";

interface Env extends GoogleEnv, DbEnv {}
interface GEvent { id: string; summary?: string; description?: string; start?: { dateTime?: string; date?: string }; end?: { dateTime?: string; date?: string }; attendees?: { email: string; displayName?: string; responseStatus?: string }[]; hangoutLink?: string; htmlLink?: string; status?: string; transparency?: string }

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  if (!configured(env)) return json({ error: "Booking is not connected." }, 503);
  const u = new URL(request.url);
  const start = Date.parse(u.searchParams.get("start") ?? ""), end = Date.parse(u.searchParams.get("end") ?? "");
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || end - start > 45 * 86_400_000) return json({ error: "Give a start and end within 45 days." }, 422);
  try {
    const token = await accessToken(env);
    const q = new URLSearchParams({ singleEvents: "true", orderBy: "startTime", maxResults: "500", timeMin: new Date(start).toISOString(), timeMax: new Date(end).toISOString() });
    const [ev, windows] = await Promise.all([
      gcal<{ items?: GEvent[] }>(`/calendars/${encodeURIComponent(env.BOOKING_CALENDAR_ID!)}/events?${q}`, token),
      availability(env, token, start, end),
    ]);
    if (ev.status !== 200) return json({ error: "Calendar refused: " + ev.status }, 502);
    const items = (ev.body.items ?? []).filter((e) => e.status !== "cancelled");
    // match attendees to leads
    const emails = [...new Set(items.flatMap((e) => (e.attendees ?? []).map((a) => a.email.toLowerCase())))];
    const leads = new Map<string, { id: string; name: string; email: string; company: string; stage: string; website: string }>();
    if (env.DB && emails.length) {
      const rows = await env.DB.prepare(`SELECT id, name, email, company, stage, website FROM leads WHERE email IN (${emails.map(() => "?").join(",")})`).bind(...emails).all<{ id: string; name: string; email: string; company: string; stage: string; website: string }>();
      for (const r of rows.results ?? []) leads.set(r.email, r);
    }
    const events = items.map((e) => {
      const attendees = (e.attendees ?? []).map((a) => ({ email: a.email, name: a.displayName ?? "", status: a.responseStatus ?? "" }));
      const lead = attendees.map((a) => leads.get(a.email.toLowerCase())).find(Boolean) ?? null;
      const placeholder = /placeholder added from balian\.dev/i.test(e.description ?? "");
      const kind = lead || /· Balian\.dev$/.test(e.summary ?? "") ? "call" : placeholder ? "placeholder" : "busy";
      return {
        id: e.id, summary: e.summary ?? "(no title)", description: e.description ?? "", allDay: !e.start?.dateTime,
        start: e.start?.dateTime ?? e.start?.date, end: e.end?.dateTime ?? e.end?.date, meet: e.hangoutLink ?? null, link: e.htmlLink ?? null, attendees, kind, lead,
      };
    });
    return json({ tz: "America/Chicago", events, windows: windows.map((w) => ({ start: new Date(w.start).toISOString(), end: new Date(w.end).toISOString() })) });
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
};
