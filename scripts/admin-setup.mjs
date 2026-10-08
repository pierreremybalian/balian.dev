// Admin setup. Reads GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET from .dev.vars (paste them there after creating the
// OAuth App at https://github.com/settings/applications/new with callback https://balian.dev/api/admin/callback),
// generates ADMIN_SESSION_SECRET if missing, sets ADMIN_GITHUB_IDS, and pushes all four to the Pages project. Prints no secrets.
//   node scripts/admin-setup.mjs            write/complete .dev.vars
//   node scripts/admin-setup.mjs --secrets  also push to Pages
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";

const p = ".dev.vars";
let txt = existsSync(p) ? readFileSync(p, "utf8") : "";
const get = (k) => txt.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim() ?? "";
const set = (k, v) => { txt = new RegExp(`^${k}=.*$`, "m").test(txt) ? txt.replace(new RegExp(`^${k}=.*$`, "m"), `${k}=${v}`) : txt.replace(/\n?$/, "\n") + `${k}=${v}\n`; };

if (!get("ADMIN_SESSION_SECRET")) set("ADMIN_SESSION_SECRET", randomBytes(32).toString("base64url"));
if (!get("ADMIN_GITHUB_IDS")) set("ADMIN_GITHUB_IDS", "967646");
if (!get("ADMIN_DEV_LOGIN")) set("ADMIN_DEV_LOGIN", "1");
writeFileSync(p, txt);
const missing = ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"].filter((k) => !get(k));
console.log(missing.length ? `.dev.vars needs: ${missing.join(", ")} (from the GitHub OAuth App)` : ".dev.vars has the GitHub client.");

if (process.argv.includes("--secrets")) {
  for (const k of ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "ADMIN_SESSION_SECRET", "ADMIN_GITHUB_IDS"]) {
    const v = get(k); if (!v) { console.log(k, "SKIPPED (empty)"); continue; }
    const r = spawnSync("npx", ["wrangler", "pages", "secret", "put", k, "--project-name", "balian-dev"], { input: v, encoding: "utf8" });
    console.log(k, r.status === 0 ? "set" : "FAILED " + (r.stderr || "").split("\n").slice(-3).join(" "));
  }
  console.log("ADMIN_DEV_LOGIN is never pushed.");
}
