// One-time Google consent for the booking calendar. Opens the consent screen, receives the code on a loopback
// redirect, and stores the refresh token in the macOS Keychain (service "balian.dev", account "calendar_refresh_token").
// The OAuth client comes from scripts/google-client.mjs. Prints no secrets.
// Run with: node scripts/google-auth.mjs
import http from "node:http";
import { execFileSync } from "node:child_process";
import { googleClient } from "./google-client.mjs";

const { id, secret } = googleClient();

const PORT = 3900, PATH = "/api/connect/oauth/callback", redirect = `http://localhost:${PORT}${PATH}`;
const scope = "https://www.googleapis.com/auth/calendar"; // manage calendars too, so setup can create the availability calendar
const state = Math.random().toString(36).slice(2);
const url = "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
  client_id: id, redirect_uri: redirect, response_type: "code", scope, access_type: "offline", prompt: "consent", state,
  login_hint: "pierre@baliandesign.com",
});

const srv = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  if (u.pathname !== PATH) { res.writeHead(404).end(); return; }
  if (u.searchParams.get("state") !== state || !u.searchParams.get("code")) {
    res.end("Authorization failed or was cancelled: " + (u.searchParams.get("error") || "no code"));
    console.log("FAILED:", u.searchParams.get("error")); process.exit(1);
  }
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code: u.searchParams.get("code"), client_id: id, client_secret: secret, redirect_uri: redirect, grant_type: "authorization_code" }),
  });
  const t = await r.json();
  if (!t.refresh_token) { res.end("No refresh token returned."); console.log("NO REFRESH TOKEN:", t.error, t.error_description); process.exit(1); }
  execFileSync("security", ["add-generic-password", "-U", "-a", "calendar_refresh_token", "-s", "balian.dev", "-w", t.refresh_token]);
  res.end("Done. You can close this tab.");
  console.log("OK: refresh token stored in Keychain. Granted scopes:", t.scope);
  process.exit(0);
});
srv.listen(PORT, () => { console.log("Waiting for consent at", redirect); console.log(url); try { execFileSync("open", [url]); } catch {} });
setTimeout(() => { console.log("TIMEOUT waiting for consent"); process.exit(3); }, 300_000);
