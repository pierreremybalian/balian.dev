// GET /api/admin/callback: GitHub sends the code here. Only allow-listed GitHub ids get a session.
import { allowed, cookieHeader, makeSession, type AuthEnv } from "../../lib/session";

const fail = (msg: string, status = 403) => new Response(msg, { status, headers: { "content-type": "text/plain", "cache-control": "no-store" } });

export const onRequestGet = async ({ request, env }: { request: Request; env: AuthEnv }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code"), state = url.searchParams.get("state");
  const cookieState = (request.headers.get("cookie") ?? "").split(/;\s*/).find((c) => c.startsWith("bd_state="))?.slice(9);
  if (!code || !state || state !== cookieState) return fail("Sign-in state did not match. Start again at /admin/login/.");
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET || !env.ADMIN_SESSION_SECRET) return fail("Admin sign-in is not configured.", 503);

  const tr = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST", headers: { accept: "application/json", "content-type": "application/json", "user-agent": "balian.dev admin" },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${url.origin}/api/admin/callback` }),
  });
  const tok = (await tr.json()) as { access_token?: string; error?: string };
  if (!tok.access_token) return fail("GitHub did not issue a token: " + (tok.error ?? tr.status));
  const ur = await fetch("https://api.github.com/user", { headers: { authorization: "Bearer " + tok.access_token, accept: "application/vnd.github+json", "user-agent": "balian.dev admin" } });
  const user = (await ur.json()) as { id?: number; login?: string };
  if (!user.id || !allowed(env, String(user.id))) return fail(`GitHub account ${user.login ?? "?"} is not on the admin list.`);

  const session = await makeSession(env, String(user.id), user.login ?? "");
  return new Response(null, {
    status: 302,
    headers: [["location", `${url.origin}/admin/`], ["set-cookie", cookieHeader(session, 7 * 86_400, request)], ["set-cookie", "bd_state=; Path=/api/admin; Max-Age=0"]],
  });
};
