// Booking setup helper. Uses the Keychain refresh token from scripts/google-auth.mjs. Prints no secrets.
//   node scripts/booking-setup.mjs                  create the "Balian.dev availability" calendar if missing, print its id
//   node scripts/booking-setup.mjs --dev-vars       also write the GOOGLE_* / BOOKING_* lines into .dev.vars
//   node scripts/booking-setup.mjs --secrets        also push them to the Pages project with wrangler
//   node scripts/booking-setup.mjs --open 2026-10-09T10:00 2026-10-09T12:00   add an open window (Central time)
//   node scripts/booking-setup.mjs --list           show open windows and existing calls for the next 3 weeks
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { googleClient, refreshToken } from "./google-client.mjs";

const CAL_NAME = "Balian.dev availability";
const TZ = "America/Chicago";
const { id, secret } = googleClient();
const refresh = refreshToken();

const tr = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: id, client_secret: secret, refresh_token: refresh, grant_type: "refresh_token" }),
});
const tok = (await tr.json()).access_token;
if (!tok) { console.log("token refresh failed; run scripts/google-auth.mjs first"); process.exit(1); }
const g = async (path, init = {}) => {
  const r = await fetch("https://www.googleapis.com/calendar/v3" + path, { ...init, headers: { authorization: "Bearer " + tok, "content-type": "application/json" } });
  return { status: r.status, body: await r.json().catch(() => ({})) };
};

// 1. the availability calendar
const list = await g("/users/me/calendarList?minAccessRole=owner");
let cal = (list.body.items ?? []).find((c) => c.summary === CAL_NAME);
if (!cal) {
  const made = await g("/calendars", { method: "POST", body: JSON.stringify({ summary: CAL_NAME, timeZone: TZ, description: "Events here are open windows that visitors can book on balian.dev. Nothing else." }) });
  if (made.status !== 200) { console.log("could not create calendar:", made.status, made.body.error?.message); process.exit(1); }
  cal = made.body;
  console.log("created calendar:", CAL_NAME);
} else console.log("calendar exists:", CAL_NAME);
console.log("BOOKING_AVAILABILITY_CALENDAR_ID =", cal.id);

const args = process.argv.slice(2);
const vars = {
  GOOGLE_CLIENT_ID: id, GOOGLE_CLIENT_SECRET: secret, GOOGLE_REFRESH_TOKEN: refresh,
  BOOKING_AVAILABILITY_CALENDAR_ID: cal.id, BOOKING_CALENDAR_ID: "primary",
};

if (args.includes("--dev-vars")) {
  const p = ".dev.vars";
  let txt = existsSync(p) ? readFileSync(p, "utf8") : "";
  for (const [k, v] of Object.entries(vars)) {
    const line = `${k}=${v}`;
    txt = new RegExp(`^${k}=.*$`, "m").test(txt) ? txt.replace(new RegExp(`^${k}=.*$`, "m"), line) : txt.replace(/\n?$/, "\n") + line + "\n";
  }
  writeFileSync(p, txt);
  console.log("wrote .dev.vars:", Object.keys(vars).join(", "));
}

if (args.includes("--secrets")) {
  for (const [k, v] of Object.entries(vars)) {
    const r = spawnSync("npx", ["wrangler", "pages", "secret", "put", k, "--project-name", "balian-dev"], { input: v, encoding: "utf8" });
    console.log(k, r.status === 0 ? "set" : "FAILED " + (r.stderr || "").split("\n").slice(-3).join(" "));
  }
}

const openAt = args.indexOf("--open");
if (openAt >= 0) {
  const [s, e] = [args[openAt + 1], args[openAt + 2]];
  const made = await g(`/calendars/${encodeURIComponent(cal.id)}/events`, { method: "POST", body: JSON.stringify({ summary: "Open", start: { dateTime: s + ":00", timeZone: TZ }, end: { dateTime: e + ":00", timeZone: TZ } }) });
  console.log("open window:", made.status === 200 ? `${s} to ${e} ${TZ}` : "FAILED " + made.status + " " + made.body.error?.message);
}

if (args.includes("--list")) {
  const q = new URLSearchParams({ singleEvents: "true", orderBy: "startTime", timeMin: new Date().toISOString(), timeMax: new Date(Date.now() + 22 * 86_400_000).toISOString() });
  const fmt = (d) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: TZ }).format(new Date(d));
  const open = await g(`/calendars/${encodeURIComponent(cal.id)}/events?${q}`);
  console.log("\nopen windows:"); for (const e of open.body.items ?? []) console.log(" ", fmt(e.start.dateTime), "to", fmt(e.end.dateTime));
  const calls = await g(`/calendars/primary/events?${q}&q=Balian.dev`);
  console.log("booked calls:"); for (const e of calls.body.items ?? []) console.log(" ", fmt(e.start.dateTime), e.summary, e.hangoutLink ?? "");
}
