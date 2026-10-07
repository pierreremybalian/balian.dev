// OAuth client id and secret for the Google scripts. Prefers the Keychain (service "balian.dev"), then falls back to
// the ga-gtm-operator project's env file, and copies what it finds into the Keychain for next time. Prints no secrets.
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const kc = (account) => { try { return execFileSync("security", ["find-generic-password", "-s", "balian.dev", "-a", account, "-w"], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch { return ""; } };
const kcSet = (account, value) => execFileSync("security", ["add-generic-password", "-U", "-s", "balian.dev", "-a", account, "-w", value]);

export function googleClient() {
  let id = kc("google_client_id"), secret = kc("google_client_secret");
  if (!id || !secret) {
    const p = "/Users/pierre/Code/ga-gtm-operator/.env.local";
    if (existsSync(p)) {
      const env = Object.fromEntries(readFileSync(p, "utf8").split("\n").filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^["']|["']$/g, "")]));
      id = id || env.AUTH_GOOGLE_ID || ""; secret = secret || env.AUTH_GOOGLE_SECRET || "";
      if (id && secret) { kcSet("google_client_id", id); kcSet("google_client_secret", secret); }
    }
  }
  if (!id || !secret) throw new Error("Google OAuth client id/secret not found in Keychain (service balian.dev) or ga-gtm-operator/.env.local");
  return { id, secret };
}
export const refreshToken = () => kc("calendar_refresh_token");
