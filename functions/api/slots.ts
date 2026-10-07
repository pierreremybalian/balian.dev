// Cloudflare Pages Function: GET /api/slots
// Open 30-minute slots for the next few weeks: windows from the availability calendar, minus anything busy.
import { booking } from "../lib/config";
import { windowsToSlots, subtractBusy } from "../lib/slots";
import { accessToken, availability, busy, configured, type GoogleEnv } from "../lib/google";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export const onRequestGet = async ({ env }: { env: GoogleEnv }) => {
  if (!configured(env)) return json({ error: "Booking is not connected yet." }, 503);
  try {
    const now = Date.now();
    const from = now;
    const to = now + (booking.horizonDays + 1) * 86_400_000;
    const token = await accessToken(env);
    const [windows, taken] = await Promise.all([availability(env, token, from, to), busy(env, token, from, to)]);
    const slots = subtractBusy(windowsToSlots(windows, now, booking), taken).slice(0, booking.maxSlots);
    return json({
      tz: booking.timeZone,
      duration: booking.durationMin,
      slots: slots.map((s) => ({ start: new Date(s.start).toISOString(), end: new Date(s.end).toISOString() })),
    });
  } catch (e) {
    console.error("slots:", (e as Error).message);
    return json({ error: "Open slots could not be loaded right now." }, 502);
  }
};
