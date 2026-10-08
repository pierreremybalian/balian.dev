// Admin sessions: an HMAC-signed cookie carrying the GitHub user id and an expiry. No server-side session store.
export interface AuthEnv {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  ADMIN_SESSION_SECRET?: string;
  ADMIN_GITHUB_IDS?: string; // comma-separated numeric GitHub ids
  ADMIN_DEV_LOGIN?: string; // "1" only in .dev.vars
}

export const COOKIE = "bd_admin";
const DAYS = 7;

const enc = new TextEncoder();
const b64 = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function sign(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

export async function makeSession(env: AuthEnv, githubId: string, login: string): Promise<string> {
  const exp = Date.now() + DAYS * 86_400_000;
  const data = `${githubId}.${exp}.${login}`;
  return `${data}.${await sign(env.ADMIN_SESSION_SECRET!, data)}`;
}

export interface Session { githubId: string; login: string; exp: number }

export async function readSession(env: AuthEnv, request: Request): Promise<Session | null> {
  if (!env.ADMIN_SESSION_SECRET) return null;
  const raw = (request.headers.get("cookie") ?? "").split(/;\s*/).find((c) => c.startsWith(COOKIE + "="))?.slice(COOKIE.length + 1);
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 4) return null;
  const [githubId, expStr, login, sig] = parts;
  const expected = await sign(env.ADMIN_SESSION_SECRET, `${githubId}.${expStr}.${login}`);
  if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return null;
  if (!allowed(env, githubId)) return null;
  return { githubId, login, exp };
}

export const allowed = (env: AuthEnv, githubId: string) => (env.ADMIN_GITHUB_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean).includes(githubId);

function timingSafeEqual(a: string, b: string) {
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export const cookieHeader = (value: string, maxAge: number, request: Request) => {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
};

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...headers } });
