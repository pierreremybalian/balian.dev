// Google Calendar access for the booking functions. Server-side only: a refresh token for the Google Workspace account (pierre@balian.dev)
// is exchanged for a short-lived access token. Secrets are Pages project secrets (see README, "Booking").
import type { Range } from "./slots";

export interface GoogleEnv {
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REFRESH_TOKEN?: string;
  BOOKING_AVAILABILITY_CALENDAR_ID?: string; // the calendar whose events are "open" windows
  BOOKING_CALENDAR_ID?: string; // where calls are created and whose busy time is respected ("primary")
}

export const configured = (env: GoogleEnv) =>
  Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REFRESH_TOKEN && env.BOOKING_AVAILABILITY_CALENDAR_ID && env.BOOKING_CALENDAR_ID);

let cached: { token: string; exp: number } | null = null;

export async function accessToken(env: GoogleEnv): Promise<string> {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID!,
      client_secret: env.GOOGLE_CLIENT_SECRET!,
      refresh_token: env.GOOGLE_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });
  const t = (await r.json()) as { access_token?: string; expires_in?: number; error?: string };
  if (!t.access_token) throw new Error("google token: " + (t.error || r.status));
  cached = { token: t.access_token, exp: Date.now() + (t.expires_in ?? 3600) * 1000 };
  return cached.token;
}

const API = "https://www.googleapis.com/calendar/v3";

export async function gcal<T = unknown>(path: string, token: string, init: RequestInit = {}): Promise<{ status: number; body: T }> {
  const r = await fetch(API + path, {
    ...init,
    headers: { authorization: "Bearer " + token, "content-type": "application/json", ...(init.headers || {}) },
  });
  const text = await r.text();
  let body: T;
  try { body = JSON.parse(text) as T; } catch { body = text as unknown as T; }
  return { status: r.status, body };
}

interface EventTime { dateTime?: string; date?: string }
interface EventsList { items?: { status?: string; start?: EventTime; end?: EventTime }[] }

/** Open windows: timed events on the availability calendar in [from, to]. All-day events are ignored. */
export async function availability(env: GoogleEnv, token: string, from: number, to: number): Promise<Range[]> {
  const q = new URLSearchParams({
    singleEvents: "true", orderBy: "startTime", maxResults: "250",
    timeMin: new Date(from).toISOString(), timeMax: new Date(to).toISOString(),
  });
  const { status, body } = await gcal<EventsList>(`/calendars/${encodeURIComponent(env.BOOKING_AVAILABILITY_CALENDAR_ID!)}/events?${q}`, token);
  if (status !== 200) throw new Error("availability: " + status);
  return (body.items ?? [])
    .filter((e) => e.status !== "cancelled" && e.start?.dateTime && e.end?.dateTime)
    .map((e) => ({ start: Date.parse(e.start!.dateTime!), end: Date.parse(e.end!.dateTime!) }));
}

interface FreeBusy { calendars?: Record<string, { busy?: { start: string; end: string }[] }> }

/** Busy ranges on the booking calendar in [from, to]. Existing calls live there, so they are excluded automatically. */
export async function busy(env: GoogleEnv, token: string, from: number, to: number): Promise<Range[]> {
  const id = env.BOOKING_CALENDAR_ID!;
  const { status, body } = await gcal<FreeBusy>("/freeBusy", token, {
    method: "POST",
    body: JSON.stringify({ timeMin: new Date(from).toISOString(), timeMax: new Date(to).toISOString(), items: [{ id }] }),
  });
  if (status !== 200) throw new Error("freebusy: " + status);
  const cal = body.calendars?.[id] ?? Object.values(body.calendars ?? {})[0];
  return (cal?.busy ?? []).map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
}
