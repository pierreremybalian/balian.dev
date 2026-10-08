// Cloudflare Pages Function: POST /api/book  { start, name, email, company?, site?, phone?, kind?, note?, fax? (honeypot) }
// Re-checks the slot against the availability calendar and busy time, creates the call with a Google Meet link
// and the visitor as a guest (Google emails the invite), then sends Pierre a note through Resend.
import { booking } from "../lib/config";
import { windowsToSlots, subtractBusy, overlaps } from "../lib/slots";
import { accessToken, availability, busy, configured, gcal, type GoogleEnv } from "../lib/google";
import { normalizeUrl } from "../lib/prescan";
import { sendPrescan } from "./contact";

interface Env extends GoogleEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export const onRequestPost = async ({ request, env, waitUntil }: { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "That request could not be read." }, 400);
  }
  // Honeypot: bots fill the hidden field. Pretend success.
  if (clean(body.fax, 200)) return json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const note = clean(body.note, 2000);
  const company = clean(body.company, 120);
  const site = clean(body.site, 200);
  const phone = clean(body.phone, 40);
  const kind = clean(body.kind, 120);
  const details = [company && `Company: ${company}`, site && `Website: ${site}`, phone && `Phone: ${phone}`, kind && `Looking for: ${kind}`].filter(Boolean).join("\n");
  const start = Date.parse(clean(body.start, 40));
  const end = start + booking.durationMin * 60_000;
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !Number.isFinite(start) || start % (booking.stepMin * 60_000) !== 0) {
    return json({ error: "Please add your name, a valid email and pick a time." }, 422);
  }
  if (!configured(env)) return json({ error: "Booking is not connected yet. Please email me instead." }, 503);

  try {
    const token = await accessToken(env);
    const now = Date.now();
    // Is this slot still open? Same rules as /api/slots, computed for just this hour.
    const [windows, taken] = await Promise.all([availability(env, token, start - 3600_000, end + 3600_000), busy(env, token, start, end)]);
    const open = subtractBusy(windowsToSlots(windows, now, booking), taken).some((s) => s.start === start);
    if (!open || taken.some((b) => overlaps(b, { start, end }))) return json({ error: "That time was just taken. Please pick another." }, 409);

    const ev = await gcal<{ id?: string; hangoutLink?: string; htmlLink?: string }>(
      `/calendars/${encodeURIComponent(env.BOOKING_CALENDAR_ID!)}/events?conferenceDataVersion=1&sendUpdates=all`,
      token,
      {
        method: "POST",
        body: JSON.stringify({
          summary: `Call with ${name} · Balian.dev`,
          description: `Booked from balian.dev/contact.\n\nName: ${name}\nEmail: ${email}${details ? `\n${details}` : ""}${note ? `\n\n${note}` : ""}`,
          start: { dateTime: new Date(start).toISOString(), timeZone: booking.timeZone },
          end: { dateTime: new Date(end).toISOString(), timeZone: booking.timeZone },
          attendees: [{ email, displayName: name }],
          conferenceData: { createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } } },
          reminders: { useDefault: true },
        }),
      },
    );
    if (ev.status !== 200) {
      console.error("book: event insert", ev.status, JSON.stringify(ev.body).slice(0, 300));
      return json({ error: "The call could not be booked right now. Please email me instead." }, 502);
    }

    // A note to Pierre. The visitor's invite comes from Google, so a failure here does not fail the booking.
    if (env.RESEND_API_KEY && env.CONTACT_TO && env.CONTACT_FROM) {
      const when = new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short", timeZone: booking.timeZone }).format(start);
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: env.CONTACT_FROM,
          to: [env.CONTACT_TO],
          reply_to: `${name} <${email}>`,
          subject: `Call booked: ${name}${company ? ` (${company})` : ""}, ${when}`,
          text: `${name} booked a 30-minute call.\n\nWhen: ${when} (${booking.timeZone})\nEmail: ${email}${details ? `\n${details}` : ""}\nMeet: ${ev.body.hangoutLink ?? "see calendar"}\nEvent: ${ev.body.htmlLink ?? ""}\n\n${note || "(no note)"}`,
        }),
      }).catch((e) => console.error("book: resend", (e as Error).message));
    }

    const siteUrl = normalizeUrl(site);
    if (siteUrl && env.RESEND_API_KEY && env.CONTACT_TO && env.CONTACT_FROM) waitUntil(sendPrescan(env, siteUrl, `${name}${company ? ` (${company})` : ""}, call booked`));
    return json({ ok: true, start: new Date(start).toISOString(), end: new Date(end).toISOString(), meet: ev.body.hangoutLink ?? null });
  } catch (e) {
    console.error("book:", (e as Error).message);
    return json({ error: "The call could not be booked right now. Please email me instead." }, 502);
  }
};
