// GET /api/admin/login: start GitHub sign-in.
import { json, type AuthEnv } from "../../lib/session";

export const onRequestGet = async ({ request, env }: { request: Request; env: AuthEnv }) => {
  if (!env.GITHUB_CLIENT_ID) return json({ error: "Admin sign-in is not configured." }, 503);
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const auth = "https://github.com/login/oauth/authorize?" + new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID, redirect_uri: `${url.origin}/api/admin/callback`, scope: "read:user", state, allow_signup: "false",
  });
  const secure = url.protocol === "https:" ? "; Secure" : "";
  return new Response(null, { status: 302, headers: { location: auth, "set-cookie": `bd_state=${state}; Path=/api/admin; HttpOnly; SameSite=Lax; Max-Age=600${secure}` } });
};
